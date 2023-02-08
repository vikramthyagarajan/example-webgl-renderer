// This doesn't belong here, should live in multiscene-preview repo but whatever

import { CSSProperties } from "react";

export type Url = string;

// // SceneElement isn't a great prefix, will be renamed later when we change structure
// // it's fine for now
export const RveSceneElementAssetKind = {
  IMAGE: "Image",
  VIDEO: "Video",
  SPOKESPERSON_VIDEO: "Spokesperson",
} as const;
type $Values<O extends object> = O[keyof O];
export type RveSceneElementAssetKindType = $Values<
  typeof RveSceneElementAssetKind
>;

export interface RveSceneElementAssetImage {
  isPersonalized: boolean;
  kind: "Image";
  use: string;
  url: string;
  thumbnailUrl: String;
}

export interface RveSceneElementAssetVideo {
  kind: "Spokesperson";
  spokespersonVideo: RveSpokespersonVideoAssetExtras;
  spokespersonAudio: RveSpokespersonAudioExtras;
  generateFromRecordedVideo?: boolean;
  recordedVideo?: RecordedVideoTokens;
  url?: Url;
  thumbnailUrl: Url;
}

// We use a mix of random custom properties along with a very non
// fixed set of CSS styles in our video json.
export type CustomCSSProperties =
  | CSSProperties
  | {
      fontColor: string;
      align: string;
    };

export interface RveSceneElementAssetText {
  kind: "Text";
  text: string;
  isPersonalized: boolean;
  label: string;
  textStyle: CustomCSSProperties;
}

export type RveSceneElementAsset =
  | RveSceneElementAssetImage
  | RveSceneElementAssetVideo;

export type RveSceneElement = {
  id: string;
  asset: RveSceneElementAsset;
};

export type RveSceneElements = {
  [k: string]: RveSceneElement;
};

// // Rephrase Video Emulator
// export type RveVideo = {
//   id: string,
//   title: string,
//   scenesOrder: [string],
//   scenes: RveSceneElements,
//   isTemplate: boolean,
//   backgroundMusicUrl: Url,
//   backgroundMusicVolume: number, // 1 to 100, maybe do something for it
//   templateId: string,
// };

export type Timeline = [Timeframe];

export type Timeframe = ScriptTF | ClockTF;

export type ScriptTokenId = string;
export type TimeElapsed = number;

// Not being used in current structure.
export type Interval = {
  start: number;
  end: number;
  label: string;
  id: ScriptTokenId;
};
export type Intervals = {
  [k: string]: Interval;
};

type Point = {
  id: string;
  type: string;
  time: number;
  label: string;
  // this draft status signifies if the timeframe is purely a clock timeframe or
  // will it be converted to script timeframe before rendering the video.
  draft?: boolean;
};

export type ProcessedTokens = {
  head: string; // id of the first token
  tokens: {
    [k: string]: {
      id: string; // token id
      next: string; // next token id
      duration: number; // duration of token in seconds
      label: string;
      is_pmt: string; // PMT --> processed merge tags, used for personalizations
    };
  };
};

export type ScriptTF = {
  id: string;
  isLoading: boolean; // to see if the processed tokens are ready or not
  draft?: boolean; // refer to description of draft in type Point above
  time: number; // for when the script is just lying in between and not being used to calculate offset
  type: string;
  label: string;
  processedTokens?: ProcessedTokens;
  templateVersion?: string;
};

export type ClockTF = Point;
// Interval and Point are defined here: https://github.com/timmahrt/praatIO/blob/master/praatio/tgio.py#L30-L31 , we could use `[Interval]` for `ClockTF` as well if it makes writing the code easier

export type RveMoment = {
  timeframeId: string;
  offset: ScriptTokenId | TimeElapsed;
};

export interface EditorValueJSON {
  type: string;
  children: { text: string }[];
}

export interface VideoOutputParams {
  crop: {
    preset: string;
  };
  resolution: {
    height: number;
    width: number;
  };
  background: {
    alpha: number;
  };
}

export type RveSpokespersonVideoAssetExtras = {
  model: string;
  voiceId: string;
  speechText: string;
  editorValueJson: EditorValueJSON;
  sorp?: string;
  transcript_type: string;
  modelPreset: string;
  output_params: {
    video: VideoOutputParams;
  };
  isVoiceOver: boolean;
  frameOffset: number;
  gender: string;
  langugae: string;
  pipelineVersion: string;
  windowSize: string;
};

export type RveSpokespersonAudioExtras = {
  status: string;
  url: Url;
  customAudioUrl?: Url;
  customAudioFilename?: string;
  customAudioDuration?: number;
};

export const RveElementAssetKind = {
  IMAGE: "Image",
  VIDEO: "Video",
  AUDIO: "Audio",
  TEXT: "Text",
  SPOKESPERSON: "Spokesperson",
  SHAPE: "Shape",
};

export type RveElementAssetKindType = $Values<typeof RveElementAssetKind>;

export type RveElementAsset = {
  kind: RveElementAssetKindType;
  use?: "Background";
  url: Url;
  thumbnailUrl: Url;
  audioUrl?: Url;
  spokespersonVideo?: RveSpokespersonVideoAssetExtras;
  spokespersonAudio?: RveSpokespersonAudioExtras;
  isPersonalized?: Boolean;
  generateFromRecordedVideo?: Boolean;
  isVariableInvalid?: Boolean;
};

export type RveElementAnimation = {
  startTime: RveMoment;
  endTime: RveMoment; // TODO: @Pulkit, write apt types or just put a comment here that this is similar to anime.js library
};

export type CustomElementStyles =
  | {
      fontColor?: string;
      align?: string;
      zIndex: number;
      variant: string;
      height: string;
      width: string;
      bottom: string;
      left: string;
    }
  | CSSProperties;

// startTime and endTime together make the lifetime of an element on RVE
export type RveElement = {
  id: string;
  asset: RveElementAsset;
  style: CustomElementStyles;
  startTime: RveMoment;
  endTime: RveMoment;
  animations?: [RveElementAnimation];
  // historically, spokesperson elements could only have script timeframe as their lifetime
  // but with the introduction of the new scene based UX, some clock timeframes have gained
  // the ability to convert themselves to script timeframes, andre hence we need to know if the
  // spokesperson element in question has clock timeframe as it's lifetime or a script timeframe
  draft?: boolean;
  isRendered?: boolean;
};

export type RveTimeframeMapElement = {
  stage: string;
  templateId: string;
  element: RveElement;
};

export type RveElements = {
  [k: string]: RveElement;
};

export type RveScriptTimeframeMap = {
  [k: string]: RveTimeframeMapElement;
};

// Rephrase Video Emulator
export type RveVideo = {
  id: string;
  title: string;
  thumbnailUrl: string;
  elements: RveElements;
  timeline: Timeline;
  scriptTimeframeMap: RveScriptTimeframeMap;
  uxVersion?: string;
  video_dimension: {
    height: number;
    width: number;
  };
};

export interface RecordedVideoTokens {
  start_unprocessed_token_id: string;
  end_unprocessed_token_id: string;
  umt_list: string[];
  umt_list_with_tokens: string[];
}
