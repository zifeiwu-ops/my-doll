/* =====================================================================
   固定款：袜子 / 鞋 / 配饰（沿描摹底模的腿、脚、脖子、手腕画）
   层级：发型后片 2 · 底模 10 · 袜子 15 · 下装 20 · 连衣裙 25 · 上衣 30 · 外套 35 · 鞋 40 · 腿套 42 · 发型前片 50 · 配饰 55+
   ===================================================================== */
/* 腿 + 脚的外包轮廓（左腿）：y0 以下整条包住，e 外扩 */
function legWrapD(y0, e = 1.3, top = null) {
  const pts = [];
  rng(y0, 572, Math.round((572 - y0) / 9)).forEach(y => pts.push([legO(y) - e, y]));
  pts.push([121.4 - e * .6, 577.6]); pts.push([128, 580.8 + e * .4]); pts.push([138.4, 580.6 + e * .4]); pts.push([144.8 + e * .6, 577]);
  rng(570, y0, Math.round((570 - y0) / 9)).forEach(y => pts.push([legI(y) + e, y]));
  if (top) top.forEach(p => pts.push(p));
  return spline(pts);
}
/* 鞋面（左脚，正面看脚尖朝前）top = 鞋口高度 */
function shoeUpperD(top = 534, e = 2.6, collar = 5) {
  const bulge = y => Math.max(0, (y - 552) / 24) * 2.4;
  const pts = [[legO(top) - e, top, 'c']];
  rng(top + 8, 572, Math.max(2, Math.round((572 - top) / 8))).forEach(y => pts.push([legO(y) - e - bulge(y), y]));
  pts.push([116.4 - e * .6, 578.6]); pts.push([122.6, 583.2]); pts.push([132.6, 584.6]); pts.push([142.4, 583.2]); pts.push([147.2 + e * .3, 578.2]);
  rng(570, top + 6, Math.max(2, Math.round((570 - top) / 8))).forEach(y => pts.push([legI(y) + e + bulge(y) * 1.2, y]));
  pts.push([legI(top) + e, top, 'c']);
  pts.push([(legO(top) + legI(top)) / 2 + 1, top + collar]);
  return spline(pts);
}
/* 鞋口内衬（露出来的一圈） */
const liningD = (top, e, collar) => spline([[legO(top) - e + 1.4, top + .4, 'c'], [(legO(top) + legI(top)) / 2 + 1, top + collar + 3.2], [legI(top) + e - 1.4, top + .4, 'c'], [(legO(top) + legI(top)) / 2 + 1, top + collar - .2]]);
const soleD = (y0 = 578, h = 13, e = 4) => spline([[114.4 - e * .6, y0, 'c'], [147.6 + e * .3, y0, 'c'], [148.8 + e * .3, y0 + h * .55], [147.2 + e * .3, y0 + h, 'c'], [115.2 - e * .5, y0 + h, 'c'], [113 - e * .6, y0 + h * .55]]);
const both = f => f(false) + f(true);
const M_ = m => (m ? mir : (x => x)), X_ = m => (x => (m ? 300 - x : x));

const EXTRA = [
  /* ---------- 袜子（z15，腿套 z42 盖在鞋面上） ---------- */
  {
    id: 'l1', cat: 'legs', name: '薄荷过膝袜', thumb: '100 380 100 216',
    parts() {
      const c = '#BFEBE4';
      const one = m => {
        const M = M_(m), d = legWrapD(392, 1.4, [[132, 389.6]]);
        const band = spline([[legO(392) - 1.6, 392, 'c'], [132, 389.4], [legI(392) + 1.6, 391.6, 'c'], [legI(400) + 1.6, 399.6, 'c'], [132, 397.6], [legO(400) - 1.6, 400.4, 'c']]);
        return piece(M(d), c, { folds: [M('M 121 452 Q 128 456 137 452'), M('M 123 540 Q 129 543 136 540')] }) + piece(M(band), '#A9E0D7', { rim: false, lines: [{ d: M('M 118 390 q 2 -2.6 4 0 q 2 -2.6 4 0 q 2 -2.6 4 0 q 2 -2.6 4 0 q 2 -2.6 4 0 q 2 -2.6 4 0'), c: '#fff', w: 1.4, o: .95 }] });
      };
      return [{ z: 15, svg: both(one) }];
    }
  },
  {
    id: 'l2', cat: 'legs', name: '圆点堆堆袜', thumb: '104 460 92 130',
    parts() {
      const one = m => {
        const M = M_(m), ease = y => 1.4 + (y < 540 ? Math.sin((y - 480) / 60 * Math.PI * 3) * .9 + 1.4 : 0);
        const pts = []; rng(482, 572, 18).forEach(y => pts.push([legO(y) - ease(y), y]));
        pts.push([121, 577.6]); pts.push([128, 581.4]); pts.push([138.4, 581.2]); pts.push([145.4, 577]);
        rng(570, 482, 18).forEach(y => pts.push([legI(y) + ease(y), y])); pts.push([128, 478.6]);
        const rings = [490, 502, 514, 526].map(y => `M ${f1(legO(y) - 2)} ${y} Q 128 ${y + 4} ${f1(legI(y) + 2)} ${y}`);
        return piece(M(spline(pts)), 'url(#pat-dots)', { folds: rings.map(M), foldOp: .55 });
      };
      return [{ z: 15, svg: both(one) }];
    }
  },
  {
    id: 'l3', cat: 'legs', slot: 'warmer', name: '四叶草圆点腿套', thumb: '98 404 104 164',
    parts() {
      const one = m => {
        const M = M_(m);
        const ease = y => 4.4 + Math.sin((y - 420) / 130 * Math.PI) * 2.2 + Math.sin(y / 5.5) * .7;
        const pts = [[legO(426) - 4.6, 426, 'c']]; rng(436, 550, 14).forEach(y => pts.push([legO(y) - ease(y), y]));
        pts.push([legO(556) - 5.2, 557, 'c']); pts.push([130, 561]); pts.push([legI(556) + 5.8, 556, 'c']);
        rng(548, 432, 14).forEach(y => pts.push([legI(y) + ease(y) * .7, y])); pts.push([legI(426) + 3.4, 426, 'c']);
        const cuff = spline([[legO(414) - 4.2, 414, 'c'], [129, 411], [legI(414) + 3.6, 413.4, 'c'], [legI(428) + 3.6, 428.4, 'c'], [129, 425.6], [legO(428) - 4.8, 428.8, 'c']]);
        const rings = rng(446, 540, 7).map(y => `M ${f1(legO(y) - ease(y) + 1)} ${f1(y)} Q ${128} ${f1(y + 3.6)} ${f1(legI(y) + ease(y) * .7 - 1)} ${f1(y - .6)}`);
        return piece(M(spline(pts)), 'url(#pat-creamdots)', { folds: rings.map(M), foldOp: .42 }) + piece(M(cuff), '#BFE6EE', { lines: [{ d: M('M 118 419 Q 129 421.6 140 419'), o: .4 }] });
      };
      const vine = 'M 124 466 C 134 474 128 490 140 494 C 146 496 148 490 144 487';
      return [{ z: 42, svg: both(one) + `<path d="${vine}" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="${vine}" fill="none" stroke="#5DBE4A" stroke-width="1.3" stroke-linecap="round"/>` + clover(123, 462, 7.2, -18, false) + clover(174, 446, 4.2, 20, false) + heart(179, 478, 3.4, '#F7A9C4', .8) }];
    }
  },

  /* ---------- 鞋（z40） ---------- */
  {
    id: 's6', cat: 'shoes', name: '绿白厚底板鞋', thumb: '100 520 100 84',
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        const up = shoeUpperD(532, 2.8, 4);
        const toe = spline([[legO(566) - 3.2, 566, 'c'], [128, 571], [legI(566) + 3.2, 566, 'c'], [146.6, 576.4], [141.4, 581.8], [132.4, 583], [124, 581.6], [116.2, 576.4]]);
        const heel = spline([[legO(534) - 3, 534, 'c'], [legO(546) - 3.2, 546], [legO(558) - 3.4, 558, 'c'], [123.6, 551], [123.4, 538, 'c']]);
        const lace = [0, 1, 2, 3].map(i => { const y = 540 + i * 6.2; return `M ${X(124.6)} ${y} L ${X(136.6)} ${y + 4} M ${X(136.6)} ${y} L ${X(124.6)} ${y + 4}`; }).join(' ');
        return piece(M(up), '#FBFBF6', { lines: [{ d: M('M 124.4 536 L 125.4 562 M 136.8 536 L 136 562'), o: .5 }] }) + piece(M(heel), '#7CC96A', {}) +
          piece(M(toe), '#7CC96A', { rim: false, lines: [{ d: M('M 120 573 Q 132 577 145 573'), c: '#fff', w: .8, o: .6 }] }) +
          `<path d="${lace}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="${lace}" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>` +
          piece(M(soleD(579, 14, 4)), '#EFE3C4', { lines: [{ d: M('M 114.4 586 L 150.4 586'), c: '#7CC96A', w: 1.8, o: .95 }, { d: M('M 116 590 L 149 590'), o: .3 }] });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's2', cat: 'shoes', name: '黑色厚底玛丽珍', thumb: '100 524 100 80',
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        const up = shoeUpperD(548, 2.8, 6);
        const strapD = spline([[legO(556) - 3.2, 556, 'c'], [130, 560.6], [legI(556) + 3.3, 555.6, 'c'], [legI(561) + 3.4, 560.8, 'c'], [130, 565.6], [legO(561) - 3.3, 561.2, 'c']]);
        return piece(M(up), '#2A2528', { rim: false, over: `<path d="${M(liningD(548, 2.8, 6))}" fill="#B9A2AA" stroke="${INK}" stroke-width=".8"/>`, gloss: [M('M 121 570 Q 123 564 128 562')], glossW: 2.6, glossOp: .55 }) +
          piece(M(strapD), '#2A2528', { rim: false }) + `<rect x="${f1(X(139.6) - 2.8)}" y="558" width="5.6" height="6" rx="1" fill="none" stroke="#D5D9E0" stroke-width="1.4"/>` +
          piece(M(soleD(579, 15, 4.6)), '#2A2528', { rim: false, lines: [{ d: M('M 114 585 L 150.6 585'), c: '#57505A', w: 1, o: .9 }] }) + `<ellipse cx="${X(124.4)}" cy="574.6" rx="2.6" ry="1.6" fill="#fff" opacity=".5"/>`;
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's7', cat: 'shoes', name: '黑灰老爹鞋', thumb: '100 520 100 84',
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        const up = shoeUpperD(532, 3, 4);
        const over = spline([[legO(544) - 3.4, 544, 'c'], [124, 552], [134, 562], [legI(560) + 3.4, 560, 'c'], [legI(570) + 3.6, 570], [132, 571.4], [legO(570) - 3.6, 568, 'c']]);
        const lace = [0, 1, 2].map(i => { const y = 540 + i * 6.4; return `M ${X(124.4)} ${y} L ${X(136.8)} ${y + 4} M ${X(136.8)} ${y} L ${X(124.4)} ${y + 4}`; }).join(' ');
        return piece(M(up), '#E9E3D2', {}) + piece(M(over), '#34302F', { rim: false, lines: [{ d: M('M 120 562 Q 130 566 143 566'), c: '#A8A2A0', w: .9, o: .8 }] }) +
          `<path d="${lace}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="${lace}" stroke="#F4F0E6" stroke-width="1.3" stroke-linecap="round"/>` +
          `<path d="${M('M 126.4 533.6 L 135 533.6 L 134.4 538 L 127 538 Z')}" fill="#9CC49A" stroke="${INK}" stroke-width=".8"/>` +
          piece(M(soleD(578, 16, 5)), '#F3EFE4', { lines: [{ d: M('M 114 585 C 124 589 132 583 140 587 C 145 589 149 586 151 587'), c: '#34302F', w: 1.6, o: .95 }] });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's1', cat: 'shoes', name: '白色厚底球鞋', thumb: '100 520 100 84',
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        const lace = [0, 1, 2, 3].map(i => { const y = 540 + i * 6.2; return `M ${X(124.6)} ${y} L ${X(136.6)} ${y + 4} M ${X(136.6)} ${y} L ${X(124.6)} ${y + 4}`; }).join(' ');
        return piece(M(shoeUpperD(532, 2.8, 4)), '#FBFCFF', { folds: [M('M 119 574 Q 132 569 146 574')] }) +
          `<path d="${lace}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="${lace}" stroke="#9FC8EE" stroke-width="1.3" stroke-linecap="round"/>` +
          piece(M(soleD(579, 13, 4)), '#E3ECF7', { lines: [{ d: M('M 115 585.6 L 150 585.6'), c: '#9FC8EE', w: 1.3, o: .9 }] });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's3', cat: 'shoes', name: '银色短靴', thumb: '100 470 100 130',
    parts() {
      const one = m => {
        const M = M_(m);
        return piece(M(shoeUpperD(486, 3.2, 3)), 'url(#grad-silver)', { folds: [M('M 121 520 Q 128 524 137 520'), M('M 122 540 Q 129 543 136 540')], gloss: [M('M 124 494 C 124 510 124 530 126 552')], glossW: 2.4, glossOp: .95 }) +
          piece(M(soleD(579, 13, 4)), '#4A4550', {});
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's4', cat: 'shoes', name: '薄荷玛丽珍', thumb: '100 524 100 80',
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        const strapD = spline([[legO(552) - 3, 552, 'c'], [130, 556.6], [legI(552) + 3, 551.6, 'c'], [legI(557) + 3.1, 556.8, 'c'], [130, 561.6], [legO(557) - 3.1, 557.2, 'c']]);
        return piece(M(shoeUpperD(548, 2.8, 6)), '#8FD9CD', { over: `<path d="${M(liningD(548, 2.8, 6))}" fill="#F2E4DE" stroke="${INK}" stroke-width=".8"/>`, lines: [{ d: M('M 119 575 Q 132 580 146 575'), c: '#fff', dash: '1.6 1.4', o: .9 }], gloss: [M('M 121 570 Q 123 565 127 563')] }) +
          piece(M(strapD), '#8FD9CD', {}) + `<circle cx="${f1(X(139.6))}" cy="557" r="1.5" fill="#fff" stroke="${INK}" stroke-width=".6"/>` + piece(M(soleD(580, 9, 3.6)), '#7A5A48', {});
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's5', cat: 'shoes', name: '焦糖乐福鞋', thumb: '100 524 100 80',
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        const saddle = spline([[legO(556) - 3.2, 556, 'c'], [130, 560], [legI(556) + 3.2, 555.6, 'c'], [legI(562) + 3.3, 561.8, 'c'], [130, 566], [legO(562) - 3.3, 562.2, 'c']]);
        return piece(M(shoeUpperD(546, 2.8, 6)), '#9A6448', { over: `<path d="${M(liningD(546, 2.8, 6))}" fill="#E9D8D2" stroke="${INK}" stroke-width=".8"/>`, gloss: [M('M 121 571 Q 123 565 128 563')] }) +
          piece(M(saddle), '#7E4E38', { rim: false }) + `<path d="${M('M 126.4 561.6 L 134.4 561.2')}" stroke="${INK}" stroke-width="1.3" stroke-linecap="round"/>` + piece(M(soleD(580, 9, 3.6)), '#4A3430', { rim: false });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },

  /* ---------- 配饰（z55+，可以同时戴好几件） ---------- */
  {
    id: 'a5', cat: 'acc', name: '粉色波点头巾', thumb: '84 46 140 100',
    parts: () => {
      const scarf = spline([[106.2, 104, 'c'], [106.6, 86], [113, 72.4], [124, 62.6], [138, 57.4], [152, 56.4], [166, 58.6], [178, 64.4], [187.2, 73.4], [193, 84.6], [196, 97.6], [201, 110, 'c'], [190, 104], [178, 98.4], [164, 95], [150, 94], [136, 94.6], [122, 97.8]]);
      const knot = spline([[190, 104], [197.4, 108], [199, 116], [194.6, 121], [189.4, 116.4]]);
      const tail1 = spline([[193, 116], [199.6, 124], [201.4, 134.6, 'c'], [195.6, 130], [190.4, 121]]);
      const tail2 = spline([[190, 118], [190.6, 128], [186.6, 140, 'c'], [185, 130], [186.4, 119]]);
      const dots = [[124, 72], [140, 64.4], [156, 64], [172, 69], [186, 80], [132, 82.6], [150, 78], [166, 81.4], [118, 88], [182, 92], [192, 100]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.7" fill="#fff"/>`).join('');
      return [{ z: 56, svg: piece(tail2, '#F6AFC7', {}) + piece(tail1, '#F6AFC7', { under: `<circle cx="196" cy="128" r="1.6" fill="#fff"/>` }) + piece(scarf, '#F6AFC7', { under: dots, folds: ['M 128 70 Q 134 80 132 92', 'M 170 70 Q 168 82 166 94', 'M 188 84 Q 190 94 192 104'], lines: [{ d: 'M 108.4 100 Q 150 88 198 104', c: '#fff', w: .8, o: 0 }] }) + piece(knot, '#F29DBB', { deep: [knot] }) + glint(140, 70, 2.4) }];
    }
  },
  {
    id: 'a8', cat: 'acc', name: '粉色针织帽', thumb: '90 38 120 86',
    parts: () => {
      const cap = spline([[106.4, 96, 'c'], [106.8, 80], [113, 66], [124, 56.6], [137, 51.6], [150, 50.4], [163, 51.6], [176, 56.6], [187, 66], [193.2, 80], [193.6, 96, 'c']]);
      const brim = spline([[104.4, 88.4, 'c'], [127, 83.2], [150, 81.8], [173, 83.2], [195.6, 88.4, 'c'], [196.4, 105.4, 'c'], [173, 100.2], [150, 98.8], [127, 100.2], [103.6, 105.4, 'c']]);
      const ribs = Array.from({ length: 21 }, (_, i) => { const x = 106 + i * 4.4, s = 3.6 * Math.sin((x - 104) / 92 * Math.PI); return `M ${f1(x)} ${f1(88.6 - s)} L ${f1(x)} ${f1(104.4 - s)}`; }).join(' ');
      const knit = Array.from({ length: 13 }, (_, i) => { const x = 114 + i * 6; return `M ${x} ${f1(60 + Math.abs(x - 150) * .18)} L ${x} ${f1(85 - Math.abs(x - 150) * .05)}`; }).join(' ');
      return [{ z: 56, svg: piece(cap, '#F7AFC6', { lines: [{ d: knit, o: .35, w: .75 }] }) + piece(brim, '#F7AFC6', { lines: [{ d: ribs, o: .45, w: .8 }] }) + `<path d="M 174 93 L 186 94.6" stroke="#E07AA2" stroke-width="1" stroke-dasharray="1.6 1" stroke-linecap="round"/>` }];
    }
  },
  {
    id: 'a1', cat: 'acc', name: '星星发箍', thumb: '96 54 108 70',
    parts: () => [{ z: 55, svg: `<path d="M 108.4 112 C 108.4 84 126 68.4 150 68.4 C 174 68.4 191.6 84 191.6 112" fill="none" stroke="${INK}" stroke-width="7.6" stroke-linecap="round"/><path d="M 108.4 112 C 108.4 84 126 68.4 150 68.4 C 174 68.4 191.6 84 191.6 112" fill="none" stroke="#2E2630" stroke-width="5.4" stroke-linecap="round"/><path d="M 114 94 C 119 81 131 73.6 145 72.6" fill="none" stroke="#fff" stroke-width="1.1" opacity=".5" stroke-linecap="round"/>` + [[112.6, 94], [122, 78.6], [137, 70.4], [163, 70.4], [178, 78.6], [187.4, 94]].map(([x, y]) => star4(x, y, 2.2, '#fff')).join('') }]
  },
  {
    id: 'a6', cat: 'acc', name: '四叶草发夹', thumb: '100 70 100 40',
    parts: () => [{ z: 58, svg: clover(117, 94, 5, -24, false) + clover(184, 90, 4.2, 18, false) + glint(121, 88, 1.8) }]
  },
  {
    id: 'a10', cat: 'acc', name: '蝴蝶发夹', thumb: '100 66 100 44',
    parts: () => {
      const bf = (x, y, s, rot, c1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 C -5 -12 -16 -12 -15 -3 C -14 2 -6 3 0 0 Z M0 0 C 5 -12 16 -12 15 -3 C 14 2 6 3 0 0 Z" fill="${c1}" stroke="${INK}" stroke-width="1.2"/><path d="M0 0 C -5 2 -11 7 -8 11 C -4 12 -1 5 0 0 Z M0 0 C 5 2 11 7 8 11 C 4 12 1 5 0 0 Z" fill="${c1}" stroke="${INK}" stroke-width="1.2"/><path d="M -7 -4 C -8 -8 -11 -8 -12 -5 M 7 -4 C 8 -8 11 -8 12 -5" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".8"/><circle cx="-10" cy="-2" r="1.2" fill="#fff"/><circle cx="10" cy="-2" r="1.2" fill="#fff"/><circle cx="-5" cy="6" r=".9" fill="#fff"/><circle cx="5" cy="6" r=".9" fill="#fff"/><path d="M0 -5 L0 6" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"/><path d="M 0 -5 Q -2 -9 -4 -10 M 0 -5 Q 2 -9 4 -10" fill="none" stroke="${INK}" stroke-width=".7"/></g>`;
      return [{ z: 58, svg: bf(119, 92, .6, -22, '#F4A6CC') + bf(182, 88, .54, 18, '#6FA8E8') }];
    }
  },
  {
    id: 'a11', cat: 'acc', name: '黑色吊坠项圈', thumb: '130 146 40 36',
    parts: () => [{ z: 56, svg: piece('M 141.8 155 Q 150 158.4 158.2 155 L 158.2 160.6 Q 150 164 141.8 160.6 Z', '#2A2628', { rim: false, gloss: ['M 143.6 156.6 Q 147 158 149 158.2'], glossOp: .4 }) +
      [146, 154, 157].map(x => `<circle cx="${x}" cy="${x === 154 ? 159.4 : 158.2}" r=".45" fill="#C9CDD6"/>`).join('') +
      `<circle cx="150" cy="161.6" r="2.4" fill="none" stroke="#D5D9E0" stroke-width="1.2"/><path d="M 150 164 L 150 166.4" stroke="#B9C0CC" stroke-width=".8"/><circle cx="150" cy="169" r="2.8" fill="#2A2628" stroke="${INK}" stroke-width=".7"/><circle cx="149" cy="168" r=".8" fill="#fff" opacity=".7"/>` +
      `<path d="M 143.6 161 L 143 164.6" stroke="#B9C0CC" stroke-width=".7"/>` + star5(142.8, 167, 2.3, '#F4E08A', .6) + `<path d="M 156.4 161 L 157 164.6" stroke="#B9C0CC" stroke-width=".7"/>` + `<path d="${heartD(157.2, 166.8, 2.2)}" fill="#2A2628" stroke="${INK}" stroke-width=".5"/>` }]
  },
  {
    id: 'a7', cat: 'acc', name: '四叶草项圈', thumb: '130 146 40 36',
    parts: () => [{ z: 56, svg: piece('M 141.8 155.4 Q 150 158.8 158.2 155.4 L 158.2 160 Q 150 163.4 141.8 160 Z', '#6FBF52', { rim: false }) + `<path d="M 150 163 L 150 165" stroke="${INK}" stroke-width=".9"/>` + clover(150, 168.6, 3.6, 0, false) }]
  },
  {
    id: 'a9', cat: 'acc', name: '腰间挂件串', thumb: '156 290 48 50',
    parts: () => {
      const clasp = (x, y, c) => `<path d="M ${x} ${y} C ${x - 2.6} ${y} ${x - 2.8} ${y + 5} ${x} ${y + 6} C ${x + 2.4} ${y + 5.4} ${x + 2.4} ${y + 1.4} ${x + .6} ${y + 1}" fill="none" stroke="${INK}" stroke-width="2.4"/><path d="M ${x} ${y} C ${x - 2.6} ${y} ${x - 2.8} ${y + 5} ${x} ${y + 6} C ${x + 2.4} ${y + 5.4} ${x + 2.4} ${y + 1.4} ${x + .6} ${y + 1}" fill="none" stroke="${c}" stroke-width="1.2"/>`;
      const chain = (x, y0, y1) => `<path d="M ${x} ${y0} L ${x} ${y1}" stroke="#9CA3AF" stroke-width="1.1" stroke-dasharray="1.2 .8"/>`;
      const gemStar = (x, y, r, c, c2) => star5(x, y, r, c, .9) + `<path d="${(() => { let p = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .26 : r * .55; p += `${i ? 'L' : 'M'} ${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)} `; } return p + 'Z'; })()}" fill="${c2}" opacity=".8"/>`;
      return [{ z: 46, svg: `<g transform="translate(0 7)"><circle cx="178" cy="292" r="2.6" fill="none" stroke="#B9C0CC" stroke-width="1.3"/>` +
        clasp(168, 294, '#E6B84C') + chain(168, 300, 309) + gemStar(168, 315, 5.6, '#FFD95A', '#FFF1A8') +
        clasp(176, 296, '#6FBF52') + chain(176, 302, 316) + gemStar(176, 322, 5.2, '#7ED36C', '#C9F2A8') +
        clasp(184, 295, '#C9CDD6') + chain(184, 301, 310) + clover(184, 316, 4.4, 0, true) +
        clasp(191, 293, '#E0607E') + chain(191, 299, 304) + heart(191, 309.6, 4.8, '#F48FB1', .9) + '</g>' }];
    }
  },
  {
    id: 'a2', cat: 'acc', name: '果冻手环 + 星星项圈', thumb: '196 288 30 30',
    parts: () => [{ z: 56, svg: piece('M 141.4 156 Q 150 159.6 158.6 156 L 158.6 160.8 Q 150 164.4 141.4 160.8 Z', '#F7A8CF', { rim: false }) + `<path d="M 150 163.8 L 150 166.2" stroke="${INK}" stroke-width="1"/>` + star5(150, 170, 3.8, '#F4F1FA') +
      ['#FF8FC8', '#7FE3F2', '#FFF07A', '#B6F58A'].map((c, i) => `<ellipse cx="${f1(211 - i * .5)}" cy="${300 + i * 3.6}" rx="7.6" ry="2.6" fill="none" stroke="${INK}" stroke-width="3.2"/><ellipse cx="${f1(211 - i * .5)}" cy="${300 + i * 3.6}" rx="7.6" ry="2.6" fill="none" stroke="${c}" stroke-width="1.9"/>`).join('') }]
  },
  {
    id: 'a3', cat: 'acc', name: '粉色无框墨镜', thumb: '114 108 72 34',
    parts: () => [{ z: 57, svg: [132, 168].map(cx => `<ellipse cx="${cx}" cy="124.6" rx="11.6" ry="7.6" fill="#FF8DC0" opacity=".42"/><ellipse cx="${cx}" cy="124.6" rx="11.6" ry="7.6" fill="none" stroke="#E07AAE" stroke-width=".8"/><path d="M ${cx - 7.4} 120.6 Q ${cx - 3.4} 118.4 ${cx} 118.8" stroke="#fff" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".85"/>`).join('') + `<path d="M 143.6 122.4 Q 150 120 156.4 122.4" fill="none" stroke="#B9C0CC" stroke-width="1.1"/><path d="M 120.4 122.4 L 114 119.6 M 179.6 122.4 L 186 119.6" stroke="#B9C0CC" stroke-width="1.1" stroke-linecap="round"/>` }]
  },
  {
    id: 'a4', cat: 'acc', name: '天使小熊背包', thumb: '160 168 84 72',
    parts() {
      const bear = `<g transform="translate(200 202)">` +
        `<path d="M 12 6 C 26 -6 40 -2 38 10 C 36 20 24 18 16 16 Z" fill="#fff" stroke="${INK}" stroke-width="1.1"/><path d="M 22 6 C 28 2 34 4 33 9 M 20 11 C 27 9 32 11 31 14" fill="none" stroke="${INK}" stroke-width=".8" opacity=".5"/>` +
        `<circle cx="-11" cy="-22" r="6.5" fill="#C9AEF2" stroke="${INK}" stroke-width="1.2"/><circle cx="11" cy="-22" r="6.5" fill="#C9AEF2" stroke="${INK}" stroke-width="1.2"/><circle cx="-11" cy="-22" r="3" fill="#E9DDFF"/><circle cx="11" cy="-22" r="3" fill="#E9DDFF"/>` +
        `<ellipse cx="0" cy="-8" rx="17" ry="15" fill="#C9AEF2" stroke="${INK}" stroke-width="1.3"/><ellipse cx="0" cy="-3" rx="6.5" ry="4.8" fill="#EDE3FF" stroke="${INK}" stroke-width=".8"/>` +
        `<circle cx="-6.5" cy="-11" r="1.7" fill="${INK}"/><circle cx="6.5" cy="-11" r="1.7" fill="${INK}"/><path d="M -1.5 -5 Q 0 -3.6 1.5 -5" fill="none" stroke="${INK}" stroke-width=".9"/><ellipse cx="-11" cy="-5" rx="3" ry="1.8" fill="#FF9DB4" opacity=".6"/><ellipse cx="11" cy="-5" rx="3" ry="1.8" fill="#FF9DB4" opacity=".6"/>` +
        `<path d="M -9 14 C -9 30 9 30 9 14" fill="#C9AEF2" stroke="${INK}" stroke-width="1.2"/></g>`;
      const strapL = 'M 127 170 C 124 184 122 198 121.6 214', strapR = mir(strapL);
      return [{ z: 3, svg: bear }, { z: 45, svg: strap(strapL, '#C9AEF2', 2.2) + strap(strapR, '#C9AEF2', 2.2) }];
    }
  }
];
