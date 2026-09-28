/* ---------- 新发型 · 糖果装饰风：双丸子、炸毛丸子、短双马尾、齐刘海波波、彩色头发 ---------- */
const CHOP_BANGS = [[122, 90, 120.6, 117, 10, -2.4, 1], [131, 85.4, 129.4, 115, 10.4, -2], [140, 83.4, 138.8, 111, 9.4, -1], [150, 82.8, 150.4, 113, 8.6, .4], [160, 83.4, 161.2, 111, 9.4, 1], [169, 85.4, 170.6, 115, 10.4, 2], [178, 90, 179.4, 117, 10, 2.4, -1]];
const SIDE_TUFT = [[112.4, 104, 114.2, 152, 7, -2.4, -1.2]];
/* 丸子：圆的（wavy 起伏）或者炸毛的（尖尖一圈） */
var bunSVG = function (cx, cy, r, c, ln, spiky = false, rot = 0) {
  const pts = [], n = spiky ? 18 : 14;
  for (let i = 0; i < n; i++) { const a = rot + i * Math.PI * 2 / n, rr = spiky ? (i % 2 ? r * .66 : r * (1.02 + (i % 4 === 0 ? .14 : 0))) : r; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .92, spiky && i % 2 === 0 ? 'c' : undefined]); }
  const d = spiky ? spline(pts) : spline(wavy(pts.concat([pts[0]]), 1.4, 7).slice(0, -1));
  const sw = [`M ${f1(cx - r * .6)} ${f1(cy - r * .1)} C ${f1(cx - r * .3)} ${f1(cy - r * .7)} ${f1(cx + r * .5)} ${f1(cy - r * .6)} ${f1(cx + r * .5)} ${f1(cy)}`, `M ${f1(cx - r * .4)} ${f1(cy + r * .4)} C ${f1(cx)} ${f1(cy + r * .7)} ${f1(cx + r * .6)} ${f1(cy + r * .3)} ${f1(cx + r * .64)} ${f1(cy - r * .2)}`];
  return hairPiece(d, c, { lines: strands(sw, ln, .6) });
};
const BOB_SIDE = h => spline([[114, 92], [108.4, 106], [106.4, 126], [106.2, 146], [107.6, h - 8], [112, h, 'c'], [116.6, h - 8], [118.6, h - 24], [119.8, 124], [121, 102]]);
HAIRS.push(
  {
    id: 'h30', cat: 'hair', name: '栗色双丸子头', thumb: '80 32 140 140', isNew: true,
    parts() {
      const c = '#8E5A3C', ln = '#553322';
      return [
        { z: 2, svg: bunSVG(118, 64, 15, c, ln) + bunSVG(182, 64, 15, c, ln) + hairPiece(BACK_HEAD(150), c, { rim: false, deep: [BACK_HEAD(150)], dc: '#D8B9A8' }) },
        { z: 50, svg: locks(SIDE_TUFT, c, ln) + locks(mirLocks(SIDE_TUFT), c, ln) + capHair(c, ln, shine([[132, 72, -20], [168, 72, 20]], '#C99478')) + locks(CHOP_BANGS, c, ln) }
      ];
    }
  },
  {
    id: 'h31', cat: 'hair', name: '黑色炸毛双丸子', thumb: '76 26 148 146', isNew: true,
    parts() {
      const c = '#2E2528', ln = '#0E0A0B';
      const side = [[112.6, 104, 113.4, 146, 6.4, -2, -1.2], [117.6, 104, 121.4, 132, 5, 1.2]];
      return [
        { z: 2, svg: bunSVG(117, 62, 17, c, ln, true, .2) + bunSVG(183, 62, 17, c, ln, true, -.1) + hairPiece(BACK_HEAD(148), c, { rim: false, deep: [BACK_HEAD(148)], dc: '#8E8488' }) },
        { z: 50, svg: locks(side, c, ln) + locks(mirLocks(side), c, ln) + capHair(c, ln, shine([[132, 72, -20], [168, 72, 20]], '#7C6E74')) + locks(CHOP_BANGS, c, ln) }
      ];
    }
  },
  {
    id: 'h32', cat: 'hair', name: '奶金短双马尾', thumb: '70 46 160 150', isNew: true,
    parts() {
      const c = '#EBD08C', ln = '#A4884A';
      const tails = [[113.6, 122, 96, 184, 17, -5, 3], [116, 124, 108, 178, 11, -3, -2], [110.6, 126, 92.4, 168, 9, -6, 2]];
      return [
        { z: 2, svg: hairPiece(BACK_HEAD(150), c, { rim: false, deep: [BACK_HEAD(150)], dc: '#EFE2C4' }) },
        { z: 50, svg: locks(tails, c, ln) + locks(mirLocks(tails), c, ln) + locks(SIDE_TUFT, c, ln) + locks(mirLocks(SIDE_TUFT), c, ln) + capHair(c, ln, shine([[132, 72, -20], [168, 72, 20]], '#FFF4D2')) +
          hairPiece(bluntBang(112), c, { lines: strands(BANG_LINES, ln) }) + hairTie(114.6, 122.4, '#F48FB1', -30) + hairTie(185.4, 122.4, '#8FD0F2', 30) }
      ];
    }
  },
  {
    id: 'h33', cat: 'hair', name: '黑色齐刘海波波配揪揪', thumb: '80 30 140 150', isNew: true,
    parts() {
      const c = '#2E2528', ln = '#0E0A0B';
      return [
        { z: 2, svg: bunSVG(124, 60, 9, c, ln, true, .3) + bunSVG(176, 60, 9, c, ln, true, 0) + hairPiece(BACK_HEAD(166), c, { rim: false, deep: [BACK_HEAD(166)], dc: '#8E8488' }) },
        { z: 50, svg: hairPiece(BOB_SIDE(168), c, { lines: strands(['M 110 128 C 109 140 109.6 152 111 162'], ln) }) + hairPiece(mir(BOB_SIDE(168)), c, { lines: strands([mir('M 110 128 C 109 140 109.6 152 111 162')], ln) }) +
          capHair(c, ln, shine([[132, 72, -20], [168, 72, 20]], '#7C6E74')) + hairPiece(bluntBang(111), c, { lines: strands(BANG_LINES, ln) }) }
      ];
    }
  },
  {
    id: 'h34', cat: 'hair', name: '薄荷绿双丸子', thumb: '80 32 140 140', isNew: true,
    parts() {
      const c = '#9ED69A', ln = '#5A9A5A';
      return [
        { z: 2, svg: bunSVG(119, 63, 14, c, ln) + bunSVG(181, 63, 14, c, ln) + hairPiece(BACK_HEAD(160), c, { rim: false, deep: [BACK_HEAD(160)], dc: '#CFE6C8' }) },
        { z: 50, svg: hairPiece(BOB_SIDE(160), c, {}) + hairPiece(mir(BOB_SIDE(160)), c, {}) + capHair(c, ln, shine([[132, 72, -20], [168, 72, 20]], '#E2F6D8')) + locks(CHOP_BANGS, c, ln) }
      ];
    }
  },
  {
    id: 'h35', cat: 'hair', name: '樱花粉蓬松双揪揪', thumb: '70 36 160 150', isNew: true,
    parts() {
      const c = '#F4AFC8', ln = '#C0708E';
      const puffs = [[114, 110, 96, 148, 16, -6, 3], [116, 112, 106, 150, 11, -3, -2]];
      return [
        { z: 2, svg: hairPiece(BACK_HEAD(154), c, { rim: false, deep: [BACK_HEAD(154)], dc: '#F6D6E2' }) + bunSVG(106, 88, 12, c, ln, true, .4) + bunSVG(194, 88, 12, c, ln, true, .1) },
        { z: 50, svg: locks(puffs, c, ln) + locks(mirLocks(puffs), c, ln) + capHair(c, ln, shine([[132, 72, -20], [168, 72, 20]], '#FFE6EF')) + locks(CHOP_BANGS, c, ln) + hairTie(108.6, 104, '#FFE27A', -40) + hairTie(191.4, 104, '#8FD0F2', 40) }
      ];
    }
  }
);
