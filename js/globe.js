/**
 * Vestra - 3D Holographic Globe
 * Powered by Three.js
 */

// Lee un color del theme system (style/global/themeSystem.css)
function themeColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

class HolographicGlobe {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.camera.position.z = 400;

        this.globeGroup = new THREE.Group();
        // Ángulo inicial: el globo aparece más adelantado en su rotación
        this.globeGroup.rotation.y = -1.2;
        this.scene.add(this.globeGroup);

        this.init();
        this.animate();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    init() {
        const radius = 126; // Reduced from 140 (10% smaller)
        const segments = 30000; // Increased density for sharp continents
        
        const positions = new Float32Array(segments * 3);
        const colors = new Float32Array(segments * 3);
        const sizes = new Float32Array(segments);
        let activeCount = 0;

        const color = new THREE.Color(themeColor('--color-celeste'));

        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';
        loader.load('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg', (texture) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = texture.image;
            canvas.width = 1024;
            canvas.height = 512;
            ctx.drawImage(img, 0, 0, 1024, 512);
            const imgData = ctx.getImageData(0, 0, 1024, 512).data;

            for (let i = 0; i < segments; i++) {
                const phi = Math.acos(-1 + (2 * i) / segments);
                const theta = Math.sqrt(segments * Math.PI) * phi;

                const x = radius * Math.cos(theta) * Math.sin(phi);
                const y = radius * Math.sin(theta) * Math.sin(phi);
                const z = radius * Math.cos(phi);

                // FIXED: Using atan2(z, x) for standard longitudinal alignment (u=0.5 at lon=0)
                const u = 0.5 + Math.atan2(z, x) / (2 * Math.PI);
                const v = 0.5 - Math.asin(y / radius) / Math.PI;

                const tx = Math.floor(u * 1024);
                const ty = Math.floor(v * 512);
                const index = (ty * 1024 + tx) * 4;

                // Condition to keep points ONLY on land
                if (imgData[index] > 150) { 
                    positions[activeCount * 3] = x;
                    positions[activeCount * 3 + 1] = y;
                    positions[activeCount * 3 + 2] = z;
                    colors[activeCount * 3] = color.r;
                    colors[activeCount * 3 + 1] = color.g;
                    colors[activeCount * 3 + 2] = color.b;
                    sizes[activeCount] = Math.random() * 1.2 + 0.5;
                    activeCount++;
                }
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions.slice(0, activeCount * 3), 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors.slice(0, activeCount * 3), 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes.slice(0, activeCount), 1));

            const material = new THREE.PointsMaterial({
                size: 1.8, // Increased from 1.2
                vertexColors: true,
                transparent: true,
                opacity: 1.0, // Full opacity for intensity
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });

            this.points = new THREE.Points(geometry, material);
            this.globeGroup.add(this.points);

            // Add client markers after globe is ready
            this.addMarkers(radius);
        });

        // Inner glowing sphere
        const sphereGeom = new THREE.SphereGeometry(radius - 2, 32, 32);
        const sphereMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(themeColor('--color-celeste')),
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const innerSphere = new THREE.Mesh(sphereGeom, sphereMat);
        this.globeGroup.add(innerSphere);

        // Atmosphere glow
        const atmoGeom = new THREE.SphereGeometry(radius * 1.15, 32, 32);
        const atmoMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(themeColor('--color-celeste')),
            transparent: true,
            opacity: 0.03,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmoGeom, atmoMat);
        this.scene.add(atmosphere);
    }

    addMarkers(radius) {
        const locations = [
            { name: 'México', lat: 19.4326, lon: -99.1332 },
            { name: 'Colombia', lat: 4.7110, lon: -74.0721 },
            { name: 'Argentina', lat: -34.6037, lon: -58.3816 },
            { name: 'España', lat: 40.4168, lon: -3.7038 }
        ];

        locations.forEach(loc => {
            const position = this.latLongToVector3(loc.lat, loc.lon, radius + 2);
            
            // Marker point
            const markerGeom = new THREE.SphereGeometry(1.5, 16, 16);
            const markerMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(themeColor('--color-white')) });
            const marker = new THREE.Mesh(markerGeom, markerMat);
            marker.position.copy(position);
            this.globeGroup.add(marker);

            // Glowing ring (ping effect)
            const ringGeom = new THREE.RingGeometry(2, 4, 32);
            const ringMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(themeColor('--color-celeste')),
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.position.copy(position);
            ring.lookAt(new THREE.Vector3(0, 0, 0));
            
            // Animation data
            ring.userData = { scale: 1, opacity: 0.8 };
            this.globeGroup.add(ring);
            
            if (!this.pings) this.pings = [];
            this.pings.push(ring);

            // Add Label
            this.addLabel(loc.name, position);
        });
    }

    addLabel(text, position) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        ctx.font = 'Bold 24px Poppins, Arial';
        ctx.fillStyle = `rgba(${themeColor('--white-rgb')}, 0.9)`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        ctx.fillText(text.toUpperCase(), 10, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ 
            map: texture,
            transparent: true,
            sizeAttenuation: true
        });

        const sprite = new THREE.Sprite(spriteMat);
        const labelPos = position.clone().multiplyScalar(1.08);
        sprite.position.copy(labelPos);
        sprite.scale.set(40, 10, 1);
        
        this.globeGroup.add(sprite);
    }

    latLongToVector3(lat, lon, radius) {
        // Recalibrated for standard equirectangular mapping used in the particle globe
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = radius * Math.sin(phi) * Math.sin(theta);
        const y = radius * Math.cos(phi);

        return new THREE.Vector3(x, y, z);
    }

    onWindowResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.globeGroup) {
            this.globeGroup.rotation.y -= 0.005; // Inverted from +=
        }

        // Animate pings
        if (this.pings) {
            this.pings.forEach(ring => {
                ring.userData.scale += 0.02;
                ring.userData.opacity -= 0.015;

                if (ring.userData.opacity <= 0) {
                    ring.userData.scale = 1;
                    ring.userData.opacity = 0.8;
                }

                ring.scale.set(ring.userData.scale, ring.userData.scale, ring.userData.scale);
                ring.material.opacity = ring.userData.opacity;
            });
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new HolographicGlobe('globe-3d-container');
});
