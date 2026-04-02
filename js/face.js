const canvas = document.getElementById("face");
const ctx = canvas.getContext("2d");

function drawFace(t, time) {
  const W=200, H=280;
  ctx.clearRect(0,0,W,H);

  const si = typeof stimIntensity !== 'undefined' ? stimIntensity : 0;

  // normal breathing + stim shaking layered on top
  const breathe = Math.sin(time*2)*1.5 + si * Math.sin(time*35) * 8;
  const headTilt = Math.sin(time*0.7)*0.5 + si * Math.sin(time*20) * 12;
  const headShakeX = si * Math.sin(time*25) * 6;

  ctx.save();
  ctx.translate(W/2 + headShakeX, H/2 + breathe - 10);
  ctx.rotate(headTilt * Math.PI/180);

  // stim face scale throb
  if(si > 0.3) {
    const throb = 1 + Math.sin(time*18) * si * 0.06;
    ctx.scale(throb, throb);
  }

  // HEAD SHAPE
  const headW = lerp(42, 36, t);
  const headH = lerp(50, 56, t);
  const jawW = lerp(40, 32, t);
  const jawDrop = lerp(46, 52, t);
  const cheekbone = lerp(0, 6, t);

  const skinR = Math.floor(lerp(210, 230, t));
  const skinG = Math.floor(lerp(180, 195, t));
  const skinB = Math.floor(lerp(160, 165, t));
  ctx.fillStyle = `rgb(${skinR},${skinG},${skinB})`;

  ctx.beginPath();
  ctx.moveTo(0, -headH);
  ctx.quadraticCurveTo(headW*0.6, -headH, headW, -headH*0.3);
  ctx.quadraticCurveTo(headW + cheekbone, 0, jawW, jawDrop*0.6);
  const chinW = lerp(18, 10, t);
  const chinSharp = lerp(8, 2, t);
  ctx.quadraticCurveTo(jawW*0.8, jawDrop*0.85, chinW, jawDrop);
  ctx.quadraticCurveTo(chinSharp, jawDrop+lerp(4,8,t), 0, jawDrop+lerp(6,10,t));
  ctx.quadraticCurveTo(-chinSharp, jawDrop+lerp(4,8,t), -chinW, jawDrop);
  ctx.quadraticCurveTo(-jawW*0.8, jawDrop*0.85, -jawW, jawDrop*0.6);
  ctx.quadraticCurveTo(-headW - cheekbone, 0, -headW, -headH*0.3);
  ctx.quadraticCurveTo(-headW*0.6, -headH, 0, -headH);
  ctx.fill();

  // CHEEKBONE SHADOWS
  if(t > 0.3) {
    ctx.fillStyle = `rgba(0,0,0,${lerp(0, 0.08, (t-0.3)/0.7)})`;
    ctx.beginPath(); ctx.ellipse(22, 10, 10, 4, 0.2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-22, 10, 10, 4, -0.2, 0, Math.PI*2); ctx.fill();
  }

  // EYES — bug out during stim
  const eyeY = lerp(-4, -8, t);
  const eyeSpacing = lerp(16, 15, t);
  const eyeW = lerp(9, 11, t) + si * 4;           // eyes get HUGE
  const eyeH = lerp(7, 6, t) + si * 5;             // wider vertically too
  const eyeTilt = lerp(0, -0.12, t) + si * Math.sin(time*22) * 0.15;
  const browH = lerp(-13, -17, t) - si * 5;        // brows shoot up
  const browThick = lerp(2, 3, t) + si * 2;
  const browTilt = lerp(0, 0.15, t) + si * Math.sin(time*18) * 0.3;
  // stim eye jitter
  const eyeJitterX = si > 0.4 ? Math.sin(time*40) * si * 3 : 0;
  const eyeJitterY = si > 0.4 ? Math.cos(time*33) * si * 2 : 0;

  // brow ridge shadow
  ctx.fillStyle = `rgba(0,0,0,${lerp(0.03, 0.12, t)})`;
  for(let side of [-1,1]) {
    ctx.beginPath(); ctx.ellipse(side*eyeSpacing, eyeY-3, eyeW+2, lerp(4,6,t), 0, 0, Math.PI*2); ctx.fill();
  }

  for(let side of [-1,1]) {
    ctx.save();
    ctx.translate(side*eyeSpacing + eyeJitterX, eyeY + eyeJitterY);
    ctx.rotate(side * eyeTilt);

    ctx.fillStyle = "#f0ece8";
    ctx.beginPath(); ctx.ellipse(0, 0, eyeW, eyeH, 0, 0, Math.PI*2); ctx.fill();

    // stim: pupil darts around, dilates
    const pupilOffX = si > 0.3 ? Math.sin(time*30+side*2) * si * 3 : 0;
    const pupilOffY = si > 0.3 ? Math.cos(time*26+side) * si * 2 : 0;
    const pupilSize = lerp(2.5, 3, t) + si * 2; // dilated af

    const irisG = Math.floor(lerp(80, 140, t));
    const irisB = Math.floor(lerp(60, 180, t));
    ctx.fillStyle = si > 0.6 ? `rgb(${Math.floor(200+Math.sin(time*20)*55)},${irisG},${irisB})` : `rgb(40,${irisG},${irisB})`;
    ctx.beginPath(); ctx.arc(pupilOffX, pupilOffY, lerp(5, 5.5, t) + si*1.5, 0, Math.PI*2); ctx.fill();

    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.arc(pupilOffX, pupilOffY, pupilSize, 0, Math.PI*2); ctx.fill();

    // bloodshot veins at high stim
    if(si > 0.5) {
      ctx.strokeStyle = `rgba(255,30,30,${si*0.5})`;
      ctx.lineWidth = 0.5;
      for(let v=0;v<4;v++) {
        const a = v*Math.PI/2 + time*2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a)*3, Math.sin(a)*3);
        ctx.lineTo(Math.cos(a)*(eyeW-1), Math.sin(a)*(eyeH-1));
        ctx.stroke();
      }
    }

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath(); ctx.arc(pupilOffX-2, pupilOffY-2, 1.5, 0, Math.PI*2); ctx.fill();

    ctx.strokeStyle = `rgba(40,30,20,${lerp(0.4,0.8,t)})`;
    ctx.lineWidth = lerp(1, 1.5, t);
    ctx.beginPath(); ctx.ellipse(0, -1, eyeW, eyeH*0.7, 0, Math.PI, Math.PI*2); ctx.stroke();

    ctx.restore();

    // EYEBROW
    ctx.save();
    ctx.translate(side*eyeSpacing, browH);
    ctx.rotate(side * browTilt);
    ctx.fillStyle = `rgba(40,30,20,${lerp(0.5,0.9,t)})`;
    ctx.beginPath(); ctx.ellipse(0, 0, eyeW+2, browThick, 0, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }

  // NOSE
  const noseW = lerp(8, 5, t);
  const noseH = lerp(14, 16, t);
  const noseY = lerp(8, 6, t);
  ctx.strokeStyle = `rgba(60,40,30,${lerp(0.2,0.35,t)})`;
  ctx.lineWidth = lerp(1.5, 1, t);
  ctx.beginPath(); ctx.moveTo(0, noseY); ctx.lineTo(0, noseY+noseH); ctx.stroke();
  ctx.beginPath();
  ctx.arc(-noseW*0.5, noseY+noseH, noseW*0.3, 0, Math.PI*2);
  ctx.arc(noseW*0.5, noseY+noseH, noseW*0.3, 0, Math.PI*2);
  ctx.stroke();

  // MOUTH — goes unhinged during stim
  const mouthY = lerp(32, 34, t) + si * 3;
  const mouthW = lerp(12, 10, t) + si * 6;
  const mouthOpen = si * 12; // how far mouth opens
  const lipFullness = lerp(2, 3, t);
  const mouthVibX = si > 0.5 ? Math.sin(time*28) * si * 2 : 0;

  if(si > 0.3) {
    // OPEN MOUTH - dark cavity
    ctx.fillStyle = `rgb(${Math.floor(40-si*30)},${Math.floor(15-si*10)},${Math.floor(20-si*15)})`;
    ctx.beginPath();
    ctx.ellipse(mouthVibX, mouthY + mouthOpen*0.3, mouthW, lipFullness + mouthOpen, 0, 0, Math.PI*2);
    ctx.fill();

    // teeth at high stim
    if(si > 0.5) {
      ctx.fillStyle = "#f0ece0";
      const teethCount = 6;
      for(let i=0;i<teethCount;i++) {
        const tx = mouthVibX + lerp(-mouthW+3, mouthW-3, i/(teethCount-1));
        // top teeth
        ctx.fillRect(tx-1.5, mouthY - mouthOpen*0.1, 3, 3 + si*2);
        // bottom teeth
        ctx.fillRect(tx-1.5, mouthY + mouthOpen*0.5 - si*2, 3, 3 + si*1.5);
      }
    }
  }

  // lips
  ctx.fillStyle = `rgb(${Math.floor(lerp(180,190,t))},${Math.floor(lerp(110,120,t))},${Math.floor(lerp(100,110,t))})`;
  ctx.beginPath(); ctx.ellipse(mouthVibX, mouthY - mouthOpen*0.2, mouthW, lipFullness, 0, Math.PI, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(mouthVibX, mouthY + mouthOpen*0.6, mouthW, lipFullness, 0, 0, Math.PI); ctx.fill();

  if(t > 0.5 && si < 0.3) {
    ctx.strokeStyle = `rgba(140,80,70,${lerp(0,0.4,(t-0.5)*2)})`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(mouthW+2, mouthY-1, 3, 0.5, 1.2); ctx.stroke();
  }

  // HAIR
  const hairColor = `rgb(${Math.floor(lerp(50,30,t))},${Math.floor(lerp(35,22,t))},${Math.floor(lerp(25,18,t))})`;
  ctx.fillStyle = hairColor;
  ctx.beginPath();
  ctx.moveTo(-headW-2, -headH*0.25);
  ctx.quadraticCurveTo(-headW*0.8, -headH-lerp(8,18,t), 0, -headH-lerp(6,16,t));
  ctx.quadraticCurveTo(headW*0.8, -headH-lerp(8,18,t), headW+2, -headH*0.25);
  ctx.quadraticCurveTo(headW, -headH, 0, -headH);
  ctx.quadraticCurveTo(-headW, -headH, -headW-2, -headH*0.25);
  ctx.fill();
  if(t > 0.3) {
    ctx.fillStyle = hairColor;
    for(let i=-3;i<=3;i++) {
      const hx = i*7, hy = -headH - lerp(4,14,t) + Math.sin(i+time*2)*2;
      ctx.beginPath(); ctx.ellipse(hx, hy, 6, lerp(3,6,t), i*0.1, 0, Math.PI*2); ctx.fill();
    }
  }

  // EARS
  ctx.fillStyle = `rgb(${skinR-10},${skinG-10},${skinB-10})`;
  for(let side of [-1,1]) {
    ctx.beginPath(); ctx.ellipse(side*(headW+3), -2, 4, 7, side*0.2, 0, Math.PI*2); ctx.fill();
  }

  // NECK
  const neckW = lerp(14, 16, t);
  ctx.fillStyle = `rgb(${skinR-5},${skinG-5},${skinB-5})`;
  ctx.fillRect(-neckW, jawDrop+lerp(6,10,t)-2, neckW*2, 30);
  if(t > 0.6) {
    ctx.strokeStyle = `rgba(0,0,0,${lerp(0,0.08,(t-0.6)*2.5)})`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-6, jawDrop+12); ctx.lineTo(-10, jawDrop+30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6, jawDrop+12); ctx.lineTo(10, jawDrop+30); ctx.stroke();
  }

  ctx.restore();

  // STIM FACE REDDENING — goes red/purple at high stim
  if(si > 0.3) {
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    const redIntensity = (si - 0.3) / 0.7;
    ctx.fillStyle = `rgba(255,${Math.floor(80-redIntensity*60)},${Math.floor(80-redIntensity*70)},${redIntensity*0.35})`;
    ctx.beginPath();
    ctx.ellipse(W/2, H/2 - 10, 50, 60, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }

  // SWEAT DROPS at high stim
  if(si > 0.5) {
    ctx.fillStyle = `rgba(120,180,255,${si*0.6})`;
    const sweatCount = Math.floor(si * 5);
    for(let i=0;i<sweatCount;i++) {
      const sx = W/2 + Math.sin(time*3+i*7)*25 + (i%2?15:-15);
      const sy = H/2 - 25 + ((time*40 + i*50) % 60);
      ctx.beginPath();
      ctx.ellipse(sx, sy, 1.5, 2.5, 0, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // GLITCH LINES during extreme stim
  if(si > 0.7) {
    const glitchCount = Math.floor((si-0.7)*20);
    for(let i=0;i<glitchCount;i++) {
      const gy = Math.random() * H;
      const gw = 20 + Math.random() * 60;
      const gx = W/2 - gw/2 + (Math.random()-0.5)*40;
      ctx.fillStyle = `rgba(${Math.random()>0.5?'57,255,20':'255,42,109'},${0.1+Math.random()*0.15})`;
      ctx.fillRect(gx, gy, gw, 1 + Math.random()*2);
    }
  }

  // GLOW AURA
  if(t > 0.7) {
    const glowAlpha = lerp(0, 0.15, (t-0.7)/0.3);
    const grad = ctx.createRadialGradient(W/2, H/2, 30, W/2, H/2, 110);
    grad.addColorStop(0, `rgba(57,255,20,${glowAlpha})`);
    grad.addColorStop(1, "rgba(57,255,20,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,W,H);
  }
}

// ============ STIMMING HANDS ============
// stimIntensity: 0-1, time: continuous, doingEmote67: bool
let stimIntensity = 0;
let emote67Timer = 0;
let emote67Active = false;

function drawStimHands(time) {
  const W = 200, H = 240;
  if(stimIntensity <= 0.01 && !emote67Active) return;

  ctx.save();

  const skinR = 220, skinG = 190, skinB = 165;
  const handColor = `rgb(${skinR},${skinG},${skinB})`;

  if(emote67Active) {
    // === EMOTE 67: hands come together, fingers spread, wiggle ===
    const ep = emote67Timer; // 0 to 1 progress
    const baseY = H * 0.75;

    for(let side of [-1, 1]) {
      ctx.save();
      // hands move from sides to center
      const handX = lerp(side * 90, side * 25, Math.min(1, ep * 2));
      const handY = lerp(baseY + 20, baseY - 10, Math.min(1, ep * 2));
      // wiggle once centered
      const wiggle = ep > 0.4 ? Math.sin(time * 25) * 8 * (1 - Math.abs(ep - 0.7) * 2) : 0;
      const fingerSpread = ep > 0.3 ? lerp(0, 1, (ep - 0.3) * 3) : 0;

      ctx.translate(W/2 + handX + wiggle, handY);
      ctx.rotate(side * lerp(0.3, -0.1, Math.min(1, ep * 2)));

      // palm
      ctx.fillStyle = handColor;
      ctx.beginPath();
      ctx.ellipse(0, 0, 10, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // fingers — spread out during emote
      for(let f = 0; f < 5; f++) {
        const baseAngle = lerp(-0.5, 0.5, f / 4) * side;
        const spreadAngle = baseAngle * (1 + fingerSpread * 1.5);
        const fingerLen = f === 2 ? 14 : (f === 1 || f === 3) ? 12 : 9;
        const fWiggle = ep > 0.4 ? Math.sin(time * 20 + f * 1.5) * 3 : 0;

        ctx.save();
        ctx.rotate(spreadAngle + fWiggle * 0.05);
        ctx.fillStyle = handColor;
        ctx.beginPath();
        ctx.ellipse(0, -12 - fingerLen/2, 2.5, fingerLen/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    // 67 text flash
    if(ep > 0.3 && ep < 0.85) {
      ctx.save();
      ctx.font = "bold 16px 'VT323', sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = `rgba(255,0,255,${Math.sin(time*15)*0.3+0.7})`;
      ctx.fillText("67", W/2, H * 0.55);
      ctx.restore();
    }

  } else {
    // === NORMAL STIMMING: hand flapping ===
    const intensity = stimIntensity;
    const baseY = H * 0.78;
    const flapSpeed = lerp(8, 22, intensity);
    const flapAmount = lerp(2, 18, intensity);
    const armVisible = Math.min(1, intensity * 3); // fade in

    for(let side of [-1, 1]) {
      ctx.save();
      ctx.globalAlpha = armVisible;

      const handX = W/2 + side * 55;
      const flapAngle = Math.sin(time * flapSpeed + side * 0.5) * flapAmount;
      const handY = baseY + Math.abs(flapAngle) * 0.3;

      ctx.translate(handX, handY);
      ctx.rotate((flapAngle * Math.PI / 180) * side * -1);

      // wrist/arm stub
      ctx.fillStyle = handColor;
      ctx.beginPath();
      ctx.ellipse(0, 12, 5, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // palm
      ctx.beginPath();
      ctx.ellipse(0, 0, 8, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // fingers — slightly spread, vibrating at high intensity
      for(let f = 0; f < 5; f++) {
        const angle = lerp(-0.4, 0.4, f / 4);
        const fingerLen = f === 2 ? 12 : (f === 1 || f === 3) ? 10 : 7;
        const vibrate = intensity > 0.5 ? Math.sin(time * 30 + f * 2) * lerp(0, 2, (intensity - 0.5) * 2) : 0;

        ctx.save();
        ctx.rotate(angle);
        ctx.translate(vibrate, 0);
        ctx.fillStyle = handColor;
        ctx.beginPath();
        ctx.ellipse(0, -10 - fingerLen/2, 2, fingerLen/2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }
  }

  ctx.restore();
}
