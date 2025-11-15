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

  private readonly PAGE_COUNT = 28;

  private rootGroup = new THREE.Group();
  private prevTime = performance.now();

  private targetTiltX = 0;
  private targetTiltY = 0;
  private currentTiltX = 0;
  private currentTiltY = 0;

  init(container: HTMLElement): void {
    this.dispose();

    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.add(this.rootGroup);

    this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

    this.targetTiltY = x * 0.18;
    this.targetTiltX = -y * 0.14;
  }

  dispose(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = undefined;
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

    this.pageInstances = [];

    const baseGeometry = new THREE.PlaneGeometry(0.4, 0.28, 6, 2);

    for (let i = 0; i < this.PAGE_COUNT; i++) {
      const particle = this.createParticle();

      const texture = this.createJournalPageTexture();

      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.55,
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
    const size = 512;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#F5E6D3';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 1200; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const opacity = Math.random() * 0.08;
      ctx.fillStyle = `rgba(100, 74, 115, ${opacity})`;
      ctx.fillRect(x, y, 1, 1);
    }

    ctx.strokeStyle = 'rgba(200, 190, 234, 0.35)';
    ctx.lineWidth = 1.5;
    const lineSpacing = 28;
    const marginTop = 40;

    for (let y = marginTop; y < size - 20; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(size - 30, y);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(238, 201, 210, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 20);
    ctx.lineTo(60, size - 20);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(100, 74, 115, 0.25)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    for (let y = marginTop; y < size - 20; y += lineSpacing) {
      const numMarks = Math.floor(Math.random() * 3) + 2;
      let xPos = 70;

      for (let m = 0; m < numMarks; m++) {
        const markLength = Math.random() * 80 + 40;
        const yOffset = Math.random() * 3 - 1.5;

        ctx.beginPath();
        ctx.moveTo(xPos, y + yOffset);
        ctx.lineTo(xPos + markLength, y + yOffset);
        ctx.stroke();

        xPos += markLength + (Math.random() * 15 + 8);

        if (xPos > size - 60) break;
      }
    }

    ctx.strokeStyle = 'rgba(100, 74, 115, 0.3)';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, size - 16, size - 16);

    const edgeGradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      size / 3,
      size / 2,
      size / 2,
      size / 1.5
    );
    edgeGradient.addColorStop(0, 'rgba(100, 74, 115, 0)');
    edgeGradient.addColorStop(1, 'rgba(100, 74, 115, 0.08)');
    ctx.fillStyle = edgeGradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;

    return texture;
  }

  private createParticle(): PageParticle {
    const startX = THREE.MathUtils.randFloat(-0.28, 0.28);
    const startY = THREE.MathUtils.randFloat(-3.0, -2.6);

    const driftX = THREE.MathUtils.randFloat(-2.6, 2.6);

    return {
      startX,
      startY,
      driftX,
      progress: Math.random(),
      speed: THREE.MathUtils.randFloat(0.1, 0.18),
      swayAmp: THREE.MathUtils.randFloat(0.06, 0.18),
      swaySpeed: THREE.MathUtils.randFloat(0.9, 1.6),
      phase: Math.random() * Math.PI * 2,
      spinSpeed: THREE.MathUtils.randFloat(1.2, 2.2),
      z: THREE.MathUtils.randFloat(-3.0, -2.0),
      scale: THREE.MathUtils.randFloat(0.65, 0.9),
    };
  }

  private progressToY(startY: number, progress: number): number {
    const eased = 1 - Math.pow(1 - progress, 2.0);
    const endY = 3.8;
    return THREE.MathUtils.lerp(startY, endY, eased);
  }

  private getPagePosition(
    p: PageParticle,
    progress: number,
    time: number
  ): THREE.Vector3 {
    const y = this.progressToY(p.startY, progress);

    const eased = progress;
    const baseX = p.startX + p.driftX * eased;

    const sway =
      Math.sin(p.phase + time * p.swaySpeed) *
      p.swayAmp *
      (0.6 + 0.4 * (1 - progress));

    const x = baseX + sway;

    return new THREE.Vector3(x, y, p.z);
  }

  private getPageRotation(
    p: PageParticle,
    time: number,
    progress: number
  ): THREE.Euler {
    const flutterPhase = time * p.spinSpeed + p.phase;
    const flutter = Math.sin(flutterPhase);
    const bank = Math.cos(flutterPhase * 0.8 + p.phase);

    const intensity = 0.5 + 0.7 * (1 - progress);

    const rx = flutter * 0.9 * intensity;
    const ry = bank * 0.8 * intensity;

    const direction = p.driftX >= 0 ? 1 : -1;
    const baseSpin = direction * 0.6 * progress;
    const wobble = Math.sin(flutterPhase * 0.6) * 0.2 * intensity;

    const rz = baseSpin + wobble;

    return new THREE.Euler(rx, ry, rz);
  }

  private applyBend(inst: PageInstance, time: number, progress: number): void {
    const { mesh, basePositions } = inst;
    const geom = mesh.geometry as THREE.PlaneGeometry;
    const posAttr = geom.attributes['position'] as THREE.BufferAttribute;
    const positions = posAttr.array as Float32Array;

    const flutterFactor =
      Math.sin(time * 2.0 + inst.particle.phase) * 0.5 + 0.5;
    const intensity = 0.35 + 0.7 * (1 - progress);
    const bendStrength = 0.18 * flutterFactor * intensity;

    const halfWidth = 0.4 / 2;

    for (let i = 0; i < positions.length; i += 3) {
      const baseX = basePositions[i];
      const baseY = basePositions[i + 1];
      const baseZ = basePositions[i + 2];

      const nx = baseX / halfWidth;
      const curve = Math.sin(nx * Math.PI);

      const zOffset = curve * bendStrength;

      positions[i] = baseX;
      positions[i + 1] = baseY;
      positions[i + 2] = baseZ + zOffset;
    }

    posAttr.needsUpdate = true;
  }

  private animate(): void {
    if (!this.scene || !this.camera || !this.renderer) return;

    const now = performance.now();
    const delta = (now - this.prevTime) / 1000;
    this.prevTime = now;
    const t = now / 1000;

    this.currentTiltX = THREE.MathUtils.lerp(
      this.currentTiltX,
      this.targetTiltX,
      0.08
    );
    this.currentTiltY = THREE.MathUtils.lerp(
      this.currentTiltY,
      this.targetTiltY,
      0.08
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

      const fadeInDuration = 0.15;
      const fadeOutStart = 0.9;

      let opacity = 0.55;

      if (p.progress < fadeInDuration) {
        opacity = (p.progress / fadeInDuration) * 0.55;
      } else if (p.progress > fadeOutStart) {
        const fadeOutProgress =
          (p.progress - fadeOutStart) / (1 - fadeOutStart);
        opacity = 0.55 * (1 - fadeOutProgress);
      }

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
