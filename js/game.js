document.getElementById("click-area").addEventListener("click",function(e){
  addCombo();var cm=comboMult();var cv=Math.floor(S.pc*cm);
  S.pts+=cv;S.total+=cv;S.clicks++;clickCurrencies();
  if(goldenActive)claimGolden();
  var p=psl();wobble();screenShake(Math.min(3,Math.floor(p/3)+1));
  if(p>=2)flash("rgba(0,0,255,0.06)");if(p>=4)chromatic();
  particles(e.clientX,e.clientY,Math.min(12,2+Math.floor(p)));
  var c=S.combo>=50?"purple":S.combo>=20?"blue":"red";
  floatText(e.clientX,e.clientY,"+"+fmt(cv)+(S.combo>=5?" x"+S.combo:""),c);
  addStim(lerp(2,0.5,p/10));if(S.combo>30)addSuspicion(0.1);checkAch();render();
});
function buy(id){var u=null;for(var i=0;i<UPG.length;i++)if(UPG[i].id===id){u=UPG[i];break}if(!u)return;if(u.max&&own(u.id)>=u.max)return;var c=cost(u);if(u.type==="zorgo"){if(S.zorgos<c)return;S.zorgos-=c}else{if(S.pts<c)return;S.pts-=c}S.upg[id]=(S.upg[id]||0)+1;recalc();screenShake(1);addSuspicion(0.5);checkAch();render()}
function checkAch(){for(var i=0;i<ACH.length;i++){var a=ACH[i];if(!S.ach[a.id]&&a.ck&&a.ck()){S.ach[a.id]=true;toast("\u{1F3C6} "+a.nm);screenShake(2);chromatic()}}}
function render(){
  document.getElementById("s-pts").textContent=fmt(S.pts);
  document.getElementById("s-pc").textContent=fmt(Math.floor(S.pc*comboMult()));
  document.getElementById("s-ps").textContent=fmt(S.ps);
  document.getElementById("s-total").textContent=fmt(S.total+S.totalPrestigeEarnings);
  document.getElementById("s-zorgos").textContent=S.zorgos;
  var cm=currencyMult();var cme=document.getElementById("s-cmult");if(cme){cme.textContent=cm.toFixed(1)+"x";cme.style.color=cm>=2?"green":cm<1?"red":"#666"}
  var crd=document.getElementById("crit-display");var crs=document.getElementById("s-crit");if(crd&&crs){if(critCurrency>=0){crd.style.display="block";crs.textContent=CURRENCIES[critCurrency].ic+" "+Math.floor(critTimer/10)+"s"}else{crd.style.display="none"}}
  var td=document.getElementById("teeth-display");
  if(td){if(psl()>=5||S.teeth>32){td.style.display="block";document.getElementById("s-teeth").textContent=S.teeth}else td.style.display="none"}
  var p=psl(),rk=getRank(p);
  document.getElementById("psl-fill").style.width=Math.min(100,p/10*100)+"%";
  document.getElementById("psl-num").textContent=p.toFixed(1)+" / 10.0";
  document.getElementById("psl-in").textContent=p.toFixed(1);
  var rl=document.getElementById("rank");rl.textContent=rk.nm;rl.style.color=rk.c;
  document.getElementById("stim-fill").style.width=S.stim+"%";
  document.getElementById("stim-pct").textContent=Math.floor(S.stim)+"%";
  var sf=document.getElementById("stim-fill");if(S.stim>=80)sf.classList.add("maxed");else sf.classList.remove("maxed");
  var ce=document.getElementById("combo-display");
  if(ce){if(S.combo>=3){ce.style.display="block";ce.textContent=S.combo+"x COMBO";}else ce.style.display="none"}
  var pe=document.getElementById("prestige-btn");
  if(pe){if(S.total>=PRESTIGE_COST*0.5){pe.style.display="block";if(canPrestige())pe.innerHTML="PRESTIGE (x"+((S.prestige+1)*PRESTIGE_MULT+1).toFixed(2)+")";else pe.innerHTML="PRESTIGE (need "+fmt(PRESTIGE_COST)+")";}else pe.style.display="none"}
  var pi=document.getElementById("prestige-info");
  if(pi){if(S.prestige>0){pi.style.display="block";pi.textContent="Prestige "+S.prestige+" | x"+prestigeMult().toFixed(2)}else pi.style.display="none"}
  var ge=document.getElementById("golden-indicator");if(ge)ge.style.display=goldenActive?"block":"none";
  var ul=document.getElementById("ul");ul.innerHTML="";
  for(var i=0;i<UPG.length;i++){var u=UPG[i];var c=cost(u);var can=u.type==="zorgo"?S.zorgos>=c:S.pts>=c;var d=document.createElement("div");d.className="ug"+(can?"":" lk")+(u.secret?" weird":"");d.setAttribute("data-id",u.id);d.onclick=(function(id){return function(){buy(id)}})(u.id);var cc=u.type==="zorgo"?"co zorgo-cost":"co";var cl=u.type==="zorgo"?fmt(c)+" \u{1F7E3}":fmt(c);d.innerHTML='<div class="ic">'+u.ic+'</div><div class="inf"><div class="nm">'+u.nm+'</div><div class="ds">'+u.ds+'</div></div><div class="rt"><div class="'+cc+'">'+cl+'</div><div class="ow">x'+own(u.id)+'</div></div>';ul.appendChild(d)}
  var ag=document.getElementById("ag");ag.innerHTML="";
  for(var i=0;i<ACH.length;i++){var a=ACH[i];var d=document.createElement("div");d.className="ac"+(S.ach[a.id]?" un":"");d.innerHTML=a.ic+'<div class="tt"><b>'+a.nm+'</b><br>'+a.ds+'</div>';ag.appendChild(d)}
}
var curGridEl=document.getElementById("cur-grid");var _curCells=[];
function initCurrencyGrid(){if(!curGridEl)return;curGridEl.innerHTML="";for(var i=0;i<CURRENCIES.length;i++){var c=CURRENCIES[i];var d=document.createElement("div");d.className="cur";d.innerHTML='<div class="cur-ic">'+c.ic+'</div><div class="cur-v" style="color:'+c.col+'">0</div><div class="cur-n">'+c.nm+'</div>';curGridEl.appendChild(d);_curCells.push(d.querySelector(".cur-v"))}}
var _lastUnlocked=0;
function renderCurrencies(){var p=psl();var unlocked=0;for(var i=0;i<CURRENCIES.length;i++){if(!_curCells[i])continue;var c=CURRENCIES[i];var el=_curCells[i];var par=el.parentNode;if(p<c.unlockPSL){if(par)par.style.display="none"}else{unlocked++;if(par)par.style.display="";el.textContent=c.val>=1000?fmt(c.val):c.val.toFixed(1);el.style.color=c.col;
if(par){
  if(i===critCurrency){par.style.borderColor="red";par.style.background="#ffe0e0"}
  else if(i%10===0){par.style.borderColor="green";par.style.background="#e0ffe0"}
  else if(i%17===3&&c.val>80){par.style.borderColor="red";par.style.background="#fff0f0"}
  else if(i%23===5&&c.val>50){par.style.borderColor="blue";par.style.background="#e0e0ff"}
  else{par.style.borderColor="#ccc";par.style.background="#fff"}
}}}
if(unlocked>_lastUnlocked&&_lastUnlocked>0){toast("📊 +"+(unlocked-_lastUnlocked)+" new currencies unlocked!");screenShake(2);for(var j=0;j<5;j++)dropEmoji()}
_lastUnlocked=unlocked;
var hdr=document.querySelector(".curr-grid")&&document.querySelector(".curr-grid").previousElementSibling;if(hdr&&hdr.classList.contains("pt"))hdr.textContent="CURRENCIES ("+unlocked+"/"+CURRENCIES.length+")"}
function animate(ts){try{var time=ts/1000;tickCombo();if(typeof micActive!=='undefined'&&micActive){drawBird(time)}else{drawFace(psl()/10,time);stimIntensity=lerp(stimIntensity,S.stim/100,0.1);if(emote67Active){emote67Timer+=0.012;if(emote67Timer>=1){emote67Active=false;emote67Timer=0}}}}catch(e){}requestAnimationFrame(animate)}
requestAnimationFrame(animate);
var _lastTick=Date.now();
setInterval(function(){var now=Date.now();var dt=(now-_lastTick)/1000;_lastTick=now;if(S.ps>0){S.pts+=S.ps*dt*0.1;S.total+=S.ps*dt*0.1;addStim(0.05*(1+own("sboost")))}if(Math.random()<GOLDEN_CHANCE&&S.total>100)spawnGolden();teethTick();
// trap effects
if(own("trap1")>0)addSuspicion(0.05*own("trap1")*dt);
if(own("trap2")>0&&Math.random()<0.01*own("trap2")){var ri=Math.floor(Math.random()*CURRENCIES.length);if(psl()>=CURRENCIES[ri].unlockPSL)CURRENCIES[ri].val=Math.max(0,CURRENCIES[ri].val-1)}
if(own("trap3")>0&&Math.random()<0.001*own("trap3")){S.teeth=Math.max(28,S.teeth-1);toast("-1 tooth (sukuna)")}
if(own("trap5")>0){S.suspicion=Math.max(S.suspicion,S.suspicion)} // no decay handled below
if(S.suspicion>0&&own("trap5")<1)S.suspicion=Math.max(0,S.suspicion-0.02);
// currency boosters
for(var ui=0;ui<UPG.length;ui++){var u=UPG[ui];if(u.currBoost&&own(u.id)>0){var ci=u.currBoost.idx;if(ci<CURRENCIES.length)CURRENCIES[ci].val+=u.currBoost.rate*own(u.id)*dt}}
// void peer: all currencies x1.5 (already bought = permanent)
if(own("wvoid")>=1&&Math.random()<0.01){for(var i=0;i<CURRENCIES.length;i++)if(psl()>=CURRENCIES[i].unlockPSL)CURRENCIES[i].val*=1.001}
tickCurrencies(dt);currencyTax();currencyInteract();currencyCrisis();recalc();checkAch();render();renderCurrencies()},100);
setInterval(function(){if(S.stim>0){S.stim=Math.max(0,S.stim-0.3)}},200);
setInterval(function(){tickCombo()},100);
setInterval(function(){if(S.total<500)return;var zRate=0.08*(1+own('zspeed'));if(Math.random()<zRate)spawnZorgo();var nzRate=0.008*(1+own('trap4')*2);if(Math.random()<nzRate&&S.totalZorgos>5)spawnNegZorgo()},3000);
setInterval(function(){if(Math.random()<0.15&&S.total>50){toast(getEvent());screenShake(1)}},12000);
var chaosRate=isMobile?0.7:1;
function pushNotif(msg){var s=document.getElementById("notif-stack");if(!s)return;var d=document.createElement("div");d.className="notif";d.textContent=msg;s.appendChild(d);if(s.children.length>10)s.firstChild.remove();setTimeout(function(){if(d.parentNode)d.remove()},2500)}
function dropEmoji(){var e=["\u{1F5FF}","\u{1F9B7}","\u{1F7E3}","\u{1F480}","\u{1F52E}","\u{26A0}","\u{1F441}","\u{2753}"];var el=document.createElement("div");el.className="falling-emoji";el.textContent=e[Math.floor(Math.random()*e.length)];el.style.left=Math.random()*95+"%";el.style.setProperty("--dur",(2+Math.random()*3)+"s");document.body.appendChild(el);setTimeout(function(){if(el.parentNode)el.remove()},5000)}
setInterval(function(){var p=psl();if(p>=0.5&&Math.random()<0.06*Math.min(6,p/2)*chaosRate){var ms=["zorgo","tooth","watching","wet floor","mew","owen posted","67","mew mew","trending","owen online","teeth update","signal lost"];pushNotif(ms[Math.floor(Math.random()*ms.length)])}if(p>=2&&Math.random()<0.04*Math.min(isMobile?4:8,p/2)*chaosRate)dropEmoji();if(p>=4&&Math.random()<0.01*chaosRate){var t=document.getElementById("chroma-wrap")||document.body;var r=Math.random();if(r<0.3){t.style.filter="invert(1)";setTimeout(function(){t.style.filter="none"},150)}else if(r<0.6){t.style.filter="hue-rotate("+Math.floor(Math.random()*360)+"deg)";setTimeout(function(){t.style.filter="none"},300)}else{t.style.filter="blur(2px)";setTimeout(function(){t.style.filter="none"},100)}}},1000);
setInterval(function(){if(psl()>=4&&Math.random()<0.15)spawnZorgo();if(psl()>=7&&Math.random()<0.03)spawnNegZorgo()},2000);
var vc=document.getElementById("visitor-count");if(vc)vc.textContent=Math.floor(1000+Math.random()*90000);
load();initCurrencyGrid();render();renderCurrencies();
setInterval(save,10000);window.addEventListener("beforeunload",save);
setTimeout(function(){pushNotif("210 currencies active.")},2000);

// ============ SECRET ADMIN PANEL ============
var _adminCode="";var _adminOpen=false;
document.addEventListener("keydown",function(e){
  _adminCode+=e.key;if(_adminCode.length>10)_adminCode=_adminCode.slice(-10);
  if(_adminCode.includes("owen67")){_adminCode="";toggleAdmin()}
});
// mobile: tap title 5 times fast
var _titleTaps=0;var _titleTimer=0;
document.querySelector("header h1").addEventListener("click",function(){
  _titleTaps++;clearTimeout(_titleTimer);
  _titleTimer=setTimeout(function(){_titleTaps=0},2000);
  if(_titleTaps>=5){_titleTaps=0;toggleAdmin()}
});

function toggleAdmin(){
  _adminOpen=!_adminOpen;
  var p=document.getElementById("admin-panel");
  if(p){p.style.display=_adminOpen?"block":"none";return}
  p=document.createElement("div");p.id="admin-panel";
  p.style.cssText="position:fixed;bottom:0;left:0;right:0;background:#111;color:#0f0;padding:8px;z-index:9999;font-size:11px;font-family:monospace;max-height:50vh;overflow-y:auto;border-top:2px solid #0f0";
  p.innerHTML='<div style="display:flex;flex-wrap:wrap;gap:4px">'+
    btn("1M pts",function(){S.pts+=1e6;S.total+=1e6;recalc();render()})+
    btn("1B pts",function(){S.pts+=1e9;S.total+=1e9;recalc();render()})+
    btn("1T pts",function(){S.pts+=1e12;S.total+=1e12;recalc();render()})+
    btn("+10 zorgos",function(){S.zorgos+=10;S.totalZorgos+=10;render()})+
    btn("+100 zorgos",function(){S.zorgos+=100;S.totalZorgos+=100;render()})+
    btn("PSL 3",function(){S.total=1e3;S.totalPrestigeEarnings=0;recalc();render()})+
    btn("PSL 5",function(){S.total=1e5;S.totalPrestigeEarnings=0;recalc();render()})+
    btn("PSL 7",function(){S.total=1e7;S.totalPrestigeEarnings=0;recalc();render()})+
    btn("PSL 9",function(){S.total=1e9;S.totalPrestigeEarnings=0;recalc();render()})+
    btn("PSL 9.9",function(){S.total=8e9;S.totalPrestigeEarnings=0;recalc();render()})+
    btn("50 teeth",function(){S.teeth=50;render()})+
    btn("80 teeth",function(){S.teeth=80;render()})+
    btn("Max stim",function(){S.stim=99;render()})+
    btn("50 sus",function(){S.suspicion=50;render()})+
    btn("100 clicks",function(){S.clicks+=100;render()})+
    btn("1K clicks",function(){S.clicks+=1000;render()})+
    btn("+1 prestige",function(){S.prestige++;recalc();render()})+
    btn("All curr +50",function(){for(var i=0;i<CURRENCIES.length;i++)if(psl()>=CURRENCIES[i].unlockPSL)CURRENCIES[i].val+=50;renderCurrencies()})+
    btn("All curr 0",function(){for(var i=0;i<CURRENCIES.length;i++)CURRENCIES[i].val=0;renderCurrencies()})+
    btn("Trigger crisis",function(){critCurrency=-1;currencyCrisis();currencyCrisis();currencyCrisis()})+
    btn("Spawn zorgo",function(){spawnZorgo()})+
    btn("Spawn golden",function(){spawnGolden()})+
    btn("Force save",function(){save();toast("saved")})+
    btn("RESET ALL",function(){if(confirm("Reset everything?")){localStorage.removeItem(SAVE_KEY);location.reload()}})+
    btn("Close",function(){toggleAdmin()})+
  '</div>';
  document.body.appendChild(p);
}
function btn(label,fn){return '<button onclick="void(0)" style="padding:4px 8px;background:#222;color:#0f0;border:1px solid #0f0;font-size:10px;font-family:monospace;cursor:pointer">'+label+'</button>'}
// need to attach handlers after creation, so use event delegation
document.addEventListener("click",function(e){
  if(!e.target.matches||!e.target.matches("#admin-panel button"))return;
  var btns=document.querySelectorAll("#admin-panel button");
  var fns=[
    function(){S.pts+=1e6;S.total+=1e6;recalc();render()},
    function(){S.pts+=1e9;S.total+=1e9;recalc();render()},
    function(){S.pts+=1e12;S.total+=1e12;recalc();render()},
    function(){S.zorgos+=10;S.totalZorgos+=10;render()},
    function(){S.zorgos+=100;S.totalZorgos+=100;render()},
    function(){S.total=1e3;S.totalPrestigeEarnings=0;recalc();render()},
    function(){S.total=1e5;S.totalPrestigeEarnings=0;recalc();render()},
    function(){S.total=1e7;S.totalPrestigeEarnings=0;recalc();render()},
    function(){S.total=1e9;S.totalPrestigeEarnings=0;recalc();render()},
    function(){S.total=8e9;S.totalPrestigeEarnings=0;recalc();render()},
    function(){S.teeth=50;render()},
    function(){S.teeth=80;render()},
    function(){S.stim=99;render()},
    function(){S.suspicion=50;render()},
    function(){S.clicks+=100;render()},
    function(){S.clicks+=1000;render()},
    function(){S.prestige++;recalc();render()},
    function(){for(var i=0;i<CURRENCIES.length;i++)if(psl()>=CURRENCIES[i].unlockPSL)CURRENCIES[i].val+=50;renderCurrencies()},
    function(){for(var i=0;i<CURRENCIES.length;i++)CURRENCIES[i].val=0;renderCurrencies()},
    function(){critCurrency=-1;for(var j=0;j<20;j++){if(critCurrency>=0)break;currencyCrisis()}},
    function(){spawnZorgo()},
    function(){spawnGolden()},
    function(){save();toast("saved")},
    function(){if(confirm("Reset everything?")){localStorage.removeItem(SAVE_KEY);location.reload()}},
    function(){toggleAdmin()},
  ];
  for(var i=0;i<btns.length;i++){if(btns[i]===e.target&&fns[i]){fns[i]();break}}
});
