
// 3D Tech Animation with three.js
document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('tech-canvas');
    if (!canvas) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 500;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Particles setup
    const particleCount = 300;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    const spawnRange = 800;
    const wrapBoundary = spawnRange / 2;

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spawnRange;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spawnRange;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spawnRange;

        velocities.push({
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5,
            z: (Math.random() - 0.5) * 0.5
        });
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({ color: 0x00809D, size: 2 });
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Lines setup
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00809D, transparent: true, opacity: 0.3 });
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lines = new THREE.LineSegments(linesGeometry, lineMaterial);
    scene.add(lines);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        const positions = particleSystem.geometry.attributes.position.array;
        const linePositions = lines.geometry.attributes.position.array;
        let lineVertexIndex = 0;

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;

            // Wrap particles around
            if (positions[i * 3 + 1] < -wrapBoundary || positions[i * 3 + 1] > wrapBoundary) velocities[i].y = -velocities[i].y;
            if (positions[i * 3] < -wrapBoundary || positions[i * 3] > wrapBoundary) velocities[i].x = -velocities[i].x;
        }

        // Update lines
        const distanceThreshold = 80;
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < distanceThreshold) {
                    linePositions[lineVertexIndex++] = positions[i * 3];
                    linePositions[lineVertexIndex++] = positions[i * 3 + 1];
                    linePositions[lineVertexIndex++] = positions[i * 3 + 2];
                    linePositions[lineVertexIndex++] = positions[j * 3];
                    linePositions[lineVertexIndex++] = positions[j * 3 + 1];
                    linePositions[lineVertexIndex++] = positions[j * 3 + 2];
                }
            }
        }

        // Clear unused line vertices
        for (let i = lineVertexIndex; i < linePositions.length; i++) {
            linePositions[i] = 0;
        }

        lines.geometry.attributes.position.needsUpdate = true;
        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Rotate the whole scene
        scene.rotation.y += 0.0005;
        scene.rotation.x += 0.0002;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Typing Animation
    const typeWriterElement = document.getElementById('typewriter');
    if (typeWriterElement) {
        const words = [
            "Computer Science Student",
            "Web Developer",
            "Tech Enthusiast",
            "Professional Bug Creator 🐛",
            "Bug Hunter (Sometimes Creator)",
            "Ctrl + C, Ctrl + V Engineer",
            "Semicolon Therapist ;"
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typeWriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeWriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            let typingSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                typingSpeed = 2000; // Pause at end of word
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 500; // Pause before new word
            }

            setTimeout(type, typingSpeed);
        }
        type();
    }

    // Scroll Spy & Navbar Styling
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        // Navbar style on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled-nav');
        } else {
            navbar.classList.remove('scrolled-nav');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            if (section.clientHeight > 0) { // Ignore hidden sections
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Scroll Reveal
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // Theme Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    const docBody = document.body;

    // Check local storage or system preference
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        docBody.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            docBody.classList.toggle('dark-mode');
            if (docBody.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        });
    }
});
