import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';
import { OBJLoader2 } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';
import { MTLLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/MTLLoader.js';
import { MtlObjBridge } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js';

export const defaults = {
  fov: 45,
  aspect: 2,
  background: 0xefefef,
  lightSkyColor: 0xffffff,
  lightIntensity: 1,
  lightGroudnColor: 0xdddddd,
  fitRatio: 1.2,
};

export const render = ({
  DOMElement,
  OBJPath,
  MTLPath,
  fov,
  aspect,
  background,
  lightSkyColor,
  lightIntensity,
  lightGroudnColor,
  fitRatio = 1,
}) => {
  fov = fov || defaults.fov;
  aspect = aspect || defaults.aspect;
  background = background || defaults.background;
  lightSkyColor = lightSkyColor || defaults.lightSkyColor;
  lightIntensity = lightIntensity || defaults.lightIntensity;
  lightGroudnColor = lightGroudnColor || defaults.lightGroudnColor;
  fitRatio = fitRatio || defaults.fitRatio;

  const renderer = new THREE.WebGLRenderer({ canvas: DOMElement });
  const camera = new THREE.PerspectiveCamera(fov, aspect);

  // Orbit Controls
  const controls = new OrbitControls(camera, DOMElement);
  controls.target.set(0, 0, 0);
  controls.update();

  // Scene
  const scene = new THREE.Scene();
  scene.rotateX((-90 * Math.PI) / 180);
  scene.background = new THREE.Color(background);

  // Light
  const light = new THREE.HemisphereLight(
    lightSkyColor,
    lightGroudnColor,
    lightIntensity
  );
  scene.add(light);

  // Load 3d model
  const objLoader = new OBJLoader2();
  const mtlLoader = new MTLLoader();

  mtlLoader.load(
    MTLPath,
    (MTLRes) => {
      const materials = MtlObjBridge.addMaterialsFromMtlLoader(MTLRes);
      for (const m of Object.values(materials)) m.side = THREE.DoubleSide;
      objLoader.addMaterials(materials);

      objLoader.load(
        OBJPath,
        (OBJRes) => {
          scene.add(OBJRes);

          // Adapt camera to model
          const box = new THREE.Box3().setFromObject(OBJRes);
          const boxSize = box.getSize(new THREE.Vector3()).length();
          const boxCenter = box.getCenter(new THREE.Vector3());
          const sizeToFit = boxSize * fitRatio;
          const halfFovY = THREE.MathUtils.degToRad(camera.fov * 0.5);
          const distance = (sizeToFit * 0.5) / Math.tan(halfFovY);
          const direction = new THREE.Vector3()
            .subVectors(camera.position, boxCenter)
            .multiply(new THREE.Vector3(1, 0.05, 1))
            .normalize();

          camera.position.copy(
            direction.multiplyScalar(distance).add(boxCenter)
          );
          camera.near = boxSize / 100;
          camera.far = boxSize * 100;
          camera.updateProjectionMatrix();
          camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);

          controls.maxDistance = boxSize * 10;
          controls.target.copy(boxCenter);
          controls.update();

          // Hide loader and show canvas
          document.querySelector('#loader').style.visibility = 'hidden';
          DOMElement.style.visibility = 'visible';
        },
        (xhp) => console.log(`OBJ: ${xhp.loaded} ${xhp.total}`),
        () => console.log('OBJ Error')
      );
    },
    (xhp) => console.log(`MTL: ${(xhp.loaded / xhp.total) * 100}`),
    () => console.log('MTL Error')
  );

  // Handle frame
  const frameHandler = () => {
    const c = renderer.domElement;
    if (c.width !== c.clientWidth || c.height !== c.clientHeight) {
      renderer.setSize(c.clientWidth, c.clientHeight, false);
      camera.aspect = c.clientWidth / c.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(frameHandler);
  };

  requestAnimationFrame(frameHandler);
};
