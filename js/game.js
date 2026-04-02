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
  const time=ts/1000;
  tickCombo();
  if(typeof micActive!=='undefined'&&micActive){
    drawBird(time);
    if(micSmooth>0.06){screenShake(Math.min(3,Math.floor(micSmooth*20)));if(Math.random()<micSmooth*2)chromatic();}
  }else{
    drawFace(psl()/10,time);
    stimIntensity=lerp(stimIntensity,S.stim/100,0.1);
    if(emote67Active){emote67Timer+=0.012;if(emote67Timer>=1){emote67Active=false;emote67Timer=0;}}
    drawStimHands(time);
  }
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
},18000);

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
