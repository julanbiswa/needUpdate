// Wait for the window to load before running the script
window.onload = function() {

    const canvas = document.getElementById('particle-canvas');
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not get canvas context!');
        return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // --- Animation Settings ---
    const particleCount = 150;
    const particleColor = 'rgba(76, 175, 80, 0.8)';  /* More visible green particles */
    const lineColor = 'rgba(76, 175, 80, 0.3)'; /* More visible green lines */
    const maxDistance = 150;
    const mouseRadius = 200; // Radius for mouse interaction
    let mouse = {
        x: null,
        y: null
    };
    // ----------------------------------------------------

    let particles = [];

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;  // Slightly larger particles
            this.speedX = (Math.random() * 2) - 1;  // Faster movement
            this.speedY = (Math.random() * 2) - 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = particleColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Create all particles
    function init() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Connect particles with lines
    function connect() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                let distance = Math.sqrt(
                    (particles[a].x - particles[b].x) ** 2 +
                    (particles[a].y - particles[b].y) ** 2
                );

                if (distance < maxDistance) {
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            // Add mouse interaction
            if (mouse.x && mouse.y) {
                let dx = mouse.x - particles[i].x;
                let dy = mouse.y - particles[i].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouseRadius) {
                    particles[i].x += dx * 0.01;
                    particles[i].y += dy * 0.01;
                }
            }
        }
        connect();
        requestAnimationFrame(animate);
    }

    // Track mouse position
    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    
    canvas.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Handle window resizing
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init(); 
    });

    init();
    animate();
};