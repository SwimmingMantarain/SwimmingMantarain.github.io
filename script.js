const links = document.querySelectorAll('.link');
const speed = 2; // Speed of the links
const width = window.innerWidth;
const height = window.innerHeight;

let positions = Array.from(links).map(link => {
    const rect = link.getBoundingClientRect();
    return {
        element: link,
        x: Math.random() * (width - rect.width),
        y: Math.random() * (height - rect.height),
        dx: (Math.random() > 0.5 ? 1 : -1) * speed,
        dy: (Math.random() > 0.5 ? 1 : -1) * speed
    };
});

function updatePositions() {
    positions.forEach((linkData, index) => {
        const { element, x, y, dx, dy } = linkData;
        const rect = element.getBoundingClientRect();
        
        // Move the link by its velocity
        linkData.x += dx;
        linkData.y += dy;

        // Bounce off the walls
        if (linkData.x <= 0 || linkData.x + rect.width >= width) {
            linkData.dx *= -1; // Reverse direction
        }
        if (linkData.y <= 0 || linkData.y + rect.height >= height) {
            linkData.dy *= -1; // Reverse direction
        }

        // Update position in style
        element.style.left = `${linkData.x}px`;
        element.style.top = `${linkData.y}px`;
    });

    requestAnimationFrame(updatePositions); // Keep the animation running
}

// Initialize positions and set them dynamically
links.forEach((linkData, index) => {
    const link = linkData.element;
    link.style.position = 'absolute';
    link.style.left = `${linkData.x}px`;
    link.style.top = `${linkData.y}px`;
});

updatePositions(); // Start the animation loop
