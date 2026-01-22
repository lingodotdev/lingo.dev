// utils/timeUtils.js
const IST_OFFSET = 5.5 * 60 * 60 * 1000; // 5h30m in ms

// Detects if a string ends with a timezone designator (Z or ±hh:mm)
const hasTimezoneSuffix = (s) => {
  if (!s || typeof s !== 'string') return false;
  return /([zZ]|[+\-]\d{2}:\d{2})$/.test(s.trim());
};

// Parse an input (string) that teacher provided.
// If the string has an explicit timezone (Z or +hh:mm), trust it.
// Otherwise treat the input as IST local time (convert to UTC Date).
// Accepts formats like "YYYY-MM-DDTHH:mm[:ss[.sss]]" or "YYYY-MM-DD HH:mm..."
exports.toUTCFromISTInput = (input) => {
  if (!input) throw new Error('Missing date input');

  // if it's already a Date, return a copy (assume it's already correct)
  if (input instanceof Date) return new Date(input.getTime());

  const s = String(input).trim();

  // If input includes timezone info, let Date parse it (trust it)
  if (hasTimezoneSuffix(s)) {
    const d = new Date(s);
    if (isNaN(d)) throw new Error('Invalid date string');
    return d;
  }

  // Otherwise parse components manually (avoid engine-dependent parsing)
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/);
  if (!m) {
    // fallback: try Date constructor and hope for the best
    const d2 = new Date(s);
    if (isNaN(d2)) throw new Error('Invalid date string');
    return d2;
  }

  const [, Y, Mo, D, hh, mm, ss = '0', ms = '0'] = m;
  // Build the UTC epoch that corresponds to that IST local time:
  // IST local -> UTC epoch = Date.UTC(...) - IST_OFFSET
  const utcMs = Date.UTC(
    parseInt(Y, 10),
    parseInt(Mo, 10) - 1,
    parseInt(D, 10),
    parseInt(hh, 10),
    parseInt(mm, 10),
    parseInt(ss, 10),
    parseInt(ms.padEnd(3, '0'), 10)
  ) - IST_OFFSET;

  return new Date(utcMs);
};

// Return { dayStart, dayEnd } as UTC Date objects that represent the IST day boundaries
// Example: for IST 2025-09-10, dayStart = UTC moment representing 2025-09-10T00:00:00 IST,
// and dayEnd = UTC moment representing 2025-09-10T23:59:59.999 IST.
exports.getISTDayBounds = (now = new Date()) => {
  const nowMs = now.getTime();
  const istNowMs = nowMs + IST_OFFSET;
  const istNow = new Date(istNowMs);

  const Y = istNow.getUTCFullYear();
  const M = istNow.getUTCMonth();
  const D = istNow.getUTCDate();

  const dayStartUtcMs = Date.UTC(Y, M, D, 0, 0, 0, 0) - IST_OFFSET;
  const dayEndUtcMs = Date.UTC(Y, M, D, 23, 59, 59, 999) - IST_OFFSET;

  return { dayStart: new Date(dayStartUtcMs), dayEnd: new Date(dayEndUtcMs) };
};

// Given a UTC Date (startUTC), return the UTC moment that corresponds to 23:59:59.999 IST
exports.getEndOfISTDay = (startUTC) => {
  if (!startUTC) return null;
  const istMs = startUTC.getTime() + IST_OFFSET;
  const istDate = new Date(istMs);
  const Y = istDate.getUTCFullYear();
  const M = istDate.getUTCMonth();
  const D = istDate.getUTCDate();
  const endUtcMs = Date.UTC(Y, M, D, 23, 59, 59, 999) - IST_OFFSET;
  return new Date(endUtcMs);
};

// Format a UTC Date into a human-readable IST timestamp string:
// "YYYY-MM-DD HH:mm:ss IST"
exports.formatToIST = (date) => {
  if (!date) return null;
  const d = new Date(date.getTime() + IST_OFFSET); // shift to IST millis
  const Y = d.getUTCFullYear();
  const M = String(d.getUTCMonth() + 1).padStart(2, '0');
  const D = String(d.getUTCDate()).padStart(2, '0');

  let hh = d.getUTCHours();
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  const ss = String(d.getUTCSeconds()).padStart(2, '0');

  const ampm = hh >= 12 ? 'PM' : 'AM';
  hh = hh % 12 || 12; // convert to 12-hour format

  return `${Y}-${M}-${D} ${hh}:${mm}:${ss} ${ampm} IST`;
};
