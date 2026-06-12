import { source } from './source';

// A flattened, serializable device record for the searchable table on /devices.
export interface DeviceRow {
  url: string;
  title: string;
  vendor: string;
  model: string;
  driver: string;
  technology: string;
  interface: string;
  diagonal?: number;
  width?: number;
  height?: number;
  colors: string;
  colorCount?: number;
  colorClass?: 'bw' | 'accent' | 'gray' | 'acep' | 'spectra' | 'rgb' | 'varies';
  status: 'tested' | 'untested';
}

const vendorOrder: Record<string, number> = { Generic: 0, Pimoroni: 1, Waveshare: 2 };

export function getDeviceRows(): DeviceRow[] {
  return source
    .getPages()
    .filter((page) => page.slugs[0] === 'devices' && page.data.device)
    .map((page) => {
      const device = page.data.device!;
      return {
        url: page.url,
        title: page.data.title,
        vendor: device.vendor,
        model: device.model,
        driver: device.driver,
        technology: device.technology,
        interface: device.interface,
        diagonal: device.diagonal,
        width: device.width,
        height: device.height,
        colors: device.colors,
        colorCount: device.colorCount,
        colorClass: device.colorClass,
        status: device.status,
      };
    })
    .sort(
      (a, b) =>
        (vendorOrder[a.vendor] ?? 9) - (vendorOrder[b.vendor] ?? 9) ||
        (a.diagonal ?? 0) - (b.diagonal ?? 0) ||
        a.model.localeCompare(b.model),
    );
}
