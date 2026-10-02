/* =====================================================================
   照片识别版型：从照片里框出的衣服轮廓（蒙版）量出版型参数，再在娃娃身上重新生成一件
   1. 量轮廓：衣身宽、袖子伸出去多长多粗、衣长、腰身收不收、下摆放多少、领口深浅和形状、
      是不是吊带、下半截是不是分成两条腿（裤子）、上口窄下摆宽（半裙）
   2. 换算到娃娃：全部按「衣身半宽」做单位（平铺 / 挂拍 / 穿着拍都不受照片大小影响），
      再用现成的版型零件（衣身 bodyD、袖子 sleeveD、吊带 tankD、裙 skirtD、裤 pantsD）拼出来，
      所以描边、阴影、褶皱和其它衣服是一套
   3. 识别结果可以在面板里改：类型、领口、袖长、袖宽、长度、下摆
   ===================================================================== */
const FIT = (() => {
  const ip = (A, v) => { if (v <= A[0][0]) return A[0][1]; for (let i = 1; i < A.length; i++) if (v <= A[i][0]) { const [x0, y0] = A[i - 1], [x1, y1] = A[i]; return y0 + (y1 - y0) * (v - x0) / (x1 - x0); } return A[A.length - 1][1]; };
  const inv = (A, y) => ip(A.map(([a, b]) => [b, a]), y);
  const cl = (v, a, b) => Math.max(a, Math.min(b, v));
  const med = a => { const s = a.filter(v => v != null && isFinite(v)).sort((x, y) => x - y); return s.length ? s[s.length >> 1] : null; };

  /* ---------- 1. 量轮廓 ---------- */
  function analyze(M, W, H) {
    let x0 = W, x1 = -1, y0 = H, y1 = -1, n = 0, sx = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (M[y * W + x]) { n++; sx += x; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (n < 40 || y1 - y0 < 8) return null;
    const h = y1 - y0 + 1, cx = (sx / n + (x0 + x1) / 2) / 2;
    const segs = [];
    for (let y = y0; y <= y1; y++) { const s = []; let a = -1; for (let x = 0; x <= W; x++) { const on = x < W && M[y * W + x]; if (on && a < 0) a = x; if (!on && a >= 0) { s.push([a, x - 1]); a = -1; } } segs[y] = s; }
    const at = t => y0 + Math.round(cl(t, 0, 1) * (h - 1));
    const cen = y => { const s = segs[y] || []; let best = null, bd = 1e9; s.forEach(g => { const d = g[0] <= cx && g[1] >= cx ? 0 : Math.min(Math.abs(g[0] - cx), Math.abs(g[1] - cx)); if (d < bd) { bd = d; best = g; } }); return bd <= 1.5 ? best : null; };
    const hw = y => { const g = cen(y); return g ? (g[1] - g[0] + 1) / 2 : null; };
    const band = (a, b, f) => { const v = []; for (let t = a; t <= b + 1e-6; t += .02) v.push(f(at(t))); return v; };
    const gapAt = y => { const s = segs[y] || []; return s.length >= 2 && !s.some(g => g[0] <= cx + .5 && g[1] >= cx - .5) && s.some(g => g[1] < cx) && s.some(g => g[0] > cx); };

    /* 裤子：下半截中间是空的，两边各一条腿 */
    const lower = band(.68, .97, gapAt), pants = lower.filter(Boolean).length / lower.length > .6;
    if (pants) {
      let cr = y1; for (let y = y1; y >= y0; y--) { if (!gapAt(y)) { cr = y + 1; break; } }
      const wt = med(band(.01, .06, hw)) || (x1 - x0) / 2;
      const legW = med(band(.9, .98, y => { const s = segs[y] || []; return s.length ? s.reduce((m, g) => Math.max(m, g[1] - g[0] + 1), 0) : null; })) || wt;
      return { kind: 'pants', L: h / wt, crotch: (cr - y0) / wt, leg: legW / wt, conf: .8 };
    }
    /* 衣身半宽：取中段 */
    const tw = Math.min(med(band(.5, .8, hw)) ?? 1e9, med(band(.2, .4, hw)) ?? 1e9) < 1e9 ? Math.min(med(band(.5, .8, hw)) ?? 1e9, med(band(.2, .4, hw)) ?? 1e9) : (x1 - x0) / 4, wTop = med(band(.01, .06, hw)) || tw, wHem = med(band(.9, .98, hw)) || tw;
    /* 每一列的最上沿 → 肩线和领口 */
    const topY = x => { x = Math.round(x); if (x < 0 || x >= W) return null; for (let y = y0; y <= y1; y++) if (M[y * W + x]) return y; return null; };
    const sh = Math.min(...[-.75, -.6, -.45, .45, .6, .75].map(k => topY(cx + k * tw) ?? 1e9));
    const midTop = med([-1, 0, 1].map(k => topY(cx + k)));
    const notch = (midTop ?? sh) - sh;
    const widthAt = dy => { let c = 0; for (let x = Math.round(cx - .8 * tw); x <= cx + .8 * tw; x++) { const t = topY(x); if (t == null || t > sh + dy) c++; } return c / 2; };
    const nw = notch > 1 ? widthAt(Math.max(1, notch * .2)) : 0, nMid = notch > 2 ? widthAt(notch * .55) : 0;
    /* 吊带：最上面几行在中间是空的、两边是细细的带子 */
    let strapRows = 0, rows = 0;
    for (let y = sh; y < sh + Math.max(3, h * .12); y++) { const s = (segs[y] || []).filter(g => g[1] > cx - tw && g[0] < cx + tw); if (!s.length) continue; rows++; if (s.length >= 2 && !s.some(g => g[0] <= cx && g[1] >= cx) && s.every(g => g[1] - g[0] + 1 < .4 * tw)) strapRows++; }
    const strap = rows > 0 && strapRows / rows > .5;
    /* 袖子：衣身外面的那部分；从肩点量到最远的袖口 */
    const side = sgn => {
      const ax = cx + sgn * tw, ay = topY(ax) ?? sh; let A = 0, far = 0;
      for (let y = y0; y <= y0 + h * .92; y++) for (let x = 0; x < W; x++) { if (!M[y * W + x] || (x - cx) * sgn <= tw * 1.15) continue; if (y > sh + tw * 1.3) { const g = cen(y); if (g && x >= g[0] && x <= g[1]) continue; } A++; const d = Math.hypot(x - ax, y - ay); if (d > far) far = d; }
      return { A, far };
    };
    const sL = side(-1), sR = side(1), sA = (sL.A + sR.A) / 2, sFar = Math.max(sL.far, sR.far) * .6 + Math.min(sL.far, sR.far) * .4;
    const sleeved = !strap && sA / n > .025 && sFar > tw * .35;
    const prof = band(.25, .6, hw).map(v => v == null ? null : v / tw), waist = Math.min(...prof.filter(v => v != null), 9);
    const L = (y1 - sh) / tw;
    /* 半裙：没有袖子、没有领口凹陷、上口明显比下摆窄、整体不高 */
    const mono = [.05, .3, .6, .95].map(t => hw(at(t))), up = mono.every((v, i) => v != null && (!i || v >= mono[i - 1] * .97));
    const wMax = Math.max(...band(.5, .98, hw).filter(v => v != null), 0), flatTop = Math.abs(topY(cx - wTop * .8) - topY(cx + wTop * .8)) < h * .06;
    const skirt = (up || (!sleeved && wMax > wTop * 1.25 && flatTop)) && !strap && notch < h * .05 && wTop < Math.max(wHem, wMax) * .82 && h / wTop < 6.5 && Math.abs(topY(cx - wTop * .8) - topY(cx + wTop * .8)) < h * .06;
    if (skirt) return { kind: 'skirt', L: h / wTop, flare: wHem / wTop, conf: .7 };
    return {
      kind: L > 3.6 ? 'dress' : 'top', L, tw, strap, sleeved,
      sleeve: sleeved ? sFar / tw : 0, sw: sleeved ? sA / Math.max(1, sFar) / tw : 0,
      notch: notch / tw, nw: nw / tw, vr: nw ? nMid / nw : 1, high: midTop != null && midTop < sh - tw * .1,
      waist, hem: wHem / tw, conf: sleeved || strap || notch > 1 ? .8 : .55
    };
  }

  /* ---------- 2. 换算成娃娃上的参数 ---------- */
  const TOP_HEM = [[1.4, 236], [1.9, 256], [2.4, 276], [2.9, 296], [3.4, 312], [4.2, 370], [5, 430], [6, 500]];
  const SKIRT_HEM = [[1.6, 318], [2.2, 345], [3.3, 400], [4.4, 460], [5.5, 530]];
  const PANT_HEMS = [[1.5, 335], [1.9, 350], [2.9, 420], [4, 505], [5.2, 567]];
  const SLV = [[0, 214], [.25, 224], [.4, 238], [.6, 262], [.8, 290], [1, 318]];
  function params(f) {
    if (!f) return { kind: 'top', neck: 'crew', sleeve: 1, sw: .5, hem: 300, flare: 0, waist: 0, conf: 0 };
    if (f.kind === 'pants') return { kind: 'pants', hem: Math.round(ip(PANT_HEMS, f.L)), leg: +cl(f.leg, .5, 1.8).toFixed(2), conf: f.conf };
    if (f.kind === 'skirt') return { kind: 'skirt', hem: Math.round(ip(SKIRT_HEM, f.L)), flare: Math.round(cl((f.flare - 1) * 32, 0, 60)), conf: f.conf };
    const neck = f.strap ? 'strap' : f.high ? 'high' : f.notch > .55 ? (f.vr < .62 ? 'v' : f.vr > .9 ? 'square' : 'scoop') : f.notch > .32 ? (f.vr < .55 ? 'v' : 'scoop') : 'crew';
    const sleeve = f.sleeved ? +cl((f.sleeve - .45) / 2.45, .12, 1).toFixed(2) : 0;
    const hem = Math.round(ip(TOP_HEM, f.L)), fl = cl((f.hem - 1) * 30, -2, 70);
    return { kind: f.kind, neck, sleeve, sw: +cl((f.sw || .36) * 1.4, .3, 1.2).toFixed(2), hem, flare: Math.round(fl), waist: f.kind === 'dress' && f.hem > 1.5 ? 1 : 0, nw: +cl(f.nw || .3, .15, .8).toFixed(2), conf: f.conf };
  }
  const catOf = p => p.kind === 'pants' || p.kind === 'skirt' ? 'bottom' : p.kind;

  /* ---------- 3. 在娃娃身上生成 ---------- */
  function render(p, F) {
    if (p.kind === 'pants') {
      const hem = cl(p.hem, 330, 567), eh = 2.6 + (p.leg - .9) * 18, ease = y => 2.6 + Math.max(0, eh - 2.6) * Math.pow(cl((y - 300) / (hem - 300), 0, 1), 1.3) + Math.min(0, eh - 2.6) * .3;
      const d = pantsD({ top: 282, hem, crotch: 327, ease, inE: y => 2 + Math.max(0, eh - 2.6) * .45 * cl((y - 330) / (hem - 330), 0, 1) });
      return piece(d, F.fill, { lines: [{ d: FLY, o: .5 }, { d: POCKET, o: .5 }, { d: mir(POCKET), o: .5 }] }) + piece(bandD(279, 8, 3.4, 2.8), F.rib || F.fill, {});
    }
    if (p.kind === 'skirt') {
      const hem = cl(p.hem, 312, 560);
      return piece(skirtD({ top: 282, hem, flare: p.flare, hipY: Math.min(300, hem - 12), curve: 3 + p.flare * .05 }), F.fill, { folds: fm(`M 128 ${f1(hem - (hem - 290) * .6)} Q 126 ${f1(hem - (hem - 290) * .3)} ${f1(124 - p.flare * .5)} ${f1(hem - 2)}`) }) + piece(bandD(279, 7, 3.4, 2.6), F.rib || F.fill, {});
    }
    const outer = p.kind === 'outer', tw = 150 - sideX(232);
    const e = outer ? 4.4 : 2.8 + p.sw * 1.2, hem = cl(p.hem, 236, 540);
    let out = '';
    /* 连衣裙收腰：上身到腰线，下面接一条裙子 */
    if (p.kind === 'dress' && p.waist) {
      out += piece(skirtD({ top: 252, hem, flare: p.flare, hipY: Math.min(296, hem - 10), dip: 2, e: 2 }), F.fill, { folds: fm(`M 130 ${f1(262 + (hem - 262) * .3)} Q 127 ${f1(262 + (hem - 262) * .6)} ${f1(126 - p.flare * .5)} ${f1(hem - 2)}`) });
    }
    const bHem = p.kind === 'dress' && p.waist ? 256 : hem, bFlare = p.kind === 'dress' && p.waist ? 0 : p.flare;
    const neckX = cl(150 - (p.nw || .3) * tw * 1.1, 128, 141);
    const neckY = { crew: 170, high: 168, scoop: 184, square: 186, v: 196 }[p.neck] ?? 170;
    const neckW = p.neck === 'v' ? 1.2 : p.neck === 'square' ? (150 - neckX) * .92 : p.neck === 'scoop' ? (150 - neckX) * .62 : 7;
    const body = p.neck === 'strap' ? tankD({ top: 193, strapX: 128.6, e: 2.2, hem: bHem, hemE: 2.6 + bFlare * .2, flare: bFlare * .8, dip: 3.4 })
      : bodyD({ hem: bHem, e: e / 1.22, hemE: (e + 1) / 1.3, neckY: outer ? Math.max(neckY, 190) : neckY, neckW: outer ? 1.2 : neckW, neckX: outer ? Math.min(neckX, 136) : neckX, flare: bFlare, se: 2.2 + p.sw });
    const bodyFolds = fm(`M 126 ${f1(236 + (bHem - 236) * .1)} Q 128 ${f1(236 + (bHem - 236) * .4)} 126 ${f1(236 + (bHem - 236) * .65)}`);
    const lines = outer ? [{ d: `M 150 ${Math.max(neckY, 190)} L 150 ${f1(bHem + 1)}`, o: .7 }] : p.neck === 'v' || p.neck === 'scoop' || p.neck === 'square' ? [] : [];
    if (p.neck === 'strap') { const st = 'M 128.8 193.5 L 129.4 170.6'; out += strap(st, F.base, 1.6) + strap(mir(st), F.base, 1.6); }
    out += piece(body, F.fill, { folds: bodyFolds, lines });
    if (p.sleeve > .05 && p.neck !== 'strap') {
      const y1 = Math.round(ip(SLV, p.sleeve)), wide = p.sw - .5, eo = cl(2.8 + wide * 14, 2, 12), ei = cl(2.4 + wide * 5, 1.6, 5.4), puff = cl((p.sw - .62) * 9, 0, 5);
      const sl = sleeveD({ y1, puff, eo, ei, se: 2.4 + Math.max(0, wide) * 3 }), fo = y1 > 280 ? ['M 98 264 Q 102 272 100 282'] : [];
      out += piece(sl, F.fill, { folds: fo }) + piece(mir(sl), F.fill, { folds: fo.map(mir) });
      if (y1 > 290) { const cf = cuffD(y1, 7, eo, ei); out += piece(cf, F.rib || F.fill, {}) + piece(mir(cf), F.rib || F.fill, {}); }
    }
    if (p.neck === 'high') out += piece(spline([[139.6, 151, 'c'], [160.4, 151, 'c'], [162.4, 168, 'c'], [150, 171.6], [137.6, 168, 'c']]), F.rib || F.fill, { lines: [{ d: ribLines(140, 160, 151, 170, 2.6), o: .3, w: .7 }] });
    else if (p.neck === 'crew' && !outer) out += piece(spline([[137.4, 163.2, 'c'], [150, 169.4], [162.6, 163.2, 'c'], [163.6, 166.6, 'c'], [150, 174.2], [136.4, 166.6, 'c']]), F.rib || F.fill, { rim: false });
    return out;
  }
  const VIEW = { top: '72 136 156 200', outer: '64 132 172 230', bottom: '70 262 160 320', dress: '60 132 180 420' };
  function thumb(p) {
    const c = catOf(p);
    if (c === 'bottom') { const hh = Math.max(100, p.hem - 262 + 20), s = Math.max(hh, 120); return `${f1(150 - s / 2)} 266 ${f1(s)} ${f1(s)}`; }
    const hh = Math.max(130, p.hem - 136 + 14), s = Math.max(hh, 150); return `${f1(150 - s / 2)} 134 ${f1(s)} ${f1(s)}`;
  }
  const NECK_N = { crew: '圆领', high: '高领', scoop: '大圆领', square: '方领', v: 'V领', strap: '吊带' };
  const lenName = p => {
    if (p.kind === 'pants') return p.hem < 360 ? '短裤' : p.hem < 450 ? '五分裤' : p.hem < 530 ? '九分裤' : '长裤';
    if (p.kind === 'skirt') return p.hem < 350 ? '短裙' : p.hem < 420 ? '及膝裙' : p.hem < 490 ? '中长裙' : '长裙';
    if (p.kind === 'dress') return p.hem < 360 ? '短款' : p.hem < 430 ? '及膝' : p.hem < 490 ? '中长' : '长款';
    return p.hem < 268 ? '短款' : p.hem < 312 ? '常规' : '长款';
  };
  const slvName = p => (p.neck === 'strap' ? '' : p.sleeve < .05 ? '无袖' : p.sleeve < .36 ? '短袖' : p.sleeve < .7 ? '中袖' : '长袖');
  const silName = p => (p.kind === 'pants' ? (p.leg > 1.2 ? '阔腿' : p.leg < .7 ? '修身' : '直筒') : p.flare > 30 ? '大摆' : p.flare > 10 ? 'A字' : p.flare < 2 ? '直身' : '微A');
  function describe(p) {
    if (p.kind === 'pants') return [lenName(p), silName(p)];
    if (p.kind === 'skirt') return [lenName(p), silName(p)];
    return [slvName(p), NECK_N[p.neck], lenName(p), p.waist ? '收腰' : silName(p)].filter(Boolean);
  }
  const KIND_N = { top: '上衣', outer: '外套', dress: '连衣裙', skirt: '半裙', pants: '裤子' };
  const name = p => {
    if (p.kind === 'pants') return (silName(p) === '直筒' ? '' : silName(p)) + lenName(p);
    if (p.kind === 'skirt') return silName(p).replace('直身', '直筒') + lenName(p);
    return slvName(p) + NECK_N[p.neck].replace('吊带', '吊带') + KIND_N[p.kind];
  };
  return { analyze, params, render, catOf, thumb, describe, name, KIND_N, NECK_N };
})();
