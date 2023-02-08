import { initializePixiRenderer } from "./pixi-renderer/Renderer";
import "./style.css";

const main = () => {
  // load the pixi renderer
  // on window unload, destroy the renderer
  const app = document.getElementById("app");
  if (app) {
    const canvas = initializePixiRenderer({ width: 200, height: 112.5 });
    // const canvas = initializePixiRenderer({ width: 800, height: 450 });
    app?.appendChild(canvas);
  }
};

main();
