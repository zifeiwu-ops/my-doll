/* =====================================================================
   照片识别（纯前端，不需要模型文件）
   1. 用照片四周的颜色估计背景，把和背景差别大的连通区域当作衣服
   2. 如果整张都是布料（特写），直接整张当面料
   3. 用户点一下照片：取点击处附近出现的几种颜色，向外连通生长
   4. 在衣服区域做 k-means 取主色，判断纯色 / 印花，
      再裁一块面料、压成 4–5 色的像素贴图，镜像拼成无缝图案
   ===================================================================== */
const V = (() => {
  const LUT = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const c = i / 255; LUT[i] = c <= .04045 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); }
  const f = t => (t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  const fi = t => (t > .206893 ? t * t * t : (t - 16 / 116) / 7.787);
  const l2s = c => { c = c <= .0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(c, 0), 1 / 2.4) - .055; return Math.max(0, Math.min(255, Math.round(c * 255))); };
  function rgb2lab(r, g, b) {
    const R = LUT[r], G = LUT[g], B = LUT[b];
    const x = f((R * .4124 + G * .3576 + B * .1805) / .95047), y = f(R * .2126 + G * .7152 + B * .0722), z = f((R * .0193 + G * .1192 + B * .9505) / 1.08883);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  }
  function lab2hex(L, a, b) {
    const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - b / 200;
    const X = fi(fx) * .95047, Y = fi(fy), Z = fi(fz) * 1.08883;
    return rgb2hex(l2s(3.2406 * X - 1.5372 * Y - .4986 * Z), l2s(-.9689 * X + 1.8758 * Y + .0415 * Z), l2s(.0557 * X - .2040 * Y + 1.0570 * Z));
  }
  const d2 = (P, i, C, j, w) => { const a = (P[i] - C[j]) * w, b = P[i + 1] - C[j + 1], c = P[i + 2] - C[j + 2]; return a * a + b * b + c * c; };

  function kmeans(P, n, k, w, iters = 12) {
    k = Math.max(1, Math.min(k, n));
    let s = 12345; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const C = new Float32Array(3 * k), D = new Float32Array(n).fill(Infinity);
    let j0 = Math.floor(rnd() * n); C[0] = P[j0 * 3]; C[1] = P[j0 * 3 + 1]; C[2] = P[j0 * 3 + 2];
    for (let c = 1; c < k; c++) {
      let sum = 0;
      for (let i = 0; i < n; i++) { const d = d2(P, i * 3, C, (c - 1) * 3, w); if (d < D[i]) D[i] = d; sum += D[i]; }
      let r = rnd() * sum, j = 0;
      for (; j < n - 1; j++) { r -= D[j]; if (r <= 0) break; }
      C[c * 3] = P[j * 3]; C[c * 3 + 1] = P[j * 3 + 1]; C[c * 3 + 2] = P[j * 3 + 2];
    }
    const cnt = new Float64Array(k);
    for (let it = 0; it < iters; it++) {
      const S = new Float64Array(3 * k); cnt.fill(0);
      for (let i = 0; i < n; i++) {
        let best = 0, bd = Infinity;
        for (let c = 0; c < k; c++) { const d = d2(P, i * 3, C, c * 3, w); if (d < bd) { bd = d; best = c; } }
        cnt[best]++; S[best * 3] += P[i * 3]; S[best * 3 + 1] += P[i * 3 + 1]; S[best * 3 + 2] += P[i * 3 + 2];
      }
      for (let c = 0; c < k; c++) if (cnt[c]) { C[c * 3] = S[c * 3] / cnt[c]; C[c * 3 + 1] = S[c * 3 + 1] / cnt[c]; C[c * 3 + 2] = S[c * 3 + 2] / cnt[c]; }
    }
    return { C, cnt, k };
  }
  function nearest(P, i, km, w) {
    let best = 0, bd = Infinity;
    for (let c = 0; c < km.k; c++) { if (!km.cnt[c]) continue; const d = d2(P, i, km.C, c * 3, w); if (d < bd) { bd = d; best = c; } }
    return [best, Math.sqrt(bd)];
  }
  function resample(src, W, H) {
    let cur = src, cw = src.naturalWidth || src.width, ch = src.naturalHeight || src.height;
    while (cw / 2 > W * 1.5) {
      const c = document.createElement('canvas'); c.width = Math.round(cw / 2); c.height = Math.round(ch / 2);
      c.getContext('2d').drawImage(cur, 0, 0, c.width, c.height); cur = c; cw = c.width; ch = c.height;
    }
    const out = document.createElement('canvas'); out.width = W; out.height = H;
    const ctx = out.getContext('2d', { willReadFrequently: true });
    ctx.imageSmoothingQuality = 'high'; ctx.drawImage(cur, 0, 0, W, H);
    return ctx;
  }
  function prep(src) {
    const sw = src.naturalWidth || src.width, sh = src.naturalHeight || src.height;
    const sc = 160 / Math.max(sw, sh), W = Math.max(8, Math.round(sw * sc)), H = Math.max(8, Math.round(sh * sc));
    const px = resample(src, W, H).getImageData(0, 0, W, H).data;
    const n = W * H, LAB = new Float32Array(3 * n), SKINM = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      const r = px[i * 4], g = px[i * 4 + 1], b = px[i * 4 + 2], l = rgb2lab(r, g, b);
      LAB[i * 3] = l[0]; LAB[i * 3 + 1] = l[1]; LAB[i * 3 + 2] = l[2];
      const Y = .299 * r + .587 * g + .114 * b, Cr = (r - Y) * .713 + 128, Cb = (b - Y) * .564 + 128;
      SKINM[i] = Cr > 136 && Cr < 173 && Cb > 77 && Cb < 127 && Y > 60 ? 1 : 0;
    }
    return { src, sw, sh, W, H, n, LAB, SKINM };
  }
  function morph(M, W, H, grow) {
    const O = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let v = grow ? 0 : 1;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        const inside = xx >= 0 && yy >= 0 && xx < W && yy < H;
        const m = inside ? M[yy * W + xx] : (grow ? 0 : 1);
        if (grow && m) v = 1; if (!grow && !m) v = 0;
      }
      O[y * W + x] = v;
    }
    return O;
  }
  const close = (M, W, H) => morph(morph(M, W, H, true), W, H, false);
  const open = (M, W, H) => morph(morph(M, W, H, false), W, H, true);
  function comps(M, W, H) {
    const L = new Int32Array(W * H).fill(-1), out = [], st = [];
    for (let i = 0; i < W * H; i++) {
      if (!M[i] || L[i] >= 0) continue;
      const id = out.length; let area = 0, sx = 0, sy = 0; st.push(i); L[i] = id;
      while (st.length) {
        const p = st.pop(), x = p % W, y = (p - x) / W; area++; sx += x; sy += y;
        const nb = [x > 0 ? p - 1 : -1, x < W - 1 ? p + 1 : -1, y > 0 ? p - W : -1, y < H - 1 ? p + W : -1];
        for (const q of nb) if (q >= 0 && M[q] && L[q] < 0) { L[q] = id; st.push(q); }
      }
      out.push({ id, area, cx: sx / area, cy: sy / area });
    }
    return { L, list: out };
  }
  function fillHoles(M, W, H) {
    const R = new Uint8Array(W * H), st = [];
    for (let x = 0; x < W; x++) { st.push(x, (H - 1) * W + x); }
    for (let y = 0; y < H; y++) { st.push(y * W, y * W + W - 1); }
    while (st.length) {
      const p = st.pop(); if (R[p] || M[p]) continue; R[p] = 1;
      const x = p % W, y = (p - x) / W;
      if (x > 0) st.push(p - 1); if (x < W - 1) st.push(p + 1); if (y > 0) st.push(p - W); if (y < H - 1) st.push(p + W);
    }
    const O = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) O[i] = M[i] || !R[i] ? 1 : 0; return O;
  }
  function keepComp(M, W, H, pick) {
    const { L, list } = comps(M, W, H);
    if (!list.length) return null;
    const best = pick(list); if (!best) return null;
    const O = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) O[i] = L[i] === best.id ? 1 : 0;
    return { M: fillHoles(O, W, H), area: best.area };
  }
  function ellipseMask(W, H, rx, ry) {
    const M = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const a = (x - W / 2) / (W * rx), b = (y - H / 2) / (H * ry); M[y * W + x] = a * a + b * b <= 1 ? 1 : 0; }
    return M;
  }

  function autoMask(P) {
    const { W, H, n, LAB } = P, m = Math.max(2, Math.round(Math.min(W, H) * .06)), bi = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (x < m || y < m || x >= W - m || y >= H - m) bi.push(y * W + x);
    const BP = new Float32Array(bi.length * 3);
    bi.forEach((p, j) => { BP[j * 3] = LAB[p * 3]; BP[j * 3 + 1] = LAB[p * 3 + 1]; BP[j * 3 + 2] = LAB[p * 3 + 2]; });
    const km = kmeans(BP, bi.length, 3, .5, 10);
    const bd = []; for (let j = 0; j < bi.length; j++) bd.push(nearest(BP, j * 3, km, .5)[1]);
    bd.sort((a, b) => a - b);
    const T = Math.min(40, Math.max(12, bd[Math.floor(bd.length * .9)] * 1.6 + 6));
    let M = new Uint8Array(n), cnt = 0;
    for (let i = 0; i < n; i++) if (nearest(LAB, i * 3, km, .5)[1] > T) { M[i] = 1; cnt++; }
    let same = 0, ct = 0;
    for (let y = Math.floor(H * .25); y < H * .75; y++) for (let x = Math.floor(W * .25); x < W * .75; x++) { ct++; if (!M[y * W + x]) same++; }
    if (cnt / n > .8 || same / ct > .7) {
      M.fill(0); for (let y = m; y < H - m; y++) for (let x = m; x < W - m; x++) M[y * W + x] = 1;
      return { M, kind: 'closeup' };
    }
    M = open(close(M, W, H), W, H);
    const diag = Math.hypot(W, H);
    const r = keepComp(M, W, H, list => {
      let best = null, bs = -1;
      for (const c of list) { const d = Math.hypot(c.cx - W / 2, c.cy - H / 2) / diag; const s = c.area * Math.pow(Math.max(0, 1 - 1.4 * d), 2); if (s > bs) { bs = s; best = c; } }
      return best;
    });
    if (!r || r.area / n < .03) return { M: ellipseMask(W, H, .32, .36), kind: 'fallback' };
    return { M: r.M, kind: 'auto' };
  }

  function tapMask(P, tx, ty) {
    const { W, H, n, LAB } = P, idx = [];
    for (let i = 0; i < n; i += 2) idx.push(i);
    const SP = new Float32Array(idx.length * 3);
    idx.forEach((p, j) => { SP[j * 3] = LAB[p * 3]; SP[j * 3 + 1] = LAB[p * 3 + 1]; SP[j * 3 + 2] = LAB[p * 3 + 2]; });
    const km = kmeans(SP, idx.length, 7, .5, 10);
    const A = new Uint8Array(n); for (let i = 0; i < n; i++) A[i] = nearest(LAB, i * 3, km, .5)[0];
    const r = Math.max(4, Math.round(Math.min(W, H) * .07)), counts = new Array(km.k).fill(0); let tot = 0;
    for (let y = Math.max(0, ty - r); y <= Math.min(H - 1, ty + r); y++) for (let x = Math.max(0, tx - r); x <= Math.min(W - 1, tx + r); x++) { counts[A[y * W + x]]++; tot++; }
    const S = new Set([A[ty * W + tx]]); counts.forEach((c, k) => { if (c / tot >= .12) S.add(k); });
    let M = new Uint8Array(n); for (let i = 0; i < n; i++) M[i] = S.has(A[i]) ? 1 : 0;
    M = close(close(M, W, H), W, H);
    const res = keepComp(M, W, H, list => {
      const { L } = comps(M, W, H); const lid = L[ty * W + tx];
      if (lid >= 0) return list.find(c => c.id === lid);
      let best = null, bd = Infinity; for (const c of list) { const d = Math.hypot(c.cx - tx, c.cy - ty); if (d < bd && c.area > 20) { bd = d; best = c; } }
      return best;
    });
    if (!res) return { M: ellipseMask(W, H, .32, .36), kind: 'fallback' };
    return { M: res.M, kind: 'tap' };
  }

  function maxSquare(M, W, H) {
    const D = new Uint16Array(W * H); let best = 0, bx = 0, by = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = y * W + x; if (!M[i]) continue;
      D[i] = x && y ? 1 + Math.min(D[i - 1], D[i - W], D[i - W - 1]) : 1;
      if (D[i] > best) { best = D[i]; bx = x; by = y; }
    }
    return { s: best, x: bx - best + 1, y: by - best + 1 };
  }
  const enhance = c => lab2hex(Math.min(90, Math.max(24, c.L * .92 + 8)), c.a * 1.15, c.b * 1.15);

  function extract(P, Min, kind) {
    const { W, H, n, LAB, SKINM } = P;
    let M = Min, area = 0, skin = 0;
    for (let i = 0; i < n; i++) if (M[i]) { area++; if (SKINM[i]) skin++; }
    if (kind !== 'closeup' && area && skin / area > .02 && skin / area < .45) { M = new Uint8Array(n); for (let i = 0; i < n; i++) M[i] = Min[i] && !SKINM[i] ? 1 : 0; M = open(M, W, H); }
    const idx = []; for (let i = 0; i < n; i++) if (M[i]) idx.push(i);
    if (idx.length < 30) for (let i = 0; i < n; i++) if (Min[i]) idx.push(i);
    const stride = Math.max(1, Math.floor(idx.length / 6000)), sel = idx.filter((_, j) => j % stride === 0);
    const FP = new Float32Array(sel.length * 3);
    sel.forEach((p, j) => { FP[j * 3] = LAB[p * 3]; FP[j * 3 + 1] = LAB[p * 3 + 1]; FP[j * 3 + 2] = LAB[p * 3 + 2]; });
    const km = kmeans(FP, sel.length, 5, .45, 14);
    let cl = [];
    for (let c = 0; c < km.k; c++) if (km.cnt[c]) cl.push({ L: km.C[c * 3], a: km.C[c * 3 + 1], b: km.C[c * 3 + 2], w: km.cnt[c] / sel.length });
    const dist = (p, q, wl) => Math.hypot((p.L - q.L) * wl, p.a - q.a, p.b - q.b);
    for (let merged = true; merged && cl.length > 1;) {
      merged = false;
      outer: for (let i = 0; i < cl.length; i++) for (let j = i + 1; j < cl.length; j++) if (dist(cl[i], cl[j], .45) < 11) {
        const A = cl[i], B = cl[j], w = A.w + B.w;
        cl[i] = { L: (A.L * A.w + B.L * B.w) / w, a: (A.a * A.w + B.a * B.w) / w, b: (A.b * A.w + B.b * B.w) / w, w };
        cl.splice(j, 1); merged = true; break outer;
      }
    }
    cl.sort((a, b) => b.w - a.w);
    cl = cl.filter(c => c.w >= .04); const tw = cl.reduce((s, c) => s + c.w, 0); cl.forEach(c => c.w /= tw);
    const dom = cl[0];
    let far = 0; cl.forEach(c => { if (dist(c, dom, .35) > 20) far += c.w; });
    const mode = far > .08 ? 'pattern' : 'solid';
    const palette = cl.map(enhance);
    return { mode, color: palette[0], palette, tile: makeTile(P, M, cl) };
  }

  function makeTile(P, M, cl) {
    const { W, H, src, sw, LAB } = P;
    const K = cl.length, C = new Float32Array(K * 3);
    cl.forEach((c, i) => { C[i * 3] = c.L; C[i * 3 + 1] = c.a; C[i * 3 + 2] = c.b; });
    const km = { C, cnt: cl.map(() => 1), k: K };
    const D = new Uint16Array(W * H); let best = 0, bx = 0, by = 0;
    for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) {
      const i = yy * W + xx; if (!M[i]) continue;
      D[i] = xx && yy ? 1 + Math.min(D[i - 1], D[i - W], D[i - W - 1]) : 1; if (D[i] > best) { best = D[i]; bx = xx; by = yy; }
    }
    let x = 0, y = 0, s;
    if (best >= 10) {
      /* 在衣服区域里找一块“颜色比例最像整件衣服”的方块当面料样本 */
      s = Math.max(6, Math.min(Math.round(Math.min(W, H) * .3), best - 2));
      const W1 = W + 1, II = Array.from({ length: K }, () => new Uint32Array(W1 * (H + 1)));
      for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) {
        const a = nearest(LAB, (yy * W + xx) * 3, km, .45)[0], r1 = (yy + 1) * W1, r0 = yy * W1;
        for (let c = 0; c < K; c++) II[c][r1 + xx + 1] = II[c][r0 + xx + 1] + II[c][r1 + xx] - II[c][r0 + xx] + (a === c ? 1 : 0);
      }
      let bs = Infinity; const step = s > 24 ? 2 : 1;
      for (let yy = s; yy < H; yy += step) for (let xx = s; xx < W; xx += step) {
        if (D[yy * W + xx] < s + 2) continue;
        const x0 = xx - s, y0 = yy - s, x1 = xx, y1 = yy; let sc = 0;
        for (let c = 0; c < K; c++) { const v = II[c][y1 * W1 + x1] - II[c][y0 * W1 + x1] - II[c][y1 * W1 + x0] + II[c][y0 * W1 + x0]; sc += Math.abs(v / (s * s) - cl[c].w); }
        if (sc < bs) { bs = sc; x = x0; y = y0; }
      }
      if (bs === Infinity) { s = Math.max(6, best - 2); x = bx - best + 2; y = by - best + 2; }
    } else {
      let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) if (M[yy * W + xx]) { x0 = Math.min(x0, xx); y0 = Math.min(y0, yy); x1 = Math.max(x1, xx); y1 = Math.max(y1, yy); }
      if (x1 <= x0) { x0 = 0; y0 = 0; x1 = W - 1; y1 = H - 1; }
      s = Math.max(6, Math.round(Math.min(x1 - x0, y1 - y0) * .7)); x = Math.round((x0 + x1 - s) / 2); y = Math.round((y0 + y1 - s) / 2);
    }
    const k = sw / W, N = 28;
    const mid = document.createElement('canvas'), ms = Math.max(N, Math.min(192, Math.round(s * k)));
    mid.width = mid.height = ms;
    const mctx = mid.getContext('2d'); mctx.imageSmoothingQuality = 'high'; mctx.drawImage(src, x * k, y * k, s * k, s * k, 0, 0, ms, ms);
    const t = document.createElement('canvas'); t.width = t.height = N;
    const tc = t.getContext('2d', { willReadFrequently: true }); tc.imageSmoothingQuality = 'high'; tc.drawImage(mid, 0, 0, N, N);
    const img = tc.getImageData(0, 0, N, N), d = img.data;
    const rgb = cl.map(c => hex2rgb(enhance(c)));
    const A = new Uint8Array(N * N), tmp = new Float32Array(3);
    for (let i = 0; i < N * N; i++) { const l = rgb2lab(d[i * 4], d[i * 4 + 1], d[i * 4 + 2]); tmp[0] = l[0]; tmp[1] = l[1]; tmp[2] = l[2]; A[i] = nearest(tmp, 0, km, .45)[0]; }
    const B = A.slice();
    for (let yy = 0; yy < N; yy++) for (let xx = 0; xx < N; xx++) {
      const cnt = {}; let same = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue; const q = ((yy + dy + N) % N) * N + ((xx + dx + N) % N);
        cnt[A[q]] = (cnt[A[q]] || 0) + 1; if (A[q] === A[yy * N + xx]) same++;
      }
      if (same <= 1) { let bk = A[yy * N + xx], bc = 0; for (const kk in cnt) if (cnt[kk] > bc) { bc = cnt[kk]; bk = +kk; } B[yy * N + xx] = bk; }
    }
    for (let i = 0; i < N * N; i++) { const c = rgb[B[i]]; d[i * 4] = c[0]; d[i * 4 + 1] = c[1]; d[i * 4 + 2] = c[2]; d[i * 4 + 3] = 255; }
    tc.putImageData(img, 0, 0);
    const T = document.createElement('canvas'); T.width = T.height = 2 * N;
    const X = T.getContext('2d'); X.imageSmoothingEnabled = false;
    [[1, 1, 0, 0], [-1, 1, 2 * N, 0], [1, -1, 0, 2 * N], [-1, -1, 2 * N, 2 * N]].forEach(([sx, sy, tx, ty]) => { X.setTransform(sx, 0, 0, sy, tx, ty); X.drawImage(t, 0, 0); });
    return T.toDataURL('image/png');
  }
  return { prep, autoMask, tapMask, extract };
})();

/* ---------- 示例照片（程序生成，方便没照片时试玩） ---------- */
function seedRng(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function grain(x, w, h, amt, r) { const d = x.getImageData(0, 0, w, h); for (let i = 0; i < d.data.length; i += 4) { const v = (r() - .5) * amt; d.data[i] += v; d.data[i + 1] += v; d.data[i + 2] += v; } x.putImageData(d, 0, 0); }
const SHIRT = 'M 188 62 L 146 78 L 92 124 L 120 170 L 156 146 L 158 312 L 322 312 L 324 146 L 360 170 L 388 124 L 334 78 L 292 62 Q 240 92 188 62 Z';
function sampleImage(kind) {
  const W = 480, H = 360, c = mkCanvas(W, H), x = c.getContext('2d'), r = seedRng(kind.length * 977 + 3);
  if (kind === 'floral') {
    x.fillStyle = '#FFF4DE'; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) {
      const cx = r() * W, cy = r() * H, s = 9 + r() * 7, col = ['#F46FA6', '#8FC7FF', '#FFC94D'][i % 3];
      x.fillStyle = col; for (let p = 0; p < 5; p++) { const a = p / 5 * Math.PI * 2 + i; x.beginPath(); x.ellipse(cx + Math.cos(a) * s * .7, cy + Math.sin(a) * s * .7, s * .55, s * .38, a, 0, Math.PI * 2); x.fill(); }
      x.fillStyle = '#FFFFFF'; x.beginPath(); x.arc(cx, cy, s * .3, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#6DBB7A'; x.beginPath(); x.ellipse(cx + s * 1.3, cy + s * .6, s * .5, s * .22, .6, 0, Math.PI * 2); x.fill();
    }
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(.6, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(60,30,10,.2)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 6; i++) { x.strokeStyle = 'rgba(80,40,20,.08)'; x.lineWidth = 14; x.beginPath(); const y = r() * H; x.moveTo(0, y); x.bezierCurveTo(W * .3, y + 40, W * .6, y - 30, W, y + 10); x.stroke(); }
    grain(x, W, H, 14, r); return c;
  }
  const path = new Path2D(SHIRT);
  if (kind === 'plaid') {
    const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#D2A679'); g.addColorStop(1, '#B98553'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 70; i++) { x.strokeStyle = `rgba(90,50,20,${.04 + r() * .09})`; x.lineWidth = 1 + r() * 3; x.beginPath(); const y = r() * H; x.moveTo(0, y); x.bezierCurveTo(160, y + (r() - .5) * 20, 320, y + (r() - .5) * 20, W, y + (r() - .5) * 16); x.stroke(); }
  } else {
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#A4BACB'); g.addColorStop(1, '#8CA3B7'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.strokeStyle = '#6E7581'; x.lineWidth = 5; x.lineCap = 'round'; x.beginPath(); x.moveTo(240, 50); x.lineTo(240, 30); x.bezierCurveTo(240, 14, 258, 14, 258, 28); x.stroke();
  }
  const pc = mkCanvas(40, 40), p = pc.getContext('2d');
  if (kind === 'plaid') {
    p.fillStyle = '#FBEFF3'; p.fillRect(0, 0, 40, 40); p.fillStyle = 'rgba(232,84,140,.6)'; p.fillRect(0, 0, 14, 40); p.fillRect(0, 0, 40, 14);
    p.fillStyle = 'rgba(120,40,90,.55)'; p.fillRect(5, 0, 3, 40); p.fillRect(0, 5, 40, 3); p.fillStyle = '#fff'; p.fillRect(26, 0, 2, 40); p.fillRect(0, 26, 40, 2);
  } else {
    p.fillStyle = '#B7A0EE'; p.fillRect(0, 0, 40, 18); p.fillStyle = '#FFF4D6'; p.fillRect(0, 18, 40, 17); p.fillStyle = '#FFD04A'; p.fillRect(0, 35, 40, 5);
  }
  x.save(); x.shadowColor = 'rgba(30,15,5,.35)'; x.shadowBlur = 18; x.shadowOffsetY = 8; x.fillStyle = '#fff'; x.fill(path); x.restore();
  x.save(); x.clip(path);
  const pat = x.createPattern(pc, 'repeat'); if (kind === 'plaid' && pat.setTransform) pat.setTransform(new DOMMatrix().rotate(4));
  x.fillStyle = pat; x.fillRect(0, 0, W, H);
  const sh = x.createLinearGradient(150, 0, 330, 0); sh.addColorStop(0, 'rgba(0,0,0,.14)'); sh.addColorStop(.45, 'rgba(255,255,255,.1)'); sh.addColorStop(1, 'rgba(0,0,0,.2)'); x.fillStyle = sh; x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(40,20,40,.14)'; x.lineWidth = 6; x.beginPath(); x.moveTo(200, 150); x.bezierCurveTo(215, 210, 205, 260, 215, 305); x.stroke();
  x.restore();
  x.strokeStyle = 'rgba(60,30,60,.45)'; x.lineWidth = 2; x.stroke(path);
  x.strokeStyle = 'rgba(60,30,60,.35)'; x.lineWidth = 3; x.beginPath(); x.moveTo(188, 62); x.quadraticCurveTo(240, 96, 292, 62); x.stroke();
  if (kind === 'plaid') { x.fillStyle = '#fff'; for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(240, 118 + i * 46, 4.5, 0, Math.PI * 2); x.fill(); x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = 1; x.stroke(); } }
  const v = x.createRadialGradient(240, 170, 40, 240, 180, 330); v.addColorStop(0, 'rgba(255,250,240,.12)'); v.addColorStop(1, 'rgba(30,15,5,.3)'); x.fillStyle = v; x.fillRect(0, 0, W, H);
  grain(x, W, H, 12, r);
  return c;
}

