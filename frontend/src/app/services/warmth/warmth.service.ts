import { Injectable } from '@angular/core';
import * as THREE from 'three';

interface WarmGlow {
  light: THREE.PointLight;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  speed: number;
  intensity: number;
  pulsePhase: number;
}

@Injectable({ providedIn: 'root' })
export class WarmthService {
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private glows: WarmGlow[] = [];
  private animationId?: number;
  private lastRenderTime = 0;
  private readonly FPS_LIMIT = 30;

  init(container: HTMLElement): void {
    this.dispose();

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    this.camera.position.z = 25;

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    this.createWarmGlows();
    this.animate();

    window.addEventListener('resize', () => this.onResize(container));
  }

  private createWarmGlows(): void {
    const warmColors = [0xf4d292, 0xffe5b4, 0xeec9d2, 0xffdab9];
    const glowCount = 5; // Reduced from 8

    const ambientLight = new THREE.AmbientLight(0xfff8f0, 0.3);
    this.scene?.add(ambientLight);

    for (let i = 0; i < glowCount; i++) {
      const color = warmColors[i % warmColors.length];
      const light = new THREE.PointLight(color, 1.2, 12);

      const startPos = new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 6
      );
      light.position.copy(startPos);

      const glowGeometry = new THREE.SphereGeometry(0.4, 8, 8);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.5,
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      light.add(glowMesh);

      const targetPos = startPos.clone();

      const glow: WarmGlow = {
        light: light,
        position: startPos.clone(),
        targetPosition: targetPos,
        speed: 0.005,
        intensity: 1.0 + Math.random() * 0.4,
        pulsePhase: Math.random() * Math.PI * 2,
      };

      this.glows.push(glow);
      this.scene?.add(light);
    }
  }

  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    const now = performance.now();
    const elapsed = now - this.lastRenderTime;

    // Throttle to 30fps
    if (elapsed < 1000 / this.FPS_LIMIT) {
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }

    this.lastRenderTime = now;
    const time = now * 0.001;

    this.glows.forEach((glow) => {
      glow.position.lerp(glow.targetPosition, glow.speed);

      if (glow.position.distanceTo(glow.targetPosition) < 1) {
        glow.targetPosition.set(
          (Math.random() - 0.5) * 30,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 6
        );
      }

      glow.light.position.copy(glow.position);
      const pulse = Math.sin(time * 0.5 + glow.pulsePhase) * 0.2 + 0.8;
      glow.light.intensity = glow.intensity * pulse;
    });

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private onResize(container: HTMLElement): void {
    if (!this.camera || !this.renderer) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  dispose(): void {
    if (this.animationId) cancelAnimationFrame(this.animationId);

    this.glows.forEach((glow) => {
      glow.light.children.forEach((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    });

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
    if (this.scene) this.scene.clear();
    this.glows = [];
  }
}
