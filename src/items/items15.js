/* ---------- 新袜子 / 鞋 / 小物 · 糖果装饰风 ---------- */
/* 腿套：毛绒款边缘一团团鼓起，罗纹款是一圈圈堆起来的褶 */
function warmerItem(id, name, fillL, fillR, fluffy) {
  return {
    id, cat: 'legs', slot: 'warmer', name, thumb: '98 404 104 164', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), fill = m ? fillR : fillL;
        const ease = y => (fluffy ? 6.2 : 4.6) + Math.sin((y - 420) / 130 * Math.PI) * 2.4 + Math.sin(y / 5.5) * .7;
        let pts = [[legO(424) - (fluffy ? 6 : 4.6), 424, 'c']]; rng(434, 552, 14).forEach(y => pts.push([legO(y) - ease(y), y]));
        pts.push([legO(558) - 5.6, 560, 'c'], [130, 564], [legI(558) + 6, 559, 'c']);
        rng(550, 432, 14).forEach(y => pts.push([legI(y) + ease(y) * .72, y])); pts.push([legI(424) + (fluffy ? 5 : 3.6), 424, 'c']);
        pts.push([129, 420]);
        const d = fluffy ? spline(wavy(pts, 1.5, 22)) : spline(pts);
        const rings = rng(440, 548, fluffy ? 6 : 9).map(y => `M ${f1(legO(y) - ease(y) + 1)} ${f1(y)} Q ${128} ${f1(y + 3.8)} ${f1(legI(y) + ease(y) * .72 - 1)} ${f1(y - .6)}`);
        return piece(M(d), fill, { folds: rings.map(M), foldOp: fluffy ? .28 : .42, rim: [4.5, 2.5] });
      };
      return [{ z: 42, svg: both(one) }];
    }
  };
}
/* 厚底：比普通鞋底高一截 */
const chunkySole = (y0, h, c, stripe) => piece(soleD(y0, h, 5.2), c, { rim: false, lines: stripe ? [{ d: `M 113.4 ${y0 + h * .45} L 151.6 ${y0 + h * .45}`, c: stripe, w: 1.6, o: .95 }] : [] });
const barrette = (x, y, rot, c, w = 9) => `<g transform="rotate(${rot} ${x} ${y})"><rect x="${f1(x - w / 2)}" y="${f1(y - 1.6)}" width="${w}" height="3.2" rx="1.6" fill="${c}" stroke="${STYLE.line}" stroke-width=".6"/><path d="M ${f1(x - w / 2 + 1.4)} ${f1(y - .6)} L ${f1(x + w / 2 - 2.6)} ${f1(y - .6)}" stroke="#FFFFFF" stroke-width=".7" stroke-linecap="round" opacity=".8"/></g>`;
const bead = (x, y, r, c) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${c}" stroke="${STYLE.line}" stroke-width=".5"/><circle cx="${f1(x - r * .35)}" cy="${f1(y - r * .38)}" r="${f1(r * .3)}" fill="#FFFFFF" opacity=".75"/>`;
const CANDY = ['#F48FB1', '#FFD460', '#8FD0F2', '#9EDBB0', '#C9AEF0', '#FF9A6A'];
const miniStar = (x, y, r, c) => { let p = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .46 : r; p += `${i ? 'L' : 'M'} ${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)} `; } return `<path d="${p}Z" fill="${c}" stroke="${STYLE.line}" stroke-width=".5" stroke-linejoin="round"/>`; };
EXTRA.push(
  /* ---------- 袜子 / 腿套 ---------- */
  warmerItem('l14', '白色毛绒腿套', 'url(#pat-fuzzwhite)', 'url(#pat-fuzzwhite)', true),
  warmerItem('l15', '粉色罗纹堆堆腿套', 'url(#pat-ribpink15)', 'url(#pat-ribpink15)', false),
  warmerItem('l16', '黑色毛绒腿套', 'url(#pat-fuzzblack)', 'url(#pat-fuzzblack)', true),
  warmerItem('l17', '粉薄荷拼色腿套', 'url(#pat-ribpink15)', 'url(#pat-ribmint15)', false),
  crewSock('l18', '彩虹条纹中筒袜', 470, '#F7A8C4', '#FFFFFF', 'url(#pat-rainbowstripe)'),

  /* ---------- 鞋 ---------- */
  {
    id: 's19', cat: 'shoes', name: '粉色厚底凉拖', thumb: '100 530 100 70', isNew: true,
    parts() {
      const one = m => { const M = M_(m);
        return piece(M(soleD(575, 16, 5.4)), '#9EDBB0', { rim: false, lines: [{ d: M('M 113 583 L 152 583'), c: '#F48FB1', w: 2.2, o: .95 }] }) +
          piece(M(`M ${f1(legO(560) - 3)} 559 Q 130 554 ${f1(legI(560) + 3)} 558.4 L ${f1(legI(568) + 4.4)} 568 Q 130 564 ${f1(legO(568) - 4.4)} 568.6 Z`), '#F48FB1', { rim: [2, 1.2] }) +
          piece(M(`M 118 571.6 Q 132 567.4 148 571 L 148.6 576.6 Q 132 573 117.4 577 Z`), '#F48FB1', { rim: [2, 1.2] }) + `<circle cx="131" cy="562" r="1.4" fill="#FFE27A" stroke="${STYLE.line}" stroke-width=".5"/>`;
      };
      return [{ z: 40, svg: both(m => m ? `<g transform="translate(300 0) scale(-1 1)">${one(false)}</g>` : one(false)) }];
    }
  },
  {
    id: 's20', cat: 'shoes', name: '黑色扣带厚底靴', thumb: '96 462 108 142', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m);
        const strapAt = y => piece(M(`M ${f1(legO(y) - 4.4)} ${y} Q 130 ${y + 3} ${f1(legI(y) + 4.4)} ${y - .4} L ${f1(legI(y + 5) + 4.4)} ${y + 4.6} Q 130 ${y + 8} ${f1(legO(y + 5) - 4.4)} ${y + 5} Z`), '#1E1A1C', { rim: false }) +
          `<rect x="${f1(m ? 300 - legI(y) - 6 : legI(y) + 1)}" y="${y - 1.4}" width="5" height="6.6" rx="1" fill="none" stroke="#D6DAE2" stroke-width="1.3"/>`;
        return piece(M(shoeUpperD(476, 4.2, 2)), '#2E2A2C', { rim: [3, 1.6], sheen: [M('M 121 488 C 120 510 121 540 124 566')], sheenOp: .25, sheenW: 2.6 }) +
          strapAt(492) + strapAt(512) + strapAt(532) + piece(M(soleD(576, 20, 5.8)), '#2A2628', { rim: false, lines: [{ d: M('M 112 584 L 153 584 M 112 590 L 153 590'), c: '#5A5256', w: 1, o: .9 }] });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  {
    id: 's21', cat: 'shoes', name: '奶油毛绒雪地靴', thumb: '94 486 112 118', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), pts = [];
        rng(500, 570, 8).forEach(y => pts.push([legO(y) - 7.4 - (y - 500) * .02, y]));
        pts.push([115, 578], [132, 582], [148.6, 577]);
        rng(568, 500, 8).forEach(y => pts.push([legI(y) + 7 + (y - 500) * .02, y]));
        pts.push([130, 496]);
        return piece(M(spline(wavy(pts, 1.6, 16))), 'url(#pat-fuzzwhite)', { folds: [M('M 116 530 Q 130 534 144 529'), M('M 115 552 Q 130 556 146 551')], foldOp: .3 }) + piece(M(soleD(578, 11, 5)), '#F4B6CC', { rim: false });
      };
      return [{ z: 40, svg: both(one) }];
    }
  },
  { id: 's22', cat: 'shoes', name: '彩色厚底老爹鞋', thumb: '100 520 100 84', isNew: true, parts: () => [{ z: 40, svg: both(m => sneaker('#FFFFFF', '#F48FB1', '#8FD0F2', '#FFD460')(m) + `<path d="${M_(m)('M 119 571 Q 132 575 146 571')}" fill="none" stroke="#9EDBB0" stroke-width="2" stroke-linecap="round"/>`) }] },

  /* ---------- 发饰 ---------- */
  { id: 'a77', cat: 'acc', sub: 'hairacc', name: '彩色发夹一堆', thumb: '100 70 60 50', isNew: true, parts: () => [{ z: 58, svg: barrette(121, 96, -58, '#F48FB1') + barrette(126, 90, -40, '#FFD460') + barrette(132, 86, -22, '#8FD0F2') + barrette(117.6, 104, -76, '#9EDBB0', 8) + miniStar(138, 84, 3.2, '#FFE27A') }] },
  { id: 'a78', cat: 'acc', sub: 'hairacc', name: '星星爱心发夹', thumb: '150 70 60 50', isNew: true, parts: () => [{ z: 58, svg: `<path d="${heartD(174, 88, 3.6)}" fill="#E8454F" stroke="${STYLE.line}" stroke-width=".6"/>` + miniStar(181, 96, 3.6, '#8FD0F2') + barrette(168, 84, 18, '#C9AEF0', 8) + barrette(183.6, 104, 70, '#FF9A6A', 8) }] },
  { id: 'a79', cat: 'acc', sub: 'hairacc', name: '丸子蝴蝶结发绳', thumb: '96 40 108 50', isNew: true, parts: () => [{ z: 58, svg: ribbonBow(128, 72, .5, '#8FD0F2', 1) + ribbonBow(172, 72, .5, '#8FD0F2', 1) }] },
  { id: 'a80', cat: 'acc', sub: 'hairacc', name: '樱桃发圈', thumb: '100 60 100 40', isNew: true, parts: () => [{ z: 58, svg: [128, 172].map(x => bead(x - 2.6, 78, 2.6, '#E8454F') + bead(x + 2.6, 79, 2.6, '#E8454F') + `<path d="M ${x - 2.6} 75.6 Q ${x} 72 ${x + 2.6} 76.6" fill="none" stroke="#6FAE5A" stroke-width=".9"/>`).join('') }] },
  /* ---------- 贴纸 / 创可贴 ---------- */
  { id: 'a81', cat: 'acc', sub: 'deco', head: true, name: '脸颊星星贴纸', thumb: '118 124 64 26', isNew: true, parts: () => [{ z: 51, svg: miniStar(129.4, 139, 2.4, '#FFE27A') + miniStar(133.6, 142.4, 1.5, '#8FD0F2') + miniStar(170.6, 139, 2.4, '#F48FB1') + `<circle cx="166.4" cy="142.2" r=".9" fill="#9EDBB0" stroke="${STYLE.line}" stroke-width=".4"/>` }] },
  { id: 'a88', cat: 'acc', sub: 'deco', name: '膝盖创可贴', thumb: '100 410 100 50', isNew: true, parts: () => [{ z: 14, svg: [[126, 428, -20], [174.6, 440, 16]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})"><rect x="${x - 7}" y="${y - 2.6}" width="14" height="5.2" rx="2.6" fill="#F6D2B4" stroke="${STYLE.line}" stroke-width=".55"/><rect x="${x - 2.4}" y="${y - 2}" width="4.8" height="4" rx=".8" fill="#FBE8D6"/><circle cx="${x - 4.6}" cy="${y}" r=".4" fill="#D9A888"/><circle cx="${x + 4.6}" cy="${y}" r=".4" fill="#D9A888"/></g>`).join('') }] },
  { id: 'a94', cat: 'acc', sub: 'deco', head: true, name: '眼角水钻贴', thumb: '114 116 72 22', isNew: true, parts: () => [{ z: 51, svg: [[121.4, 128.4, '#8FD0F2'], [123.4, 131.8, '#F48FB1'], [178.6, 128.4, '#8FD0F2'], [176.6, 131.8, '#F48FB1']].map(([x, y, c]) => `<path d="M ${x} ${y - 1.4} L ${x + 1.2} ${y} L ${x} ${y + 1.4} L ${x - 1.2} ${y} Z" fill="${c}" stroke="#FFFFFF" stroke-width=".4"/>`).join('') }] },
  /* ---------- 颈饰 ---------- */
  { id: 'a82', cat: 'acc', sub: 'neck', name: '彩色串珠项链', thumb: '124 146 52 40', isNew: true, parts: () => [{ z: 56, svg: arcPts(160, 13, 6.6, 12).map(([x, y], i) => bead(x, y, i % 3 === 1 ? 2 : 1.6, CANDY[i % CANDY.length])).join('') + `<path d="${heartD(150, 176.4, 2.6)}" fill="#F48FB1" stroke="${STYLE.line}" stroke-width=".5"/>` }] },
  { id: 'a83', cat: 'acc', sub: 'neck', name: '爱心锁项圈', thumb: '130 140 40 40', isNew: true, parts: () => [{ z: 56, svg: `<path d="M 141.6 153 Q 150 157.6 158.4 153 L 158.4 157.4 Q 150 162 141.6 157.4 Z" fill="#2C272A" stroke="${STYLE.line}" stroke-width=".6"/><path d="M 147.6 161 a 2.4 2.4 0 0 1 4.8 0" fill="none" stroke="#D6DAE2" stroke-width="1"/><path d="${heartD(150, 166, 3.6)}" fill="#F48FB1" stroke="${STYLE.line}" stroke-width=".6"/><circle cx="150" cy="165.6" r=".7" fill="${STYLE.line}"/>` }] },
  /* ---------- 手饰 ---------- */
  {
    id: 'a84', cat: 'acc', sub: 'hand', name: '粉色毛绒臂套', thumb: '66 240 60 90', isNew: true,
    parts: () => { const one = m => { const M = M_(m), pts = []; rng(262, 318, 8).forEach(y => pts.push([armO(y) - 4 - (y - 262) * .03, y])); rng(318, 262, 8).forEach(y => pts.push([armI(y) + 3.6 + (y - 262) * .02, y]));
      return piece(M(spline(wavy(pts, 1.3, 14))), 'url(#pat-fuzzpink)', { folds: [270, 290, 306].map(y => M(`M ${f1(armO(y) - 2)} ${y} Q ${f1((armO(y) + armI(y)) / 2)} ${y + 2.6} ${f1(armI(y) + 2)} ${y}`)), foldOp: .25 }); };
      return [{ z: 45, svg: both(one) }]; }
  },
  {
    id: 'a85', cat: 'acc', sub: 'hand', name: '薄荷条纹针织臂套', thumb: '66 240 60 90', isNew: true,
    parts: () => { const one = m => { const M = M_(m), pts = []; rng(258, 318, 8).forEach(y => pts.push([armO(y) - 2.6 - (y > 300 ? (y - 300) * .16 : 0), y])); rng(318, 258, 8).forEach(y => pts.push([armI(y) + 2.4 + (y > 300 ? (y - 300) * .1 : 0), y]));
      const st = [268, 282].map(y => M(`M ${f1(armO(y) - 2.4)} ${y} Q ${f1((armO(y) + armI(y)) / 2)} ${y + 2.4} ${f1(armI(y) + 2.2)} ${y}`));
      return piece(M(spline(pts)), 'url(#pat-ribmint15)', { lines: st.map(d => ({ d, c: '#D6BDF0', w: 3.2, o: .95 })) }); };
      return [{ z: 45, svg: both(one) }]; }
  },
  { id: 'a86', cat: 'acc', sub: 'hand', name: '糖果串珠手链', thumb: '70 300 40 30', isNew: true, parts: () => [{ z: 56, svg: [false, true].map(m => [314, 318].map((y, j) => { const x0 = armO(y) - 1.2, x1 = armI(y) + 1.2; return Array.from({ length: 6 }, (_, i) => { const x = x0 + (x1 - x0) * (i + .5) / 6; return bead(m ? 300 - x : x, y + Math.sin((i + .5) / 6 * Math.PI) * 1.4, 1.35, CANDY[(i + j * 2) % CANDY.length]); }).join(''); }).join('')).join('') }] },
  /* ---------- 腰饰 ---------- */
  {
    id: 'a87', cat: 'acc', sub: 'waist', name: '彩色链条腰带', thumb: '100 276 100 50', isNew: true,
    parts: () => { const links = Array.from({ length: 22 }, (_, i) => { const t = i / 21, x = outerX(292) - 3 + (300 - 2 * (outerX(292) - 3)) * t, y = 292 + 5 * Math.sin(t * Math.PI); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="2" ry="1.2" fill="none" stroke="#C9CDD6" stroke-width="1" transform="rotate(${f1((t - .5) * -26)} ${f1(x)} ${f1(y)})"/>`; }).join('');
      return [{ z: 34, svg: links + `<path d="M 170 296 L 171 304" stroke="#C9CDD6" stroke-width=".9"/>` + miniStar(171, 307, 3, '#FFE27A') + `<path d="M 162 297 L 162.4 303" stroke="#C9CDD6" stroke-width=".9"/><path d="${heartD(162.6, 305.4, 2.4)}" fill="#F48FB1" stroke="${STYLE.line}" stroke-width=".5"/>` }]; }
  },
  /* ---------- 包包 ---------- */
  {
    id: 'a89', cat: 'acc', sub: 'bag', name: '草莓斜挎小包', thumb: '140 160 80 150', isNew: true,
    parts: () => {
      const bag = 'M 181 280 C 170 280 166 290 169 300 C 172 310 178 316 181 318 C 184 316 190 310 193 300 C 196 290 192 280 181 280 Z';
      const seeds = [[176, 290], [185, 290], [180, 298], [174, 302], [188, 302], [181, 308]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx=".8" ry="1.2" fill="#FFE9A8"/>`).join('');
      return [{ z: 46, svg: strap('M 128 170 C 146 204 164 246 178 280', '#F48FB1', 1.6) + piece(bag, '#E8454F', { over: seeds }) + `<path d="M 173 282 L 177 276 L 181 281 L 185 276 L 189 282 Q 181 286 173 282 Z" fill="#7CC46A" stroke="${STYLE.line}" stroke-width=".6"/>` }];
    }
  },
  {
    id: 'a90', cat: 'acc', sub: 'bag', name: '毛绒手提小包', thumb: '46 318 80 80', isNew: true,
    parts: () => { const bag = spline(wavy([[62, 362], [86, 358], [108, 362], [110, 382], [106, 396], [84, 400], [62, 396], [58, 380], [62, 362]], 1.2, 10).slice(0, -1));
      return [{ z: 9.6, svg: strap('M 72 362 C 72 334 98 332 98 360', '#C9AEF0', 2) + piece(bag, 'url(#pat-fuzzmint)', {}) + ribbonBow(84, 368, .5, '#F48FB1', 0) }]; }
  },
  /* ---------- 耳饰 ---------- */
  { id: 'a91', cat: 'acc', sub: 'ear', name: '糖果圆珠耳环', thumb: '100 128 100 44', isNew: true, parts: () => [{ z: 51, svg: [[113.6, '#FFD460', '#F48FB1'], [186.4, '#8FD0F2', '#9EDBB0']].map(([x, a, b]) => `<path d="M ${x} 140.4 L ${x} 144" stroke="#C9CDD6" stroke-width=".8"/>` + bead(x, 146.4, 2.2, a) + bead(x, 151.4, 2.8, b)).join('') }] },
  { id: 'a92', cat: 'acc', sub: 'ear', name: '星星耳坠', thumb: '100 128 100 44', isNew: true, parts: () => [{ z: 51, svg: [113.6, 186.4].map(x => `<path d="M ${x} 140.4 L ${x} 145" stroke="#C9CDD6" stroke-width=".8"/>` + miniStar(x, 149, 3.4, '#FFE27A')).join('') }] },
  /* ---------- 眼镜 ---------- */
  { id: 'a93', cat: 'acc', sub: 'glasses', name: '椭圆小墨镜', thumb: '114 110 72 30', isNew: true, parts: () => [{ z: 57, svg: [133, 167].map(cx => `<ellipse cx="${cx}" cy="124.6" rx="10" ry="5.6" fill="#2C272A" stroke="${STYLE.line}" stroke-width=".9"/><path d="M ${cx - 6} 122.4 Q ${cx - 3} 120.6 ${cx} 121" fill="none" stroke="#8A8288" stroke-width="1.1" stroke-linecap="round"/>`).join('') + `<path d="M 143 123.4 Q 150 121.4 157 123.4 M 123 123.4 L 115.6 121.4 M 177 123.4 L 184.4 121.4" fill="none" stroke="#2C272A" stroke-width="1.2" stroke-linecap="round"/>` }] }
);
