import React from "react";
import { Composition } from "remotion";
import timing from "./timing.json";
import { RoueliaVideo } from "./Video";

export function Root() {
  return (
    <>
      <Composition id="vertical" component={RoueliaVideo} durationInFrames={timing.duration} fps={timing.fps} width={1080} height={1920} />
    </>
  );
}
