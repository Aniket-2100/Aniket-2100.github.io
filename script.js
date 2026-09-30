// 1. Neural Constellation System (Professional AI/Space Background)
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

// Create particle class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    
    // Draw the dot
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    
    // Move the dot
    update() {
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Initialize array with particles
function initParticles() {
    particlesArray = [];
    // Calculate number of particles based on screen size (keeps it clean, not crowded)
    let numberOfParticles = (canvas.height * canvas.width) / 12000;
    
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 0.5; // Very small, subtle dots
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        
        // Very slow movement
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        
        let color = 'rgba(255, 255, 255, 0.3)'; // Faint white
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect dots with lines if they are close enough
function connectNodes() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            // Calculate distance between two particles
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                         + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            // If distance is less than a certain threshold, draw a line
            if (distance < 15000) {
                // Opacity fades as they get further apart
                opacityValue = 1 - (distance / 15000);
                ctx.strokeStyle = 'rgba(255, 255, 255,' + (opacityValue * 0.15) + ')'; // Very subtle lines
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connectNodes();
}

// Handle window resize
window.addEventListener('resize', function() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    initParticles();
});

// Start the background
initParticles();
animateParticles();

// 2. Cursor Glow Effect (The soft spotlight following your mouse)
const cursorGlow = document.getElementById('cursor-glow');
document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
});

// 3. Scroll Reveal (Fades elements in as you scroll down)
const revealElements = document.querySelectorAll('.reveal');
const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
};
const scrollObserver = new IntersectionObserver(revealCallback, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });
revealElements.forEach(el => scrollObserver.observe(el));

// 4. Smooth Navigation Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
    });
});

// 5. 3D Tilt Effect for Project Cards
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -6; // Softened the tilt slightly for a more premium feel
        const rotateY = ((x - centerX) / centerX) * 6;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
    
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
    });
});