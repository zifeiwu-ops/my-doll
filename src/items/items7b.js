/* ---------- 新配饰：千禧合租公寓系列 ---------- */
const bezPt = (p, t) => { const u = 1 - t; return [u * u * u * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t * t * t * p[3][0], u * u * u * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t * t * t * p[3][1]]; };
const BAND_ARC = 'M 108.4 112 C 108.4 84 126 68.4 150 68.4 C 174 68.4 191.6 84 191.6 112';
const bandPts = n => Array.from({ length: n }, (_, i) => { const t = i / (n - 1) * 2; return t <= 1 ? bezPt([[108.4, 112], [108.4, 84], [126, 68.4], [150, 68.4]], t) : bezPt([[150, 68.4], [174, 68.4], [191.6, 84], [191.6, 112]], t - 1); });
const bigBow = (x, y, s, c, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M 0 0 C -10 -12 -24 -10 -22 1 C -20 9 -9 8 0 2 C 9 8 20 9 22 1 C 24 -10 10 -12 0 0 Z" fill="${c}" stroke="${INK}" stroke-width="1.3"/><path d="M -17 -2 Q -14 -7 -8 -6 M 17 -2 Q 14 -7 8 -6" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".75"/><path d="M -2 2 L -8 16 L -3 14 L -1 18 Z M 2 2 L 8 16 L 3 14 L 1 18 Z" fill="${c}" stroke="${INK}" stroke-width="1.1"/><ellipse cx="0" cy="1" rx="3.4" ry="4" fill="${c}" stroke="${INK}" stroke-width="1.1"/></g>`;

EXTRA.push(
  {
    id: 'a12', cat: 'acc', name: '头纱 + 小皇冠', thumb: '80 44 140 150', isNew: true,
    parts() {
      const veil = symS([[150, 63], [133, 65], [118, 72], [106, 88], [98, 120], [92, 166], [87.6, 214], [85.4, 262], [88, 300, 'c'], [118, 306], [150, 308]]);
      const folds = ['M 118 90 C 108 140 100 200 96 290', 'M 128 80 C 122 140 118 200 116 300', 'M 106 110 C 98 170 92 230 90 296'].flatMap(d => [d, mir(d)]);
      let crown = 'M 134 70.6 L 134.6 62.6 L 139.6 66.6 L 144.6 58.4 L 150 64.4 L 155.4 58.4 L 160.4 66.6 L 165.4 62.6 L 166 70.6 Q 150 67.4 134 70.6 Z';
      return [
        { z: 3, svg: `<path d="${veil}" fill="#FFFFFF" opacity=".7"/><path d="${veil}" fill="url(#pat-lace)" opacity=".35"/><path d="${folds.join(' ')}" fill="none" stroke="#D6CCD2" stroke-width=".8" opacity=".9"/><path d="${veil}" fill="none" stroke="#B8AEB5" stroke-width="1"/>` },
        { z: 56, svg: `<path d="${crown}" fill="url(#grad-chrome)" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>` + [[134.6, 62.6], [144.6, 58.4], [155.4, 58.4], [165.4, 62.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#fff" stroke="${INK}" stroke-width=".6"/>`).join('') + `<circle cx="150" cy="66.4" r="1.9" fill="#F7A9C4" stroke="${INK}" stroke-width=".7"/>` }
      ];
    }
  },
  {
    id: 'a13', cat: 'acc', name: '大蝴蝶结发箍', thumb: '96 46 108 76', isNew: true,
    parts: () => [{ z: 56, svg: `<path d="${BAND_ARC}" fill="none" stroke="${INK}" stroke-width="6.6" stroke-linecap="round"/><path d="${BAND_ARC}" fill="none" stroke="#F48FB1" stroke-width="4.4" stroke-linecap="round"/><path d="M 114 94 C 119 81 131 73.6 145 72.6" fill="none" stroke="#fff" stroke-width="1" opacity=".6" stroke-linecap="round"/>` + bigBow(128, 72, .82, '#F48FB1', -18) }]
  },
  {
    id: 'a14', cat: 'acc', name: '珍珠发箍', thumb: '96 54 108 70', isNew: true,
    parts: () => [{ z: 56, svg: `<path d="${BAND_ARC}" fill="none" stroke="#D9D2C8" stroke-width="2"/>` + bandPts(19).map(([x, y], i) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${i % 2 ? 2.1 : 2.8}" fill="#FFFCF6" stroke="${INK}" stroke-width=".8"/><circle cx="${f1(x - .8)}" cy="${f1(y - .9)}" r=".7" fill="#fff"/>`).join('') }]
  },
  {
    id: 'a15', cat: 'acc', name: '格纹报童帽', thumb: '90 40 120 76', isNew: true,
    parts: () => {
      const crown = spline([[104.8, 97, 'c'], [103.2, 81], [110, 66.6], [124, 56.4], [140, 51.2], [157, 50.8], [173, 53.6], [186.6, 61.4], [195.4, 74], [197.4, 88], [195.6, 97, 'c']]);
      const brim = spline([[106.4, 92.4, 'c'], [128, 88.6], [150, 87.6], [172, 88.6], [193.6, 92.4, 'c'], [189, 102.6], [170, 100.2], [150, 99.6], [130, 100.2], [111, 102.6]]);
      const seams = ['M 150 52 C 138 60 130 72 126 90', 'M 150 52 C 162 60 170 72 174 90', 'M 150 52 C 146 66 146 78 148 90', 'M 150 52 C 126 60 112 72 108 90', 'M 150 52 C 174 60 188 72 192 90'];
      return [{ z: 56, svg: piece(crown, 'url(#pat-brownplaid)', { folds: seams, foldOp: .55 }) + piece(brim, 'url(#pat-brownplaid)', { deep: [brim], lines: [{ d: 'M 110 97 Q 150 92.6 190 97', dash: '1.6 1.3', o: .6, w: .7 }] }) + btn(150, 52, '#9E8474', 2.4) }];
    }
  },
  {
    id: 'a16', cat: 'acc', name: '黑框眼镜', thumb: '114 108 72 34', isNew: true,
    parts: () => [{ z: 57, svg: [132.4, 167.6].map(cx => `<rect x="${cx - 11.2}" y="117.6" width="22.4" height="14.6" rx="4" fill="#fff" opacity=".14"/><rect x="${cx - 11.2}" y="117.6" width="22.4" height="14.6" rx="4" fill="none" stroke="${INK}" stroke-width="2.6"/><rect x="${cx - 11.2}" y="117.6" width="22.4" height="14.6" rx="4" fill="none" stroke="#3A3236" stroke-width="1.4"/><path d="M ${cx - 7} 121 L ${cx - 3.6} 119.8" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity=".8"/>`).join('') +
      `<path d="M 143.6 121.6 Q 150 118.6 156.4 121.6" fill="none" stroke="${INK}" stroke-width="2"/><path d="M 121.2 121 L 113.4 118.6 M 178.8 121 L 186.6 118.6" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>` }]
  },
  {
    id: 'a17', cat: 'acc', name: '深色领带', thumb: '136 160 28 84', isNew: true,
    parts: () => {
      const knot = 'M 145.6 168.4 L 154.4 168.4 L 152.6 177.4 L 147.4 177.4 Z', blade = 'M 147.4 177 L 152.6 177 L 157 228 L 150 237 L 143 228 Z';
      return [{ z: 32, svg: piece(blade, '#2F3B5E', { lines: [{ d: 'M 146.6 190 L 154.4 184 M 145.4 204 L 155.8 196 M 144.4 218 L 156.8 208 M 144.6 229 L 156.4 220', c: '#8C93A8', w: 1.4, o: .9 }] }) + piece(knot, '#2F3B5E', { deep: [knot] }) }];
    }
  },
  {
    id: 'a18', cat: 'acc', name: '格纹围巾', thumb: '120 140 64 110', isNew: true,
    parts: () => {
      const wrap = spline([[138.8, 152.6], [150, 156.4], [161.2, 152.6], [166.4, 158.6], [165.6, 170.4, 'c'], [150, 176], [134.4, 170.4, 'c'], [133.6, 158.6]]);
      const end = spline([[152, 170], [163.4, 169], [165.6, 196], [167, 224, 'c'], [155.6, 226, 'c'], [154.6, 200]]);
      const fringe = Array.from({ length: 6 }, (_, i) => { const x = 156.4 + i * 2.1; return `M ${f1(x)} ${f1(225.4 - i * .3)} L ${f1(x + .3)} ${f1(230.4 - i * .3)}`; }).join(' ');
      return [{ z: 57, svg: piece(end, 'url(#pat-tartan)', { folds: ['M 158 184 Q 160 200 159 214'] }) + `<path d="${fringe}" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/><path d="${fringe}" stroke="#B8454E" stroke-width="1" stroke-linecap="round"/>` + piece(wrap, 'url(#pat-tartan)', { folds: ['M 138 160 Q 150 165 162 160', 'M 140 166 Q 150 170 160 166'] }) }];
    }
  },
  {
    id: 'a19', cat: 'acc', name: '大圈耳环', thumb: '100 118 100 40', isNew: true,
    parts: () => [{ z: 51, svg: [113, 187].map(x => `<circle cx="${x}" cy="143.4" r="5.4" fill="none" stroke="${INK}" stroke-width="2.8"/><circle cx="${x}" cy="143.4" r="5.4" fill="none" stroke="#EBC766" stroke-width="1.5"/><path d="M ${x - 3.6} 140.4 A 5.4 5.4 0 0 1 ${x} 138" fill="none" stroke="#FFF6D0" stroke-width=".9"/>`).join('') }]
  }
);
