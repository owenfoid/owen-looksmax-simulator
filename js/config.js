// ============ UPGRADES ============
const UPG = [
  // normal-ish tier
  {id:"mew",     ic:"👅",nm:"Mewing Practice",        ds:"+1/click",                    b:15,     m:1.35,pc:1,   ps:0},
  {id:"jaw",     ic:"🦴",nm:"Jawline Exerciser",       ds:"+3/click",                    b:100,    m:1.45,pc:3,   ps:0},
  {id:"gum",     ic:"🍖",nm:"Falim Gum Pack",          ds:"+8/click",                    b:500,    m:1.5, pc:8,   ps:0},
  {id:"bone",    ic:"💀",nm:"Bonesmashing Session",     ds:"+25/click (trust)",           b:4000,   m:1.55,pc:25,  ps:0},
  {id:"cant",    ic:"👁️",nm:"Canthal Tilt Surgery",    ds:"+100/click hunter eyes",      b:80000,  m:1.75,pc:100, ps:0},
  // getting weird
  {id:"domain",  ic:"🟣",nm:"Domain Expansion: Mew",   ds:"+400/click (ur domain is ur mouth)", b:500000, m:1.8, pc:400, ps:0},
  {id:"mirror",  ic:"🪞",nm:"The Mirror Spoke Back",   ds:"+1500/click (it knows)",      b:3e6,    m:1.85,pc:1500, ps:0},
  // passive - starts normal
  {id:"cold",    ic:"🥶",nm:"Cold Shower Timer",       ds:"+1/sec",                      b:50,     m:1.4, pc:0,   ps:1},
  {id:"gym",     ic:"🏋️",nm:"Gym Membership",          ds:"+4/sec",                      b:250,    m:1.5, pc:0,   ps:4},
  {id:"skin",    ic:"🧴",nm:"Skincare Routine",        ds:"+12/sec",                     b:1200,   m:1.55,pc:0,   ps:12},
  {id:"rhino",   ic:"🔪",nm:"Rhinoplasty",             ds:"+40/sec",                     b:6000,   m:1.6, pc:0,   ps:40},
  {id:"hgh",     ic:"💉",nm:"HGH Protocol",            ds:"+120/sec",                    b:25000,  m:1.65,pc:0,   ps:120},
  {id:"model",   ic:"📸",nm:"Model Agency Contract",   ds:"+500/sec",                    b:120000, m:1.7, pc:0,   ps:500},
  {id:"god",     ic:"⚡",nm:"Genetic Recombination",   ds:"+2000/sec",                   b:800000, m:1.8, pc:0,   ps:2000},
  // things get wrong
  {id:"agartha", ic:"🕳️",nm:"Agartha Expedition",     ds:"+8000/sec (you went down)",   b:4e6,    m:1.85,pc:0,   ps:8000},
  {id:"sukuna",  ic:"👹",nm:"Sukuna's Blessing",       ds:"+25K/sec (mouth on your cheek)",b:20e6, m:1.9, pc:0,   ps:25000},
  {id:"gojo",    ic:"♾️",nm:"Six Eyes Awakening",      ds:"+100K/sec (you see too much)", b:100e6, m:2.0, pc:0,   ps:100000},
  {id:"teeth",   ic:"🦷",nm:"The Third Row",           ds:"+400K/sec (they grew back wrong)",b:500e6,m:2.1,pc:0,  ps:400000},
  {id:"skin2",   ic:"🫠",nm:"New Skin",                ds:"+2M/sec (the old one is in the closet)",b:5e9,m:2.2,pc:0,ps:2000000},
];

const RANKS = [
  {min:0,   nm:"Subhuman",           c:"#888"},
  {min:0.5, nm:"Normie",             c:"var(--accent)"},
  {min:2,   nm:"HTN",                c:"#ff7744"},
  {min:3.5, nm:"Chadlite",           c:"var(--accent2)"},
  {min:5,   nm:"Chad",               c:"var(--accent2)"},
  {min:6.5, nm:"Gigachad",           c:"#4ade80"},
  {min:8,   nm:"Ascended",           c:"#60a5fa"},
  {min:9,   nm:"Owen Tier",          c:"#fff"},
  {min:9.3, nm:"Hollow Earth Dweller",c:"#c084fc"},
  {min:9.6, nm:"It Doesn't Stop",    c:"#c084fc"},
  {min:9.9, nm:"",                   c:"#fff"},
];

const ACH = [
  {id:"c10",  ic:"👆",nm:"First Mews",        ds:"10 clicks",             ck:()=>S.clicks>=10},
  {id:"c100", ic:"👆",nm:"Mew Machine",       ds:"100 clicks",            ck:()=>S.clicks>=100},
  {id:"c1k",  ic:"🤖",nm:"Mewbot 9000",      ds:"1,000 clicks",          ck:()=>S.clicks>=1000},
  {id:"c10k", ic:"🦾",nm:"Carpal Tunnel",     ds:"10,000 clicks",         ck:()=>S.clicks>=10000},
  {id:"p1k",  ic:"💰",nm:"Stacking",          ds:"1K lifetime",           ck:()=>S.total>=1e3},
  {id:"p1m",  ic:"🏆",nm:"Millionaire Mewer", ds:"1M lifetime",           ck:()=>S.total>=1e6},
  {id:"p1b",  ic:"👑",nm:"Billionaire Mewer", ds:"1B lifetime",           ck:()=>S.total>=1e9},
  {id:"p1t",  ic:"💎",nm:"Trillionaire Grind",ds:"1T lifetime",           ck:()=>S.total>=1e12},
  {id:"gym1", ic:"🏋️",nm:"Gymcel",            ds:"First gym pass",        ck:()=>own("gym")>=1},
  {id:"sr1",  ic:"🔪",nm:"Under the Knife",  ds:"First surgery",         ck:()=>own("rhino")>=1},
  {id:"md1",  ic:"📸",nm:"Signed",            ds:"Model contract",        ck:()=>own("model")>=1},
  {id:"psl5", ic:"⭐",nm:"Chad Status",       ds:"PSL 5.0",               ck:()=>psl()>=5},
  {id:"foid", ic:"💅",nm:"Foid Approved",     ds:"PSL 7.0 — even the foids are mirin'",ck:()=>psl()>=7},
  {id:"psl9", ic:"🗿",nm:"Owen Mode",         ds:"PSL 9.0",               ck:()=>psl()>=9},
  {id:"stim", ic:"🌀",nm:"Stimmed Out",       ds:"Max the stim meter",    ck:()=>S.stim>=100},
  {id:"e67",  ic:"🫳",nm:"Emote 67",          ds:"Trigger the rare emote 67", ck:()=>S.ach["e67"]},
  {id:"cmb10",ic:"🔥",nm:"Combo Starter",     ds:"10x combo",             ck:()=>S.maxCombo>=10},
  {id:"cmb50",ic:"🔥",nm:"Combo Demon",       ds:"50x combo",             ck:()=>S.maxCombo>=50},
  {id:"cmb100",ic:"💥",nm:"COMBO GOD",        ds:"100x combo",            ck:()=>S.maxCombo>=100},
  {id:"pr1",  ic:"🔄",nm:"Reborn",            ds:"Prestige once",         ck:()=>S.prestige>=1},
  {id:"pr5",  ic:"🔄",nm:"Cycle of Pain",     ds:"Prestige 5 times",      ck:()=>S.prestige>=5},
  {id:"pr10", ic:"♻️",nm:"Eternal Return",    ds:"Prestige 10 times",     ck:()=>S.prestige>=10},
  {id:"jjk1", ic:"🟣",nm:"Domain Deployed",   ds:"Buy Domain Expansion",  ck:()=>own("domain")>=1},
  {id:"jjk2", ic:"👹",nm:"King of Curses",    ds:"Buy Sukuna's Blessing", ck:()=>own("sukuna")>=1},
  {id:"jjk3", ic:"♾️",nm:"Throughout Heaven and Earth",ds:"I alone am the honored one",ck:()=>own("gojo")>=1},
  {id:"agt1", ic:"🕳️",nm:"Inner Earth",      ds:"Buy Agartha Expedition",ck:()=>own("agartha")>=1},
  {id:"gold1",ic:"✨",nm:"Golden Touch",      ds:"Click a golden mew",    ck:()=>S.goldenClicks>=1},
  {id:"gold10",ic:"🌟",nm:"Midas",            ds:"Click 10 golden mews",  ck:()=>S.goldenClicks>=10},
  // weird ones
  {id:"mirr", ic:"🪞",nm:"It Talked",         ds:"Buy The Mirror Spoke Back",ck:()=>own("mirror")>=1},
  {id:"teth", ic:"🦷",nm:"Extra",             ds:"Buy The Third Row",     ck:()=>own("teeth")>=1},
  {id:"skin3",ic:"🫠",nm:"Molt",              ds:"Buy New Skin",          ck:()=>own("skin2")>=1},
];

// events get weirder as PSL/prestige increases
const EVENTS_NORMAL = [
  "Owen caught you lackin' with bad posture. Sit up.",
  "You accidentally mewed in class. Respect +10.",
  "Someone said 'nice jawline.' Keep going.",
  "Cold shower streak: 7 days. Ice doesn't phase you.",
  "Your gym crush noticed your gains.",
  "Bonesmashing results showing. Mirror is your friend now.",
  "You ate raw liver for breakfast. Ancestral gains.",
  "New PR at the gym. The grind pays.",
  "Sunlight exposure maxed. Vitamin D protocol complete.",
  "Mewing form check: tongue fully on palate. Perfect.",
  "You rejected seed oils at dinner.",
  "Mouth tape applied. Nasal breathing activated.",
  "Todo saw your PSL: 'My best friend!'",
  "Black Flash achieved — 120% mew efficiency.",
];

const EVENTS_WEIRD = [
  "The mirror blinked before you did.",
  "Your reflection's jawline is sharper than yours. It shouldn't be.",
  "You hear mewing sounds from inside the walls.",
  "The cold shower water was warm today. It shouldn't have been warm.",
  "Your gym crush doesn't remember you. Nobody at the gym does.",
  "The before photo moved.",
  "Your tongue has been on the roof of your mouth for 72 hours. You can't move it.",
  "You found a tooth in your pillow. It's not yours. It's better than yours.",
  "Sukuna opened his mouth on your cheek. It mews for you while you sleep.",
  "Gojo took off his blindfold. His six eyes are all the same color as yours.",
  "The beings in Agartha don't have faces. They say they don't need them anymore.",
  "Admiral Byrd's diary mentioned you by name. It was written in 1947.",
  "You expanded your domain. Your room looks different now. Smaller.",
  "Someone is mewing in the room below yours. There is no room below yours.",
  "Your jawline has a reflection in the mirror. The rest of your face doesn't.",
  "The looksmax forum posted your before photo. You didn't upload one.",
  "Owen approved your progress. You've never met Owen.",
  "There are 3 toothbrushes in your bathroom. You live alone.",
  "The gym was empty at 3am. The weights were warm.",
  "Your tongue found something on the roof of your mouth that wasn't there yesterday.",
  "The hollow earth expedition found a gym. It had your membership card.",
  "You dreamed about your jawline. In the dream, it was someone else's face.",
  "Reversed cursed technique'd your hairline. Something else came back too.",
  "The Vril Society left you a voicemail. You don't have a phone number.",
  "Your skin care routine worked. That's not your skin.",
];

const EVENTS_LATE = [
  "The face in the mirror is yours. You are sure of this. You are sure.",
  "PSL ██.█ achieved. This shouldn't be possible.",
  "You can hear your bones growing. They sound happy.",
  "The model agency called. They want the old face back. They said 'the first one.'",
  "Your before photo and your after photo are the same photo now.",
  "The mewing worked. Your mouth is sealed. Your tongue won't come down.",
  "Someone at the gym asked how long you've been coming here. You said 2 years. They said 11.",
  "Agartha level 67 is just a room full of mirrors. They all show different faces. All of them are smiling.",
  "The grind never stops. You've tried. It doesn't stop.",
  "You look perfect. Close the game. You look perfect. Stop clicking.",
];

function getEvent() {
  const p = psl();
  if(p >= 9 && Math.random() < 0.3) return EVENTS_LATE[Math.floor(Math.random()*EVENTS_LATE.length)];
  if(p >= 6 && Math.random() < 0.5) return EVENTS_WEIRD[Math.floor(Math.random()*EVENTS_WEIRD.length)];
  if(p >= 3) return (Math.random() < 0.3 ? EVENTS_WEIRD : EVENTS_NORMAL)[Math.floor(Math.random()*(Math.random()<0.3?EVENTS_WEIRD:EVENTS_NORMAL).length)];
  return EVENTS_NORMAL[Math.floor(Math.random()*EVENTS_NORMAL.length)];
}

const PRESTIGE_COST = 1e10;
const PRESTIGE_MULT = 0.25;
const COMBO_DECAY_MS = 800;
const COMBO_MAX_MULT = 5;
const GOLDEN_CHANCE = 0.003;
const GOLDEN_DURATION = 5000;
const GOLDEN_MULT = 10;
