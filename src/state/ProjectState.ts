import Fixture from "./fixture.json";
import { RveVideo } from "./VideoJSON";

export const getCurrentProjectState = () => {
  return JSON.parse(JSON.stringify(Fixture)) as unknown as RveVideo;
};
