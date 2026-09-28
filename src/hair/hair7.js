/* =====================================================================
   发型（参考图：一缕一缕带描边的发束、尖尖弯弯的发梢、刘海中间露额头）后片 z2 · 前片 z50
   头部几何：头顶 (150,66)，太阳穴 x≈114（y 100），耳朵 x 110–118（y 116–138），眉 y≈109，眼 y 117–132，下巴 y≈154
   ===================================================================== */
/* 柔软画法：描边用发色压暗的深棕（不用纯黑）、线更细，内侧高光和月牙阴影都收轻，发丝线更细更淡 */
const hairInk = c => (/^#[0-9a-f]{6}$/i.test(c) ? mix(c, INK, .7) : INK);
const hairPiece = (d, c, o = {}) => piece(d, c, { rim: [1.7, 1.4], sw: .85, oc: hairInk(c), lit: false, cls: 'ho', ...o, ...(o.gloss ? { glossOp: .3 } : {}), over: (o.over || '') + (o.auto === false ? '' : autoStrands(d, c)) });
/* 发束阴影（参考日系平涂插画）：不再画一根根细发丝线，而是在发束之间放一两条从发根往发梢收尖的阴影块，
   把一整片头发分成几缕，又不会显得毛躁 */
function autoStrands(d, c) {
  if (!SOFT || !/^#[0-9a-f]{6}$/i.test(c)) return '';
  const S = pathPolys(String(d)); if (!S) return '';
  const poly = S.reduce((a, p) => a.concat(p), []); if (poly.length < 6) return '';
  let y0 = 1e9, y1 = -1e9; poly.forEach(p => { if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; });
  const H = y1 - y0; if (H < 18) return '';
  const span = y => { const xs = []; for (let i = 0; i < poly.length - 1; i++) { const a = poly[i], b = poly[i + 1]; if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0])); }
    xs.sort((p, q) => p - q); let best = null; for (let i = 0; i + 1 < xs.length; i += 2) if (!best || xs[i + 1] - xs[i] > best[1] - best[0]) best = [xs[i], xs[i + 1]]; return best; };
  const N = 18, rows = []; for (let k = 0; k <= N; k++) { const y = y0 + H * (.04 + .9 * k / N); rows.push([y, span(y)]); }
  const ok = rows.filter(r => r[1]), wAvg = ok.reduce((s, r) => s + r[1][1] - r[1][0], 0) / Math.max(1, ok.length);
  if (wAvg < 7) return '';
  const k = wAvg > 22 ? 2 : 1, r = RNG(Math.round(Math.abs(poly[0][0] * 7 + poly[0][1] * 13 + H * 3)) + 1);
  let out = '';
  for (let i = 0; i < k; i++) {
    const f = (i + 1) / (k + 1) + (r() - .5) * .18, ph = r() * 6, yb = .72 + r() * .22, pts = [];
    rows.forEach(([y, sp], j) => { const t = j / N; if (!sp || t > yb) return; const w = sp[1] - sp[0]; if (w < 3) return; pts.push([sp[0] + w * Math.min(.85, Math.max(.15, f + Math.sin(t * 4 + ph) * .03)), y]); });
    if (pts.length >= 4) out += `<path d="${taperD(resamp(pts, 10), Math.min(5.5, wAvg * (.16 + r() * .08)), .18)}"/>`;
  }
  return out ? `<g fill="${mix(c, '#3E2440', .3)}" opacity=".5">${out}</g>` : '';
}
/* 头顶高光环：沿头顶弧线的几段柔和亮带（日系插画里常见的「天使环」），头发一下子有了光泽和体积 */
function hairRing(c) {
  if (!/^#[0-9a-f]{6}$/i.test(c)) return '';
  const hi = mix(c, '#FFFFFF', hsl(c)[2] < .3 ? .3 : .48), E = (a, dr) => [150 + Math.cos(a) * (37 + dr), 100 + Math.sin(a) * (27 + dr * .8)];
  const up = [], lo = [], N = 14;
  for (let k = 0; k <= N; k++) {
    const t = k / N, a = (204 + 132 * t) * Math.PI / 180, th = Math.sin(Math.PI * t);          // 两头收细
    up.push(E(a, 1.6 * th));
    if (k < N) { const am = (204 + 132 * (t + .5 / N)) * Math.PI / 180; lo.unshift(E(am, -(3.4 + (k % 3 === 1 ? 2.6 : 1.2)) * Math.max(.35, th)).concat('c')); }   // 下缘一排往下的尖角，顺着发束
  }
  return `<path d="${spline(up.concat(lo), true, .5)}" fill="${hi}" opacity=".62"/>`;
}
/* 整片头发只描一圈外轮廓：把每缕的描边挪到最底下、加粗一倍，上面的平涂盖住内侧一半 ——
   缕与缕重叠处就不再有一圈圈黑边（不再像一根根管子），缕间的缝隙和发梢仍有轮廓；原来的内线保留成很淡的细线 */
function unifyHair(svg) {
  const outs = [];
  svg = svg.replace(/<path class="ho" d="([^"]*)" fill="none" stroke="([^"]*)" stroke-width="([^"]*)"[^>]*\/>/g, (m, d, c, w) => {
    outs.push(`<path d="${d}" fill="none" stroke="${c}" stroke-width="${f1(+w * 2)}" stroke-linejoin="round" stroke-linecap="round"/>`);
    const b = brushD(d, 1.05, .5);
    return b ? `<path d="${b}" fill="${c}" opacity=".26"/>` : `<path d="${d}" fill="none" stroke="${c}" stroke-width=".55" stroke-linejoin="round" stroke-linecap="round" opacity=".4"/>`;
  });
  return outs.join('') + svg;
}
const strands = (ds, c, o = .7) => ds.map(d => ({ d, c, o: o * .72, w: .6, taper: true }));
/* 一缕发束：发根 (x0,y0) → 发梢 (x1,y1)，w 发根宽度，bend 向侧面弯（正 = 向画面右） */
function lockD(x0, y0, x1, y1, w, bend = 0, tipCurl = 0) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  const b = -bend; // 法线指向画面左，bend 取反
  const P = (t, off) => [x0 + dx * t + nx * (b * Math.sin(Math.PI * t) + off), y0 + dy * t + ny * (b * Math.sin(Math.PI * t) + off)];
  const tip = [x1 + nx * -tipCurl, y1 + ny * -tipCurl, 'c'];
  const s = SOFT ? 1 : 0; // 柔软画法：发束中段更饱满、发梢收得圆一点（不像针尖）
  return spline([P(0, w / 2), P(.3, w * (.47 + .02 * s)), P(.62, w * (.3 + .06 * s)), P(.88, w * (.09 + .03 * s)), tip, P(.87, -w * (.08 + .03 * s)), P(.6, -w * (.28 + .06 * s)), P(.3, -w * (.45 + .02 * s)), P(0, -w / 2), [x0 - dx / L * 3, y0 - dy / L * 3]]);
}
const lockLine = (x0, y0, x1, y1, bend = 0, t1 = .72) => {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, b = -bend * .8;
  const P = t => `${f1(x0 + dx * t + nx * b * Math.sin(Math.PI * t))} ${f1(y0 + dy * t + ny * b * Math.sin(Math.PI * t))}`;
  return `M ${P(.08)} Q ${P(t1 / 2 + .04)} ${P(t1)}`;
};
function locks(list, c, ln) {
  if (SOFT) list = list.map(([x0, y0, x1, y1, w, b, curl]) => [x0, y0, x1, y1, w * .8, b, curl]);   // 空气刘海：每缕细一点，缕间透出额头
  return list.map(([x0, y0, x1, y1, w, b, curl]) => hairPiece(lockD(x0, y0, x1, y1, w, b, curl || 0), c, { rim: [1.8, 1.4], lines: strands([lockLine(x0, y0, x1, y1, b)], ln, .55) })).join('');
}
const CAP_PTS = [[150, 59], [139, 59.8], [129, 62.6], [121, 67.6], [114.6, 74.4], [110.4, 82.6], [108, 92], [107.2, 102], [107.6, 112], [109.4, 121, 'c']];
const CAP = symS([[150, 59], [139, 59.8], [129, 62.6], [121, 67.6], [114.6, 74.4], [110.4, 82.6], [108, 92], [107.2, 102], [107.6, 112], [109.4, 121, 'c'], [116, 104], [126, 92], [138, 86.4], [150, 85]]);
/* 发顶：只描外轮廓，下缘（发际线）不描边，好让刘海发束从下面自然长出来 */
function capPiece(d, outline, c, o = {}) {
  return piece(d, c, { rim: false, sw: 0, lit: false, ...o }).replace(/<path d="[^"]*" fill="none" stroke="[^"]*" stroke-width="0"[^>]*\/>$/, '') + `<path class="ho" d="${outline}" fill="none" stroke="${hairInk(c)}" stroke-width=".85" stroke-linecap="round" stroke-linejoin="round"/>`;
}
const CAP_LINE = line(CAP_PTS.slice().reverse().concat(CAP_PTS.slice(1).map(mx)));
const capHair = (c, ln, extra = '') => capPiece(CAP, CAP_LINE, c, { lines: capLines(ln), shade: ['M 170 62 C 186 72 192 90 191 118 L 200 118 L 200 60 Z'], over: hairRing(c) });   // 头顶光泽统一用高光环
const BACK_HEAD = h => symS([[150, 61], [136, 62.4], [123, 67.6], [113, 77], [107.4, 92], [106, 108], [106.8, 124], [109, 138], [113, 150], [121, h - 4], [134, h], [150, h + 1]]);
const capLines = (ln) => strands(['M 136 62.6 C 126 70 120 80 118 94', 'M 164 62.6 C 174 70 180 80 182 94'], ln, .4);
/* 头顶光泽：一小段柔和的弧光（不再用锯齿闪光） */
const shine = (pts, c = '#FFF8EA') => pts.map(([x, y, r]) => `<path d="M ${x - 5} ${y + 1.6} Q ${x} ${y - 1.6} ${x + 5} ${y + 1.2}" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" opacity=".4" transform="rotate(${r || 0} ${x} ${y})"/>`).join('');
const mirLocks = L => L.map(([x0, y0, x1, y1, w, b, c]) => [300 - x0, y0, 300 - x1, y1, w, -b, -(c || 0)]);

const HAIRS = [
  {
    id: 'h4', cat: 'hair', name: '奶茶色双马尾', thumb: '70 50 160 150',
    parts() {
      const c = '#E6D6B2', ln = '#A8926C';
      const tail = spline([[120, 66.6], [109, 67.4], [100.4, 72.6], [93.6, 82], [89, 96], [86, 114], [84.4, 136], [83.8, 160], [84.2, 186], [85.4, 212], [87.4, 236], [89.6, 256], [89.4, 272], [85.6, 288, 'c'], [93.4, 278], [98.6, 293, 'c'], [101.4, 279], [108.8, 287, 'c'], [109.8, 264], [110.8, 238], [112, 210], [113.2, 182], [114.6, 154], [116.4, 126], [118.4, 102], [120.4, 84]]);
      const tl = ['M 112 76 C 100 92 92 124 91.4 164 C 91 206 93 244 95 280', 'M 116 84 C 108 104 103 142 103 182 C 103 222 104.6 256 105.6 282', 'M 108 72 C 98 84 90 110 88.6 150'];
      const side = [[112.8, 104, 116.6, 163, 8.4, -2.4, -1.6], [118.4, 104, 123.4, 141, 6, 1.4]];
      const bangs = [[122, 88, 120.2, 122, 11, -3.2, 1], [176.6, 88.5, 179.4, 117, 9.4, 2.6, -.6], [131, 84.4, 130.8, 118.6, 11, -2.6], [167, 84.6, 170.8, 120, 11, 2.8], [139.6, 83, 137.4, 107.6, 8, 1], [158, 83, 160.2, 110.4, 9, -1.4], [150, 82.4, 147.8, 125, 7, 2.2]];
      return [
        { z: 2, svg: hairPiece(BACK_HEAD(146), c, { rim: false, deep: [BACK_HEAD(146)], dc: '#EDE0D2' }) + hairPiece(tail, c, { lines: strands(tl, ln), gloss: ['M 94 110 C 90 130 88.6 150 88.6 170'], glossOp: .75 }) + hairPiece(mir(tail), c, { lines: strands(tl.map(mir), ln), gloss: [mir('M 94 110 C 90 130 88.6 150 88.6 170')], glossOp: .75 }) },
        { z: 50, svg: locks(side, c, ln) + locks(mirLocks(side), c, ln) + locks(bangs, c, ln) + capHair(c, ln, shine([[128, 74, -20], [172, 74, 20]])) +
          star5(113.6, 70.4, 5.2, '#FFE27A', 1, -.2) + star5(186.4, 70.4, 5.2, '#FFE27A', 1, .2) + star5(178.8, 88.6, 3.8, '#9CD3F5', .9, .2) + star5(183.4, 99.4, 3, '#F7A9C4', .8, -.2) }
      ];
    }
  },
  {
    id: 'h6', cat: 'hair', name: '奶茶色低双马尾', thumb: '84 50 132 220',
    parts() {
      const c = '#E6D6B2', ln = '#A8926C';
      const side = [[112.4, 104, 115.4, 172, 8.4, -2.6, -1.4]];
      const bangs = [[175, 88.4, 178.6, 116, 9, 2.2], [166, 84.6, 168.4, 113.4, 10, 1.6], [120, 90, 117.6, 127, 10, -2.2, 1], [157, 82.8, 156.8, 113, 10, -2], [128.6, 85, 126, 124, 12, -3.2, 1], [147.6, 82, 145, 118, 11, -3], [138, 82.6, 135.6, 122, 12, -3.6, 1]];
      const tails = [[114.6, 140, 118, 266, 11, -4.6, -1.4], [118.6, 142, 124.6, 252, 7, -2.6, 1]];
      return [
        { z: 2, svg: hairPiece(BACK_HEAD(148), c, { rim: false, deep: [BACK_HEAD(148)], dc: '#EDE0D2' }) },
        { z: 50, svg: locks(tails, c, ln) + locks(mirLocks(tails), c, ln) + locks(side, c, ln) + locks(mirLocks(side), c, ln) + locks(bangs, c, ln) + capHair(c, ln, shine([[130, 73, -20], [170, 73, 20]])) +
          `<ellipse cx="115.6" cy="143" rx="4.4" ry="2.9" transform="rotate(-24 115.6 143)" fill="#F6A7C3" stroke="${INK}" stroke-width=".9"/><ellipse cx="184.4" cy="143" rx="4.4" ry="2.9" transform="rotate(24 184.4 143)" fill="#F6A7C3" stroke="${INK}" stroke-width=".9"/>` }
      ];
    }
  },
  {
    id: 'h5', cat: 'hair', name: '蓬松短发', thumb: '80 36 140 140',
    parts() {
      const c = '#8C6A55', ln = '#553B2E';
      const cap = symS([[150, 57.4], [139.4, 58], [129.6, 60.6], [121, 65.2], [114.2, 71.6], [109.6, 80], [107, 90], [106, 101], [106.6, 112], [108.4, 121, 'c'], [115, 104], [125, 92], [137, 86.4], [150, 85]]);
      const capLine = line([[108.4, 121], [106.6, 112], [106, 101], [107, 90], [109.6, 80], [114.2, 71.6], [121, 65.2], [129.6, 60.6], [139.4, 58], [150, 57.4], [160.6, 58], [170.4, 60.6], [179, 65.2], [185.8, 71.6], [190.4, 80], [193, 90], [194, 101], [193.4, 112], [191.6, 121]]);
      const ahoge = 'M 147.2 59.6 C 142.6 48 149.6 40.8 159.4 43.2 C 152.4 45.2 150.6 51 152.4 59.2 Z';
      const back = symS([[150, 60], [134, 61.6], [120, 68], [109, 80], [103.6, 96], [102.6, 114], [104, 132], [107.4, 146], [110.4, 157, 'c'], [117, 151], [124, 159, 'c'], [131, 152], [150, 156]]);
      /* 两侧向外翘的狼尾发束（参考图②的翅膀状轮廓） */
      const wings = [[118, 78, 96.4, 90, 10, 3, -1.2], [113, 90, 93.6, 111, 11, 3.4, -1], [110.6, 104, 96, 134, 11, 3, -1], [111.4, 116, 101.4, 152, 10, 2.6, -.6], [115.6, 122, 110.6, 158, 8, 1.4], [119.4, 124, 121.4, 150, 6, -1]];
      const bangs = [[121, 90, 117.6, 123, 10, -3, 1], [176, 90, 182.2, 121, 10, 3.4, -1], [130, 86, 126.4, 121, 11, -3.2], [167.6, 86, 172.2, 120, 11, 3.2], [139.6, 84, 141.4, 115, 10, 1.4], [158.6, 84, 160.6, 112.6, 10, 2], [149, 83.4, 146.6, 122, 9, -2.4]];
      return [
        { z: 2, svg: hairPiece(back, c, { rim: false, deep: [back], dc: '#CDB6AC' }) + locks(wings.slice(0, 4), c, ln) + locks(mirLocks(wings.slice(0, 4)), c, ln) },
        { z: 50, svg: locks(wings.slice(4), c, ln) + locks(mirLocks(wings.slice(4)), c, ln) + locks(bangs, c, ln) + hairPiece(ahoge, c, {}) + capPiece(cap, capLine, c, { lines: capLines(ln), shade: ['M 170 62 C 186 72 192 90 191 118 L 200 118 L 200 60 Z'] }) +
          shine([[131, 97, -14], [166, 95, 14], [149, 72, 0], [123, 80, -30]], '#CBA88F') }
      ];
    }
  },
  {
    id: 'h1', cat: 'hair', name: '挑染波波头', thumb: '88 46 124 128',
    parts() {
      const c = '#5A3A30', st = '#9CCBEA', ln = '#2E1C18';
      const back = symS([[150, 61], [134, 62.4], [120, 68], [110, 80], [104.6, 96], [103.2, 116], [103, 138], [104.2, 154], [107.6, 164.6, 'c'], [118, 166], [134, 164], [150, 164]]);
      const sideShape = spline([[108, 100], [106.2, 122], [106, 142], [107.4, 156], [110.6, 165.4, 'c'], [115.2, 161], [118.2, 164.4, 'c'], [119.6, 148], [119.4, 130], [119.6, 112], [118, 98]]);
      const streak = spline([[108.6, 104], [107.4, 128], [108, 150], [111, 163, 'c'], [116.2, 160], [115.8, 140], [115.6, 120], [116.4, 102]]);
      const bang = spline([[116, 96], [118.6, 110.8], [123.4, 113.6, 'c'], [127.4, 111.2], [132, 114.2, 'c'], [136.4, SOFT ? 104 : 111.6], [141, 114.4, 'c'], [145.4, 112], [150, 114.8, 'c'], [154.6, 112], [159, 114.4, 'c'], [163.6, SOFT ? 104 : 111.6], [168, 114.2, 'c'], [172.6, 111.2], [176.6, 113.6, 'c'], [181.4, 110.8], [184, 96], [172, 86], [150, 83.4], [128, 86]]);
      const clip = (x, y, r) => `<g transform="rotate(${r} ${x} ${y})"><rect x="${x - 5.6}" y="${y - 1.7}" width="11.2" height="3.4" rx="1.7" fill="#FFB6D5" stroke="${INK}" stroke-width=".8"/></g>`;
      return [
        { z: 2, svg: hairPiece(back, c, { rim: false, deep: [back], dc: '#B79C98' }) },
        { z: 50, svg: capHair(c, ln) + hairPiece(sideShape, c, { under: `<path d="${streak}" fill="${st}"/>`, lines: strands(['M 112 110 C 110 130 110 148 112 160'], ln) }) + hairPiece(mir(sideShape), c, { under: `<path d="${mir(streak)}" fill="${st}"/>`, lines: strands([mir('M 112 110 C 110 130 110 148 112 160')], ln) }) +
          hairPiece(bang, c, { lines: strands(['M 136 88 C 134 98 134 106 136.4 111.6', 'M 150 86 C 150 96 150 104 150 110', 'M 164 88 C 166 98 166 106 163.6 111.6', 'M 124 92 C 122 100 123 106 127.4 111.2', 'M 176 92 C 178 100 177 106 172.6 111.2'], ln), over: shine([[132, 96, -10], [168, 96, 10]], '#9A7466') }) +
          clip(119.4, 94, -34) + clip(124.4, 87.6, -42) + star5(181, 90, 3.8, '#FFE27A', .8) }
      ];
    }
  },
  {
    id: 'h2', cat: 'hair', name: '粉挑染长卷发', thumb: '74 50 152 190',
    parts() {
      const c = '#8B5E45', st = '#F5A9C9', ln = '#583826';
      const back = symS([[150, 61], [134, 62.4], [118, 70], [106.4, 86], [101, 110], [98.6, 140], [95.4, 170], [97, 200], [93.4, 228], [96.6, 256], [100, 278, 'c'], [108, 268], [116, 280, 'c'], [122, 262], [130, 250], [150, 250]]);
      const long = spline([[114, 92], [108.4, 104], [106.2, 124], [106.4, 146], [104.2, 166], [102.4, 186], [104.6, 204], [101.6, 222], [103.8, 240], [101.8, 256], [106, 268, 'c'], [110.6, 256], [113.2, 262, 'c'], [115, 246], [112.8, 230], [115.4, 214], [113, 196], [115.6, 178], [116.2, 160], [118.2, 140], [119.6, 120], [121, 102]]);
      const pink = spline([[110.6, 110], [108.8, 134], [108.8, 160], [106.2, 186], [107.6, 212], [105.8, 238], [107.6, 258, 'c'], [111, 244], [109.8, 226], [111.6, 204], [110.2, 184], [112.4, 160], [113.4, 134], [114.8, 110]]);
      const bangs = [[128, 86, 123.6, 118, 11, -3, 1], [172, 86, 176.4, 118, 11, 3, -1], [139, 83, 134, 112, 11, -3.4], [161, 83, 166, 112, 11, 3.4], [146.6, 82, 141, 101, 7, -2], [153.4, 82, 159, 101, 7, 2]];
      const waves = ['M 108 176 C 104 188 110 198 107 210', 'M 106 222 C 102 234 110 242 106 254', 'M 112 136 C 109 148 115 158 112 168'];
      return [
        { z: 2, svg: hairPiece(back, c, { lines: strands(['M 102 150 C 98 180 104 210 99 240', mir('M 102 150 C 98 180 104 210 99 240')], ln) }) },
        { z: 50, svg: capHair(c, ln, shine([[130, 73, -20], [170, 73, 20]], '#C99B80')) + hairPiece(long, c, { under: `<path d="${pink}" fill="${st}"/>`, lines: strands(waves, ln) }) + hairPiece(mir(long), c, { under: `<path d="${mir(pink)}" fill="${st}"/>`, lines: strands(waves.map(mir), ln) }) + locks(bangs, c, ln) }
      ];
    }
  },
  {
    id: 'h3', cat: 'hair', name: '炸毛丸子头', thumb: '86 24 128 150',
    parts() {
      const c = '#9A6346', ln = '#5F3A28';
      const sp = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + i * Math.PI / 16, r = i % 2 ? (SOFT ? 16 : 10) : 20.5; sp.push([150 + Math.cos(a) * r * 1.2, 55 + Math.sin(a) * r * .95, i % 2 ? undefined : 'c']); }
      sp.push([168, 60]); sp.push([150, 64]); sp.push([132, 60]);
      const bun = spline(sp);
      const side = [[112.4, 104, 110.4, 166, 6.4, -3.4, 1.4]];
      const bangs = [[122, 90, 120.4, 108, 9, -1.6], [178, 90, 179.6, 108, 9, 1.6], [131, 86, 129.6, 106, 9, -1], [169, 86, 170.4, 106, 9, 1], [140.4, 84, 139.6, 104.6, 9, -.6], [159.6, 84, 160.4, 104.6, 9, .6], [150, 83.4, 150, 106, 9, 0]];
      return [
        { z: 2, svg: hairPiece(bun, c, { lines: strands(['M 150 55 L 150 37', 'M 150 55 L 134 41', 'M 150 55 L 166 41'], ln) }) + hairPiece(BACK_HEAD(140), c, { rim: false, deep: [BACK_HEAD(140)], dc: '#C9AFA4' }) },
        { z: 50, svg: locks(side, c, ln) + locks(mirLocks(side), c, ln) + locks(bangs, c, ln) + capHair(c, ln) + flower(121, 88, 2.8, '#FFB6D5') + flower(179, 90, 2.5, '#B9E6F2') + flower(129, 81, 2.2, '#D8C8FF') }
      ];
    }
  }
];
