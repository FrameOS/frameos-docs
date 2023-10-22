---
sidebar_position: 2
---
# Raspberry Setup

:::info
Be sure to look at the [device-specific instructions](/devices) for any changes to these steps. 
::: 

## What to choose?

Typically, you'll want to buy a **Raspberry Pi Zero 2 W**. It offers the best compromise in terms of performance, power draw, and size. It can usually be had for around 20 units of currency. Check [rpilocator](https://rpilocator.com/?cat=PIZERO2). 

The first **Pi Zero W** works as well. It's cheaper, and draws a tiny bit less power. However instead of four 64-bit cores, it has just one  32-bit core. This makes it a lot slower, and **unable to run a browser on device** for taking screenshots, if you're into that.  

## Installation

Download the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) and install the Lite version of the latest Raspberry Pi OS, called "Bookworm".

If you have a Raspberry Pi 1, 2, or Zero W, select "Raspberry OS Lite (32-bit)". If you have any newer model (e.g. 3, 4, Zero 2 W), select "Raspberry OS Lite (64-bit)".

![](./_img/1-os-raspberry-lite.gif)

Click the "Gear" icon and make sure you have set the correct hostname, ssh user/password, and WiFi credentials. Set a strong password and save it in your password manager.

![](./_img/2-config-settings.gif)

Choose your SD card and write

![](./_img/3-storage-write.gif)

It'll take a while

![](./_img/4-wait-wait-wait.gif)

When done, place the card into the raspberry.

![](./_img/13-sdcard.gif)

Connect the raspberry and the frame.

![](./_img/14-wire.gif)

And wait until it shows up with `ping` and `ssh`. Check your router's connected clients for the IP.

![](./_img/6-success.gif)

If you're already here, skip to the [device guide](/devices) for your screen, to see if you should run `sudo raspi-config` and

1. enable SPI
2. enable I2C

Sadly these aren't automated yet.

![](./_img/10-raspi-config.gif)

Now get your [controller](./controller) set up if you haven't already.