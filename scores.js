'use strict';
(() => {
  const KEY='angelina-scores-v1',MAX_PLAYERS=20,MAX_AWARDS=10000;
  const games=ScoreRules.games;
  const $=id=>document.getElementById(id);
  const fresh=()=>({version:1,active:null,players:[]});
  let state=fresh(),lastActive=null,queue=Promise.resolve();
  const validName=name=>typeof name==='string'&&/^[\p{L}\p{N}][\p{L}\p{N} _-]{1,19}$/u.test(name);
  const id=()=>crypto.randomUUID();
  function valid(data){
    if(!data||data.version!==1||!Array.isArray(data.players)||data.players.length>MAX_PLAYERS)return false;
    const ids=new Set(),names=new Set();let awards=0;
    for(const p of data.players){
      if(!p||typeof p.id!=='string'||!/^[a-f0-9-]{36}$/.test(p.id)||ids.has(p.id)||!validName(p.name)||names.has(p.name.toLocaleLowerCase('es'))||!Array.isArray(p.awards))return false;
      ids.add(p.id);names.add(p.name.toLocaleLowerCase('es'));const seen=new Set();
      for(const a of p.awards){
        if(!a||!Object.hasOwn(games,a.game)||typeof a.id!=='string'||a.id.length>100||seen.has(a.game+':'+a.id)||!Number.isInteger(a.points)||a.points<=0||a.points>400||!Number.isSafeInteger(a.at)||a.at<0)return false;
        if(a.game!=='hangman'&&a.points!==({garden:25,artist:50,wardrobe:30,salon:20})[a.game])return false;
        seen.add(a.game+':'+a.id);awards++;
      }
    }
    return awards<=MAX_AWARDS&&(data.active===null||ids.has(data.active));
  }
  function read(){
    const raw=localStorage.getItem(KEY);
    if(raw===null)return fresh();
    const data=JSON.parse(raw);
    if(!valid(data))throw new Error('Invalid score data');
    return data;
  }
  function notice(message){$('score-feedback').textContent=message;}
  function refresh(){
    try{state=read();render();}catch{notice('No pudimos leer los puntajes guardados. Tus datos anteriores no se modificarán.');}
  }
  function currentPlayer(){return state.players.find(p=>p.id===state.active)||null;}
  function total(player,game='all'){return player.awards.reduce((sum,a)=>sum+(game==='all'||a.game===game?a.points:0),0);}
  function render(){
    const player=currentPlayer();
    $('score-player-name').textContent=player?player.name:'Invitado';
    $('score-player-total').textContent=player?total(player).toLocaleString('es-CL')+' puntos':'Elige un apodo para sumar puntos';
    $('score-player-open').textContent=player?'Cambiar jugador':'Elegir apodo';
    const filter=$('score-filter').value;
    const rows=[...state.players].sort((a,b)=>total(b,filter)-total(a,filter)||a.name.localeCompare(b.name,'es'));
    $('score-table-body').replaceChildren();
    rows.forEach((p,index)=>{
      const tr=document.createElement('tr');
      if(p.id===state.active)tr.className='score-current';
      for(const text of [String(index+1),p.name+(p.id===state.active?' · Tú':''),total(p,filter).toLocaleString('es-CL')]){
        const td=document.createElement('td');td.textContent=text;tr.append(td);
      }
      $('score-table-body').append(tr);
    });
    $('score-empty').hidden=rows.length>0;
    $('score-table').hidden=rows.length===0;
    $('score-ranking-title').textContent=filter==='all'?'Clasificación general':games[filter].name;
    $('score-history').replaceChildren();
    for(const a of (player?.awards||[]).slice(-8).reverse()){
      const li=document.createElement('li');
      li.textContent=games[a.game].name+' · +'+a.points+' puntos · '+new Date(a.at).toLocaleDateString('es-CL');
      $('score-history').append(li);
    }
    $('score-history-empty').hidden=!!player?.awards.length;
    document.querySelectorAll('[data-score-game]').forEach(node=>{
      const game=node.dataset.scoreGame;
      node.textContent=player?player.name+' · '+total(player,game).toLocaleString('es-CL')+' puntos en este juego':'Elige un apodo para guardar tus puntos.';
    });
    const previous=$('score-existing').value;
    $('score-existing').replaceChildren(new Option('Elige un jugador',''));
    state.players.forEach(p=>$('score-existing').append(new Option(p.name,p.id)));
    $('score-existing').value=state.players.some(p=>p.id===previous)?previous:state.active||'';
    $('score-use-player').disabled=!$('score-existing').value;
    if(lastActive!==state.active){
      lastActive=state.active;
      document.dispatchEvent(new CustomEvent('scoreplayerchange',{detail:{playerId:state.active}}));
    }
  }
  function mutate(fn){
    const run=()=>{
      try{
        const next=read(),result=fn(next);
        if(result?.write===false)return result;
        localStorage.setItem(KEY,JSON.stringify(next));
        state=next;render();return result;
      }catch{
        notice('No se pudieron guardar los puntajes. Revisa si el navegador permite guardar datos; puedes seguir jugando.');
        return {ok:false,reason:'storage'};
      }
    };
    const work=()=>navigator.locks?navigator.locks.request(KEY,run):run();
    const result=queue.then(work,work);queue=result.catch(()=>{});
    return result;
  }
  async function award(game,details,key,playerId=state.active){
    if(!Object.hasOwn(games,game))return {ok:false,reason:'game'};
    if(!playerId){notice('Actividad completada. Elige un apodo antes de tu próxima actividad para guardar puntos.');return {ok:false,reason:'guest'};}
    const points=ScoreRules.calculate(game,details);
    if(!points){notice('Aún falta completar el objetivo de '+games[game].name+'.');return {ok:false,reason:'requirements'};}
    if(typeof key!=='string'||key.length>100)return {ok:false,reason:'key'};
    const result=await mutate(data=>{
      const p=data.players.find(p=>p.id===playerId);
      if(!p)return {write:false,ok:false,reason:'player'};
      if(p.awards.some(a=>a.game===game&&a.id===key))return {write:false,ok:false,reason:'duplicate'};
      if(data.players.reduce((n,p)=>n+p.awards.length,0)>=MAX_AWARDS)return {write:false,ok:false,reason:'full'};
      p.awards.push({id:key,game,points,at:Date.now()});
      return {ok:true,points,name:p.name};
    });
    if(result.ok)notice('¡'+result.name+' sumó '+points+' puntos en '+games[game].name+'! Puntaje guardado en este navegador.');
    else if(result.reason==='duplicate')notice('Esta palabra o creación ya sumó puntos para este jugador. ¡Prueba otra!');
    else if(result.reason==='full')notice('La tabla alcanzó 10.000 actividades guardadas. Puedes seguir jugando sin sumar más.');
    return result;
  }
  function canonical(value){
    if(Array.isArray(value))return value.map(canonical);
    if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));
    return value;
  }
  async function fingerprint(value){
    const bytes=new TextEncoder().encode(JSON.stringify(canonical(value)));
    const digest=await crypto.subtle.digest('SHA-256',bytes);
    return Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  }
  async function creation(game,details,value){
    const playerId=state.active;
    try{return await award(game,details,await fingerprint(value),playerId);}
    catch{notice('No se pudo registrar esta creación. Inténtalo otra vez.');return {ok:false,reason:'fingerprint'};}
  }
  window.GameScores=Object.freeze({award,creation,currentPlayerId:()=>state.active,id});
  $('score-player-open').onclick=()=>{$('score-player-error').textContent='';refresh();$('score-player-dialog').showModal();};
  $('score-player-close').onclick=()=>$('score-player-dialog').close();
  $('score-player-dialog').addEventListener('close',()=>document.dispatchEvent(new Event('scoreplayerdialogclose')));
  $('score-existing').onchange=()=>{$('score-use-player').disabled=!$('score-existing').value;};
  $('score-use-player').onclick=async()=>{
    const selected=$('score-existing').value;
    const result=await mutate(data=>{
      if(!data.players.some(p=>p.id===selected))return {write:false,ok:false};
      data.active=selected;return {ok:true};
    });
    if(result.ok){$('score-player-dialog').close();notice('Ahora juega '+currentPlayer().name+'. Sus próximos puntos quedarán guardados.');}
    else $('score-player-error').textContent='No se pudo seleccionar el jugador. Inténtalo otra vez.';
  };
  $('score-player-form').onsubmit=async event=>{
    event.preventDefault();
    const name=$('score-new-name').value.normalize('NFC').trim().replace(/\s+/g,' ');
    if(!validName(name)){$('score-player-error').textContent='Usa de 2 a 20 letras, números, espacios, guiones o guion bajo.';return;}
    const result=await mutate(data=>{
      if(data.players.some(p=>p.name.toLocaleLowerCase('es')===name.toLocaleLowerCase('es')))return {write:false,ok:false,reason:'name'};
      if(data.players.length>=MAX_PLAYERS)return {write:false,ok:false,reason:'limit'};
      const player={id:id(),name,awards:[]};data.players.push(player);data.active=player.id;return {ok:true};
    });
    if(result.ok){$('score-new-name').value='';$('score-player-dialog').close();notice('¡Bienvenido, '+name+'! Tus puntos se guardarán en este navegador.');}
    else $('score-player-error').textContent=result.reason==='name'?'Ese apodo ya existe aquí. Elígelo en la lista de jugadores.':result.reason==='limit'?'Este navegador ya tiene 20 jugadores. Puedes elegir uno de la lista.':'No se pudo guardar el apodo. Revisa el almacenamiento del navegador.';
  };
  for(const [game,info] of Object.entries(games)){
    $('score-filter').append(new Option(info.name,game));
    const li=document.createElement('li'),strong=document.createElement('strong');
    strong.textContent=info.name+': ';li.append(strong,document.createTextNode(info.rule));$('score-rules').append(li);
  }
  $('score-filter').onchange=render;
  window.addEventListener('storage',event=>{if(event.key===KEY||event.key===null)refresh();});
  window.addEventListener('hashchange',()=>{if(location.hash==='#puntajes')refresh();});
  const salonStations=new Set();
  document.addEventListener('scoreplayerchange',()=>salonStations.clear());
  document.addEventListener('salonactivity',event=>salonStations.add(event.detail.station));
  document.addEventListener('outfitsaved',event=>{
    const s=event.detail.state;
    if(event.detail.source==='#salon'){
      const stations=[...salonStations];
      if(ScoreRules.calculate('salon',{stations})){
        const appearance={hair:s.hair,hairStyle:s.hairStyle,beauty:s.beauty||{}};
        creation('salon',{stations},appearance);
        salonStations.clear();
      }else notice('Para sumar en el salón, usa dos estaciones y guarda tu look.');
    }else creation('wardrobe',{outfit:s.outfit},s.outfit);
  });
  refresh();
})();
