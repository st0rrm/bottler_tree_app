import {Mesh, MeshStandardMaterial, PlaneGeometry} from "three";
const gen = require("random-seed");

export const Utils = {
  standardHeight: 1334,
  ratioScale: 0.01,
  screenWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
  screenHeight: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
  getRatio() {
    return this.ratioScale * (this.screenHeight / this.standardHeight);
  },
  getSize(width, height) {
    const ratio = this.getRatio();
    return {
      width: width * ratio,
      height: height * ratio,
    };
  },
  seed: 0,
  rand: new gen(new Date().getTime()),
  getPos(x) {
    return x * this.getRatio();
  },
  randomRange(min, max) {
    this.rand.seed(new Date().getTime());
    return this.rand.floatBetween(min, max)
  },
  randomRangeInt(min, max) {
    this.rand.seed(new Date().getTime());
    return this.rand.intBetween(min, max);
  },
  randomDirection() {
    const r = this.randomRange(-1, 1);
    return r >= 0 ? 1 : -1;
  },
};

class CustomMesh extends Mesh {
  constructor(texture, w, h, align_h = AlignH.CENTER, align_v = AlignV.MIDDLE) {
    const { width, height } = Utils.getSize(w, h);
    super(
      new PlaneGeometry(width, height),
      new MeshStandardMaterial({
        map: texture,
        transparent: true,
        // wireframe: true,
        // color: 0xFF0000,
      })
    );
    switch (align_h) {
      case AlignH.LEFT:
        this.geometry.applyMatrix4(
          new THREE.Matrix4().makeTranslation(width * -0.5, 0, 0)
        );
        break;
      case AlignH.RIGHT:
        this.geometry.applyMatrix4(
          new THREE.Matrix4().makeTranslation(width * 0.5, 0, 0)
        );
        break;
    }
    switch (align_v) {
      case AlignV.TOP:
        this.geometry.applyMatrix4(
          new THREE.Matrix4().makeTranslation(0, height * -0.5, 0)
        );
        break;
      case AlignV.BOTTOM:
        this.geometry.applyMatrix4(
          new THREE.Matrix4().makeTranslation(0, height * 0.5, 0)
        );
        break;
    }
  }
  dispose = () => {
    this.geometry.dispose();
    this.material.dispose();
  };
}

export class TreeMesh extends CustomMesh {
  constructor(texture, w, h) {
    super(texture, w, h, AlignH.CENTER, AlignV.BOTTOM);
  }
}

export const AlignV = {
  TOP: "top",
  MIDDLE: "middle",
  BOTTOM: "bottom",
};
export const AlignH = {
  LEFT: "left",
  CENTER: "center",
  RIGHT: "right",
};


const createCustomMesh = (texture, w, h, align_h = AlignH.CENTER, align_v = AlignV.MIDDLE) => {
  const { width, height } = Utils.getSize(w, h);
  const geometry = new THREE.PlaneGeometry(width, height);
  const material = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    // wireframe: true,
    // color: 0xFF0000,
  });

  switch (align_h) {
    case AlignH.LEFT:
      geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(width * -0.5, 0, 0));
      break;
    case AlignH.RIGHT:
      geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(width * 0.5, 0, 0));
      break;
  }

  switch (align_v) {
    case AlignV.TOP:
      geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, height * -0.5, 0));
      break;
    case AlignV.BOTTOM:
      geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, height * 0.5, 0));
      break;
  }

  const mesh = new THREE.Mesh(geometry, material);

  const dispose = () => {
    geometry.dispose();
    material.dispose();
  };

  return { mesh, dispose };
};

const createTreeMesh = (texture, w, h) => {
  return createCustomMesh(texture, w, h, AlignH.CENTER, AlignV.BOTTOM);
};
