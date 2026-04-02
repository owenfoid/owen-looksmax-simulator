// ============ ZORGO CASINO ============
var casinoSymbols=["🟣","🗿","🦷","👁️","💀","⚡","👹","♾️","⚠️","❓"];
var casinoArea=document.getElementById("casino-area");
function initCasino(){
  if(!casinoArea)return;
  casinoArea.innerHTML='<div class="slot-display" id="slots">❓ ❓ ❓</div>'+
    '<div class="casino-result" id="casino-result"></div>'+
    '<div style="text-align:center">'+
    '<button class="casino-btn" onclick="casinoSpin(1)">Spin (1🟣)</button>'+
    '<button class="casino-btn" onclick="casinoSpin(5)">Big Spin (5🟣)</button>'+
    '<button class="casino-btn" onclick="casinoCoinFlip()">Coin Flip (3🟣)</button>'+
    '</div>'+
    '<div style="font-size:.4rem;color:#999;text-align:center;margin-top:4px">'+
    'Luck affected by: Bright Shells(+), Cursed Memories(-), combo(+)</div>';
}
function getLuck(){
  var luck=1;
  // bright shells (#39) boost luck
  if(CURRENCIES[39])luck+=CURRENCIES[39].val*0.005;
  // cursed memories (#6) reduce luck
  if(CURRENCIES[6])luck-=CURRENCIES[6].val*0.003;
  // combo boosts luck
  luck+=S.combo*0.01;
  return Math.max(0.3,Math.min(luck,2.5));
}
function casinoSpin(cost){
  if(S.zorgos<cost){toast("Need "+cost+" zorgos");return}
  S.zorgos-=cost;
  var slots=document.getElementById("slots");
  var result=document.getElementById("casino-result");
  // spinning animation
  var spins=0;var spinId=setInterval(function(){
    var s1=casinoSymbols[Math.floor(Math.random()*casinoSymbols.length)];
    var s2=casinoSymbols[Math.floor(Math.random()*casinoSymbols.length)];
    var s3=casinoSymbols[Math.floor(Math.random()*casinoSymbols.length)];
    slots.textContent=s1+" "+s2+" "+s3;
    spins++;
    if(spins>15){
      clearInterval(spinId);
      // determine result with luck
      var luck=getLuck();
      var r=Math.random()/luck;
      var sym,matches;
      if(r<0.02){// jackpot - all same (rare)
        sym=casinoSymbols[Math.floor(Math.random()*casinoSymbols.length)];
        slots.textContent=sym+" "+sym+" "+sym;matches=3;
      }else if(r<0.15){// two match
        sym=casinoSymbols[Math.floor(Math.random()*casinoSymbols.length)];
        var other=casinoSymbols[Math.floor(Math.random()*casinoSymbols.length)];
        while(other===sym)other=casinoSymbols[Math.floor(Math.random()*casinoSymbols.length)];
        var arr=[sym,sym,other];arr.sort(function(){return Math.random()-0.5});
        slots.textContent=arr.join(" ");matches=2;
      }else{matches=0}// no match already displayed
      // rewards
      var mult=cost===5?3:1;
      if(matches===3){
        var reward=cost*10*mult;
        S.zorgos+=reward;S.totalZorgos+=reward;
        result.textContent="🎰 JACKPOT! +"+reward+" ZORGOS!";
        result.style.color="green";
        screenShake(3);chromatic();
        // jackpot boosts random currencies
        for(var i=0;i<5;i++){var ri=Math.floor(Math.random()*CURRENCIES.length);CURRENCIES[ri].val+=20}
        toast("JACKPOT! +"+reward+" zorgos!");
      }else if(matches===2){
        var reward=cost*3*mult;
        S.zorgos+=reward;S.totalZorgos+=reward;
        result.textContent="✨ Two match! +"+reward+" zorgos";
        result.style.color="green";screenShake(1);
      }else{
        result.textContent="💀 Nothing. -"+cost+" zorgos.";
        result.style.color="red";
        // losing drains a random currency slightly
        var ri=Math.floor(Math.random()*CURRENCIES.length);
        if(psl()>=CURRENCIES[ri].unlockPSL)CURRENCIES[ri].val=Math.max(0,CURRENCIES[ri].val-3);
      }
      render();
    }
  },80);
}
function casinoCoinFlip(){
  if(S.zorgos<3){toast("Need 3 zorgos");return}
  S.zorgos-=3;
  var result=document.getElementById("casino-result");
  var slots=document.getElementById("slots");
  slots.textContent="🪙 flipping... 🪙";
  setTimeout(function(){
    var luck=getLuck();
    var win=Math.random()<0.45*luck; // slightly below 50% base
    if(win){
      S.zorgos+=6;S.totalZorgos+=6;
      slots.textContent="🪙 ✅ 🪙";
      result.textContent="Won! +6 zorgos (net +3)";result.style.color="green";
      screenShake(1);
    }else{
      slots.textContent="🪙 ❌ 🪙";
      result.textContent="Lost! -3 zorgos";result.style.color="red";
      addSuspicion(2);
    }
    render();
  },800);
}

// ============ BOSS FIGHTS ============
var bossActive=false;var bossHP=0;var bossMaxHP=0;var bossTimer=0;var bossReward=0;var bossInterval=null;
function spawnBoss(){
  if(bossActive||psl()<2)return;
  bossActive=true;
  var p=psl();
  bossMaxHP=Math.floor(50+p*30+S.prestige*20);
  bossHP=bossMaxHP;
  bossTimer=100; // 10 seconds
  bossReward=Math.floor(S.ps*20+p*10000);
  var panel=document.getElementById("boss-panel");
  if(panel)panel.style.display="block";
  var area=document.getElementById("boss-area");
  // currency bonuses
  var bonusText="";
  if(CURRENCIES[0]&&CURRENCIES[0].val>30)bonusText+=" | Red Shards: +"+Math.floor(CURRENCIES[0].val/10)+"% dmg";
  if(CURRENCIES[21]&&CURRENCIES[21].val>20)bonusText+=" | True Signals: +"+Math.floor(CURRENCIES[21].val/10)+"% dmg";
  area.innerHTML='<div style="font-size:.6rem;margin:4px 0">⚔️ PSL Challenger appeared! Click to attack! (10s)'+bonusText+'</div>'+
    '<div class="boss-hp"><div class="boss-hp-fill" id="boss-hp-fill" style="width:100%"></div><div class="boss-hp-text" id="boss-hp-text">'+bossHP+'/'+bossMaxHP+'</div></div>'+
    '<div style="text-align:center"><button class="boss-btn" id="boss-atk" onclick="bossAttack()">⚔️ ATTACK ⚔️</button></div>'+
    '<div style="font-size:.5rem;color:#666;text-align:center;margin-top:2px">Reward: '+fmt(bossReward)+' mew pts + zorgos</div>';
  toast("⚔️ PSL CHALLENGER APPEARED!");screenShake(2);
  bossInterval=setInterval(function(){
    bossTimer--;
    if(bossTimer<=0){
      // boss wins
      clearInterval(bossInterval);bossActive=false;
      var loss=Math.floor(S.pts*0.08);
      S.pts=Math.max(0,S.pts-loss);
      toast("💀 Challenger won! -"+fmt(loss));
      addSuspicion(10);
      var panel=document.getElementById("boss-panel");if(panel)panel.style.display="none";
      render();
    }
    var hpText=document.getElementById("boss-hp-text");
    if(hpText)hpText.textContent=bossHP+"/"+bossMaxHP+" ("+Math.ceil(bossTimer/10)+"s)";
  },100);
}
function bossAttack(){
  if(!bossActive)return;
  var dmg=1;
  // currency damage bonuses
  if(CURRENCIES[0]&&CURRENCIES[0].val>30)dmg+=CURRENCIES[0].val/30;
  if(CURRENCIES[21]&&CURRENCIES[21].val>20)dmg+=CURRENCIES[21].val/30;
  if(CURRENCIES[10]&&CURRENCIES[10].val>20)dmg+=0.5;
  dmg=Math.floor(dmg*comboMult());
  bossHP=Math.max(0,bossHP-dmg);
  var fill=document.getElementById("boss-hp-fill");
  if(fill)fill.style.width=(bossHP/bossMaxHP*100)+"%";
  var hpText=document.getElementById("boss-hp-text");
  if(hpText)hpText.textContent=bossHP+"/"+bossMaxHP+" ("+Math.ceil(bossTimer/10)+"s)";
  screenShake(1);
  if(bossHP<=0){
    clearInterval(bossInterval);bossActive=false;
    S.pts+=bossReward;S.total+=bossReward;
    var zr=Math.floor(Math.random()*3)+1;
    S.zorgos+=zr;S.totalZorgos+=zr;
    // boost random currencies on win
    for(var i=0;i<8;i++){var ri=Math.floor(Math.random()*CURRENCIES.length);if(psl()>=CURRENCIES[ri].unlockPSL)CURRENCIES[ri].val+=10}
    toast("⚔️ VICTORY! +"+fmt(bossReward)+" +"+zr+" zorgos!");
    screenShake(3);chromatic();
    var panel=document.getElementById("boss-panel");if(panel)panel.style.display="none";
    checkAch();render();
  }
}
// boss spawning
setInterval(function(){if(!bossActive&&psl()>=2&&Math.random()<0.005)spawnBoss()},2000);

// ============ AGARTHA DESCENT ============
var agFloor=0;var agActive=false;var agLoot=0;var agZLoot=0;
function initAgartha(){
  var panel=document.getElementById("agartha-panel");
  if(psl()>=5&&panel)panel.style.display="block";
  var area=document.getElementById("agartha-area");
  if(!area)return;
  if(!agActive){
    area.innerHTML='<div style="font-size:.6rem;margin:4px 0">Descend into the hollow earth. Each floor: pick a door. Go deeper = bigger rewards. Die = lose everything from this run.</div>'+
      '<div style="font-size:.5rem;color:#666">Entry cost: 5 zorgos + 500K mew pts. Deep Cubes currency boosts floor rewards.</div>'+
      '<div style="text-align:center;margin-top:6px"><button class="casino-btn" onclick="agarthaStart()">🕳️ DESCEND</button></div>';
  }
}
function agarthaStart(){
  if(S.zorgos<5){toast("Need 5 zorgos");return}
  if(S.pts<500000){toast("Need 500K mew pts");return}
  S.zorgos-=5;S.pts-=500000;
  agActive=true;agFloor=1;agLoot=0;agZLoot=0;
  agarthaFloor();
}
function agarthaFloor(){
  var area=document.getElementById("agartha-area");if(!area)return;
  var depthBonus=CURRENCIES[127]?Math.floor(CURRENCIES[127].val/10):0; // Deep Cubes bonus
  var danger=agFloor*10+Math.floor(Math.random()*agFloor*5);
  var reward=Math.floor((agFloor*agFloor*10000)*(1+depthBonus*0.1));
  var zReward=agFloor>=5?Math.floor(agFloor/3):0;

  area.innerHTML='<div class="ag-status">🕳️ Floor '+agFloor+' | Loot: '+fmt(agLoot)+' pts, '+agZLoot+' zorgos | Danger: '+danger+'%</div>'+
    '<div style="font-size:.5rem;color:#666;margin:4px 0">Deep Cubes bonus: +'+depthBonus*10+'% rewards</div>'+
    '<div style="display:flex;flex-wrap:wrap;justify-content:center">'+
    '<div class="ag-door" onclick="agarthaDoor(true)">🚪 LEFT DOOR<br><span style="font-size:.4rem;color:green">Reward: ~'+fmt(reward)+'</span></div>'+
    '<div class="ag-door" onclick="agarthaDoor(false)">🚪 RIGHT DOOR<br><span style="font-size:.4rem;color:red">Risk: '+danger+'%</span></div>'+
    '</div>'+
    '<div style="text-align:center;margin-top:6px"><button class="casino-btn" onclick="agarthaExit()">🏃 EXIT (keep loot)</button></div>';
}
function agarthaDoor(isLeft){
  if(!agActive)return;
  var depthBonus=CURRENCIES[127]?CURRENCIES[127].val/100:0;
  var reward=Math.floor((agFloor*agFloor*10000)*(1+depthBonus));
  var zReward=agFloor>=5?Math.floor(agFloor/3):0;
  var danger=agFloor*8+Math.floor(Math.random()*agFloor*5);
  var luck=getLuck();

  // one door is safe, one is dangerous, random which
  var safeDoor=Math.random()<0.5;
  var pickedSafe=(isLeft===safeDoor);

  if(pickedSafe||Math.random()*100>danger/luck){
    // success
    agLoot+=reward;agZLoot+=zReward;
    toast("✅ Floor "+agFloor+" cleared! +"+fmt(reward));
    screenShake(1);
    // boost random currencies
    for(var i=0;i<3;i++){var ri=Math.floor(Math.random()*CURRENCIES.length);if(psl()>=CURRENCIES[ri].unlockPSL)CURRENCIES[ri].val+=agFloor}
    agFloor++;
    if(agFloor>10){
      // beat agartha!
      agLoot*=3;agZLoot*=2;
      toast("🕳️ AGARTHA CONQUERED! LOOT x3!");
      agarthaExit();return;
    }
    agarthaFloor();
  }else{
    // death
    toast("💀 DIED on floor "+agFloor+"! Lost all loot!");
    screenShake(3);flash("rgba(255,0,0,0.3)");
    // drain some currencies as punishment
    for(var i=0;i<5;i++){var ri=Math.floor(Math.random()*CURRENCIES.length);if(psl()>=CURRENCIES[ri].unlockPSL)CURRENCIES[ri].val=Math.max(0,CURRENCIES[ri].val-15)}
    addSuspicion(15);
    agActive=false;agFloor=0;agLoot=0;agZLoot=0;
    initAgartha();
  }
}
function agarthaExit(){
  S.pts+=agLoot;S.total+=agLoot;S.zorgos+=agZLoot;S.totalZorgos+=agZLoot;
  toast("🕳️ Escaped with "+fmt(agLoot)+" pts + "+agZLoot+" zorgos!");
  screenShake(2);chromatic();
  agActive=false;agFloor=0;agLoot=0;agZLoot=0;
  checkAch();render();initAgartha();
}
setInterval(function(){if(psl()>=5)initAgartha()},5000);

// ============ CURRENCY CRAFTING ============
var RECIPES=[
  {name:"Crimson Forge",need:[{i:0,v:30},{i:3,v:30},{i:8,v:20}],reward:"pc",amt:0.1,desc:"+10% click power forever",done:false},
  {name:"Void Synthesis",need:[{i:5,v:40},{i:6,v:40},{i:7,v:30}],reward:"ps",amt:0.1,desc:"+10% passive forever",done:false},
  {name:"Spectral Merge",need:[{i:10,v:50},{i:14,v:50},{i:20,v:30}],reward:"cmult",amt:0.15,desc:"+15% currency mult",done:false},
  {name:"Bone Alchemy",need:[{i:32,v:40},{i:38,v:40}],reward:"pc",amt:0.2,desc:"+20% click power forever",done:false,minPSL:3},
  {name:"Owen's Blessing",need:[{i:0,v:80},{i:5,v:80},{i:10,v:80},{i:20,v:80}],reward:"ps",amt:0.25,desc:"+25% passive forever",done:false,minPSL:5},
  {name:"Zorgo Distillation",need:[{i:5,v:60},{i:25,v:40}],reward:"zorgo",amt:5,desc:"+5 zorgos",done:false},
  {name:"Anti-Tax Shield",need:[{i:6,v:50},{i:17,v:30},{i:34,v:30}],reward:"taxred",amt:0.5,desc:"Taxes -50% (stacks with drain tap)",done:false,minPSL:4},
  {name:"Tooth Suppressor",need:[{i:38,v:60},{i:34,v:40}],reward:"teethslow",amt:1,desc:"Teeth growth -80%",done:false,minPSL:5},
  {name:"Crisis Immunity",need:[{i:0,v:100},{i:5,v:100},{i:10,v:100}],reward:"nocrisis",amt:1,desc:"No more currency crises",done:false,minPSL:6},
  {name:"Agartha Compass",need:[{i:48,v:50},{i:49,v:50}],reward:"agbonus",amt:1,desc:"Agartha rewards x2",done:false,minPSL:5},
  {name:"Sukuna's Eye",need:[{i:34,v:80},{i:64,v:60}],reward:"bossbonus",amt:1,desc:"Boss damage x2",done:false,minPSL:6},
  {name:"The Final Mew",need:[{i:0,v:100},{i:5,v:100},{i:10,v:100},{i:20,v:100},{i:50,v:80}],reward:"everything",amt:0.5,desc:"+50% EVERYTHING",done:false,minPSL:7},
];
var craftBonuses={pc:0,ps:0,cmult:0,taxred:0,teethslow:0,nocrisis:0,agbonus:0,bossbonus:0,everything:0,zorgo:0};

function renderCrafting(){
  var list=document.getElementById("craft-list");if(!list)return;
  list.innerHTML="";
  var p=psl();
  for(var i=0;i<RECIPES.length;i++){
    var r=RECIPES[i];
    if(r.minPSL&&p<r.minPSL)continue;
    var canCraft=!r.done;
    var needStr="";
    for(var j=0;j<r.need.length;j++){
      var n=r.need[j];
      var has=n.i<CURRENCIES.length?CURRENCIES[n.i].val:0;
      var ok=has>=n.v;
      if(!ok)canCraft=false;
      needStr+='<span style="color:'+(ok?"green":"red")+'">'+CURRENCIES[n.i].ic+Math.floor(has)+'/'+n.v+'</span> ';
    }
    var d=document.createElement("div");
    d.className="craft-recipe"+(canCraft?" ready":"")+(r.done?" done":"");
    d.innerHTML='<div style="flex:1"><b>'+r.name+'</b> — '+needStr+'</div><div class="craft-reward">'+r.desc+'</div>';
    if(canCraft&&!r.done){
      (function(idx){d.onclick=function(){doCraft(idx)}})(i);
    }
    list.appendChild(d);
  }
}
function doCraft(idx){
  var r=RECIPES[idx];if(r.done)return;
  // consume currencies
  for(var j=0;j<r.need.length;j++){
    var n=r.need[j];
    if(CURRENCIES[n.i].val<n.v)return;
  }
  for(var j=0;j<r.need.length;j++){
    CURRENCIES[r.need[j].i].val-=r.need[j].v;
  }
  r.done=true;
  craftBonuses[r.reward]=(craftBonuses[r.reward]||0)+r.amt;
  toast("⚗️ Forged: "+r.name+"!");
  screenShake(2);chromatic();
  if(r.reward==="zorgo"){S.zorgos+=r.amt;S.totalZorgos+=r.amt}
  recalc();render();renderCrafting();
}
setInterval(renderCrafting,2000);

// Hook craft bonuses into recalc - modify engine
var _origRecalc=recalc;
recalc=function(){
  _origRecalc();
  S.pc=Math.floor(S.pc*(1+craftBonuses.pc+craftBonuses.everything));
  S.ps=Math.floor(S.ps*(1+craftBonuses.ps+craftBonuses.everything));
};
