import { render } from './3d.js';

const params = new URLSearchParams(window.location.search);

const OBJPath = params.get('obj');
const MTLPath = params.get('mtl');
const background = `#${params.get('background')}`;
const fov = params.get('fov');
const lightSkyColor = params.get('lightSkyColor');
const lightGroudnColor = params.get('lightGroundColor');
const fitRatio = params.get('fitRatio');

fetch(MTLPath);
fetch(OBJPath);

render({
  DOMElement: document.querySelector('#mod'),
  OBJPath,
  MTLPath,
  background,
  fov,
  lightSkyColor,
  lightGroudnColor,
  fitRatio,
});
