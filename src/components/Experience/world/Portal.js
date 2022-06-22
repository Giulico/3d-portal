import * as THREE from "three";
import Experience from "../Experience";

import vertexShader from "./shaders/portal/vertex";
import fragmentShader from "./shaders/portal/fragment";

export default class Portal {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.portalModel;

    this.texture = this.resources.items.bakedTexture;
    this.texture.flipY = false;
    this.texture.encoding = THREE.sRGBEncoding;

    this.time = this.experience.time;

    this.debug = this.experience.debug;
    this.debugObject = {
      colorStart: new THREE.Color(0xf953eb),
      colorEnd: new THREE.Color(0xffc7f3),
    };

    this.setMaterials();
    this.setModel();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("Portal");

      this.debugFolder
        .addColor(this.debugObject, "colorStart")
        .name("Color Start")
        .onChange(() => {
          this.portalLightMaterial.uniforms.uColorStart.value =
            this.debugObject.colorStart;
        });
      this.debugFolder
        .addColor(this.debugObject, "colorEnd")
        .name("Color End")
        .onChange(() => {
          this.portalLightMaterial.uniforms.uColorEnd.value =
            this.debugObject.colorEnd;
        });
    }
  }

  setMaterials() {
    this.sceneMaterial = new THREE.MeshBasicMaterial({
      map: this.texture,
    });

    this.poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });

    this.portalLightMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        uColorStart: { value: this.debugObject.colorStart },
        uColorEnd: { value: this.debugObject.colorEnd },
      },
    });
  }

  setModel() {
    this.model = this.resource.scene;
    this.scene.add(this.model);

    const meshes = this.model.children;

    const bakedMesh = meshes.find((m) => m.name === "baked");
    bakedMesh.material = this.sceneMaterial;

    const poleLightLMesh = meshes.find((m) => m.name === "poleLightL");
    poleLightLMesh.material = this.poleLightMaterial;

    const poleLightRMesh = meshes.find((m) => m.name === "poleLightR");
    poleLightRMesh.material = this.poleLightMaterial;

    const portalLightMesh = meshes.find((m) => m.name === "portalLight");
    portalLightMesh.material = this.portalLightMaterial;
  }

  update() {
    this.portalLightMaterial.uniforms.uTime.value = this.time.elapsed;
  }
}
