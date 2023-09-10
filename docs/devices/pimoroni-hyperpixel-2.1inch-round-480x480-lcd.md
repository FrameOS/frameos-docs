# Pimoroni HyperPixel 2.1" round 480x480 LCD with touch

- Status: 🟢 Working
- Manufacturer: [Pimoroni](https://shop.pimoroni.com/)
- Device: [HyperPixel 2.1" Round 480x480 LCD with touch](https://shop.pimoroni.com/products/hyperpixel-round?variant=39381081882707)

## What to buy?

- The [HyperPixel 2.1" Round 480x480 LCD with touch](https://shop.pimoroni.com/products/hyperpixel-round?variant=39381081882707) display directly from Pimoroni.
- [A Raspberry Pi Zero 2 W](https://amzn.to/461s8Iv) (preferred) or [Raspberry Pi Zero W](https://amzn.to/462NvJj) (slower)
- Normally you would buy a 40-pin GPIO header (here's a [pack of 10](https://amzn.to/3Pf4vWc)) and solder it to the raspberry. However you can also buy the pre-pinned [Raspberry Pi Zero WH](https://amzn.to/3PeIaYC) if you don't need the extra speed, and don't want to solder.


## Installation steps

- Install the latest Raspberry Pi OS (Bullseye), not the old one (Buster) as written in [Pimoroni's docs](https://shop.pimoroni.com/products/hyperpixel-round?variant=39381081882707). We're only writing to the framebuffer, and not using the slightly broken GPU acceleration, so the OS version doesn't matter.
- Install the pimoroni software with
```shell
git clone https://github.com/pimoroni/hyperpixel2r
cd hyperpixel2r
sudo ./install.sh
```
- Install the FrameOS controller, and set up the frame.

## 3D models

TODO

