/* =====================================================================
   新版型 · 千禧合租公寓系列（灵感：2009–2011 都市情景喜剧里几位主角的日常穿搭）
   全部沿描摹底模的身体轮廓生成
   ===================================================================== */
/* 后领帽（卫衣 / 外套共用） */
const hoodBack = (c, top = 141) => { const d = symS([[150, top], [138, top + 1.5], [126, top + 6.5], [118.5, top + 15], [115.5, top + 25], [117, top + 35, 'c'], [150, top + 35]]); return piece(d, c, { deep: [symS([[150, top + 5], [134, top + 7], [124, top + 14], [121.5, top + 25], [124, top + 35], [150, top + 35]])], rim: false, lit: false }); };
const hoodRimL = spline([[150, 190], [141.5, 184.5], [131, 178.5], [122.5, 173], [119.8, 167], [125.5, 162.5], [133.5, 160.4], [140.8, 161.4], [142.3, 167.5], [145.4, 176], [150, 182, 'c']]);
const cordD = (x0, x1, c) => strap(`M ${x0} 178 C ${x0 - .6} 188 ${x1 + .4} 196 ${x1} 206`, c, 1.3) + `<rect x="${x1 - 1.6}" y="205" width="3.2" height="5" rx="1.2" fill="#C9CDD6" stroke="${INK}" stroke-width=".8"/>`;
const btn = (x, y, c = '#F4EEE4', r = 1.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${INK}" stroke-width=".75"/><circle cx="${f1(x - r * .3)}" cy="${f1(y - r * .3)}" r="${f1(r * .3)}" fill="#fff" opacity=".8"/>`;
/* 西装 / 风衣的翻领（左片） */
const lapelL = (by = 248, w = 1) => spline([[142.2, 163.6], [136.4, 167.6], [130.8, 177.4], [126.6 - 2 * w, 191.6], [124.8 - 3 * w, 202, 'c'], [130 - 1.4 * w, 203.8, 'c'], [128.6 - 1.4 * w, 209, 'c'], [150.6, by, 'c'], [144.6, 204], [142.6, 178]]);
const collarBackL = spline([[142.2, 163.6], [146, 160.6], [150, 160], [150, 165], [146, 166.4], [143.2, 170]]);

Object.assign(TPL, {
  /* ---------- 天蓝色拉链连帽卫衣 ---------- */
  zipHoodie: {
    cat: 'top', name: '拉链连帽卫衣', thumb: '72 136 156 190',
    back: F => hoodBack(F.alt),
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, puff: 1.6, eo: 3, ei: 2.6, se: 3.4 }), cf = cuffD(y1, 8, 3, 2.6);
      const body = bodyD({ hem: 298, e: 3.6, hemE: 4, neckY: 176, neckW: 6, se: 3 }), hem = hemBandD(298, 8, 4, 1.6);
      const zip = `<path d="M 150 182 L 150 298" stroke="${INK}" stroke-width="1.5"/><path d="M 150 184 L 150 297" stroke="#E9EEF3" stroke-width="1" stroke-dasharray=".8 1"/><rect x="147.6" y="208" width="4.8" height="7.6" rx="1.4" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".8"/><path d="M 150 215.6 L 150 219.4" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/>`;
      const welt = 'M 124 258 L 133.6 282', sO = { folds: ['M 99 262 Q 103 270 101 280', 'M 93 290 Q 97 296 95 304', 'M 106 238 Q 109 244 108 252'] };
      return piece(body, F.fill, { folds: fm('M 128 226 Q 131 240 129 252', 'M 124 284 Q 128 290 127 296'), lines: [{ d: welt, o: .8 }, { d: mir(welt), o: .8 }, { d: 'M 125.6 257.4 L 135 281', c: '#fff', w: .7, o: .5 }], shade: [symS([[150, 176], [142, 180], [133, 184], [150, 196]])] }) +
        piece(hem, F.rib || F.alt, { lines: [{ d: ribLines(105, 195, 290, 299.5, 3.1), o: .4, w: .7 }] }) + zip +
        piece(sl, F.fill, sO) + piece(mir(sl), F.fill, { ...sO, folds: sO.folds.map(mir) }) +
        piece(cf, F.rib || F.alt, { lines: [{ d: ribLines(armO(306) - 3.2, armI(306) + 2.6, 306, 314.5, 2.6, -.6), o: .4, w: .7 }] }) + piece(mir(cf), F.rib || F.alt, {}) +
        piece(hoodRimL, F.alt, { deep: ['M 141 161 L 146 180 L 150 184 L 150 160 Z'] }) + piece(mir(hoodRimL), F.alt, { deep: [mir('M 141 161 L 146 180 L 150 184 L 150 160 Z')] }) +
        cordD(144.2, 143, '#fff') + cordD(155.8, 157, '#fff') + (F.print === 'star' ? star5(132, 216, 4.6, '#fff', .9) : '');
    }
  },
  /* ---------- 泡泡袖蝴蝶结衬衫（带荷叶摆） ---------- */
  puffBlouse: {
    cat: 'top', name: '泡泡袖衬衫', thumb: '84 150 132 150',
    render(F) {
      const body = symS([[150, 192], [140.8, 190.6], [137.4, 188.8, 'c'], [135.6, 171], [129.8, 168.8], [121, 170.6], [114.6, 174], [112, 186], [117, 214], [sideX(230) - 2.2, 230], [sideX(250) - 2.4, 250], [sideX(262) - 2.6, 262, 'c'], [150, 264]]);
      const pep = symS([[150, 260], [sideX(258) - 2.4, 257.6, 'c'], [sideX(270) - 7, 272], [sideX(284) - 12.6, 285, 'c'], [134, 287.4], [126, 285.4], [150, 289]]);
      const puff = spline([[123.4, 170.2], [112, 170.4], [104.6, 175], [100.4, 184.4], [99.6, 197], [101.8, 208.4], [105.4, 215.6, 'c'], [120, 220.6, 'c'], [122.8, 208], [124, 188]]);
      const band = spline([[armO(214) - 1.6, 213.4, 'c'], [armI(219) + 1.8, 218.4, 'c'], [armI(223) + 1.8, 222.8, 'c'], [armO(218) - 1.8, 218.2, 'c']]);
      const gathers = ['M 104 206 Q 107 210 106.6 214', 'M 109.6 208 Q 111.4 213 110.8 216.6', 'M 115 208.6 Q 116 214 115.4 218.4', 'M 105.6 180 Q 109 184 110 190'];
      const ruff = Array.from({ length: 7 }, (_, i) => { const x = 137.6 + i * 3.54; return `<path d="M ${f1(x)} ${f1(189.4 + (i === 0 || i === 6 ? -.8 : .6))} q 1.77 3 3.54 0" fill="#fff" stroke="${INK}" stroke-width=".7"/>`; }).join('');
      const bow = `<path d="M 150 197 C 143 190 136.6 192 137.4 198 C 138 203 144 202.6 150 199.6 C 156 202.6 162 203 162.6 198 C 163.4 192 157 190 150 197 Z" fill="${F.rib || '#E86C94'}" stroke="${INK}" stroke-width=".9"/><path d="M 148.6 199 L 144.6 211 L 148.2 209 L 149.6 212 Z M 151.4 199 L 155.4 211 L 151.8 209 L 150.4 212 Z" fill="${F.rib || '#E86C94'}" stroke="${INK}" stroke-width=".8"/><ellipse cx="150" cy="198" rx="2.2" ry="2.6" fill="${F.rib || '#E86C94'}" stroke="${INK}" stroke-width=".8"/><path d="M 140 195.6 Q 142 193.6 145 194.4" stroke="#fff" stroke-width=".8" fill="none" opacity=".8"/>`;
      return piece(pep, F.fill, { folds: fm('M 124 266 Q 122 276 118 284', 'M 136 266 Q 136 276 134 285') }) +
        piece(body, F.fill, { folds: fm('M 130 214 Q 133 228 131 244', 'M 140 222 Q 142 236 141 252'), lines: [{ d: 'M 150 204 L 150 262', o: .4 }] }) + btn(150, 222, '#fff', 1.3) + btn(150, 240, '#fff', 1.3) +
        piece(puff, F.alt, { folds: gathers }) + piece(mir(puff), F.alt, { folds: gathers.map(mir) }) + piece(band, F.alt, { rim: false }) + piece(mir(band), F.alt, { rim: false }) + ruff + (F.print === 'bow' ? bow : '');
    }
  },
  /* ---------- 斜肩宽松 T 恤（露出一侧肩膀 + 内衣肩带） ---------- */
  offShoulderTee: {
    cat: 'top', name: '斜肩宽松T恤', thumb: '84 150 132 156',
    render(F) {
      const R = offsetPts(SHOULDER.slice(1), 2.6).map(mx).map(p => [p[0], p[1]]);
      const body = spline([[150, 184], [155.6, 180.6], [160.6, 167.4], ...R, [188, 212], [300 - sideX(230) + 3.4, 230], [300 - sideX(262) + 4.4, 262], [300 - sideX(298) + 5.4, 298, 'c'], [150, 300.4], [sideX(298) - 5.4, 298, 'c'], [sideX(262) - 4.4, 262], [sideX(230) - 3.4, 230], [121.4, 213, 'c'], [129.6, 203], [140, 192.6]]);
      const neckTrim = line([[121.4, 213], [129.6, 203], [140, 192.6], [150, 184], [155.6, 180.6], [160.6, 167.4]]);
      const slR = mir(spline([[118.5, 170.4], [111.6, 172.6], [107.2, 178.4], [104.4, 190], [101.8, 206], [99.6, 218, 'c'], [116.6, 223, 'c'], [119.4, 210], [121.2, 196]]));
      const slL = spline([[104.8, 204], [100.8, 208], [99, 218], [98.2, 234, 'c'], [117.6, 240, 'c'], [119.6, 228], [121.4, 213, 'c'], [112, 206.4]]);
      const art = F.print === 'cherry' ? `<path d="M 147 216 C 148 206 152 202 158 200 M 151 214 C 152 208 155 204 158 200" fill="none" stroke="#4E8E3A" stroke-width="1.3" stroke-linecap="round"/><path d="M 158 200 C 162 196 167 198 166 202 C 163 204 160 202 158 200 Z" fill="#5DBE4A" stroke="${INK}" stroke-width=".7"/><circle cx="145" cy="221" r="5.4" fill="#E0304F" stroke="${INK}" stroke-width=".9"/><circle cx="153.4" cy="219" r="5.4" fill="#E0304F" stroke="${INK}" stroke-width=".9"/><circle cx="143.4" cy="219.2" r="1.3" fill="#fff" opacity=".85"/><circle cx="151.8" cy="217.2" r="1.3" fill="#fff" opacity=".85"/>` + star5(166, 234, 3.2, '#FFE27A', .8) + star5(136, 240, 2.4, '#9CD3F5', .7) : '';
      return strap('M 129.2 170.8 L 128.2 204', F.rib || '#F7A9C4', 1.4) + piece(body, F.fill, { under: art, folds: ['M 122 250 Q 126 266 124 282', 'M 176 244 Q 174 262 177 280', 'M 132 268 Q 135 280 134 292', 'M 128 214 Q 138 222 148 226'] }) +
        `<path d="${neckTrim}" fill="none" stroke="${F.alt}" stroke-width="2.4" stroke-linecap="round"/><path d="${neckTrim}" fill="none" stroke="${INK}" stroke-width=".7" transform="translate(0 1.4)" opacity=".6"/>` +
        piece(slR, F.fill, { folds: [mir('M 104 204 Q 108 208 110 214')] }) + piece(slL, F.fill, { folds: ['M 102 222 Q 108 226 114 228'] });
    }
  },
  /* ---------- 白衬衫 + 菱格毛衣背心 ---------- */
  vestShirt: {
    cat: 'top', name: '衬衫+菱格背心', thumb: '72 146 156 182',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, eo: 2.6, ei: 2.2, se: 2.6 }), cf = cuffD(y1, 7, 2.6, 2.2);
      const shirt = bodyD({ hem: 304, e: 2.6, hemE: 3, neckY: 172, neckW: 6, se: 2.2, curve: 4 });
      const vest = symS([[150, 222], [144.6, 204], [139.6, 181], [137.6, 166.4, 'c'], [131, 169], [125.6, 170.6], [123.4, 180], [125.2, 200], [sideX(222) - 3, 222], [sideX(250) - 3.2, 250], [sideX(284) - 3.6, 284, 'c'], [150, 286.6]]);
      const vRib = symS([[150, 216], [145.8, 202], [141.4, 182], [139.6, 166.6, 'c'], [137.6, 166.4, 'c'], [139.6, 181], [144.6, 204], [150, 222]]);
      const hemR = symS([[150, 279.6], [sideX(278) - 3.6, 277.6, 'c'], [sideX(285) - 3.7, 285, 'c'], [150, 287.6]]);
      const collar = spline([[140.2, 163.2], [146, 167], [149.4, 175, 'c'], [143.2, 178.6, 'c'], [138.6, 170]]);
      const aH = spline([[123.4, 180], [125.2, 200], [sideX(222) - 3, 222], [sideX(222) - 6, 219], [120.4, 200], [120.6, 181]]);
      return piece(shirt, F.alt, { folds: fm('M 126 290 Q 129 296 128 302') }) + piece(sl, F.alt, { folds: ['M 94 262 Q 98 268 97 276', 'M 90 292 Q 93 298 92 304'] }) + piece(mir(sl), F.alt, { folds: [mir('M 94 262 Q 98 268 97 276'), mir('M 90 292 Q 93 298 92 304')] }) +
        piece(cf, F.alt, {}) + piece(mir(cf), F.alt, {}) + btn(armI(310) - 2.4, 310.6, '#fff', 1) + btn(300 - armI(310) + 2.4, 310.6, '#fff', 1) +
        piece(vest, F.fill, { folds: fm('M 131 236 Q 134 250 132 266') }) + piece(vRib, F.rib || F.base, { rim: false, lit: false, lines: [{ d: 'M 139 168 L 145 204 M 161 168 L 155 204', o: .3, w: .6, dash: '1 1.4' }] }) +
        piece(hemR, F.rib || F.base, { rim: false, lines: [{ d: ribLines(108, 192, 278, 287.4, 2.8), o: .4, w: .6 }] }) +
        piece(collar, F.alt, {}) + piece(mir(collar), F.alt, {}) + btn(150, 184, '#fff', 1.1) + btn(150, 198, '#fff', 1.1);
    }
  },
  /* ---------- 热带花衬衫（古巴领、短袖） ---------- */
  printShirt: {
    cat: 'top', name: '花衬衫', thumb: '80 146 140 162',
    render(F) {
      const body = bodyD({ hem: 300, e: 3.4, hemE: 4, neckY: 198, neckW: 1.2, neckX: 140.4, se: 2.8, curve: 1.2 });
      const slv = spline([[118.5, 170.2], [110.8, 172.4], [106, 178.4], [102.8, 190], [99.4, 210], [96.6, 230, 'c'], [117, 236, 'c'], [119.6, 220], [121.6, 200]]);
      const collar = spline([[141.2, 162.8], [133.6, 166.4], [126, 171], [124, 177.4, 'c'], [133.4, 183.6], [146.6, 196.6, 'c'], [145.6, 180], [142.6, 170]]);
      const placket = 'M 151.6 198 L 151.6 300';
      return piece(body, F.fill, { folds: fm('M 126 240 Q 129 254 127 270', 'M 126 280 Q 129 288 128 296'), lines: [{ d: placket, o: .6 }] }) + [214, 234, 254, 274].map(y => btn(149.4, y, '#FFF8EE', 1.3)).join('') +
        piece(slv, F.fill, { folds: ['M 103 212 Q 108 218 110 226'], lines: [{ d: 'M 97.4 224 L 116.6 229.4', o: .45 }] }) + piece(mir(slv), F.fill, { folds: [mir('M 103 212 Q 108 218 110 226')], lines: [{ d: mir('M 97.4 224 L 116.6 229.4'), o: .45 }] }) +
        piece(collar, F.fill, { deep: ['M 124 177 L 146.6 196.6 L 150 196 L 150 186 Z'] }) + piece(mir(collar), F.fill, { deep: [mir('M 124 177 L 146.6 196.6 L 150 196 L 150 186 Z')] });
    }
  },
  /* ---------- 条纹长袖T + 针织马甲 ---------- */
  stripeVest: {
    cat: 'top', name: '条纹T+针织马甲', thumb: '72 146 156 182',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, eo: 2.6, ei: 2.2, se: 2.4 }), cf = cuffD(y1, 6, 2.6, 2.2);
      const tee = bodyD({ hem: 298, e: 2.8, hemE: 3.2, neckY: 171, neckW: 7, se: 2.2 });
      const neck = spline([[137.4, 163.2, 'c'], [150, 169.4], [162.6, 163.2, 'c'], [163.4, 166.4, 'c'], [150, 173.6], [136.6, 166.4, 'c']]);
      const panel = spline([[140.4, 164.6], [133, 167.4], [125.6, 169.6], [120.8, 171.4], [118.8, 178], [120.8, 194], [123.6, 216], [sideX(236) - 3.8, 236], [sideX(270) - 4.2, 270], [sideX(294) - 4.6, 294, 'c'], [138.4, 296, 'c'], [139, 250], [140.2, 200], [141.6, 172, 'c']]);
      const pk = spline([[124, 262, 'c'], [134.6, 262.4, 'c'], [134.4, 276, 'c'], [124.2, 275.6, 'c']]);
      return piece(tee, F.alt, {}) + piece(sl, F.alt, { folds: ['M 94 262 Q 98 268 97 276'] }) + piece(mir(sl), F.alt, { folds: [mir('M 94 262 Q 98 268 97 276')] }) + piece(cf, F.rib || F.base, {}) + piece(mir(cf), F.rib || F.base, {}) + piece(neck, F.rib || F.base, { rim: false }) +
        piece(panel, F.fill, { folds: ['M 128 222 Q 131 238 129 254'], lines: [{ d: 'M 141 172 L 139.8 200 L 139 250 L 138.6 294', c: F.detail, w: 2.4, o: .5 }] }) + piece(mir(panel), F.fill, { folds: [mir('M 128 222 Q 131 238 129 254')], lines: [{ d: mir('M 141 172 L 139.8 200 L 139 250 L 138.6 294'), c: F.detail, w: 2.4, o: .5 }] }) +
        piece(pk, F.fill, { lines: [{ d: 'M 124.4 265.6 L 134.4 266', o: .4 }] }) + piece(mir(pk), F.fill, {}) + btn(141, 214, F.detail, 1.4) + btn(140.4, 238, F.detail, 1.4) + btn(139.6, 262, F.detail, 1.4);
    }
  },

  /* ---------- 外套：修身西装 ---------- */
  blazer: {
    cat: 'outer', name: '修身西装外套', thumb: '72 146 156 190',
    render(F) {
      const y1 = 316, sl = sleeveD({ y1, eo: 3.4, ei: 3, se: 3.2 });
      const panel = spline([[142.2, 163.6], [133, 166.4], [125.2, 168.4], [117.4, 170], [111.8, 173.2], [108.2, 179.4], [106.4, 188], [109, 214], [sideX(240) - 4, 240], [sideX(268) - 4.8, 268], [sideX(300) - 5.8, 300, 'c'], [151.8, 303, 'c'], [151.8, 247.4, 'c'], [144.6, 204], [142.6, 178]]);
      const flap = spline([[118, 280, 'c'], [134.4, 281.4, 'c'], [134.2, 286.8, 'c'], [117.8, 285.6, 'c']]);
      const sO = { folds: ['M 99 262 Q 103 270 101 280', 'M 94 292 Q 97 298 96 306', 'M 105 236 Q 108 242 107 250'], lines: [{ d: `M ${f1(armO(306) - 3)} 306.4 L ${f1(armI(307) + 2.6)} 307.4`, o: .5 }] };
      return piece(mir(panel), F.fill, { folds: [mir('M 124 230 Q 128 246 126 262')], lines: [{ d: mir('M 138 196 C 136 214 134 232 133 250'), o: .45 }] }) + piece(panel, F.fill, { folds: ['M 124 230 Q 128 246 126 262'], lines: [{ d: 'M 138 196 C 136 214 134 232 133 250', o: .45 }] }) +
        piece(flap, F.fill, { deep: [flap] }) + piece(mir(flap), F.fill, { deep: [mir(flap)] }) +
        piece(collarBackL, F.fill, { deep: [collarBackL], rim: false }) + piece(mir(collarBackL), F.fill, { deep: [mir(collarBackL)], rim: false }) +
        piece(lapelL(), F.fill, { lit: [1.2, 1.2], litOp: .45 }) + piece(mir(lapelL()), F.fill, { lit: [1.2, 1.2], litOp: .45 }) +
        btn(154.2, 258, F.detail, 1.9) + btn(154.2, 278, F.detail, 1.9) +
        piece(sl, F.fill, sO) + piece(mir(sl), F.fill, { ...sO, folds: sO.folds.map(mir), lines: sO.lines.map(l => ({ ...l, d: mir(l.d) })) }) +
        btn(armI(311) + .4, 311, F.detail, 1.1) + btn(300 - armI(311) - .4, 311, F.detail, 1.1);
    }
  },
  /* ---------- 外套：小香风粗花呢短外套 ---------- */
  tweedJacket: {
    cat: 'outer', name: '粗花呢短外套', thumb: '72 146 156 150',
    render(F) {
      const y1 = 312, sl = sleeveD({ y1, eo: 3.2, ei: 2.8, se: 3.4 }), cf = cuffD(y1, 5, 3.2, 2.8);
      const panel = spline([[140.2, 163.6], [133, 166.2], [125, 168.4], [117.2, 170], [111.6, 173.2], [108, 179.4], [106.2, 188], [108.8, 214], [sideX(240) - 4.6, 240], [sideX(266) - 5.2, 266, 'c'], [149.6, 268, 'c'], [149.6, 180], [145.4, 172.6]]);
      const trimD = 'M 140.2 164 C 144 170 148.8 174 149.6 180 L 149.6 267.4 L ' + f1(sideX(266) - 4.6) + ' 265.6';
      const pk = (y, h) => spline([[118.6, y, 'c'], [133, y + .6, 'c'], [132.8, y + h, 'c'], [118.8, y + h - .4, 'c']]);
      const tr = F.rib || '#D9859E', trim = d => [{ d, c: INK, w: 3.4, o: .9 }, { d, c: tr, w: 2.2, o: 1 }, { d, c: '#fff', w: .6, dash: '1 1.4', o: .9 }];
      return piece(sl, F.fill, { folds: ['M 97 262 Q 101 270 99 280', 'M 93 290 Q 96 296 95 304'] }) + piece(mir(sl), F.fill, { folds: [mir('M 97 262 Q 101 270 99 280'), mir('M 93 290 Q 96 296 95 304')] }) +
        piece(cf, tr, { rim: false }) + piece(mir(cf), tr, { rim: false }) +
        piece(panel, F.fill, { lines: trim(trimD), folds: ['M 124 222 Q 127 236 125 252'] }) + piece(mir(panel), F.fill, { lines: trim(mir(trimD)), folds: [mir('M 124 222 Q 127 236 125 252')] }) +
        piece(pk(198, 11), F.fill, { lines: trim('M 118.8 198.4 L 133 199') }) + piece(mir(pk(198, 11)), F.fill, { lines: trim(mir('M 118.8 198.4 L 133 199')) }) +
        piece(pk(238, 14), F.fill, { lines: trim('M 118.8 238.4 L 133 239') }) + piece(mir(pk(238, 14)), F.fill, { lines: trim(mir('M 118.8 238.4 L 133 239')) }) +
        [192, 214, 236, 258].map(y => btn(145.4, y, '#E9C86A', 1.8) + btn(154.6, y, '#E9C86A', 1.8)).join('');
    }
  },
  /* ---------- 外套：双排扣风衣（腰带） ---------- */
  trenchCoat: {
    cat: 'outer', name: '双排扣风衣', thumb: '66 146 168 250',
    render(F) {
      const y1 = 318, sl = sleeveD({ y1, eo: 3.8, ei: 3.4, se: 3.8, puff: 1.4 });
      const ease = y => 5 + Math.max(0, y - 260) * .05;
      const pts = [[142.6, 163.4], [133, 166.2], [125, 168.2], [117, 169.8], [111.2, 173], [107.4, 179.4], [105.6, 188], [108.4, 214]];
      rng(236, 384, 8).forEach(y => pts.push([outerX(Math.min(y, 330)) - ease(y) - Math.max(0, y - 330) * .16, y]));
      pts.push([outerX(330) - ease(392) - 10, 392, 'c']); pts.push([150, 395]);
      const body = symS(pts);
      const belt = symS([[150, 244.6], [sideX(242) - 5.4, 242.4, 'c'], [sideX(250) - 5.6, 250.4, 'c'], [150, 252.6]]);
      const tail = 'M 157 250 C 159 262 158 274 160.6 286 L 165.6 285 C 163.6 274 163.8 262 162 250 Z';
      const ep = spline([[117.4, 170.6, 'c'], [130.4, 167.4, 'c'], [131, 171, 'c'], [118.2, 174.4, 'c']]);
      const sO = { folds: ['M 98 262 Q 102 270 100 280', 'M 93 292 Q 96 298 95 306'], lines: [{ d: `M ${f1(armO(300) - 3.8)} 300 L ${f1(armI(301) + 3.4)} 301.4 M ${f1(armO(305) - 3.8)} 305 L ${f1(armI(306) + 3.4)} 306.4`, o: .7 }] };
      return piece(body, F.fill, {
        folds: fm('M 126 270 Q 124 300 120 330', 'M 138 276 Q 138 320 136 370', 'M 116 344 Q 112 364 108 384'),
        lines: [{ d: 'M 156 208 L 156 392', o: .75 }, { d: 'M 156 210 L 156 244', c: F.stitch, dash: '1.6 1.4', o: .8, w: .7 }]
      }) + [216, 234].map(y => btn(136.6, y, F.detail, 1.9) + btn(163.4, y, F.detail, 1.9)).join('') +
        piece(belt, F.fill, { rim: false, lines: [{ d: 'M 110 246.4 Q 150 250 190 246.4', c: F.stitch, dash: '1.4 1.2', o: .8, w: .6 }] }) + `<rect x="152.4" y="242.6" width="8.6" height="10.6" rx="1.4" fill="none" stroke="${F.detail}" stroke-width="1.8"/>` + piece(tail, F.fill, {}) +
        piece(collarBackL, F.fill, { deep: [collarBackL], rim: false }) + piece(mir(collarBackL), F.fill, { deep: [mir(collarBackL)], rim: false }) +
        piece(lapelL(208, 2.4), F.fill, { lit: [1.2, 1.2], litOp: .45 }) + piece(mir(lapelL(208, 2.4)), F.fill, { lit: [1.2, 1.2], litOp: .45 }) +
        piece(ep, F.fill, {}) + piece(mir(ep), F.fill, {}) + btn(128.6, 170.4, F.detail, 1.1) + btn(171.4, 170.4, F.detail, 1.1) +
        piece(sl, F.fill, sO) + piece(mir(sl), F.fill, { ...sO, folds: sO.folds.map(mir), lines: sO.lines.map(l => ({ ...l, d: mir(l.d) })) });
    }
  },

  /* ---------- 下装：小脚牛仔裤 ---------- */
  skinnyJeans: {
    cat: 'bottom', name: '小脚牛仔裤', thumb: '84 270 132 296',
    render(F) {
      const ease = y => 1.9 + Math.max(0, 330 - y) * .02 + (y > 530 ? (y - 530) * .06 : 0);
      const d = pantsD({ top: 283, hem: 556, ease, inE: y => 1.4 + (y > 530 ? (y - 530) * .05 : 0) });
      const wb = bandD(283, 7, 4, 2.2, 2.3);
      const stack = ['M 118.4 532 Q 124 536 131 533', 'M 119 540 Q 126 545 134 541', 'M 120 548 Q 127 552 135 549'];
      return piece(d, F.fill, {
        folds: fm('M 121 340 Q 126 350 124 362', 'M 122 422 Q 128 426 136 422', 'M 138 330 Q 143 338 145 350', ...stack),
        lines: [{ d: FLY, c: F.stitch, dash: '2 1.6', o: .9 }, { d: POCKET, c: F.stitch, dash: '2 1.6', o: .9 }, { d: mir(POCKET), c: F.stitch, dash: '2 1.6', o: .9 }, { d: `M ${f1(legO(420) - 1.2)} 300 L ${f1(legO(420) - 1.2)} 552`, c: F.stitch, dash: '2 1.6', o: .5 }]
      }) + piece(wb, F.fill, { lines: [{ d: 'M 118 286.6 Q 150 292.6 182 286.6', c: F.stitch, dash: '2 1.6', o: .9 }] }) + `<circle cx="150" cy="287" r="1.8" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".7"/>`;
    }
  },
  /* ---------- 下装：三层蛋糕裙 ---------- */
  tierSkirt: {
    cat: 'bottom', name: '蛋糕短裙', thumb: '84 272 132 80',
    render(F) {
      const tier = (y0, y1, x0, x1, n) => {
        const pts = [[150, y0 + 2.2], [x0, y0, 'c']];
        pts.push([x1, y1, 'c']);
        for (let i = 1; i < n; i++) { const x = x1 + (150 - x1) * i / n; pts.push([x - (150 - x1) / n / 2, y1 + 2.2 * (1 - Math.pow((x - 150) / (150 - x1), 2)) + 1.8]); pts.push([x, y1 + 2.2 * (1 - Math.pow((x - 150) / (150 - x1), 2)), 'c']); }
        pts.push([150 - (150 - x1) / n / 2, y1 + 4]);
        return symS(pts.concat([[150, y1 + 2.2]]));
      };
      const g = (y0, y1, x0, x1) => Array.from({ length: 6 }, (_, i) => { const t = (i + .5) / 6; const xa = x0 + (150 - x0) * t, xb = x1 + (150 - x1) * t; return `M ${f1(xa)} ${f1(y0 + 2)} Q ${f1((xa + xb) / 2 - .6)} ${f1((y0 + y1) / 2)} ${f1(xb)} ${f1(y1)}`; }).flatMap(d => [d, mir(d)]);
      const t3 = tier(316, 342, 98, 90, 6), t2 = tier(300, 322, 104.6, 97, 6), t1 = tier(287, 306, 109.6, 104, 5);
      const wb = bandD(282, 6.6, 3.6, 2.6, 2.8);
      return piece(t3, F.fill, { folds: g(316, 340, 98, 90), foldOp: .5 }) + piece(t2, F.alt, { folds: g(300, 320, 104.6, 97), foldOp: .5 }) + piece(t1, F.fill, { folds: g(287, 304, 109.6, 104), foldOp: .5 }) +
        piece(wb, F.rib || F.fill, {}) + (F.print === 'bow' ? `<path d="M 150 286 C 145 281 140 282 140.6 286.6 C 141 290 146 289.6 150 287.6 C 154 289.6 159 290 159.4 286.6 C 160 282 155 281 150 286 Z" fill="${F.rib || '#F48FB1'}" stroke="${INK}" stroke-width=".8"/><circle cx="150" cy="286.6" r="1.7" fill="${F.rib || '#F48FB1'}" stroke="${INK}" stroke-width=".7"/>` : '');
    }
  },
  /* ---------- 下装：直筒西装裤 ---------- */
  slacks: {
    cat: 'bottom', name: '直筒西装裤', thumb: '84 270 132 316',
    render(F) {
      const tO = y => (y < 322 ? outerX(y) - 3 : 105.4 + (y - 322) / 253 * 6.2), tI = y => 148.6 - Math.max(0, y - 330) / 245 * 8.4;
      const ease = y => Math.max(2.6, outerX(y) - tO(y)), inE = y => Math.max(2.2, tI(y) - legI(y));
      const d = pantsD({ top: 282, hem: 575, ease, inE });
      const wb = bandD(282, 6.4, 4, 3, 3.1);
      const crease = `M ${f1((legO(330) + legI(330)) / 2 - 2)} 300 C ${f1((legO(420) + legI(420)) / 2 - 3)} 400 ${f1((legO(500) + legI(500)) / 2 - 3.6)} 500 ${f1((legO(560) + legI(560)) / 2 - 3.6)} 574`;
      return piece(d, F.fill, {
        folds: fm('M 120 330 Q 125 340 123 352', 'M 118 552 Q 126 556 136 552', 'M 138 330 Q 143 338 145 350'),
        lines: [{ d: crease, o: .45 }, { d: mir(crease), o: .45 }, { d: FLY, o: .6 }, { d: 'M 116 288.6 L 124.6 306', o: .7 }, { d: mir('M 116 288.6 L 124.6 306'), o: .7 }]
      }) + piece(wb, F.fill, {}) + `<path d="M 118 285.4 Q 150 292 182 285.4" stroke="#1E1B1D" stroke-width="3.2" fill="none"/><rect x="146" y="284.6" width="8" height="6" rx="1" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".8"/>`;
    }
  },

  /* ---------- 连衣裙：逃婚婚纱（拖地，盖住鞋子） ---------- */
  weddingDress: {
    cat: 'dress', name: '白色婚纱', thumb: '70 170 160 230', z: 41, long: true,
    render(F) {
      const bod = symS([[150, 200.6, 'c'], [143.2, 193.4], [135.4, 190.6], [127.6, 193], [122.6, 206, 'c'], [sideX(226) - 1.8, 226], [sideX(246) - 1.8, 246], [sideX(262) - 2, 262, 'c'], [150, 265]]);
      const skirtPts = [[150, 259], [sideX(258) - 2, 258, 'c']];
      rng(276, 580, 8).forEach(y => { const t = (y - 258) / 330; skirtPts.push([sideX(Math.min(y, 300)) - 2 - Math.pow(t, .9) * 50, y]); });
      skirtPts.push([sideX(300) - 54, 588, 'c']); skirtPts.push([150, 592]);
      const skirt = symS(skirtPts);
      const layer = symS([[150, 262], [sideX(262) - 2.2, 261, 'c'], [116, 300], [104, 360], [95, 420, 'c'], [108, 426], [120, 420], [134, 428], [150, 424]]);
      const scal = Array.from({ length: 16 }, (_, i) => { const x = 54 + i * (192 / 16) - 1; return `<path d="M ${f1(x + 2)} ${f1(588.4 - Math.abs(x + 7.5 - 150) * .03)} q 6 5 12 0" fill="#FFFDF7" stroke="${INK}" stroke-width=".8"/>`; }).join('');
      const sash = symS([[150, 257], [sideX(256) - 2.4, 255.4, 'c'], [sideX(264) - 2.6, 264, 'c'], [150, 265.6]]);
      const bow = `<g transform="translate(124 262)"><path d="M 0 0 C -9 -8 -16 -5 -14 1 C -12 6 -5 5 0 1 C 5 5 12 6 14 1 C 16 -5 9 -8 0 0 Z" fill="${F.rib || '#F7C9D6'}" stroke="${INK}" stroke-width=".9"/><path d="M -1.4 1.4 L -6 22 L -2 19 L 0 23 Z M 1.4 1.4 L 5 20 L 1.4 17.4 Z" fill="${F.rib || '#F7C9D6'}" stroke="${INK}" stroke-width=".8"/><ellipse cx="0" cy=".6" rx="2.6" ry="3" fill="${F.rib || '#F7C9D6'}" stroke="${INK}" stroke-width=".8"/></g>`;
      const drape = fm('M 128 290 Q 124 360 112 440 Q 106 500 100 580', 'M 140 300 Q 140 400 134 500 Q 132 540 130 584', 'M 116 330 Q 108 400 96 480');
      return piece(skirt, F.fill, { under: `<path d="${skirt}" fill="url(#pat-lace)" opacity=".7"/>`, folds: drape, foldOp: .42, sc: '#EADFE6' }) + scal + piece(bod, 'url(#pat-lace)', { sc: '#EADFE6', folds: fm('M 132 214 Q 136 232 134 250'), lines: [{ d: 'M 150 200.6 L 150 262', o: .25 }] }) +
        `<path d="M 127.6 193 Q 135.4 190.6 143.2 193.4 Q 147 196 150 200.6 Q 153 196 156.8 193.4 Q 164.6 190.6 172.4 193" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray=".1 2.6" stroke-linecap="round"/>` +
        piece(sash, F.rib || '#F7C9D6', { rim: false }) + bow;
    }
  },
  /* ---------- 连衣裙位：牛仔背带短裤（可以叠穿上衣） ---------- */
  overalls: {
    cat: 'dress', name: '背带短裤', thumb: '84 164 132 186', z: 32, keepTop: true,
    render(F) {
      const bib = spline([[133.6, 206, 'c'], [166.4, 206, 'c'], [168.4, 252], [174.4, 272, 'c'], [125.6, 272, 'c'], [131.6, 252]]);
      const sh = pantsD({ top: 268, hem: 336, dip: 3, ease: y => 3 + (y - 268) * .03, inE: () => 2.2 });
      const cuff = legCuffD(327, 338, 5, 1.6, 5.6, 1.4);
      const st = 'M 134.4 207.4 C 132.6 196 130.6 182 129.4 170.6';
      const pocket = spline([[141, 222, 'c'], [159, 222, 'c'], [158.6, 238, 'c'], [150, 242.4], [141.4, 238, 'c']]);
      const s = F.stitch;
      return strap(st, F.base, 3.4) + strap(mir(st), F.base, 3.4) +
        piece(sh, F.fill, { folds: fm('M 124 306 Q 128 314 127 322', 'M 141 314 Q 145 320 147 326'), lines: [{ d: FLY, c: s, dash: '1.8 1.4', o: .9 }] }) +
        piece(cuff, F.fill, { deep: [cuff] }) + piece(mir(cuff), F.fill, { deep: [mir(cuff)] }) +
        piece(bib, F.fill, { lines: [{ d: 'M 135.6 209 L 164.4 209 M 136 266 L 164 266', c: s, dash: '1.8 1.4', o: .9 }] }) +
        piece(pocket, F.fill, { lines: [{ d: 'M 141.6 225 L 158.4 225', c: s, dash: '1.6 1.2', o: .9 }], under: F.print === 'heart' ? `<path d="${heartD(150, 232, 4)}" fill="#F48FB1" stroke="${INK}" stroke-width=".7"/>` : '' }) +
        `<rect x="131.4" y="204.6" width="6.4" height="6" rx="1.2" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".8"/><rect x="162.2" y="204.6" width="6.4" height="6" rx="1.2" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".8"/>` + btn(123.4, 276, '#D8DDE4', 1.6) + btn(176.6, 276, '#D8DDE4', 1.6);
    }
  }
});

/* 小猪外套：沿用宽松短外套版型，加猪耳朵 + 胸口小猪贴布 */
const _puff = TPL.puffJacket.render;
TPL.puffJacket.render = function (F) {
  let s = _puff(F);
  if (F.print === 'pig') {
    const ear = (x, r) => `<g transform="translate(${x} 160) rotate(${r})"><path d="M -5.6 3 L 0 -8 L 5.6 3 Z" fill="${F.base}" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/><path d="M -3 1.6 L 0 -4.4 L 3 1.6 Z" fill="#F48FB1"/></g>`;
    const pig = `<g transform="translate(128 226)"><ellipse cx="0" cy="0" rx="10" ry="8.6" fill="#FFD3E0" stroke="${INK}" stroke-width="1"/><path d="M -8 -5 L -9 -11 L -3.6 -7.6 Z M 8 -5 L 9 -11 L 3.6 -7.6 Z" fill="#FFD3E0" stroke="${INK}" stroke-width=".9" stroke-linejoin="round"/><ellipse cx="0" cy="2" rx="4.4" ry="3.2" fill="#F7A3BE" stroke="${INK}" stroke-width=".8"/><circle cx="-1.5" cy="2" r=".8" fill="${INK}"/><circle cx="1.5" cy="2" r=".8" fill="${INK}"/><circle cx="-4.6" cy="-2.6" r="1" fill="${INK}"/><circle cx="4.6" cy="-2.6" r="1" fill="${INK}"/><ellipse cx="-7" cy="1.6" rx="1.8" ry="1.1" fill="#F48FB1" opacity=".7"/><ellipse cx="7" cy="1.6" rx="1.8" ry="1.1" fill="#F48FB1" opacity=".7"/><path d="M -10 0 C -10 -6 -6 -9 0 -9" fill="none" stroke="#fff" stroke-width=".9" stroke-dasharray="1.2 1" opacity=".9"/></g>`;
    s = ear(121, -34) + ear(179, 34) + s + pig;
  }
  return s;
};
