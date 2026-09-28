/* ---------- 新发型 · 甜酷街头：短发侧小揪、凌乱高丸子、短发双小揪、低马尾编发 ---------- */
const SHORT_BACK = h => symS([[150, 60], [134, 61.6], [118, 68], [107, 82], [101, 100], [98.6, 122], [98.4, 144], [100.6, h - 6], [106, h, 'c'], [116, h - 6], [126, h - 2, 'c'], [134, h - 12], [150, h - 14]]);
const shortSide = h => spline(wavy([[114, 92], [107.6, 106], [105, 126], [104.4, 146], [105.6, h - 8], [109, h, 'c'], [113, h - 6], [116.4, h - 1, 'c'], [118.6, h - 20], [119.2, 134], [120, 114], [121, 100]], 1.4, 5));
const SHORT_BANGS = [[121.4, 90, 118.6, 120, 10, -3, 1.2], [130, 85, 127, 118, 11, -3.4], [139, 83, 136, 114, 10, -2.6], [148.6, 82.6, 146, 118, 9.4, -2.2], [158, 83, 160, 115, 10, 2.2], [167.6, 85, 171, 118, 11, 3.2], [177, 89, 181, 118, 10, 3, -1.2]];
const smallTail = (x, y, c, ln, dir = 1) => { const p = [[x, y, 18 * dir, -14, 11, 4 * dir, -2 * dir], [x, y, 12 * dir, -22, 8, 2 * dir, 1 * dir], [x, y, 22 * dir, -4, 8, 5 * dir, -1 * dir]].map(([a, b, dx, dy, w, bd, cu]) => [a, b, a + dx, b + dy, w, bd, cu]); return locks(p, c, ln); };
HAIRS.push(
  {
    id: 'h36', cat: 'hair', name: '栗色短发侧小揪', thumb: '76 40 150 140', isNew: true,
    parts() {
      const c = '#8A5A40', ln = '#523220';
      return [
        { z: 2, svg: hairPiece(SHORT_BACK(170), c, { lines: strands(['M 102 130 C 101 146 102 156 104 166', mir('M 102 130 C 101 146 102 156 104 166')], ln) }) },
        { z: 50, svg: hairPiece(shortSide(172), c, {}) + hairPiece(mir(shortSide(172)), c, {}) + capHair(c, ln, shine([[132, 72, -20], [168, 72, 20]], '#C28E70')) + locks(SHORT_BANGS, c, ln) +
          smallTail(184, 78, c, ln, 1) + hairTie(185.4, 78.6, '#E8454F', 20) }
      ];
    }
  },
  {
    id: 'h37', cat: 'hair', name: '焦糖凌乱高丸子', thumb: '76 18 150 160', isNew: true,
    parts() {
      const c = '#B07A4E', ln = '#6A4228';
      const bun = spline(wavy([[150, 26], [164, 30], [172, 42], [170, 56], [160, 64], [140, 64], [130, 56], [128, 42], [136, 30]].concat([[150, 26]]), 2.2, 9).slice(0, -1));
      const wisps = [[160, 34, 176, 18, 5, 4, 2], [140, 34, 126, 20, 5, -4, -2], [166, 50, 184, 46, 4, 2, 1]];
      return [
        { z: 2, svg: hairPiece(bun, c, { lines: strands(['M 136 44 C 144 36 158 36 164 46', 'M 134 54 C 142 48 158 48 166 56'], ln) }) + locks(wisps, c, ln) + hairPiece(BACK_HEAD(150), c, { rim: false, deep: [BACK_HEAD(150)], dc: '#E0C4AE' }) },
        { z: 50, svg: locks([[112.6, 102, 111, 158, 6.4, -2.4, 1.6], [117, 104, 118.6, 140, 4.4, 1.4]], c, ln) + locks(mirLocks([[112.6, 102, 111, 158, 6.4, -2.4, 1.6], [117, 104, 118.6, 140, 4.4, 1.4]]), c, ln) +
          capHair(c, ln, shine([[132, 72, -20], [168, 72, 20]], '#E2B690')) + locks(SHORT_BANGS, c, ln) + hairTie(150, 62, '#2A2528', 0) }
      ];
    }
  },
  {
    id: 'h38', cat: 'hair', name: '深棕短发双小揪', thumb: '70 34 160 146', isNew: true,
    parts() {
      const c = '#5A3A2C', ln = '#2E1C14';
      return [
        { z: 2, svg: hairPiece(SHORT_BACK(166), c, {}) },
        { z: 50, svg: hairPiece(shortSide(168), c, {}) + hairPiece(mir(shortSide(168)), c, {}) + capHair(c, ln, shine([[132, 72, -20], [168, 72, 20]], '#8E6A58')) + locks(SHORT_BANGS, c, ln) +
          smallTail(186, 80, c, ln, 1) + smallTail(114, 80, c, ln, -1) + `<circle cx="187" cy="80" r="3" fill="#C8323C" stroke="${STYLE.line}" stroke-width=".6"/><circle cx="113" cy="80" r="3" fill="#C8323C" stroke="${STYLE.line}" stroke-width=".6"/>` }
      ];
    }
  },
  {
    id: 'h39', cat: 'hair', name: '奶茶色低马尾麻花辫', thumb: '76 40 150 190', isNew: true,
    parts() {
      const c = '#C9A27A', ln = '#86623E';
      const pb = [[176, 128], [180, 148], [182, 168], [182, 190], [180, 206]];
      return [
        { z: 2, svg: hairPiece(BACK_HEAD(150), c, { rim: false, deep: [BACK_HEAD(150)], dc: '#EAD8C4' }) },
        { z: 50, svg: hairPiece(shortSide(150), c, {}) + capHair(c, ln, shine([[132, 72, -20], [168, 72, 20]], '#EED6B6')) + locks(SHORT_BANGS, c, ln) +
          braid(pb, 5.6, 7, c, ln) + hairTie(180, 210, '#7A9ADA', 0) + locks([[170, 110, 176, 130, 10, 2, -1]], c, ln) }
      ];
    }
  }
);
