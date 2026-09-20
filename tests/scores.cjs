// node tests/scores.cjs [path-to-playwright]
const {chromium}=require(process.argv[2]||'playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
const url=pathToFileURL(path.resolve(__dirname,'../index.html')).href;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXECUTABLE||undefined});
 try{
  const context=await browser.newContext({viewport:{width:1200,height:1000}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.route('https://fonts.googleapis.com/**',r=>r.abort());
  await page.goto(url+'#puntajes');
  assert.ok(await page.locator('#score-view').isVisible());
  assert.match(await page.locator('.score-local-note').innerText(),/No se comparte/);
  assert.ok(await page.locator('#score-empty').isVisible());
  const go=async hash=>{await page.evaluate(h=>location.hash=h,hash);await page.waitForFunction(h=>location.hash===h&&document.querySelectorAll('main:not([hidden])').length===1,hash);};
  const create=async name=>{
    await page.click('#score-player-open');await page.fill('#score-new-name',name);await page.click('#score-player-form button');
    await page.waitForFunction(n=>document.querySelector('#score-player-name').textContent===n,name);
  };
  const score=async(name,expected)=>page.waitForFunction(({name,expected})=>{
    const d=JSON.parse(localStorage.getItem('angelina-scores-v1')||'null'),p=d?.players.find(p=>p.name===name);
    return p&&p.awards.reduce((n,a)=>n+a.points,0)===expected;
  },{name,expected});
  await create('Luna');
  await page.reload();assert.equal(await page.locator('#score-player-name').innerText(),'Luna');
  // Invalid/duplicate names never add players or change the active profile.
  await page.click('#score-player-open');await page.fill('#score-new-name','luna');await page.click('#score-player-form button');await page.waitForFunction(()=>document.querySelector('#score-player-error').textContent.includes('ya existe'));assert.match(await page.locator('#score-player-error').innerText(),/ya existe/);
  await page.fill('#score-new-name','<script>');await page.click('#score-player-form button');assert.match(await page.locator('#score-player-error').innerText(),/Usa de 2 a 20/);await page.click('#score-player-close');
  // Win and replay the same word: points only once.
  await go('#colgado');
  await page.evaluate(()=>HANGMAN_WORDS.splice(0,HANGMAN_WORDS.length,{word:'niño',category:'Animales'}));
  await page.selectOption('#hangman-category','Animales');
  for(const letter of ['N','I','Ñ','O'])await page.click('[data-letter="'+letter+'"]');
  await score('Luna',180);
  await page.click('#hangman-new');
  for(const letter of ['N','I','Ñ','O'])await page.click('[data-letter="'+letter+'"]');
  await page.waitForFunction(()=>document.querySelector('#score-feedback').textContent.includes('ya sumó'));await score('Luna',180);
  // Garden credits exactly one completed flower.
  await go('#jardin');await page.click('[data-plot="0"]');
  for(const tool of ['water','sun']){await page.click('[data-garden-tool="'+tool+'"]');await page.click('[data-plot="0"]');await page.click('[data-plot="0"]');}
  await page.click('[data-garden-tool="collect"]');await page.click('[data-plot="0"]');await score('Luna',205);
  await page.click('[data-plot="0"]');await score('Luna',205);
  // Art metadata follows undo/redo and a blank canvas is never an achievement.
  await go('#artista');await page.click('#art-finish');assert.match(await page.locator('#art-status').innerText(),/al menos/);await score('Luna',205);
  for(let i=0;i<10;i++){
    await page.fill('#art-color',['#ff0000','#00ff00','#0000ff'][i%3]);
    await page.selectOption('#art-tool',i%2?'star':'brush');
    await page.locator('#art-canvas').click({position:{x:40+(i%5)*45,y:40+Math.floor(i/5)*60}});
  }
  await page.click('#art-undo');await page.click('#art-finish');assert.match(await page.locator('#art-status').innerText(),/al menos/);
  await page.click('#art-redo');await page.click('#art-finish');await score('Luna',255);
  await page.click('#art-finish');await page.waitForFunction(()=>document.querySelector('#art-status').textContent.includes('ya sumó'));assert.match(await page.locator('#art-status').innerText(),/ya sumó/);await score('Luna',255);
  await page.click('#art-clear');assert.match(await page.locator('#art-mission-progress').innerText(),/0\/3 colores/);
  // Dressing and salon achievements are separate and do not double-credit.
  await go('#vestidor');await page.click('#save-outfit');await score('Luna',285);
  await page.click('#save-outfit');await page.waitForFunction(()=>document.querySelector('#score-feedback').textContent.includes('ya sumó'));await score('Luna',285);
  await go('#salon');await page.click('[data-tool="cut"]');await page.click('[data-station="nails"]');await page.click('[data-tool="nails:#ac8bd1"]');await page.click('#salon-save');await score('Luna',305);
  await page.reload();await score('Luna',305);
  await go('#puntajes');assert.match(await page.locator('#score-table-body').innerText(),/305/);
  await page.selectOption('#score-filter','artist');assert.match(await page.locator('#score-table-body').innerText(),/50/);
  await page.selectOption('#score-filter','salon');assert.match(await page.locator('#score-table-body').innerText(),/20/);
  await page.selectOption('#score-filter','all');
  // Independent profiles and table ordering.
  await create('Sol');await score('Sol',0);
  assert.match(await page.locator('#score-table-body tr').first().innerText(),/Luna/);
  await go('#jardin');await page.click('[data-garden-tool="plant"]');await page.click('[data-plot="1"]');
  for(const tool of ['water','sun']){await page.click('[data-garden-tool="'+tool+'"]');await page.click('[data-plot="1"]');await page.click('[data-plot="1"]');}
  await page.click('[data-garden-tool="collect"]');await page.click('[data-plot="1"]');await score('Sol',25);await score('Luna',305);
  await page.click('#score-player-open');await page.selectOption('#score-existing',{label:'Luna'});await page.click('#score-use-player');await page.waitForFunction(()=>document.querySelector('#score-player-name').textContent==='Luna');assert.equal(await page.locator('#score-player-name').innerText(),'Luna');
  // Same-browser tabs synchronize and serialize duplicate awards with Web Locks.
  const other=await context.newPage();other.on('pageerror',e=>errors.push(e.message));await other.goto(url+'#puntajes');
  const details={seed:'rose',water:2,sun:2};
  const results=await Promise.all([page.evaluate(d=>GameScores.award('garden',d,'concurrent-flower'),details),other.evaluate(d=>GameScores.award('garden',d,'concurrent-flower'),details)]);
  assert.equal(results.filter(r=>r.ok).length,1);await score('Luna',330);
  await other.waitForFunction(()=>document.querySelector('#score-player-total').textContent==='330 puntos');
  const both=await Promise.all([page.evaluate(d=>GameScores.award('garden',d,'flower-a'),details),other.evaluate(d=>GameScores.award('garden',d,'flower-b'),details)]);
  assert.ok(both.every(r=>r.ok));await score('Luna',380);
  await other.close();
  // Mobile table and nickname dialog fit a narrow screen.
  await page.setViewportSize({width:320,height:740});await go('#puntajes');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.click('#score-player-open');
  assert.ok(await page.locator('#score-player-dialog').evaluate(d=>{const r=d.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&d.scrollWidth<=d.clientWidth;}));
  await page.click('#score-player-close');
  await go('#vestidor');
  await page.locator('#clothes-grid').evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));
  await page.waitForFunction(()=>!document.querySelector('#character-preview').hidden);
  await page.evaluate(()=>document.querySelector('#score-player-open').click());
  await page.waitForFunction(()=>document.querySelector('#character-preview').hidden);
  await page.click('#score-player-close');
  await page.waitForFunction(()=>!document.querySelector('#character-preview').hidden);
  await go('#puntajes');
  if(process.env.SCORES_SCREENSHOT)await page.screenshot({path:process.env.SCORES_SCREENSHOT,fullPage:true});
  // Restricted storage must report failure and not claim a saved profile.
  const blockedContext=await browser.newContext();
  const blocked=await blockedContext.newPage();blocked.on('pageerror',e=>errors.push(e.message));
  await blocked.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error('quota');};});
  await blocked.goto(url);await blocked.click('#score-player-open');await blocked.fill('#score-new-name','Estrella');await blocked.click('#score-player-form button');
  await blocked.waitForFunction(()=>document.querySelector('#score-player-error').textContent.includes('No se pudo guardar'));assert.match(await blocked.locator('#score-player-error').innerText(),/No se pudo guardar/);
  assert.equal(await blocked.locator('#score-player-name').innerText(),'Invitado');
  await blockedContext.close();
  // Corrupted score data remains intact instead of being overwritten.
  await page.evaluate(()=>localStorage.setItem('angelina-scores-v1','broken-score-data'));
  await page.reload();assert.match(await page.locator('#score-feedback').innerText(),/no se modificarán/);
  await page.click('#score-player-open');await page.fill('#score-new-name','Otro');await page.click('#score-player-form button');
  assert.equal(await page.evaluate(()=>localStorage.getItem('angelina-scores-v1')),'broken-score-data');
  assert.deepEqual(errors,[]);
  console.log('PASS: local aliases, all five games, score rules, duplicates, filters, reload, separate players, cross-tab locking, mobile, quota and corrupt-data preservation.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
