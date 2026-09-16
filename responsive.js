'use strict';

// A collapsible result preview keeps changes visible below the full character.
const previewDock=document.createElement('aside');
previewDock.id='character-preview';
previewDock.hidden=true;
previewDock.setAttribute('aria-label','Vista rápida del personaje');
previewDock.innerHTML='<button id="preview-toggle" aria-label="Ocultar vista rápida" aria-expanded="true">×</button><button id="preview-result" aria-label="Ver personaje completo"><span id="preview-art" aria-hidden="true"></span><span>Ver personaje ↑</span></button>';
document.body.appendChild(previewDock);
let previewCollapsed=false;
let previewFrame;
function previewSource(){return location.hash==='#vestidor'?$('#avatar-stage'):location.hash==='#salon'?(salonStation==='nails'?$('#manicure-preview'):$('#salon-scene')):null;}
function updatePreviewVisibility(){
  const source=previewSource();
  previewDock.hidden=!source||innerWidth>1100||$('#saved-dialog').open||source.getBoundingClientRect().bottom>0;
}
function renderQuickPreview(){
  if(!previewSource())return;
  const previewState={...state,outfit:{...state.outfit}};
  if(location.hash==='#salon'&&['hat','bow','glasses'].includes(byId(previewState.outfit.accessory)?.shape))delete previewState.outfit.accessory;
  $('#preview-art').innerHTML=avatarSvg(previewState);
  const svg=$('#preview-art svg');
  if(location.hash==='#salon'&&salonStation==='makeup')svg.setAttribute('viewBox','50 25 160 205');
  if(location.hash==='#salon'&&salonStation==='nails'){
    $('#preview-art').innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="75 233 110 48"><g transform="translate(17 0)">${handSvg(state,'left')}</g><g transform="translate(-17 0)">${handSvg(state,'right')}</g></svg>`;
  }
  updatePreviewVisibility();
}
function previewContains(x,y){
  if(previewDock.hidden||previewCollapsed)return false;
  const r=$('#preview-result').getBoundingClientRect();
  return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
}
window.mobilePreviewContains=previewContains;
$('#preview-toggle').addEventListener('click',()=>{
  previewCollapsed=!previewCollapsed;
  previewDock.classList.toggle('collapsed',previewCollapsed);
  $('#preview-toggle').textContent=previewCollapsed?'☺':'×';
  $('#preview-toggle').setAttribute('aria-expanded',String(!previewCollapsed));
  $('#preview-toggle').setAttribute('aria-label',previewCollapsed?'Mostrar vista rápida':'Ocultar vista rápida');
});
$('#preview-result').addEventListener('click',()=>{
  if(Date.now()<Math.max(suppressClickUntil,salonSuppressClickUntil))return;
  previewSource()?.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
});
$('#preview-result').addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='copy';});
$('#preview-result').addEventListener('drop',event=>{
  event.preventDefault();
  if(location.hash==='#vestidor'){wear(event.dataTransfer.getData('text/plain'));suppressClickUntil=Date.now()+500;}
  if(location.hash==='#salon'){performSalonTool(event.dataTransfer.getData('application/x-salon-tool'));salonSuppressClickUntil=Date.now()+500;}
});
document.addEventListener('characterchange',renderQuickPreview);
$('.salon-stations').addEventListener('click',renderQuickPreview);
window.addEventListener('hashchange',()=>{clearTouch();renderQuickPreview();updatePreviewVisibility();});
window.addEventListener('scroll',()=>{
  cancelAnimationFrame(previewFrame);previewFrame=requestAnimationFrame(updatePreviewVisibility);
},{passive:true});
window.addEventListener('resize',updatePreviewVisibility);
new MutationObserver(updatePreviewVisibility).observe($('#saved-dialog'),{attributes:true,attributeFilter:['open']});
renderQuickPreview();
