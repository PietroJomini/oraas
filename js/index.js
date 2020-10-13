import { render } from "./3d.js";

const params = new URLSearchParams(window.location.search);

const OBJPath = params.get("obj");
const MTLPath = params.get("mtl");
const background = `#${params.get("background")}`;

render({
  DOMElement: document.querySelector("#mod"),
  OBJPath,
  MTLPath,
  background,
});
