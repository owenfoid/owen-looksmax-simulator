// ============ CLICK ============
document.getElementById("click-area").addEventListener("click",(e)=>{
  addCombo();
  const cm=comboMult();
  const cv=Math.floor(S.pc*cm);
  S.pts+=cv;S.total+=cv;S.clicks++;
  if(goldenActive)claimGolden();

  const p=psl();
  const i=Math.min(3,Math.floor(p/3)+1);
  wobble();screenShake(i);
  if(p>=2)flash("rgba(0,255,0,0.06)");
  if(p>=4)chromatic();
  if(p>=6)flash(`rgba(${Math.random()>0.5?'255,0,100':'200,64,255'},0.1)`);

  particles(e.clientX,e.clientY,Math.min(12,2+Math.floor(p)));
  const c=S.combo>=50?"#c840ff":S.combo>=20?"#0f0":S.combo>=10?"#ff0":"#0f0";
  floatText(e.clientX,e.clientY,"+"+fmt(cv)+(S.combo>=5?" x"+S.combo:""),c);

  addStim(lerp(2,0.5,p/10));
  // suspicion increases slightly with rapid clicking
  if(S.combo>30)addSuspicion(0.1);
  checkAch();render();
});

// ============ BUY ============
function buy(id){
  const u=UPG.find(u=>u.id===id);
  if(!u)return;
  if(u.req&&!u.req())return;
  if(u.max&&own(u.id)>=u.max)return;
  const c=cost(u);
  if(u.type==="zorgo"){
    if(S.zorgos<c)return;
    S.zorgos-=c;
  } else {
    if(S.pts<c)return;
    S.pts-=c;
  }
  S.upg[id]=(S.upg[id]||0)+1;
  recalc();
  log("Purchased "+u.nm+" (x"+own(u.id)+")");
  screenShake(1);flash("rgba(0,255,0,0.08)");
  // buying stuff increases suspicion slightly
  addSuspicion(0.5);
  checkAch();render();
}

// ============ ACHIEVEMENTS ============
function checkAch(){
  for(const a of ACH){
    if(!S.ach[a.id]&&a.ck&&a.ck()){
      S.ach[a.id]=true;
      toast("🏆 "+a.nm+" — "+a.ds);
      log("Achievement: "+a.nm,true);
      screenShake(2);chromatic();
    }
  }
}

// ============ RENDER ============
function render(){
  document.getElementById("s-pts").textContent=fmt(S.pts);
  document.getElementById("s-pc").textContent=fmt(Math.floor(S.pc*comboMult()));
  document.getElementById("s-ps").textContent=fmt(S.ps);
  document.getElementById("s-total").textContent=fmt(S.total+S.totalPrestigeEarnings);
  document.getElementById("s-zorgos").textContent=S.zorgos;

  // teeth - show after PSL 5
  const td=document.getElementById("teeth-display");
  if(td){if(psl()>=5||S.teeth>32){td.style.display="block";document.getElementById("s-teeth").textContent=S.teeth;}else td.style.display="none";}

  // suspicion - show after first suspicion event
  const sd=document.getElementById("sus-display");
  if(sd){if(S.suspicion>0||psl()>=6){sd.style.display="block";document.getElementById("s-sus").textContent=Math.floor(S.suspicion)+"%";}else sd.style.display="none";}

  const p=psl(),rk=getRank(p);
  document.getElementById("psl-fill").style.width=Math.min(100,p/10*100)+"%";
  document.getElementById("psl-num").textContent=p.toFixed(1)+" / 10.0";
  document.getElementById("psl-in").textContent=p.toFixed(1);
  const rl=document.getElementById("rank");
  rl.textContent=rk.nm;rl.style.color=rk.c;

  document.getElementById("stim-fill").style.width=S.stim+"%";
  document.getElementById("stim-pct").textContent=Math.floor(S.stim)+"%";
  const sf=document.getElementById("stim-fill");
  if(S.stim>=80)sf.classList.add("maxed");else sf.classList.remove("maxed");

  const ce=document.getElementById("combo-display");
  if(ce){if(S.combo>=3){ce.style.display="block";ce.textContent=S.combo+"x COMBO (x"+comboMult().toFixed(1)+")";ce.style.color=S.combo>=50?"#c840ff":S.combo>=20?"#0f0":"#ff0";}else ce.style.display="none";}

  const pe=document.getElementById("prestige-btn");
  if(pe){if(S.total>=PRESTIGE_COST*0.5){pe.style.display="block";if(canPrestige()){pe.classList.remove("lk");pe.innerHTML="🔄 PRESTIGE (x"+((S.prestige+1)*PRESTIGE_MULT+1).toFixed(2)+" mult)";}else{pe.classList.add("lk");pe.innerHTML="🔄 PRESTIGE (need "+fmt(PRESTIGE_COST)+")";}}else pe.style.display="none";}
  const pi=document.getElementById("prestige-info");
  if(pi){if(S.prestige>0){pi.style.display="block";pi.textContent="Prestige "+S.prestige+" | x"+prestigeMult().toFixed(2);}else pi.style.display="none";}

  const ge=document.getElementById("golden-indicator");
  if(ge)ge.style.display=goldenActive?"block":"none";

  // upgrades
  const ul=document.getElementById("ul");
  ul.innerHTML="";
  for(const u of UPG){
    if(u.req&&!u.req())continue; // hide locked
    if(u.max&&own(u.id)>=u.max)continue;
    const c=cost(u);
    const can=u.type==="zorgo"?S.zorgos>=c:S.pts>=c;
    const d=document.createElement("div");
    d.className="ug"+(can?"":" lk")+(u.secret?" weird":"");
    d.onclick=()=>buy(u.id);
    const costClass=u.type==="zorgo"?"co zorgo-cost":"co";
    const costLabel=u.type==="zorgo"?fmt(c)+" 🟣":fmt(c);
    d.innerHTML='<div class="ic">'+u.ic+'</div><div class="inf"><div class="nm">'+u.nm+'</div><div class="ds">'+u.ds+'</div></div><div class="rt"><div class="'+costClass+'">'+costLabel+'</div><div class="ow">x'+own(u.id)+'</div></div>';
    ul.appendChild(d);
  }

  // achievements
  const ag=document.getElementById("ag");
  ag.innerHTML="";
  for(const a of ACH){
    const d=document.createElement("div");
    d.className="ac"+(S.ach[a.id]?" un":"");
    d.innerHTML=a.ic+'<div class="tt"><b>'+a.nm+'</b><br>'+a.ds+'</div>';
    ag.appendChild(d);
  }
}

// ============ ANIMATION ============
function animate(ts){
  try{
  const time=ts/1000;
  tickCombo();
  if(typeof micActive!=='undefined'&&micActive){
    drawBird(time);
    if(micSmooth>0.06){screenShake(Math.min(3,Math.floor(micSmooth*20)));if(Math.random()<micSmooth*2)chromatic();}
  }else{
    drawFace(psl()/10,time);
    stimIntensity=lerp(stimIntensity,S.stim/100,0.1);
    if(emote67Active){emote67Timer+=0.012;if(emote67Timer>=1){emote67Active=false;emote67Timer=0;}}
  }
  }catch(e){}
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ============ PASSIVE TICK ============
setInterval(()=>{
  if(S.ps>0){S.pts+=S.ps/10;S.total+=S.ps/10;addStim(0.05);checkAch();render();}
  if(Math.random()<GOLDEN_CHANCE&&S.total>100)spawnGolden();
  teethTick();
  // suspicion slowly decays
  if(S.suspicion>0)S.suspicion=Math.max(0,S.suspicion-0.02);
  // random suspicion spikes
  if(psl()>=6&&Math.random()<0.0005)addSuspicion(5+Math.random()*10);
},100);

// ============ STIM DECAY ============
setInterval(()=>{if(S.stim>0){S.stim=Math.max(0,S.stim-0.3);document.getElementById("stim-fill").style.width=S.stim+"%";document.getElementById("stim-pct").textContent=Math.floor(S.stim)+"%";}},200);
setInterval(()=>{tickCombo();const c=document.getElementById("combo-display");if(c&&S.combo<3)c.style.display="none";},100);

// ============ ZORGO SPAWNING ============
setInterval(()=>{
  if(S.total<500)return;
  if(Math.random()<0.08) spawnZorgo();
  if(Math.random()<0.008 && S.totalZorgos>5) spawnNegZorgo();
},3000);

// ============ EVENTS ============
setInterval(()=>{
  if(Math.random()<0.15&&S.total>50){
    const ev=getEvent();
    log("EVENT: "+ev,true);
    toast("📢 "+ev);
    screenShake(1);
  }
},12000);

// ============ WEIRDNESS ============
// visitor counter
document.getElementById("visitor-count").textContent=Math.floor(1000+Math.random()*90000);

// bg shifts at high psl
setInterval(()=>{
  const p=psl();
  if(p>=7){
    const h=Math.sin(Date.now()/8000)*lerp(0,10,(p-7)/3);
    document.body.style.background=`hsl(${270+h},60%,${8+h*0.2}%)`;
  }
  // title glitch
  if(p>=8&&Math.random()<0.015){
    const h1=document.querySelector('header h1');
    const gs=['Owen <span>L̸o̴o̵k̶s̷m̶a̵x̸</span> Simulator','0wen <span>Looksmax</span> Simul4tor','Owen <span>Looksmax</span> Simulator?','Owen <span>Looksmax</span> S̶i̷m̵u̶l̵a̴t̵o̸r̷'];
    h1.innerHTML=gs[Math.floor(Math.random()*gs.length)];
    setTimeout(()=>{h1.innerHTML='Owen <span>Looksmax</span> Simulator';},150);
  }
  // hint changes
  if(p>=9&&Math.random()<0.008){
    const h=document.querySelector('.click-hint');
    if(h){const hs=['tap to mew','keep going','don\'t stop','you look perfect','close the game','it\'s working','why are you still here','the zorgos see you'];
    h.textContent=hs[Math.floor(Math.random()*hs.length)];
    setTimeout(()=>{h.textContent='tap to mew';},3000);}
  }
  // randomly change border colors
  if(Math.random()<0.01){
    const panels=document.querySelectorAll('.p');
    const colors=['#333','#0f0','#c840ff','#ff0','#f00','#333','#333'];
    const c=colors[Math.floor(Math.random()*colors.length)];
    const p2=panels[Math.floor(Math.random()*panels.length)];
    if(p2){p2.style.borderColor=c;setTimeout(()=>{p2.style.borderColor='#333';},2000);}
  }
},500);

// ============ INIT ============
load();render();
setInterval(save,10000);
window.addEventListener("beforeunload",save);

// ============ CHAOS SYSTEMS ============

// --- NOTIFICATION STACK ---
function pushNotif(msg){
  const s=document.getElementById("notif-stack");
  if(!s)return;
  const d=document.createElement("div");
  d.className="notif";
  d.textContent=msg;
  s.appendChild(d);
  if(s.children.length>12)s.firstChild.remove();
  setTimeout(()=>{if(d.parentNode)d.remove();},2500);
}

// --- RANDOM POPUPS ---
const POPUP_MSGS=[
  {t:"System Alert",m:"Your mewing form has been logged."},
  {t:"Zorgo Update",m:"A zorgo was seen near your location."},
  {t:"Tip",m:"Did you know? Bonesmashing was invented in Agartha."},
  {t:"Warning",m:"Your teeth count seems high."},
  {t:"Owen Says",m:"Keep mewing. Don't look behind you."},
  {t:"Error 67",m:"Emote failed to load. Or did it?"},
  {t:"Survey",m:"Rate your jawline 1-10. (This is mandatory)"},
  {t:"Notification",m:"Someone viewed your PSL profile."},
  {t:"Zorgo Facts",m:"Nobody knows what zorgos are. This is by design."},
  {t:"Privacy",m:"This game does not collect data. The zorgos do."},
  {t:"Help",m:"Need help? Too bad."},
  {t:"Reminder",m:"You've been mewing for a while. Your tongue is fine. Probably."},
  {t:"Alert",m:"Suspicion level noted."},
  {t:"Message",m:"From: Unknown<br>Subject: Your teeth"},
  {t:"???",m:"🟣"},
  {t:"Terms of Service",m:"By clicking you agree to give your jawline to Owen. No refunds."},
  {t:"Poll",m:"Is your PSL real? <br>[ ] Yes <br>[ ] No <br>[ ] The zorgos told me"},
  {t:"Patch Notes",m:"v0.7: added teeth. we can't remove them. sorry."},
  {t:"Fact",m:"The average zorgo weighs 0 grams. They have no mass. They exist anyway."},
  {t:"Live Update",m:"67 people are mewing at the same time as you right now."},
  {t:"⚠️ WARNING",m:"Your mew points may be sentient. Do not make eye contact."},
  {t:"Agartha News",m:"Depth 847km: they found a Falim Gum wrapper."},
  {t:"Sukuna",m:"He opened the mouth on your cheek again. It said your name."},
  {t:"Gojo",m:"He looked at your PSL. He didn't say anything. He just left."},
  {t:"Owen",m:"Owen is typing..."},
  {t:"Owen",m:"Owen stopped typing."},
  {t:"Error",m:"your face could not be loaded. using backup face."},
  {t:"Tip",m:"If you see a black zorgo, DO NOT click it.<br><br>Actually, do what you want."},
  {t:"Announcement",m:"The wet floor sign has been moved. We don't know by whom."},
  {t:"Report",m:"Your teeth count was flagged for review."},
  {t:"Invitation",m:"You are invited to Agartha. Bring 10 zorgos. Do not bring your teeth."},
];

function randomPopup(){
  const p=POPUP_MSGS[Math.floor(Math.random()*POPUP_MSGS.length)];
  const el=document.createElement("div");
  el.className="popup";
  const msg=typeof p.m==='function'?p.m():p.m;
  el.innerHTML='<div class="popup-close" onclick="this.parentNode.remove()">X</div><div class="popup-title">'+p.t+'</div>'+msg;
  el.style.left=(5+Math.random()*60)+"%";
  el.style.top=(10+Math.random()*60)+"%";
  el.onclick=function(){this.remove();};
  document.body.appendChild(el);
  setTimeout(()=>{if(el.parentNode)el.remove();},6000+Math.random()*4000);
}

// --- FALLING EMOJI ---
function dropEmoji(){
  const emojis=["🗿","🦷","🟣","👅","💀","🔮","⚠️","👁️","🧴","💉","🦴","🫠","❓","🪞","👹","♾️","🥶","🍖"];
  const el=document.createElement("div");
  el.className="falling-emoji";
  el.textContent=emojis[Math.floor(Math.random()*emojis.length)];
  el.style.left=Math.random()*95+"%";
  el.style.setProperty("--dur",(2+Math.random()*3)+"s");
  document.body.appendChild(el);
  setTimeout(()=>{if(el.parentNode)el.remove();},5000);
}

// --- MOUSE TRAIL (desktop only) ---
let trailEnabled=false;
if(!isMobile){
  document.addEventListener("mousemove",(e)=>{
    if(!trailEnabled)return;
    const d=document.createElement("div");
    d.className="mouse-trail";
    d.style.left=e.clientX+"px";d.style.top=e.clientY+"px";
    document.body.appendChild(d);
    setTimeout(()=>{if(d.parentNode)d.remove();},500);
  });
}

// --- PAGE TITLE CHAOS ---
const TITLES=[
  "Owen Looksmax Simulator",
  ()=>"Owen Looksmax Simulator - "+S.teeth+" teeth",
  ()=>"Owen Looksmax Simulator - "+S.zorgos+" zorgos",
  "(1) new zorgo",
  "stop playing",
  "Owen Looksmax Simulator",
  "Owen Looksmax Simulator (REAL)",
  "are you still here",
  ()=>"PSL "+psl().toFixed(1),
  "Owen Looksmax Simulator",
  "🟣🟣🟣",
  "the grind never stops",
  "Owen Looksmax Simulator",
];

// --- RANDOM CSS CHAOS ---
function cssGlitch(){
  const r=Math.random();
  const target=document.getElementById("chroma-wrap")||document.body;
  if(r<0.15){
    target.style.filter="invert(1)";
    setTimeout(()=>{target.style.filter="none";},100+Math.random()*200);
  } else if(r<0.25 && !isMobile){
    // skip flip on mobile - breaks scroll
    target.style.transform="rotate(180deg)";
    target.style.transformOrigin="center center";
    setTimeout(()=>{target.style.transform="none";},200+Math.random()*300);
  } else if(r<0.4){
    target.style.filter="hue-rotate("+Math.floor(Math.random()*360)+"deg)";
    setTimeout(()=>{target.style.filter="none";},400);
  } else if(r<0.55 && !isMobile){
    target.style.transform="skewX("+(Math.random()*6-3)+"deg)";
    setTimeout(()=>{target.style.transform="none";},300);
  } else if(r<0.7){
    target.style.filter="blur(2px)";
    setTimeout(()=>{target.style.filter="none";},150);
  } else if(r<0.85 && !isMobile){
    const cursors=["crosshair","wait","help","not-allowed","grab","zoom-in","cell"];
    document.body.style.cursor=cursors[Math.floor(Math.random()*cursors.length)];
    setTimeout(()=>{document.body.style.cursor="auto";},2000);
  } else {
    const colors=["#2a002a","#002a00","#2a2a00","#00002a","#2a0000"];
    target.style.background=colors[Math.floor(Math.random()*colors.length)];
    setTimeout(()=>{target.style.background="";},300);
  }
}

// --- RANDOM NOTIFICATIONS ---
const NOTIF_MSGS=[
  "🟣 zorgo detected",()=>"🦷 tooth: "+S.teeth,"👁️ watching","⚠️ wet floor","🗿 mew",
  ()=>Math.floor(Math.random()*99)+" mewing rn","📢 owen posted","🔮 zorgos approve",
  "💀 bonesmash","🧴 skincare","❓","🪞 don't look","♾️ limitless",
  "🟣 zorgo escaped","🦷 tooth incoming","👹 sukuna noticed","🕳️ agartha signal",
  ()=>"📊 PSL "+psl().toFixed(1)+" (trust)","🟣","🟣🟣","🟣🟣🟣",
  "mew","mew mew","✅ form: good","❌ detected",
  ()=>Math.floor(Math.random()*999)+" zorgos in area",
  "👤 owen online","👤 owen offline",()=>"🦷 #"+S.teeth+" growing",
  "📈 trending","🔔 new achievement (lie)","💀","⚠️","67",
  "mirror saw you","incoming zorgo","teeth update","screenshot detected",
  "cold shower reminder","reflection blinked","🗿 nice jawline",
  "zorgo approaching","owen is typing","owen stopped typing",
  "PSL check passed","PSL check failed","mew form: S tier",
  ()=>"agartha depth: "+Math.floor(Math.random()*999)+"km",
  "teeth growth: normal","teeth growth: abnormal","teeth growth: ████",
  ()=>S.combo+"x combo recorded","zorgo market: up 12%","zorgo market: crashed",
];

// --- MASTER CHAOS LOOP ---
let chaosLevel=0;
const chaosRate=isMobile?0.7:1;
setInterval(()=>{
  const p=psl();
  chaosLevel=Math.floor(p);

  if(p>=1 && Math.random()<0.04*Math.min(5,p/2)*chaosRate) randomPopup();
  if(p>=0.5 && Math.random()<0.08*Math.min(6,p/2)*chaosRate){
    const m=NOTIF_MSGS[Math.floor(Math.random()*NOTIF_MSGS.length)];
    pushNotif(typeof m==='function'?m():m);
  }
  if(p>=2 && Math.random()<0.06*Math.min(isMobile?4:8,p/2)*chaosRate) dropEmoji();
  if(p>=4 && Math.random()<0.01*Math.min(4,p/3)*chaosRate) cssGlitch();
  if(p>=3 && !isMobile) trailEnabled=true;

  // page title changes
  if(Math.random()<0.01){
    const t=TITLES[Math.floor(Math.random()*TITLES.length)];
    document.title=typeof t==='function'?t():t;
  }

  // marquee text updates randomly
  if(p>=6 && Math.random()<0.005){
    const extras=[
      " 🦷 TEETH COUNT: "+S.teeth+" 🦷 ",
      " 🟣 ZORGO ALERT 🟣 ",
      " 👁️ THEY ARE WATCHING 👁️ ",
      " ⚠️ THIS IS FINE ⚠️ ",
      " 💀 BONESMASH PROTOCOL ACTIVE 💀 ",
      " 🪞 DO NOT LOOK AT THE MIRROR 🪞 ",
    ];
    const m=document.getElementById("marquee-text");
    if(m)m.textContent+=extras[Math.floor(Math.random()*extras.length)];
  }

  // fake ad respawns
  if(Math.random()<0.002){
    const ad=document.getElementById("fake-ad");
    if(ad)ad.style.display="block";
  }

  // random zorgo spawning increases with chaos
  if(S.total>500 && Math.random()<0.01*Math.min(4,p/2)) spawnZorgo();

},1000);

// extra zorgo spawn interval (stacks with the one in passive tick)
setInterval(()=>{
  if(psl()>=4 && Math.random()<0.15) spawnZorgo();
  if(psl()>=7 && Math.random()<0.03) spawnNegZorgo();
},2000);

// --- INITIAL CHAOS BURST ---
setTimeout(()=>{pushNotif("welcome back. the zorgos missed you.");},1500);
setTimeout(()=>{pushNotif("teeth count: "+S.teeth);},3000);
setTimeout(()=>{if(psl()>=1)pushNotif("⚠️ new update available (lie)");},5000);
if(psl()>=3) setTimeout(()=>{randomPopup();},4000);
if(psl()>=2) setTimeout(()=>{dropEmoji();dropEmoji();dropEmoji();},2000);

// ============ EXTRA CHAOS ============

// --- RANDOM SCREEN SHAKE FOR NO REASON ---
setInterval(()=>{
  if(psl()>=2 && Math.random()<0.03*chaosRate) screenShake(1);
  if(psl()>=6 && Math.random()<0.01*chaosRate) screenShake(2);
  if(psl()>=9 && Math.random()<0.005*chaosRate) screenShake(3);
},2000);

// --- FAKE ERROR POPUPS ---
const FAKE_ERRORS=[
  "Error: teeth overflow (max 32 exceeded)","TypeError: zorgo is not defined",
  "Warning: PSL exceeds safe limits","Fatal: mirror.reflect() returned undefined",
  "Error 404: jawline not found","Segfault in bonesmash.c line 67",
  "Exception: too many teeth","Warning: suspicion leak detected",
  "Error: cannot read property 'face' of null","ZORGO_OVERFLOW: stack exceeded",
  "panic: runtime error: mew index out of range","ERR_CONNECTION_AGARTHA",
  ()=>"SyntaxError: unexpected tooth at position "+S.teeth,
  "RangeError: Maximum mew stack size exceeded",
];
setInterval(()=>{
  if(psl()>=3 && Math.random()<0.008*chaosRate){
    const err=FAKE_ERRORS[Math.floor(Math.random()*FAKE_ERRORS.length)];
    const msg=typeof err==='function'?err():err;
    pushNotif("⛔ "+msg);
    if(Math.random()<0.3) log("ERROR: "+msg,true);
  }
},3000);

// --- TEXT INJECTION INTO LOG ---
const GHOST_LOGS=[
  "...","help","it's dark in here","who is clicking",
  "the zorgos are multiplying","teeth: ████","check behind you",
  "this isn't a game","owen was never real","PSL is a lie",
  "they can see your screen","don't close the tab","67 67 67 67",
  "your mewing form is being recorded","agartha coordinates: ██.████, ██.████",
  "new tooth detected","zorgo containment breach","",
  "the mirror remembers","why did you buy the wet floor sign",
  "level 67","the grind","the grind","the grind",
];
setInterval(()=>{
  if(psl()>=4 && Math.random()<0.02*chaosRate){
    log(GHOST_LOGS[Math.floor(Math.random()*GHOST_LOGS.length)],Math.random()<0.5);
  }
},4000);

// --- RANDOM ELEMENT ZOOM ---
setInterval(()=>{
  if(psl()>=3 && Math.random()<0.01*chaosRate){
    const els=document.querySelectorAll('.st .v, .rank, .click-hint, .pt');
    const el=els[Math.floor(Math.random()*els.length)];
    if(el){
      const s=1+Math.random()*0.8;
      el.style.transform="scale("+s+")";
      el.style.transition="transform 0.2s";
      setTimeout(()=>{el.style.transform="scale(1)";},300+Math.random()*500);
    }
  }
},1500);

// --- COLOR STORM (rapid bg changes) ---
setInterval(()=>{
  if(psl()>=8 && Math.random()<0.003*chaosRate){
    // rapid fire color changes
    let count=0;
    const storm=setInterval(()=>{
      const target=document.getElementById("chroma-wrap")||document.body;
      target.style.background=`hsl(${Math.random()*360},60%,${5+Math.random()*10}%)`;
      count++;
      if(count>8){clearInterval(storm);target.style.background="";}
    },80);
  }
},3000);

// --- FAKE "OTHER PLAYERS" ---
const FAKE_PLAYERS=["xX_MewGod_Xx","jawline_jake","PSL_enjoyer","zorgo_collector_99","bonesmash_barry","agartha_andy","owen_fan_2009","teeth_guy","coldshower_chris","sukuna_simp"];
setInterval(()=>{
  if(psl()>=2 && Math.random()<0.015*chaosRate){
    const name=FAKE_PLAYERS[Math.floor(Math.random()*FAKE_PLAYERS.length)];
    const actions=[
      "just reached PSL "+((Math.random()*4+3).toFixed(1)),
      "collected a zorgo","lost "+Math.floor(Math.random()*5+1)+" teeth",
      "bought "+UPG[Math.floor(Math.random()*Math.min(8,UPG.length))].nm,
      "prestiged (x"+(Math.floor(Math.random()*5+1)*0.25+1).toFixed(2)+")",
      "was noticed by them (-10%)", "found a golden mew",
      "entered agartha","expanded their domain",
    ];
    pushNotif("👤 "+name+" "+actions[Math.floor(Math.random()*actions.length)]);
  }
},5000);

// --- RANDOM STAT DISPLAY GLITCH ---
setInterval(()=>{
  if(psl()>=5 && Math.random()<0.008*chaosRate){
    const statEls=document.querySelectorAll('.st .v');
    const el=statEls[Math.floor(Math.random()*statEls.length)];
    if(el){
      const orig=el.textContent;
      const glitches=["???","NaN","∞","ERR","−0","null","67","🟣",fmt(Math.random()*1e15),"████"];
      el.textContent=glitches[Math.floor(Math.random()*glitches.length)];
      el.style.color="#f00";
      setTimeout(()=>{el.textContent=orig;el.style.color="";},200+Math.random()*400);
    }
  }
},2000);

// --- NOTIFICATION SPAM BURSTS ---
setInterval(()=>{
  if(psl()>=7 && Math.random()<0.005*chaosRate){
    // rapid fire 5 notifications
    for(let i=0;i<5;i++){
      setTimeout(()=>{
        const msgs=["🟣","🦷","👁️","⚠️","67","!!!","...","🗿","??","PSL"];
        pushNotif(msgs[Math.floor(Math.random()*msgs.length)]);
      },i*200);
    }
  }
},5000);

// --- RANDOM TOAST SPAM ---
const RANDOM_TOASTS=[
  "🗿","🟣 zorgo.","🦷","mew","67","...","👁️","",
  "the grind never stops","check your teeth","zorgo?",
  ()=>"PSL "+psl().toFixed(1),"nice jawline (lie)",
  ()=>S.teeth+" teeth and counting","don't look up",
  "owen is proud","owen is watching","owen",
];
setInterval(()=>{
  if(psl()>=4 && Math.random()<0.01*chaosRate){
    const t=RANDOM_TOASTS[Math.floor(Math.random()*RANDOM_TOASTS.length)];
    toast(typeof t==='function'?t():t);
  }
},3000);

// --- ELEMENT DRIFT (things slowly move) ---
setInterval(()=>{
  if(psl()>=6 && Math.random()<0.01*chaosRate){
    const panels=document.querySelectorAll('.p');
    const p=panels[Math.floor(Math.random()*panels.length)];
    if(p){
      const dx=(Math.random()-0.5)*6;
      const dy=(Math.random()-0.5)*4;
      p.style.transform=`translate(${dx}px,${dy}px)`;
      p.style.transition="transform 0.5s";
      setTimeout(()=>{p.style.transform="none";},1000+Math.random()*2000);
    }
  }
},2000);

// --- EMOJI BURST ON HIGH COMBO ---
setInterval(()=>{
  if(S.combo>=20 && Math.random()<0.1){
    for(let i=0;i<3;i++) setTimeout(()=>dropEmoji(),i*100);
  }
  if(S.combo>=50 && Math.random()<0.15){
    for(let i=0;i<6;i++) setTimeout(()=>dropEmoji(),i*80);
  }
},500);

// --- AGGRESSIVE TITLE CHANGES ---
setInterval(()=>{
  if(psl()>=5){
    const t=TITLES[Math.floor(Math.random()*TITLES.length)];
    document.title=typeof t==='function'?t():t;
  }
},3000);

// --- RANDOM FONT CHANGES ---
setInterval(()=>{
  if(psl()>=7 && Math.random()<0.005*chaosRate){
    const fonts=["serif","monospace","cursive","fantasy","system-ui"];
    document.body.style.fontFamily=fonts[Math.floor(Math.random()*fonts.length)];
    setTimeout(()=>{document.body.style.fontFamily="'Comic Neue','Comic Sans MS',cursive";},500+Math.random()*1000);
  }
},3000);

// --- THE GAME BRIEFLY "BREAKS" ---
setInterval(()=>{
  if(psl()>=8 && Math.random()<0.002*chaosRate){
    const wrap=document.getElementById("chroma-wrap");
    if(wrap){
      wrap.style.display="none";
      toast("error: game crashed");
      setTimeout(()=>{
        wrap.style.display="";
        toast("...nevermind");
      },800+Math.random()*1200);
    }
  }
},5000);

