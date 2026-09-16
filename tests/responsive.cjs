// node tests/responsive.cjs [path-to-playwright-module]
// Chromium touch emulation; BROWSER_EXECUTABLE can select the local browser.
const {chromium}=require(process.argv[2]||'playwright');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
const url=pathToFileURL(path.resolve(__dirname,'../index.html')).href;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||undefined});
 try{
  const page=await browser.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://fonts.googleapis.com/**',r=>r.abort());
  await page.goto(url+'#vestidor');await page.locator('#save-outfit').click();
  let layouts=0;
  for(const [width,height] of [...[320,360,390,430,700,701,768,820,1000,1001,1024,1100,1101,1280,1440].map(w=>[w,844]),[844,390],[667,375]]){
   await page.setViewportSize({width,height});
   for(const route of ['inicio','vestidor','salon']){
    await page.evaluate(r=>location.hash=r,route);await page.waitForTimeout(30);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Page overflow: ${route} ${width}x${height}`);
    if(route==='salon')for(const station of ['hair','makeup','nails']){
     await page.locator(`[data-station="${station}"]`).click();
     assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Station overflow: ${station} ${width}`);
     layouts++;
    }
    layouts++;
   }
   await page.locator('#open-saved').click();
   assert(await page.evaluate(()=>{const d=document.querySelector('dialog');const r=d.getBoundingClientRect();return r.x>=0&&r.right<=innerWidth&&r.y>=0&&r.bottom<=innerHeight&&d.scrollWidth<=d.clientWidth;}),`Collection overflow: ${width}`);
   assert(!(await page.locator('#character-preview').isVisible()));
   await page.locator('#close-saved').click();
  }
  // Real browser touch dispatch (not synthetic pointer events) exercises pan/drag arbitration.
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2});
  mobile.on('pageerror',e=>errors.push(e.message));
  await mobile.route('https://fonts.googleapis.com/**',r=>r.abort());await mobile.goto(url+'#vestidor');
  const cdp=await mobile.context().newCDPSession(mobile);
  const center=async selector=>{const r=await mobile.locator(selector).boundingBox();return {x:r.x+r.width/2,y:r.y+r.height/2};};
  async function touch(type,point){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:point?[point]:[]});}
  async function position(selector){await mobile.locator(selector).evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await mobile.waitForTimeout(60);}
  async function dragToPreview(selector,ghost){
   await position(selector);assert(await mobile.locator('#character-preview').isVisible());
   const from=await center(selector),to=await center('#preview-art');
   await touch('touchStart',from);await mobile.waitForTimeout(280);assert.equal(await mobile.locator(ghost).count(),1);
   for(let i=1;i<=10;i++)await touch('touchMove',{x:from.x+(to.x-from.x)*i/10,y:from.y+(to.y-from.y)*i/10});
   await touch('touchEnd');assert.equal(await mobile.locator(ghost).count(),0);await mobile.waitForTimeout(520);
  }
  await position('#clothes-grid');
  await mobile.locator('[data-id="tee-peach"]').tap();assert.equal(await mobile.evaluate(()=>state.outfit.top),'tee-peach');
  await dragToPreview('[data-id="shirt-cream"]','.drag-ghost');assert.equal(await mobile.evaluate(()=>state.outfit.top),'shirt-cream');
  await mobile.locator('#preview-toggle').tap();assert(!(await mobile.locator('#preview-result').isVisible()));
  await mobile.locator('#preview-toggle').tap();assert(await mobile.locator('#preview-result').isVisible());
  // A quick swipe must scroll the clothing list without dressing the character.
  await position('[data-id="tee-peach"]');const before=await mobile.evaluate(()=>JSON.stringify(state.outfit));const p=await center('[data-id="tee-peach"]');
  await touch('touchStart',p);for(let i=1;i<=8;i++)await touch('touchMove',{x:p.x,y:p.y-i*12});await touch('touchEnd');
  assert.equal(await mobile.locator('.drag-ghost').count(),0);assert.equal(await mobile.evaluate(()=>JSON.stringify(state.outfit)),before);
  assert(await mobile.locator('#clothes-grid').evaluate(e=>e.scrollTop>0));await mobile.waitForTimeout(600);
  // Holding at the screen edge scrolls to the original character; releasing elsewhere cancels.
  await mobile.locator('#clothes-grid').evaluate(e=>e.scrollTop=0);await position('[data-id="tee-peach"]');
  const start=await center('[data-id="tee-peach"]');await touch('touchStart',start);await mobile.waitForTimeout(280);
  assert.equal(await mobile.locator('.drag-ghost').count(),1);
  const oldScroll=await mobile.evaluate(()=>scrollY);for(let i=1;i<=10;i++)await touch('touchMove',{x:start.x,y:start.y+(20-start.y)*i/10});await mobile.waitForTimeout(220);
  assert(await mobile.evaluate(()=>scrollY)<oldScroll);await touch('touchEnd');await mobile.waitForTimeout(520);
  await position('#hair-style');await mobile.selectOption('#hair-style','braids');
  assert.equal(await mobile.evaluate(()=>state.hairStyle),'braids');
  const tooSmall=await mobile.evaluate(()=>[...document.querySelectorAll('.swatch,select,.clothing-tabs button,.segmented button')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&(r.width<44||r.height<44);}).map(e=>e.id||e.className));
  assert.deepEqual(tooSmall,[]);
  assert(await mobile.locator('#hair-style').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  await mobile.locator('#preview-result').tap();await mobile.waitForTimeout(600);assert(!(await mobile.locator('#character-preview').isVisible()));
  await mobile.locator('.salon-entry').tap();
  await dragToPreview('[data-tool="spray:#d592b5"]','.salon-drag-ghost');assert.equal(await mobile.evaluate(()=>state.hair),'#d592b5');
  await mobile.locator('[data-tool="wash"]').tap();assert.equal(await mobile.evaluate(()=>state.hair),'#463127');
  await mobile.locator('[data-station="makeup"]').tap();
  await dragToPreview('[data-tool="lip:#bb6388"]','.salon-drag-ghost');assert.equal(await mobile.evaluate(()=>state.beauty.lip),'#bb6388');
  await mobile.locator('[data-station="nails"]').tap();
  await dragToPreview('[data-tool="nails:#ac8bd1"]','.salon-drag-ghost');
  assert.equal(await mobile.locator('#preview-art [data-nail][fill="#ac8bd1"]').count(),10);
  const smallProducts=await mobile.locator('.salon-product').evaluateAll(es=>es.filter(e=>e.getBoundingClientRect().width<44).length);assert.equal(smallProducts,0);
  await mobile.locator('#salon-save').tap();await mobile.locator('#open-saved').tap();
  assert(!(await mobile.locator('#character-preview').isVisible()));await mobile.locator('[data-load]').tap();
  assert.equal(await mobile.evaluate(()=>state.beauty.nails),'#ac8bd1');
  const download=mobile.waitForEvent('download');await mobile.locator('#download-outfit').tap();assert.equal(await (await download).failure(),null);
  if(process.env.RESPONSIVE_SCREENSHOT_DIR){
   await position('#clothes-grid');await mobile.screenshot({path:path.join(process.env.RESPONSIVE_SCREENSHOT_DIR,'mobile-wardrobe.png')});
   await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>location.hash='vestidor');await page.waitForTimeout(50);await page.screenshot({path:path.join(process.env.RESPONSIVE_SCREENSHOT_DIR,'desktop-wardrobe.png')});
  }
  assert.deepEqual(errors,[]);
  console.log(`PASS: ${layouts} responsive page/station layouts, collection dialogs, portrait/landscape, touch tap/drag, quick swipe, edge scrolling, collapsible live preview, makeup/nails, 44px controls, save/restore and PNG download.`);
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
