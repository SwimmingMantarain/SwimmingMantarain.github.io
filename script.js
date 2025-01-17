const links = document.querySelectorAll('.bouncing-link');
const baseSpeed = 1.5; // Base speed of movement
const maxSpeed = 6.0; // Maximum speed during acceleration
const accelerationRate = 0.05; // How quickly it accelerates
const decelerationRate = 0.01; // How quickly it decelerates
const bounds = {
  x: window.innerWidth,
  y: window.innerHeight,
};

// Set initial position and velocity for each link
links.forEach(link => {
  link.style.left = `${Math.random() * bounds.x}px`;
  link.style.top = `${Math.random() * bounds.y}px`;

  link.velocityX = baseSpeed * (Math.random() < 0.5 ? 1 : -1); // Random horizontal direction
  link.velocityY = baseSpeed * (Math.random() < 0.5 ? 1 : -1); // Random vertical direction
  link.currentSpeed = baseSpeed; // Current speed
  link.accelerating = false;

  link.addEventListener('mouseover', () => {
    link.accelerating = true;
  });

  link.addEventListener('mouseout', () => {
    link.accelerating = false;
  });
});

function update() {
  links.forEach(link => {
    const rect = link.getBoundingClientRect();

    // Update velocity based on acceleration or deceleration
    if (link.accelerating && link.currentSpeed < maxSpeed) {
      link.currentSpeed = Math.min(maxSpeed, link.currentSpeed + accelerationRate);
    } else if (!link.accelerating && link.currentSpeed > baseSpeed) {
      link.currentSpeed = Math.max(baseSpeed, link.currentSpeed - decelerationRate);
    }

    // Normalize velocity to match the current speed
    const velocityLength = Math.sqrt(link.velocityX ** 2 + link.velocityY ** 2);
    link.velocityX = (link.velocityX / velocityLength) * link.currentSpeed;
    link.velocityY = (link.velocityY / velocityLength) * link.currentSpeed;

    // Update position based on velocity
    let newLeft = rect.left + link.velocityX;
    let newTop = rect.top + link.velocityY;

    // Ensure the link stays within bounds and pulse when it hits the wall
    if (newLeft <= 0 || newLeft + rect.width >= bounds.x) {
      link.velocityX *= -1;
      newLeft = Math.max(0, Math.min(newLeft, bounds.x - rect.width));
      link.classList.add('pulse');
      createWallEffect(link, 'x');
    }
    if (newTop <= 0 || newTop + rect.height >= bounds.y) {
      link.velocityY *= -1;
      newTop = Math.max(0, Math.min(newTop, bounds.y - rect.height));
      link.classList.add('pulse');
      createWallEffect(link, 'y');
    }

    // Check for collisions with other links
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

    // Apply the new position
    link.style.left = `${newLeft}px`;
    link.style.top = `${newTop}px`;
  });

  requestAnimationFrame(update);
}

function createWallEffect(link, axis) {
  const rect = link.getBoundingClientRect();
  const line = document.createElement('div');
  line.classList.add('wall-effect');

  if (axis === 'x') {
    // Vertical line aligned with the wall (left or right)
    if (rect.left <= 10) {
      // Stuck to the left edge
      line.style.left = '0px';
    } else {
      // Stuck to the right edge
      line.style.left = `${window.innerWidth - 2}px`;
    }
    line.style.top = `${Math.max(0, Math.min(rect.top, window.innerHeight - rect.height))}px`; // Stay within bounds
    line.style.width = '2px';
    line.style.height = `${rect.height}px`;
  } else if (axis === 'y') {
    // Horizontal line aligned with the wall (top or bottom)
    if (rect.top <= 10) {
      // Stuck to the top edge
      line.style.top = '0px';
    } else {
      // Stuck to the bottom edge
      line.style.top = `${window.innerHeight - 2}px`;
    }
    line.style.left = `${Math.max(0, Math.min(rect.left, window.innerWidth - rect.width))}px`; // Stay within bounds
    line.style.width = `${rect.width}px`;
    line.style.height = '2px';
  }

  document.body.appendChild(line);

  // Automatically remove the line after the animation ends
  setTimeout(() => line.remove(), 5000);
}

// Function to check for collisions between two rectangles
function checkCollision(rect1, rect2) {
  return !(
    rect1.left > rect2.right ||
    rect1.right < rect2.left ||
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top
  );
}

// Start the animation
update();

