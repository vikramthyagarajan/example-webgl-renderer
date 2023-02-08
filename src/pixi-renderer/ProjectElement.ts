import { Container, Sprite, Text } from "pixi.js";
import { RveElement, RveSceneElementAssetImage } from "../state/VideoJSON";

const getPositionFromStyle = (
  style: any,
  dimensions: { height: number; width: number }
) => {
  let x = 0,
    y = 0,
    height = 0,
    width = 0;
  if (style.height === "100%") height = dimensions.height;
  else {
    height = style.height.split("em")[0] * (dimensions.width / 100);
  }
  if (style.width === "100%") width = dimensions.width;
  else {
    width = style.width.split("em")[0] * (dimensions.width / 100);
  }
  if (style.left) x = style.left.split("em")[0] * (dimensions.width / 100);
  if (style.bottom)
    y =
      dimensions.height -
      style.bottom.split("em")[0] * (dimensions.width / 100) -
      height;

  return { x, y, height, width };
};

export const renderImage = ({
  id,
  element,
  assetMap,
  dimensions,
}: {
  id: string;
  dimensions: {
    width: number;
    height: number;
  };
  element: RveElement;
  assetMap: Record<string, any>;
}) => {
  const texture = assetMap[id];
  if (!texture) return;
  const image = Sprite.from(texture);
  const { x, y, height, width } = getPositionFromStyle(
    element.style,
    dimensions
  );
  image.x = x;
  image.y = y;
  image.height = height;
  image.width = width;
  return image;
};

export const renderText = ({
  id,
  element,
  assetMap,
  dimensions,
}: {
  id: string;
  dimensions: {
    width: number;
    height: number;
  };
  element: RveElement;
  assetMap: Record<string, any>;
}) => {
  const fontSize = (element.style.fontSize || 1) * (dimensions.width / 100);
  let text = new Text("Added some text", {
    fontSize,
    align: element.style.align,
    fill: element.style.fontColor || "#000000",
    // fontFamily: element.style.fontFamily,
    wordWrap: true,
    wordWrapWidth: 180,
  });
  const { x, y, height, width } = getPositionFromStyle(
    element.style,
    dimensions
  );
  text.x = x;
  text.y = y;
  text.height = height;
  text.width = width;
  return text;
};
