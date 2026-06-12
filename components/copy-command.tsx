'use client';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/cn';

export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(command).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className={cn(
        'group inline-flex max-w-full items-center gap-3 rounded-lg border bg-fd-card px-4 py-3 font-mono text-sm text-fd-card-foreground shadow-sm transition-colors hover:border-fd-primary/50',
        className,
      )}
      title="Copy to clipboard"
    >
      <span className="select-none text-fd-muted-foreground">$</span>
      <span className="truncate">{command}</span>
      {copied ? (
        <Check className="size-4 shrink-0 text-green-500" />
      ) : (
        <Copy className="size-4 shrink-0 text-fd-muted-foreground group-hover:text-fd-foreground" />
      )}
    </button>
  );
}
