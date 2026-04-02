// ============ CLICK ============
document.getElementById("click-area").addEventListener("click",function(e){
  addCombo();var cm=comboMult();var cv=Math.floor(S.pc*cm);
  S.pts+=cv;S.total+=cv;S.clicks++;
  if(goldenActive)claimGolden();
  var p=psl();wobble();screenShake(Math.min(3,Math.floor(p/3)+1));
  if(p>=2)flash("rgba(255,0,0,0.06)");if(p>=4)chromatic();
  particles(e.clientX,e.clientY,Math.min(12,2+Math.floor(p)));
  var c=S.combo>=50?"purple":S.combo>=20?"green":S.combo>=10?"orange":"red";
  floatText(e.clientX,e.clientY,"+"+fmt(cv)+(S.combo>=5?" x"+S.combo:""),c);
  addStim(lerp(2,0.5,p/10));
  if(S.combo>30)addSuspicion(0.1);
  // random currencies get bumped by clicks
  var ri=4+Math.floor(Math.random()*(CURRENCIES.length-4));
  CURRENCIES[ri].val+=(Math.random()-0.3)*0.5;
  checkAch();render();
});
// ============ BUY ============
function buy(id){var u=null;for(var i=0;i<UPG.length;i++)if(UPG[i].id===id){u=UPG[i];break;}if(!u)return;if(u.req&&!u.req())return;if(u.max&&own(u.id)>=u.max)return;var c=cost(u);if(u.type==="zorgo"){if(S.zorgos<c)return;S.zorgos-=c;}else{if(S.pts<c)return;S.pts-=c;}S.upg[id]=(S.upg[id]||0)+1;recalc();screenShake(1);addSuspicion(0.5);checkAch();render();}
// ============ ACHIEVEMENTS ============
function checkAch(){for(var i=0;i<ACH.length;i++){var a=ACH[i];if(!S.ach[a.id]&&a.ck&&a.ck()){S.ach[a.id]=true;toast("🏆 "+a.nm);screenShake(2);chromatic();}}}

// ============ RENDER ============
function render(){
  document.getElementById("s-pts").textContent=fmt(S.pts);
  document.getElementById("s-pc").textContent=fmt(Math.floor(S.pc*comboMult()));
  document.getElementById("s-ps").textContent=fmt(S.ps);
  document.getElementById("s-total").textContent=fmt(S.total+S.totalPrestigeEarnings);
  document.getElementById("s-zorgos").textContent=S.zorgos;
  var p=psl(),rk=getRank(p);
  document.getElementById("psl-fill").style.width=Math.min(100,p/10*100)+"%";
  document.getElementById("psl-num").textContent=p.toFixed(1)+" / 10.0";
  document.getElementById("psl-in").textContent=p.toFixed(1);
  var rl=document.getElementById("rank");rl.textContent=rk.nm;rl.style.color=rk.c;
  document.getElementById("stim-fill").style.width=S.stim+"%";
  document.getElementById("stim-pct").textContent=Math.floor(S.stim)+"%";
  var sf=document.getElementById("stim-fill");if(S.stim>=80)sf.classList.add("maxed");else sf.classList.remove("maxed");
  var ce=document.getElementById("combo-display");if(ce){if(S.combo>=3){ce.style.display="block";ce.textContent=S.combo+"x COMBO (x"+comboMult().toFixed(1)+")";}else ce.style.display="none";}
  var pe=document.getElementById("prestige-btn");if(pe){if(S.total>=PRESTIGE_COST*0.5){pe.style.display="block";if(canPrestige()){pe.classList.remove("lk");pe.innerHTML="PRESTIGE (x"+((S.prestige+1)*PRESTIGE_MULT+1).toFixed(2)+")";}else{pe.classList.add("lk");pe.innerHTML="PRESTIGE (need "+fmt(PRESTIGE_COST)+")";}}else pe.style.display="none";}
  var pi=document.getElementById("prestige-info");if(pi){if(S.prestige>0){pi.style.display="block";pi.textContent="Prestige "+S.prestige+" | x"+prestigeMult().toFixed(2);}else pi.style.display="none";}
  var ge=document.getElementById("golden-indicator");if(ge)ge.style.display=goldenActive?"block":"none";
  // upgrades
  var ul=document.getElementById("ul");ul.innerHTML="";
  for(var i=0;i<UPG.length;i++){var u=UPG[i];if(u.req&&!u.req())continue;if(u.max&&own(u.id)>=u.max)continue;var c=cost(u);var can=u.type==="zorgo"?S.zorgos>=c:S.pts>=c;var d=document.createElement("div");d.className="ug"+(can?"":" lk")+(u.secret?" weird":"");d.setAttribute("data-id",u.id);d.onclick=(function(uid){return function(){buy(uid)}})(u.id);var cc=u.type==="zorgo"?"co zorgo-cost":"co";var cl=u.type==="zorgo"?fmt(c)+" 🟣":fmt(c);d.innerHTML='<div class="ic">'+u.ic+'</div><div class="inf"><div class="nm">'+u.nm+'</div><div class="ds">'+u.ds+'</div></div><div class="rt"><div class="'+cc+'">'+cl+'</div><div class="ow">x'+own(u.id)+'</div></div>';ul.appendChild(d);}
  // achievements
  var ag=document.getElementById("ag");ag.innerHTML="";
  for(var i=0;i<ACH.length;i++){var a=ACH[i];var d=document.createElement("div");d.className="ac"+(S.ach[a.id]?" un":"");d.innerHTML=a.ic+'<div class="tt"><b>'+a.nm+'</b><br>'+a.ds+'</div>';ag.appendChild(d);}
}

// ============ CURRENCIES GRID ============
function renderCurrencies(){
  var grid=document.getElementById("curr-grid");if(!grid)return;
  // only rebuild DOM if needed
  if(grid.children.length!==CURRENCIES.length){
    grid.innerHTML="";
    for(var i=0;i<CURRENCIES.length;i++){
      var d=document.createElement("div");
      d.className="curr-item";d.id="curr-"+i;
      d.innerHTML='<div class="cv" id="cv-'+i+'">0</div><div class="cn">'+CURRENCIES[i].em+" "+CURRENCIES[i].nm+'</div>';
      grid.appendChild(d);
    }
  }
  for(var i=0;i<CURRENCIES.length;i++){
    var c=CURRENCIES[i];
    var el=document.getElementById("cv-"+i);
    if(el){
      var v=c.val;
      if(Math.abs(v)>=1000)el.textContent=fmt(v);
      else if(v%1!==0)el.textContent=v.toFixed(1);
      else el.textContent=Math.floor(v);
      el.style.color=c.color;
    }
    var item=document.getElementById("curr-"+i);
    if(item){
      if(c.rate>0)item.className="curr-item pos";
      else if(c.rate<0)item.className="curr-item neg";
      else if(c.val===0)item.className="curr-item zero";
      else item.className="curr-item";
    }
  }
}

// ============ ANIMATION ============
function animate(ts){
  try{
  var time=ts/1000;tickCombo();
  if(typeof micActive!=='undefined'&&micActive){drawBird(time);}
  else{drawFace(psl()/10,time);stimIntensity=lerp(stimIntensity,S.stim/100,0.1);if(emote67Active){emote67Timer+=0.012;if(emote67Timer>=1){emote67Active=false;emote67Timer=0;}}}
  }catch(e){}
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// ============ TICKS ============
setInterval(function(){
  if(S.ps>0){S.pts+=S.ps/10;S.total+=S.ps/10;addStim(0.05);}
  if(Math.random()<GOLDEN_CHANCE&&S.total>100)spawnGolden();
  teethTick();tickCurrencies();
  if(S.suspicion>0)S.suspicion=Math.max(0,S.suspicion-0.02);
  if(psl()>=6&&Math.random()<0.0005)addSuspicion(5+Math.random()*10);
  checkAch();render();
},100);
// currencies visual update (slower to save perf)
setInterval(renderCurrencies,500);
// stim decay
setInterval(function(){if(S.stim>0){S.stim=Math.max(0,S.stim-0.3);document.getElementById("stim-fill").style.width=S.stim+"%";document.getElementById("stim-pct").textContent=Math.floor(S.stim)+"%";}},200);
setInterval(function(){tickCombo();var c=document.getElementById("combo-display");if(c&&S.combo<3)c.style.display="none";},100);
// zorgos
setInterval(function(){if(S.total<500)return;if(Math.random()<0.08)spawnZorgo();if(Math.random()<0.008&&S.totalZorgos>5)spawnNegZorgo();},3000);
// events
setInterval(function(){if(Math.random()<0.15&&S.total>50){var ev=getEvent();log("EVENT: "+ev,true);toast(ev);screenShake(1);}},12000);

// ============ CHAOS ============
function pushNotif(m){var s=document.getElementById("notif-stack");if(!s)return;var d=document.createElement("div");d.className="notif";d.textContent=m;s.appendChild(d);if(s.children.length>10)s.firstChild.remove();setTimeout(function(){if(d.parentNode)d.remove()},2500);}
function randomPopup(){
  var msgs=[{t:"Alert",m:"Mewing form logged."},{t:"Zorgo",m:"Zorgo near you."},{t:"Tip",m:"Bonesmashing invented in Agartha."},{t:"Warning",m:"Teeth count high."},{t:"Owen",m:"Don't look behind you."},{t:"Help",m:"Need help? Too bad."},{t:"Privacy",m:"The zorgos collect data."},{t:"???",m:"🟣"},{t:"Owen",m:"Owen is typing..."},{t:"Owen",m:"Owen stopped typing."},{t:"Error",m:"Backup face loaded."},{t:"Fact",m:"Zorgos have no mass."}];
  var p=msgs[Math.floor(Math.random()*msgs.length)];var el=document.createElement("div");el.className="popup";
  el.innerHTML='<div class="popup-close" onclick="this.parentNode.remove()">X</div><div class="popup-title">'+p.t+'</div>'+p.m;
  el.style.left=(5+Math.random()*60)+"%";el.style.top=(10+Math.random()*60)+"%";el.onclick=function(){this.remove()};
  document.body.appendChild(el);setTimeout(function(){if(el.parentNode)el.remove()},6000);
}
function dropEmoji(){var es=["🗿","🦷","🟣","👅","💀","🔮","⚠️","👁️","❓","🫠","👹","♾️"];var el=document.createElement("div");el.className="falling-emoji";el.textContent=es[Math.floor(Math.random()*es.length)];el.style.left=Math.random()*95+"%";el.style.setProperty("--dur",(2+Math.random()*3)+"s");document.body.appendChild(el);setTimeout(function(){if(el.parentNode)el.remove()},5000);}

var chaosRate=isMobile?0.7:1;
var NOTIFS=["🟣 zorgo","🦷 tooth","👁️ watching","⚠️ wet floor","🗿 mew","owen posted","❓","67","mew","owen online","owen offline","teeth update","zorgo escaped","PSL trending","mirror saw you","incoming zorgo","cold shower reminder","reflection blinked","zorgo market: up","zorgo market: crashed","screenshot detected"];
setInterval(function(){
  var p=psl();
  if(p>=1&&Math.random()<0.05*Math.min(5,p/2)*chaosRate)randomPopup();
  if(p>=0.5&&Math.random()<0.08*Math.min(6,p/2)*chaosRate)pushNotif(NOTIFS[Math.floor(Math.random()*NOTIFS.length)]);
  if(p>=2&&Math.random()<0.05*Math.min(isMobile?4:8,p/2)*chaosRate)dropEmoji();
  if(p>=4&&Math.random()<0.01*chaosRate){var t=document.getElementById("chroma-wrap");if(t){var flt=["invert(1)","hue-rotate("+Math.floor(Math.random()*360)+"deg)","blur(2px)"];t.style.filter=flt[Math.floor(Math.random()*flt.length)];setTimeout(function(){t.style.filter="none"},200);}}
  if(Math.random()<0.01){var titles=["Owen Looksmax Simulator","(1) new zorgo","stop playing","🟣🟣🟣","are you still here","200 currencies"];document.title=titles[Math.floor(Math.random()*titles.length)]}
  if(Math.random()<0.002){var ad=document.getElementById("fake-ad");if(ad)ad.style.display="block"}
  // random currency spike
  if(p>=2&&Math.random()<0.02){var ri=4+Math.floor(Math.random()*(CURRENCIES.length-4));CURRENCIES[ri].val+=(Math.random()-0.5)*10;}
},1000);

// fake players
setInterval(function(){if(psl()>=2&&Math.random()<0.02*chaosRate){var names=["xX_MewGod_Xx","jawline_jake","zorgo99","bonesmash_barry","agartha_andy","teeth_guy","owen_fan"];var acts=["reached PSL "+((Math.random()*4+3).toFixed(1)),"collected a zorgo","lost "+Math.floor(Math.random()*5+1)+" teeth","prestiged","was noticed (-10%)"];pushNotif("👤 "+names[Math.floor(Math.random()*names.length)]+" "+acts[Math.floor(Math.random()*acts.length)]);}},4000);
// ghost text
setInterval(function(){if(psl()>=4&&Math.random()<0.02*chaosRate)log(["...","help","67 67 67","the zorgos","don't look","the grind"][Math.floor(Math.random()*6)],Math.random()<0.5);},4000);

document.getElementById("visitor-count").textContent=Math.floor(1000+Math.random()*90000);
setTimeout(function(){pushNotif("welcome back. the zorgos missed you.")},1500);
setTimeout(function(){pushNotif("200 currencies active.")},3000);

// ============ INIT ============
load();render();renderCurrencies();
setInterval(save,10000);
window.addEventListener("beforeunload",save);
