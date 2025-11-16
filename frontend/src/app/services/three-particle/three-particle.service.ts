import { Injectable } from '@angular/core';
import * as THREE from 'three';

interface PageParticle {
  startX: number;
  startY: number;
  driftX: number;
  progress: number;
  speed: number;
  swayAmp: number;
  swaySpeed: number;
  phase: number;
  spinSpeed: number;
  z: number;
  scale: number;
}

interface PageInstance {
  mesh: THREE.Mesh;
  particle: PageParticle;
  basePositions: Float32Array;
}

@Injectable({ providedIn: 'root' })
export class ThreeParticleService {
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private pageInstances: PageInstance[] = [];
  private animationId?: number;
  private resizeHandler?: () => void;
  private readonly PAGE_COUNT = 15;
  private rootGroup = new THREE.Group();
  private prevTime = performance.now();
  private targetTiltX = 0;
  private targetTiltY = 0;
  private currentTiltX = 0;
  private currentTiltY = 0;
  private lastRenderTime = 0;
  private readonly FPS_LIMIT = 30;

  init(container: HTMLElement): void {
    this.dispose();

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.add(this.rootGroup);

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'low-power',
    });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    this.createPages();

    this.resizeHandler = () => this.onResize(container);
    window.addEventListener('resize', this.resizeHandler);

    this.prevTime = performance.now();
    this.animate();
  }

  onMouseMove(event: MouseEvent, container: HTMLElement): void {
    const rect = container.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    this.targetTiltY = x * 0.1;
    this.targetTiltX = -y * 0.08;
  }

  dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }

    if (this.pageInstances.length && this.scene) {
      for (const inst of this.pageInstances) {
        this.scene.remove(inst.mesh);
        inst.mesh.geometry.dispose();
        const material = inst.mesh.material as THREE.MeshBasicMaterial;
        if (material.map) material.map.dispose();
        material.dispose();
      }
    }
    this.pageInstances = [];

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }

    if (this.scene) {
      this.scene.clear();
      this.scene = undefined;
    }

    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = undefined;
    }
  }

  private createPages(): void {
    if (!this.scene) return;

    const baseGeometry = new THREE.PlaneGeometry(0.4, 0.28, 4, 2); // Reduced segments

    for (let i = 0; i < this.PAGE_COUNT; i++) {
      const particle = this.createParticle();
      const texture = this.createJournalPageTexture();

      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        map: texture,
        color: new THREE.Color('#FFFFFF'),
      });

      const geometry = baseGeometry.clone();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.setScalar(particle.scale);

      const posAttr = geometry.attributes['position'] as THREE.BufferAttribute;
      const basePositions = (posAttr.array as Float32Array).slice();

      const startPos = this.getPagePosition(particle, particle.progress, 0);
      const startRot = this.getPageRotation(particle, 0, particle.progress);

      mesh.position.copy(startPos);
      mesh.rotation.set(startRot.x, startRot.y, startRot.z);

      this.rootGroup.add(mesh);
      this.pageInstances.push({ mesh, particle, basePositions });
    }
  }

  private createJournalPageTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    const size = 256; // Reduced from 512
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#F5E6D3';
    ctx.fillRect(0, 0, size, size);

    // Simplified texture - fewer details
    ctx.strokeStyle = 'rgba(200, 190, 234, 0.3)';
    ctx.lineWidth = 1;
    const lineSpacing = 20;
    for (let y = 30; y < size - 20; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(size - 20, y);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  private createParticle(): PageParticle {
    return {
      startX: THREE.MathUtils.randFloat(-0.28, 0.28),
      startY: THREE.MathUtils.randFloat(-3.0, -2.6),
      driftX: THREE.MathUtils.randFloat(-2.6, 2.6),
      progress: Math.random(),
      speed: THREE.MathUtils.randFloat(0.08, 0.15),
      swayAmp: THREE.MathUtils.randFloat(0.06, 0.15),
      swaySpeed: THREE.MathUtils.randFloat(0.8, 1.4),
      phase: Math.random() * Math.PI * 2,
      spinSpeed: THREE.MathUtils.randFloat(1.0, 1.8),
      z: THREE.MathUtils.randFloat(-2.5, -1.5),
      scale: THREE.MathUtils.randFloat(0.7, 0.9),
    };
  }

  private progressToY(startY: number, progress: number): number {
    const eased = 1 - Math.pow(1 - progress, 2.0);
    return THREE.MathUtils.lerp(startY, 3.8, eased);
  }

  private getPagePosition(
    p: PageParticle,
    progress: number,
    time: number
  ): THREE.Vector3 {
    const y = this.progressToY(p.startY, progress);
    const baseX = p.startX + p.driftX * progress;
    const sway =
      Math.sin(p.phase + time * p.swaySpeed) *
      p.swayAmp *
      (0.6 + 0.4 * (1 - progress));
    return new THREE.Vector3(baseX + sway, y, p.z);
  }

  private getPageRotation(
    p: PageParticle,
    time: number,
    progress: number
  ): THREE.Euler {
    const flutterPhase = time * p.spinSpeed + p.phase;
    const intensity = 0.5 + 0.5 * (1 - progress);
    const rx = Math.sin(flutterPhase) * 0.7 * intensity;
    const ry = Math.cos(flutterPhase * 0.8 + p.phase) * 0.6 * intensity;
    const direction = p.driftX >= 0 ? 1 : -1;
    const rz =
      direction * 0.5 * progress +
      Math.sin(flutterPhase * 0.6) * 0.15 * intensity;
    return new THREE.Euler(rx, ry, rz);
  }

  private applyBend(inst: PageInstance, time: number, progress: number): void {
    const { mesh, basePositions } = inst;
    const geom = mesh.geometry as THREE.PlaneGeometry;
    const posAttr = geom.attributes['position'] as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;

    const intensity = 0.3 + 0.5 * (1 - progress);
    const bendStrength =
      0.12 * Math.sin(time * 1.5 + inst.particle.phase) * intensity;

    for (let i = 0; i < positions.length; i += 3) {
      const nx = basePositions[i] / 0.2;
      const zOffset = Math.sin(nx * Math.PI) * bendStrength;
      positions[i] = basePositions[i];
      positions[i + 1] = basePositions[i + 1];
      positions[i + 2] = basePositions[i + 2] + zOffset;
    }

    posAttr.needsUpdate = true;
  }

  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    const now = performance.now();
    const elapsed = now - this.lastRenderTime;

    if (elapsed < 1000 / this.FPS_LIMIT) {
      this.animationId = requestAnimationFrame(() => this.animate());
      return;
    }

    this.lastRenderTime = now;
    const delta = (now - this.prevTime) / 1000;
    this.prevTime = now;
    const t = now / 1000;

    this.currentTiltX = THREE.MathUtils.lerp(
      this.currentTiltX,
      this.targetTiltX,
      0.05
    );
    this.currentTiltY = THREE.MathUtils.lerp(
      this.currentTiltY,
      this.targetTiltY,
      0.05
    );
    this.rootGroup.rotation.x = this.currentTiltX;
    this.rootGroup.rotation.y = this.currentTiltY;

    for (let i = 0; i < this.pageInstances.length; i++) {
      const inst = this.pageInstances[i];
      let p = inst.particle;

      p.progress += p.speed * delta;
      if (p.progress > 1) {
        p = this.createParticle();
        inst.particle = p;
      }

      const pos = this.getPagePosition(p, p.progress, t);
      const rot = this.getPageRotation(p, t, p.progress);

      inst.mesh.position.copy(pos);
      inst.mesh.rotation.set(rot.x, rot.y, rot.z);
      inst.mesh.scale.setScalar(p.scale);

      let opacity = 0.45;
      if (p.progress < 0.1) opacity = (p.progress / 0.1) * 0.45;
      else if (p.progress > 0.9)
        opacity = 0.45 * (1 - (p.progress - 0.9) / 0.1);
      (inst.mesh.material as THREE.MeshBasicMaterial).opacity = opacity;

      this.applyBend(inst, t, p.progress);
    }

    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private onResize(container: HTMLElement): void {
    if (!this.renderer || !this.camera) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}
