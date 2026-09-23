/**
 * Add or subtract hours and minutes to a wall-clock time.
 *
 * Wall-clock time is represented as a string "HH:MM" using 24-hour format.
 * The arithmetic operates on minutes since midnight and wraps at 24:00
 * (i.e. 1440 minutes). There is no date or timezone context; the result is
 * always a local wall-clock time in the same 24-hour cycle.
 *
 * Why minutes since midnight? Using a single integer avoids floating point
 * arithmetic and makes carrying across midnight a simple modulo operation.
 */

const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Parse a "HH:MM" string into minutes since midnight.
 *
 * @param {string} time
 * @returns {number} minutes since midnight
 */
function parseTime(time) {
  if (typeof time !== 'string') {
    throw new TypeError('time must be a string');
  }

  const match = TIME_PATTERN.exec(time);
  if (!match) {
    throw new RangeError(`invalid wall-clock time: ${time}`);
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  return hours * MINUTES_PER_HOUR + minutes;
}

/**
 * Format minutes since midnight as a "HH:MM" string.
 *
 * The value is wrapped into the range 0..1439 before formatting. This means
 * adding 90 minutes to 23:30 yields 01:00, not 25:00.
 *
 * @param {number} totalMinutes
 * @returns {string}
 */
function formatTime(totalMinutes) {
  if (!Number.isInteger(totalMinutes)) {
    throw new TypeError('totalMinutes must be an integer');
  }

  const wrapped = ((totalMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(wrapped / MINUTES_PER_HOUR);
  const minutes = wrapped % MINUTES_PER_HOUR;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Add hours and minutes to a wall-clock time.
 *
 * Negative offsets are allowed and subtract from the clock.
 *
 * @param {string} start - a "HH:MM" wall-clock time
 * @param {number} hours - whole hours to add (may be negative)
 * @param {number} minutes - whole minutes to add (may be negative)
 * @returns {string} the resulting wall-clock time
 */
export function addTime(start, hours = 0, minutes = 0) {
  const startMinutes = parseTime(start);

  if (!Number.isInteger(hours)) {
    throw new TypeError('hours must be an integer');
  }
  if (!Number.isInteger(minutes)) {
    throw new TypeError('minutes must be an integer');
  }

  const offset = hours * MINUTES_PER_HOUR + minutes;
  return formatTime(startMinutes + offset);
}

/**
 * Subtract hours and minutes from a wall-clock time.
 *
 * @param {string} start - a "HH:MM" wall-clock time
 * @param {number} hours - whole hours to subtract (may be negative)
 * @param {number} minutes - whole minutes to subtract (may be negative)
 * @returns {string} the resulting wall-clock time
 */
export function subtractTime(start, hours = 0, minutes = 0) {
  return addTime(start, -hours, -minutes);
}
