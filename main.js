const preloader = document.getElementById('preloader');
const crypticText = document.getElementById('cryptic-text');
const mainContainer = document.querySelector('.container');
const mainFooter = document.querySelector('.site-footer');
const outputElement = document.getElementById("output");

// --- Scramble Settings ---
const scrambleCharSet = "A?B<C#D%E&F(G)H*I+J,K-L.N/O!P:Q;R=S>T@U[V]W^X_Y`Z{a|b}c~d";
const scrambleSpeed = 100;
const scrambleIterations = 2;

// --- Targeted Decryption Settings ---
const TARGET_MESSAGE = ">> CLICK TO CONTINUE";
const SCRAMBLE_DURATION = 2000; // Time (ms) the initial random scramble runs
const REVEAL_INTERVAL = 250; // Delay (ms) between revealing each content block

// --- Utility Functions ---

function generateRandomString(length) {
    const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234456789!@#$%^&*()_+-=[]{}|;:,.<>/?~";
    let result = '';
    for (let i = 0; i < length; i++) {
        result += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    return result;
}

// Function to handle the actual scrambling animation
function scrambleText(element, targetText, onComplete) {

    // Prevent scrambling if another animation is already running
    if (element.dataset.scrambling === 'true') {
        if (onComplete) onComplete();
        return;
    }
    element.dataset.scrambling = 'true';

    // Use provided text (for preloader) or stored original text (for hover/reveal)
    const originalText = targetText || element.dataset.originalText;
    const len = originalText.length;
    let iterations = 0;

    let interval = setInterval(() => {
        let newText = '';
        let allRevealed = true;
        for (let i = 0; i < len; i++) {

            let charIterations = Math.max(0, iterations - i);
            if (charIterations < scrambleIterations) {
                allRevealed = false;

                if (originalText[i] === ' ') {
                    newText += ' ';
                } else {
                    newText += scrambleCharSet.charAt(Math.floor(Math.random() * scrambleCharSet.length));
                }
            } else {
                newText += originalText[i];
            }
        }
        element.innerHTML = newText;

        if (allRevealed) {
            clearInterval(interval);
            element.innerHTML = originalText;
            element.dataset.scrambling = 'false';
            if (onComplete) onComplete();
        }
        iterations++;
    }, scrambleSpeed);
}

// --- Main Click Handler Logic ---
function handlePreloaderClick() {

    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';

    preloader.addEventListener('transitionend', () => {

        preloader.remove();

        mainContainer.style.opacity = '1';
        mainFooter.style.opacity = '1';
        outputElement.style.display = 'block';

        const allItems = document.querySelectorAll('.scramble-item');
        let delay = 0;

        // Process each content block sequentially
        allItems.forEach((item) => {

            setTimeout(() => {
                
                item.classList.add('visible'); // Initiate CSS transition

                const textElements = item.querySelectorAll('.scramble-text');

                textElements.forEach((textEl) => {

                    // Store original text
                    if (!textEl.dataset.originalText) {
                        textEl.dataset.originalText = textEl.textContent;
                    }

                    // 1. Initial Scramble on Reveal
                    scrambleText(textEl, null); 

                    // 2. Conditional Hover Listener
                    // Attach hover only if the element does NOT have the 'no-hover-scramble' class
                    if (!textEl.classList.contains('no-hover-scramble')) {
                        textEl.addEventListener('mouseenter', function() {
                            scrambleText(this, null); 
                        });
                    }
                });

            }, delay);

            delay += REVEAL_INTERVAL;
        });


    }, { once: true });
}


// --- Initialization ---

const initialIntervalSpeed = 130;

// 1. Start the continuous random scramble
let animationInterval = setInterval(() => {
    let randomLength = Math.floor(Math.random() * 20) + 15;
    crypticText.textContent = generateRandomString(randomLength);
}, initialIntervalSpeed);

// 2. Stop the scramble and start decryption after SCRAMBLE_DURATION
setTimeout(() => {
    clearInterval(animationInterval);
    crypticText.style.cursor = 'default';

    scrambleText(crypticText, TARGET_MESSAGE, () => {
        // Once decryption is complete, set cursor and add the final event listener
        crypticText.style.cursor = 'pointer';
        preloader.addEventListener('click', handlePreloaderClick, { once: true });
    });

}, SCRAMBLE_DURATION);