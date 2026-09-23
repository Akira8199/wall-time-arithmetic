import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { addTime, subtractTime } from '../src/index.js';

describe('addTime', () => {
  it('adds minutes without carrying', () => {
    assert.equal(addTime('10:00', 0, 30), '10:30');
  });

  it('adds hours without carrying', () => {
    assert.equal(addTime('10:00', 2, 0), '12:00');
  });

  it('carries minutes into the next hour', () => {
    assert.equal(addTime('10:45', 0, 30), '11:15');
  });

  it('wraps past midnight', () => {
    assert.equal(addTime('23:30', 1, 0), '00:30');
  });

  it('wraps more than 24 hours', () => {
    assert.equal(addTime('23:30', 25, 0), '00:30');
  });

  it('handles negative offsets as subtraction', () => {
    assert.equal(addTime('00:30', -1, 0), '23:30');
  });

  it('handles mixed hours and minutes together', () => {
    assert.equal(addTime('09:15', 2, 90), '12:45');
  });

  it('rejects invalid time strings', () => {
    assert.throws(() => addTime('24:00'), RangeError);
    assert.throws(() => addTime('12:60'), RangeError);
    assert.throws(() => addTime('noon'), RangeError);
  });

  it('rejects non-integer offsets', () => {
    assert.throws(() => addTime('10:00', 1.5, 0), TypeError);
    assert.throws(() => addTime('10:00', 0, 1.5), TypeError);
  });

  it('defaults offsets to zero', () => {
    assert.equal(addTime('10:00'), '10:00');
  });
});

describe('subtractTime', () => {
  it('subtracts minutes without borrowing', () => {
    assert.equal(subtractTime('10:30', 0, 15), '10:15');
  });

  it('subtracts hours without borrowing', () => {
    assert.equal(subtractTime('10:00', 2, 0), '08:00');
  });

  it('borrows from the previous hour', () => {
    assert.equal(subtractTime('10:15', 0, 30), '09:45');
  });

  it('wraps across midnight backwards', () => {
    assert.equal(subtractTime('00:30', 1, 0), '23:30');
  });

  it('wraps more than 24 hours backwards', () => {
    assert.equal(subtractTime('00:30', 25, 0), '23:30');
  });

  it('handles negative offsets as addition', () => {
    assert.equal(subtractTime('23:30', -1, 0), '00:30');
  });

  it('defaults offsets to zero', () => {
    assert.equal(subtractTime('10:00'), '10:00');
  });
});
