import Experience from "../Experience";
import Portal from "./Portal";
import Particles from "./Particles";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Listeners
    this.resources.on("ready", () => {
      // Setup
      this.portal = new Portal();
      this.particles = new Particles();
    });
  }

  resize() {
    this.particles.resize();
  }

  update() {
    this.portal?.update?.();
    this.particles?.update?.();
  }
}
