import { Injectable } from '@angular/core';
import * as THREE from 'three';

interface ProtectiveSymbol {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  rotation: THREE.Vector3;
  scale: number;
}

@Injectable({ providedIn: 'root' })
export class ProtectiveSymbolsService {
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private symbols: ProtectiveSymbol[] = [];
  private animationId?: number;

  init(container: HTMLElement): void {
    this.dispose();

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    this.camera.position.z = 20;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    this.createProtectiveSymbols();
    this.animate();

    window.addEventListener('resize', () => this.onResize(container));
  }

  private createProtectiveSymbols(): void {
    const colors = [0xc8beea, 0xeec9d2, 0xf4d292, 0xa8c2d1];
    const symbolCount = 12;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene?.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(10, 10, 10);
    this.scene?.add(pointLight);

    for (let i = 0; i < symbolCount; i++) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      const color = colors[colorIndex];

      // Create shield shape
      const geometry = this.createShieldGeometry();
      const material = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
        shininess: 60,
      });

      const mesh = new THREE.Mesh(geometry, material);

      // Position
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 - 5
      );

      const scale = 0.3 + Math.random() * 0.4;
      mesh.scale.setScalar(scale);

      // Gentle rotation
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const symbol: ProtectiveSymbol = {
        mesh: mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.005
        ),
        rotation: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        ),
        scale: scale,
      };

      this.symbols.push(symbol);
      this.scene?.add(mesh);
    }
  }

  private createShieldGeometry(): THREE.ExtrudeGeometry {
    const shape = new THREE.Shape();

    shape.moveTo(0, 1.5);
    shape.bezierCurveTo(0.8, 1.5, 1.2, 1.2, 1.2, 0.5);
    shape.lineTo(1.2, -0.5);
    shape.bezierCurveTo(1.2, -1.2, 0.6, -1.8, 0, -2);
    shape.bezierCurveTo(-0.6, -1.8, -1.2, -1.2, -1.2, -0.5);
    shape.lineTo(-1.2, 0.5);
    shape.bezierCurveTo(-1.2, 1.2, -0.8, 1.5, 0, 1.5);

    const extrudeSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }

  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    this.symbols.forEach((symbol) => {
      // Gentle floating motion
      symbol.mesh.position.add(symbol.velocity);

      // Soft rotation
      symbol.mesh.rotation.x += symbol.rotation.x;
      symbol.mesh.rotation.y += symbol.rotation.y;
      symbol.mesh.rotation.z += symbol.rotation.z;

      // Gentle pulsing
      const pulse =
        Math.sin(Date.now() * 0.001 + symbol.mesh.position.x) * 0.05;
      symbol.mesh.scale.setScalar(symbol.scale + pulse);

      // Boundary checks with gentle bounce
      if (Math.abs(symbol.mesh.position.x) > 20) {
        symbol.velocity.x *= -1;
      }
      if (Math.abs(symbol.mesh.position.y) > 10) {
        symbol.velocity.y *= -1;
      }
      if (symbol.mesh.position.z < -10 || symbol.mesh.position.z > 5) {
        symbol.velocity.z *= -1;
      }
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
    if (this.renderer) this.renderer.dispose();
    if (this.scene) this.scene.clear();
    this.symbols = [];
  }
}
