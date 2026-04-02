// ============ SOUND EFFECTS (Web Audio) ============
var _audioCtx=null;
function getAudio(){if(!_audioCtx)try{_audioCtx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}return _audioCtx}
function playTone(freq,dur,type,vol){
  var ctx=getAudio();if(!ctx)return;
  var o=ctx.createOscillator();var g=ctx.createGain();
  o.type=type||"square";o.frequency.value=freq;
  g.gain.value=vol||0.08;g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+(dur||0.1));
  o.connect(g);g.connect(ctx.destination);o.start();o.stop(ctx.currentTime+(dur||0.1));
}
function sndClick(){playTone(800+Math.random()*400,0.03,"square",0.05)}
function sndBuy(){playTone(600,0.05,"square",0.06);setTimeout(function(){playTone(900,0.05,"square",0.06)},50)}
function sndAch(){playTone(523,0.1,"sine",0.08);setTimeout(function(){playTone(659,0.1,"sine",0.08)},100);setTimeout(function(){playTone(784,0.15,"sine",0.08)},200)}
function sndGolden(){playTone(1047,0.08,"sine",0.1);setTimeout(function(){playTone(1319,0.08,"sine",0.1)},80);setTimeout(function(){playTone(1568,0.15,"sine",0.1)},160)}
function sndBoss(){playTone(150,0.2,"sawtooth",0.1);setTimeout(function(){playTone(100,0.3,"sawtooth",0.1)},200)}
function sndCasino(){for(var i=0;i<8;i++)setTimeout(function(){playTone(400+Math.random()*800,0.04,"square",0.04)},i*60)}
function sndDeath(){playTone(400,0.1,"sawtooth",0.08);setTimeout(function(){playTone(300,0.1,"sawtooth",0.08)},100);setTimeout(function(){playTone(200,0.2,"sawtooth",0.08)},200)}
function sndZorgo(){playTone(1200,0.05,"sine",0.06);setTimeout(function(){playTone(1600,0.08,"sine",0.06)},50)}

// Hook sounds into existing functions
var _origToast=toast;
toast=function(m){
  _origToast(m);
  if(m.indexOf("GOLDEN")>=0)sndGolden();
  else if(m.indexOf("JACKPOT")>=0){sndCasino();sndGolden()}
  else if(m.indexOf("VICTORY")>=0)sndAch();
  else if(m.indexOf("DIED")>=0||m.indexOf("NOTICED")>=0||m.indexOf("lost")>=0)sndDeath();
  else if(m.indexOf("Zorgo")>=0||m.indexOf("zorgo")>=0)sndZorgo();
  else if(m.indexOf("CHALLENGER")>=0)sndBoss();
  else if(m.indexOf("🏆")>=0)sndAch();
};
// click sound
document.getElementById("click-area").addEventListener("click",function(){sndClick()});

// ============ FAKE MULTIPLAYER CHAT ============
var CHAT_NAMES=["xX_MewGod_Xx","jawline_jake","zorgo99","bonesmash_barry","agartha_andy","teeth_guy","owen_fan","coldshower_chris","PSL_enjoyer","sukuna_simp","gigachad42","normie_ned","foid_slayer","gymcel_greg","canthal_carl","mirror_mike","stim_lord","combo_king","prestige_pete","hollow_hank"];
var CHAT_MSGS=[
  "just hit PSL {psl}","anyone else's teeth growing?","how do i stop the teeth","ZORGO CASINO IS RIGGED",
  "casino is rigged but i keep playing","just lost 50 zorgos lol","bro my suspicion is at {sus}",
  "the mirror spoke to me","this game is weird","why are there 200 currencies",
  "how do u get to agartha","floor 7 is impossible","BONESMASH BONESMASH BONESMASH",
  "owen if ur reading this hi","what are zorgos","nobody knows what zorgos are",
  "my Red Shards keep going down","who designed this game","teeth: {teeth}",
  "just prestiged for the {pr}th time","combo x{combo} lets go","PSL {psl} gang",
  "the currencies are watching me","i have {z} zorgos","cold shower streak: 47 days",
  "dealt with sukuna worst decision","DO NOT buy mystery supplement","wet floor sign does nothing right? RIGHT?",
  "i forged crimson forge its insane","boss fight just took 30% of my points","has anyone beat agartha",
  "floor 10 of agartha is just mirrors","help","67","mew","mew mew mew",
  "lol imagine not having 50 teeth","the void peer upgrade breaks ur screen","Become Owen costs HOW MUCH",
  "why is everything purple","is owen real","i can hear mewing from inside the walls",
];
function genChatMsg(){
  var msg=CHAT_MSGS[Math.floor(Math.random()*CHAT_MSGS.length)];
  msg=msg.replace("{psl}",(Math.random()*8+1).toFixed(1));
  msg=msg.replace("{sus}",Math.floor(Math.random()*80+10));
  msg=msg.replace("{teeth}",Math.floor(Math.random()*30+32));
  msg=msg.replace("{pr}",Math.floor(Math.random()*8+1));
  msg=msg.replace("{combo}",Math.floor(Math.random()*40+5));
  msg=msg.replace("{z}",Math.floor(Math.random()*50+1));
  return msg;
}
function addChatMsg(name,msg,color){
  var box=document.getElementById("chat-box");if(!box)return;
  var d=document.createElement("div");d.className="chat-msg";
  d.innerHTML='<span class="chat-name" style="color:'+(color||"#0f0")+'">'+name+':</span> '+msg;
  box.appendChild(d);
  if(box.children.length>50)box.firstChild.remove();
  box.scrollTop=box.scrollHeight;
}
function sendChat(){
  var input=document.getElementById("chat-in");if(!input)return;
  var msg=input.value.trim();if(!msg)return;
  input.value="";
  addChatMsg("You",msg,"#ff0");
  // check for secret codes
  checkCode(msg.toLowerCase());
  // fake response sometimes
  if(Math.random()<0.4){
    setTimeout(function(){
      var name=CHAT_NAMES[Math.floor(Math.random()*CHAT_NAMES.length)];
      var responses=["lol","nice","based","what","mew","bro what","ok","real","67","cope","true"];
      addChatMsg(name,responses[Math.floor(Math.random()*responses.length)]);
    },1000+Math.random()*3000);
  }
}
document.getElementById("chat-in").addEventListener("keydown",function(e){if(e.key==="Enter")sendChat()});
// auto chat messages
setInterval(function(){
  if(Math.random()<0.06){
    addChatMsg(CHAT_NAMES[Math.floor(Math.random()*CHAT_NAMES.length)],genChatMsg());
  }
},3000);
// join/leave messages
setInterval(function(){
  if(Math.random()<0.02){
    var name=CHAT_NAMES[Math.floor(Math.random()*CHAT_NAMES.length)];
    addChatMsg("SYSTEM",name+(Math.random()<0.5?" joined":" left"),"#888");
  }
},8000);
setTimeout(function(){addChatMsg("SYSTEM","Welcome to Owen Looksmax Simulator Global Chat","#888")},1000);
setTimeout(function(){addChatMsg("SYSTEM",Math.floor(50+Math.random()*200)+" players online","#888")},2000);

// ============ SECRET CODES ============
function checkCode(code){
  if(code==="owen"){S.pts+=10000;S.total+=10000;toast("🗿 OWEN CODE: +10K");sndAch();addChatMsg("SYSTEM","Secret code activated!","#ff0")}
  else if(code==="zorgo"){for(var i=0;i<5;i++)setTimeout(spawnZorgo,i*300);addChatMsg("SYSTEM","ZORGO SWARM!","purple")}
  else if(code==="67"){if(typeof emote67Active!=="undefined"){emote67Active=true;emote67Timer=0}toast("6️⃣7️⃣");addChatMsg("SYSTEM","67.","#f00")}
  else if(code==="agartha"){for(var i=0;i<CURRENCIES.length;i++)if(psl()>=CURRENCIES[i].unlockPSL)CURRENCIES[i].val+=10;toast("🕳️ All currencies +10");addChatMsg("SYSTEM","Agartha signal received","purple")}
  else if(code==="teeth"){S.teeth+=5;toast("🦷 +5 teeth (why)");addChatMsg("SYSTEM","Teeth granted.","red")}
  else if(code==="grind"){S.pts+=S.ps*60;S.total+=S.ps*60;toast("1 minute of passive income!");addChatMsg("SYSTEM","The grind.","#0f0")}
  else if(code==="casino"){S.zorgos+=10;S.totalZorgos+=10;toast("🎰 +10 zorgos for the casino");addChatMsg("SYSTEM","Casino funds deposited","#ff0")}
  else if(code==="mirror"){toast("🪞 The mirror saw you type that.");screenShake(3);addChatMsg("SYSTEM","...","red")}
  render();
}
// also check typed codes on keyboard (outside chat)
var _codeBuffer="";
document.addEventListener("keydown",function(e){
  if(document.activeElement&&document.activeElement.tagName==="INPUT")return;
  _codeBuffer+=e.key.toLowerCase();if(_codeBuffer.length>20)_codeBuffer=_codeBuffer.slice(-20);
  if(_codeBuffer.includes("owen")){_codeBuffer="";checkCode("owen")}
  else if(_codeBuffer.includes("zorgo")){_codeBuffer="";checkCode("zorgo")}
  else if(_codeBuffer.includes("67")){_codeBuffer="";checkCode("67")}
  else if(_codeBuffer.includes("grind")){_codeBuffer="";checkCode("grind")}
  else if(_codeBuffer.includes("mirror")){_codeBuffer="";checkCode("mirror")}
});

// ============ STATISTICS ============
var _gameStart=Date.now();var _bossWins=0;var _bossLosses=0;var _casinoWins=0;var _casinoLosses=0;var _agarthaRuns=0;var _agarthaDeaths=0;var _agarthaBest=0;
// hook boss/casino/agartha tracking
var _origBossAtk=bossAttack;
bossAttack=function(){
  var wasDead=bossHP<=0;
  _origBossAtk();
  if(!wasDead&&bossHP<=0)_bossWins++;
};
var _origCasinoSpin=casinoSpin;
casinoSpin=function(c){
  _origCasinoSpin(c);
  // tracked via result text after spin
};
var _origAgExit=agarthaExit;
agarthaExit=function(){
  _agarthaRuns++;
  if(agFloor>_agarthaBest)_agarthaBest=agFloor;
  _origAgExit();
};

function renderStats(){
  var grid=document.getElementById("stats-grid");if(!grid)return;
  var elapsed=Math.floor((Date.now()-_gameStart)/1000);
  var mins=Math.floor(elapsed/60);var secs=elapsed%60;
  grid.innerHTML=[
    sr("Total Clicks",S.clicks),
    sr("Session Time",mins+"m "+secs+"s"),
    sr("Highest Combo",S.maxCombo),
    sr("Prestige Count",S.prestige),
    sr("Prestige Mult","x"+prestigeMult().toFixed(2)),
    sr("Currency Mult","x"+currencyMult().toFixed(2)),
    sr("Teeth",S.teeth),
    sr("Total Zorgos Collected",S.totalZorgos),
    sr("Current Zorgos",S.zorgos),
    sr("Suspicion",Math.floor(S.suspicion)+"%"),
    sr("Golden Clicks",S.goldenClicks||0),
    sr("Boss Wins",_bossWins),
    sr("Agartha Runs",_agarthaRuns),
    sr("Agartha Best Floor",_agarthaBest),
    sr("Currencies Unlocked",_lastUnlocked+"/"+CURRENCIES.length),
    sr("Crafts Completed",function(){var n=0;for(var i=0;i<RECIPES.length;i++)if(RECIPES[i].done)n++;return n}()+"/"+RECIPES.length),
    sr("Upgrades Bought",function(){var n=0;for(var k in S.upg)n+=S.upg[k];return n}()),
    sr("Achievements",function(){var n=0;for(var k in S.ach)if(S.ach[k])n++;return n}()+"/"+ACH.length),
  ].join("");
}
function sr(label,val){return'<div class="stat-row"><span>'+label+'</span><span class="stat-val">'+val+'</span></div>'}
setInterval(renderStats,1000);

// ============ POLISH: buy sound hook ============
var _origBuy=buy;
buy=function(id){var before=own(id);_origBuy(id);if(own(id)>before)sndBuy()};

// ============ POLISH: achievement sound already hooked via toast ============
// ============ POLISH: zorgo spawn sound ============
var _origSpawnZorgo=spawnZorgo;
spawnZorgo=function(){_origSpawnZorgo();sndZorgo()};

// ============ OTAMATONE BACKGROUND MUSIC ============
var _musicPlaying=false;var _musicOsc=null;var _musicGain=null;var _musicLFO=null;var _hornOsc=null;var _hornGain=null;
var _musicNotes=[220,247,294,330,392,440,494,587,660]; // A minor pentatonic + extras
var _musicIdx=0;var _musicTimer=null;

function startMusic(){
  var ctx=getAudio();if(!ctx)return;
  if(_musicPlaying)return;
  _musicPlaying=true;

  // otamatone = sawtooth with heavy vibrato
  _musicOsc=ctx.createOscillator();
  _musicOsc.type="sawtooth";
  _musicOsc.frequency.value=220;

  // vibrato LFO
  _musicLFO=ctx.createOscillator();
  _musicLFO.type="sine";
  _musicLFO.frequency.value=5; // 5hz wobble
  var lfoGain=ctx.createGain();
  lfoGain.gain.value=8; // wobble depth
  _musicLFO.connect(lfoGain);
  lfoGain.connect(_musicOsc.frequency);

  // main gain (quiet)
  _musicGain=ctx.createGain();
  _musicGain.gain.value=0.04;

  // lo-fi filter
  var filter=ctx.createBiquadFilter();
  filter.type="lowpass";
  filter.frequency.value=1200;
  filter.Q.value=5;

  _musicOsc.connect(filter);
  filter.connect(_musicGain);
  _musicGain.connect(ctx.destination);
  _musicOsc.start();
  _musicLFO.start();

  // horn = square wave, lower, slower
  _hornOsc=ctx.createOscillator();
  _hornOsc.type="square";
  _hornOsc.frequency.value=110;
  _hornGain=ctx.createGain();
  _hornGain.gain.value=0;
  var hornFilter=ctx.createBiquadFilter();
  hornFilter.type="lowpass";
  hornFilter.frequency.value=600;
  _hornOsc.connect(hornFilter);
  hornFilter.connect(_hornGain);
  _hornGain.connect(ctx.destination);
  _hornOsc.start();

  // melody loop
  _musicTimer=setInterval(function(){
    var ctx2=getAudio();if(!ctx2||!_musicOsc)return;
    var p=psl();
    // pick next note - mostly stepwise, sometimes jump
    if(Math.random()<0.7){
      _musicIdx+=Math.random()<0.5?1:-1;
    }else{
      _musicIdx=Math.floor(Math.random()*_musicNotes.length);
    }
    _musicIdx=Math.max(0,Math.min(_musicIdx,_musicNotes.length-1));

    var note=_musicNotes[_musicIdx];
    // detune slightly for that wobbly otamatone feel
    note+=Math.random()*6-3;
    // at high PSL notes get more chaotic
    if(p>=5)note*=(1+(Math.random()-0.5)*0.05*p/5);
    if(p>=8)note*=(Math.random()<0.1?0.5:1); // occasional octave drop

    // portamento (slide to note)
    _musicOsc.frequency.linearRampToValueAtTime(note,ctx2.currentTime+0.15);

    // vibrato speed increases with PSL
    _musicLFO.frequency.value=4+p*0.8;

    // horn blasts occasionally
    if(Math.random()<0.08+p*0.01){
      _hornGain.gain.setValueAtTime(0.03,ctx2.currentTime);
      _hornOsc.frequency.setValueAtTime(note*0.5,ctx2.currentTime);
      _hornGain.gain.exponentialRampToValueAtTime(0.001,ctx2.currentTime+0.4);
    }

    // volume swells (waaaah waaaah)
    var vol=0.03+Math.sin(Date.now()/800)*0.015;
    if(p>=7)vol+=0.01;
    _musicGain.gain.value=Math.min(0.06,vol);

  },300+Math.random()*200); // slightly irregular timing

  toast("🎵 music on (why)");
}

function stopMusic(){
  _musicPlaying=false;
  if(_musicOsc){try{_musicOsc.stop()}catch(e){}_musicOsc=null}
  if(_musicLFO){try{_musicLFO.stop()}catch(e){}_musicLFO=null}
  if(_hornOsc){try{_hornOsc.stop()}catch(e){}_hornOsc=null}
  if(_musicTimer){clearInterval(_musicTimer);_musicTimer=null}
  _musicGain=null;_hornGain=null;
  toast("🔇 music off");
}

function toggleMusic(){if(_musicPlaying)stopMusic();else startMusic()}

// music button - add to header
var _musicBtn=document.createElement("div");
_musicBtn.style.cssText="position:fixed;top:4px;right:4px;z-index:400;background:#fff;border:2px solid red;padding:3px 8px;font-size:.5rem;cursor:pointer;font-family:'Comic Neue',cursive;font-weight:700";
_musicBtn.textContent="🎵 MUSIC";
_musicBtn.onclick=toggleMusic;
document.body.appendChild(_musicBtn);

// auto-start music on first click (needs user interaction for AudioContext)
var _musicAutoStart=false;
document.addEventListener("touchstart",function(){if(!_musicAutoStart){_musicAutoStart=true;startMusic()}},{once:true});
document.addEventListener("click",function(){
  if(!_musicAutoStart){_musicAutoStart=true;startMusic()}
},{once:true});
