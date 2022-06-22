import * as THREE from "three";
import Experience from "../Experience";

import vertexShader from "./shaders/particles/vertex";
import fragmentShader from "./shaders/particles/fragment";

export default class Particles {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.time = this.experience.time;

    this.debug = this.experience.debug;
    this.debugObject = {
      count: 30,
      size: 200,
      strength: 0.03,
    };

    this.setGeometry();
    this.setMaterials();
    this.setParticles();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Particles");

      const { uSize, uStrength } = this.material.uniforms;
      this.debugFolder.add(uSize, "value").min(1).max(500).step(1).name("Size");
      this.debugFolder
        .add(uStrength, "value")
        .min(0.001)
        .max(2)
        .step(0.001)
        .name("Strength");
    }
  }

  setGeometry() {
    this.geometry = new THREE.BufferGeometry();

    const { count } = this.debugObject;

    const positionArray = new Float32Array(count * 3);
    const scaleArray = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positionArray[i * 3] = (Math.random() - 0.5) * 4;
      positionArray[i * 3 + 1] = Math.random() * 2;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

      scaleArray[i] = Math.random();
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    this.geometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleArray, 1)
    );
  }

  setMaterials() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: this.debugObject.size },
        uStrength: { value: this.debugObject.strength },
        uTime: { value: this.time.elapsed },
      },
    });
  }

  setParticles() {
    this.particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particles);
  }

  resize() {
    this.material.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio,
      2
    );
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsed;
    // this.animation.mixer.update(this.time.delta * 0.001);
  }
}
