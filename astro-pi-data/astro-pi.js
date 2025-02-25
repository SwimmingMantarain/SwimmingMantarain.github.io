// Starfield creation
function createStarfield() {
    const container = document.getElementById('background');
    const starCount = 200;
  
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random size between 1-3px
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      
      // Random animation properties
      star.style.animationDelay = `${Math.random() * 2}s`;
      star.style.animationDuration = `${Math.random() * 1 + 1}s`;
      
      // Random twinkle intensity
      star.style.filter = `brightness(${Math.random() * 0.5 + 0.5})`;
      
      container.appendChild(star);
    }
}
  
// Create shooting stars occasionally
function createShootingStar() {
    const container = document.getElementById('background');
    const shooter = document.createElement('div');
    shooter.className = 'shooting-star';
    
    const startX = Math.random() * 100;
    const startY = Math.random() * 30;
    
    shooter.style.left = `${startX}%`;
    shooter.style.top = `${startY}%`;
    
    // Random animation duration between 1-2 seconds
    const duration = Math.random() * 1 + 1;
    shooter.style.animation = `shoot ${duration}s linear`;
    
    container.appendChild(shooter);
    
    // Remove element after animation
    setTimeout(() => shooter.remove(), duration * 5000);
}
  
// Add shooting star animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shoot {
        0% {
            transform: translate(0, 0);
            opacity: 1;
        }
        100% {
            transform: translate(100px, 100px);
            opacity: 0;
        }
    }
    
    .shooting-star {
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    }
`;
document.head.appendChild(style);

// Slider functionality
function initializeSlider() {
    const sliderContainer = document.querySelector('.slider-container');
    const slider = document.getElementById('timeSlider');
    const bubble = document.querySelector('.value-bubble');

    // Update bubble position and value
    function updateBubble() {
        const value = slider.value;
        bubble.textContent = value + " & " + (Number(value) + 1);
    }

    // Touchscreen
    sliderContainer.addEventListener('touchstart', (e) => {
        sliderContainer.classList.add('active');
    });

    sliderContainer.addEventListener('touchend', (e) => {
        sliderContainer.classList.remove('active');
    });


    // Show bubble when sliding
    slider.addEventListener('mousedown', () => {
        sliderContainer.classList.add('active');
    });

    // Hide bubble when done sliding
    document.addEventListener('mouseup', () => {
        sliderContainer.classList.remove('active');
    });

    // Update bubble when sliding
    slider.addEventListener('input', updateBubble);

    // Initial update
    updateBubble();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createStarfield();
    setInterval(createShootingStar, 1500);
    initializeSlider();
});