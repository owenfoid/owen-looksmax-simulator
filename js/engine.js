// URL param reset
if(location.search.indexOf("reset=1")>=0){localStorage.removeItem("owen_lm_v8");localStorage.removeItem("owen_bts");location.replace(location.pathname);}

var isMobile='ontouchstart' in window||navigator.maxTouchPoints>0;
var S={pts:0,total:0,pc:1,ps:0,upg:{},ach:{},clicks:0,stim:0,prestige:0,combo:0,maxCombo:0,lastClickTime:0,goldenClicks:0,lastSaveTime:Date.now(),totalPrestigeEarnings:0,zorgos:0,totalZorgos:0,teeth:32,suspicion:0};
var own=function(id){return S.upg[id]||0};
function cost(u){if(u.max&&own(u.id)>=u.max)return Infinity;return Math.floor(u.b*Math.pow(u.m,own(u.id)))}


function recalc(){S.pc=1;S.ps=0;for(var i=0;i<UPG.length;i++){var u=UPG[i];var n=own(u.id);S.pc+=u.pc*n;S.ps+=u.ps*n;}S.pc=Math.floor(S.pc*prestigeMult());S.ps=Math.floor(S.ps*prestigeMult());if(own("wet")>=1){S.pc*=2;S.ps*=2}if(own("what")>=1){S.ps+=7777}
// tooth farm: +50K per tooth over 32
if(own("tfarm")>=1){S.ps+=Math.max(0,(S.teeth-32))*50000}
// paranoia: +100/sec per suspicion
if(own("paranoia")>=1){S.ps+=Math.floor(S.suspicion)*100}
// become owen: x10 everything
if(own("wowen")>=1){S.pc*=10;S.ps*=10}
var cm=currencyMult();S.pc=Math.floor(S.pc*cm);S.ps=Math.floor(S.ps*cm)}

function prestigeMult(){var base=1+S.prestige*PRESTIGE_MULT;if(own("pboost")>0)base+=S.prestige*PRESTIGE_MULT*0.5*own("pboost");return base}
function comboMult(){var max=COMBO_MAX_MULT+own("cmult")*0.5;var rate=0.04+own("cmult")*0.02;return Math.min(max,1+S.combo*rate)}
// currencies that ACTUALLY DO THINGS
function currencyMult(){
  var m=1;var p=psl();
  // every 10th currency is a multiplier (its value / 50 = bonus %)
  for(var i=0;i<CURRENCIES.length;i+=10){
    if(p<CURRENCIES[i].unlockPSL)continue;
    var v=CURRENCIES[i].val;
    if(v>0) m+=v/500; // each point = 0.2% bonus
  }
  // every 13th currency is a PENALTY if negative or zero
  for(var i=6;i<CURRENCIES.length;i+=13){
    if(p<CURRENCIES[i].unlockPSL)continue;
    if(CURRENCIES[i].val<=0) m*=0.9; // -10% each
  }
  return Math.max(0.1,Math.min(m,50)); // cap between 0.1x and 50x
}

function currencyTax(){
  var taxMult=(own("cdrain")>=1?0.5:1)*(1-(typeof craftBonuses!=="undefined"?craftBonuses.taxred||0:0));
  // every 17th currency drains mew points if above 80
  var p=psl();
  for(var i=3;i<CURRENCIES.length;i+=17){
    if(p<CURRENCIES[i].unlockPSL)continue;
    if(CURRENCIES[i].val>80){
      var drain=Math.floor(S.pts*0.001*taxMult);
      if(drain>0){S.pts=Math.max(0,S.pts-drain)}
    }
  }
  // every 23rd gives points if above 50
  for(var i=5;i<CURRENCIES.length;i+=23){
    if(p<CURRENCIES[i].unlockPSL)continue;
    if(CURRENCIES[i].val>50){
      var bonus=Math.floor(CURRENCIES[i].val*S.ps*0.001);
      if(bonus>0){S.pts+=bonus;S.total+=bonus}
    }
  }
}

// currency interactions - some feed into others
function currencyInteract(){
  var p=psl();
  for(var i=0;i<CURRENCIES.length-1;i+=7){
    if(p<CURRENCIES[i].unlockPSL)continue;
    var next=CURRENCIES[(i+3)%CURRENCIES.length];
    if(p<next.unlockPSL)continue;
    // transfer: if this one > 80, overflow feeds the next
    if(CURRENCIES[i].val>80){
      var overflow=(CURRENCIES[i].val-80)*0.01;
      CURRENCIES[i].val-=overflow;
      next.val+=overflow*0.5;
    }
  }
}

// critical currency events
var critCurrency=-1;var critTimer=0;
function currencyCrisis(){if(typeof craftBonuses!=="undefined"&&craftBonuses.nocrisis)return;
  var p=psl();if(p<3)return;
  if(critCurrency<0&&Math.random()<0.002){
    // pick a random unlocked currency
    var unlocked=[];
    for(var i=0;i<CURRENCIES.length;i++)if(p>=CURRENCIES[i].unlockPSL)unlocked.push(i);
    if(unlocked.length>10){
      critCurrency=unlocked[Math.floor(Math.random()*unlocked.length)];
      critTimer=150; // 15 seconds
      toast("⚠️ CRITICAL: "+CURRENCIES[critCurrency].nm+" below 20 = lose 5%!");
      pushNotif("⚠️ "+CURRENCIES[critCurrency].nm+" CRITICAL");
    }
  }
  if(critCurrency>=0){
    critTimer--;
    if(critTimer<=0){
      if(CURRENCIES[critCurrency].val<20){
        var loss=Math.floor(S.pts*0.05);
        S.pts=Math.max(0,S.pts-loss);
        toast("💀 "+CURRENCIES[critCurrency].nm+" failed! -"+fmt(loss));
        screenShake(3);
      } else {
        var bonus=Math.floor(S.ps*10);
        S.pts+=bonus;S.total+=bonus;
        toast("✅ "+CURRENCIES[critCurrency].nm+" survived! +"+fmt(bonus));
      }
      critCurrency=-1;
    }
  }
}
function psl(){var t=S.total+S.totalPrestigeEarnings;if(t<=0)return 0;return Math.min(10,parseFloat((Math.log10(t+1)).toFixed(2)))}
function getRank(p){var r=RANKS[0];for(var i=0;i<RANKS.length;i++)if(p>=RANKS[i].min)r=RANKS[i];return r}
function fmt(n){if(n>=1e15)return(n/1e15).toFixed(1)+"Q";if(n>=1e12)return(n/1e12).toFixed(1)+"T";if(n>=1e9)return(n/1e9).toFixed(1)+"B";if(n>=1e6)return(n/1e6).toFixed(1)+"M";if(n>=1e3)return(n/1e3).toFixed(1)+"K";return Math.floor(n)}
function lerp(a,b,t){return a+(b-a)*Math.min(1,Math.max(0,t))}
var _curTime=0;
function tickCurrencies(dt){_curTime+=dt;var p=psl();for(var i=0;i<CURRENCIES.length;i++){var c=CURRENCIES[i];if(p<c.unlockPSL)continue;switch(c.beh){case"click":break;case"passive":c.val+=c.rate*dt;break;case"decay":c.val=Math.max(0,c.val-c.rate*dt*0.3);break;case"random":c.val+=(Math.random()-0.5)*c.rate*dt*2;break;case"sin":c.val=Math.max(0,50+Math.sin(_curTime*c.rate*0.5)*50);break;case"chaos":c.val=Math.random()*100;break;case"step":if(Math.random()<0.002*dt)c.val+=1;break;case"drain":c.val*=(1-0.01*dt);if(c.val<0.01)c.val=0;break;case"spike":if(Math.random()<0.001*dt){c.val=50+Math.random()*200}else{c.val*=0.95}break;case"time":c.val+=dt;break}if(c.val<0)c.val=0}}
function clickCurrencies(){var p=psl();for(var i=0;i<CURRENCIES.length;i++){var c=CURRENCIES[i];if(p<c.unlockPSL)continue;if(c.beh==="click")c.val+=c.rate;else if(c.beh==="decay")c.val+=0.5;else if(c.beh==="random")c.val+=Math.random()*0.5;else if(c.beh==="drain")c.val+=0.3;else if(Math.random()<0.1)c.val+=0.1}}
function canPrestige(){return S.total>=PRESTIGE_COST}
function doPrestige(){if(!canPrestige())return;S.totalPrestigeEarnings+=S.total;S.prestige++;var keep=own("pkeep")>=1?Math.floor(S.pts*0.1):0;S.pts=keep;S.total=0;S.upg={};S.stim=0;S.combo=0;S.clicks=0;recalc();render();screenShake(3);flash("rgba(128,0,255,0.4)");chromatic();var r=document.getElementById("face").getBoundingClientRect();particles(r.left+r.width/2,r.top+r.height/2,50);toast("PRESTIGE "+S.prestige+"! x"+prestigeMult().toFixed(2));checkAch()}
function tickCombo(){var decay=COMBO_DECAY_MS+own('cextend')*200;if(S.combo>0&&Date.now()-S.lastClickTime>decay)S.combo=0}
function addCombo(){S.combo++;S.lastClickTime=Date.now();if(S.combo>S.maxCombo)S.maxCombo=S.combo}
var goldenActive=false,goldenTimeout=null;
function spawnGolden(){if(goldenActive)return;goldenActive=true;toast("GOLDEN MEW!");goldenTimeout=setTimeout(function(){goldenActive=false},GOLDEN_DURATION)}
function claimGolden(){if(!goldenActive)return;goldenActive=false;clearTimeout(goldenTimeout);var gm=GOLDEN_MULT*(1+own('gvalue'));var b=Math.floor(S.pc*gm*comboMult());S.pts+=b;S.total+=b;S.goldenClicks=(S.goldenClicks||0)+1;toast("+"+fmt(b)+" GOLDEN");screenShake(3);chromatic();checkAch()}
function spawnZorgo(){if(document.querySelectorAll(".zorgo-float").length>(isMobile?3:8))return;var el=document.createElement("div");el.className="zorgo-float";el.textContent="\u{1F7E3}";el.style.left=(10+Math.random()*70)+"%";el.style.top=(15+Math.random()*50)+"%";var h=function(e){e.stopPropagation();e.preventDefault();var zamt=own("zdouble")>=1?2:1;S.zorgos+=zamt;S.totalZorgos+=zamt;toast("+1 Zorgo");var cx=e.clientX||(e.changedTouches&&e.changedTouches[0]?e.changedTouches[0].clientX:0);var cy=e.clientY||(e.changedTouches&&e.changedTouches[0]?e.changedTouches[0].clientY:0);if(cx)floatText(cx,cy,"+1","purple");if(cx)particles(cx,cy,8);el.remove();checkAch();render()};el.addEventListener("click",h);el.addEventListener("touchend",h,{passive:false});document.body.appendChild(el);setTimeout(function(){if(el.parentNode)el.remove()},4000)}
function spawnNegZorgo(){if(document.querySelectorAll(".zorgo-float").length>(isMobile?3:8))return;var el=document.createElement("div");el.className="zorgo-float";el.textContent="\u{26AB}";el.style.left=(10+Math.random()*70)+"%";el.style.top=(15+Math.random()*50)+"%";var h=function(e){e.stopPropagation();e.preventDefault();if(own("zshield")>=1){toast("Shield!");}else{S.zorgos=Math.max(0,S.zorgos-1)};toast("-1 Zorgo");screenShake(2);el.remove();render()};el.addEventListener("click",h);el.addEventListener("touchend",h,{passive:false});document.body.appendChild(el);setTimeout(function(){if(el.parentNode)el.remove()},2000)}
function teethTick(){var tRate=own('tbrush')>=1?0.0005:0.001;if(typeof craftBonuses!=="undefined"&&craftBonuses.teethslow)tRate*=0.2;if(psl()>=5&&Math.random()<tRate){S.teeth++;if(S.teeth===33)toast("...33 teeth?");else if(S.teeth===40)toast("stop.");else if(S.teeth===50)toast("too many");checkAch()}}
function addSuspicion(a){var gain=a*(own("shades")>=1?0.7:1);var cap=own("alias")>=1?150:100;S.suspicion=Math.min(cap,S.suspicion+gain);var susCap=own("alias")>=1?150:100;if(S.suspicion>=susCap){S.suspicion=0;var l=Math.floor(S.pts*0.1);S.pts=Math.max(0,S.pts-l);toast("THEY NOTICED. -"+fmt(l));screenShake(3)}}
var SAVE_KEY="owen_lm_v8";
// NEVER change SAVE_KEY - it will wipe everyone's progress
// Migration: also check older keys
var OLD_KEYS=["owen_lm_v6","owen_lm_v4","owen_lm_v3"];

function save(){
  S.lastSaveTime=Date.now();
  var d={v:13,s:S,cur:[],craft:[],cb:typeof craftBonuses!=="undefined"?craftBonuses:{},skills:typeof skillsBought!=="undefined"?skillsBought:{},lore:typeof _loreRead!=="undefined"?_loreRead:{}};
  for(var i=0;i<CURRENCIES.length;i++)d.cur.push(CURRENCIES[i].val);
  if(typeof RECIPES!=="undefined")for(var i=0;i<RECIPES.length;i++)d.craft.push(RECIPES[i].done);
  localStorage.setItem(SAVE_KEY,JSON.stringify(d));
}

function load(){
  // try current key first, then migrate from older keys
  var r=localStorage.getItem(SAVE_KEY);
  if(!r){
    for(var k=0;k<OLD_KEYS.length;k++){
      r=localStorage.getItem(OLD_KEYS[k]);
      if(r){toast("Migrated save from older version!");break}
    }
  }
  if(!r)return;
  try{
    var d=JSON.parse(r);
    if(d.s){
      // safe defaults for ALL fields - new fields won't crash
      var defaults={pts:0,total:0,pc:1,ps:0,upg:{},ach:{},clicks:0,stim:0,prestige:0,combo:0,maxCombo:0,lastClickTime:0,goldenClicks:0,lastSaveTime:Date.now(),totalPrestigeEarnings:0,zorgos:0,totalZorgos:0,teeth:32,suspicion:0};
      for(var key in defaults){
        if(d.s[key]===undefined||d.s[key]===null)d.s[key]=defaults[key];
      }
      Object.assign(S,d.s);
    }
    // currencies - only load as many as we have, new ones stay at default
    if(d.cur){
      for(var i=0;i<Math.min(d.cur.length,CURRENCIES.length);i++){
        if(typeof d.cur[i]==="number")CURRENCIES[i].val=d.cur[i];
      }
    }
    // crafting recipes - only load as many as exist
    if(d.craft&&typeof RECIPES!=="undefined"){
      for(var i=0;i<Math.min(d.craft.length,RECIPES.length);i++)RECIPES[i].done=!!d.craft[i];
    }
    if(d.cb&&typeof craftBonuses!=="undefined")Object.assign(craftBonuses,d.cb);
    // skills
    if(d.skills&&typeof skillsBought!=="undefined")skillsBought=d.skills;
    // lore
    if(d.lore&&typeof _loreRead!=="undefined")_loreRead=d.lore;
    recalc();
    // offline earnings
    var off=(Date.now()-S.lastSaveTime)/1000;
    if(off>30&&S.ps>0){
      var e=Math.floor(S.ps*off*0.5);
      S.pts+=e;S.total+=e;
      setTimeout(function(){toast("+"+fmt(e)+" while away")},500);
    }
  }catch(e){}
}

// EXPORT/IMPORT for backup
function exportSave(){
  save(); // save first
  var data=localStorage.getItem(SAVE_KEY);
  var encoded=btoa(data);
  // copy to clipboard
  if(navigator.clipboard){
    navigator.clipboard.writeText(encoded).then(function(){toast("Save copied to clipboard!")});
  }else{
    // fallback
    var ta=document.createElement("textarea");
    ta.value=encoded;document.body.appendChild(ta);ta.select();
    document.execCommand("copy");document.body.removeChild(ta);
    toast("Save copied to clipboard!");
  }
}
function importSave(){
  var code=prompt("Paste your save code:");
  if(!code)return;
  try{
    var decoded=atob(code);
    JSON.parse(decoded); // validate it's valid JSON
    localStorage.setItem(SAVE_KEY,decoded);
    toast("Save imported! Reloading...");
    setTimeout(function(){location.reload()},1000);
  }catch(e){
    toast("Invalid save code!");
  }
}
