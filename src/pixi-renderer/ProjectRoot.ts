import { Application, Assets, Container, Text } from "pixi.js";
import { RveVideo } from "../state/VideoJSON";
import { Clock } from "./Clock";
import { renderImage, renderText } from "./ProjectElement";

export const fetchProjectAssets = async (project: RveVideo) => {
  const keys = Object.entries(project.elements)
    .map(([key, element]) => {
      if (element.asset.kind === "Image") {
        return [key, element.asset.url];
      } else if (element.asset.kind === "Spokesperson")
        return [key, element.asset.thumbnailUrl];
      else return [key, null];
    })
    .filter(([key, url]) => url !== null)
    .map(([key, url]) => {
      if (key && url) {
        Assets.add(key, url);
        return key;
      }
      return "";
    });
  return Assets.load(keys);
};

const getTimeOfElement = (
  timeMap: { [key: string]: number },
  timeId: string,
  offset: number
) => {
  return (timeMap[timeId] || 0) + offset;
};

export const renderProjectRoot = (
  app: Application,
  project: RveVideo,
  dimensions: {
    height: number;
    width: number;
  }
) => {
  let areAssetsLoaded = false;
  let assetMap: Record<string, any>;
  fetchProjectAssets(project).then((assets) => {
    areAssetsLoaded = true;
    assetMap = assets;
  });
  app.ticker.add(() => {
    const currentTime = Clock.getTime();
    app.stage.removeChildren();
    if (!areAssetsLoaded) return;
    const container = new Container();
    const { timeMap } = project.timeline.reduce<{
      sum: number;
      timeMap: { [key: string]: number };
    }>(
      (acc, timeline) => {
        acc.timeMap[timeline.id] = acc.sum;
        acc.sum += timeline.time;
        return acc;
      },
      { sum: 0, timeMap: {} }
    );
    Object.entries(project.elements)
      .filter(([key, element]) => {
        const startTime = getTimeOfElement(
          timeMap,
          element.startTime.timeframeId,
          element.startTime.offset as number
        );
        const endTime = getTimeOfElement(
          timeMap,
          element.endTime.timeframeId,
          element.endTime.offset as number
        );
        return currentTime >= startTime && currentTime < endTime;
      })
      .sort(([key1, element1], [key2, element2]) => {
        return (element1.style.zIndex || 0) - (element2.style.zIndex || 0);
      })
      .map(([key, element]) => {
        if (
          element.asset.kind === "Image" ||
          element.asset.kind === "Spokesperson"
        ) {
          const child = renderImage({
            id: element.id,
            element,
            assetMap,
            dimensions: dimensions,
          });
          if (child) container.addChild(child);
        } else if (element.asset.kind === "Text") {
          const child = renderText({
            id: element.id,
            element,
            assetMap,
            dimensions: dimensions,
          });
          if (child) container.addChild(child);
        }
      });
    app.stage.addChild(container);
  });
};
