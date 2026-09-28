/* =====================================================================
   自然站姿（不切关节）：把整个人——身体、衣服、头发、小物——的矢量坐标一起轻轻扭成 S 形：
   歪头 · 胯往一边送 · 空闲那条腿膝盖微微内扣 · 一只手稍稍离开身体。
   所有部件用同一个位移场变形，贴合的边还是贴合的，所以没有关节接缝、也不会穿模；线条仍然是矢量，清清楚楚。
   ===================================================================== */
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const WARP_POSES = {
  // head：歪头角度（负 = 头顶往画面左），hip：胯往右送多少，kneeL / kneeR：膝盖往里扣，footL / footR：脚往外撇，armL / armR：手往外摆，tilt：肩膀一高一低
  relax: { head: -7, hip: 7.5, kneeL: 5.4, footL: 2.4, kneeR: 0, footR: 0, armL: 6.5, armR: 2, tilt: .032 },
  shy: { head: 8, hip: -2.6, kneeL: 4.8, footL: 3, kneeR: 4.8, footR: 3, armL: 7, armR: 7, tilt: -.014 }
};
/* 身体轮廓（左半边，对称）：躯干 / 大腿外缘、手臂内缘 → 用来找「手臂和身体之间的空隙」 */
const WARP_GAP = (() => {
  const T = [], A = [];
  for (let y = 0; y <= 620; y++) {
    const t = y < 316 ? torsoL(y) : legO(y), a = y >= 220 && y <= 352 ? armI0(y) : null;
    T[y] = t == null ? null : 150 - t; A[y] = a == null ? null : 150 - a;
  }
  return { T, A };
})();
function armZone(x, y) {           // 1 = 手臂上，0 = 身体上（在两者之间的空隙里平滑过渡）
  const yi = Math.round(Math.max(222, Math.min(350, y))), dT = WARP_GAP.T[yi], dA = WARP_GAP.A[yi];
  if (dT == null || dA == null) return 0;
  const lo = Math.min(dT + 1, dA - 1.4), hi = Math.max(dA - 1, lo + 1.2);
  return sstep(lo, hi, Math.abs(x - 150)) * sstep(206, 232, y) * (1 - sstep(354, 372, y));
}
function warpAt(W, x, y) {
  const H = W.hip;
  // 1) 脊柱：头 → 胯逐渐往右送，腿再收回到脚（脚不离地）
  let sx;
  if (y < 300) sx = H * (.22 + .78 * sstep(168, 300, y));
  else {
    const t = Math.max(0, Math.min(1, (y - 300) / (574 - 300)));
    const kb = sstep(350, 428, y) * (1 - sstep(428, 560, y) * .55), fb = sstep(470, 565, y);     // 膝盖 / 脚的权重
    const left = H * (1 - t) + W.kneeL * kb - W.footL * fb, right = H * (1 - t) - W.kneeR * kb + W.footR * fb;
    const yi = Math.round(Math.max(316, Math.min(574, y))), bw = Math.max(2.4, Math.min(11, (150 - legI(yi)) - 1.2));
    const w = sstep(150 - bw, 150 + bw, x);
    sx = left * (1 - w) + right * w;
  }
  let ux = sx, uy = 0;
  // 2) 手臂：左手往外摆一点，右手稍微离开被推出来的胯
  const az = armZone(x, y);
  if (az) { const k = sstep(205, 345, y) * az; ux += x < 150 ? -W.armL * k : W.armR * k; }
  // 3) 肩膀一高一低（右肩略低，左肩略高）：只作用在肩膀和手臂上，胯以下不动
  const wv = sstep(160, 205, y) * Math.max(1 - sstep(248, 296, y), az);
  uy += W.tilt * (x - 150) * wv;
  // 4) 歪头：绕下巴转，脖子以下渐变消失
  const wh = 1 - sstep(140, 174, y);
  if (wh) {
    const a = W.head * Math.PI / 180, dx = x - 150, dy = y - 154;
    ux += wh * (dx * Math.cos(a) - dy * Math.sin(a) - dx); uy += wh * (dx * Math.sin(a) + dy * Math.cos(a) - dy);
  }
  return [ux, uy];
}

/* 手上拎的包整只跟着手平移（不跟着变形，免得包被拉斜）；其余图层逐层变形 */
function warpLayers(list, W) {
  return list.sort((a, b) => a.z - b.z).map(l => {
    const side = l.id && HELD[l.id];
    if (!side) return warpSVG(l.svg, W);
    const u = warpAt(W, side === 'L' ? 84 : 216, 336);
    return `<g transform="translate(${f2(u[0])} ${f2(u[1])})">${l.svg}</g>`;
  }).join('');
}
/* ---------- 矢量变形：逐个元素把坐标换到画布坐标 → 加位移 → 换回元素自己的坐标 ---------- */
const WARP_SKIP = new Set(['pattern', 'linearGradient', 'radialGradient', 'filter']);
const mMul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
function parseTf(t) {
  let M = [1, 0, 0, 1, 0, 0];
  t.replace(/(translate|rotate|scale|matrix|skewX|skewY)\s*\(([^)]*)\)/g, (m, k, a) => {
    const v = (a.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || []).map(Number); let T;
    if (k === 'translate') T = [1, 0, 0, 1, v[0] || 0, v[1] || 0];
    else if (k === 'scale') T = [v[0], 0, 0, v.length > 1 ? v[1] : v[0], 0, 0];
    else if (k === 'rotate') { const r = v[0] * Math.PI / 180, c = Math.cos(r), s = Math.sin(r), cx = v[1] || 0, cy = v[2] || 0; T = [c, s, -s, c, cx - c * cx + s * cy, cy - s * cx - c * cy]; }
    else if (k === 'matrix') T = v.slice(0, 6);
    else if (k === 'skewX') T = [1, 0, Math.tan(v[0] * Math.PI / 180), 1, 0, 0];
    else T = [1, Math.tan(v[0] * Math.PI / 180), 0, 1, 0, 0];
    M = mMul(M, T); return m;
  });
  return M;
}
const f2 = v => { const r = Math.round(v * 100) / 100; return Object.is(r, -0) ? '0' : String(r); };
function warpSVG(svg, W) {
  const stack = [[1, 0, 0, 1, 0, 0]]; let skip = 0;
  const mkP = M => {                     // 局部坐标点 → 变形后的局部坐标点
    const id = M[0] === 1 && M[1] === 0 && M[2] === 0 && M[3] === 1;
    const det = M[0] * M[3] - M[1] * M[2] || 1, i0 = M[3] / det, i1 = -M[1] / det, i2 = -M[2] / det, i3 = M[0] / det;
    return (x, y) => {
      const X = id ? x + M[4] : M[0] * x + M[2] * y + M[4], Y = id ? y + M[5] : M[1] * x + M[3] * y + M[5];
      const u = warpAt(W, X, Y);
      return id ? [x + u[0], y + u[1]] : [x + i0 * u[0] + i2 * u[1], y + i1 * u[0] + i3 * u[1]];
    };
  };
  return svg.replace(/<(\/?)([a-zA-Z]+)((?:[^>"]|"[^"]*")*?)(\/?)>/g, (m, close, tag, attrs, self) => {
    if (close) { stack.pop(); if (WARP_SKIP.has(tag)) skip--; return m; }
    const tf = /\stransform="([^"]*)"/.exec(attrs), M = tf ? mMul(stack[stack.length - 1], parseTf(tf[1])) : stack[stack.length - 1];
    if (!self) { stack.push(M); if (WARP_SKIP.has(tag)) skip++; }
    if (skip || WARP_SKIP.has(tag)) return m;
    const P = mkP(M);
    let a = attrs;
    if (tag === 'path') a = a.replace(/(\sd=")([^"]*)"/, (q, pre, d) => pre + warpPath(d, P) + '"');
    else if (tag === 'circle' || tag === 'ellipse') {
      const cx = +(/\scx="([^"]*)"/.exec(a) || [0, 0])[1], cy = +(/\scy="([^"]*)"/.exec(a) || [0, 0])[1], q = P(cx, cy);
      a = setAttr(setAttr(a, 'cx', q[0]), 'cy', q[1]);
    } else if (tag === 'rect' || tag === 'image' || tag === 'text') {
      const x = +(/\sx="([^"]*)"/.exec(a) || [0, 0])[1], y = +(/\sy="([^"]*)"/.exec(a) || [0, 0])[1];
      const w = tag === 'text' ? 0 : +(/\swidth="([^"]*)"/.exec(a) || [0, 0])[1], h = tag === 'text' ? 0 : +(/\sheight="([^"]*)"/.exec(a) || [0, 0])[1];
      if (w > 200 || h > 200) return m;                     // 整块底板（蒙版底色之类）不动
      const q = P(x + w / 2, y + h / 2); a = setAttr(setAttr(a, 'x', q[0] - w / 2), 'y', q[1] - h / 2);
    } else if (tag === 'line') {
      const g = k => +(new RegExp(`\\s${k}="([^"]*)"`).exec(a) || [0, 0])[1], p1 = P(g('x1'), g('y1')), p2 = P(g('x2'), g('y2'));
      a = setAttr(setAttr(setAttr(setAttr(a, 'x1', p1[0]), 'y1', p1[1]), 'x2', p2[0]), 'y2', p2[1]);
    } else if (tag === 'polygon' || tag === 'polyline') {
      a = a.replace(/(\spoints=")([^"]*)"/, (q, pre, pts) => { const n = pts.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [], o = []; for (let i = 0; i + 1 < n.length; i += 2) { const r = P(+n[i], +n[i + 1]); o.push(f2(r[0]) + ' ' + f2(r[1])); } return pre + o.join(' ') + '"'; });
    }
    return `<${tag}${a}${self}>`;
  });
}
function setAttr(a, k, v) {
  const re = new RegExp(`(\\s${k}=")([^"]*)"`);
  return re.test(a) ? a.replace(re, (m, p) => p + f2(v) + '"') : a + ` ${k}="${f2(v)}"`;
}
/* 路径：全部换成绝对坐标；长直线 / 长曲线先细分，保证弯得顺 */
const SEG_L = 7, SEG_C = 12;
function warpPath(d, P) {
  const tk = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi);
  if (!tk) return d;
  const out = []; let i = 0, cmd = '', cx = 0, cy = 0, sx = 0, sy = 0, lc = null, lq = null;
  const num = () => +tk[i++], pt = (x, y) => { const q = P(x, y); return f2(q[0]) + ' ' + f2(q[1]); };
  const line = (x, y) => { const n = Math.min(24, Math.ceil(Math.hypot(x - cx, y - cy) / SEG_L)); for (let k = 1; k <= n; k++) out.push('L', pt(cx + (x - cx) * k / n, cy + (y - cy) * k / n)); cx = x; cy = y; };
  const cubic = (p0, p1, p2, p3, dep) => {
    const ext = Math.max(Math.abs(p3[0] - p0[0]) + Math.abs(p3[1] - p0[1]), Math.abs(p1[0] - p0[0]) + Math.abs(p1[1] - p0[1]) + Math.abs(p2[0] - p3[0]) + Math.abs(p2[1] - p3[1]));
    if (ext > SEG_C && dep < 4) {
      const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], a = m(p0, p1), b = m(p1, p2), c = m(p2, p3), e = m(a, b), f = m(b, c), g = m(e, f);
      cubic(p0, a, e, g, dep + 1); cubic(g, f, c, p3, dep + 1); return;
    }
    out.push('C', pt(p1[0], p1[1]), pt(p2[0], p2[1]), pt(p3[0], p3[1]));
  };
  while (i < tk.length) {
    if (/[a-z]/i.test(tk[i])) cmd = tk[i++];
    else if (!cmd) { i++; continue; }
    const rel = cmd === cmd.toLowerCase() && cmd !== 'z' ? 1 : 0, C = cmd.toUpperCase(), ox = rel ? cx : 0, oy = rel ? cy : 0;
    if (C === 'Z') { out.push('Z'); cx = sx; cy = sy; lc = lq = null; if (i < tk.length && !/[a-z]/i.test(tk[i])) cmd = 'L'; continue; }
    if (C === 'M') { const x = num() + ox, y = num() + oy; out.push('M', pt(x, y)); cx = sx = x; cy = sy = y; cmd = rel ? 'l' : 'L'; lc = lq = null; continue; }
    if (C === 'L') { line(num() + ox, num() + oy); lc = lq = null; continue; }
    if (C === 'H') { line(num() + ox, cy); lc = lq = null; continue; }
    if (C === 'V') { line(cx, num() + oy); lc = lq = null; continue; }
    if (C === 'C' || C === 'S') {
      let p1;
      if (C === 'C') p1 = [num() + ox, num() + oy]; else p1 = lc ? [2 * cx - lc[0], 2 * cy - lc[1]] : [cx, cy];
      const p2 = [num() + ox, num() + oy], p3 = [num() + ox, num() + oy];
      cubic([cx, cy], p1, p2, p3, 0); lc = p2; lq = null; cx = p3[0]; cy = p3[1]; continue;
    }
    if (C === 'Q' || C === 'T') {
      let q1;
      if (C === 'Q') q1 = [num() + ox, num() + oy]; else q1 = lq ? [2 * cx - lq[0], 2 * cy - lq[1]] : [cx, cy];
      const p3 = [num() + ox, num() + oy];
      cubic([cx, cy], [cx + (q1[0] - cx) * 2 / 3, cy + (q1[1] - cy) * 2 / 3], [p3[0] + (q1[0] - p3[0]) * 2 / 3, p3[1] + (q1[1] - p3[1]) * 2 / 3], p3, 0);
      lq = q1; lc = null; cx = p3[0]; cy = p3[1]; continue;
    }
    if (C === 'A') {
      const rx = num(), ry = num(), rot = num(), la = num(), sw = num(), x = num() + ox, y = num() + oy;
      out.push('A', f2(rx), f2(ry), f2(rot), la, sw, pt(x, y)); cx = x; cy = y; lc = lq = null; continue;
    }
    i++;
  }
  return out.join(' ');
}
