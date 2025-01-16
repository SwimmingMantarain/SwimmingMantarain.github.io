const links = document.querySelectorAll('.bouncing-link');
const speed = 1.5; // constant speed of movement
const accelerationFactor = 2.0; // acceleration factor on hover
const bounds = {
  x: window.innerWidth,
  y: window.innerHeight
};

// Set initial position and velocity for each link
links.forEach(link => {
  link.style.left = `${Math.random() * bounds.x}px`;
  link.style.top = `${Math.random() * bounds.y}px`;
  
  link.velocityX = speed * (Math.random() < 0.5 ? 1 : -1); // Random horizontal direction
  link.velocityY = speed * (Math.random() < 0.5 ? 1 : -1); // Random vertical direction

  link.addEventListener('mouseover', () => {
    link.accelerating = true;
  });

  link.addEventListener('mouseout', () => {
    link.accelerating = false;
  });
});

function update() {
  links.forEach(link => {
    let rect = link.getBoundingClientRect();

    // Update position based on velocity
    let newLeft = rect.left + link.velocityX;
    let newTop = rect.top + link.velocityY;

    // Ensure the link stays within bounds
    if (newLeft <= 0 || newLeft + rect.width >= bounds.x) {
      link.velocityX *= -1;
      newLeft = Math.max(0, Math.min(newLeft, bounds.x - rect.width));
    }
    if (newTop <= 0 || newTop + rect.height >= bounds.y) {
      link.velocityY *= -1;
      newTop = Math.max(0, Math.min(newTop, bounds.y - rect.height));
    }

    // Check for collisions with other links
    links.forEach(otherLink => {
      if (link !== otherLink) {
        let otherRect = otherLink.getBoundingClientRect();
        if (checkCollision(rect, otherRect)) {
          let dx = rect.left - otherRect.left;
          let dy = rect.top - otherRect.top;
          let angle = Math.atan2(dy, dx);
          let targetX = Math.cos(angle);
          let targetY = Math.sin(angle);

          let ax = (targetX - link.velocityX) * 0.05;
          let ay = (targetY - link.velocityY) * 0.05;

          link.velocityX += ax;
          link.velocityY += ay;

          otherLink.velocityX -= ax;
          otherLink.velocityY -= ay;
        }
      }
    });

    // Apply the new position
    link.style.left = `${newLeft}px`;
    link.style.top = `${newTop}px`;

    // Normalize the velocity to maintain a constant speed
    normalizeVelocity(link);

    if (link.accelerating) {
      link.velocityX *= accelerationFactor;
      link.velocityY *= accelerationFactor;
    }
  });

  requestAnimationFrame(update);
}

// Function to normalize the velocity to maintain a constant speed
function normalizeVelocity(link) {
  let length = Math.sqrt(link.velocityX * link.velocityX + link.velocityY * link.velocityY);
  link.velocityX = (link.velocityX / length) * speed;
  link.velocityY = (link.velocityY / length) * speed;
}

// Start the animation
update();

// Function to check for collisions between two rectangles
function checkCollision(rect1, rect2) {
  if (rect1.left > rect2.right || rect1.right < rect2.left || rect1.top > rect2.bottom || rect1.bottom < rect2.top) {
    return false;
  }
  return true;
}

