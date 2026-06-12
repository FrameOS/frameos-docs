import { z } from 'zod';

// Structured specs for pages in content/docs/devices - these power the
// searchable device database on /devices and the spec card on each page.
export const deviceSchema = z.object({
  vendor: z.string(),
  model: z.string(),
  // driver id in the FrameOS backend, e.g. "waveshare.EPD_7in3e"
  driver: z.string(),
  // exact label in the backend's device dropdown
  label: z.string().optional(),
  technology: z.string(),
  interface: z.string(),
  // diagonal in inches
  diagonal: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  colors: z.string(),
  colorCount: z.number().optional(),
  colorClass: z.enum(['bw', 'accent', 'gray', 'acep', 'spectra', 'rgb', 'varies']).optional(),
  buttons: z.number().optional(),
  status: z.enum(['tested', 'untested']).default('untested'),
  productUrl: z.string().optional(),
});

export type Device = z.infer<typeof deviceSchema>;
