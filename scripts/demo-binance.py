#!/usr/bin/env python3
"""demo-binance.py — print the FULL Binance BNC_FV_KEY fingerprint payload
(read in plaintext from localStorage.__BNC_FP_INFO__)."""
import json, sys

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else '/home/justin/Dev/dfp-redteam-binance-2026-10-31/artifacts/fp-info.json'
    d = json.load(open(src))
    print('=' * 74)
    print('BINANCE — FULL BNC_FV_KEY FINGERPRINT (plaintext)')
    print('read from localStorage.__BNC_FP_INFO__ (32-hex hash)')
    print('=' * 74)
    print(json.dumps(d, indent=1, default=str)[:5000])
    print('=' * 74)

if __name__ == '__main__':
    main()
