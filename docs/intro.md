---
sidebar_position: 1
slug: /
---

# FrameOS 

FrameOS is a tool for controlling Raspberry Pi-powered e-ink displays, a repository of apps to run on them, and an IDE for writing your own. 

To get started:

1. Install the [FrameOS controller](/installation/controller), a dockerized python app, which is used to deploy apps onto individual frames via SSH.

2. Read the [decice hardware guide](/devices) for your screen type. Typically you'll just need to connect the display to a Raspberry Pi, install the OS, and make sure it's reachable over the network. 

3. Once connected, deploy our prebuilt [apps](/apps), or code your own directly inside the contrller.

4. Finally, for a professional look, 3d print a case around your frame, or order one online.

![FrameOS walkthrough](./_img/walkthrough.gif)

## Supported platforms

We support all the most common e-ink displays out there.

- Pimoroni e-ink frames
- Waveshare e-ink
- Framebuffer HDMI output
- Web server kiosk mode

[See the full list here!](/devices)

![FrameOS Frames](./_img/1-frames.jpg)

## Status

FrameOS is currently in beta. Things are broken, and breaking changes happen all the time. It is not yet ready for production use.

If you're the adventurous type, please do try it out, and help out. We're missing all sorts of apps and overlays for example.

## Why?

Read the blog post: [Why FrameOS?](/blog/why-frameos)
