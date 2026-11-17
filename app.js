const state={tab:"tv",items:[],hls:null,dash:null};
const $=s=>document.querySelector(s);
const cards=$("#cards"),search=$("#search"),category=$("#category");
async function loadData(){
 try{
  const [c,m]=await Promise.all([fetch("data/channels.json").then(r=>r.json()),fetch("data/matches.json").then(r=>r.json())]);
  state.channels=c;state.matches=m;render();
 }catch(e){$("#status").textContent="Could not load data. Check that data/channels.json and data/matches.json exist.";cards.innerHTML='<div class="empty">Data files could not be loaded.</div>'}
}
function currentItems(){return state.tab==="tv"?(state.channels||[]):(state.matches||[])}
function render(){
 const items=currentItems(),q=search.value.trim().toLowerCase(),cat=category.value;
 const filtered=items.filter(x=>(x.name||"").toLowerCase().includes(q)||(x.category||"").toLowerCase().includes(q)&&(cat==="all"||x.category===cat));
 $("#sectionTitle").textContent=state.tab==="tv"?"Live TV Channels":"Live Sports";
 search.placeholder=state.tab==="tv"?"Search channels...":"Search matches...";
 const cats=[...new Set(items.map(x=>x.category).filter(Boolean))];category.innerHTML='<option value="all">All categories</option>'+cats.map(x=>`<option>${escapeHtml(x)}</option>`).join("");category.value=cat==="all"?"all":cat;
 $("#status").textContent=`${filtered.length} ${state.tab==="tv"?"channels":"events"} available`;
 cards.innerHTML=filtered.length?filtered.map((x,i)=>`<article class="media-card"><div class="card-top"><div class="logo-box">${x.logo?`<img src="${escapeAttr(x.logo)}" alt="" onerror="this.remove()">`:(state.tab==="tv"?"📺":"🏆")}</div><div><div class="card-title">${escapeHtml(x.name)}</div><div class="card-meta">${escapeHtml(x.category||"Live")} ${x.startTime?"• "+escapeHtml(x.startTime):""}</div></div></div><div class="card-bottom"><span class="pill">${escapeHtml(x.status||"AVAILABLE")}</span><button class="watch-btn" data-index="${i}">▶ WATCH</button></div></article>`).join(""):'<div class="empty">No results found. Try another search.</div>';
 state.items=filtered;
 cards.querySelectorAll(".watch-btn").forEach(b=>b.addEventListener("click",()=>openPlayer(state.items[+b.dataset.index])));
}
function escapeHtml(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function escapeAttr(s=""){return escapeHtml(s)}
function switchTab(tab){state.tab=tab;document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));category.value="all";render()}
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
search.addEventListener("input",render);category.addEventListener("change",render);
function openPlayer(item){
 $("#playerTitle").textContent=item.name;$("#player").classList.add("open");$("#player").setAttribute("aria-hidden","false");
 const streams=(item.servers||[]).filter(s=>s.url);$("#serverRow").innerHTML="";
 $("#playerOverlay").style.display="flex";
 $("#playerStatus").textContent=streams.length?"Select a server to start playback":"No stream URL configured for this item. Add an authorized URL to its JSON entry.";
 streams.forEach((s,i)=>{const b=document.createElement("button");b.className="server-btn";b.textContent=s.name||`Server ${i+1}`;b.onclick=()=>playStream(s.url,b);$("#serverRow").append(b)});
}
function stopPlayers(){if(state.hls){state.hls.destroy();state.hls=null}if(state.dash){state.dash.reset();state.dash=null}const v=$("#video");v.pause();v.removeAttribute("src");v.load()}
function playStream(url,btn){
 stopPlayers();const v=$("#video");$("#playerOverlay").style.display="none";$("#playerStatus").textContent="Connecting to stream…";
 document.querySelectorAll(".server-btn").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
 const isDash=/\.mpd($|\?)/i.test(url);
 if(isDash&&window.dashjs){state.dash=dashjs.MediaPlayer().create();state.dash.initialize(v,url,true);state.dash.on(dashjs.MediaPlayer.events.ERROR,()=>$("#playerStatus").textContent="Playback error. Try another authorized server.");}
 else if(v.canPlayType("application/vnd.apple.mpegurl")){v.src=url;v.play().catch(()=>$("#playerStatus").textContent="Tap play to start, or try another server.");}
 else if(window.Hls&&Hls.isSupported()){state.hls=new Hls({enableWorker:true,lowLatencyMode:true});state.hls.loadSource(url);state.hls.attachMedia(v);state.hls.on(Hls.Events.MANIFEST_PARSED,()=>v.play().catch(()=>{}));state.hls.on(Hls.Events.ERROR,(e,d)=>{if(d.fatal)$("#playerStatus").textContent="Stream error. Check URL, CORS and stream access permissions.";});}
 else{$("#playerStatus").textContent="This browser does not support this stream format."}
 v.onplaying=()=>$("#playerStatus").textContent="Playing";v.onerror=()=>$("#playerStatus").textContent="Unable to play. Check the URL, CORS policy and stream availability.";
}
function closePlayer(){stopPlayers();$("#player").classList.remove("open");$("#player").setAttribute("aria-hidden","true")}
$("#closePlayer").onclick=closePlayer;$("#player").addEventListener("click",e=>{if(e.target.id==="player")closePlayer()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePlayer()});
$("#themeGlow").onclick=()=>document.body.classList.toggle("extra-glow");
loadData();
