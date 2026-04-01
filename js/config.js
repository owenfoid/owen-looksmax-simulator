// ============ UPGRADES ============
const UPG = [
  {id:"mew",     ic:"👅",nm:"Mewing Practice",      ds:"+1/click",              b:15,    m:1.35,pc:1,  ps:0},
  {id:"jaw",     ic:"🦴",nm:"Jawline Exerciser",     ds:"+3/click",              b:100,   m:1.45,pc:3,  ps:0},
  {id:"gum",     ic:"🍖",nm:"Falim Gum Pack",        ds:"+8/click",              b:500,   m:1.5, pc:8,  ps:0},
  {id:"bone",    ic:"💀",nm:"Bonesmashing Session",   ds:"+25/click (trust bro)", b:4000,  m:1.55,pc:25, ps:0},
  {id:"cant",    ic:"👁️",nm:"Canthal Tilt Surgery",  ds:"+100/click hunter eyes",b:80000, m:1.75,pc:100,ps:0},
  {id:"cold",    ic:"🥶",nm:"Cold Shower Timer",     ds:"+1/sec",                b:50,    m:1.4, pc:0,  ps:1},
  {id:"gym",     ic:"🏋️",nm:"Gym Membership",        ds:"+4/sec",                b:250,   m:1.5, pc:0,  ps:4},
  {id:"skin",    ic:"🧴",nm:"Skincare Routine",      ds:"+12/sec glow up",       b:1200,  m:1.55,pc:0,  ps:12},
  {id:"rhino",   ic:"🔪",nm:"Rhinoplasty",           ds:"+40/sec",               b:6000,  m:1.6, pc:0,  ps:40},
  {id:"hgh",     ic:"💉",nm:"HGH Protocol",          ds:"+120/sec ascension",    b:25000, m:1.65,pc:0,  ps:120},
  {id:"model",   ic:"📸",nm:"Model Agency Contract", ds:"+500/sec",              b:120000,m:1.7, pc:0,  ps:500},
  {id:"god",     ic:"⚡",nm:"Genetic Recombination", ds:"+2000/sec final form",  b:800000,m:1.8, pc:0,  ps:2000},
];

// ============ RANKS ============
const RANKS = [
  {min:0,nm:"Subhuman",c:"#555"},{min:0.5,nm:"Normie",c:"#ff2e50"},{min:2,nm:"HTN",c:"#ff8800"},
  {min:3.5,nm:"Chadlite",c:"#ffd600"},{min:5,nm:"Chad",c:"#ffd600"},{min:6.5,nm:"Gigachad",c:"#00ffc8"},
  {min:8,nm:"Ascended",c:"#00aaff"},{min:9,nm:"Owen Tier",c:"#fff"},{min:9.8,nm:"Owen (Final Form)",c:"#fff"},
];

// ============ ACHIEVEMENTS ============
const ACH = [
  {id:"c10", ic:"👆",nm:"First Mews",       ds:"10 clicks",           ck:()=>S.clicks>=10},
  {id:"c100",ic:"👆",nm:"Mew Machine",      ds:"100 clicks",          ck:()=>S.clicks>=100},
  {id:"c1k", ic:"🤖",nm:"Mewbot 9000",     ds:"1,000 clicks",        ck:()=>S.clicks>=1000},
  {id:"p1k", ic:"💰",nm:"Stacking",         ds:"1K lifetime",         ck:()=>S.total>=1e3},
  {id:"p1m", ic:"🏆",nm:"Millionaire Mewer",ds:"1M lifetime",         ck:()=>S.total>=1e6},
  {id:"p1b", ic:"👑",nm:"Billionaire Mewer",ds:"1B lifetime",         ck:()=>S.total>=1e9},
  {id:"gym1",ic:"🏋️",nm:"Gymcel",           ds:"First gym pass",      ck:()=>own("gym")>=1},
  {id:"sr1", ic:"🔪",nm:"Under the Knife", ds:"First surgery",       ck:()=>own("rhino")>=1},
  {id:"md1", ic:"📸",nm:"Signed",           ds:"Model contract",      ck:()=>own("model")>=1},
  {id:"psl5",ic:"⭐",nm:"Chad Status",      ds:"PSL 5.0",             ck:()=>psl()>=5},
  {id:"foid",ic:"💅",nm:"Foid Approved",    ds:"PSL 7.0 — even the foids are mirin'",ck:()=>psl()>=7},
  {id:"psl9",ic:"🗿",nm:"Owen Mode",        ds:"PSL 9.0",             ck:()=>psl()>=9},
  {id:"stim",ic:"🌀",nm:"Stimmed Out",      ds:"Max the stim meter",  ck:()=>S.stim>=100},
  {id:"e67", ic:"🫳",nm:"Emote 67",         ds:"Trigger the rare emote 67", ck:()=>S.ach["e67"]},
];

// ============ RANDOM EVENTS ============
const EVENTS = [
  "Owen caught you lackin' with bad posture. Sit up.",
  "You accidentally mewed in class. Respect +10.",
  "Someone said 'nice jawline.' Keep going.",
  "Cold shower streak: 7 days. Ice doesn't phase you.",
  "Your gym crush noticed your gains.",
  "Bonesmashing results showing. Mirror is your friend now.",
  "You ate raw liver for breakfast. Ancestral gains.",
  "Owen approved your progress. PSL +0.01 spiritually.",
  "New PR at the gym. The grind pays.",
  "Sunlight exposure maxed. Vitamin D protocol complete.",
  "You stood in front of the mirror for 20 minutes. Passed.",
  "Mewing form check: tongue fully on palate. Perfect.",
];
