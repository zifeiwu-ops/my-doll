/* =====================================================================
   新版型 · 千禧校园（90s/00s 美式校园电影）& 甜系插画系列 & 香芋紫网纱连衣裙
   全部沿描摹底模的身体轮廓生成（和其它版型同一套描边 / 阴影）
   ===================================================================== */
/* 蕾丝花边：沿一条折线排一串小半圆（画在衣片下面，只露出外沿的半圈） */
function laceRow(pts, r, c = '#FFFDF8', holes = true) {
  let s = '', acc = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], L = Math.hypot(x1 - x0, y1 - y0);
    for (let t = acc; t < L; t += r * 1.7) { const x = x0 + (x1 - x0) * t / L, y = y0 + (y1 - y0) * t / L; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${c}" stroke="${INK}" stroke-width=".75"/>` + (holes ? `<circle cx="${f1(x)}" cy="${f1(y - r * .45)}" r="${f1(r * .28)}" fill="${INK}" opacity=".35"/>` : ''); acc = t + r * 1.7 - L; }
  }
  return s;
}
/* 手腕蕾丝荷叶边（左手；右手用 mir） */
function wristFrill(y, eo, ei, depth = 7, n = 5) {
  const xo = armO(y) - eo - 1.2, xi = armI(y) + ei + 1;
  const pts = [[xo + .6, y - 1, 'c'], [xi - .4, y, 'c']];
  for (let i = n; i >= 0; i--) { const x = xi + (xo - xi) * i / n, yy = y + depth + (i % 2 ? 0 : 0); pts.push([x, yy + (i === n || i === 0 ? -1.2 : 0), 'c']); if (i > 0) pts.push([x + (xo - xi) / n / 2, yy + 2.6]); }
  return spline(pts);
}
/* 露肩袖（从上臂开始，不经过肩膀） */
function offSleeveD(o = {}) {
  const { y0 = 186, y1 = 314, eo = 2.6, ei = 2.2, puff = 0, inPuff = .35 } = o;
  const pts = [[123, y0 + 2], [armO(y0 + 12) - eo + 1, y0 - 1.4], [armO(y0 + 14) - eo - puff * .3, y0 + 10]];
  rng(y0 + 20, y1 - 6, Math.max(2, Math.round((y1 - y0 - 26) / 9))).forEach(y => pts.push([armO(y) - eo - puff * bumpF((y - y0) / (y1 - y0)), y]));
  pts.push([armO(y1) - eo - puff * bumpF(1) + .6, y1, 'c']);
  pts.push([armI(y1) + ei + .4, y1 + 1, 'c']);
  rng(y1 - 8, 227, Math.max(2, Math.round((y1 - 235) / 9))).forEach(y => pts.push([armI(y) + ei + puff * inPuff * bumpF((y - y0) / (y1 - y0)), y]));
  pts.push([armI(222) + ei, 221]); pts.push([123.4, 206]);
  return spline(pts);
}
/* 泡泡短袖（左） */
const PUFF_SL = spline([[123.4, 170.2], [112, 170.4], [104.6, 175], [100.4, 184.4], [99.6, 197], [101.8, 208.4], [105.4, 215.6, 'c'], [120, 220.6, 'c'], [122.8, 208], [124, 188]]);
const puffBand = () => spline([[armO(214) - 1.6, 213.4, 'c'], [armI(219) + 1.8, 218.4, 'c'], [armI(223) + 1.8, 222.8, 'c'], [armO(218) - 1.8, 218.2, 'c']]);
const PUFF_G = ['M 104 206 Q 107 210 106.6 214', 'M 109.6 208 Q 111.4 213 110.8 216.6', 'M 115 208.6 Q 116 214 115.4 218.4', 'M 105.6 180 Q 109 184 110 190'];
/* 普通短袖（左） */
const TEE_SL = spline([[118.5, 170.6], [111.6, 172.8], [107.2, 178.6], [104.4, 190], [101.2, 210], [98.2, 226, 'c'], [115.6, 231, 'c'], [118.8, 216], [121.2, 198]]);
/* 开衫前片（左）：hem 下摆高度，gap 门襟离中线的距离 */
function openPanel(hem, gap = 11, e = 5, top = 140.8) {
  return spline([[top - 1.2, 163.4], [133, 166.4], [125.2, 168.6], [117.6, 170.4], [112, 173.6], [108.4, 179.6], [106.6, 188], [109, 214],
    [sideX(Math.min(240, hem - 8)) - e, Math.min(240, hem - 8)], ...(hem > 262 ? [[sideX(hem - 8) - e - 1, hem - 8]] : []), [sideX(hem) - e - 1.2, hem, 'c'], [150 - gap, hem + 2, 'c'], [150 - gap + 1, hem - 30], [150 - gap + 3, 210], [top, 170, 'c']]);
}
const rosette = (x, y, s, c1, c2) => {
  let p = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8, r = i % 2 ? 7.2 : 8.6; p += `${i ? 'L' : 'M'} ${f1(x + Math.cos(a) * r * s)} ${f1(y + Math.sin(a) * r * s)} `; }
  return `<path d="M ${f1(x - 2 * s)} ${f1(y + 4 * s)} L ${f1(x - 5 * s)} ${f1(y + 17 * s)} L ${f1(x - 2.6 * s)} ${f1(y + 15.6 * s)} L ${f1(x - 1 * s)} ${f1(y + 18 * s)} Z M ${f1(x + 2 * s)} ${f1(y + 4 * s)} L ${f1(x + 5.4 * s)} ${f1(y + 16 * s)} L ${f1(x + 2.8 * s)} ${f1(y + 15 * s)} L ${f1(x + 1 * s)} ${f1(y + 17 * s)} Z" fill="${c2}" stroke="${INK}" stroke-width=".8"/>` +
    `<path d="${p}Z" fill="${c1}" stroke="${INK}" stroke-width=".9" stroke-linejoin="round"/><circle cx="${x}" cy="${y}" r="${f1(5 * s)}" fill="${c2}" stroke="${INK}" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="${f1(3 * s)}" fill="#F7F1E6" stroke="${INK}" stroke-width=".7"/>` +
    `<path d="M ${f1(x - 1 * s)} ${f1(y - 1 * s)} l ${f1(2 * s)} ${f1(2 * s)} M ${f1(x + 1 * s)} ${f1(y - 1 * s)} l ${f1(-2 * s)} ${f1(2 * s)}" stroke="${INK}" stroke-width=".6"/>`;
};

Object.assign(TPL, {
  /* ---------------- 上衣 ---------------- */
  ribCardiTop: {
    cat: 'top', name: '罗纹翻领开衫', thumb: '72 146 156 190',
    render(F) {
      const y1 = 312, sl = sleeveD({ y1, eo: 1.9, ei: 1.7, se: 1.8 }), cf = cuffD(y1, 4, 1.9, 1.7);
      const body = bodyD({ hem: 290, e: 2.2, hemE: 2.8, neckY: 206, neckW: 1, se: 1.8, curve: 1 });
      const collar = spline([[139.4, 164.2], [133.2, 167.4], [128.6, 173.4], [131.6, 180.6], [140.4, 191], [148.2, 204, 'c'], [146.2, 192], [142.4, 179], [140.6, 170]]);
      const fr = wristFrill(y1 + 1, 1.9, 1.7, 7, 5);
      const so = { folds: ['M 94 262 Q 98 268 97 276', 'M 90 292 Q 93 298 92 304'] };
      return piece(fr, '#FFFDF8', { rim: false, over: laceRow([[armO(y1 + 7) - 2, y1 + 6.4], [armI(y1 + 7) + 2, y1 + 7.4]], 1.1, '#FFFDF8') }) + piece(mir(fr), '#FFFDF8', { rim: false }) +
        piece(body, F.fill, { folds: fm('M 127 232 Q 130 246 128 262'), lines: [{ d: 'M 150 206 L 150 290', o: .5 }] }) + [216, 230, 244, 258, 272].map(y => btn(150, y, '#FFFDF6', 1.35)).join('') +
        piece(sl, F.fill, so) + piece(mir(sl), F.fill, { folds: so.folds.map(mir) }) + piece(cf, F.fill, { deep: [cf] }) + piece(mir(cf), F.fill, { deep: [mir(cf)] }) +
        piece(collar, F.fill, { lit: [1, 1], litOp: .5 }) + piece(mir(collar), F.fill, { lit: [1, 1], litOp: .5 });
    }
  },
  tubeTop: {
    cat: 'top', name: '蕾丝边小抹胸', thumb: '98 184 104 76',
    render(F) {
      const topL = [[150, 203.4], [143, 198.8], [133, 196.8], [125, 197.6], [122.4, 199.6]];
      const d = symS([...topL.slice(0, 4), [122.4, 199.6, 'c'], [sideX(222) - 1.4, 222], [sideX(234) - 1.6, 234], [sideX(248) - 1.8, 248, 'c'], [150, 250.4]]);
      const lace = laceRow(topL.slice().reverse().concat(topL.slice(1).map(mx)), 1.5, F.alt || '#EAF1FA');
      const lacing = [210, 218, 226, 234, 242].map((y, i) => `M 146 ${y} L 154 ${y + 6}` + (i < 4 ? ` M 154 ${y} L 146 ${y + 6}` : '')).join(' ');
      return lace + piece(d, F.fill, {
        folds: fm('M 128 212 Q 131 226 129 240'),
        lines: [{ d: lacing, c: '#EAF1FA', w: .9, o: .95 }, { d: 'M 143.6 207 L 143.6 246 M 156.4 207 L 156.4 246', c: F.detail, w: .8, o: .7 }, { d: 'M 124.6 244 Q 150 249.4 175.4 244', c: '#EAF1FA', dash: '0.1 2.6', w: 1.6, o: .9 }]
      }) + `<ellipse cx="150" cy="207.4" rx="3.2" ry="2.6" fill="#D9B45A" stroke="${INK}" stroke-width=".8"/><circle cx="149" cy="206.6" r=".8" fill="#fff" opacity=".8"/>`;
    }
  },
  mockTee: {
    cat: 'top', name: '小高领修身长袖T', thumb: '72 146 156 176',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, eo: 1.8, ei: 1.6, se: 1.8 }), cf = cuffD(y1, 5, 1.8, 1.6);
      const body = bodyD({ hem: 292, e: 2, hemE: 2.6, neckY: 167, neckW: 7.6, se: 1.8 });
      const neck = spline([[142, 156.4, 'c'], [150, 158.6], [158, 156.4, 'c'], [159, 167.2, 'c'], [150, 169.8], [141, 167.2, 'c']]);
      return piece(body, F.fill, { folds: fm('M 126 232 Q 129 246 127 262', 'M 125 276 Q 128 284 127 290') }) +
        piece(sl, F.fill, { folds: ['M 94 262 Q 98 268 97 276'] }) + piece(mir(sl), F.fill, { folds: [mir('M 94 262 Q 98 268 97 276')] }) +
        piece(cf, F.fill, { deep: [cf] }) + piece(mir(cf), F.fill, { deep: [mir(cf)] }) +
        piece(neck, F.fill, { lines: [{ d: 'M 143 161 Q 150 163.4 157 161 M 142.6 164.6 Q 150 167 157.4 164.6', o: .45 }] });
    }
  },
  ruchedCami: {
    cat: 'top', name: '抽褶蕾丝吊带', thumb: '96 160 108 140',
    render(F) {
      const d = tankD({ top: 196, strapX: 129, e: 2.2, hem: 290, hemE: 2.8, dip: 5 });
      const st = 'M 129.2 196.4 L 129.6 170.6';
      const topL = [[150, 201], [140, 197.2], [128.5, 195]];
      return strap(st, F.base, 1.3) + strap(mir(st), F.base, 1.3) + laceRow(topL.slice().reverse().concat(topL.slice(1).map(mx)), 1.5, mix(F.base, '#FFFFFF', .45)) + piece(d, F.fill, {
        folds: fm('M 124 210 Q 138 218 148 232', 'M 124.6 224 Q 136 232 146 246', 'M 125.4 240 Q 135 246 143 260', 'M 124 256 Q 133 262 140 274')
      });
    }
  },
  bardotTop: {
    cat: 'top', name: '露肩条纹袖上衣', thumb: '72 160 156 170',
    render(F) {
      const y1 = 314, sl = offSleeveD({ y0: 184, y1, eo: 2.4, ei: 2 }), cf = cuffD(y1, 5, 2.4, 2);
      const body = symS([[150, 190], [136, 188.6], [124, 187.6], [120, 190.6, 'c'], [sideX(222) - 2.2, 222], [sideX(250) - 2.8, 250], [sideX(280) - 3.4, 280], [sideX(298) - 3.6, 298, 'c'], [150, 300.4]]);
      const yoke = symS([[150, 184.6], [134, 183], [118, 181.4], [108.4, 184.4], [104.8, 191.6, 'c'], [118, 196.2], [134, 197.4], [150, 199]]);
      const bigBtn = `<circle cx="136" cy="226" r="7.4" fill="#E0304F" stroke="${INK}" stroke-width="1.1"/><circle cx="136" cy="226" r="5.2" fill="none" stroke="#B81E3A" stroke-width=".8"/><path d="M 133.6 223.6 L 138.4 228.4 M 138.4 223.6 L 133.6 228.4" stroke="#FFE3E8" stroke-width="1.1" stroke-linecap="round"/><circle cx="133.4" cy="223.4" r="1.2" fill="#fff" opacity=".7"/>`;
      return piece(body, F.fill, { folds: fm('M 127 240 Q 130 256 128 272', 'M 124 282 Q 127 290 126 296'), lines: [{ d: 'M 146 204 L 146 296 M 154 204 L 154 296', c: F.detail, o: .35, w: .7 }] })  + (F.print === 'plain' ? '' : bigBtn) +
        piece(sl, F.sleeve || F.fill, { folds: ['M 94 262 Q 98 268 97 276'] }) + piece(mir(sl), F.sleeve || F.fill, { folds: [mir('M 94 262 Q 98 268 97 276')] }) +
        piece(cf, F.alt, {}) + piece(mir(cf), F.alt, {}) +
        piece(yoke, F.alt, { folds: fm('M 118 186 Q 120 191 119 195', 'M 132 186 Q 133 191 132 196'), lines: [{ d: 'M 106 189 Q 128 193 150 194 Q 172 193 194 189', c: '#fff', w: .8, dash: '1.4 1.2', o: .9 }] }) +
        btn(128, 191.4, '#F7A9C4', 1.8) + btn(121, 190.4, '#F7A9C4', 1.8);
    }
  },
  oversizeSweat: {
    cat: 'top', name: '斜肩宽松大卫衣', thumb: '72 146 156 184',
    render(F) {
      const R = offsetPts(SHOULDER.slice(1), 3.2).map(mx).map(p => [p[0], p[1]]);
      const body = spline([[150, 187], [155.6, 182], [160.6, 167.6], ...R, [189, 212], [300 - sideX(232) + 4.4, 232], [300 - sideX(262) + 5.6, 262], [300 - sideX(282) + 6.8, 282, 'c'], [178, 290], [171, 286.4], [165, 292], [150, 298], [sideX(302) - 6.6, 302, 'c'], [sideX(270) - 5.4, 270], [sideX(236) - 4.2, 236], [121, 216, 'c'], [130, 206], [140.6, 195]]);
      const trim = line([[121, 216], [130, 206], [140.6, 195], [150, 187], [155.6, 182], [160.6, 167.6]]);
      const slR = mir(sleeveD({ y1: 316, puff: 4, eo: 3, ei: 2.6, se: 3.2 })), cfR = mir(cuffD(316, 7, 3.2, 2.6));
      const slL = offSleeveD({ y0: 208, y1: 316, eo: 3, ei: 2.6, puff: 4 }), cfL = cuffD(316, 7, 3.2, 2.6);
      const print = F.print === 'windmill' ? `<circle cx="146" cy="238" r="19" fill="#E0413C" stroke="${INK}" stroke-width="1"/>` + [0, 90, 180, 270].map(a => `<path d="M 146 238 L ${f1(146 + Math.cos((a - 20) * Math.PI / 180) * 17)} ${f1(238 + Math.sin((a - 20) * Math.PI / 180) * 17)} L ${f1(146 + Math.cos((a + 8) * Math.PI / 180) * 10)} ${f1(238 + Math.sin((a + 8) * Math.PI / 180) * 10)} Z" fill="#2E5E3A" stroke="${INK}" stroke-width=".6" stroke-linejoin="round"/>`).join('') + `<circle cx="146" cy="238" r="2" fill="#F4E9D8" stroke="${INK}" stroke-width=".6"/>` : '';
      return strap('M 129.2 170.8 L 128.2 214', 'url(#pat-pinkstripe)', 2.2) + piece(body, F.fill, {
        under: print, folds: ['M 124 252 Q 128 268 125 286', 'M 170 274 Q 164 280 158 294', 'M 176 262 Q 174 274 172 284', 'M 128 216 Q 140 226 152 228', 'M 136 290 Q 140 294 138 300']
      }) + `<path d="${trim}" fill="none" stroke="${F.detail}" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>` + btn(175.6, 283, '#F07FA8', 2.8) +
        piece(slR, F.fill, { folds: [mir('M 99 262 Q 103 270 101 280'), mir('M 94 292 Q 97 298 96 306')] }) + piece(cfR, F.fill, { deep: [cfR] }) +
        piece(slL, F.fill, { folds: ['M 99 262 Q 103 270 101 280', 'M 94 292 Q 97 298 96 306'] }) + piece(cfL, F.fill, { deep: [cfL] });
    }
  },
  tuckBlouse: {
    cat: 'top', name: '泡泡袖领结衬衫', thumb: '84 150 132 150',
    render(F) {
      const body = bodyD({ hem: 286, e: 2.4, hemE: 3, neckY: 171, neckW: 5.6, se: 2.2 });
      const collar = spline([[140.6, 163.2], [135, 166.4], [133.6, 172.4], [140, 176.6], [148.6, 174.4, 'c'], [146, 170], [143, 166]]);
      const bw = F.rib || '#F4A7C0';
      const bow = `<path d="M 150 176 C 142 169 135.6 171 136.4 177 C 137 182 143 181.6 150 178.6 C 157 181.6 163 182 163.6 177 C 164.4 171 158 169 150 176 Z" fill="${bw}" stroke="${INK}" stroke-width=".9"/><path d="M 148.6 178 L 141.4 214 L 145.6 211.4 L 147.4 215.4 Z M 151.4 178 L 157.6 212 L 153.6 209.6 L 152.2 213.4 Z" fill="${bw}" stroke="${INK}" stroke-width=".8"/><ellipse cx="150" cy="177" rx="2.3" ry="2.7" fill="${bw}" stroke="${INK}" stroke-width=".8"/><path d="M 140 174.6 Q 142 172.6 145 173.4" stroke="#fff" stroke-width=".8" fill="none" opacity=".8"/>`;
      return piece(body, F.fill, { folds: fm('M 127 238 Q 130 252 128 266'), lines: [{ d: 'M 150 180 L 150 286', o: .45 }, { d: 'M 139.6 186 L 138.6 244 M 143.8 184 L 143.4 246 M 160.4 186 L 161.4 244 M 156.2 184 L 156.6 246', o: .3, w: .7 }] }) +
        [194, 210, 226, 242, 258, 274].map(y => btn(150, y, '#fff', 1.2)).join('') +
        piece(PUFF_SL, F.alt, { folds: PUFF_G }) + piece(mir(PUFF_SL), F.alt, { folds: PUFF_G.map(mir) }) + piece(puffBand(), F.alt, { rim: false }) + piece(mir(puffBand()), F.alt, { rim: false }) +
        piece(collar, F.alt, {}) + piece(mir(collar), F.alt, {}) + bow;
    }
  },
  cropTee: {
    cat: 'top', name: '短款条纹T恤', thumb: '84 150 132 120',
    render(F) {
      const body = bodyD({ hem: 252, e: 2.4, hemE: 2.4, neckY: 171.5, neckW: 7, se: 2.2, curve: 1 });
      const neck = spline([[137.4, 163.2, 'c'], [150, 169.4], [162.6, 163.2, 'c'], [163.6, 166.6, 'c'], [150, 174.2], [136.4, 166.6, 'c']]);
      return piece(body, F.fill, { folds: fm('M 128 222 Q 130 234 129 246') }) + piece(TEE_SL, F.fill, { folds: ['M 104 204 Q 108 208 110 214'] }) + piece(mir(TEE_SL), F.fill, { folds: [mir('M 104 204 Q 108 208 110 214')] }) + piece(neck, F.rib || F.alt, { rim: false });
    }
  },

  /* ---------------- 外套 ---------------- */
  cropCardi: {
    cat: 'outer', name: '毛绒短开衫', thumb: '72 146 156 180',
    render(F) {
      const y1 = 318, sl = sleeveD({ y1, puff: 4.4, eo: 3.6, ei: 3, se: 3.4, inPuff: .5 }), cf = cuffD(y1, 9, 3.8, 3);
      const panel = openPanel(262, 13, 5);
      const band = 'M 139.6 170 C 138.8 196 137.4 230 137.2 262';
      const hem = spline([[sideX(254) - 5.6, 254, 'c'], [137.8, 256, 'c'], [137, 264.4, 'c'], [sideX(262) - 6.2, 262.4, 'c']]);
      const pO = { folds: ['M 121 222 Q 125 236 123 250'], lines: [{ d: band, c: F.rib || F.detail, w: 3, o: .7 }] };
      const sO = { folds: ['M 99 262 Q 103 270 101 280', 'M 94 292 Q 97 298 96 306', 'M 105 236 Q 108 242 107 250'] };
      return piece(panel, F.fill, pO) + piece(mir(panel), F.fill, { ...pO, folds: pO.folds.map(mir), lines: pO.lines.map(l => ({ ...l, d: mir(l.d) })) }) +
        piece(hem, F.rib || F.fill, { lines: [{ d: ribLines(108, 138, 254, 264, 2.8), o: .4, w: .7 }] }) + piece(mir(hem), F.rib || F.fill, { lines: [{ d: mir(ribLines(108, 138, 254, 264, 2.8)), o: .4, w: .7 }] }) +
        [200, 220, 240].map(y => btn(137.6, y, '#E6C56A', 1.6)).join('') +
        piece(sl, F.fill, sO) + piece(mir(sl), F.fill, { ...sO, folds: sO.folds.map(mir) }) +
        piece(cf, F.rib || F.fill, { lines: [{ d: ribLines(armO(309) - 3.8, armI(309) + 3, 309, 318.5, 2.6, -.6), o: .4, w: .7 }] }) + piece(mir(cf), F.rib || F.fill, { lines: [{ d: mir(ribLines(armO(309) - 3.8, armI(309) + 3, 309, 318.5, 2.6, -.6)), o: .4, w: .7 }] });
    }
  },
  meshShrug: {
    cat: 'outer', name: '网纱罩衫', thumb: '72 150 156 176',
    render(F) {
      const y1 = 312, sl = sleeveD({ y1, eo: 1.6, ei: 1.4, se: 1.4 });
      const yoke = spline([...offsetPts(SHOULDER, 1.4).map(p => [p[0], p[1]]), [109, 214], [121.2, 214, 'c'], [124.4, 196], [128.6, 180], [136.4, 172.4], [140.6, 168.6, 'c']]);
      const edge = line([[140.2, 166], [134, 172], [127, 182], [123, 198], [121, 216]]);
      const mo = { rim: false, sw: 1.1 };
      return piece(yoke, F.alt, mo) + piece(mir(yoke), F.alt, mo) + piece(sl, F.alt, mo) + piece(mir(sl), F.alt, mo) +
        strap(edge, F.fill, 1.4) + strap(mir(edge), F.fill, 1.4) + piece(cuffD(y1, 3.4, 1.6, 1.4), F.fill, { rim: false }) + piece(mir(cuffD(y1, 3.4, 1.6, 1.4)), F.fill, { rim: false });
    }
  },
  bomber: {
    cat: 'outer', name: '罗纹棒球外套', thumb: '66 140 168 190',
    render(F) {
      const y1 = 318, puff = 6.4, sl = sleeveD({ y1, puff, eo: 4.2, ei: 3.8, se: 4.2, inPuff: .5 }), cf = cuffD(y1, 11, 4.4, 3.8);
      const body = bodyD({ hem: 300, e: 5, hemE: 6, neckY: 192, neckW: 2.6, se: 4, flare: 1 });
      const hem = hemBandD(300, 11, 6, 1.6, 1);
      const collar = spline([[139.8, 162.4], [150, 166.4], [160.2, 162.4], [163.6, 166.4, 'c'], [155, 180], [151.4, 193, 'c'], [148.6, 193, 'c'], [145, 180], [136.4, 166.4, 'c']]);
      const patch = `<path d="${heartD(171, 220, 7.6)}" fill="#F48FB1" stroke="${INK}" stroke-width="1"/><path d="${heartD(171, 220, 5.8)}" fill="none" stroke="#fff" stroke-width=".8" stroke-dasharray="1.2 1"/><path d="M 160 232 L 184 208" stroke="#7FCBE3" stroke-width="1.4" stroke-linecap="round"/><path d="M 181 208 L 185 207 L 184 211" fill="none" stroke="#7FCBE3" stroke-width="1.3" stroke-linecap="round"/>`;
      const sO = { folds: ['M 97 262 Q 101 270 99 280', 'M 92 292 Q 95 298 94 306', 'M 104 236 Q 107 242 106 250'] };
      return piece(body, F.fill, { under: patch, folds: fm('M 125 236 Q 128 250 126 266', 'M 122 276 Q 125 284 124 292'), lines: [{ d: 'M 150 192 L 150 300', o: .55 }, { d: 'M 120 244 L 128 270', o: .6 }, { d: mir('M 120 244 L 128 270'), o: .6 }] }) +
        [206, 224, 242, 260, 278].map(y => btn(150, y, '#FBF6E8', 1.5)).join('') +
        piece(hem, F.rib, { lines: [{ d: ribLines(100, 200, 290, 301.5, 3.1), o: .3, w: .7 }] }) +
        piece(sl, F.fill, sO) + piece(mir(sl), F.fill, { ...sO, folds: sO.folds.map(mir) }) +
        piece(cf, F.rib, { lines: [{ d: ribLines(armO(308) - 4.4, armI(308) + 3.8, 308, 318.5, 2.6, -.6), o: .3, w: .7 }] }) + piece(mir(cf), F.rib, {}) +
        piece(collar, F.rib, { lines: [{ d: 'M 140 165 Q 150 170 160 165', o: .35 }] });
    }
  },
  collarJacket: {
    cat: 'outer', name: '大翻领短袖外套', thumb: '66 140 168 176',
    render(F) {
      const panel = openPanel(296, 10, 5.4);
      const slv = spline([[123.6, 169.8], [111.4, 170.2], [103.6, 175.2], [99, 185], [98, 198], [100.4, 210], [104.4, 218.4, 'c'], [121, 223.6, 'c'], [123.2, 210], [124.6, 190]]);
      const cuff = spline([[armO(216) - 2.6, 215.2, 'c'], [armI(222) + 2.6, 221, 'c'], [armI(227) + 2.6, 226.4, 'c'], [armO(221) - 2.8, 220.6, 'c']]);
      const collar = spline([[141.8, 162.6], [134, 165.4], [124.4, 168.6], [116.4, 176], [112, 188.4, 'c'], [124, 188.6], [133.4, 196.6], [139.4, 206, 'c'], [140.6, 190], [141.6, 175]]);
      const flap = spline([[114.4, 258, 'c'], [132.6, 259.4, 'c'], [132.4, 267, 'c'], [114.2, 265.8, 'c']]);
      const pO = { folds: ['M 121 222 Q 125 238 123 254', 'M 128 272 Q 131 282 129 292'], lines: [{ d: 'M 139.8 210 L 139.6 296', c: F.detail, o: .5 }] };
      return piece(panel, F.fill, pO) + piece(mir(panel), F.fill, { ...pO, folds: pO.folds.map(mir), lines: pO.lines.map(l => ({ ...l, d: mir(l.d) })) }) +
        piece(flap, F.fill, { deep: [flap] }) + piece(mir(flap), F.fill, { deep: [mir(flap)] }) + btn(123.4, 262.4, F.detail, 1.4) + btn(176.6, 262.4, F.detail, 1.4) +
        [216, 236, 256].map(y => btn(136.2, y, '#F2E6D2', 1.9)).join('') +
        piece(slv, F.fill, { folds: PUFF_G }) + piece(mir(slv), F.fill, { folds: PUFF_G.map(mir) }) + piece(cuff, F.fill, { deep: [cuff] }) + piece(mir(cuff), F.fill, { deep: [mir(cuff)] }) +
        piece(collar, F.alt || F.fill, { lit: [1.2, 1.2], litOp: .45 }) + piece(mir(collar), F.alt || F.fill, { lit: [1.2, 1.2], litOp: .45 });
    }
  },
  zipHoodieOpen: {
    cat: 'outer', name: '开襟连帽外套', thumb: '66 136 168 190',
    back: F => hoodBack(F.fill),
    render(F) {
      const y1 = 318, sl = sleeveD({ y1, puff: 3.6, eo: 3.6, ei: 3.2, se: 3.8, inPuff: .45 }), cf = cuffD(y1, 9, 3.8, 3.2);
      const panel = openPanel(300, 9, 5.8, 142.2);
      const hem = spline([[sideX(292) - 7, 292, 'c'], [140.8, 293.6, 'c'], [140.8, 302.4, 'c'], [sideX(300) - 7.2, 300.4, 'c']]);
      const zip = 'M 141.2 176 L 141 300';
      const pO = { folds: ['M 121 222 Q 125 238 123 256', 'M 128 262 Q 131 276 129 288'], lines: [{ d: zip, c: '#D8DDE4', w: 1.6, dash: '.9 .9', o: .9 }] };
      const sO = { folds: ['M 98 262 Q 102 270 100 280', 'M 93 292 Q 96 298 95 306', 'M 104 236 Q 107 242 106 250'] };
      return piece(panel, F.fill, pO) + piece(mir(panel), F.fill, { ...pO, folds: pO.folds.map(mir), lines: pO.lines.map(l => ({ ...l, d: mir(l.d) })) }) +
        piece(hem, F.rib || F.fill, { lines: [{ d: ribLines(106, 141, 292, 302, 2.8), o: .35, w: .7 }] }) + piece(mir(hem), F.rib || F.fill, { lines: [{ d: mir(ribLines(106, 141, 292, 302, 2.8)), o: .35, w: .7 }] }) +
        piece(sl, F.sleeve || F.fill, sO) + piece(mir(sl), F.sleeve || F.fill, { ...sO, folds: sO.folds.map(mir) }) + piece(cf, F.rib || F.fill, { deep: [cf] }) + piece(mir(cf), F.rib || F.fill, { deep: [mir(cf)] }) +
        piece(hoodRimL, F.fill, { deep: ['M 141 161 L 146 180 L 150 184 L 150 160 Z'] }) + piece(mir(hoodRimL), F.fill, { deep: [mir('M 141 161 L 146 180 L 150 184 L 150 160 Z')] }) +
        cordD(144.2, 143, '#F48FB1') + cordD(155.8, 157, '#F48FB1');
    }
  },

  /* ---------------- 下装 ---------------- */
  aMini: {
    cat: 'bottom', name: 'A字短裙', thumb: '90 262 120 90',
    render(F) {
      const d = skirtD({ top: 272, dip: 2.4, e: 2.4, hem: 338, flare: 14, hipY: 300, curve: 3.6 });
      const wb = bandD(272, 6.6, 2.4, 2.4, 2.6);
      return piece(d, F.fill, { folds: fm('M 126 300 Q 123 318 118 334', 'M 140 304 Q 140 322 138 338') }) + piece(wb, F.fill, { deep: [wb] });
    }
  },
  tierPleat: {
    cat: 'bottom', name: '拼层百褶短裙', thumb: '86 272 128 84',
    render(F) {
      const up = skirtD({ top: 282, dip: 3.6, e: 2.6, hem: 318, flare: 9, hipY: 300, curve: 2.6 });
      const low = symS([[150, 316], [outerX(300) - 2.6 - 9, 314.4, 'c'], [outerX(300) - 2.6 - 22, 344, 'c'], [150, 348.6]]);
      const wb = bandD(282, 7, 3.6, 2.6, 2.8);
      const pl = (y0, y1, x0, x1, n) => Array.from({ length: n - 1 }, (_, i) => { const t = (i + 1) / n; return { fade: 1, d: `M ${f1(x0 + (300 - 2 * x0) * t)} ${y0} L ${f1(x1 + (300 - 2 * x1) * t)} ${y1}`, o: .7, w: .85 }; });
      const sh = (y0, y1, x0, x1, n) => Array.from({ length: n }, (_, i) => { const a = i / n, b = (i + 1) / n, m = (a + b) / 2; return `M ${f1(x0 + (300 - 2 * x0) * m)} ${y0} L ${f1(x0 + (300 - 2 * x0) * b)} ${y0} L ${f1(x1 + (300 - 2 * x1) * b)} ${y1} L ${f1(x1 + (300 - 2 * x1) * m)} ${y1} Z`; });
      const x0 = outerX(290) - 2.6, x1 = outerX(300) - 11.6, x2 = outerX(300) - 24.6;
      return piece(low, F.fill, { lines: pl(316, 347, x1, x2, 14), shade: sh(316, 347, x1, x2, 14), rim: [3, 1.5] }) +
        piece(up, F.fill, { lines: pl(290, 318, x0, x1, 10), shade: sh(290, 318, x0, x1, 10), rim: [3, 1.5] }) + piece(wb, F.fill, {});
    }
  },
  sashPants: {
    cat: 'bottom', name: '系巾阔腿裤', thumb: '84 270 132 316',
    render(F) {
      const sash = spline([[112.4, 286, 'c'], [150, 292.6], [187.6, 286, 'c'], [187.2, 294, 'c'], [150, 301], [112.6, 294, 'c']]);
      const knot = `<ellipse cx="121" cy="296" rx="5" ry="4.4" fill="${F.rib}" stroke="${INK}" stroke-width="1"/>`;
      const t1 = spline([[118, 298], [114.6, 316], [111, 338, 'c'], [116.6, 336], [119.6, 341, 'c'], [120.6, 318], [123.4, 299]]), t2 = spline([[121.6, 299], [124, 318], [127.6, 334, 'c'], [131, 330], [133.4, 332, 'c'], [129, 316], [125, 298]]);
      const fr = (x, y) => `M ${x} ${y} l -.4 3.4 M ${x + 2} ${y + .4} l -.2 3.4 M ${x + 4} ${y + .6} l 0 3.2`;
      return TPL.widePants.render(F) + piece(sash, F.rib, { folds: ['M 120 290 Q 135 296 150 297', 'M 180 290 Q 165 296 150 297'] }) +
        piece(t1, F.rib, {}) + piece(t2, F.rib, {}) + knot + `<path d="${fr(111.6, 338)} ${fr(127.8, 332)}" stroke="${INK}" stroke-width=".8" stroke-linecap="round"/>`;
    }
  },
  denimMini: {
    cat: 'bottom', name: '低腰牛仔短裙', thumb: '90 280 120 64',
    render(F) {
      const d = skirtD({ top: 289, dip: 3.4, e: 2.8, hem: 330, flare: 6, hipY: 306, curve: 2.4 });
      const wb = bandD(289, 6, 3.4, 2.8, 2.9);
      const belt = spline([[outerX(292) - 3.6, 291.4, 'c'], [150, 297.4], [300 - outerX(292) + 3.6, 291.4, 'c'], [300 - outerX(297) + 3.8, 296.8, 'c'], [150, 302.6], [outerX(297) - 3.8, 296.8, 'c']]);
      const studs = rng(113, 187, 18).map(x => { const y = 297 + 3 * (1 - Math.pow((x - 150) / 38, 2)); return `<circle cx="${f1(x)}" cy="${f1(y)}" r="1" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".4"/>`; }).join('');
      const fray = rng(106, 194, 30).map(x => { const y = 330 + 2.4 * (1 - Math.pow((x - 150) / 44, 2)); return `M ${f1(x)} ${f1(y - 1)} l ${f1((x % 3) - 1)} 3`; }).join(' ');
      return piece(d, F.fill, { sheen: ['M 132 306 Q 150 310 168 306'], sheenOp: .55, sheenW: 7, folds: fm('M 128 308 Q 126 318 124 328'), lines: [{ d: FLY, c: F.stitch, dash: '1.8 1.4', o: .9 }, { d: POCKET, c: F.stitch, dash: '1.8 1.4', o: .9 }, { d: mir(POCKET), c: F.stitch, dash: '1.8 1.4', o: .9 }, { d: 'M 108 322 Q 150 330 192 322', c: '#EEF5FB', w: 1.2, dash: '4 2', o: .8 }] }) +
        `<path d="${fray}" stroke="#F2F7FC" stroke-width="1" stroke-linecap="round"/>` + piece(wb, F.fill, {}) + piece(belt, '#6E4A35', { rim: false }) + studs;
    }
  },
  skirtJeans: {
    cat: 'bottom', name: '纱裙叠穿阔腿牛仔', thumb: '84 270 132 316',
    render(F) {
      const ease = y => 6 + Math.max(0, y - 316) * .045 + Math.max(0, y - 480) * .05, inE = y => 4.4 + Math.max(0, y - 350) * .03;
      const jeans = pantsD({ top: 290, hem: 577, ease, inE });
      const stack = fm('M 106 532 Q 120 540 140 534', 'M 105 546 Q 120 553 142 547', 'M 105 560 Q 120 566 143 561', 'M 112 440 Q 118 470 112 500', 'M 138 420 Q 142 450 140 480');
      const sk = skirtD({ top: 282, dip: 3.4, e: 3, hem: 352, flare: 21, hipY: 300, curve: 3.8 });
      const sc = []; const x0 = outerX(300) - 24, n = 11;
      for (let i = 0; i < n; i++) { const xa = x0 + (300 - 2 * x0) * i / n, xb = x0 + (300 - 2 * x0) * (i + 1) / n, y = 352 + 3.8 * (1 - Math.pow(((xa + xb) / 2 - 150) / (150 - x0), 2)); sc.push(`M ${f1(xa)} ${f1(y - 1)} Q ${f1((xa + xb) / 2)} ${f1(y + 5)} ${f1(xb)} ${f1(y - 1)}`); }
      const wb = bandD(282, 6.4, 3.4, 3, 3.1);
      return piece(jeans, 'url(#pat-denim)', { folds: stack, lines: [{ d: 'M 128 360 L 126 580', c: '#F0B24A', dash: '2 1.6', o: .6 }, { d: mir('M 128 360 L 126 580'), c: '#F0B24A', dash: '2 1.6', o: .6 }] }) +
        `<path d="${sc.join(' ')}" fill="${F.fill}" stroke="${INK}" stroke-width="1"/>` +
        piece(sk, F.fill, { folds: fm('M 126 300 Q 121 324 114 350', 'M 138 302 Q 137 326 134 352', 'M 118 296 Q 112 318 104 346') }) + piece(wb, F.alt || F.fill, { deep: [wb] });
    }
  },
  longPleat: {
    cat: 'bottom', name: '长款百褶裙', thumb: '72 272 156 210',
    render(F) {
      const hem = 466, flare = 26;
      const d = skirtD({ top: 282, hem, flare, e: 2.6, hipY: 300, curve: 4 });
      const wb = bandD(282, 7.4, 3.6, 2.6, 2.8);
      const N = 14, lines = [], shade = [];
      const xT = i => outerX(289) - 2.8 + (150 - outerX(289) + 2.8) * 2 * i / N, xB = i => outerX(300) - 2.6 - flare + (150 - outerX(300) + 2.6 + flare) * 2 * i / N;
      for (let i = 1; i < N; i++) lines.push({ d: `M ${f1(xT(i))} 290 L ${f1(xB(i))} ${hem + 2}`, o: .6, w: .85, fade: 1 });
      for (let i = 0; i < N; i++) shade.push(`M ${f1(xT(i) + (xT(i + 1) - xT(i)) * .55)} 289 L ${f1(xT(i + 1))} 289 L ${f1(xB(i + 1))} ${hem + 8} L ${f1(xB(i) + (xB(i + 1) - xB(i)) * .5)} ${hem + 8} Z`);
      const x0 = outerX(300) - 2.6 - flare, frill = [];
      const nn = 18; for (let i = 0; i < nn; i++) { const xa = x0 + (300 - 2 * x0) * i / nn, xb = x0 + (300 - 2 * x0) * (i + 1) / nn, y = hem + 4 * (1 - Math.pow(((xa + xb) / 2 - 150) / (150 - x0), 2)); frill.push(`M ${f1(xa)} ${f1(y - 2)} Q ${f1((xa + xb) / 2)} ${f1(y + 6)} ${f1(xb)} ${f1(y - 2)}`); }
      return `<path d="${frill.join(' ')}" fill="${F.rib || '#7A5646'}" stroke="${INK}" stroke-width=".9"/>` + piece(d, F.fill, { shade, lines, rim: [3, 1.5] }) + piece(wb, F.fill, {});
    }
  },
  beltShorts: {
    cat: 'bottom', name: '宽腰带短裤', thumb: '90 276 120 110',
    render(F) {
      const d = pantsD({ top: 284, hem: 336, ease: y => 3 + (y - 284) * .045, inE: () => 2.2 });
      const belt = bandD(283.4, 8, 4, 3.4, 3.5), bc = F.rib || '#F28BB0';
      const tail = spline([[158, 294], [162, 312], [166.4, 344], [168.4, 356, 'c'], [172.6, 354.6, 'c'], [171, 342], [166, 310], [163, 293]]);
      return piece(d, F.fill, { folds: fm('M 124 312 Q 128 320 127 328', 'M 141 318 Q 145 324 147 330'), lines: [{ d: FLY, o: .55 }] }) +
        piece(tail, bc, {}) + `<circle cx="167.6" cy="351" r="1" fill="#fff" stroke="${INK}" stroke-width=".5"/>` +
        piece(belt, bc, { gloss: ['M 118 288 Q 132 291.4 142 292'], glossOp: .5 }) +
        `<circle cx="150" cy="291.6" r="6.2" fill="none" stroke="${INK}" stroke-width="3.8"/><circle cx="150" cy="291.6" r="6.2" fill="none" stroke="${mix(bc, '#FFFFFF', .35)}" stroke-width="2.2"/><path d="M 145.8 288.4 A 5 5 0 0 1 150 286.4" stroke="#fff" stroke-width=".8" fill="none"/>`;
    }
  },

  /* ---------------- 连衣裙 ---------------- */
  dotTunic: {
    cat: 'dress', name: '波点腰带连衣裙', thumb: '72 150 156 210',
    render(F) {
      const bod = bodyD({ hem: 252, e: 2.8, hemE: 3, neckY: 171.5, neckW: 7, se: 2.4 });
      const sk = skirtD({ top: 246, dip: 2, e: 3, hem: 354, flare: 18, hipY: 302, curve: 3.6 });
      const col = spline([[137.4, 164], [131, 168.4], [128.6, 176], [133, 184.4], [141.4, 186.6], [148.4, 180.4, 'c'], [145.4, 173], [141, 166.6]]);
      const belt = spline([[sideX(246) - 3.6, 245, 'c'], [150, 247], [300 - sideX(246) + 3.6, 245, 'c'], [300 - sideX(258) + 3.8, 257, 'c'], [150, 259.4], [sideX(258) - 3.8, 257, 'c']]), bc = F.rib || '#F28BB0';
      return piece(sk, F.fill, { folds: fm('M 126 272 Q 123 300 116 336', 'M 140 276 Q 140 306 137 346') }) +
        piece(bod, F.fill, { folds: fm('M 128 214 Q 131 228 129 240') }) + piece(TEE_SL, F.fill, { folds: ['M 104 204 Q 108 208 110 214'] }) + piece(mir(TEE_SL), F.fill, { folds: [mir('M 104 204 Q 108 208 110 214')] }) +
        piece(belt, bc, { gloss: ['M 118 249 Q 132 251.4 142 252'], glossOp: .5 }) + `<rect x="143.6" y="246.4" width="12.8" height="12.4" rx="6" fill="none" stroke="${INK}" stroke-width="3.6"/><rect x="143.6" y="246.4" width="12.8" height="12.4" rx="6" fill="none" stroke="${mix(bc, '#FFFFFF', .4)}" stroke-width="2"/>` +
        piece(col, F.alt || '#fff', { lit: [1, 1], litOp: .5 }) + piece(mir(col), F.alt || '#fff', { lit: [1, 1], litOp: .5 });
    }
  },
  yokeDress: {
    cat: 'dress', name: '网纱拼接A字连衣裙', thumb: '72 150 156 210',
    render(F) {
      const yoke = symS([[150, 180.4], [143, 179], [139.4, 172], [138.8, 165.2], ...offsetPts(SHOULDER.slice(1), 2).map(p => [p[0], p[1]]), [armO(206) - 2.6, 206], [armO(214) - 2.8, 214, 'c'], [armI(221) + 2, 221, 'c'], [122.8, 207], [125.6, 202.4], [131, 200.4], [139, 200.6], [145.6, 203.4], [150, 207.4]]);
      const sheer = 'rgba(255,255,255,.66)';
      const bod = symS([[150, 207.4], [145.6, 203.4], [139, 200.6], [131, 200.4], [125.4, 202.6], [122.8, 206.4, 'c'], [sideX(222) - 1.8, 222], [sideX(238) - 2, 238], [sideX(252) - 2.2, 252, 'c'], [150, 254]]);
      const wb = symS([[150, 252.4], [sideX(251) - 2.2, 250.6, 'c'], [sideX(259) - 2.3, 259, 'c'], [150, 260.6]]);
      const sk = skirtD({ top: 257, dip: 2, e: 2.6, hem: 344, flare: 15, hipY: 302, curve: 3.4 });
      const tab = 'M 134 202 L 150 210 L 146.4 215 Z', tabR = mir(tab);
      return piece(sk, F.fill, { folds: fm('M 132 262 L 126 340', 'M 142 262 L 140 344', 'M 124 264 Q 118 300 112 334'), lines: [{ d: 'M 150 262 L 150 348', o: .45 }] }) +
        piece(bod, F.fill, { folds: fm('M 130 214 Q 134 228 132 244') }) + piece(wb, F.fill, { deep: [wb] }) +
        piece(tab, F.fill, { rim: false, lit: [.8, .8], litOp: .5 }) + piece(tabR, F.fill, { rim: false, lit: [.8, .8], litOp: .5 }) +
        piece(yoke, sheer, { rim: false, sw: 1.05, folds: fm('M 131 172 Q 134 184 132 196', 'M 118 176 Q 120 186 118 196'), foldOp: .35 });
    }
  }
});
