/* =====================================================================
   发型（第 19 版）：让头发不再「一整块、边缘圆钝」
   参考日系插画的画法：头发 = 一簇一簇的发束，发尾是长短不一、带一点弯的尖梢，侧边是一缕一缕微微鼓起、缕间有小凹口
   hairShape 自动处理每一片头发（后片、马尾、长发、侧发）：
   · 下缘（朝下的那段轮廓）变成一排尖梢：宽 7–12、长 3–12，每个尖梢往外甩一点，左右两片不会一样
   · 侧边（朝外的那段轮廓）变成一缕缕鼓起 + 凹口
   · 每个凹口往里画一条收尖的分缕线，把一整片分成几簇
   已经是细细一缕（刘海、鬓角）的不动；本身就是尖的不动
   ===================================================================== */
function hairShape(d, c) {
  const S = pathPolys(String(d)); if (!S || S.length !== 1) return null;
  let P = S[0]; if (P.length < 8) return null;
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; P.forEach(([x, y]) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); });
  const H = y1 - y0, W = x1 - x0; if (H < 36 || W < 12) return null;
  const spanAt = y => { const xs = []; for (let i = 0; i < P.length - 1; i++) { const a = P[i], b = P[i + 1]; if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) xs.push(a[0] + (y - a[1]) / (b[1] - a[1]) * (b[0] - a[0])); } xs.sort((p, q) => p - q); return xs.length >= 2 ? xs[xs.length - 1] - xs[0] : 0; };
  if (spanAt(y0 + H * .86) < 13) return null;                       // 下面已经收成一个尖：是一缕，不动
  if (Math.hypot(P[0][0] - P[P.length - 1][0], P[0][1] - P[P.length - 1][1]) > .5) P = P.concat([P[0]]);
  let per = 0; for (let i = 1; i < P.length; i++) per += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
  const N = Math.max(48, Math.min(240, Math.round(per / 2.6))), Q = resamp(P, N).slice(0, N);
  const cx = Q.reduce((s, p) => s + p[0], 0) / N, cy = Q.reduce((s, p) => s + p[1], 0) / N;
  const nrm = Q.map((p, i) => { const a = Q[(i - 1 + N) % N], b = Q[(i + 1) % N], tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1; return [ty / l, -tx / l]; });
  const sg = Q.reduce((s, p, i) => s + nrm[i][0] * (p[0] - cx) + nrm[i][1] * (p[1] - cy), 0) < 0 ? -1 : 1;
  const r = RNG(Math.round(Math.abs(x0 * 17 + y1 * 5 + W * 3 + (c ? parseInt(c.slice(1, 4), 16) || 0 : 0))) + 7);
  const scale = Math.min(1, H / 110) * .6 + .4, flow = x0 + W / 2 < 150 ? -1 : 1;           // 发梢往外甩（左边那片往左、右边往右）
  const wb = [], ws = [];
  Q.forEach((p, i) => { const nx = nrm[i][0] * sg, ny = nrm[i][1] * sg;
    wb.push(ss18(.3, .7, ny) * ss18(y0 + H * .55, y0 + H * .82, p[1]));
    ws.push(ss18(.5, .9, Math.abs(nx)) * ss18(y0 + H * .35, y0 + H * .6, p[1])); });
  // 侧边：很轻的两三处起伏（一缕压着一缕），不再一格一格
  let per2 = 0; const out = Q.map((p, i) => { if (i) per2 += Math.hypot(p[0] - Q[i - 1][0], p[1] - Q[i - 1][1]); const k = ws[i] * (1 - wb[i]) * .7 * Math.sin(per2 / 34 + 1.3);
    return [p[0] + nrm[i][0] * sg * k, p[1] + nrm[i][1] * sg * k]; });
  // 下缘：找出朝下的那一段，整段换成 2–5 缕干净的发梢（长短交替、同一个方向微微甩），缕与缕之间一个凹口
  let st = -1; for (let i = 0; i < N; i++) if (wb[i] > .35 && wb[(i - 1 + N) % N] <= .35) { st = i; break; }
  if (st < 0) return null;
  const run = []; for (let k = 0; k < N && wb[(st + k) % N] > .35; k++) run.push((st + k) % N);
  if (run.length < 5) return null;
  const base = f => { const t = f * (run.length - 1), j = Math.min(run.length - 2, Math.floor(t)), u = t - j, a = out[run[j]], b = out[run[j + 1]]; return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; };
  const rw = Math.hypot(base(1)[0] - base(0)[0], base(1)[1] - base(0)[1]), n = Math.max(2, Math.min(5, Math.round(rw / 13)));
  const LEN = [1, .7, .88, .62, .8], tips = [], splits = [];
  for (let j = 0; j < n; j++) {
    const f0 = j / n, f1 = (j + 1) / n, fm = (f0 + f1) / 2, len = Math.max(11, (16 + r() * 8) * scale) * LEN[(j + (r() < .5 ? 0 : 1)) % 5], curl = flow * (1 + r() * 1.4) * scale;
    const nb = base(f0), tp = base(fm), s1 = base(f0 + (f1 - f0) * .3), s2 = base(f0 + (f1 - f0) * .72);
    if (j) { tips.push([nb[0], nb[1] - Math.max(3, 3.4 * scale), 'c']); splits.push(nb); }
    const q1 = base(fm - (f1 - f0) * .14), q2 = base(fm + (f1 - f0) * .14);   // 两侧往里凹：尖梢细长，不是钝三角
    tips.push([s1[0] + curl * .15, s1[1] + len * .22], [q1[0] + curl * .6, q1[1] + len * .66], [tp[0] + curl, tp[1] + len, 'c'], [q2[0] + curl * .6, q2[1] + len * .7], [s2[0] + curl * .2, s2[1] + len * .26]);
  }
  const pts = [], set = new Set(run);
  for (let i = 0; i < N; i++) { const q = (st + run.length + i) % N; if (set.has(q)) continue; pts.push(out[q]); }
  // pts 从下缘结束处绕一圈到开始处；下缘新点按 run 的方向接在最后
  const all = pts.concat([out[run[0]]], tips, [out[run[run.length - 1]]]);
  // 分缕线：每个凹口往上一条细细收尖的线，顺着头发往上走
  const lines = splits.map(([x, y]) => { const L = (12 + r() * 10) * scale, b = flow * (r() * 1.6 + .4);
    return taperD([0, .33, .66, 1].map(t => [x - b * Math.sin(Math.PI * t) + flow * .8 * t, y - 2 * scale - L * t]), .95, .1); });
  return { d: spline(all, true, .5), lines };
}

/* ---------- 波浪卷（重画）：原来是按控制点下标取 sin，点太稀，出来是一格一格的小折线。
   改成沿着轮廓按长度走：先把点加密，再叠上波长约 46、越往发尾越明显的大 S 形波浪，尖角（'c'）处不动 ---------- */
wavy = function (pts, amp, n) {
  const dense = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[i + 1]; dense.push(a); if (!b) break;
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(0, Math.ceil(L / 4.5) - 1);
    for (let j = 1; j <= k; j++) { const t = j / (k + 1); dense.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
  }
  const ph = ((pts[0][0] * 7 + pts[0][1] * 3) % 6.28), lam = 42 + (n || 5) % 3 * 5;
  let s = 0;
  return dense.map((p, i) => {
    if (i) s += Math.hypot(p[0] - dense[i - 1][0], p[1] - dense[i - 1][1]);
    if (p[2] === 'c') return p;
    const a = dense[Math.max(0, i - 1)], b = dense[Math.min(dense.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
    const near = Math.min(...[-2, -1, 1, 2].map(o => (dense[i + o] && dense[i + o][2] === 'c' ? Math.abs(o) : 9)));   // 贴着尖角的点慢慢收回 0
    const k = amp * 1.15 * ss18(96, 150, p[1]) * Math.sin(2 * Math.PI * s / lam + ph) * Math.min(1, near / 3);
    return [p[0] - dy / L * k, p[1] + dx / L * k];
  });
};

/* ---------- 螺旋卷 / 小卷（重画）：原来是细碎的小锯齿 + 一排横线，看着像一格一格的色块。
   改成一缕缕大 S 形：波长 ≈ 44、幅度越往下越大；鼓出去的那侧宽一点（像卷起来的面朝外），发梢往外勾一下 ---------- */
const ringCenter = (x0, y0, x1, y1, w, n, amp) => {
  const Lh = Math.hypot(x1 - x0, y1 - y0), waves = Math.max(1, Math.min(n, Lh / 44)), A = Math.max(2.6, amp * 1.3), dir = x1 < x0 ? -1 : 1, M = 28, P = [];
  for (let i = 0; i <= M; i++) { const t = i / M, s = Math.sin(t * Math.PI * 2 * waves + .6);
    P.push([x0 + (x1 - x0) * t + s * A * (.35 + t * .65), y0 + (y1 - y0) * t, s, w * (1 - .55 * Math.pow(t, 1.6)) * (1 + .12 * s * dir) / 2]); }
  return { P, dir, A };
};
ringlet = function (x0, y0, x1, y1, w, n, amp = 2.4) {
  const { P, dir, A } = ringCenter(x0, y0, x1, y1, w, n, amp), L = [], R = [];
  P.forEach((p, i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const nx = -dy / l, ny = dx / l; L.push([p[0] - nx * p[3], p[1] - ny * p[3]]); R.push([p[0] + nx * p[3], p[1] + ny * p[3]]); });
  const e = P[P.length - 1], tip = [e[0] + dir * A * .9, y1 + 4.5, 'c'];
  return spline([...L.slice(0, -1), tip, ...R.slice(0, -1).reverse()]);
};
/* 卷发的明暗：一条顺着 S 形内侧走的收尖阴影，外加一小段高光（不再画横线） */
ringletLines = function (x0, y0, x1, y1, w, n, amp = 2.4) {
  const { P } = ringCenter(x0, y0, x1, y1, w, n, amp);
  return 'M ' + P.slice(2, -3).map(p => `${f1(p[0] - p[3] * .35 * p[2])} ${f1(p[1])}`).join(' L ');
};

/* ---------- 长发前面那片（重画）：按真实的垂坠来走，不再是一整条从太阳穴直通到腰的直板
   · 从太阳穴出来，贴着脸颊往下（被下巴轻轻挡住）
   · 落到肩膀上时被肩膀托住、往外摊开一点（肩膀这里最宽）
   · 过了肩膀顺着胸口往下垂，受重力越往下越直，发尾微微往里收
   · 分成 3 缕，长短错开、互相压一点；每缕发尾都是细长的尖梢（尖的那段占整缕的 1/4） ---------- */
function frontLocks(c, ln, len, wave = 0, seed = 1) {
  const r = RNG(seed * 97 + Math.round(len));
  const lock = (k, m) => {
    const L = len * [1, .93, .84][k] - r() * 6, sx = x => (m ? 300 - x : x);
    // 中心线：太阳穴 → 脸颊 → 肩上 → 胸前
    const C = [[111.5 + 4.2 * k, 98 + 5 * k], [110.4 + 4.6 * k, 128], [112 + 5 * k, 152], [115.4 + 7.4 * k, 170], [117.6 + 8 * k, 186], [118.4 + 8.2 * k, 214]];
    for (let y = 244; y < L - 4; y += 30) C.push([118.8 + 8.2 * k + (y - 214) * .012, y]);
    C.push([120.4 + 8.2 * k + 2.4, L]);                                    // 发尾微微往里收
    const Pc = resamp(C, 40), W = [8.6, 10.2, 9.4][k];
    const pts = Pc.map((p, i) => { const t = i / 40, y = p[1];
      const w = W * (y < 150 ? .82 : y < 170 ? .82 + (y - 150) / 20 * .36 : 1.18 - Math.min(.16, (y - 170) / 120)) * (t < .74 ? 1 : Math.pow(1 - (t - .74) / .26, 1.35));
      const wv = wave * ss18(150, 230, y) * Math.sin((y - 150) / 38 * Math.PI + k * 1.3);
      return [p[0] + wv, y, w / 2]; });
    const Lh = [], Rh = []; pts.forEach((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(40, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      Lh.push([p[0] + dy / l * p[2], p[1] - dx / l * p[2]]); Rh.push([p[0] - dy / l * p[2], p[1] + dx / l * p[2]]); });
    const e = pts[40], tip = [e[0] + 1.2, e[1] + 2, 'c'];
    const d = spline([...Lh.slice(0, 39), tip, ...Rh.slice(0, 39).reverse(), [pts[0][0], pts[0][1] - 4]].map(p => [sx(p[0]), p[1], p[2]]));
    // 一条顺着这缕往下的分缕阴影（从肩膀开始，到尖梢前收掉）
    const sh = pts.slice(14, 34).map(p => [sx(p[0] + p[2] * .25), p[1]]);
    return hairPiece(d, c, { shape: false, rim: [1.6, 1.2], over: `<path d="${taperD(sh, 1.6, .3)}" fill="${hairInk(c)}" opacity=".32"/>` });
  };
  return [0, 1, 2].map(k => lock(k, false) + lock(k, true)).join('');
}

/* =====================================================================
   丸子 / 小揪揪 / 碎发（重画）——参照日系插画的常规画法
   · 丸子：一团圆鼓鼓的头发，轮廓是 3–4 个很缓的鼓包（不是一圈尖刺）；表面两三道绕着丸子转的发流线，
     左上一小段高光；凌乱款在顶上 / 侧面翘出两三根细细的碎发
   · 小揪揪：从发圈里扎出来的一小撮，3–4 缕从发圈往上、往外散开，发梢被重力带着往下弯
   · 碎发（脸边、耳前）：很细的 S 形发丝，两头尖，描边淡，不再是粗粗的一条
   ===================================================================== */
/* 一根细发丝：(x0,y0) 发根 → (x1,y1) 发梢，bend 正 = 往画面右弯，s 形再反弯一次 */
function wispD(x0, y0, x1, y1, w = 2.6, bend = 3, s = true) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, M = 14, C = [];
  for (let i = 0; i <= M; i++) { const t = i / M, o = bend * (Math.sin(Math.PI * t) - (s ? .55 * Math.sin(2 * Math.PI * t) : 0)); C.push([x0 + dx * t - nx * o, y0 + dy * t - ny * o]); }
  const A = [], B = []; C.forEach((p, i) => { const t = i / M, ww = w * Math.sin(Math.PI * Math.min(1, .15 + t * .95)) * (1 - t * .55) / 2, a = C[Math.max(0, i - 1)], b = C[Math.min(M, i + 1)], ex = b[0] - a[0], ey = b[1] - a[1], l = Math.hypot(ex, ey) || 1;
    A.push([p[0] - ey / l * ww, p[1] + ex / l * ww]); B.push([p[0] + ey / l * ww, p[1] - ex / l * ww]); });
  return spline([...A.slice(0, M), [C[M][0], C[M][1], 'c'], ...B.slice(0, M).reverse()]);
}
const wisp = (x0, y0, x1, y1, c, w, bend, s) => hairPiece0(wispD(x0, y0, x1, y1, w, bend, s), c, { rim: false, sw: .55, auto: false, cls: '' });   // 细线描边，不参与整片头发的加粗外轮廓

bunSVG = function (cx, cy, r, c, ln, messy = false, rot = 0) {
  const lobes = 4, pts = [];
  for (let i = 0; i < 40; i++) { const a = rot + i / 40 * Math.PI * 2, rr = r * (1 + .045 * Math.cos(lobes * (a - rot) + .6)); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .9]); }
  const d = spline(pts);
  // 发流线：从丸子底部绕上去，像头发一圈圈盘上去
  const arc = (a0, a1, k) => { const P = []; for (let i = 0; i <= 10; i++) { const a = a0 + (a1 - a0) * i / 10, rr = r * k; P.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * .9 - r * .08 * Math.sin(Math.PI * i / 10)]); } return P; };
  const flow = [arc(2.7, 5.2, .74), arc(1.2, 3.6, .5), arc(4.3, 6.4, .56)].map(P => taperD(P, Math.max(1, r * .1), .45));
  const hi = mix(c, '#FFFFFF', hsl(c)[2] < .3 ? .32 : .5), gl = taperD(arc(3.5, 4.5, .78), Math.max(1.4, r * .16), .5);
  let out = hairPiece0(d, c, { rim: [1.4, 1.2], auto: false, over: `<g fill="${hairInk(c)}" opacity=".42">${flow.map(q => `<path d="${q}"/>`).join('')}</g><path d="${gl}" fill="${hi}" opacity=".7"/>` });
  if (messy) {                                                             // 翘出来的碎发：贴着丸子表面顺着绕、只有发梢离开一点（不是朝外戳出去的角）
    const W = [[-2.35, .55, 1], [-1.05, .6, -1], [.2, .5, 1]];
    out += W.map(([a, span, s]) => { const a1 = a + span * s, x0 = cx + Math.cos(a) * r * .86, y0 = cy + Math.sin(a) * r * .8, x1 = cx + Math.cos(a1) * r * 1.16, y1 = cy + Math.sin(a1) * r * 1.02 + r * .12;
      return wisp(x0, y0, x1, y1, c, Math.max(1.6, r * .11), 1.6 * s, false); }).join('');
  }
  return out;
};

/* 小揪揪：发圈在 (x,y)，dir = 1 朝画面右、-1 朝左 */
smallTail = function (x, y, c, ln, dir = 1, s = 1.1) {
  // 一整撮：发圈处收紧，往外散成三个尖（上面那个往上翘、下面那个被重力拉得往下垂），中间两道分缕线
  const P = [[0, -3.4], [5, -8.4], [11, -12.4], [17.4, -14.2, 'c'], [14.4, -8, 'c'], [20.4, -6.4], [23.6, -3, 'c'], [16.6, .6, 'c'], [20.6, 4.6], [21.4, 10.6, 'c'], [14.2, 6.4], [7, 4.4], [0, 3.6]];
  const T = ([px, py, k]) => [x + dir * px * s, y + py * s, k];
  const d = spline(P.map(T));
  const sp = [[[2, -1], [9, -4.6], [14.4, -8]], [[2, 1.2], [9, .4], [16.6, .6]]].map(L => taperD(L.map(T), 1.1 * s, .15));
  return hairPiece0(d, c, { rim: [1.3, 1], sw: .8, auto: false, over: `<g fill="${hairInk(c)}" opacity=".45">${sp.map(q => `<path d="${q}"/>`).join('')}</g>` });
};

/* 盘发 / 扎起来的头发：后脑勺那片在发际线处是一条顺的弧（头发都扎上去了，不会垂出一排发梢） */
BACK_HEAD = (BH => h => { const d = new String(BH(h)); d.noShape = true; return d; })(BACK_HEAD);
