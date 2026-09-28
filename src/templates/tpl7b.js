/* ---------------- 下装 / 连衣裙 版型（沿腿部轮廓生成） ---------------- */
const outerX = y => (y >= 220 && y <= 576 ? silO(y) : y < 315 ? torsoL(y) : legO(y));
/* 长裤裤脚落在脚背上（露出鞋头），不再一直拖到鞋底 */
const PANT_HEM = 567;
/* 裤子：top 腰线（低腰），hem 裤脚；ease(y) 外扩量；inE 内侧外扩；crotch 裆点 */
function pantsD(o = {}) {
  const { top = 282, dip = 4, crotch = 327, ease = () => 2.6, inE = () => 2 } = o, hem = Math.min(o.hem ?? 575, PANT_HEM);
  const pts = [[150, top + dip], [outerX(top) - ease(top), top, 'c']];
  rng(top + 8, hem - 7, Math.max(2, Math.round((hem - top - 15) / 11))).forEach(y => pts.push([outerX(y) - ease(y), y]));
  const xo = outerX(hem) - ease(hem), xi = Math.min(149.4, legID(hem) + inE(hem));
  pts.push([xo, hem, 'c']); pts.push([xo + (xi - xo) * .45, hem + 2.4]);   // 裤脚搭在鞋面上，中间微微下垂
  pts.push([xi, hem + .8, 'c']);
  rng(hem - 9, crotch + 7, Math.max(2, Math.round((hem - crotch - 16) / 12))).forEach(y => pts.push([Math.min(149.3, legID(y) + inE(y)), y]));
  pts.push([150, crotch]);
  return symS(pts);
}
function bandD(top, h, dip, e = 2.6, e2 = e) {
  return symS([[150, top + dip], [outerX(top) - e, top, 'c'], [outerX(top + h) - e2, top + h, 'c'], [150, top + h + dip]]);
}
/* 裤脚翻边（左腿） */
function legCuffD(y0, y1, eo, ei, eo1 = eo, ei1 = ei) {
  return spline([[outerX(y0) - eo, y0, 'c'], [Math.min(149.3, legID(y0) + ei), y0 + .6, 'c'], [Math.min(149.3, legID(y1) + ei1), y1 + .8, 'c'], [outerX(y1) - eo1, y1, 'c']]);
}
function skirtD(o = {}) {
  const { top = 282, dip = 3.6, e = 2.6, hem = 334, flare = 16, curve = 3.4, hipY = 300 } = o;
  const pts = [[150, top + dip], [outerX(top) - e, top, 'c'], [outerX(top + 9) - e - .3, top + 9], [outerX(hipY) - e - flare * .2, hipY]];
  const xh = outerX(hipY) - e - flare;
  pts.push([xh, hem, 'c']); hemWave(pts, xh, hem, curve, 1.2);
  pts.push([150, hem + curve]);
  return symS(pts);
}
/* 口袋弧线 / 门襟 J 线 */
const POCKET = 'M 118.4 290.6 C 124 293 127.6 298 128.6 305';
const FLY = 'M 150 291 L 150 311 M 150 291 C 155.4 297 156 306 151.6 312';

Object.assign(TPL, {
  shorts: {
    cat: 'bottom', name: '卷边短裤', thumb: '96 270 108 90',
    render(F) {
      const d = pantsD({ top: 283, hem: 340, ease: y => 2.8 + (y - 283) * .03, inE: () => 2.2 });
      const cuff = legCuffD(331, 342, 5, 1.6, 5.6, 1.4);
      const band = bandD(283, 7.4, 4, 2.8, 3);
      const belt = bandD(284.2, 5.6, 4, 3.2, 3.2);
      const loops = [117, 131.5, 168.5, 183].map(x => `<rect x="${x - 1.4}" y="${f1(283 + (Math.abs(150 - x) < 25 ? 3 : 1.4))}" width="2.8" height="8.4" rx=".8" fill="${F.fill}" stroke="${INK}" stroke-width=".8"/>`).join('');
      const buckle = `<rect x="143.2" y="286.4" width="13.6" height="8.6" rx="1.8" fill="url(#grad-chrome)" stroke="${INK}" stroke-width="1"/><rect x="145.8" y="288.4" width="8.4" height="4.6" rx="1" fill="none" stroke="#fff" stroke-width=".8" opacity=".8"/>`;
      const st = F.stitch;
      return piece(d, F.fill, {
        folds: fm('M 124 312 Q 128 320 127 328', 'M 141 318 Q 145 324 147 330', 'M 116 300 Q 119 306 118 314'),
        lines: [{ d: POCKET, c: st, dash: '1.8 1.4', o: .95 }, { d: mir(POCKET), c: st, dash: '1.8 1.4', o: .95 }, { d: FLY, c: st, dash: '1.8 1.4', o: .95 }, { d: 'M 119.6 293.4 C 125 295.6 128.8 300.6 129.8 307.4', o: .55 }, { d: mir('M 119.6 293.4 C 125 295.6 128.8 300.6 129.8 307.4'), o: .55 }]
      }) + piece(cuff, F.fill, { deep: [cuff], lines: [{ d: `M ${f1(outerX(336.5) - 5.2)} 336.5 Q 129 339 ${f1(legI(337) + 1.5)} 337.2`, o: .5 }, { d: `M ${f1(outerX(332.5) - 5)} 333.8 Q 129 336 ${f1(legI(333) + 1.6)} 334.3`, c: st, dash: '1.8 1.4', o: .9 }] }) +
        piece(mir(cuff), F.fill, { deep: [mir(cuff)], lines: [{ d: mir(`M ${f1(outerX(336.5) - 5.2)} 336.5 Q 129 339 ${f1(legI(337) + 1.5)} 337.2`), o: .5 }, { d: mir(`M ${f1(outerX(332.5) - 5)} 333.8 Q 129 336 ${f1(legI(333) + 1.6)} 334.3`), c: st, dash: '1.8 1.4', o: .9 }] }) +
        piece(band, F.fill, {}) + piece(belt, '#7A5238', { rim: false, gloss: ['M 118 287.6 Q 130 290 140 291'], glossOp: .45, lines: [{ d: 'M 117 286.8 Q 132 289.6 142 290.2 M 158 290.2 Q 168 289.6 183 286.8', c: '#C99B6E', dash: '1.2 1.2', w: .6, o: .9 }] }) + loops + buckle;
    }
  },
  capris: {
    cat: 'bottom', name: '七分工装裤', thumb: '84 270 132 220',
    render(F) {
      const hem = 470, ease = y => 3.4 + Math.max(0, (y - 300)) * .035 + (y > 440 ? (y - 440) * .03 : 0);
      const d = pantsD({ top: 282, hem, ease, inE: y => 2.4 + Math.max(0, y - 340) * .012 });
      const cuff = legCuffD(hem - 13, hem, ease(hem - 13) + 1.2, 3.3, ease(hem) + .6, 3.2);
      const band = bandD(282, 7, 4, 3.4, 3.5);
      const belt = bandD(283, 5.6, 4, 3.8, 3.8);
      const pk = spline([[legO(372) - 6.6, 370, 'c'], [legO(372) + 9.8, 369, 'c'], [legO(404) + 9.8, 404, 'c'], [legO(406) - 6.4, 405.6, 'c']]);
      const flap = spline([[legO(366) - 7.4, 364, 'c'], [legO(366) + 10.6, 363, 'c'], [legO(374) + 10.6, 374, 'c'], [legO(375) - 7.2, 375.4, 'c']]);
      const tail = 'M 176 285 C 179 296 181.5 312 181.8 330 L 186.2 330 C 186 312 184 296 181 285 Z';
      const tabs = `<path d="M ${f1(outerX(452) - ease(452) - .2)} 452 L ${f1(outerX(452) - ease(452) + 6)} 452.5 L ${f1(outerX(457) - ease(457) + 6)} 457.5 L ${f1(outerX(457) - ease(457) - .2)} 457" fill="${F.fill}" stroke="${INK}" stroke-width=".9"/><circle cx="${f1(outerX(454.6) - ease(454.6) + 3.4)}" cy="454.9" r="1.3" fill="${F.detail}" stroke="${INK}" stroke-width=".6"/>`;
      return piece(d, F.fill, {
        folds: fm('M 120 330 Q 125 340 123 352', 'M 114 420 Q 122 428 134 424', 'M 138 330 Q 143 338 145 350', 'M 132 438 Q 137 446 136 454', 'M 116 440 Q 120 446 119 454'),
        lines: [{ d: FLY, c: F.detail, o: .9 }, { d: POCKET, c: F.detail, o: .8 }, { d: mir(POCKET), c: F.detail, o: .8 }]
      }) + piece(cuff, F.fill, { deep: [cuff], lines: [{ d: gatherPants(hem, ease, 3.3), o: .45, w: .8 }] }) + piece(mir(cuff), F.fill, { deep: [mir(cuff)], lines: [{ d: mir(gatherPants(hem, ease, 3.3)), o: .45, w: .8 }] }) +
        tabs + `<g transform="translate(300 0) scale(-1 1)">${tabs}</g>` +
        piece(pk, F.fill, { lines: [{ d: `M ${f1(legO(380) - 9)} 380 L ${f1(legO(380) + 7.4)} 380`, o: .35 }] }) + piece(mir(pk), F.fill, {}) +
        piece(flap, F.fill, { deep: [flap] }) + piece(mir(flap), F.fill, { deep: [mir(flap)] }) +
        `<circle cx="${f1(legO(370) + 1.6)}" cy="370.8" r="1.4" fill="${F.detail}" stroke="${INK}" stroke-width=".7"/><circle cx="${f1(300 - legO(370) + .8)}" cy="370.8" r="1.4" fill="${F.detail}" stroke="${INK}" stroke-width=".7"/>` +
        piece(band, F.fill, {}) + piece(belt, '#262224', { rim: false, gloss: ['M 118 286.5 Q 130 289 140 289.6'], glossOp: .3 }) + piece(tail, '#262224', { rim: false }) +
        `<rect x="180.8" y="326" width="6.2" height="5" rx="1" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".8"/>` +
        (F.print === 'clover' ? clover(150, 289, 6.2, 4, false) : `<rect x="145.5" y="284.6" width="9" height="7.6" rx="1.2" fill="none" stroke="#C9CDD6" stroke-width="1.6"/>`);
    }
  },
  pleatedMini: {
    cat: 'bottom', name: '百褶短裙', thumb: '80 272 140 90',
    /* 参考图的百褶裙：A 字大摆、下摆随褶子起伏成小锯齿、每道褶一半落在阴影里 */
    render(F) {
      const top = 283, hem = 350, N = 12, xw = outerX(top) - 2.6, xh = outerX(300) - 2.6 - 30;
      const hx = i => xh + (300 - 2 * xh) * i / N, hy = i => hem + 4.6 * (1 - Math.pow(2 * i / N - 1, 2)) + (i % 2 ? 1.1 : 0);
      const wx = i => xw + (300 - 2 * xw) * i / N;
      const hemPts = []; for (let i = 0; i <= N; i++) hemPts.push([hx(i), hy(i), 'c']);
      const side = [[outerX(292) - 2.8, 292], [outerX(302) - 5.4, 304], [lerp(outerX(302) - 5.4, xh, .55), 328]];
      const d = spline([[150, top + 3.6], [xw, top, 'c'], ...side, ...hemPts, ...side.slice().reverse().map(p => [300 - p[0], p[1]]), [300 - xw, top, 'c']]);
      const shade = [], lines = [];
      for (let i = 0; i < N; i++) {
        const a = [lerp(wx(i), wx(i + 1), .5), 290], b = [wx(i + 1), 290], c = [hx(i + 1), hy(i + 1)], e = [lerp(hx(i), hx(i + 1), .5), (hy(i) + hy(i + 1)) / 2 + .8];
        shade.push(`M ${P2(a)} L ${P2(b)} L ${P2(c)} L ${P2(e)} Z`);
        if (i > 0) lines.push({ d: `M ${f1(wx(i))} 291 L ${f1(hx(i))} ${f1(hy(i) - .2)}`, c: mix(baseOf(F.fill) || '#8A7A70', '#2E2024', .7), o: .8, w: .95, fade: 1 });
      }
      const wb = bandD(282, 7.4, 3.6, 2.6, 2.8);
      const pin = F.print === 'pin' ? `<path d="M 168 296 L 177 318" stroke="#B9C0CC" stroke-width="1.6" stroke-linecap="round"/><circle cx="167.5" cy="295" r="2" fill="none" stroke="#B9C0CC" stroke-width="1.2"/><path d="M 172 297 L 180 315" stroke="#B9C0CC" stroke-width="1"/>` : '';
      return piece(d, F.fill, { shade, lines, sc: '#D6B6C2' }) + piece(wb, F.fill, {}) + pin;
    }
  },
  widePants: {
    cat: 'bottom', name: '阔腿裤', thumb: '84 270 132 316',
    render(F) {
      const ease = y => 3 + Math.max(0, y - 320) * .014 + Math.pow(Math.max(0, y - 400) / 178, 1.6) * 17;
      const inE = y => 2.2 + Math.pow(Math.max(0, y - 400) / 178, 1.6) * 11;
      const d = pantsD({ top: 282, hem: 578, ease, inE });
      const wb = bandD(282, 7, 4, 3, 3.1);
      return piece(d, F.fill, {
        folds: fm('M 120 330 Q 125 342 123 356', 'M 110 480 Q 115 510 110 548', 'M 136 470 Q 139 510 137 556', 'M 138 330 Q 143 338 145 350', 'M 124 520 Q 126 544 123 570'),
        lines: [{ d: FLY, c: F.detail, o: .8 }, { d: POCKET, c: F.detail, o: .8 }, { d: mir(POCKET), c: F.detail, o: .8 }]
      }) + piece(wb, F.fill, { lines: [{ d: 'M 131.5 284.4 L 131.5 291.2 M 168.5 284.4 L 168.5 291.2', o: .6 }] });
    }
  },
  cargo: {
    cat: 'bottom', name: '工装裤', thumb: '84 270 132 316',
    render(F) {
      const ease = y => 3.6 + Math.max(0, y - 300) * .014;
      const d = pantsD({ top: 282, hem: 574, ease, inE: y => 2.6 + Math.max(0, y - 340) * .01 });
      const wb = bandD(282, 7, 4, 3.6, 3.7);
      const pk = spline([[legO(392) - 6.8, 390, 'c'], [legO(392) + 10, 389, 'c'], [legO(424) + 10.2, 424, 'c'], [legO(426) - 6.4, 425.6, 'c']]);
      const flap = spline([[legO(385) - 7.4, 384, 'c'], [legO(385) + 10.8, 383, 'c'], [legO(393) + 10.8, 393, 'c'], [legO(394) - 7.2, 394.6, 'c']]);
      const chain = F.print === 'chain' ? Array.from({ length: 12 }, (_, i) => { const t = i / 11, x = 124 + 12 * t - 2, y = 292 + 40 * Math.sin(t * Math.PI) * .9 + 8 * t; return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="2.3" ry="1.5" fill="none" stroke="#9FA6B3" stroke-width="1.2"/>`; }).join('') : '';
      return piece(d, F.fill, {
        folds: fm('M 118 330 Q 123 342 121 356', 'M 114 446 Q 122 452 134 448', 'M 114 480 Q 122 486 134 482', 'M 116 530 Q 121 544 118 560', 'M 138 330 Q 143 338 145 350'),
        lines: [{ d: FLY, c: F.detail, o: .9 }, { d: POCKET, c: F.detail, o: .8 }, { d: mir(POCKET), c: F.detail, o: .8 },
          { d: `M ${f1(outerX(566) - ease(566))} 567 Q 130 571 ${f1(legI(566) + 2.8)} 567.6`, c: F.stitch, dash: '2 1.6', o: .8 }, { d: mir(`M ${f1(outerX(566) - ease(566))} 567 Q 130 571 ${f1(legI(566) + 2.8)} 567.6`), c: F.stitch, dash: '2 1.6', o: .8 }]
      }) + piece(pk, F.fill, { lines: [{ d: `M ${f1(legO(398) - 3.6)} 398 L ${f1(legO(398) - 3.6)} 421 M ${f1(legO(398) + 7)} 398 L ${f1(legO(398) + 7)} 421`, c: F.stitch, dash: '1.8 1.6', o: .8 }] }) + piece(mir(pk), F.fill, {}) +
        piece(flap, F.fill, { deep: [flap] }) + piece(mir(flap), F.fill, { deep: [mir(flap)] }) + piece(wb, F.fill, {}) + chain;
    }
  },
  flareJeans: {
    cat: 'bottom', name: '喇叭裤', thumb: '84 270 132 316',
    render(F) {
      const ease = y => 2.4 + Math.max(0, y - 440) * .1;
      const inE = y => 1.8 + Math.max(0, y - 440) * .075;
      const d = pantsD({ top: 283, hem: 578, ease, inE });
      const wb = bandD(283, 7, 4, 2.4, 2.5);
      const hearts = F.print === 'hearts' ? heart(128, 318, 5, '#F4A3C0', .9) + heart(172, 318, 5, '#F4A3C0', .9) : '';
      const rips = F.print === 'hearts' ? fm('M 122 414 L 134 413 M 122.5 419 L 135 420 M 124 424 L 133 424').map(p => ({ d: p, c: '#F4F1EC', w: 1.4, o: .95 })) : [];
      return piece(d, F.fill, {
        under: hearts,
        folds: fm('M 121 340 Q 126 350 124 362', 'M 122 432 Q 128 436 136 432', 'M 112 520 Q 118 540 114 560', 'M 138 510 Q 141 530 140 556'),
        lines: [...rips, { d: FLY, c: F.stitch, dash: '2 1.6', o: .9 }, { d: POCKET, c: F.stitch, dash: '2 1.6', o: .9 }, { d: mir(POCKET), c: F.stitch, dash: '2 1.6', o: .9 }]
      }) + piece(wb, F.fill, { lines: [{ d: 'M 118 286.6 Q 150 292.6 182 286.6', c: F.stitch, dash: '2 1.6', o: .9 }] });
    }
  },

  /* ---------------- 连衣裙 ---------------- */
  denimDress: {
    cat: 'dress', name: '吊带短裙', thumb: '84 160 132 196',
    render(F) {
      const bod = tankD({ top: 196, strapX: 128.8, e: 2.4, hem: 262, hemE: 3, dip: 5, curve: 2 });
      const sk = skirtD({ top: 258, dip: 2, e: 3, hem: 342, flare: 15, hipY: 302, curve: 3.4 });
      const st = 'M 129 197 L 129.5 170.6';
      const stars = F.print === 'stars' ? star5(137, 222, 5.4, '#FFE27A') + star5(165, 300, 4.6, '#9CD3F5') + star5(128, 318, 5, '#FFE27A') + star5(170, 236, 3.4, '#F7A9C4') : '';
      return strap(st, F.base, 2.2) + strap(mir(st), F.base, 2.2) + piece(sk, F.fill, {
        folds: fm('M 126 292 Q 129 312 124 334', 'M 140 296 Q 142 318 140 340'),
        lines: [{ d: 'M 112 334 Q 150 344 188 334', c: F.stitch, dash: '2 1.6', o: .85 }]
      }) + piece(bod, F.fill, {
        under: stars, folds: fm('M 131 226 Q 134 240 132 254'),
        lines: [{ d: 'M 124.6 201 Q 139 203 150 206 Q 161 203 175.4 201', c: F.stitch, dash: '2 1.6', o: .85 }, { d: 'M 123.6 256 Q 150 262 176.4 256', c: F.stitch, dash: '2 1.6', o: .7 }]
      });
    }
  },
  slipDress: {
    cat: 'dress', name: '缎面吊带裙', thumb: '84 160 132 236',
    render(F) {
      const bod = tankD({ top: 196, strapX: 128.4, e: 2, hem: 262, hemE: 2.6, dip: 7, curve: 2 });
      const sk = skirtD({ top: 256, dip: 2, e: 2.4, hem: 386, flare: 14, hipY: 306, curve: 3.6 });
      const st = 'M 128.4 197 L 129.2 170.6';
      const ly = x => { const u = Math.abs(x - 150); return u > 10 ? 197.2 - (u - 10) / 11.6 * 2.2 : 203 - u / 10 * 5.8; };
      const lace = Array.from({ length: 10 }, (_, i) => { const x = 128.6 + i * 4.28, y0 = ly(x), y1 = ly(x + 4.28); return `<path d="M ${f1(x)} ${f1(y0)} Q ${f1(x + 2.14)} ${f1((y0 + y1) / 2 + 3.4)} ${f1(x + 4.28)} ${f1(y1)} Z" fill="#FFFDF4" stroke="${INK}" stroke-width=".7"/><circle cx="${f1(x + 2.14)}" cy="${f1((y0 + y1) / 2 + 1.4)}" r=".55" fill="${INK}" opacity=".4"/>`; }).join('');
      return strap(st, F.base, 1.3) + strap(mir(st), F.base, 1.3) + piece(sk, F.fill, {
        folds: fm('M 130 290 Q 134 330 128 372', 'M 142 300 Q 144 336 141 378'), sheen: ['M 126 290 C 123 320 120 350 118 376'], sheenOp: .45,
        lines: [{ d: 'M 176 388 L 170 356 L 180 388', o: .6 }]
      }) + piece(bod, F.fill, { sheen: ['M 132 214 C 130 230 130 244 131 256', mir('M 132 214 C 130 230 130 244 131 256')], sheenOp: .45 }) + lace;
    }
  }
});
function gatherPants(hem, ease, ei) {
  let d = ''; const xo = outerX(hem) - ease(hem), xi = legI(hem) + ei;
  for (let i = 1; i <= 4; i++) { const x = xo + (xi - xo) * i / 5; d += `M ${f1(x)} ${hem - 11} L ${f1(x + .4)} ${f1(hem - 1)} `; }
  return d;
}
