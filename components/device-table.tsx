'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { DeviceRow } from '@/lib/devices';

const colorClassLabels: Record<string, string> = {
  bw: 'Black & white',
  accent: 'B/W + accent color',
  gray: 'Grayscale',
  spectra: 'Spectra 6 (6-color)',
  acep: 'ACeP (7-color)',
  rgb: 'Full color (RGB)',
  varies: 'Varies by panel',
};

type SortKey = 'device' | 'size' | 'resolution' | 'colors' | 'status';

const sorters: Record<SortKey, (a: DeviceRow, b: DeviceRow) => number> = {
  device: (a, b) => `${a.vendor} ${a.model}`.localeCompare(`${b.vendor} ${b.model}`),
  size: (a, b) => (a.diagonal ?? 0) - (b.diagonal ?? 0),
  resolution: (a, b) => (a.width ?? 0) * (a.height ?? 0) - (b.width ?? 0) * (b.height ?? 0),
  colors: (a, b) => (a.colorCount ?? 0) - (b.colorCount ?? 0),
  status: (a, b) => (a.status === 'tested' ? 0 : 1) - (b.status === 'tested' ? 0 : 1),
};

function StatusBadge({ status }: { status: DeviceRow['status'] }) {
  if (status === 'tested') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400 whitespace-nowrap">
        ✓ Tested
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400 whitespace-nowrap">
      Should work
    </span>
  );
}

export function DeviceTable({ rows }: { rows: DeviceRow[] }) {
  const [query, setQuery] = useState('');
  const [vendor, setVendor] = useState('');
  const [technology, setTechnology] = useState('');
  const [colorClass, setColorClass] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);

  const vendors = useMemo(() => [...new Set(rows.map((r) => r.vendor))], [rows]);
  const technologies = useMemo(() => [...new Set(rows.map((r) => r.technology))], [rows]);
  const colorClasses = useMemo(
    () => [...new Set(rows.map((r) => r.colorClass).filter(Boolean))] as string[],
    [rows],
  );

  const filtered = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    let result = rows.filter((row) => {
      if (vendor && row.vendor !== vendor) return false;
      if (technology && row.technology !== technology) return false;
      if (colorClass && row.colorClass !== colorClass) return false;
      if (status && row.status !== status) return false;
      if (terms.length === 0) return true;
      const haystack = [
        row.vendor,
        row.model,
        row.title,
        row.driver,
        row.colors,
        row.technology,
        row.interface,
        row.width && row.height ? `${row.width}x${row.height} ${row.width}×${row.height}` : '',
        row.diagonal ? `${row.diagonal}"` : '',
      ]
        .join(' ')
        .toLowerCase();
      return terms.every((term) => haystack.includes(term));
    });
    if (sort) result = [...result].sort((a, b) => sorters[sort.key](a, b) * sort.dir);
    return result;
  }, [rows, query, vendor, technology, colorClass, status, sort]);

  function toggleSort(key: SortKey) {
    setSort((prev) => (prev?.key === key ? (prev.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }));
  }

  const selectClass =
    'rounded-md border bg-fd-background px-2 py-1.5 text-sm text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary/50';

  function header(label: string, key: SortKey, className = '') {
    const active = sort?.key === key;
    return (
      <th className={`px-3 py-2 font-medium ${className}`}>
        <button
          type="button"
          onClick={() => toggleSort(key)}
          className="inline-flex items-center gap-1 hover:text-fd-foreground"
          aria-label={`Sort by ${label}`}
        >
          {label}
          <span className="text-xs w-3">{active ? (sort!.dir === 1 ? '↑' : '↓') : ''}</span>
        </button>
      </th>
    );
  }

  return (
    <div className="not-prose my-6">
      <div className="flex flex-wrap gap-2 mb-3">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${rows.length} displays - try "spectra", "800x480", "7.3"…`}
          className="min-w-48 flex-1 rounded-md border bg-fd-background px-3 py-1.5 text-sm text-fd-foreground placeholder:text-fd-muted-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary/50"
        />
        <select value={vendor} onChange={(event) => setVendor(event.target.value)} className={selectClass} aria-label="Vendor">
          <option value="">All vendors</option>
          {vendors.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={technology}
          onChange={(event) => setTechnology(event.target.value)}
          className={selectClass}
          aria-label="Technology"
        >
          <option value="">All technologies</option>
          {technologies.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          value={colorClass}
          onChange={(event) => setColorClass(event.target.value)}
          className={selectClass}
          aria-label="Colors"
        >
          <option value="">All colors</option>
          {colorClasses.map((value) => (
            <option key={value} value={value}>
              {colorClassLabels[value] ?? value}
            </option>
          ))}
        </select>
        <select value={status} onChange={(event) => setStatus(event.target.value)} className={selectClass} aria-label="Status">
          <option value="">Any status</option>
          <option value="tested">✓ Tested</option>
          <option value="untested">Should work</option>
        </select>
      </div>
      <p className="mb-2 text-xs text-fd-muted-foreground">
        Showing {filtered.length} of {rows.length} displays. Click a column to sort, click a row for full specs and setup.
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-fd-muted text-left text-fd-muted-foreground">
              {header('Device', 'device')}
              {header('Size', 'size')}
              {header('Resolution', 'resolution')}
              {header('Colors', 'colors')}
              <th className="px-3 py-2 font-medium max-md:hidden">Interface</th>
              {header('Status', 'status')}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.url} className="border-b last:border-b-0 hover:bg-fd-accent/50">
                <td className="px-3 py-2">
                  <Link href={row.url} className="font-medium text-fd-primary hover:underline">
                    {row.vendor !== 'Generic' ? `${row.vendor} ${row.model}` : row.model}
                  </Link>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{row.diagonal ? `${row.diagonal}"` : '-'}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.width && row.height ? `${row.width}×${row.height}` : 'any'}
                </td>
                <td className="px-3 py-2">{row.colors}</td>
                <td className="px-3 py-2 max-md:hidden">{row.interface}</td>
                <td className="px-3 py-2">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-fd-muted-foreground">
                  No displays match. Try fewer filters - or open an issue if your panel is missing.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
