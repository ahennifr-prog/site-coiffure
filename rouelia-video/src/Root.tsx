import React from "react";
import { Composition } from "remotion";
import timing from "./timing.json";
import { RoueliaVideo } from "./Video";
import story from "./story.json";
import { StoryVideo } from "./story";
import { StoryPoster } from "./poster";

export function Root() {
  return (
    <>
      <Composition id="vertical" component={RoueliaVideo} durationInFrames={timing.duration} fps={timing.fps} width={1080} height={1920} />
      <Composition id="horizontal" component={RoueliaVideo} durationInFrames={timing.duration} fps={timing.fps} width={1920} height={1080} defaultProps={{ horizontal: true }} />
      <Composition id="story" component={StoryVideo} durationInFrames={story.duration} fps={story.fps} width={1080} height={1920} />
      <Composition id="affiche" component={StoryPoster} durationInFrames={1} fps={30} width={1080} height={1920} />
    </>
  );
}
