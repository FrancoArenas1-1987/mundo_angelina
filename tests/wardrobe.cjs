// Run with Node and Playwright installed, or pass its module path as argument 2.
// Optional: BROWSER_EXECUTABLE selects an existing Chromium installation.
// Optional: WARDROBE_SCREENSHOT writes a visual contact sheet for review.
const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.BROWSER_EXECUTABLE || undefined});
  try {
    const page = await browser.newPage({viewport:{width:1200,height:1000}});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://fonts.googleapis.com/**', route => route.abort());
    await page.goto(`${pathToFileURL(path.resolve(__dirname,'../index.html')).href}#vestidor`);
    const result = await page.evaluate(() => {
      const failures = [];
      let garments = 0, outfits = 0, variants = 0;
      const parts = () => {
        const body = document.querySelector('#avatar svg > g > g:nth-of-type(2)');
        return {body, skin:body.querySelector(':scope > path:nth-of-type(2)'), arms:body.querySelector(':scope > path:first-of-type')};
      };
      // Test actual SVG silhouettes, including the skin stroke at the sleeve seams.
      const coverage = (name, source, targets, start, end, stroke = false) => {
        let missing = 0, example;
        for (let y = start; y <= end; y++) {
          for (let x = 60; x <= 200; x++) {
            const point = new DOMPoint(x,y);
            if ((source.isPointInFill(point) || (stroke && source.isPointInStroke(point))) && !targets.some(target => target.isPointInFill(point))) {
              missing++; example ||= {x,y};
            }
          }
        }
        if (missing) failures.push({name,missing,example});
      };
      for (const item of clothes.filter(item => item.category !== 'accessory')) {
        state = {...initialState(),outfit:{[item.category]:item.id}};
        renderAvatar();
        const {body, skin, arms} = parts();
        const cloth = [body.querySelector(':scope > g[data-part="garment"] > path')];
        if (item.category === 'top') {
          coverage(item.id,skin,cloth,160,232);
          coverage(`${item.id} sleeves`,arms,cloth,156,['sweater','hoodie'].includes(item.shape)?222:180,true);
        }
        if (item.category === 'bottom') coverage(item.id,skin,cloth,234,item.shape==='pants'?353:item.shape==='shorts'?285:300);
        if (item.category === 'dress') {
          coverage(item.id,skin,cloth,160,306);
          coverage(`${item.id} sleeves`,arms,cloth,156,180,true);
        }
        if (item.category === 'shoes') coverage(item.id,skin,cloth,item.shape==='boots'?330:item.detail==='high-top'?343:354,363);
        garments++;
      }
      for (const top of [null,...clothes.filter(item => item.category === 'top')]) {
        for (const bottom of [null,...clothes.filter(item => item.category === 'bottom')]) {
          state = {...initialState(),outfit:{...(top?{top:top.id}:{}),...(bottom?{bottom:bottom.id}:{})}};
          renderAvatar();
          const {body,skin,arms} = parts();
          const base = [...body.querySelectorAll(':scope > path')].slice(2);
          const worn = [...body.querySelectorAll(':scope > g[data-part="garment"] > path:first-child')];
          const targets = [...base,...worn];
          coverage(`${top?.id||'base'} + ${bottom?.id||'base'}`,skin,targets,160,285);
          coverage('shoulders',arms,targets,156,180,true);
          if (base.length !== Number(!top)+Number(!bottom)) failures.push('Unexpected base garment under selected clothes');
          outfits++;
        }
      }
      // All skin and garments must retain identical transforms as the avatar changes.
      for (const build of ['slim','medium','full']) for (const gender of ['female','male']) for (const height of [0,1,2]) for (const age of [6,12,18,60]) {
        state = {...initialState(),build,gender,height,age}; renderAvatar();
        const {body,skin} = parts();
        const reference = skin.getCTM();
        for (const garment of body.querySelectorAll(':scope > g[data-part="garment"] > path:first-child')) {
          const transform = garment.getCTM();
          if (!['a','b','c','d','e','f'].every(key => Math.abs(reference[key]-transform[key])<0.0001)) failures.push('Clothes and body scale differently');
        }
        variants++;
      }
      return {garments,outfits,variants,failures};
    });
    assert.deepEqual(result.failures,[]);
    assert.deepEqual(errors,[]);
    if (process.env.WARDROBE_SCREENSHOT) {
      await page.evaluate(() => {
        const gallery = document.createElement('div');
        gallery.style.cssText='display:grid;grid-template-columns:repeat(6,1fr);gap:12px;padding:20px;background:#f5f0f8';
        gallery.innerHTML=clothes.map((item,index) => {
          const preview={...initialState(),hairStyle:'short',skin:colors.skin[index%5][0],build:['slim','medium','full'][index%3],outfit:{...initialState().outfit,[item.category]:item.id}};
          if(item.category==='dress'){delete preview.outfit.top;delete preview.outfit.bottom;}
          return `<div style="background:white;border-radius:12px;text-align:center;padding:8px"><div style="height:275px">${avatarSvg(preview).replace('<svg ','<svg style="width:100%;height:100%" ')}</div><p>${item.name}</p></div>`;
        }).join('');
        document.body.replaceChildren(gallery);
      });
      await page.screenshot({path:process.env.WARDROBE_SCREENSHOT,fullPage:true});
    }
    console.log(`PASS: ${result.garments} garments, ${result.outfits} outfit/base combinations, ${result.variants} body variants; no coverage gaps or browser errors.`);
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exit(1);});
