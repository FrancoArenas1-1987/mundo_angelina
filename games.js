'use strict';
(() => {
  const el = id => document.getElementById(id);
  // Canvas history stores complete operations, including a reversible clear.
  const canvas = el('art-canvas'), ctx = canvas.getContext('2d', {willReadFrequently:true});
  const undo = [], redo = [];
  let drawing = null, keyboardPoint = {x:500,y:350}, artActions=[];
  const snapshot = () => ({pixels:ctx.getImageData(0,0,canvas.width,canvas.height),actions:artActions.slice()});
  function restore(saved){ctx.putImageData(saved.pixels,0,0);artActions=saved.actions.slice();updateMission();}
  function artDetails(){return {colors:[...new Set(artActions.map(a=>a.color))],tools:[...new Set(artActions.map(a=>a.tool))],strokes:artActions.length};}
  function updateMission(){const d=artDetails();el('art-mission-progress').textContent='Objetivo: '+d.colors.length+'/3 colores · '+d.tools.length+'/2 herramientas · '+d.strokes+'/10 trazos o sellos. Al terminar: 50 puntos.';}
  function recordArt(){const tool=el('art-tool').value;if(tool!=='eraser'&&artActions.length<100000)artActions.push({tool,color:el('art-color').value});updateMission();}
  const historyButtons = () => { el('art-undo').disabled=!undo.length; el('art-redo').disabled=!redo.length; };
  function remember() { undo.push(snapshot()); if(undo.length>20) undo.shift(); redo.length=0; historyButtons(); }
  function blank() { ctx.fillStyle='#ffffff'; ctx.fillRect(0,0,canvas.width,canvas.height);artActions=[];updateMission(); }
  blank();
  const palette = [['#7854cb','Lavanda'],['#e65e8b','Rosa'],['#e7a633','Dorado'],['#3a986c','Verde'],['#3686bf','Azul'],['#e06943','Naranja'],['#302742','Tinta'],['#ffffff','Blanco']];
  function syncColor() {
    el('art-colors').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===el('art-color').value)));
  }
  palette.forEach(([color,name])=>{
    const button=document.createElement('button');
    button.style.background=color; button.dataset.color=color; button.setAttribute('aria-label',name);
    button.onclick=()=>{el('art-color').value=color;syncColor();};
    el('art-colors').append(button);
  });
  syncColor(); el('art-color').addEventListener('input',syncColor);
  el('art-size').oninput=()=>{el('art-size-value').value=el('art-size').value;};
  function paint(point, previous) {
    const tool=el('art-tool').value, size=Number(el('art-size').value);
    ctx.save(); ctx.fillStyle=ctx.strokeStyle=tool==='eraser'?'#ffffff':el('art-color').value;
    ctx.lineWidth=size; ctx.lineCap=ctx.lineJoin='round';
    if(tool==='brush'||tool==='eraser') {
      ctx.beginPath(); ctx.moveTo(previous?.x ?? point.x,previous?.y ?? point.y); ctx.lineTo(point.x,point.y); ctx.stroke();
      ctx.beginPath();ctx.arc(point.x,point.y,size/2,0,Math.PI*2);ctx.fill();
    } else {
      ctx.translate(point.x,point.y); const r=size*1.3;
      ctx.beginPath();
      if(tool==='star') {
        for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,d=i%2?r*.43:r; i?ctx.lineTo(Math.cos(a)*d,Math.sin(a)*d):ctx.moveTo(Math.cos(a)*d,Math.sin(a)*d);}
        ctx.closePath();ctx.fill();
      } else if(tool==='heart') {
        ctx.moveTo(0,r*.8);ctx.bezierCurveTo(-r*1.8,-r*.2,-r*.7,-r*1.5,0,-r*.6);ctx.bezierCurveTo(r*.7,-r*1.5,r*1.8,-r*.2,0,r*.8);ctx.fill();
      } else {
        for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.beginPath();ctx.arc(Math.cos(a)*r*.6,Math.sin(a)*r*.6,r*.45,0,Math.PI*2);ctx.fill();}
        ctx.fillStyle='#f7d577';ctx.beginPath();ctx.arc(0,0,r*.3,0,Math.PI*2);ctx.fill();
      }
    }
    ctx.restore();
  }
  function point(event) {const box=canvas.getBoundingClientRect();return {x:(event.clientX-box.left)*canvas.width/box.width,y:(event.clientY-box.top)*canvas.height/box.height};}
  canvas.addEventListener('pointerdown',event=>{
    if(!event.isPrimary||event.button!==0||drawing)return;
    event.preventDefault(); canvas.focus({preventScroll:true});canvas.setPointerCapture(event.pointerId);
    remember(); recordArt();drawing={id:event.pointerId,last:point(event)};paint(drawing.last);
  });
  canvas.addEventListener('pointermove',event=>{
    if(!drawing||drawing.id!==event.pointerId)return;
    const next=point(event);
    if(['brush','eraser'].includes(el('art-tool').value))paint(next,drawing.last);
    drawing.last=next;
  });
  function stop(event){if(drawing&&event.pointerId===drawing.id)drawing=null;}
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>canvas.addEventListener(type,stop));
  window.addEventListener('hashchange',()=>{drawing=null;});
  const canvasWrap=document.createElement('div');canvasWrap.style.position='relative';canvas.before(canvasWrap);canvasWrap.append(canvas);
  const cursor=document.createElement('span');cursor.setAttribute('aria-hidden','true');
  cursor.style.cssText='position:absolute;width:16px;height:16px;border:2px solid #302742;border-radius:50%;box-shadow:0 0 0 2px white;pointer-events:none;transform:translate(-50%,-50%);display:none';
  canvasWrap.append(cursor);
  function showCursor(){cursor.style.left=keyboardPoint.x/10+'%';cursor.style.top=keyboardPoint.y/7+'%';}
  showCursor();
  canvas.addEventListener('keydown',event=>{
    const delta={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[event.key];
    if(!delta&&event.code!=='Space')return;
    event.preventDefault();cursor.style.display='block';
    if(delta){keyboardPoint={x:Math.max(0,Math.min(1000,keyboardPoint.x+delta[0])),y:Math.max(0,Math.min(700,keyboardPoint.y+delta[1]))};}
    else if(!event.repeat){remember();recordArt();paint(keyboardPoint);}
    showCursor();el('art-cursor').textContent='Cursor de teclado: '+keyboardPoint.x+', '+keyboardPoint.y+'. Espacio para pintar aquí.';
  });
  canvas.addEventListener('blur',()=>{cursor.style.display='none';});
  el('art-undo').onclick=()=>{if(!undo.length)return;redo.push(snapshot());restore(undo.pop());historyButtons();};
  el('art-redo').onclick=()=>{if(!redo.length)return;undo.push(snapshot());restore(redo.pop());historyButtons();};
  el('art-clear').onclick=()=>{remember();blank();el('art-status').textContent='Un nuevo comienzo. Puedes recuperar el dibujo con Deshacer.';};
  el('art-finish').onclick=async()=>{
    const details=artDetails();
    if(!ScoreRules.calculate('artist',details)){el('art-status').textContent='Para terminar el desafío, usa al menos 3 colores, 2 herramientas y 10 trazos o sellos.';return;}
    const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    let painted=false;for(let i=0;i<pixels.length;i+=4){if(pixels[i]!==255||pixels[i+1]!==255||pixels[i+2]!==255){painted=true;break;}}
    if(!painted){el('art-status').textContent='El lienzo está vacío. Añade tu creación antes de terminar.';return;}
    const result=await window.GameScores.creation('artist',details,canvas.toDataURL());
    el('art-status').textContent=result.ok?'¡Obra terminada! Sumaste 50 puntos. Descárgala para conservarla.':result.reason==='duplicate'?'Esta obra ya sumó puntos. Crea otra para tu próximo desafío.':result.reason==='guest'?'Elige un apodo y vuelve a pulsar Terminar obra para guardar tus puntos.':'No se pudo guardar el puntaje. Puedes intentarlo otra vez.';
  };
  const ideas=['Inventa un planeta con tres lunas.','Dibuja un animal que todavía no existe.','Pinta una ciudad entre las nubes.','Crea un jardín de flores gigantes.','Dibuja tu merienda soñada.','Diseña la bandera de un país imaginario.','Pinta el fondo del mar.','Dibuja un bosque con colores inesperados.'];
  let ideaIndex=0;
  el('art-idea').onclick=()=>{el('art-status').textContent=ideas[ideaIndex++%ideas.length];};
  el('art-save').onclick=()=>{
    canvas.toBlob(blob=>{
      if(!blob){el('art-status').textContent='No pudimos crear la imagen. Inténtalo otra vez.';return;}
      const url=URL.createObjectURL(blob),link=document.createElement('a');
      link.href=url;link.download='mi-pequena-gran-obra.png';document.body.append(link);link.click();link.remove();
      setTimeout(()=>URL.revokeObjectURL(url),30000);
      el('art-status').textContent='Tu obra está lista para descargar como PNG.';
    },'image/png');
  };

  const seeds=[
    {id:'sunflower',name:'Girasol',icon:'🌻',fact:'Los girasoles producen semillas que sirven de alimento a muchas aves.'},
    {id:'tulip',name:'Tulipán',icon:'🌷',fact:'Los tulipanes reales crecen a partir de bulbos.'},
    {id:'rose',name:'Rosa',icon:'🌹',fact:'Los rosales pueden tener flores de muchos colores.'},
    {id:'hibiscus',name:'Hibisco',icon:'🌺',fact:'Las flores del hibisco atraen a animales polinizadores.'},
    {id:'daisy',name:'Margarita',icon:'🌼',fact:'El centro de una margarita reúne muchas flores diminutas.'},
    {id:'cherry',name:'Flor de cerezo',icon:'🌸',fact:'Los cerezos son árboles que florecen en primavera.'}
  ];
  const storageKey='angelina-garden-v1';
  const freshGarden=()=>({plots:Array(9).fill(null),collection:Object.fromEntries(seeds.map(s=>[s.id,0]))});
  function validGarden(value) {
    return value&&Array.isArray(value.plots)&&value.plots.length===9&&value.plots.every(p=>p===null||(p&&seeds.some(s=>s.id===p.seed)&&Number.isInteger(p.water)&&p.water>=0&&p.water<=2&&(p.scoreId===undefined||typeof p.scoreId==='string'&&/^[a-f0-9-]{36}$/.test(p.scoreId))&&Number.isInteger(p.sun)&&p.sun>=0&&p.sun<=2))&&value.collection&&seeds.every(s=>Number.isSafeInteger(value.collection[s.id])&&value.collection[s.id]>=0&&value.collection[s.id]<=9999);
  }
  let garden=freshGarden(),gardenTool='plant';
  try{const stored=JSON.parse(localStorage.getItem(storageKey));if(validGarden(stored))garden=stored;}catch{el('garden-storage').textContent='El guardado no está disponible. Puedes jugar durante esta visita.';}
  function persistGarden(){
    try{localStorage.setItem(storageKey,JSON.stringify(garden));}catch{el('garden-storage').textContent='No se pudo guardar. Tu jardín seguirá disponible durante esta visita.';}
  }
  seeds.forEach(s=>{const option=document.createElement('option');option.value=s.id;option.textContent=s.icon+' '+s.name;el('garden-seed').append(option);});
  const blooming=p=>p.water===2&&p.sun===2;
  function renderGarden(){
    el('garden-plots').replaceChildren();
    garden.plots.forEach((p,index)=>{
      const button=document.createElement('button');button.className='garden-plot';button.dataset.plot=index;
      const seed=p&&seeds.find(s=>s.id===p.seed),grown=p&&blooming(p);
      const symbol=p?(grown?seed.icon:p.water+p.sun>=2?'🌿':'🌱'):'＋';
      const title=p?seed.name:'Plantar aquí';
      const detail=p?(grown?'¡Lista para coleccionar!':'Agua '+p.water+'/2 · Luz '+p.sun+'/2'):'Parcela '+(index+1);
      button.innerHTML='<span class="plant" aria-hidden="true">'+symbol+'</span><b>'+title+'</b><small>'+detail+'</small>';
      button.setAttribute('aria-label','Parcela '+(index+1)+': '+title+'. '+detail);
      button.onclick=()=>care(index);el('garden-plots').append(button);
    });
    el('garden-progress').textContent='Tu colección · '+seeds.filter(s=>garden.collection[s.id]>0).length+' de '+seeds.length+' flores descubiertas';
    el('garden-collection').replaceChildren();
    seeds.forEach(s=>{const item=document.createElement('span');item.textContent=s.icon+' '+s.name+' × '+garden.collection[s.id];el('garden-collection').append(item);});
  }
  function care(index){
    const p=garden.plots[index];let message;
    if(gardenTool==='plant'){
      if(p)message='Esta parcela ya tiene una planta. Cuídala y colecciona su flor.';
      else{garden.plots[index]={seed:el('garden-seed').value,water:0,sun:0,scoreId:window.GameScores.id()};message='¡Semilla plantada! Ahora necesita agua y luz.';}
    }else if(!p)message='Primero planta una semilla en esta parcela.';
    else if(gardenTool==='collect'){
      if(!blooming(p))message='Todavía está creciendo. Completa sus dos riegos y dos rayitos de luz.';
      else{window.GameScores.award('garden',{seed:p.seed,water:p.water,sun:p.sun},p.scoreId||window.GameScores.id());const seed=seeds.find(s=>s.id===p.seed);garden.collection[p.seed]=Math.min(9999,garden.collection[p.seed]+1);garden.plots[index]=null;message='¡'+seed.name+' en tu colección! '+seed.fact;}
    }else{
      const key=gardenTool==='water'?'water':'sun';
      if(p[key]===2)message='Ya tiene suficiente '+(key==='water'?'agua':'luz')+'. '+(blooming(p)?'¡Puedes coleccionarla!':'Prueba el otro cuidado.');
      else{p[key]++;message=blooming(p)?'¡Tu flor se ha abierto! Usa Coleccionar para guardarla.':key==='water'?'¡Un sorbito de agua para crecer!':'¡Un rayito de luz para tu planta!';}
    }
    persistGarden();renderGarden();el('garden-status').textContent=message;
    el('garden-plots').children[index].focus({preventScroll:true});
  }
  el('garden-tools').onclick=event=>{
    const button=event.target.closest('[data-garden-tool]');if(!button)return;
    gardenTool=button.dataset.gardenTool;
    el('garden-tools').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  };
  if(garden.plots.some(p=>p&&!p.scoreId)){garden.plots.forEach(p=>{if(p&&!p.scoreId)p.scoreId=window.GameScores.id();});persistGarden();}
  renderGarden();

  const alphabet=Array.from('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ');
  const normalize=word=>word.toLocaleUpperCase('es').replace(/[ÁÉÍÓÚÜ]/g,c=>({Á:'A',É:'E',Í:'I',Ó:'O',Ú:'U',Ü:'U'})[c]);
  const categories=[...new Set(HANGMAN_WORDS.map(w=>w.category))];
  categories.forEach(category=>{const option=document.createElement('option');option.value=option.textContent=category;el('hangman-category').append(option);});
  el('hangman-count').textContent=HANGMAN_WORDS.length.toLocaleString('es-CL')+' palabras distintas en '+categories.length+' categorías, con vocabulario cotidiano y escolar.';
  let entry=null,guessed=new Set(),mistakes=0,hintUsed=false,finished=false,roundAwarded=false;
  // A shuffled deck per filter prevents repeats until its entire pool is exhausted.
  const decks=new Map();
  function pool(){
    const category=el('hangman-category').value,level=el('hangman-level').value;
    return HANGMAN_WORDS.filter(e=>(category==='all'||e.category===category)&&(level==='all'||(level==='short'?e.word.length<=6:level==='medium'?e.word.length>=7&&e.word.length<=9:e.word.length>=10)));
  }
  function newWord(){
    const key=el('hangman-category').value+'|'+el('hangman-level').value;
    let deck=decks.get(key);
    if(!deck?.length){
      deck=pool().slice();
      for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
      if(deck.length>1&&deck[deck.length-1]===entry)[deck[0],deck[deck.length-1]]=[deck[deck.length-1],deck[0]];
      decks.set(key,deck);
    }
    entry=deck.pop()||null;guessed=new Set();mistakes=0;hintUsed=false;finished=false;roundAwarded=false;renderHangman();
  }
  function renderHangman(){
    const target=entry?normalize(entry.word):'';
    const won=!!entry&&Array.from(target).every(c=>guessed.has(c));
    finished=!entry||won||mistakes>=6;
    el('hangman-topic').textContent=entry?entry.category:'Prueba otra selección';
    const status=!entry?'No hay palabras con estos filtros. Prueba otra categoría o nivel.':won?'¡Lo lograste! La palabra es '+entry.word.toLocaleUpperCase('es')+'.':mistakes>=6?'La palabra era '+entry.word.toLocaleUpperCase('es')+'. ¡La próxima es una nueva oportunidad!':(6-mistakes)+' errores disponibles · '+entry.word.length+' letras'+(hintUsed?' · Ayuda utilizada':'');
    el('hangman-status').textContent=status;
    if(won&&!roundAwarded){roundAwarded=true;const completed=entry;window.GameScores.award('hangman',{word:entry.word,guesses:[...guessed],hintUsed},normalize(entry.word)).then(result=>{if(result.ok&&entry===completed)el('hangman-status').textContent+=' ¡+'+result.points+' puntos guardados!';});}
    el('hangman-word').replaceChildren();
    if(entry)Array.from(entry.word.toLocaleUpperCase('es')).forEach(c=>{const span=document.createElement('span');span.textContent=finished||guessed.has(normalize(c))?c:'_';el('hangman-word').append(span);});
    el('hangman-word').setAttribute('aria-label','Palabra: '+Array.from(el('hangman-word').children).map(s=>s.textContent==='_'?'letra oculta':s.textContent).join(', '));
    el('hangman-drawing').querySelectorAll('[data-part]').forEach((part,index)=>{part.style.visibility=index<mistakes?'visible':'hidden';});
    el('hangman-drawing').setAttribute('aria-label',mistakes+' de 6 partes del muñeco dibujadas');
    el('hangman-keys').querySelectorAll('button').forEach(button=>{
      const letter=button.dataset.letter,used=guessed.has(letter);
      button.disabled=finished||used;button.className=used?(target.includes(letter)?'hit':'miss'):'';
      button.setAttribute('aria-label',letter+(used?(target.includes(letter)?', acertada':', no está en la palabra'):''));
    });
    el('hangman-hint').disabled=finished||hintUsed;
  }
  function guess(letter){
    if(finished||guessed.has(letter)||!alphabet.includes(letter))return;
    guessed.add(letter);if(!normalize(entry.word).includes(letter))mistakes++;
    renderHangman();
  }
  alphabet.forEach(letter=>{const button=document.createElement('button');button.textContent=letter;button.dataset.letter=letter;button.onclick=()=>guess(letter);el('hangman-keys').append(button);});
  el('hangman-hint').onclick=()=>{
    if(finished||hintUsed)return;
    const missing=[...new Set(normalize(entry.word))].filter(c=>!guessed.has(c));
    hintUsed=true;guess(missing[Math.floor(Math.random()*missing.length)]);
  };
  el('hangman-new').onclick=newWord;
  el('hangman-category').onchange=el('hangman-level').onchange=newWord;
  document.addEventListener('keydown',event=>{
    if(document.querySelector('dialog[open]')||el('hangman-view').hidden||event.ctrlKey||event.altKey||event.metaKey||event.repeat||event.isComposing)return;
    if(event.target.closest('input,select,textarea,[contenteditable="true"]'))return;
    const key=normalize(event.key);if(key.length!==1||!alphabet.includes(key))return;
    event.preventDefault();guess(key);
  });
  document.addEventListener('scoreplayerchange',newWord);
  newWord();
})();
