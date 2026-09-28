/* ---------- 新袜子 / 鞋 / 配饰 · 千禧校园 & 甜系插画系列 ---------- */
const lensCat = (cx, cy, w, h, up) => `M ${f1(cx - w)} ${f1(cy - h * .2)} C ${f1(cx - w)} ${f1(cy - h * 1.1)} ${f1(cx + w * .2)} ${f1(cy - h * 1.05)} ${f1(cx + w + up * .4)} ${f1(cy - h - up)} C ${f1(cx + w * 1.05)} ${f1(cy + h * .2)} ${f1(cx + w * .2)} ${f1(cy + h)} ${f1(cx - w * .2)} ${f1(cy + h * .9)} C ${f1(cx - w * .9)} ${f1(cy + h * .8)} ${f1(cx - w)} ${f1(cy + h * .3)} ${f1(cx - w)} ${f1(cy - h * .2)} Z`;
const chainD = (y, w, sag) => `M ${150 - w} ${y} Q 150 ${y + sag} ${150 + w} ${y}`;
const chain = (y, w, sag, c = '#D9B45A', wd = .9) => `<path d="${chainD(y, w, sag)}" fill="none" stroke="${INK}" stroke-width="${wd + 1.1}" stroke-linecap="round" opacity=".7"/><path d="${chainD(y, w, sag)}" fill="none" stroke="${c}" stroke-width="${wd}" stroke-linecap="round" stroke-dasharray="1.4 .6"/>`;
function sneaker(upper, laceC, sole, stripe) {
  return m => {
    const M = M_(m), X = X_(m);
    const lace = [0, 1, 2, 3].map(i => { const y = 540 + i * 6.2; return `M ${X(124.6)} ${y} L ${X(136.6)} ${y + 4} M ${X(136.6)} ${y} L ${X(124.6)} ${y + 4}`; }).join(' ');
    return piece(M(shoeUpperD(532, 2.8, 4)), upper, { folds: [M('M 119 574 Q 132 569 146 574')], lines: [{ d: M('M 118 566 C 124 560 132 566 138 560'), c: stripe, w: 2, o: .95 }] }) +
      `<path d="${lace}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="${lace}" stroke="${laceC}" stroke-width="1.3" stroke-linecap="round"/>` +
      piece(M(soleD(579, 13, 4)), sole, { lines: [{ d: M('M 115 585.6 L 150 585.6'), c: stripe, w: 1.3, o: .9 }] });
  };
}
const HEAD10 = ['a20', 'a21', 'a24', 'a28', 'a29', 'a30', 'a31', 'a32', 'a35'];
const HATS10 = ['a24', 'a28', 'a29', 'a30', 'a35'];

EXTRA.push(
  /* ---------- 袜子 ---------- */
  {
    id: 'l4', cat: 'legs', name: '薄荷罗纹及膝袜', thumb: '100 440 100 150', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m);
        const d = legWrapD(452, 1.5, [[128, 449.4]]);
        const band = spline([[legO(452) - 1.8, 452, 'c'], [128, 449], [legI(452) + 1.8, 451.4, 'c'], [legI(461) + 1.8, 460.6, 'c'], [128, 458], [legO(461) - 1.8, 461.4, 'c']]);
        return piece(M(d), 'url(#pat-mintrib)', { folds: [M('M 121 492 Q 128 495 136 492')] }) + piece(M(band), '#8FD3C7', { rim: false, lines: [{ d: M(ribLines(legO(455) - 1, legI(455) + 1, 450, 461, 2.4)), o: .35, w: .6 }] });
      };
      return [{ z: 15, svg: both(one) }];
    }
  },
  {
    id: 'l5', cat: 'legs', name: '黑白条纹连裤袜', thumb: '96 290 108 300', isNew: true,
    parts() { const one = m => piece(M_(m)(legWrapD(290, 1.2, [[150, 292.4]])), 'url(#pat-bwstripe)', { rim: [2.4, 1.4] }); return [{ z: 15, svg: both(one) }]; }
  },
  {
    id: 'l6', cat: 'legs', name: '粉色菱格连裤袜', thumb: '96 290 108 300', isNew: true,
    parts() { const one = m => piece(M_(m)(legWrapD(290, 1.1, [[150, 292.4]])), 'url(#pat-pinkargyle)', { rim: [2.4, 1.4], sc: '#F2C9D4' }); return [{ z: 15, svg: both(one) }]; }
  },
  /* ---------- 鞋 ---------- */
  { id: 's8', cat: 'shoes', name: '粉色系带运动鞋', thumb: '100 520 100 84', isNew: true, parts: () => [{ z: 40, svg: both(sneaker('#F9B8D0', '#FFFFFF', '#F48FB1', '#E86C94')) }] },
  {
    id: 's9', cat: 'shoes', name: '棕色莫卡辛', thumb: '100 524 100 80', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        return piece(M(shoeUpperD(548, 2.8, 5)), '#A56E46', { over: `<path d="${M(liningD(548, 2.8, 5))}" fill="#E9D3B8" stroke="${INK}" stroke-width=".8"/>`, gloss: [M('M 121 571 Q 123 565 128 563')],
          lines: [{ d: M('M 121 568 C 122 559 138 558 141 568'), c: '#F2DDC4', w: .9, dash: '1.4 1.1', o: .95 }, { d: M('M 121.6 567 C 123 561 137 560 140.4 567'), o: .5 }] }) +
          `<path d="M ${X(127)} 555.4 Q ${X(131)} 559 ${X(135)} 555.4 M ${X(131)} 557.8 l ${m ? 2.4 : -2.4} 4.6 M ${X(131)} 557.8 l ${m ? -2 : 2} 4.8" fill="none" stroke="#7A4A2E" stroke-width="1.2" stroke-linecap="round"/>` +
          piece(M(soleD(580, 8, 3.4)), '#E4CFA8', { rim: false });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's10', cat: 'shoes', name: '黑色系带厚底靴', thumb: '96 462 108 142', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        const lace = [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const y = 482 + i * 9; return `M ${X(125.4)} ${y} L ${X(135.6)} ${y + 6} M ${X(135.6)} ${y} L ${X(125.4)} ${y + 6}`; }).join(' ');
        const cuff = spline([[legO(474) - 4.4, 473, 'c'], [130.6, 470.6], [legI(474) + 4.4, 473, 'c'], [legI(482) + 4.4, 482, 'c'], [130.6, 480], [legO(482) - 4.4, 482, 'c']]);
        return piece(M(shoeUpperD(474, 3.8, 2)), '#2E2A2C', { rim: false, gloss: [M('M 121 486 C 120 510 121 540 124 566')], glossW: 1.8, glossOp: .35, folds: [M('M 119 512 Q 124 515 128 512'), M('M 118 536 Q 124 539 128 536')], fc: '#6A6266' }) +
          piece(M(cuff), '#3A3538', { rim: false }) + `<path d="${lace}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/><path d="${lace}" stroke="#E9E4DC" stroke-width="1.2" stroke-linecap="round"/>` +
          piece(M(soleD(577, 19, 5.2)), '#2A2628', { rim: false, lines: [{ d: M('M 113 585 L 152 585 M 113 590.6 L 152 590.6'), c: '#6A6266', w: 1, o: .9 }] });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  /* ---------- 配饰 ---------- */
  {
    id: 'a20', cat: 'acc', name: '粉色猫眼眼镜', thumb: '114 106 72 36', isNew: true,
    parts: () => [{ z: 57, svg: [false, true].map(r => { const g = `<path d="${lensCat(132, 124.6, 11.6, 7.4, 3)}" fill="#FFD6E4" opacity=".28"/><path d="${lensCat(132, 124.6, 11.6, 7.4, 3)}" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linejoin="round"/><path d="${lensCat(132, 124.6, 11.6, 7.4, 3)}" fill="none" stroke="#F4A0BE" stroke-width="1.4" stroke-linejoin="round"/><circle cx="143.6" cy="117.8" r=".9" fill="#fff"/>`; return r ? `<g transform="translate(300 0) scale(-1 1)">${g}</g>` : g; }).join('') +
      `<path d="M 143.4 121.6 Q 150 119 156.6 121.6" fill="none" stroke="${INK}" stroke-width="1.8"/><path d="M 143.4 121.6 Q 150 119 156.6 121.6" fill="none" stroke="#F4A0BE" stroke-width=".8"/>` }]
  },
  {
    id: 'a21', cat: 'acc', name: '蓝色方框眼镜', thumb: '114 108 72 34', isNew: true,
    parts: () => [{ z: 57, svg: [132.4, 167.6].map(cx => `<rect x="${cx - 11.4}" y="118.4" width="22.8" height="12.6" rx="2.2" fill="#DDF1FF" opacity=".25"/><rect x="${cx - 11.4}" y="118.4" width="22.8" height="12.6" rx="2.2" fill="none" stroke="${INK}" stroke-width="2.6"/><rect x="${cx - 11.4}" y="118.4" width="22.8" height="12.6" rx="2.2" fill="none" stroke="#6FB4E8" stroke-width="1.4"/><path d="M ${cx - 7} 121.6 L ${cx - 3.6} 120.4" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".8"/>`).join('') +
      `<path d="M 143.6 122 Q 150 119.4 156.4 122" fill="none" stroke="${INK}" stroke-width="1.8"/><path d="M 143.6 122 Q 150 119.4 156.4 122" fill="none" stroke="#6FB4E8" stroke-width=".8"/>` }]
  },
  {
    id: 'a22', cat: 'acc', name: '蕾丝项圈+爱心吊坠', thumb: '130 146 40 48', isNew: true,
    parts: () => [{ z: 56, svg: laceRow([[142.4, 159.4], [146, 160.8], [150, 161.2], [154, 160.8], [157.6, 159.4]], 1.4, '#FFFDF8', false) + piece('M 142 155.2 Q 150 158.6 158 155.2 L 158 159.6 Q 150 163 142 159.6 Z', '#FFFDF8', { rim: false, lines: [{ d: 'M 143 157.6 Q 150 160.6 157 157.6', c: '#C9B9AE', dash: '1 1', w: .7 }] }) +
      `<path d="M 141 164 Q 150 176 159 164" fill="none" stroke="#D9B45A" stroke-width=".9" stroke-dasharray="1.2 .6"/>` + heart(150, 178.6, 3.6, '#E6C25C', .8) }]
  },
  {
    id: 'a23', cat: 'acc', name: '金色叠戴项链', thumb: '128 150 44 50', isNew: true,
    parts: () => [{ z: 56, svg: chain(161, 9, 9) + chain(162, 11, 22) + `<circle cx="150" cy="170.6" r="1.4" fill="#E6C25C" stroke="${INK}" stroke-width=".5"/>` +
      `<circle cx="150" cy="186.4" r="3.6" fill="#E6C25C" stroke="${INK}" stroke-width=".8"/><path d="M 150 186.4 m -2 0 a 2 2 0 1 1 2 2 a 1.2 1.2 0 1 1 -1.2 -1.2" fill="none" stroke="#9A7A2E" stroke-width=".7"/>` }]
  },
  {
    id: 'a25', cat: 'acc', name: '银色多层项链', thumb: '124 150 52 70', isNew: true,
    parts: () => [{ z: 56, svg: chain(160, 8.6, 6, '#D5DAE2') + chain(161, 10.4, 16, '#D5DAE2') + chain(162, 12, 28, '#D5DAE2') + chain(163, 13, 40, '#D5DAE2') +
      star5(150, 170, 2.2, '#EEF1F6', .6) + `<path d="${heartD(150, 184, 2.8)}" fill="#EEF1F6" stroke="${INK}" stroke-width=".7"/>` + `<circle cx="150" cy="196.4" r="2.6" fill="#A8D8F0" stroke="${INK}" stroke-width=".7"/><circle cx="149.2" cy="195.6" r=".7" fill="#fff"/>` + `<path d="M 150 206 m -2.8 0 a 2.8 2.8 0 1 0 4.4 -2.3 a 2.2 2.2 0 1 1 -1.6 2.3" fill="#EEF1F6" stroke="${INK}" stroke-width=".6"/>` }]
  },
  {
    id: 'a24', cat: 'acc', name: '蓝色佩斯利头巾', thumb: '84 46 132 80', isNew: true,
    parts: () => {
      const scarf = spline([[106.4, 100, 'c'], [107, 84], [113, 71.4], [124, 62.2], [138, 57.2], [152, 56.2], [166, 58.4], [178, 64.2], [187, 73.2], [192.6, 84.4], [193.6, 100, 'c'], [180, 94.6], [166, 91], [150, 90], [134, 91], [120, 94.6]]);
      const edge = line([[106.4, 100], [120, 94.6], [134, 91], [150, 90], [166, 91], [180, 94.6], [193.6, 100]]);
      return [{ z: 56, svg: piece(scarf, 'url(#pat-bluepaisley)', { folds: ['M 128 70 Q 134 80 132 90', 'M 170 70 Q 168 82 166 90', 'M 150 60 Q 150 74 150 88'] }) + `<path d="${edge}" fill="none" stroke="#EAF1FA" stroke-width="1" stroke-dasharray="2 1.4" transform="translate(0 -2.2)"/>` }];
    }
  },
  {
    id: 'a26', cat: 'acc', name: '棕色佩斯利流苏围巾', thumb: '112 144 76 196', isNew: true,
    parts: () => {
      const wrap = spline([[137.6, 151.6], [150, 156], [162.4, 151.6], [168, 158.4], [167.2, 172, 'c'], [150, 178], [132.8, 172, 'c'], [132, 158.4]]);
      const tailL = spline([[134, 166], [142, 170], [141, 220], [140.4, 286, 'c'], [127.4, 288, 'c'], [127.6, 220], [128.4, 170]]);
      const tailR = spline([[158, 170], [166, 166], [171.6, 170], [172.4, 230], [173, 300, 'c'], [160, 302, 'c'], [158.6, 230]]);
      const fr = (x0, x1, y) => { let d = ''; for (let x = x0; x <= x1; x += 2) d += `M ${f1(x)} ${f1(y)} l ${f1(((x * 7) % 3 - 1) * .4)} 6 `; return d; };
      return [{ z: 57, svg: piece(tailL, 'url(#pat-paisleybrown)', { folds: ['M 133 200 Q 135 230 133 262'] }) + `<path d="${fr(128.4, 140, 287)}" stroke="#5A3E30" stroke-width="1.2" stroke-linecap="round"/>` +
        piece(tailR, 'url(#pat-paisleybrown)', { folds: ['M 166 210 Q 168 240 166 276'] }) + `<path d="${fr(160.6, 172.4, 301)}" stroke="#5A3E30" stroke-width="1.2" stroke-linecap="round"/>` +
        piece(wrap, 'url(#pat-paisleybrown)', { folds: ['M 138 160 Q 150 165 162 160', 'M 140 166 Q 150 170 160 166'] }) }];
    }
  },
  {
    id: 'a27', cat: 'acc', name: '藏青色双肩包', thumb: '70 160 90 150', isNew: true,
    parts() {
      const bag = spline([[106, 196], [96, 197.4], [88.4, 206], [86, 226], [86.6, 256], [88.6, 276], [98, 282.6, 'c'], [108, 280], [110, 250], [110, 214]]);
      const pocket = spline([[89, 244, 'c'], [106, 244, 'c'], [106, 270], [98, 276.6, 'c'], [90, 272]]);
      const strapL = 'M 127 170 C 124 186 122.6 202 122 222', strapR = mir(strapL);
      return [{ z: 3, svg: piece(bag, '#2E4A8C', { gloss: ['M 92 212 C 90 228 90 244 91 256'], glossOp: .4, lines: [{ d: 'M 89 236 Q 98 233 107 236', c: '#C9CDD6', w: 1.2, o: .9 }] }) + piece(pocket, '#2A4280', { lines: [{ d: 'M 90 248 L 105 248', c: '#C9CDD6', dash: '1.2 1', o: .9 }] }) },
        { z: 45, svg: strap(strapL, '#2E4A8C', 2.6) + strap(strapR, '#2E4A8C', 2.6) + `<rect x="120" y="206" width="5.6" height="4" rx="1" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".7"/><rect x="174.4" y="206" width="5.6" height="4" rx="1" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".7"/>` }];
    }
  },
  {
    id: 'a33', cat: 'acc', name: '焦糖皮质斜挎包', thumb: '96 160 90 170', isNew: true,
    parts() {
      /* 斜挎：带子从右肩斜穿过胸前，包贴在左胯前面 */
      const bag = spline([[134, 280, 'c'], [106, 282, 'c'], [104.6, 300], [106.4, 314, 'c'], [134.6, 313, 'c'], [136.4, 298]]);
      const flap = spline([[134.4, 280.4, 'c'], [106.4, 282.4, 'c'], [106.4, 296], [120, 300.6, 'c'], [134.6, 295]]);
      const sd = 'M 172 170 C 162 200 142 246 132 281', sd2 = 'M 108 282 C 110 262 120 238 128 222';
      return [{ z: 46, svg: strap(sd, '#8A5634', 2.2) + piece(bag, '#8A5634', { folds: ['M 113 300 Q 114 306 112 312'] }) + piece(flap, '#9A6440', { lines: [{ d: 'M 108.6 285 Q 120 288.4 132.6 284.4', c: '#E0B98A', dash: '1.4 1', o: .9 }] }) +
        `<circle cx="120" cy="297" r="1.9" fill="#D9B45A" stroke="${INK}" stroke-width=".7"/><rect x="129.4" y="276.6" width="5.4" height="5.4" rx="1" fill="none" stroke="#D9B45A" stroke-width="1.2"/>` }];
    }
  },
  {
    id: 'a34', cat: 'acc', name: '红点帆布托特包', thumb: '180 318 80 100', isNew: true,
    parts() {
      /* 手提：提手挂在右手里（画在手的后面，手指正好握住），包身垂在腿边 */
      const bag = spline([[196, 352, 'c'], [238, 352, 'c'], [241, 380], [240, 408, 'c'], [194, 408, 'c'], [193, 380]]);
      const dots = [[202, 362], [216, 358], [230, 364], [206, 378], [222, 382], [234, 392], [200, 396], [214, 400], [228, 404]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#E0413C"/>`).join('');
      return [{ z: 9.6, svg: strap('M 202 353 C 204 330 226 328 228 353', '#FFF8EE', 2.4) + strap('M 207 353 C 208 334 222 333 223 353', '#E9DED2', 1.6) + piece(bag, '#FFF8EE', { under: dots, folds: ['M 214 362 Q 218 384 214 404'] }) }];
    }
  },
  {
    id: 'a28', cat: 'acc', name: '条纹报童帽', thumb: '88 36 124 84', isNew: true,
    parts: () => {
      const crown = spline([[104.8, 97, 'c'], [103.2, 81], [110, 66.6], [124, 56.4], [140, 51.2], [157, 50.8], [173, 53.6], [186.6, 61.4], [195.4, 74], [197.4, 88], [195.6, 97, 'c']]);
      const brim = spline([[106.4, 92.4, 'c'], [128, 88.6], [150, 87.6], [172, 88.6], [193.6, 92.4, 'c'], [189, 102.6], [170, 100.2], [150, 99.6], [130, 100.2], [111, 102.6]]);
      return [{ z: 56, svg: piece(crown, 'url(#pat-stripetaupe)', { folds: ['M 150 52 C 138 60 130 72 126 90', 'M 150 52 C 162 60 170 72 174 90', 'M 150 52 C 146 66 146 78 148 90'], foldOp: .55 }) + piece(brim, '#B9A58F', { deep: [brim] }) + btn(150, 52, '#B9A58F', 2.4) + rosette(126, 74, .72, '#9ED9CF', '#E0413C') }];
    }
  },
  {
    id: 'a29', cat: 'acc', name: '灰色波点鸭舌帽', thumb: '88 36 124 84', isNew: true,
    parts: () => {
      const crown = spline([[106, 96, 'c'], [106.6, 80], [113, 66], [124, 57], [137, 52], [150, 51], [163, 52], [176, 57], [187, 66], [193.4, 80], [194, 96, 'c']]);
      const brim = spline([[108, 92, 'c'], [150, 84.6], [192, 92, 'c'], [196, 100], [184, 104], [150, 101], [116, 104], [104, 100]]);
      return [{ z: 56, svg: piece(crown, 'url(#pat-greydots)', { folds: ['M 150 52 C 144 64 144 78 147 90', 'M 150 52 C 164 62 172 76 174 90'] }) + piece(brim, '#8C8584', { deep: [brim], lines: [{ d: 'M 110 97 Q 150 90.6 190 97', c: '#fff', dash: '1.4 1.2', o: .7, w: .7 }] }) + star5(178, 72, 5.2, '#E0413C', 1) }];
    }
  },
  {
    id: 'a30', cat: 'acc', name: '粉色棒球帽', thumb: '88 36 124 84', isNew: true,
    parts: () => {
      const crown = spline([[105.4, 99, 'c'], [105.8, 80], [112.6, 65.6], [124, 56], [137, 51], [150, 50], [163, 51], [176, 56], [187.4, 65.6], [194.2, 80], [194.6, 99, 'c']]);
      const brim = spline([[102, 95, 'c'], [150, 86.6], [198, 95, 'c'], [202, 103.6], [186, 110], [150, 106.4], [114, 110], [98, 103.6]]);
      return [{ z: 56, svg: piece(crown, '#F9C9DA', { folds: ['M 150 51 C 148 64 148 78 149 94', 'M 150 51 C 132 58 124 72 122 94', 'M 150 51 C 168 58 176 72 178 94'] }) + `<circle cx="150" cy="51.4" r="2.4" fill="#F9C9DA" stroke="${INK}" stroke-width=".9"/>` +
        piece(brim, '#F4B2C9', { lines: [{ d: 'M 106 100 Q 150 92.6 194 100', c: '#fff', dash: '1.6 1.2', o: .75, w: .7 }] }) + `<rect x="139" y="68" width="22" height="12" rx="2.4" fill="#9ED9CF" stroke="${INK}" stroke-width="1"/><rect x="142.6" y="71" width="14.8" height="6" rx="1.4" fill="#DFF4EF" stroke="${INK}" stroke-width=".6"/>` }];
    }
  },
  {
    id: 'a35', cat: 'acc', name: '波点猫耳兜帽', thumb: '84 30 132 150', isNew: true,
    parts: () => {
      const outer = symS([[150, 52], [134, 53.6], [120, 59], [109, 69], [102, 83], [98.6, 100], [98, 120], [99.8, 140], [104, 156], [111, 168], [122, 175], [136, 177.4], [150, 178]]);
      const hole = symS([[150, 82], [136, 83.6], [124, 88], [116.4, 96], [113, 108], [112.8, 124], [115.6, 139], [122, 150], [133, 157.6], [150, 160.6]]);
      const ear = 'M 108 76 L 104.4 44 L 132 58 Z', inner = 'M 111 70 L 109.2 52 L 124 60 Z';
      const rim = line([[150, 82], [136, 83.6], [124, 88], [116.4, 96], [113, 108], [112.8, 124], [115.6, 139], [122, 150], [133, 157.6], [150, 160.6], [167, 157.6], [178, 150], [184.4, 139], [187.2, 124], [187, 108], [183.6, 96], [176, 88], [164, 83.6], [150, 82]]);
      return [{ z: 56, svg: piece(ear, 'url(#pat-blackdots)', {}) + piece(mir(ear), 'url(#pat-blackdots)', {}) + `<path d="${inner}" fill="#F7A9C4" stroke="${INK}" stroke-width=".8"/><path d="${mir(inner)}" fill="#F7A9C4" stroke="${INK}" stroke-width=".8"/>` +
        piece(outer + ' ' + hole, 'url(#pat-blackdots)', { evenodd: true, folds: ['M 110 110 Q 106 130 110 150', 'M 190 110 Q 194 130 190 150'] }) + `<path d="${rim}" fill="none" stroke="#F4F0EC" stroke-width="1.2" stroke-dasharray="2 1.4" transform="translate(0 -1.6) scale(1 1)"/>` }];
    }
  },
  {
    id: 'a31', cat: 'acc', name: '三角发夹', thumb: '104 74 56 36', isNew: true,
    parts: () => [{ z: 58, svg: `<path d="M 116 92 L 126 84 L 128 96 Z" fill="#E0413C" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/><path d="M 118.8 91 L 124.8 86.6 L 126 93.4 Z" fill="none" stroke="#FFD6D6" stroke-width=".8"/>` +
      `<path d="M 125 100 L 136 94 L 136 105 Z" fill="#6FC8BC" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/><path d="M 128 99.6 L 134 96.4 L 134 102.4 Z" fill="none" stroke="#DFF4EF" stroke-width=".8"/>` }]
  },
  {
    id: 'a32', cat: 'acc', name: '粉色花朵长耳坠', thumb: '100 128 100 40', isNew: true,
    parts: () => [{ z: 51, svg: [113.4, 186.6].map(x => `<path d="M ${x} 140 L ${x} 150" stroke="#C9CDD6" stroke-width=".9"/>` + (() => { let s = ''; for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; s += `<ellipse cx="${f1(x + Math.cos(a) * 3.4)}" cy="${f1(156 + Math.sin(a) * 3.4)}" rx="1.6" ry="3.6" transform="rotate(${f1(a * 180 / Math.PI + 90)} ${f1(x + Math.cos(a) * 3.4)} ${f1(156 + Math.sin(a) * 3.4)})" fill="#F7A9C4" stroke="${INK}" stroke-width=".6"/>`; } return s; })() + `<circle cx="${x}" cy="156" r="1.3" fill="#FFE27A" stroke="${INK}" stroke-width=".5"/>`).join('') }]
  },
  {
    id: 'a36', cat: 'acc', name: '银色手表', thumb: '196 296 30 30', isNew: true,
    parts: () => { const y = 311, xo = 300 - armO(y) + 1.2, xi = 300 - armI(y) - 1.2; return [{ z: 56, svg: `<path d="M ${f1(xi)} ${y - 2.4} L ${f1(xo)} ${y - 1.4} L ${f1(xo + .2)} ${y + 3} L ${f1(xi)} ${y + 2}" fill="url(#grad-chrome)" stroke="${INK}" stroke-width=".8"/><circle cx="${f1((xo + xi) / 2 + 1)}" cy="${y + .3}" r="3.4" fill="#F4F6FA" stroke="${INK}" stroke-width=".9"/><path d="M ${f1((xo + xi) / 2 + 1)} ${y + .3} l 0 -2.2 M ${f1((xo + xi) / 2 + 1)} ${y + .3} l 1.6 .6" stroke="${INK}" stroke-width=".6"/>` }]; }
  },
  {
    id: 'a37', cat: 'acc', name: '花结徽章', thumb: '112 196 36 44', isNew: true,
    parts: () => [{ z: 58, svg: rosette(128, 212, 1, '#9ED9CF', '#F48FB1') }]
  }
);
