/* =====================================================================
   重画（第 18 版）：最常穿的十几个版型，按参考图（少女漫画的时装设定稿）的画法重画版型和褶皱
   · 布片包着身体：下摆 / 腰头 / 袖口是往下弯的弧线（圆柱体从略高处看），不是一条横线
   · 褶子只长在受力的地方：腋下拉扯、手肘内侧、袖口 / 下摆抽褶、裙摆落到波谷
   · 每道褶子旁边一块硬边阴影（赛璐璐平涂），光从左上来，阴影落在褶子右侧
   · 伞裙下摆一波一波，波谷处能看到裙子里面（深一档的里布色）
   这里只覆盖 render，版型名字和缩略图不变，已经存档的衣服自动换成新画法
   ===================================================================== */
const ss18 = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
/* 褶子旁的硬边阴影：沿褶线向右长出一块，越往下越宽（褶子落在下面，阴影也越深） */
function foldCel(d, w, side = 1, p = 1.3) {
  const S = pathPolys(d); if (!S) return '';
  return S.filter(q => q.length > 1).map(q => {
    let Q = resamp(q, 12); const hz = Math.abs(Q[12][0] - Q[0][0]) > Math.abs(Q[12][1] - Q[0][1]) * 1.2;   // 横着的褶：阴影落在下面
    if (hz ? Q[12][0] < Q[0][0] : Q[12][1] < Q[0][1]) Q = Q.reverse();
    const off = Q.map((c, i) => { const t = i / 12, k = w * Math.pow(t, p) * (1 - .25 * Math.pow(t, 8)); return hz ? [c[0] + k * .15, c[1] + k * .7] : [c[0] + side * k, c[1] + k * .18]; });
    return 'M ' + Q.map(P2).join(' L ') + ' L ' + off.reverse().map(P2).join(' L ') + ' Z';
  }).join(' ');
}
/* 一组褶子 → { folds, cel }；side 可以是函数（按起点决定阴影朝哪边） */
function foldSet(ds, w = 3, side = 1) { return { folds: ds, cel: ds.map(d => foldCel(d, w, typeof side === 'function' ? side(d) : side)) }; }
const joinO = (...os) => os.reduce((a, o) => ({ ...a, ...o, folds: (a.folds || []).concat(o.folds || []), cel: (a.cel || []).concat(o.cel || []), lines: (a.lines || []).concat(o.lines || []) }), {});
const mirO = o => ({ ...o, folds: (o.folds || []).map(mir), cel: (o.cel || []).map(c => c && mir(c)), lines: (o.lines || []).map(l => ({ ...l, d: mir(l.d) })) });
/* 重画的布片：褶子不再叠一层糊掉的软阴影，只留硬边色块 + 细笔触 */
const pc = (d, fill, o = {}) => piece(d, fill, { foldShade: false, foldCel: false, brush: false, fw: .55, foldOp: .5, ...o });   // 褶线细而实，正好压在阴影块的边上
const darkOf = (fill, k = .34) => mix(baseOf(fill) || '#C9A4B4', '#3A2436', k);

/* ---------- 袖子：袖口上方鼓一圈再收进袖口（落肩卫衣 / 毛衣那种），手肘内侧两道挤出来的褶 ---------- */
function sleeve18(o = {}) {
  const { y1 = 314, eo = 2.8, ei = 2.4, se = 2.4, puff = 0, bell = 0, inPuff = .35, cuffed = true } = o, pf = puff * 1.3 + 1.3;
  const bl = y => (cuffed ? bell * bumpF((y - (y1 - 54)) / 54) : bell * ss18(y1 - 60, y1, y));
  const xo = y => armO(y) - eo - pf * bumpF((y - 200) / (y1 - 200)) - bl(y);
  const xi = y => armI(Math.max(222, y)) + ei + pf * inPuff * bumpF((y - 200) / (y1 - 200)) + bl(y) * .4;
  const pts = offsetPts(SHOULDER.slice(3), se).map(p => [p[0], p[1]]);
  rng(203, y1 - 5, Math.round((y1 - 208) / 7)).forEach(y => pts.push([xo(y), y]));
  const sag = cuffed ? 1 : 2.4;                                   // 没有袖口罗纹时，袖口本身是一道往下弯的弧
  pts.push([xo(y1) + .4, y1, 'c'], [lerp(xo(y1), xi(y1), .5), y1 + sag], [xi(y1) + .2, y1 + .8, 'c']);
  rng(y1 - 7, 228, Math.round((y1 - 235) / 7)).forEach(y => pts.push([xi(y), y]));
  pts.push([armI(222) + ei, 221], [123, 206], [120.2, 186]);
  const d = spline(pts);
  const yE = 264, c1 = `M ${f1(xi(yE))} ${yE} Q ${f1(xi(yE) - 4.4)} ${yE + 1.6} ${f1(xi(yE) - 8.6)} ${yE + 6}`, c2 = `M ${f1(xi(yE + 9))} ${yE + 9} Q ${f1(xi(yE + 9) - 3)} ${yE + 10.4} ${f1(xi(yE + 9) - 5.6)} ${yE + 13.6}`;
  const pit = `M ${f1(xi(229) - .6)} 229 Q ${f1(xi(235) - 4.2)} 235.4 ${f1(xi(240) - 8)} 240.6`;   // 腋下往外拉的一小道
  const folds = [pit, c1, c2], cel = [
    `M ${f1(xi(yE) + 2)} ${yE - .6} Q ${f1(xi(yE) - 4.4)} ${yE + 1.6} ${f1(xi(yE) - 8.6)} ${yE + 6} Q ${f1(xi(yE + 9) - 4)} ${yE + 9} ${f1(xi(yE + 9) - 5.6)} ${yE + 13.6} Q ${f1(xi(yE + 9) - 2)} ${yE + 10} ${f1(xi(yE + 9) + 2)} ${yE + 9} Z`,
    // 袖子内侧一整条背光面
    'M ' + rng(230, y1, 12).map(y => `${f1(xi(y) - 1.6 - 1.2 * Math.sin((y - 230) / (y1 - 230) * Math.PI))} ${f1(y)}`).join(' L ') + ` L ${f1(xi(y1) + 3)} ${y1 + 2} L ${f1(xi(230) + 3)} 230 Z`
  ];
  if (bell && cuffed) {                                          // 鼓起来的那圈往袖口收：几道抽褶 + 下半圈背光
    const ya = y1 - 17;
    [.28, .52, .76].forEach((u, i) => folds.push(`M ${f1(lerp(xo(ya), xi(ya), u) - 1)} ${ya + (i === 1 ? -2 : 0)} Q ${f1(lerp(xo(y1 - 7), xi(y1 - 7), u))} ${y1 - 7} ${f1(lerp(xo(y1), xi(y1), u * .9 + .05))} ${y1 - .4}`));
    cel.push(`M ${f1(xo(y1 - 9))} ${y1 - 9} Q ${f1(lerp(xo(y1), xi(y1), .5))} ${y1 - 3.4} ${f1(xi(y1 - 9))} ${y1 - 9} L ${f1(xi(y1) + 2)} ${y1 + 3} L ${f1(xo(y1) - 2)} ${y1 + 3} Z`);
  }
  return { d, folds, cel, xo, xi };
}
function cuff18(y1, h, xo, xi, sag = 1.4) {
  const ya = y1 - h;
  return spline([[xo(ya) + 1.8, ya, 'c'], [lerp(xo(ya), xi(ya), .5), ya + sag], [xi(ya) - 1.2, ya + .6, 'c'], [xi(y1) - .8, y1 + 1, 'c'], [lerp(xo(y1), xi(y1), .5), y1 + sag + .6], [xo(y1) + 1.2, y1, 'c']]);
}
const ribArc = (xo, xi, y0, y1, n = 5, sag = 1.4) => Array.from({ length: n }, (_, i) => { const u = (i + .5) / n, a = lerp(xo(y0), xi(y0), u), b = lerp(xo(y1), xi(y1), u); return `M ${f1(a)} ${f1(y0 + 1.4 + sag * (1 - Math.pow(2 * u - 1, 2)))} L ${f1(b)} ${f1(y1 - 1.2 + sag * (1 - Math.pow(2 * u - 1, 2)))}`; }).join(' ');

/* ---------- 上衣身片：下摆弧度加大；褶子 = 腋下往胸口的拉扯 + 下摆收口处的几道竖褶 ---------- */
function torsoFolds(hem, curve, o = {}) {
  const { pit = true, blouse = false, e = 3 } = o, ds = [];
  if (pit) ds.push('M 112.6 216 Q 118.4 220.6 125 222.4');
  if (blouse) {                                                    // 下摆收进罗纹：衣服在罗纹上方鼓起，挤出几道竖褶
    const xh = sideX(hem) - e;
    [.2, .5].forEach((u, i) => { const x = lerp(xh, 150, u), y = hemY(hem, curve, u); ds.push(`M ${f1(x + 1.2)} ${f1(y - 22 + i * 6)} Q ${f1(x + 2.6)} ${f1(y - 10)} ${f1(x + .6)} ${f1(y - .6)}`); });
  } else {
    const L = hem - 222; if (L > 40) { const xh = sideX(hem) - e; ds.push(`M ${f1(sideX(hem - L * .5) - e + 6)} ${f1(hem - L * .5)} Q ${f1(lerp(xh, 150, .2) - 1)} ${f1(hem - L * .22)} ${f1(lerp(xh, 150, .3))} ${f1(hemY(hem, curve, .3) - 1.2)}`); }
  }
  return foldSet(ds.concat(ds.map(mir)), 2.4);
}
/* 下摆罗纹：竖纹跟着下摆的弧度走 */
function hemRib(hem, h, e, cv, n = 8) {
  const xh = sideX(hem) - e; let d = '';
  for (let i = 0; i < n; i++) { const u = (i + .5) / n, x = lerp(xh + 1, 150, u), dy = cv * (1 - (1 - u) * (1 - u)); d += `M ${f1(x)} ${f1(hem - h + 1.6 + dy)} L ${f1(x)} ${f1(hem - 1.4 + dy)} `; }
  return d + mir(d);
}
/* 领口下方的一小块阴影（领子 / 帽子压在衣服上） */
const neckCel = (y, w = 13, h = 5) => `M ${150 - w} ${y - 1} Q 150 ${y + h * 1.3} ${150 + w} ${y - 1} Q 150 ${y + h * .45} ${150 - w} ${y - 1} Z`;

/* ---------- 伞裙：一波一波的下摆，每个波谷一道褶 + 一块硬边阴影，两侧波谷露出一点里布 ---------- */
function flare18(o = {}) {
  const { top = 282, dip = 3.6, e = 2.6, hem = 340, flare = 18, hipY = 300, n = 5, amp = 3.4, curve = 5.6 } = o;
  const xw = outerX(top) - e, xh = outerX(hipY) - e - flare, K = 2 * n;
  const X = t => lerp(xh, 300 - xh, t), Yb = t => hem + curve * (1 - Math.pow(2 * t - 1, 2));
  const H = []; for (let k = 0; k <= K; k++) { const t = k / K; H.push([X(t), Yb(t) + (k % 2 ? amp * .5 : -amp * .5), k % 2 ? undefined : 'c']); }
  const side = [[150, top + dip], [xw, top, 'c'], [outerX(top + 9) - e - .3, top + 9], [outerX(hipY) - e - flare * .22, hipY], [lerp(outerX(hipY) - e - flare * .22, xh, .62), lerp(hipY, hem, .55)]];
  const d = spline(side.concat(H, side.slice(1).reverse().map(mx)));
  const folds = [], cel = [], lining = [];
  for (let k = 2; k < K; k += 2) {
    const t = k / K, [xt, yt] = H[k], x0 = lerp(xw + 3, 300 - xw - 3, lerp(t, .5, .25)), y0 = top + 12 + Math.abs(t - .5) * 10;
    const f = `M ${f1(x0)} ${f1(y0)} Q ${f1(lerp(x0, xt, .6) + (t < .5 ? -1.2 : 1.2))} ${f1(lerp(y0, yt, .55))} ${f1(xt)} ${f1(yt - .4)}`;
    folds.push(f);
    const w = (X(1 / K) - X(0)) * .62, sd = t < .5 ? 1 : 1;       // 光从左上：阴影一律落在褶子右侧
    cel.push(foldCel(f, w * sd, 1, 1.6));
    if (t <= 1.01 / n || t >= 1 - 1.01 / n) {                      // 两侧的波谷：裙摆往里翻，露出里布
      const [xc, yc] = H[k + (t < .5 ? -1 : 1)], dir = t < .5 ? -1 : 1;
      lining.push(`M ${f1(xt)} ${f1(yt)} Q ${f1(lerp(xt, xc, .45))} ${f1(yt + amp * .2)} ${f1(lerp(xt, xc, .9))} ${f1(yc + .6)} Q ${f1(lerp(xt, xc, .4))} ${f1(yc - amp * .3)} ${f1(xt + dir * .4)} ${f1(yt + 1.8)} Z`);
    }
  }
  return { d, folds, cel, lining, H, xw, xh };
}

Object.assign(TPL.aMini, {
  render(F) {
    const s = flare18({ top: 272, dip: 2.4, e: 2.4, hem: 338, flare: 15, hipY: 298, n: 5, amp: 3.6, curve: 5.4 });
    const wb = bandD(272, 6.6, 2.4, 2.4, 2.6);
    return pc(s.d, F.fill, { folds: s.folds, cel: s.cel.concat(s.lining), celOp: .58, autoFolds: false }) +
      pc(wb, F.fill, { cel: [`M 116 ${278.6} Q 150 ${284.2} 184 278.6 L 184 280 Q 150 286 116 280 Z`], celOp: .5 });
  }
});

Object.assign(TPL.pleatedMini, {
  /* 百褶：每道褶的一半在阴影里（硬边），下摆是随褶子起伏的小锯齿 + 更明显的弧 */
  render(F) {
    const top = 283, hem = 348, N = 12, xw = outerX(top) - 2.6, xh = outerX(300) - 2.6 - 30;
    const hx = i => xh + (300 - 2 * xh) * i / N, hy = i => hem + 7 * (1 - Math.pow(2 * i / N - 1, 2)) + (i % 2 ? 1.2 : -.4);
    const wx = i => xw + (300 - 2 * xw) * i / N;
    const hemPts = []; for (let i = 0; i <= N; i++) hemPts.push([hx(i), hy(i), 'c']);
    const side = [[outerX(292) - 2.8, 292], [outerX(302) - 5.4, 304], [lerp(outerX(302) - 5.4, xh, .55), 328]];
    const d = spline([[150, top + 3.6], [xw, top, 'c'], ...side, ...hemPts, ...side.slice().reverse().map(p => [300 - p[0], p[1]]), [300 - xw, top, 'c']]);
    const cel = [], lines = [], ink = mix(baseOf(F.fill) || '#8A7A70', '#2E2024', .7);
    for (let i = 0; i < N; i++) {
      const ya = 291 + 3.2 * (1 - Math.pow(2 * (i + .5) / N - 1, 2));
      const a = [lerp(wx(i), wx(i + 1), .52), ya], b = [wx(i + 1), ya], c = [hx(i + 1), hy(i + 1)], e = [lerp(hx(i), hx(i + 1), .46), (hy(i) + hy(i + 1)) / 2 + .6];
      cel.push(`M ${P2(a)} L ${P2(b)} L ${P2(c)} L ${P2(e)} Z`);
      if (i > 0) lines.push({ d: `M ${f1(wx(i))} ${f1(ya + 1)} L ${f1(hx(i))} ${f1(hy(i) - .2)}`, c: ink, o: .8, w: .95, fade: 1 });
    }
    const wb = bandD(282, 7.4, 3.6, 2.6, 2.8);
    const pin = F.print === 'pin' ? `<path d="M 168 296 L 177 318" stroke="#B9C0CC" stroke-width="1.6" stroke-linecap="round"/><circle cx="167.5" cy="295" r="2" fill="none" stroke="#B9C0CC" stroke-width="1.2"/><path d="M 172 297 L 180 315" stroke="#B9C0CC" stroke-width="1"/>` : '';
    return pc(d, F.fill, { cel, celOp: .42, lines }) + pc(wb, F.fill, {}) + pin;
  }
});

Object.assign(TPL.shorts, {
  /* 牛仔短裤：裤腿微微张开、裤口斜着往里低一点；裆部两道 V 形拉扯褶 */
  render(F) {
    const top = 283, hem = 338, ease = y => 2.8 + Math.max(0, y - 296) * .12;
    const xo = outerX(hem) - ease(hem), xi = Math.min(149.3, legID(hem) + 2.6);
    const pts = [[150, top + 4], [outerX(top) - ease(top), top, 'c']];
    rng(top + 8, hem - 6, 5).forEach(y => pts.push([outerX(y) - ease(y), y]));
    pts.push([xo, hem, 'c'], [lerp(xo, xi, .5), hem + 3.8], [xi, hem + 3.4, 'c'], [Math.min(149.3, legID(330) + 2.2), 328], [150, 321]);
    const d = symS(pts);
    const cuffY = hem - 9.5, cxo = y => outerX(y) - ease(y) - 1.6 - (y - cuffY) * .05, cxi = y => Math.min(149.4, legID(y) + 2.6 + .6);
    const cuff = spline([[cxo(cuffY), cuffY, 'c'], [lerp(cxo(cuffY), cxi(cuffY), .5), cuffY + 3.4], [cxi(cuffY), cuffY + 3, 'c'], [cxi(hem + 1) + .2, hem + 4.6, 'c'], [lerp(cxo(hem + 1), cxi(hem + 1), .5), hem + 5.4], [cxo(hem + 1) - .2, hem + .8, 'c']]);
    const band = bandD(top, 7.4, 4, 2.8, 3), belt = bandD(top + 1.2, 5.6, 4, 3.2, 3.2);
    const loops = [117, 131.5, 168.5, 183].map(x => `<rect x="${x - 1.4}" y="${f1(top + (Math.abs(150 - x) < 25 ? 3 : 1.4))}" width="2.8" height="8.4" rx=".8" fill="${F.fill}" stroke="${INK}" stroke-width=".8"/>`).join('');
    const buckle = `<rect x="143.2" y="286.4" width="13.6" height="8.6" rx="1.8" fill="url(#grad-chrome)" stroke="${INK}" stroke-width="1"/><rect x="145.8" y="288.4" width="8.4" height="4.6" rx="1" fill="none" stroke="#fff" stroke-width=".8" opacity=".8"/>`;
    const st = F.stitch;
    const V = ['M 146.4 318.6 Q 141 313.4 133.6 311.2', 'M 145 326 Q 138.6 323 131 323.4'], vs = foldSet(V, 2.2, 1), hip = foldSet(['M 116 300 Q 119.4 307 118.4 316'], 2.6);
    const cuffLine = `M ${f1(cxo(cuffY + 4.4))} ${f1(cuffY + 4.4)} Q ${f1(lerp(cxo(cuffY), cxi(cuffY), .5))} ${f1(cuffY + 8)} ${f1(cxi(cuffY + 4.4))} ${f1(cuffY + 7.6)}`;
    const L = joinO(vs, hip, { lines: [{ d: POCKET, c: st, dash: '1.8 1.4', o: .95 }, { d: FLY, c: st, dash: '1.8 1.4', o: .95 }, { d: 'M 119.6 293.4 C 125 295.6 128.8 300.6 129.8 307.4', o: .55 }] });
    const R = mirO(L); R.cel = L.folds.map(f => foldCel(mir(f), 2.2)); R.lines = R.lines.filter(l => l.d !== mir(FLY));
    const cO = { cel: [`M ${f1(cxo(cuffY))} ${f1(cuffY)} Q ${f1(lerp(cxo(cuffY), cxi(cuffY), .5))} ${f1(cuffY + 3.4)} ${f1(cxi(cuffY))} ${f1(cuffY + 3)} L ${f1(cxi(cuffY))} ${f1(cuffY + 5)} Q ${f1(lerp(cxo(cuffY), cxi(cuffY), .5))} ${f1(cuffY + 5.6)} ${f1(cxo(cuffY))} ${f1(cuffY + 2.4)} Z`], lines: [{ d: cuffLine, c: st, dash: '1.8 1.4', o: .9 }] };
    return pc(d, F.fill, { ...L, folds: L.folds.concat(R.folds), cel: L.cel.concat(R.cel), lines: L.lines.concat(R.lines), autoFolds: false }) +
      pc(cuff, F.fill, cO) + pc(mir(cuff), F.fill, mirO(cO)) +
      pc(band, F.fill, {}) + pc(belt, '#7A5238', { rim: false, gloss: ['M 118 287.6 Q 130 290 140 291'], glossOp: .45, lines: [{ d: 'M 117 286.8 Q 132 289.6 142 290.2 M 158 290.2 Q 168 289.6 183 286.8', c: '#C99B6E', dash: '1.2 1.2', w: .6, o: .9 }] }) + loops + buckle;
  }
});

Object.assign(TPL.hoodie, {
  render(F) {
    const y1 = 316, hemY0 = 302, cv = 4.6;
    const S = sleeve18({ y1: y1 - 9, puff: 5, bell: 3.2, eo: 3, ei: 2.6, se: 3.4 });
    const cf = cuff18(y1, 10, y => S.xo(Math.min(y, y1 - 9)) + 2.2, y => S.xi(Math.min(y, y1 - 9)) - 1.4);
    const body = bodyD({ hem: hemY0, e: 4, hemE: 4.6, neckY: 176, neckW: 6, se: 3, curve: cv });
    const hem = hemBandD(hemY0, 10, 4.6, cv);
    const rimL = spline([[150, 190], [141.5, 184.5], [131, 178.5], [122.5, 173], [119.8, 167], [125.5, 162.5], [133.5, 160.4], [140.8, 161.4], [142.3, 167.5], [145.4, 176], [150, 182, 'c']]);
    const cord = (x0, x1) => strap(`M ${x0} 178 C ${x0 - .6} 188 ${x1 + .4} 196 ${x1} 206`, '#FBD3E1', 1.3) + `<rect x="${x1 - 1.6}" y="205" width="3.2" height="5" rx="1.2" fill="#F07FA8" stroke="${INK}" stroke-width=".8"/>`;
    const tf = torsoFolds(hemY0 - 9, cv, { blouse: true, e: 4.6 });
    const sO = { folds: S.folds, cel: S.cel }, sR = { folds: S.folds.map(mir), cel: S.cel.map(mir) };
    const cfx = y => S.xo(Math.min(y, y1 - 9)) + 2.2, cfi = y => S.xi(Math.min(y, y1 - 9)) - 1.4;
    const rib = { lines: [{ d: ribArc(cfx, cfi, y1 - 10, y1, 5, 1.4), o: .42, w: .7 }] };
    return pc(body, F.fill, { folds: tf.folds, cel: tf.cel.concat([neckCel(186, 20, 7)]), autoFolds: false }) +
      pc(hem, F.alt, { lines: [{ d: hemRib(hemY0, 10, 4.6, cv, 8), o: .42, w: .7 }] }) +
      pc(S.d, F.sleeve || F.alt, sO) + pc(mir(S.d), F.sleeve || F.alt, sR) +
      pc(cf, F.alt, rib) + pc(mir(cf), F.alt, mirO(rib)) +
      pc(rimL, F.alt, { deep: ['M 141 161 L 146 180 L 150 184 L 150 160 Z'] }) + pc(mir(rimL), F.alt, { deep: [mir('M 141 161 L 146 180 L 150 184 L 150 160 Z')] }) +
      `<circle cx="144.2" cy="178.4" r="1.3" fill="#fff" stroke="${INK}" stroke-width=".8"/><circle cx="155.8" cy="178.4" r="1.3" fill="#fff" stroke="${INK}" stroke-width=".8"/>` +
      cord(144.2, 143) + cord(155.8, 157) + (F.print === 'clover' ? printClover(148, 236, 7.2) : '');
  }
});

Object.assign(TPL.cami, {
  /* 吊带：胸口一道弧形上缘、胸下微微收、下摆 A 字散开带弧；褶子从胸下往下摆落 */
  render(F) {
    const top = 193, hem = 292, cv = 4.2, strapX = 128.6;
    const pts = [[150, top + 4.6], [140, top + 1], [strapX - .5, top - 1.4, 'c'], [strapX - 4.6, top + 9], [sideX(222) - 1.4, 222], [sideX(236) - .6, 236]];
    rng(248, hem - 8, 4).forEach(y => { const t = (y - 236) / (hem - 236); pts.push([sideX(y) - 1 - 3.4 * t * t, y]); });
    const xh = sideX(hem) - 4.4; pts.push([xh, hem, 'c']); hemWave(pts, xh, hem, cv, .9); pts.push([150, hem + cv]);
    const d = symS(pts);
    const st = 'M 128.8 193.5 L 129.4 170.6';
    const print = F.print === 'butterfly' ? `<g opacity=".85" fill="none" stroke="#D65A96" stroke-width="1"><path d="M 150 222 C 142 212 131 213 133 223 C 135 230 143 230 150 228 C 157 230 165 230 167 223 C 169 213 158 212 150 222 Z"/><path d="M 150 228 C 144 232 139 240 144 243 C 148 245 150 238 150 232 C 150 238 152 245 156 243 C 161 240 156 232 150 228 Z"/><path d="M 150 221 L 150 238"/></g>` +
      [[130, 212], [170, 240], [136, 262], [163, 206], [146, 276], [172, 262], [128, 246]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="#fff"/>`).join('') : '';
    const ds = [`M 133 232 Q 134.6 256 ${f1(lerp(xh, 150, .3))} ${f1(hemY(hem, cv, .3) - 1.2)}`, `M 142 244 Q 144.6 266 ${f1(lerp(xh, 150, .8))} ${f1(hemY(hem, cv, .8) - 1)}`];
    const L = foldSet(ds, 3.4), cel = L.cel.concat(ds.map(q => foldCel(mir(q), 3.4)), [`M 125 199.4 Q 138 202 150 202.6 Q 162 202 175 199.4 L 175 201.6 Q 162 205.4 150 205.8 Q 138 205.4 125 201.6 Z`]);
    return strap(st, F.base, 1.6) + strap(mir(st), F.base, 1.6) + pc(d, F.fill, {
      under: print, folds: L.folds.concat(ds.map(mir)), cel, celOp: .5, autoFolds: false,
      lines: [{ d: 'M 124 197 Q 138 199 150 200 Q 162 199 176 197', c: '#fff', w: 2, dash: '0.1 3.2', o: .9 }]
    });
  }
});

/* ---------- 所有长袖（旧版型一起受益）：换成新袖型——手肘内侧挤出来的两道褶 + 袖子内侧的背光面 ---------- */
sleeveD = function (o = {}) { const S = sleeve18(o); return withFolds(S.d, S.folds, S.cel); };

/* ---------- 短袖：袖子从肩膀斜着撑开、不贴胳膊；袖口一道往下弯的弧，靠胳膊那侧能看到一点袖子里面 ---------- */
function teeSleeve18(e = 1, len = 0) {
  const ho = [96.6 - e * 1.3, 223 + len], hi = [115.8 + e * .1, 229.6 + len];
  const d = spline([[118.5, 170.6], [111.4 - e * .4, 172.8], [106.8 - e, 178.8], [103.6 - e * 1.1, 190], [100.2 - e * 1.25, 207 + len * .5], [ho[0], ho[1], 'c'], [lerp(ho[0], hi[0], .5), lerp(ho[1], hi[1], .5) + 2.6], [hi[0], hi[1], 'c'], [119.2, 215], [121.2, 198]]);
  const ds = [`M 119 206 Q 114.2 207.4 109.4 212.4`, `M ${f1(hi[0] + 2.2)} ${f1(hi[1] - 9)} Q ${f1(hi[0] - 2)} ${f1(hi[1] - 5)} ${f1(lerp(ho[0], hi[0], .62))} ${f1(hi[1] + .6)}`];
  const inside = `M ${f1(lerp(ho[0], hi[0], .46))} ${f1(lerp(ho[1], hi[1], .46) + 2.4)} Q ${f1(lerp(ho[0], hi[0], .78))} ${f1(hi[1] + 1)} ${f1(hi[0] - .6)} ${f1(hi[1] - .4)} Q ${f1(lerp(ho[0], hi[0], .8))} ${f1(hi[1] - 1.6)} ${f1(lerp(ho[0], hi[0], .46))} ${f1(lerp(ho[1], hi[1], .46) + 2.4)} Z`;
  const trim = `M ${f1(ho[0] + .6)} ${f1(ho[1] - 3.4)} Q ${f1(lerp(ho[0], hi[0], .5))} ${f1(lerp(ho[1], hi[1], .5) - .8)} ${f1(hi[0] - .4)} ${f1(hi[1] - 3.2)}`;
  const S = foldSet(ds, 2.2);
  return { d: withFolds(d, S.folds, S.cel.concat([inside])), trim, inside };
}
const teeBody18 = (hem, o = {}) => bodyD({ hem, e: 2.6, hemE: 3.2, neckY: 171.5, neckW: 7, se: 2.2, curve: 4, ...o });

Object.assign(TPL.babyTee, {
  render(F) {
    const hem = 290, cv = 4, body = teeBody18(hem, { curve: cv });
    const S = teeSleeve18(1, 0), neck = spline([[137.4, 163.2, 'c'], [150, 169.4], [162.6, 163.2, 'c'], [163.6, 166.6, 'c'], [150, 174.2], [136.4, 166.6, 'c']]);
    let print = '';
    if (F.print === 'heart') {
      const hd = heartD(150, 219, 15.5), hb = heartD(150, 218, 11);
      print = `<path d="${hd}" fill="none" stroke="#7FCBE3" stroke-width="3.2" stroke-dasharray=".1 3.2" stroke-linecap="round"/>` +
        `<path d="${hb}" fill="#F48FB1" stroke="${INK}" stroke-width="1"/><path d="${heartD(150, 218, 7.5)}" fill="#F7A9C4" opacity=".8"/><path d="M 142 212.5 Q 143.2 208.6 147 208.2" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>` +
        `<path d="M 141 237 Q 150 241 159 237" fill="none" stroke="#7FCBE3" stroke-width="1.2" stroke-dasharray="1.4 1.2"/>`;
    }
    if (F.print === 'baby') print = `<text x="150" y="214" text-anchor="middle" font-family="'ZCOOL KuaiLe',sans-serif" font-size="14" letter-spacing=".5" fill="#C8B4F2" stroke="#fff" stroke-width="2.4" paint-order="stroke">BABY</text><text x="150" y="214" text-anchor="middle" font-family="'ZCOOL KuaiLe',sans-serif" font-size="14" letter-spacing=".5" fill="none" stroke="${INK}" stroke-width=".5" opacity=".6">BABY</text>` + star5(171, 228, 3.4, '#FFE27A', .8);
    const tf = torsoFolds(hem, cv, { e: 3.2 });
    return pc(body, F.fill, { under: print, folds: tf.folds, cel: tf.cel.concat([neckCel(177, 11, 4)]), autoFolds: false }) +
      pc(S.d, F.alt, { lines: [{ d: S.trim, o: .5 }] }) + pc(mir(S.d), F.alt, { lines: [{ d: mir(S.trim), o: .5 }] }) +
      pc(neck, F.rib || F.alt, { rim: false });
  }
});

Object.assign(TPL.graphicTee, {
  render(F) {
    const hem = 272, cv = 3.8, body = teeBody18(hem, { e: 2.2, hemE: 2.8, neckY: 170, se: 2, curve: cv });
    const S = teeSleeve18(1.2, -2), tf = torsoFolds(hem, cv, { e: 2.8 });
    return pc(body, F.fill, { autoFolds: false, folds: tf.folds, cel: tf.cel.concat([neckCel(176, 11, 4)]), over: printMotif16(F.print, 150, 218, 1.25) }) +
      pc(S.d, F.fill, {}) + pc(mir(S.d), F.fill, {}) + pc(neckRib(), F.rib || F.fill, { rim: false });
  }
});

Object.assign(TPL.sweater, {
  render(F) {
    const y1 = 316, hem0 = 306, cv = 4.6;
    const S = sleeve18({ y1: y1 - 9, puff: 3.5, bell: 2.6, eo: 3.4, ei: 3, se: 3.6 });
    const cfx = y => S.xo(Math.min(y, y1 - 9)) + 2.2, cfi = y => S.xi(Math.min(y, y1 - 9)) - 1.4, cf = cuff18(y1, 9, cfx, cfi);
    const body = bodyD({ hem: hem0, e: 4.4, hemE: 5, neckY: 170, neckW: 7, se: 3.2, curve: cv });
    const hem = hemBandD(hem0, 10, 5, cv), neck = spline([[137.2, 162.6, 'c'], [150, 168.4], [162.8, 162.6, 'c'], [163.8, 167, 'c'], [150, 174], [136.2, 167, 'c']]);
    const tf = torsoFolds(hem0 - 9, cv, { blouse: true, e: 5 }), rib = { lines: [{ d: ribArc(cfx, cfi, y1 - 9, y1, 5, 1.4), o: .36, w: .7 }] };
    return pc(body, F.fill, { folds: tf.folds, cel: tf.cel.concat([neckCel(178, 12, 4)]), autoFolds: false }) +
      pc(hem, F.rib || F.fill, { lines: [{ d: hemRib(hem0, 10, 5, cv, 9), o: .35, w: .7 }] }) +
      pc(S.d, F.fill, { folds: S.folds, cel: S.cel }) + pc(mir(S.d), F.fill, { folds: S.folds.map(mir), cel: S.cel.map(mir) }) +
      pc(cf, F.rib || F.fill, rib) + pc(mir(cf), F.rib || F.fill, mirO(rib)) + pc(neck, F.rib || F.fill, { rim: false });
  }
});

Object.assign(TPL.trackJacket, {
  render(F) {
    const y1 = 314, hem0 = 294, cv = 4.2;
    const S = sleeve18({ y1: y1 - 7, bell: 2.4, eo: 3, ei: 2.6, se: 3.2 });
    const cfx = y => S.xo(Math.min(y, y1 - 7)) + 2, cfi = y => S.xi(Math.min(y, y1 - 7)) - 1.2, cf = cuff18(y1, 7, cfx, cfi);
    const body = bodyD({ hem: hem0, e: 3.4, hemE: 3.6, neckY: 176, neckW: 1, neckX: 140, se: 2.8, curve: cv });
    const hem = hemBandD(hem0, 7, 3.6, cv);
    const collar = spline([[139.6, 159, 'c'], [149.6, 172], [150, 180, 'c'], [141, 175], [135, 167, 'c']]);
    const stripe = `M ${f1(S.xo(206) + 1.8)} 206 ` + rng(214, y1 - 14, 8).map(y => `L ${f1(S.xo(y) + 1.8)} ${y}`).join(' ') + ` M ${f1(S.xo(206) + 5)} 206 ` + rng(214, y1 - 14, 8).map(y => `L ${f1(S.xo(y) + 5)} ${y}`).join(' ');
    const st = F.print === 'stripes' ? [{ d: stripe, c: F.rib || '#fff', w: 1.7, o: .95 }] : [];
    const tf = torsoFolds(hem0 - 6, cv, { blouse: true, e: 3.6 });
    const so = { folds: S.folds, cel: S.cel, sheen: ['M 103 226 C 100 250 96 276 91 300'], sheenOp: .5, lines: st };
    return pc(body, F.fill, {
      folds: tf.folds, cel: tf.cel, autoFolds: false, sheen: ['M 124 196 C 121 222 122 250 125 276'], sheenOp: .55,
      lines: [{ d: `M 150 180 L 150 ${hem0 + cv}`, c: F.detail, w: 1.5, o: .85 }, { d: `M 150 180 L 150 ${hem0 + cv}`, c: '#fff', w: .55, dash: '1.2 1.2', o: .8 }]
    }) + pc(hem, F.fill, { cel: [hem], celOp: .3 }) +
      pc(S.d, F.fill, so) + pc(mir(S.d), F.fill, { ...mirO(so), sheen: so.sheen.map(mir) }) +
      pc(cf, F.fill, { cel: [cf], celOp: .3 }) + pc(mir(cf), F.fill, { cel: [mir(cf)], celOp: .3 }) +
      pc(collar, F.fill, { deep: [collar] }) + pc(mir(collar), F.fill, { deep: [mir(collar)] }) +
      `<rect x="147.8" y="182" width="4.4" height="7" rx="1.2" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".9"/>`;
  }
});

/* ---------- 开襟外套的前片：下摆带弧、门襟往下微微外摆；两道从胸口垂到下摆的长褶 ---------- */
function openPanel18(hem, gap = 11, e = 5, top = 140.8, o = {}) {
  const { swing = 2.2, flare = 2 } = o, xf = 150 - gap - swing, ys = Math.min(240, hem - 8);
  const side = [[sideX(ys) - e, ys]]; if (hem > 262) rng(ys + 14, hem - 8, Math.max(1, Math.round((hem - 8 - ys - 14) / 16))).forEach(y => side.push([sideX(y) - e - 1 - flare * Math.pow((y - ys) / (hem - ys), 2), y]));
  const xs = sideX(hem) - e - 1.2 - flare;
  const d = spline([[top - 1.2, 163.4], [133, 166.4], [125.2, 168.6], [117.6, 170.4], [112, 173.6], [108.4, 179.6], [106.6, 188], [109, 214], ...side,
    [xs, hem, 'c'], [lerp(xs, xf, .36), hem + 3.4], [lerp(xs, xf, .56), hem + 2.4], [lerp(xs, xf, .78), hem + 3.6], [xf, hem + 2.6, 'c'], [150 - gap + 1 - swing * .5, hem - 30], [150 - gap + 3, 210], [top, 170, 'c']]);
  const L = hem - 214, ds = L > 40 ? [`M ${f1(sideX(222) - e + 9)} 224 Q ${f1(lerp(xs, xf, .3))} ${f1(hem - L * .4)} ${f1(lerp(xs, xf, .56))} ${f1(hem + 1.4)}`] : [];
  if (L > 70) ds.push(`M ${f1(150 - gap - 3)} ${f1(hem - L * .55)} Q ${f1(150 - gap - 4)} ${f1(hem - L * .2)} ${f1(lerp(xs, xf, .9))} ${f1(hem + 1.6)}`);
  const S = foldSet(ds, 3.6);
  return withFolds(d, S.folds, S.cel.concat([`M ${f1(sideX(214) - e + 1)} 214 Q ${f1(sideX(240) - e + 5)} 250 ${f1(xs + 3)} ${f1(hem)} L ${f1(xs - 3)} ${f1(hem + 2)} L ${f1(sideX(214) - e - 3)} 214 Z`]));
}

Object.assign(TPL.cardigan, {
  render(F) {
    const y1 = 316, S = sleeve18({ y1: y1 - 9, puff: 5.5, bell: 2.8, eo: 4, ei: 3.4, se: 3.6, inPuff: .5 });
    const cfx = y => S.xo(Math.min(y, y1 - 9)) + 2.2, cfi = y => S.xi(Math.min(y, y1 - 9)) - 1.4, cf = cuff18(y1, 10, cfx, cfi);
    const panel = openPanel18(322, 15.2, 7, 140.8, { swing: 1.6, flare: 1.4 });
    const band = 'M 140.8 170 C 138.6 196 137 240 135.8 290 L 133.6 324.6';
    const pocket = spline([[112.8, 292, 'c'], [130, 293.4, 'c'], [129.8, 312.4, 'c'], [112.6, 311.6, 'c']]);
    const pO = { lines: [{ d: band, c: F.rib || F.detail, w: 3, o: .75 }] }, rib = { lines: [{ d: ribArc(cfx, cfi, y1 - 10, y1, 5, 1.4), o: .4, w: .7 }] };
    const pk = { cel: ['M 113 294.4 L 129.8 295.8 L 129.8 298.4 L 113 297 Z'], lines: [{ d: 'M 113 296 L 129.8 297.2', o: .5 }] };
    return pc(panel, F.fill, pO) + pc(mir(panel), F.fill, mirO(pO)) +
      pc(pocket, F.fill, pk) + pc(mir(pocket), F.fill, mirO(pk)) +
      pc(S.d, F.fill, { folds: S.folds, cel: S.cel }) + pc(mir(S.d), F.fill, { folds: S.folds.map(mir), cel: S.cel.map(mir) }) +
      pc(cf, F.rib || F.fill, rib) + pc(mir(cf), F.rib || F.fill, mirO(rib));
  }
});

Object.assign(TPL.cropCardi, {
  render(F) {
    const y1 = 318, S = sleeve18({ y1: y1 - 9, puff: 4.4, bell: 2.6, eo: 3.6, ei: 3, se: 3.4, inPuff: .5 });
    const cfx = y => S.xo(Math.min(y, y1 - 9)) + 2.2, cfi = y => S.xi(Math.min(y, y1 - 9)) - 1.4, cf = cuff18(y1, 9, cfx, cfi);
    const panel = openPanel18(262, 13, 5, 140.8, { swing: .6, flare: .6 });
    const band = 'M 139.6 170 C 138.8 196 137.4 230 137.2 262';
    const cv = 3.2, hem = spline([[sideX(254) - 5.6, 254, 'c'], [lerp(sideX(254) - 5.6, 137.8, .5), 254 + cv], [137.8, 256.6, 'c'], [137, 265.4, 'c'], [lerp(sideX(262) - 6.2, 137, .5), 262.4 + cv + .6], [sideX(262) - 6.2, 262.4, 'c']]);
    const hr = Array.from({ length: 7 }, (_, i) => { const u = (i + .5) / 7, x = lerp(sideX(254) - 5, 137.6, u), dy = cv * (1 - Math.pow(2 * u - 1, 2)); return `M ${f1(x)} ${f1(255.6 + dy)} L ${f1(x)} ${f1(262.8 + dy)}`; }).join(' ');
    const pO = { lines: [{ d: band, c: F.rib || F.detail, w: 3, o: .7 }] }, rib = { lines: [{ d: ribArc(cfx, cfi, y1 - 9, y1, 5, 1.4), o: .4, w: .7 }] };
    return pc(panel, F.fill, pO) + pc(mir(panel), F.fill, mirO(pO)) +
      pc(hem, F.rib || F.fill, { lines: [{ d: hr, o: .4, w: .7 }] }) + pc(mir(hem), F.rib || F.fill, { lines: [{ d: mir(hr), o: .4, w: .7 }] }) +
      [200, 220, 240].map(y => btn(137.6, y, '#E6C56A', 1.6)).join('') +
      pc(S.d, F.fill, { folds: S.folds, cel: S.cel }) + pc(mir(S.d), F.fill, { folds: S.folds.map(mir), cel: S.cel.map(mir) }) +
      pc(cf, F.rib || F.fill, rib) + pc(mir(cf), F.rib || F.fill, mirO(rib));
  }
});

Object.assign(TPL.zipHoodieOpen, {
  render(F) {
    const y1 = 318, S = sleeve18({ y1: y1 - 9, puff: 3.6, bell: 2.6, eo: 3.6, ei: 3.2, se: 3.8, inPuff: .45 });
    const cfx = y => S.xo(Math.min(y, y1 - 9)) + 2.2, cfi = y => S.xi(Math.min(y, y1 - 9)) - 1.4, cf = cuff18(y1, 9, cfx, cfi);
    const panel = openPanel18(300, 9, 5.8, 142.2, { swing: .8, flare: .8 });
    const cv = 3.6, x0 = sideX(292) - 7, hem = spline([[x0, 292, 'c'], [lerp(x0, 140.8, .5), 292 + cv], [140.8, 294.2, 'c'], [140.8, 303, 'c'], [lerp(sideX(300) - 7.2, 140.8, .5), 300.4 + cv + .6], [sideX(300) - 7.2, 300.4, 'c']]);
    const hr = Array.from({ length: 8 }, (_, i) => { const u = (i + .5) / 8, x = lerp(x0 + 1, 140.4, u), dy = cv * (1 - Math.pow(2 * u - 1, 2)); return `M ${f1(x)} ${f1(293.6 + dy)} L ${f1(x)} ${f1(300.8 + dy)}`; }).join(' ');
    const zip = 'M 141.2 176 L 141 300';
    const pO = { lines: [{ d: zip, c: '#D8DDE4', w: 1.6, dash: '.9 .9', o: .9 }] };
    return pc(panel, F.fill, pO) + pc(mir(panel), F.fill, mirO(pO)) +
      pc(hem, F.rib || F.fill, { lines: [{ d: hr, o: .35, w: .7 }] }) + pc(mir(hem), F.rib || F.fill, { lines: [{ d: mir(hr), o: .35, w: .7 }] }) +
      pc(S.d, F.sleeve || F.fill, { folds: S.folds, cel: S.cel }) + pc(mir(S.d), F.sleeve || F.fill, { folds: S.folds.map(mir), cel: S.cel.map(mir) }) +
      pc(cf, F.rib || F.fill, { cel: [cf], celOp: .3 }) + pc(mir(cf), F.rib || F.fill, { cel: [mir(cf)], celOp: .3 }) +
      pc(hoodRimL, F.fill, { deep: ['M 141 161 L 146 180 L 150 184 L 150 160 Z'] }) + pc(mir(hoodRimL), F.fill, { deep: [mir('M 141 161 L 146 180 L 150 184 L 150 160 Z')] }) +
      cordD(144.2, 143, '#F48FB1') + cordD(155.8, 157, '#F48FB1');
  }
});

Object.assign(TPL.slipDress, {
  /* 缎面吊带裙：胸口弧形上缘、胸下收一点，裙摆是一波一波的斜裁垂坠，缎面高光顺着褶走 */
  render(F) {
    const top = 196, strapX = 128.4;
    const pts = [[150, top + 7], [140, top + 1.6], [strapX - .5, top - 1.4, 'c'], [strapX - 4.4, top + 9], [sideX(222) - 1.4, 222], [sideX(240) - .8, 240], [sideX(256) - 1.6, 256], [sideX(264) - 2.2, 264, 'c'], [150, 266]];
    const bod = symS(pts);
    const sk = flare18({ top: 258, dip: 2, e: 2.4, hem: 386, flare: 15, hipY: 306, n: 5, amp: 4.6, curve: 6.4 });
    const st = 'M 128.4 197 L 129.2 170.6';
    const ly = x => { const u = Math.abs(x - 150); return u > 10 ? 197.2 - (u - 10) / 11.6 * 2.2 : 203 - u / 10 * 5.8; };
    const lace = Array.from({ length: 10 }, (_, i) => { const x = 128.6 + i * 4.28, y0 = ly(x), y1 = ly(x + 4.28); return `<path d="M ${f1(x)} ${f1(y0)} Q ${f1(x + 2.14)} ${f1((y0 + y1) / 2 + 3.4)} ${f1(x + 4.28)} ${f1(y1)} Z" fill="#FFFDF4" stroke="${INK}" stroke-width=".7"/><circle cx="${f1(x + 2.14)}" cy="${f1((y0 + y1) / 2 + 1.4)}" r=".55" fill="${INK}" opacity=".4"/>`; }).join('');
    const bf = foldSet(['M 134 222 Q 135.4 240 134.6 262', 'M 143 238 Q 144 252 143.4 264'].flatMap(d => [d, mir(d)]), 2.4);
    const sheen = sk.folds.map(f => { const q = pathPolys(f)[0], a = q[Math.round(q.length * .3)], b = q[q.length - 1]; return `M ${f1(a[0] - 3.4)} ${f1(a[1])} L ${f1(b[0] - 3.2)} ${f1(b[1] - 6)}`; });
    return strap(st, F.base, 1.3) + strap(mir(st), F.base, 1.3) +
      pc(sk.d, F.fill, { folds: sk.folds, cel: sk.cel.concat(sk.lining), sheen, sheenW: 3, sheenOp: .4, autoFolds: false }) +
      pc(bod, F.fill, { ...bf, cel: bf.cel.concat([`M 125 201 Q 138 203.6 150 206.4 Q 162 203.6 175 201 L 175 203.4 Q 162 207 150 209.6 Q 138 207 125 203.4 Z`]), sheen: ['M 131 214 C 129.6 230 129.6 244 130.6 258', mir('M 131 214 C 129.6 230 129.6 244 130.6 258')], sheenOp: .4 }) + lace;
  }
});

Object.assign(TPL.tierSkirt, {
  /* 蛋糕裙：每一层都是抽褶荷叶（腰口一圈碎褶、下摆一波一波），层层往外张 */
  render(F) {
    const t3 = frillTier(316, 344, 98, 88.6, 13, 303, F.fill, F, { amp: 3 });
    const t2 = frillTier(300, 325, 104.6, 96.6, 11, 302, F.alt, F, { amp: 2.6 });
    const t1 = frillTier(286.6, 308, 109.6, 103.6, 9, 301, F.fill, F, { amp: 2.2 });
    const wb = bandD(282, 6.6, 3.6, 2.6, 2.8);
    return t3.svg + t2.svg + t1.svg + pc(wb, F.rib || F.fill, {}) + (F.print === 'bow' ? `<path d="M 150 286 C 145 281 140 282 140.6 286.6 C 141 290 146 289.6 150 287.6 C 154 289.6 159 290 159.4 286.6 C 160 282 155 281 150 286 Z" fill="${F.rib || '#F48FB1'}" stroke="${INK}" stroke-width=".8"/><circle cx="150" cy="286.6" r="1.7" fill="${F.rib || '#F48FB1'}" stroke="${INK}" stroke-width=".7"/>` : '');
  }
});

/* ---------- 长裤：裆部两道 V 形拉扯、膝盖内侧两道挤褶、裤脚堆在鞋面上的几道横褶 ---------- */
function pantFolds18(hem, ease, inE, o = {}) {
  const { knee = true, stack = 3 } = o, xo = y => outerX(y) - ease(y), xi = y => Math.min(149.3, legID(y) + inE(y)), X = (y, u) => lerp(xo(y), xi(y), u);
  const ds = ['M 147 330 Q 140.6 324.6 132 322.4', 'M 145.6 340 Q 139.4 337 131.4 337.6'];
  if (knee) ds.push(`M ${f1(X(424, .9))} 424 Q ${f1(X(428, .7))} 428.4 ${f1(X(433, .5))} 433.6`, `M ${f1(X(436, .92))} 436 Q ${f1(X(439, .76))} 439.6 ${f1(X(443, .6))} 444`);
  for (let i = 0; i < stack; i++) { const y = hem - 9 - i * 9, a = i % 2 ? .12 : .3, b = i % 2 ? .7 : .88;
    ds.push(`M ${f1(X(y, a))} ${f1(y - 2)} Q ${f1(X(y, (a + b) / 2))} ${f1(y + 3.2)} ${f1(X(y, b))} ${f1(y - .6)}`); }
  return foldSet(ds.concat(ds.map(mir)), 2.6);
}
const pantsO = (P, lines) => ({ ...P, lines, autoFolds: false });

Object.assign(TPL.flareJeans, {
  render(F) {
    const ease = y => 2.4 + Math.max(0, y - 440) * .1, inE = y => 1.8 + Math.max(0, y - 440) * .075;
    const d = pantsD({ top: 283, hem: 578, ease, inE }), wb = bandD(283, 7, 4, 2.4, 2.5);
    const hearts = F.print === 'hearts' ? heart(128, 318, 5, '#F4A3C0', .9) + heart(172, 318, 5, '#F4A3C0', .9) : '';
    const rips = F.print === 'hearts' ? fm('M 122 414 L 134 413 M 122.5 419 L 135 420 M 124 424 L 133 424').map(p => ({ d: p, c: '#F4F1EC', w: 1.4, o: .95 })) : [];
    return pc(d, F.fill, { under: hearts, ...pantsO(pantFolds18(PANT_HEM, ease, inE), [...rips, { d: FLY, c: F.stitch, dash: '2 1.6', o: .9 }, { d: POCKET, c: F.stitch, dash: '2 1.6', o: .9 }, { d: mir(POCKET), c: F.stitch, dash: '2 1.6', o: .9 }]) }) +
      pc(wb, F.fill, { lines: [{ d: 'M 118 286.6 Q 150 292.6 182 286.6', c: F.stitch, dash: '2 1.6', o: .9 }] });
  }
});
Object.assign(TPL.widePants, {
  render(F) {
    const ease = y => 3 + Math.max(0, y - 320) * .014 + Math.pow(Math.max(0, y - 400) / 178, 1.6) * 17;
    const inE = y => 2.2 + Math.pow(Math.max(0, y - 400) / 178, 1.6) * 11;
    const d = pantsD({ top: 282, hem: 578, ease, inE }), wb = bandD(282, 7, 4, 3, 3.1);
    const P = pantFolds18(PANT_HEM, ease, inE, { knee: false, stack: 2 }), drop = foldSet(fm('M 118 470 Q 116 512 113 552', 'M 136 480 Q 138 520 137 556'), 3.4);
    return pc(d, F.fill, { ...pantsO(joinO(P, drop), [{ d: FLY, c: F.detail, o: .8 }, { d: POCKET, c: F.detail, o: .8 }, { d: mir(POCKET), c: F.detail, o: .8 }]) }) +
      pc(wb, F.fill, { lines: [{ d: 'M 131.5 284.4 L 131.5 291.2 M 168.5 284.4 L 168.5 291.2', o: .6 }] });
  }
});

Object.assign(TPL.tierMidi, {
  /* 三层蛋糕长裙：每层都是抽褶荷叶，一层比一层张开 */
  render(F) {
    const t3 = frillTier(398, 470, 97, 82, 15, 313, F.fill, F, { amp: 3.4, curve: 5 });
    const t2 = frillTier(338, 404, 104.4, 95, 13, 312, F.fill, F, { amp: 3, curve: 4.4 });
    const t1 = frillTier(286.6, 344, 109.6, 103, 11, 311, F.fill, F, { amp: 2.6, curve: 4 });
    return t3.svg + t2.svg + t1.svg + pc(bandD(282, 6.6, 3.6, 2.6, 2.8), F.rib || F.fill, {});
  }
});

Object.assign(TPL.buttonShirt, {
  render(F) {
    const y1 = 316, S = sleeve18({ y1: y1 - 9, puff: 2.6, bell: 2.2, eo: 3.4, ei: 3, se: 3.2 });
    const cfx = y => S.xo(Math.min(y, y1 - 9)) + 2.2, cfi = y => S.xi(Math.min(y, y1 - 9)) - 1.4, cf = cuff18(y1, 9, cfx, cfi);
    const cv = 5, body = bodyD({ hem: 306, e: 4.2, hemE: 5, neckY: 172, neckW: 6, se: 3, curve: cv });
    const pocket = spline([[124.6, 196, 'c'], [138.4, 196.4, 'c'], [138.2, 210], [131.4, 213.4, 'c'], [124.6, 210]]);
    const tf = torsoFolds(306, cv, { e: 5 });
    return pc(body, F.fill, { ...tf, autoFolds: false, lines: [{ d: 'M 150 176 L 150 310', o: .55 }, { d: 'M 153.4 178 L 153.4 309', o: .3, w: .7 }] }) +
      [188, 206, 224, 242, 260, 278, 296].map(y => btn(151.6, y, '#FFFDF8', 1.25)).join('') + pc(pocket, F.fill, { cel: ['M 124.8 197.6 L 138.2 198 L 138.2 200.6 L 124.8 200.2 Z'], lines: [{ d: 'M 125 199.6 L 138.2 200', o: .45 }] }) +
      pc(S.d, F.fill, { folds: S.folds, cel: S.cel }) + pc(mir(S.d), F.fill, { folds: S.folds.map(mir), cel: S.cel.map(mir) }) +
      pc(cf, F.fill, { cel: [cf], celOp: .25 }) + pc(mir(cf), F.fill, { cel: [mir(cf)], celOp: .25 }) +
      btn(cfi(311) - 2.6, 311.4, '#FFFDF8', 1) + btn(300 - cfi(311) + 2.6, 311.4, '#FFFDF8', 1) +
      pc(SHIRT_COLLAR, F.fill, { lit: [1, 1], litOp: .5, cel: [`M 138 172 Q 150 186 162 172 L 162 176 Q 150 190 138 176 Z`] }) + pc(mir(SHIRT_COLLAR), F.fill, { lit: [1, 1], litOp: .5 });
  }
});
