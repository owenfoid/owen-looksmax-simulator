// ============ CLICK ============
document.getElementById("click-area").addEventListener("click", (e) => {
  S.pts += S.pc; S.total += S.pc; S.clicks++;

  const p = psl();
  const intensity = Math.min(3, Math.floor(p/3) + 1);
  wobble(); screenShake(intensity);
  if(p >= 2) flash("rgba(255,255,255,0.08)");
  if(p >= 4) chromatic();
  if(p >= 6) flash(`rgba(${Math.random()>0.5?'255,46,80':'0,255,200'},0.12)`);

  particles(e.clientX, e.clientY, Math.min(15, 2 + Math.floor(p * 1.2)));
  const colors = ["#ffd600","#ff2e50","#00ffc8","#ff00ff","#00aaff"];
  floatText(e.clientX, e.clientY, "+"+fmt(S.pc), colors[Math.floor(Math.random()*colors.length)]);

  addStim(lerp(2, 0.5, p/10));
  checkAch(); render();
});

// ============ BUY ============
function buy(id) {
  const u = UPG.find(u=>u.id===id);
  const c = cost(u);
  if(S.pts < c) return;
  S.pts -= c;
  S.upg[id] = (S.upg[id]||0)+1;
  recalc();
  log("Purchased "+u.nm+" (x"+own(u.id)+")");
  screenShake(1); flash("rgba(255,214,0,0.1)");
  checkAch(); render();
}

// ============ ACHIEVEMENTS ============
function checkAch() {
  for(const a of ACH) {
    if(!S.ach[a.id] && a.ck()) {
      S.ach[a.id] = true;
      toast("🏆 "+a.nm+" — "+a.ds);
      log("Achievement: "+a.nm, true);
      screenShake(2); flash("rgba(255,214,0,0.2)"); chromatic();
    }
  }
}

// ============ RENDER ============
function render() {
  document.getElementById("s-pts").textContent = fmt(S.pts);
  document.getElementById("s-pc").textContent = fmt(S.pc);
  document.getElementById("s-ps").textContent = fmt(S.ps);
  document.getElementById("s-total").textContent = fmt(S.total);

  const p = psl(), r = getRank(p);
  document.getElementById("psl-fill").style.width = Math.min(100,p/10*100)+"%";
  document.getElementById("psl-num").textContent = p.toFixed(1)+" / 10.0";
  document.getElementById("psl-in").textContent = p.toFixed(1);
  const rl = document.getElementById("rank");
  rl.textContent = r.nm; rl.style.color = r.c;

  document.getElementById("stim-fill").style.width = S.stim+"%";
  document.getElementById("stim-pct").textContent = Math.floor(S.stim)+"%";
  const sf = document.getElementById("stim-fill");
  if(S.stim >= 80) sf.classList.add("maxed"); else sf.classList.remove("maxed");

  // upgrades
  const ul = document.getElementById("ul");
  ul.innerHTML = "";
  for(const u of UPG) {
    const c=cost(u), can=S.pts>=c;
    const d=document.createElement("div");
    d.className="ug"+(can?"":" lk");
    d.onclick=()=>buy(u.id);
    d.innerHTML='<div class="ic">'+u.ic+'</div><div class="inf"><div class="nm">'+u.nm+'</div><div class="ds">'+u.ds+'</div></div><div class="rt"><div class="co">'+fmt(c)+'</div><div class="ow">x'+own(u.id)+'</div></div>';
    ul.appendChild(d);
  }

  // achievements
  const ag = document.getElementById("ag");
  ag.innerHTML="";
  for(const a of ACH) {
    const d=document.createElement("div");
    d.className="ac"+(S.ach[a.id]?" un":"");
    d.innerHTML=a.ic+'<div class="tt"><b>'+a.nm+'</b><br>'+a.ds+'</div>';
    ag.appendChild(d);
  }
}

// ============ ANIMATION LOOP ============
function animate(ts) {
  const time = ts / 1000;

  if(typeof micActive !== 'undefined' && micActive) {
    // MIC MODE — bird takes over
    drawBird(time);
    // trigger effects when loud
    if(micSmooth > 0.06) {
      screenShake(Math.min(3, Math.floor(micSmooth * 20)));
      if(Math.random() < micSmooth * 2) chromatic();
      if(Math.random() < micSmooth) flash(`rgba(255,46,80,${micSmooth*0.3})`);
    }
  } else {
    // NORMAL MODE
    drawFace(psl() / 10, time);
    stimIntensity = lerp(stimIntensity, S.stim / 100, 0.1);

    if(emote67Active) {
      emote67Timer += 0.012;
      if(emote67Timer >= 1) { emote67Active = false; emote67Timer = 0; }
    }

    drawStimHands(time);
  }

  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ============ PASSIVE TICK ============
setInterval(()=>{
  if(S.ps>0){
    const g=S.ps/10;
    S.pts+=g; S.total+=g;
    addStim(0.05);
    checkAch(); render();
  }
}, 100);

// ============ STIM DECAY ============
setInterval(()=>{
  if(S.stim > 0) {
    S.stim = Math.max(0, S.stim - 0.3);
    document.getElementById("stim-fill").style.width = S.stim+"%";
    document.getElementById("stim-pct").textContent = Math.floor(S.stim)+"%";
  }
}, 200);

// ============ RANDOM EVENTS ============
setInterval(()=>{
  if(Math.random()<0.15 && S.total>50){
    const ev=EVENTS[Math.floor(Math.random()*EVENTS.length)];
    log("EVENT: "+ev, true);
    toast("📢 "+ev);
    screenShake(1);
  }
}, 18000);

// ============ INIT ============
load(); render();
setInterval(save, 10000);
window.addEventListener("beforeunload", save);
