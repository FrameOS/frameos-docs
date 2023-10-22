---
sidebar_position: 1
slug: /
---

# FrameOS 

FrameOS is a software system for Raspberry Pi-powered e-ink and LCD screens.

Features:

1. **Centralized Deployment:** The FrameOS Controller connects to Raspberry Pis via SSH for direct software installation.

2. **Diagram Editor**: A drag-and-drop interface to combine apps into scenes, with prebuilt blocks like "Browser screenshot", "OpenAI image", and "Calendar overlay" for you to arrange.

3. **Python Apps**: FrameOS apps are Python-based, and can be edited in the controller. Learn from and modify existing apps, then write your own.

4. **Template Repository**: A collection of scene templates for inspiration and quick deployment. It's easy to share your own.

5. **Hardware Guides**: For most supported displays, we provide hardware guides, installation instructions, and 3D printable cases (maybe? check back later).

![FrameOS walkthrough](./_img/walkthrough.gif)


## Getting started

1. Start by installing the [FrameOS controller](/installation/controller).
2. Then set up [the raspberry](/installation/raspberry), while following the [device guide](/devices) for your specific screen.


## Supported platforms

We support all the most common e-ink displays out there.

- Pimoroni e-ink frames
- Waveshare e-ink
- Framebuffer HDMI output
- Web server kiosk mode

[See the full list here!](/devices)

![FrameOS Frames](./_img/1-frames.jpg)

## Status

FrameOS is not ready for production use!

While feature complete for a growing number of use cases, FrameOS is still in early development, and does not have a stable release. Things will break, and things will change. Hopefully not by much. I do consider it good enough for personal projects though.

If you're the adventurous type, please try it out, and help out. Look at [the tasklist](https://github.com/mariusandra/frameos/issues/1) for ideas. Don't ask for permission, just submit a PR. If you're not sure, open an issue and we'll discuss it.

## Why?

Read the blog post: [Why FrameOS?](/blog/why-frameos)
