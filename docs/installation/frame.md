---
sidebar_position: 1
---

# Frame Setup

## Required hardware 

The bare minimum for web kiosk mode: 

- Any random Linux box you have SSH access to.

The recommended / supported / tested combinations:

- [Inky Impression 5.7"](https://shop.pimoroni.com/products/inky-impression-5-7?variant=32298701324371) e-ink display + [Raspberry Pi Zero W](https://amzn.to/3suqQHD) 
- [Inky Impression 7.3"](https://shop.pimoroni.com/products/inky-impression-7-3?variant=40512683376723) e-ink display + [Raspberry Pi Zero W](https://amzn.to/3suqQHD) 
- More coming soon

Attach them to a Raspberry Pi Zero W or W2, and control the render loop via FrameOS.

![](./_img/0-frames.jpeg)

## Raspberry Pi setup (individual frames)

Download the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) and select [Raspberry Pi OS Lite](https://www.raspberrypi.org/downloads/raspberry-pi-os/) debian `bullseye`. Select 32-bit if you have the zero w v1, otherwise select 64 bit.

![](./_img/1-os-raspberry-lite.gif)

Click the "Gear" icon and make sure you have set the correct hostname, ssh user/password, and WiFi credentials. Set a strong password and save it in your password manager.

![](./_img/2-config-settings.gif)

Choose your SD card and write

![](./_img/3-storage-write.gif)

It'll take a while

![](./_img/4-wait-wait-wait.gif)

When done, place the card into the raspberry.

![](./_img/13-sdcard.gif)

Place the raspberry on the artboard, and plug it in

![](./_img/14-wire.gif)

And wait until it shows up with `ping` and `ssh`.

![](./_img/6-success.gif)

If you're already here, and plan on using Inky Impresson frames, run `sudo raspi-config` and

1. enable SPI
2. enable I2C

Sadly these aren't automated yet.

![](./_img/10-raspi-config.gif)

Now get your [controller](./controller) set up.