/* =====================================================================
   画背景：小而完整的绘图编辑器（参考 Procreate / ibisPaint / MediBang 的常用功能）
   · 画布 900×1200（3:4，和拍照小屋的场景一样）
   · 笔刷：G 笔 / 铅笔 / 马克笔 / 喷枪 / 水彩 / 蜡笔 / 星星喷枪；压感（数位笔）、模拟笔锋（鼠标 / 手指）、防抖
   · 工具：画笔、橡皮、油漆桶（容差、参考所有图层）、吸管、形状、渐变、文字、移动变换、抓手
   · 图层：新建 / 复制 / 删除 / 合并 / 排序 / 显示隐藏 / 不透明度 / 混合模式 / 导入图片
   · 撤销重做（只记录改动的区域，省内存）、缩放平移（滚轮 / 双指）、左右对称、显示娃娃站的位置
   · 快捷键：B 画笔 E 橡皮 G 油漆桶 I 吸管 U 形状 T 文字 V 移动 H 抓手 [ ] 笔刷大小 X 交换颜色
     Ctrl+Z 撤销 Ctrl+Shift+Z / Ctrl+Y 重做 空格 按住拖动画布 0 适应窗口
   ===================================================================== */
const Paint = (() => {
  const DW = 900, DH = 1200, HMAX = 40;
  const BRUSHES = {
    pen: { name: 'G笔', hard: .92, spacing: .1, pressSize: .85, pressAlpha: 0, buffer: true, taper: true },
    pencil: { name: '铅笔', hard: .85, spacing: .14, pressSize: .35, pressAlpha: .6, grain: .55, flow: .9 },
    marker: { name: '马克笔', hard: .8, spacing: .06, pressSize: 0, pressAlpha: 0, buffer: true, opacity: .55 },
    airbrush: { name: '喷枪', hard: 0, spacing: .06, pressSize: .2, pressAlpha: 1, flow: .16 },
    water: { name: '水彩', hard: .3, spacing: .06, pressSize: .4, pressAlpha: .3, buffer: true, opacity: .6, jitter: .04 },
    crayon: { name: '蜡笔', hard: .75, spacing: .22, pressSize: .25, pressAlpha: .3, grain: .8, flow: .85 },
    sparkle: { name: '星星喷枪', scatter: true, hard: .9, spacing: 1.1, pressSize: .3, pressAlpha: 0 }
  };
  const TOOLS = [['brush', '画笔', 'B'], ['eraser', '橡皮', 'E'], ['fill', '油漆桶', 'G'], ['picker', '吸管', 'I'], ['shape', '形状', 'U'], ['gradient', '渐变', ''], ['text', '文字', 'T'], ['move', '移动变换', 'V'], ['hand', '抓手', 'H']];
  const ICON = {
    brush: 'M4 20c2 0 4-1 4-3s-1-3-3-3-2 2-2 3-1 3-1 3zM8.5 13.5 18 4a1.4 1.4 0 0 1 2 2l-9.5 9.5',
    eraser: 'M4 15 13 6l6 6-9 9H6l-2-2a2 2 0 0 1 0-3zM9 10l6 6M10 21h10',
    fill: 'M5 11 12 4l7 7-7 7zM12 4V2M19 14c1 2 2 3 2 4a2 2 0 0 1-4 0c0-1 1-2 2-4zM5 11h14',
    picker: 'M14 6l4 4M15.5 4.5a2 2 0 0 1 3 3L9 17l-4 1 1-4z',
    shape: 'M4 4h8v8H4zM16 20a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
    gradient: 'M4 4h16v16H4zM4 20 20 4M9 20l11-11M4 15 15 4',
    text: 'M5 5h14M12 5v14M9 19h6',
    move: 'M12 3v18M3 12h18M12 3 9 6M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3',
    hand: 'M8 13V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2 7-6 7-3 0-4-1-6-4l-2-3a1.5 1.5 0 0 1 2.5-1.6L8 13'
  };
  const PALETTE = ['#2E2A30', '#6A5A60', '#FFFFFF', '#F06C9B', '#F7B2CC', '#FDE2EC', '#E8454F', '#FF9A6A', '#F5B840', '#FFE27A', '#9EDB86', '#5BC3B0', '#BFEBE4', '#8FC4FF', '#6F92BC', '#2E3A6A', '#9C86E0', '#C9AEF2', '#C49A68', '#8A5A3A'];
  const D = { layers: [], active: 0, hist: [], redo: [], tool: 'brush', prevTool: 'brush', brush: 'pen', size: 18, opacity: 1, stab: 35, hard: .9, color: '#F06C9B', color2: '#FFFFFF', recent: [],
    sym: false, guide: true, zoom: 1, tx: 0, ty: 0, fillTol: 30, fillAll: true, fillGap: 1, shape: 'rect', shapeMode: 'fill', grad: 'linear', gradEnd: 'second', gradKeep: false,
    textSize: 64, font: "'ZCOOL KuaiLe',sans-serif", xf: null, panel: 'color' };
  let root = null, view, vctx, tmp, tctx, buf, bctx, ov, octx, preCv, prectx, checker = null, guideImg = null, onSave = null, dirty = false, nid = 1, spaceDown = false;
  const mk = (w = DW, h = DH) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const q = s => root.querySelector(s), qa = s => root.querySelectorAll(s);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hex2rgb = h => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const rgb2hex = (r, g, b) => '#' + [r, g, b].map(v => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  function hsv2rgb(h, s, v) { const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5) * 255, f(3) * 255, f(1) * 255]; }
  function rgb2hsv(r, g, b) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; return [(h * 60 + 360) % 360, mx ? d / mx : 0, mx]; }

  /* ---------------- 图层 ---------------- */
  function mkLayer(name) { const cv = mk(); return { id: nid++, name: name || `图层 ${nid - 1}`, cv, ctx: cv.getContext('2d', { willReadFrequently: true }), visible: true, opacity: 1, blend: 'source-over' }; }
  const AL = () => D.layers[D.active];
  function snapshot(L) { prectx.clearRect(0, 0, DW, DH); prectx.drawImage(L.cv, 0, 0); }
  function regionHist(L, bb) {
    if (!bb) return; let [x0, y0, x1, y1] = bb; x0 = clamp(Math.floor(x0) - 2, 0, DW); y0 = clamp(Math.floor(y0) - 2, 0, DH); x1 = clamp(Math.ceil(x1) + 2, 0, DW); y1 = clamp(Math.ceil(y1) + 2, 0, DH);
    const w = x1 - x0, h = y1 - y0; if (w <= 0 || h <= 0) return;
    const before = prectx.getImageData(x0, y0, w, h), after = L.ctx.getImageData(x0, y0, w, h);
    pushHist({ undo: () => L.ctx.putImageData(before, x0, y0), redo: () => L.ctx.putImageData(after, x0, y0), layer: L });
  }
  function pushHist(e) { D.hist.push(e); if (D.hist.length > HMAX) D.hist.shift(); D.redo = []; syncUndo(); }
  function undo() { const e = D.hist.pop(); if (!e) return; e.undo(); D.redo.push(e); afterHist(); }
  function redo() { const e = D.redo.pop(); if (!e) return; e.redo(); D.hist.push(e); afterHist(); }
  function afterHist() { D.active = clamp(D.active, 0, D.layers.length - 1); syncUndo(); renderLayers(); req(); }
  function syncUndo() { if (!root) return; q('[data-act=undo]').disabled = !D.hist.length; q('[data-act=redo]').disabled = !D.redo.length; }
  const layerAt = L => D.layers.indexOf(L);
  function addLayer(L, at, hist = true) {
    at = at ?? D.active + 1; D.layers.splice(at, 0, L); D.active = at;
    if (hist) pushHist({ undo: () => { D.layers.splice(layerAt(L), 1); }, redo: () => { D.layers.splice(at, 0, L); D.active = at; } });
    renderLayers(); req();
  }
  function delLayer() {
    if (D.layers.length <= 1) return toastP('至少要留一个图层');
    const L = AL(), at = D.active; D.layers.splice(at, 1); D.active = clamp(at - 1, 0, D.layers.length - 1);
    pushHist({ undo: () => { D.layers.splice(at, 0, L); D.active = at; }, redo: () => { D.layers.splice(layerAt(L), 1); } }); renderLayers(); req();
  }
  function dupLayer() { const s = AL(), L = mkLayer(s.name + ' 副本'); L.ctx.drawImage(s.cv, 0, 0); L.opacity = s.opacity; L.blend = s.blend; addLayer(L); }
  function moveLayer(d) {
    const a = D.active, b = a + d; if (b < 0 || b >= D.layers.length) return;
    const sw = () => { const L = D.layers; [L[a], L[b]] = [L[b], L[a]]; };
    sw(); D.active = b; pushHist({ undo: () => { sw(); D.active = a; }, redo: () => { sw(); D.active = b; } }); renderLayers(); req();
  }
  function mergeDown() {
    const a = D.active; if (a === 0) return toastP('最下面的图层没法再往下合并');
    const U = D.layers[a], Lw = D.layers[a - 1]; snapshot(Lw);
    const before = prectx.getImageData(0, 0, DW, DH);
    Lw.ctx.save(); Lw.ctx.globalAlpha = U.opacity; Lw.ctx.globalCompositeOperation = U.blend; if (U.visible) Lw.ctx.drawImage(U.cv, 0, 0); Lw.ctx.restore();
    const after = Lw.ctx.getImageData(0, 0, DW, DH); D.layers.splice(a, 1); D.active = a - 1;
    pushHist({ undo: () => { Lw.ctx.putImageData(before, 0, 0); D.layers.splice(a, 0, U); D.active = a; }, redo: () => { Lw.ctx.putImageData(after, 0, 0); D.layers.splice(layerAt(U), 1); D.active = a - 1; } });
    renderLayers(); req();
  }
  function clearLayer() { const L = AL(); snapshot(L); L.ctx.clearRect(0, 0, DW, DH); regionHist(L, [0, 0, DW, DH]); renderLayers(); req(); }
  function setProp(L, k, v) { const old = L[k]; if (old === v) return; L[k] = v; pushHist({ undo: () => { L[k] = old; }, redo: () => { L[k] = v; } }); renderLayers(); req(); }

  /* ---------------- 视图：缩放 / 平移 ---------------- */
  const dpr = () => Math.min(2, window.devicePixelRatio || 1);
  function fit() { const r = q('.pt-stage').getBoundingClientRect(), z = Math.min((r.width - 32) / DW, (r.height - 32) / DH); D.zoom = clamp(z, .05, 8); D.tx = (r.width - DW * D.zoom) / 2; D.ty = (r.height - DH * D.zoom) / 2; syncZoom(); req(); }
  function zoomAt(f, cx, cy) { const z = clamp(D.zoom * f, .08, 12); D.tx = cx - (cx - D.tx) * z / D.zoom; D.ty = cy - (cy - D.ty) * z / D.zoom; D.zoom = z; syncZoom(); req(); }
  function syncZoom() { const z = q('[data-z]'); if (z) z.textContent = Math.round(D.zoom * 100) + '%'; }
  function resize() { const r = q('.pt-stage').getBoundingClientRect(), k = dpr(); view.width = Math.max(1, Math.round(r.width * k)); view.height = Math.max(1, Math.round(r.height * k)); req(); }
  const toDoc = e => { const r = view.getBoundingClientRect(); return [(e.clientX - r.left - D.tx) / D.zoom, (e.clientY - r.top - D.ty) / D.zoom]; };
  const req = () => { if (!dirty) { dirty = true; requestAnimationFrame(draw); } };
  function draw() {
    dirty = false; if (!root || root.hidden) return;
    const k = dpr(); vctx.setTransform(1, 0, 0, 1, 0, 0); vctx.clearRect(0, 0, view.width, view.height);
    vctx.setTransform(k * D.zoom, 0, 0, k * D.zoom, k * D.tx, k * D.ty);
    vctx.imageSmoothingEnabled = D.zoom < 2;
    if (!checker) { const c = mk(32, 32), x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 32, 32); x.fillStyle = '#E8E4EA'; x.fillRect(0, 0, 16, 16); x.fillRect(16, 16, 16, 16); checker = vctx.createPattern(c, 'repeat'); }
    vctx.fillStyle = checker; vctx.fillRect(0, 0, DW, DH);
    D.layers.forEach((L, i) => {
      if (!L.visible) return;
      let src = L.cv;
      if (i === D.active && stroke && stroke.buffer) { tctx.globalCompositeOperation = 'copy'; tctx.globalAlpha = 1; tctx.drawImage(L.cv, 0, 0); tctx.globalCompositeOperation = stroke.erase ? 'destination-out' : 'source-over'; tctx.globalAlpha = stroke.alpha; tctx.drawImage(buf, 0, 0); tctx.globalAlpha = 1; tctx.globalCompositeOperation = 'source-over'; src = tmp; }
      vctx.globalAlpha = L.opacity; vctx.globalCompositeOperation = L.blend;
      if (i === D.active && D.xf) { const X = D.xf; vctx.save(); vctx.translate(DW / 2 + X.dx, DH / 2 + X.dy); vctx.rotate(X.rot * Math.PI / 180); vctx.scale(X.s * (X.flip ? -1 : 1), X.s); vctx.drawImage(src, -DW / 2, -DH / 2); vctx.restore(); }
      else vctx.drawImage(src, 0, 0);
    });
    vctx.globalAlpha = 1; vctx.globalCompositeOperation = 'source-over';
    if (ovOn) vctx.drawImage(ov, 0, 0);
    if (D.guide && guideImg && guideImg.complete) { vctx.globalAlpha = .28; vctx.drawImage(guideImg, 0, 0, DW, DH); vctx.globalAlpha = 1; }
    if (D.sym) { vctx.save(); vctx.setLineDash([12 / D.zoom, 10 / D.zoom]); vctx.strokeStyle = 'rgba(240,108,155,.8)'; vctx.lineWidth = 2 / D.zoom; vctx.beginPath(); vctx.moveTo(DW / 2, 0); vctx.lineTo(DW / 2, DH); vctx.stroke(); vctx.restore(); }
    vctx.strokeStyle = '#4A3430'; vctx.lineWidth = 2 / D.zoom; vctx.strokeRect(0, 0, DW, DH);
    if (cursor && ['brush', 'eraser'].includes(D.tool) && !stroke) { vctx.beginPath(); vctx.arc(cursor[0], cursor[1], Math.max(1, D.size / 2), 0, Math.PI * 2); vctx.lineWidth = 1.2 / D.zoom; vctx.strokeStyle = 'rgba(0,0,0,.55)'; vctx.stroke(); vctx.lineWidth = .6 / D.zoom; vctx.strokeStyle = 'rgba(255,255,255,.9)'; vctx.stroke(); }
  }
  let ovOn = false, cursor = null;
  const ovClear = () => { octx.setTransform(1, 0, 0, 1, 0, 0); octx.globalAlpha = 1; octx.globalCompositeOperation = 'source-over'; octx.clearRect(0, 0, DW, DH); };

  /* ---------------- 笔刷引擎 ---------------- */
  let stroke = null;
  const stampCache = {};
  function softStamp(color, hard) {   // 128px 圆形笔尖：hard 越小边缘越虚
    hard = Number.isFinite(hard) ? hard : .9; const key = color + hard; if (stampCache[key]) return stampCache[key];
    const c = mk(128, 128), x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64), [r, gg, b] = hex2rgb(color);
    g.addColorStop(0, `rgba(${r},${gg},${b},1)`); g.addColorStop(clamp(hard, 0, .98), `rgba(${r},${gg},${b},1)`); g.addColorStop(1, `rgba(${r},${gg},${b},0)`);
    x.fillStyle = g; x.fillRect(0, 0, 128, 128); return (stampCache[key] = c);
  }
  function grainStamps(color, hard, amt) {   // 铅笔 / 蜡笔：带颗粒的笔尖，四个随机变体
    const key = 'g' + color + hard + amt; if (stampCache[key]) return stampCache[key];
    let s = 9; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const out = [0, 1, 2, 3].map(() => { const c = mk(64, 64), x = c.getContext('2d'); x.drawImage(softStamp(color, hard), 0, 0, 64, 64); const d = x.getImageData(0, 0, 64, 64); for (let i = 3; i < d.data.length; i += 4) d.data[i] *= rnd() < amt * .55 ? rnd() * .35 : 1; x.putImageData(d, 0, 0); return c; });
    return (stampCache[key] = out);
  }
  function shapePath(x, kind, r) {
    x.beginPath();
    if (kind === 'star') { for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; i ? x.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : x.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } x.closePath(); }
    else if (kind === 'heart') { x.moveTo(0, r * .9); x.bezierCurveTo(-r * 1.3, 0, -r * .9, -r * 1.1, 0, -r * .4); x.bezierCurveTo(r * .9, -r * 1.1, r * 1.3, 0, 0, r * .9); x.closePath(); }
    else if (kind === 'sparkle') { x.moveTo(0, -r); x.quadraticCurveTo(r * .15, -r * .15, r, 0); x.quadraticCurveTo(r * .15, r * .15, 0, r); x.quadraticCurveTo(-r * .15, r * .15, -r, 0); x.quadraticCurveTo(-r * .15, -r * .15, 0, -r); x.closePath(); }
    else x.arc(0, 0, r, 0, Math.PI * 2);
  }
  function jitterColor(hex, amt) { const [r, g, b] = hex2rgb(hex), [h, s, v] = rgb2hsv(r, g, b); return rgb2hex(...hsv2rgb((h + (Math.random() - .5) * 360 * amt + 360) % 360, clamp(s + (Math.random() - .5) * amt, 0, 1), clamp(v + (Math.random() - .5) * amt, 0, 1))); }
  function dab(x, y, p) {
    const S = stroke, B = S.br, size = Math.max(.6, D.size * (1 - B.pressSize * (1 - p))), r = size / 2, a = (1 - B.pressAlpha * (1 - p)) * (B.flow ?? 1);
    const ctx = S.buffer ? bctx : AL().ctx;
    const pts = D.sym ? [[x, y, 1], [DW - x, y, -1]] : [[x, y, 1]];
    for (const [X, Y, m] of pts) {
      S.bb[0] = Math.min(S.bb[0], X - r * 1.6); S.bb[1] = Math.min(S.bb[1], Y - r * 1.6); S.bb[2] = Math.max(S.bb[2], X + r * 1.6); S.bb[3] = Math.max(S.bb[3], Y + r * 1.6);
      ctx.save();
      if (!S.buffer) { ctx.globalAlpha = a * S.alpha; ctx.globalCompositeOperation = S.erase ? 'destination-out' : 'source-over'; } else ctx.globalAlpha = a;
      if (B.scatter) {
        const kinds = ['star', 'heart', 'sparkle', 'dot'], k = kinds[Math.floor(Math.random() * kinds.length)], rr = r * (.35 + Math.random() * .65);
        ctx.translate(X + (Math.random() - .5) * size * 1.4, Y + (Math.random() - .5) * size * 1.4); ctx.rotate((Math.random() - .5) * 1.2); ctx.scale(m, 1);
        ctx.fillStyle = S.erase ? '#000' : jitterColor(S.color, .18); shapePath(ctx, k, rr); ctx.fill();
      } else if (B.grain) { const g = S.grains[Math.floor(Math.random() * 4)]; ctx.translate(X, Y); ctx.rotate(Math.random() * 6.28); ctx.drawImage(g, -r, -r, size, size); }
      else if (B.hard >= .8 && !S.softEdge) { ctx.fillStyle = S.erase ? '#000' : S.color; ctx.beginPath(); ctx.arc(X, Y, r, 0, Math.PI * 2); ctx.fill(); }
      else { const st = B.jitter ? softStamp(jitterColor(S.color, B.jitter), S.hard) : S.stamp; ctx.drawImage(st, X - r, Y - r, size, size); }
      ctx.restore();
    }
  }
  function strokeTo(x, y, p) {
    const S = stroke, B = S.br, step = Math.max(.6, D.size * (B.spacing || .1));
    let [lx, ly, lp] = S.last, dx = x - lx, dy = y - ly, dist = Math.hypot(dx, dy);
    if (dist < 1e-3) return;
    let t = S.carry; while (t <= dist) { const u = t / dist; S.travel += step; const taper = B.taper && S.mouse ? clamp(S.travel / (D.size * 2.5), .25, 1) : 1; dab(lx + dx * u, ly + dy * u, (lp + (p - lp) * u) * taper); t += step; }
    S.carry = t - dist; S.last = [x, y, p];
  }
  function beginStroke(e, erase) {
    const L = AL(); if (!L.visible) { toastP('这个图层隐藏了，先点亮小眼睛'); return false; }
    const B = erase ? { ...BRUSHES.pen, pressSize: .3, hard: D.hard, buffer: true, taper: false } : BRUSHES[D.brush];
    snapshot(L);
    const [x, y] = toDoc(e), p0 = e.pointerType === 'pen' ? (e.pressure || .5) : 1;
    stroke = { br: B, erase, buffer: !!B.buffer, alpha: D.opacity * (erase ? 1 : (B.opacity ?? 1)), color: D.color, hard: erase ? D.hard : B.hard, mouse: e.pointerType !== 'pen', bb: [1e9, 1e9, -1e9, -1e9], last: [x, y, p0], sm: [x, y], carry: 0, travel: 0, t: performance.now(), softEdge: erase && D.hard < .8 };
    stroke.stamp = softStamp(stroke.color, stroke.hard); if (B.grain) stroke.grains = grainStamps(stroke.color, B.hard, B.grain);
    if (stroke.buffer) bctx.clearRect(0, 0, DW, DH);
    dab(x, y, p0 * (B.taper && stroke.mouse ? .3 : 1)); req(); return true;
  }
  function moveStroke(e) {
    const S = stroke, list = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of (list.length ? list : [e])) {
      const [x, y] = toDoc(ev), now = performance.now(), k = D.stab / 100 * .9;
      S.sm[0] += (x - S.sm[0]) * (1 - k); S.sm[1] += (y - S.sm[1]) * (1 - k);
      let p = ev.pointerType === 'pen' ? (ev.pressure || .5) : 1;
      if (S.mouse && S.br.taper) { const v = Math.hypot(S.sm[0] - S.last[0], S.sm[1] - S.last[1]) / Math.max(1, now - S.t); p = clamp(1.15 - v * .12, .45, 1); }
      S.t = now; strokeTo(S.sm[0], S.sm[1], p); S.raw = [x, y, p];
    }
    req();
  }
  function endStroke() {
    const S = stroke; if (!S) return;
    if (S.raw) for (let i = 0; i < 12; i++) { S.sm[0] += (S.raw[0] - S.sm[0]) * .5; S.sm[1] += (S.raw[1] - S.sm[1]) * .5; strokeTo(S.sm[0], S.sm[1], S.raw[2] * (S.br.taper && S.mouse ? 1 - i / 14 : 1)); }
    const L = AL();
    if (S.buffer) { L.ctx.save(); L.ctx.globalAlpha = S.alpha; L.ctx.globalCompositeOperation = S.erase ? 'destination-out' : 'source-over'; L.ctx.drawImage(buf, 0, 0); L.ctx.restore(); }
    stroke = null; regionHist(L, S.bb); if (!S.erase) addRecent(S.color); thumbs(); req();
  }
  function cancelStroke() { if (!stroke) return; const L = AL(); if (!stroke.buffer) { L.ctx.clearRect(0, 0, DW, DH); L.ctx.drawImage(preCv, 0, 0); } stroke = null; req(); }

  /* ---------------- 油漆桶 / 吸管 ---------------- */
  function composite(withWhite) { const c = tmp, x = tctx; x.globalCompositeOperation = 'copy'; x.fillStyle = '#fff'; x.fillRect(0, 0, DW, DH); x.globalCompositeOperation = 'source-over'; if (!withWhite) x.clearRect(0, 0, DW, DH); D.layers.forEach(L => { if (!L.visible) return; x.globalAlpha = L.opacity; x.globalCompositeOperation = L.blend; x.drawImage(L.cv, 0, 0); }); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; return c; }
  function bucket(e) {
    const [fx, fy] = toDoc(e).map(Math.floor); if (fx < 0 || fy < 0 || fx >= DW || fy >= DH) return;
    const L = AL(); if (!L.visible) return toastP('这个图层隐藏了');
    const src = (D.fillAll ? composite(false) : L.cv).getContext('2d').getImageData(0, 0, DW, DH).data, N = DW * DH, M = new Uint8Array(N);
    const i0 = (fy * DW + fx) * 4, R = src[i0], G = src[i0 + 1], Bc = src[i0 + 2], A = src[i0 + 3], tol = D.fillTol * 4.4;
    const same = i => { const j = i * 4; return Math.abs(src[j] - R) + Math.abs(src[j + 1] - G) + Math.abs(src[j + 2] - Bc) + Math.abs(src[j + 3] - A) * 1.2 <= tol; };
    const st = [fy * DW + fx]; M[st[0]] = 1; let x0 = fx, x1 = fx, y0 = fy, y1 = fy;
    while (st.length) { const p = st.pop(), x = p % DW, y = (p - x) / DW; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (const q2 of [x > 0 ? p - 1 : -1, x < DW - 1 ? p + 1 : -1, p - DW, p + DW]) if (q2 >= 0 && q2 < N && !M[q2] && same(q2)) { M[q2] = 1; st.push(q2); } }
    for (let g = 0; g < D.fillGap; g++) { const E = M.slice(); for (let y = Math.max(1, y0 - 1); y <= Math.min(DH - 2, y1 + 1); y++) for (let x = Math.max(1, x0 - 1); x <= Math.min(DW - 2, x1 + 1); x++) { const p = y * DW + x; if (!M[p] && (M[p - 1] || M[p + 1] || M[p - DW] || M[p + DW])) E[p] = 1; } M.set(E); x0--; y0--; x1++; y1++; }
    snapshot(L); const [r, g, b] = hex2rgb(D.color), id = tctx.createImageData(DW, DH);
    for (let p = 0; p < N; p++) if (M[p]) { id.data[p * 4] = r; id.data[p * 4 + 1] = g; id.data[p * 4 + 2] = b; id.data[p * 4 + 3] = 255; }
    tctx.putImageData(id, 0, 0); L.ctx.save(); L.ctx.globalAlpha = D.opacity; L.ctx.drawImage(tmp, 0, 0); L.ctx.restore();
    regionHist(L, [x0, y0, x1 + 1, y1 + 1]); addRecent(D.color); thumbs(); req();
  }
  function pick(e) { const [x, y] = toDoc(e).map(Math.floor); if (x < 0 || y < 0 || x >= DW || y >= DH) return; const d = composite(true).getContext('2d').getImageData(x, y, 1, 1).data; setColor(rgb2hex(d[0], d[1], d[2])); }

  /* ---------------- 形状 / 渐变 ---------------- */
  let drag = null;
  function shapePreview(a, b, shift, ctx = octx) {
    let [x0, y0] = a, [x1, y1] = b;
    if (shift && D.shape !== 'line') { const s = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); x1 = x0 + Math.sign(x1 - x0 || 1) * s; y1 = y0 + Math.sign(y1 - y0 || 1) * s; }
    if (shift && D.shape === 'line') { const ang = Math.round(Math.atan2(y1 - y0, x1 - x0) / (Math.PI / 4)) * Math.PI / 4, l = Math.hypot(x1 - x0, y1 - y0); x1 = x0 + Math.cos(ang) * l; y1 = y0 + Math.sin(ang) * l; }
    const draw1 = flip => { ctx.save(); if (flip) { ctx.translate(DW, 0); ctx.scale(-1, 1); }
      ctx.lineWidth = Math.max(1, D.size / 2); ctx.lineJoin = ctx.lineCap = 'round'; ctx.strokeStyle = D.color; ctx.fillStyle = D.shapeMode === 'both' ? D.color2 : D.color;
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, w = Math.abs(x1 - x0), h = Math.abs(y1 - y0); ctx.beginPath();
      if (D.shape === 'line') { ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore(); return; }
      if (D.shape === 'rect') ctx.rect(Math.min(x0, x1), Math.min(y0, y1), w, h);
      else if (D.shape === 'round') { const r = Math.min(w, h) * .22; ctx.roundRect ? ctx.roundRect(Math.min(x0, x1), Math.min(y0, y1), w, h, r) : ctx.rect(Math.min(x0, x1), Math.min(y0, y1), w, h); }
      else if (D.shape === 'ellipse') ctx.ellipse(cx, cy, w / 2, h / 2, 0, 0, Math.PI * 2);
      else { ctx.translate(cx, cy); ctx.scale(w / 2 / Math.max(1, Math.min(w, h) / 2) || 1, h / 2 / Math.max(1, Math.min(w, h) / 2) || 1); shapePath(ctx, D.shape, Math.min(w, h) / 2); ctx.setTransform(ctx.getTransform()); }
      if (D.shapeMode !== 'stroke') ctx.fill(); if (D.shapeMode !== 'fill') { ctx.lineWidth = Math.max(1, D.size / 2) / (D.shape === 'star' || D.shape === 'heart' ? Math.max(w, h) / Math.max(1, Math.min(w, h)) : 1); ctx.stroke(); }
      ctx.restore(); };
    draw1(false); if (D.sym) draw1(true);
    return [Math.min(x0, x1, DW - x0, DW - x1) - D.size, Math.min(y0, y1) - D.size, Math.max(x0, x1, D.sym ? DW - Math.min(x0, x1) : 0) + D.size, Math.max(y0, y1) + D.size];
  }
  function gradPreview(a, b, ctx = octx) {
    const [r, g, bl] = hex2rgb(D.color), [r2, g2, b2] = hex2rgb(D.color2), end = D.gradEnd === 'second' ? `rgba(${r2},${g2},${b2},1)` : `rgba(${r},${g},${bl},0)`;
    const G = D.grad === 'radial' ? ctx.createRadialGradient(a[0], a[1], 0, a[0], a[1], Math.max(1, Math.hypot(b[0] - a[0], b[1] - a[1]))) : ctx.createLinearGradient(a[0], a[1], b[0], b[1]);
    G.addColorStop(0, `rgba(${r},${g},${bl},1)`); G.addColorStop(1, end); ctx.fillStyle = G; ctx.fillRect(0, 0, DW, DH);
  }
  function commitOverlay(keepAlpha) { const L = AL(); snapshot(L); L.ctx.save(); L.ctx.globalAlpha = D.opacity; if (keepAlpha) L.ctx.globalCompositeOperation = 'source-atop'; L.ctx.drawImage(ov, 0, 0); L.ctx.restore(); ovClear(); ovOn = false; regionHist(L, [0, 0, DW, DH]); addRecent(D.color); thumbs(); req(); }

  /* ---------------- 文字 ---------------- */
  function placeText(e) {
    const [x, y] = toDoc(e), inp = q('.pt-text'), r = view.getBoundingClientRect(), sr = q('.pt-stage').getBoundingClientRect();
    inp.hidden = false; inp.value = ''; inp.style.left = (e.clientX - sr.left) + 'px'; inp.style.top = (e.clientY - sr.top) + 'px';
    inp.style.fontFamily = D.font; inp.style.color = D.color; inp.style.fontSize = clamp(D.textSize * D.zoom, 12, 64) + 'px';
    inp.dataset.x = x; inp.dataset.y = y; inp.style.transform = 'translateY(-50%)'; setTimeout(() => inp.focus(), 0);
  }
  function commitText() {
    const inp = q('.pt-text'); if (inp.hidden) return; const t = inp.value.trim(); inp.hidden = true; if (!t) return;
    const L = AL(), x = +inp.dataset.x, y = +inp.dataset.y; snapshot(L);
    const draw1 = flip => { const c = L.ctx; c.save(); if (flip) { c.translate(DW, 0); c.scale(-1, 1); } c.globalAlpha = D.opacity; c.font = `${D.textSize}px ${D.font}`; c.textBaseline = 'middle'; c.textAlign = 'left'; c.lineJoin = 'round';
      if (D.shapeMode !== 'fill') { c.strokeStyle = D.color2; c.lineWidth = Math.max(2, D.textSize / 7); c.strokeText(t, x, y); } c.fillStyle = D.color; c.fillText(t, x, y); c.restore(); };
    draw1(false); regionHist(L, [0, Math.max(0, y - D.textSize), DW, Math.min(DH, y + D.textSize)]); addRecent(D.color); thumbs(); req();
  }

  /* ---------------- 移动 / 变换 ---------------- */
  function xfStart() { if (!D.xf) D.xf = { dx: 0, dy: 0, s: 1, rot: 0, flip: false }; renderOpts(); }
  function xfApply() {
    const X = D.xf; if (!X) return; const L = AL(); snapshot(L);
    tctx.globalCompositeOperation = 'copy'; tctx.drawImage(L.cv, 0, 0); tctx.globalCompositeOperation = 'source-over';
    L.ctx.clearRect(0, 0, DW, DH); L.ctx.save(); L.ctx.translate(DW / 2 + X.dx, DH / 2 + X.dy); L.ctx.rotate(X.rot * Math.PI / 180); L.ctx.scale(X.s * (X.flip ? -1 : 1), X.s); L.ctx.drawImage(tmp, -DW / 2, -DH / 2); L.ctx.restore();
    D.xf = null; regionHist(L, [0, 0, DW, DH]); thumbs(); renderOpts(); req();
  }
  function xfCancel() { D.xf = null; renderOpts(); req(); }

  /* ---------------- 指针事件 ---------------- */
  const ptrs = new Map(); let pinch = null, pan = null;
  function onDown(e) {
    if (e.button === 2) return; view.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); commitText();
    if (ptrs.size === 2) { cancelStroke(); drag = null; ovClear(); ovOn = false; const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), c: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], z: D.zoom, tx: D.tx, ty: D.ty }; return; }
    if (ptrs.size > 2) return;
    if (e.button === 1 || spaceDown || D.tool === 'hand') { pan = [e.clientX, e.clientY, D.tx, D.ty]; return; }
    const t = (e.altKey && (D.tool === 'brush' || D.tool === 'fill')) ? 'picker' : D.tool;
    if (t === 'brush' || t === 'eraser') { beginStroke(e, t === 'eraser'); return; }
    if (t === 'fill') return bucket(e);
    if (t === 'picker') return pick(e);
    if (t === 'text') { e.preventDefault(); return placeText(e); }
    if (t === 'shape' || t === 'gradient') { drag = { t, a: toDoc(e) }; ovOn = true; return; }
    if (t === 'move') { xfStart(); drag = { t, a: [e.clientX, e.clientY], dx: D.xf.dx, dy: D.xf.dy }; }
  }
  function onMove(e) {
    if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]), c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], r = view.getBoundingClientRect();
      const z = clamp(pinch.z * d / Math.max(1, pinch.d), .08, 12), pcx = pinch.c[0] - r.left, pcy = pinch.c[1] - r.top; D.zoom = z; D.tx = pcx - (pcx - pinch.tx) * z / pinch.z + (c[0] - pinch.c[0]); D.ty = pcy - (pcy - pinch.ty) * z / pinch.z + (c[1] - pinch.c[1]); syncZoom(); req(); return; }
    cursor = toDoc(e);
    if (pan) { D.tx = pan[2] + e.clientX - pan[0]; D.ty = pan[3] + e.clientY - pan[1]; req(); return; }
    if (stroke) return moveStroke(e);
    if (drag && (drag.t === 'shape' || drag.t === 'gradient')) { ovClear(); const b = toDoc(e); if (drag.t === 'shape') drag.bb = shapePreview(drag.a, b, e.shiftKey); else gradPreview(drag.a, b); drag.b = b; req(); return; }
    if (drag && drag.t === 'move') { D.xf.dx = drag.dx + (e.clientX - drag.a[0]) / D.zoom; D.xf.dy = drag.dy + (e.clientY - drag.a[1]) / D.zoom; req(); return; }
    if (['brush', 'eraser'].includes(D.tool)) req();
  }
  function onUp(e) {
    ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null;
    if (pan) { pan = null; return; }
    if (stroke) return endStroke();
    if (drag && (drag.t === 'shape' || drag.t === 'gradient')) { const d = drag; drag = null; if (!d.b) { ovClear(); ovOn = false; req(); return; } commitOverlay(d.t === 'gradient' && D.gradKeep); return; }
    if (drag && drag.t === 'move') drag = null;
  }

  /* ---------------- 颜色 ---------------- */
  let hsv = [340, .55, .94];
  function setColor(hex, keepHsv) { D.color = hex.toUpperCase(); if (!keepHsv) hsv = rgb2hsv(...hex2rgb(hex)); syncColor(); }
  function addRecent(c) { D.recent = [c, ...D.recent.filter(x => x !== c)].slice(0, 10); const r = q('.pt-recent'); if (r) r.innerHTML = D.recent.map(c => `<button type="button" class="pt-sw" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join(''); }
  function syncColor() {
    if (!root) return;
    q('.pt-c1').style.background = D.color; q('.pt-c2').style.background = D.color2; q('.pt-hex').value = D.color;
    const sv = q('.pt-sv'), x = sv.getContext('2d'), w = sv.width, h = sv.height, [r, g, b] = hsv2rgb(hsv[0], 1, 1);
    const g1 = x.createLinearGradient(0, 0, w, 0); g1.addColorStop(0, '#fff'); g1.addColorStop(1, `rgb(${r},${g},${b})`); x.fillStyle = g1; x.fillRect(0, 0, w, h);
    const g2 = x.createLinearGradient(0, 0, 0, h); g2.addColorStop(0, 'rgba(0,0,0,0)'); g2.addColorStop(1, '#000'); x.fillStyle = g2; x.fillRect(0, 0, w, h);
    x.beginPath(); x.arc(hsv[1] * w, (1 - hsv[2]) * h, 6, 0, Math.PI * 2); x.lineWidth = 2.5; x.strokeStyle = '#fff'; x.stroke(); x.lineWidth = 1; x.strokeStyle = '#000'; x.stroke();
    q('.pt-hue').value = Math.round(hsv[0]);
  }
  function svPick(e) { const c = q('.pt-sv'), r = c.getBoundingClientRect(); hsv[1] = clamp((e.clientX - r.left) / r.width, 0, 1); hsv[2] = clamp(1 - (e.clientY - r.top) / r.height, 0, 1); setColor(rgb2hex(...hsv2rgb(...hsv)), true); }

  /* ---------------- 面板 ---------------- */
  function renderLayers() {
    if (!root) return;
    const L = AL();
    q('.pt-layers').innerHTML = D.layers.map((l, i) => ({ l, i })).reverse().map(({ l, i }) => `<div class="pt-layer${i === D.active ? ' on' : ''}" data-li="${i}"><button type="button" class="pt-eye" data-eye="${i}" aria-label="${l.visible ? '隐藏' : '显示'}图层">${l.visible ? '<svg viewBox="0 0 24 24"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>' : '<svg viewBox="0 0 24 24"><path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3 3.4M6.6 6.6C3.6 8.5 2 12 2 12s4 7 10 7a9.6 9.6 0 0 0 4.4-1"/></svg>'}</button><canvas class="pt-th" width="45" height="60" data-th="${l.id}"></canvas><span class="pt-ln">${l.name}</span><span class="pt-lo">${Math.round(l.opacity * 100)}%</span></div>`).join('');
    q('.pt-lop').value = Math.round(L.opacity * 100); q('.pt-lopv').textContent = Math.round(L.opacity * 100) + '%'; q('.pt-blend').value = L.blend;
    thumbs(true);
  }
  let thT = 0;
  function thumbs(now) { clearTimeout(thT); const go = () => qa('[data-th]').forEach(c => { const L = D.layers.find(l => l.id === +c.dataset.th); if (!L) return; const x = c.getContext('2d'); x.clearRect(0, 0, 45, 60); x.drawImage(L.cv, 0, 0, 45, 60); }); now ? go() : (thT = setTimeout(go, 120)); }
  function renderOpts() {
    if (!root) return;
    const t = D.tool, o = q('.pt-opts'), sl = (k, label, min, max, step, v, fmt) => `<label class="pt-row"><span>${label}</span><input type="range" data-o="${k}" min="${min}" max="${max}" step="${step}" value="${v}"><b>${fmt(v)}</b></label>`;
    const seg = (k, opts, cur) => `<div class="pt-seg" data-seg="${k}">${opts.map(([v, n]) => `<button type="button" data-v="${v}" aria-pressed="${v === cur}">${n}</button>`).join('')}</div>`;
    const pct = v => Math.round(v * 100) + '%', px = v => Math.round(v) + 'px';
    let h = '';
    if (t === 'brush') h = `<div class="pt-brushes">${Object.entries(BRUSHES).map(([k, b]) => `<button type="button" data-brush="${k}" aria-pressed="${k === D.brush}"><canvas width="96" height="28" data-bprev="${k}"></canvas><span>${b.name}</span></button>`).join('')}</div>` + sl('size', '大小', 1, 160, 1, D.size, px) + sl('opacity', '不透明度', .05, 1, .05, D.opacity, pct) + sl('stab', '防抖', 0, 100, 1, D.stab, v => v);
    else if (t === 'eraser') h = sl('size', '大小', 1, 200, 1, D.size, px) + sl('hard', '硬度', 0, 1, .05, D.hard, pct) + sl('stab', '防抖', 0, 100, 1, D.stab, v => v);
    else if (t === 'fill') h = sl('fillTol', '容差', 0, 100, 1, D.fillTol, v => v) + sl('fillGap', '扩展边缘', 0, 4, 1, D.fillGap, px) + sl('opacity', '不透明度', .05, 1, .05, D.opacity, pct) + `<label class="pt-chk"><input type="checkbox" data-o="fillAll"${D.fillAll ? ' checked' : ''}> 参考所有图层（线稿和上色分开画时打开）</label>`;
    else if (t === 'picker') h = `<p class="pt-tip">点画布取颜色。用画笔时按住 Alt 点一下也能取色。</p>`;
    else if (t === 'shape') h = seg('shape', [['rect', '矩形'], ['round', '圆角'], ['ellipse', '圆形'], ['line', '直线'], ['star', '星星'], ['heart', '爱心']], D.shape) + seg('shapeMode', [['fill', '填充'], ['stroke', '描边'], ['both', '描边+填充']], D.shapeMode) + sl('size', '线宽', 1, 80, 1, D.size, px) + sl('opacity', '不透明度', .05, 1, .05, D.opacity, pct) + `<p class="pt-tip">拖动画出形状；按住 Shift 画正方形 / 正圆 / 45° 直线。「描边+填充」用副色填充。</p>`;
    else if (t === 'gradient') h = seg('grad', [['linear', '线性'], ['radial', '放射']], D.grad) + seg('gradEnd', [['second', '主色 → 副色'], ['clear', '主色 → 透明']], D.gradEnd) + `<label class="pt-chk"><input type="checkbox" data-o="gradKeep"${D.gradKeep ? ' checked' : ''}> 只涂在图层已有的内容上</label>` + sl('opacity', '不透明度', .05, 1, .05, D.opacity, pct) + `<p class="pt-tip">在画布上拖一条线：从起点的主色渐变到终点。</p>`;
    else if (t === 'text') h = seg('font', [["'ZCOOL KuaiLe',sans-serif", '快乐体'], ["'Fredoka',sans-serif", 'Fredoka'], ["'PingFang SC','Microsoft YaHei',sans-serif", '黑体'], ["'Hachi Maru Pop',cursive", '圆圆体']], D.font) + seg('shapeMode', [['fill', '纯色'], ['both', '加副色描边']], D.shapeMode === 'stroke' ? 'both' : D.shapeMode) + sl('textSize', '字号', 16, 240, 2, D.textSize, px) + sl('opacity', '不透明度', .05, 1, .05, D.opacity, pct) + `<p class="pt-tip">点画布放文字，打完按回车。</p>`;
    else if (t === 'move') h = D.xf ? sl('xs', '缩放', .1, 3, .01, D.xf.s, pct) + sl('xr', '旋转', -180, 180, 1, D.xf.rot, v => v + '°') + `<div class="pt-btns"><button type="button" data-act="xflip">水平翻转</button><button type="button" data-act="xcancel">取消</button><button type="button" class="pri" data-act="xapply">确定</button></div><p class="pt-tip">拖动画布挪动当前图层，用滑杆缩放、旋转。</p>` : `<p class="pt-tip">按住拖动，挪动当前图层；可以缩放、旋转、翻转，调好按「确定」。</p><div class="pt-btns"><button type="button" class="pri" data-act="xstart">开始变换</button></div>`;
    else h = `<p class="pt-tip">拖动移动画布。双指捏合 / 滚轮缩放，任何工具下按住空格或鼠标中键也能拖。</p>`;
    o.innerHTML = h;
    qa('[data-bprev]').forEach(c => { const x = c.getContext('2d'), k = c.dataset.bprev, B = BRUSHES[k]; x.clearRect(0, 0, 96, 28);
      const save = stroke; stroke = { br: B, buffer: false, alpha: B.opacity ?? 1, color: '#4A3430', hard: B.hard, bb: [0, 0, 0, 0], stamp: softStamp('#4A3430', B.hard), grains: B.grain ? grainStamps('#4A3430', B.hard, B.grain) : null };
      const fake = { ctx: x, visible: true }, al = D.layers[D.active]; D.layers[D.active] = fake; const sz = D.size, sy = D.sym; D.size = k === 'sparkle' ? 10 : 7; D.sym = false;
      for (let i = 0; i <= 40; i++) { const u = i / 40; dab(8 + u * 80, 14 + Math.sin(u * Math.PI * 2) * 6, k === 'pen' ? Math.sin(u * Math.PI) * .8 + .2 : 1); }
      D.layers[D.active] = al; D.size = sz; D.sym = sy; stroke = save; });
    qa('.pt-tool').forEach(b => b.setAttribute('aria-pressed', b.dataset.tool === t));
  }
  const toastP = m => { const t = q('.pt-toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 2000); };
  function setTool(t) { commitText(); if (D.tool === 'move' && D.xf && t !== 'move') xfApply(); if (t !== 'picker') D.prevTool = t; D.tool = t; view.style.cursor = t === 'hand' ? 'grab' : t === 'picker' ? 'copy' : t === 'text' ? 'text' : 'crosshair'; renderOpts(); req(); }

  /* ---------------- 搭界面 ---------------- */
  function build() {
    root = document.createElement('div'); root.className = 'pt-root'; root.hidden = true; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', '画背景');
    const ic = k => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICON[k]}"/></svg>`;
    root.innerHTML = `
<div class="pt-top">
  <button type="button" class="pt-b" data-act="close">✕ 关闭</button><span class="pt-title">画背景</span>
  <div class="pt-g"><button type="button" class="pt-b" data-act="undo" title="撤销 Ctrl+Z" disabled>↶ 撤销</button><button type="button" class="pt-b" data-act="redo" title="重做 Ctrl+Shift+Z" disabled>↷ 重做</button></div>
  <div class="pt-g"><button type="button" class="pt-b" data-act="zout" aria-label="缩小">−</button><span class="pt-z" data-z>100%</span><button type="button" class="pt-b" data-act="zin" aria-label="放大">+</button><button type="button" class="pt-b" data-act="fit" title="适应窗口 0">适应</button></div>
  <label class="pt-tg"><input type="checkbox" data-o="sym"> 左右对称</label><label class="pt-tg"><input type="checkbox" data-o="guide" checked> 显示娃娃位置</label>
  <span class="pt-sp"></span><button type="button" class="pt-b" data-act="export">导出 PNG</button><button type="button" class="pt-b pri" data-act="save">保存为背景</button>
</div>
<div class="pt-main">
  <div class="pt-tools" role="toolbar" aria-label="工具">${TOOLS.map(([k, n, s]) => `<button type="button" class="pt-tool" data-tool="${k}" title="${n}${s ? ' ' + s : ''}" aria-label="${n}" aria-pressed="false">${ic(k)}<span>${n}</span></button>`).join('')}
    <div class="pt-cc"><button type="button" class="pt-c1" title="主色" aria-label="主色"></button><button type="button" class="pt-c2" data-act="swap" title="副色（点一下交换，X）" aria-label="副色"></button></div></div>
  <div class="pt-stage"><canvas class="pt-view"></canvas><input class="pt-text" hidden placeholder="输入文字，回车完成" maxlength="40"><div class="pt-toast" role="status"></div></div>
  <div class="pt-side">
    <div class="pt-tabs" role="tablist"><button type="button" data-panel="color" role="tab">颜色</button><button type="button" data-panel="opts" role="tab">工具设置</button><button type="button" data-panel="layer" role="tab">图层</button></div>
    <section class="pt-sec" data-sec="color"><canvas class="pt-sv" width="220" height="150" aria-label="选饱和度和亮度"></canvas><input class="pt-hue" type="range" min="0" max="359" aria-label="色相">
      <div class="pt-row"><span>色号</span><input class="pt-hex" maxlength="7" aria-label="色号"></div>
      <div class="pt-pal">${PALETTE.map(c => `<button type="button" class="pt-sw" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div>
      <div class="pt-sub">最近用过</div><div class="pt-pal pt-recent"></div></section>
    <section class="pt-sec" data-sec="opts"><div class="pt-opts"></div></section>
    <section class="pt-sec" data-sec="layer"><div class="pt-layers"></div>
      <label class="pt-row"><span>不透明度</span><input type="range" class="pt-lop" min="0" max="100"><b class="pt-lopv"></b></label>
      <label class="pt-row"><span>混合</span><select class="pt-blend"><option value="source-over">正常</option><option value="multiply">正片叠底</option><option value="screen">滤色</option><option value="overlay">叠加</option><option value="soft-light">柔光</option><option value="color-dodge">颜色减淡</option></select></label>
      <div class="pt-btns"><button type="button" data-act="ladd">＋ 新建</button><button type="button" data-act="ldup">复制</button><button type="button" data-act="lup">上移</button><button type="button" data-act="ldown">下移</button><button type="button" data-act="lmerge">向下合并</button><button type="button" data-act="lclear">清空</button><button type="button" data-act="ldel">删除</button><label class="pt-imp">导入图片<input type="file" accept="image/*" class="pt-file"></label></div></section>
  </div>
</div>`;
    document.body.appendChild(root);
    view = q('.pt-view'); vctx = view.getContext('2d'); tmp = mk(); tctx = tmp.getContext('2d', { willReadFrequently: true }); buf = mk(); bctx = buf.getContext('2d'); ov = mk(); octx = ov.getContext('2d'); preCv = mk(); prectx = preCv.getContext('2d', { willReadFrequently: true });
    view.addEventListener('pointerdown', onDown); view.addEventListener('pointermove', onMove); view.addEventListener('pointerup', onUp); view.addEventListener('pointercancel', onUp);
    view.addEventListener('pointerleave', () => { cursor = null; req(); });
    view.addEventListener('wheel', e => { e.preventDefault(); const r = view.getBoundingClientRect(); if (e.ctrlKey || e.metaKey || !e.shiftKey) zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? .01 : .0015)), e.clientX - r.left, e.clientY - r.top); else { D.tx -= e.deltaX || e.deltaY; req(); } }, { passive: false });
    view.addEventListener('contextmenu', e => e.preventDefault());
    root.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.tool) return setTool(b.dataset.tool);
      if (b.dataset.brush) { D.brush = b.dataset.brush; const B = BRUSHES[D.brush]; if (B.opacity != null) D.opacity = 1; renderOpts(); return; }
      if (b.dataset.c) { setColor(b.dataset.c); return; }
      if (b.dataset.panel) { D.panel = b.dataset.panel; syncPanel(); return; }
      if (b.dataset.eye != null) { const L = D.layers[+b.dataset.eye]; setProp(L, 'visible', !L.visible); return; }
      const sg = b.closest('[data-seg]'); if (sg) { D[sg.dataset.seg] = b.dataset.v; renderOpts(); return; }
      const ly = e.target.closest('[data-li]'); if (ly && !b.dataset.eye) { D.active = +ly.dataset.li; renderLayers(); return; }
      const a = b.dataset.act; if (!a) return;
      const r = q('.pt-stage').getBoundingClientRect();
      ({ close: () => close(false), save: () => close(true), export: exportPng, undo, redo, fit, zin: () => zoomAt(1.25, r.width / 2, r.height / 2), zout: () => zoomAt(.8, r.width / 2, r.height / 2),
        swap: () => { [D.color, D.color2] = [D.color2, D.color]; hsv = rgb2hsv(...hex2rgb(D.color)); syncColor(); },
        ladd: () => addLayer(mkLayer()), ldup: dupLayer, ldel: delLayer, lup: () => moveLayer(1), ldown: () => moveLayer(-1), lmerge: mergeDown, lclear: clearLayer,
        xstart: xfStart, xapply: xfApply, xcancel: xfCancel, xflip: () => { D.xf.flip = !D.xf.flip; req(); } })[a]?.();
    });
    root.addEventListener('dblclick', e => { const ly = e.target.closest('[data-li]'); if (!ly) return; const L = D.layers[+ly.dataset.li], n = prompt('图层名字', L.name); if (n && n.trim()) setProp(L, 'name', n.trim().slice(0, 12)); });
    root.addEventListener('input', e => {
      const el = e.target, k = el.dataset.o;
      if (k === 'sym' || k === 'guide') { D[k] = el.checked; req(); return; }
      if (k === 'fillAll' || k === 'gradKeep') { D[k] = el.checked; return; }
      if (k === 'xs' || k === 'xr') { D.xf[k === 'xs' ? 's' : 'rot'] = +el.value; el.nextElementSibling.textContent = k === 'xs' ? Math.round(el.value * 100) + '%' : el.value + '°'; req(); return; }
      if (k) { D[k] = +el.value; const bv = el.nextElementSibling; if (bv) bv.textContent = ['opacity', 'hard'].includes(k) ? Math.round(el.value * 100) + '%' : ['size', 'fillGap', 'textSize'].includes(k) ? el.value + 'px' : el.value; if (k === 'size') req(); return; }
      if (el.classList.contains('pt-hue')) { hsv[0] = +el.value; setColor(rgb2hex(...hsv2rgb(...hsv)), true); return; }
      if (el.classList.contains('pt-lop')) { AL().opacity = el.value / 100; q('.pt-lopv').textContent = el.value + '%'; req(); return; }
    });
    root.addEventListener('change', e => {
      const el = e.target;
      if (el.classList.contains('pt-hex')) { const v = el.value.trim(); if (/^#?[0-9a-f]{6}$/i.test(v)) setColor(v[0] === '#' ? v : '#' + v); else syncColor(); }
      if (el.classList.contains('pt-blend')) setProp(AL(), 'blend', el.value);
      if (el.classList.contains('pt-lop')) { const L = AL(), v = el.value / 100; L.opacity = v; renderLayers(); }
      if (el.classList.contains('pt-file')) { const f = el.files[0]; el.value = ''; if (f) importImage(f, '导入的图片'); }
    });
    const sv = q('.pt-sv'); let svDrag = false;
    sv.addEventListener('pointerdown', e => { svDrag = true; sv.setPointerCapture(e.pointerId); svPick(e); });
    sv.addEventListener('pointermove', e => { if (svDrag) svPick(e); }); sv.addEventListener('pointerup', () => { svDrag = false; });
    const ti = q('.pt-text'); ti.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); commitText(); } if (e.key === 'Escape') { ti.hidden = true; } e.stopPropagation(); });
    document.addEventListener('keydown', onKey); document.addEventListener('keyup', e => { if (e.code === 'Space') { spaceDown = false; } });
    window.addEventListener('resize', () => { if (!root.hidden) { resize(); syncPanel(); } });
  }
  function onKey(e) {
    if (!root || root.hidden) return; const tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' && e.target.type !== 'range' && e.target.type !== 'checkbox' || tag === 'select') return;
    const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (mod && k === 'y') { e.preventDefault(); redo(); return; }
    if (mod) return;
    if (e.code === 'Space') { spaceDown = true; e.preventDefault(); return; }
    const map = { b: 'brush', e: 'eraser', g: 'fill', i: 'picker', u: 'shape', t: 'text', v: 'move', h: 'hand' };
    if (map[k]) { setTool(map[k]); e.preventDefault(); return; }
    if (k === '[' || k === ']') { D.size = clamp(Math.round(D.size * (k === ']' ? 1.2 : 1 / 1.2)), 1, 200); renderOpts(); req(); return; }
    if (k === 'x') { [D.color, D.color2] = [D.color2, D.color]; hsv = rgb2hsv(...hex2rgb(D.color)); syncColor(); return; }
    if (k === '0') return fit();
    if (k === 'escape') { if (D.xf) xfCancel(); }
  }
  function syncPanel() { qa('.pt-tabs [data-panel]').forEach(b => b.setAttribute('aria-selected', b.dataset.panel === D.panel)); qa('.pt-sec').forEach(s => s.classList.toggle('on', wide() || s.dataset.sec === D.panel)); }
  const wide = () => window.innerWidth >= 900;

  /* ---------------- 导入 / 导出 ---------------- */
  function loadImg(src) { return new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = src; }); }
  async function importImage(file, name, under) {
    const url = typeof file === 'string' ? file : URL.createObjectURL(file);
    try { const im = await loadImg(url); const L = mkLayer(name || '图片'), s = Math.max(DW / im.naturalWidth, DH / im.naturalHeight); L.ctx.drawImage(im, (DW - im.naturalWidth * s) / 2, (DH - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s); addLayer(L, under ? 0 : D.active + 1); thumbs(); toastP('图片已放进新图层：可以用「移动变换」挪位置、缩放'); }
    catch (e) { toastP('这张图片打不开，换一张 JPG / PNG 试试'); }
    finally { if (typeof file !== 'string') URL.revokeObjectURL(url); }
  }
  function flatten() { const c = mk(), x = c.getContext('2d'); D.layers.forEach(L => { if (!L.visible) return; x.globalAlpha = L.opacity; x.globalCompositeOperation = L.blend; x.drawImage(L.cv, 0, 0); }); return c; }
  function opaque(c) { const d = c.getContext('2d').getImageData(0, 0, DW, DH).data; for (let i = 3; i < d.length; i += 4 * 97) if (d[i] < 250) return false; return true; }
  function exportPng() { const a = document.createElement('a'); a.download = 'my-doll-background.png'; a.href = flatten().toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); }

  /* ---------------- 打开 / 关闭 ---------------- */
  async function open(opts = {}) {
    if (!root) build(); onSave = opts.onSave || null;
    D.layers = []; D.hist = []; D.redo = []; D.xf = null; D.active = 0; nid = 1; ovClear(); ovOn = false;
    if (opts.layers && opts.layers.length) { for (const l of opts.layers) { const L = mkLayer(l.name); L.visible = l.visible !== false; L.opacity = l.opacity ?? 1; L.blend = l.blend || 'source-over'; try { L.ctx.drawImage(await loadImg(l.png), 0, 0, DW, DH); } catch (e) { } D.layers.push(L); } D.active = D.layers.length - 1; }
    else { const bg = mkLayer('底色'); bg.ctx.fillStyle = '#FFFFFF'; bg.ctx.fillRect(0, 0, DW, DH); D.layers.push(bg); if (opts.image) { const L = mkLayer('照片'); D.layers.push(L); D.active = 1; try { const im = await loadImg(opts.image), s = Math.max(DW / im.naturalWidth, DH / im.naturalHeight); L.ctx.drawImage(im, (DW - im.naturalWidth * s) / 2, (DH - im.naturalHeight * s) / 2, im.naturalWidth * s, im.naturalHeight * s); } catch (e) { } } D.layers.push(mkLayer('画画')); D.active = D.layers.length - 1; }
    guideImg = opts.guide || null; D.name = opts.name || '';
    root.hidden = false; document.body.classList.add('modal-open');
    resize(); fit(); setTool(D.tool === 'move' ? 'brush' : D.tool); setColor(D.color); addRecent(D.color); D.panel = 'color'; syncPanel(); renderLayers(); syncUndo();
    q('[data-o=guide]').checked = D.guide; q('[data-o=sym]').checked = D.sym;
  }
  function close(save) {
    commitText(); if (D.xf) xfApply();
    if (save && onSave) { const f = flatten(), op = opaque(f), url = op ? f.toDataURL('image/jpeg', .9) : f.toDataURL('image/png');
      const th = mk(150, 200); th.getContext('2d').drawImage(f, 0, 0, 150, 200);
      onSave({ url, thumb: th.toDataURL('image/jpeg', .8), layers: D.layers.map(L => ({ name: L.name, visible: L.visible, opacity: L.opacity, blend: L.blend, png: L.cv.toDataURL('image/png') })) }); }
    else if (!save && D.hist.length && !confirm('还没保存，确定要关掉吗？')) return;
    root.hidden = true; document.body.classList.remove('modal-open'); D.layers = []; D.hist = []; D.redo = [];
  }
  return { open, close, importImage, get isOpen() { return !!root && !root.hidden; }, _D: D, _undo: undo, _redo: redo };
})();
