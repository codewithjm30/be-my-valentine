// --- CONFIG & STATE ---
const canvas = document.getElementById('scene');
const ctx = canvas.getContext('2d');
const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const PARTICLE_COUNT = 3500;
const HEART_SIZE = 16;

let width, height;
let particles = [];
let isCelebrated = false;
let time = 0;
let yesScale = 1;

// "No" button phrases
const phrases = [
    "No", "Are you sure?", "Really?", "Sure naka...",
    "Final na?", "Don't break my heart :(", "Pls?", "Pretty pls???",
    "Still no?", "Baka naman???"
];
let phraseIndex = 0;

// --- SETUP ---
// Improved initialization to prevent loading issues
let appInitialized = false;

function initializeApp() {
    if (appInitialized) return; // Prevent double initialization
    appInitialized = true;
    
    try {
        console.log('Initializing Valentine app...');
        
        resize();
        initParticles();
        animate();
        
        // Give the 3D heart time to render before hiding loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.remove();
                    }
                }, 500);
            }
            document.body.classList.add('loaded');
            console.log('Valentine app ready!');
        }, 2000); // 2 second delay to ensure 3D heart loads properly
        
    } catch (error) {
        console.error('Failed to initialize:', error);
        // Fallback: hide loading screen anyway
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }
}

// Multiple initialization triggers to ensure it works
document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('load', initializeApp);

// Fallback initialization after 3 seconds
setTimeout(initializeApp, 3000);

window.addEventListener('resize', resize);
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

// --- INTERACTION LOGIC ---

// 1. "No" Button Dodging
const moveNoButton = () => {
    if (isCelebrated) return;

    // Make "Yes" grow
    yesScale += 0.15;
    yesBtn.style.transform = `scale(${yesScale})`;

    // Change text
    phraseIndex = (phraseIndex + 1) % phrases.length;
    noBtn.innerText = phrases[phraseIndex];

    // Random Position Calculation
    // We calculate position relative to the window to ensure it stays on screen
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;

    // Random coords within 80% of screen to avoid edges
    const maxX = window.innerWidth * 0.8;
    const maxY = window.innerHeight * 0.8;
    const randomX = Math.random() * maxX - (maxX / 2);
    const randomY = Math.random() * maxY - (maxY / 2);

    // We use Fixed position logic via translate for smoother performance
    // But since the button is in a relative flex container, we set position to absolute
    // relative to the nearest positioned ancestor (btn-group) or just use transform

    // Quick hack: Move it out of the flow slightly
    noBtn.style.position = 'fixed';
    noBtn.style.left = '50%';
    noBtn.style.top = '50%';
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

    // Visual Style update to make it look "weaker"
    noBtn.style.opacity = Math.max(0.5, 1 - (phraseIndex * 0.1));
};

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('click', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent click
    moveNoButton();
});

// 2. "Yes" Celebration
window.acceptProposal = function () {
    if (isCelebrated) return;
    isCelebrated = true;

    // Hide UI smoothly
    document.getElementById('mainUI').style.transition = 'opacity 1s';
    document.getElementById('mainUI').style.opacity = '0';
    document.getElementById('mainUI').style.pointerEvents = 'none';

    // Show Success Layer
    const layer = document.getElementById('successScreen');
    layer.style.opacity = '1';
    layer.style.pointerEvents = 'auto'; // Enable clicking on the success screen
    layer.querySelector('h2').style.transform = 'scale(1)';

    // Trigger CSS Heart Rain and Flower Rain
    createHeartRain();
    createFlowerRain();
    createHeartBubbles();

    // Change Physics
    particles.forEach(p => {
        p.friction = 0.96;
        p.vx = (Math.random() - 0.5) * 15;
        p.vy = (Math.random() - 0.5) * 15;
        p.vz = (Math.random() - 0.5) * 15;
    });
};

function createHeartRain() {
    const container = document.body;
    const heartChars = ['❤️', '💖', '💕', '💗'];

    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart-rain');
        heart.innerText = heartChars[Math.floor(Math.random() * heartChars.length)];

        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 2 + 3) + 's';

        container.appendChild(heart);

        setTimeout(() => { heart.remove(); }, 5000);
    }, 100);
}

function createFlowerRain() {
    const container = document.body;
    const flowerChars = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '💐', '🏵️'];

    setInterval(() => {
        const flower = document.createElement('div');
        flower.classList.add('flower-rain');
        flower.innerText = flowerChars[Math.floor(Math.random() * flowerChars.length)];

        flower.style.left = Math.random() * 100 + 'vw';
        flower.style.fontSize = (Math.random() * 25 + 15) + 'px';
        flower.style.animationDuration = (Math.random() * 3 + 4) + 's';
        flower.style.animationDelay = Math.random() * 2 + 's';

        container.appendChild(flower);

        setTimeout(() => { flower.remove(); }, 7000);
    }, 150);
}

function createHeartBubbles() {
    const container = document.body;

    setInterval(() => {
        const heartBubble = document.createElement('div');
        heartBubble.classList.add('heart-bubble');
        heartBubble.innerText = '❤️';

        // Random position anywhere on screen
        heartBubble.style.left = Math.random() * 100 + 'vw';
        heartBubble.style.top = Math.random() * 100 + 'vh';
        
        // Random size (not too big, not too small)
        heartBubble.style.fontSize = (Math.random() * 15 + 20) + 'px';
        
        // Random animation duration
        heartBubble.style.animationDuration = (Math.random() * 2 + 3) + 's';
        heartBubble.style.animationDelay = Math.random() * 1 + 's';

        container.appendChild(heartBubble);

        // Remove after animation completes
        setTimeout(() => { heartBubble.remove(); }, 6000);
    }, 200); // Create new bubble every 200ms
}

// --- 3D PARTICLE SYSTEM (HEART GEOMETRY) ---
class Particle {
    constructor() {
        this.setHeartPos();
        this.x = this.tx; this.y = this.ty; this.z = this.tz;
        this.vx = 0; this.vy = 0; this.vz = 0;
        this.size = Math.random() * 2;
        this.friction = 0.92;
        this.color = `hsl(${340 + Math.random() * 40}, 100%, ${50 + Math.random() * 30}%)`;
    }

    setHeartPos() {
        // Parametric Heart Equation
        let t = Math.random() * Math.PI * 2;
        // Distribute points more evenly
        let u = Math.random();
        let scale = Math.pow(u, 1 / 3) * HEART_SIZE; // Volume distribution

        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        // Add Z-depth
        let z = (Math.random() - 0.5) * 10;

        this.tx = x * scale;
        this.ty = y * scale;
        this.tz = z * scale;
    }

    update(beat) {
        if (isCelebrated) {
            // Explosion logic
            this.x += this.vx; this.y += this.vy; this.z += this.vz;
            this.vx *= this.friction; this.vy *= this.friction; this.vz *= this.friction;
            this.size *= 0.99; // Fade out
        } else {
            // Heart beat logic
            let pulse = 1 + beat * 0.1;

            let targetX = this.tx * pulse;
            let targetY = this.ty * pulse;
            let targetZ = this.tz * pulse;

            // Ease to target
            this.x += (targetX - this.x) * 0.1;
            this.y += (targetY - this.y) * 0.1;
            this.z += (targetZ - this.z) * 0.1;

            // Brownion motion
            this.x += (Math.random() - 0.5) * 0.5;
            this.y += (Math.random() - 0.5) * 0.5;
            this.z += (Math.random() - 0.5) * 0.5;
        }
    }

    draw(ctx, rx, ry) {
        // 3D Projection Matrix
        let y1 = this.y * Math.cos(rx) - this.z * Math.sin(rx);
        let z1 = this.z * Math.cos(rx) + this.y * Math.sin(rx);

        let x1 = this.x * Math.cos(ry) - z1 * Math.sin(ry);
        let z2 = z1 * Math.cos(ry) + this.x * Math.sin(ry);

        let perspective = 500;
        let scale = perspective / (perspective + z2);

        // Clipping
        if (scale < 0 || z2 < -perspective) return;

        let x2d = width / 2 + x1 * scale;
        let y2d = height / 2 + y1 * scale;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x2d, y2d, this.size * scale, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    console.log(`Creating ${PARTICLE_COUNT} particles for 3D heart...`);
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
    
    console.log(`3D heart initialized with ${particles.length} particles`);
}

// --- ANIMATION LOOP ---
let rotX = 0, rotY = 0;

// Auto Rotation variables
let targetRotX = 0;
let targetRotY = 0;
let mouse = { x: 0, y: 0 };

document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX - width / 2) * 0.001;
    mouse.y = (e.clientY - height / 2) * 0.001;
});

function animate() {
    requestAnimationFrame(animate);

    // Create romantic gradient background with trails
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, 'rgba(26, 6, 18, 0.4)');
    gradient.addColorStop(0.3, 'rgba(45, 10, 31, 0.4)');
    gradient.addColorStop(0.7, 'rgba(74, 14, 47, 0.4)');
    gradient.addColorStop(1, 'rgba(31, 10, 22, 0.4)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    time += 0.02;

    // Heartbeat math (Systole/Diastole style)
    let beat = Math.pow(Math.sin(time * 3), 60) * 0.5 + Math.sin(time * 3 + 0.5) * 0.1;

    // Soft rotation logic
    targetRotY += 0.003; // Auto rotate
    rotY += (targetRotY + mouse.x - rotY) * 0.05;
    rotX += (mouse.y - rotX) * 0.05;

    // Render Particles
    ctx.globalCompositeOperation = 'lighter';
    particles.forEach(p => {
        p.update(beat);
        p.draw(ctx, rotX, rotY);
    });
    ctx.globalCompositeOperation = 'source-over';
}

document.getElementById('noBtn').addEventListener('mouseover', () => {
    document.getElementById('yesBtn').style.right = "0px";
})

// Message Card Functions
function showMessageCard() {
    const messageCard = document.getElementById('messageCardScreen');
    if (messageCard) {
        messageCard.classList.add('show');
    }
    
    // Force reload images to trigger load events
    const photo1 = document.getElementById('photo1');
    const photo2 = document.getElementById('photo2');
    
    // Set up handlers before changing src
    photo1.onload = function() {
        this.classList.add('loaded');
        this.parentElement.querySelector('.photo-placeholder').style.display = 'none';
    };
    
    photo2.onload = function() {
        this.classList.add('loaded');
        this.parentElement.querySelector('.photo-placeholder').style.display = 'none';
    };
    
    photo1.onerror = function() {
        console.log('Photo1 failed to load');
        this.style.display = 'none';
    };
    
    photo2.onerror = function() {
        console.log('Photo2 failed to load');
        this.style.display = 'none';
    };
    
    // Check if images are already loaded
    if (photo1.complete && photo1.naturalHeight !== 0) {
        photo1.classList.add('loaded');
        photo1.parentElement.querySelector('.photo-placeholder').style.display = 'none';
    }
    
    if (photo2.complete && photo2.naturalHeight !== 0) {
        photo2.classList.add('loaded');
        photo2.parentElement.querySelector('.photo-placeholder').style.display = 'none';
    }
    
    // Force reload by changing src to trigger events if not already loaded
    const photo1Src = photo1.src;
    const photo2Src = photo2.src;
    photo1.src = '';
    photo2.src = '';
    photo1.src = photo1Src;
    photo2.src = photo2Src;
}

function closeMessageCard() {
    const messageCard = document.getElementById('messageCardScreen');
    messageCard.classList.remove('show');
}

// Play Our Song Function
function playOurSong() {
    // LOCAL AUDIO - Playing from file in the same folder
    const audio = new Audio('our-song.mp3'); // Replace 'our-song.mp3' with your actual song filename
    
    // Set volume (optional - 0.0 to 1.0)
    audio.volume = 0.7;
    
    // Play the song
    audio.play().catch(error => {
        console.log('Audio play failed:', error);
        alert('Could not play the song. Make sure the audio file "our-song.mp3" exists in the same folder!');
    });
    
    // Optional: Show a message when song starts
    const button = document.querySelector('.play-song-btn');
    const originalText = button.innerHTML;
    button.innerHTML = 'Playing... 🎶';
    button.disabled = true;
    
    // Reset button after 3 seconds
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 3000);
}
