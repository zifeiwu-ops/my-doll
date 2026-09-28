/* =====================================================================
   新版型 · 甜酷街头（2000s 少女漫杂志风）
   印花背心 / 水手领条纹T / 印花T / 荷叶边无袖衬衫 / 印花插肩T / 领带衬衫 / 系带马甲 / 水手领上衣 / 叠穿摇滚T
   十字机车夹克 / 连帽长外套 / 钩针小披肩 / 毛领大衣 / 格纹双排扣外套 / 毛领机车夹克
   鱼尾牛仔长裙 / 牛仔荷叶衬裙短裙 / 蓬蓬荷叶短裙 / 格纹围裹裙叠七分裤 / 热裤 / 打底裤
   吊带娃娃裙 / 拉链背带裙 / 双排扣荷叶连衣裙 / 麻花毛衣裙
   ===================================================================== */
const _MM = m => (m ? mir : x => x);
/* 短袖（左）：e 越大越宽松 */
const shortSleeve = (e = 1, len = 0) => spline([[118.5, 170.6], [111.6 - e * .4, 172.8], [107.2 - e, 178.6], [104.4 - e * 1.1, 190], [101.2 - e * 1.2, 210 + len * .5], [98.2 - e * 1.2, 226 + len, 'c'], [115.6 + e * .1, 231 + len, 'c'], [118.8, 216], [121.2, 198]]);
const ssFolds = [[110, 184, 104, 222, -1, 2.6, .3], [116, 200, 112, 226, 1, 2, .3]];
const neckRib = () => spline([[137.4, 163.2, 'c'], [150, 169.4], [162.6, 163.2, 'c'], [163.6, 166.6, 'c'], [150, 174.2], [136.4, 166.6, 'c']]);
const sleevePair = (F, fill, d, folds, extra = {}) => piece(d, fill, { autoFolds: false, over: drapeSVG(folds, { op: .55, lo: .4 }), ...extra }) + piece(mir(d), fill, { autoFolds: false, over: drapeSVG(folds.map(mf), { op: .55, lo: .4 }), ...extra });
const longFolds = [[110, 200, 98, 304, -2.4, 3.2, .3], [116, 232, 106, 306, 1.4, 2.6, .35]];
/* 衣服上的印花（没有黑描边，像印上去的） */
function printMotif16(kind, x, y, s = 1) {
  const g = b => `<g transform="translate(${x} ${y}) scale(${s})" opacity=".95">${b}</g>`;
  const T = (t, yy, sz, c, fw = 700, fs = 'normal') => `<text x="0" y="${yy}" text-anchor="middle" font-size="${sz}" font-weight="${fw}" font-style="${fs}" fill="${c}" style="font-family:'Arial Rounded MT Bold','Helvetica Neue',Arial,sans-serif">${t}</text>`;
  if (kind === 'soda') return g(`<rect x="-15" y="-10" width="30" height="20" rx="9" fill="#FFF6DC" stroke="#3A9A9E" stroke-width="1.1"/><rect x="-15" y="-2" width="30" height="4.6" fill="#E8454F"/>` +
    `<circle cx="-4" cy="3.6" r="3.2" fill="#C8202E"/><circle cx="3" cy="4.2" r="3.2" fill="#C8202E"/><path d="M -4 .6 Q -1 -6 4 -7 M 3 1 Q 3.6 -4 4 -7" fill="none" stroke="#4E8E3A" stroke-width=".8"/>` + T('SWEET', 16.4, 5.6, '#3A9A9E'));
  if (kind === 'bunny') return g(`<ellipse cx="-4.4" cy="-10" rx="2.6" ry="7" fill="#FFFFFF" transform="rotate(-12 -4.4 -10)"/><ellipse cx="4.4" cy="-10" rx="2.6" ry="7" fill="#FFFFFF" transform="rotate(12 4.4 -10)"/><ellipse cx="0" cy="1" rx="9" ry="7.6" fill="#FFFFFF"/>` +
    `<circle cx="-3.2" cy="0" r="1" fill="#2A2528"/><circle cx="3.2" cy="0" r="1" fill="#2A2528"/><path d="M -1.6 3 Q -.8 4.2 0 3 Q .8 4.2 1.6 3" fill="none" stroke="#2A2528" stroke-width=".7"/><ellipse cx="-5.6" cy="3" rx="1.6" ry="1" fill="#F7A8C4"/><ellipse cx="5.6" cy="3" rx="1.6" ry="1" fill="#F7A8C4"/>` +
    `<ellipse cx="-14" cy="6" rx="3" ry="2.4" fill="#FFE27A"/><ellipse cx="14" cy="4" rx="2.6" ry="2" fill="#8FD0F2"/>` + T('HAPPY DAY', 17, 5.2, '#FFFFFF'));
  if (kind === 'daisy') { const d = (dx, dy, r) => { let p = ''; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; p += `<ellipse cx="${f1(dx + Math.cos(a) * r * .62)}" cy="${f1(dy + Math.sin(a) * r * .62)}" rx="${f1(r * .42)}" ry="${f1(r * .2)}" transform="rotate(${i * 45} ${f1(dx + Math.cos(a) * r * .62)} ${f1(dy + Math.sin(a) * r * .62)})" fill="#FFFFFF"/>`; } return p + `<circle cx="${dx}" cy="${dy}" r="${f1(r * .3)}" fill="#F2A23A"/>`; };
    return g(d(-9, -2, 7) + d(3, -6, 5.4) + d(10, 4, 6) + T('sunny days', 16, 5.4, '#3A6AB8', 700, 'italic')); }
  if (kind === 'flag') return g(`<rect x="-15" y="-10" width="30" height="20" fill="#C8A6E0"/><path d="M -15 -10 L 15 10 M 15 -10 L -15 10" stroke="#FFFFFF" stroke-width="4"/><path d="M -15 -10 L 15 10 M 15 -10 L -15 10" stroke="#8A4AA6" stroke-width="1.6"/><path d="M 0 -10 V 10 M -15 0 H 15" stroke="#FFFFFF" stroke-width="6"/><path d="M 0 -10 V 10 M -15 0 H 15" stroke="#8A4AA6" stroke-width="3.4"/>`);
  if (kind === 'cross') return g(`<path d="M -3.6 -12 H 3.6 V -3.6 H 12 V 3.6 H 3.6 V 12 H -3.6 V 3.6 H -12 V -3.6 H -3.6 Z" fill="#D8323C" stroke="#8A1A22" stroke-width=".8"/><path d="M -16 -4 Q -12 -10 -5 -9 M 16 -4 Q 12 -10 5 -9" fill="none" stroke="#8A1A22" stroke-width="1.2" stroke-linecap="round"/>`);
  if (kind === 'peace') return g(`<circle r="10" fill="none" stroke="#FFFFFF" stroke-width="1.8"/><path d="M 0 -10 V 10 M 0 2 L -7 7 M 0 2 L 7 7" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>` + T('LOVE', -13, 5.4, '#FFFFFF') + T('PEACE', 18.6, 5.4, '#FFFFFF'));
  if (kind === 'rock') return g(T('Rock', 0, 12, '#8A2A3A', 700, 'italic') + T('Your', 11, 9, '#8A2A3A', 700, 'italic'));
  if (kind === 'star') return g(`<path d="M 0 -9 L 2.6 -2.8 L 9 -2.8 L 3.8 1.2 L 5.8 7.6 L 0 3.8 L -5.8 7.6 L -3.8 1.2 L -9 -2.8 L -2.6 -2.8 Z" fill="#F48FB1"/>` + T('STAR GIRL', 16.4, 6, '#2A2528'));
  if (kind === 'skullheart') return g(`<path d="M -7 -7 L 7 7 M 7 -7 L -7 7" stroke="#F2EEE6" stroke-width="1.6" stroke-linecap="round"/><circle cx="-7" cy="-7" r="1.3" fill="#F2EEE6"/><circle cx="7" cy="-7" r="1.3" fill="#F2EEE6"/><circle cx="-7" cy="7" r="1.3" fill="#F2EEE6"/><circle cx="7" cy="7" r="1.3" fill="#F2EEE6"/><path d="${heartD(0, 0, 4)}" fill="#F2EEE6"/>`);
  return printMotif(kind, x, y, s);
}
/* 蓬蓬的荷叶边层（每层下沿起伏、带收褶线） */
function frillTier(top, hem, xw, xh, n, seed, fill, F, o = {}) {
  const T = flowSkirt({ top, hem, dip: o.dip ?? 2.6, xw, xh, bulge: 0, n, amp: o.amp ?? 2.2, seed, curve: o.curve ?? 3.4, sideN: 3, fw: 1.4 });
  const edge = o.lace ? laceTrim([[T.xh, T.pts[0][1] - 1], ...T.pts, [300 - T.xh, T.pts[T.pts.length - 1][1] - 1]], o.lace, o.laceC || '#FFFDF8') : '';
  return { T, svg: edge + piece(T.d, fill, { autoFolds: false, over: drapeSVG(T.folds, { op: .6, lo: .45 }), lines: [{ d: gatherD(T.xw + 2, 300 - T.xw - 2, top + 1.4, Math.round((300 - 2 * T.xw) / 5), 3, 2.6), o: .4, w: .45 }] }) };
}
/* 系带靴 / 高筒袜用的「交叉系带」 */
const crossLace = (x0, x1, y0, y1, n, c) => { let d = ''; const h = (y1 - y0) / n; for (let i = 0; i < n; i++) { const a = y0 + i * h; d += `M ${f1(x0)} ${f1(a)} L ${f1(x1)} ${f1(a + h)} M ${f1(x1)} ${f1(a)} L ${f1(x0)} ${f1(a + h)} `; } return `<path d="${d}" stroke="${STYLE.line}" stroke-width="2.2" stroke-linecap="round"/><path d="${d}" stroke="${c}" stroke-width="1.1" stroke-linecap="round"/>`; };

Object.assign(TPL, {
  /* ---------------- 上衣 ---------------- */
  graphicTank: {
    cat: 'top', name: '交叉肩带印花背心', thumb: '92 160 116 130',
    render(F) {
      const d = tankD({ top: 186, strapX: 127.4, e: 2.8, hem: 272, hemE: 3.4, dip: 12, curve: 1.8 });
      const st = 'M 126.6 190 L 128.4 170.4', cr = 'M 134.6 170.8 L 151 197';
      const rc = F.rib || '#FFFFFF', bF = [[126, 220, 122, 268, 1.6, 3.2, .3], [140, 232, 139, 270, -.8, 2.4, .35]];
      return strap(st, F.fill, 4.4) + strap(mir(st), F.fill, 4.4) + strap(cr, rc, 1.3) + strap(mir(cr), rc, 1.3) +
        piece(d, F.fill, { autoFolds: false, over: drapeSVG(fm2(bF), { op: .5, lo: .38 }) + printMotif16(F.print, 150, 232, 1.05), lines: [{ d: 'M 124.4 190.6 Q 138 192 150 199 Q 162 192 175.6 190.6', c: rc, w: 1.6, o: .95 }] });
    }
  },
  sailorTee: {
    cat: 'top', name: '水手领条纹短T', thumb: '72 146 156 130',
    render(F) {
      const body = bodyD({ hem: 256, e: 3, hemE: 3.6, neckY: 176, neckW: 7, se: 2.4, curve: 1.4 });
      const sl = shortSleeve(2.4, 2);
      const flap = spline([[139.4, 163.4], [131, 166], [121, 170.4], [112.6, 175.4, 'c'], [116, 186], [126, 196], [138, 204], [149.4, 210, 'c'], [146, 196], [142.6, 180], [141, 168]]);
      const pip = 'M 115.4 178 C 120 188 130 196 146 206.6';
      const tie = spline([[147, 207], [141.4, 218], [138.4, 232, 'c'], [143.4, 229.6], [145.6, 236.4, 'c'], [148, 222], [150, 210]]);
      const ac = F.alt, rc = F.rib || '#FFFFFF';
      return piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[126, 214, 124, 252, 1.4, 3, .3]]), { op: .5, lo: .35 }) }) + sleevePair(F, F.fill, sl, ssFolds) +
        piece(flap, ac, { lines: [{ d: pip, c: rc, w: 1, o: .9 }] }) + piece(mir(flap), ac, { lines: [{ d: mir(pip), c: rc, w: 1, o: .9 }] }) +
        piece(tie, ac, {}) + piece(mir(tie), ac, {}) + `<ellipse cx="150" cy="210.6" rx="4" ry="3.2" fill="${ac}" stroke="${STYLE.line}" stroke-width=".8"/>`;
    }
  },
  graphicTee: {
    cat: 'top', name: '修身印花短袖T', thumb: '72 146 156 140',
    render(F) {
      const body = bodyD({ hem: 272, e: 2.2, hemE: 2.8, neckY: 170, neckW: 7, se: 2, curve: 1.4 });
      return piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[126, 222, 124, 268, 1.4, 3, .3], [140, 240, 140, 270, -.6, 2.2, .35]]), { op: .5, lo: .35 }) + printMotif16(F.print, 150, 218, 1.25) }) +
        sleevePair(F, F.fill, shortSleeve(1.2, -2), ssFolds) + piece(neckRib(), F.rib || F.fill, { rim: false });
    }
  },
  graphicLong: {
    cat: 'top', name: '印花长袖T', thumb: '72 146 156 176',
    render(F) {
      const body = bodyD({ hem: 284, e: 2.8, hemE: 3.4, neckY: 170, neckW: 7, se: 2.4, curve: 1.6 });
      const y1 = 314, sl = sleeveD({ y1, eo: 2.4, ei: 2, se: 2.2 }), cf = cuffD(y1, 6, 2.4, 2);
      return piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[126, 226, 122, 280, 1.6, 3.2, .3]]), { op: .5, lo: .35 }) + printMotif16(F.print, 150, 222, 1.3) }) +
        sleevePair(F, F.alt, sl, longFolds) + piece(cf, F.alt, {}) + piece(mir(cf), F.alt, {}) + piece(neckRib(), F.rib || F.fill, { rim: false });
    }
  },
  frillBlouse: {
    cat: 'top', name: '黑蕾丝荷叶边无袖衬衫', thumb: '84 146 132 140',
    render(F) {
      const body = bodyD({ hem: 268, e: 2.4, hemE: 3.4, neckY: 166, neckW: 7.6, se: 1.6, curve: 1.4, flare: 1.4 });
      const col = spline([[150, 167], [146, 162.6], [139.6, 161.8], [133.4, 164.4], [131.4, 170.4], [135.4, 176], [142.6, 177], [148, 172.4], [150, 168, 'c']]);
      const pl = [[146.4, 178], [146.2, 200], [146, 222], [145.8, 244], [145.6, 266]];
      const lc = F.alt === F.fill ? '#2A2528' : F.alt;
      const colP = m => piece(_MM(m)(col), F.fill, { lines: [{ d: _MM(m)('M 132.6 169.4 Q 135.4 175.4 142.6 176.4 Q 147 174.4 148.8 170.6'), c: lc, w: 1.2, o: .95 }] });
      return piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[128, 214, 124, 264, 1.4, 3, .3]]), { op: .45, lo: .32 }), lines: [{ d: 'M 146.4 176 L 145.6 268 M 153.6 176 L 154.4 268', o: .4, w: .7 }] }) +
        laceTrim(pl, 3.4, lc, { dir: [-1, 0], hc: '#6A6268' }) + laceTrim(pl.map(mxp), 3.4, lc, { dir: [1, 0], hc: '#6A6268' }) +
        [186, 204, 222, 240, 258].map(y => btn(150, y, lc, 1.2)).join('') + colP(false) + colP(true) + ribbonBow(150, 179, .42, lc, 1);
    }
  },
  raglanPrint: {
    cat: 'top', name: '印花插肩长袖T', thumb: '72 150 156 176',
    render(F) { return TPL.raglan.render(F) + printMotif16(F.print, 150, 226, 1.35); }
  },
  tieShirt: {
    cat: 'top', name: '卷袖衬衫配格纹领带', thumb: '72 146 156 160',
    render(F) {
      const body = bodyD({ hem: 286, e: 3.2, hemE: 4, neckY: 190, neckW: 1.2, neckX: 139.6, se: 2.4, curve: 1.6 });
      const sl = shortSleeve(2.6, 22), cuffL = spline([[armO(242) - 3.6, 241, 'c'], [armI(247) + 2.8, 246.6, 'c'], [armI(254) + 2.8, 254, 'c'], [armO(249) - 3.8, 249, 'c']]);
      const under = symS([[150, 196], [144, 184], [140, 170], [139.6, 165, 'c'], [150, 170]]);
      const knot = 'M 146 176.4 L 154 176.4 L 152.4 184.6 L 147.6 184.6 Z', blade = 'M 147.6 184.4 L 152.4 184.4 L 156.4 236 L 150 244 L 143.6 236 Z';
      const tf = F.rib || 'url(#pat-argylePurple)';
      return piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[124, 220, 120, 280, 2, 3.4, .3]]), { op: .45, lo: .35 }), lines: [{ d: 'M 150 196 L 150 286', o: .4 }] }) + piece(under, F.alt, {}) +
        piece(blade, tf, {}) + piece(knot, tf, {}) + sleevePair(F, F.fill, sl, ssFolds) + piece(cuffL, F.fill, { deep: [cuffL] }) + piece(mir(cuffL), F.fill, { deep: [mir(cuffL)] }) +
        piece(SHIRT_COLLAR, F.fill, {}) + piece(mir(SHIRT_COLLAR), F.fill, {}) +
        `<g transform="translate(170 210)">${ribbonBow(0, 0, .5, '#8CC84A', 1)}</g><circle cx="165" cy="206" r="3" fill="#FFFFFF" stroke="${STYLE.line}" stroke-width=".6"/><path d="${heartD(165, 206, 1.8)}" fill="#E8567A"/>`;
    }
  },
  laceVest: {
    cat: 'top', name: '白色系带黑马甲', thumb: '92 160 116 120',
    render(F) {
      const d = symS([[150, 204], [143, 188], [136, 176], [131.4, 170.4, 'c'], [124.4, 172], [124.6, 188], [120, 206], [sideX(222) - 2, 222], [sideX(240) - 2.4, 240], [sideX(260) - 2.8, 260, 'c'], [138, 266], [150, 272]]);
      const lc = F.alt === F.fill ? '#FFFFFF' : F.alt;
      return piece(d, F.fill, { autoFolds: false, over: drapeSVG(fm2([[132, 214, 130, 262, 1, 2.6, .3]]), { op: .45, lo: .35 }), lines: [{ d: 'M 146 206 L 146 268 M 154 206 L 154 268', o: .5, w: .7 }, { d: 'M 136 176 Q 128 214 132 264', c: lc, w: .8, o: .5 }, { d: mir('M 136 176 Q 128 214 132 264'), c: lc, w: .8, o: .5 }] }) +
        crossLace(146, 154, 212, 262, 4, lc) + ribbonBow(150, 212, .3, lc, 1);
    }
  },
  sailorBlouse: {
    cat: 'top', name: '格纹领结水手服上衣', thumb: '72 146 156 176',
    render(F) {
      const body = bodyD({ hem: 262, e: 2.8, hemE: 3.4, neckY: 180, neckW: 6, se: 2.2, curve: 1.4 });
      const y1 = 306, sl = sleeveD({ y1, puff: 1.6, eo: 2.6, ei: 2.2, se: 2.2 }), cf = cuffD(y1 + 10, 12, 2.6, 2.2);
      const flap = spline([[139.4, 163.4], [131, 166], [122, 170], [114, 175, 'c'], [118, 185], [128, 193], [140, 199], [149, 202, 'c'], [146, 192], [142.6, 178], [141, 168]]);
      const ac = F.alt, rc = F.rib || '#F4A7C0', hemL = [[sideX(262) - 3.4, 261.6], [128, 263.4], [150, 264]];
      return piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[126, 214, 124, 258, 1.4, 3, .3]]), { op: .45, lo: .35 }) }) +
        laceTrim(hemL, 2.4, rc) + laceTrim(hemL.map(mxp).reverse(), 2.4, rc) +
        sleevePair(F, F.fill, sl, longFolds) + piece(cf, ac, {}) + piece(mir(cf), ac, {}) +
        piece(flap, F.fill, { lines: [{ d: 'M 116.6 177 C 122 186 132 194 146.6 200', c: rc, w: 1.3, o: .95 }] }) + piece(mir(flap), F.fill, { lines: [{ d: mir('M 116.6 177 C 122 186 132 194 146.6 200'), c: rc, w: 1.3, o: .95 }] }) +
        ribbonBow(150, 200, 1.02, ac, 1);
    }
  },
  rockLayer: {
    cat: 'top', name: '露肩摇滚T叠白长袖', thumb: '66 146 168 176',
    render(F) {
      const y1 = 316, sl = sleeveD({ y1, eo: 2, ei: 1.8, se: 2 }), cf = cuffD(y1, 6, 2.2, 1.8);
      const under = bodyD({ hem: 250, e: 2, hemE: 2.4, neckY: 168, neckW: 7, se: 1.8 });
      const tee = symS([[150, 192], [140, 190.4], [128, 187.2], [116, 186, 'c'], [104, 194], [98, 208], [96.6, 222, 'c'], [112, 224], [sideX(232) - 4, 232], [sideX(260) - 5, 260], [sideX(290) - 6, 290, 'c'], [150, 293]]);
      return piece(under, F.alt, {}) + sleevePair(F, F.alt, sl, longFolds) + piece(cf, F.alt, {}) + piece(mir(cf), F.alt, {}) +
        piece(tee, F.fill, { autoFolds: false, over: drapeSVG(fm2([[118, 214, 112, 286, 2, 3.4, .3], [134, 226, 132, 288, -1, 2.6, .35]]), { op: .5, lo: .38 }) + printMotif16('rock', 150, 236, 1.5), lines: [{ d: 'M 116 187 Q 133 193 150 193.4 Q 167 193 184 187', c: '#2A2528', w: 3, o: .9 }] });
    }
  },

  /* ---------------- 外套 ---------------- */
  crossJacket: {
    cat: 'outer', name: '黑十字白色立领夹克', thumb: '66 140 168 180',
    render(F) {
      const y1 = 316, sl = sleeveD({ y1, puff: 2, eo: 3.2, ei: 2.8, se: 3 }), cf = cuffD(y1, 10, 3.2, 2.8);
      const body = bodyD({ hem: 266, e: 3.6, hemE: 4.2, neckY: 164, neckW: 7.6, se: 2.8, curve: 1.4 });
      const band = symS([[150, 204], [113.4, 204], [112.8, 214], [150, 214]]);
      const collar = spline([[139, 153.4, 'c'], [150, 155], [161, 153.4, 'c'], [162.4, 164.4, 'c'], [150, 166.4], [137.6, 164.4, 'c']]);
      const ac = F.alt === F.fill ? '#2A2528' : F.alt;
      const armBand = m => { const M = _MM(m); return piece(M(spline([[armO(236) - 3.8, 236, 'c'], [armI(240) + 3, 240, 'c'], [armI(248) + 3, 248, 'c'], [armO(244) - 3.9, 244, 'c']])), ac, { rim: false }); };
      return piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[124, 224, 122, 262, 1.4, 3, .3]]), { op: .45, lo: .35 }) }) + piece(band, ac, { rim: false }) +
        piece('M 145.4 166 L 154.6 166 L 154.6 267 L 145.4 267 Z', ac, { rim: false, lines: [{ d: 'M 150 166 L 150 267', c: '#C9CDD6', w: 1.2, dash: '.8 .8', o: .95 }] }) +
        sleevePair(F, F.fill, sl, longFolds) + armWrap('L', armBand(false)) + armWrap('R', armBand(true)) + piece(cf, F.fill, {}) + piece(mir(cf), F.fill, {}) + piece(collar, F.fill, {}) +
        `<rect x="147.6" y="167" width="4.8" height="7" rx="1.2" fill="url(#grad-chrome)" stroke="${STYLE.line}" stroke-width=".7"/>`;
    }
  },
  hoodCoat: {
    cat: 'outer', name: '连帽长外套', thumb: '60 136 180 250',
    back: F => hoodBack(F.fill),
    render(F) {
      const y1 = 318, sl = sleeveD({ y1, puff: 4.4, eo: 3.6, ei: 3.2, se: 3.8, inPuff: .45 }), cf = cuffD(y1, 9, 3.8, 3.2);
      const panel = openPanel(372, 13, 8.4, 142.2);
      const edge = [[141, 178], [140.6, 230], [140.4, 290], [140.4, 350], [140.8, 372]];
      const pF = [[118, 214, 108, 366, 2.4, 3.8, .35], [130, 240, 128, 368, -1.4, 3, .4]];
      const lining = 'M 141 176 C 140.6 240 140.4 310 140.8 372 L 137.4 372 C 137 310 137.2 240 137.6 178 Z';
      return piece(panel, F.fill, { autoFolds: false, over: drapeSVG(pF, { op: .5, lo: .38 }) + `<path d="${lining}" fill="${F.alt}"/>` + printMotif16('skullheart', 170 - 44, 238, .9) }) +
        piece(mir(panel), F.fill, { autoFolds: false, over: drapeSVG(pF.map(mf), { op: .5, lo: .38 }) + `<path d="${mir(lining)}" fill="${F.alt}"/>` }) +
        sleevePair(F, F.fill, sl, longFolds) + piece(cf, F.fill, { deep: [cf] }) + piece(mir(cf), F.fill, { deep: [mir(cf)] }) +
        piece(hoodRimL, F.fill, { deep: ['M 141 161 L 146 180 L 150 184 L 150 160 Z'] }) + piece(mir(hoodRimL), F.fill, { deep: [mir('M 141 161 L 146 180 L 150 184 L 150 160 Z')] });
    }
  },
  openCoat: {
    cat: 'outer', name: '敞开式长外套（带扣带）', thumb: '56 136 188 240',
    render(F) {
      const y1 = 318, sl = sleeveD({ y1, puff: 4, eo: 4, ei: 3.4, se: 4.2 }), cf = cuffD(y1, 10, 4.2, 3.4);
      const panel = openPanel(362, 20, 9, 142.2);
      const lapel = spline([[141.8, 162.6], [134, 165.4], [124.4, 169.4], [118, 177], [122.6, 190], [128, 204], [131, 218, 'c'], [134, 204], [137.4, 186], [141, 172]]);
      const lining = 'M 131 222 C 130.6 270 130.4 320 130.8 362 L 126 362 C 126 320 126.4 270 127 224 Z';
      const pF = [[116, 230, 104, 356, 2.4, 3.8, .35], [124, 250, 122, 358, -1.4, 3, .4]];
      const ac = F.alt === F.fill ? '#2A2528' : F.alt;
      const strapB = m => { const M = _MM(m); return strap(M('M 128 250 C 138 252 146 256 150 262'), ac, 2.6) + `<rect x="${m ? 300 - 131 - 5 : 131}" y="248" width="5" height="6" rx="1" fill="none" stroke="#C9CDD6" stroke-width="1.2"/>`; };
      const cuffStrap = m => { const M = _MM(m); return armWrap(m ? 'R' : 'L', strap(M(`M ${f1(armO(298) - 4)} 297 L ${f1(armI(300) + 3.4)} 300`), ac, 2.4)); };
      return piece(panel, F.fill, { autoFolds: false, over: `<path d="${lining}" fill="${ac}"/>` + drapeSVG(pF, { op: .5, lo: .38 }) }) + piece(mir(panel), F.fill, { autoFolds: false, over: `<path d="${mir(lining)}" fill="${ac}"/>` + drapeSVG(pF.map(mf), { op: .5, lo: .38 }) }) +
        strapB(false) + strapB(true) + sleevePair(F, F.fill, sl, longFolds) + piece(cf, F.fill, { deep: [cf] }) + piece(mir(cf), F.fill, { deep: [mir(cf)] }) + cuffStrap(false) + cuffStrap(true) +
        piece(lapel, ac, {}) + piece(mir(lapel), ac, {});
    }
  },
  crochetCape: {
    cat: 'outer', name: '毛球钩针小披肩', thumb: '72 146 156 110',
    render(F) {
      const cape = symS([[150, 176], [142, 166], [134, 164.6], [124, 167.4], [112, 172], [103.6, 182], [99, 198], [98.4, 214, 'c'], [112, 222], [128, 226], [140, 222], [146, 204], [150, 196]]);
      const holes = [[110, 190], [122, 184], [134, 182], [116, 206], [130, 202], [138, 212], [106, 208]].flatMap(([x, y]) => [[x, y], [300 - x, y]]).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="none" stroke="${mix(F.base, '#6A5A4A', .3)}" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="1.2" fill="${mix(F.base, '#6A5A4A', .22)}"/>`).join('');
      const hemL = [[98.4, 214], [112, 222], [128, 226], [140, 222], [146, 206]];
      const pom = (x, y) => `<path d="M ${x} ${y - 20} L ${x} ${y}" stroke="${F.base}" stroke-width="1.3"/>` + piece(spline(wavy([[x - 4.4, y], [x, y - 4.4], [x + 4.4, y], [x, y + 4.4], [x - 4.4, y]], .8, 5).slice(0, -1)), '#FFFFFF', { rim: [1, .8] });
      return laceTrim(hemL, 4, F.fill === 'none' ? '#FFF6E0' : F.base, { hc: mix(F.base, '#6A5A4A', .3) }) + laceTrim(hemL.map(mxp), 4, F.base, { hc: mix(F.base, '#6A5A4A', .3) }) +
        piece(cape, F.fill, { autoFolds: false, over: holes + drapeSVG(fm2([[118, 180, 108, 212, -1, 2.4, .3]]), { op: .45, lo: .3 }) }) + pom(146, 218) + pom(154, 222);
    }
  },
  furCoat: {
    cat: 'outer', name: '毛领长大衣', thumb: '56 136 188 260',
    render(F) {
      const y1 = 318, sl = sleeveD({ y1, puff: 4, eo: 4, ei: 3.4, se: 4.2 }), cf = cuffD(y1, 9, 4.2, 3.4);
      const panel = openPanel(392, 16, 9.6, 142.2);
      const lining = 'M 134.8 190 C 134.6 250 134.2 330 134.6 392 L 128 392 C 128 330 128.6 250 129 192 Z';
      const fur = spline(wavy([[150, 166], [142, 162.4], [130, 164], [118, 168], [108, 176], [108, 190], [116, 204], [126, 214], [134, 226], [136, 214], [134, 198], [140, 180], [150, 176]], 1.6, 12));
      const cuffFur = m => { const M = _MM(m), pts = [[armO(304) - 6, 304], [(armO(304) + armI(304)) / 2, 300], [armI(306) + 6, 306], [armI(316) + 6.4, 316], [(armO(316) + armI(316)) / 2, 318.6], [armO(314) - 6.6, 314]]; return piece(M(spline(wavy(pts.concat([pts[0]]), 1.4, 8).slice(0, -1))), '#FFF8EE', { rim: [1.6, 1.2] }); };
      const pF = [[116, 230, 102, 386, 2.4, 4, .35], [126, 260, 122, 388, -1.4, 3, .4]];
      const spade = (x, y) => `<path d="M ${x} ${y - 4} C ${x - 4} ${y} ${x - 4} ${y + 3} ${x - 1.4} ${y + 3} Q ${x - .6} ${y + 3} ${x - .4} ${y + 2} L ${x - 1.4} ${y + 5} L ${x + 1.4} ${y + 5} L ${x + .4} ${y + 2} Q ${x + .6} ${y + 3} ${x + 1.4} ${y + 3} C ${x + 4} ${y + 3} ${x + 4} ${y} ${x} ${y - 4} Z" fill="#2A2528"/>`;
      return piece(panel, F.fill, { autoFolds: false, over: `<path d="${lining}" fill="${F.alt}"/>` + drapeSVG(pF, { op: .5, lo: .38 }) }) + piece(mir(panel), F.fill, { autoFolds: false, over: `<path d="${mir(lining)}" fill="${F.alt}"/>` + drapeSVG(pF.map(mf), { op: .5, lo: .38 }) }) +
        [244, 276, 308].map(y => spade(128, y)).join('') + sleevePair(F, F.fill, sl, longFolds) + armWrap('L', cuffFur(false)) + armWrap('R', cuffFur(true)) +
        piece(fur, '#FFF8EE', { rim: [2, 1.4], folds: ['M 118 172 Q 116 184 122 196', 'M 128 168 Q 126 184 132 204'] }) + piece(mir(fur), '#FFF8EE', { rim: [2, 1.4], folds: [mir('M 118 172 Q 116 184 122 196')] });
    }
  },
  plaidJacket: {
    cat: 'outer', name: '格纹双排扣短外套', thumb: '66 140 168 180',
    render(F) {
      const y1 = 316, sl = sleeveD({ y1, puff: 2.2, eo: 3.2, ei: 2.8, se: 3 }), cf = cuffD(y1, 12, 3.4, 2.8);
      const body = bodyD({ hem: 276, e: 3.6, hemE: 6, neckY: 206, neckW: 1, neckX: 140, se: 2.8, curve: 2, flare: 2 });
      const lapel = spline([[141.6, 162.6], [133.6, 165.4], [124, 169], [120, 176], [126, 186], [136, 200], [148.4, 212, 'c'], [146, 198], [143.4, 180], [141.8, 170]]);
      const belt = spline([[sideX(248) - 4, 246.6, 'c'], [150, 249], [300 - sideX(248) + 4, 246.6, 'c'], [300 - sideX(256) + 4.2, 255, 'c'], [150, 257.4], [sideX(256) - 4.2, 255, 'c']]);
      const ac = F.alt === F.fill ? '#2A2528' : F.alt, rb = F.rib || '#C82C3A';
      return piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[124, 224, 116, 272, 2, 3.2, .3], [136, 262, 134, 276, 0, 2, .3]]), { op: .45, lo: .35 }), lines: [{ d: 'M 150 212 L 150 278', o: .5 }] }) +
        [222, 236, 264].flatMap(y => [btn(140.6, y, ac, 1.7), btn(159.4, y, ac, 1.7)]).join('') +
        piece(belt, rb, { rim: false }) + `<rect x="134" y="247" width="9" height="9.6" rx="1.4" fill="none" stroke="#C9CDD6" stroke-width="1.6"/>` +
        sleevePair(F, F.fill, sl, longFolds) + piece(cf, ac, {}) + piece(mir(cf), ac, {}) + piece(lapel, ac, {}) + piece(mir(lapel), ac, {});
    }
  },
  furMoto: {
    cat: 'outer', name: '毛领机车短夹克', thumb: '60 136 180 180',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, puff: 6, eo: 4.4, ei: 3.8, se: 4.4, inPuff: .5 }), cf = cuffD(y1, 8, 4.4, 3.8);
      const panel = openPanel(262, 18, 7, 142.2);
      const fur = spline(wavy([[150, 170], [142, 162.4], [128, 163.6], [114, 168], [104, 178], [104, 190], [114, 196], [126, 194], [134, 204], [138, 196], [140, 182], [150, 180]], 1.8, 12));
      const ac = F.alt === F.fill ? '#2A2528' : F.alt;
      const strapsL = ['M 101 238 L 118 252', 'M 101 252 L 118 238', 'M 98 272 L 116 284', 'M 98 284 L 116 272'].join(' ');
      const cuffFur = m => { const M = _MM(m), pts = [[armO(304) - 6, 304], [(armO(304) + armI(304)) / 2, 300.6], [armI(306) + 6, 306], [armI(315) + 6.4, 315], [(armO(315) + armI(315)) / 2, 318], [armO(313) - 6.6, 313]]; return piece(M(spline(wavy(pts.concat([pts[0]]), 1.4, 8).slice(0, -1))), '#FFFFFF', { rim: [1.6, 1.2] }); };
      return piece(panel, F.fill, { autoFolds: false, over: drapeSVG([[120, 214, 116, 258, 1.4, 3, .3]], { op: .45, lo: .35 }) }) + piece(mir(panel), F.fill, { autoFolds: false, over: drapeSVG([mf([120, 214, 116, 258, 1.4, 3, .3])], { op: .45, lo: .35 }) }) +
        sleevePair(F, F.fill, sl, longFolds, {}) + armWrap('L', `<path d="${strapsL}" stroke="${STYLE.line}" stroke-width="4.4" stroke-linecap="round"/><path d="${strapsL}" stroke="${ac}" stroke-width="3" stroke-linecap="round"/>`) +
        armWrap('R', `<path d="${mir(strapsL)}" stroke="${STYLE.line}" stroke-width="4.4" stroke-linecap="round"/><path d="${mir(strapsL)}" stroke="${ac}" stroke-width="3" stroke-linecap="round"/>`) +
        armWrap('L', cuffFur(false)) + armWrap('R', cuffFur(true)) + piece(fur, '#FFFFFF', { rim: [2, 1.4] }) + piece(mir(fur), '#FFFFFF', { rim: [2, 1.4] });
    }
  },

  /* ---------------- 下装 ---------------- */
  mermaidDenim: {
    cat: 'bottom', name: '荷叶边鱼尾牛仔长裙', thumb: '56 270 188 320', long: true,
    render(F) {
      const L = [[outerX(283) - 2.8, 283, 'c'], [outerX(300) - 3.6, 300], [outerX(330) - 4, 330], [outerX(380) - 4.6, 380], [110.4, 430], [104, 480], [96, 530], [90, 556, 'c']];
      const H = hemLine(90, 210, 556, 7, 1.4, 171, 3).pts;
      const d = spline([[150, 286.4], ...L, ...H, ...L.slice().reverse().map(mxp)]);
      const R = flowSkirt({ top: 552, hem: 580, dip: 2.6, xw: 89, xh: 74, bulge: 0, n: 12, amp: 2.6, seed: 172, curve: 3.6, sideN: 3, fw: 1.6 });
      const seams = ['M 128 296 C 126 360 124 440 118 556', 'M 150 290 L 150 556'].flatMap(x => [x, mir(x)]).join(' ');
      return piece(R.d, F.fill, { autoFolds: false, over: drapeSVG(R.folds, { op: .6, lo: .45 }), lines: [{ d: gatherD(90, 210, 554, 24, 3, 3), o: .4, w: .45 }] }) +
        piece(d, F.fill, { autoFolds: false, over: drapeSVG(fm2([[120, 440, 104, 552, -2, 3.6, .3], [136, 460, 132, 554, 1, 2.6, .3]]), { op: .5, lo: .38 }), lines: [{ d: seams, c: F.stitch, dash: '1.8 1.4', o: .85 }, { d: POCKET, c: F.stitch, dash: '1.6 1.2', o: .9 }, { d: mir(POCKET), c: F.stitch, dash: '1.6 1.2', o: .9 }] }) +
        piece(bandD(283, 6.6, 3.4, 2.8, 2.9), F.fill, { lines: [{ d: 'M 112 286.4 Q 150 292.2 188 286.4', c: F.stitch, dash: '1.8 1.4', o: .9 }] }) +
        `<path d="${heartD(176, 540, 3.4)}" fill="#E8454F" stroke="${STYLE.line}" stroke-width=".5"/>`;
    }
  },
  denimFrillMini: {
    cat: 'bottom', name: '牛仔短裙叠荷叶衬裙', thumb: '72 272 156 90',
    render(F) {
      const sk = skirtD({ top: 283, dip: 3.4, e: 2.8, hem: 320, flare: 9, hipY: 300, curve: 2.6 });
      const xh = outerX(300) - 2.8 - 9, ac = F.alt;
      const t3 = frillTier(336, 354, xh - 7, xh - 14, 13, 181, ac, F, { lace: 2, laceC: ac });
      const t2 = frillTier(326, 344, xh - 3, xh - 9, 12, 182, ac, F, { lace: 2, laceC: ac });
      const t1 = frillTier(316, 334, xh + 1, xh - 4, 11, 183, ac, F, { lace: 2, laceC: ac });
      return t3.svg + t2.svg + t1.svg + piece(sk, F.fill, { autoFolds: false, over: drapeSVG(fm2([[128, 298, 124, 318, 1, 2.4, .3]]), { op: .5, lo: .38 }), lines: [{ d: FLY, c: F.stitch, dash: '1.6 1.2', o: .9 }, { d: POCKET, c: F.stitch, dash: '1.6 1.2', o: .9 }, { d: mir(POCKET), c: F.stitch, dash: '1.6 1.2', o: .9 }, { d: `M ${f1(xh + 2)} 316 Q 150 322 ${f1(300 - xh - 2)} 316`, c: F.stitch, dash: '1.6 1.2', o: .9 }] }) +
        piece(bandD(283, 6.4, 3.4, 2.8, 2.9), F.fill, { lines: [{ d: 'M 112 286.4 Q 150 292.2 188 286.4', c: F.stitch, dash: '1.8 1.4', o: .9 }] });
    }
  },
  fluffyMini: {
    cat: 'bottom', name: '蓬蓬荷叶短裙', thumb: '64 272 172 90',
    render(F) {
      const xw = outerX(284) - 2.8, ac = F.alt;
      const under = frillTier(334, 352, xw - 22, xw - 28, 16, 191, ac, F, { amp: 2.6 });
      const t3 = frillTier(318, 346, xw - 12, xw - 24, 14, 192, F.fill, F, { amp: 3.2 });
      const t2 = frillTier(302, 328, xw - 5, xw - 14, 12, 193, F.fill, F, { amp: 3 });
      const t1 = frillTier(286, 310, xw, xw - 7, 10, 194, F.fill, F, { amp: 2.6 });
      return under.svg + t3.svg + t2.svg + t1.svg + piece(bandD(283, 5.4, 3.4, 2.8, 2.9), F.rib || F.fill, {});
    }
  },
  wrapCapris: {
    cat: 'bottom', name: '格纹围裹片叠短裙七分裤', thumb: '72 270 156 250',
    render(F) {
      const pants = pantsD({ top: 290, hem: 500, ease: y => 3.2 + Math.max(0, y - 330) * .01, inE: () => 2.6 });
      const cuff = legCuffD(490, 502, 3.8, 2.8, 4, 2.9);
      const sk = skirtD({ top: 283, dip: 3.4, e: 3, hem: 342, flare: 6, hipY: 300, curve: 2.4 });
      const wrap = spline([[outerX(286) - 4, 286, 'c'], [150, 291.6], [156, 292.4], [150, 360, 'c'], [outerX(330) - 8, 352, 'c'], [outerX(300) - 5.4, 310]]);
      const belt = spline([[outerX(288) - 4.4, 286, 'c'], [150, 294], [300 - outerX(288) + 4.4, 290, 'c'], [300 - outerX(296) + 4.6, 297.4, 'c'], [150, 301.4], [outerX(296) - 4.6, 293.4, 'c']]);
      const ac = F.alt, rb = F.rib || '#C82C3A';
      return piece(pants, F.fill, { autoFolds: false, over: drapeSVG(fm2([[124, 360, 120, 494, 1.4, 3, .3], [138, 380, 138, 496, -.8, 2.4, .35]]), { op: .5, lo: .38 }), lines: [{ d: 'M 110 420 Q 120 424 132 421', o: .4 }, { d: mir('M 110 420 Q 120 424 132 421'), o: .4 }] }) +
        piece(cuff, F.fill, { deep: [cuff] }) + piece(mir(cuff), F.fill, { deep: [mir(cuff)] }) +
        piece(sk, F.detail === F.fill ? '#5A565A' : '#5A565A', { autoFolds: false, over: drapeSVG(fm2([[132, 300, 130, 340, 0, 2.4, .3]]), { op: .5, lo: .38 }) }) +
        piece(wrap, ac, { autoFolds: false, over: drapeSVG([[124, 296, 118, 352, -1, 2.6, .3], [140, 300, 142, 358, 1, 2.4, .3]], { op: .55, lo: .4 }) }) +
        piece(belt, rb, { rim: false }) + `<rect x="160" y="292" width="8" height="9" rx="1.4" fill="none" stroke="#C9CDD6" stroke-width="1.5"/><path d="M 164 296.4 L 172 296.6" stroke="#C9CDD6" stroke-width="1.2"/>`;
    }
  },
  hotShorts: {
    cat: 'bottom', name: '链条热裤', thumb: '84 270 132 80',
    render(F) {
      const d = pantsD({ top: 286, hem: 326, ease: y => 3 + (y - 286) * .04, inE: () => 2.2 });
      const cuff = legCuffD(318, 328, 4.4, 2.2, 4.8, 2.2);
      const links = Array.from({ length: 14 }, (_, i) => { const t = i / 13, x = 112 + 22 * t, y = 294 + 34 * Math.sin(t * Math.PI) + 4 * t; return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="1.9" ry="1.2" fill="none" stroke="#C9CDD6" stroke-width="1" transform="rotate(${f1(40 - 80 * t)} ${f1(x)} ${f1(y)})"/>`; }).join('');
      return piece(d, F.fill, { autoFolds: false, over: drapeSVG(fm2([[120, 300, 118, 322, 0, 2.4, .3]]), { op: .5, lo: .38 }), lines: [{ d: FLY, o: .6 }, { d: POCKET, o: .7 }, { d: mir(POCKET), o: .7 }] }) +
        piece(cuff, F.fill, { deep: [cuff] }) + piece(mir(cuff), F.fill, { deep: [mir(cuff)] }) + piece(bandD(286, 6, 3.4, 3, 3.1), F.fill, {}) + links;
    }
  },
  leggings: {
    cat: 'bottom', name: '修身打底裤', thumb: '84 270 132 316',
    render(F) {
      const d = pantsD({ top: 286, hem: 566, ease: () => 1.3, inE: () => 1.1 });
      return piece(d, F.fill, { autoFolds: false, over: glowSVG(['M 116 330 C 114 380 116 430 118 470', mir('M 116 330 C 114 380 116 430 118 470'), 'M 122 480 C 124 510 126 540 127 560', mir('M 122 480 C 124 510 126 540 127 560')], .22, 3) + drapeSVG(fm2([[116, 424, 128, 432, 0, 2, .2, .5]]), { op: .5, lo: .3 }) }) +
        piece(bandD(286, 5, 3.4, 1.4, 1.5), F.fill, {});
    }
  },

  /* ---------------- 连衣裙 ---------------- */
  babydollSlip: {
    cat: 'dress', name: '交叉肩带荷叶娃娃裙', thumb: '64 160 172 200',
    render(F) {
      const bod = tankD({ top: 196, strapX: 128.6, e: 2, hem: 224, hemE: 2.4, dip: 8, curve: 1 });
      const L = flowSkirt({ top: 220, hem: 340, dip: 1.6, xw: sideX(222) - 2.4, xh: 92, bulge: 3, n: 9, amp: 3.2, seed: 201, curve: 3, pow: .7, fw: 2.2 });
      const R = frillTier(334, 356, 92, 80, 14, 202, F.fill, F, { amp: 3 });
      const st = 'M 128.8 197 L 129.4 170.6', cr = 'M 135.4 170.8 L 152 198';
      return R.svg + piece(L.d, F.fill, { autoFolds: false, over: drapeSVG(L.folds, { op: .55, lo: .4 }) }) +
        strap(st, F.fill, 1.4) + strap(mir(st), F.fill, 1.4) + strap(cr, F.fill, 1.1) + strap(mir(cr), F.fill, 1.1) +
        piece(bod, F.fill, { autoFolds: false, lines: [{ d: gatherD(114, 186, 216, 16, 3.4, 2), o: .4, w: .45 }] });
    }
  },
  zipPinafore: {
    cat: 'dress', name: '拉链背带连衣裙', thumb: '72 164 156 200', z: 32, keepTop: true,
    render(F) {
      const bib = symS([[150, 204], [134, 204.4], [132, 222], [sideX(244) - 2, 244], [150, 245]]);
      const L = flowSkirt({ top: 242, hem: 346, dip: 1.4, xw: sideX(246) - 2.4, flare: 14, bulge: 1, n: 7, amp: 1.6, seed: 211, curve: 2.6, fw: 2 });
      const st = 'M 134.4 205 C 132.6 194 130.6 182 129.4 170.6';
      const zip = 'M 150 206 L 150 346';
      const belt = spline([[sideX(250) - 2.8, 248, 'c'], [150, 250.4], [300 - sideX(250) + 2.8, 248, 'c'], [300 - sideX(256) + 3, 254.4, 'c'], [150, 256.8], [sideX(256) - 3, 254.4, 'c']]);
      return piece(L.d, F.fill, { autoFolds: false, over: drapeSVG(L.folds, { op: .5, lo: .38 }), lines: [{ d: zip, c: '#C9CDD6', w: 1.8, dash: '.9 .9', o: .9 }] }) +
        strap(st, F.fill, 3.4) + strap(mir(st), F.fill, 3.4) + piece(bib, F.fill, { lines: [{ d: zip, c: '#C9CDD6', w: 1.8, dash: '.9 .9', o: .9 }] }) +
        piece(belt, F.fill, { rim: false }) + `<rect x="120" y="247.4" width="6" height="8" rx="1.6" fill="none" stroke="#C9CDD6" stroke-width="1.4"/><rect x="174" y="247.4" width="6" height="8" rx="1.6" fill="none" stroke="#C9CDD6" stroke-width="1.4"/>` +
        strap('M 123 256 C 124 272 120 290 116 306', F.fill, 2.6) + `<rect x="147.4" y="206" width="5.2" height="7" rx="1.2" fill="url(#grad-chrome)" stroke="${STYLE.line}" stroke-width=".7"/>`;
    }
  },
  militaryDress: {
    cat: 'dress', name: '双排扣荷叶边连衣裙', thumb: '64 146 172 220',
    render(F) {
      const y1 = 318, sl = sleeveD({ y1, puff: 1.4, eo: 2.6, ei: 2.2, se: 2.4 }), cf = cuffD(y1, 10, 2.8, 2.2);
      const body = bodyD({ hem: 262, e: 2.4, hemE: 2.6, neckY: 166, neckW: 7.6, se: 2.2, curve: 1.2 });
      const L = flowSkirt({ top: 256, hem: 334, dip: 1.4, xw: torsoL(257) - 2.4, flare: 14, bulge: 1, n: 8, amp: 2, seed: 221, curve: 3, fw: 2 });
      const xh = L.xh, R = frillTier(328, 350, xh + 1, xh - 8, 13, 222, F.fill, F, { amp: 2.6 });
      const collar = spline([[140, 153.4, 'c'], [150, 155.4], [160, 153.4, 'c'], [162.4, 162.4], [157, 170, 'c'], [150, 166], [143, 170, 'c'], [137.6, 162.4]]);
      const ac = F.alt === F.fill ? '#FFFFFF' : F.alt, bc = F.rib || '#3E9A5A';
      return R.svg + piece(L.d, F.fill, { autoFolds: false, over: drapeSVG(L.folds, { op: .5, lo: .38 }) }) +
        piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[128, 214, 126, 256, 1, 2.6, .3]]), { op: .45, lo: .35 }), lines: [{ d: 'M 136 176 Q 134 220 136 258', o: .35 }, { d: mir('M 136 176 Q 134 220 136 258'), o: .35 }] }) +
        [186, 204, 222, 240].flatMap(y => [btn(142, y, mix(F.base, '#2A2528', .45), 1.5), btn(158, y, mix(F.base, '#2A2528', .45), 1.5)]).join('') +
        sleevePair(F, F.fill, sl, longFolds) + piece(cf, F.fill, { deep: [cf] }) + piece(mir(cf), F.fill, { deep: [mir(cf)] }) +
        piece(collar, ac, {}) + ribbonBow(150, 167, .62, bc, 1);
    }
  },
  sweaterDress: {
    cat: 'dress', name: '麻花高领毛衣裙', thumb: '60 140 180 210',
    render(F) {
      const y1 = 318, sl = sleeveD({ y1, puff: 5, eo: 3.8, ei: 3.4, se: 3.8, inPuff: .5 }), cf = cuffD(y1, 11, 4, 3.4);
      const body = bodyD({ hem: 334, e: 4.6, hemE: 7.4, neckY: 170, neckW: 8, se: 3.4, curve: 2.4, flare: 2 });
      const neck = spline([[132.6, 150, 'c'], [150, 152.4], [167.4, 150, 'c'], [171, 170.4, 'c'], [150, 175.4], [129, 170.4, 'c']]);
      const hem = hemBandD(334, 10, 7.4, 2.4, 2);
      const b1 = spline([[sideX(262) - 5.4, 256, 'c'], [150, 266], [300 - sideX(262) + 5.4, 276, 'c'], [300 - sideX(270) + 5.6, 283, 'c'], [150, 273.4], [sideX(270) - 5.6, 263, 'c']]);
      const b2 = spline([[sideX(292) - 6, 294, 'c'], [150, 286.6], [300 - sideX(292) + 6, 280, 'c'], [300 - sideX(300) + 6.2, 287.6, 'c'], [150, 294.6], [sideX(300) - 6.2, 301.4, 'c']]);
      const rc = F.rib || F.fill, bc = F.alt === F.fill ? '#FFFFFF' : F.alt;
      return piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[124, 222, 116, 326, 2, 3.6, .3], [138, 236, 136, 330, -1, 2.8, .35]]), { op: .5, lo: .38 }) }) +
        piece(hem, rc, { lines: [{ d: ribLines(98, 202, 324, 336.6, 2.6), o: .35, w: .55 }] }) + sleevePair(F, F.fill, sl, longFolds) +
        piece(cf, rc, { lines: [{ d: ribLines(armO(307) - 4, armI(307) + 3.4, 306, 318.6, 2.4, -.5), o: .35, w: .55 }] }) + piece(mir(cf), rc, {}) +
        piece(b1, bc, { rim: false }) + piece(b2, bc, { rim: false }) + `<rect x="160" y="269.4" width="8" height="8" rx="1.2" fill="none" stroke="#C9CDD6" stroke-width="1.5"/><rect x="128" y="286" width="8" height="8" rx="1.2" fill="none" stroke="#C9CDD6" stroke-width="1.5"/>` +
        piece(neck, rc, { lines: [{ d: ribLines(130, 170, 152, 174, 2.6), o: .35, w: .55 }], folds: ['M 134 164 Q 150 170 166 164'] });
    }
  }
});
