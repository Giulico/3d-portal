import * as THREE from "three";
import Sizes from "./utils/Sizes";
import Time from "./utils/Time";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./world/World";
import Resources from "./utils/Resources";
import sources from "./sources";

import Debug from "./utils/Debug";

let instance = null;

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance;
    }

    // Singleton
    instance = this;

    // Global access
    window.experience = this;

    this.canvas = canvas;

    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();

    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    this.sizes.on("resize", this.resize.bind(this));
    this.time.on("tick", this.update.bind(this));
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.world.resize();
  }

  update() {
    this.world.update();
    this.camera.update();
    this.renderer.update();
  }

  destroy() {
    // Remove listeners
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse the whole scene and dispose
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];
          if (typeof value?.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    // dispose camera
    this.camera.controls.dispose();
    // dispose renderer
    this.renderer.instance.dispose();

    // dispose debug
    if (this.debug.active) {
      this.debug.ui.destroy();
    }
  }
}
