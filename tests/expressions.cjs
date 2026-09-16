// node tests/expressions.cjs [path-to-playwright-module]
// Optional: BROWSER_EXECUTABLE and EXPRESSIONS_SCREENSHOT.
const {chromium} = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

(async () => {
  const browser = await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE || undefined});
  try {
    const page = await browser.newPage({viewport:{width:1000,height:900}});
    const errors = [];
    page.on('pageerror',error => errors.push(error.message));
    await page.route('https://fonts.googleapis.com/**',route => route.abort());
    await page.goto(`${pathToFileURL(path.resolve(__dirname,'../index.html')).href}#vestidor`);
    assert.equal(await page.locator('#eyes option').count(),11);
    assert.equal(await page.locator('#mouth option').count(),7);
    const eyeShapes = new Set(), mouthShapes = new Set();
    for(const style of await page.locator('#eyes option').evaluateAll(nodes=>nodes.map(node=>node.value))) {
      await page.selectOption('#eyes',style);
      eyeShapes.add(await page.locator('#avatar [data-part="eyes"]').innerHTML());
      assert.equal(await page.locator('#avatar [data-part="eyelashes"]').count(),2);
      assert.equal(await page.locator('#avatar [data-part="eye-sparkles"]').count(),style==='happy'?0:style==='wink'?1:2);
    }
    for(const style of await page.locator('#mouth option').evaluateAll(nodes=>nodes.map(node=>node.value))) {
      await page.selectOption('#mouth',style);
      mouthShapes.add(await page.locator('#avatar [data-part="mouth"]').innerHTML());
    }
    assert.equal(eyeShapes.size,11); assert.equal(mouthShapes.size,7);
    assert.equal(await page.locator('#eyes').inputValue(),'animeSharp');
    const bounds = await page.evaluate(() => {
      let combinations = 0; const failures = [];
      for(const face of ['round','oval','soft']) for(const eyes of Object.keys(eyeStyles)) for(const mouth of Object.keys(mouthStyles)) {
        state = {...initialState(),face,eyes,mouth}; renderAvatar();
        if(!validState(state)) failures.push('Invalid new expression');
        const eyeBox=document.querySelector('#avatar [data-part="eyes"]').getBBox();
        const mouthBox=document.querySelector('#avatar [data-part="mouth"]').getBBox();
        if(eyeBox.x<100 || eyeBox.x+eyeBox.width>160 || eyeBox.y<99 || eyeBox.y+eyeBox.height>120) failures.push({face,eyes});
        if(mouthBox.x<117 || mouthBox.x+mouthBox.width>143 || mouthBox.y<125 || mouthBox.y+mouthBox.height>146) failures.push({face,mouth});
        combinations++;
      }
      return {combinations,failures};
    });
    assert.deepEqual(bounds.failures,[]);
    // Migrate an existing outfit without dropping its eyes, hair, or clothing.
    await page.evaluate(() => {
      const legacy={...initialState(),eyes:'almond',hairStyle:'braids'}; delete legacy.mouth;
      localStorage.setItem(storageKey,JSON.stringify([{id:'legacy-1',state:legacy},{id:'invalid-1',state:{...initialState(),mouth:'<script>'}}]));
    });
    await page.reload(); await page.locator('#open-saved').click();
    assert.equal(await page.locator('.saved-card').count(),1);
    await page.locator('[data-load]').click();
    assert.equal(await page.locator('#mouth').inputValue(),'smile');
    assert.equal(await page.locator('#eyes').inputValue(),'almond');
    assert.equal(await page.locator('#hair-style').inputValue(),'braids');
    await page.selectOption('#eyes','wink'); await page.selectOption('#mouth','laugh');
    await page.locator('#save-outfit').click(); await page.reload();
    await page.locator('#open-saved').click(); await page.locator('[data-load]').last().click();
    assert.equal(await page.locator('#mouth').inputValue(),'laugh');
    assert.equal(await page.locator('#eyes').inputValue(),'wink');
    const download=page.waitForEvent('download'); await page.locator('#download-outfit').click();
    assert.equal(await (await download).failure(),null);
    await page.setViewportSize({width:390,height:844});
    await page.selectOption('#mouth','surprised');
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    assert.deepEqual(errors,[]);
    if(process.env.EXPRESSIONS_SCREENSHOT) {
      await page.setViewportSize({width:1000,height:900});
      await page.evaluate(() => {
        const gallery=document.createElement('div');
        gallery.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:18px;background:#eee7fa';
        const previews=[...Object.entries(eyeStyles).map(([eyes,name])=>({eyes,mouth:'smile',name:`Ojos: ${name}`})),...Object.entries(mouthStyles).map(([mouth,name])=>({eyes:'round',mouth,name:`Boca: ${name}`}))];
        gallery.innerHTML=previews.map((item,index)=>`<div style="background:#fffcf7;text-align:center;border-radius:14px"><div style="height:170px">${avatarSvg({...initialState(),hairStyle:'short',skin:colors.skin[index%5][0],eyes:item.eyes,mouth:item.mouth}).replace('viewBox="0 0 260 410"','viewBox="70 45 120 150" style="width:100%;height:100%"')}</div><p>${item.name}</p></div>`).join('');
        document.body.replaceChildren(gallery);
      });
      await page.screenshot({path:process.env.EXPRESSIONS_SCREENSHOT,fullPage:true});
    }
    console.log(`PASS: 11 eye styles, 7 mouths, ${bounds.combinations} face combinations, legacy migration, invalid data rejection, persistence, PNG export and mobile layout.`);
  } finally { await browser.close(); }
})().catch(error => {console.error(error);process.exit(1);});
