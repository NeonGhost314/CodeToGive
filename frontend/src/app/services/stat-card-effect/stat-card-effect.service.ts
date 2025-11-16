import { Injectable } from '@angular/core';
import * as THREE from 'three';

interface CardParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class StatCardEffectService {
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.OrthographicCamera;
  private particles: CardParticle[] = [];
  private particleMesh?: THREE.Points;
  private animationId?: number;
  private isHovered = false;
  private mouseX = 0;
  private mouseY = 0;

  init(container: HTMLElement, color: string): void {
    this.dispose();

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();

    // Use orthographic camera for 2D effect
    this.camera = new THREE.OrthographicCamera(
      -width / 2,
      width / 2,
      height / 2,
      -height / 2,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    this.createParticleSystem(color);
    this.animate();
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  onMouseMove(event: MouseEvent, container: HTMLElement): void {
    const rect = container.getBoundingClientRect();
    this.mouseX = event.clientX - rect.left - rect.width / 2;
    this.mouseY = -(event.clientY - rect.top - rect.height / 2);
  }

  private createParticleSystem(colorHex: string): void {
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const color = new THREE.Color(colorHex);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 80 + Math.random() * 40;

      const particle: CardParticle = {
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          0
        ),
        life: Math.random(),
        maxLife: 1,
        size: 2 + Math.random() * 3,
      };

      this.particles.push(particle);

      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = particle.size;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 4,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: false,
    });

    this.particleMesh = new THREE.Points(geometry, material);
    this.scene?.add(this.particleMesh);
  }

  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer || !this.particleMesh)
      return;

    const positions = this.particleMesh.geometry.attributes['position']
      .array as Float32Array;
    const sizes = this.particleMesh.geometry.attributes['size']
      .array as Float32Array;
    const material = this.particleMesh.material as THREE.PointsMaterial;

    // Update target opacity based on hover
    const targetOpacity = this.isHovered ? 0.6 : 0;
    material.opacity += (targetOpacity - material.opacity) * 0.1;

    this.particles.forEach((particle, i) => {
      // Orbit motion
      const angle =
        (i / this.particles.length) * Math.PI * 2 + Date.now() * 0.0002;
      const baseRadius = 80;
      const orbitRadius = baseRadius + Math.sin(Date.now() * 0.001 + i) * 15;

      // Add mouse attraction when hovered
      let targetX = Math.cos(angle) * orbitRadius;
      let targetY = Math.sin(angle) * orbitRadius;

      if (this.isHovered) {
        const dx = this.mouseX - particle.position.x;
        const dy = this.mouseY - particle.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          const force = (1 - dist / 100) * 0.5;
          targetX += dx * force;
          targetY += dy * force;
        }
      }

      particle.position.x += (targetX - particle.position.x) * 0.05;
      particle.position.y += (targetY - particle.position.y) * 0.05;

      // Gentle pulsing
      const pulse = Math.sin(Date.now() * 0.002 + i * 0.5) * 0.5 + 0.5;
      const size = particle.size * (0.8 + pulse * 0.4);

      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      sizes[i] = size;
    });

    this.particleMesh.geometry.attributes['position'].needsUpdate = true;
    this.particleMesh.geometry.attributes['size'].needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  dispose(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
    if (this.scene) this.scene.clear();
    this.particles = [];
  }
}
