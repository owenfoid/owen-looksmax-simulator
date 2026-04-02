// ============ PRESTIGE SKILL TREE ============
var SKILLS={
  // click path
  c1:{nm:"Iron Fingers",ds:"+50% click",cost:1,req:[],eff:"pc",amt:0.5},
  c2:{nm:"Steel Hands",ds:"+100% click",cost:2,req:["c1"],eff:"pc",amt:1},
  c3:{nm:"Diamond Mew",ds:"+200% click",cost:4,req:["c2"],eff:"pc",amt:2},
  c4:{nm:"Obsidian Touch",ds:"+500% click",cost:8,req:["c3"],eff:"pc",amt:5},
  // passive path
  p1:{nm:"Idle Gains",ds:"+50% passive",cost:1,req:[],eff:"ps",amt:0.5},
  p2:{nm:"Sleep Mewing",ds:"+100% passive",cost:2,req:["p1"],eff:"ps",amt:1},
  p3:{nm:"Dream Mewing",ds:"+200% passive",cost:4,req:["p2"],eff:"ps",amt:2},
  p4:{nm:"Coma Mewing",ds:"+500% passive",cost:8,req:["p3"],eff:"ps",amt:5},
  // weird path
  w1:{nm:"Zorgo Sense",ds:"+50% zorgo spawn",cost:1,req:[],eff:"zorgo",amt:0.5},
  w2:{nm:"Tooth Control",ds:"Teeth growth -50%",cost:2,req:["w1"],eff:"teeth",amt:0.5},
  w3:{nm:"Currency Mastery",ds:"+30% currency mult",cost:3,req:["w2"],eff:"cmult",amt:0.3},
  w4:{nm:"Void Walker",ds:"Agartha danger -30%",cost:5,req:["w3"],eff:"agdanger",amt:0.3},
  // cross paths
  x1:{nm:"Owen's Favor",ds:"+100% everything",cost:10,req:["c3","p3","w3"],eff:"all",amt:1},
};
var skillsBought={};
var _skillPoints=0;
function getSkillPoints(){return Math.max(0,S.prestige-Object.keys(skillsBought).length)}
function canBuySkill(id){
  var s=SKILLS[id];if(!s||skillsBought[id])return false;
  if(getSkillPoints()<s.cost)return false;
  for(var i=0;i<s.req.length;i++)if(!skillsBought[s.req[i]])return false;
  return true;
}
function buySkill(id){
  if(!canBuySkill(id))return;
  skillsBought[id]=true;
  toast("🌳 Skill: "+SKILLS[id].nm);sndAch();screenShake(2);
  recalc();renderSkillTree();
}
function skillMult(type){
  var m=0;
  for(var id in skillsBought){
    if(!skillsBought[id])continue;
    var s=SKILLS[id];
    if(s.eff===type||s.eff==="all")m+=s.amt;
  }
  return m;
}

function renderSkillTree(){
  var el=document.getElementById("skill-tree");if(!el)return;
  var sp=getSkillPoints();
  var h='<div style="font-size:.5rem;margin-bottom:4px">Skill Points: <b>'+sp+'</b> (1 per prestige)</div>';
  h+='<div style="display:flex;gap:8px;flex-wrap:wrap;font-size:.4rem">';
  var paths=[{nm:"⚔️ Click",ids:["c1","c2","c3","c4"]},{nm:"💤 Passive",ids:["p1","p2","p3","p4"]},{nm:"🌀 Weird",ids:["w1","w2","w3","w4"]}];
  for(var pi=0;pi<paths.length;pi++){
    var path=paths[pi];
    h+='<div style="flex:1;min-width:80px"><div style="font-weight:700;margin-bottom:3px">'+path.nm+'</div>';
    for(var si=0;si<path.ids.length;si++){
      var id=path.ids[si];var s=SKILLS[id];var bought=skillsBought[id];var can=canBuySkill(id);
      var bg=bought?"#d0ffd0":can?"#ffffd0":"#f0f0f0";
      var border=bought?"green":can?"orange":"#ccc";
      h+='<div onclick="buySkill(\''+id+'\')" style="padding:3px;margin:2px 0;border:2px solid '+border+';background:'+bg+';cursor:'+(can?"pointer":"default")+'"><b>'+s.nm+'</b><br>'+s.ds+' ('+s.cost+'pt)</div>';
    }
    h+='</div>';
  }
  // cross path
  var xid="x1";var xs=SKILLS[xid];var xbought=skillsBought[xid];var xcan=canBuySkill(xid);
  h+='</div><div onclick="buySkill(\''+xid+'\')" style="margin-top:4px;padding:4px;border:3px solid '+(xbought?"gold":xcan?"orange":"#ccc")+';background:'+(xbought?"#ffffd0":"#f8f8f8")+';text-align:center;font-size:.5rem;cursor:'+(xcan?"pointer":"default")+'"><b>'+xs.nm+'</b> — '+xs.ds+' ('+xs.cost+'pt)</div>';
  el.innerHTML=h;
}

// hook skills into recalc
var _recalcWithSkills=recalc;
recalc=function(){
  _recalcWithSkills();
  S.pc=Math.floor(S.pc*(1+skillMult("pc")));
  S.ps=Math.floor(S.ps*(1+skillMult("ps")));
};

// ============ THE GAME FIGHTS BACK (PSL 8+) ============
setInterval(function(){
  if(psl()<8)return;
  var p=psl();
  // buttons try to dodge
  if(Math.random()<0.01*(p-7)){
    var btns=document.querySelectorAll(".ug:not(.lk)");
    if(btns.length>0){
      var btn=btns[Math.floor(Math.random()*btns.length)];
      btn.style.transform="translateX("+(Math.random()*30-15)+"px)";
      setTimeout(function(){btn.style.transform="none"},500);
    }
  }
  // currency names temporarily change
  if(Math.random()<0.005*(p-7)){
    var cells=document.querySelectorAll(".cur .cur-n");
    if(cells.length>0){
      var cell=cells[Math.floor(Math.random()*cells.length)];
      var orig=cell.textContent;
      var fakes=["???","ERROR","help","teeth","owen","67","run","no","STOP","it sees you","why"];
      cell.textContent=fakes[Math.floor(Math.random()*fakes.length)];
      cell.style.color="red";
      setTimeout(function(){cell.textContent=orig;cell.style.color=""},1500);
    }
  }
  // upgrades rearrange
  if(Math.random()<0.003*(p-7)){
    var ul=document.getElementById("ul");
    if(ul&&ul.children.length>2){
      var kids=Array.from(ul.children);
      for(var i=kids.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));ul.insertBefore(kids[j],kids[i])}
    }
  }
  // click area moves slightly
  if(Math.random()<0.008*(p-7)){
    var ca=document.getElementById("click-area");
    if(ca){
      ca.style.transform="translate("+(Math.random()*20-10)+"px,"+(Math.random()*10-5)+"px)";
      setTimeout(function(){ca.style.transform="none"},800);
    }
  }
},1000);

// ============ CURRENCY TRADING POST ============
var tradeRates={};var _tradeFrom=0;var _tradeTo=1;
function initTradeRates(){
  for(var i=0;i<Math.min(CURRENCIES.length,50);i++){
    tradeRates[i]=0.5+Math.random()*1.5; // exchange rate fluctuates
  }
}
initTradeRates();
// rates fluctuate
setInterval(function(){
  for(var i in tradeRates){
    tradeRates[i]*=(0.95+Math.random()*0.1);
    tradeRates[i]=Math.max(0.1,Math.min(tradeRates[i],3));
  }
  renderTrading();
},5000);

function renderTrading(){
  var el=document.getElementById("trade-area");if(!el)return;
  var p=psl();
  var unlocked=[];
  for(var i=0;i<Math.min(CURRENCIES.length,50);i++){
    if(p>=CURRENCIES[i].unlockPSL)unlocked.push(i);
  }
  if(unlocked.length<2){el.innerHTML="<div style='font-size:.5rem;color:#999'>Need 2+ currencies</div>";return}

  var fromC=CURRENCIES[_tradeFrom]||CURRENCIES[0];
  var toC=CURRENCIES[_tradeTo]||CURRENCIES[1];
  var rate=((tradeRates[_tradeTo]||1)/(tradeRates[_tradeFrom]||1)).toFixed(2);

  var opts="";
  for(var i=0;i<unlocked.length;i++){
    var ci=unlocked[i];
    opts+='<option value="'+ci+'"'+(ci===_tradeFrom?' selected':'')+'>'+CURRENCIES[ci].ic+' '+CURRENCIES[ci].nm+'</option>';
  }
  var opts2="";
  for(var i=0;i<unlocked.length;i++){
    var ci=unlocked[i];
    opts2+='<option value="'+ci+'"'+(ci===_tradeTo?' selected':'')+'>'+CURRENCIES[ci].ic+' '+CURRENCIES[ci].nm+'</option>';
  }

  el.innerHTML='<div style="font-size:.5rem;display:flex;flex-wrap:wrap;gap:4px;align-items:center">'+
    '<select onchange="_tradeFrom=+this.value;renderTrading()" style="font-size:.45rem;max-width:120px">'+opts+'</select>'+
    ' → <select onchange="_tradeTo=+this.value;renderTrading()" style="font-size:.45rem;max-width:120px">'+opts2+'</select>'+
    ' <span style="color:#666">Rate: 1:'+rate+'</span>'+
    ' <button class="casino-btn" onclick="doTrade(10)" style="font-size:.45rem">Trade 10</button>'+
    ' <button class="casino-btn" onclick="doTrade(50)" style="font-size:.45rem">Trade 50</button>'+
    '</div>';
}
function doTrade(amt){
  if(_tradeFrom===_tradeTo){toast("Same currency");return}
  var from=CURRENCIES[_tradeFrom];var to=CURRENCIES[_tradeTo];
  if(!from||!to)return;
  if(from.val<amt){toast("Not enough "+from.nm);return}
  var rate=(tradeRates[_tradeTo]||1)/(tradeRates[_tradeFrom]||1);
  from.val-=amt;
  to.val+=amt*rate;
  toast(from.ic+"-"+amt+" → "+to.ic+"+"+Math.floor(amt*rate));
  sndBuy();renderTrading();
}
setInterval(renderTrading,2000);

// ============ LORE PAGES ============
var LORE=[
  {psl:0,title:"Welcome",text:"You have been chosen to mew. This is not optional."},
  {psl:1,title:"The Mewing Principle",text:"The tongue must remain on the palate. Always. Even in death."},
  {psl:2,title:"On Zorgos",text:"Nobody knows what zorgos are. The first zorgo appeared on March 14th, 2019 at 3:47 AM in a parking lot in Milwaukee. It has not been explained."},
  {psl:3,title:"The Teeth Problem",text:"The human mouth contains 32 teeth. Some mouths contain more. We do not discuss this."},
  {psl:4,title:"Currencies",text:"There are exactly 210 currencies. We did not create them. They were already here when we arrived."},
  {psl:5,title:"Agartha: Field Notes",text:"The tunnel was found at depth 847km. The air smelled like Falim gum. The beings there do not have faces but their jawlines are immaculate."},
  {psl:6,title:"Owen",text:"Owen is not a person. Owen is a concept. Owen is the jawline you see when you close your eyes. Owen has always been here."},
  {psl:7,title:"The Mirror Incident",text:"On day 47, the mirror spoke. It said one word. The word was 'mew.' The mirror has not stopped speaking since. We have covered it with a towel."},
  {psl:8,title:"Suspicion",text:"They are watching. We don't know who 'they' are. The suspicion meter was not added by the developers. It appeared in the code on its own."},
  {psl:9,title:"The Final Entry",text:"If you are reading this, your PSL is above 9. You have gone too far. The zorgos have noticed. Your teeth count is being monitored. The game does not end. The game has never ended. The grind never stops. You look perfect. Close the game."},
];
var _loreRead={};
function renderLore(){
  var el=document.getElementById("lore-area");if(!el)return;
  var p=psl();var h="";
  for(var i=0;i<LORE.length;i++){
    var l=LORE[i];
    if(p<l.psl){h+='<div style="padding:3px;margin:2px 0;border:1px solid #ccc;color:#ccc;font-size:.45rem">🔒 PSL '+l.psl+' required</div>';continue}
    var read=_loreRead[i];
    h+='<div onclick="_loreRead['+i+']=true;renderLore()" style="padding:4px;margin:2px 0;border:1px solid '+(read?"#ccc":"red")+';background:'+(read?"#f8f8f8":"#fff0f0")+';font-size:.45rem;cursor:pointer">';
    h+='<b>'+l.title+'</b>'+(read?'<div style="color:#666;margin-top:2px">'+l.text+'</div>':'<span style="color:red;font-size:.4rem"> (NEW - tap to read)</span>');
    h+='</div>';
  }
  el.innerHTML=h;
}
setInterval(renderLore,3000);

// ============ SNAKE GAME (PSL 9+) ============
var _snakeActive=false;var _snakeCanvas=null;var _snakeCtx=null;
var _snake=[];var _snakeDir={x:1,y:0};var _snakeFood={x:5,y:5};var _snakeScore=0;var _snakeTimer=null;
function initSnake(){
  var el=document.getElementById("snake-area");if(!el)return;
  if(psl()<9){el.innerHTML='<div style="font-size:.5rem;color:#999">PSL 9 required</div>';return}
  if(_snakeActive)return;
  el.innerHTML='<div style="text-align:center"><canvas id="snake-canvas" width="150" height="150" style="border:2px solid #000;background:#000"></canvas><br>'+
    '<div style="font-size:.45rem;margin:2px">Score: <span id="snake-score">0</span> | Swipe or arrow keys</div>'+
    '<button class="casino-btn" onclick="startSnake()">Play Snake</button>'+
    '<div style="font-size:.35rem;color:#888;margin-top:2px">Win 20 = +50 zorgos + currency boost</div></div>';
}
function startSnake(){
  _snakeActive=true;_snakeScore=0;
  _snake=[{x:7,y:7},{x:6,y:7},{x:5,y:7}];
  _snakeDir={x:1,y:0};
  placeFood();
  _snakeCanvas=document.getElementById("snake-canvas");
  if(!_snakeCanvas)return;
  _snakeCtx=_snakeCanvas.getContext("2d");
  if(_snakeTimer)clearInterval(_snakeTimer);
  _snakeTimer=setInterval(snakeTick,150);
}
function placeFood(){_snakeFood={x:Math.floor(Math.random()*15),y:Math.floor(Math.random()*15)}}
function snakeTick(){
  if(!_snakeActive)return;
  var head={x:_snake[0].x+_snakeDir.x,y:_snake[0].y+_snakeDir.y};
  // wrap
  if(head.x<0)head.x=14;if(head.x>14)head.x=0;if(head.y<0)head.y=14;if(head.y>14)head.y=0;
  // self collision
  for(var i=0;i<_snake.length;i++){if(_snake[i].x===head.x&&_snake[i].y===head.y){endSnake();return}}
  _snake.unshift(head);
  if(head.x===_snakeFood.x&&head.y===_snakeFood.y){
    _snakeScore++;sndZorgo();placeFood();
    var sc=document.getElementById("snake-score");if(sc)sc.textContent=_snakeScore;
    if(_snakeScore>=20){winSnake();return}
  }else{_snake.pop()}
  drawSnake();
}
function drawSnake(){
  if(!_snakeCtx)return;var c=_snakeCtx;var s=10;
  c.fillStyle="#000";c.fillRect(0,0,150,150);
  c.fillStyle="#0f0";
  for(var i=0;i<_snake.length;i++)c.fillRect(_snake[i].x*s,_snake[i].y*s,s-1,s-1);
  c.fillStyle="#f00";c.fillRect(_snakeFood.x*s,_snakeFood.y*s,s-1,s-1);
}
function endSnake(){
  _snakeActive=false;clearInterval(_snakeTimer);
  toast("🐍 Snake died! Score: "+_snakeScore);sndDeath();
  // small consolation based on score
  var bonus=_snakeScore*1000;S.pts+=bonus;S.total+=bonus;
  initSnake();
}
function winSnake(){
  _snakeActive=false;clearInterval(_snakeTimer);
  S.zorgos+=50;S.totalZorgos+=50;
  for(var i=0;i<CURRENCIES.length;i++)if(psl()>=CURRENCIES[i].unlockPSL)CURRENCIES[i].val+=25;
  toast("🐍 SNAKE WIN! +50 zorgos + all currencies +25!");sndAch();screenShake(3);chromatic();
  render();initSnake();
}
// snake controls
document.addEventListener("keydown",function(e){
  if(!_snakeActive)return;
  if(e.key==="ArrowUp"&&_snakeDir.y!==1)_snakeDir={x:0,y:-1};
  if(e.key==="ArrowDown"&&_snakeDir.y!==-1)_snakeDir={x:0,y:1};
  if(e.key==="ArrowLeft"&&_snakeDir.x!==1)_snakeDir={x:-1,y:0};
  if(e.key==="ArrowRight"&&_snakeDir.x!==-1)_snakeDir={x:1,y:0};
});
// swipe controls for mobile
var _touchStart=null;
document.addEventListener("touchstart",function(e){
  if(!_snakeActive)return;
  _touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY};
});
document.addEventListener("touchend",function(e){
  if(!_snakeActive||!_touchStart)return;
  var dx=e.changedTouches[0].clientX-_touchStart.x;
  var dy=e.changedTouches[0].clientY-_touchStart.y;
  if(Math.abs(dx)>Math.abs(dy)){
    if(dx>20&&_snakeDir.x!==1)_snakeDir={x:1,y:0};
    if(dx<-20&&_snakeDir.x!==-1)_snakeDir={x:-1,y:0};
  }else{
    if(dy>20&&_snakeDir.y!==1)_snakeDir={x:0,y:1};
    if(dy<-20&&_snakeDir.y!==-1)_snakeDir={x:0,y:-1};
  }
  _touchStart=null;
});

setInterval(function(){if(psl()>=9)initSnake()},5000);


// Initial renders
renderSkillTree();renderTrading();renderLore();initSnake();
setInterval(renderSkillTree,3000);
