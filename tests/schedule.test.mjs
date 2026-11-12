import assert from "node:assert/strict";
import { test } from "node:test";
import { availableSlots, conflictReason, customSlot, isValidDate, validInterval } from "../src/lib/schedule.ts";

const infant = "eventos-infantiles";
const social = "eventos-sociales";
const business = "eventos-empresariales";
const date = "2026-11-20";
const entry = (service, start, end, extra = {}) => ({ id: 1, date, service, start, end, state: "reserved", ...extra });
const candidate = (service, start, end, extra = {}) => ({ date, service, start, end, state: "reserved", ...extra });

test("infant slots can both be reserved independently", () => {
  const entries = [entry(infant, 840, 1020)];
  assert.equal(conflictReason(candidate(infant, 1080, 1260), entries), null);
  assert.deepEqual(availableSlots(infant, date, entries, customSlot("09:00", "12:00")).map(slot => slot.start), [1080]);
});

test("infant and social reservations exclude one another even without time overlap", () => {
  assert.ok(conflictReason(candidate(social, 1260, 1620), [entry(infant, 840, 1020)]));
  assert.ok(conflictReason(candidate(infant, 1080, 1260), [entry(social, 1260, 1620)]));
});

test("a manual block closes only the corresponding service and overlapping slot", () => {
  const block = entry(infant, 840, 1020, { state: "blocked" });
  assert.ok(conflictReason(candidate(infant, 840, 1020), [block]));
  assert.equal(conflictReason(candidate(social, 1260, 1620), [block]), null);
  assert.equal(conflictReason(candidate(business, 840, 1020), [block]), null);
  assert.equal(conflictReason(candidate(infant, 1080, 1260), [block]), null);
});

test("business reservations conflict only when actual intervals overlap, in both directions", () => {
  assert.ok(conflictReason(candidate(business, 900, 1080), [entry(infant, 840, 1020)]));
  assert.ok(conflictReason(candidate(infant, 840, 1020), [entry(business, 900, 1080)]));
  assert.equal(conflictReason(candidate(business, 1020, 1080), [entry(infant, 840, 1020)]), null);
  assert.equal(conflictReason(candidate(business, 720, 840), [entry(infant, 840, 1020)]), null);
});

test("social overnight occupancy affects next-day business but not next-day infant", () => {
  const entries = [entry(social, 1260, 1620, { date: "2026-11-30" })];
  assert.ok(conflictReason(candidate(business, 120, 240, { date: "2026-12-01" }), entries));
  assert.equal(conflictReason(candidate(business, 180, 240, { date: "2026-12-01" }), entries), null);
  assert.equal(conflictReason(candidate(infant, 840, 1020, { date: "2026-12-01" }), entries), null);
});

test("business overnight intervals also protect next-day bookings", () => {
  const entries = [entry(business, 1380, 2340)];
  assert.ok(conflictReason(candidate(infant, 840, 1020, { date: "2026-11-21" }), entries));
  assert.equal(conflictReason(candidate(infant, 1080, 1260, { date: "2026-11-21" }), entries), null);
});

test("removing a reservation restores availability", () => {
  assert.equal(availableSlots(social, date, [entry(infant, 840, 1020)], customSlot("09:00", "12:00")).length, 0);
  assert.equal(availableSlots(social, date, [], customSlot("09:00", "12:00")).length, 1);
});

test("server validation rejects arbitrary fixed slots, invalid times, and invalid dates", () => {
  assert.equal(validInterval(infant, 840, 1020), true);
  assert.equal(validInterval(social, 1260, 1620), true);
  for (const [service, start, end] of [[infant, 800, 1020], [social, 1260, 1440], [business, 0, 0], [business, -1, 50], [business, 60, 1501], [business, NaN, 100]]) {
    assert.equal(validInterval(service, start, end), false);
  }
  assert.equal(validInterval(business, 1380, 1500), true);
  assert.equal(isValidDate("2026-02-30"), false);
  assert.equal(isValidDate("2028-02-29"), true);
  assert.equal(isValidDate("2026-13-01"), false);
  assert.equal(Number.isNaN(customSlot("", "12:00").start), true);
});

test("blocking a reserved slot of the same service is rejected", () => {
  assert.ok(conflictReason(candidate(infant, 840, 1020, { state: "blocked" }), [entry(infant, 840, 1020)]));
});
