// ============ SCREEN SHAKE ============
function screenShake(level) {
  const el = document.getElementById("game");
  el.classList.remove("shake-1","shake-2","shake-3");
  void el.offsetWidth;
  el.classList.add("shake-"+level);
}

// ============ FLASH ============
function flash(color) {
  const el = document.getElementById("flash");
  el.style.background = color || "rgba(255,255,255,0.15)";
  el.classList.add("fire");
  setTimeout(()=>el.classList.remove("fire"), 80);
}

// ============ CHROMATIC ABERRATION ============
function chromatic() {
  const el = document.getElementById("chroma-wrap");
  el.classList.remove("aberr"); void el.offsetWidth;
  el.classList.add("aberr");
}

// ============ WOBBLE ============
function wobble() {
  const el = document.getElementById("click-area");
  el.classList.remove("wobble"); void el.offsetWidth;
  el.classList.add("wobble");
}

// ============ PARTICLES ============
function particles(x, y, count) {
  const colors = ["#ff2e50","#ffd600","#00ffc8","#ff00ff","#00aaff","#fff"];
  for(let i=0;i<count;i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const sz = 3 + Math.random()*5;
    p.style.width = sz+"px"; p.style.height = sz+"px";
    p.style.left = x+"px"; p.style.top = y+"px";
    p.style.background = colors[Math.floor(Math.random()*colors.length)];
    const angle = Math.random()*Math.PI*2;
    const dist = 30 + Math.random()*60;
    const dur = 0.3 + Math.random()*0.4;
    p.style.setProperty("--dx", Math.cos(angle)*dist+"px");
    p.style.setProperty("--dy", Math.sin(angle)*dist+"px");
    p.style.setProperty("--dur", dur+"s");
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), dur*1000);
  }
}

// ============ FLOAT TEXT ============
function floatText(x, y, text, color) {
  const ft = document.createElement("div");
  ft.className = "ft";
  ft.textContent = text;
  ft.style.color = color || "#ffd600";
  ft.style.left = (x + (Math.random()*30-15))+"px";
  ft.style.top = (y - 10)+"px";
  ft.style.setProperty("--r", (Math.random()*10-5)+"deg");
  document.body.appendChild(ft);
  setTimeout(()=>ft.remove(), 600);
}

// ============ LOG / TOAST ============
function log(m,hl){
  const el=document.getElementById("log"),s=document.createElement("span");
  if(hl)s.className="hl"; s.textContent=m; el.prepend(s);
  if(el.children.length>30)el.lastChild.remove();
}
let _tt;
function toast(m){
  const el=document.getElementById("toast"); el.textContent=m;
  el.classList.add("show"); clearTimeout(_tt); _tt=setTimeout(()=>el.classList.remove("show"),2500);
}

// ============ STIM ============
function addStim(amount) {
  S.stim = Math.min(100, S.stim + amount);
  if(S.stim >= 100) { stimBurst(); S.stim = 0; }
}

function stimBurst() {
  screenShake(3);
  flash("rgba(255,0,255,0.25)");
  chromatic(); wobble();
  setTimeout(()=>{ flash("rgba(0,255,200,0.2)"); screenShake(2); }, 150);
  setTimeout(()=>{ flash("rgba(255,214,0,0.2)"); chromatic(); }, 300);

  const rect = document.getElementById("face").getBoundingClientRect();
  const cx = rect.left + rect.width/2, cy = rect.top + rect.height/2;
  particles(cx, cy, 40);

  const bonus = Math.floor(S.pc * 10);
  S.pts += bonus; S.total += bonus;
  floatText(cx, cy-30, "STIMMED! +" + fmt(bonus), "#ff00ff");
  toast("🌀 STIM BURST! +" + fmt(bonus) + " bonus!");
  log("STIM BURST — +" + fmt(bonus) + " bonus mew points!", true);

  // ~8% chance to trigger emote 67
  if(Math.random() < 0.08) {
    emote67Active = true;
    emote67Timer = 0;
    S.ach["e67"] = true;
    toast("🫳🫳 EMOTE 67 ACTIVATED 🫳🫳");
    log("RARE: Emote 67 triggered!", true);
    screenShake(3);
    flash("rgba(255,0,255,0.3)");
  }
}
