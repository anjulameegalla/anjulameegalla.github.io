from flask import Flask, jsonify, render_template, request
import paho.mqtt.client as mqtt
import threading
import sqlite3
from datetime import datetime
import time

# --- Flask App ---
app = Flask(__name__)

# --- Database ---
DB_NAME = "sensor_data.db"

def init_db():
    conn = sqlite3.connect(DB_NAME, check_same_thread=False)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME,
            topic TEXT,
            value TEXT
        )
    ''')
    conn.commit()
    conn.close()
    print(f"Database '{DB_NAME}' initialized.")

# --- MQTT ---
MQTT_BROKER = "broker.hivemq.com"
MQTT_PORT = 1883
TOPICS = [
    "anjula/project/temperature",
    "anjula/project/humidity",
    "anjula/project/gas",
    "anjula/project/motion"
]

# --- Command Topics ---
LED_COMMAND_TOPIC = "anjula/project/led/set"
RELAY_COMMAND_TOPIC = "anjula/project/relay/set" # --- NEW ---
DHT_COMMAND_TOPIC = "anjula/project/dht/set"
GAS_COMMAND_TOPIC = "anjula/project/gas/set"
PIR_COMMAND_TOPIC = "anjula/project/pir/set"

sensor_data = {
    "temperature": "Waiting...",
    "humidity": "Waiting...",
    "gas": "Waiting...",
    "motion": "Waiting..."
}

SENSOR_MAP = {
    'temperature': {'topic': 'anjula/project/temperature', 'unit': '°C'},
    'humidity': {'topic': 'anjula/project/humidity', 'unit': '%'},
    'gas': {'topic': 'anjula/project/gas', 'unit': 'PPM'}
}

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)

def log_to_db(topic, payload):
    try:
        conn = sqlite3.connect(DB_NAME, check_same_thread=False)
        c = conn.cursor()
        timestamp = datetime.now()
        c.execute("INSERT INTO readings (timestamp, topic, value) VALUES (?, ?, ?)",
                  (timestamp, topic, payload))
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print(f"Failed to log to database: {e}")

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker!")
        for topic in TOPICS:
            client.subscribe(topic)
    else:
        print(f"Failed to connect, return code {rc}\n")

def on_message(client, userdata, msg):
    topic = msg.topic
    payload = msg.payload.decode()
    print(f"Received: {topic} = {payload}")
    
    if topic == "anjula/project/temperature": sensor_data["temperature"] = payload
    elif topic == "anjula/project/humidity": sensor_data["humidity"] = payload
    elif topic == "anjula/project/gas": sensor_data["gas"] = payload
    elif topic == "anjula/project/motion": sensor_data["motion"] = payload
    
    log_to_db(topic, payload)

def mqtt_listener():
    client.on_connect = on_connect
    client.on_message = on_message
    while True:
        try:
            client.connect(MQTT_BROKER, MQTT_PORT, 60)
            client.loop_forever()
        except Exception as e:
            print(f"MQTT connection failed: {e}. Retrying in 5s...")
            time.sleep(5)

# --- Flask Routes ---
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/history')
def history():
    return render_template('history.html')

@app.route('/data')
def get_data():
    return jsonify(sensor_data)

@app.route('/api/history/<string:sensor_name>')
def get_history(sensor_name):
    config = SENSOR_MAP.get(sensor_name)
    if not config: return jsonify({"error": "Invalid sensor"}), 404
    
    conn = sqlite3.connect(DB_NAME, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT timestamp, value FROM readings WHERE topic = ? ORDER BY timestamp DESC LIMIT 100", (config['topic'],))
    rows = c.fetchall()
    rows.reverse()
    conn.close()
    
    labels = [row['timestamp'] for row in rows]
    data = [float(row['value']) for row in rows]
    return jsonify({'labels': labels, 'data': data, 'y_label': config['unit']})

@app.route('/control/led', methods=['POST'])
def control_led():
    data = request.json
    state = data.get('state')
    client.publish(LED_COMMAND_TOPIC, state)
    return jsonify({"success": True})

# --- NEW: RELAY CONTROL API ---
@app.route('/control/relay', methods=['POST'])
def control_relay():
    data = request.json
    state = data.get('state')
    client.publish(RELAY_COMMAND_TOPIC, state)
    print(f"Relay Command: {state}")
    return jsonify({"success": True})
# ------------------------------

@app.route('/control/sensor', methods=['POST'])
def control_sensor():
    data = request.json
    sensor = data.get('sensor')
    state = data.get('state')
    
    topic = None
    if sensor == "dht": topic = DHT_COMMAND_TOPIC
    elif sensor == "gas": topic = GAS_COMMAND_TOPIC
    elif sensor == "pir": topic = PIR_COMMAND_TOPIC
    
    if topic:
        client.publish(topic, state)
        return jsonify({"success": True})
    return jsonify({"error": "Invalid sensor"}), 400

if __name__ == '__main__':
    init_db()
    mqtt_thread = threading.Thread(target=mqtt_listener, daemon=True)
    mqtt_thread.start()
    app.run(host="0.0.0.0", port=5000)