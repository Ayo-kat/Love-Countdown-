// static/js/script.js

// ---- Floating Hearts ----
function createHearts() {
    const container = document.getElementById('hearts-container');
    const symbols = ['❤️', '💕', '💖', '✨', '🌸'];
    for (let i = 0; i < 25; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 1.8 + 1) + 'rem';
        heart.style.animationDuration = (Math.random() * 12 + 8) + 's';
        heart.style.animationDelay = (Math.random() * 10) + 's';
        container.appendChild(heart);
    }
}
createHearts();

// ---- Timer Update (real-time) ----
function updateTimer() {
    fetch('/api/timer')
        .then(res => res.json())
        .then(data => {
            const dur = data.duration;
            const ann = data.anniversary;

            // Relationship timer
            document.getElementById('years').textContent = dur.years;
            document.getElementById('months').textContent = dur.months;
            document.getElementById('days').textContent = dur.days;

            // Seconds since start for hours/minutes/seconds
            let totalSec = dur.total_seconds;
            const hours = Math.floor(totalSec / 3600) % 24;
            const minutes = Math.floor(totalSec / 60) % 60;
            const seconds = totalSec % 60;
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

            // Anniversary countdown
            let annSec = ann.seconds;
            if (annSec < 0) annSec = 0;
            const annDays = Math.floor(annSec / 86400);
            const annHours = Math.floor((annSec % 86400) / 3600);
            const annMinutes = Math.floor((annSec % 3600) / 60);
            const annSeconds = Math.floor(annSec % 60);
            document.getElementById('ann-days').textContent = annDays;
            document.getElementById('ann-hours').textContent = String(annHours).padStart(2, '0');
            document.getElementById('ann-minutes').textContent = String(annMinutes).padStart(2, '0');
            document.getElementById('ann-seconds').textContent = String(annSeconds).padStart(2, '0');

            // If anniversary, show message (already in template, but we could toggle)
        })
        .catch(err => console.warn('Timer fetch error:', err));
}

// Update every second
updateTimer();
setInterval(updateTimer, 1000);

// ---- Lightbox Gallery ----
const galleryItems = document.querySelectorAll('.gallery-item img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeLightbox = document.querySelector('.close-lightbox');

galleryItems.forEach(img => {
    img.addEventListener('click', function(e) {
        lightboxImg.src = this.src;
        lightbox.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
});

closeLightbox.addEventListener('click', function() {
    lightbox.classList.remove('show');
    document.body.style.overflow = 'auto';
});

lightbox.addEventListener('click', function(e) {
    if (e.target === this) {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// ---- Smooth Scroll for navigation ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- Sparkle effect on hover (optional) ----
// Can be added for buttons/cards
