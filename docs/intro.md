---
sidebar_position: 1
slug: /
---

# FrameOS 

FrameOS is software purpose built for controlling Raspberry Pi-powered e-paper and LCD displays. It consists of ~~two~~ three parts:

- **FrameOS guides** - getting started guides, links to 3d-printable models and other resources for each supported frame 
- **FrameOS controller** - the management software used to deploy changes to frames, write custom frame-apps, and aggregate logs. It's a self-hosted python webapp.
- **FrameOS device software**, deployed onto a Raspberry Pi with a screen attached to it. Written in python.

![](./_img/1-frames.jpg)


![FrameOS Screenshot](./_img/diagram-reload.gif)

## Supported platforms

We support all the most common e-ink displays out there.

- Pimoroni e-ink frames
- Waveshare e-ink
- Framebuffer HDMI output
- Web server kiosk mode

[See the full list here!](/devices)

## Status

FrameOS is currently in beta. Things are broken, and breaking changes happen all the time. It is not yet ready for production use.

If you're the adventurous type, please do try it out, and help out. We're missing all sorts of apps and overlays for example.

## Why?

Read the blog post: [Why FrameOS?](/blog/why-frameos)