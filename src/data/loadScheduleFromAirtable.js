// Reads the event schedule from an Airtable base. Each row (record) is one
// event with a Date, a Welcome Image attachment, and an Info Image
// attachment — staff manage content entirely in Airtable, no code/GitHub
// involvement needed for routine updates.
//
// Requires these Vite env vars (set in Netlify: Site configuration →
// Environment variables, and in a local .env file for `npm run dev`):
//   VITE_AIRTABLE_TOKEN      Personal access token, scoped read-only to
//                            this one base (data.records:read)
//   VITE_AIRTABLE_BASE_ID    e.g. appXXXXXXXXXXXXXX
//   VITE_AIRTABLE_TABLE      Table name, e.g. "Schedule"
//
// Table must have fields named exactly: Date, Welcome Image, Info Image.

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE = import.meta.env.VITE_AIRTABLE_TABLE;

function firstAttachmentUrl(field) {
  return Array.isArray(field) && field.length > 0 ? field[0].url : null;
}

export async function loadScheduleFromAirtable() {
  if (!TOKEN || !BASE_ID || !TABLE) return null;

  try {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE)}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;

    const { records } = await res.json();
    return (records || [])
      .map(r => ({
        date: r.fields?.Date,
        welcome: firstAttachmentUrl(r.fields?.['Welcome Image']),
        info: firstAttachmentUrl(r.fields?.['Info Image']),
      }))
      .filter(e => e.date && e.welcome && e.info);
  } catch {
    return null;
  }
}
