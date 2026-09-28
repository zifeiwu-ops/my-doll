/* ---------- 新发型 · 千禧校园 & 甜系插画系列 ---------- */
/* 波浪外轮廓：沿点列在法线方向加起伏（卷发用） */
var wavy = function (pts, amp, n) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const k = Math.sin(i / (pts.length - 1) * Math.PI * (SOFT ? Math.max(1, Math.round(n * .6)) : n)) * amp * (SOFT ? .55 : 1);
    out.push([pts[i][0] - dy / L * k, pts[i][1] + dx / L * k, pts[i][2]]);
  }
  return out;
};
const curlLines = (x, y0, y1, w, n) => { let d = ''; for (let i = 0; i < n; i++) { const y = y0 + (y1 - y0) * (i + .5) / n; d += `M ${f1(x - w)} ${f1(y - 3)} C ${f1(x - w * .2)} ${f1(y - 6)} ${f1(x + w)} ${f1(y - 2)} ${f1(x + w * .2)} ${f1(y + 3)} `; } return d; };
/* 中分的发顶发束 */
const PART_LOCKS = [[148.6, 83.4, 126, 112, 11, -4.6, 2], [151.4, 83.4, 174, 112, 11, 4.6, -2], [146, 84, 121, 104, 8, -3], [154, 84, 179, 104, 8, 3]];
/* 齐刘海 */
function bluntBang(y = 112) {
  const pts = [[116, 96], [117.6, y - 1.4]];
  const gap = SOFT ? [0, 0, 5, 0, 8.5, 0, 3, 0, 8.5, 0, 5, 0, 0] : [];   // 柔软画法：齐刘海分成几簇，缝里透出额头（空气感）
  for (let i = 0; i <= 12; i++) { const x = 120 + i * 5, yy = y + (i % 2 ? 1.6 + (SOFT ? .8 : 0) : 0) + (Math.abs(x - 150) > 24 ? -1 : 0) - (gap[i] || 0); pts.push([x, yy, i % 2 ? undefined : 'c']); }
  pts.push([182.4, y - 1.4], [184, 96], [172, 86], [150, 83.4], [128, 86]);
  return spline(pts);
}
const BANG_LINES = ['M 128 90 C 126 100 127 106 128 112', 'M 139 87 C 138 98 138 106 139 113', 'M 150 86 C 150 96 150 104 150 113', 'M 161 87 C 162 98 162 106 161 113', 'M 172 90 C 174 100 173 106 172 112'];
/* 麻花辫：沿中线交替排叶片 */
function braid(path, w, n, c, ln) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const t = i / n, t2 = (i + 1.25) / n, P = f => { const k = Math.min(path.length - 1, f * (path.length - 1)), j = Math.floor(k), u = k - j, a = path[j], b = path[Math.min(path.length - 1, j + 1)]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; };
    const A = P(t), B = P(t2), side = i % 2 ? 1 : -1, ww = w * (1 - t * .35);
    const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    const c1 = [A[0] + nx * ww * side, A[1] + ny * ww * side], c2 = [B[0] - nx * ww * .3 * side, B[1] - ny * ww * .3 * side];
    const d = `M ${f1(A[0] - nx * ww * .5 * side)} ${f1(A[1] - ny * ww * .5 * side)} Q ${f1(c1[0])} ${f1(c1[1])} ${f1(B[0] + nx * ww * .2 * side)} ${f1(B[1] + ny * ww * .2 * side)} Q ${f1(c2[0])} ${f1(c2[1])} ${f1(A[0] - nx * ww * .5 * side)} ${f1(A[1] - ny * ww * .5 * side)} Z`;
    s += hairPiece(d, c, { rim: [1.4, 1.2], sw: 1.1, lines: strands([`M ${f1(A[0])} ${f1(A[1])} Q ${f1((A[0] + c1[0]) / 2)} ${f1((A[1] + c1[1]) / 2)} ${f1(B[0])} ${f1(B[1])}`], ln, .45) });
  }
  return s;
}
const hairTie = (x, y, c, rot = 0) => `<g transform="rotate(${rot} ${x} ${y})"><rect x="${x - 4.2}" y="${y - 1.8}" width="8.4" height="3.6" rx="1.8" fill="${c}" stroke="${INK}" stroke-width=".9"/></g>`;

/* 螺旋卷：一缕带波浪的发束，越往下越细 */
var ringlet = function (x0, y0, x1, y1, w, n, amp = 2.4) {
  amp *= SOFT ? .55 : 1; if (SOFT) n = Math.max(1, Math.round(n * .6 * 2) / 2);
  const N = Math.round(n * 5), L = [], R = [];
  for (let i = 0; i <= N; i++) { const t = i / N, x = x0 + (x1 - x0) * t + Math.sin(t * Math.PI * 2 * n) * amp * (.4 + t * .6), y = y0 + (y1 - y0) * t, ww = w * (1 - .6 * Math.pow(t, 1.5)) / 2; L.push([x - ww, y]); R.push([x + ww, y]); }
  const tip = [(L[N][0] + R[N][0]) / 2 + amp * .4, y1 + 3, 'c'];
  return spline([...L.slice(0, N), tip, ...R.slice(0, N).reverse()]);
};
var ringletLines = function (x0, y0, x1, y1, w, n, amp = 2.4) {
  amp *= SOFT ? .55 : 1; if (SOFT) n = Math.max(1, Math.round(n * .6 * 2) / 2);
  let d = ''; const k = Math.round(n * 2);
  for (let j = 1; j < k; j++) { const t = j / k, x = x0 + (x1 - x0) * t + Math.sin(t * Math.PI * 2 * n) * amp * (.4 + t * .6), y = y0 + (y1 - y0) * t, ww = w * (1 - .6 * Math.pow(t, 1.5)) / 2 * .8; d += `M ${f1(x - ww)} ${f1(y - 1.6)} Q ${f1(x)} ${f1(y + 2.6)} ${f1(x + ww)} ${f1(y - .6)} `; }
  return d;
};
function curlyHair(id, name, c, ln, hi) {
  return {
    id, cat: 'hair', name, thumb: '70 46 160 170', isNew: true,
    parts() {
      const back = symS(wavy([[150, 60], [134, 61.6], [119, 68], [108, 80], [101, 96], [97, 114], [95, 134], [94, 154], [95, 172], [97, 188], [101, 200], [108, 204, 'c'], [118, 196], [130, 190], [150, 190]], 2, 9));
      const R = [[112.6, 100, 102, 200, 12.4, 3.2], [107, 112, 94.6, 186, 10, 2.6], [117, 106, 115, 188, 9, 3], [109.6, 150, 106.4, 206, 8, 2]];
      const front = R.map(([a, b, cc, d, w, n]) => hairPiece(ringlet(a, b, cc, d, w, n), c, { rim: [1.8, 1.4], lines: strands([ringletLines(a, b, cc, d, w, n)], ln, .6) })).join('');
      const frontR = R.map(([a, b, cc, d, w, n]) => hairPiece(mir(ringlet(a, b, cc, d, w, n)), c, { rim: [1.8, 1.4], lines: strands([mir(ringletLines(a, b, cc, d, w, n))], ln, .6) })).join('');
      return [
        { z: 2, svg: hairPiece(back, c, { lines: strands([curlLines(100, 150, 196, 5, 4), mir(curlLines(100, 150, 196, 5, 4))], ln, .5) }) },
        { z: 50, svg: front + frontR + capHair(c, ln, shine([[130, 73, -20], [170, 73, 20]], hi)) + locks([[148.6, 83.4, 124, 110, 11, -5, 2.4], [151.4, 83.4, 176, 110, 11, 5, -2.4], [144, 85, 119, 102, 8, -3.4, 1.4], [156, 85, 181, 102, 8, 3.4, -1.4]], c, ln) }
      ];
    }
  };
}
function straightLong(id, name, c, ln, hi) {
  return {
    id, cat: 'hair', name, thumb: '74 46 152 200', isNew: true,
    parts() {
      const back = symS([[150, 60], [134, 61.6], [118, 69], [107, 84], [101.6, 106], [99.6, 134], [98.6, 170], [98, 210], [98.4, 250], [99.6, 282], [104, 292, 'c'], [114, 288], [124, 292, 'c'], [132, 272], [150, 268]]);
      const side = spline([[114, 92], [108, 106], [106, 128], [105.4, 156], [104.6, 188], [104.4, 220], [105, 250], [106.4, 276], [109, 290, 'c'], [113, 282], [116.4, 288, 'c'], [117.6, 262], [117, 232], [116.8, 200], [117.6, 170], [118.6, 144], [119.6, 120], [121, 102]]);
      const sl = ['M 110 130 C 108.6 170 108.6 220 109.6 270', 'M 113.6 150 C 112.6 190 112.8 236 113.6 280'];
      return [
        { z: 2, svg: hairPiece(back, c, { lines: strands(['M 102 160 C 101 200 101 240 102 280', mir('M 102 160 C 101 200 101 240 102 280')], ln) }) },
        { z: 50, svg: capHair(c, ln, shine([[130, 73, -20], [170, 73, 20]], hi)) + hairPiece(side, c, { lines: strands(sl, ln) }) + hairPiece(mir(side), c, { lines: strands(sl.map(mir), ln) }) + locks(PART_LOCKS, c, ln) }
      ];
    }
  };
}
function wavyLong(id, name, c, ln, hi, bangs) {
  return {
    id, cat: 'hair', name, thumb: '70 46 160 210', isNew: true,
    parts() {
      const back = symS(wavy([[150, 60], [134, 61.6], [118, 69], [106, 86], [100, 108], [96, 136], [93, 166], [92, 198], [91, 228], [93, 256], [98, 276], [106, 284, 'c'], [116, 276], [126, 284, 'c'], [132, 266], [150, 262]], 2.6, 8));
      const side = spline(wavy([[114, 92], [107, 106], [104, 128], [102, 152], [100, 178], [99, 204], [100, 230], [102, 254], [106, 272, 'c'], [111, 262], [116, 270, 'c'], [117, 248], [115, 222], [116, 196], [117.4, 170], [118.4, 146], [119.6, 122], [121, 102]], 2.4, 9));
      const wl = ['M 108 150 C 104 162 111 172 107 186', 'M 106 200 C 102 212 109 222 105 236', 'M 110 240 C 106 250 112 258 109 268', 'M 113 170 C 110 182 116 192 113 206'];
      const B = bangs ? [[124, 88, 121.4, 116, 9.6, -2.2], [176, 88, 178.6, 116, 9.6, 2.2], [132.6, 85, 131, 112.6, 10, -1.6], [167.4, 85, 169, 112.6, 10, 1.6], [141.4, 83.4, 140.4, 110.4, 10, -.8], [158.6, 83.4, 159.6, 110.4, 10, .8], [150, 83, 150, 111.4, 9, 0]] : PART_LOCKS;
      return [
        { z: 2, svg: hairPiece(back, c, { lines: strands(['M 100 160 C 96 190 102 220 97 250', mir('M 100 160 C 96 190 102 220 97 250')], ln) }) },
        { z: 50, svg: capHair(c, ln, shine([[130, 73, -20], [170, 73, 20]], hi)) + hairPiece(side, c, { lines: strands(wl, ln) }) + hairPiece(mir(side), c, { lines: strands(wl.map(mir), ln) }) + locks(B, c, ln) }
      ];
    }
  };
}
HAIRS.push(
  curlyHair('h9', '草莓金小卷发', '#E6A868', '#9A5E30', '#FBE0B8'),
  curlyHair('h10', '蜂蜜金卷发', '#D9AE5C', '#8C6428', '#F8E4B0'),
  straightLong('h11', '奶金中分长直发', '#EBD49A', '#A88A4E', '#FFF6D8'),
  straightLong('h12', '深棕中分长直发', '#4A3026', '#26160F', '#8A6A5C'),
  wavyLong('h13', '深棕中分长卷发', '#3E2922', '#1E120D', '#7E5E52', false),
  wavyLong('h14', '齐刘海长卷发', '#5A3A2C', '#2E1C14', '#9A7466', true),
  {
    id: 'h15', cat: 'hair', name: '中分双麻花辫', thumb: '76 46 148 220', isNew: true,
    parts() {
      const c = '#B98A56', ln = '#70502C';
      const pL = [[116, 136], [114, 156], [116, 178], [118.6, 200], [120, 222], [120.6, 244]];
      const loose = [[113, 96, 110, 150, 6, -2.6, 1.2], [118.4, 100, 119, 142, 4.6, 1.2]];
      return [
        { z: 2, svg: hairPiece(BACK_HEAD(150), c, { rim: false, deep: [BACK_HEAD(150)], dc: '#E0CDB8' }) },
        { z: 50, svg: braid(pL, 10, 8, c, ln) + braid(pL.map(mx), 10, 8, c, ln) + hairTie(120.6, 246, '#8EC0E6', 8) + hairTie(179.4, 246, '#8EC0E6', -8) +
          locks([[120.4, 248, 118, 262, 6, -1.4], [179.6, 248, 182, 262, 6, 1.4]], c, ln) + locks(loose, c, ln) + locks(mirLocks(loose), c, ln) + capHair(c, ln, shine([[130, 73, -20], [170, 73, 20]], '#E6C8A0')) + locks(PART_LOCKS, c, ln) }
      ];
    }
  },
  {
    id: 'h16', cat: 'hair', name: '齐刘海姬发式', thumb: '74 46 152 250', isNew: true,
    parts() {
      const c = '#3A2622', ln = '#1C100D';
      const back = symS([[150, 60], [134, 61.6], [118, 69], [107, 84], [101.6, 106], [99.4, 134], [98.4, 170], [98, 214], [98.4, 258], [99.4, 296], [101, 310, 'c'], [150, 310]]);
      const hime = spline([[108, 100], [106.4, 122], [106, 142], [106.6, 158.4, 'c'], [120.4, 158.4, 'c'], [119.8, 140], [119.6, 118], [120.4, 104]]);
      return [
        { z: 2, svg: hairPiece(back, c, { lines: strands(['M 103 170 C 102 220 102 260 103 300', mir('M 103 170 C 102 220 102 260 103 300'), 'M 110 180 L 110 300', mir('M 110 180 L 110 300')], ln) }) },
        { z: 50, svg: capHair(c, ln, shine([[130, 74, -18], [170, 74, 18]], '#7A5E56')) + hairPiece(hime, c, { lines: strands(['M 112 110 L 112 156', 'M 116 112 L 116.4 156'], ln) }) + hairPiece(mir(hime), c, { lines: strands(['M 188 110 L 188 156', 'M 184 112 L 183.6 156'], ln) }) +
          hairPiece(bluntBang(113), c, { lines: strands(BANG_LINES, ln) }) }
      ];
    }
  },
  {
    id: 'h17', cat: 'hair', name: '齐刘海内扣波波头', thumb: '84 46 132 136', isNew: true,
    parts() {
      const c = '#6A4534', ln = '#3A2218';
      const back = symS([[150, 60], [134, 61.6], [119, 68], [108.6, 82], [103, 100], [101, 122], [101.4, 144], [104, 160], [109, 170, 'c'], [122, 172], [136, 170], [150, 170]]);
      const side = spline([[108.4, 98], [105.2, 118], [104.4, 140], [106, 158], [110.6, 169, 'c'], [117.6, 166.6], [121.6, 162, 'c'], [119.8, 146], [119.4, 126], [120.4, 106]]);
      return [
        { z: 2, svg: hairPiece(back, c, { rim: false, deep: [back], dc: '#B9A098' }) },
        { z: 50, svg: capHair(c, ln, shine([[130, 74, -18], [170, 74, 18]], '#A6806E')) + hairPiece(side, c, { lines: strands(['M 110 112 C 108 132 108.6 150 112 164', 'M 115 116 C 114 136 114.4 152 117 164'], ln) }) + hairPiece(mir(side), c, { lines: strands([mir('M 110 112 C 108 132 108.6 150 112 164'), mir('M 115 116 C 114 136 114.4 152 117 164')], ln) }) +
          hairPiece(bluntBang(112), c, { lines: strands(BANG_LINES, ln) }) }
      ];
    }
  },
  {
    id: 'h18', cat: 'hair', name: '齐刘海侧麻花辫', thumb: '76 46 148 240', isNew: true,
    parts() {
      const c = '#4E3228', ln = '#26160F';
      const pB = [[116, 130], [113, 152], [112, 176], [113, 200], [114.6, 224], [116, 248], [117, 268]];
      const hime = spline([[108, 100], [106.4, 122], [106.2, 138], [109, 146, 'c'], [119.6, 136], [119.6, 118], [120.4, 104]]);
      return [
        { z: 2, svg: hairPiece(BACK_HEAD(150), c, { rim: false, deep: [BACK_HEAD(150)], dc: '#B9A098' }) },
        { z: 50, svg: braid(pB, 11.4, 10, c, ln) + hairTie(117, 270, '#F7A9C4', 4) + locks([[117, 272, 115.4, 290, 7, -1.6]], c, ln) + capHair(c, ln, shine([[130, 74, -18], [170, 74, 18]], '#8A6A5C')) +
          hairPiece(hime, c, {}) + hairPiece(mir(hime), c, {}) + hairPiece(bluntBang(113), c, { lines: strands(BANG_LINES, ln) }) }
      ];
    }
  },
  {
    id: 'h19', cat: 'hair', name: '斜刘海低侧发髻', thumb: '82 46 136 140', isNew: true,
    parts() {
      const c = '#2E201E', ln = '#120A09';
      const bun = spline(wavy([[178, 136], [189, 132], [199, 139], [202, 152], [198, 164], [187, 169], [176, 165], [172, 153], [174, 142]], 1.8, 6));
      const sweep = [[160, 84, 124, 116, 14, -6, 2], [152, 84, 118, 108, 10, -5], [166, 86, 134, 118, 10, -5, 1.4], [172, 88, 182, 116, 8, 2.4], [178, 90, 186, 118, 7, 1.6]];
      const tend = [[113, 104, 111.4, 150, 4.4, -2.4, 1.4], [187, 104, 189, 146, 4, 2.4, -1.2]];
      return [
        { z: 2, svg: hairPiece(bun, c, { lines: strands(['M 180 140 C 188 138 196 144 194 156', 'M 178 152 C 184 148 192 156 188 164'], ln) }) + hairPiece(BACK_HEAD(142), c, { rim: false, deep: [BACK_HEAD(142)], dc: '#9A8A88' }) },
        { z: 50, svg: locks(tend, c, ln) + capHair(c, ln, shine([[132, 72, -20], [168, 72, 18]], '#6A5652')) + locks(sweep, c, ln) }
      ];
    }
  }
);
