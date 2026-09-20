// Run: node tests/games.cjs [path-to-playwright]
// Optional: BROWSER_EXECUTABLE and GAMES_SCREENSHOT_DIR.
const {chromium}=require(process.argv[2]||'playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const words=require('../words.js');
const normalize=w=>w.toUpperCase().replace(/[ÁÉÍÓÚÜ]/g,c=>({Á:'A',É:'E',Í:'I',Ó:'O',Ú:'U',Ü:'U'})[c]);
assert.ok(words.length>=1000);
assert.equal(new Set(words.map(w=>normalize(w.word))).size,words.length);
assert.ok(words.every(w=>/^[a-záéíóúüñ]+$/.test(w.word)&&w.category));
for(const category of new Set(words.map(w=>w.category))){
  for(const check of [w=>w.length<=6,w=>w.length>=7&&w.length<=9,w=>w.length>=10]){
    assert.ok(words.some(w=>w.category===category&&check(w.word)),category+' must support all lengths');
  }
}
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||undefined});
  const errors=[];
  const url=pathToFileURL(path.resolve(__dirname,'../index.html')).href;
  try{
    const context=await browser.newContext({viewport:{width:1280,height:1000},acceptDownloads:true});
    const page=await context.newPage();
    page.on('pageerror',e=>errors.push(e.message));
    await page.route('https://fonts.googleapis.com/**',r=>r.abort());
    await page.goto(url);
    assert.equal(await page.locator('.game-card').count(),4);
    assert.equal(await page.locator('.game-card.coming').count(),0);
    const go=async hash=>{await page.evaluate(h=>location.hash=h,hash);await page.waitForFunction(h=>location.hash===h&&document.querySelectorAll('main:not([hidden])').length===1,hash);};
    for(const [hash,id,title] of [['#artista','artist-view','Pequeño gran artista'],['#jardin','garden-view','Mi jardín mágico'],['#colgado','hangman-view','El juego del colgado'],['#vestidor','game-view','Mi vestidor creativo'],['#salon','salon-view','Salón Brillitos'],['#inicio','home-view','El mundo de Angelina']]){
      await go(hash);assert.ok(await page.locator('#'+id).isVisible());assert.ok((await page.title()).includes(title));
    }
    // Drawing, stamps, reversible clear, keyboard and PNG.
    await go('#artista');
    const pixels=()=>page.evaluate(()=>document.querySelector('#art-canvas').toDataURL());
    const blank=await pixels();
    const canvas=page.locator('#art-canvas');await canvas.scrollIntoViewIfNeeded();
    const box=await canvas.boundingBox();
    await page.mouse.move(box.x+80,box.y+80);await page.mouse.down();await page.mouse.move(box.x+180,box.y+130,{steps:10});await page.mouse.up();
    const drawing=await pixels();assert.notEqual(drawing,blank);
    await page.click('#art-undo');assert.equal(await pixels(),blank);
    await page.click('#art-redo');assert.equal(await pixels(),drawing);
    await page.click('#art-clear');assert.equal(await pixels(),blank);
    await page.click('#art-undo');assert.equal(await pixels(),drawing);
    await page.selectOption('#art-tool','flower');await canvas.click({position:{x:120,y:170}});
    const stamped=await pixels();assert.notEqual(stamped,drawing);
    await canvas.focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('Space');
    assert.notEqual(await pixels(),stamped);
    const beforeTravel=await pixels();await go('#jardin');await go('#artista');assert.equal(await pixels(),beforeTravel);
    const downloadPromise=page.waitForEvent('download');await page.click('#art-save');
    const download=await downloadPromise;assert.equal(download.suggestedFilename(),'mi-pequena-gran-obra.png');
    assert.equal(fs.readFileSync(await download.path()).subarray(1,4).toString(),'PNG');
    // Garden: complete care cycle and storage.
    await go('#jardin');
    const plot=page.locator('[data-plot="0"]');
    await page.click('[data-garden-tool="water"]');await plot.click();
    assert.match(await page.locator('#garden-status').innerText(),/Primero planta/);
    await page.click('[data-garden-tool="plant"]');await plot.click();
    await page.click('[data-garden-tool="collect"]');await plot.click();
    assert.match(await page.locator('#garden-status').innerText(),/Todavía/);
    for(const tool of ['water','sun']){await page.click('[data-garden-tool="'+tool+'"]');await plot.click();await plot.click();await plot.click();}
    assert.match(await plot.innerText(),/Lista/);
    await page.reload();assert.match(await plot.innerText(),/Lista/);
    await page.click('[data-garden-tool="collect"]');await plot.click();
    assert.match(await page.locator('#garden-collection').innerText(),/Girasol × 1/);
    assert.match(await plot.innerText(),/Plantar/);
    await page.reload();assert.match(await page.locator('#garden-collection').innerText(),/Girasol × 1/);
    // Deterministic fixtures exercise the real controls with accent and Ñ cases.
    await go('#colgado');
    await page.evaluate(()=>HANGMAN_WORDS.splice(0,HANGMAN_WORDS.length,
      {word:'ñandú',category:'Animales'},
      {word:'pingüino',category:'Animales'},
      {word:'constelación',category:'Escuela y ciencia'}));
    await page.selectOption('#hangman-category','Animales');await page.selectOption('#hangman-level','short');
    await page.keyboard.press('n');assert.equal(await page.locator('#hangman-word').innerText(),'_\n_\nN\n_\n_');
    await page.keyboard.press('n');assert.match(await page.locator('#hangman-status').innerText(),/6 errores/);
    await page.click('[data-letter="Ñ"]');for(const key of ['a','d','u'])await page.keyboard.press(key);
    assert.match(await page.locator('#hangman-status').innerText(),/Lo lograste.*ÑANDÚ/);
    assert.ok(await page.locator('#hangman-hint').isDisabled());
    const won=await page.locator('#hangman-status').innerText();await page.keyboard.press('z');assert.equal(await page.locator('#hangman-status').innerText(),won);
    await page.selectOption('#hangman-level','medium');
    await page.click('#hangman-hint');assert.ok(await page.locator('#hangman-hint').isDisabled());assert.match(await page.locator('#hangman-status').innerText(),/6 errores/);
    await page.evaluate(()=>document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'ü',bubbles:true})));for(const key of 'pingino')await page.keyboard.press(key);
    assert.match(await page.locator('#hangman-status').innerText(),/Lo lograste.*PINGÜINO/);
    await page.click('#hangman-new');
    for(const key of 'abcdef')await page.keyboard.press(key);
    assert.match(await page.locator('#hangman-status').innerText(),/La palabra era PINGÜINO/);
    assert.equal(await page.locator('#hangman-keys button:not(:disabled)').count(),0);
    assert.equal(await page.locator('#hangman-drawing [data-part]').evaluateAll(parts=>parts.filter(p=>getComputedStyle(p).visibility==='visible').length),6);
    await page.selectOption('#hangman-level','long');
    assert.match(await page.locator('#hangman-status').innerText(),/No hay palabras/);
    await page.selectOption('#hangman-category','Escuela y ciencia');
    for(const key of 'constelacion')await page.keyboard.press(key);
    assert.match(await page.locator('#hangman-status').innerText(),/Lo lograste.*CONSTELACIÓN/);
    // Deck exhausts before repeating; select controls do not consume letters.
    await page.evaluate(()=>HANGMAN_WORDS.splice(0,HANGMAN_WORDS.length,...['sol','luna','mar'].map(word=>({word,category:'Naturaleza'}))));
    await page.selectOption('#hangman-category','Naturaleza');await page.selectOption('#hangman-level','short');
    const found=[];
    for(let round=0;round<3;round++){
      await page.locator('#hangman-level').focus();await page.keyboard.press('z');
      assert.match(await page.locator('#hangman-status').innerText(),/6 errores/);
      await page.locator('#hangman-new').focus();
      for(const key of 'solunamr')await page.keyboard.press(key);
      found.push(await page.locator('#hangman-word').innerText());
      await page.click('#hangman-new');
    }
    assert.equal(new Set(found).size,3);
    // Invalid saved data is ignored; blocked storage still permits play.
    await page.evaluate(()=>localStorage.setItem('angelina-garden-v1',JSON.stringify({plots:[{seed:'<script>'}],collection:{}})));
    await page.reload();await go('#jardin');assert.equal(await page.locator('.garden-plot').count(),9);assert.match(await page.locator('#garden-progress').innerText(),/0 de 6/);
    const blocked=await context.newPage();blocked.on('pageerror',e=>errors.push(e.message));
    await blocked.addInitScript(()=>{Storage.prototype.getItem=Storage.prototype.setItem=()=>{throw new Error('Storage unavailable');};});
    await blocked.goto(url+'#jardin');await blocked.click('[data-plot="0"]');assert.match(await blocked.locator('#garden-storage').innerText(),/No se pudo guardar/);await blocked.close();
    // Responsive navigation, horizontal overflow and touch drawing.
    await page.setViewportSize({width:390,height:844});
    for(const hash of ['#inicio','#artista','#jardin','#colgado']){
      await go(hash);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Overflow at '+hash);
      if(process.env.GAMES_SCREENSHOT_DIR){fs.mkdirSync(process.env.GAMES_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:path.join(process.env.GAMES_SCREENSHOT_DIR,hash.slice(1)+'-mobile.png'),fullPage:true});}
    }
    const touchContext=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
    const touchPage=await touchContext.newPage();touchPage.on('pageerror',e=>errors.push(e.message));
    await touchPage.goto(url+'#artista');
    const touchCanvas=touchPage.locator('#art-canvas');await touchCanvas.scrollIntoViewIfNeeded();
    const touchBefore=await touchCanvas.evaluate(c=>c.toDataURL());
    const touchBox=await touchCanvas.boundingBox();await touchPage.touchscreen.tap(touchBox.x+60,touchBox.y+60);
    assert.notEqual(await touchCanvas.evaluate(c=>c.toDataURL()),touchBefore);
    await touchContext.close();
    assert.deepEqual(errors,[]);
    console.log('PASS: '+words.length+' unique words, routes, artist + PNG + touch, garden persistence, hangman accents/Ñ/win/loss/hint/deck, mobile, storage fallback.');
  }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
