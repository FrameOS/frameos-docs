const esp32UnsupportedWavesharePanels = new Set([
  'EPD_10in3',
  'EPD_12in48',
  'EPD_12in48b',
  'EPD_12in48b_V2',
]);

export function deviceSupportsEsp32(device: { driver: string; esp32?: boolean }): boolean {
  if (device.driver === 'web_only') return true;
  if (!device.driver.startsWith('waveshare.')) return device.esp32 === true;

  const panel = device.driver.slice('waveshare.'.length);
  return !esp32UnsupportedWavesharePanels.has(panel);
}
