import { loadScheduleFromAirtable } from './loadScheduleFromAirtable.js';

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

async function loadLocalSchedule() {
  try {
    const res = await fetch('./schedule.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const events = await res.json();
    if (!Array.isArray(events)) return null;
    return events.map(e => ({ date: e.date, welcome: `./${e.welcome}`, info: `./${e.info}` }));
  } catch {
    return null;
  }
}

// Tries Airtable first (staff manage content there with no code/GitHub
// needed), then falls back to the local public/schedule.json + image
// files, then to plain public/welcome.jpg + info.jpg if neither is set up.
export async function loadActiveEvent() {
  const airtableEvents = await loadScheduleFromAirtable();
  if (airtableEvents?.length) return pickActiveEvent(airtableEvents);

  const localEvents = await loadLocalSchedule();
  if (localEvents?.length) return pickActiveEvent(localEvents);

  return null;
}
