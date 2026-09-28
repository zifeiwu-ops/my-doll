/* ---------- 新发型 · 美式松弛 / 复古森系 / 90s 古着辣妹 ---------- */
/* 可调长度的中分波浪发 */
function wavyLen(id, name, c, ln, hi, len, amp = 2.4) {
  return {
    id, cat: 'hair', name, thumb: len > 230 ? '70 46 160 210' : '74 46 152 170', isNew: true,
    parts() {
      const k = (len - 100) / 180;
      const back = symS(wavy([[150, 60], [134, 61.6], [118, 69], [106, 86], [100, 108], [97, 134], [95, 100 + 70 * k], [93.6, 100 + 110 * k], [93, 100 + 150 * k], [96, len - 6], [104, len, 'c'], [116, len - 8], [126, len, 'c'], [132, len - 16], [150, len - 20]], amp, Math.max(5, Math.round(len / 34))));
      const side = spline(wavy([[114, 92], [107, 106], [104, 128], [102, 100 + 60 * k], [100.4, 100 + 100 * k], [100, 100 + 140 * k], [101, len - 14], [106, len - 2, 'c'], [111, len - 12], [116, len - 4, 'c'], [117, len - 24], [115.6, 100 + 120 * k], [116.4, 100 + 80 * k], [117.6, 150], [119, 126], [121, 102]], amp * .9, Math.max(5, Math.round(len / 30))));
      const wl = [`M 108 150 C 104 162 111 172 107 186`, `M 106 ${f1(100 + 110 * k)} C 102 ${f1(112 + 110 * k)} 109 ${f1(122 + 110 * k)} 105 ${f1(136 + 110 * k)}`, 'M 113 170 C 110 182 116 192 113 206'];
      return [
        { z: 2, svg: hairPiece(back, c, { lines: strands([`M 100 160 C 96 ${f1(160 + 40 * k)} 102 ${f1(180 + 60 * k)} 97 ${f1(len - 20)}`, mir(`M 100 160 C 96 ${f1(160 + 40 * k)} 102 ${f1(180 + 60 * k)} 97 ${f1(len - 20)}`)], ln) }) },
        { z: 50, svg: capHair(c, ln, shine([[130, 73, -20], [170, 73, 20]], hi)) + (len > 180 ? frontLocks(c, ln, len - 10, amp * .8, Math.round(len)) : hairPiece(side, c, { lines: strands(wl, ln) }) + hairPiece(mir(side), c, { lines: strands(wl.map(mir), ln) })) + locks(PART_LOCKS, c, ln) }
      ];
    }
  };
}
/* 长螺旋卷（复古森系：满头细卷、垂到胸下） */
function longCurly(id, name, c, ln, hi, len) {
  return {
    id, cat: 'hair', name, thumb: '66 46 168 220', isNew: true,
    parts() {
      const back = symS(wavy([[150, 60], [134, 61.6], [118, 68], [106, 80], [98, 98], [93, 120], [90, 146], [88, 176], [88, 206], [90, len - 10], [96, len, 'c'], [110, len - 10], [124, len - 4, 'c'], [132, len - 24], [150, len - 30]], 2.2, 13));
      const R = [[112.6, 100, 100, len - 6, 12, 5.4], [106.6, 112, 92, len - 22, 10, 4.6], [117.4, 106, 114.4, len - 20, 9, 4.8], [110, 150, 104, len + 4, 8.4, 3.6], [101, 140, 90, len - 40, 8, 3.2]];
      const one = (m) => R.map(([a, b, cc, d, w, n]) => { const p = ringlet(a, b, cc, d, w, n), l = ringletLines(a, b, cc, d, w, n); return hairPiece(m ? mir(p) : p, c, { rim: [1.8, 1.4], lines: strands([m ? mir(l) : l], ln, .6) }); }).join('');
      return [
        { z: 2, svg: hairPiece(back, c, { lines: strands([curlLines(98, 150, len - 20, 5, 7), mir(curlLines(98, 150, len - 20, 5, 7))], ln, .5) }) },
        { z: 50, svg: one(false) + one(true) + capHair(c, ln, shine([[130, 73, -20], [170, 73, 20]], hi)) +
          locks([[148.6, 83.4, 124, 110, 11, -5, 2.4], [151.4, 83.4, 176, 110, 11, 5, -2.4], [144, 85, 119, 102, 8, -3.4, 1.4], [156, 85, 181, 102, 8, 3.4, -1.4]], c, ln) }
      ];
    }
  };
}
HAIRS.push(
  wavyLen('h20', '红棕中分长卷发', '#A8532E', '#6A2E16', '#E0986A', 282, 2.8),
  {
    id: 'h21', cat: 'hair', name: '红棕凌乱盘发', thumb: '74 20 152 160', isNew: true,
    parts() {
      const c = '#A8532E', ln = '#6A2E16';
      const bunPts = []; for (let i = 0; i < 14; i++) { const a = Math.PI + i * Math.PI * 2 / 14; bunPts.push([150 + Math.cos(a) * 26, 50 + Math.sin(a) * 18]); }
      const bun = spline(wavy(bunPts.concat([bunPts[0]]), 3, 7).slice(0, -1));
      const loops = ['M 132 46 C 136 34 150 32 152 44', 'M 150 38 C 158 28 172 34 168 46', 'M 138 58 C 144 50 156 52 158 60', 'M 126 52 C 128 44 136 42 140 48'];
      const tend = [[113, 100, 107.6, 172, 6.4, 3.4, 2.2], [117.6, 104, 118.6, 150, 4.6, 2.4, 1.6]];
      const tp = (m) => tend.map(([a, b, cc, d, w, n, amp]) => { const p = ringlet(a, b, cc, d, w, n, amp), l = ringletLines(a, b, cc, d, w, n, amp); return hairPiece(m ? mir(p) : p, c, { rim: [1.6, 1.2], lines: strands([m ? mir(l) : l], ln, .6) }); }).join('');
      return [
        { z: 2, svg: bunSVG(150, 49, 22, c, ln, true, .1) + hairPiece(BACK_HEAD(142), c, { rim: false, deep: [BACK_HEAD(142)], dc: '#D6A48C' }) },
        { z: 50, svg: [false, true].map(m => { const X = x => (m ? 300 - x : x), b = m ? -1 : 1; return wisp(X(113), 100, X(109.6), 146, c, 5, -3 * b) + wisp(X(117.6), 104, X(119.6), 132, c, 3.4, 2 * b); }).join('') + capHair(c, ln, shine([[132, 72, -20], [168, 72, 18]], '#E0986A')) +
          locks([[149, 83.4, 128, 108, 10, -5.4, 2.4], [151, 83.4, 172, 110, 10, 5.4, -2.4], [144, 84, 126, 118, 6, -3.6, 1.8]], c, ln) }
      ];
    }
  },
  longCurly('h22', '栗棕长螺旋卷发', '#8A5638', '#4E2A18', '#C99A78', 250),
  (() => {
    const base = wavyLen('h23', '金色细辫微卷长发', '#E0BC6E', '#9A7A34', '#FFF0C8', 272, 2.2), P = base.parts;
    base.parts = () => { const L = P(), c = '#E0BC6E', ln = '#9A7A34', pb = [[119, 104], [117.6, 130], [117, 156], [118, 182], [119.4, 206]];
      L[1].svg += braid(pb, 5.4, 8, c, ln) + braid(pb.map(mx), 5.4, 8, c, ln) + hairTie(119.6, 208, '#8A5A3A') + hairTie(180.4, 208, '#8A5A3A'); return L; };
    return base;
  })(),
  {
    id: 'h24', cat: 'hair', name: '金色蓬松短卷发', thumb: '78 46 144 140', isNew: true,
    parts() {
      const c = '#E6C47C', ln = '#9A7A34';
      const back = symS(wavy([[150, 60], [134, 61.6], [118, 68], [106, 80], [99, 98], [95, 118], [94, 138], [96, 156], [102, 168, 'c'], [116, 166], [130, 162], [150, 162]], 2.4, 8));
      const R = [[112, 100, 102, 168, 11, 2.6, 2.6], [106, 114, 96.4, 158, 9, 2.2, 2.4], [117, 106, 116, 158, 8, 2.4, 2.2]];
      const one = (m) => R.map(([a, b, cc, d, w, n, amp]) => { const p = ringlet(a, b, cc, d, w, n, amp), l = ringletLines(a, b, cc, d, w, n, amp); return hairPiece(m ? mir(p) : p, c, { rim: [1.8, 1.4], lines: strands([m ? mir(l) : l], ln, .6) }); }).join('');
      return [
        { z: 2, svg: hairPiece(back, c, { lines: strands([curlLines(100, 130, 160, 4, 3), mir(curlLines(100, 130, 160, 4, 3))], ln, .5) }) },
        { z: 50, svg: one(false) + one(true) + capHair(c, ln, shine([[130, 73, -20], [170, 73, 20]], '#FFF2CC')) +
          locks([[158, 84, 124, 114, 13, -6, 2.4], [150, 84, 120, 106, 9, -4, 1.4], [166, 86, 178, 114, 9, 2.4, -1.4], [172, 88, 184, 110, 7, 1.6]], c, ln) }
      ];
    }
  },
  wavyLen('h25', '深金锁骨发', '#C49A5A', '#7E5A2A', '#EED2A0', 206, 2.2)
);
