// ============ FACE SYSTEM ============
const canvas = document.getElementById("face");
const ctx = canvas.getContext("2d");

const faceImgs = [];
let facesLoaded = 0;
for(let i = 0; i < FACE_IMAGES.length; i++) {
  const img = new Image();
  img.onload = () => facesLoaded++;
  img.src = FACE_IMAGES[i];
  faceImgs.push(img);
}

function getFaceIndex(pslVal) {
  const idx = Math.floor(pslVal / 10 * (faceImgs.length - 0.01));
  return Math.min(faceImgs.length - 1, Math.max(0, idx));
}

let stimIntensity = 0;
let emote67Timer = 0;
let emote67Active = false;

function drawFace(t, time) {
  var W = 200, H = 280;
  ctx.clearRect(0, 0, W, H);
  if(facesLoaded < 1) return;

  var si = stimIntensity;
  var pslVal = t * 10;
  var idx = getFaceIndex(pslVal);

  var shakeX = si > 0.1 ? Math.sin(time * 28) * si * 10 : 0;
  var shakeY = si > 0.1 ? Math.cos(time * 33) * si * 6 : 0;
  var rot = si > 0.2 ? Math.sin(time * 20) * si * 0.08 : Math.sin(time * 0.8) * 0.01;
  var throb = 1 + (si > 0.3 ? Math.sin(time * 16) * si * 0.04 : 0);

  ctx.save();
  ctx.translate(W/2 + shakeX, 120 + shakeY);
  ctx.rotate(rot);
  ctx.scale(throb, throb);

  var img = faceImgs[idx];
  if(img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, -100, -120, 200, 240);
    var blend = (pslVal / 10 * (faceImgs.length - 1)) % 1;
    if(blend > 0.1 && idx < faceImgs.length - 1) {
      var next = faceImgs[idx + 1];
      if(next && next.complete && next.naturalWidth > 0) {
        ctx.globalAlpha = blend;
        ctx.drawImage(next, -100, -120, 200, 240);
        ctx.globalAlpha = 1;
      }
    }
  }
  ctx.restore();

  // stim effects
  if(si > 0.5) {
    ctx.fillStyle = "rgba(200,64,255," + ((si-0.5)*0.12) + ")";
    ctx.fillRect(0, 0, W, H);
  }
  if(si > 0.7) {
    for(var i = 0; i < (si-0.7)*12; i++) {
      ctx.fillStyle = "rgba(0,255,0," + (0.08+Math.random()*0.08) + ")";
      ctx.fillRect(0, Math.random()*H, W, 1+Math.random()*2);
    }
  }
  if(si > 0.85 && img && img.complete) {
    ctx.globalAlpha = 0.12;
    ctx.drawImage(img, W/2-100-3+shakeX, 0+shakeY, 200, 240);
    ctx.drawImage(img, W/2-100+3+shakeX, 0+shakeY, 200, 240);
    ctx.globalAlpha = 1;
  }

  if(t > 0.75) {
    var ga = lerp(0, 0.1, (t-0.75)/0.25);
    var grad = ctx.createRadialGradient(W/2, 120, 20, W/2, 120, 100);
    grad.addColorStop(0, "rgba(255,180,50," + ga + ")");
    grad.addColorStop(1, "rgba(255,180,50,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  if(emote67Active) {
    ctx.font = "bold 28px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(200,64,255," + (0.5+Math.sin(time*15)*0.5) + ")";
    ctx.fillText("67", W/2 + Math.sin(time*20)*15, 50);
  }

  if(si > 0.08 && !emote67Active) {
    drawStimHands(time, si, W, H);
  }
  if(emote67Active) {
    drawEmote67Hands(time, emote67Timer, W, H);
  }
}

// ============ HANDS ============
function drawHand(cx, cy, angle, fingerSpread, scale) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  // wrist
  ctx.fillStyle = "rgb(195,165,140)";
  ctx.beginPath();
  ctx.ellipse(0, 22, 8, 14, 0, 0, Math.PI*2);
  ctx.fill();

  // palm
  ctx.fillStyle = "rgb(220,190,165)";
  ctx.beginPath();
  ctx.moveTo(-12, 8);
  ctx.quadraticCurveTo(-14, -2, -10, -8);
  ctx.lineTo(10, -8);
  ctx.quadraticCurveTo(14, -2, 12, 8);
  ctx.quadraticCurveTo(10, 16, 0, 18);
  ctx.quadraticCurveTo(-10, 16, -12, 8);
  ctx.fill();

  // palm line
  ctx.strokeStyle = "rgba(170,140,115,0.3)";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(-8, 4);
  ctx.quadraticCurveTo(0, 0, 8, 4);
  ctx.stroke();

  var fingers = [
    { x:-11, ba:-0.3, l1:10, l2:8, w:3.5 },
    { x:-6,  ba:-0.12, l1:12, l2:10, w:3 },
    { x:-1,  ba:0,     l1:14, l2:11, w:3 },
    { x:4,   ba:0.08,  l1:13, l2:10, w:2.8 },
    { x:8,   ba:0.2,   l1:10, l2:8,  w:2.5 },
  ];

  for(var i = 0; i < fingers.length; i++) {
    var f = fingers[i];
    var spread = f.ba + (i === 0 ? fingerSpread*-0.5 : fingerSpread * (i-2) * 0.08);

    ctx.save();
    ctx.translate(f.x, -8);
    ctx.rotate(spread);

    ctx.fillStyle = "rgb(215,185,160)";
    ctx.beginPath();
    ctx.rect(-f.w/2, -f.l1, f.w, f.l1);
    ctx.fill();

    ctx.fillStyle = "rgb(195,165,140)";
    ctx.beginPath();
    ctx.ellipse(0, -f.l1, f.w/2+0.5, 2, 0, 0, Math.PI*2);
    ctx.fill();

    ctx.translate(0, -f.l1);
    ctx.fillStyle = "rgb(215,185,160)";
    ctx.beginPath();
    ctx.rect(-f.w/2+0.3, -f.l2, f.w-0.6, f.l2);
    ctx.fill();

    ctx.fillStyle = "rgb(235,215,200)";
    ctx.beginPath();
    ctx.rect(-f.w/2+0.8, -f.l2, f.w-1.6, f.l2*0.4);
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

function drawStimHands(time, si, W, H) {
  var alpha = Math.min(1, si * 3);
  ctx.globalAlpha = alpha;

  var flapSpeed = lerp(6, 30, si);
  var flapAmount = lerp(0.05, 0.6, si);
  var fs = lerp(0, 1, si);

  for(var s = 0; s < 2; s++) {
    var side = s === 0 ? -1 : 1;
    var baseX = W/2 + side * 65;
    var baseY = H - 55;
    var flapAngle = Math.sin(time * flapSpeed + side * 0.8) * flapAmount;
    var armBob = Math.abs(Math.sin(time * flapSpeed + side * 0.8)) * si * 5;

    drawHand(baseX, baseY - armBob, flapAngle * side * -1, fs, 0.9 + si * 0.15);
  }
  ctx.globalAlpha = 1;
}

function drawEmote67Hands(time, ep, W, H) {
  var baseY = H - 60;
  for(var s = 0; s < 2; s++) {
    var side = s === 0 ? -1 : 1;
    var startX = W/2 + side * 80;
    var endX = W/2 + side * 30;
    var handX = lerp(startX, endX, Math.min(1, ep * 2.5));
    var wiggle = ep > 0.3 ? Math.sin(time * 28) * 0.3 : 0;
    var spread = ep > 0.2 ? lerp(0, 2, (ep-0.2)*2) : 0;
    drawHand(handX, baseY, wiggle * side * -1, spread, 1);
  }
}
