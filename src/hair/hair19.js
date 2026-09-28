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
  const LEN = [1, .62, .86, .55, .78], tips = [], splits = [];
  for (let j = 0; j < n; j++) {
    const f0 = j / n, f1 = (j + 1) / n, fm = (f0 + f1) / 2, len = (9 + r() * 5) * scale * LEN[(j + (r() < .5 ? 0 : 1)) % 5], curl = flow * (1.4 + r() * 1.8) * scale;
    const nb = base(f0), tp = base(fm), s1 = base(f0 + (f1 - f0) * .3), s2 = base(f0 + (f1 - f0) * .72);
    if (j) { tips.push([nb[0], nb[1] - 2.2 * scale, 'c']); splits.push(nb); }
    tips.push([s1[0] + curl * .25, s1[1] + len * .42], [tp[0] + curl, tp[1] + len, 'c'], [s2[0] + curl * .45, s2[1] + len * .5]);
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
