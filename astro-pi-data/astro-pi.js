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

// Initialize the slider functionality
function initializeSlider() {
    const slider = document.getElementById('timeSlider');
    const container = document.querySelector('.slider-container');
    
    // Show bubble when slider is active
    slider.addEventListener('mousedown', () => {
        container.classList.add('active');
    });
    
    document.addEventListener('mouseup', () => {
        container.classList.remove('active');
    });

    // Touchscreen
    slider.addEventListener('touchstart', () => {
        container.classList.add('active');
    });
    
    document.addEventListener('touchend', () => {
        container.classList.remove('active');
    });
    
    // Update bubble on slider change
    slider.addEventListener('input', updateBubble);
    
    // Initial update
    updateBubble();
}

// Update the value bubble position and text
function updateBubble() {
    const slider = document.getElementById('timeSlider');
    const bubble = document.querySelector('.value-bubble');
    const value = slider.value;
    
    // Update bubble text
    bubble.textContent = `Image ${value} & ${Number(value) + 1}`;
    
    // Calculate position
    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    const newVal = Number((value - min) * 100) / (max - min);
    
    // Update bubble position
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}

// Dataset selection and image loading functionality
function initializeDatasetSelect() {
    const datasetSelect = document.getElementById('dataset-select');
    const timeSlider = document.getElementById('timeSlider');
    let currentDataset = 'exoclass';
    let orderData = [];
    let avgSpeed = 0;
    
    // Load dataset order data
    function loadOrderData(dataset) {
        return fetch(`photos/${dataset}/order.txt`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load order data for ${dataset}`);
                }
                return response.text();
            })
            .then(text => {
                const lines = text.trim().split('\n');
                const dataEntries = [];
                let totalSpeed = 0;
                
                // Process each line of the order.txt file
                lines.forEach((line, index) => {
                    if (line.includes(',')) {
                        const [speed, img1, img2] = line.split(',');
                        dataEntries.push({ speed, img1, img2 });
                        totalSpeed += parseFloat(speed);
                    } else if (line.includes(',')) {
                        // Handle any summary line at the end if it exists
                        const parts = line.split(',');
                        if (parts.length === 2) {
                            console.log(`Image Count ${dataset} Speed Average: ${line}`);
                        }
                    }
                });
                
                // Calculate average speed
                avgSpeed = (totalSpeed / dataEntries.length - 1).toFixed(2);
                document.getElementById('iss-avg-speed').textContent = avgSpeed;
                
                // Update slider max value based on entries count
                timeSlider.max = dataEntries.length - 1;
                
                return dataEntries;
            })
            .catch(error => {
                console.error(`Error loading order data: ${error}`);
                return [];
            });
    }
    
    // Update images based on slider position
    function updateImages(index) {
        if (orderData.length === 0 || index < 1 || index > orderData.length) {
            console.error(`Invalid index: ${index} or empty order data`);
            return;
        }
        
        const entry = orderData[index - 2];
        
        // Update speed display
        document.getElementById('iss-cur-speed').textContent = entry.speed;
        
        // Update images
        document.getElementById('img1').src = entry.img1;
        document.getElementById('img2').src = entry.img2;
        
        // Update time displays
        document.getElementById('img1-time').textContent = index;
        document.getElementById('img2-time').textContent = index + 1;
    }
    
    // Change dataset handler
    datasetSelect.addEventListener('change', function() {
        currentDataset = this.value;
        
        // Load new dataset
        loadOrderData(currentDataset).then(data => {
            orderData = data;
            
            // Reset slider to start position when changing datasets
            timeSlider.value = 1;
            updateBubble();
            
            // Update images for the first entry
            if (orderData.length > 0) {
                updateImages(1);
            }
        });
    });
    
    // Slider value change handler
    timeSlider.addEventListener('input', function() {
        updateBubble();
        updateImages(parseInt(this.value));
    });
    
    // Initial dataset load
    loadOrderData(currentDataset).then(data => {
        orderData = data;
        if (orderData.length > 0) {
            updateImages(1);
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createStarfield();
    setInterval(createShootingStar, 1500);
    initializeSlider();
    initializeDatasetSelect();
});