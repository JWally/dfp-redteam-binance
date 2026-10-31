#!/usr/bin/env node
/** bn-tamper.mjs — prove Binance's BNC fingerprint is client-mintable:
 *  clean vs tampered canvas/screen -> compare the computed fingerprint. */
import { chromium } from 'playwright';

async function getFP(label, mutate) {
  const b = await chromium.launch({ headless:true });
  const ctx = await b.newContext({ viewport:{width:1280,height:900} });
  const page = await ctx.newPage();
  if (mutate) await page.addInitScript(mutate);
  await page.goto('https://www.binance.com/', { waitUntil:'load', timeout:60000 }).catch(()=>{});
  await page.waitForTimeout(12000);
  const r = await page.evaluate(() => {
    const raw = localStorage.getItem('__BNC_FP_INFO__') || '';
    try { return JSON.parse(JSON.parse(raw).value); } catch(e){ return {raw: raw.slice(0,150)}; }
  }).catch(e=>({err:String(e).slice(0,120)}));
  await b.close();
  return { label, fp: r.fingerprint, canvas: r.canvas_code, renderer: (r.webgl_renderer||'').slice(0,40) };
}

const clean = await getFP('clean', null);
// tamper: spoof screen + platform before fingerprint runs
const tamper = () => {
  Object.defineProperty(Screen.prototype,'width',{get(){return 1920;}});
  Object.defineProperty(Screen.prototype,'height',{get(){return 1080;}});
  Object.defineProperty(Navigator.prototype,'hardwareConcurrency',{get(){return 99;}});
  Object.defineProperty(Navigator.prototype,'platform',{get(){return 'Win32';}});
  // break canvas to force a different hash
  const orig = CanvasRenderingContext2D.prototype.fillRect;
  CanvasRenderingContext2D.prototype.fillRect = function(){ /* noop */ };
};
const tampered = await getFP('tampered', tamper);

console.log('=== BNC FINGERPRINT DIFFERENTIAL ===');
for (const x of [clean, tampered]) {
  console.log(`${x.label}: fingerprint=${x.fp} canvas=${x.canvas} renderer=${x.renderer}`);
}
console.log('\nfingerprints differ:', clean.fp !== tampered.fp);
