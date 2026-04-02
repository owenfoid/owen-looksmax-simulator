let S={pts:0,total:0,pc:1,ps:0,upg:{},ach:{},clicks:0,stim:0,
  prestige:0,combo:0,maxCombo:0,lastClickTime:0,goldenClicks:0,
  lastSaveTime:Date.now(),totalPrestigeEarnings:0,
  zorgos:0,totalZorgos:0,teeth:32,suspicion:0,wetFloorOwned:false};

const own=id=>S.upg[id]||0;
function cost(u){
  if(u.max && own(u.id)>=u.max) return Infinity;
  return Math.floor(u.b*Math.pow(u.m,own(u.id)));
}
function prestigeMult(){return 1+S.prestige*PRESTIGE_MULT}
function comboMult(){return Math.min(COMBO_MAX_MULT,1+S.combo*0.04)}

function recalc(){
  S.pc=1;S.ps=0;
  for(const u of UPG){const n=own(u.id);S.pc+=u.pc*n;S.ps+=u.ps*n;}
  S.pc=Math.floor(S.pc*prestigeMult());
  S.ps=Math.floor(S.ps*prestigeMult());
  // wet floor sign secret: doubles everything
  if(own("wet")>=1){S.pc*=2;S.ps*=2;}
  // ??? does something nobody knows
  if(own("what")>=1){S.ps+=7777;}
}
function psl(){
  const t=S.total+S.totalPrestigeEarnings;
  if(t<=0)return 0;
  return Math.min(10,parseFloat((Math.log10(t+1)).toFixed(2)));
}
function getRank(p){let r=RANKS[0];for(const x of RANKS)if(p>=x.min)r=x;return r;}
function fmt(n){
  if(n>=1e15)return(n/1e15).toFixed(1)+"Q";
  if(n>=1e12)return(n/1e12).toFixed(1)+"T";
  if(n>=1e9)return(n/1e9).toFixed(1)+"B";
  if(n>=1e6)return(n/1e6).toFixed(1)+"M";
  if(n>=1e3)return(n/1e3).toFixed(1)+"K";
  return Math.floor(n);
}
function lerp(a,b,t){return a+(b-a)*Math.min(1,Math.max(0,t));}

// ============ PRESTIGE ============
function canPrestige(){return S.total>=PRESTIGE_COST}
function doPrestige(){
  if(!canPrestige())return;
  S.totalPrestigeEarnings+=S.total;
  S.prestige++;S.pts=0;S.total=0;S.upg={};S.stim=0;S.combo=0;S.clicks=0;
  // keep zorgos + teeth across prestige
  recalc();render();
  screenShake(3);flash("rgba(200,64,255,0.5)");chromatic();
  setTimeout(()=>{flash("rgba(0,255,0,0.3)");screenShake(3);},200);
  const r=document.getElementById("face").getBoundingClientRect();
  particles(r.left+r.width/2,r.top+r.height/2,50);
  toast("🔄 PRESTIGE "+S.prestige+"! x"+prestigeMult().toFixed(2));
  log("PRESTIGE "+S.prestige,true);checkAch();
}

// ============ COMBO ============
function tickCombo(){if(S.combo>0&&Date.now()-S.lastClickTime>COMBO_DECAY_MS)S.combo=0;}
function addCombo(){S.combo++;S.lastClickTime=Date.now();if(S.combo>S.maxCombo)S.maxCombo=S.combo;}

// ============ GOLDEN ============
let goldenActive=false,goldenTimeout=null;
function spawnGolden(){
  if(goldenActive)return;goldenActive=true;
  toast("✨ GOLDEN MEW!");flash("rgba(255,255,0,0.15)");
  goldenTimeout=setTimeout(()=>{goldenActive=false;},GOLDEN_DURATION);
}
function claimGolden(){
  if(!goldenActive)return;goldenActive=false;clearTimeout(goldenTimeout);
  const b=Math.floor(S.pc*GOLDEN_MULT*comboMult());
  S.pts+=b;S.total+=b;S.goldenClicks=(S.goldenClicks||0)+1;
  toast("✨ +"+fmt(b));screenShake(3);flash("rgba(255,255,0,0.3)");chromatic();checkAch();
}

// ============ ZORGOS ============
function spawnZorgo(){
  const el=document.createElement("div");
  el.className="zorgo-float";
  el.textContent="🟣";
  el.style.left=(20+Math.random()*60)+"%";
  el.style.top=(20+Math.random()*50)+"%";
  el.onclick=function(e){
    e.stopPropagation();
    S.zorgos++;S.totalZorgos++;
    toast("🟣 +1 Zorgo (???)");
    floatText(e.clientX,e.clientY,"+1 ZORGO","#c840ff");
    particles(e.clientX,e.clientY,8);
    el.remove();
    checkAch();render();
  };
  document.body.appendChild(el);
  // disappears after random time
  setTimeout(()=>{if(el.parentNode)el.remove();},3000+Math.random()*4000);
}

// negative zorgo (rare)
function spawnNegZorgo(){
  const el=document.createElement("div");
  el.className="zorgo-float";
  el.textContent="⚫";
  el.style.left=(20+Math.random()*60)+"%";
  el.style.top=(20+Math.random()*50)+"%";
  el.onclick=function(e){
    e.stopPropagation();
    S.zorgos=Math.max(0,S.zorgos-1);
    toast("⚫ -1 Zorgo (why)");
    floatText(e.clientX,e.clientY,"-1 ZORGO","#ff0000");
    screenShake(2);
    el.remove();render();
  };
  document.body.appendChild(el);
  setTimeout(()=>{if(el.parentNode)el.remove();},2000);
}

// ============ TEETH ============
function teethTick(){
  // teeth slowly increase at high PSL. unsettling.
  if(psl()>=5 && Math.random()<0.001){
    S.teeth++;
    if(S.teeth===33) toast("🦷 ...33 teeth?");
    else if(S.teeth===35) toast("🦷 that's too many teeth.");
    else if(S.teeth===40) toast("🦷 stop.");
    else if(S.teeth===50) toast("🦷 🦷 🦷 🦷 🦷");
    else if(S.teeth>50 && Math.random()<0.3) toast("🦷 "+S.teeth);
    checkAch();
  }
}

// ============ SUSPICION ============
function addSuspicion(amt){
  S.suspicion=Math.min(100,S.suspicion+amt);
  if(S.suspicion>=100){
    // they found you
    S.suspicion=0;
    const loss=Math.floor(S.pts*0.1);
    S.pts=Math.max(0,S.pts-loss);
    toast("👁️ THEY NOTICED. -"+fmt(loss)+" mew points.");
    log("Suspicion maxed. They took "+fmt(loss)+" points.",true);
    screenShake(3);flash("rgba(255,0,0,0.3)");
  }
}

// ============ OFFLINE ============
function calcOffline(){
  if(!S.lastSaveTime||S.ps<=0)return 0;
  const e=(Date.now()-S.lastSaveTime)/1000;
  if(e<30)return 0;
  return Math.floor(S.ps*e*0.5);
}

// ============ SAVE/LOAD ============
const SAVE_KEY="owen_lm_v6";
function save(){S.lastSaveTime=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(S));}
function load(){
  const r=localStorage.getItem(SAVE_KEY);
  if(r){try{
    const l=JSON.parse(r);
    // migrations
    if(!l.zorgos)l.zorgos=0;if(!l.totalZorgos)l.totalZorgos=0;
    if(!l.teeth)l.teeth=32;if(!l.suspicion)l.suspicion=0;
    if(!l.prestige)l.prestige=0;if(!l.combo)l.combo=0;
    if(!l.maxCombo)l.maxCombo=0;if(!l.goldenClicks)l.goldenClicks=0;
    if(!l.totalPrestigeEarnings)l.totalPrestigeEarnings=0;
    if(!l.lastSaveTime)l.lastSaveTime=Date.now();
    Object.assign(S,l);recalc();
    const off=calcOffline();
    if(off>0){S.pts+=off;S.total+=off;
      setTimeout(()=>{toast("💤 +"+fmt(off)+" while away");},500);}
  }catch(e){}}
}
