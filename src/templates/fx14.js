/* =====================================================================
   布料细节工具（第二版 Coquette 起用，参考秀场与杂志的服装插画）
   · 自然下摆：一段段向前鼓的布 + 往里收的褶，偶尔翻出里布
   · 锥形褶：两头尖、中间宽的柔和阴影 + 靠下一段细线（手绘感，不是一根死直线）
   · 蕾丝花边（扇贝 + 镂空花 + picot 小点）、抽褶蜂巢、珍珠串、立体蝴蝶结、泡泡袖、荷叶边
   ===================================================================== */
const RNG = seed => { let s = (seed * 2654435761) >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
const lerp = (a, b, t) => a + (b - a) * t;
const P2 = p => `${f1(p[0])} ${f1(p[1])}`;
const mxp = p => [300 - p[0], p[1]];
const mf = f => [300 - f[0], f[1], 300 - f[2], f[3], -(f[4] || 0), ...f.slice(5)];
const fm2 = L => L.concat(L.map(mf));
const armWrap = (k, svg) => `<!--arm${k}-->${svg}<!--/arm${k}-->`;

/* 褶的中心线：从 (x0,y0) 到 (x1,y1)，bend 让它带一点 S 弯 */
function foldPts(x0, y0, x1, y1, bend = 0, n = 10) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const C = [[x0, y0], [x0 + dx * .33 + nx * bend, y0 + dy * .33 + ny * bend], [x0 + dx * .68 - nx * bend * .5, y0 + dy * .68 - ny * bend * .5], [x1, y1]];
  return Array.from({ length: n + 1 }, (_, i) => bzp(C, i / n));
}
/* 一组褶：[x0, y0, x1, y1, bend, 宽, 细线从哪里开始(0–1), 最宽处(0–1)] */
function drapeSVG(list, o = {}) {
  if (!list || !list.length) return '';
  if (STYLE.crisp && typeof foldCel === 'function') {                    // 统一成硬边阴影 + 细实线（和重画后的衣服一个画法）
    let c = '', l = '';
    list.forEach(f => { const P = foldPts(f[0], f[1], f[2], f[3], f[4] || 0, 10), d = 'M ' + P.map(P2).join(' L '); c += `<path d="${foldCel(d, (f[5] ?? 3.2) * .8)}"/>`;
      const Q = P.slice(Math.min(8, Math.round((f[6] ?? .3) * 10))); l += `<path d="M ${Q.map(P2).join(' L ')}"/>`; });
    return `<g fill="${CEL}" opacity=".42" style="mix-blend-mode:multiply">${c}</g><g fill="none" stroke="${o.lc || STYLE.line}" stroke-width=".55" stroke-linecap="round" opacity="${Math.min(.6, o.lo ?? .5)}">${l}</g>`;
  }
  let sh = '', ln = '';
  list.forEach(f => {
    const P = foldPts(f[0], f[1], f[2], f[3], f[4] || 0, 10), w = f[5] ?? 3.2;
    sh += `<path d="${taperD(P, w, f[7] ?? .72)}"/>`;
    const Q = P.slice(Math.min(8, Math.round((f[6] ?? .3) * 10)));
    ln += `<path d="${foldBrush('M ' + Q.map(P2).join(' L '), (o.lw ?? .62) * 1.9) || taperD(resamp(Q, 10), (o.lw ?? .62) * 1.9, .6)}"/>`;
  });
  return `<g fill="${o.sc || '#D9C2D0'}" opacity="${o.op ?? .85}" style="mix-blend-mode:multiply" filter="url(#shsoft)">${sh}</g>` +
    `<g fill="${o.lc || STYLE.line}" opacity="${o.lo ?? .72}">${ln}</g>`;
}
/* 高光：沿布料鼓起处的柔和亮带 */
const glowSVG = (ds, op = .5, w = 3.6) => `<g fill="none" stroke="#fff" stroke-width="${w}" stroke-linecap="round" opacity="${op}" filter="url(#soft)">${ds.map(d => `<path d="${d}"/>`).join('')}</g>`;

/* 沿折线等距取点（带法线），dir 决定法线朝哪一侧 */
function alongPts(pts, step, dir = [0, 1]) {
  const seg = []; let L = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
  const N = Math.max(1, Math.round(L / step)), out = [];
  for (let k = 0; k <= N; k++) {
    let s = L * k / N, i = 0; while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; }
    const a = pts[i], b = pts[i + 1], t = Math.min(1, s / (seg[i] || 1)), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    let nx = -dy / l, ny = dx / l; if (nx * dir[0] + ny * dir[1] < 0) { nx = -nx; ny = -ny; }
    out.push([a[0] + dx * t, a[1] + dy * t, nx, ny]);
  }
  return out;
}
/* 蕾丝花边：pts 是花边上沿，扇贝朝 dir 那一侧挂出去 */
function laceTrim(pts, h = 4, c = '#FFFDF8', o = {}) {
  const A = alongPts(pts, o.sw ?? h * 1.55, o.dir), hc = o.hc || (c.startsWith('#') ? mix(c, '#7A5A62', .32) : '#DCCBCB');
  const off = (p, k) => [p[0] + p[2] * h * k, p[1] + p[3] * h * k];
  let d = 'M ' + A.map(P2).join(' L '), holes = '', pic = '', band = 'M ' + A.map(p => P2(off(p, .36))).join(' L ');
  d += ' L ' + P2(off(A[A.length - 1], .42));
  for (let k = A.length - 1; k > 0; k--) {
    const a = A[k], b = A[k - 1], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, (a[3] + b[3]) / 2];
    d += ` Q ${P2(off(m, 1.55))} ${P2(off(b, .42))}`;
    holes += `<circle cx="${f1(m[0] + m[2] * h * .66)}" cy="${f1(m[1] + m[3] * h * .66)}" r="${f1(h * .19)}"/>`;
    pic += `<circle cx="${f1(m[0] + m[2] * h * 1.02)}" cy="${f1(m[1] + m[3] * h * 1.02)}" r="${f1(h * .075 + .2)}"/>`;
    if (h > 3) { const q = [(m[0] + a[0]) / 2, (m[1] + a[1]) / 2, m[2], m[3]]; holes += `<circle cx="${f1(q[0] + q[2] * h * .55)}" cy="${f1(q[1] + q[3] * h * .55)}" r="${f1(h * .08)}"/>`; }
  }
  d += ' Z';
  return `<path d="${d}" fill="${c}" stroke="${o.oc || STYLE.line}" stroke-width="${o.w ?? .6}" stroke-linejoin="round"/>` +
    `<path d="${band}" fill="none" stroke="${hc}" stroke-width=".45" stroke-dasharray=".7 .8"/>` +
    `<g fill="none" stroke="${hc}" stroke-width=".5">${holes}</g><g fill="${hc}">${pic}</g>`;
}
/* 珍珠 */
const pearlDot = (x, y, r) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="url(#grad-pearl)" stroke="${STYLE.line}" stroke-width=".45"/><circle cx="${f1(x - r * .34)}" cy="${f1(y - r * .36)}" r="${f1(r * .28)}" fill="#fff"/>`;
const pearlRow = (pts, r = 1.4, gap = 2.15) => alongPts(pts, r * gap).map(p => pearlDot(p[0], p[1], r)).join('');
/* 蜂巢抽褶：一排排小针脚 + 针脚之间鼓起的布 */
function smockSVG(x0, x1, y0, y1, dx = 5.4, dy = 4.6, c = STYLE.line) {
  let st = '', pk = '', row = 0;
  for (let y = y0; y <= y1; y += dy, row++) for (let x = x0 + (row % 2) * dx / 2; x <= x1; x += dx) {
    st += `M ${f1(x - .9)} ${f1(y)} l 1.8 0 `;
    pk += `M ${f1(x)} ${f1(y + .4)} Q ${f1(x + dx * .26)} ${f1(y + dy * .5)} ${f1(x + dx * .5)} ${f1(y + dy - .3)} M ${f1(x)} ${f1(y + .4)} Q ${f1(x - dx * .26)} ${f1(y + dy * .5)} ${f1(x - dx * .5)} ${f1(y + dy - .3)} `;
  }
  return `<path d="${pk}" fill="none" stroke="#8A7A96" stroke-width="1.5" opacity=".16" style="mix-blend-mode:multiply"/><path d="${pk}" fill="none" stroke="${c}" stroke-width=".32" opacity=".4"/><path d="${st}" stroke="${c}" stroke-width=".75" opacity=".8" stroke-linecap="round"/>`;
}
/* 收褶的小竖线（荷叶层之间的缝线） */
const gatherD = (x0, x1, y, n, len = 3.2, dip = 0) => { let d = ''; for (let i = 0; i <= n; i++) { const u = i / n, x = lerp(x0, x1, u), yy = y + dip * (1 - Math.pow(2 * u - 1, 2)); d += `M ${f1(x)} ${f1(yy)} q .7 ${f1(len * .5)} .2 ${f1(len)} `; } return d; };

/* 自然下摆 */
function hemLine(xL, xR, y, n, amp, seed, curve = 0) {
  const r = RNG(seed), pts = [], valleys = [], yb = u => y + curve * (1 - Math.pow(2 * u - 1, 2));
  for (let i = 0; i < n; i++) {
    const uc = (i + .5) / n, a = amp * (.55 + r() * .9);
    pts.push([lerp(xL, xR, uc) + (r() - .5) * 1.6, yb(uc) + a * .55]);
    if (i < n - 1) { const u = (i + 1) / n, v = [lerp(xL, xR, u) + (r() - .5) * 1.4, yb(u) - a * .35]; pts.push(v); valleys.push(v); }
  }
  return { pts, valleys };
}
/* 有垂感的裙片：腰 → 两侧略鼓 → 起伏的下摆；自带从腰落到下摆的褶 */
function flowSkirt(o) {
  const { top, hem, dip = 3.4, e = 2.8, flare = 16, bulge = 3, n = 7, amp = 3, seed = 3, curve = 3, hipY = 300, sideN = 7 } = o;
  const xw = o.xw ?? outerX(top) - e, xh = o.xh ?? (outerX(hipY) - e - flare), side = [];
  for (let i = 1; i < sideN; i++) {
    const t = i / sideN, y = lerp(top, hem, t);
    let x = lerp(xw, xh, Math.pow(t, o.pow ?? .8)) - bulge * Math.sin(Math.PI * t);
    const ox = y < 345 && y > 222 ? outerX(y) : null; if (ox != null && ox > 60) x = Math.min(x, ox - e);
    side.push([x, y]);
  }
  const H = hemLine(xh, 300 - xh, hem, n, amp, seed, curve);
  const d = spline([[150, top + dip], [xw, top, 'c'], ...side, [xh, hem, 'c'], ...H.pts, [300 - xh, hem, 'c'], ...side.slice().reverse().map(mxp), [300 - xw, top, 'c']]);
  const r = RNG(seed + 7), folds = [], W = 300 - 2 * xh;
  H.valleys.forEach(v => {
    const u = (v[0] - xh) / W, gx = lerp(xw + 3, 300 - xw - 3, u), long = r() < (o.longRate ?? .62);
    const t0 = long ? (4 + r() * 8) / (hem - top) : .3 + r() * .28, y0 = lerp(top, hem, t0), x0 = lerp(gx, v[0], t0);
    folds.push([x0, y0, v[0], v[1] + .6, (r() - .5) * (o.bendK ?? 5), (o.fw ?? 2.4) + (hem - top) / 70 + r() * 1.3, long ? .4 : .2]);
  });
  return { d, folds, valleys: H.valleys, pts: H.pts, xh, xw };
}
/* 下摆翻出来的里布 */
const turnSVG = (vs, a, c, pick) => vs.filter((_, i) => (pick ? pick.includes(i) : i % 3 === 1)).map(([x, y]) =>
  `<path d="M ${f1(x)} ${f1(y)} C ${f1(x - 1)} ${f1(y + a * .9)} ${f1(x - 4.4)} ${f1(y + a * 1.15)} ${f1(x - 5.8)} ${f1(y + a * .62)} C ${f1(x - 4)} ${f1(y + a * .5)} ${f1(x - 1.6)} ${f1(y + a * .3)} ${f1(x)} ${f1(y)} Z" fill="${c}" stroke="${STYLE.line}" stroke-width=".65" stroke-linejoin="round"/>`).join('');
/* 下摆内侧的一条阴影带（布往里收的地方） */
const hemShadeD = (pts, up = 6) => 'M ' + pts.map(P2).join(' L ') + ' L ' + pts.slice().reverse().map(p => P2([p[0], p[1] - up])).join(' L ') + ' Z';
/* 荷叶边：挂在 a → b 这条线下面 */
function frillD(a, b, depth, n = 4, seed = 1) {
  const r = RNG(seed), dx = b[0] - a[0], dy = b[1] - a[1], pts = [[a[0], a[1], 'c']];
  for (let i = 0; i < n; i++) {
    const u = (i + .5) / n; pts.push([a[0] + dx * u + (r() - .5), a[1] + dy * u + depth * (.82 + r() * .36)]);
    if (i < n - 1) { const u2 = (i + 1) / n; pts.push([a[0] + dx * u2, a[1] + dy * u2 + depth * .46]); }
  }
  pts.push([b[0], b[1], 'c']);
  return spline(pts);
}
const frillFolds = (a, b, depth, n) => Array.from({ length: n - 1 }, (_, i) => { const u = (i + 1) / n, x = lerp(a[0], b[0], u), y = lerp(a[1], b[1], u); return [x + .4, y + .6, x, y + depth * .5, 0, 1.6, .1, .8]; });

/* 泡泡短袖（左）：肩上收褶、袖身鼓起、袖口松紧；vol 越大越鼓 */
var puffShort = function (vol = 5) {
  const k = vol - 4, P = [[123.4, 187], [112 - k * .3, 187.6], [104.2 - k * .7, 192], [100 - k, 200], [99.4 - k, 209], [101.6 - k * .6, 216], [104.6 - k * .2, 220.6, 'c'], [120, 225, 'c'], [122.6, 214], [124, 199]];
  const d = spline(P);
  const band = spline([[armO(217) - 1.4, 216.6, 'c'], [armI(222) + 1.8, 221.4, 'c'], [armI(226) + 1.8, 225.6, 'c'], [armO(221) - 1.6, 221.2, 'c']]);
  const folds = [[106 - k * .4, 190, 102.4 - k * .6, 214, -1.6, 2.6, .5, .5], [112.6, 188.4, 109.6, 219, -.6, 2.4, .5, .5], [118.6, 189, 117, 222, .8, 2.2, .5, .5], [104 - k * .6, 214, 108, 204, 0, 1.6, .2, .3]];
  return { d, band, folds, glow: [`M ${f1(104 - k * .6)} 196 Q ${f1(101.6 - k)} 204 ${f1(103 - k * .6)} 212`] };
};
/* 立体缎带蝴蝶结：两个带内褶的蝴蝶结圈 + 打结 + 分叉的飘带 */
const ribbonBow = (x, y, s, c, tail = 1) => {
  const ln = STYLE.line, sh = `fill="#5A3A4A" opacity=".24" style="mix-blend-mode:multiply"`;
  const half = `<path d="M -1 1.6 C -2.6 6.4 -5 11.4 -8.4 16.4 L -5.4 15.6 L -4.4 19 C -2.2 13 -.4 7.6 1.2 2.2 Z" fill="${c}" stroke="${ln}" stroke-width=".85" stroke-linejoin="round"/><path d="M -1.6 4.4 C -2.8 8.6 -4.2 11.8 -5.8 14.6" fill="none" stroke="${ln}" stroke-width=".45" opacity=".5"/><path d="M -.4 2 C -1.6 6 -2.6 8.4 -3.4 10.4 L -1.4 9 Z" ${sh}/>`;
  const loop = `<path d="M 0 -.4 C -2.6 -5.2 -9.6 -8.4 -12.8 -5.6 C -15.4 -3.2 -14.2 2.8 -9.4 4.4 C -6 5.4 -2.6 3.4 0 1.4 Z" fill="${c}" stroke="${ln}" stroke-width=".9" stroke-linejoin="round"/>` +
    `<path d="M 0 -.2 C -2.4 -3.2 -5.8 -3.6 -7 -1.2 C -5.4 .8 -2.4 1.6 0 1.2 Z" ${sh}/><path d="M -3.4 -2.8 C -6.6 -5 -10 -5 -11.8 -3.2" fill="none" stroke="${ln}" stroke-width=".48" opacity=".55"/>` +
    `<path d="M -9.4 -5 Q -12 -3.6 -12.2 -.8" fill="none" stroke="#fff" stroke-width=".95" stroke-linecap="round" opacity=".6"/>`;
  const knot = `<path d="M -2.4 -2 C -1 -2.8 1 -2.8 2.4 -2 C 2.8 0 2.8 1.6 2.2 3 C 1 3.6 -1 3.6 -2.2 3 C -2.8 1.6 -2.8 0 -2.4 -2 Z" fill="${c}" stroke="${ln}" stroke-width=".8"/><path d="M -.8 -2 Q -.4 .6 -.9 3.2 M .9 -2 Q 1.2 .6 .8 3.2" fill="none" stroke="${ln}" stroke-width=".4" opacity=".45"/>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">` + (tail ? half + `<g transform="scale(-1 1)">${half}</g>` : '') + loop + `<g transform="scale(-1 1)">${loop}</g>` + knot + '</g>';
};

/* 印花放大：参考图里的印花（波点、格纹、碎花）图案都比较大、比较稀疏；面料肌理类（牛仔、针织、网纱、蕾丝）保持原尺寸 */
(() => {
  const PRINT = /^(pinkdots|roses|heartdenim|heartplum|bigdots|dots|creamdots|argyle|navystripe|browndots|blackdots|greydots|bigbrowndots|navyfloral|leopard|paisleyred|paisleybrown|bluepaisley|pinkargyle|stripetaupe|brownstripe|pinkstripe|bwstripe|starred|ditsy|ruffleflora|mintfloral|yellowfloral|rosebud|cherry|bowprint|heartpink)$/;
  PATTERN_DEFS = PATTERN_DEFS.replace(/<pattern id="pat-(\w+)"([^>]*)>/g, (m, id, rest) => {
    if (!PRINT.test(id)) return m;
    const k = 1.6;
    return /patternTransform="/.test(rest) ? m.replace(/patternTransform="/, `patternTransform="scale(${k}) `) : `<pattern id="pat-${id}"${rest} patternTransform="scale(${k})">`;
  });
})();
