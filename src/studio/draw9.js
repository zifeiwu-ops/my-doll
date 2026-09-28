/* =====================================================================
   DIY · 自己画版型
   在娃娃身上涂出衣服的形状 → 自动描成矢量轮廓 → 套用和其它衣服一样的描边 / 阴影 / 面料
   画布坐标 = 游戏画布 300 × 600；内部用 2 倍像素（600 × 1200）的蒙版来算形状
   ===================================================================== */
const DS = 2, DW = 300 * DS, DH = 600 * DS;
const DRAW_CATS = [['top', '上衣'], ['outer', '外套'], ['bottom', '下装'], ['dress', '连衣裙']];
const DRAW_VIEW = { top: [52, 132, 196, 261], outer: [46, 128, 208, 277], bottom: [30, 266, 240, 320], dress: [30, 132, 240, 320] };
const dr = { cat: 'top', tool: 'fill', size: 9, sym: true, full: false, strokes: [], cur: null, shape: '', lines: [], thumb: '', bbox: null, dollKey: '' };
const mkC = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
let DPAINT = null, DERASE = null, DBASE = null;
const drawView = () => (dr.full ? [0, 30, 300, 560] : DRAW_VIEW[dr.cat]);

/* ---------- 现成版型的剪影（用来"从版型开始改"） ---------- */
function tplSilhouette(key, ctx) {
  const T = TPL[key], rec = [], P0 = piece, S0 = strap;
  piece = (d, f, o) => { rec.push(['p', d]); return ''; };
  strap = (d, f, w) => { rec.push(['s', d, (w || 2.4) + 2.3]); return ''; };
  try { T.render(resolveFill({ id: 'sil', white: true, cat: T.cat, tpl: key })); } catch (e) { } finally { piece = P0; strap = S0; }
  ctx.save(); ctx.scale(DS, DS); ctx.fillStyle = ctx.strokeStyle = '#fff'; ctx.lineJoin = ctx.lineCap = 'round';
  rec.forEach(([k, d, w]) => { try { const p = new Path2D(d); if (k === 'p') { ctx.fill(p); ctx.lineWidth = .7; ctx.stroke(p); } else { ctx.lineWidth = w; ctx.stroke(p); } } catch (e) { } });
  ctx.restore();
}
/* ---------- 笔画 → 蒙版 ---------- */
const mirPts = p => p.map(([x, y]) => [300 - x, y]);
function strokePath(ctx, pts, w) {
  ctx.lineWidth = w * DS;
  if (pts.length === 1) { ctx.beginPath(); ctx.arc(pts[0][0] * DS, pts[0][1] * DS, w * DS / 2, 0, Math.PI * 2); ctx.fill(); return; }
  ctx.beginPath(); ctx.moveTo(pts[0][0] * DS, pts[0][1] * DS);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0] * DS, pts[i][1] * DS);
  ctx.stroke();
}
function paintStroke(ctx, st, erase) {
  ctx.save(); ctx.lineCap = ctx.lineJoin = 'round'; ctx.strokeStyle = ctx.fillStyle = '#fff';
  ctx.globalCompositeOperation = erase ? 'destination-out' : 'source-over';
  strokePath(ctx, st.p, st.s); if (st.sym) strokePath(ctx, mirPts(st.p), st.s);
  ctx.restore();
}
function buildMask() {
  if (!DPAINT) { DPAINT = mkC(DW, DH); DERASE = mkC(DW, DH); DBASE = mkC(DW, DH); }
  const pc = DPAINT.getContext('2d', { willReadFrequently: true }), ec = DERASE.getContext('2d', { willReadFrequently: true }), bc = DBASE.getContext('2d', { willReadFrequently: true });
  [pc, ec, bc].forEach(c => c.clearRect(0, 0, DW, DH));
  const lines = [];
  dr.strokes.forEach(st => {
    if (st.t === 'base') { [pc, ec, bc].forEach(c => c.clearRect(0, 0, DW, DH)); lines.length = 0; tplSilhouette(st.k, bc); }
    else if (st.t === 'fill') paintStroke(pc, st, false);
    else if (st.t === 'erase') { paintStroke(pc, st, true); paintStroke(bc, st, true); paintStroke(ec, st, false); }
    else if (st.t === 'line' && st.p.length > 1) { lines.push(st.p); if (st.sym) lines.push(mirPts(st.p)); }
  });
  const A = pc.getImageData(0, 0, DW, DH).data, E = ec.getImageData(0, 0, DW, DH).data, B = bc.getImageData(0, 0, DW, DH).data;
  const N = DW * DH, M = new Uint8Array(N), er = new Uint8Array(N);
  for (let i = 0; i < N; i++) { M[i] = A[i * 4 + 3] > 127 ? 1 : 0; er[i] = E[i * 4 + 3] > 20 ? 1 : 0; }
  fillHoles(M, er);          // 只对手涂的部分自动填洞 + 磨圆，现成版型的剪影保持原样（袖子和衣身之间的缝不会被填上）
  smoothMask(M, 3, 2);
  for (let i = 0; i < N; i++) if (B[i * 4 + 3] > 127) M[i] = 1;
  return { M, lines };
}
/* 手涂的边缘会有一个个小圆鼓包：模糊一下再取阈值，边缘变顺滑 */
function smoothMask(M, r, it) {
  const W = DW, H = DH; let a = new Float32Array(M.length), b = new Float32Array(M.length);
  for (let i = 0; i < M.length; i++) a[i] = M[i];
  const n = 2 * r + 1;
  for (let k = 0; k < it; k++) {
    for (let y = 0; y < H; y++) { const o = y * W; let s = 0; for (let x = -r; x <= r; x++) s += a[o + Math.min(W - 1, Math.max(0, x))];
      for (let x = 0; x < W; x++) { b[o + x] = s / n; s += a[o + Math.min(W - 1, x + r + 1)] - a[o + Math.max(0, x - r)]; } }
    for (let x = 0; x < W; x++) { let s = 0; for (let y = -r; y <= r; y++) s += b[Math.min(H - 1, Math.max(0, y)) * W + x];
      for (let y = 0; y < H; y++) { a[y * W + x] = s / n; s += b[Math.min(H - 1, y + r + 1) * W + x] - b[Math.max(0, y - r) * W + x]; } }
  }
  for (let i = 0; i < M.length; i++) M[i] = a[i] >= .5 ? 1 : 0;
}
/* 圈起来的空洞自动填满（用橡皮擦出来的洞保留） */
function fillHoles(M, er) {
  const N = DW * DH, seen = new Uint8Array(N), q = new Int32Array(N);
  let h = 0, t = 0;
  const push = i => { if (!seen[i] && !M[i]) { seen[i] = 1; q[t++] = i; } };
  for (let x = 0; x < DW; x++) { push(x); push((DH - 1) * DW + x); }
  for (let y = 0; y < DH; y++) { push(y * DW); push(y * DW + DW - 1); }
  while (h < t) { const i = q[h++], x = i % DW; if (x > 0) push(i - 1); if (x < DW - 1) push(i + 1); if (i >= DW) push(i - DW); if (i < N - DW) push(i + DW); }
  for (let s = 0; s < N; s++) {
    if (seen[s] || M[s]) continue;
    h = 0; t = 0; seen[s] = 1; q[t++] = s; let erased = false;
    while (h < t) { const i = q[h++], x = i % DW; if (er[i]) erased = true;
      const nb = [x > 0 ? i - 1 : -1, x < DW - 1 ? i + 1 : -1, i >= DW ? i - DW : -1, i < N - DW ? i + DW : -1];
      for (const j of nb) if (j >= 0 && !seen[j] && !M[j]) { seen[j] = 1; q[t++] = j; } }
    if (!erased && t < N * .2) for (let k = 0; k < t; k++) M[q[k]] = 1;
  }
}
/* ---------- 蒙版 → 轮廓（marching squares）→ 简化 → 平滑曲线 ---------- */
function traceLoops(M) {
  const W = DW, H = DH, adj = new Map();
  const link = (a, b) => { (adj.get(a) || adj.set(a, []).get(a)).push(b); (adj.get(b) || adj.set(b, []).get(b)).push(a); };
  const Hh = (x, y) => 2 * (y * (W + 1) + x), Vv = (x, y) => 2 * (y * (W + 1) + x) + 1;
  const at = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : M[y * W + x]);
  for (let y = -1; y < H; y++) for (let x = -1; x < W; x++) {
    const c = (at(x, y) << 3) | (at(x + 1, y) << 2) | (at(x + 1, y + 1) << 1) | at(x, y + 1);
    if (c === 0 || c === 15) continue;
    const X = x + 1, Y = y + 1, T = Hh(X, Y), B = Hh(X, Y + 1), L = Vv(X, Y), R = Vv(X + 1, Y);
    switch (c) {
      case 1: case 14: link(L, B); break; case 2: case 13: link(B, R); break; case 3: case 12: link(L, R); break;
      case 4: case 11: link(T, R); break; case 6: case 9: link(T, B); break; case 7: case 8: link(T, L); break;
      case 5: link(T, R); link(L, B); break; case 10: link(T, L); link(B, R); break;
    }
  }
  const pt = id => { const v = id & 1, k = id >> 1, X = k % (W + 1), Y = (k / (W + 1)) | 0; return v ? [(X - .5) / DS, Y / DS] : [X / DS, (Y - .5) / DS]; };
  const used = new Set(), loops = [];
  for (const start of adj.keys()) {
    if (used.has(start)) continue;
    const loop = []; let prev = -1, cur = start;
    while (cur !== undefined && !used.has(cur)) {
      used.add(cur); loop.push(pt(cur));
      const nb = adj.get(cur); const nx = nb[0] !== prev && !used.has(nb[0]) ? nb[0] : (nb[1] !== undefined && !used.has(nb[1]) ? nb[1] : undefined);
      prev = cur; cur = nx;
    }
    if (loop.length > 12) loops.push(loop);
  }
  return loops;
}
function rdp(pts, eps) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const st = [[0, pts.length - 1]];
  while (st.length) {
    const [a, b] = st.pop(); let md = 0, mi = -1;
    const [ax, ay] = pts[a], [bx, by] = pts[b], dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
    for (let i = a + 1; i < b; i++) { const d = Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / L; if (d > md) { md = d; mi = i; } }
    if (md > eps) { keep[mi] = 1; st.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const polyArea = p => { let s = 0; for (let i = 0; i < p.length; i++) { const a = p[i], b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; };
function maskToPath(M) {
  const loops = traceLoops(M).map(l => {
    const n = l.length, half = Math.floor(n / 2);                // 闭合曲线分两段简化，避免首尾点粘连
    const a = rdp(l.slice(0, half + 1), .38), b = rdp(l.slice(half).concat([l[0]]), .38);
    return a.slice(0, -1).concat(b.slice(0, -1));
  }).filter(l => l.length >= 4 && polyArea(l) > 6);
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  loops.forEach(l => l.forEach(([x, y]) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }));
  return { d: loops.map(l => spline(l, true, .42)).join(' '), bbox: loops.length ? [x0, y0, x1, y1] : null };
}
const linePath = p => { const s = rdp(p, .3); return s.length < 2 ? '' : s.length === 2 ? `M ${f1(s[0][0])} ${f1(s[0][1])} L ${f1(s[1][0])} ${f1(s[1][1])}` : line(s, .5); };
function rebuildDrawn() {
  const { M, lines } = buildMask();
  const r = maskToPath(M);
  dr.shape = r.d; dr.bbox = r.bbox; dr.lines = lines.map(linePath).filter(Boolean);
  if (r.bbox) { const [x0, y0, x1, y1] = r.bbox, s = Math.max(x1 - x0, y1 - y0) * 1.1 + 4, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2; dr.thumb = `${f1(cx - s / 2)} ${f1(cy - s / 2)} ${f1(s)} ${f1(s)}`; }
  else dr.thumb = '';
}

/* ---------- 画布显示：底下是游戏同款渲染（所见即所得），上面一层画正在画的这一笔 ---------- */
function drawRender() {
  const vb = drawView(), svg = $('#drawSvg');
  svg.setAttribute('viewBox', vb.join(' '));
  const pv = previewItem(), cat = dr.cat;
  const over = cat === 'dress' ? { dress: pv } : cat === 'outer' ? { outer: pv } : { [cat]: pv, dress: null };
  svg.innerHTML = dollSVG({ ...state.outfit, hair: null, acc: [] }, over);   // 画的时候先把头发和小物收起来，肩膀看得清楚
  sizeDrawCanvas(); clearLive();
  document.querySelectorAll('#drawTool button').forEach(b => b.setAttribute('aria-checked', b.dataset.tool === dr.tool));
  document.querySelectorAll('#drawCat button').forEach(b => b.setAttribute('aria-checked', b.dataset.cat === dr.cat));
  $('#drawSym').checked = dr.sym; $('#brush').value = dr.size; $('#brushRow').hidden = dr.tool === 'line';
  $('#drawUndo').disabled = !dr.strokes.length; $('#drawClear').disabled = !dr.strokes.length;
  $('#drawFull').setAttribute('aria-pressed', dr.full); $('#drawFull').textContent = dr.full ? '放大画' : '看全身';
  const opts = Object.entries(TPL).filter(([k, t]) => t.cat === cat);
  const sel = $('#drawBase'); if (sel.dataset.cat !== cat) { sel.innerHTML = `<option value="">空白开始</option>` + opts.map(([k, t]) => `<option value="${k}">${t.name}</option>`).join(''); sel.dataset.cat = cat; }
  sel.value = '';
}
function sizeDrawCanvas() {
  const cv = $('#drawCv'), r = cv.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
}
function clearLive() { const cv = $('#drawCv'); cv.getContext('2d').clearRect(0, 0, cv.width, cv.height); }
function toCanvasXY(e) {
  const cv = $('#drawCv'), r = cv.getBoundingClientRect(), vb = drawView();
  const s = Math.min(r.width / vb[2], r.height / vb[3]), ox = (r.width - vb[2] * s) / 2, oy = (r.height - vb[3] * s) / 2;
  return [vb[0] + (e.clientX - r.left - ox) / s, vb[1] + (e.clientY - r.top - oy) / s];
}
function liveSeg(a, b) {
  const cv = $('#drawCv'), ctx = cv.getContext('2d'), vb = drawView();
  const s = Math.min(cv.width / vb[2], cv.height / vb[3]), ox = (cv.width - vb[2] * s) / 2, oy = (cv.height - vb[3] * s) / 2;
  const P = ([x, y]) => [ox + (x - vb[0]) * s, oy + (y - vb[1]) * s];
  const t = dr.tool, col = t === 'line' ? INK : t === 'erase' ? 'rgba(255,255,255,.85)' : (lab.res ? lab.res.color : '#F7B2CC');
  ctx.save(); ctx.lineCap = ctx.lineJoin = 'round'; ctx.strokeStyle = ctx.fillStyle = col;
  ctx.globalAlpha = t === 'fill' ? .75 : 1; ctx.lineWidth = t === 'line' ? Math.max(1.5, .9 * s) : dr.size * s;
  const seg = (p, q) => { const A = P(p), B = P(q); ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke(); };
  seg(a, b); if (dr.sym) seg([300 - a[0], a[1]], [300 - b[0], b[1]]);
  ctx.restore();
}
function commitStroke() {
  const st = dr.cur; dr.cur = null; if (!st) return;
  st.p = st.p.map(([x, y]) => [+x.toFixed(1), +y.toFixed(1)]);
  dr.strokes.push(st); rebuildDrawn(); afterDrawChange();
}
function afterDrawChange() { if (!lab.nameTouched) lab.name = autoName(); refreshLab(); }
function bindDraw() {
  const cv = $('#drawCv');
  cv.addEventListener('pointerdown', e => {
    if (e.button > 0) return; e.preventDefault(); cv.setPointerCapture(e.pointerId);
    const p = toCanvasXY(e); dr.cur = { t: dr.tool, s: dr.size, sym: dr.sym, p: [p] }; liveSeg(p, p);
  });
  cv.addEventListener('pointermove', e => {
    if (!dr.cur) return; const p = toCanvasXY(e), q = dr.cur.p[dr.cur.p.length - 1];
    if (Math.hypot(p[0] - q[0], p[1] - q[1]) < .6) return; dr.cur.p.push(p); liveSeg(q, p);
  });
  ['pointerup', 'pointercancel'].forEach(ev => cv.addEventListener(ev, () => commitStroke()));
  $('#drawTool').addEventListener('click', e => { const b = e.target.closest('[data-tool]'); if (b) { dr.tool = b.dataset.tool; drawRender(); } });
  $('#drawCat').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]'); if (!b || b.dataset.cat === dr.cat) return;
    dr.cat = b.dataset.cat; dr.strokes = []; rebuildDrawn(); afterDrawChange();
  });
  $('#brush').addEventListener('input', e => { dr.size = +e.target.value; });
  $('#drawSym').addEventListener('change', e => { dr.sym = e.target.checked; });
  $('#drawUndo').addEventListener('click', () => { dr.strokes.pop(); rebuildDrawn(); afterDrawChange(); });
  $('#drawClear').addEventListener('click', () => { dr.strokes = []; rebuildDrawn(); afterDrawChange(); });
  $('#drawFull').addEventListener('click', () => { dr.full = !dr.full; drawRender(); });
  $('#drawBase').addEventListener('change', e => { const k = e.target.value; if (!k) return; dr.strokes.push({ t: 'base', k }); rebuildDrawn(); afterDrawChange(); });
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (!$('#lab').hidden && lab.ui === 'draw') drawRender(); }, 150); });
}
