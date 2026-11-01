# dfp-redteam-binance — Binance security stack + fingerprint

Full details in `BINANCE_ASSESSMENT_2026_10_31.md`.

---

## What we observed (the shipped payload)

**The in-house `BNC_FV_KEY` fingerprint is read in full and tamper-proven** —
it ships as a 32-hex hash in `localStorage.__BNC_FP_INFO__`
(`dynamic-fingerprint.4a1db346.js`: canvas/webgl/audio/fonts/hardware →
hash). Rewriting any signal **flips the hash** (tamper-proven). Around it:

- **AWS WAF JS challenge** (`aws-waf-token`) at the edge.
- Themis feature-flags + HMAC/2FA API auth.
- The fingerprint is a **correlation signal, not a proof** — the WAF stops
  launches, API auth stops unauthorized actions.

## Status

- 🟢 Read payload: `__BNC_FP_INFO__` fingerprint read in full plaintext
- 🟢 Tamper with payload: signal rewrite flips the hash (proven)
- 🟡 Mint token: can mint the fingerprint hash, but not the session/WAF token

## Files

- writeup: `BINANCE_ASSESSMENT_2026_10_31.md`
- scripts/artifacts per the writeup
