import { Application } from "pixi.js";
import { getCurrentProjectState } from "../state/ProjectState";
import { RveElements } from "../state/VideoJSON";
import { Clock } from "./Clock";
import { renderProjectRoot } from "./ProjectRoot";

export const initializePixiRenderer = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const app = new Application({
    height,
    width,
    background: "#145834",
    resolution: 4,
  });
  const project = getCurrentProjectState();
  renderProjectRoot(app, project, { height, width });

  // for testing purposes
  const play = document.getElementById("play");
  play?.addEventListener("click", () => {
    Clock.play();
  });
  const pause = document.getElementById("pause");
  pause?.addEventListener("click", () => {
    Clock.pause();
  });

  const remove = document.getElementById("remove");
  remove?.addEventListener("click", () => {
    project.elements = Object.entries(project.elements)
      .filter(([key, element]) => element.asset.kind !== "Spokesperson")
      .reduce<RveElements>((acc, [key, element]) => {
        acc[key] = element;
        return acc;
      }, {});
  });
  const add = document.getElementById("add");
  add?.addEventListener("click", () => {
    project.elements = getCurrentProjectState().elements;
  });

  return app.view as unknown as Node;
};
