# Pimoroni Inky Impression 7.3" 7-color e-ink display

- Status: 🟢 Working
- Manufacturer: [Pimoroni](https://shop.pimoroni.com/)
- Device: [Inky Impression 7.3"](https://shop.pimoroni.com/products/inky-impression-7-3?variant=40512683376723) e-ink display
- Extra: 4 physical buttons

Note: The Pimoroni Inky driver is currently **not** compiled to Nim, and is using a Python workaround. This makes the installation take longer than it should. This will be fixed soon.

## Setup

- SSH onto the frame and install the [Pimoroni software](https://shop.pimoroni.com/products/inky-impression-7-3?variant=40512683376723) with `curl https://get.pimoroni.com/inky | bash`. 
- Setup the FrameOS Controller
- Select the "Pimoroni Inky Impression e-ink frames" driver
- Save & Deploy FrameOS onto the frame.
- The display should start blinking, and it should just work.
