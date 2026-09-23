import { useEffect, useMemo, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { mockSlots } from '../../__mocks__/facilities';
// import { getSlotsApi } from '../../api/facilities'; // aktifkan saat backend siap

/**
 * Kalender slot 30 menit untuk satu fasilitas.
 * props:
 *  - facilityId: id fasilitas
 *  - date: 'YYYY-MM-DD' tanggal yang sedang dilihat
 *  - onSlotSelect(start, end): dipanggil saat user klik slot yang available
 */
export default function SlotCalendar({ facilityId, date, onSlotSelect }) {
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    if (!facilityId || !date) return;
    // Sementara pakai mock. Ganti dengan:
    // getSlotsApi(facilityId, date).then((res) => setSlots(res.data.data));
    setSlots(mockSlots(facilityId, date));
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

  const handleEventClick = (info) => {
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
