import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const exactCSP = "default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' blob: data:; connect-src 'self' blob: miller-avatar-local:; font-src 'none'; media-src 'none'; object-src 'none'; frame-src 'none'; child-src 'none'; worker-src 'none'; manifest-src 'none'; base-uri 'none'; form-action 'none'; navigate-to 'none'";

test("HTML uses the exact closed CSP and external immutable assets", () => {
  const html = readFileSync(new URL("../src/index.html", import.meta.url), "utf8");
  const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/);
  assert.equal(csp?.[1], exactCSP);
  assert.match(html, /<script type="module" src="app\.js"><\/script>/);
  assert.match(html, /<link rel="stylesheet" href="styles\.css">/);
  assert.doesNotMatch(html, /<script(?![^>]*src=)[^>]*>/);
});
