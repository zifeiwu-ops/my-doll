/* ---------- 新发型 · Coquette 芭蕾甜心 ---------- */
/* 八字空气刘海：从中分处往两边扫开，露出一点额头 */
const CURTAIN = [[148.6, 83.4, 121, 120, 12.4, -7.4, 2.6], [151.4, 83.4, 179, 120, 12.4, 7.4, -2.6], [145, 84.4, 117.6, 108, 9, -4.6, 1.6], [155, 84.4, 182.4, 108, 9, 4.6, -1.6], [149.4, 83.2, 134, 104, 7, -4]];
HAIRS.push(
  {
    id: 'h26', cat: 'hair', name: '芭蕾高盘发', thumb: '80 20 140 150', isNew: true,
    parts() {
      const c = '#6B4A3A', ln = '#3E2A20';
      const bun = spline([[150, 30], [162, 32], [170, 40], [171.6, 50], [166, 60], [150, 64], [134, 60], [128.4, 50], [130, 40], [138, 32]]);
      const wrap = ['M 134 44 C 142 36 158 36 166 44', 'M 131 52 C 140 44 160 44 169 52', 'M 138 60 C 144 54 156 54 162 60'];
      const tend = [[113, 100, 110.6, 160, 5.4, 2.2, 1.8], [117.4, 104, 119.4, 138, 3.6, 1.6, 1.2]];
      const tp = m => tend.map(([a, b, cc, d, w, n, amp]) => { const p = ringlet(a, b, cc, d, w, n, amp), l = ringletLines(a, b, cc, d, w, n, amp); return hairPiece(m ? mir(p) : p, c, { rim: [1.4, 1.2], lines: strands([m ? mir(l) : l], ln, .5) }); }).join('');
      return [
        { z: 2, svg: hairPiece(bun, c, { lines: strands(wrap, ln, .6) }) + hairPiece(BACK_HEAD(140), c, { rim: false, deep: [BACK_HEAD(140)], dc: '#D6BFB2' }) },
        { z: 50, svg: tp(false) + tp(true) + capHair(c, ln, shine([[132, 72, -20], [168, 72, 18]], '#A07A66')) + locks([[149, 83.4, 127, 104, 9, -4.4, 1.6], [151, 83.4, 173, 104, 9, 4.4, -1.6]], c, ln) }
      ];
    }
  },
  (() => {
    const base = wavyLen('h27', '奶油金公主大卷', '#E6C58E', '#A07E48', '#FFF3D6', 286, 3.4), P = base.parts;
    base.parts = () => { const L = P(); L[1].svg += locks(CURTAIN, '#E6C58E', '#A07E48'); return L; };
    return base;
  })(),
  {
    id: 'h28', cat: 'hair', name: '缎带低双马尾', thumb: '78 50 144 250', isNew: true,
    parts() {
      const c = '#3E2A24', ln = '#1E1410';
      const side = [[112.4, 104, 114.6, 160, 7, -2.4, -1.2]];
      const bangs = [[121, 90, 118.6, 120, 9, -2.2, 1], [130, 85.4, 128.6, 116, 10, -2.4], [139.6, 83, 138, 110, 9, -1.2], [150, 82.4, 149, 113, 8, 1], [160.4, 83, 162, 110, 9, 1.2], [170, 85.4, 171.4, 116, 10, 2.4], [179, 90, 181.4, 120, 9, 2.2, -1]];
      const T = (m) => { const p = ringlet(115, 150, 108, 284, 12, 3, 2.2), l = ringletLines(115, 150, 108, 284, 12, 3, 2.2); return hairPiece(m ? mir(p) : p, c, { rim: [1.6, 1.3], lines: strands([m ? mir(l) : l], ln, .55) }); };
      return [
        { z: 2, svg: hairPiece(BACK_HEAD(150), c, { rim: false, deep: [BACK_HEAD(150)], dc: '#6A5650' }) },
        { z: 50, svg: T(false) + T(true) + locks(side, c, ln) + locks(mirLocks(side), c, ln) + locks(bangs, c, ln) + capHair(c, ln, shine([[130, 73, -20], [170, 73, 20]], '#7A6056')) +
          ribbonBow(115.4, 150, .52, '#F4A7C0', 1) + ribbonBow(184.6, 150, .52, '#F4A7C0', 1) }
      ];
    }
  },
  (() => {
    const base = wavyLen('h29', '蜜茶卷翘锁骨发', '#9A6A52', '#5A3A2A', '#D8AE94', 200, 2.4), P = base.parts;
    base.parts = () => {
      const L = P(), c = '#9A6A52', ln = '#5A3A2A';
      const flip = spline([[97, 186], [92, 196], [90.6, 204, 'c'], [98, 200], [104, 196]]);
      L[0].svg += hairPiece(flip, c, {}) + hairPiece(mir(flip), c, {});
      L[1].svg += locks(CURTAIN, c, ln); return L;
    };
    return base;
  })()
);
