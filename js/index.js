import { render } from "./3d.js";

render({
  DOMElement: document.querySelector("#mod"),
  OBJPath: "../model/PRAILLON_06082020_simplified_3d_mesh.obj",
  MTLPath: "../model/PRAILLON_06082020_simplified_3d_mesh.mtl",
  background: 0x121212,
  lightIntensity: 0.9,
});
