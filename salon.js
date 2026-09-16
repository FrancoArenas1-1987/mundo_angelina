'use strict';

let salonStation = 'hair';
let salonTool = null;
let salonEffectTimer;
let salonTouch = null;
let salonSuppressClickUntil = 0;
let salonScrollFrame;

function salonProductSvg(type, color = '#b7a1ce') {
  const shell = type==='spray'
    ? `<rect x="24" y="29" width="32" height="61" rx="9" fill="${color}"/><path d="M25 41 H55 M25 80 H55" stroke="#fff" stroke-opacity=".45" stroke-width="3"/><rect x="30" y="16" width="20" height="15" rx="4" fill="#e8dce9"/><rect x="36" y="9" width="15" height="10" rx="3" fill="#b2a0bc"/><circle cx="49" cy="13" r="2" fill="#6d577e"/><rect x="30" y="48" width="20" height="24" rx="7" fill="#fff7ed"/>${cuteMotif('heart',40,59,.55,color)}`
    : type==='nails'
    ? `<rect x="25" y="43" width="30" height="41" rx="9" fill="${color}"/><rect x="29" y="11" width="22" height="35" rx="5" fill="#8c709b"/><path d="M31 52 V70" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-linecap="round"/>${cuteMotif('heart',42,65,.5,'#fff6e9')}`
    : type==='lip'
    ? `<rect x="28" y="45" width="25" height="41" rx="4" fill="#c4add1"/><rect x="31" y="35" width="19" height="20" rx="2" fill="#ead6ae"/><path d="M33 39 V22 Q34 17 47 13 L48 39Z" fill="${color}"/><path d="M33 66 H48" stroke="#fff0f4" stroke-width="2"/>`
    : `<ellipse cx="40" cy="65" rx="27" ry="21" fill="#bd9fcc"/><ellipse cx="40" cy="62" rx="22" ry="16" fill="${color}"/><path d="M18 42 Q10 7 40 10 Q69 9 62 42Z" fill="#e7d9ed"/><path d="M23 36 Q18 15 40 16 Q60 15 57 36Z" fill="#faf6fc"/>${type==='shadow'?'<path d="M40 47 V76" stroke="#ffffff77" stroke-width="2"/>':''}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 105" aria-hidden="true"><g stroke="#8b7395" stroke-opacity=".25" stroke-width="1.3">${shell}</g></svg>`;
}

function salonProductButton(type, color, name) {
  const tool = `${type}:${color}`;
  const labels = {spray:'Teñir el pelo',lip:'Pintar los labios',blush:'Aplicar rubor',shadow:'Aplicar sombra',nails:'Pintar las uñas'};
  return `<button class="salon-product" draggable="true" data-tool="${tool}" aria-label="${labels[type]}: ${name}" aria-pressed="${salonTool===tool}">${salonProductSvg(type,color)}<small>${name}</small></button>`;
}

function renderSalonProducts() {
  const products = $('#salon-products');
  products.classList.toggle('cosmetic-cabinet',salonStation!=='hair');
  if(salonStation==='hair') {
    $('#salon-shelf-title').textContent='La estantería de color';
    $('#salon-shelf-note').textContent='Toma un spray y llévalo sobre la cabeza. ¡Una lluvia de color!';
    products.innerHTML=[0,6,12].map(start=>`<div class="spray-shelf">${colors.hair.slice(start,start+6).map(([hex,name])=>salonProductButton('spray',hex,name)).join('')}</div>`).join('');
  } else {
    $('#salon-shelf-title').textContent=salonStation==='nails'?'Tu colección de esmaltes':'El tocador de maquillaje';
    $('#salon-shelf-note').textContent=salonStation==='nails'?'Ocho colores para diez uñas. ¡Combina y brilla!':'Un poquito de color en labios, mejillas y párpados.';
    const sections=salonStation==='nails'?[['nails','Esmaltes de colores']]:[['lip','Labiales'],['blush','Rubores'],['shadow','Sombras de ojos']];
    products.innerHTML=sections.map(([type,title])=>`<h3 class="product-section-title">${title}</h3><div class="makeup-products">${beautyColors.map(([hex,name])=>salonProductButton(type,hex,name)).join('')}</div>`).join('');
  }
}

function placeSalonTarget() {
  if($('#salon-view').hidden) return;
  const head=$('#salon-avatar [data-part="head"]');
  if(!head) return;
  const matrix=head.getScreenCTM();
  if(!matrix) return;
  const a=new DOMPoint(65,35).matrixTransform(matrix), b=new DOMPoint(195,150).matrixTransform(matrix);
  const scene=$('#salon-scene').getBoundingClientRect();
  const target=$('#salon-head-target');
  Object.assign(target.style,{left:`${a.x-scene.left}px`,top:`${a.y-scene.top}px`,width:`${b.x-a.x}px`,height:`${b.y-a.y}px`});
}

function renderSalon() {
  if($('#salon-view').hidden) return;
  // Head accessories stay in the outfit while the stylist works underneath them.
  const preview={...state,outfit:{...state.outfit}};
  if(['hat','bow','glasses'].includes(byId(preview.outfit.accessory)?.shape)) delete preview.outfit.accessory;
  const avatar=avatarSvg(preview);
  $('#salon-avatar').innerHTML=salonStation==='makeup'?avatar.replace('viewBox="0 0 260 410"','viewBox="50 25 160 205"'):avatar;
  $('#salon-hairstyle').value=state.hairStyle;
  $('#manicure-hands').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="75 233 110 48" role="img" aria-label="Tus dos manos con diez uñas"><g transform="translate(17 0)">${handSvg(state,'left')}</g><g transform="translate(-17 0)">${handSvg(state,'right')}</g></svg>`;
  document.querySelectorAll('#salon-view [data-tool]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.tool===salonTool)));
  placeSalonTarget();
}

function salonFeedback(message) { $('#salon-status').textContent=message; }

function salonEffect(kind, color) {
  clearTimeout(salonEffectTimer);
  const target=$('#salon-head-target').getBoundingClientRect(), scene=$('#salon-scene').getBoundingClientRect();
  const x=target.left-scene.left+target.width*.5, y=target.top-scene.top+target.height*.37;
  const effects=$('#salon-effects');
  if(kind==='spray') {
    effects.innerHTML=`<div class="salon-effect-tool" style="left:${x+39}px;top:${y-54}px">${salonProductSvg('spray',color)}</div>`+Array.from({length:30},(_,i)=>`<i class="salon-particle" style="left:${x+44}px;top:${y-19}px;--particle-color:${color};--dx:${-18-(i%8)*12}px;--dy:${14+(i%7)*12}px;--delay:${i*16}ms"></i>`).join('');
  } else if(kind==='wash') {
    effects.innerHTML=Array.from({length:24},(_,i)=>`<i class="salon-particle bubble" style="left:${x-55+(i%7)*17}px;top:${y-12+Math.floor(i/7)*11}px;--size:${12+i%4*7}px;--dx:${i%2?18:-18}px;--delay:${i*24}ms"></i>`).join('')+Array.from({length:20},(_,i)=>`<i class="salon-particle water" style="left:${x-52+(i%10)*12}px;top:${y-30}px;--delay:${500+i*30}ms"></i>`).join('');
  } else if(kind==='cut') {
    effects.innerHTML=Array.from({length:16},(_,i)=>`<i class="salon-particle snip" style="left:${x+(i%2?50:-50)}px;top:${y+20}px;--particle-color:${state.hair};--dx:${i%2?20:-20}px;--dy:${70+i*4}px;--delay:${i*25}ms"></i>`).join('')+`<span class="salon-spark" style="left:${x+40}px;top:${y+25}px">✂</span>`;
  } else {
    effects.innerHTML=Array.from({length:7},(_,i)=>`<span class="salon-spark" style="left:${x-65+i*20}px;top:${y+15+(i%3)*22}px;--particle-color:${color||'#b795d2'};animation-delay:${i*70}ms">✧</span>`).join('');
  }
  if(kind==='nails') {
    $('#manicure-preview').animate([{boxShadow:`0 0 0 0 ${color}`},{boxShadow:`0 0 0 8px transparent`}],{duration:850});
  }
  salonEffectTimer=setTimeout(()=>effects.replaceChildren(),2200);
}

function performSalonTool(tool) {
  if(typeof tool!=='string') return;
  const [kind,color]=tool.split(':');
  let message;
  if(kind==='spray') {
    const tone=colors.hair.find(([hex])=>hex===color); if(!tone)return;
    if(!state.hairBase)state.hairBase=state.hair;
    state.hair=color; message=`¡Pelo teñido de ${tone[1].toLowerCase()}! El spray sale al lavarlo.`;
  } else if(kind==='cut') {
    const cut=$('#salon-cut').value;
    if(!['bob','short','pixie','animeShort'].includes(cut))return;
    state.hairStyle=cut; message=`¡Corte ${hairStyles[cut].name.toLowerCase()} listo! Puedes volver a cambiarlo con el peine.`;
  } else if(kind==='comb') {
    const style=$('#salon-hairstyle').value;if(!Object.hasOwn(hairStyles,style))return;
    state.hairStyle=style;message=`Tu peinado: ${hairStyles[style].name}. ¡Qué bonito quedó!`;
  } else if(kind==='wash') {
    if(state.hairBase){state.hair=state.hairBase;delete state.hairBase;}
    message='Champú, espuma y agua… ¡Pelo limpio, sin spray y listo para peinar!';
  } else if(['lip','blush','shadow','nails'].includes(kind)) {
    const tone=beautyColors.find(([hex])=>hex===color);if(!tone)return;
    state.beauty={...emptyBeauty(),...state.beauty,[kind]:color};
    const parts={lip:'Labios',blush:'Mejillas',shadow:'Párpados',nails:'Las diez uñas'};
    message=`${parts[kind]} en ${tone[1].toLowerCase()}. ¡Un toque de color!`;
  } else if(kind==='clean-makeup') {
    state.beauty={...emptyBeauty(),...state.beauty,lip:'none',blush:'none',shadow:'none'};message='Maquillaje retirado. Tu carita está lista para otra idea.';
  } else if(kind==='clean-nails') {
    state.beauty={...emptyBeauty(),...state.beauty,nails:'none'};message='Esmalte retirado. ¡A probar otra combinación!';
  } else return;
  salonTool=tool;
  syncControls();renderAvatar();salonFeedback(message);salonEffect(kind,color);
}

function salonDropTarget(tool) { return tool?.startsWith('nails:') ? $('#salon-hands-target') : $('#salon-head-target'); }
function validSalonDrop(tool,x,y) {
  if(window.mobilePreviewContains?.(x,y))return true;
  const target=salonDropTarget(tool);
  if(!target||target.getClientRects().length===0)return false;
  const b=target.getBoundingClientRect();return x>=b.left&&x<=b.right&&y>=b.top&&y<=b.bottom;
}
function clearSalonHighlights() { $('#salon-head-target').classList.remove('drop-active');$('#salon-hands-target').classList.remove('drop-active'); }
function clearSalonTouch() {
  cancelAnimationFrame(salonScrollFrame);
  if(salonTouch){clearTimeout(salonTouch.timer);salonTouch.ghost?.remove();salonTouch=null;}
  clearSalonHighlights();
}

function scrollSalonDrag() {
  if(!salonTouch?.ghost)return;
  const direction=salonTouch.y<75?-1:salonTouch.y>innerHeight-75?1:0;
  if(direction)window.scrollBy({top:direction*12,behavior:'instant'});
  salonScrollFrame=requestAnimationFrame(scrollSalonDrag);
}

$('.salon-stations').addEventListener('click',event=>{
  const button=event.target.closest('[data-station]');if(!button)return;
  clearSalonTouch();salonTool=null;salonStation=button.dataset.station;
  document.querySelectorAll('[data-station]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab===button)));
  for(const station of ['hair','makeup','nails'])$(`#${station}-services`).hidden=station!==salonStation;
  $('#manicure-preview').hidden=salonStation!=='nails';$('.salon-mirror-panel').classList.toggle('nail-station',salonStation==='nails');
  $('#salon-head-target').setAttribute('aria-label',salonStation==='makeup'?'Aplicar maquillaje seleccionado a la cara':'Aplicar herramienta seleccionada al cabello');
  salonFeedback(salonStation==='hair'?'Elige una herramienta o un spray para empezar.':salonStation==='makeup'?'Toca un producto o arrástralo a la cara.':'Elige un esmalte para pintar las diez uñas.');
  renderSalonProducts();renderSalon();
});

$('#salon-view').addEventListener('click',event=>{
  if(Date.now()<salonSuppressClickUntil)return;
  const button=event.target.closest('[data-tool]');if(button)performSalonTool(button.dataset.tool);
});
$('#salon-head-target').addEventListener('click',()=>{
  if(salonTool && !salonTool.startsWith('nails:'))performSalonTool(salonTool);else salonFeedback('Primero elige una herramienta o un color del estante.');
});
$('#salon-hands-target').addEventListener('click',()=>{
  if(salonTool?.startsWith('nails:'))performSalonTool(salonTool);else salonFeedback('Elige un frasco de esmalte del estante para empezar.');
});
$('#salon-save').addEventListener('click',()=>$('#save-outfit').click());
$('#salon-download').addEventListener('click',()=>$('#download-outfit').click());

$('#salon-view').addEventListener('dragstart',event=>{
  const button=event.target.closest('[data-tool]');if(!button)return;
  event.dataTransfer.setData('application/x-salon-tool',button.dataset.tool);event.dataTransfer.effectAllowed='copy';salonTool=button.dataset.tool;
  salonDropTarget(salonTool).classList.add('drop-active');
});
for(const target of [$('#salon-head-target'),$('#salon-hands-target')]) {
  target.addEventListener('dragover',event=>{if(!event.dataTransfer.types.includes('application/x-salon-tool'))return;event.preventDefault();event.dataTransfer.dropEffect='copy';target.classList.add('drop-active');});
  target.addEventListener('dragleave',event=>{if(!target.contains(event.relatedTarget))target.classList.remove('drop-active');});
  target.addEventListener('drop',event=>{
    event.preventDefault();const tool=event.dataTransfer.getData('application/x-salon-tool');clearSalonHighlights();
    if(tool && target===salonDropTarget(tool)){performSalonTool(tool);salonSuppressClickUntil=Date.now()+400;}
  });
}
document.addEventListener('dragend',clearSalonHighlights);

$('#salon-view').addEventListener('pointerdown',event=>{
  if(event.pointerType==='mouse')return;
  const button=event.target.closest('[data-tool][draggable="true"]');if(!button)return;
  clearSalonTouch();salonTouch={tool:button.dataset.tool,x:event.clientX,y:event.clientY,pointerId:event.pointerId,ghost:null};
  salonTouch.timer=setTimeout(()=>{
    if(!salonTouch)return;const ghost=document.createElement('div');ghost.className='salon-drag-ghost';
    ghost.innerHTML=button.querySelector('svg')?.outerHTML||`<span>${salonTouch.tool==='cut'?'✂':salonTouch.tool==='wash'?'♧':'≋'}</span>`;
    document.body.appendChild(ghost);salonTouch.ghost=ghost;ghost.style.left=`${salonTouch.x-35}px`;ghost.style.top=`${salonTouch.y-80}px`;
    salonDropTarget(salonTouch.tool).classList.add('drop-active');salonSuppressClickUntil=Date.now()+700;
    scrollSalonDrag();
  },220);
});
document.addEventListener('touchmove',event=>{if(salonTouch?.ghost)event.preventDefault();},{passive:false});
document.addEventListener('pointermove',event=>{
  if(!salonTouch||event.pointerId!==salonTouch.pointerId)return;
  if(!salonTouch.ghost){if(Math.hypot(event.clientX-salonTouch.x,event.clientY-salonTouch.y)>10)clearSalonTouch();return;}
  salonTouch.y=event.clientY;
  salonTouch.ghost.style.left=`${event.clientX-35}px`;salonTouch.ghost.style.top=`${event.clientY-80}px`;
  salonDropTarget(salonTouch.tool).classList.toggle('drop-active',validSalonDrop(salonTouch.tool,event.clientX,event.clientY));
});
document.addEventListener('pointerup',event=>{
  if(!salonTouch||event.pointerId!==salonTouch.pointerId)return;
  if(salonTouch.ghost){if(validSalonDrop(salonTouch.tool,event.clientX,event.clientY))performSalonTool(salonTouch.tool);salonSuppressClickUntil=Date.now()+500;}
  clearSalonTouch();
});
document.addEventListener('pointercancel',clearSalonTouch);
document.addEventListener('characterchange',renderSalon);
document.addEventListener('salonopen',()=>{renderSalon();salonFeedback('¡Bienvenida al salón! Tu personaje y su outfit vienen contigo.');});
document.addEventListener('salonclose',()=>{clearSalonTouch();clearTimeout(salonEffectTimer);$('#salon-effects').replaceChildren();});
window.addEventListener('resize',placeSalonTarget);
$('#salon-hairstyle').innerHTML=Object.entries(hairStyles).map(([id,style])=>`<option value="${id}">${style.name}</option>`).join('');
renderSalonProducts();renderSalon();
