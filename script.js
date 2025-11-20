// Planet Data with slower speeds
const planets = [
    { name: "Mercury", radius: 12, color: "#8C7853", orbit: 100, speed: 0.001, facts: "The smallest planet in our solar system and closest to the Sun." },
    { name: "Venus", radius: 18, color: "#FFC649", orbit: 130, speed: 0.0008, facts: "The hottest planet with a thick, toxic atmosphere." },
    { name: "Earth", radius: 20, color: "#6B93D6", orbit: 160, speed: 0.0007, facts: "Our home planet, the only known world to support life." },
    { name: "Mars", radius: 15, color: "#FF6B35", orbit: 190, speed: 0.0006, facts: "The Red Planet, home to the largest volcano in the solar system." },
    { name: "Jupiter", radius: 32, color: "#FFA500", orbit: 230, speed: 0.0004, facts: "The largest planet, a gas giant with a great red spot." },
    { name: "Saturn", radius: 28, color: "#FFD700", orbit: 270, speed: 0.0003, facts: "Known for its spectacular ring system made of ice and rock." },
    { name: "Uranus", radius: 24, color: "#4FD0E7", orbit: 310, speed: 0.0002, facts: "An ice giant that rotates on its side." },
    { name: "Neptune", radius: 23, color: "#4B70DD", orbit: 350, speed: 0.0001, facts: "The windiest planet with speeds up to 1,200 mph." }
];

// Exoplanet Data
const exoplanets = [
    { name: "Proxima Centauri b", type: "super-earth", habitable: true, facts: "Closest known exoplanet to Earth, in habitable zone." },
    { name: "TRAPPIST-1e", type: "super-earth", habitable: true, facts: "One of seven Earth-sized planets orbiting a single star." },
    { name: "Kepler-186f", type: "super-earth", habitable: true, facts: "First Earth-sized planet in habitable zone discovered." },
    { name: "HD 209458 b", type: "gas-giant", habitable: false, facts: "First exoplanet discovered with an atmosphere." },
    { name: "WASP-76b", type: "gas-giant", habitable: false, facts: "So hot it rains molten iron on the night side." },
    { name: "GJ 1214b", type: "super-earth", habitable: false, facts: "A water world with a thick, steamy atmosphere." }
];

// Quiz Questions
const quizQuestions = [
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Saturn", "Jupiter", "Neptune"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Mercury"],
        correct: 1
    },
    {
        question: "What is a light-year?",
        options: ["A year with less sunlight", "Distance light travels in one year", "Time it takes light to reach Earth", "A measurement of brightness"],
        correct: 1
    },
    {
        question: "Which of these is NOT a type of galaxy?",
        options: ["Spiral", "Elliptical", "Triangular", "Irregular"],
        correct: 2
    },
    {
        question: "What is at the center of our solar system?",
        options: ["Earth", "The Moon", "The Sun", "Jupiter"],
        correct: 2
    }
];

// Global Variables
let currentQuestion = 0;
let score = 0;
let animationId;
let isAnimationPaused = false;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeSolarSystem();
    initializeExoplanets();
    initializeNavigation();
    initializeQuiz();
    initializeBlackHoleSimulator();
});

// Solar System Functions
function initializeSolarSystem() {
    const solarSystem = document.querySelector('.solar-system');
    
    planets.forEach((planet, index) => {
        // Create orbit path
        const orbit = document.createElement('div');
        orbit.className = 'orbit';
        orbit.style.width = `${planet.orbit * 2}px`;
        orbit.style.height = `${planet.orbit * 2}px`;
        orbit.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        orbit.style.borderRadius = '50%';
        orbit.style.position = 'absolute';
        solarSystem.appendChild(orbit);
        
        // Create planet container for better clicking
        const planetContainer = document.createElement('div');
        planetContainer.className = 'planet-container';
        planetContainer.style.position = 'absolute';
        
        // Create the visible planet
        const planetElement = document.createElement('div');
        planetElement.className = 'planet';
        planetElement.style.width = `${planet.radius}px`;
        planetElement.style.height = `${planet.radius}px`;
        planetElement.style.background = planet.color;
        planetElement.style.boxShadow = `0 0 15px ${planet.color}`;
        planetElement.setAttribute('data-name', planet.name);
        
        // Create invisible larger click area
        const clickArea = document.createElement('div');
        clickArea.className = 'click-area';
        clickArea.style.width = `${planet.radius * 3}px`;
        clickArea.style.height = `${planet.radius * 3}px`;
        clickArea.style.position = 'absolute';
        clickArea.style.top = '50%';
        clickArea.style.left = '50%';
        clickArea.style.transform = 'translate(-50%, -50%)';
        clickArea.style.borderRadius = '50%';
        clickArea.style.cursor = 'pointer';
        clickArea.style.zIndex = '10';
        
        // Add click event to the larger area
        clickArea.addEventListener('click', (e) => {
            e.stopPropagation();
            showPlanetInfo(planet);
            highlightPlanet(planetContainer);
        });
        
        // Add hover effect
        clickArea.addEventListener('mouseenter', () => {
            planetElement.style.transform = 'scale(1.3)';
            planetElement.style.boxShadow = `0 0 25px ${planet.color}`;
        });
        
        clickArea.addEventListener('mouseleave', () => {
            if (!planetContainer.classList.contains('highlighted')) {
                planetElement.style.transform = 'scale(1)';
                planetElement.style.boxShadow = `0 0 15px ${planet.color}`;
            }
        });
        
        planetContainer.appendChild(planetElement);
        planetContainer.appendChild(clickArea);
        solarSystem.appendChild(planetContainer);
        
        // Store planet data for animation
        planetContainer.planetData = planet;
        planetContainer.angle = (index / planets.length) * Math.PI * 2;
    });
    
    animateSolarSystem();
}

function animateSolarSystem() {
    const planetContainers = document.querySelectorAll('.planet-container');
    
    function animate() {
        if (isAnimationPaused) return;
        
        planetContainers.forEach(container => {
            const planet = container.planetData;
            
            // Update angle based on speed
            container.angle += planet.speed;
            
            // Calculate position
            const x = Math.cos(container.angle) * planet.orbit;
            const y = Math.sin(container.angle) * planet.orbit;
            
            // Apply position
            container.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
}

function highlightPlanet(planetContainer) {
    // Remove highlight from all planets
    document.querySelectorAll('.planet-container').forEach(container => {
        container.classList.remove('highlighted');
        const planetElement = container.querySelector('.planet');
        const planet = container.planetData;
        planetElement.style.transform = 'scale(1)';
        planetElement.style.boxShadow = `0 0 15px ${planet.color}`;
    });
    
    // Highlight clicked planet
    planetContainer.classList.add('highlighted');
    const planetElement = planetContainer.querySelector('.planet');
    const planet = planetContainer.planetData;
    planetElement.style.transform = 'scale(1.5)';
    planetElement.style.boxShadow = `0 0 30px ${planet.color}`;
}

function showPlanetInfo(planet) {
    const planetInfo = document.getElementById('planet-info');
    planetInfo.innerHTML = `
        <h3>${planet.name}</h3>
        <p>${planet.facts}</p>
        <div style="margin-top: 1rem; color: #88ffff;">
            <strong>Orbit Radius:</strong> ${planet.orbit} units<br>
            <strong>Relative Size:</strong> ${planet.radius}px<br>
            <strong>Orbit Speed:</strong> ${(planet.speed * 1000).toFixed(4)}
        </div>
        <div class="control-buttons">
            <button onclick="pauseAnimation()" class="control-btn">⏸️ Pause Orbits</button>
            <button onclick="resumeAnimation()" class="control-btn">▶️ Resume Orbits</button>
        </div>
    `;
}

function pauseAnimation() {
    isAnimationPaused = true;
    cancelAnimationFrame(animationId);
}

function resumeAnimation() {
    isAnimationPaused = false;
    animateSolarSystem();
}

// Exoplanets Functions
function initializeExoplanets() {
    const grid = document.getElementById('exoplanet-grid');
    
    exoplanets.forEach(exoplanet => {
        const card = document.createElement('div');
        card.className = `exoplanet-card ${exoplanet.habitable ? 'habitable' : ''}`;
        card.innerHTML = `
            <h3>${exoplanet.name}</h3>
            <p><strong>Type:</strong> ${exoplanet.type}</p>
            <p><strong>Habitable:</strong> ${exoplanet.habitable ? 'Yes 🎯' : 'No'}</p>
            <p>${exoplanet.facts}</p>
        `;
        grid.appendChild(card);
    });
    
    // Filter functionality
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterExoplanets(filter);
        });
    });
}

function filterExoplanets(filter) {
    const cards = document.querySelectorAll('.exoplanet-card');
    
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else if (filter === 'habitable') {
            card.style.display = card.classList.contains('habitable') ? 'block' : 'none';
        } else {
            const type = card.querySelector('p strong').nextSibling.textContent.trim().toLowerCase();
            card.style.display = type.includes(filter) ? 'block' : 'none';
        }
    });
}

// Navigation Functions
function initializeNavigation() {
    document.querySelectorAll('.nav-btn').forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active navigation button
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(targetSection).classList.add('active');
            
            // Stop solar system animation when not viewing
            if (targetSection !== 'solar-system') {
                pauseAnimation();
            } else {
                resumeAnimation();
            }
        });
    });
}

// Quiz Functions
function initializeQuiz() {
    showQuestion();
    
    document.getElementById('next-question').addEventListener('click', nextQuestion);
}

function showQuestion() {
    const question = quizQuestions[currentQuestion];
    document.getElementById('question-text').textContent = question.question;
    document.getElementById('current-question').textContent = currentQuestion + 1;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.addEventListener('click', () => selectAnswer(index));
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('next-question').style.display = 'none';
}

function selectAnswer(selectedIndex) {
    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.option-btn');
    
    options.forEach((button, index) => {
        button.disabled = true;
        if (index === question.correct) {
            button.classList.add('correct');
        } else if (index === selectedIndex) {
            button.classList.add('incorrect');
        }
    });
    
    if (selectedIndex === question.correct) {
        score++;
        document.getElementById('score').textContent = score;
    }
    
    document.getElementById('next-question').style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < quizQuestions.length) {
        showQuestion();
    } else {
        showQuizResults();
    }
}

function showQuizResults() {
    const quizContent = document.querySelector('.quiz-content');
    quizContent.innerHTML = `
        <h3>Quiz Complete! 🚀</h3>
        <p>Your final score: <strong>${score}/${quizQuestions.length}</strong></p>
        <p>${getQuizMessage()}</p>
        <button onclick="restartQuiz()" class="next-btn">Take Quiz Again</button>
    `;
}

function getQuizMessage() {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return "Astronomical knowledge! You're a space expert! 🌟";
    if (percentage >= 60) return "Great job! You know your space facts! 🪐";
    return "Keep learning! The universe is full of wonders! 🔭";
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('score').textContent = '0';
    initializeQuiz();
}

// Black Hole Simulator Functions
function initializeBlackHoleSimulator() {
    const canvas = document.getElementById('blackhole-canvas');
    const ctx = canvas.getContext('2d');
    
    let stars = [];
    const blackHole = { x: canvas.width / 2, y: canvas.height / 2, mass: 1000 };
    
    // Resize canvas for responsiveness
    function resizeCanvas() {
        canvas.width = Math.min(800, window.innerWidth - 40);
        canvas.height = 400;
        blackHole.x = canvas.width / 2;
        blackHole.y = canvas.height / 2;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Add star on button click
    document.getElementById('add-star').addEventListener('click', function() {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            radius: Math.random() * 3 + 1
        });
    });
    
    // Reset simulation
    document.getElementById('reset-sim').addEventListener('click', function() {
        stars = [];
    });
    
    // Add star on canvas click
    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        stars.push({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            radius: Math.random() * 3 + 1
        });
    });
    
    // Animation loop
    function animate() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw black hole
        ctx.beginPath();
        ctx.arc(blackHole.x, blackHole.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(blackHole.x, blackHole.y, 25, 0, Math.PI * 2);
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Update and draw stars
        stars.forEach((star, index) => {
            // Calculate gravitational force
            const dx = blackHole.x - star.x;
            const dy = blackHole.y - star.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 20) {
                const force = blackHole.mass / (distance * distance);
                star.vx += (dx / distance) * force * 0.1;
                star.vy += (dy / distance) * force * 0.1;
            } else {
                // Star consumed by black hole
                stars.splice(index, 1);
                return;
            }
            
            // Update position
            star.x += star.vx;
            star.y += star.vy;
            
            // Draw star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}