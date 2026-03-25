import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { VisitStatus, VisitSource, STATUS_CONFIG, ALL_STATUSES } from '@/hooks/useVisitStatus';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  companyId: string;
  source?: VisitSource;
  status: VisitStatus;
  onStatusChange: (status: VisitStatus) => void;
  variant?: 'card' | 'default'; // card = glass overlay for image cards
}

export function StatusBadge({
  status,
  onStatusChange,
  variant = 'default',
}: StatusBadgeProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cfg = STATUS_CONFIG[status];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const badgeClass = variant === 'card'
    ? 'bg-black/40 text-white border-white/20 backdrop-blur-sm'
    : cn('border', cfg.badge);

  return (
    <div ref={ref} className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all',
          badgeClass
        )}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full', variant === 'card' ? 'bg-white' : cfg.dot)} />
        {cfg.label}
        <ChevronDown className={cn('w-3 h-3 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 bg-card border border-border rounded-xl shadow-lg overflow-hidden min-w-[140px]">
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { onStatusChange(s); setOpen(false); }}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-foreground transition-colors',
                STATUS_CONFIG[s].dropdown,
                s === status && 'opacity-50 cursor-default'
              )}
            >
              <span className={cn('w-2 h-2 rounded-full', STATUS_CONFIG[s].dot)} />
              {STATUS_CONFIG[s].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
