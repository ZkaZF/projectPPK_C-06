import React, { Component, useEffect, useMemo, useState } from 'react';
import type { Slot } from '../../types/facility';

// @ts-ignore
import { getSlotsApi } from '../../api/facilities';

interface SlotCalendarProps {
  facilityId: string | number;
  date: string;
  onSlotSelect?: (start: string, end: string) => void;
}

// ─── Simple slot grid (no FullCalendar dependency) ─────────────────
function SlotGrid({ facilityId, date, onSlotSelect }: SlotCalendarProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    if (!facilityId || !date) return;
    setLoading(true);
    setSelectedSlot(null);
    getSlotsApi(facilityId, date)
      .then((res: any) => setSlots(res.data.slots ?? []))
      .catch((err: any) => { console.error(err); setSlots([]); })
      .finally(() => setLoading(false));
  }, [facilityId, date]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
        <div style={{
          width: 30, height: 30, borderRadius: '50%',
          border: '3px solid var(--border)', borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
        }} />
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
        Tidak ada slot tersedia untuk tanggal ini.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {slots.map((slot, idx) => {
        const isAvail = slot.status === 'available';
        const key = `${slot.start}-${slot.end}`;
        const isSelected = selectedSlot === key;

        return (
          <button
            key={idx}
            disabled={!isAvail}
            onClick={() => {
              if (!isAvail) return;
              setSelectedSlot(key);
              onSlotSelect?.(slot.start, slot.end);
            }}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              border: isSelected
                ? '2px solid var(--primary)'
                : isAvail ? '1px solid var(--border)' : '1px solid var(--border)',
              background: isSelected
                ? 'var(--primary-bg)'
                : isAvail ? 'var(--surface-2)' : '#f1f5f9',
              cursor: isAvail ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: isAvail ? 'var(--text-h)' : 'var(--text-muted)' }}>
              {slot.start} – {slot.end}
            </span>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px', borderRadius: '999px',
              background: isAvail ? '#d1fae5' : '#fee2e2',
              color: isAvail ? '#065f46' : '#991b1b',
            }}>
              {isAvail ? 'Tersedia' : 'Terisi'}
            </span>
          </button>
        );
      })}
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
