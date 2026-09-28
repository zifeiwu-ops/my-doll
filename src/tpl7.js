/* =====================================================================
   版型（固定衣服 + 照片 DIY 共用）：全部沿「描摹底模」的身体轮廓外扩生成，所以件件贴身
   F = { fill, base, detail, stitch, print, alt, rib, sleeve }
   ===================================================================== */
const SHOULDER = [[138.2, 164.6], [131.5, 167.6], [125.2, 169.8], [118.5, 171.6], [113.6, 174.4], [110.3, 179.2], [108.5, 186.5], [107.6, 195]];
function offsetPts(pts, e) {
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    return [p[0] - dy / L * e, p[1] + dx / L * e, p[2]];
  });
}
const sideX = y => (y >= 220 && y <= 576 ? silO(y) : torsoL(y) ?? legO(y));
const bumpF = t => Math.sin(Math.PI * Math.pow(Math.max(0, Math.min(1, t)), 1.4));
const rng = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n);
const ribLines = (x0, x1, y0, y1, gap = 3.2, slant = 0) => { let d = ''; for (let x = x0 + gap / 2; x < x1; x += gap) d += `M ${f1(x)} ${f1(y0 + .8)} L ${f1(x + slant)} ${f1(y1 - .8)} `; return d; };
const R = { mir: false };

/* ---------- 长袖（左袖；右袖用 mir） ---------- */
function sleeveD(o = {}) {
  const { y1 = 312, eo = 2.8, ei = 2.4, se = 2.4, inPuff = .35 } = o, puff = (o.puff || 0) * 1.3 + 1.3;
  const pts = offsetPts(SHOULDER.slice(3), se).map(p => [p[0], p[1]]);
  rng(203, y1 - 6, Math.round((y1 - 209) / 9)).forEach(y => pts.push([armO(y) - eo - puff * bumpF((y - 200) / (y1 - 200)), y]));
  pts.push([armO(y1) - eo - puff * bumpF(1) + .6, y1, 'c']);
  pts.push([armI(y1) + ei + .4, y1 + 1, 'c']);
  rng(y1 - 8, 227, Math.round((y1 - 235) / 9)).forEach(y => pts.push([armI(y) + ei + puff * inPuff * bumpF((y - 200) / (y1 - 200)), y]));
  pts.push([armI(222) + ei, 221]); pts.push([123, 206]); pts.push([120.2, 186]);
  const yc = y1 - 17, xo = armO(yc) - eo - puff * bumpF((yc - 200) / (y1 - 200)), xi = armI(yc) + ei, w = xi - xo;
  return withFolds(spline(pts), y1 > 280 ? [`M ${f1(xo + w * .12)} ${f1(yc - 3)} Q ${f1(xo + w * .42)} ${f1(yc + 1.4)} ${f1(xo + w * .7)} ${f1(yc + 5)}`] : []);
}
function cuffD(y1, h, eo = 2.8, ei = 2.4, puffIn = 0) {
  const ya = y1 - h;
  return spline([[armO(ya) - eo + .2 - puffIn, ya, 'c'], [armI(ya) + ei - .2 + puffIn * .3, ya + .6, 'c'], [armI(y1) + ei + .4, y1 + 1, 'c'], [armO(y1) - eo + .6, y1, 'c']]);
}
/* 袖口处的抽褶线 */
function gatherLines(y1, eo, ei, n = 3) {
  let d = ''; const xo = armO(y1) - eo, xi = armI(y1) + ei;
  for (let i = 1; i <= n; i++) { const x = xo + (xi - xo) * i / (n + 1); d += `M ${f1(x - 1)} ${f1(y1 - 9)} Q ${f1(x + .6)} ${f1(y1 - 5)} ${f1(x)} ${f1(y1 - .5)} `; }
  return d;
}
/* ---------- 上衣身片（对称） ---------- */
function bodyD(o = {}) {
  const { neckY = 170, neckX = 139, se = 2.4, flare = 0, curve = 1.6, neckW = 5.5 } = o, hem = o.hem ?? 300;
  /* 参考图的上衣都偏宽松：松量统一放大一点（越宽松的款放得越多） */
  const e = (o.e ?? 2.8) * 1.22, hemE = (o.hemE ?? 3.4) * 1.3 + ((o.hemE ?? 3.4) > 3.6 ? 1.2 : 0);
  const pts = [[150, neckY], [150 - neckW, neckY - 1.2], [neckX, 165]];
  offsetPts(SHOULDER.slice(1), se).forEach(p => pts.push([p[0], p[1]]));
  pts.push([112, 212]);
  rng(222, hem - 8, Math.max(1, Math.round((hem - 230) / 10))).forEach(y => { const t = (y - 222) / (hem - 222); pts.push([sideX(y) - e - (hemE - e) * t - flare * t * t, y]); });
  const xh = sideX(hem) - hemE - flare;
  pts.push([xh, hem, 'c']);
  hemWave(pts, xh, hem, curve);
  pts.push([150, hem + curve]);
  return withFolds(symS(pts), drapeFolds(xh, hem, curve, 222, e));
}
/* 下摆的自然起伏：布料垂下来时下摆不是一条死板的弧线，褶皱落点处略微上提 */
const HEM_W = [[.3, -1.1], [.56, 0], [.8, -.9]];
const hemY = (hem, curve, u) => hem + curve * (1 - (1 - u) * (1 - u));
function hemWave(pts, xh, hem, curve, k = 1) { HEM_W.forEach(([u, dy]) => pts.push([xh + (150 - xh) * u, hemY(hem, curve, u) + dy * k])); }
/* 垂坠褶：从胸 / 腰往下落到下摆起伏处的长褶线（左右各两条） */
function drapeFolds(xh, hem, curve, y0 = 222, e = 2.8, n = 2) {
  const L = hem - y0; if (L < 34) return [];
  const f = [], at = u => [xh + (150 - xh) * u, hemY(hem, curve, u) - 2.4];
  const yA = hem - Math.min(62, L * .56), [xa, ya] = at(.3), x0 = sideX(yA) - e + 7.4;
  f.push(`M ${f1(x0)} ${f1(yA)} Q ${f1((x0 + xa) / 2 - 1.4)} ${f1((yA + ya) / 2)} ${f1(xa)} ${f1(ya)}`);
  if (n > 1) { const yB = hem - Math.min(44, L * .4), [xb, yb] = at(.8), x1 = Math.min(143.4, xb + 3); f.push(`M ${f1(x1)} ${f1(yB)} Q ${f1((x1 + xb) / 2 + .8)} ${f1((yB + yb) / 2)} ${f1(xb)} ${f1(yb)}`); }
  return f.flatMap(d => [d, mir(d)]);
}
function hemBandD(hem, h, hemE = 3.4, curve = 1.6, flare = 0) {
  return symS([[150, hem - h + curve], [sideX(hem - h) - hemE - flare + .3, hem - h, 'c'], [sideX(hem) - hemE - flare, hem, 'c'], [150, hem + curve]]);
}
/* 无袖身片（吊带 / 背心）：袖窿从肩带落点弯到腋下 */
function tankD(o = {}) {
  const { top = 194, cx = 150, strapX = 128, e = 2.2, hem = 292, hemE = 2.6, flare = 0, curve = 1.4, dip = 4 } = o;
  const pts = [[150, top + dip], [140, top + 1.2], [strapX - .5, top - 1, 'c'], [strapX - 4.5, top + 9], [sideX(222) - e + .8, 222]];
  rng(230, Math.max(231, hem - 8), Math.max(1, Math.round((hem - 236) / 10))).forEach(y => { const t = (y - 222) / (hem - 222); pts.push([sideX(y) - e - (hemE - e) * t - flare * t * t, y]); });
  const xh = sideX(hem) - hemE - flare;
  pts.push([xh, hem, 'c']); hemWave(pts, xh, hem, curve, .8); pts.push([150, hem + curve]);
  return withFolds(symS(pts), drapeFolds(xh, hem, curve, 226, e, 1));
}
const STRAP_TOP = y => [129.3, 171.6];

const TPL = {
  /* ---------------- 上衣 ---------------- */
  hoodie: {
    cat: 'top', name: '连帽卫衣', thumb: '72 136 156 196',
    back(F) {
      const hood = symS([[150, 141], [138, 142.5], [126, 147.5], [118.5, 156], [115.5, 166], [117, 176, 'c'], [150, 176]]);
      return piece(hood, F.alt, { deep: [symS([[150, 146], [134, 148], [124, 155], [121.5, 166], [124, 176], [150, 176]])], rim: false });
    },
    render(F) {
      const y1 = 316, puff = 5;
      const sl = sleeveD({ y1, puff, eo: 3, ei: 2.6, se: 3.4 }), cf = cuffD(y1, 10, 3 + puff * .05, 2.6);
      const body = bodyD({ hem: 302, e: 4, hemE: 4.6, neckY: 176, neckW: 6, se: 3 });
      const hem = hemBandD(302, 10, 4.6, 1.6);
      const rimL = spline([[150, 190], [141.5, 184.5], [131, 178.5], [122.5, 173], [119.8, 167], [125.5, 162.5], [133.5, 160.4], [140.8, 161.4], [142.3, 167.5], [145.4, 176], [150, 182, 'c']]);
      const slO = { folds: ['M 99 262 Q 103 270 101 280', 'M 93 290 Q 97 296 95 304', 'M 106 238 Q 109 244 108 252'], under: '' };
      const cord = (x0, x1) => strap(`M ${x0} 178 C ${x0 - .6} 188 ${x1 + .4} 196 ${x1} 206`, '#FBD3E1', 1.3) + `<rect x="${x1 - 1.6}" y="205" width="3.2" height="5" rx="1.2" fill="#F07FA8" stroke="${INK}" stroke-width=".8"/>`;
      return piece(body, F.fill, {
        folds: fm('M 126 232 Q 129 244 127 258', 'M 122 276 Q 126 284 125 292', 'M 140 204 Q 143 212 142 222'),
        shade: [symS([[150, 176], [142, 180], [133, 184], [150, 196]])]
      }) + piece(hem, F.alt, { lines: [{ d: ribLines(106, 194, 292, 303.5, 3.1), o: .45, w: .7 }] }) +
        piece(sl, F.sleeve || F.alt, slO) + piece(mir(sl), F.sleeve || F.alt, { ...slO, folds: slO.folds.map(mir) }) +
        piece(cf, F.alt, { lines: [{ d: ribLines(armO(306) - 3.2, armI(306) + 2.6, 306, 316.5, 2.6, -.6), o: .45, w: .7 }] }) +
        piece(mir(cf), F.alt, { lines: [{ d: mir(ribLines(armO(306) - 3.2, armI(306) + 2.6, 306, 316.5, 2.6, -.6)), o: .45, w: .7 }] }) +
        piece(rimL, F.alt, { deep: ['M 141 161 L 146 180 L 150 184 L 150 160 Z'] }) + piece(mir(rimL), F.alt, { deep: [mir('M 141 161 L 146 180 L 150 184 L 150 160 Z')] }) +
        `<circle cx="144.2" cy="178.4" r="1.3" fill="#fff" stroke="${INK}" stroke-width=".8"/><circle cx="155.8" cy="178.4" r="1.3" fill="#fff" stroke="${INK}" stroke-width=".8"/>` +
        cord(144.2, 143) + cord(155.8, 157) + (F.print === 'clover' ? printClover(148, 236, 7.2) : '');
    }
  },
  meshTop: {
    cat: 'top', name: '网纱叠穿上衣', thumb: '72 150 156 176',
    render(F) {
      const y1 = 314;
      const sl = sleeveD({ y1, eo: 1.8, ei: 1.6, se: 1.6 }), cf = cuffD(y1, 3.6, 1.8, 1.6);
      const mesh = bodyD({ hem: 266, e: 1.8, hemE: 1.8, neckY: 168.5, neckW: 7, se: 1.6, curve: 1.2 });
      const hemB = hemBandD(266, 3.6, 1.8, 1.2);
      const neckB = spline([[137.6, 163.8, 'c'], [150, 168.6], [162.4, 163.8, 'c'], [163, 167.2, 'c'], [150, 172.2], [137, 167.2, 'c']]);
      const bra = symS([[150, 199], [144, 191.5], [135.5, 188.2], [127.6, 190.4], [124.4, 200], [124.2, 214], [124.8, 226, 'c'], [150, 229]]);
      const cup = 'M 126.5 196 Q 136 186 148 198', st = 'M 128.8 191 L 129.6 170.6';
      const mo = { rim: false, sw: 1.1 };
      return piece(sl, F.alt, mo) + piece(mir(sl), F.alt, mo) + piece(mesh, F.alt, mo) +
        strap(st, F.base, 1.5) + strap(mir(st), F.base, 1.5) +
        piece(bra, F.base, { rim: false, gloss: ['M 131 195 Q 137 191 143 196', mir('M 131 195 Q 137 191 143 196')], glossOp: .35, lines: [{ d: cup + ' ' + mir(cup), c: '#6A6068', w: .8, o: .7 }, { d: 'M 126 221 Q 150 226 174 221', c: '#6A6068', w: .8, o: .6 }] }) +
        piece(hemB, F.base, { rim: false }) + piece(neckB, F.base, { rim: false }) + piece(cf, F.base, { rim: false }) + piece(mir(cf), F.base, { rim: false });
    }
  },
  babyTee: {
    cat: 'top', name: '短款T恤', thumb: '84 150 132 150',
    render(F) {
      const body = bodyD({ hem: 290, e: 2.6, hemE: 3, neckY: 171.5, neckW: 7, se: 2.2 });
      const slv = spline([[118.5, 170.6], [111.6, 172.8], [107.2, 178.6], [104.4, 190], [101.2, 210], [98.2, 226, 'c'], [115.6, 231, 'c'], [118.8, 216], [121.2, 198]]);
      const trim = 'M 98.6 222 L 115.9 227.2';
      const neck = spline([[137.4, 163.2, 'c'], [150, 169.4], [162.6, 163.2, 'c'], [163.6, 166.6, 'c'], [150, 174.2], [136.4, 166.6, 'c']]);
      let print = '';
      if (F.print === 'heart') {
        const hd = heartD(150, 219, 15.5), hb = heartD(150, 218, 11);
        print = `<path d="${hd}" fill="none" stroke="#7FCBE3" stroke-width="3.2" stroke-dasharray=".1 3.2" stroke-linecap="round"/>` +
          `<path d="${hb}" fill="#F48FB1" stroke="${INK}" stroke-width="1"/><path d="${heartD(150, 218, 7.5)}" fill="#F7A9C4" opacity=".8"/><path d="M 142 212.5 Q 143.2 208.6 147 208.2" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>` +
          `<path d="M 141 237 Q 150 241 159 237" fill="none" stroke="#7FCBE3" stroke-width="1.2" stroke-dasharray="1.4 1.2"/>`;
      }
      if (F.print === 'baby') print = `<text x="150" y="214" text-anchor="middle" font-family="'ZCOOL KuaiLe',sans-serif" font-size="14" letter-spacing=".5" fill="#C8B4F2" stroke="#fff" stroke-width="2.4" paint-order="stroke">BABY</text><text x="150" y="214" text-anchor="middle" font-family="'ZCOOL KuaiLe',sans-serif" font-size="14" letter-spacing=".5" fill="none" stroke="${INK}" stroke-width=".5" opacity=".6">BABY</text>` + star5(171, 228, 3.4, '#FFE27A', .8);
      const sO = { folds: ['M 104 204 Q 108 208 110 214'] };
      return piece(body, F.fill, { under: print, folds: fm('M 125 238 Q 128 250 126 262', 'M 129 272 Q 131 280 130 286') }) +
        piece(slv, F.alt, { ...sO, lines: [{ d: trim, o: .5 }] }) + piece(mir(slv), F.alt, { ...sO, folds: sO.folds.map(mir), lines: [{ d: mir(trim), o: .5 }] }) +
        piece(neck, F.rib || F.alt, { rim: false });
    }
  },
  raglan: {
    cat: 'top', name: '插肩长袖T', thumb: '72 150 156 176',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, eo: 2.6, ei: 2.2, se: 2.2 }), cf = cuffD(y1, 6, 2.6, 2.2);
      const body = bodyD({ hem: 296, e: 2.8, hemE: 3.2, neckY: 171, neckW: 7, se: 2.2 });
      const rag = spline([[139.4, 165.2], [133, 167.6], [125, 169.8], [118, 171], [112, 173.5], [108, 180], [105.4, 196], [122.4, 222, 'c'], [125.5, 205], [132, 184], [140.4, 170.4, 'c']]);
      const ruffle = Array.from({ length: 7 }, (_, i) => { const x = 138.2 + i * 3.94, y = 166.2 + 3.6 * Math.sin(i / 6 * Math.PI); return `<path d="M ${f1(x)} ${f1(y)} q 1.97 3 3.94 0" fill="${F.alt}" stroke="${INK}" stroke-width=".8"/>`; }).join('');
      return piece(body, F.fill, { folds: fm('M 125 238 Q 128 250 126 262', 'M 127 274 Q 131 282 129 292') }) +
        piece(sl, F.alt, { folds: ['M 94 262 Q 98 268 97 276', 'M 90 290 Q 93 296 92 304'] }) + piece(mir(sl), F.alt, { folds: [mir('M 94 262 Q 98 268 97 276'), mir('M 90 290 Q 93 296 92 304')] }) +
        piece(rag, F.alt, {}) + piece(mir(rag), F.alt, {}) + piece(cf, F.alt, { lines: [{ d: ribLines(armO(308) - 2.8, armI(308) + 2.2, 308, 314.5, 2.4), o: .4, w: .7 }] }) + piece(mir(cf), F.alt, {}) + ruffle;
    }
  },
  layerTank: {
    cat: 'top', name: '叠穿背心T', thumb: '72 150 156 176',
    render(F) {
      const under = bodyD({ hem: 306, e: 2.8, hemE: 4.2, neckY: 172, neckW: 7, se: 2.2, flare: 1.2 });
      const hemAsym = 'M 110 300 Q 128 310 150 305 Q 170 300 190 309';
      const tank = tankD({ top: 184, strapX: 131, e: 3, hem: 262, hemE: 3.2, dip: 6, curve: 2.6 });
      const st = 'M 131 184.5 L 131.6 170.4';
      const y1 = 312, sl = sleeveD({ y1, eo: 2.6, ei: 2.2, se: 2.2 }), cf = cuffD(y1, 6, 2.6, 2.2);
      const belt = 'M 112.8 276 Q 150 284 187.6 276 L 187.4 282.6 Q 150 290.6 112.6 282.6 Z';
      const tie = 'M 170 282 C 172 292 171 302 174 314 L 179.6 313 C 177 302 177.6 292 175.4 281 Z';
      return piece(sl, F.alt, { folds: ['M 94 262 Q 98 268 97 276'] }) + piece(mir(sl), F.alt, { folds: [mir('M 94 262 Q 98 268 97 276')] }) + piece(cf, F.alt, {}) + piece(mir(cf), F.alt, {}) +
        piece(under, F.fill === 'url(#pat-bigdots)' ? 'url(#pat-creamdots)' : F.alt, { folds: fm('M 124 292 Q 127 298 126 304'), lines: [{ d: hemAsym, o: 0 }] }) +
        strap(st, F.base, 2.2) + strap(mir(st), F.base, 2.2) +
        piece(tank, F.fill, { folds: fm('M 128 222 Q 131 236 129 250'), shade: [] }) +
        (F.print === 'clover' ? clover(138, 208, 5.2, -14) + `<path d="M 140 216 C 146 222 150 218 148 214" fill="none" stroke="#4E8E3A" stroke-width="1" stroke-linecap="round"/>` : '') +
        piece(belt, '#2A2628', { rim: false, gloss: ['M 118 279.5 Q 132 283 144 283.5'], glossOp: .35 }) + piece(tie, '#2A2628', { rim: false }) +
        `<rect x="165.6" y="277.4" width="9" height="7.4" rx="1.4" fill="none" stroke="#C9CDD6" stroke-width="1.5"/>` + (F.print === 'clover' ? clover(164, 292, 4.6, 18, false) : '');
    }
  },
  cami: {
    cat: 'top', name: '吊带背心', thumb: '96 160 108 140',
    render(F) {
      const d = tankD({ top: 193, strapX: 128.6, e: 2, hem: 292, hemE: 2.6, dip: 3.4 });
      const st = 'M 128.8 193.5 L 129.4 170.6';
      const print = F.print === 'butterfly' ? `<g opacity=".85" fill="none" stroke="#D65A96" stroke-width="1"><path d="M 150 222 C 142 212 131 213 133 223 C 135 230 143 230 150 228 C 157 230 165 230 167 223 C 169 213 158 212 150 222 Z"/><path d="M 150 228 C 144 232 139 240 144 243 C 148 245 150 238 150 232 C 150 238 152 245 156 243 C 161 240 156 232 150 228 Z"/><path d="M 150 221 L 150 238"/></g>` +
        [[130, 212], [170, 240], [136, 262], [163, 206], [146, 276], [172, 262], [128, 246]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="#fff"/>`).join('') : '';
      return strap(st, F.base, 1.6) + strap(mir(st), F.base, 1.6) + piece(d, F.fill, {
        under: print, folds: fm('M 131 236 Q 134 252 132 266', 'M 136 276 Q 140 282 139 288'),
        lines: [{ d: 'M 124 197 Q 138 198 150 199 Q 162 198 176 197', c: '#fff', w: 2, dash: '0.1 3.2', o: .9 }]
      });
    }
  },
  sweater: {
    cat: 'top', name: '宽松毛衣', thumb: '72 150 156 176',
    render(F) {
      const y1 = 316, puff = 3.5, sl = sleeveD({ y1, puff, eo: 3.4, ei: 3, se: 3.6 }), cf = cuffD(y1, 9, 3.4, 3);
      const body = bodyD({ hem: 306, e: 4.4, hemE: 5, neckY: 170, neckW: 7, se: 3.2 });
      const hem = hemBandD(306, 10, 5, 1.6), neck = spline([[137.2, 162.6, 'c'], [150, 168.4], [162.8, 162.6, 'c'], [163.8, 167, 'c'], [150, 174], [136.2, 167, 'c']]);
      return piece(body, F.fill, { folds: fm('M 124 234 Q 127 246 125 260', 'M 121 280 Q 124 290 123 298') }) +
        piece(hem, F.rib || F.fill, { lines: [{ d: ribLines(105, 195, 296, 307.5, 3.1), o: .35, w: .7 }] }) +
        piece(sl, F.fill, { folds: ['M 98 264 Q 102 272 100 282', 'M 94 292 Q 97 298 96 306'] }) + piece(mir(sl), F.fill, { folds: [mir('M 98 264 Q 102 272 100 282'), mir('M 94 292 Q 97 298 96 306')] }) +
        piece(cf, F.rib || F.fill, { lines: [{ d: ribLines(armO(307) - 3.4, armI(307) + 3, 307, 316.5, 2.6, -.6), o: .35, w: .7 }] }) + piece(mir(cf), F.rib || F.fill, {}) +
        piece(neck, F.rib || F.fill, { rim: false });
    }
  },
  trackJacket: {
    cat: 'top', name: '运动外套', thumb: '72 146 156 180',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, eo: 3, ei: 2.6, se: 3.2 }), cf = cuffD(y1, 7, 3, 2.6);
      const body = bodyD({ hem: 294, e: 3.4, hemE: 3.6, neckY: 176, neckW: 1, neckX: 140, se: 2.8 });
      const hem = hemBandD(294, 7, 3.6, 1.4);
      const collar = spline([[139.6, 159, 'c'], [149.6, 172], [150, 180, 'c'], [141, 175], [135, 167, 'c']]);
      const stripe = y1 => `M ${f1(armO(206) - 1.4)} 206 ` + rng(214, y1 - 8, 8).map(y => `L ${f1(armO(y) - 1.2)} ${y}`).join(' ') + ` M ${f1(armO(206) + 1.8)} 206 ` + rng(214, y1 - 8, 8).map(y => `L ${f1(armO(y) + 2)} ${y}`).join(' ');
      const st = F.print === 'stripes' ? [{ d: stripe(y1), c: F.rib || '#fff', w: 1.7, o: .95 }] : [];
      const so = { folds: ['M 94 262 Q 98 268 97 276'], sheen: ['M 103 226 C 100 250 96 276 91 300'], sheenOp: .5, lines: st };
      return piece(body, F.fill, {
        folds: fm('M 125 236 Q 128 248 126 262'), sheen: ['M 124 196 C 121 222 122 250 125 276'], sheenOp: .55,
        lines: [{ d: 'M 150 180 L 150 294', c: F.detail, w: 1.5, o: .85 }, { d: 'M 150 180 L 150 294', c: '#fff', w: .55, dash: '1.2 1.2', o: .8 }]
      }) + piece(hem, F.fill, { deep: [hem] }) +
        piece(sl, F.fill, so) + piece(mir(sl), F.fill, { ...so, folds: so.folds.map(mir), sheen: so.sheen.map(mir), lines: st.map(l => ({ ...l, d: mir(l.d) })) }) +
        piece(cf, F.fill, { deep: [cf] }) + piece(mir(cf), F.fill, { deep: [mir(cf)] }) +
        piece(collar, F.fill, { deep: [collar] }) + piece(mir(collar), F.fill, { deep: [mir(collar)] }) +
        `<rect x="147.8" y="182" width="4.4" height="7" rx="1.2" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".9"/>`;
    }
  },

  /* ---------------- 外套 ---------------- */
  cardigan: {
    cat: 'outer', name: '长开衫', thumb: '72 146 156 200',
    render(F) {
      const y1 = 316, puff = 5.5, sl = sleeveD({ y1, puff, eo: 4, ei: 3.4, se: 3.6, inPuff: .5 }), cf = cuffD(y1, 10, 4.2, 3.4);
      const panel = spline([[139.6, 163.4], [133, 166.4], [125.2, 168.6], [117.6, 170.4], [112, 173.6], [108.4, 179.6], [106.6, 188], [109, 214], [sideX(240) - 5, 240], [sideX(270) - 6, 270], [sideX(300) - 7, 300], [legO(322) - 7.6, 322, 'c'], [134.6, 325, 'c'], [135.4, 290], [137, 240], [138.6, 196], [140.8, 170, 'c']]);
      const band = 'M 140.8 170 C 138.6 196 137 240 135.4 290 L 134.6 325';
      const pocket = spline([[112.4, 292, 'c'], [130, 292.8, 'c'], [129.6, 312, 'c'], [112, 311, 'c']]);
      const pO = { folds: ['M 120 232 Q 124 250 121 270', 'M 128 286 Q 131 300 129 318'], lines: [{ d: band, c: F.rib || F.detail, w: 3, o: .75 }] };
      const sO = { folds: ['M 99 262 Q 103 270 101 280', 'M 94 292 Q 97 298 96 306', 'M 105 236 Q 108 242 107 250'] };
      return piece(panel, F.fill, pO) + piece(mir(panel), F.fill, { ...pO, folds: pO.folds.map(mir), lines: pO.lines.map(l => ({ ...l, d: mir(l.d) })) }) +
        piece(pocket, F.fill, { lines: [{ d: 'M 113 296 L 129.8 296.6', o: .5 }] }) + piece(mir(pocket), F.fill, { lines: [{ d: mir('M 113 296 L 129.8 296.6'), o: .5 }] }) +
        piece(sl, F.fill, sO) + piece(mir(sl), F.fill, { ...sO, folds: sO.folds.map(mir) }) +
        piece(cf, F.rib || F.fill, { lines: [{ d: ribLines(armO(307) - 4, armI(307) + 3.4, 307, 316.5, 2.6, -.6), o: .4, w: .7 }] }) + piece(mir(cf), F.rib || F.fill, { lines: [{ d: mir(ribLines(armO(307) - 4, armI(307) + 3.4, 307, 316.5, 2.6, -.6)), o: .4, w: .7 }] });
    }
  },
  puffJacket: {
    cat: 'outer', name: '宽松短外套', thumb: '66 136 168 180',
    back(F) { const hood = symS([[150, 140], [137, 141.5], [124, 147], [116, 156], [113.5, 167], [115, 178, 'c'], [150, 178]]); return piece(hood, F.fill, { deep: [symS([[150, 146], [134, 148], [124, 156], [121, 168], [124, 178], [150, 178]])], rim: false }); },
    render(F) {
      const y1 = 318, puff = 7, sl = sleeveD({ y1, puff, eo: 4.5, ei: 4, se: 4.6, inPuff: .45 }), cf = cuffD(y1, 11, 4.8, 4);
      const panel = spline([[140.6, 163], [133, 166], [125, 168.2], [117, 169.6], [110.6, 172.8], [106.4, 179], [104.4, 188], [107.6, 214], [sideX(240) - 7, 240], [sideX(262) - 7.8, 262], [sideX(274) - 8, 274, 'c'], [141.4, 277, 'c'], [142.4, 240], [143.2, 196], [143.4, 170, 'c']]);
      const hem = spline([[sideX(266) - 8, 266, 'c'], [141.6, 269, 'c'], [141.4, 280, 'c'], [sideX(278) - 8.2, 277, 'c']]);
      const hoodRim = spline([[150, 190], [142, 184], [131, 177.5], [121, 172], [118.2, 165], [124.5, 159.6], [133.5, 157.6], [141, 158.8], [142.8, 166], [145.6, 175], [150, 182, 'c']]);
      const dots = F.print === 'dots' ? { under: [[122, 206], [130, 236], [118, 250], [128, 262], [134, 216]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#fff" opacity=".85"/>`).join('') } : {};
      const dotsR = F.print === 'dots' ? { under: [[122, 206], [130, 236], [118, 250], [128, 262], [134, 216]].map(([x, y]) => `<circle cx="${300 - x}" cy="${y}" r="2.4" fill="#fff" opacity=".85"/>`).join('') } : {};
      const sO = { folds: ['M 97 262 Q 101 270 99 280', 'M 92 292 Q 95 298 94 306', 'M 104 236 Q 107 242 106 250'] };
      return piece(panel, F.fill, { ...dots, folds: ['M 122 226 Q 126 240 124 256'] }) + piece(mir(panel), F.fill, { ...dotsR, folds: [mir('M 122 226 Q 126 240 124 256')] }) +
        piece(hem, F.fill, { deep: [hem] }) + piece(mir(hem), F.fill, { deep: [mir(hem)] }) +
        piece(sl, F.fill, sO) + piece(mir(sl), F.fill, { ...sO, folds: sO.folds.map(mir) }) + piece(cf, F.fill, { deep: [cf] }) + piece(mir(cf), F.fill, { deep: [mir(cf)] }) +
        piece(hoodRim, F.fill, { deep: ['M 141 158 L 146 180 L 150 184 L 150 157 Z'] }) + piece(mir(hoodRim), F.fill, { deep: [mir('M 141 158 L 146 180 L 150 184 L 150 157 Z')] });
    }
  }
};
