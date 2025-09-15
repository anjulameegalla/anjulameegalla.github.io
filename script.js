document.addEventListener('DOMContentLoaded', () => {
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
});