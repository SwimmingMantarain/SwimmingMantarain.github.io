// Select all elements with the bouncing-link class
const links = document.querySelectorAll('.bouncing-link');

// Movement settings
const baseSpeed = 1.0;          // Base speed for each link
const maxSpeed = 6.0;           // Maximum speed when accelerated
const accelerationRate = 0.021; // Speed increase rate when hovered
const decelerationRate = 0.01;  // Speed decrease rate when not hovered

// Get the current viewport dimensions
const bounds = {
  x: window.innerWidth,
  y: window.innerHeight,
};

// Initialize each link's position and velocity
links.forEach(link => {
  // Place the link at a random position within the viewport
  link.style.left = `${Math.random() * bounds.x}px`;
  link.style.top = `${Math.random() * bounds.y}px`;

  // Assign a random initial horizontal and vertical velocity
  link.velocityX = baseSpeed * (Math.random() < 0.5 ? 1 : -1);
  link.velocityY = baseSpeed * (Math.random() < 0.5 ? 1 : -1);
  link.currentSpeed = baseSpeed;
  link.accelerating = false;

  // On mouse hover, accelerate the link
  link.addEventListener('mouseover', () => {
    link.accelerating = true;
  });

  // On mouse out, decelerate the link
  link.addEventListener('mouseout', () => {
    link.accelerating = false;
  });
});

// Main update loop: moves links and handles collisions
function update() {
  links.forEach(link => {
    const rect = link.getBoundingClientRect();

    // Adjust speed: accelerate if hovered, decelerate otherwise
    if (link.accelerating && link.currentSpeed < maxSpeed) {
      link.currentSpeed = Math.min(maxSpeed, link.currentSpeed + accelerationRate);
    } else if (!link.accelerating && link.currentSpeed > baseSpeed) {
      link.currentSpeed = Math.max(baseSpeed, link.currentSpeed - decelerationRate);
    }

    // Normalize velocity to match the updated currentSpeed
    const velocityLength = Math.sqrt(link.velocityX ** 2 + link.velocityY ** 2);
    link.velocityX = (link.velocityX / velocityLength) * link.currentSpeed;
    link.velocityY = (link.velocityY / velocityLength) * link.currentSpeed;

    // Compute new position based on velocity
    let newLeft = rect.left + link.velocityX;
    let newTop = rect.top + link.velocityY;

    // Check for collision with vertical walls
    if (newLeft <= 0 || newLeft + rect.width >= bounds.x) {
      link.velocityX *= -1;
      newLeft = Math.max(0, Math.min(newLeft, bounds.x - rect.width));
      link.classList.add('pulse');
      createWallEffect(link, 'x');
    }
    // Check for collision with horizontal walls
    if (newTop <= 0 || newTop + rect.height >= bounds.y) {
      link.velocityY *= -1;
      newTop = Math.max(0, Math.min(newTop, bounds.y - rect.height));
      link.classList.add('pulse');
      createWallEffect(link, 'y');
    }

    // Check for collisions with other links and adjust velocities accordingly
    links.forEach(otherLink => {
      if (link !== otherLink) {
        const otherRect = otherLink.getBoundingClientRect();
        if (checkCollision(rect, otherRect)) {
          const dx = rect.left - otherRect.left;
          const dy = rect.top - otherRect.top;
          const angle = Math.atan2(dy, dx);
          const targetX = Math.cos(angle);
          const targetY = Math.sin(angle);

          const ax = (targetX - link.velocityX) * 0.05;
          const ay = (targetY - link.velocityY) * 0.05;

          link.velocityX += ax;
          link.velocityY += ay;
          otherLink.velocityX -= ax;
          otherLink.velocityY -= ay;
        }
      }
    });

    // Update the link's position on the page
    link.style.left = `${newLeft}px`;
    link.style.top = `${newTop}px`;
  });

  // Request the next frame
  requestAnimationFrame(update);
}

// Create a neon wall effect line when a link hits a boundary
function createWallEffect(link, axis) {
  const rect = link.getBoundingClientRect();
  const line = document.createElement('div');
  line.classList.add('wall-effect');

  if (axis === 'x') {
    // For vertical walls, position the line at the left or right edge
    if (rect.left <= 10) {
      line.style.left = '0px';
    } else {
      line.style.left = `${window.innerWidth - 2}px`;
    }
    line.style.top = `${Math.max(0, Math.min(rect.top, window.innerHeight - rect.height))}px`;
    line.style.width = '2px';
    line.style.height = `${rect.height}px`;
  } else if (axis === 'y') {
    // For horizontal walls, position the line at the top or bottom edge
    if (rect.top <= 10) {
      line.style.top = '0px';
    } else {
      line.style.top = `${window.innerHeight - 2}px`;
    }
    line.style.left = `${Math.max(0, Math.min(rect.left, window.innerWidth - rect.width))}px`;
    line.style.width = `${rect.width}px`;
    line.style.height = '2px';
  }

  document.body.appendChild(line);

  // Remove the wall effect after the animation finishes (5 seconds)
  setTimeout(() => line.remove(), 5000);
}

// Utility function to detect rectangle collisions
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
