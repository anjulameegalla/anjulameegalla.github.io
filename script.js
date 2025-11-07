document.addEventListener('DOMContentLoaded', () => {
    
    const pageLoadMusic = document.getElementById('page-load-music');
    let hasPageLoadMusicPlayed = false;

    if (pageLoadMusic) {
        pageLoadMusic.volume = 1;
        document.addEventListener('click', () => {
            if (!hasPageLoadMusicPlayed) {
                pageLoadMusic.play().then(() => {
                    hasPageLoadMusicPlayed = true;
                    console.log('Page load music started playing.');
                }).catch(error => {
                    console.error('Page load music autoplay prevented:', error);
                });
            }
        }, { once: true });
    }    
    
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
        body.classList.add('light-mode');
        if (themeToggle) {
            themeToggle.querySelector('i').classList.remove('fa-moon');
            themeToggle.querySelector('i').classList.add('fa-sun');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            if (body.classList.contains('light-mode')) {
                themeToggle.querySelector('i').classList.remove('fa-moon');
                themeToggle.querySelector('i').classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                themeToggle.querySelector('i').classList.remove('fa-sun');
                themeToggle.querySelector('i').classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    const projectCategories = document.querySelectorAll('.project-category');

    projectCategories.forEach(category => {
        const header = category.querySelector('.category-header');
        header.addEventListener('click', () => {
            category.classList.toggle('open');
        });
    });

    const stickyImageContainer = document.querySelector('.sticky-image-container');
    let isDragging = false;

    const backgroundMusic = document.getElementById('background-music');
    
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5;
    }

    if (stickyImageContainer && backgroundMusic) {
        stickyImageContainer.addEventListener('mousedown', (e) => {
            if (backgroundMusic.paused) {
                backgroundMusic.play().catch(error => {
                    console.error('Autoplay prevented:', error);
                });
            } else {
                backgroundMusic.pause();
            }

            isDragging = true;
            let startX = e.clientX - stickyImageContainer.getBoundingClientRect().left;
            let startY = e.clientY - stickyImageContainer.getBoundingClientRect().top;

            stickyImageContainer.style.animation = 'none';

            const onMouseMove = (e) => {
                if (isDragging) {
                    let newX = e.clientX - startX;
                    let newY = e.clientY - startY;
                    stickyImageContainer.style.left = newX + 'px';
                    stickyImageContainer.style.top = newY + 'px';
                    stickyImageContainer.style.right = 'auto';
                    stickyImageContainer.style.bottom = 'auto';
                }
            };

            const onMouseUp = () => {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                stickyImageContainer.style.animation = '';
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // --- NEW CODE ---
    // Initialize the sakura petal animation
    createSakuraPetals();
});


// --- NEW FUNCTION ---
/**
 * Creates and animates sakura petals falling in the background.
 */
function createSakuraPetals() {
    const container = document.getElementById('sakura-container');
    if (!container) return;

    const numPetals = 30; // Adjust the number of petals here

    for (let i = 0; i < numPetals; i++) {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        // Random horizontal start position
        petal.style.left = Math.random() * 100 + 'vw';
        
        // Random fall duration (7 to 15 seconds)
        const fallDuration = (Math.random() * 8) + 7;
        
        // Random sway duration (2 to 5 seconds)
        const swayDuration = (Math.random() * 3) + 2;
        
        // Random animation delay (0 to 10 seconds)
        const delay = Math.random() * 10;

        // Apply all the random values
        petal.style.animation = 
            `fall ${fallDuration}s linear ${delay}s infinite, ` +
            `sway ${swayDuration}s ease-in-out ${delay}s infinite`;
        
        // Random opacity (0.4 to 0.9)
        petal.style.opacity = Math.random() * 0.5 + 0.4;

        container.appendChild(petal);
    }
}