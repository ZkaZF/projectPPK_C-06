import React, { Component, useEffect, useState } from 'react';
import type { Slot } from '../../types/facility';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// @ts-ignore
import { getSlotsApi } from '../../api/facilities';

interface SlotCalendarProps {
  facilityId: string | number;
  date: string;         // YYYY-MM-DD — controlled from parent
  onDateChange?: (date: string) => void;
  onSlotSelect?: (start: string, end: string) => void;
}

// ─── Mini month calendar ────────────────────────────────────────────
function MiniCalendar({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (d: string) => void;
}) {
  const today = new Date();
  const selDate = new Date(selected + 'T00:00:00');
  const [view, setView] = useState<{ year: number; month: number }>({
    year: selDate.getFullYear(),
    month: selDate.getMonth(),
  });

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const firstDow = new Date(view.year, view.month, 1).getDay(); // 0=Sun
  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString('id-ID', {
    month: 'long', year: 'numeric',
  });

  const pad = (n: number) => String(n).padStart(2, '0');
  const toStr = (d: number) => `${view.year}-${pad(view.month + 1)}-${pad(d)}`;
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const prev = () => setView(v => {
    const d = new Date(v.year, v.month - 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const next = () => setView(v => {
    const d = new Date(v.year, v.month + 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div style={{ width: '100%', userSelect: 'none' }}>
      {/* Header navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <button
          onClick={prev}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-h)', display: 'flex', alignItems: 'center' }}
        >
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-h)' }}>{monthLabel}</span>
        <button
          onClick={next}
          style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-h)', display: 'flex', alignItems: 'center' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
        {dayNames.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', padding: '4px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {/* Empty cells before first day */}
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`e-${i}`} />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const ds = toStr(day);
          const isPast = ds < todayStr;
          const isToday = ds === todayStr;
          const isSel = ds === selected;
          return (
            <button
              key={day}
              disabled={isPast}
              onClick={() => onChange(ds)}
              style={{
                aspectRatio: '1',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: isSel || isToday ? 700 : 400,
                cursor: isPast ? 'not-allowed' : 'pointer',
                background: isSel
                  ? 'linear-gradient(135deg, var(--primary), var(--primary-light))'
                  : isToday ? 'var(--primary-bg)' : 'transparent',
                color: isSel
                  ? '#fff'
                  : isPast ? 'var(--surface-3)' : isToday ? 'var(--primary)' : 'var(--text-h)',
                transition: 'all 0.15s',
                outline: 'none',
              }}
              onMouseEnter={e => {
                if (!isSel && !isPast) e.currentTarget.style.background = 'var(--surface-2)';
              }}
              onMouseLeave={e => {
                if (!isSel && !isPast) e.currentTarget.style.background = 'transparent';
                if (isToday && !isSel) e.currentTarget.style.background = 'var(--primary-bg)';
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Slot grid ──────────────────────────────────────────────────────
function SlotGrid({
  facilityId,
  date,
  onDateChange,
  onSlotSelect,
}: SlotCalendarProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  // Range selection state
  const [selStart, setSelStart] = useState<number | null>(null);
  const [selEnd,   setSelEnd]   = useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!facilityId || !date) return;
    setLoading(true);
    setSelStart(null); setSelEnd(null); setHoverIdx(null);
    getSlotsApi(facilityId, date)
      .then((res: any) => setSlots(res.data.slots ?? []))
      .catch((err: any) => { console.error(err); setSlots([]); })
      .finally(() => setLoading(false));
  }, [facilityId, date]);

  // Check if all slots in range [a, b] are available
  const rangeValid = (a: number, b: number) => {
    const [lo, hi] = a <= b ? [a, b] : [b, a];
    return slots.slice(lo, hi + 1).every(s => s.status === 'available');
  };

  // Determine display range for hover/selection highlights
  const getDisplayRange = (): [number, number] | null => {
    if (selStart === null) return null;
    const endIdx = selEnd !== null ? selEnd : (hoverIdx !== null ? hoverIdx : selStart);
    const [lo, hi] = selStart <= endIdx ? [selStart, endIdx] : [endIdx, selStart];
    return rangeValid(lo, hi) ? [lo, hi] : null;
  };

  const handleSlotClick = (idx: number) => {
    const slot = slots[idx];
    if (slot.status !== 'available') return;

    if (selStart === null || selEnd !== null) {
      // First click: start new selection
      setSelStart(idx);
      setSelEnd(null);
      onSlotSelect?.(slots[idx].start, slots[idx].end);
    } else {
      // Second click: set end of range
      const [lo, hi] = selStart <= idx ? [selStart, idx] : [idx, selStart];
      if (!rangeValid(lo, hi)) {
        // Invalid range (blocked slot in between) → restart from this slot
        setSelStart(idx);
        setSelEnd(null);
        onSlotSelect?.(slots[idx].start, slots[idx].end);
        return;
      }
      setSelEnd(idx);
      const [startI, endI] = selStart <= idx ? [selStart, idx] : [idx, selStart];
      onSlotSelect?.(slots[startI].start, slots[endI].end);
    }
  };

  const displayRange = getDisplayRange();

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      alignItems: 'start',
    }}>
      {/* ── Left: Mini Calendar ── */}
      <div style={{
        padding: '20px',
        borderRight: '1px solid var(--border)',
        background: 'var(--surface)',
      }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>
          Pilih Tanggal
        </p>
        <MiniCalendar
          selected={date}
          onChange={d => { onDateChange?.(d); setSelStart(null); setSelEnd(null); }}
        />
      </div>

      {/* ── Right: Time Slots ── */}
      <div style={{
        padding: '20px',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '8px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
            Pilih Waktu
          </p>
          {/* Range hint */}
          <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0, textAlign: 'right', lineHeight: 1.4 }}>
            {selStart === null
              ? 'Klik slot pertama'
              : selEnd === null
                ? 'Klik slot terakhir'
                : '✓ Rentang dipilih'}
          </p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, minHeight: '160px' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              border: '3px solid var(--border)', borderTopColor: 'var(--primary)',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        ) : slots.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '160px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
              Tidak ada slot tersedia<br />untuk tanggal ini.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              overflowY: 'auto',
              maxHeight: '280px',
            }}
            onMouseLeave={() => setHoverIdx(null)}
          >
            {slots.map((slot, idx) => {
              const isAvail = slot.status === 'available';

              // Determine visual state
              const inRange = displayRange !== null && idx >= displayRange[0] && idx <= displayRange[1];
              const isRangeStart = displayRange !== null && idx === displayRange[0];
              const isRangeEnd   = displayRange !== null && idx === displayRange[1];
              const isSingleSel  = selStart === idx && selEnd === null;

              // Preview: hover over range before second click
              const previewEnd = selStart !== null && selEnd === null && hoverIdx !== null ? hoverIdx : null;
              const [pLo, pHi] = previewEnd !== null && selStart !== null
                ? selStart <= previewEnd ? [selStart, previewEnd] : [previewEnd, selStart]
                : [-1, -1];
              const inPreview = previewEnd !== null && selStart !== null
                && idx >= pLo && idx <= pHi && rangeValid(pLo, pHi);

              // Colors
              let bg = isAvail ? 'var(--surface-2)' : 'var(--surface-3)';
              let border = '1px solid var(--border)';
              let color = isAvail ? 'var(--text-h)' : 'var(--text-muted)';
              let fontWeight: number = 500;

              if (inRange) {
                bg = 'var(--primary-bg)';
                border = '1.5px solid var(--primary)';
                color = 'var(--primary-dark)';
                fontWeight = 700;
              }
              if (isRangeStart || isRangeEnd || isSingleSel) {
                bg = 'linear-gradient(135deg, var(--primary), var(--primary-light))';
                border = '2px solid var(--primary)';
                color = '#fff';
                fontWeight = 700;
              }
              if (!inRange && inPreview) {
                bg = 'rgba(255,122,83,0.08)';
                border = '1px dashed var(--primary)';
                color = 'var(--primary-dark)';
              }

              return (
                <button
                  key={idx}
                  disabled={!isAvail}
                  onClick={() => handleSlotClick(idx)}
                  onMouseEnter={() => { if (isAvail) setHoverIdx(idx); }}
                  style={{
                    padding: '8px 6px',
                    borderRadius: 'var(--radius-sm)',
                    border,
                    background: bg,
                    color,
                    cursor: isAvail ? 'pointer' : 'not-allowed',
                    fontSize: '0.78rem',
                    fontWeight,
                    textAlign: 'center',
                    transition: 'all 0.12s',
                    opacity: isAvail ? 1 : 0.45,
                    position: 'relative',
                    outline: 'none',
                  }}
                >
                  {slot.start}<br />
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>– {slot.end}</span>
                  {!isAvail && (
                    <span style={{
                      position: 'absolute', top: '4px', right: '5px',
                      width: '6px', height: '6px', borderRadius: '50%',
                      background: 'var(--danger)', display: 'block',
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Legend + reset */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border)', fontSize: '0.72rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
              Tersedia
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', display: 'inline-block' }} />
              Terisi
            </span>
          </div>
          {(selStart !== null) && (
            <button
              onClick={() => { setSelStart(null); setSelEnd(null); setHoverIdx(null); onSlotSelect?.('', ''); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.72rem', padding: 0, textDecoration: 'underline' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



// ─── Error Boundary ─────────────────────────────────────────────────
interface EBState { hasError: boolean; }
class CalendarErrorBoundary extends Component<React.PropsWithChildren, EBState> {
  state: EBState = { hasError: false };
  static getDerivedStateFromError(): EBState { return { hasError: true }; }
  componentDidCatch(err: Error) { console.error('[SlotCalendar crash]', err); }
  render() {
    if (this.state.hasError) {
      return <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>Gagal memuat jadwal.</p>;
    }
    return this.props.children;
  }
}

// ─── Export ─────────────────────────────────────────────────────────
export default function SlotCalendar(props: SlotCalendarProps) {
  return (
    <CalendarErrorBoundary>
      <SlotGrid {...props} />
    </CalendarErrorBoundary>
  );
}

