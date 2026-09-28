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
  const step = per / N, scale = Math.min(1, H / 110) * .7 + .3;
  // 沿轮廓切成一段段：尖梢段（宽 7–12）和侧缕段（宽 14–20），各自带随机长度 / 甩向
  const segs = (lo, hi) => { const out = []; let s = 0; while (s < per) { const w = lo + r() * (hi - lo); out.push([s, s + w, r(), r()]); s += w; } return out; };
  const TIP = segs(8, 14), SIDE = segs(24, 40), find = (L, s) => L.find(q => s < q[1]) || L[L.length - 1];
  const out = [], marks = [], splits = [];
  let best = null;
  Q.forEach((p, i) => {
    const s = i * step, nx = nrm[i][0] * sg, ny = nrm[i][1] * sg, y = p[1];
    const wb = ss18(.25, .7, ny) * ss18(y0 + H * .5, y0 + H * .8, y);
    const ws = ss18(.5, .9, Math.abs(nx)) * ss18(y0 + H * .3, y0 + H * .6, y) * (1 - wb);
    const T = find(TIP, s), u = (s - T[0]) / (T[1] - T[0]), tp = Math.pow(1 - Math.abs(2 * u - 1), 2.2);
    const len = (4 + T[2] * 13) * scale, curl = (T[3] - .5) * 3.4;
    const Sd = find(SIDE, s), u2 = (s - Sd[0]) / (Sd[1] - Sd[0]), bulge = (Math.sin(Math.PI * u2) * .55 - Math.pow(1 - Math.sin(Math.PI * u2), 14) * .9) * (.6 + Sd[2] * .8);
    const e = wb * (len * tp - .9 * Math.pow(1 - tp, 8));
    const dl = Math.hypot(nx * .35, 1);
    out.push([p[0] + e * nx * .35 / dl + wb * tp * curl + ws * bulge * nx, p[1] + e / dl + ws * bulge * ny]);
    // 记下尖梢的顶点和凹口（画成尖角），凹口往里长一条分缕线
    if (wb > .3) {
      const k = TIP.indexOf(T);
      if (!best || best.k !== k) { if (best) marks.push(best.i); best = { k, i, v: tp }; } else if (tp > best.v) best = { k, i, v: tp };
      if (u < step / (T[1] - T[0]) && wb > .55 && r() < .75) splits.push([out[i][0], out[i][1], -nx * .3, -1, (8 + r() * 14) * scale]);
    } else if (ws > .6 && u2 < step / (Sd[1] - Sd[0]) && Sd[3] < .5) splits.push([p[0], p[1], -nx, -ny * .3 - .5, (6 + r() * 8) * scale]);
  });
  if (best) marks.push(best.i);
  marks.forEach(i => { out[i] = [out[i][0], out[i][1], 'c']; });
  const lines = splits.map(([x, y, dx, dy, L]) => { const l = Math.hypot(dx, dy) || 1, ux = dx / l, uy = dy / l, bend = (r() - .5) * 3;
    const pts = [0, .25, .5, .75, 1].map(t => [x + ux * L * t + (-uy) * bend * Math.sin(Math.PI * t), y + uy * L * t + ux * bend * Math.sin(Math.PI * t)]);
    return taperD(pts, 1.1, .12); });
  return { d: spline(out, true, .5), lines };
}
