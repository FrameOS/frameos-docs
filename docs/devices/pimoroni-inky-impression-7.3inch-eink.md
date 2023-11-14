# Pimoroni Inky Impression 7.3" 7-color e-ink display

- Status: 🟢 Working
- Manufacturer: [Pimoroni](https://shop.pimoroni.com/)
- Device: [Inky Impression 7.3"](https://shop.pimoroni.com/products/inky-impression-7-3?variant=40512683376723) e-ink display
- Extra: 4 physical buttons

## Setup

- Setup the FrameOS Controller
- Select the "Pimoroni Inky Impression e-ink frames" driver
- Save & Deploy FrameOS onto the frame
- If you get an error initializing the inky library, SSH onto the frame and install the [Pimoroni software](https://shop.pimoroni.com/products/inky-impression-7-3?variant=40512683376723) with `curl https://get.pimoroni.com/inky | bash`, agree to the first prompt. No need to do the full install. Then restart FrameOS on the frame.