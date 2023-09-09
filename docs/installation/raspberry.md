---
sidebar_position: 1
---
# Frame Setup

To setup a frame, follow the generic Raspberry Pi setup instructions below, along with any alterations from [each device's page](/devices). 

## Raspberry Setup

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