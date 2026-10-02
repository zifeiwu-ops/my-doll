/* =====================================================================
   照片识别版型 · 描轮廓版：衣服的形状就是照片里那件衣服的轮廓
   不再「量几个数 → 套现成版型」，而是把照片里框出来的那一块布，一个像素一个像素搬到娃娃身上：
   · 衣身：以肩线为锚点按比例缩放到娃娃的躯干上（荷叶摆、收腰、不规则下摆、领口形状都照原样）
   · 袖子：照片里平铺时袖子是斜着伸出去的——以肩点为轴，把整只袖子转到娃娃手臂的方向，再沿手臂拉到对应长度
   · 裤子：两条裤腿各自对齐到娃娃的两条腿上
   · 照片里的衣服比娃娃窄的地方，至少把身体盖住（不会露出一条缝）
   · 纯色衣服还会把照片里明显的线（门襟、领口、口袋、育克、拼接）一起描过来
   全在浏览器里算，照片不上传
   ===================================================================== */
const FIT2 = (() => {
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const med = a => { const s = a.filter(v => v != null && isFinite(v)).sort((x, y) => x - y); return s.length ? s[s.length >> 1] : null; };
  const LEG_K = 1.6;      // 娃娃是时装比例，腿比真人长：裆以下竖向多拉一些
  /* ---------- 照片里的衣服：行扫描、中线、半宽、肩线 ---------- */
  function measure(M, W, H) {
    let x0 = W, x1 = -1, y0 = H, y1 = -1, n = 0, sx = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (M[y * W + x]) { n++; sx += x; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (n < 40 || y1 - y0 < 8) return null;
    const h = y1 - y0 + 1, cx = (sx / n + (x0 + x1) / 2) / 2, segs = [];
    for (let y = y0; y <= y1; y++) { const s = []; let a = -1; for (let x = 0; x <= W; x++) { const on = x < W && M[y * W + x]; if (on && a < 0) a = x; if (!on && a >= 0) { s.push([a, x - 1]); a = -1; } } segs[y] = s; }
    const at = t => y0 + Math.round(cl(t, 0, 1) * (h - 1));
    const cen = y => { let best = null, bd = 1e9; (segs[y] || []).forEach(g => { const d = g[0] <= cx && g[1] >= cx ? 0 : Math.min(Math.abs(g[0] - cx), Math.abs(g[1] - cx)); if (d < bd) { bd = d; best = g; } }); return bd <= 1.5 ? best : null; };
    const hw = y => { const g = cen(y); return g ? (g[1] - g[0] + 1) / 2 : null; };
    const band = (a, b, f) => { const v = []; for (let t = a; t <= b + 1e-6; t += .02) v.push(f(at(t))); return v; };
    const topY = x => { x = Math.round(x); if (x < 0 || x >= W) return null; for (let y = y0; y <= y1; y++) if (M[y * W + x]) return y; return null; };
    const gapAt = y => { const s = segs[y] || []; return s.length >= 2 && !s.some(g => g[0] <= cx + .5 && g[1] >= cx - .5) && s.some(g => g[1] < cx) && s.some(g => g[0] > cx); };
    return { M, W, H, x0, x1, y0, y1, h, n, cx, segs, cen, hw, band, topY, gapAt, at };
  }
  /* 衣服类型沿用量版型那一套（fit21）的判断 */
  const kindOf = (M, W, H) => { const f = FIT.analyze(M, W, H); return f ? f.kind : 'top'; };

  /* ---------- 照片坐标 → 娃娃坐标 ---------- */
  function mapper(m, kind, opt) {
    const { cx, y0, y1, band, hw, topY, gapAt } = m, ease = opt.ease ?? 1, lenK = opt.len ?? 1;
    if (kind === 'skirt' || kind === 'pants') {
      const wt = med(band(.01, .06, hw)) || (m.x1 - m.x0) / 2, top = 282, dW = 150 - outerX(top) + 2.6, s = dW / wt * ease;
      let cr = null; if (kind === 'pants') { for (let y = y1; y >= y0; y--) if (!gapAt(y)) { cr = y + 1; break; } if (cr == null || cr - y0 < 3) cr = y0 + (y1 - y0) * .3; }
      const sv = kind === 'pants' ? cl(45 / Math.max(1, cr - y0), s * .6, s * 1.6) : s;
      const Y = y => { if (kind === 'pants') return y <= cr ? top + (y - y0) * sv : Math.min(574, 327 + (y - cr) * s * LEG_K * lenK);
        const b = top + (y - y0) * s * lenK; return b > 316 ? Math.min(574, 316 + (b - 316) * 1.45) : b; };
      return { kind, s, Y, cr, pt: (x, y) => [150 + (x - cx) * s, Y(y)] };
    }
    const tw = Math.min(med(band(.5, .8, hw)) ?? 1e9, med(band(.2, .4, hw)) ?? 1e9), TW = tw < 1e9 ? tw : (m.x1 - m.x0) / 4;
    const sh = Math.min(...[-.75, -.6, -.45, .45, .6, .75].map(k => topY(cx + k * TW) ?? 1e9)), dTw = 150 - sideX(232) + 3.2, s = dTw / TW * ease;
    const A = 164, Y = y => { const b = A + (y - sh) * s * 1.12 * lenK; return b > 316 ? Math.min(574, 316 + (b - 316) * LEG_K) : b; };
    // 袖子：肩点、照片里袖子的方向 → 娃娃手臂的方向
    const sleeve = side => {
      const px = cx + side * TW, py = topY(px) ?? sh; let sxs = 0, sys = 0, k = 0, far = 0;
      for (let y = y0; y <= y0 + m.h * .92; y++) for (let x = 0; x < m.W; x++) { if (!m.M[y * m.W + x] || (x - cx) * side <= TW * 1.12) continue; if (y > sh + TW * 1.3) { const g = m.cen(y); if (g && x >= g[0] && x <= g[1]) continue; } sxs += x - px; sys += y - py; k++; far = Math.max(far, Math.hypot(x - px, y - py)); }
      if (k < m.n * .012) return null;
      const ap = Math.atan2(sys / k, sxs / k);   // 照片里袖子的方向
      const D = side < 0 ? [116, 181] : [184, 181], wy = 318, wx = side < 0 ? (armO0(wy) + armI0(wy)) / 2 : 300 - (armO0(wy) + armI0(wy)) / 2, ad = Math.atan2(wy - D[1], wx - D[0]);
      return { px, py, rot: ad - ap, D, far, ad };
    };
    const SL = sleeve(-1), SR = sleeve(1), AX = 1.45 * lenK;   // 沿手臂方向拉长（娃娃手臂比真人长）
    const inSleeve = (x, y) => { const side = x < cx ? -1 : 1, S = side < 0 ? SL : SR; if (!S || (x - cx) * side <= TW * 1.12) return null; if (y > sh + TW * 1.3) { const g = m.cen(y); if (g && x >= g[0] && x <= g[1]) return null; } return S; };
    const slvPt = (S, x, y) => { const vx = x - S.px, vy = y - S.py, c = Math.cos(S.rot), sn = Math.sin(S.rot), rx = vx * c - vy * sn, ry = vx * sn + vy * c, ux = Math.cos(S.ad), uy = Math.sin(S.ad), a = rx * ux + ry * uy, p = -rx * uy + ry * ux, A2 = a * s * AX, P2 = p * s;
      return [S.D[0] + ux * A2 - uy * P2, S.D[1] + uy * A2 + ux * P2]; };
    return { kind, s, Y, sh, TW, SL, SR, inSleeve, slvPt, pt: (x, y) => { const S = inSleeve(x, y); return S ? slvPt(S, x, y) : [150 + (x - cx) * s, Y(y)]; } };
  }

  /* ---------- 画到娃娃画布上的蒙版 → 描成矢量轮廓 ---------- */
  function build(P, M, kindIn, opt = {}) {
    const m = measure(M, P.W, P.H); if (!m) return null;
    const kind = kindIn || kindOf(M, P.W, P.H), mp = mapper(m, kind === 'outer' || kind === 'dress' ? (kind === 'outer' ? 'top' : 'dress') : kind, opt);
    const cv = mkC(DW, DH), g = cv.getContext('2d'); g.fillStyle = '#fff'; g.scale(DS, DS);
    const px = Math.max(.7, mp.s * 1.15), body = Y => (Y < 316 ? 150 - torsoD(Y) : 150 - (kind === 'pants' ? legO(Y) : outerX(Y)));
    let reach = { L: 0, R: 0 };
    // 照片蒙版先放大 4 倍、双线性插值后再取阈值：边缘是顺滑的曲线，不是一格一格的台阶
    const U = 4, W = P.W, WU = W * U, HU = P.H * U;
    // 照片缩到 160 像素宽后，接近竖直的边会变成一级一级的台阶：先把蒙版模糊两遍（半径 1.5 像素）再取轮廓
    let B = Float32Array.from(M); for (let it = 0; it < 2; it++) { const O = new Float32Array(B.length); for (let y = 0; y < P.H; y++) for (let x = 0; x < W; x++) { let t = 0, c = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= P.H) { c++; continue; } t += B[yy * W + xx] * (dx || dy ? 1 : 2); c += dx || dy ? 1 : 2; } O[y * W + x] = t / c; } B = O; }
    const Mf = (x, y) => (x < 0 || y < 0 || x >= W || y >= P.H ? 0 : B[y * W + x]);
    const up = (X, Y) => { const fx = X / U - .5, fy = Y / U - .5, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
      return (Mf(x0, y0) * (1 - tx) + Mf(x0 + 1, y0) * tx) * (1 - ty) + (Mf(x0, y0 + 1) * (1 - tx) + Mf(x0 + 1, y0 + 1) * tx) * ty >= .5; };
    const pu = Math.max(.5, mp.s / U * 1.25);
    for (let Yu = m.y0 * U - U; Yu <= (m.y1 + 1) * U + U; Yu++) {
      const y = (Yu + .5) / U, yi = Math.max(m.y0, Math.min(m.y1, Math.floor(y))), Y0 = mp.Y(y - .5 / U), Y1 = mp.Y(y + .5 / U), hh = Math.max(pu, Y1 - Y0 + .35);
      let a = -1;
      for (let Xu = Math.max(0, m.x0 * U - U); Xu <= Math.min(WU, (m.x1 + 1) * U + U); Xu++) {
        const on = Xu < WU && up(Xu, Yu);
        if (on && a < 0) a = Xu;
        if (on || a < 0) continue;
        const ax = a / U, bx = Xu / U; a = -1;   // 这一行里的一段布 [ax, bx)（照片坐标）
        if (kind === 'pants' && y > mp.cr) {   // 裤腿：每条腿对齐到娃娃的腿
          const left = (ax + bx) / 2 < m.cx, pm = (ax + bx) / 2, Ym = (Y0 + Y1) / 2, lo = legO(Ym), li = Math.min(149.4, legID(Ym));
          let A = (lo + li) / 2 + (ax - pm) * mp.s, B = (lo + li) / 2 + (bx - pm) * mp.s; A = Math.min(A, lo - 2.2); B = Math.max(B, li + 1.2); B = Math.min(B, 149.6);
          if (!left) [A, B] = [300 - B, 300 - A];
          g.fillRect(A, Y0, B - A, hh); continue;
        }
        const band = mp.inSleeve ? mp.TW * 1.12 : 1e9, c0 = Math.max(ax, m.cx - band), c1 = Math.min(bx, m.cx + band);
        if (c1 > c0) {
          let A = 150 + (c0 - m.cx) * mp.s, B = 150 + (c1 - m.cx) * mp.s;
          if (ax <= m.cx + .5 && bx >= m.cx - .5) { const bw = body((Y0 + Y1) / 2) + 1.8; A = Math.min(A, 150 - bw); B = Math.max(B, 150 + bw); }   // 盖住身体
          g.fillRect(A, Y0, B - A, hh);
        }
        if (mp.inSleeve) for (let xs = ax; xs < bx; xs += 1 / U) {
          if (xs >= c0 && xs < c1) continue;
          const S = mp.inSleeve(xs, yi);
          if (!S) { g.fillRect(150 + (xs - m.cx) * mp.s, Y0, mp.s / U + .4, hh); continue; }
          const q = mp.slvPt(S, xs + .5 / U, y); g.fillRect(q[0] - pu / 2, q[1] - pu / 2, pu, pu);
          const k = xs < m.cx ? 'L' : 'R'; reach[k] = Math.max(reach[k], q[1]);
        }
      }
    }
    // 袖子盖住手臂：从肩膀到袖口那一截，手臂外面至少有一层布
    ['L', 'R'].forEach(k => { const yE = reach[k]; if (yE < 200) return; const pts = [];
      for (let y = 196; y <= yE; y += 3) pts.push([armO(y) - 2.2, y]); for (let y = yE; y >= 222; y -= 3) pts.push([Math.min(armI(y) + 2, 128), y]); pts.push([124, 205]);
      g.beginPath(); pts.forEach(([x, y], i) => { const X = k === 'L' ? x : 300 - x; i ? g.lineTo(X, y) : g.moveTo(X, y); }); g.closePath(); g.fill(); });
    const D = g.getImageData(0, 0, DW, DH).data, N = DW * DH, MM = new Uint8Array(N);
    const yMin = kind === 'skirt' || kind === 'pants' ? 276 : 152;
    for (let i = 0; i < N; i++) MM[i] = D[i * 4 + 3] > 100 && (i / DW | 0) >= yMin * DS ? 1 : 0;
    fillHoles(MM, new Uint8Array(N)); smoothMask(MM, 3, 2);
    const r = maskToPath(MM); if (!r.d) return null;
    // 纯色衣服：照片里明显的线（门襟、口袋、拼接、领口）一起描过来
    const lines = opt.lines === false ? [] : photoLines(P, M, m, mp);
    const [bx0, by0, bx1, by1] = r.bbox, sz = Math.max(bx1 - bx0, by1 - by0) * 1.1 + 4, tcx = (bx0 + bx1) / 2, tcy = (by0 + by1) / 2;
    return { kind, cat: kind === 'skirt' || kind === 'pants' ? 'bottom' : kind, shape: r.d, lines, thumb: `${f1(tcx - sz / 2)} ${f1(tcy - sz / 2)} ${f1(sz)} ${f1(sz)}`, bbox: r.bbox, pants: kind === 'pants', hem: by1 };
  }
  /* 照片里布料上的强边缘 → 连成线 → 搬到娃娃身上 */
  function photoLines(P, M, m, mp) {
    const { W, H, LAB } = P, E = new Uint8Array(W * H), ins = i => M[i] && M[i - 1] && M[i + 1] && M[i - W] && M[i + W] && M[i - 2] && M[i + 2] && M[i - 2 * W] && M[i + 2 * W];
    const G = new Float32Array(W * H); let gs = [];
    for (let y = 2; y < H - 2; y++) for (let x = 2; x < W - 2; x++) { const i = y * W + x; if (!ins(i)) continue; const d = (a, b) => Math.hypot(LAB[a * 3] - LAB[b * 3], (LAB[a * 3 + 1] - LAB[b * 3 + 1]) * .6, (LAB[a * 3 + 2] - LAB[b * 3 + 2]) * .6);
      G[i] = Math.max(d(i - 1, i + 1), d(i - W, i + W)); gs.push(G[i]); }
    if (gs.length < 50) return [];
    gs.sort((a, b) => a - b); const T = Math.max(14, gs[Math.floor(gs.length * .9)]);
    let cnt = 0; for (let i = 0; i < W * H; i++) if (G[i] > T) { E[i] = 1; cnt++; }
    if (cnt > gs.length * .16) return [];       // 到处都是边：是印花 / 格子，不描
    const seen = new Uint8Array(W * H), out = [];
    for (let s0 = 0; s0 < W * H; s0++) { if (!E[s0] || seen[s0]) continue;
      const st = [s0], C = []; seen[s0] = 1;
      while (st.length) { const p = st.pop(), x = p % W, y = (p - x) / W; C.push([x, y]); for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const q = p + dy * W + dx; if (q >= 0 && q < W * H && E[q] && !seen[q]) { seen[q] = 1; st.push(q); } } }
      if (C.length < 6) continue;
      // 沿主方向排好序 → 简化成折线
      let mx = 0, my = 0; C.forEach(([x, y]) => { mx += x; my += y; }); mx /= C.length; my /= C.length;
      let sxx = 0, syy = 0, sxy = 0; C.forEach(([x, y]) => { sxx += (x - mx) ** 2; syy += (y - my) ** 2; sxy += (x - mx) * (y - my); });
      const ang = .5 * Math.atan2(2 * sxy, sxx - syy), ux = Math.cos(ang), uy = Math.sin(ang), proj = C.map(([x, y]) => [(x - mx) * ux + (y - my) * uy, x, y]).sort((a, b) => a[0] - b[0]);
      const span = proj[proj.length - 1][0] - proj[0][0]; if (span < 5) continue;
      const bins = new Map(); proj.forEach(([t, x, y]) => { const k = Math.round(t); const b = bins.get(k) || [0, 0, 0]; b[0] += x; b[1] += y; b[2]++; bins.set(k, b); });
      const pl = [...bins.entries()].sort((a, b) => a[0] - b[0]).map(([, b]) => mp.pt(b[0] / b[2] + .5, b[1] / b[2] + .5));
      const sp = rdp(pl, .8); if (sp.length >= 2) out.push(sp);
      if (out.length > 24) break;
    }
    return out.map(pl => 'M ' + pl.map(([x, y]) => `${f1(x)} ${f1(y)}`).join(' L '));
  }
  const NAME = { top: '上衣', outer: '外套', dress: '连衣裙', skirt: '半裙', pants: '裤子' };
  return { build, NAME };
})();
