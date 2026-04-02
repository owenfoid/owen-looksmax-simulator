// ============ FACE SYSTEM - Real PNGs ============
const canvas = document.getElementById("face");
const ctx = canvas.getContext("2d");

// Preload face images
const faceImgs = [];
let facesLoaded = 0;
for(let i = 0; i < FACE_IMAGES.length; i++) {
  const img = new Image();
  img.onload = () => facesLoaded++;
  img.src = FACE_IMAGES[i];
  faceImgs.push(img);
}

function getFaceIndex(pslVal) {
  // map 0-10 PSL to 0-7 face index
  const idx = Math.floor(pslVal / 10 * (faceImgs.length - 0.01));
  return Math.min(faceImgs.length - 1, Math.max(0, idx));
}

let stimIntensity = 0;
let emote67Timer = 0;
let emote67Active = false;

function drawFace(t, time) {
  const W = 200, H = 280;
  ctx.clearRect(0, 0, W, H);
  if(facesLoaded < 1) return;

  const si = stimIntensity;
  const pslVal = t * 10;
  const idx = getFaceIndex(pslVal);

  // stim shake
  const shakeX = si > 0.1 ? Math.sin(time * 28) * si * 10 : 0;
  const shakeY = si > 0.1 ? Math.cos(time * 33) * si * 6 : 0;
  const rot = si > 0.2 ? Math.sin(time * 20) * si * 0.08 : Math.sin(time * 0.8) * 0.01;
  const throb = 1 + (si > 0.3 ? Math.sin(time * 16) * si * 0.04 : 0);

  // draw face image centered
  ctx.save();
  ctx.translate(W/2 + shakeX, 120 + shakeY);
  ctx.rotate(rot);
  ctx.scale(throb, throb);

  const img = faceImgs[idx];
  if(img && img.complete) {
    ctx.drawImage(img, -100, -120, 200, 240);
  }

  // blend to next stage
  const blend = (pslVal / 10 * (faceImgs.length - 1)) % 1;
  if(blend > 0.1 && idx < faceImgs.length - 1) {
    const next = faceImgs[idx + 1];
    if(next && next.complete) {
      ctx.globalAlpha = blend;
      ctx.drawImage(next, -100, -120, 200, 240);
      ctx.globalAlpha = 1;
    }
  }

  ctx.restore();

  // stim screen effects
  if(si > 0.5) {
    ctx.fillStyle = `rgba(255,42,80,${(si-0.5)*0.12})`;
    ctx.fillRect(0, 0, W, H);
  }
  if(si > 0.7) {
    for(let i = 0; i < (si-0.7)*12; i++) {
      ctx.fillStyle = `rgba(255,92,53,${0.08+Math.random()*0.08})`;
      ctx.fillRect(0, Math.random()*H, W, 1+Math.random()*2);
    }
  }
  // chromatic ghost at extreme stim
  if(si > 0.85 && img && img.complete) {
    ctx.globalAlpha = 0.12;
    ctx.drawImage(img, W/2-100-3+shakeX, 120-120+shakeY, 200, 240);
    ctx.drawImage(img, W/2-100+3+shakeX, 120-120+shakeY, 200, 240);
    ctx.globalAlpha = 1;
  }

  // aura glow
  if(t > 0.75) {
    const ga = lerp(0, 0.1, (t-0.75)/0.25);
    const grad = ctx.createRadialGradient(W/2, 120, 20, W/2, 120, 100);
    grad.addColorStop(0, `rgba(255,180,50,${ga})`);
    grad.addColorStop(1, "rgba(255,180,50,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // emote 67
  if(emote67Active) {
    const ep = emote67Timer;
    ctx.font = "bold 28px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = `rgba(255,92,53,${0.5+Math.sin(time*15)*0.5})`;
    ctx.fillText("67", W/2 + Math.sin(time*20)*15, 50);
  }

  // STIMMING HANDS
  if(si > 0.08 && !emote67Active) {
    drawRealisticHands(time, si, W, H);
  }
  if(emote67Active) {
    drawEmote67Hands(time, emote67Timer, W, H);
  }
}

// ============ REALISTIC HAND DRAWING ============
function drawHand(cx, cy, angle, fingerSpread, scale) {
  // skin colors
  const palm = "rgb(220,190,165)";
  const palmShadow = "rgb(195,165,140)";
  const finger = "rgb(215,185,160)";
  const nail = "rgb(235,215,200)";

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  // wrist/forearm
  ctx.fillStyle = palmShadow;
  ctx.beginPath();
  ctx.ellipse(0, 22, 8, 14, 0, 0, Math.PI*2);
  ctx.fill();

  // palm
  ctx.fillStyle = palm;
  ctx.beginPath();
  ctx.moveTo(-12, 8);
  ctx.quadraticCurveTo(-14, -2, -10, -8);
  ctx.lineTo(10, -8);
  ctx.quadraticCurveTo(14, -2, 12, 8);
  ctx.quadraticCurveTo(10, 16, 0, 18);
  ctx.quadraticCurveTo(-10, 16, -12, 8);
  ctx.fill();

  // palm line detail
  ctx.strokeStyle = "rgba(170,140,115,0.3)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(-8, 4); ctx.quadraticCurveTo(0, 0, 8, 4);
  ctx.stroke();

  // fingers - 5 fingers with segments
  const fingers = [
    { x:-11, baseAngle:-0.3, len1:10, len2:8, w:3.5 },   // thumb (shorter, wider)
    { x:-6,  baseAngle:-0.12, len1:12, len2:10, w:3 },    // index
    { x:-1,  baseAngle:0,     len1:14, len2:11, w:3 },    // middle (longest)
    { x:4,   baseAngle:0.08,  len1:13, len2:10, w:2.8 },  // ring
    { x:8,   baseAngle:0.2,   len1:10, len2:8,  w:2.5 },  // pinky
  ];

  for(let i = 0; i < fingers.length; i++) {
    const f = fingers[i];
    const spread = f.baseAngle + (i === 0 ? fingerSpread*-0.5 : fingerSpread * (i-2) * 0.08);

    ctx.save();
    ctx.translate(f.x, -8);
    ctx.rotate(spread);

    // first segment
    ctx.fillStyle = finger;
    ctx.beginPath();
    ctx.roundRect(-f.w/2, -f.len1, f.w, f.len1, 2);
    ctx.fill();

    // knuckle
    ctx.fillStyle = palmShadow;
    ctx.beginPath();
    ctx.ellipse(0, -f.len1, f.w/2+0.5, 2, 0, 0, Math.PI*2);
    ctx.fill();

    // second segment
    ctx.translate(0, -f.len1);
    ctx.fillStyle = finger;
    ctx.beginPath();
    ctx.roundRect(-f.w/2+0.3, -f.len2, f.w-0.6, f.len2, 2);
    ctx.fill();

    // fingernail
    ctx.fillStyle = nail;
    ctx.beginPath();
    ctx.roundRect(-f.w/2+0.8, -f.len2, f.w-1.6, f.len2*0.4, [2,2,0,0]);
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

function drawRealisticHands(time, si, W, H) {
  const alpha = Math.min(1, si * 3);
  ctx.globalAlpha = alpha;

  // hand flapping: wrist stays at sides, hands pivot up/down rapidly
  const flapSpeed = lerp(6, 30, si);
  const flapAmount = lerp(0.05, 0.6, si);

  // finger spread increases with stim
  const fingerSpread = lerp(0, 1, si);

  for(let side of [-1, 1]) {
    const baseX = W/2 + side * 65;
    const baseY = H - 55;

    // the flap: hand rotates at the wrist
    const flapAngle = Math.sin(time * flapSpeed + side * 0.8) * flapAmount;

    // slight arm bob
    const armBob = Math.abs(Math.sin(time * flapSpeed + side * 0.8)) * si * 5;

    drawHand(
      baseX,
      baseY - armBob,
      flapAngle * side * -1,  // mirror for left hand
      fingerSpread,
      0.9 + si * 0.15
    );
  }

  ctx.globalAlpha = 1;
}

function drawEmote67Hands(time, ep, W, H) {
  // hands come together, fingers spread, rapid wiggle
  const baseY = H - 60;

  for(let side of [-1, 1]) {
    const startX = W/2 + side * 80;
    const endX = W/2 + side * 30;
    const handX = lerp(startX, endX, Math.min(1, ep * 2.5));
    const wiggle = ep > 0.3 ? Math.sin(time * 28) * 0.3 : 0;
    const spread = ep > 0.2 ? lerp(0, 2, (ep-0.2)*2) : 0;

    drawHand(handX, baseY, wiggle * side * -1, spread, 1);
  }
}

// no-op stub (called from game.js)
function drawStimHands(time) {}
