document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or system preference
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

    // Project category dropdown functionality
    const projectCategories = document.querySelectorAll('.project-category');

    projectCategories.forEach(category => {
        const header = category.querySelector('.category-header');
        header.addEventListener('click', () => {
            category.classList.toggle('open');
        });
    });

    // Sticky image dragging functionality
    const stickyImageContainer = document.querySelector('.sticky-image-container');
    let isDragging = false;

    if (stickyImageContainer) {
        stickyImageContainer.addEventListener('mousedown', (e) => {
            isDragging = true;
            // Get the initial mouse position relative to the element
            let startX = e.clientX - stickyImageContainer.getBoundingClientRect().left;
            let startY = e.clientY - stickyImageContainer.getBoundingClientRect().top;

            // Stop the bouncing animation while dragging
            stickyImageContainer.style.animation = 'none';

            const onMouseMove = (e) => {
                if (isDragging) {
                    // Calculate new position
                    let newX = e.clientX - startX;
                    let newY = e.clientY - startY;

                    // Set the new position
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

                // Resume the bouncing animation when dragging stops
                stickyImageContainer.style.animation = ''; // Resets the animation property
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }
});