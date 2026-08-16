// These Waveshare panels are in the Linux catalog but not the ESP32 firmware:
// the 10.3" IT8951 and the 12.48" family use different controller stacks.
// Mirrors EMBEDDED_UNSUPPORTED_PANELS in the main repo's embedded_firmware.py.
const esp32UnsupportedWavesharePanels = new Set([
  'EPD_10in3',
  'EPD_12in48',
  'EPD_12in48b',
  'EPD_12in48b_V2',
]);

const esp32Platforms = new Set(['esp32-s3', 'esp32-c3']);

export function deviceSupportsEsp32(device: { driver: string; esp32?: boolean; platforms?: string[] }): boolean {
  if (device.platforms) return device.platforms.some((platform) => esp32Platforms.has(platform));
  if (device.driver === 'web_only') return true;
  if (!device.driver.startsWith('waveshare.')) return device.esp32 === true;

  const panel = device.driver.slice('waveshare.'.length);
  return !esp32UnsupportedWavesharePanels.has(panel);
}

// Label and guide link for each platform value the device frontmatter may list.
export const platformLabels: Record<string, { label: string; href: string }> = {
  'raspberry-pi': { label: 'Raspberry Pi', href: '/guide/raspberry' },
  'esp32-s3': { label: 'ESP32-S3', href: '/guide/esp32' },
  'esp32-c3': { label: 'ESP32-C3', href: '/guide/esp32' },
  'pico-w': { label: 'Pico W', href: '/guide/pico' },
  'pico-2w': { label: 'Pico 2 W', href: '/guide/pico' },
};
