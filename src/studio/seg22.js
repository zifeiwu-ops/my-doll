/* =====================================================================
   抠图模型：U²-Net-p（开源去背景小模型，4.6MB）+ onnxruntime-web，在浏览器里跑，照片不上传
   照片里最「显眼」的那件东西（衣服）抠出来，比「四周颜色当背景」准得多：
   铺在床单 / 地板上、占满整张照片、背景花花绿绿的，都能框对
   模型文件放在 ml/ 目录；加载失败（离线、受限环境）就退回原来的颜色抠图
   ===================================================================== */
const SEG = (() => {
  const BASE = 'ml/';
  let sess = null, loading = null, failed = false;
  const loadScript = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('script ' + src)); document.head.appendChild(s); });
  function load() {
    if (sess) return Promise.resolve(sess);
    if (failed) return Promise.reject(new Error('seg unavailable'));
    if (!loading) loading = (async () => {
      if (!window.ort) await loadScript(BASE + 'ort.wasm.min.js');
      ort.env.wasm.wasmPaths = new URL(BASE, location.href).href; ort.env.wasm.numThreads = 1;
      // 模型文件：优先 ml/u2netp.onnx；有的托管环境不能放 .onnx，就读同一份模型的 base64 版（ml/u2netp.js）
      let model = null; try { const r = await fetch(BASE + 'u2netp.onnx'); if (r.ok) model = new Uint8Array(await r.arrayBuffer()); } catch (e) { }
      if (!model) { await loadScript(BASE + 'u2netp.js'); const b = atob(window.U2NETP_B64); model = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) model[i] = b.charCodeAt(i); }
      sess = await ort.InferenceSession.create(model, { executionProviders: ['wasm'] });
      return sess;
    })().catch(e => { failed = true; loading = null; throw e; });
    return loading;
  }
  /* 照片 → W×H 的衣服蒙版（和 V.prep 同样大小） */
  async function mask(src, W, H) {
    const s = await load(), S = 320, cv = document.createElement('canvas'); cv.width = cv.height = S;
    const x = cv.getContext('2d'); x.drawImage(src, 0, 0, S, S);
    const d = x.getImageData(0, 0, S, S).data, inp = new Float32Array(3 * S * S), mean = [.485, .456, .406], sd = [.229, .224, .225];
    let mx = 1; for (let i = 0; i < S * S * 4; i++) if ((i & 3) < 3 && d[i] > mx) mx = d[i];
    for (let i = 0; i < S * S; i++) for (let k = 0; k < 3; k++) inp[k * S * S + i] = (d[i * 4 + k] / mx - mean[k]) / sd[k];
    const r = await s.run({ [s.inputNames[0]]: new ort.Tensor('float32', inp, [1, 3, S, S]) }), o = r[s.outputNames[0]].data;
    let lo = 1e9, hi = -1e9; for (const v of o) { if (v < lo) lo = v; if (v > hi) hi = v; }
    const pr = new Float32Array(W * H), at = (u, v) => o[Math.min(S - 1, Math.max(0, v)) * S + Math.min(S - 1, Math.max(0, u))];
    for (let y = 0; y < H; y++) for (let X = 0; X < W; X++) {   // 双线性缩到照片识别的分辨率
      const fu = (X + .5) / W * S - .5, fv = (y + .5) / H * S - .5, u0 = Math.floor(fu), v0 = Math.floor(fv), tu = fu - u0, tv = fv - v0;
      const v = (at(u0, v0) * (1 - tu) + at(u0 + 1, v0) * tu) * (1 - tv) + (at(u0, v0 + 1) * (1 - tu) + at(u0 + 1, v0 + 1) * tu) * tv;
      pr[y * W + X] = (v - lo) / Math.max(1e-6, hi - lo);
    }
    let M = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) M[i] = pr[i] > .5 ? 1 : 0;
    // 衣架钩、挂绳这种细细的东西去掉：先腐蚀两圈再膨胀回来
    const morph = (A, grow) => { const O = new Uint8Array(W * H); for (let y = 0; y < H; y++) for (let X = 0; X < W; X++) { let v = grow ? 0 : 1; for (let dy = -1; dy <= 1 && (grow ? !v : v); dy++) for (let dx = -1; dx <= 1; dx++) { const xx = X + dx, yy = y + dy, m = xx >= 0 && yy >= 0 && xx < W && yy < H ? A[yy * W + xx] : 0; if (grow && m) { v = 1; break; } if (!grow && !m) { v = 0; break; } } O[y * W + X] = v; } return O; };
    M = morph(morph(morph(morph(M, false), false), true), true);
    // 只留最大的一块（加上和它差不多大的），再把里面的洞补上
    const L = new Int32Array(W * H).fill(-1), sizes = [];
    for (let i = 0; i < W * H; i++) { if (!M[i] || L[i] >= 0) continue; const id = sizes.length, st = [i]; L[i] = id; let n = 0;
      while (st.length) { const p = st.pop(), px = p % W; n++; for (const q of [px > 0 ? p - 1 : -1, px < W - 1 ? p + 1 : -1, p - W, p + W]) if (q >= 0 && q < W * H && M[q] && L[q] < 0) { L[q] = id; st.push(q); } }
      sizes.push(n); }
    if (!sizes.length) return null;
    const big = Math.max(...sizes); for (let i = 0; i < W * H; i++) M[i] = L[i] >= 0 && sizes[L[i]] >= big * .35 ? 1 : 0;
    const R = new Uint8Array(W * H), st = []; for (let X = 0; X < W; X++) st.push(X, (H - 1) * W + X); for (let y = 0; y < H; y++) st.push(y * W, y * W + W - 1);
    while (st.length) { const p = st.pop(); if (R[p] || M[p]) continue; R[p] = 1; const px = p % W; if (px > 0) st.push(p - 1); if (px < W - 1) st.push(p + 1); if (p >= W) st.push(p - W); if (p < W * (H - 1)) st.push(p + W); }
    let n = 0; for (let i = 0; i < W * H; i++) { if (!R[i]) M[i] = 1; n += M[i]; }
    return n > W * H * .02 ? M : null;
  }
  return { load, mask, get ready() { return !!sess; }, get failed() { return failed; } };
})();
