function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Picks today's event if one exists, otherwise the next upcoming one,
// otherwise falls back to the most recent past event so the kiosk never
// goes blank.
export function pickActiveEvent(events) {
  if (!Array.isArray(events) || events.length === 0) return null;
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const today = todayStr();
  return sorted.find(e => e.date >= today) || sorted[sorted.length - 1];
}

export async function loadSchedule() {
  try {
    const res = await fetch('./schedule.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const events = await res.json();
    return pickActiveEvent(events);
  } catch {
    return null;
  }
}
