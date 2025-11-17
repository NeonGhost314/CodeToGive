import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({ providedIn: 'root' })
export class ContactCardEffectService {
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.OrthographicCamera;
  private shieldRing?: THREE.Mesh;
  private glowRings: THREE.Mesh[] = [];
  private animationId?: number;
  private isHovered = false;

  init(container: HTMLElement): void {
    this.dispose();

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();

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
      antialias: true,
      powerPreference: 'low-power',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    this.createShieldEffect();
    this.animate();
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
  }

  private createShieldEffect(): void {
    // Main shield ring
    const ringGeometry = new THREE.RingGeometry(60, 65, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xeec9d2,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
    });
    this.shieldRing = new THREE.Mesh(ringGeometry, ringMaterial);
    this.scene?.add(this.shieldRing);

    // Create multiple glow rings
    for (let i = 0; i < 3; i++) {
      const glowGeometry = new THREE.RingGeometry(70 + i * 15, 72 + i * 15, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xc8beea : 0xf4d292,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      const glowRing = new THREE.Mesh(glowGeometry, glowMaterial);
      this.glowRings.push(glowRing);
      this.scene?.add(glowRing);
    }

    // Add subtle particles
    const particleCount = 30;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 55 + Math.random() * 20;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const color = new THREE.Color(i % 2 === 0 ? 0xeec9d2 : 0xf4d292);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: 3,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene?.add(particles);
  }

  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    const time = Date.now() * 0.001;

    // Update shield ring
    if (this.shieldRing) {
      const material = this.shieldRing.material as THREE.MeshBasicMaterial;
      const targetOpacity = this.isHovered ? 0.3 : 0;
      material.opacity += (targetOpacity - material.opacity) * 0.1;

      this.shieldRing.rotation.z = time * 0.2;
    }

    // Update glow rings with wave effect
    this.glowRings.forEach((ring, index) => {
      const material = ring.material as THREE.MeshBasicMaterial;
      const targetOpacity = this.isHovered ? 0.15 : 0;
      material.opacity += (targetOpacity - material.opacity) * 0.08;

      const wave = Math.sin(time * 1.5 + index * 0.5) * 0.3 + 0.7;
      const scale = 1 + wave * 0.1;
      ring.scale.set(scale, scale, 1);
      ring.rotation.z = -time * (0.15 + index * 0.05);
    });

    // Animate particles
    const particles = this.scene.children.find(
      (child: THREE.Object3D) => child instanceof THREE.Points
    ) as THREE.Points | undefined;

    if (particles) {
      const material = particles.material as THREE.PointsMaterial;
      const targetOpacity = this.isHovered ? 0.4 : 0;
      material.opacity += (targetOpacity - material.opacity) * 0.1;

      const positions = particles.geometry.attributes['position']
        .array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const angle = (i / 3 / (positions.length / 3)) * Math.PI * 2;
        const radius = 55 + Math.sin(time * 2 + i) * 15;
        positions[i] = Math.cos(angle + time * 0.3) * radius;
        positions[i + 1] = Math.sin(angle + time * 0.3) * radius;
      }
      particles.geometry.attributes['position'].needsUpdate = true;
    }

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
    this.glowRings = [];
  }
}
