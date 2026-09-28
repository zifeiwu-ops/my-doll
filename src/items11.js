/* ---------- 新袜子 / 鞋 / 配饰 · 美式松弛 / 复古森系 / 90s 古着辣妹 ---------- */
const HATS11 = ['a38', 'a43', 'a44', 'a45', 'a46', 'a51', 'a55', 'a56', 'a57'];
const crewSock = (id, name, top, c, band, pat) => ({
  id, cat: 'legs', name, thumb: `100 ${top - 10} 100 ${590 - top + 10}`, isNew: true,
  parts() {
    const one = m => {
      const M = M_(m), d = legWrapD(top, 1.5, [[128, top - 2.6]]);
      const b = spline([[legO(top) - 1.8, top, 'c'], [128, top - 3], [legI(top) + 1.8, top - .6, 'c'], [legI(top + 9) + 1.8, top + 8.6, 'c'], [128, top + 6], [legO(top + 9) - 1.8, top + 9.4, 'c']]);
      return piece(M(d), pat || c, { folds: [M(`M 121 ${top + 30} Q 128 ${top + 33} 136 ${top + 30}`)] }) + piece(M(b), band, { rim: false, lines: [{ d: M(ribLines(legO(top + 4) - 1, legI(top + 4) + 1, top - 2, top + 9, 2.4)), o: .35, w: .6 }] });
    };
    return [{ z: 15, svg: both(one) }];
  }
});
const tights = (id, name, fill) => ({ id, cat: 'legs', name, thumb: '96 290 108 300', isNew: true, parts() { const one = m => piece(M_(m)(legWrapD(290, 1.1, [[150, 292.4]])), fill, { rim: [2.4, 1.4] }); return [{ z: 15, svg: both(one) }]; } });
const crossbody = (id, name, c, deco) => ({
  id, cat: 'acc', name, thumb: '150 250 60 70', isNew: true,
  parts() {
    const bag = spline([[168, 276, 'c'], [196, 276, 'c'], [197, 294], [194, 306, 'c'], [170, 306, 'c'], [167, 294]]);
    const flap = spline([[168.4, 276.4, 'c'], [195.6, 276.4, 'c'], [195, 288], [182, 292, 'c'], [169, 288]]);
    return [{ z: 46, svg: strap('M 128 170 C 146 204 164 244 172 278', c, 1.8) + piece(bag, c, { folds: ['M 176 292 Q 178 300 176 304'] }) + piece(flap, c, { deep: [flap] }) + deco }];
  }
});
EXTRA.push(
  /* ---------- 袜子 ---------- */
  crewSock('l7', '白色罗纹中筒袜', 496, '#FBFAF6', '#F2EEE6'),
  crewSock('l9', '墨绿中筒袜', 500, '#2E5A3A', '#264C30'),
  {
    id: 'l8', cat: 'legs', name: '芥末黄堆堆袜', thumb: '104 460 92 130', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), ease = y => 2 + (y < 540 ? Math.sin((y - 480) / 60 * Math.PI * 3) * 1.1 + 1.8 : 0);
        const pts = []; rng(482, 572, 18).forEach(y => pts.push([legO(y) - ease(y), y]));
        pts.push([121, 577.6]); pts.push([128, 581.4]); pts.push([138.4, 581.2]); pts.push([145.4, 577]);
        rng(570, 482, 18).forEach(y => pts.push([legI(y) + ease(y), y])); pts.push([128, 478.6]);
        const rings = [490, 502, 514, 526].map(y => `M ${f1(legO(y) - 2)} ${y} Q 128 ${y + 4} ${f1(legI(y) + 2)} ${y}`);
        return piece(M(spline(pts)), 'url(#pat-mustardrib)', { folds: rings.map(M), foldOp: .6 });
      };
      return [{ z: 15, svg: both(one) }];
    }
  },
  tights('l10', '橙色连裤袜', '#D9642A'),
  /* ---------- 鞋 ---------- */
  {
    id: 's11', cat: 'shoes', name: '红色细带凉鞋', thumb: '100 530 100 64', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), c = '#C8323C';
        return piece(M(soleD(579.4, 4.6, 2.4)), '#B8282F', { rim: false }) +
          strap(M(`M ${f1(legO(564) - 1.6)} 564 Q 130 559.6 ${f1(legI(564) + 1.8)} 563.4`), c, 1.6) + strap(M('M 118.6 573.6 Q 132 569.6 147 573.2'), c, 1.5) +
          strap(M(`M ${f1(legO(546) - 1)} 546 Q 128 550.4 ${f1(legI(546) + 1)} 545.6`), c, 1.3) + `<circle cx="${f1(X_(m)(legI(546) + 1.4))}" cy="545.8" r="1.1" fill="#E9C86A" stroke="${INK}" stroke-width=".5"/>`;
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's12', cat: 'shoes', name: '黑色芭蕾平底鞋', thumb: '100 530 100 64', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        return piece(M(shoeUpperD(560, 2.4, 7)), '#2A2628', { rim: false, over: `<path d="${M(liningD(560, 2.4, 7))}" fill="#E9D8D2" stroke="${INK}" stroke-width=".8"/>`, gloss: [M('M 121 572 Q 123 567 127 565')], glossW: 2.4, glossOp: .5 }) +
          `<g transform="translate(${f1(X(131))} 564.4) scale(.36)"><path d="M 0 0 C -6 -6 -12 -4 -11 1 C -10 5 -4 4 0 1 C 4 4 10 5 11 1 C 12 -4 6 -6 0 0 Z" fill="#2A2628" stroke="#8A8286" stroke-width="1.6"/></g>` +
          piece(M(soleD(580, 4.6, 2.4)), '#1E1A1C', { rim: false });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's13', cat: 'shoes', name: '棕色系带牛津鞋', thumb: '100 524 100 80', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        const lace = [0, 1].map(i => { const y = 555 + i * 5.4; return `M ${X(126)} ${y} L ${X(135)} ${y + 3.4} M ${X(135)} ${y} L ${X(126)} ${y + 3.4}`; }).join(' ');
        return piece(M(shoeUpperD(550, 2.8, 5)), '#7A4A30', { over: `<path d="${M(liningD(550, 2.8, 5))}" fill="#D9B894" stroke="${INK}" stroke-width=".8"/>`, lines: [{ d: M('M 119 572 Q 131 566.4 146 572'), o: .6 }, { d: M('M 119.6 574.4 Q 131 569 145.4 574.4'), c: '#C9986E', dash: '1.2 1', o: .9 }], gloss: [M('M 121 574 Q 123 568 128 566')] }) +
          `<path d="${lace}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="${lace}" stroke="#E6CBA4" stroke-width="1.1" stroke-linecap="round"/>` + piece(M(soleD(580, 8, 3.4)), '#3A2A22', { rim: false });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's14', cat: 'shoes', name: '棕色麂皮短靴', thumb: '100 500 100 104', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m);
        return piece(M(shoeUpperD(514, 3.6, 3)), '#7A5236', { folds: [M('M 121 530 Q 128 533 137 530'), M('M 121 546 Q 129 549 137 546')], fc: '#4E3222', lines: [{ d: M(`M ${f1(legO(518) - 3)} 518.6 Q 129 522 ${f1(legI(518) + 3)} 518.6`), o: .5 }] }) + piece(M(soleD(579, 10, 4)), '#3A2A22', { rim: false });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's15', cat: 'shoes', name: '焦糖毛边雪地靴', thumb: '96 500 108 104', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        const fluff = spline(wavy([[legO(524) - 6, 522], [legO(520) - 4, 514], [128, 511], [legI(520) + 4, 514], [legI(524) + 6, 522], [legI(532) + 5, 532], [128, 529], [legO(532) - 5, 532]], 1.6, 8).map((p, i) => [p[0], p[1], i % 4 === 0 ? 'c' : undefined]));
        const lace = [0, 1, 2].map(i => { const y = 540 + i * 7; return `M ${X(125.4)} ${y} L ${X(135.6)} ${y + 4} M ${X(135.6)} ${y} L ${X(125.4)} ${y + 4}`; }).join(' ');
        return piece(M(shoeUpperD(526, 4.4, 2)), '#C07A48', { lines: [{ d: M('M 118 568 C 124 560 138 560 145 568'), c: '#F6E4CA', dash: '1.4 1.2', w: .9, o: .95 }] }) +
          `<path d="${lace}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/><path d="${lace}" stroke="#7A4A2E" stroke-width="1.1" stroke-linecap="round"/>` +
          piece(M(fluff), '#F6ECDC', { rim: [1.4, 1.2] }) + piece(M(soleD(579, 11, 4.6)), '#6A4A34', { rim: false });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  /* ---------- 配饰 ---------- */
  {
    id: 'a38', cat: 'acc', name: '白色宽发箍', thumb: '96 50 108 70', isNew: true,
    parts: () => [{ z: 56, svg: `<path d="${BAND_ARC}" fill="none" stroke="${INK}" stroke-width="10.4" stroke-linecap="round"/><path d="${BAND_ARC}" fill="none" stroke="#F8F2E8" stroke-width="8" stroke-linecap="round"/><path d="${BAND_ARC}" fill="none" stroke="#E4D8C8" stroke-width="3" stroke-linecap="round" transform="translate(1 1.6)" opacity=".7"/><path d="M 114 94 C 119 81 131 73.6 145 72.6" fill="none" stroke="#fff" stroke-width="1.4" opacity=".9" stroke-linecap="round"/>` }]
  },
  {
    id: 'a39', cat: 'acc', name: '金属细框眼镜', thumb: '114 108 72 34', isNew: true,
    parts: () => [{ z: 57, svg: [132.4, 167.6].map(cx => `<ellipse cx="${cx}" cy="125" rx="11.2" ry="7.6" fill="#EEF4FA" opacity=".2"/><ellipse cx="${cx}" cy="125" rx="11.2" ry="7.6" fill="none" stroke="#B89A58" stroke-width="1.1"/><path d="M ${cx - 7} 121 L ${cx - 3.6} 119.8" stroke="#fff" stroke-width=".9" stroke-linecap="round" opacity=".8"/>`).join('') +
      `<path d="M 143.6 122.6 Q 150 120 156.4 122.6" fill="none" stroke="#B89A58" stroke-width="1"/><path d="M 121.2 122 L 113.4 119.4 M 178.8 122 L 186.6 119.4" stroke="#B89A58" stroke-width="1" stroke-linecap="round"/>` }]
  },
  {
    id: 'a40', cat: 'acc', name: '圆框玳瑁眼镜', thumb: '110 104 80 70', isNew: true,
    parts: () => [{ z: 57, svg: [133, 167].map(cx => `<circle cx="${cx}" cy="125" r="10" fill="#FFF6E6" opacity=".18"/><circle cx="${cx}" cy="125" r="10" fill="none" stroke="${INK}" stroke-width="3.2"/><circle cx="${cx}" cy="125" r="10" fill="none" stroke="#7A4A2E" stroke-width="1.8" stroke-dasharray="3 1.6"/><path d="M ${cx - 6} 120 L ${cx - 3} 118.6" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".8"/>`).join('') +
      `<path d="M 143 122.4 Q 150 119.6 157 122.4" fill="none" stroke="${INK}" stroke-width="2"/><path d="M 123 122 L 113.4 119.4 M 177 122 L 186.6 119.4" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>` +
      `<path d="M 113.6 120 C 110 140 116 160 128 170 M 186.4 120 C 190 140 184 160 172 170" fill="none" stroke="#D9B45A" stroke-width=".8" stroke-dasharray="1.2 .7"/>` }]
  },
  {
    id: 'a41', cat: 'acc', name: '白色领巾', thumb: '120 146 60 90', isNew: true,
    parts: () => {
      const wrap = spline([[139, 154], [150, 158.4], [161, 154], [163.4, 160], [161.6, 166, 'c'], [150, 170], [138.4, 166, 'c'], [136.6, 160]]);
      const t1 = spline([[141, 165], [134, 178], [128, 198, 'c'], [134.4, 199], [138, 184], [144, 168]]), t2 = spline([[144, 166], [142, 182], [140.6, 206, 'c'], [146, 205], [146.4, 186], [147.6, 168]]);
      return [{ z: 57, svg: piece(t1, '#F6F0E4', { folds: ['M 138 176 Q 134 186 132 194'] }) + piece(t2, '#F6F0E4', {}) + piece(wrap, '#F6F0E4', { folds: ['M 140 160 Q 150 164 160 160'] }) + `<ellipse cx="143" cy="167" rx="4" ry="3.2" fill="#F6F0E4" stroke="${INK}" stroke-width="1"/>` }];
    }
  },
  {
    id: 'a42', cat: 'acc', name: '西部银扣皮带', thumb: '100 270 100 40', isNew: true,
    parts: () => [{ z: 31, svg: piece(spline([[111, 284, 'c'], [150, 290.6], [189, 284, 'c'], [189, 291, 'c'], [150, 297.6], [111, 291, 'c']]), '#221E20', { rim: false, gloss: ['M 116 287.4 Q 130 291 142 292'], glossOp: .3, lines: [{ d: 'M 113 285.8 Q 150 292.4 187 285.8 M 113 289.4 Q 150 296 187 289.4', c: '#6A6266', dash: '1.2 1', w: .5, o: .9 }] }) +
      `<ellipse cx="150" cy="291.8" rx="7.6" ry="5.4" fill="url(#grad-chrome)" stroke="${INK}" stroke-width="1"/><ellipse cx="150" cy="291.8" rx="4.4" ry="2.8" fill="none" stroke="#8C94A6" stroke-width=".8"/><path d="M 146 291.8 L 154 291.8" stroke="${INK}" stroke-width=".9"/>` }]
  },
  {
    id: 'a47', cat: 'acc', name: '棕色皮质旅行袋', thumb: '40 318 90 90', isNew: true,
    parts: () => {
      /* 手提：提手在左手里，袋身垂在手下面 */
      const bag = spline([[56, 356, 'c'], [110, 352, 'c'], [116, 376], [112, 400, 'c'], [60, 404, 'c'], [52, 380]]);
      const handle = 'M 68 356 C 70 326 98 324 100 354';
      return [{ z: 9.6, svg: strap(handle, '#6A3E26', 2.6) + piece(bag, '#8A5634', { gloss: ['M 60 366 Q 58 380 62 394'], glossOp: .45, folds: ['M 84 362 Q 86 380 84 400'], lines: [{ d: 'M 56 368 Q 84 360 112 366', c: '#E0B98A', dash: '1.4 1', o: .9 }] }) +
        `<rect x="79" y="355" width="10" height="7" rx="1.4" fill="#D9B45A" stroke="${INK}" stroke-width=".8"/>` }];
    }
  },
  {
    id: 'a48', cat: 'acc', name: '复古皮质腰包', thumb: '110 262 80 50', isNew: true,
    parts: () => {
      const pouch = spline([[126, 278, 'c'], [154, 277, 'c'], [155, 292], [151, 302, 'c'], [129, 302, 'c'], [125, 292]]);
      const flap = spline([[126.4, 278, 'c'], [153.6, 277.4, 'c'], [153, 288], [140, 293, 'c'], [127, 289]]);
      return [{ z: 46, svg: piece(spline([[110, 272, 'c'], [150, 278], [190, 272, 'c'], [190, 278, 'c'], [150, 284], [110, 278, 'c']]), '#6A3E26', { rim: false }) + piece(pouch, '#8A5634', { gloss: ['M 130 290 Q 130 296 132 300'] }) + piece(flap, '#9A6440', { deep: [flap], lines: [{ d: 'M 128 280 Q 140 283 152 280', c: '#E0B98A', dash: '1.2 1', o: .9 }] }) + `<circle cx="140" cy="289" r="1.8" fill="#D9B45A" stroke="${INK}" stroke-width=".7"/>` }];
    }
  },
  {
    id: 'a43', cat: 'acc', name: '橙色三角头巾', thumb: '86 40 128 140', isNew: true,
    parts: () => {
      const outer = symS([[150, 52], [134, 53.6], [120, 59], [109, 69], [102, 84], [99, 102], [99.6, 124], [103, 142], [110, 156], [122, 164], [136, 167], [150, 168]]);
      const hole = symS([[150, 90], [136, 91.4], [124, 95], [116.4, 102], [113.4, 114], [113.4, 128], [116, 141], [122.4, 151.4], [133, 157.6], [150, 160.4]]);
      const knot = `<path d="M 146 164 L 140 180 L 146 178 L 148 182 Z M 154 164 L 160 180 L 154 178 L 152 182 Z" fill="url(#pat-orangescarf)" stroke="${INK}" stroke-width=".9"/><ellipse cx="150" cy="165" rx="4.6" ry="3.8" fill="#E0782C" stroke="${INK}" stroke-width="1"/>`;
      return [{ z: 56, svg: piece(outer + ' ' + hole, 'url(#pat-orangescarf)', { evenodd: true, folds: ['M 108 100 Q 104 124 110 148', 'M 192 100 Q 196 124 190 148', 'M 130 64 Q 136 76 134 88', 'M 170 64 Q 164 76 166 88'] }) + knot }];
    }
  },
  {
    id: 'a44', cat: 'acc', name: '刺绣渔夫帽', thumb: '84 36 132 84', isNew: true,
    parts: () => {
      const crown = spline([[112, 90, 'c'], [112.6, 72], [122, 58], [136, 51.4], [150, 50.4], [164, 51.4], [178, 58], [187.4, 72], [188, 90, 'c']]);
      const brim = spline([[110.4, 84, 'c'], [150, 80], [189.6, 84, 'c'], [200, 100], [202, 108, 'c'], [150, 101], [98, 108, 'c'], [100, 100]]);
      const emb = `<path d="M 124 76 C 132 66 142 72 150 64 C 158 72 168 66 176 76" fill="none" stroke="#E6D2B0" stroke-width="1.1" stroke-linecap="round"/>` + [[130, 68], [150, 60], [170, 68]].map(([x, y]) => flower(x, y, 2.2, '#E6D2B0')).join('');
      return [{ z: 56, svg: piece(brim, '#6A4A3A', { lines: [{ d: 'M 104 102 Q 150 94 196 102', c: '#E6D2B0', dash: '1.4 1.2', o: .8, w: .7 }] }) + piece(crown, '#6A4A3A', { over: emb, folds: ['M 138 54 Q 134 70 136 86'] }) }];
    }
  },
  {
    id: 'a45', cat: 'acc', name: '藤编复古圆帽', thumb: '84 30 132 84', isNew: true,
    parts: () => {
      const dome = spline([[106, 94, 'c'], [106.6, 72], [118, 54], [134, 45.6], [150, 44], [166, 45.6], [182, 54], [193.4, 72], [194, 94, 'c']]);
      const band = spline([[104.4, 88, 'c'], [150, 82], [195.6, 88, 'c'], [196.4, 100, 'c'], [150, 94.4], [103.6, 100, 'c']]);
      const weave = [0, 1, 2, 3, 4, 5, 6].map(i => { const x = 112 + i * 12.6; return `M ${f1(x)} ${f1(92 - Math.sin(i / 6 * Math.PI) * 4)} Q ${f1(150 + (x - 150) * .5)} 56 150 45`; }).join(' ') + ' M 112 74 Q 150 62 188 74 M 108 84 Q 150 74 192 84 M 124 58 Q 150 50 176 58';
      return [{ z: 56, svg: piece(dome, '#C08A52', { lines: [{ d: weave, c: '#8A5A30', w: .8, o: .8 }] }) + piece(band, '#9A6A3A', { lines: [{ d: rng(106, 194, 16).map(x => `M ${f1(x)} 88 L ${f1(x + 2)} 99`).join(' '), c: '#6A4222', w: .7, o: .7 }] }) }];
    }
  },
  {
    id: 'a46', cat: 'acc', name: '酒红贝雷帽', thumb: '90 34 132 76', isNew: true,
    parts: () => {
      const b = spline([[108, 90, 'c'], [106, 72], [116, 58], [134, 50], [156, 47.6], [178, 50], [194, 60], [198, 74], [192, 86], [176, 90], [150, 88]]);
      return [{ z: 56, svg: piece(b, '#7A1E2A', { folds: ['M 118 80 Q 140 70 170 72', 'M 182 64 Q 188 72 186 82'], gloss: ['M 124 62 Q 140 54 158 54'], glossOp: .35 }) + `<path d="M 156 48 L 157 42.4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M 156 48 L 157 42.4" stroke="#7A1E2A" stroke-width="1.6" stroke-linecap="round"/>` }];
    }
  },
  crossbody('a49', '芥末黄毛呢斜挎包', '#D9A636', `<rect x="178" y="292" width="6" height="4" rx=".8" fill="#FBF3DE" stroke="${INK}" stroke-width=".6"/>`),
  crossbody('a50', '草绿毛毡斜挎包', '#9CB852', `<rect x="180" y="288" width="3" height="8" rx="1.4" fill="#C9A06A" stroke="${INK}" stroke-width=".7"/><path d="M 181.5 286 L 181.5 290" stroke="${INK}" stroke-width=".8"/>`),
  {
    id: 'a51', cat: 'acc', name: '钩针发带', thumb: '96 50 108 70', isNew: true,
    parts: () => [{ z: 56, svg: `<path d="${BAND_ARC}" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="${BAND_ARC}" fill="none" stroke="#7A4A36" stroke-width="9.6" stroke-linecap="round"/><path d="${BAND_ARC}" fill="none" stroke="#A8745A" stroke-width="2.4" stroke-dasharray=".1 3.6" stroke-linecap="round"/><path d="${BAND_ARC}" fill="none" stroke="#5A3222" stroke-width="7" stroke-dasharray="1 2.6" opacity=".45"/>` }]
  },
  {
    id: 'a52', cat: 'acc', name: '多层串珠项链', thumb: '124 150 52 80', isNew: true,
    parts: () => {
      const beads = (y, w, sag, cols, n) => { let s = chain(y, w, sag, '#C9A86A', .6); for (let i = 1; i < n; i++) { const t = i / n, x = 150 - w + 2 * w * t, yy = y + sag * 2 * t * (1 - t) * 2 * .5 * 2; s += `<circle cx="${f1(x)}" cy="${f1(y + (sag) * 4 * t * (1 - t) * .5)}" r="1" fill="${cols[i % cols.length]}" stroke="${INK}" stroke-width=".35"/>`; } return s; };
      return [{ z: 56, svg: beads(160, 8.6, 8, ['#E6849A', '#F2D27A', '#8FC4D8'], 7) + beads(161, 10.6, 22, ['#8A5A3A', '#E6C25C', '#6FBF52', '#C84A56'], 10) + beads(162, 12, 38, ['#F2E6C8', '#E07A3A', '#8FC4D8'], 12) + chain(163, 13, 56, '#D5DAE2') +
        `<path d="${heartD(150, 184, 2.8)}" fill="#E6849A" stroke="${INK}" stroke-width=".6"/><ellipse cx="150" cy="193.6" rx="2.2" ry="3" fill="#6FB4A8" stroke="${INK}" stroke-width=".6"/><path d="M 150 203 L 152.4 208 L 150 213 L 147.6 208 Z" fill="#D9B45A" stroke="${INK}" stroke-width=".6"/><circle cx="150" cy="219.4" r="2.6" fill="#C84A56" stroke="${INK}" stroke-width=".6"/>` }];
    }
  },
  {
    id: 'a53', cat: 'acc', name: '金色链条腰带', thumb: '100 284 100 50', isNew: true,
    parts: () => {
      const links = rng(108, 192, 28).map(x => { const y = 298 + 5 * (1 - Math.pow((x - 150) / 42, 2)); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="1.8" ry="1.2" fill="none" stroke="${INK}" stroke-width="1.6"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="1.8" ry="1.2" fill="none" stroke="#E6C25C" stroke-width=".9"/>`; }).join('');
      const tail = [0, 1, 2, 3, 4].map(i => `<ellipse cx="${f1(116 - i * .8)}" cy="${f1(304 + i * 3.4)}" rx="1.2" ry="1.7" fill="none" stroke="#E6C25C" stroke-width=".9"/>`).join('');
      return [{ z: 46, svg: links + tail + `<circle cx="113" cy="322" r="1.8" fill="#E6C25C" stroke="${INK}" stroke-width=".6"/>` }];
    }
  },
  {
    id: 'a54', cat: 'acc', name: '棕色针织臂套', thumb: '66 240 60 90', isNew: true,
    parts: () => {
      const one = m => {
        const M = M_(m), pts = [];
        rng(252, 316, 8).forEach(y => pts.push([armO(y) - 2.2 - (y > 300 ? (y - 300) * .15 : 0), y]));
        rng(316, 252, 8).forEach(y => pts.push([armI(y) + 2 + (y > 300 ? (y - 300) * .1 : 0), y]));
        const rings = [262, 276, 290].map(y => `M ${f1(armO(y) - 1.6)} ${y} Q ${f1((armO(y) + armI(y)) / 2)} ${y + 2.6} ${f1(armI(y) + 1.6)} ${y}`);
        return piece(M(spline(pts)), 'url(#pat-brownlace)', { folds: rings.map(M), foldOp: .5 });
      };
      return [{ z: 45, svg: both(one) }];
    }
  },
  {
    id: 'a55', cat: 'acc', name: '碎花发带', thumb: '96 50 108 70', isNew: true,
    parts: () => [{ z: 56, svg: `<path d="${BAND_ARC}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/><path d="${BAND_ARC}" fill="none" stroke="url(#pat-yellowfloral)" stroke-width="8.6" stroke-linecap="round"/><path d="M 108.4 112 C 108 124 104 132 100 140 M 110 112 C 112 124 112 134 110 142" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/><path d="M 108.4 112 C 108 124 104 132 100 140 M 110 112 C 112 124 112 134 110 142" fill="none" stroke="#EDC45A" stroke-width="2" stroke-linecap="round"/>` }]
  },
  {
    id: 'a56', cat: 'acc', name: '薄荷碎花头巾', thumb: '84 46 132 80', isNew: true,
    parts: () => {
      const scarf = spline([[106.4, 100, 'c'], [107, 84], [113, 71.4], [124, 62.2], [138, 57.2], [152, 56.2], [166, 58.4], [178, 64.2], [187, 73.2], [192.6, 84.4], [193.6, 100, 'c'], [180, 94.6], [166, 91], [150, 90], [134, 91], [120, 94.6]]);
      return [{ z: 56, svg: piece(scarf, 'url(#pat-mintfloral)', { folds: ['M 128 70 Q 134 80 132 90', 'M 170 70 Q 168 82 166 90', 'M 150 60 Q 150 74 150 88'] }) + `<ellipse cx="190" cy="100" rx="4" ry="3.2" fill="#8FC4A6" stroke="${INK}" stroke-width=".9"/>` }];
    }
  },
  {
    id: 'a57', cat: 'acc', name: '米色麻花毛线帽', thumb: '90 32 120 90', isNew: true,
    parts: () => {
      const cap = spline([[106.4, 96, 'c'], [106, 76], [112, 58], [124, 46.4], [140, 40.6], [158, 40.6], [174, 46], [186, 58], [193.2, 76], [193.6, 96, 'c']]);
      const brim = spline([[104.4, 88.4, 'c'], [127, 83.2], [150, 81.8], [173, 83.2], [195.6, 88.4, 'c'], [196.4, 105.4, 'c'], [173, 100.2], [150, 98.8], [127, 100.2], [103.6, 105.4, 'c']]);
      const ribs = Array.from({ length: 21 }, (_, i) => { const x = 106 + i * 4.4, s = 3.6 * Math.sin((x - 104) / 92 * Math.PI); return `M ${f1(x)} ${f1(88.6 - s)} L ${f1(x)} ${f1(104.4 - s)}`; }).join(' ');
      const cable = [124, 150, 176].map(x => `M ${x - 3} 48 Q ${x + 3} 55 ${x - 3} 62 Q ${x + 3} 69 ${x - 3} 76 Q ${x + 3} 83 ${x - 3} 86 M ${x + 3} 48 Q ${x - 3} 55 ${x + 3} 62 Q ${x - 3} 69 ${x + 3} 76 Q ${x - 3} 83 ${x + 3} 86`).join(' ');
      return [{ z: 56, svg: piece(cap, '#EFE3CE', { lines: [{ d: cable, o: .45, w: .8 }] }) + piece(brim, '#EFE3CE', { lines: [{ d: ribs, o: .4, w: .8 }] }) }];
    }
  },
  {
    id: 'a58', cat: 'acc', name: '古着花布斜挎包', thumb: '96 160 90 180', isNew: true,
    parts() {
      const bag = spline([[136, 282, 'c'], [104, 284, 'c'], [102, 304], [104, 322, 'c'], [136, 321, 'c'], [138, 302]]);
      const fr = [106, 111, 116, 121, 126, 131, 135].map(x => `M ${x} 322 L ${x - .6} 331`).join(' ');
      return [{ z: 46, svg: strap('M 172 170 C 160 202 144 248 134 283', '#7A3A2E', 2.2) + piece(bag, 'url(#pat-tapestry)', { folds: ['M 120 290 Q 122 306 120 318'], lines: [{ d: 'M 106 290 Q 120 286 134 290', c: '#E6C79A', dash: '1.4 1', o: .9 }] }) +
        `<path d="${fr}" stroke="#D9A24C" stroke-width="1.2" stroke-linecap="round"/>` }];
    }
  },
  {
    id: 'a59', cat: 'acc', name: '串珠手链叠戴', thumb: '70 296 40 40', isNew: true,
    parts: () => [{ z: 56, svg: ['#E6849A', '#F2D27A', '#8FC4D8', '#C9A86A'].map((c, i) => { const y = 306 + i * 3.4, x0 = armO(y) - 1.6, x1 = armI(y) + 1.6; return `<path d="M ${f1(x0)} ${f1(y)} Q ${f1((x0 + x1) / 2)} ${f1(y + 2.4)} ${f1(x1)} ${f1(y + .6)}" fill="none" stroke="${INK}" stroke-width="2.8" stroke-linecap="round"/><path d="M ${f1(x0)} ${f1(y)} Q ${f1((x0 + x1) / 2)} ${f1(y + 2.4)} ${f1(x1)} ${f1(y + .6)}" fill="none" stroke="${c}" stroke-width="1.8" stroke-dasharray="1.6 .6" stroke-linecap="round"/>`; }).join('') }]
  }
);
