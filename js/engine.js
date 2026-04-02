// ============ STATE ============
let S = { pts:0, total:0, pc:1, ps:0, upg:{}, ach:{}, clicks:0, stim:0,
  prestige:0, combo:0, maxCombo:0, lastClickTime:0, goldenClicks:0,
  lastSaveTime:Date.now(), totalPrestigeEarnings:0 };

// ============ HELPERS ============
const own = id => S.upg[id]||0;
const cost = u => Math.floor(u.b * Math.pow(u.m, own(u.id)));
function prestigeMult() { return 1 + S.prestige * PRESTIGE_MULT; }
function comboMult() { return Math.min(COMBO_MAX_MULT, 1 + S.combo * 0.04); }

function recalc() {
  S.pc=1; S.ps=0;
  for(const u of UPG){ const n=own(u.id); S.pc+=u.pc*n; S.ps+=u.ps*n; }
  // apply prestige multiplier
  S.pc = Math.floor(S.pc * prestigeMult());
  S.ps = Math.floor(S.ps * prestigeMult());
}
function psl() {
  // use total across all prestiges
  const t = S.total + S.totalPrestigeEarnings;
  if(t<=0)return 0;
  return Math.min(10, parseFloat((Math.log10(t+1)).toFixed(2)));
}
function getRank(p){ let r=RANKS[0]; for(const x of RANKS) if(p>=x.min)r=x; return r; }
function fmt(n){
  if(n>=1e15)return(n/1e15).toFixed(1)+"Q";
  if(n>=1e12)return(n/1e12).toFixed(1)+"T";
  if(n>=1e9)return(n/1e9).toFixed(1)+"B";
  if(n>=1e6)return(n/1e6).toFixed(1)+"M";
  if(n>=1e3)return(n/1e3).toFixed(1)+"K";
  return Math.floor(n);
}
function lerp(a,b,t){ return a+(b-a)*Math.min(1,Math.max(0,t)); }

// ============ PRESTIGE ============
function canPrestige() { return S.total >= PRESTIGE_COST; }
function doPrestige() {
  if(!canPrestige()) return;
  S.totalPrestigeEarnings += S.total;
  S.prestige++;
  S.pts = 0; S.total = 0; S.upg = {}; S.stim = 0;
  S.combo = 0; S.clicks = 0;
  recalc();
  render();
  // big effects
  screenShake(3); flash("rgba(255,92,53,0.5)"); chromatic();
  setTimeout(()=>{ flash("rgba(192,132,252,0.3)"); screenShake(3); }, 200);
  setTimeout(()=>{ flash("rgba(255,159,28,0.3)"); chromatic(); }, 400);
  const rect = document.getElementById("face").getBoundingClientRect();
  particles(rect.left+rect.width/2, rect.top+rect.height/2, 60);
  toast("🔄 PRESTIGE " + S.prestige + "! x" + prestigeMult().toFixed(2) + " multiplier!");
  log("PRESTIGE " + S.prestige + " — multiplier now x" + prestigeMult().toFixed(2), true);
  checkAch();
}

// ============ COMBO ============
function tickCombo() {
  const now = Date.now();
  if(S.combo > 0 && now - S.lastClickTime > COMBO_DECAY_MS) {
    S.combo = 0;
  }
}
function addCombo() {
  S.combo++;
  S.lastClickTime = Date.now();
  if(S.combo > S.maxCombo) S.maxCombo = S.combo;
}

// ============ GOLDEN CLICK ============
let goldenActive = false;
let goldenTimeout = null;

function spawnGolden() {
  if(goldenActive) return;
  goldenActive = true;
  toast("✨ GOLDEN MEW! Click fast!");
  log("GOLDEN MEW appeared!", true);
  flash("rgba(255,92,53,0.2)");
  goldenTimeout = setTimeout(()=>{
    goldenActive = false;
    toast("💨 Golden mew expired...");
  }, GOLDEN_DURATION);
}

function claimGolden() {
  if(!goldenActive) return;
  goldenActive = false;
  clearTimeout(goldenTimeout);
  const bonus = Math.floor(S.pc * GOLDEN_MULT * comboMult());
  S.pts += bonus; S.total += bonus;
  S.goldenClicks = (S.goldenClicks||0) + 1;
  toast("✨ GOLDEN! +" + fmt(bonus) + "!");
  log("Golden mew claimed: +" + fmt(bonus), true);
  screenShake(3); flash("rgba(255,159,28,0.4)"); chromatic();
  const rect = document.getElementById("face").getBoundingClientRect();
  particles(rect.left+rect.width/2, rect.top+rect.height/2, 30);
  checkAch();
}

// ============ OFFLINE EARNINGS ============
function calcOfflineEarnings() {
  if(!S.lastSaveTime || S.ps <= 0) return 0;
  const elapsed = (Date.now() - S.lastSaveTime) / 1000;
  if(elapsed < 30) return 0; // only show if away 30s+
  return Math.floor(S.ps * elapsed * 0.5); // 50% efficiency offline
}

// ============ SAVE / LOAD ============
const SAVE_KEY = "owen_lm_v4";
function save(){
  S.lastSaveTime = Date.now();
  localStorage.setItem(SAVE_KEY, JSON.stringify(S));
}
function load(){
  const r=localStorage.getItem(SAVE_KEY);
  if(r){ try{
    const loaded = JSON.parse(r);
    // migrate from v3
    if(!loaded.prestige) loaded.prestige = 0;
    if(!loaded.combo) loaded.combo = 0;
    if(!loaded.maxCombo) loaded.maxCombo = 0;
    if(!loaded.goldenClicks) loaded.goldenClicks = 0;
    if(!loaded.totalPrestigeEarnings) loaded.totalPrestigeEarnings = 0;
    if(!loaded.lastSaveTime) loaded.lastSaveTime = Date.now();
    Object.assign(S, loaded);
    recalc();
    // offline earnings
    const offline = calcOfflineEarnings();
    if(offline > 0) {
      S.pts += offline; S.total += offline;
      setTimeout(()=>{
        toast("💤 Welcome back! +" + fmt(offline) + " earned while away");
        log("Offline earnings: +" + fmt(offline), true);
      }, 500);
    }
  }catch(e){} }
}
