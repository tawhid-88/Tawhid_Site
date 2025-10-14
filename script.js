
        // Initialize Lucide Icons
        lucide.createIcons();

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
        });
