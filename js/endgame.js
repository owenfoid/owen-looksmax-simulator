// ============ CURRENCY TOOLTIPS ============
document.getElementById("curr-grid").addEventListener("click",function(e){
  var item=e.target.closest(".cur");if(!item)return;
  var idx=Array.from(item.parentNode.children).indexOf(item);
  if(idx<0||idx>=CURRENCIES.length)return;
  var c=CURRENCIES[idx];
  var role="";
  if(idx%10===0)role="⬆️ MULTIPLIER — higher value = more income";
  else if(idx%17===3)role="⚠️ TAX — above 80 drains your mew points";
  else if(idx%23===5)role="💰 BONUS — above 50 generates free points";
  else if(idx%7===0)role="🔄 OVERFLOW — above 80 feeds into other currencies";
  else role="📊 Standard currency";
  // check if needed for any craft
  var craftUse="";
  if(typeof RECIPES!=="undefined"){
    for(var i=0;i<RECIPES.length;i++){
      for(var j=0;j<RECIPES[i].need.length;j++){
        if(RECIPES[i].need[j].i===idx)craftUse+=(craftUse?", ":"")+RECIPES[i].name+" (need "+RECIPES[i].need[j].v+")";
      }
    }
  }
  var msg=c.ic+" "+c.nm+"\n"+role+"\nBehavior: "+c.beh+" | Rate: "+c.rate.toFixed(2);
  if(craftUse)msg+="\nUsed in: "+craftUse;
  toast(msg);
});

// ============ ACHIEVEMENT REWARDS ============
var ACH_REWARDS={
  c10:{pts:500},c1k:{pts:50000},p1m:{pts:100000},p1b:{zorgo:3},
  psl5:{pts:500000},psl9:{zorgo:10,pts:10000000},stim:{pts:10000},
  e67:{zorgo:5},pr1:{pts:1000000},z1:{pts:5000},z50:{zorgo:20},
  cur50:{pts:2000000},wet1:{zorgo:7},t50:{pts:5000000},
};
var _achRewarded={};
function checkAchRewards(){
  for(var id in ACH_REWARDS){
    if(S.ach[id]&&!_achRewarded[id]){
      _achRewarded[id]=true;
      var r=ACH_REWARDS[id];
      if(r.pts){S.pts+=r.pts;S.total+=r.pts;toast("🏆 Achievement reward: +"+fmt(r.pts)+" pts!")}
      if(r.zorgo){S.zorgos+=r.zorgo;S.totalZorgos+=r.zorgo;toast("🏆 Achievement reward: +"+r.zorgo+" zorgos!")}
    }
  }
}
setInterval(checkAchRewards,2000);

// ============ ASCENSION (prestige layer 2) ============
var ascension=0;var ascensionMult=function(){return 1+ascension*2};
var ASC_COST=10; // need prestige 10 to ascend
var ASC_UPGRADES=[
  {id:"a1",nm:"Eternal Mew",ds:"All income x3 per ascension",cost:1,bought:false},
  {id:"a2",nm:"Zorgo Magnet II",ds:"Start with 5 zorgos after prestige",cost:1,bought:false},
  {id:"a3",nm:"Currency Genesis",ds:"All currencies start at 20",cost:2,bought:false},
  {id:"a4",nm:"Teeth of Steel",ds:"Teeth never decrease",cost:2,bought:false},
  {id:"a5",nm:"Agartha Shortcut",ds:"Agartha starts at floor 3",cost:3,bought:false},
  {id:"a6",nm:"Infinite Combo",ds:"Combo never decays",cost:3,bought:false},
  {id:"a7",nm:"Owen's Genome",ds:"x10 everything permanently",cost:5,bought:false},
];
var ascPoints=0;
function canAscend(){return S.prestige>=ASC_COST}
function doAscend(){
  if(!canAscend())return;
  if(!confirm("ASCEND? Resets EVERYTHING (prestige, points, upgrades, skills) but grants Ascension Points for mega-upgrades. You keep: ascension upgrades, achievements, lore."))return;
  ascension++;
  ascPoints+=Math.floor(S.prestige/5)+1;
  // reset everything
  S.pts=0;S.total=0;S.totalPrestigeEarnings=0;S.prestige=0;S.upg={};S.clicks=0;S.stim=0;S.combo=0;S.maxCombo=0;
  // keep zorgos if a2 bought
  if(!ASC_UPGRADES[1].bought)S.zorgos=0;else S.zorgos=5;
  S.totalZorgos=S.zorgos;S.teeth=32;S.suspicion=0;
  // reset currencies
  for(var i=0;i<CURRENCIES.length;i++){
    CURRENCIES[i].val=ASC_UPGRADES[2].bought?20:0;
  }
  // reset skills
  if(typeof skillsBought!=="undefined")skillsBought={};
  // reset crafts
  if(typeof RECIPES!=="undefined")for(var i=0;i<RECIPES.length;i++)RECIPES[i].done=false;
  if(typeof craftBonuses!=="undefined"){for(var k in craftBonuses)craftBonuses[k]=0}
  recalc();render();
  toast("🌟 ASCENSION "+ascension+"! +"+ascPoints+" Ascension Points!");
  screenShake(3);chromatic();sndAch();
  flash("rgba(255,255,255,0.5)");
  setTimeout(function(){flash("rgba(255,200,0,0.3)");screenShake(3)},300);
  setTimeout(function(){flash("rgba(200,0,255,0.3)");chromatic()},600);
}
function buyAscUpgrade(idx){
  var u=ASC_UPGRADES[idx];if(!u||u.bought||ascPoints<u.cost)return;
  ascPoints-=u.cost;u.bought=true;
  toast("🌟 Ascension upgrade: "+u.nm);sndAch();
  recalc();renderAscension();
}
function renderAscension(){
  var el=document.getElementById("asc-area");if(!el)return;
  var h='<div style="font-size:.5rem;margin-bottom:4px">Ascension: <b>'+ascension+'</b> | Points: <b>'+ascPoints+'</b> | Mult: x'+ascensionMult()+'</div>';
  if(canAscend()){
    h+='<button class="casino-btn" onclick="doAscend()" style="margin-bottom:4px;background:#ffe0ff;border-color:purple;color:purple">🌟 ASCEND (need prestige '+ASC_COST+')</button>';
  }else if(S.prestige>0){
    h+='<div style="font-size:.45rem;color:#999;margin-bottom:4px">Need prestige '+ASC_COST+' to ascend (currently '+S.prestige+')</div>';
  }
  for(var i=0;i<ASC_UPGRADES.length;i++){
    var u=ASC_UPGRADES[i];
    var can=!u.bought&&ascPoints>=u.cost;
    h+='<div onclick="buyAscUpgrade('+i+')" style="padding:3px;margin:2px 0;border:1px solid '+(u.bought?"green":can?"orange":"#ccc")+';background:'+(u.bought?"#e0ffe0":can?"#fffde0":"#f8f8f8")+';font-size:.45rem;cursor:'+(can?"pointer":"default")+'"><b>'+u.nm+'</b> ('+u.cost+'pt) — '+u.ds+(u.bought?" ✅":"")+'</div>';
  }
  el.innerHTML=h;
}
// hook ascension mult into recalc
var _recalcWithAsc=recalc;
recalc=function(){_recalcWithAsc();S.pc=Math.floor(S.pc*ascensionMult());S.ps=Math.floor(S.ps*ascensionMult());
  if(ASC_UPGRADES[0].bought){S.pc*=3*ascension;S.ps*=3*ascension}
  if(ASC_UPGRADES[5].bought&&typeof COMBO_DECAY_MS!=="undefined"){/* handled in tickCombo */}
};
// infinite combo from ascension
var _origTickCombo=tickCombo;
tickCombo=function(){if(ASC_UPGRADES[5].bought)return;_origTickCombo()};

setInterval(renderAscension,2000);

// ============ DAILY CHALLENGES ============
var CHALLENGE_TYPES=[
  {nm:"Speed Mewer",ds:"Get {n} clicks in 60 seconds",type:"clicks",dur:60},
  {nm:"Zorgo Hunter",ds:"Collect {n} zorgos in 90 seconds",type:"zorgos",dur:90},
  {nm:"Currency Farmer",ds:"Get any currency above {n}",type:"currency",dur:120},
  {nm:"Combo Master",ds:"Reach {n}x combo",type:"combo",dur:45},
  {nm:"PSL Sprint",ds:"Reach PSL {n} in 120 seconds",type:"psl",dur:120},
  {nm:"Agartha Diver",ds:"Reach floor {n} in Agartha",type:"agartha",dur:300},
  {nm:"Stim Lord",ds:"Fill stim meter {n} times",type:"stimfills",dur:120},
];
var dailyChallenge=null;var dailyTimer=0;var dailyActive=false;var dailyStart={};var stimFillCount=0;
var _lastStim=0;

function genDailyChallenge(){
  var seed=Math.floor(Date.now()/(24*60*60*1000)); // changes daily
  var r=seed%CHALLENGE_TYPES.length;
  var ch=CHALLENGE_TYPES[r];
  var targets={clicks:50+seed%100,zorgos:3+seed%5,currency:30+seed%40,combo:15+seed%20,psl:2+(seed%4),agartha:3+seed%5,stimfills:3+seed%3};
  return{nm:ch.nm,ds:ch.ds.replace("{n}",targets[ch.type]),type:ch.type,target:targets[ch.type],dur:ch.dur,reward:10000*(1+seed%10),zReward:1+seed%3};
}
function startDaily(){
  if(dailyActive)return;
  dailyChallenge=genDailyChallenge();
  dailyActive=true;
  dailyTimer=dailyChallenge.dur;
  dailyStart={clicks:S.clicks,zorgos:S.totalZorgos,combo:0,psl:psl(),floor:typeof agFloor!=="undefined"?agFloor:0};
  stimFillCount=0;
  toast("⏱️ Challenge started: "+dailyChallenge.nm);
}
function checkDailyProgress(){
  if(!dailyActive||!dailyChallenge)return;
  dailyTimer-=0.1;
  if(dailyTimer<=0){dailyActive=false;toast("⏱️ Challenge FAILED: time's up!");return}
  var done=false;
  switch(dailyChallenge.type){
    case"clicks":done=(S.clicks-dailyStart.clicks)>=dailyChallenge.target;break;
    case"zorgos":done=(S.totalZorgos-dailyStart.zorgos)>=dailyChallenge.target;break;
    case"currency":for(var i=0;i<CURRENCIES.length;i++){if(psl()>=CURRENCIES[i].unlockPSL&&CURRENCIES[i].val>=dailyChallenge.target){done=true;break}};break;
    case"combo":done=S.combo>=dailyChallenge.target;break;
    case"psl":done=psl()>=dailyChallenge.target;break;
    case"agartha":done=(typeof agFloor!=="undefined"&&agFloor>=dailyChallenge.target);break;
    case"stimfills":done=stimFillCount>=dailyChallenge.target;break;
  }
  if(done){
    dailyActive=false;
    S.pts+=dailyChallenge.reward;S.total+=dailyChallenge.reward;
    S.zorgos+=dailyChallenge.zReward;S.totalZorgos+=dailyChallenge.zReward;
    toast("✅ Challenge COMPLETE! +"+fmt(dailyChallenge.reward)+" pts +"+dailyChallenge.zReward+" zorgos!");
    sndAch();screenShake(3);chromatic();
    render();
  }
}
// track stim fills
var _origAddStim=addStim;
addStim=function(a){
  var wasFull=S.stim>=99;
  _origAddStim(a);
  if(!wasFull&&S.stim>=100)stimFillCount++;
};
setInterval(checkDailyProgress,100);

function renderDaily(){
  var el=document.getElementById("daily-area");if(!el)return;
  var ch=genDailyChallenge();
  var h="";
  if(dailyActive&&dailyChallenge){
    h+='<div style="font-size:.6rem;font-weight:700;color:red">⏱️ '+dailyChallenge.nm+' — '+Math.ceil(dailyTimer)+'s left</div>';
    h+='<div style="font-size:.45rem">'+dailyChallenge.ds+'</div>';
    h+='<div style="font-size:.45rem;color:#666">Reward: '+fmt(dailyChallenge.reward)+' pts + '+dailyChallenge.zReward+' zorgos</div>';
  }else{
    h+='<div style="font-size:.5rem;margin-bottom:4px"><b>'+ch.nm+'</b> — '+ch.ds+'</div>';
    h+='<div style="font-size:.45rem;color:#666">Reward: '+fmt(ch.reward)+' pts + '+ch.zReward+' zorgos | Duration: '+ch.dur+'s</div>';
    h+='<button class="casino-btn" onclick="startDaily()" style="margin-top:4px">⏱️ Start Challenge</button>';
  }
  el.innerHTML=h;
}
setInterval(renderDaily,1000);

// ============ CURRENCY EXPEDITIONS ============
var expeditions=[];var MAX_EXPEDITIONS=3;
var EXP_TYPES=[
  {nm:"Quick Scout",dur:300,cost:5,reward:{pts:50000,curr:5},desc:"5 min — small rewards"},
  {nm:"Deep Dive",dur:1800,cost:15,reward:{pts:500000,curr:15,zorgo:1},desc:"30 min — good rewards"},
  {nm:"Agartha Probe",dur:7200,cost:40,reward:{pts:5000000,curr:30,zorgo:3},desc:"2 hr — great rewards"},
  {nm:"Owen's Quest",dur:28800,cost:100,reward:{pts:50000000,curr:50,zorgo:10},desc:"8 hr — legendary rewards"},
];
function startExpedition(typeIdx){
  if(expeditions.length>=MAX_EXPEDITIONS){toast("Max "+MAX_EXPEDITIONS+" expeditions!");return}
  var t=EXP_TYPES[typeIdx];
  // cost = currencies. pick random unlocked currencies to consume
  var p=psl();var unlocked=[];
  for(var i=0;i<CURRENCIES.length;i++)if(p>=CURRENCIES[i].unlockPSL&&CURRENCIES[i].val>=5)unlocked.push(i);
  if(unlocked.length<t.cost/5){toast("Not enough currencies above 5!");return}
  // consume from random currencies
  var consumed=0;
  for(var i=0;i<unlocked.length&&consumed<t.cost;i++){
    var take=Math.min(5,t.cost-consumed);
    CURRENCIES[unlocked[i]].val-=take;consumed+=take;
  }
  expeditions.push({type:typeIdx,endTime:Date.now()+t.dur*1000,nm:t.nm});
  toast("🚀 "+t.nm+" expedition launched!");sndBuy();
  renderExpeditions();
}
function checkExpeditions(){
  var now=Date.now();
  for(var i=expeditions.length-1;i>=0;i--){
    if(now>=expeditions[i].endTime){
      var t=EXP_TYPES[expeditions[i].type];
      S.pts+=t.reward.pts;S.total+=t.reward.pts;
      if(t.reward.zorgo){S.zorgos+=t.reward.zorgo;S.totalZorgos+=t.reward.zorgo}
      // boost currencies
      for(var j=0;j<t.reward.curr;j++){
        var ri=Math.floor(Math.random()*CURRENCIES.length);
        if(psl()>=CURRENCIES[ri].unlockPSL)CURRENCIES[ri].val+=5;
      }
      toast("🚀 "+expeditions[i].nm+" returned! +"+fmt(t.reward.pts)+(t.reward.zorgo?" +"+t.reward.zorgo+"🟣":""));
      sndAch();
      expeditions.splice(i,1);
    }
  }
}
setInterval(checkExpeditions,5000);

function renderExpeditions(){
  var el=document.getElementById("exp-area");if(!el)return;
  var h='<div style="font-size:.45rem;color:#666;margin-bottom:4px">Send currencies on timed expeditions. Max '+MAX_EXPEDITIONS+' at once.</div>';
  // active expeditions
  for(var i=0;i<expeditions.length;i++){
    var e=expeditions[i];
    var left=Math.max(0,Math.floor((e.endTime-Date.now())/1000));
    var mins=Math.floor(left/60);var secs=left%60;
    h+='<div style="padding:3px;margin:2px 0;border:1px solid green;background:#e0ffe0;font-size:.45rem">🚀 '+e.nm+' — '+mins+'m '+secs+'s remaining</div>';
  }
  // available types
  if(expeditions.length<MAX_EXPEDITIONS){
    for(var i=0;i<EXP_TYPES.length;i++){
      var t=EXP_TYPES[i];
      h+='<div onclick="startExpedition('+i+')" style="padding:3px;margin:2px 0;border:1px solid #ccc;background:#fff;font-size:.45rem;cursor:pointer"><b>'+t.nm+'</b> — '+t.desc+' (costs '+t.cost+' currency pts)</div>';
    }
  }
  el.innerHTML=h;
}
setInterval(renderExpeditions,2000);

// ============ MILESTONE EFFECTS ============
var _lastPSLMilestone=0;
setInterval(function(){
  var p=Math.floor(psl());
  if(p>_lastPSLMilestone&&p>=1){
    _lastPSLMilestone=p;
    // BIG visual effect
    screenShake(3);chromatic();
    flash("rgba(255,200,0,0.3)");
    setTimeout(function(){flash("rgba(200,0,255,0.3)");screenShake(2)},200);
    setTimeout(function(){flash("rgba(0,255,100,0.3)");chromatic()},400);
    // emoji burst
    for(var i=0;i<10;i++)setTimeout(function(){if(typeof dropEmoji==="function")dropEmoji()},i*100);
    toast("⭐ PSL "+p+" REACHED!");
    sndAch();
    // theme shift at milestones
    var colors=["#fff","#fff8f0","#f0f8ff","#f8f0ff","#f0fff0","#fff0f0","#f0f0f0","#fffff0","#f0ffff","#fff0ff"];
    if(p<colors.length)document.body.style.backgroundColor=colors[p];
    // bonus
    var bonus=Math.floor(Math.pow(10,p+2));
    S.pts+=bonus;S.total+=bonus;
    toast("⭐ PSL "+p+" bonus: +"+fmt(bonus)+"!");
  }
},500);

// ============ SAVE ASCENSION/EXPEDITION STATE ============
var _origSave2=save;
save=function(){
  _origSave2();
  var d=JSON.parse(localStorage.getItem(SAVE_KEY)||"{}");
  d.asc=ascension;d.ascPts=ascPoints;d.ascUpg=[];
  for(var i=0;i<ASC_UPGRADES.length;i++)d.ascUpg.push(ASC_UPGRADES[i].bought);
  d.exp=expeditions;d.achRew=_achRewarded;d.pslMile=_lastPSLMilestone;
  localStorage.setItem(SAVE_KEY,JSON.stringify(d));
};
// load
setInterval(function(){
  var d=JSON.parse(localStorage.getItem(SAVE_KEY)||"{}");
  if(d.asc!==undefined)ascension=d.asc;
  if(d.ascPts!==undefined)ascPoints=d.ascPts;
  if(d.ascUpg){for(var i=0;i<Math.min(d.ascUpg.length,ASC_UPGRADES.length);i++)ASC_UPGRADES[i].bought=!!d.ascUpg[i]}
  if(d.exp)expeditions=d.exp;
  if(d.achRew)_achRewarded=d.achRew;
  if(d.pslMile)_lastPSLMilestone=d.pslMile;
},3000);

// ============ INIT ============
renderAscension();renderDaily();renderExpeditions();
