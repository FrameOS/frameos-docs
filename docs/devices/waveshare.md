---
sidebar_position: 1
---

# Waveshare displays

## LCD displays

This has been tested with:

- [5" round 1080x1080 LCD](https://www.waveshare.com/5inch-1080x1080-lcd.htm) via the HDMI/FrameBuffer driver. Make sure to add the following rows to the end of `/boot/config.txt`, and reboot:

```ini
hdmi_group=2
hdmi_mode=87
hdmi_pixel_freq_limit=356000000
hdmi_timings=1080 0 68 32 100 1080 0 12 4 16 0 0 0 60 0 85500000 0
```

## E-ink displays

This has been tested with:

- [Waveshare 2.13" 250×122 V3 Touch](https://www.waveshare.com/2.13inch-Touch-e-Paper-HAT.htm)
- [Waveshare 7.5" 800×480 V2](https://www.waveshare.com/7.5inch-e-paper-hat.htm)

Other devices likely work, but I don't own any to test.
