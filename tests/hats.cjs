// node tests/hats.cjs [path-to-playwright-module]
// Optional: BROWSER_EXECUTABLE selects an existing Chromium installation.
const {chromium} = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

(async () => {
  const browser = await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE || undefined});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror',error => errors.push(error.message));
    await page.route('https://fonts.googleapis.com/**',route => route.abort());
    await page.goto(`${pathToFileURL(path.resolve(__dirname,'../index.html')).href}#vestidor`);
    const result = await page.evaluate(async () => {
      const failures = [], ids = new Set();
      let variants = 0, images = 0;
      for (const face of ['round','oval','soft']) for (const hairStyle of Object.keys(hairStyles)) for (const age of [6,12,18,60]) for (const gender of ['female','male']) for (const height of [0,1,2]) {
        state = {...initialState(),face,hairStyle,age,gender,height,outfit:{...initialState().outfit,accessory:'hat'}};
        renderAvatar();
        const svg = document.querySelector('#avatar svg');
        const clip = svg.querySelector('clipPath');
        const brim = svg.querySelector('[data-part="head-accessory"] ellipse');
        const brimY = Number(brim.getAttribute('cy'));
        const brimRadius = Number(brim.getAttribute('rx'));
        if (!clip || ids.has(clip.id)) failures.push('Missing or duplicate hair clip');
        ids.add(clip.id);
        if (Number(clip.firstElementChild.getAttribute('y')) !== brimY) failures.push('Hair clip is not aligned to brim');
        const reference = brim.getCTM();
        for (const part of ['hair-back','hair-front']) {
          const hair = svg.querySelector(`[data-part="${part}"]`);
          if (hair.getAttribute('clip-path') !== `url(#${clip.id})`) failures.push('Unmasked hair layer');
          const transform = hair.getCTM();
          if (!['a','b','c','d','e','f'].every(key => Math.abs(reference[key]-transform[key])<.0001)) failures.push('Hat and hair scale differently');
        }
        if (brimY + Number(brim.getAttribute('ry')) >= 95) failures.push('Hat covers eyebrows or eyes');
        if (hairStyle === 'curly' && brimRadius < 65) failures.push('Hat is too narrow for curls');
        variants++;
      }
      // Render standalone export SVGs to catch broken local clip references.
      for (const face of ['round','oval','soft']) for (const hairStyle of Object.keys(hairStyles)) {
        const s = {...initialState(),face,hairStyle,age:18,height:1,outfit:{...initialState().outfit,accessory:'hat'}};
        const source = avatarSvg(s,true);
        const url = URL.createObjectURL(new Blob([source],{type:'image/svg+xml'}));
        const img = new Image();
        try {
          await new Promise((resolve,reject) => {img.onload=resolve;img.onerror=reject;img.src=url;});
          const canvas = document.createElement('canvas');canvas.width=520;canvas.height=860;
          const context=canvas.getContext('2d');context.drawImage(img,0,0,520,860);
          const pixels=context.getImageData(0,0,520,860).data;
          // Map the hair clipping line through the adult head and height transforms.
          // Hair below that line may legitimately extend beside the brim.
          const hairStart = 377 + .94 * (149 + .94 * (hatFit(s).brimY - 149) - 377);
          let escapedHair=0;
          for(let y=70;y<Math.floor(hairStart*2);y++) for(let x=80;x<440;x++) {
            const offset=(y*520+x)*4;
            if(pixels[offset]===70&&pixels[offset+1]===49&&pixels[offset+2]===39&&pixels[offset+3]===255)escapedHair++;
          }
          if(escapedHair) failures.push({face,hairStyle,escapedHair});
          images++;
        } finally { URL.revokeObjectURL(url); }
      }
      return {variants,images,failures};
    });
    assert.deepEqual(result.failures,[]);
    // Saving several hats at once must not create duplicate IDs in the collection.
    for(const hair of ['curly','short']) {
      await page.selectOption('#hair-style',hair);
      await page.locator('#save-outfit').click();
    }
    await page.locator('#open-saved').click();
    assert.equal(await page.locator('.saved-card').count(),2);
    assert(await page.evaluate(() => {
      const ids=[...document.querySelectorAll('clipPath')].map(clip=>clip.id);
      return new Set(ids).size===ids.length;
    }));
    await page.locator('[data-load]').first().click();
    assert.equal(await page.locator('#hair-style').inputValue(),'curly');
    const download=page.waitForEvent('download');
    await page.locator('#download-outfit').click();
    assert.equal(await (await download).failure(),null);
    await page.locator('[data-remove="accessory"]').click();
    assert.equal(await page.locator('#avatar clipPath').count(),0);
    assert.equal(await page.locator('#avatar [clip-path]').count(),0);
    assert.equal(await page.locator('#hair-style').inputValue(),'curly');
    assert.deepEqual(errors,[]);
    console.log(`PASS: ${result.variants} hat fits; ${result.images} standalone SVG raster checks; saved collection, restoration, PNG download and hair restored on removal.`);
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exit(1);});
