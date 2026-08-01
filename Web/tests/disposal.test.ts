import assert from "node:assert/strict";
import test from "node:test";
import { DisposalBag } from "../src/disposal.js";

test("disposal bag runs every callback in reverse order even when callbacks fail", () => {
  const bag = new DisposalBag();
  const calls: string[] = [];
  bag.add(() => calls.push("first"));
  bag.add(() => {
    calls.push("second");
    throw new Error("second failed");
  });
  bag.add(() => calls.push("third"));

  const failures = bag.dispose();
  assert.deepEqual(calls, ["third", "second", "first"]);
  assert.equal(failures.length, 1);
  assert.equal(bag.dispose().length, 0);

  bag.add(() => {
    calls.push("late");
    throw new Error("late failed");
  });
  assert.deepEqual(calls, ["third", "second", "first", "late"]);
  assert.equal(bag.failures.length, 2);
});
