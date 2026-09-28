/* =====================================================================
   新版型 · 美式松弛（阿普瑞风）/ 复古森系 / 90s 古着辣妹
   ===================================================================== */
const TIER = (y0, y1, x0, x1, n) => {
  const pts = [[150, y0 + 2.2], [x0, y0, 'c']];
  pts.push([x1, y1, 'c']);
  for (let i = 1; i < n; i++) { const x = x1 + (150 - x1) * i / n; pts.push([x - (150 - x1) / n / 2, y1 + 2.2 * (1 - Math.pow((x - 150) / (150 - x1), 2)) + 1.8]); pts.push([x, y1 + 2.2 * (1 - Math.pow((x - 150) / (150 - x1), 2)), 'c']); }
  pts.push([150 - (150 - x1) / n / 2, y1 + 4]);
  return symS(pts.concat([[150, y1 + 2.2]]));
};
const TIER_G = (y0, y1, x0, x1, k = 6) => Array.from({ length: k }, (_, i) => { const t = (i + .5) / k; const xa = x0 + (150 - x0) * t, xb = x1 + (150 - x1) * t; return `M ${f1(xa)} ${f1(y0 + 2)} Q ${f1((xa + xb) / 2 - .6)} ${f1((y0 + y1) / 2)} ${f1(xb)} ${f1(y1)}`; }).flatMap(d => [d, mir(d)]);
const SHIRT_COLLAR = spline([[140.2, 163.2], [146, 167], [149.4, 175, 'c'], [143.2, 178.6, 'c'], [138.6, 170]]);
const riblineH = (x0, x1, y0, y1) => ribLines(x0, x1, y0, y1, 2.8);
const bow = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M 0 0 C -6 -6 -12 -4 -11 1 C -10 5 -4 4 0 1 C 4 4 10 5 11 1 C 12 -4 6 -6 0 0 Z" fill="${c}" stroke="${INK}" stroke-width="1"/><ellipse cx="0" cy=".6" rx="2.2" ry="2.6" fill="${c}" stroke="${INK}" stroke-width=".9"/></g>`;

Object.assign(TPL, {
  /* ---------------- 上衣 ---------------- */
  lapelShirt: {
    cat: 'top', name: '大翻领V领衬衫', thumb: '72 146 156 180',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, eo: 2.2, ei: 1.9, se: 2 }), cf = cuffD(y1, 38, 2.2, 1.9);
      const body = bodyD({ hem: 290, e: 2.6, hemE: 3, neckY: 224, neckW: .8, neckX: 139.4, se: 2 });
      const hem = hemBandD(290, 26, 3, 1.6);
      const bra = symS([[150, 212], [144, 204], [139.4, 199], [136.8, 199.4], [138.4, 208], [150, 216]]);
      const lapel = spline([[141.8, 162.6], [134, 165.4], [125.6, 168.8], [119.6, 175.4], [121.6, 184], [129, 196], [139, 212], [148.6, 224, 'c'], [146.6, 210], [143.2, 190], [141, 172]]);
      const sO = { folds: ['M 94 256 Q 98 262 97 270'] };
      return piece(bra, '#2A2628', { rim: false }) +
        piece(body, F.fill, { folds: fm('M 126 236 Q 129 248 127 260') }) + piece(hem, F.alt, { folds: fm('M 124 270 Q 126 280 125 288') }) +
        piece(sl, F.fill, sO) + piece(mir(sl), F.fill, { folds: sO.folds.map(mir) }) + piece(cf, F.alt, {}) + piece(mir(cf), F.alt, {}) +
        piece(lapel, F.fill, { lit: [1.2, 1.2], litOp: .5 }) + piece(mir(lapel), F.fill, { lit: [1.2, 1.2], litOp: .5 }) + btn(149.6, 240, '#FBF3EE', 1.4) + btn(149.6, 258, '#FBF3EE', 1.4);
    }
  },
  cutoutTie: {
    cat: 'top', name: '镂空系带修身上衣', thumb: '72 146 156 170',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, eo: 1.8, ei: 1.6, se: 1.8 }), cf = cuffD(y1, 5, 1.8, 1.6);
      const body = bodyD({ hem: 258, e: 2, hemE: 2.4, neckY: 165.6, neckW: 8.4, se: 1.8, curve: 1 });
      const hole = spline([[150, 178], [158, 184], [159.4, 194], [150, 210, 'c'], [140.6, 194], [142, 184]]);
      const collar = spline([[141.4, 157.4, 'c'], [150, 160], [158.6, 157.4, 'c'], [159.4, 166.4, 'c'], [150, 169.4], [140.6, 166.4, 'c']]);
      const tie = 'M 146 170 C 143 188 139 212 136 240', tie2 = 'M 148 171 C 148 190 147 212 146 234';
      return piece(body + ' ' + hole, F.fill, { evenodd: true, folds: fm('M 126 222 Q 129 236 127 250') }) +
        piece(sl, F.fill, { folds: ['M 94 262 Q 98 268 97 276'] }) + piece(mir(sl), F.fill, { folds: [mir('M 94 262 Q 98 268 97 276')] }) + piece(cf, F.fill, { deep: [cf] }) + piece(mir(cf), F.fill, { deep: [mir(cf)] }) +
        piece(collar, F.fill, {}) + strap(tie, F.fill, 1.8) + strap(tie2, F.fill, 1.8) + bow(147, 168.6, .7, F.fill);
    }
  },
  henleyLayer: {
    cat: 'top', name: '亨利领叠穿长袖', thumb: '72 146 156 178',
    render(F) {
      const y1 = 314, slU = sleeveD({ y1, eo: 1.8, ei: 1.6, se: 1.8 }), cfU = cuffD(y1, 5, 1.8, 1.6);
      const under = bodyD({ hem: 302, e: 2.4, hemE: 3, neckY: 169, neckW: 7.6, se: 1.8 });
      const y2 = 286, sl = sleeveD({ y1: y2, eo: 3.2, ei: 2.8, se: 3 }), cf = cuffD(y2, 7, 3.2, 2.8);
      const body = bodyD({ hem: 290, e: 3.6, hemE: 4.2, neckY: 176, neckW: 8, se: 2.8 });
      const hem = hemBandD(290, 7, 4.2, 1.6);
      const neck = spline([[137.4, 164.4, 'c'], [150, 172.4], [162.6, 164.4, 'c'], [163.4, 168, 'c'], [150, 177], [136.6, 168, 'c']]);
      const placket = 'M 146.4 176 L 146.4 208 L 153.6 208 L 153.6 176';
      return piece(slU, F.alt, {}) + piece(mir(slU), F.alt, {}) + piece(cfU, F.rib, {}) + piece(mir(cfU), F.rib, {}) + piece(under, F.rib, {}) +
        piece(body, F.fill, { folds: fm('M 125 232 Q 128 246 126 262', 'M 124 270 Q 127 280 126 288'), lines: [{ d: placket, o: .7 }] }) +
        piece(hem, F.fill, { deep: [hem] }) + [183, 193, 203].map(y => btn(150, y, '#FBF3DE', 1.3)).join('') +
        piece(sl, F.fill, { folds: ['M 96 258 Q 100 264 99 272'] }) + piece(mir(sl), F.fill, { folds: [mir('M 96 258 Q 100 264 99 272')] }) + piece(cf, F.fill, { deep: [cf] }) + piece(mir(cf), F.fill, { deep: [mir(cf)] }) +
        piece(neck, F.fill, { deep: [neck] });
    }
  },
  buttonShirt: {
    cat: 'top', name: '宽松长袖衬衫', thumb: '72 146 156 184',
    render(F) {
      const y1 = 316, puff = 2.6, sl = sleeveD({ y1, puff, eo: 3.4, ei: 3, se: 3.2 }), cf = cuffD(y1, 9, 3.4, 3);
      const body = bodyD({ hem: 306, e: 4.2, hemE: 5, neckY: 172, neckW: 6, se: 3, curve: 5 });
      const pocket = spline([[124.6, 196, 'c'], [138.4, 196.4, 'c'], [138.2, 210], [131.4, 213.4, 'c'], [124.6, 210]]);
      const sO = { folds: ['M 98 262 Q 102 270 100 280', 'M 93 292 Q 96 298 95 306'] };
      return piece(body, F.fill, { folds: fm('M 126 238 Q 129 254 127 270', 'M 124 284 Q 127 294 126 302'), lines: [{ d: 'M 150 176 L 150 308', o: .55 }, { d: 'M 153.4 178 L 153.4 306', o: .3, w: .7 }] }) +
        [188, 206, 224, 242, 260, 278, 296].map(y => btn(151.6, y, '#FFFDF8', 1.25)).join('') + piece(pocket, F.fill, { lines: [{ d: 'M 125 199.6 L 138.2 200', o: .45 }] }) +
        piece(sl, F.fill, sO) + piece(mir(sl), F.fill, { folds: sO.folds.map(mir) }) + piece(cf, F.fill, { deep: [cf] }) + piece(mir(cf), F.fill, { deep: [mir(cf)] }) +
        btn(armI(311) - 2.6, 311.4, '#FFFDF8', 1) + btn(300 - armI(311) + 2.6, 311.4, '#FFFDF8', 1) +
        piece(SHIRT_COLLAR, F.fill, { lit: [1, 1], litOp: .5 }) + piece(mir(SHIRT_COLLAR), F.fill, { lit: [1, 1], litOp: .5 });
    }
  },
  heartKnit: {
    cat: 'top', name: '爱心镂空短款针织衫', thumb: '72 146 156 170',
    render(F) {
      const y1 = 316, puff = 3, sl = sleeveD({ y1, puff, eo: 3, ei: 2.6, se: 3 }), cf = cuffD(y1, 8, 3, 2.6);
      const body = bodyD({ hem: 262, e: 3.4, hemE: 4, neckY: 170, neckW: 7, se: 2.8, curve: 1.2 });
      const hem = hemBandD(262, 8, 4, 1.2);
      const neck = spline([[137.4, 163.2, 'c'], [150, 169.4], [162.6, 163.2, 'c'], [163.4, 166.8, 'c'], [150, 174], [136.6, 166.8, 'c']]);
      const tie = 'M 150 209 C 147 216 144 224 142 234', tie2 = 'M 150 209 C 153 216 157 222 160 230';
      return piece(body + ' ' + heartD(150, 194, 9), F.fill, { evenodd: true, folds: fm('M 126 226 Q 129 240 127 252') }) +
        piece(hem, F.rib || F.fill, { lines: [{ d: riblineH(106, 194, 254, 263), o: .4, w: .7 }] }) +
        strap(tie, F.fill, 1.6) + strap(tie2, F.fill, 1.6) + bow(150, 208, .6, F.fill) +
        piece(sl, F.fill, { folds: ['M 98 264 Q 102 272 100 282'] }) + piece(mir(sl), F.fill, { folds: [mir('M 98 264 Q 102 272 100 282')] }) +
        piece(cf, F.rib || F.fill, {}) + piece(mir(cf), F.rib || F.fill, {}) + piece(neck, F.rib || F.fill, { rim: false });
    }
  },
  poloSweat: {
    cat: 'top', name: '叠领宽松卫衣', thumb: '72 146 156 184',
    render(F) {
      const shirt = bodyD({ hem: 304, e: 3.4, hemE: 4.2, neckY: 172, neckW: 6, se: 2.6, curve: 3 });
      const y1 = 316, sl = sleeveD({ y1, puff: 3.4, eo: 3.6, ei: 3.2, se: 3.6 }), cf = cuffD(y1, 9, 3.8, 3.2);
      const shirtCuff = cuffD(y1 + 5, 7, 3, 2.6);
      const body = bodyD({ hem: 290, e: 4.6, hemE: 5.2, neckY: 170, neckW: 7.6, se: 3.4 });
      const hem = hemBandD(290, 9, 5.2, 1.6);
      const neck = spline([[137.2, 162.6, 'c'], [150, 168.4], [162.8, 162.6, 'c'], [163.8, 167, 'c'], [150, 174], [136.2, 167, 'c']]);
      return piece(shirt, F.alt, {}) + piece(shirtCuff, F.alt, {}) + piece(mir(shirtCuff), F.alt, {}) +
        piece(body, F.fill, { folds: fm('M 125 234 Q 128 248 126 264', 'M 121 272 Q 124 280 123 286') }) +
        piece(hem, F.rib || F.fill, { lines: [{ d: riblineH(104, 196, 282, 291), o: .35, w: .7 }] }) +
        piece(sl, F.fill, { folds: ['M 98 264 Q 102 272 100 282', 'M 94 292 Q 97 298 96 306'] }) + piece(mir(sl), F.fill, { folds: [mir('M 98 264 Q 102 272 100 282'), mir('M 94 292 Q 97 298 96 306')] }) +
        piece(cf, F.rib || F.fill, { lines: [{ d: ribLines(armO(307) - 3.8, armI(307) + 3.2, 307, 316.5, 2.6, -.6), o: .35, w: .7 }] }) + piece(mir(cf), F.rib || F.fill, {}) +
        piece(neck, F.rib || F.fill, { rim: false }) +
        piece(SHIRT_COLLAR, F.alt, { lit: [1, 1], litOp: .5 }) + piece(mir(SHIRT_COLLAR), F.alt, { lit: [1, 1], litOp: .5 }) +
        `<rect x="163" y="200" width="12" height="3.4" rx="1" fill="none" stroke="${F.alt}" stroke-width=".9" opacity=".8"/>`;
    }
  },
  poloLong: {
    cat: 'top', name: 'Polo领修身长袖', thumb: '72 146 156 176',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, eo: 2.2, ei: 2, se: 2 }), cf = cuffD(y1, 6, 2.2, 2);
      const body = bodyD({ hem: 292, e: 2.6, hemE: 3, neckY: 171, neckW: 6.6, se: 2 });
      const collar = spline([[141, 162.4], [134, 166.6], [128, 174], [131, 178.6], [140, 180.6], [149, 177, 'c'], [146, 170], [143, 165]]);
      return piece(body, F.fill, { folds: fm('M 126 232 Q 129 246 127 262'), lines: [{ d: 'M 146.6 176 L 146.6 204 L 153.4 204 L 153.4 176', o: .7 }] }) +
        [184, 195].map(y => btn(150, y, '#FBF3EE', 1.3)).join('') +
        piece(sl, F.fill, { folds: ['M 94 262 Q 98 268 97 276'] }) + piece(mir(sl), F.fill, { folds: [mir('M 94 262 Q 98 268 97 276')] }) + piece(cf, F.fill, { deep: [cf] }) + piece(mir(cf), F.fill, { deep: [mir(cf)] }) +
        piece(collar, F.fill, { lit: [1, 1], litOp: .5 }) + piece(mir(collar), F.fill, { lit: [1, 1], litOp: .5 });
    }
  },
  argyleCardi: {
    cat: 'top', name: '菱格纹针织开衫', thumb: '72 146 156 180',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, eo: 2.8, ei: 2.4, se: 2.6 }), cf = cuffD(y1, 8, 2.8, 2.4);
      const body = bodyD({ hem: 290, e: 3.2, hemE: 3.6, neckY: 186, neckW: 3, se: 2.4 });
      const hem = hemBandD(290, 9, 3.6, 1.6);
      const dia = (x, y, c) => `<path d="M ${x} ${y - 9} L ${x + 6.4} ${y} L ${x} ${y + 9} L ${x - 6.4} ${y} Z" fill="${c}"/><path d="M ${x - 6.4} ${y - 9} L ${x + 6.4} ${y + 9} M ${x + 6.4} ${y - 9} L ${x - 6.4} ${y + 9}" stroke="${F.alt}" stroke-width=".6" stroke-dasharray="1.2 1" opacity=".8"/>`;
      const dias = [196, 214, 232, 250, 268].map((y, i) => dia(134, y, i % 2 ? mix(F.base, INK, .25) : F.alt) + dia(166, y, i % 2 ? F.alt : mix(F.base, INK, .25))).join('');
      const vband = symS([[150, 184], [146, 176], [141.4, 166.6], [139.4, 165.4, 'c'], [139.6, 166, 'c'], [144.4, 180], [150, 190]]);
      return piece(body, F.fill, { under: dias, folds: fm('M 124 236 Q 127 250 125 264'), lines: [{ d: 'M 150 188 L 150 290', o: .55 }] }) +
        piece(hem, F.rib || F.fill, { lines: [{ d: riblineH(106, 194, 282, 291), o: .35, w: .7 }] }) +
        [198, 214, 230, 246, 262, 278].map(y => btn(150, y, '#E9D8B8', 1.4)).join('') +
        piece(sl, F.fill, { folds: ['M 94 262 Q 98 268 97 276'] }) + piece(mir(sl), F.fill, { folds: [mir('M 94 262 Q 98 268 97 276')] }) +
        piece(cf, F.rib || F.fill, {}) + piece(mir(cf), F.rib || F.fill, {}) + piece(vband, F.rib || F.fill, { rim: false });
    }
  },
  frillSleeveTee: {
    cat: 'top', name: '荷叶袖口小高领毛衣', thumb: '72 146 156 178',
    render(F) {
      const fr = wristFrill(315, 1.8, 1.6, 8, 5), lace = laceRow([[armO(322) - 3.4, 321.4], [armI(322) + 3.6, 322.6]], 1.2, F.alt, true);
      return TPL.mockTee.render(F) + piece(fr, F.alt, { rim: false, over: '' }) + lace + piece(mir(fr), F.alt, { rim: false }) + `<g transform="translate(300 0) scale(-1 1)">${lace}</g>`;
    }
  },
  laceScoop: {
    cat: 'top', name: '蕾丝大圆领长袖', thumb: '72 146 156 176',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, eo: 1.8, ei: 1.6, se: 1.8 });
      const bell = spline([[armO(y1 - 10) - 1.8, y1 - 10, 'c'], [armI(y1 - 10) + 1.6, y1 - 9, 'c'], [armI(y1) + 6, y1 + 8, 'c'], [armO(y1) - 7, y1 + 6, 'c']]);
      const body = bodyD({ hem: 288, e: 2, hemE: 2.6, neckY: 200, neckW: 12, neckX: 131.6, se: 1.8, curve: 1 });
      const trimL = [[131.6, 166], [134, 184], [140, 196], [150, 200.4]], trim = laceRow(trimL.concat(trimL.slice(0, -1).reverse().map(mx)), 1.3, F.alt, true);
      return trim + piece(body, F.fill, { folds: fm('M 126 232 Q 129 246 127 262', 'M 124 270 Q 127 280 126 286') }) +
        piece(sl, F.fill, { folds: ['M 94 262 Q 98 268 97 276'] }) + piece(mir(sl), F.fill, { folds: [mir('M 94 262 Q 98 268 97 276')] }) +
        piece(bell, F.fill, { folds: [`M ${f1(armO(y1) - 3)} ${y1 - 6} L ${f1(armO(y1) - 5)} ${y1 + 5}`] }) + piece(mir(bell), F.fill, {});
    }
  },
  velvetCrop: {
    cat: 'top', name: '丝绒短款吊带', thumb: '96 168 108 90',
    render(F) {
      const d = tankD({ top: 200, strapX: 129, e: 1.8, hem: 238, hemE: 2, dip: 2.4, curve: 1 });
      const st = 'M 129.2 200.4 L 129.6 170.6';
      return strap(st, F.fill, 1.4) + strap(mir(st), F.fill, 1.4) + piece(d, F.fill, { sheen: ['M 130 212 Q 136 220 134 232', mir('M 130 212 Q 136 220 134 232')], sheenOp: .55, sheenW: 5, folds: fm('M 140 206 Q 142 216 141 230') }) +
        laceRow([[123, 203.6], [136, 202], [150, 203.2], [164, 202], [177, 203.6]], 1.2, mix(F.base, '#FFFFFF', .3), false);
    }
  },
  embroCardi: {
    cat: 'top', name: '刺绣花边短开衫', thumb: '72 146 156 170',
    render(F) {
      const inner = tankD({ top: 198, strapX: 129, e: 1.8, hem: 256, hemE: 2.2, dip: 4 });
      const y1 = 314, sl = sleeveD({ y1, eo: 2.4, ei: 2, se: 2.4 }), cf = cuffD(y1, 7, 2.4, 2);
      const panel = openPanel(262, 5, 3.2);
      const edge = 'M 140.8 170 L 148 210 L 146 232 L 145 262';
      const flw = (x, y, s) => flower(x, y, s, F.rib) + `<path d="M ${x + s * 1.6} ${y + s * .8} q ${s * 2} ${s * .2} ${s * 3} ${s * 1.8}" fill="none" stroke="#6E9A4E" stroke-width="1" stroke-linecap="round"/>`;
      const pO = { folds: ['M 122 222 Q 125 236 123 250'], lines: [{ d: edge, c: INK, w: 4.6, o: .9 }, { d: edge, c: F.rib, w: 3.2, o: 1 }, { d: edge, c: '#fff', w: .6, dash: '1 1.4', o: .8 }] };
      return piece(inner, F.alt, { folds: fm('M 132 214 Q 136 230 134 246') }) +
        piece(panel, F.fill, { ...pO, over: flw(125, 184, 2.4) + flw(132, 236, 2) }) + piece(mir(panel), F.fill, { ...pO, folds: pO.folds.map(mir), lines: pO.lines.map(l => ({ ...l, d: mir(l.d) })), over: flw(175, 184, 2.4) + flw(168, 236, 2) }) +
        [222, 240, 256].map(y => btn(146.4, y, F.rib, 1.5)).join('') +
        piece(sl, F.fill, { folds: ['M 94 262 Q 98 268 97 276'] }) + piece(mir(sl), F.fill, { folds: [mir('M 94 262 Q 98 268 97 276')] }) +
        piece(cf, F.rib, {}) + piece(mir(cf), F.rib, {});
    }
  },
  tieCrop: {
    cat: 'top', name: '系带喇叭袖短开衫', thumb: '72 146 156 176',
    render(F) {
      const y1 = 298, sl = sleeveD({ y1, eo: 2, ei: 1.8, se: 2 });
      const bell = spline([[armO(y1) - 2, y1, 'c'], [armI(y1) + 1.8, y1 + 1, 'c'], [armI(y1) + 7.6, 320, 'c'], [armI(y1) + 1, 324], [armO(y1) - 4, 322.6], [armO(y1) - 9.6, 318, 'c']]);
      const body = symS([[150, 238], [145, 220], [141.6, 196], [139.8, 166, 'c'], ...offsetPts(SHOULDER.slice(1), 2).map(p => [p[0], p[1]]), [112, 212], [sideX(226) - 2.2, 226], [sideX(242) - 2.4, 242, 'c'], [138, 246], [150, 242]]);
      const tails = spline([[147, 243], [141, 252], [137.6, 264, 'c'], [142, 262], [146, 254], [150, 246], [153.4, 256], [158, 266, 'c'], [161.4, 262], [156.6, 250], [153, 243]]);
      return piece(body, F.fill, { folds: fm('M 128 212 Q 131 224 129 236'), lines: [{ d: 'M 150 238 L 139.8 166', o: 0 }] }) + piece(tails, F.fill, {}) + `<ellipse cx="150" cy="243" rx="4" ry="3.4" fill="${F.fill}" stroke="${INK}" stroke-width="1"/>` +
        piece(sl, F.fill, { folds: ['M 94 256 Q 98 262 97 270'] }) + piece(mir(sl), F.fill, { folds: [mir('M 94 256 Q 98 262 97 270')] }) +
        piece(bell, F.fill, { folds: [`M ${f1(armO(y1) - 1)} ${y1 + 4} L ${f1(armO(y1) - 5)} 318`, `M ${f1(armI(y1) + 2)} ${y1 + 4} L ${f1(armI(y1) + 4.6)} 318`] }) + piece(mir(bell), F.fill, { folds: [mir(`M ${f1(armO(y1) - 1)} ${y1 + 4} L ${f1(armO(y1) - 5)} 318`)] });
    }
  },

  /* ---------------- 外套 ---------------- */
  knitVest: {
    cat: 'outer', name: 'V领针织马甲', thumb: '84 146 132 150',
    render(F) {
      const vest = symS([[150, 226], [145.4, 206], [140.8, 184], [138.6, 166, 'c'], [131, 168.4], [124.6, 170.6], [120.6, 181], [121.6, 202], [sideX(224) - 5.6, 224], [sideX(254) - 6.2, 254], [sideX(282) - 6.6, 282, 'c'], [150, 285.6]]);
      const vRib = symS([[150, 220], [146.4, 204], [142, 184], [140.4, 166.6, 'c'], [138.6, 166, 'c'], [140.8, 184], [145.4, 206], [150, 226]]);
      const hemR = symS([[150, 277.8], [sideX(276) - 6.6, 275.6, 'c'], [sideX(283) - 6.7, 283, 'c'], [150, 286.6]]);
      const arm = 'M 124.6 170.6 C 120.6 181 121.6 202 ' + f1(sideX(224) - 5.6) + ' 224';
      return piece(vest, F.fill, { folds: fm('M 131 236 Q 134 250 132 266'), lines: [{ d: 'M 150 226 L 150 285', o: .5 }, { d: arm, c: F.rib, w: 3.2, o: .85 }, { d: mir(arm), c: F.rib, w: 3.2, o: .85 }] }) +
        piece(vRib, F.rib, { rim: false }) + piece(hemR, F.rib, { rim: false, lines: [{ d: ribLines(108, 192, 276, 286, 2.8), o: .4, w: .6 }] }) +
        [234, 250, 266].map(y => btn(150, y, '#E6C88A', 1.7)).join('');
    }
  },
  corsetVest: {
    cat: 'outer', name: '束身背心马甲', thumb: '96 160 108 130',
    render(F) {
      const d = symS([[150, 204], [143.4, 197], [135, 195.4], [128, 198], [124.4, 204, 'c'], [sideX(222) - 3.4, 222], [sideX(240) - 3.8, 240], [sideX(262) - 4.4, 262, 'c'], [136, 270], [150, 280]]);
      const st = 'M 129.4 197.6 L 130 170.8';
      return strap(st, F.fill, 2.6) + strap(mir(st), F.fill, 2.6) + piece(d, F.fill, {
        lines: [{ d: 'M 136.4 198 Q 132 232 136 268', o: .6 }, { d: mir('M 136.4 198 Q 132 232 136 268'), o: .6 }, { d: 'M 150 206 L 150 278', o: .6 }], sheen: ['M 130 214 Q 128 236 131 254'], sheenOp: .35
      }) + [214, 228, 242, 256].map(y => btn(150, y, '#C9A06A', 1.4)).join('');
    }
  },
  shoulderWrap: {
    cat: 'outer', name: '针织披肩', thumb: '72 146 156 150',
    render(F) {
      const w = spline([[142, 161.4], [133, 164], [123, 167.6], [113, 171.6], [106, 180], [102, 196], [100.6, 216], [102.4, 236], [108, 252], [118, 262], [128, 266, 'c'], [131, 250], [133, 228], [136, 204], [140, 184], [144, 170]]);
      const fr = (x0, y0, x1, y1) => { let d = ''; for (let i = 0; i <= 8; i++) { const t = i / 8, x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; d += `M ${f1(x)} ${f1(y)} l ${f1(-.6 + t)} 6 `; } return d; };
      const fringe = fr(108, 252, 128, 266);
      return piece(w, F.fill, { folds: ['M 112 186 Q 110 206 112 226', 'M 122 196 Q 122 220 124 246', 'M 132 184 Q 128 200 128 216'], lines: [{ d: 'M 144 170 C 140 184 136 204 133 228 C 131 250 128 266 128 266', c: F.rib, w: 2.6, o: .7 }] }) +
        `<path d="${fringe}" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><path d="${fringe}" stroke="${F.base}" stroke-width="1" stroke-linecap="round"/>` +
        piece(mir(w), F.fill, { folds: [mir('M 112 186 Q 110 206 112 226'), mir('M 122 196 Q 122 220 124 246')], lines: [{ d: mir('M 144 170 C 140 184 136 204 133 228 C 131 250 128 266 128 266'), c: F.rib, w: 2.6, o: .7 }] }) +
        `<path d="${mir(fringe)}" stroke="${INK}" stroke-width="2" stroke-linecap="round"/><path d="${mir(fringe)}" stroke="${F.base}" stroke-width="1" stroke-linecap="round"/>`;
    }
  },

  /* ---------------- 下装 ---------------- */
  wideFlare: {
    cat: 'bottom', name: '高腰阔腿喇叭牛仔裤', thumb: '72 268 156 318',
    render(F) {
      const ease = y => 2.6 + Math.max(0, y - 380) * .02 + Math.pow(Math.max(0, y - 420) / 160, 1.5) * 18;
      const inE = y => 2 + Math.pow(Math.max(0, y - 420) / 160, 1.5) * 12;
      const d = pantsD({ top: 276, hem: 580, ease, inE });
      const wb = bandD(276, 7, 4, 2.6, 2.7);
      const pk = spline([[112.6, 298, 'c'], [133.4, 299, 'c'], [132.6, 320], [123, 327, 'c'], [113.6, 320]]);
      const X = 'M 116.6 303 L 129.6 318 M 129.6 303 L 116.6 318';
      return piece(d, F.fill, { folds: fm('M 121 346 Q 126 356 124 368', 'M 112 500 Q 118 530 112 566', 'M 138 480 Q 141 520 139 566'), lines: [{ d: 'M 150 284 L 150 318', c: F.stitch, dash: '2 1.6', o: .9 }] }) +
        piece(pk, F.fill, { lines: [{ d: X, c: F.stitch, w: 1, o: .95 }, { d: 'M 113.4 301 L 133.2 302', c: F.stitch, dash: '1.6 1.2', o: .9 }] }) + piece(mir(pk), F.fill, { lines: [{ d: mir(X), c: F.stitch, w: 1, o: .95 }, { d: mir('M 113.4 301 L 133.2 302'), c: F.stitch, dash: '1.6 1.2', o: .9 }] }) +
        piece(wb, F.fill, { lines: [{ d: 'M 112 279.6 Q 150 285.6 188 279.6', c: F.stitch, dash: '2 1.6', o: .9 }] }) + [281, 292, 302, 312].map(y => `<circle cx="150" cy="${y}" r="1.7" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".7"/>`).join('');
    }
  },
  asymPlaid: {
    cat: 'bottom', name: '不规则格纹蕾丝长裙', thumb: '72 270 156 210',
    render(F) {
      const xl = outerX(300);
      const low = spline([[xl - 7, 350], [xl - 12, 386], [xl - 15, 418, 'c'], [150, 442], [300 - xl + 18, 470, 'c'], [300 - xl + 12, 400], [300 - xl + 7, 350]]);
      const frill = TIER(347, 359, xl - 7.6, xl - 9.6, 16);
      const up = skirtD({ top: 282, dip: 3.6, e: 2.6, hem: 350, flare: 6, hipY: 300, curve: 3 });
      const wb = bandD(282, 6.6, 3.6, 2.6, 2.8);
      return piece(low, F.fill, { folds: ['M 118 372 Q 114 396 110 414', 'M 140 380 Q 140 410 138 440', 'M 172 380 Q 178 420 182 460', 'M 158 380 Q 160 420 160 456'] }) +
        piece(frill, 'url(#pat-blacklace)', { rim: false, folds: TIER_G(347, 358, xl - 7.6, xl - 9.6, 9), foldOp: .5 }) +
        piece(up, F.fill, { folds: fm('M 126 300 Q 124 322 121 344') }) + piece(wb, F.fill, { deep: [wb] });
    }
  },
  bermuda: {
    cat: 'bottom', name: '及膝百慕大短裤', thumb: '84 272 132 160',
    render(F) {
      const ease = y => 3.4 + Math.max(0, y - 300) * .085, inE = y => 2.6 + Math.max(0, y - 330) * .055;
      const d = pantsD({ top: 282, hem: 424, ease, inE });
      const wb = bandD(282, 7, 4, 3.4, 3.5);
      const crease = `M 126 300 L 124 424`;
      return piece(d, F.fill, { folds: fm('M 118 330 Q 122 344 120 358', 'M 140 332 Q 144 340 146 352', 'M 112 404 Q 118 408 128 406'), lines: [{ d: crease, o: .4 }, { d: mir(crease), o: .4 }, { d: FLY, o: .6 }, { d: POCKET, o: .7 }, { d: mir(POCKET), o: .7 }, { d: `M ${f1(outerX(414) - ease(414))} 414 Q 126 418 ${f1(Math.min(149, legI(414) + inE(414)))} 414.6`, o: .5 }] }) +
        piece(wb, F.fill, { lines: [{ d: 'M 131.5 284.4 L 131.5 291.2 M 168.5 284.4 L 168.5 291.2 M 116 283.6 L 116 290.4 M 184 283.6 L 184 290.4', o: .6 }] });
    }
  },
  wrapCargo: {
    cat: 'bottom', name: '裹裙叠穿工装裤', thumb: '72 270 156 318',
    render(F) {
      const ease = y => 5 + Math.max(0, y - 300) * .03, inE = y => 3.4 + Math.max(0, y - 340) * .02;
      const pants = pantsD({ top: 284, hem: 578, ease, inE });
      const pk = spline([[legO(420) - 8.4, 418, 'c'], [legO(420) + 9, 417, 'c'], [legO(452) + 9.2, 452, 'c'], [legO(454) - 8, 453.6, 'c']]);
      const flap = spline([[legO(413) - 9, 412, 'c'], [legO(413) + 9.8, 411, 'c'], [legO(421) + 9.8, 421, 'c'], [legO(422) - 8.8, 422.6, 'c']]);
      const sk = skirtD({ top: 282, dip: 3.6, e: 4, hem: 346, flare: 12, hipY: 300, curve: 3.4 });
      const wrap = 'M 176 286 C 172 306 166 330 160 350';
      const tail = spline([[178, 290], [184, 306], [187, 330, 'c'], [182, 328], [179, 312], [176, 296]]);
      return piece(pants, F.alt, { folds: fm('M 116 470 Q 122 476 134 472', 'M 114 540 Q 124 546 138 542', 'M 138 380 Q 141 420 139 460') }) +
        piece(pk, F.alt, {}) + piece(mir(pk), F.alt, {}) + piece(flap, F.alt, { deep: [flap] }) + piece(mir(flap), F.alt, { deep: [mir(flap)] }) +
        piece(sk, F.fill, { folds: fm('M 126 300 Q 123 320 118 342'), lines: [{ d: wrap, o: .8 }, { d: 'M 108 340 Q 150 350 192 340', c: '#F4F8FC', dash: '3 2', o: .7 }] }) +
        piece(tail, F.fill, {}) + `<ellipse cx="177" cy="290" rx="4.4" ry="3.6" fill="${F.fill}" stroke="${INK}" stroke-width="1"/>`;
    }
  },
  slitSkirt: {
    cat: 'bottom', name: '开衩及膝半裙', thumb: '84 272 132 170',
    render(F) {
      const xl = outerX(310) - 2.8 - 1.4, hem = 436;
      const d = spline([[150, 285.6], [outerX(282) - 2.8, 282, 'c'], [outerX(291) - 3.1, 291], [xl, 310], [xl - 4.2, hem, 'c'], [150, hem + 3], [158.6, hem + 2.6, 'c'], [162.4, 398, 'c'], [166.2, hem + 2.2, 'c'], [300 - xl + 4.2, hem, 'c'], [300 - xl, 310], [300 - outerX(291) + 3.1, 291], [300 - outerX(282) + 2.8, 282, 'c']]);
      const wb = bandD(282, 6.4, 3.6, 2.8, 2.9);
      return piece(d, F.fill, { folds: ['M 124 320 Q 121 370 118 428', 'M 140 330 Q 141 380 140 434', 'M 174 330 Q 176 380 178 428'], lines: [{ d: 'M 150 292 L 150 438', o: .35 }] }) + piece(wb, F.fill, { deep: [wb] });
    }
  },
  tierMidi: {
    cat: 'bottom', name: '三层蛋糕长裙', thumb: '72 272 156 210',
    render(F) {
      const t3 = TIER(400, 470, 97, 84, 8), t2 = TIER(338, 404, 104.4, 96, 7), t1 = TIER(287, 342, 109.6, 104, 6);
      const wb = bandD(282, 6.6, 3.6, 2.6, 2.8);
      return piece(t3, F.fill, { folds: TIER_G(400, 468, 97, 84, 7), foldOp: .5 }) + piece(t2, F.fill, { folds: TIER_G(338, 402, 104.4, 96, 6), foldOp: .5 }) +
        piece(t1, F.fill, { folds: TIER_G(287, 340, 109.6, 104, 5), foldOp: .5 }) + piece(wb, F.rib || F.fill, {});
    }
  },
  fullMidi: {
    cat: 'bottom', name: '大摆中长裙', thumb: '60 272 180 190',
    render(F) {
      const hem = 452, flare = 34, e = 3, x0 = outerX(300) - e - flare * .2, xh = outerX(300) - e - flare;
      const d = skirtD({ top: 282, dip: 3.6, e, hem, flare, hipY: 300, curve: 5 });
      const at = y => x0 + (xh - x0) * (y - 300) / (hem - 300);
      const band = symS([[150, hem - 7 + 5 * .9], [at(hem - 7) + .4, hem - 7, 'c'], [xh, hem, 'c'], [150, hem + 5]]);
      const pk = spline([[114, 318, 'c'], [134, 319, 'c'], [134, 346], [124, 352, 'c'], [112, 346]]);
      const g = fm('M 118 296 Q 108 360 92 440', 'M 128 296 Q 124 370 116 446', 'M 138 298 Q 138 372 136 450', 'M 110 294 Q 96 350 76 430');
      return piece(d, F.fill, { folds: g }) + piece(band, F.rib || F.detail, { rim: false }) + piece(pk, F.fill, { lines: [{ d: 'M 114.6 322 L 133.6 322.6', o: .5 }] }) + piece(mir(pk), F.fill, { lines: [{ d: mir('M 114.6 322 L 133.6 322.6'), o: .5 }] }) +
        piece(bandD(282, 7, 3.6, 3, 3.1), F.fill, {});
    }
  },
  culottes: {
    cat: 'bottom', name: '阔腿裙裤', thumb: '66 272 168 206',
    render(F) {
      const ease = y => 3.6 + Math.max(0, y - 300) * .1, inE = y => 2.6 + Math.max(0, y - 330) * .075;
      const d = pantsD({ top: 282, hem: 470, ease, inE });
      const wb = bandD(282, 7, 4, 3.6, 3.7);
      return piece(d, F.fill, { folds: fm('M 118 330 Q 112 390 102 462', 'M 132 336 Q 130 400 126 466', 'M 140 332 Q 144 340 146 352'), lines: [{ d: FLY, o: .5 }, { d: POCKET, o: .6 }, { d: mir(POCKET), o: .6 }] }) + piece(wb, F.fill, { deep: [wb] });
    }
  },
  balloonPants: {
    cat: 'bottom', name: '灯笼阔腿裤', thumb: '66 272 168 300',
    render(F) {
      const s = y => Math.sin(Math.min(1, Math.max(0, (y - 296) / 250)) * Math.PI);
      const ease = y => 4 + s(y) * 17 + Math.max(0, y - 300) * .008, inE = y => 3 + s(y) * 8;
      const hem = 548, d = pantsD({ top: 282, hem, ease, inE });
      const cuff = legCuffD(hem - 2, hem + 12, ease(hem - 2) - 1.4, inE(hem - 2) - 1, ease(hem) - 1.6, inE(hem) - 1.2);
      const wb = bandD(282, 7, 4, 4, 4.1);
      const gat = rng(outerX(hem) - ease(hem), legI(hem) + inE(hem), 5).map(x => `M ${f1(x)} ${hem - 10} Q ${f1(x + 1)} ${hem - 5} ${f1(x)} ${hem - 1}`).join(' ');
      return piece(d, F.fill, { folds: [...fm('M 110 360 Q 100 420 104 500', 'M 128 350 Q 130 420 126 500', 'M 140 332 Q 144 340 146 352'), gat, mir(gat)], lines: [{ d: FLY, o: .5 }] }) +
        piece(cuff, F.fill, { deep: [cuff], lines: [{ d: ribLines(outerX(hem) - 6, legI(hem) + 4, hem, hem + 11, 2.4), o: .35, w: .6 }] }) + piece(mir(cuff), F.fill, { deep: [mir(cuff)] }) + piece(wb, F.fill, { deep: [wb] });
    }
  },
  sarongMaxi: {
    cat: 'bottom', name: '系结纱笼长裙', thumb: '72 280 156 300',
    render(F) {
      const d = skirtD({ top: 292, dip: 3, e: 3.4, hem: 560, flare: 16, hipY: 320, curve: 3 });
      const wrap = 'M 124 296 C 132 360 146 440 158 562';
      const tails = spline([[117, 300], [112, 318], [108, 344, 'c'], [114, 342], [117, 326], [121, 344], [126, 356, 'c'], [127, 336], [121, 302]]);
      return piece(d, F.fill, { folds: ['M 134 340 Q 132 420 128 550', 'M 170 320 Q 176 420 182 556', 'M 116 360 Q 110 440 104 552'], lines: [{ d: wrap, o: .85 }] }) +
        piece(tails, F.fill, {}) + `<ellipse cx="119" cy="300" rx="5" ry="4.2" fill="${F.fill}" stroke="${INK}" stroke-width="1"/>`;
    }
  }
});
