import { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import type { Slot } from '../../types/facility';

// @ts-ignore
import { getSlotsApi } from '../../api/facilities';

interface SlotCalendarProps {
  facilityId: string | number;
  date: string;
  onSlotSelect?: (start: string, end: string) => void;
}

export default function SlotCalendar({ facilityId, date, onSlotSelect }: SlotCalendarProps) {
  const [slots, setSlots] = useState<Slot[]>([]);

  useEffect(() => {
    if (!facilityId || !date) return;
    getSlotsApi(facilityId, date)
      .then((res: any) => setSlots(res.data.slots ?? []))
      .catch((err: any) => {
        console.error(err);
        setSlots([]);
      });
  }, [facilityId, date]);

  const events = useMemo(
    () =>
      slots.map((s) => ({
        title: s.status === 'available' ? 'Tersedia' : 'Terisi',
        start: `${date}T${s.start}:00`,
        end: `${date}T${s.end}:00`,
        display: 'block',
        backgroundColor: s.status === 'available' ? '#198754' : '#dc3545',
        borderColor: s.status === 'available' ? '#198754' : '#dc3545',
        extendedProps: { status: s.status, start: s.start, end: s.end },
      })),
    [slots, date]
  );

  const handleEventClick = (info: EventClickArg) => {
    const { status, start, end } = info.event.extendedProps;
    if (status !== 'available') return;
    onSlotSelect?.(start, end);
  };

  return (
    <FullCalendar
      plugins={[timeGridPlugin, interactionPlugin]}
      initialView="timeGridDay"
      initialDate={date}
      headerToolbar={false}
      allDaySlot={false}
      slotMinTime="07:00:00"
      slotMaxTime="20:00:00"
      slotDuration="00:30:00"
      height="auto"
      events={events}
      eventClick={handleEventClick}
    />
  );
}
