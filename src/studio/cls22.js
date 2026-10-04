/* =====================================================================
   衣服类型识别：用真实照片训练出来的小神经网络，不靠手写规则
   训练数据：开源衣服照片数据集 clothing-dataset-small（CC0）里约 800 张照片，
   用同一个抠图模型（seg22）抠出轮廓 → 20×20 的轮廓小图 + 宽高比 → 一层隐藏层的小网络 → 8 类
   （T 恤 / 长袖 / 衬衫 → 上衣，外套，连衣裙，半裙，长裤 / 短裤 → 裤子）
   训练时左右翻转、平移一格、加粗变细做数据增强；权重 int8 量化，约 20KB
   ===================================================================== */
const CLS = (() => {
  const G = 20, KIND = { 't-shirt': 'top', longsleeve: 'top', shirt: 'top', outwear: 'outer', dress: 'dress', skirt: 'skirt', pants: 'pants', shorts: 'pants' };
  let NET = null;
  const deq = (o, n) => { const b = atob(o.q), a = new Float32Array(n); for (let i = 0; i < n; i++) { let v = b.charCodeAt(i); if (v > 127) v -= 256; a[i] = v * o.s; } return a; };
  function net() {
    if (NET || typeof CLS_MLP === 'undefined') return NET;
    const m = CLS_MLP; NET = { ...m, w1: deq(m.W1, m.NH * m.NI), w2: deq(m.W2, m.NO * m.NH) };
    return NET;
  }
  /* 轮廓 → 20×20 覆盖率（保持宽高比，居中），和训练时完全一样的算法 */
  function desc(M, W, H) {
    let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (M[y * W + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null;
    const w = x1 - x0 + 1, h = y1 - y0 + 1, sc = G / Math.max(w, h), ox = (G - w * sc) / 2, oy = (G - h * sc) / 2, D = new Float32Array(G * G), C = new Float32Array(G * G);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const gx = Math.min(G - 1, Math.floor(ox + (x - x0 + .5) * sc)), gy = Math.min(G - 1, Math.floor(oy + (y - y0 + .5) * sc)); C[gy * G + gx]++; if (M[y * W + x]) D[gy * G + gx]++; }
    const f = []; for (let i = 0; i < G * G; i++) f.push((C[i] ? Math.round(D[i] / C[i] * 15) / 15 : 0) * 2 - 1);
    f.push(Math.log(h / w)); return f;
  }
  function predict(M, W, H) {
    const N = net(), x = desc(M, W, H); if (!N || !x) return null;
    const h = new Float32Array(N.NH); for (let j = 0; j < N.NH; j++) { let s = N.b1[j]; for (let i = 0; i < N.NI; i++) s += N.w1[j * N.NI + i] * x[i]; h[j] = Math.max(0, s); }
    const o = []; for (let k = 0; k < N.NO; k++) { let s = N.b2[k]; for (let j = 0; j < N.NH; j++) s += N.w2[k * N.NH + j] * h[j]; o.push(s); }
    const m = Math.max(...o), e = o.map(v => Math.exp(v - m)), z = e.reduce((a, b) => a + b, 0), p = e.map(v => v / z);
    const kv = {}; p.forEach((v, k) => { const kk = KIND[N.CL[k]]; kv[kk] = (kv[kk] || 0) + v; });
    const [kind, conf] = Object.entries(kv).sort((a, b) => b[1] - a[1])[0];
    return { kind, conf, cls: N.CL[p.indexOf(Math.max(...p))], probs: kv };
  }
  return { predict, desc, KIND };
})();
