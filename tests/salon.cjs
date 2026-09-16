// node tests/salon.cjs [path-to-playwright-module]
// Optional: BROWSER_EXECUTABLE and SALON_SCREENSHOT_DIR.
const {chromium}=require(process.argv[2] || 'playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE || undefined});
  try{
    const page=await browser.newPage({viewport:{width:1280,height:1100}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.route('https://fonts.googleapis.com/**',r=>r.abort());
    await page.goto(`${pathToFileURL(path.resolve(__dirname,'../index.html')).href}#vestidor`);
    assert.equal(await page.locator('#avatar [data-finger]').count(),10);
    assert.equal(await page.locator('#avatar [data-nail]').count(),10);
    await page.locator('[data-category="dress"]').click();await page.locator('[data-id="dress-bunny-lace"]').click();
    const outfit=await page.evaluate(()=>JSON.stringify(state.outfit));
    await page.locator('.salon-entry').click();await page.locator('#salon-view').waitFor({state:'visible'});
    assert(!(await page.locator('#game-view').isVisible()));
    assert.equal(await page.locator('.spray-shelf').count(),3);
    assert.equal(await page.locator('[data-tool^="spray:"]').count(),18);
    await page.selectOption('#salon-cut','pixie');await page.locator('[data-tool="cut"]').dragTo(page.locator('#salon-head-target'));
    assert.equal(await page.evaluate(()=>state.hairStyle),'pixie');
    // Allow the browser's synthetic post-drag click suppression to finish.
    await page.waitForTimeout(410);
    await page.selectOption('#salon-hairstyle','braids');await page.locator('[data-tool="comb"]').click();
    assert.equal(await page.evaluate(()=>state.hairStyle),'braids');
    const originalColor=await page.evaluate(()=>state.hair);
    await page.locator('[data-tool="spray:#d592b5"]').dragTo(page.locator('#salon-head-target'));
    assert.equal(await page.evaluate(()=>state.hair),'#d592b5');
    assert(await page.locator('#salon-effects .salon-particle').count()>0);
    await page.waitForTimeout(410);
    await page.locator('[data-tool="spray:#527bad"]').click();assert.equal(await page.evaluate(()=>state.hairBase),originalColor);
    if(process.env.SALON_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SALON_SCREENSHOT_DIR,'salon-hair.png'),fullPage:true});
    await page.locator('[data-tool="wash"]').click();assert.equal(await page.evaluate(()=>state.hair),originalColor);
    assert.equal(await page.evaluate(()=>state.hairBase),undefined);
    assert(await page.locator('#salon-effects .bubble').count()>0);assert(await page.locator('#salon-effects .water').count()>0);
    await page.locator('[data-station="makeup"]').click();
    await page.locator('[data-tool="lip:#bb6388"]').click();await page.locator('[data-tool="blush:#dd8da9"]').click();
    await page.locator('[data-tool="shadow:#ac8bd1"]').dragTo(page.locator('#salon-head-target'));
    assert.equal(await page.evaluate(()=>state.beauty.shadow),'#ac8bd1');
    assert.equal(await page.locator('#salon-avatar [data-part="eyeshadow"]').count(),1);
    assert.equal(await page.locator('#salon-avatar [data-part="mouth"]').getAttribute('stroke'),'#bb6388');
    await page.waitForTimeout(410);
    if(process.env.SALON_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SALON_SCREENSHOT_DIR,'salon-makeup.png'),fullPage:true});
    await page.locator('[data-station="nails"]').click();assert(await page.locator('#manicure-preview').isVisible());
    await page.locator('[data-tool="nails:#ac8bd1"]').dragTo(page.locator('#salon-hands-target'));
    assert.equal(await page.locator('#manicure-hands [data-nail][fill="#ac8bd1"]').count(),10);
    assert.equal(await page.locator('#salon-avatar [data-nail][fill="#ac8bd1"]').count(),10);
    assert.equal(await page.evaluate(()=>JSON.stringify(state.outfit)),outfit);
    await page.waitForTimeout(410);
    if(process.env.SALON_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SALON_SCREENSHOT_DIR,'salon-nails.png'),fullPage:true});
    await page.locator('#salon-save').click();await page.locator('.salon-return').click();
    assert.equal(await page.locator('#avatar [data-nail][fill="#ac8bd1"]').count(),10);
    await page.reload();await page.locator('#open-saved').click();await page.locator('[data-load]').click();
    assert.equal(await page.evaluate(()=>state.beauty.lip),'#bb6388');assert.equal(await page.evaluate(()=>state.beauty.nails),'#ac8bd1');
    assert.equal(await page.evaluate(()=>state.hairStyle),'braids');
    await page.locator('.salon-entry').click();
    const download=page.waitForEvent('download');await page.locator('#salon-download').click();assert.equal(await (await download).failure(),null);
    await page.locator('[data-station="makeup"]').click();await page.locator('[data-tool="clean-makeup"]').click();
    assert.equal(await page.evaluate(()=>state.beauty.lip),'none');assert.equal(await page.evaluate(()=>state.beauty.nails),'#ac8bd1');
    await page.locator('[data-station="nails"]').click();await page.locator('[data-tool="clean-nails"]').click();assert.equal(await page.evaluate(()=>state.beauty.nails),'none');
    for(const width of [390,768,1024]){await page.setViewportSize({width,height:900});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);}
    await page.setViewportSize({width:390,height:844});await page.locator('[data-tool="nails:#dd8da9"]').click();assert.equal(await page.evaluate(()=>state.beauty.nails),'#dd8da9');
    if(process.env.SALON_SCREENSHOT_DIR)await page.screenshot({path:path.join(process.env.SALON_SCREENSHOT_DIR,'salon-mobile.png'),fullPage:true});
    await page.evaluate(()=>{localStorage.setItem(storageKey,JSON.stringify([{id:'invalid-beauty',state:{...initialState(),beauty:{lip:'url(bad)'}}},{id:'old-outfit',state:initialState()}]));});
    await page.reload();await page.locator('#open-saved').click();assert.equal(await page.locator('.saved-card').count(),1);
    assert.deepEqual(errors,[]);
    console.log('PASS: ten fingers/nails, salon navigation, cut/comb, spray drag and particles, wash/rinse, makeup, nail polish drag, outfit preservation, persistence, PNG export, reset tools, legacy data, responsive layout.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
