import { Injectable, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { COLORS } from '../../shared/constants/colors.constants';

@Injectable({
  providedIn: 'root',
})
export class ThreeParticleService implements OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particles!: THREE.Points;
  private mouse = { x: 0, y: 0 };
  private targetMouse = { x: 0, y: 0 };
  private animationId: number | null = null;

  init(container: HTMLElement): void {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    this.createParticles();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xc8beea, 1, 100);
    pointLight.position.set(0, 0, 10);
    this.scene.add(pointLight);

    this.animate();

    window.addEventListener('resize', () => this.onWindowResize(container));
  }

  private createParticles(): void {
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color(COLORS.lavender),
      new THREE.Color(COLORS.rose),
      new THREE.Color(COLORS.gold),
      new THREE.Color(COLORS.bluemist),
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] = (Math.random() - 0.5) * 10;
      positions[i3 + 1] = Math.random() * 10 - 5;
      positions[i3 + 2] = (Math.random() - 0.5) * 5;

      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 0.05 + 0.02;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    if (this.particles) {
      const positions = this.particles.geometry.attributes['position'];
      const array = positions.array as Float32Array;

      for (let i = 0; i < positions.count; i++) {
        const i3 = i * 3;

        array[i3 + 1] += 0.01;

        if (array[i3 + 1] > 5) {
          array[i3 + 1] = -5;
        }

        const dx = array[i3] - this.mouse.x * 5;
        const dy = array[i3 + 1] - this.mouse.y * 5;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 2) {
          array[i3] += dx * 0.01;
          array[i3 + 1] += dy * 0.01;
        }
      }

      positions.needsUpdate = true;

      this.particles.rotation.y += 0.0005;
    }

    this.renderer.render(this.scene, this.camera);
  }

  onMouseMove(event: MouseEvent, container: HTMLElement): void {
    this.targetMouse.x = (event.clientX / container.clientWidth) * 2 - 1;
    this.targetMouse.y = -(event.clientY / container.clientHeight) * 2 + 1;
  }

  private onWindowResize(container: HTMLElement): void {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this.particles) {
      this.particles.geometry.dispose();
      (this.particles.material as THREE.Material).dispose();
    }
  }

  ngOnDestroy(): void {
    this.dispose();
  }
}
