// ============ STATE ============
let S = { pts:0, total:0, pc:1, ps:0, upg:{}, ach:{}, clicks:0, stim:0 };

// ============ HELPERS ============
const own = id => S.upg[id]||0;
const cost = u => Math.floor(u.b * Math.pow(u.m, own(u.id)));
function recalc() {
  S.pc=1; S.ps=0;
  for(const u of UPG){ const n=own(u.id); S.pc+=u.pc*n; S.ps+=u.ps*n; }
}
function psl() {
  if(S.total<=0)return 0;
  return Math.min(10, parseFloat((Math.log10(S.total+1)).toFixed(2)));
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

// ============ SAVE / LOAD ============
const SAVE_KEY = "owen_lm_v3";
function save(){ localStorage.setItem(SAVE_KEY, JSON.stringify(S)); }
function load(){
  const r=localStorage.getItem(SAVE_KEY);
  if(r){ try{Object.assign(S,JSON.parse(r));recalc();}catch(e){} }
}
