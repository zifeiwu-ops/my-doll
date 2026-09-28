/* ---------- 新袜子 / 鞋 / 小物 · Coquette 芭蕾甜心 ---------- */
const HATS13 = ['a76'];
const pearl = (x, y, r) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="url(#grad-pearl)" stroke="${STYLE.line}" stroke-width=".6"/>`;
/* 沿锁骨的弧线（项链用）：depth 越大垂得越低 */
const neckArc = (y, w, depth) => `M ${150 - w} ${y} Q 150 ${y + depth * 2} ${150 + w} ${y}`;
const arcPts = (y, w, depth, n) => Array.from({ length: n }, (_, i) => { const t = (i + .5) / n, x = 150 - w + 2 * w * t; return [x, y + depth * 2 * (2 * t * (1 - t))]; });
EXTRA.push(
  /* ---------- 袜子 ---------- */
  {
    id: 'l11', cat: 'legs', name: '蕾丝花边短袜', thumb: '100 520 100 80', isNew: true,
    parts() {
      const top = 540, one = m => { const M = M_(m), d = legWrapD(top, 1.4, [[128, top - 2.4]]);
        const fr = []; for (let i = 0; i <= 6; i++) { const x = legO(top) - 2 + (legI(top) - legO(top) + 4) * i / 6; fr.push([x, top - 1 + (i % 2 ? 2.4 : 0)]); }
        return piece(M(d), '#FFFDF8', { rim: [2, 1.2] }) + laceRow(fr.map(p => (m ? [300 - p[0], p[1]] : p)), 1.9, '#FFFDF8', true) + ribbonBow(m ? 300 - (legO(top) + 3) : legO(top) + 3, top + 4, .3, '#F4A7C0', 0); };
      return [{ z: 15, svg: both(one) }];
    }
  },
  {
    id: 'l12', cat: 'legs', name: '蝴蝶结白色过膝袜', thumb: '96 390 108 210', isNew: true,
    parts() {
      const top = 404, one = m => { const M = M_(m), d = legWrapD(top, 1.3, [[128, top - 2.6]]), X = X_(m);
        const band = spline([[legO(top) - 1.6, top, 'c'], [128, top - 3], [legI(top) + 1.6, top - .6, 'c'], [legI(top + 7) + 1.6, top + 6.6, 'c'], [128, top + 4], [legO(top + 7) - 1.6, top + 7.4, 'c']]);
        return piece(M(d), '#FBFAF6', { folds: [M('M 120 470 Q 126 472 134 470'), M('M 122 520 Q 128 522 134 520')] }) + piece(M(band), '#F4F0EA', { rim: false }) + ribbonBow(X(legO(top) + 5), top + 2, .42, '#F4A7C0', 1); };
      return [{ z: 15, svg: both(one) }];
    }
  },
  tights('l13', '透肤裸粉丝袜', 'rgba(236,190,186,.42)'),

  /* ---------- 鞋 ---------- */
  {
    id: 's16', cat: 'shoes', name: '粉色缎带芭蕾鞋', thumb: '100 500 100 104', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m), c = '#F6C1CF';
        const rb = [`M ${f1(legO(566) - .6)} 566 L ${f1(legI(548) + .8)} 548`, `M ${f1(legI(566) + .6)} 565 L ${f1(legO(548) - .8)} 548`, `M ${f1(legO(548) - .6)} 548 L ${f1(legI(530) + .6)} 530`, `M ${f1(legI(548) + .6)} 548 L ${f1(legO(530) - .6)} 530`];
        return piece(M(shoeUpperD(560, 2.4, 7)), 'url(#grad-satinpink)', { rim: false, over: `<path d="${M(liningD(560, 2.4, 7))}" fill="#FBE3EA" stroke="${STYLE.line}" stroke-width=".7"/>`, sheen: [M('M 121 572 Q 124 566 130 565')], sheenOp: .6, sheenW: 2 }) +
          rb.map(d => strap(M(d), c, 1.3)).join('') + ribbonBow(X(legO(530) + 1), 529, .3, c, 1) + piece(M(soleD(580, 4.4, 2.4)), '#E8A9B9', { rim: false });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's17', cat: 'shoes', name: '奶油色蝴蝶结玛丽珍', thumb: '100 524 100 80', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m), c = '#FFF6EC';
        const strapD = spline([[legO(552) - 3, 552, 'c'], [130, 556.4], [legI(552) + 3, 551.6, 'c'], [legI(556.6) + 3.1, 556.4, 'c'], [130, 561], [legO(556.6) - 3.1, 556.8, 'c']]);
        return piece(M(shoeUpperD(548, 2.8, 6)), c, { over: `<path d="${M(liningD(548, 2.8, 6))}" fill="#F2E4DE" stroke="${STYLE.line}" stroke-width=".8"/>`, gloss: [M('M 121 572 Q 123 566 128 564')], glossOp: .7 }) +
          piece(M(strapD), c, {}) + pearl(X(139.4), 557, 1.4) + ribbonBow(X(131), 569, .36, '#F4A7C0', 0) + piece(M(soleD(580, 8, 3.4)), '#D9C2AE', {});
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's18', cat: 'shoes', name: '樱桃红漆皮平底鞋', thumb: '100 530 100 64', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        return piece(M(shoeUpperD(560, 2.4, 7)), '#9E2230', { rim: false, over: `<path d="${M(liningD(560, 2.4, 7))}" fill="#E9CFC8" stroke="${STYLE.line}" stroke-width=".8"/>`, gloss: [M('M 121 572 Q 123 567 127 565'), M('M 138 574 Q 142 572 145 573')], glossW: 2.2, glossOp: .6 }) +
          ribbonBow(X(131), 565, .3, '#7E1826', 0) + piece(M(soleD(580, 4.6, 2.4)), '#5A121A', { rim: false });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },

  /* ---------- 发饰 ---------- */
  {
    id: 'a60', cat: 'acc', sub: 'hairacc', name: '粉色缎带大蝴蝶结', thumb: '100 26 100 80', isNew: true,
    parts: () => [{ z: 1.5, svg: `<g transform="translate(150 60) scale(2.1)">${ribbonBow(0, 0, 1, 'url(#grad-satinpink)', 1).replace(/^<g transform="translate\(0 0\) scale\(1\)">/, '<g>')}</g>` }]
  },
  {
    id: 'a61', cat: 'acc', sub: 'hairacc', name: '黑丝绒小蝴蝶结一对', thumb: '100 70 100 50', isNew: true,
    parts: () => [{ z: 58, svg: ribbonBow(117, 94, .58, '#2A2226', 1) + ribbonBow(183, 94, .58, '#2A2226', 1) }]
  },
  {
    id: 'a62', cat: 'acc', sub: 'hairacc', name: '白色蕾丝发带', thumb: '96 54 108 70', isNew: true,
    parts: () => [{ z: 56, svg: `<path d="${BAND_ARC}" fill="none" stroke="${STYLE.line}" stroke-width="6.8" stroke-linecap="round"/><path d="${BAND_ARC}" fill="none" stroke="#FFFDF8" stroke-width="4.8" stroke-linecap="round"/>` +
      laceRow(bandPts(22).map(([x, y]) => [x, y]), 1.3, '#FFFDF8', true) }]
  },
  {
    id: 'a63', cat: 'acc', sub: 'hairacc', name: '珍珠发夹一排', thumb: '104 74 60 44', isNew: true,
    parts: () => [{ z: 58, svg: [[118, 90], [121.4, 86.6], [125.4, 84], [129.8, 82.2]].map(([x, y], i) => `<path d="M ${x - 2.6} ${y + 3.4} L ${x + 2.6} ${y - 3.4}" stroke="#D9B45A" stroke-width="1.1" stroke-linecap="round"/>` + pearl(x, y, i % 2 ? 1.9 : 2.3)).join('') }]
  },
  /* ---------- 帽子 ---------- */
  {
    id: 'a76', cat: 'acc', sub: 'hat', name: '缎带草编宽檐帽', thumb: '64 26 172 100', isNew: true,
    parts: () => {
      const brim = 'M 74 98 C 70 84 104 78 150 78 C 196 78 230 84 226 98 C 222 108 190 110 150 110 C 110 110 78 108 74 98 Z';
      const crown = spline([[111, 92, 'c'], [110, 72], [120, 56], [150, 52], [180, 56], [190, 72], [189, 92, 'c']]);
      const weave = [96, 104, 112].map(y => `M 84 ${y - 6} Q 150 ${y + 4} 216 ${y - 6}`).join(' ');
      return [{ z: 1.2, svg: piece('M 74 98 C 70 84 104 78 150 78 C 196 78 230 84 226 98 L 190 96 C 170 94 130 94 110 96 Z', '#E9D3A6', { rim: false }) },
        { z: 59, svg: piece(brim, '#EED9AE', { lines: [{ d: weave, c: '#C9A873', w: .7, o: .7, dash: '2 1.4' }] }) + piece(crown, '#EED9AE', { lines: [{ d: 'M 116 66 Q 150 60 184 66 M 112 80 Q 150 74 188 80', c: '#C9A873', w: .7, o: .6, dash: '2 1.4' }] }) +
          `<path d="M 110.6 86 Q 150 80 189.4 86 L 189.2 93 Q 150 87 110.8 93 Z" fill="#F4A7C0" stroke="${STYLE.line}" stroke-width=".9"/>` + ribbonBow(184, 90, .62, '#F4A7C0', 1) }];
    }
  },
  /* ---------- 耳饰 ---------- */
  {
    id: 'a64', cat: 'acc', sub: 'ear', name: '珍珠水滴耳坠', thumb: '100 128 100 44', isNew: true,
    parts: () => [{ z: 51, svg: [113.6, 186.4].map(x => `<circle cx="${x}" cy="140.4" r="1.4" fill="#E6C25C" stroke="${STYLE.line}" stroke-width=".5"/><path d="M ${x} 141.6 L ${x} 146" stroke="#D9B45A" stroke-width=".8"/>` + `<ellipse cx="${x}" cy="149.4" rx="2.6" ry="3.4" fill="url(#grad-pearl)" stroke="${STYLE.line}" stroke-width=".6"/>`).join('') }]
  },
  {
    id: 'a65', cat: 'acc', sub: 'ear', name: '爱心耳钉', thumb: '100 128 100 34', isNew: true,
    parts: () => [{ z: 51, svg: [113.6, 186.4].map(x => `<path d="${heartD(x, 141.4, 2.6)}" fill="#E0414F" stroke="${STYLE.line}" stroke-width=".6"/>`).join('') }]
  },
  {
    id: 'a66', cat: 'acc', sub: 'ear', name: '蝴蝶结珍珠耳坠', thumb: '100 128 100 44', isNew: true,
    parts: () => [{ z: 51, svg: [113.6, 186.4].map(x => ribbonBow(x, 142, .28, '#F4A7C0', 0) + `<path d="M ${x} 143.6 L ${x} 147" stroke="#D9B45A" stroke-width=".7"/>` + pearl(x, 149, 1.9)).join('') }]
  },
  /* ---------- 眼镜 ---------- */
  {
    id: 'a70', cat: 'acc', sub: 'glasses', name: '爱心粉色墨镜', thumb: '114 106 72 38', isNew: true,
    parts: () => [{ z: 57, svg: [133, 167].map(cx => `<path d="${heartD(cx, 124, 9.6)}" fill="#F48FB1" opacity=".5"/><path d="${heartD(cx, 124, 9.6)}" fill="none" stroke="#E0668F" stroke-width="1.6"/><path d="M ${cx - 6} 120 Q ${cx - 4} 117.6 ${cx - 1.4} 118" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".85"/>`).join('') +
      `<path d="M 143.4 121.6 Q 150 119.4 156.6 121.6" fill="none" stroke="#E0668F" stroke-width="1.3"/><path d="M 124 120 L 115.6 118.6 M 176 120 L 184.4 118.6" stroke="#E0668F" stroke-width="1.3" stroke-linecap="round"/>` }]
  },
  /* ---------- 颈饰 ---------- */
  {
    id: 'a67', cat: 'acc', sub: 'neck', name: '珍珠项链', thumb: '124 150 52 50', isNew: true,
    parts: () => [{ z: 56, svg: arcPts(163, 12.6, 7.4, 13).map(([x, y]) => pearl(x, y, 1.55)).join('') }]
  },
  {
    id: 'a68', cat: 'acc', sub: 'neck', name: '爱心吊坠锁骨链', thumb: '124 150 52 60', isNew: true,
    parts: () => [{ z: 56, svg: `<path d="${neckArc(162, 12.4, 10)}" fill="none" stroke="#E6C25C" stroke-width=".8"/><path d="${heartD(150, 184.6, 4.2)}" fill="#E6C25C" stroke="${STYLE.line}" stroke-width=".7"/><path d="M 147.4 182.6 Q 148 181 149.6 181" fill="none" stroke="#FFF3C8" stroke-width=".8" stroke-linecap="round"/>` }]
  },
  {
    id: 'a69', cat: 'acc', sub: 'neck', name: '丝带蝴蝶结颈链', thumb: '124 142 52 44', isNew: true,
    parts: () => [{ z: 56, svg: `<path d="M 142.4 154.2 Q 150 157.4 157.6 154.2" fill="none" stroke="${STYLE.line}" stroke-width="3.6" stroke-linecap="round"/><path d="M 142.4 154.2 Q 150 157.4 157.6 154.2" fill="none" stroke="#F4A7C0" stroke-width="2.2" stroke-linecap="round"/>` + ribbonBow(150, 156.8, .36, '#F4A7C0', 1) }]
  },
  /* ---------- 手饰 ---------- */
  {
    id: 'a71', cat: 'acc', sub: 'hand', name: '蕾丝短手套', thumb: '66 300 56 60', isNew: true,
    parts: () => {
      const one = m => { const pts = []; rng(316, 350, 6).forEach(y => pts.push([armO0(Math.min(y, 346)) - 1.1, y])); pts.push([(armO0(346) + armI0(346)) / 2, 353.6, 'c']); rng(350, 316, 6).forEach(y => pts.push([armI0(Math.min(y, 346)) + 1.1, y]));
        const d = spline(pts), fr = [[armO0(317) - 2.4, 316.6], [(armO0(317) + armI0(317)) / 2, 318.4], [armI0(317) + 2.4, 317.6]], M = M_(m);
        return piece(M(d), 'rgba(255,253,248,.72)', { rim: false, sw: .7, under: `<rect x="60" y="310" width="180" height="50" fill="url(#pat-lace)" opacity=".5"/>` }) + laceRow(fr.map(p => (m ? [300 - p[0], p[1]] : p)), 1.6, '#FFFDF8', true); };
      return [{ z: 56, svg: both(one) }];
    }
  },
  {
    id: 'a72', cat: 'acc', sub: 'hand', name: '珍珠手链', thumb: '70 300 40 30', isNew: true,
    parts: () => [{ z: 56, svg: [false, true].map(m => { const y = 316, x0 = armO(y) - 1.2, x1 = armI(y) + 1.2; return Array.from({ length: 6 }, (_, i) => { const x = x0 + (x1 - x0) * (i + .5) / 6; return pearl(m ? 300 - x : x, y + Math.sin((i + .5) / 6 * Math.PI) * 1.4, 1.35); }).join(''); }).join('') }]
  },
  /* ---------- 包包 ---------- */
  {
    id: 'a73', cat: 'acc', sub: 'bag', name: '蝴蝶结缎面手提包', thumb: '46 318 80 80', isNew: true,
    parts: () => {
      const bag = spline([[64, 360, 'c'], [106, 358, 'c'], [110, 380], [106, 396, 'c'], [64, 398, 'c'], [60, 380]]);
      return [{ z: 9.6, svg: strap('M 72 360 C 72 330 98 328 98 358', '#F4A7C0', 2.2) + piece(bag, 'url(#grad-satinpink)', { sheen: ['M 68 368 Q 66 380 69 392'], sheenOp: .6, folds: ['M 84 366 Q 86 380 84 394'] }) + ribbonBow(85, 364, .7, '#F4A7C0', 1) }];
    }
  },
  {
    id: 'a74', cat: 'acc', sub: 'bag', name: '爱心链条小包', thumb: '140 160 80 150', isNew: true,
    parts: () => {
      const bag = heartD(180, 292, 13.6), chainD = 'M 128 170 C 146 204 164 246 176 280';
      const links = Array.from({ length: 16 }, (_, i) => { const t = i / 15; const x = 128 + (176 - 128) * t + Math.sin(t * Math.PI) * 4, y = 170 + (280 - 170) * t; return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="1.3" ry="2" fill="none" stroke="#D9B45A" stroke-width=".8" transform="rotate(-24 ${f1(x)} ${f1(y)})"/>`; }).join('');
      return [{ z: 46, svg: links + piece(bag, '#F7B8C9', { sheen: ['M 170 284 Q 168 292 172 298'], sheenOp: .6, lines: [{ d: 'M 174 290 L 186 290', c: '#E0668F', w: .8, o: .5, dash: '1.2 1' }] }) + `<circle cx="180" cy="283" r="1.6" fill="#E6C25C" stroke="${STYLE.line}" stroke-width=".6"/>` }];
    }
  },
  /* ---------- 腰饰 ---------- */
  {
    id: 'a75', cat: 'acc', sub: 'waist', name: '缎带腰封蝴蝶结', thumb: '100 236 100 60', isNew: true,
    parts: () => {
      const sash = spline([[sideX(244) - 3.4, 243, 'c'], [150, 245.6], [300 - sideX(244) + 3.4, 243, 'c'], [300 - sideX(256) + 3.6, 255, 'c'], [150, 257.6], [sideX(256) - 3.6, 255, 'c']]);
      return [{ z: 34, svg: piece(sash, 'url(#grad-satinpink)', { rim: false, sheen: ['M 118 249 Q 150 253 182 249'], sheenOp: .55, sheenW: 2 }) + ribbonBow(124, 250, .78, '#F4A7C0', 1) }];
    }
  }
);
