# FrameOS Apps Guide

## Adding apps to a frame

In FrameOS, each frame consists of one "Scene: default" (more coming soon), onto which you add apps. You drag them from the "apps" tab, and connect to whatever makes sense:

![Adding FrameOS apps](./_img/add-app.gif)

## Editing apps

Click the "edit" button next to an app to edit its source. You can edit all apps, including the built-in ones.

Suppose you want a random image from a list of keywords. Just edit the "unsplash" app, and change the relevant lines. Then save and deploy.

## Coding guidelines

- The best advice is to follow by example. Look at the [built in apps](https://github.com/FrameOS/frameos/tree/main/frameos/src/apps) for inspiration.
- Look at the source of [the types.nim file](https://github.com/FrameOS/frameos/blob/main/frameos/src/frameos/types.nim#L83) to see the general structure of the app.
- The `render` event is your starting point. It's called on a timer you can set under the frame's config, or when dispatched from any other app.
- The render `context` comes with an `image` that you can draw on.  
- The context also contains a `state` JSON node that is carried between apps, but gets cleared every render. Apps can use instance variables to persist state between renders.
- The files [`utils/image.nim`](https://github.com/FrameOS/frameos/blob/main/frameos/src/frameos/utils/image.nim) and  [`utils/font.nim`](https://github.com/FrameOS/frameos/blob/main/frameos/src/frameos/utils/font.nim) might also be of interest.
- Double check before you blindly install someone else's apps or scene templates. Apps can still do almost anything on a frame, so be careful. 

## Example app

Here's the example `Code` app from the "Boilerplate" category. The app sets a scene state variable, and draws a blue heart:

```python
import json, strformat
import pixie
from frameos/types import FrameScene, FrameConfig, ExecutionContext, Logger

type
  AppConfig* = object
    keyword*: string

  App* = ref object
    nodeId*: string
    scene*: FrameScene
    frameConfig*: FrameConfig
    appConfig*: AppConfig

proc init*(nodeId: string, scene: FrameScene, appConfig: AppConfig): App =
  result = App(
    nodeId: nodeId,
    scene: scene,
    frameConfig: scene.frameConfig,
    appConfig: appConfig,
  )

proc log*(self: App, message: string) =
  self.scene.logger.log(%*{"event": &"{self.nodeId}:log", "message": message})

proc error*(self: App, message: string) =
  self.scene.logger.log(%*{"event": &"{self.nodeId}:error", "error": message})

proc run*(self: App, context: ExecutionContext) =
  self.log(&"Hello from {context.event} {self.appConfig.keyword}")
  self.scene.state["count"] = %*(self.scene.state{"count"}.getInt(0) + 1)

  if context.event == "render":
    context.image.fillPath(
      """
        M 20 60
        A 40 40 90 0 1 100 60
        A 40 40 90 0 1 180 60
        Q 180 120 100 180
        Q 20 120 20 60
        z
      """,
      parseHtmlColor("#FC427B").rgba
    )
```

## Templates

**Note:** The default templates have not yet been updated for the [Nim version of FrameOS](/blog/nim-rewrite). They're left as an example if you want to build your own, but will not work out of the box.

Each scene can be saved as a template. Templates can be exported and imported. They can also be shared via repositories. The repository formats are still a work in progress, but check the [frameos-repo](https://github.com/FrameOS/frameos-repo) repository for an example. It's running the `bin/build.py` script before publishing to https://repo.frameos.net/.

![FrameOS templates](./_img/templates.gif)

## Built in apps

The following apps are installed by default. See their
[source code](https://github.com/FrameOS/frameos/tree/main/frameos/src/apps) on Github.

### Helpers

- Code - clean starter

### Image Generation

- Set a single color
- Download an image from a URL
- Gradient
- OpenAI DallE 3
- Random Unsplash photo

### Overlays

- Clock
- Text

### Utilities

- Resize
- Rotate
- Read home assistant sensor data
- Break event if rendering
