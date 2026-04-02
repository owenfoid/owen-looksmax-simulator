// ============ UPGRADES ============
// type: "mew" (costs mew points), "zorgo" (costs zorgos), "both" (costs both)
const UPG = [
  {id:"mew",     ic:"👅",nm:"Mewing Practice",        ds:"+1/click",                    b:15,     m:1.35,pc:1,   ps:0,   type:"mew"},
  {id:"jaw",     ic:"🦴",nm:"Jawline Exerciser",       ds:"+3/click",                    b:100,    m:1.45,pc:3,   ps:0,   type:"mew"},
  {id:"gum",     ic:"🍖",nm:"Falim Gum Pack",          ds:"+8/click",                    b:500,    m:1.5, pc:8,   ps:0,   type:"mew"},
  {id:"bone",    ic:"💀",nm:"Bonesmashing Session",     ds:"+25/click (trust)",           b:4000,   m:1.55,pc:25,  ps:0,   type:"mew"},
  {id:"cant",    ic:"👁️",nm:"Canthal Tilt Surgery",    ds:"+100/click hunter eyes",      b:80000,  m:1.75,pc:100, ps:0,   type:"mew"},
  {id:"cold",    ic:"🥶",nm:"Cold Shower Timer",       ds:"+1/sec",                      b:50,     m:1.4, pc:0,   ps:1,   type:"mew"},
  {id:"gym",     ic:"🏋️",nm:"Gym Membership",          ds:"+4/sec",                      b:250,    m:1.5, pc:0,   ps:4,   type:"mew"},
  {id:"skin",    ic:"🧴",nm:"Skincare Routine",        ds:"+12/sec",                     b:1200,   m:1.55,pc:0,   ps:12,  type:"mew"},
  {id:"rhino",   ic:"🔪",nm:"Rhinoplasty",             ds:"+40/sec",                     b:6000,   m:1.6, pc:0,   ps:40,  type:"mew"},
  {id:"hgh",     ic:"💉",nm:"HGH Protocol",            ds:"+120/sec",                    b:25000,  m:1.65,pc:0,   ps:120, type:"mew"},
  {id:"model",   ic:"📸",nm:"Model Agency Contract",   ds:"+500/sec",                    b:120000, m:1.7, pc:0,   ps:500, type:"mew"},
  {id:"god",     ic:"⚡",nm:"Genetic Recombination",   ds:"+2000/sec",                   b:800000, m:1.8, pc:0,   ps:2000,type:"mew"},
  // ZORGO UPGRADES - appear after first zorgo collected
  {id:"zorgo1",  ic:"🟣",nm:"Zorgo Converter",         ds:"+5000/sec (why is it purple)", b:3,     m:1.5, pc:0,   ps:5000,type:"zorgo", req:()=>S.zorgos>=1},
  {id:"zorgo2",  ic:"🔮",nm:"Zorgo Amplifier",         ds:"+50K/sec (it hums)",          b:10,     m:1.6, pc:0,   ps:50000,type:"zorgo",req:()=>S.zorgos>=5},
  {id:"zorgo3",  ic:"🌀",nm:"Zorgo Singularity",       ds:"+500K/sec (don't look at it)",b:25,     m:1.8, pc:0,   ps:500000,type:"zorgo",req:()=>S.zorgos>=15},
  // WEIRD TIER
  {id:"domain",  ic:"🟣",nm:"Domain Expansion: Mew",   ds:"+400/click (ur domain is ur mouth)",b:500000,m:1.8,pc:400,ps:0,type:"mew",req:()=>psl()>=4},
  {id:"mirror",  ic:"🪞",nm:"The Mirror Spoke Back",   ds:"+1500/click (it knows)",      b:3e6,    m:1.85,pc:1500,ps:0,   type:"mew",req:()=>psl()>=6},
  {id:"agartha", ic:"🕳️",nm:"Agartha Expedition",     ds:"+8K/sec (you went down)",     b:4e6,    m:1.85,pc:0,   ps:8000,type:"mew",req:()=>psl()>=5},
  {id:"sukuna",  ic:"👹",nm:"Sukuna's Blessing",       ds:"+25K/sec (cheek mouth)",      b:20e6,   m:1.9, pc:0,   ps:25000,type:"mew",req:()=>psl()>=7},
  {id:"gojo",    ic:"♾️",nm:"Six Eyes Awakening",      ds:"+100K/sec (you see too much)",b:100e6,  m:2.0, pc:0,   ps:100000,type:"mew",req:()=>psl()>=8},
  {id:"teeth",   ic:"🦷",nm:"The Third Row",           ds:"+400K/sec (they grew back)",  b:500e6,  m:2.1, pc:0,   ps:400000,type:"mew",req:()=>S.teeth>=35},
  {id:"skin2",   ic:"🫠",nm:"New Skin",                ds:"+2M/sec (closet)",            b:5e9,    m:2.2, pc:0,   ps:2e6, type:"mew",req:()=>psl()>=9},
  // BOTH cost
  {id:"wet",     ic:"⚠️",nm:"Wet Floor Sign",          ds:"does nothing. or does it?",   b:1e6,    m:1,   pc:0,   ps:0,   type:"mew",req:()=>S.clicks>=500,max:1,secret:true},
  {id:"what",    ic:"❓",nm:"???",                      ds:"",                            b:7,      m:1.3, pc:0,   ps:7777,type:"zorgo",req:()=>S.zorgos>=7,secret:true},
];

const RANKS = [
  {min:0,   nm:"Subhuman",           c:"#888"},
  {min:0.5, nm:"Normie",             c:"#ff4444"},
  {min:2,   nm:"HTN",                c:"#ff8844"},
  {min:3.5, nm:"Chadlite",           c:"#ffff00"},
  {min:5,   nm:"Chad",               c:"#ffff00"},
  {min:6.5, nm:"Gigachad",           c:"#00ff00"},
  {min:8,   nm:"Ascended",           c:"#00ffff"},
  {min:9,   nm:"Owen Tier",          c:"#fff"},
  {min:9.3, nm:"Hollow Earth Dweller",c:"#c840ff"},
  {min:9.6, nm:"It Doesn't Stop",    c:"#c840ff"},
  {min:9.9, nm:"",                   c:"#fff"},
];

const ACH = [
  {id:"c10",  ic:"👆",nm:"First Mews",        ds:"10 clicks"},
  {id:"c100", ic:"👆",nm:"Mew Machine",       ds:"100 clicks"},
  {id:"c1k",  ic:"🤖",nm:"Mewbot 9000",      ds:"1,000 clicks"},
  {id:"c10k", ic:"🦾",nm:"Carpal Tunnel",     ds:"10,000 clicks"},
  {id:"p1k",  ic:"💰",nm:"Stacking",          ds:"1K lifetime"},
  {id:"p1m",  ic:"🏆",nm:"Millionaire Mewer", ds:"1M lifetime"},
  {id:"p1b",  ic:"👑",nm:"Billionaire Mewer", ds:"1B lifetime"},
  {id:"p1t",  ic:"💎",nm:"Trillionaire",      ds:"1T lifetime"},
  {id:"gym1", ic:"🏋️",nm:"Gymcel",            ds:"First gym pass"},
  {id:"psl5", ic:"⭐",nm:"Chad Status",       ds:"PSL 5.0"},
  {id:"foid", ic:"💅",nm:"Foid Approved",     ds:"PSL 7.0 — the foids are mirin'"},
  {id:"psl9", ic:"🗿",nm:"Owen Mode",         ds:"PSL 9.0"},
  {id:"stim", ic:"🌀",nm:"Stimmed Out",       ds:"Max the stim meter"},
  {id:"e67",  ic:"🫳",nm:"Emote 67",          ds:"the rare one"},
  {id:"cmb10",ic:"🔥",nm:"Combo x10",         ds:"10x combo"},
  {id:"cmb50",ic:"🔥",nm:"Combo x50",         ds:"50x combo"},
  {id:"pr1",  ic:"🔄",nm:"Reborn",            ds:"Prestige once"},
  {id:"pr5",  ic:"🔄",nm:"Cycle",             ds:"Prestige 5 times"},
  {id:"z1",   ic:"🟣",nm:"What Is This",      ds:"Collect your first zorgo"},
  {id:"z10",  ic:"🟣",nm:"Zorgo Hoarder",     ds:"Collect 10 zorgos"},
  {id:"z50",  ic:"🔮",nm:"Zorgo Lord",        ds:"Collect 50 zorgos"},
  {id:"jjk1", ic:"🟣",nm:"Domain Deployed",   ds:"Domain Expansion"},
  {id:"jjk3", ic:"♾️",nm:"Honored One",       ds:"Six Eyes"},
  {id:"agt1", ic:"🕳️",nm:"Inner Earth",      ds:"Agartha Expedition"},
  {id:"wet1", ic:"⚠️",nm:"Why",              ds:"Buy the wet floor sign"},
  {id:"t35",  ic:"🦷",nm:"Extra",             ds:"35 teeth"},
  {id:"t50",  ic:"🦷",nm:"Too Many",          ds:"50 teeth"},
  {id:"gold1",ic:"✨",nm:"Golden Touch",      ds:"Click a golden mew"},
  {id:"mirr", ic:"🪞",nm:"It Talked",         ds:"The Mirror Spoke Back"},
  {id:"what1",ic:"❓",nm:"???",               ds:"???"},
];

// check functions added dynamically in engine
const ACH_CHECKS = {
  c10:()=>S.clicks>=10, c100:()=>S.clicks>=100, c1k:()=>S.clicks>=1000, c10k:()=>S.clicks>=10000,
  p1k:()=>S.total>=1e3, p1m:()=>S.total>=1e6, p1b:()=>S.total>=1e9, p1t:()=>S.total>=1e12,
  gym1:()=>own("gym")>=1, psl5:()=>psl()>=5, foid:()=>psl()>=7, psl9:()=>psl()>=9,
  stim:()=>S.stim>=100, e67:()=>S.ach&&S.ach["e67"],
  cmb10:()=>S.maxCombo>=10, cmb50:()=>S.maxCombo>=50,
  pr1:()=>S.prestige>=1, pr5:()=>S.prestige>=5,
  z1:()=>S.zorgos>=1||S.totalZorgos>=1, z10:()=>S.totalZorgos>=10, z50:()=>S.totalZorgos>=50,
  jjk1:()=>own("domain")>=1, jjk3:()=>own("gojo")>=1, agt1:()=>own("agartha")>=1,
  wet1:()=>own("wet")>=1, t35:()=>S.teeth>=35, t50:()=>S.teeth>=50,
  gold1:()=>S.goldenClicks>=1, mirr:()=>own("mirror")>=1,
  what1:()=>own("what")>=1,
};
for(const a of ACH) a.ck = ACH_CHECKS[a.id] || (()=>false);

const EVENTS_NORMAL = [
  "Owen caught you lackin' with bad posture.",
  "You accidentally mewed in class.",
  "Someone said 'nice jawline.'",
  "Cold shower streak: 7 days.",
  "Your gym crush noticed your gains.",
  "Bonesmashing results showing.",
  "You ate raw liver for breakfast.",
  "New PR at the gym.",
  "Mewing form check: perfect.",
  "You rejected seed oils at dinner.",
  "Black Flash achieved.",
  "Todo saw your PSL: 'My best friend!'",
];
const EVENTS_WEIRD = [
  "The mirror blinked before you did.",
  "Your reflection's jawline is sharper than yours.",
  "You hear mewing sounds from inside the walls.",
  "The cold shower water was warm. It shouldn't have been.",
  "Nobody at the gym remembers you.",
  "The before photo moved.",
  "Your tongue has been on the roof of your mouth for 72 hours.",
  "You found a tooth in your pillow. It's not yours.",
  "A zorgo appeared in your fridge. You don't remember putting it there.",
  "The wet floor sign moved to a different room.",
  "Your teeth count went up. You didn't buy anything.",
  "Sukuna's mouth mews for you while you sleep.",
  "Someone is mewing in the room below. There is no room below.",
  "Your jawline has a reflection. The rest of your face doesn't.",
  "The looksmax forum posted your before photo. You didn't upload one.",
  "There are 3 toothbrushes in your bathroom. You live alone.",
  "The gym was empty at 3am. The weights were warm.",
  "The hollow earth expedition found a gym with your membership card.",
  "A zorgo is following you. Don't turn around.",
];
const EVENTS_LATE = [
  "The face in the mirror is yours. You are sure. You are sure.",
  "PSL ██.█ achieved.",
  "You can hear your bones growing.",
  "The model agency wants the old face back. 'The first one.'",
  "Your before and after photos are the same now.",
  "The mewing worked. Your mouth is sealed.",
  "You said 2 years. They said 11.",
  "Agartha level 67. Room of mirrors. All smiling.",
  "The grind never stops. You've tried.",
  "You look perfect. Close the game.",
  "The zorgos are watching.",
  "Your teeth count is ███. That's too many.",
];
function getEvent(){
  const p=psl();
  if(p>=9&&Math.random()<0.3) return EVENTS_LATE[Math.floor(Math.random()*EVENTS_LATE.length)];
  if(p>=5&&Math.random()<0.5) return EVENTS_WEIRD[Math.floor(Math.random()*EVENTS_WEIRD.length)];
  if(p>=3) return (Math.random()<0.3?EVENTS_WEIRD:EVENTS_NORMAL)[Math.floor(Math.random()*(Math.random()<0.3?EVENTS_WEIRD:EVENTS_NORMAL).length)];
  return EVENTS_NORMAL[Math.floor(Math.random()*EVENTS_NORMAL.length)];
}

const PRESTIGE_COST=1e10; const PRESTIGE_MULT=0.25;
const COMBO_DECAY_MS=800; const COMBO_MAX_MULT=5;
const GOLDEN_CHANCE=0.003; const GOLDEN_DURATION=5000; const GOLDEN_MULT=10;
