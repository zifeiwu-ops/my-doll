/* =====================================================================
   画风常量 · 千禧少女贴纸风（对齐 Y2K COLLECTION SPRITE SHEET v1.0）
   近黑暖色描边 + 平涂 + 同色系正片叠底阴影（光从左上来，阴影落在右下）+ 细褶皱线
   ===================================================================== */
const INK = '#2B2322';
const SKIN = '#FFEBE1';
const SH = '#E7CFD6';      // 正片叠底阴影色
const SH_DEEP = '#CFB2C0';
let _uid = 0;
const uid = p => (p || 'c') + (++_uid);
const f1 = n => +n.toFixed(1);

/* 路径可附带自动垂坠褶皱（String 对象 + .folds），piece() 会自动画上；mir() 会一起镜像 */
const withFolds = (d, folds) => { const o = new String(d); o.folds = folds; return o; };
function mir(d) {
  if (d && d.folds) return withFolds(mir(String(d)), d.folds.map(mir));
  return d.replace(/([MLCQmlcq])([^MLCQZmlcqz]*)/g, (m, cmd, args) => {
    const nums = args.trim().split(/[\s,]+/).filter(Boolean).map(Number);
    const abs = cmd === cmd.toUpperCase();
    return cmd + ' ' + nums.map((n, i) => (i % 2 === 0 ? +(abs ? 300 - n : -n).toFixed(2) : n)).join(' ') + ' ';
  });
}
const mx = p => [300 - p[0], p[1], p[2]];

/* 平滑曲线：点列 → 三次贝塞尔（Catmull-Rom）。点可带第三项 'c' 表示尖角 */
/* SOFT > 0 时，标了 'c' 的尖角也带一点圆弧（画头发时打开：发梢柔软、不扎手） */
let SOFT = 0;
function spline(pts, closed = true, t = .5) {
  const n = pts.length, P = i => pts[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M ${f1(pts[0][0])} ${f1(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    const k1 = p1[2] === 'c' ? t * SOFT : t, k2 = p2[2] === 'c' ? t * SOFT : t;
    const c1 = [p1[0] + (p2[0] - p0[0]) * k1 / 3, p1[1] + (p2[1] - p0[1]) * k1 / 3];
    const c2 = [p2[0] - (p3[0] - p1[0]) * k2 / 3, p2[1] - (p3[1] - p1[1]) * k2 / 3];
    d += ` C ${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d + (closed ? ' Z' : '');
}
/* 左右对称闭合形状：只给左半边（从中线上端开始，沿左侧绕到中线下端） */
const symS = (left, t) => spline(left.concat(left.slice(1, -1).reverse().map(mx)), true, t);
/* 开放的平滑线 */
const line = (pts, t) => spline(pts, false, t);

/* ---------------------------------------------------------------------
   一块布片：平涂 → 自动轮廓阴影（右下月牙）→ 手绘阴影 → 褶皱线 → 高光 → 描边
   o.rim = [dx, dy] 月牙阴影偏移（默认 [4.5, 2.5]；false 关掉）
   --------------------------------------------------------------------- */
/* 统一画风（对齐 Y2K COLLECTION SPRITE SHEET）：和身体一样的深棕描边、偏暖的粉紫阴影（边缘略柔）、
   很淡的内侧高光；褶皱线画成两头尖的笔触（像手绘勾线），不再是一样粗的死线 */
const STYLE = { line: '#3D3134', sw: .85, shade: '#E2C0CE', lit: false, litOp: .2, foldW: .52, foldOp: .42, foldShadeW: 4.4, foldShadeOp: .62, brush: true, volOp: .95 };
/* 布料的底色（给褶皱线配同色系的深色） */
function baseOf(fill) {
  if (!fill || typeof fill !== 'string') return null;
  if (/^#[0-9a-f]{6}$/i.test(fill)) return fill;
  const m = fill.match(/url\(#(pat|grad)-([\w-]+)\)/); if (!m || typeof PAT_BASE === 'undefined') return null;
  const b = (m[1] === 'pat' ? PAT_BASE : GRAD_BASE)[m[2]]; return b && /^#[0-9a-f]{6}$/i.test(b) ? b : null;
}
const foldInk = fill => { const b = baseOf(fill); return b ? mix(b, '#3B2430', .56) : STYLE.line; };
/* 沿中心线的锥形：两头尖，head 处最宽 */
function taperD(P, w, head = .7) {
  const n = P.length - 1, L = [], R = [];
  P.forEach((p, i) => {
    const a = P[Math.max(0, i - 1)], b = P[Math.min(n, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    const t = i / n, f = t < head ? t / head * .5 : .5 + (t - head) / (1 - head) * .5, ww = w * Math.pow(Math.max(0, Math.sin(Math.PI * f)), .75) / 2;
    L.push([p[0] + nx * ww, p[1] + ny * ww]); R.push([p[0] - nx * ww, p[1] - ny * ww]);
  });
  return 'M ' + L.map(P2).join(' L ') + ' L ' + R.reverse().map(P2).join(' L ') + ' Z';
}
/* 把 M/L/Q/C/H/V 组成的路径拆成若干条折线（给笔触用）；遇到不认识的命令返回 null */
function pathPolys(d) {
  const tk = String(d).match(/[MLQCHVZmlqchvz]|-?\d*\.?\d+(?:e[-+]?\d+)?/g); if (!tk) return null;
  const out = []; let cur = null, x = 0, y = 0, cmd = null, i = 0;
  const num = () => +tk[i++];
  while (i < tk.length) {
    if (/[A-Za-z]/.test(tk[i])) cmd = tk[i++];
    if (!cmd) return null;
    const rel = cmd === cmd.toLowerCase(), C = cmd.toUpperCase();
    if (C === 'Z') { if (cur && cur.length) cur.push(cur[0].slice()); cmd = null; continue; }
    if (C !== 'M' && !cur) return null;
    if (C === 'M') { let a = num(), b = num(); if (rel) { a += x; b += y; } x = a; y = b; cur = [[x, y]]; out.push(cur); cmd = rel ? 'l' : 'L'; continue; }
    if (C === 'L') { let a = num(), b = num(); if (rel) { a += x; b += y; } x = a; y = b; cur.push([x, y]); continue; }
    if (C === 'H') { let a = num(); if (rel) a += x; x = a; cur.push([x, y]); continue; }
    if (C === 'V') { let b = num(); if (rel) b += y; y = b; cur.push([x, y]); continue; }
    if (C === 'Q') { let a = num(), b = num(), c = num(), e = num(); if (rel) { a += x; b += y; c += x; e += y; }
      for (let k = 1; k <= 6; k++) { const t = k / 6, u = 1 - t; cur.push([u * u * x + 2 * u * t * a + t * t * c, u * u * y + 2 * u * t * b + t * t * e]); } x = c; y = e; continue; }
    if (C === 'C') { let a = num(), b = num(), c = num(), e = num(), g = num(), h = num(); if (rel) { a += x; b += y; c += x; e += y; g += x; h += y; }
      for (let k = 1; k <= 8; k++) { const t = k / 8, u = 1 - t; cur.push([u * u * u * x + 3 * u * u * t * a + 3 * u * t * t * c + t * t * t * g, u * u * u * y + 3 * u * u * t * b + 3 * u * t * t * e + t * t * t * h]); } x = g; y = h; continue; }
    return null;
  }
  return out.some(p => p.some(q => isNaN(q[0]) || isNaN(q[1]))) ? null : out;
}
const resamp = (P, n = 10) => { const seg = [], L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); const T = L[L.length - 1] || 1, out = []; let j = 0;
  for (let k = 0; k <= n; k++) { const s = T * k / n; while (j < P.length - 2 && L[j + 1] < s) j++; const t = (s - L[j]) / ((L[j + 1] - L[j]) || 1); out.push([P[j][0] + (P[j + 1][0] - P[j][0]) * t, P[j][1] + (P[j + 1][1] - P[j][1]) * t]); } return out; };
/* 一条线 → 两头尖的笔触（填充路径） */
function brushD(d, w, head = .55) { const S = pathPolys(d); if (!S) return null; const P = S.filter(p => p.length > 1); return P.length ? P.map(p => taperD(resamp(p, 10), w, head)).join(' ') : null; }

function piece(d, fill, o = {}) {
  if (d && d.folds) { if (o.autoFolds !== false) o = { ...o, folds: (o.folds || []).concat(d.folds) }; d = String(d); }
  const id = uid('k');
  const sc = o.sc || STYLE.shade;
  const fr = o.evenodd ? ' fill-rule="evenodd" clip-rule="evenodd"' : '';
  let inner = `<path d="${d}" fill="${fill}"${fr}/>` + (o.under || '');
  const rim = o.rim === false ? null : (o.rim || [4.5, 2.5]);
  /* 体积感阴影（对齐参考图）：不是一道硬边月牙，而是从布片右下边缘往里、柔和过渡的一层喷枪式阴影 */
  if (rim) inner += `<path d="${d}" fill="${sc}" filter="url(#${rim[0] > 3 ? 'vol' : 'vols'})" style="mix-blend-mode:multiply" opacity="${o.volOp ?? STYLE.volOp}"${fr}/>`;
  const lit = o.lit === false ? null : (o.lit || (STYLE.lit ? [1.9, 1.7] : null));
  if (lit && o.litOp == null && !o.lit) o = { ...o, litOp: STYLE.litOp };
  if (lit) {
    const lid = uid('m');
    inner += `<mask id="${lid}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="340" height="640"><rect x="-20" y="-20" width="340" height="640" fill="#fff"/><path d="${d}" transform="translate(${lit[0]} ${lit[1]})" fill="#000"${fr}/></mask>` +
      `<path d="${d}" fill="#fff" mask="url(#${lid})" opacity="${o.litOp ?? .32}"${fr}/>`;
  }
  (o.shade || []).forEach(p => inner += `<path d="${p}" fill="${sc}" style="mix-blend-mode:multiply" filter="url(#shsoft2)"/>`);
  (o.deep || []).forEach(p => inner += `<path d="${p}" fill="${o.dc || SH_DEEP}" style="mix-blend-mode:multiply" filter="url(#shsoft)" opacity=".85"/>`);
  if (o.sheen) inner += `<g filter="url(#soft)">${o.sheen.map(p => `<path d="${p}" fill="none" stroke="#fff" stroke-width="${o.sheenW || 4}" stroke-linecap="round" opacity="${o.sheenOp ?? .5}"/>`).join('')}</g>`;
  if ((o.folds || []).length) {
    if (o.foldShade !== false) inner += `<g filter="url(#shsoft2)" style="mix-blend-mode:multiply" opacity="${STYLE.foldShadeOp}">${o.folds.map(p => `<path d="${p}" fill="none" stroke="${sc}" stroke-width="${STYLE.foldShadeW}" stroke-linecap="round" transform="translate(1.4 .6)"/>`).join('')}</g>`;
    const fc = o.fc || foldInk(fill);
    inner += o.folds.map(p => { const b = STYLE.brush && o.brush !== false ? brushD(p, (o.fw || STYLE.foldW) * 1.9) : null;
      return b ? `<path d="${b}" fill="${fc}" opacity="${o.foldOp ?? STYLE.foldOp}"/>` : `<path d="${p}" fill="none" stroke="${fc}" stroke-width="${o.fw || STYLE.foldW}" stroke-linecap="round" opacity="${o.foldOp ?? STYLE.foldOp}"/>`; }).join('');
  }
  (o.lines || []).forEach(l => { const b = l.taper && STYLE.brush ? brushD(l.d, (l.w || 1) * 1.9, l.head ?? .4) : null;
    inner += b ? `<path d="${b}" fill="${l.c || INK}" opacity="${l.o ?? .8}"/>` : `<path d="${l.d}" fill="none" stroke="${l.c || STYLE.line}" stroke-width="${f1((l.w || 1) * .78)}" stroke-linecap="round" stroke-linejoin="round"${l.dash ? ` stroke-dasharray="${l.dash}"` : ''} opacity="${l.o ?? .8}"/>`; });
  (o.gloss || []).forEach(p => inner += `<path d="${p}" fill="none" stroke="#fff" stroke-width="${o.glossW || 1.4}" stroke-linecap="round" opacity="${o.glossOp ?? .85}"/>`);
  inner += o.over || '';
  const side = armSide(d);
  if (side) return `<!--arm${side}-->` + pieceOut(id, d, fr, inner, o) + `<!--/arm${side}-->`;
  return pieceOut(id, d, fr, inner, o);
}
/* 自动认出袖子：整块都落在一侧手臂那边（不过中线、贴着手臂）的布片 = 袖子 / 袖口，换姿势时跟着手臂走 */
function armSide(d) {
  if (/[a-y]/.test(d.replace(/[eE][-+]?\d/g, ''))) return null;
  const n = d.match(/-?\d*\.?\d+/g); if (!n || n.length < 6) return null;
  let x0 = 1e9, x1 = -1e9, y0 = 1e9;
  for (let i = 0; i + 1 < n.length; i += 2) { const x = +n[i], y = +n[i + 1]; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; }
  if (y0 < 160) return null;
  if (x1 <= 128 && x0 < 110) return 'L';
  if (x0 >= 172 && x1 > 190) return 'R';
  return null;
}
function pieceOut(id, d, fr, inner, o) {
  return `<clipPath id="${id}"><path d="${d}"${fr}/></clipPath><g clip-path="url(#${id})">${inner}</g>` +
    `<path${o.cls ? ` class="${o.cls}"` : ''} d="${d}" fill="none" stroke="${o.oc || STYLE.line}" stroke-width="${o.sw ?? STYLE.sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
}
var strap = (d, fill, w = 2.4) => `<path d="${d}" stroke="${STYLE.line}" stroke-width="${f1(w + 1.7)}" stroke-linecap="round" fill="none"/><path d="${d}" stroke="${fill}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
const star4 = (x, y, r, c, line = true) => `<path d="M ${x} ${y - r} C ${x + r * .12} ${y - r * .25} ${x + r * .25} ${y - r * .12} ${x + r} ${y} C ${x + r * .25} ${y + r * .12} ${x + r * .12} ${y + r * .25} ${x} ${y + r} C ${x - r * .12} ${y + r * .25} ${x - r * .25} ${y + r * .12} ${x - r} ${y} C ${x - r * .25} ${y - r * .12} ${x - r * .12} ${y - r * .25} ${x} ${y - r} Z" fill="${c}"${line ? ` stroke="${INK}" stroke-width=".8"` : ''}/>`;
const glint = (x, y, r = 3) => star4(x, y, r, '#fff', false);
/* 圆角五角星（贴纸款：描边 + 内侧高光） */
function star5(x, y, r, c, sw = 1, rot = 0) {
  let p = '';
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + rot + i * Math.PI / 5, rr = i % 2 ? r * .48 : r; p += `${i ? 'L' : 'M'} ${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)} `; }
  return `<path d="${p}Z" fill="${c}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M ${f1(x - r * .42)} ${f1(y - r * .12)} L ${f1(x - r * .12)} ${f1(y - r * .5)}" stroke="#fff" stroke-width="${f1(Math.max(.6, r * .16))}" stroke-linecap="round" opacity=".85"/>`;
}
function flower(x, y, r, c) { let s = ''; for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5 - Math.PI / 2; s += `<circle cx="${f1(x + Math.cos(a) * r)}" cy="${f1(y + Math.sin(a) * r)}" r="${f1(r * .72)}" fill="${c}" stroke="${INK}" stroke-width=".7"/>`; } return s + `<circle cx="${x}" cy="${y}" r="${f1(r * .55)}" fill="#FFE27A" stroke="${INK}" stroke-width=".7"/>`; }
/* 四叶草（参考图：鲜绿、心形叶、深绿叶脉、卷曲的茎） */
function clover(x, y, r, rot = 0, stem = true) {
  const leaf = a => `<path d="M 0 0 C ${-r * .95} ${-r * .25} ${-r * 1.05} ${-r * 1.3} ${-r * .32} ${-r * 1.25} C ${-r * .05} ${-r * 1.22} 0 ${-r * .9} 0 ${-r * .78} C 0 ${-r * .9} ${r * .05} ${-r * 1.22} ${r * .32} ${-r * 1.25} C ${r * 1.05} ${-r * 1.3} ${r * .95} ${-r * .25} 0 0 Z" transform="rotate(${a})" fill="#5DBE4A" stroke="${INK}" stroke-width="${f1(Math.min(1, r * .16))}" stroke-linejoin="round"/><path d="M 0 ${-r * .15} L 0 ${-r * .7}" transform="rotate(${a})" stroke="#3E8E34" stroke-width="${f1(r * .1)}" stroke-linecap="round"/>`;
  const st = stem ? `<path d="M 0 0 C ${r * .3} ${r * .9} ${r * .1} ${r * 1.5} ${r * .7} ${r * 1.9} C ${r * 1.1} ${r * 2.1} ${r * 1.3} ${r * 1.7} ${r * 1} ${r * 1.55}" fill="none" stroke="${INK}" stroke-width="${f1(r * .28 + .9)}" stroke-linecap="round"/><path d="M 0 0 C ${r * .3} ${r * .9} ${r * .1} ${r * 1.5} ${r * .7} ${r * 1.9} C ${r * 1.1} ${r * 2.1} ${r * 1.3} ${r * 1.7} ${r * 1} ${r * 1.55}" fill="none" stroke="#5DBE4A" stroke-width="${f1(r * .28)}" stroke-linecap="round"/>` : '';
  return `<g transform="translate(${x} ${y}) rotate(${rot})">${st}${[45, 135, 225, 315].map(leaf).join('')}<path d="M ${-r * .55} ${-r * .8} Q ${-r * .35} ${-r * 1} ${-r * .12} ${-r * .92}" transform="rotate(-45)" fill="none" stroke="#C9F2A8" stroke-width="${f1(r * .12)}" stroke-linecap="round"/></g>`;
}
/* 衣服上的印花四叶草（参考图：没有黑描边、浅绿、细细的卷曲茎，像印上去的） */
function printClover(x, y, r) {
  const leaf = a => `<path d="M 0 0 C ${-r * .95} ${-r * .25} ${-r * 1.05} ${-r * 1.3} ${-r * .32} ${-r * 1.25} C ${-r * .05} ${-r * 1.22} 0 ${-r * .9} 0 ${-r * .78} C 0 ${-r * .9} ${r * .05} ${-r * 1.22} ${r * .32} ${-r * 1.25} C ${r * 1.05} ${-r * 1.3} ${r * .95} ${-r * .25} 0 0 Z" transform="rotate(${a})" fill="#80C06A" stroke="#5E9A50" stroke-width=".5" stroke-linejoin="round"/>`;
  const stem = `M 0 ${f1(r * .3)} C ${f1(r * .1)} ${f1(r * 1.4)} ${f1(-r * .5)} ${f1(r * 2.1)} ${f1(-r * 1)} ${f1(r * 2.5)} C ${f1(-r * 1.6)} ${f1(r * 2.9)} ${f1(-r * 1.9)} ${f1(r * 2.2)} ${f1(-r * 1.4)} ${f1(r * 1.9)} C ${f1(-r * 1)} ${f1(r * 1.7)} ${f1(-r * .8)} ${f1(r * 2.1)} ${f1(-r * 1.05)} ${f1(r * 2.3)}`;
  return `<g transform="translate(${x} ${y})" opacity=".92"><path d="${stem}" fill="none" stroke="#9AC79A" stroke-width=".9" stroke-linecap="round"/>${[45, 135, 225, 315].map(leaf).join('')}</g>`;
}
const heartD = (x, y, r) => `M ${f1(x)} ${f1(y + r * .95)} C ${f1(x - r * 1.1)} ${f1(y + r * .25)} ${f1(x - r * 1.15)} ${f1(y - r * .55)} ${f1(x - r * .6)} ${f1(y - r * .72)} C ${f1(x - r * .25)} ${f1(y - r * .82)} ${f1(x)} ${f1(y - r * .55)} ${f1(x)} ${f1(y - r * .32)} C ${f1(x)} ${f1(y - r * .55)} ${f1(x + r * .25)} ${f1(y - r * .82)} ${f1(x + r * .6)} ${f1(y - r * .72)} C ${f1(x + r * 1.15)} ${f1(y - r * .55)} ${f1(x + r * 1.1)} ${f1(y + r * .25)} ${f1(x)} ${f1(y + r * .95)} Z`;
const heart = (x, y, r, c, sw = .9) => `<path d="${heartD(x, y, r)}" fill="${c}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/><path d="M ${f1(x - r * .62)} ${f1(y - r * .2)} Q ${f1(x - r * .55)} ${f1(y - r * .5)} ${f1(x - r * .3)} ${f1(y - r * .52)}" fill="none" stroke="#fff" stroke-width="${f1(Math.max(.6, r * .16))}" stroke-linecap="round" opacity=".85"/>`;
/* 旧接口保留：左右对称路径（只写左半边） */
function sym(start, segs) {
  const pts = [start];
  let d = `M ${start[0]} ${start[1]}`;
  segs.forEach(s => { d += (s.length === 6 ? ' C ' : s.length === 4 ? ' Q ' : ' L ') + s.join(' '); pts.push(s.slice(-2)); });
  const m = p => `${+(300 - p[0]).toFixed(2)} ${p[1]}`;
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i], prev = pts[i];
    if (s.length === 6) d += ` C ${m([s[2], s[3]])} ${m([s[0], s[1]])} ${m(prev)}`;
    else if (s.length === 4) d += ` Q ${m([s[0], s[1]])} ${m(prev)}`;
    else d += ` L ${m(prev)}`;
  }
  return d + ' Z';
}
const fm = (...ds) => ds.flatMap(d => [d, mir(d)]);
