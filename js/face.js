// ============ EMOJI FACE SYSTEM ============
const canvas = document.getElementById("face");
const ctx = canvas.getContext("2d");

// PSL -> emoji progression
const FACE_STAGES = [
  { min:0,   emoji:"🤓", label:"" },
  { min:1,   emoji:"😐", label:"" },
  { min:2.5, emoji:"😤", label:"grinding" },
  { min:4,   emoji:"😏", label:"chadlite arc" },
  { min:5.5, emoji:"😎", label:"" },
  { min:7,   emoji:"🗿", label:"" },
  { min:8.5, emoji:"👑", label:"" },
  { min:9.5, emoji:"🗿👑", label:"final form" },
];

function getFaceEmoji(p) {
  let f = FACE_STAGES[0];
  for(const s of FACE_STAGES) if(p >= s.min) f = s;
  return f;
}

let stimIntensity = 0;
let emote67Timer = 0;
let emote67Active = false;

function drawFace(t, time) {
  const W = 200, H = 280;
  ctx.clearRect(0, 0, W, H);

  const si = stimIntensity;
  const face = getFaceEmoji(t * 10);

  // stim shake offset
  const shakeX = si > 0.1 ? Math.sin(time * 25) * si * 12 : 0;
  const shakeY = si > 0.1 ? Math.cos(time * 30) * si * 8 : 0;
  const rot = si > 0.2 ? Math.sin(time * 18) * si * 0.15 : Math.sin(time * 0.8) * 0.02;
  const scale = 1 + si * 0.12 * Math.sin(time * 15);

  ctx.save();
  ctx.translate(W/2 + shakeX, H/2 - 20 + shakeY);
  ctx.rotate(rot);
  ctx.scale(scale, scale);

  // main emoji
  const emojiSize = 80 + si * 20;
  ctx.font = emojiSize + "px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(face.emoji, 0, 0);

  // emote 67
  if(emote67Active) {
    const ep = emote67Timer;
    ctx.font = "bold 40px 'JetBrains Mono', monospace";
    ctx.fillStyle = `rgba(255,42,109,${0.5+Math.sin(time*15)*0.5})`;
    ctx.fillText("67", Math.sin(time*20)*20, -60);
    // hand emojis flying in
    ctx.font = "40px serif";
    const handX = lerp(80, 15, Math.min(1, ep*3));
    const wiggle = ep > 0.3 ? Math.sin(time*25)*10 : 0;
    ctx.fillText("🫳", -handX + wiggle, 50);
    ctx.fillText("🫳", handX - wiggle, 50);
  }

  ctx.restore();

  // stim visual effects on canvas
  if(si > 0.4) {
    // red overlay pulse
    ctx.fillStyle = `rgba(255,42,109,${(si-0.4)*0.15})`;
    ctx.fillRect(0, 0, W, H);
  }
  if(si > 0.6) {
    // glitch lines
    const n = Math.floor((si-0.6)*15);
    for(let i=0;i<n;i++) {
      const y = Math.random()*H;
      ctx.fillStyle = `rgba(57,255,20,${0.1+Math.random()*0.1})`;
      ctx.fillRect(0, y, W, 1+Math.random()*2);
    }
  }
  if(si > 0.8) {
    // chromatic split - draw emoji again offset
    ctx.globalAlpha = 0.15;
    ctx.font = (80+si*20)+"px serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(face.emoji, W/2 - 4 + shakeX, H/2 - 20 + shakeY);
    ctx.fillText(face.emoji, W/2 + 4 + shakeX, H/2 - 20 + shakeY);
    ctx.globalAlpha = 1;
  }

  // aura glow at high PSL
  if(t > 0.7) {
    const glowAlpha = lerp(0, 0.12, (t-0.7)/0.3);
    const grad = ctx.createRadialGradient(W/2, H/2-20, 20, W/2, H/2-20, 100);
    grad.addColorStop(0, `rgba(255,159,28,${glowAlpha})`);
    grad.addColorStop(1, "rgba(255,159,28,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,H);
  }

  // label text
  if(face.label) {
    ctx.font = "16px 'Outfit', sans-serif";
    ctx.fillStyle = "rgba(180,180,180,0.4)";
    ctx.textAlign = "center";
    ctx.fillText(face.label, W/2, H - 40);
  }

  // stim hands at bottom - just emojis, not drawn shapes
  if(si > 0.15 && !emote67Active) {
    const flapSpeed = lerp(5, 25, si);
    const flapAmt = lerp(3, 25, si);
    ctx.font = (28 + si*12) + "px serif";
    ctx.textAlign = "center";
    ctx.globalAlpha = Math.min(1, si * 2.5);
    const lRot = Math.sin(time * flapSpeed) * flapAmt;
    const rRot = Math.sin(time * flapSpeed + 0.5) * flapAmt;
    ctx.save(); ctx.translate(W/2 - 50, H - 50); ctx.rotate(lRot * Math.PI/180);
    ctx.fillText("🤚", 0, 0); ctx.restore();
    ctx.save(); ctx.translate(W/2 + 50, H - 50); ctx.rotate(rRot * Math.PI/180);
    ctx.fillText("🤚", 0, 0); ctx.restore();
    ctx.globalAlpha = 1;
  }
}

// keep drawStimHands as no-op since it's called from game.js
function drawStimHands(time) {}
