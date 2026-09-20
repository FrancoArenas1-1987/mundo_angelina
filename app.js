'use strict';

const $ = (selector) => document.querySelector(selector);
const colors = {
  skin: [['#f5d5bc','Clara'],['#e8b894','Durazno'],['#cf946c','Canela'],['#a66b48','Morena'],['#704731','Oscura']],
  hair: [['#463127','Castaño'],['#252332','Negro'],['#d8aa59','Rubio'],['#a95435','Cobrizo'],['#9a79be','Lavanda'],['#b9b8bd','Gris'],['#604135','Chocolate'],['#966b48','Castaño claro'],['#bc8a47','Miel'],['#e8d8ad','Rubio platino'],['#bd553d','Pelirrojo'],['#793d57','Borgoña'],['#e3e1df','Blanco perla'],['#d592b5','Rosa'],['#775399','Violeta'],['#527bad','Azul'],['#54a5a8','Turquesa'],['#719779','Verde salvia']],
  eye: [['#684635','Marrón'],['#5b8696','Azul'],['#668566','Verde'],['#35303c','Oscuro'],['#b73951','Rubí'],['#bb8337','Ámbar'],['#9271b5','Violeta']]
};
const hairStyles = {
  long:{name:'Largo',hatWidth:44},
  bob:{name:'Media melena',hatWidth:45},
  short:{name:'Corto',hatWidth:42},
  curly:{name:'Rizado',hatWidth:57,crownY:38},
  wavy:{name:'Largo con ondas',hatWidth:48},
  bangs:{name:'Melena con flequillo',hatWidth:45},
  ponytail:{name:'Cola de caballo',hatWidth:44},
  pigtails:{name:'Dos coletas',hatWidth:46},
  braids:{name:'Dos trenzas',hatWidth:46},
  bun:{name:'Moño alto',hatWidth:44},
  afro:{name:'Afro',hatWidth:62,crownY:34},
  pixie:{name:'Corto pixie',hatWidth:42},
  animeShort:{name:'Anime corto en capas',hatWidth:47},
  animeLong:{name:'Anime largo con mechones',hatWidth:48},
  animePony:{name:'Anime recogido lateral',hatWidth:47}
};
const eyeStyles = {round:'Redondos',almond:'Almendrados',happy:'Sonrientes',large:'Grandes',oval:'Ovalados',wink:'Guiño',lashes:'Pestañas largas',relaxed:'Relajados',animeRound:'Anime brillantes',animeSoft:'Anime dulces',animeSharp:'Anime almendrados'};
const mouthStyles = {smile:'Sonrisa suave',grin:'Sonrisa con dientes',laugh:'Risa',small:'Boca pequeña',neutral:'Boca recta',surprised:'Sorpresa',kiss:'Besito'};
const beautyColors = [['#dd8da9','Rosa algodón'],['#bb6388','Frambuesa'],['#e7a084','Durazno'],['#ac8bd1','Lavanda'],['#81b9c8','Celeste'],['#8dbca3','Menta'],['#d5b36b','Dorado'],['#eddae6','Perla']];
const emptyBeauty = () => ({lip:'none',blush:'none',shadow:'none',nails:'none'});
const clothes = [
  {id:'tee-lilac',name:'Camiseta lila',category:'top',shape:'tee',color:'#c3afe3'},
  {id:'tee-peach',name:'Camiseta durazno',category:'top',shape:'tee',color:'#f1bdb1'},
  {id:'shirt-cream',name:'Blusa vainilla',category:'top',shape:'blouse',color:'#fff0d6'},
  {id:'sweater-mint',name:'Suéter salvia',category:'top',shape:'sweater',color:'#b4d4bd'},
  {id:'stripe-blue',name:'Rayas marineras',category:'top',shape:'stripe',color:'#add2e4'},
  {id:'hoodie-rose',name:'Polerón rosa',category:'top',shape:'hoodie',color:'#e9b7d0'},
  {id:'jeans',name:'Jeans azules',category:'bottom',shape:'pants',color:'#a1bed8'},
  {id:'pants-cream',name:'Pantalón arena',category:'bottom',shape:'pants',color:'#e6d3b2'},
  {id:'skirt-rose',name:'Falda rosa',category:'bottom',shape:'skirt',color:'#e6aecb'},
  {id:'skirt-lilac',name:'Falda lavanda',category:'bottom',shape:'skirt',color:'#c5b2df'},
  {id:'shorts-sage',name:'Shorts salvia',category:'bottom',shape:'shorts',color:'#b7cfad'},
  {id:'shorts-denim',name:'Shorts denim',category:'bottom',shape:'shorts',color:'#a4c5dd'},
  {id:'dress-sun',name:'Vestido sol',category:'dress',shape:'dress',color:'#f0d68e'},
  {id:'dress-lilac',name:'Vestido flor',category:'dress',shape:'floral',color:'#c9b5e5'},
  {id:'dress-coral',name:'Vestido coral',category:'dress',shape:'dress',color:'#f0b7ac'},
  {id:'dress-sage',name:'Vestido bosque',category:'dress',shape:'floral',color:'#b9d5b9'},
  {id:'shoes-white',name:'Zapatillas nube',category:'shoes',shape:'sneakers',color:'#f9f5ec'},
  {id:'shoes-lilac',name:'Zapatillas uva',category:'shoes',shape:'sneakers',color:'#c3b0df'},
  {id:'boots',name:'Botines caramelo',category:'shoes',shape:'boots',color:'#cba487'},
  {id:'shoes-rose',name:'Zapatos cereza',category:'shoes',shape:'flats',color:'#dba5c0'},
  {id:'bag',name:'Bolso durazno',category:'accessory',shape:'bag',color:'#efc1b3'},
  {id:'bow',name:'Lazo lavanda',category:'accessory',shape:'bow',color:'#bea1df'},
  {id:'glasses',name:'Gafas redondas',category:'accessory',shape:'glasses',color:'#a389ae'},
  {id:'hat',name:'Gorro de sol',category:'accessory',shape:'hat',color:'#ead29b'},
  {id:'jersey-sky',name:'Camiseta de equipo',category:'top',shape:'tee',detail:'jersey',style:'sport',color:'#9acfe2'},
  {id:'jersey-orange',name:'Camiseta energía',category:'top',shape:'tee',detail:'jersey',style:'sport',color:'#f0be97'},
  {id:'track-navy',name:'Chaqueta deportiva',category:'top',shape:'sweater',detail:'track',style:'sport',color:'#91a8d1'},
  {id:'track-mint',name:'Chaqueta menta',category:'top',shape:'sweater',detail:'track',style:'sport',color:'#b0d9c8'},
  {id:'joggers-navy',name:'Buzo azul',category:'bottom',shape:'pants',detail:'joggers',style:'sport',color:'#91a8d1'},
  {id:'joggers-grey',name:'Buzo gris',category:'bottom',shape:'pants',detail:'joggers',style:'sport',color:'#c0bfce'},
  {id:'sport-shorts-blue',name:'Shorts de entrenamiento',category:'bottom',shape:'shorts',detail:'sport',style:'sport',color:'#a2c8de'},
  {id:'sport-shorts-rose',name:'Shorts de juego',category:'bottom',shape:'shorts',detail:'sport',style:'sport',color:'#e4b3cb'},
  {id:'blazer-navy',name:'Blazer azul y camisa',category:'top',shape:'sweater',detail:'blazer',style:'elegant',color:'#8c9bc1'},
  {id:'blazer-rose',name:'Blazer rosa y camisa',category:'top',shape:'sweater',detail:'blazer',style:'elegant',color:'#dcb3cc'},
  {id:'blouse-bow',name:'Blusa con lazo',category:'top',shape:'blouse',detail:'bow',style:'elegant',color:'#fff1df'},
  {id:'formal-trousers',name:'Pantalón de vestir',category:'bottom',shape:'pants',detail:'formal',style:'elegant',color:'#a3a0bb'},
  {id:'skirt-gala',name:'Falda de fiesta',category:'bottom',shape:'skirt',detail:'gala',style:'elegant',color:'#c79bbd'},
  {id:'dress-midnight',name:'Vestido medianoche',category:'dress',shape:'dress',detail:'gala',style:'elegant',color:'#a0add9'},
  {id:'dress-pearl',name:'Vestido rosa perla',category:'dress',shape:'dress',detail:'gala',style:'elegant',color:'#e3bdd4'},
  {id:'runners',name:'Zapatillas para correr',category:'shoes',shape:'sneakers',detail:'running',style:'sport',color:'#9cd3cc'},
  {id:'high-tops',name:'Zapatillas de caña alta',category:'shoes',shape:'sneakers',detail:'high-top',style:'sport',color:'#e4b7af'},
  {id:'loafers',name:'Mocasines clásicos',category:'shoes',shape:'flats',detail:'loafers',style:'elegant',color:'#b7928c'},
  {id:'mary-janes',name:'Zapatos con hebilla',category:'shoes',shape:'flats',detail:'mary-jane',style:'elegant',color:'#a08ebc'},
  {id:'ballet-flats',name:'Bailarinas con lazo',category:'shoes',shape:'flats',detail:'ballet',style:'elegant',color:'#ecc2d6'},
  {id:'rain-boots',name:'Botas de lluvia',category:'shoes',shape:'boots',detail:'rain',color:'#ebd084'},
  {id:'hiking-boots',name:'Botas de excursión',category:'shoes',shape:'boots',detail:'hiking',style:'sport',color:'#b8c5a5'},
  {id:'dress-bunny-lace',name:'Vestido conejito de encaje',category:'dress',shape:'dress',detail:'boutique',motif:'bunny',style:'elegant',color:'#e9bbd6',accent:'#c88cba'},
  {id:'dress-strawberry',name:'Vestido fresita dulce',category:'dress',shape:'dress',detail:'boutique',motif:'strawberry',style:'elegant',color:'#f0b1bc',accent:'#cf7898'},
  {id:'dress-lavender-bows',name:'Vestido lazos de lavanda',category:'dress',shape:'dress',detail:'boutique',motif:'bow',style:'elegant',color:'#c5b4e5',accent:'#a284c7'},
  {id:'dress-cloud-princess',name:'Vestido princesa nube',category:'dress',shape:'dress',detail:'boutique',motif:'cloud',style:'elegant',color:'#abd6e8',accent:'#88adce'},
  {id:'dress-mint-garden',name:'Vestido jardín de gatitos',category:'dress',shape:'dress',detail:'boutique',motif:'kitty',style:'elegant',color:'#b5dbc9',accent:'#7bbba6'},
  {id:'dress-night-stars',name:'Vestido noche estrellada',category:'dress',shape:'dress',detail:'boutique',motif:'star',style:'elegant',color:'#7786b2',accent:'#53658e'}
];
const byId = (id) => clothes.find(item => item.id === id);
const initialState = () => ({gender:'female',age:12,height:1,build:'medium',face:'round',skin:colors.skin[1][0],hairStyle:'long',hair:colors.hair[0][0],eyes:'round',eye:colors.eye[0][0],mouth:'smile',outfit:{top:'tee-lilac',bottom:'jeans',shoes:'shoes-white'}});
let state = initialState();
let category = 'all';
let clothingStyle = 'all';
let avatarSequence = 0;
let saved = [];
let toastTimer;
const storageKey = 'juegosdivertidos-outfits-v1';

// Validate persisted data before using it in SVG or in the character controls.
function validState(value) {
  if (!value || typeof value !== 'object' || !value.outfit || typeof value.outfit !== 'object') return false;
  const choices = {gender:['female','male'],height:[0,1,2],build:['slim','medium','full'],face:['round','oval','soft'],hairStyle:Object.keys(hairStyles),eyes:Object.keys(eyeStyles)};
  if (!Object.entries(choices).every(([key, values]) => values.includes(value[key]))) return false;
  // Older outfits predate the mouth selector and keep their original soft smile.
  if (value.mouth !== undefined && !Object.keys(mouthStyles).includes(value.mouth)) return false;
  if(value.hairBase !== undefined && !colors.hair.some(([hex])=>hex===value.hairBase)) return false;
  if(value.beauty !== undefined && (!value.beauty || typeof value.beauty !== 'object' || !Object.keys(emptyBeauty()).every(key=>value.beauty[key]==='none'||beautyColors.some(([hex])=>hex===value.beauty[key])))) return false;
  if (!Number.isInteger(value.age) || value.age < 6 || value.age > 60) return false;
  if (!['skin','hair','eye'].every(key => colors[key].some(([hex]) => hex === value[key]))) return false;
  const entries = Object.entries(value.outfit);
  if (!entries.every(([slot,id]) => byId(id)?.category === slot)) return false;
  return !(value.outfit.dress && (value.outfit.top || value.outfit.bottom));
}
try {
  const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
  if (Array.isArray(data)) saved = data.filter(entry => entry && typeof entry.id === 'string' && /^[a-z0-9-]+$/.test(entry.id) && validState(entry.state)).slice(0,30).map(entry=>({...entry,state:{mouth:'smile',...entry.state}}));
} catch { /* The game also works when browser storage is unavailable. */ }

// Clothing overlaps the body outline, including the thick arm strokes.
// Reuse these silhouettes for the base clothes so they have the same coverage.
const silhouettes = {
  tee: 'M106 148 L89 151 L74 183 L95 196 L100 184 L96 235 Q130 243 164 235 L160 184 L165 196 L186 183 L171 151 L154 148 Q130 158 106 148Z',
  blouse: 'M106 148 Q89 147 76 169 L73 195 L97 201 L102 183 L96 237 Q130 245 164 237 L158 183 L163 201 L187 195 L184 169 Q171 147 154 148 Q130 158 106 148Z',
  longSleeve: 'M106 148 L89 151 Q76 180 62 230 L94 238 L103 201 L96 240 Q130 248 164 240 L157 201 L166 238 L198 230 Q184 180 171 151 L154 148 Q130 158 106 148Z',
  shorts: 'M97 226 Q130 231 163 226 L166 289 L131 292 L130 270 L129 292 L94 289Z'
};

function hatFit(character = {}) {
  const style = hairStyles[character.hairStyle] || hairStyles.long;
  const faceAdjustment = character.face === 'oval' ? -2 : character.face === 'soft' ? 1 : 0;
  return {halfWidth:style.hatWidth + faceAdjustment, brimY:80, crownY:style.crownY || 44};
}

function cuteMotif(kind, x, y, scale = 1, color = '#fff8ec') {
  const face = '<circle cx="-4" cy="0" r="1.1" fill="#70556c"/><circle cx="4" cy="0" r="1.1" fill="#70556c"/><path d="M-2 4 Q0 6 2 4" fill="none" stroke="#70556c" stroke-width="1" stroke-linecap="round"/><ellipse cx="-7" cy="3" rx="2" ry="1.2" fill="#efaebb"/><ellipse cx="7" cy="3" rx="2" ry="1.2" fill="#efaebb"/>';
  const shapes = {
    star:`<path d="M0 -12 L3 -4 L12 -3 L5 3 L7 12 L0 7 L-7 12 L-5 3 L-12 -3 L-3 -4Z" fill="${color}"/>${face}`,
    cloud:`<path d="M-10 8 Q-19 8 -17 0 Q-16 -6 -9 -5 Q-8 -17 3 -13 Q9 -12 10 -5 Q20 -5 19 3 Q18 9 10 8Z" fill="${color}"/>${face}`,
    strawberry:`<path d="M-11 -5 Q-4 -12 0 -7 Q6 -13 12 -4 Q12 7 0 14 Q-12 6 -11 -5Z" fill="#e28eaa"/><path d="M-9 -6 L-4 -11 L0 -7 L5 -12 L10 -6 L3 -4 L0 -1 L-3 -4Z" fill="#8eb998"/><path d="M-5 0 L-4 2 M5 0 L4 2 M0 6 V8" stroke="#fff5d5" stroke-width="1.6" stroke-linecap="round"/>`,
    heart:`<path d="M0 7 C-17 -3 -7 -12 0 -5 C7 -12 17 -3 0 7Z" fill="${color}"/>`,
    bow:`<path d="M0 0 Q-16 -13 -14 0 Q-14 12 0 1 Q14 12 14 0 Q16 -13 0 0Z" fill="${color}"/><path d="M-2 3 L-7 13 M2 3 L7 13" stroke="${color}" stroke-width="3" stroke-linecap="round"/><circle r="3" fill="#d69fbb"/>`,
    bunny:`<ellipse cx="-5" cy="-12" rx="4" ry="10" fill="${color}"/><ellipse cx="5" cy="-12" rx="4" ry="10" fill="${color}"/><path d="M-5 -17 V-8 M5 -17 V-8" stroke="#edb7c7" stroke-width="2" stroke-linecap="round"/><ellipse cy="0" rx="12" ry="10" fill="${color}"/>${face}`,
    kitty:`<path d="M-11 -2 L-12 -14 L-4 -8 Q0 -10 4 -8 L12 -14 L11 -2 Q14 10 0 11 Q-14 10 -11 -2Z" fill="${color}"/><path d="M-9 -9 L-8 -5 M9 -9 L8 -5" stroke="#edb7c7" stroke-width="2"/>${face}`,
    bear:`<circle cx="-8" cy="-8" r="5" fill="${color}"/><circle cx="8" cy="-8" r="5" fill="${color}"/><circle cx="-8" cy="-8" r="2.5" fill="#ecc2c2"/><circle cx="8" cy="-8" r="2.5" fill="#ecc2c2"/><ellipse cy="0" rx="12" ry="11" fill="${color}"/>${face}`
  };
  return `<g transform="translate(${x} ${y}) scale(${scale})" stroke="none">${shapes[kind] || shapes.heart}</g>`;
}

function laceTrim(left, right, y, sag = 8) {
  const steps = 12, base = t => y + 4*t*(1-t)*sag;
  let d = `M${left} ${y}`;
  for(let i=0;i<steps;i++) {
    const t=(i+1)/steps, middle=(i+.5)/steps;
    d+=` Q${left+(right-left)*middle} ${base(middle)+3} ${left+(right-left)*t} ${base(t)}`;
  }
  return `<path d="${d}" fill="none" stroke="#fff9ee" stroke-width="2.4" stroke-linecap="round"/>`;
}

function boutiqueDressDetails(item) {
  const accent = item.accent;
  const pearls = [[100,244],[110,248],[120,250],[130,251],[140,250],[150,248],[160,244]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#fff9ed"/>`).join('');
  return `<path d="M108 152 Q105 172 117 176 Q125 177 130 157 Q135 177 143 176 Q155 172 152 152 Q130 161 108 152Z" fill="#fff7e9" stroke="none"/>
    <path d="M114 178 H146 L143 214 H117Z" fill="#fff7e9" fill-opacity=".65" stroke="none"/>
    <path d="M120 198 L140 207 L120 215 M140 198 L120 207 L140 215" stroke="${accent}" stroke-width="1.5" fill="none"/>
    ${cuteMotif(item.motif,130,187,item.motif==='bunny'?.62:.75,item.motif==='bow'?accent:'#fff7e9')}
    <path d="M109 236 Q130 243 151 236 L167 278 Q130 298 93 278Z" fill="#fff7ef" fill-opacity=".9" stroke="none"/>
    ${laceTrim(98,162,277,11)}${laceTrim(91,169,291,10)}${laceTrim(82,178,303,9)}
    <path d="M87 293 Q130 311 173 293" stroke="${accent}" stroke-width="2" fill="none"/>
    ${pearls}${cuteMotif('bow',130,226,1.05,accent)}${cuteMotif('bow',90,174,.45,'#fff7e9')}${cuteMotif('bow',170,174,.45,'#fff7e9')}
    ${cuteMotif(item.motif,130,266,.65,item.motif==='bow'?accent:'#eac3d9')}
    ${cuteMotif('heart',109,260,.4,accent)}${cuteMotif('heart',151,260,.4,accent)}
    ${cuteMotif('bow',102,292,.4,'#fff7e9')}${cuteMotif('bow',158,292,.4,'#fff7e9')}`;
}

function kawaiiDetails(item) {
  if(item.detail==='boutique') return boutiqueDressDetails(item);
  if(item.category==='top') {
    if(item.detail==='jersey') return cuteMotif('heart',149,216,.42,'#fff2d7');
    if(item.detail==='track') return cuteMotif('heart',149,198,.5,'#f9deee');
    if(item.detail==='blazer') return cuteMotif('heart',151,193,.4,'#f8d8e6');
    if(item.shape==='blouse') return item.detail==='bow' ? cuteMotif('heart',146,214,.42,'#d9bbdf') : cuteMotif('bow',130,171,.65,'#d8b5df');
    if(item.shape==='stripe') return cuteMotif('heart',145,198,.65,'#e5a6be');
    if(item.shape==='hoodie') return cuteMotif('bunny',130,201,.78);
    if(item.shape==='sweater') return cuteMotif('bear',130,198,1.25);
    return '';
  }
  if(item.shape==='pants') return item.detail==='formal' ? cuteMotif('bow',148,252,.34,'#e4c5e5') : item.detail==='joggers' ? cuteMotif('heart',145,261,.5,'#fce0eb') : cuteMotif('heart',115,294,.85,'#f6c4d8')+cuteMotif('heart',143,320,.5,'#fff8e6');
  if(item.shape==='shorts') return cuteMotif('heart',113,269,.65,'#fff1dc');
  if(item.shape==='skirt') return laceTrim(85,175,296,9)+cuteMotif('bow',146,247,.75,'#fff3e0')+cuteMotif('heart',111,275,.55,'#fff6e8');
  if(item.category==='dress') return laceTrim(83,177,301,9)+(item.detail==='gala' ? cuteMotif('heart',148,267,.6,'#fff1dc') : item.shape==='floral' ? cuteMotif('bow',130,172,.65,'#fff1dc') : cuteMotif(item.id==='dress-sun'?'bunny':'kitty',130,195,.9))+cuteMotif('heart',105,275,.6,'#fff4e3');
  if(item.category==='shoes') {
    if(item.shape==='boots') return cuteMotif('heart',115,344,.55,'#ffe2ed')+cuteMotif('heart',145,344,.55,'#ffe2ed');
    if(item.detail==='ballet'||item.detail==='loafers') return '';
    const kind=item.detail==='running'||item.detail==='hiking'?'heart':'bow';
    return cuteMotif(kind,113,365,.38,'#f6c4db')+cuteMotif(kind,147,365,.38,'#f6c4db');
  }
  if(item.shape==='bag') return cuteMotif('bunny',172,265,.68);
  if(item.shape==='hat') return cuteMotif('bow',151,69,.55,'#f9dbe9');
  if(item.shape==='bow') return cuteMotif('heart',159,79,.4,'#ffe7ef');
  return '';
}

function garment(item, character) {
  if (!item) return '';
  const c = item.color;
  const outline = 'stroke="#57415a" stroke-opacity=".25" stroke-width="1.8" stroke-linejoin="round"';
  let drawing = '';
  switch (item.shape) {
    case 'tee': case 'stripe':
      drawing = `<path d="${silhouettes.tee}" fill="${c}"/><path d="M109 151 Q130 161 151 151" fill="none" stroke="#ffffff" stroke-opacity=".6" stroke-width="4"/>`;
      if (item.detail === 'jersey') drawing += '<path d="M88 167 L101 174 M159 174 L172 167 M102 225 H158" stroke="#fff8e9" stroke-width="4"/><path d="M117 182 H127 V204 M136 182 H146 L137 204" fill="none" stroke="#fff8e9" stroke-width="4" stroke-linecap="round"/>';
      else if (item.shape === 'stripe') drawing += [184,197,210,223].map(y=>`<path d="M101 ${y} H159" stroke="#f9f6ec" stroke-width="5"/>`).join('');
      else drawing += cuteMotif(item.id==='tee-peach'?'kitty':'bunny',130,198,1.2);
      break;
    case 'blouse':
      drawing = `<path d="${silhouettes.blouse}" fill="${c}"/><path d="M106 150 Q103 168 117 174 Q124 177 130 157 Q136 177 143 174 Q157 168 154 150 Q130 159 106 150Z" fill="#fffaf0"/><path d="M130 174 V234" stroke="#c4b79e"/>${[184,198,212].map(y=>`<circle cx="130" cy="${y}" r="2" fill="#c39bbb"/>`).join('')}`;
      if(item.detail==='bow') drawing += '<path d="M130 169 Q111 157 113 170 Q114 180 130 171 Q148 181 147 168 Q146 157 130 169 M127 172 L120 189 M133 172 L140 189" fill="#8d769e" stroke="#8d769e" stroke-width="3"/><circle cx="130" cy="170" r="3" fill="#bba1c4"/>';
      break;
    case 'sweater': case 'hoodie':
      drawing = `<path d="${silhouettes.longSleeve}" fill="${c}"/><path d="M99 234 Q130 240 161 234 M66 224 L94 231 M166 231 L194 224" fill="none" stroke="#ffffff" stroke-opacity=".45" stroke-width="4"/>`;
      if (item.shape === 'hoodie') drawing += '<path d="M105 154 Q103 175 130 180 Q157 175 155 154 Q130 141 105 154Z" fill="none"/><path d="M121 177 V196 M139 177 V196 M114 211 Q130 205 146 211 L148 225 H112Z" fill="none"/>';
      if(item.detail==='track') drawing += '<path d="M130 156 V239 M88 163 L69 221 M94 165 L76 223 M172 163 L191 221 M166 165 L184 223" stroke="#f6f0df" stroke-width="3" fill="none"/><path d="M108 209 L103 222 M152 209 L157 222" fill="none"/><rect x="128" y="173" width="4" height="8" rx="1" fill="#e2cf95"/><path d="M141 180 L148 172 L154 180Z" fill="#f6f0df" stroke="none"/>';
      if(item.detail==='blazer') drawing += '<path d="M109 151 Q130 158 151 151 L139 208 H121Z" fill="#fff4e5"/><path d="M107 153 L99 173 L113 179 L105 186 L128 215 L119 175Z M153 153 L161 173 L147 179 L155 186 L132 215 L141 175Z" fill="#ffffff" fill-opacity=".2"/><path d="M130 210 V242 M103 218 H118 M142 218 H157" fill="none"/><circle cx="133" cy="216" r="2.5" fill="#e9ce94"/><circle cx="133" cy="230" r="2.5" fill="#e9ce94"/>';
      break;
    case 'pants':
      drawing = `<path d="M99 226 Q130 233 161 226 L162 267 L155 354 L133 354 L130 271 L127 354 L105 354 L98 267Z" fill="${c}"/><path d="M100 238 H160 M130 239 V271 M106 242 Q108 257 119 253 M154 242 Q152 257 141 253" fill="none"/><path d="M104 347 H127 M133 347 H156" stroke="#ffffff" stroke-opacity=".4" stroke-width="5"/><circle cx="130" cy="238" r="2" fill="#d5b276"/>`;
      if(item.detail==='joggers') drawing += '<path d="M104 242 L107 273 L111 342 M156 242 L153 273 L149 342" fill="none" stroke="#f6efdf" stroke-width="3"/><path d="M126 239 L122 251 M134 239 L138 251" stroke="#f6efdf" stroke-width="2"/><path d="M106 350 H126 M134 350 H154" stroke="#4f5669" stroke-opacity=".45" stroke-width="6"/>';
      if(item.detail==='formal') drawing += '<path d="M114 259 L116 345 M146 259 L144 345" stroke="#ffffff" stroke-opacity=".28" fill="none"/><path d="M102 235 H158" stroke="#494457" stroke-width="5"/><rect x="126" y="232" width="8" height="6" rx="1" fill="none" stroke="#ddc28b"/>';
      break;
    case 'shorts':
      drawing = `<path d="${silhouettes.shorts}" fill="${c}"/><path d="M99 237 H161 M130 239 V270 M105 242 Q106 255 117 253 M155 242 Q154 255 143 253 M96 283 L128 286 M132 286 L164 283" fill="none"/>`;
      if(item.detail==='sport') drawing += '<path d="M102 245 L100 279 M158 245 L160 279 M98 284 L126 287 M134 287 L162 284" stroke="#fff6e5" stroke-width="3"/><path d="M126 239 L122 249 M134 239 L138 249" stroke="#fff6e5" stroke-width="2"/>';
      break;
    case 'skirt':
      drawing = `<path d="M99 227 Q130 233 161 227 L181 301 Q130 319 79 301Z" fill="${c}"/><path d="M99 237 Q130 242 161 237 M109 242 L99 301 M122 244 L117 306 M139 244 L144 306 M152 242 L163 301" fill="none" stroke-opacity=".18"/>`;
      if(item.detail==='gala') drawing += '<path d="M100 233 Q130 239 160 233 M84 299 Q130 314 176 299" stroke="#f0d39c" stroke-width="3" fill="none"/><path d="M115 245 L108 303 M145 245 L152 303" stroke="#fff5eb" stroke-opacity=".35" fill="none"/>';
      break;
    case 'dress': case 'floral':
      // Overlap the torso and shoulder outlines so skin cannot peek through the seams.
      // The dress and body share the same transform for every build and height.
      drawing = `<path d="M106 148 L89 151 L74 183 L95 196 L100 184 L96 224 L76 307 Q130 329 184 307 L164 224 L160 184 L165 196 L186 183 L171 151 L154 148 Q130 158 106 148Z" fill="${c}"/><path d="M96 224 Q130 231 164 224" stroke="#fff7e6" stroke-width="6"/><path d="M130 226 Q112 211 112 225 Q114 236 130 226 Q148 210 148 225 Q146 236 130 226" fill="#fff7e6" stroke="none"/>`;
      if(item.shape==='floral') drawing += [[112,192],[146,203],[109,263],[150,281],[127,299],[137,253],[93,296],[165,301]].map(([x,y])=>`<g transform="translate(${x} ${y})" fill="#fff7e6" stroke="none"><circle cx="-3" cy="0" r="3"/><circle cx="3" cy="0" r="3"/><circle cx="0" cy="-3" r="3"/><circle cx="0" cy="3" r="3"/><circle r="2" fill="#e6bd6b"/></g>`).join('');
      if(item.detail==='gala') drawing += '<path d="M112 156 Q130 184 148 156" stroke="#fff2d7" stroke-width="3" fill="none" stroke-dasharray="1 5" stroke-linecap="round"/><path d="M106 239 L88 303 Q107 310 122 310 L123 238Z" fill="#fff7e6" fill-opacity=".14" stroke="none"/><path d="M81 304 Q130 323 179 304" stroke="#edd29d" stroke-width="3" fill="none"/><circle cx="130" cy="227" r="4" fill="#edd29d"/>';
      break;
    case 'sneakers': case 'flats': case 'boots': {
      const top = item.shape === 'boots' ? 329 : item.detail === 'high-top' ? 342 : 353;
      drawing = `<path d="M104 ${top} H126 L126 374 Q109 380 90 375 Q88 366 102 362Z M134 ${top} H156 L158 362 Q172 366 170 375 Q151 380 134 374Z" fill="${c}"/><path d="M91 372 Q109 376 125 371 M135 371 Q151 376 169 372" stroke="#f8f3eb" stroke-width="5"/>`;
      if(item.shape==='sneakers') drawing += '<path d="M105 360 L117 362 M102 365 L114 367 M143 362 L155 360 M146 367 L158 365" stroke="#b4a7b6" stroke-width="2"/>';
      if(item.shape==='flats') drawing += '<path d="M106 357 Q115 369 126 357 M134 357 Q145 369 156 357" fill="none" stroke="#f8e4e9" stroke-width="3"/>';
      if(item.detail==='running') drawing += '<path d="M96 369 L103 365 L111 370 L120 366 M140 366 L149 370 L157 365 L164 369" stroke="#e8cb71" stroke-width="3" fill="none"/><path d="M91 376 H125 M135 376 H169" stroke="#61717d" stroke-width="3"/>';
      if(item.detail==='high-top') drawing += '<path d="M108 347 H121 M108 352 H121 M139 347 H152 M139 352 H152" stroke="#fff1dc" stroke-width="2"/><circle cx="110" cy="358" r="4" fill="#fff1dc"/><circle cx="150" cy="358" r="4" fill="#fff1dc"/>';
      if(item.detail==='loafers') drawing += '<path d="M101 365 Q113 359 124 365 M136 365 Q147 359 159 365" stroke="#c5a37c" stroke-width="5" fill="none"/><path d="M111 363 H118 M142 363 H149" stroke="#e8cc94" stroke-width="2"/><path d="M91 375 H125 M135 375 H169" stroke="#53443f" stroke-width="3"/>';
      if(item.detail==='mary-jane') drawing += '<path d="M104 359 H125 M135 359 H156" stroke="#2f2a40" stroke-width="5"/><rect x="116" y="356" width="6" height="6" rx="1" fill="none" stroke="#e1c786"/><rect x="138" y="356" width="6" height="6" rx="1" fill="none" stroke="#e1c786"/>';
      if(item.detail==='ballet') drawing += '<path d="M113 365 Q99 355 103 365 Q105 370 113 365 Q125 353 123 364 Q121 370 113 365 M147 365 Q135 353 137 364 Q139 370 147 365 Q161 355 157 365 Q155 370 147 365" fill="#fce6ec" stroke="#a97e95" stroke-width="1"/>';
      if(item.detail==='rain') drawing += '<path d="M105 332 H125 M135 332 H155" stroke="#f7e2a0" stroke-width="5"/><path d="M92 374 H125 M135 374 H168" stroke="#847c52" stroke-width="5"/><path d="M110 340 V355 M142 340 V355" stroke="#ffefb9" stroke-width="3" stroke-linecap="round"/>';
      if(item.detail==='hiking') drawing += '<path d="M106 333 H125 M135 333 H154" stroke="#5d6355" stroke-width="6"/><path d="M110 342 L121 347 L110 352 L121 357 M150 342 L139 347 L150 352 L139 357" stroke="#e7cd8b" stroke-width="2" fill="none"/><path d="M92 375 H125 M135 375 H168" stroke="#505748" stroke-width="5" stroke-dasharray="5 1"/>';
      break;
    }
    case 'bag': drawing = `<path d="M103 160 L170 255" fill="none" stroke="${c}" stroke-width="5"/><rect x="151" y="242" width="43" height="38" rx="9" fill="${c}"/><path d="M152 250 Q172 268 193 250" fill="none"/><rect x="170" y="255" width="6" height="7" rx="2" fill="#eed094"/>`; break;
    case 'bow': drawing = `<path d="M158 76 Q180 56 183 73 Q187 91 158 82 Q137 99 136 81 Q136 64 158 76" fill="${c}"/><circle cx="159" cy="79" r="5" fill="${c}"/>`; break;
    case 'glasses': drawing = `<g fill="none" stroke="${c}" stroke-width="3"><circle cx="114" cy="110" r="13"/><circle cx="146" cy="110" r="13"/><path d="M127 109 Q130 106 133 109 M101 107 L91 103 M159 107 L169 103"/></g>`; break;
    case 'hat': {
      const {halfWidth,brimY,crownY} = hatFit(character);
      const left = 130-halfWidth, right = 130+halfWidth;
      drawing = `<path d="M${left} ${brimY} L${left+8} ${crownY} Q130 ${crownY-10} ${right-8} ${crownY} L${right} ${brimY}Z" fill="${c}"/><path d="M${left+3} ${brimY-13} Q130 ${brimY-5} ${right-3} ${brimY-13} L${right} ${brimY} H${left}Z" fill="#ab8cae"/><ellipse cx="130" cy="${brimY}" rx="${halfWidth+12}" ry="8" fill="${c}"/><path d="M${left+11} ${crownY+5} Q130 ${crownY-2} ${right-11} ${crownY+5}" fill="none" stroke="#fff5d5" stroke-opacity=".45" stroke-width="2"/>`;
      break;
    }
  }
  return `<g data-part="garment" ${outline}>${drawing}<g data-part="kawaii-details">${kawaiiDetails(item)}</g></g>`;
}

function clothingIcon(item) {
  const boxes = {top:'62 141 136 110',bottom:'73 217 115 146',dress:'67 142 127 190',shoes:'78 319 105 69',accessory:item.shape==='bag'?'95 155 108 135':item.shape==='glasses'?'84 86 93 47':item.shape==='hat'?'65 24 130 83':'74 36 113 72'};
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${boxes[item.category]}" aria-hidden="true">${garment(item)}</svg>`;
}

function mixColor(color, target, amount) {
  return '#'+[1,3,5].map(index=>Math.round(parseInt(color.slice(index,index+2),16)*(1-amount)+parseInt(target.slice(index,index+2),16)*amount).toString(16).padStart(2,'0')).join('');
}

function animeHair(s) {
  const id = `anime-hair-${++avatarSequence}`;
  const edge = mixColor(s.hair,'#403c4e',.4);
  const gradient = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixColor(s.hair,'#fff1de',.32)}"/><stop offset=".5" stop-color="${s.hair}"/><stop offset="1" stop-color="${mixColor(s.hair,'#555366',.25)}"/></linearGradient></defs>`;
  const paint = `fill="url(#${id})" stroke="${edge}" stroke-width="1.1" stroke-linejoin="round"`;
  let back;
  if(s.hairStyle==='animeShort') back = `<path d="M87 102 Q72 69 97 56 Q130 39 159 60 Q183 76 173 111 L178 128 L167 125 L166 138 L156 124 L105 121 L94 137 L93 121 L84 127Z" ${paint}/>`;
  else if(s.hairStyle==='animePony') back = `<path d="M166 94 Q195 93 199 125 Q182 169 204 208 L185 198 L190 219 Q167 204 164 178 Q158 146 153 113Z" ${paint}/><path d="M178 119 Q166 161 185 194" fill="none" stroke="${edge}" stroke-opacity=".5"/><path d="M87 109 Q76 54 130 51 Q184 54 174 113 L160 130 L98 130Z" ${paint}/><path d="M169 107 L182 113" stroke="#b9a8d9" stroke-width="5"/>`;
  else back = `<path d="M87 106 Q72 52 129 50 Q188 51 175 115 L183 200 L174 191 L180 223 Q159 215 153 186 L106 183 Q101 207 80 220 L85 191 L76 202Z" ${paint}/><path d="M91 117 Q95 166 86 206 M166 111 Q158 165 172 207" fill="none" stroke="${edge}" stroke-opacity=".55" stroke-width="1.2"/>`;
  const cap = `<path d="M89 101 Q72 62 109 52 Q133 39 163 61 Q184 80 171 108 L159 85 L101 86Z" ${paint}/>`;
  const parted = `<path d="M123 57 Q99 57 91 82 Q90 100 82 107 Q108 104 120 76 Q111 96 103 104 Q126 101 132 72Z" ${paint}/>`;
  const right = `<path d="M141 59 Q163 66 168 87 Q168 102 176 111 Q155 103 150 83 L157 106 Q140 98 137 76Z" ${paint}/>`;
  const fringe = s.hairStyle==='animeShort'
    ? `<path d="M127 54 Q146 66 144 88 L149 102 Q130 96 126 77 Q130 97 119 105 Q122 87 118 73Z" ${paint}/>`
    : `<path d="M124 54 Q145 63 144 91 Q145 114 160 123 Q137 122 130 105 Q122 90 127 75 Q116 96 105 104 Q116 79 114 63Z" ${paint}/>`;
  const sides = s.hairStyle==='animeShort' ? '' : `<path d="M92 94 Q87 116 99 142 L90 133 L96 151 Q80 135 86 109Z M168 99 Q177 124 159 145 L163 130 L156 135 Q167 118 162 106Z" ${paint}/>`;
  const shine = `<path d="M100 66 Q109 59 119 60 M137 63 Q145 70 146 79 M99 85 L96 94" stroke="#fff4e3" stroke-opacity=".35" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  return {back:gradient+back,front:cap+parted+right+fringe+sides+shine};
}

function hairLayers(s) {
  if(s.hairStyle.startsWith('anime')) return animeHair(s);
  const c = s.hair;
  const cap = `<path d="M91 117 Q77 52 130 54 Q182 49 170 117 L157 91 L102 91Z" fill="${c}"/>`;
  const shine = '<path d="M101 77 Q113 67 130 68" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="3" stroke-linecap="round"/>';
  let back = cap;
  let front = `<path d="M92 99 Q84 65 118 60 Q159 48 172 91 L163 106 Q161 87 143 79 Q123 99 97 94 L94 114Z" fill="${c}"/>${shine}`;
  switch(s.hairStyle) {
    case 'long':
      back = `<path d="M86 108 Q80 54 130 54 Q180 54 174 108 L183 206 Q158 218 148 189 L111 188 Q99 217 78 202Z" fill="${c}"/>`; break;
    case 'bob': case 'bangs':
      back = `<path d="M86 112 Q77 54 130 54 Q183 54 174 112 L180 159 Q130 178 80 159Z" fill="${c}"/>`;
      if(s.hairStyle==='bangs') front = `<path d="M91 108 Q79 53 130 55 Q181 53 169 108 L160 88 L159 96 L142 94 L139 85 L136 95 L116 95 L112 86 L109 95 L99 94Z" fill="${c}"/><path d="M106 69 Q130 60 155 70" fill="none" stroke="#fff" stroke-opacity=".17" stroke-width="3" stroke-linecap="round"/>`;
      break;
    case 'curly':
      back = `<g fill="${c}">${[[91,87,22],[103,67,22],[127,60,23],[151,67,23],[169,87,21],[176,115,18],[170,143,20],[91,139,21],[83,113,19]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`; break;
    case 'wavy':
      back = `<path d="M86 101 Q72 66 105 56 Q139 43 164 65 Q182 82 175 111 Q193 133 180 151 Q197 172 181 193 Q189 211 169 221 Q144 213 151 190 L108 190 Q115 213 91 221 Q70 216 79 194 Q62 178 78 155 Q62 132 84 115Z" fill="${c}"/><path d="M89 111 Q76 132 90 153 Q80 175 91 204 M171 113 Q186 133 172 153 Q183 175 172 207" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="3" stroke-linecap="round"/>`; break;
    case 'ponytail':
      back = `<path d="M159 94 Q188 79 198 111 Q184 144 199 170 Q180 192 162 176 Q180 144 158 114Z" fill="${c}"/><path d="M180 110 Q170 137 182 168" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="3"/><ellipse cx="168" cy="103" rx="9" ry="5" fill="#b8a0d5"/>${cap}`; break;
    case 'pigtails':
      back = `<path d="M92 94 Q66 85 63 114 L61 170 Q83 185 99 168 L94 115Z M168 94 Q194 85 197 114 L199 170 Q177 185 161 168 L166 115Z" fill="${c}"/><path d="M77 114 L73 162 M183 114 L187 162" stroke="#fff" stroke-opacity=".15" stroke-width="3"/><path d="M77 103 L97 109 M163 109 L183 103" stroke="#d8a5b6" stroke-width="6"/>${cap}`; break;
    case 'braids': {
      const braids = [88,172].map(x=>`<g fill="${c}">${[120,134,148,162,176,190].map((y,index)=>`<ellipse cx="${x+(index%2?2:-2)}" cy="${y}" rx="10" ry="12"/>`).join('')}<path d="M${x-6} 200 L${x-9} 215 Q${x} 220 ${x+9} 215 L${x+6} 200Z"/><path d="M${x-7} 130 L${x+6} 140 M${x-7} 158 L${x+6} 168 M${x-7} 186 L${x+6} 196" stroke="#fff" stroke-opacity=".18" stroke-width="2"/><path d="M${x-7} 201 H${x+7}" stroke="#bb9bcf" stroke-width="5"/></g>`).join('');
      back = `${braids}${cap}`;
      front = `<path d="M90 111 Q80 57 130 54 Q180 57 170 111 L161 90 Q146 89 130 73 Q114 89 99 90Z" fill="${c}"/><path d="M130 58 V72" stroke="#fff" stroke-opacity=".18" stroke-width="2"/>`; break;
    }
    case 'bun':
      back = `<ellipse cx="130" cy="43" rx="26" ry="23" fill="${c}"/><path d="M114 45 Q110 28 132 28 Q153 30 144 49" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="3"/><path d="M112 61 Q130 69 149 60" stroke="#d6b66b" stroke-width="5"/>${cap}`;
      front = `<path d="M91 112 Q77 55 130 55 Q183 55 169 112 L161 89 Q140 81 130 67 Q120 83 99 90Z" fill="${c}"/><path d="M108 70 L101 84 M152 70 L159 84" stroke="#fff" stroke-opacity=".15" stroke-width="2"/>`; break;
    case 'afro':
      back = `<g fill="${c}"><ellipse cx="130" cy="94" rx="64" ry="61"/>${[[80,66,20],[102,47,20],[129,42,21],[156,49,22],[179,69,21],[189,97,18],[179,124,20],[154,143,20],[126,145,20],[99,139,20],[77,121,20],[68,94,18]].map(([x,y,r])=>`<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
      front = `<path d="M92 111 Q82 73 108 69 Q130 55 153 70 Q178 77 168 111 L160 91 Q149 101 141 90 Q130 101 120 90 Q107 101 99 91Z" fill="${c}"/><path d="M97 57 Q102 49 111 54 M124 44 Q132 38 140 46 M153 57 Q164 51 170 61" fill="none" stroke="#fff" stroke-opacity=".15" stroke-width="3" stroke-linecap="round"/>`; break;
    case 'pixie':
      back = `<path d="M92 113 Q79 68 100 60 Q108 43 132 51 L148 46 L146 55 Q179 59 169 112 L160 86 L99 88Z" fill="${c}"/>`;
      front = `<path d="M92 107 Q82 65 109 58 Q136 46 165 67 L169 92 L160 84 L158 97 L149 86 L139 91 L140 80 L127 87 L129 76 Q114 88 99 86 L96 110Z" fill="${c}"/><path d="M106 69 Q121 59 140 62" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="3" stroke-linecap="round"/>`; break;
  }
  return {back,front};
}

function eyesSvg(s) {
  if(s.eyes.startsWith('anime')) return animeEyes(s);
  const eyes = [114,146].map((x,index) => {
    const side = index===0 ? -1 : 1;
    if(s.eyes==='happy' || (s.eyes==='wink' && index===1)) return `<path d="M${x-7} 111 Q${x} 102 ${x+7} 111" fill="none" stroke="#493638" stroke-width="2.6" stroke-linecap="round"/><g data-part="eyelashes" fill="none" stroke="#493638" stroke-width="1.8" stroke-linecap="round"><path d="M${x+side*7} 111 L${x+side*10} 109 M${x+side*5} 108 L${x+side*7} 105"/></g>`;
    const [rx,ry] = {almond:[8,5],large:[8.5,9],oval:[5.5,8],lashes:[7.5,8],relaxed:[8,3.5]}[s.eyes] || [7,8];
    const y = s.eyes==='relaxed' ? 112 : 110;
    const irisX = rx*.73, irisY = ry-.5;
    const lashLength = s.eyes==='lashes' ? 4 : 2.7;
    let eye = `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fffdf9"/>
      <ellipse cx="${x}" cy="${y}" rx="${irisX}" ry="${irisY}" fill="${s.eye}"/>
      <ellipse cx="${x}" cy="${y-.2}" rx="${irisX*.56}" ry="${irisY*.73}" fill="#292536"/>
      <ellipse cx="${x}" cy="${y+irisY*.62}" rx="${irisX*.63}" ry="${irisY*.19}" fill="#fff" opacity=".35"/>
      <g data-part="eye-sparkles" fill="white"><ellipse cx="${x-irisX*.34}" cy="${y-irisY*.38}" rx="${irisX*.34}" ry="${Math.min(irisX*.36,irisY*.3)}"/><circle cx="${x+irisX*.43}" cy="${y+irisY*.32}" r="${Math.min(1.15,irisY*.2)}"/></g>
      <path d="M${x-rx} ${y} C${x-rx} ${y-ry*1.33} ${x+rx} ${y-ry*1.33} ${x+rx} ${y}" fill="none" stroke="#493638" stroke-width="${s.eyes==='lashes'?2.3:1.7}" stroke-linecap="round"/>
      <g data-part="eyelashes" fill="none" stroke="#493638" stroke-width="1.8" stroke-linecap="round"><path d="M${x+side*rx*.97} ${y-ry*.23} L${x+side*(rx+lashLength)} ${y-ry*.23-1.7} M${x+side*rx*.78} ${y-ry*.66} L${x+side*(rx*.78+lashLength*.65)} ${y-ry*.66-2.6}"/>${s.eyes==='lashes'?`<path d="M${x+side*rx*.4} ${y-ry*.94} L${x+side*(rx*.4+1)} ${y-ry*.94-2.1}"/>`:''}</g>`;
    return eye;
  }).join('');
  return `<g data-part="eyes">${eyes}</g>`;
}

function animeEyes(s) {
  const id = `anime-iris-${++avatarSequence}`;
  const sharp = s.eyes==='animeSharp', soft = s.eyes==='animeSoft';
  const rx = sharp?8.5:8, ry = sharp?6:soft?8:9;
  const irisX = sharp?4.8:5.6, irisY = ry-.5;
  const lower = mixColor(s.eye,'#fff1ae',.75);
  const defs = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mixColor(s.eye,'#211728',.7)}"/><stop offset=".5" stop-color="${s.eye}"/><stop offset="1" stop-color="${lower}"/></linearGradient></defs>`;
  const eyes = [114,146].map((x,index)=>{
    const side=index===0?-1:1;
    const y=soft?111:110;
    const opening = `M${x-rx} ${y} Q${x} ${y-ry*1.65} ${x+rx} ${y-1} Q${x+rx-1} ${y+ry+1} ${x} ${y+ry} Q${x-rx+1} ${y+ry} ${x-rx} ${y}Z`;
    return `<defs><clipPath id="${id}-eye-${index}"><path d="${opening}"/></clipPath></defs><path d="${opening}" fill="#fff9f6"/><g clip-path="url(#${id}-eye-${index})">
      <ellipse cx="${x}" cy="${y}" rx="${irisX}" ry="${irisY}" fill="url(#${id})"/>
      <ellipse cx="${x}" cy="${y-1}" rx="${irisX*.4}" ry="${irisY*.73}" fill="#302031"/>
      <path d="M${x-irisX*.7} ${y+irisY*.55} Q${x} ${y+irisY*1.06} ${x+irisX*.7} ${y+irisY*.55}" fill="none" stroke="${lower}" stroke-width="1.4"/>
      <g data-part="eye-sparkles" fill="#fff"><ellipse cx="${x-1.9}" cy="${y-irisY*.48}" rx="1.5" ry="2"/><ellipse cx="${x+2.4}" cy="${y-irisY*.4}" rx=".85" ry="1.1"/><circle cx="${x+1.8}" cy="${y+irisY*.57}" r="1.2"/></g></g>
      <path d="M${x-rx} ${y} Q${x} ${y-ry*1.65} ${x+rx} ${y-1}" fill="none" stroke="#563440" stroke-width="2.1" stroke-linecap="round"/>
      <path d="M${x-rx+2} ${y+ry-1} Q${x} ${y+ry+1} ${x+rx-2} ${y+ry-1}" fill="none" stroke="#b67b86" stroke-width=".8"/>
      <g data-part="eyelashes" fill="none" stroke="#563440" stroke-width="1.8" stroke-linecap="round"><path d="M${x+side*rx} ${y-1} L${x+side*(rx+3)} ${y-3} M${x+side*(rx-2)} ${y-4} L${x+side*rx} ${y-6}"/></g>`;
  }).join('');
  return `<g data-part="eyes">${defs}${eyes}</g>`;
}

function mouthSvg(style = 'smile', lipstick = 'none') {
  const shapes = {
    smile:'<path d="M120 131 Q130 140 140 131"/>',
    grin:'<path d="M119 129 Q130 133 141 129 Q139 141 130 142 Q121 141 119 129Z" fill="#fff9ed"/><path d="M122 136 Q130 138 138 136" stroke-width="1" stroke-opacity=".35"/>',
    laugh:'<path d="M119 129 Q130 134 141 129 Q139 143 130 144 Q121 143 119 129Z" fill="#6f3f4a"/><path d="M124 140 Q130 135 136 140 Q130 145 124 140Z" fill="#e7a0ab" stroke="none"/>',
    small:'<path d="M125 133 Q130 137 135 133"/>',
    neutral:'<path d="M122 133 H138"/>',
    surprised:'<ellipse cx="130" cy="134" rx="4.5" ry="6" fill="#794650"/><ellipse cx="130" cy="137" rx="2" ry="1.5" fill="#e6a1ac" stroke="none"/>',
    kiss:'<path d="M126 129 Q137 129 131 133 Q138 137 126 138"/>'
  };
  const lipFill = lipstick!=='none' && ['smile','small','neutral','kiss'].includes(style) ? `<path d="M121 132 Q125 127 130 130 Q135 127 139 132 Q130 141 121 132Z" fill="${lipstick}" opacity=".65" stroke="none"/>` : '';
  return `<g data-part="mouth" fill="none" stroke="${lipstick==='none'?'#a66965':lipstick}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${lipFill}${shapes[style] || shapes.smile}</g>`;
}

function handSvg(s, side = 'left') {
  const nailColor = s.beauty?.nails || 'none';
  const id = `hand-skin-${++avatarSequence}`;
  const shade = mixColor(s.skin,'#815849',.3);
  const polish = nailColor==='none' ? mixColor(s.skin,'#ffe7e3',.5) : nailColor;
  // One continuous contour joins the wrist, palm and all five fingers.
  // The same hand is mirrored for the other side and reused in the manicure view.
  const contour = 'M-4.5 -1.5 C-4.5 4 -7 8 -8 13 L-11.7 25.5 C-12.4 28.2 -9.3 29.3 -8.4 26.5 L-5.6 18.8 Q-5.3 18 -5 19 L-6 32 C-6.2 35.4 -2.4 35.8 -2.2 32.6 L-1.5 20.5 Q-1.2 19.5 -.8 20.5 L-.4 35.5 C-.2 39 3.7 38.7 3.5 35.2 L2.9 20.2 Q3 19.4 3.5 20.3 L6 32 C6.8 35 10.2 34 9.6 31 L7.6 18 Q7.3 15.5 9 17 L14.2 22 C16.5 24.2 18.8 21.4 16.5 19 L10.1 11.5 Q7.3 8.8 6 4.8 L4.5 -1.5Z';
  const nails = [[-10,25.7,22],[-4.1,32.3,4],[1.55,35.5,-2],[7.8,31.4,-12],[15.25,20.75,-43]];
  return `<g data-part="hand-${side}"${side==='right'?' transform="translate(260 0) scale(-1 1)"':''}><g transform="translate(77 239) rotate(16)"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s.skin}"/><stop offset=".48" stop-color="${mixColor(s.skin,'#fff0dc',.13)}"/><stop offset="1" stop-color="${s.skin}"/></linearGradient></defs><path data-part="hand-contour" d="${contour}" fill="url(#${id})"/>
    <path d="M-4 9 Q-1 7 3 9 M-6 15 Q-4 14 -2 15 M-.5 16 Q1 15 3 16 M5 15 Q7 14 8 15 M9 15 L12 17" fill="none" stroke="${shade}" stroke-width=".45" opacity=".45" stroke-linecap="round"/>
    ${nails.map(([x,y,angle],i)=>`<g data-finger="${i}" transform="translate(${x} ${y}) rotate(${angle})"><path data-nail="${side}-${i}" d="M-1.15 -3 Q0 -4 1.15 -3 L1.2 .1 Q0 1.1 -1.2 .1Z" fill="${polish}"/><path d="M-.55 -2.7 L-.6 -.8" stroke="#fff" stroke-opacity=".65" stroke-width=".55" stroke-linecap="round"/><path d="M-.9 -7 Q0 -7.5 .9 -7" fill="none" stroke="${shade}" stroke-width=".4" opacity=".45" stroke-linecap="round"/></g>`).join('')}</g></g>`;
}

function avatarSvg(s, exportImage = false) {
  const width = {slim:.86,medium:1,full:1.19}[s.build] * (s.gender === 'male' ? 1.035 : 1);
  const young = s.age < 13;
  const scale = [.86,.94,1.02][s.height] * (s.age < 10 ? .90 : s.age < 16 ? .96 : 1);
  const headScale = young ? 1.035 : .94;
  const rx = s.face === 'oval' ? 32 : 36;
  const ry = s.face === 'oval' ? 46 : 41;
  const face = s.face === 'soft' ? `<rect x="94" y="68" width="72" height="81" rx="26" fill="${s.skin}"/>` : `<ellipse cx="130" cy="107" rx="${rx}" ry="${ry}" fill="${s.skin}"/>`;
  const {back:hairBack,front:hairFront} = hairLayers(s);
  const beauty = s.beauty || emptyBeauty();
  const shadow = beauty.shadow!=='none' ? `<g data-part="eyeshadow" fill="${beauty.shadow}" opacity=".45"><ellipse cx="114" cy="105" rx="9" ry="5"/><ellipse cx="146" cy="105" rx="9" ry="5"/></g>` : '';
  const faceDetails = `<path d="M106 98 Q113 95 120 98 M140 98 Q147 95 154 98" fill="none" stroke="${s.hair}" stroke-width="2" stroke-linecap="round"/>${shadow}${eyesSvg(s)}<path d="M130 113 L127 122 Q130 124 133 122" fill="none" stroke="#99674e" stroke-opacity=".5" stroke-width="1.5"/>${mouthSvg(s.mouth,beauty.lip)}<g data-part="blush" fill="${beauty.blush==='none'?'#dd9390':beauty.blush}" opacity="${beauty.blush==='none'?'.3':'.6'}"><ellipse cx="104" cy="124" rx="7" ry="4"/><ellipse cx="156" cy="124" rx="7" ry="4"/></g>${s.age>=40?'<path d="M102 115 L99 117 M158 115 L161 117" stroke="#99674e" opacity=".4"/>':''}`;
  const accessory = byId(s.outfit.accessory);
  const wearingHat = accessory?.shape === 'hat';
  // Each SVG owns its clip ID: the stage, saved outfits and PNG export can coexist.
  const hatClipId = wearingHat ? `hat-hair-${++avatarSequence}` : '';
  const hatClip = wearingHat ? ` clip-path="url(#${hatClipId})"` : '';
  const hatDefs = wearingHat ? `<defs><clipPath id="${hatClipId}" clipPathUnits="userSpaceOnUse"><rect x="0" y="${hatFit(s).brimY}" width="260" height="330"/></clipPath></defs>` : '';
  const headAccessory = accessory && ['hat','bow','glasses'].includes(accessory.shape) ? `<g data-part="head-accessory">${garment(accessory,s)}</g>` : '';
  const bodyAccessory = accessory?.shape==='bag' ? garment(accessory) : '';
  const body = `<g transform="translate(130 0) scale(${width} 1) translate(-130 0)"><path d="M108 151 Q93 147 84 169 L74 206 Q71 221 72.67 237.76 L81.33 240.24 Q89 222 93 211 L108 190Z M152 151 Q167 147 176 169 L186 206 Q189 221 187.33 237.76 L178.67 240.24 Q171 222 167 211 L152 190Z" fill="${s.skin}"/><path d="M107 153 Q130 147 153 153 L160 234 Q164 248 158 275 L153 363 H136 L130 269 L124 363 H107 L102 275 Q96 247 100 232Z" fill="${s.skin}"/>
    <!-- Each empty clothing slot gets an opaque base garment, which cannot protrude from a selected garment. -->
    ${!s.outfit.bottom && !s.outfit.dress ? `<path d="${silhouettes.shorts}" fill="#c4b4d5"/>` : ''}
    ${garment(byId(s.outfit.bottom))}
    ${!s.outfit.top && !s.outfit.dress ? `<path d="${silhouettes.tee}" fill="#f8eedf"/>` : ''}
    ${garment(byId(s.outfit.top))}${garment(byId(s.outfit.dress))}${garment(byId(s.outfit.shoes))}${bodyAccessory}${handSvg(s,'left')}${handSvg(s,'right')}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 ${exportImage?430:410}" role="img" aria-label="Personaje con tu combinación de ropa">${hatDefs}${exportImage?'<rect width="260" height="430" rx="18" fill="#f4edf9"/><ellipse cx="130" cy="379" rx="67" ry="9" fill="#e0d4eb"/>':''}<g transform="translate(130 377) scale(${scale}) translate(-130 -377)"><g transform="translate(130 149) scale(${headScale}) translate(-130 -149)"><g data-part="hair-back"${hatClip}>${hairBack}</g></g><path d="M118 138 H142 V157 Q130 170 118 157Z" fill="${s.skin}"/>${body}<g data-part="head" transform="translate(130 149) scale(${headScale}) translate(-130 -149)"><ellipse cx="94" cy="112" rx="6" ry="10" fill="${s.skin}"/><ellipse cx="166" cy="112" rx="6" ry="10" fill="${s.skin}"/>${face}${faceDetails}<g data-part="hair-front"${hatClip}>${hairFront}</g>${headAccessory}</g></g>${exportImage?'<text x="130" y="410" text-anchor="middle" fill="#7854cb" font-family="sans-serif" font-size="11">Mi outfit · El mundo de Angelina</text>':''}</svg>`;
}

function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),3200); }
function renderAvatar() {
  $('#avatar').innerHTML = avatarSvg(state);
  $('#outfit-tags').innerHTML = Object.entries(state.outfit).map(([slot,id])=>`<button class="outfit-tag" data-remove="${slot}" aria-label="Quitar ${byId(id).name}">${byId(id).name} ×</button>`).join('');
  document.querySelectorAll('.clothing-item').forEach(button=>button.setAttribute('aria-pressed',String(Object.values(state.outfit).includes(button.dataset.id))));
  document.dispatchEvent(new Event('characterchange'));
}
function renderClothes() {
  const items = clothes.filter(item=>(category==='all'||item.category===category)&&(clothingStyle==='all'||(item.style||'casual')===clothingStyle));
  $('#clothes-count').textContent = `${items.length} prendas`;
  $('#clothes-grid').innerHTML = items.length ? items.map(item=>`<button class="clothing-item" draggable="true" data-id="${item.id}" aria-label="Probar ${item.name}" aria-pressed="${Object.values(state.outfit).includes(item.id)}">${clothingIcon(item)}<span>${item.name}</span></button>`).join('') : '<p class="empty-wardrobe">Todavía no hay prendas de este tipo en este estilo. Prueba otra categoría o elige «Todos los estilos».</p>';
}
function syncControls() {
  for (const key of ['age','height','build','face','eyes','mouth']) $(`#${key}`).value=state[key];
  $('#hair-style').value=state.hairStyle;
  $('#hair-color-output').textContent=colors.hair.find(([hex])=>hex===state.hair)[1];
  $('#age-output').textContent=`${state.age} años`;
  $('#height-output').textContent=['Baja','Media','Alta'][state.height];
  document.querySelectorAll('[data-gender]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.gender===state.gender)));
  for (const key of ['skin','hair','eye']) {
    $(`#${key}-options`).innerHTML=colors[key].map(([hex,name])=>`<button class="swatch" style="background:${hex}" data-color="${hex}" data-property="${key}" aria-label="${name}" title="${name}" aria-pressed="${state[key]===hex}"></button>`).join('');
  }
}
function wear(id) {
  const item=byId(id); if(!item) return;
  if(item.category==='dress') { delete state.outfit.top; delete state.outfit.bottom; }
  if(item.category==='top'||item.category==='bottom') delete state.outfit.dress;
  state.outfit[item.category]=id;
  renderAvatar(); toast(`¡${item.name} en tu outfit!`);
}
function route() {
  const game=location.hash==='#vestidor';
  const salon=location.hash==='#salon';
  const extra = {'#puntajes':['score-view','Tabla de puntajes'],'#artista':['artist-view','Pequeño gran artista'],'#jardin':['garden-view','Mi jardín mágico'],'#colgado':['hangman-view','El juego del colgado']}[location.hash];
  for (const id of ['artist-view','garden-view','hangman-view','score-view']) document.getElementById(id).hidden = !extra || extra[0] !== id;
  $('#home-view').hidden=game||salon||!!extra; $('#game-view').hidden=!game; $('#salon-view').hidden=!salon;
  document.title=salon?'Salón Brillitos · El mundo de Angelina':game?'Mi vestidor creativo · El mundo de Angelina':'El mundo de Angelina · Imagina, crea y juega';
  if(extra) document.title=extra[1]+' · El mundo de Angelina';
  document.dispatchEvent(new Event(salon?'salonopen':'salonclose'));
  if(location.hash!=='#juegos') window.scrollTo({top:0,behavior:'instant'});
}
document.querySelectorAll('[data-play]').forEach(button=>button.addEventListener('click',()=>{location.hash='vestidor';}));
window.addEventListener('hashchange',route);
$('#gender-options').addEventListener('click',event=>{const button=event.target.closest('[data-gender]');if(!button)return;state.gender=button.dataset.gender;syncControls();renderAvatar();});
for(const id of ['age','height','build','face','eyes','mouth','hair-style']) {
  $(`#${id}`).addEventListener('input',event=>{const key=id==='hair-style'?'hairStyle':id;state[key]=['age','height'].includes(id)?Number(event.target.value):event.target.value;$('#age-output').textContent=`${state.age} años`;$('#height-output').textContent=['Baja','Media','Alta'][state.height];renderAvatar();});
}
$('.custom-fields').addEventListener('click',event=>{const button=event.target.closest('[data-color]');if(!button)return;state[button.dataset.property]=button.dataset.color;if(button.dataset.property==='hair')delete state.hairBase;syncControls();renderAvatar();});
$('#clothing-tabs').addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;category=button.dataset.category;document.querySelectorAll('[data-category]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab===button)));renderClothes();});
$('#style-tabs').addEventListener('click',event=>{const button=event.target.closest('[data-style]');if(!button)return;clothingStyle=button.dataset.style;document.querySelectorAll('[data-style]').forEach(tab=>tab.setAttribute('aria-pressed',String(tab===button)));renderClothes();});
let suppressClickUntil=0;
$('#clothes-grid').addEventListener('click',event=>{if(Date.now()<suppressClickUntil)return;const button=event.target.closest('[data-id]');if(button)wear(button.dataset.id);});
$('#outfit-tags').addEventListener('click',event=>{const button=event.target.closest('[data-remove]');if(!button)return;delete state.outfit[button.dataset.remove];renderAvatar();toast('Prenda quitada. ¡Prueba otra combinación!');});
$('#clear-outfit').addEventListener('click',()=>{state.outfit={};renderAvatar();toast('Listo para empezar de nuevo, con su ropa base.');});
$('#random-outfit').addEventListener('click',()=>{const choose=slot=>{const items=clothes.filter(item=>item.category===slot);return items[Math.floor(Math.random()*items.length)].id;};state.outfit=Math.random()<.35?{dress:choose('dress')}:{top:choose('top'),bottom:choose('bottom')};state.outfit.shoes=choose('shoes');state.outfit.accessory=choose('accessory');renderAvatar();toast('Una nueva combinación para inspirarte ✦');});

// Native drag for mouse; long-press drag for touch keeps normal armario scrolling.
const stage=$('#avatar-stage');
$('#clothes-grid').addEventListener('dragstart',event=>{const button=event.target.closest('[data-id]');if(!button)return;event.dataTransfer.setData('text/plain',button.dataset.id);event.dataTransfer.effectAllowed='copy';});
stage.addEventListener('dragover',event=>{event.preventDefault();event.dataTransfer.dropEffect='copy';stage.classList.add('drag-over');});
stage.addEventListener('dragleave',event=>{if(!stage.contains(event.relatedTarget))stage.classList.remove('drag-over');});
stage.addEventListener('drop',event=>{event.preventDefault();stage.classList.remove('drag-over');wear(event.dataTransfer.getData('text/plain'));});
document.addEventListener('dragend',()=>stage.classList.remove('drag-over'));
let touchDrag=null;
let wardrobeScrollFrame;
function wardrobeDropContains(x,y) {
  const bounds=stage.getBoundingClientRect();
  return (x>=bounds.left&&x<=bounds.right&&y>=bounds.top&&y<=bounds.bottom)||Boolean(window.mobilePreviewContains?.(x,y));
}
function scrollWardrobeDrag() {
  if(!touchDrag?.ghost)return;
  const direction=touchDrag.y<75?-1:touchDrag.y>innerHeight-75?1:0;
  if(direction)window.scrollBy({top:direction*12,behavior:'instant'});
  stage.classList.toggle('drag-over',wardrobeDropContains(touchDrag.x,touchDrag.y));
  wardrobeScrollFrame=requestAnimationFrame(scrollWardrobeDrag);
}
function clearTouch() { cancelAnimationFrame(wardrobeScrollFrame);if(!touchDrag)return;clearTimeout(touchDrag.timer);touchDrag.ghost?.remove();stage.classList.remove('drag-over');touchDrag=null; }
$('#clothes-grid').addEventListener('pointerdown',event=>{
  if(event.pointerType==='mouse')return;
  const button=event.target.closest('[data-id]');if(!button)return;
  clearTouch();touchDrag={id:button.dataset.id,x:event.clientX,y:event.clientY,pointerId:event.pointerId,ghost:null};
  touchDrag.timer=setTimeout(()=>{if(!touchDrag)return;const ghost=document.createElement('div');ghost.className='drag-ghost';ghost.innerHTML=clothingIcon(byId(touchDrag.id));document.body.appendChild(ghost);touchDrag.ghost=ghost;ghost.style.left=`${touchDrag.x-46}px`;ghost.style.top=`${touchDrag.y-46}px`;suppressClickUntil=Date.now()+1000;scrollWardrobeDrag();},240);
});
document.addEventListener('touchmove',event=>{if(touchDrag?.ghost)event.preventDefault();},{passive:false});
document.addEventListener('pointermove',event=>{if(!touchDrag||event.pointerId!==touchDrag.pointerId)return;if(!touchDrag.ghost){if(Math.hypot(event.clientX-touchDrag.x,event.clientY-touchDrag.y)>10)clearTouch();return;}touchDrag.x=event.clientX;touchDrag.y=event.clientY;touchDrag.ghost.style.left=`${event.clientX-46}px`;touchDrag.ghost.style.top=`${event.clientY-46}px`;stage.classList.toggle('drag-over',wardrobeDropContains(event.clientX,event.clientY));});
document.addEventListener('pointerup',event=>{if(!touchDrag||event.pointerId!==touchDrag.pointerId)return;if(touchDrag.ghost){if(wardrobeDropContains(event.clientX,event.clientY))wear(touchDrag.id);suppressClickUntil=Date.now()+500;}clearTouch();});
document.addEventListener('pointercancel',clearTouch);

function persist(next) {
  try {localStorage.setItem(storageKey,JSON.stringify(next));saved=next;$('#saved-count').textContent=saved.length;return true;}
  catch {toast('No se pudo guardar en este navegador. Puedes descargar tu outfit como imagen.');return false;}
}
$('#save-outfit').addEventListener('click',()=>{
  if(saved.length>=30){toast('Tu colección tiene 30 outfits. Elimina uno para guardar otro.');return;}
  const entry={id:`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,state:JSON.parse(JSON.stringify(state))};
  if(persist([...saved,entry])){toast('¡Outfit guardado! Encuéntralo en Mis outfits ♡');document.dispatchEvent(new CustomEvent('outfitsaved',{detail:{state:entry.state,source:location.hash}}));}
});
function renderSaved() {
  $('#saved-grid').innerHTML=saved.length?saved.map((entry,index)=>`<article class="saved-card">${avatarSvg(entry.state)}<p>Mi outfit ${index+1}</p><button class="secondary" data-load="${entry.id}">Volver a vestir →</button><button class="delete-saved" data-delete="${entry.id}" aria-label="Eliminar outfit ${index+1}">Eliminar</button></article>`).join(''):'<div class="empty-saved"><span>♡</span>Aquí vivirán tus combinaciones favoritas.<br>Crea un outfit en el vestidor y pulsa «Guardar outfit».</div>';
}
$('#open-saved').addEventListener('click',()=>{renderSaved();$('#saved-dialog').showModal();});
$('#close-saved').addEventListener('click',()=>$('#saved-dialog').close());
$('#saved-dialog').addEventListener('click',event=>{if(event.target!==$('#saved-dialog'))return;const b=event.target.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)event.target.close();});
$('#saved-grid').addEventListener('click',event=>{
  const load=event.target.closest('[data-load]');const remove=event.target.closest('[data-delete]');
  if(load){const entry=saved.find(item=>item.id===load.dataset.load);if(!entry)return;state=JSON.parse(JSON.stringify(entry.state));syncControls();renderAvatar();$('#saved-dialog').close();location.hash='vestidor';toast('Tu outfit está listo para seguir creando.');}
  if(remove&&persist(saved.filter(item=>item.id!==remove.dataset.delete))){renderSaved();toast('Outfit eliminado de tu colección.');}
});
$('#download-outfit').addEventListener('click',()=>{
  const svg=avatarSvg(state,true);const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'}));const img=new Image();
  img.onload=()=>{try{const canvas=document.createElement('canvas');canvas.width=1040;canvas.height=1720;const context=canvas.getContext('2d');context.drawImage(img,0,0,1040,1720);canvas.toBlob(blob=>{if(!blob){toast('No se pudo preparar la imagen. Inténtalo otra vez.');return;}const imageUrl=URL.createObjectURL(blob);const a=document.createElement('a');a.href=imageUrl;a.download='mi-outfit-el-mundo-de-angelina.png';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(imageUrl),10000);toast('Tu imagen está lista para descargar ♡');},'image/png');}catch{toast('No se pudo descargar la imagen en este navegador.');}finally{URL.revokeObjectURL(url);}};
  img.onerror=()=>{URL.revokeObjectURL(url);toast('No se pudo preparar la imagen. Inténtalo otra vez.');};img.src=url;
});

$('#hero-avatar').innerHTML=avatarSvg({...initialState(),age:18,outfit:{top:'shirt-cream',bottom:'jeans',shoes:'shoes-white',accessory:'bag'}});
$('#hero-shirt').innerHTML=clothingIcon(byId('sweater-mint'));
$('#card-avatar').innerHTML=avatarSvg({...initialState(),hair:colors.hair[2][0],outfit:{dress:'dress-lilac',shoes:'shoes-white'}});
$('#card-clothes').innerHTML=clothingIcon(byId('tee-peach'));
$('#saved-count').textContent=saved.length;
$('#hair-style').innerHTML=Object.entries(hairStyles).map(([id,style])=>`<option value="${id}">${style.name}</option>`).join('');
$('#eyes').innerHTML=Object.entries(eyeStyles).map(([id,name])=>`<option value="${id}">${name}</option>`).join('');
$('#mouth').innerHTML=Object.entries(mouthStyles).map(([id,name])=>`<option value="${id}">${name}</option>`).join('');
syncControls();renderClothes();renderAvatar();route();
