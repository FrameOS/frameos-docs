# Pimoroni HyperPixel 2.1" round 480x480 LCD with touch

- Status: 🟢 Working
- Manufacturer: [Pimoroni](https://shop.pimoroni.com/)
- Device: [HyperPixel 2.1" Round 480x480 LCD with touch](https://shop.pimoroni.com/products/hyperpixel-round?variant=39381081882707)

## What to buy?

- The [HyperPixel 2.1" Round 480x480 LCD with touch](https://shop.pimoroni.com/products/hyperpixel-round?variant=39381081882707) display directly from Pimoroni.
- [A Raspberry Pi Zero 2 W](https://amzn.to/461s8Iv) (preferred) or [Raspberry Pi Zero W](https://amzn.to/462NvJj) (slower)
- Normally you would buy a 40-pin GPIO header (here's a [pack of 10](https://amzn.to/3Pf4vWc)) and solder it to the raspberry. However you can also buy the pre-pinned [Raspberry Pi Zero WH](https://amzn.to/3PeIaYC) if you don't need the extra speed, and don't want to solder.


## Installation steps

- Install the latest Raspberry Pi OS (Bookwork), not the old one (Buster) as written in [Pimoroni's docs](https://shop.pimoroni.com/products/hyperpixel-round?variant=39381081882707). We're only writing to the framebuffer, and not using the slightly broken GPU acceleration, so the OS version doesn't matter.
- SSH in and run the following to install the pimoroni software and activate the display:
```shell
sudo apt install git
git clone https://github.com/pimoroni/hyperpixel2r
cd hyperpixel2r
sudo ./install.sh
# remove 3d acceleration
sudo sed -i '/dtoverlay=vc4-kms-v3d/s/^/#/' /boot/config.txt
sudo reboot
```
- Set up the frame in the FrameOS controller.

## 3D models

- [Case I printed](https://cults3d.com/en/3d-model/gadget/enclosure-m3-for-pimoroni-hyperpixel-2-1-round-touch-and-raspberry-pi-zero)

## Brightness control

Both the hyperpixel and the hyperpixel4 use pin 19 (BCM) ([source](https://github.com/pimoroni/hyperpixel/issues/11#issuecomment-437573404)).

```shell
sudo apt install wiringpi
# Set the pin to PWM mode
gpio -g mode 19 pwm 
# Set the value/brightness to 60
gpio -g pwm 19 60
# Value Effect
# 0 - 24 Backlight off
# 25 - 90 Various degrees of brightness
# 91 - 1023 Full brightness
```

Inspiration: https://github.com/pimoroni/hyperpixel2r/blob/master/dist/hyperpixel2r-init
