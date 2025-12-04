#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>

// --- Credentials ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// --- MQTT ---
const char* mqtt_server = "broker.hivemq.com";
WiFiClient espClient;
PubSubClient client(espClient);

// --- Topics ---
#define LED_SET_TOPIC "anjula/project/led/set"
#define RELAY_SET_TOPIC "anjula/project/relay/set" // --- NEW ---
#define DHT_SET_TOPIC "anjula/project/dht/set"
#define GAS_SET_TOPIC "anjula/project/gas/set"
#define PIR_SET_TOPIC "anjula/project/pir/set"

// --- Pins ---
#define DHTPIN 4
#define MQ_PIN 34
#define PIR_PIN 23
#define LED_PIN 25
#define RELAY_PIN 26 // --- NEW ---

#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// --- Flags ---
bool isDhtEnabled = true;
bool isGasEnabled = true;
bool isPirEnabled = true;

// --- Vars ---
float global_humidity = 0;
float global_temperature = 0;
float global_gasPPM = 0;
int   lastPirState = LOW;
unsigned long previousSensorRead = 0;
const long sensorInterval = 5000;

// --- Calibration Vars ---
float Ro = 10.0;
int RL = 5;
float RS_RO_CleanAir_Factor = 9.83;

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) message += (char)payload[i];
  Serial.print("Msg ["); Serial.print(topic); Serial.print("]: "); Serial.println(message);

  if (String(topic) == LED_SET_TOPIC) {
    digitalWrite(LED_PIN, (message == "ON") ? HIGH : LOW);
  } 
  // --- NEW RELAY LOGIC ---
  else if (String(topic) == RELAY_SET_TOPIC) {
    // Most Relay Modules are ACTIVE LOW (LOW = ON, HIGH = OFF)
    // If your relay works opposite, swap HIGH and LOW below
    if (message == "ON") {
      digitalWrite(RELAY_PIN, LOW); // Turn Relay ON
      Serial.println("Relay ON");
    } else {
      digitalWrite(RELAY_PIN, HIGH); // Turn Relay OFF
      Serial.println("Relay OFF");
    }
  }
  // -----------------------
  else if (String(topic) == DHT_SET_TOPIC) { isDhtEnabled = (message == "ON"); }
  else if (String(topic) == GAS_SET_TOPIC) { isGasEnabled = (message == "ON"); }
  else if (String(topic) == PIR_SET_TOPIC) { isPirEnabled = (message == "ON"); }
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting MQTT...");
    String clientId = "ESP32-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.subscribe(LED_SET_TOPIC);
      client.subscribe(RELAY_SET_TOPIC); // --- NEW ---
      client.subscribe(DHT_SET_TOPIC);
      client.subscribe(GAS_SET_TOPIC);
      client.subscribe(PIR_SET_TOPIC);
    } else {
      delay(5000);
    }
  }
}

// ... (Keep calibrateMQ2 and getPPM functions here exactly as before) ...
void calibrateMQ2() {
  float val = 0;
  for(int i=0; i<50; i++) { val += analogRead(MQ_PIN); delay(10); }
  val = val/50;
  if (val == 0) val = 1;
  float volt = val * (3.3 / 4095.0);
  float RS_air = ((3.3 * RL) / volt) - RL;
  Ro = RS_air / RS_RO_CleanAir_Factor;
}

float getPPM() {
  int adc = analogRead(MQ_PIN);
  float volt = adc * (3.3 / 4095.0);
  if(volt == 0) return 0;
  float RS = ((3.3 * RL) / volt) - RL;
  float ratio = RS / Ro;
  return 3000 * pow(ratio, -2.05);
}

void setup() {
  Serial.begin(115200);
  pinMode(MQ_PIN, INPUT);
  pinMode(PIR_PIN, INPUT);
  pinMode(LED_PIN, OUTPUT);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Start with Relay OFF (Active LOW)
  
  dht.begin();
  calibrateMQ2();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  unsigned long currentMillis = millis();
  if (currentMillis - previousSensorRead >= sensorInterval) {
    previousSensorRead = currentMillis;

    if (isDhtEnabled) {
      global_humidity = dht.readHumidity();
      global_temperature = dht.readTemperature();
      if (!isnan(global_humidity)) {
        client.publish("anjula/project/temperature", String(global_temperature).c_str(), true);
        client.publish("anjula/project/humidity", String(global_humidity).c_str(), true);
      }
    }
    
    if (isGasEnabled) {
      global_gasPPM = getPPM();
      client.publish("anjula/project/gas", String(global_gasPPM).c_str(), true);
    }
  }

  if (isPirEnabled) {
    int currentPirState = digitalRead(PIR_PIN);
    if (currentPirState == HIGH && lastPirState == LOW) {
      client.publish("anjula/project/motion", "DETECTED", true);
    }
    lastPirState = currentPirState;
  }
}