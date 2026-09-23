# Wall Time Arithmetic

Adds and subtracts hours and minutes to a local wall-clock time, wrapping past midnight and 24 hours, with no date or timezone context.

## Usage

```js
import { addTime, subtractTime } from 'wall-time-arithmetic';

addTime('23:30', 1, 0);       // '00:30'
subtractTime('00:30', 1, 0);  // '23:30'
```

The functions accept a 24-hour `"HH:MM"` string and return a string in the same format. Offsets may be positive or negative integers.

## Why this exists

Scheduling and time-of-day logic often needs simple arithmetic on clock faces — for example, “what time is it 90 minutes after 23:30?”. Date-based libraries force you to choose an arbitrary date and timezone, which introduces DST transitions and calendar complications that are irrelevant when all you need is the wall-clock value.

This library deliberately ignores dates and timezones. It treats a day as exactly 24 hours and wraps every result into the range `00:00`–`23:59`. That makes the behavior predictable, but it also means the library cannot represent a duration longer than a day as a distinct point on the clock: `addTime('12:00', 30, 0)` returns `18:00`, not `18:00 on the next day`.

## Edge cases

- Adding or subtracting across midnight wraps within the 24-hour cycle.
- Offsets larger than 24 hours are reduced modulo 24 before formatting.
- Invalid time strings (`"24:00"`, `"12:60"`, `"noon"`) throw a `RangeError`.
- Non-integer offsets throw a `TypeError`.
- Offsets default to zero when omitted.
