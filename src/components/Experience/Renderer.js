import * as THREE from "three";
import Experience from "./Experience";

export default class Renderer {
  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.debug = this.experience.debug;
    this.debugObject = {
      clearColor: "#2f0e11",
    };

    if (this.debug.active) {
      this.debug.ui.addColor(this.debugObject, "clearColor").onChange((val) => {
        this.instance.setClearColor(val);
      });
    }

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = THREE.sRGBEncoding;
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap;
    this.instance.setClearColor(this.debugObject.clearColor);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    // Encoding
    this.instance.outputEncoding = THREE.sRGBEncoding;
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
