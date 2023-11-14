---
sidebar_position: 1
slug: /
---

# FrameOS 

FrameOS is a software system for Raspberry Pi-powered e-ink and LCD screens.

Features:

1. **Centralized Deployment:** The FrameOS Controller connects to Raspberry Pis via SSH for direct software installation.

2. **Diagram Editor**: A drag-and-drop interface to combine Python apps into scenes, with prebuilt apps like "Browser screenshot", "OpenAI image", and "Calendar overlay" for you to arrange.

3. **Python Apps**: FrameOS apps are Python-based, and can be edited in the controller. Modify and learn from existing apps, then write your own.

4. **GPT4 Support**: Ask your favourite LLM to write and debug FrameOS apps for you.

5. **Hardware Guides**: For tested displays, we provide hardware guides, installation instructions, and 3D printable cases.

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

FrameOS is good enough for home and hobbyist usage.

This software is still in early development, and does not have a stable release. A docker image is generated for every push to `main`. There are no guarantees things won't suddenly break between releases, despite our best efforts.

If you're the adventurous type, please try it out, and help out. Look at [the tasklist](https://github.com/mariusandra/frameos/issues/1) for ideas. Don't ask for permission, just submit a PR. If you're not sure, open an issue and we'll discuss it.

## Why?

Read the blog post: [Why FrameOS?](/blog/why-frameos)
