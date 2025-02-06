// Select all elements with the class "bouncing-link"
const links = document.querySelectorAll('.bouncing-link');

// Set up constants for movement
const baseSpeed = 1.0;        // Base speed of movement
const maxSpeed = 6.0;         // Maximum speed during acceleration
const accelerationRate = 0.021; // Rate of acceleration
const decelerationRate = 0.01;  // Rate of deceleration
const bounds = {
  x: window.innerWidth,
  y: window.innerHeight,
};

// Initialize each link with a random starting position and velocity
links.forEach(link => {
  // Place the link randomly within the viewport
  link.style.left = `${Math.random() * bounds.x}px`;
  link.style.top = `${Math.random() * bounds.y}px`;

  // Set a random direction for horizontal and vertical movement
  link.velocityX = baseSpeed * (Math.random() < 0.5 ? 1 : -1);
  link.velocityY = baseSpeed * (Math.random() < 0.5 ? 1 : -1);
  link.currentSpeed = baseSpeed; // Start at base speed
  link.accelerating = false;     // Initially not accelerating

  // Increase speed on mouseover
  link.addEventListener('mouseover', () => {
    link.accelerating = true;
  });

  // Slow back down on mouseout
  link.addEventListener('mouseout', () => {
    link.accelerating = false;
  });
});

// Update the positions and handle collisions every frame
function update() {
  links.forEach(link => {
    const rect = link.getBoundingClientRect();

    // Adjust current speed based on whether the link is accelerating (mouseover) or decelerating
    if (link.accelerating && link.currentSpeed < maxSpeed) {
      link.currentSpeed = Math.min(maxSpeed, link.currentSpeed + accelerationRate);
    } else if (!link.accelerating && link.currentSpeed > baseSpeed) {
      link.currentSpeed = Math.max(baseSpeed, link.currentSpeed - decelerationRate);
    }

    // Normalize the velocity vector to match the current speed
    const velocityLength = Math.sqrt(link.velocityX ** 2 + link.velocityY ** 2);
    link.velocityX = (link.velocityX / velocityLength) * link.currentSpeed;
    link.velocityY = (link.velocityY / velocityLength) * link.currentSpeed;

    // Calculate new position based on velocity
    let newLeft = rect.left + link.velocityX;
    let newTop = rect.top + link.velocityY;

    // Check if the link hits the horizontal walls
    if (newLeft <= 0 || newLeft + rect.width >= bounds.x) {
      link.velocityX *= -1; // Reverse horizontal direction
      newLeft = Math.max(0, Math.min(newLeft, bounds.x - rect.width));
      createWallEffect(link, 'x');
    }
    // Check if the link hits the vertical walls
    if (newTop <= 0 || newTop + rect.height >= bounds.y) {
      link.velocityY *= -1; // Reverse vertical direction
      newTop = Math.max(0, Math.min(newTop, bounds.y - rect.height));
      createWallEffect(link, 'y');
    }

    // Check for collisions with other links
    links.forEach(otherLink => {
      if (link !== otherLink) {
        const otherRect = otherLink.getBoundingClientRect();
        if (checkCollision(rect, otherRect)) {
          // Calculate the angle between the two colliding links
          const dx = rect.left - otherRect.left;
          const dy = rect.top - otherRect.top;
          const angle = Math.atan2(dy, dx);
          const targetX = Math.cos(angle);
          const targetY = Math.sin(angle);

          // Apply a small acceleration to adjust directions
          const ax = (targetX - link.velocityX) * 0.05;
          const ay = (targetY - link.velocityY) * 0.05;

          link.velocityX += ax;
          link.velocityY += ay;
          otherLink.velocityX -= ax;
          otherLink.velocityY -= ay;
        }
      }
    });

    // Update the link's position using the new values
    link.style.left = `${newLeft}px`;
    link.style.top = `${newTop}px`;
  });

  // Request the next animation frame
  requestAnimationFrame(update);
}

// Create a wall effect line at the collision point
function createWallEffect(link, axis) {
  const rect = link.getBoundingClientRect();
  const line = document.createElement('div');
  line.classList.add('wall-effect');

  if (axis === 'x') {
    // Create a vertical line at the left or right edge
    if (rect.left <= 10) {
      line.style.left = '0px'; // Left edge
    } else {
      line.style.left = `${window.innerWidth - 2}px`; // Right edge
    }
    // Position vertically aligned with the link
    line.style.top = `${Math.max(0, Math.min(rect.top, window.innerHeight - rect.height))}px`;
    line.style.width = '2px';
    line.style.height = `${rect.height}px`;
  } else if (axis === 'y') {
    // Create a horizontal line at the top or bottom edge
    if (rect.top <= 10) {
      line.style.top = '0px'; // Top edge
    } else {
      line.style.top = `${window.innerHeight - 2}px`; // Bottom edge
    }
    // Position horizontally aligned with the link
    line.style.left = `${Math.max(0, Math.min(rect.left, window.innerWidth - rect.width))}px`;
    line.style.width = `${rect.width}px`;
    line.style.height = '2px';
  }

  // Add the wall effect element to the document body
  document.body.appendChild(line);

  // Remove the wall effect after the fade-in-out animation (5 seconds)
  setTimeout(() => line.remove(), 5000);
}

// Function to detect collisions between two rectangles
function checkCollision(rect1, rect2) {
  return !(
    rect1.left > rect2.right ||
    rect1.right < rect2.left ||
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top
  );
}

// Start the animation loop
update();
