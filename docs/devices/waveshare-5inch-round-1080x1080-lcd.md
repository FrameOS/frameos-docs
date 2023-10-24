# Waveshare 5" 1080x1080 round LCD

- Status: 🟢 Working
- [5" round 1080x1080 LCD](https://www.waveshare.com/5inch-1080x1080-lcd.htm) via the HDMI/FrameBuffer driver. Make sure to add the following rows to the end of `/boot/config.txt`, and reboot:
- [Waveshare Wiki](https://www.waveshare.com/wiki/5inch_1080x1080_LCD)

```ini
hdmi_group=2
hdmi_mode=87
hdmi_pixel_freq_limit=356000000
hdmi_timings=1080 0 68 32 100 1080 0 12 4 16 0 0 0 60 0 85500000 0
```

## Changing power

Turn on the Fake KMS driver:

```shell
sudo sed -i '/dtoverlay=vc4-kms-v3d/s/kms/fkms/' /boot/config.txt
```

Turn on or off:

```shell
# Turn off
vcgencmd display_power 0

# Turn on
vcgencmd display_power 1

# Is it on or off?
vcgencmd display_power | grep "display_power=0" >/dev/null && echo "off" || echo "on"
```

