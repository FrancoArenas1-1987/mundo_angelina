/* Shared scoring rules: usable by the browser and by a score service. */
(function(root,factory){
  const rules=factory();
  if(typeof module==='object'&&module.exports)module.exports=rules;
  else root.ScoreRules=rules;
})(typeof globalThis!=='undefined'?globalThis:this,()=>{
  'use strict';
  const games=Object.freeze({
    hangman:{name:'El colgado',rule:'100 puntos por palabra, 10 por cada error disponible y 5 por letra. Usar ayuda resta 25 puntos.'},
    garden:{name:'Mi jardín mágico',rule:'25 puntos por cada flor cultivada y coleccionada.'},
    artist:{name:'Pequeño gran artista',rule:'50 puntos al terminar una obra con al menos 3 colores, 2 herramientas y 10 trazos o sellos.'},
    wardrobe:{name:'Mi vestidor creativo',rule:'30 puntos por guardar una combinación nueva con parte superior, inferior y zapatos (o vestido y zapatos).'},
    salon:{name:'Salón Brillitos',rule:'20 puntos por guardar un look nuevo después de usar al menos 2 estaciones del salón.'}
  });
  const alphabet='ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  const normalize=value=>value.toLocaleUpperCase('es').replace(/[ÁÉÍÓÚÜ]/g,c=>({Á:'A',É:'E',Í:'I',Ó:'O',Ú:'U',Ü:'U'})[c]);
  function calculate(game,details){
    if(!details||typeof details!=='object'||Array.isArray(details))return 0;
    if(game==='hangman'){
      if(typeof details.word!=='string'||!/^[a-záéíóúüñ]{2,24}$/i.test(details.word)||!Array.isArray(details.guesses)||details.guesses.length>27||typeof details.hintUsed!=='boolean')return 0;
      const letters=details.guesses;
      if(letters.some(c=>typeof c!=='string'||c.length!==1||!alphabet.includes(c))||new Set(letters).size!==letters.length)return 0;
      const word=normalize(details.word),mistakes=letters.filter(c=>!word.includes(c)).length;
      if(mistakes>=6||!Array.from(word).every(c=>letters.includes(c)))return 0;
      return 100+(6-mistakes)*10+word.length*5-(details.hintUsed?25:0);
    }
    if(game==='garden')return ['sunflower','tulip','rose','hibiscus','daisy','cherry'].includes(details.seed)&&details.water===2&&details.sun===2?25:0;
    if(game==='artist'){
      if(!Array.isArray(details.colors)||!Array.isArray(details.tools)||!Number.isInteger(details.strokes)||details.strokes<10||details.strokes>100000)return 0;
      if(details.colors.length>100||details.colors.some(c=>typeof c!=='string'||!/^#[a-f0-9]{6}$/i.test(c))||details.tools.length>4||details.tools.some(t=>!['brush','flower','star','heart'].includes(t)))return 0;
      return new Set(details.colors.map(c=>c.toLowerCase())).size>=3&&new Set(details.tools).size>=2?50:0;
    }
    if(game==='wardrobe'){
      const o=details.outfit;
      if(!o||typeof o!=='object'||Array.isArray(o))return 0;
      const slots=Object.keys(o);
      if(slots.some(s=>!['top','bottom','dress','shoes','accessory'].includes(s))||Object.values(o).some(id=>typeof id!=='string'||!/^[a-z0-9-]{1,60}$/.test(id)))return 0;
      if(o.dress&&(o.top||o.bottom))return 0;
      return o.shoes&&(o.dress||(o.top&&o.bottom))?30:0;
    }
    if(game==='salon'){
      if(!Array.isArray(details.stations)||details.stations.length>3||details.stations.some(s=>!['hair','makeup','nails'].includes(s)))return 0;
      return new Set(details.stations).size>=2?20:0;
    }
    return 0;
  }
  return Object.freeze({games,calculate,normalize});
});
