/* =====================================================================
   细节层（deco）：同一个版型的衣服不再只是换颜色——领子、门襟扣子、口袋、蕾丝 / 流苏下摆、刺绣、麻花纹、
   腰带、袖口……按每件衣服的参考图单独加。画法和版型一样（同一套描边粗细、piece 的阴影），所以风格统一。
   位置不用手算：先把版型「量一遍」（中线最高点 = 领口、最低点 = 下摆、任意高度的半宽），细节按比例落上去
   it.deco = [[类型, 参数], ...]
   ===================================================================== */
const DECO = (() => {
  const G = {};
  function geo(tpl) {
    if (G[tpl]) return G[tpl];
    const T = TPL[tpl], rec = [], P0 = piece, S0 = strap;
    piece = d => { rec.push(String(d)); return ''; }; strap = () => '';
    try { T.render(resolveFill({ id: 'g', white: true, cat: T.cat, tpl })); } catch (e) { } finally { piece = P0; strap = S0; }
    const ctx = document.createElement('canvas').getContext('2d'), P = rec.map(d => { try { return new Path2D(d); } catch (e) { return null; } }).filter(Boolean);
    const PX = [146.5, 150, 142, 138, 133, 128], hit = (x, y) => P.findIndex(p => ctx.isPointInPath(p, x, y)), inside = (x, y) => hit(x, y) >= 0;
    const probe = y => { for (const x of PX) { const i = hit(x, y); if (i >= 0) return [i, x]; } return null; };
    let top = null, hem = null;
    for (let y = 130; y < 600; y += .5) if (probe(y)) { if (top == null) top = y; hem = y; }
    const HW = {};
    // 半宽只量「中间那块布」：从中线附近那块布片往外扫，不会把挨着的袖子也算进去
    const half = y => { const k = Math.round(y * 2); if (k in HW) return HW[k]; const pr = probe(y); if (!pr) return (HW[k] = 150 - sideX(y) + 2); const p = P[pr[0]]; let x = pr[1]; while (x > 40 && ctx.isPointInPath(p, x - .5, y)) x -= .5; return (HW[k] = 150 - x); };
    return (G[tpl] = { top: top ?? 170, hem: hem ?? 300, half, inside });
  }
  const L = (d, c = INK, w = .9, o = 1, dash) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${o}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
  const btn = (x, y, r, c) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${c}" stroke="${INK}" stroke-width=".7"/><circle cx="${f1(x - r * .3)}" cy="${f1(y - r * .3)}" r="${f1(r * .3)}" fill="#fff" opacity=".7"/>`;
  const both = (s, fn) => fn(false) + fn(true);
  const mx = (m, x) => (m ? 300 - x : x);
  /* 某一高度上真正有布的几段（敞开的外套中间是空的，下摆装饰不能横跨过去） */
  const runs = (g, y, x0, x1) => { const R = []; let a = null; for (let x = x0; x <= x1 + .01; x += .5) { const on = g.inside(x, y); if (on && a == null) a = x; if ((!on || x + .5 > x1 + .01) && a != null) { const b = on ? x : x - .5; if (b - a > 3) R.push([a, b]); a = null; } } return R; };
  /* 下摆一圈的点（左半边，从侧缝到中线） */
  const hemPts = (g, y, inset = .6) => { const hw = g.half(y - 1) - inset; return [[150 - hw, y], [150 - hw * .5, y + 1.2], [150, y + 1.6]]; };
  const R = {
    /* 门襟扣子 */
    buttons: (g, o, F) => { const n = o.n || 4, y0 = o.y0 ?? g.top + 8, y1 = o.y1 ?? g.hem - 8; let s = ''; for (let i = 0; i < n; i++) { const y = y0 + (y1 - y0) * (n === 1 ? 0 : i / (n - 1));
      // 敞开的开衫：扣子钉在门襟边上，不会飘到里面那件衣服上
      let x = o.x ?? 150; if (!o.dx && !g.inside(x, y)) { let e = x; while (e > 110 && !g.inside(e, y)) e -= .5; if (e <= 110) continue; x = e - 2.6; } s += o.dx ? btn(x - o.dx, y, o.r || 1.6, o.c || F.detail) + btn(x + o.dx, y, o.r || 1.6, o.c || F.detail) : btn(x, y, o.r || 1.6, o.c || F.detail); } return s; },
    /* 门襟线（双明线） */
    placket: (g, o, F) => { const y0 = o.y0 ?? g.top + 2, y1 = o.y1 ?? g.hem; return L(`M 150 ${y0} L 150 ${y1}`, INK, .9, .8) + (o.w ? L(`M ${150 - o.w} ${y0} L ${150 - o.w} ${y1} M ${150 + o.w} ${y0} L ${150 + o.w} ${y1}`, o.c || F.stitch, .6, .8, '1.4 1') : ''); },
    /* 贴袋（左右对称） */
    pockets: (g, o, F) => { const y = o.y, w = o.w || 12, h = o.h || 11, dx = o.dx ?? Math.min(g.half(y) * .55, 26), c = o.c || F.fill;
      return both(0, m => { const x = mx(m, 150 - dx), d = `M ${f1(x - w / 2)} ${y} L ${f1(x + w / 2)} ${y} L ${f1(x + w / 2)} ${f1(y + h - 2)} Q ${f1(x)} ${f1(y + h + 1.2)} ${f1(x - w / 2)} ${f1(y + h - 2)} Z`;
        return piece(d, c, { rim: false }) + L(`M ${f1(x - w / 2 + 1.4)} ${f1(y + 1.6)} L ${f1(x + w / 2 - 1.4)} ${f1(y + 1.6)}`, F.stitch, .55, .9, '1.2 .9') + (o.flap ? piece(`M ${f1(x - w / 2 - .6)} ${f1(y - 1)} L ${f1(x + w / 2 + .6)} ${f1(y - 1)} L ${f1(x + w / 2 + .6)} ${f1(y + 3)} L ${f1(x)} ${f1(y + 5)} L ${f1(x - w / 2 - .6)} ${f1(y + 3)} Z`, o.flapC || c, { rim: false }) + btn(x, y + 3.4, 1.1, o.btnC || F.detail) : '') + (o.emb ? flower(x, y + h * .5, 1.4, o.emb) : ''); }); },
    /* 领子：圆领片 / 荷叶领 / 毛领 / 西装翻领 / 水手领 */
    collar: (g, o, F) => {
      const c = o.c || F.rib || '#FBFAF4', y = g.top;
      if (o.kind === 'peter') return both(0, m => { const M = d => (m ? mir(d) : d); return piece(M(`M 150 ${f1(y + 1)} C 146 ${f1(y + 10)} 136 ${f1(y + 12)} 130 ${f1(y + 6)} C 128 ${f1(y + 2)} 132 ${f1(y - 4)} 138 ${f1(y - 6)} C 142 ${f1(y - 3)} 146 ${f1(y - 1)} 150 ${f1(y + 1)} Z`), c, { rim: false }) + (o.trim ? L(M(`M 148 ${f1(y + 3)} C 145 ${f1(y + 9)} 137 ${f1(y + 10)} 132 ${f1(y + 5.4)}`), o.trim, .8, .9, '1 1') : ''); });
      if (o.kind === 'frill') return both(0, m => { const a = m ? [300 - 132, y - 4] : [132, y - 4], b = [150, y + 2]; return piece(frillD(m ? b : a, m ? a : b, 5, 4, 3), c, { rim: false }); });
      if (o.kind === 'fur') return piece(spline(wavy([[132, y - 6], [150, y + 2], [168, y - 6], [174, y], [166, y + 10], [150, y + 14], [134, y + 10], [126, y]], 1.4, 5)), c, { folds: [`M 136 ${f1(y + 6)} Q 150 ${f1(y + 12)} 164 ${f1(y + 6)}`], foldOp: .3 });
      if (o.kind === 'lapel') { const yb = o.yb ?? y + 34; return both(0, m => { const M = d => (m ? mir(d) : d); return piece(M(`M 139 ${f1(y - 4)} L 132 ${f1(y + 8)} L 138 ${f1(y + 12)} L 135 ${f1(y + 18)} L 150 ${f1(yb)} L 147 ${f1(y + 4)} Z`), o.c || F.fill, { rim: false }) + (o.trim ? L(M(`M 138.6 ${f1(y - 2)} L 133 ${f1(y + 8)} L 138 ${f1(y + 12)} L 135.6 ${f1(y + 18)} L 149 ${f1(yb - 2)}`), o.trim, .8, .9) : ''); }); }
      if (o.kind === 'sailor') return both(0, m => { const M = d => (m ? mir(d) : d); return piece(M(`M 138 ${f1(y - 6)} L 120 ${f1(y)} L 122 ${f1(y + 18)} L 150 ${f1(y + 26)} L 146 ${f1(y + 2)} Z`), c, { rim: false }) + L(M(`M 124 ${f1(y + 3)} L 125.6 ${f1(y + 15)} L 147 ${f1(y + 22)}`), o.trim || '#fff', 1.1, .95); });
      return '';
    },
    /* 胸前 / 领口 / 腰间蝴蝶结 */
    bow: (g, o, F) => ribbonBow(150, o.y ?? g.top + 4, o.s || .45, o.c || F.detail, o.tail ?? 1),
    /* 系带（开衫领口垂两条缎带） */
    ties: (g, o, F) => { const y = o.y ?? g.top + 8, c = o.c || '#FBFAF4'; return ribbonBow(150, y, o.s || .5, c, 1) + strap(`M 148 ${f1(y + 2)} C 146 ${f1(y + 12)} 147 ${f1(y + 20)} 145 ${f1(y + 26)}`, c, 1.4) + strap(`M 152 ${f1(y + 2)} C 154 ${f1(y + 12)} 153 ${f1(y + 20)} 155.4 ${f1(y + 24)}`, c, 1.4); },
    /* 下摆装饰：蕾丝 / 流苏 / 荷叶 / 贴边 / 明线 / 扇贝 / 串珠 */
    hem: (g, o, F) => {
      const c = o.c || F.rib || '#FFFDF8';
      // 沿着真实的下摆轮廓走：每一列从下往上找到布的下沿；敞开的外套中间那几列找不到布，自然断开
      let segs;
      if (o.y == null) {
        const hw0 = Math.max(g.half(g.hem - 4), g.half(g.hem - 14)) + 1, up = o.up ?? 1.2; segs = []; let cur = null;
        for (let x = 150 - hw0; x <= 150 + hw0 + .01; x += 1) { let yb = null; for (let y = g.hem + 1; y > g.hem - 46; y -= .5) if (g.inside(x, y)) { yb = y; break; }
          if (yb != null) { (cur || (cur = [])).push([x, yb + .5 - up]); } else if (cur) { if (cur.length > 3) segs.push(cur); cur = null; } }
        if (cur && cur.length > 3) segs.push(cur);
      } else { const hw = g.half(o.y - 1.5) - .2; segs = runs(g, o.y - 2.2, 150 - hw, 150 + hw).map(([a, b]) => { const P = []; for (let x = a; x <= b; x += 1) P.push([x, o.y + Math.sin((x - (150 - hw)) / (2 * hw) * Math.PI) * 1.4]); return P; }); }
      const along = (P, step) => { const out = [P[0]]; let acc = 0; for (let i = 1; i < P.length; i++) { const [x0, y0] = P[i - 1], [x1, y1] = P[i], d = Math.hypot(x1 - x0, y1 - y0); acc += d; if (acc >= step) { out.push([x1, y1]); acc = 0; } } return out; };
      const thin = P => P.filter((_, i) => i % 3 === 0 || i === P.length - 1);
      return segs.map(P => {
        if (o.kind === 'lace') { const Q = along(P, 9); if (Q[Q.length - 1] !== P[P.length - 1]) Q.push(P[P.length - 1]); return laceRow(Q, o.r || 2.2, c, true); }
        if (o.kind === 'fringe') { const len = o.len || 9; return [INK, c].map((col, k) => L(along(P, 2.6).map(([x, y], i) => `M ${f1(x)} ${f1(y - .6)} L ${f1(x + (x - 150) * .02)} ${f1(y + len + (i % 2) * 1.4)}`).join(' '), col, k ? 1.3 : 2.3)).join(''); }
        if (o.kind === 'ruffle') { const h = o.h || 5, Q = along(P, 18); if (Q[Q.length - 1] !== P[P.length - 1]) Q.push(P[P.length - 1]); let s = ''; for (let i = 1; i < Q.length; i++) s += piece(frillD([Q[i - 1][0] - .6, Q[i - 1][1] - 1], [Q[i][0] + .6, Q[i][1] - 1], h, 3, 7 + i), c, { rim: false }); return s; }
        if (o.kind === 'band') { const h = o.h || 6, T = thin(P); return piece('M ' + T.map(([x, y]) => `${f1(x)} ${f1(y + 1)}`).join(' L ') + ' L ' + T.slice().reverse().map(([x, y]) => `${f1(x)} ${f1(y - h)}`).join(' L ') + ' Z', c, { rim: false }); }
        if (o.kind === 'stitch') { const h = o.h || 2.4; return L('M ' + thin(P).map(([x, y]) => `${f1(x)} ${f1(y - h)}`).join(' L '), c, o.w || .7, .95, o.dash || '1.4 1'); }
        if (o.kind === 'scallop') { const Q = along(P, 6.4); let d = `M ${f1(Q[0][0])} ${f1(Q[0][1] - 1)}`; for (let i = 1; i < Q.length; i++) d += ` Q ${f1((Q[i - 1][0] + Q[i][0]) / 2)} ${f1((Q[i - 1][1] + Q[i][1]) / 2 + (o.h || 3.4) * 1.4)} ${f1(Q[i][0])} ${f1(Q[i][1] - 1)}`; return L(d, INK, 2.2) + L(d, c, 1.2); }
        if (o.kind === 'beads') return along(P, 3.2).map(([x, y], i) => `<circle cx="${f1(x)}" cy="${f1(y - 1.4)}" r="${o.r || 1.1}" fill="${(o.cs || [c])[i % (o.cs || [c]).length]}" stroke="${INK}" stroke-width=".45"/>`).join('');
        return '';
      }).join('');
    },
    /* 横向色带（费尔岛提花 / 条纹拼色 / 腰头） */
    band: (g, o, F) => { const y = o.y, h = o.h || 6, hw = g.half(y + h / 2); return runs(g, y + h / 2, 150 - hw, 150 + hw).map(([a, b]) => { const n = Math.max(2, Math.round(b - a) / 2 | 0); return piece(`M ${f1(a)} ${f1(y)} L ${f1(b)} ${f1(y)} L ${f1(b)} ${f1(y + h)} L ${f1(a)} ${f1(y + h)} Z`, o.c || F.rib || F.fill, { rim: false, lines: o.zig ? [{ d: Array.from({ length: n + 1 }, (_, i) => `${i ? 'L' : 'M'} ${f1(a + i * (b - a) / n)} ${f1(y + h / 2 + (i % 2 ? -h / 4 : h / 4))}`).join(' '), c: o.zig, w: .9, o: .95 }] : [] }); }).join(''); },
    /* 腰带（带扣） */
    belt: (g, o, F) => { const y = o.y, h = o.h || 4.4, a = g.half(y) + .8; return piece(`M ${f1(150 - a)} ${f1(y)} Q 150 ${f1(y + 1.8)} ${f1(150 + a)} ${f1(y)} L ${f1(150 + a)} ${f1(y + h)} Q 150 ${f1(y + h + 1.8)} ${f1(150 - a)} ${f1(y + h)} Z`, o.c || '#6A4230', { rim: false }) + (o.buckle === false ? '' : `<rect x="${f1(150 - 3.6)}" y="${f1(y - .4)}" width="7.2" height="${f1(h + 2.6)}" rx="1.2" fill="none" stroke="${INK}" stroke-width="2.2"/><rect x="${f1(150 - 3.6)}" y="${f1(y - .4)}" width="7.2" height="${f1(h + 2.6)}" rx="1.2" fill="none" stroke="${o.bc || '#E2C06A'}" stroke-width="1.2"/>`) + (o.sash ? ribbonBow(150 + a * .55, y + h / 2, .4, o.c, 1) : ''); },
    /* 刺绣小花（对称散布） */
    embroider: (g, o, F) => { const pts = o.pts || [], c = o.c || '#F4F2EC', k = o.kind || 'flower', r = o.r || 1.6; return pts.map(([x, y]) => [[x, y], [300 - x, y]]).flat().map(([x, y], i) => k === 'flower' ? flower(x, y, r, (o.cs || [c])[i % (o.cs || [c]).length]) : k === 'star' ? star5(x, y, r * 1.6, c, .6) : k === 'heart' ? `<path d="${heartD(x, y, r * 1.3)}" fill="${c}" stroke="${INK}" stroke-width=".6"/>` : k === 'leaf' ? `<path d="M ${f1(x - r * 1.6)} ${f1(y)} Q ${f1(x)} ${f1(y - r * 1.6)} ${f1(x + r * 1.6)} ${f1(y)} Q ${f1(x)} ${f1(y + r * 1.6)} ${f1(x - r * 1.6)} ${f1(y)} Z" fill="${c}" stroke="${INK}" stroke-width=".5"/>` : `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * .7)}" fill="${c}" stroke="${INK}" stroke-width=".5"/>`).join(''); },
    /* 藤蔓刺绣：一条弯弯的线 + 叶子 + 小花 */
    vine: (g, o, F) => { const c = o.c || '#F4F2EC', [x0, y0, x1, y1] = o.at; return both(0, m => { const X = x => mx(m, x), d = `M ${f1(X(x0))} ${y0} C ${f1(X(x0 + (x1 - x0) * .3 - 4))} ${f1(y0 + (y1 - y0) * .3)} ${f1(X(x0 + (x1 - x0) * .7 + 4))} ${f1(y0 + (y1 - y0) * .7)} ${f1(X(x1))} ${y1}`; return L(d, c, 1.1, .95) + [.25, .55, .85].map((t, i) => { const x = X(x0 + (x1 - x0) * t), y = y0 + (y1 - y0) * t; return i === 1 ? flower(x, y, 1.6, o.f || c) : `<ellipse cx="${f1(x + (m ? -2 : 2))}" cy="${f1(y)}" rx="2.2" ry="1.1" fill="${o.leaf || c}" stroke="${INK}" stroke-width=".45" transform="rotate(${m ? 30 : -30} ${f1(x)} ${f1(y)})"/>`; }).join(''); }); },
    /* 麻花纹（竖向几道） */
    cables: (g, o, F) => { const y0 = o.y0 ?? g.top + 10, y1 = o.y1 ?? g.hem - 6, c = o.c || F.detail; return (o.xs || [136, 124]).map(x => [x, 300 - x]).flat().map(x => { let d = `M ${x} ${y0}`; for (let y = y0; y < y1; y += 6) d += ` q 2.6 1.5 0 3 q -2.6 1.5 0 3`; return L(d, c, .8, .75) + L(`M ${x - 2.6} ${y0} L ${x - 2.6} ${y1} M ${x + 2.6} ${y0} L ${x + 2.6} ${y1}`, c, .5, .5); }).join(''); },
    /* 抽褶 / 罗纹（横向细波浪线） */
    smock: (g, o, F) => { let s = ''; for (let y = o.y0; y <= o.y1; y += o.gap || 3.4) { const hw = g.half(y) - 1; runs(g, y, 150 - hw, 150 + hw).forEach(([a, b]) => { let d = `M ${f1(a + 1)} ${f1(y)}`; for (let x = a + 1; x < b - 3; x += 3) d += ` q 1.5 1 3 0`; s += L(d, o.c || F.detail, .6, .7); }); } return s; },
    /* 交叉系带（胸前 / 束腰） */
    lacing: (g, o, F) => { const y0 = o.y0, y1 = o.y1, w = o.w || 3.4, n = o.n || 4; let d = ''; for (let i = 0; i < n; i++) { const a = y0 + (y1 - y0) * i / n, b = y0 + (y1 - y0) * (i + 1) / n; d += `M ${150 - w} ${f1(a)} L ${150 + w} ${f1(b)} M ${150 + w} ${f1(a)} L ${150 - w} ${f1(b)} `; } return L(d, INK, 1.9) + L(d, o.c || '#FBFAF4', 1) + Array.from({ length: n + 1 }, (_, i) => `<circle cx="${150 - w}" cy="${f1(y0 + (y1 - y0) * i / n)}" r=".8" fill="#E2C06A"/><circle cx="${150 + w}" cy="${f1(y0 + (y1 - y0) * i / n)}" r=".8" fill="#E2C06A"/>`).join('') + (o.bow ? ribbonBow(150, y0 - 1, .34, o.c || '#FBFAF4', 1) : ''); },
    /* 袖口：荷叶 / 毛边 / 色带（跟着手臂走） */
    cuff: (g, o, F) => { const y = o.y, c = o.c || F.rib || '#FBFAF4', e = o.e ?? 3;
      return both(0, m => { const k = m ? 'R' : 'L', xo = armO(y) - e, xi = armI(y) + e * .8, M = d => (m ? mir(d) : d);
        const s = o.kind === 'frill' ? piece(M(frillD([xo - 1, y - 1], [xi + 1, y], 5, 3, 5)), c, { rim: false }) : o.kind === 'fur' ? piece(M(spline(wavy([[xo - 1.6, y - 5], [xi + 1.4, y - 4], [xi + 1.6, y + 2], [xo - 1.8, y + 2]], 1, 4))), c, {}) : piece(M(`M ${f1(xo)} ${f1(y - (o.h || 5))} L ${f1(xi)} ${f1(y - (o.h || 5) + .6)} L ${f1(xi + .2)} ${f1(y + .6)} L ${f1(xo - .2)} ${f1(y)} Z`), c, { rim: false });
        return `<!--arm${k}-->${s}<!--/arm${k}-->`; }); },
    /* 袖子上的条纹 / 刺绣（跟着手臂走） */
    sleeveMark: (g, o, F) => both(0, m => { const k = m ? 'R' : 'L', M = d => (m ? mir(d) : d); let s = ''; (o.ys || []).forEach(y => { const xo = armO(y) - (o.e ?? 3), xi = armI(y) + (o.e ?? 3) * .8; s += o.kind === 'flower' ? flower(m ? 300 - (xo + xi) / 2 : (xo + xi) / 2, y, 1.6, o.c) : strap(M(`M ${f1(xo + .6)} ${f1(y)} L ${f1(xi - .6)} ${f1(y + .5)}`), o.c, o.w || 1.6); }); return `<!--arm${k}-->${s}<!--/arm${k}-->`; }),
    /* 任意路径（左右对称可选） */
    path: (g, o, F) => { const one = d => o.fill ? piece(d, o.fill, { rim: false }) : L(d, o.c || F.detail, o.w || .9, o.o ?? .9, o.dash); return one(o.d) + (o.sym ? one(mir(o.d)) : ''); }
  };
  const svg = (it, F) => (it.deco || []).map(([k, o]) => { try { return R[k] ? R[k](geo(it.tpl), o || {}, F) : ''; } catch (e) { return ''; } }).join('');
  return { geo, svg };
})();
const _partsOf21 = partsOf;
partsOf = function (it) {
  const L = _partsOf21(it);
  if (it && it.deco && it.tpl && L.length) L[0] = { ...L[0], svg: L[0].svg + DECO.svg(it, resolveFill(it)) };
  return L;
};

/* ---------------- 西部波西米亚 1–3 批 + 冬日甜心 + 田园针织：按参考图逐件补细节 ---------------- */
const DECO_SPEC = {
  /* 西部 · 第一批 */
  t94: [['collar', { kind: 'frill', c: '#FBE8D8' }], ['buttons', { n: 4, y0: 196, y1: 250, c: '#FBF6EE', r: 1.2 }]],
  b84: [['hem', { kind: 'lace', c: '#FBF0E4' }], ['belt', { y: 286, c: '#F29A2A', buckle: false, sash: true }]],
  o44: [['vine', { at: [138, 204, 124, 252], c: '#C8504A', f: '#E8A040', leaf: '#6E9E5A' }], ['hem', { kind: 'fringe', c: '#F4F0E8', len: 10 }], ['pockets', { y: 210, w: 11, h: 8, flap: true, dx: 21 }]],
  t95: [['buttons', { n: 6, y0: 176, y1: 304, c: '#FFFFFF', r: 1.1 }], ['pockets', { y: 200, w: 10, h: 9, dx: 18, flap: true }]],
  b85: [['hem', { kind: 'fringe', c: '#F8F4EA', len: 12 }], ['hem', { kind: 'stitch', y: 318, c: '#C8B89A' }]],
  o45: [['hem', { kind: 'band', h: 5, c: '#C8323A' }], ['collar', { kind: 'lapel', c: '#F4F0E8', trim: '#C8323A' }], ['sleeveMark', { ys: [298], c: '#C8323A', w: 2 }]],
  t96: [['hem', { kind: 'lace', c: '#EEF4FA', r: 1.8 }], ['bow', { y: 200, s: .34, c: '#7A9AC8' }]],
  b86: [['path', { d: 'M 120 304 C 121 380 119 470 114 560', c: '#C8323A', w: .8, dash: '1.6 1', sym: true }], ['belt', { y: 286, c: '#8A5A3A' }]],
  o46: [['hem', { kind: 'scallop', c: '#F4B8C8' }], ['embroider', { kind: 'flower', pts: [[128, 204], [124, 232], [130, 256]], cs: ['#FBF0F4', '#F2D27A'] }]],
  t97: [['hem', { kind: 'lace', c: '#FFFDF8' }], ['lacing', { y0: 206, y1: 240, c: '#FFFDF8', bow: true }]],
  b87: [['hem', { kind: 'ruffle', c: '#F6EEDC', h: 8 }], ['hem', { kind: 'stitch', y: 360, c: '#D8CCB0' }]],
  d29: [['hem', { kind: 'lace', c: '#F2E6C8', r: 2.4 }], ['hem', { kind: 'lace', y: 210, c: '#F4ECD4', r: 1.7 }], ['bow', { y: 207, s: .34, c: '#C8A060' }]],
  o47: [['hem', { kind: 'fringe', c: '#B8946A', len: 10 }], ['buttons', { n: 3, y0: 222, y1: 266, x: 146, c: '#8A6A4A' }], ['pockets', { y: 256, w: 11, h: 8, flap: true }]],
  d30: [['hem', { kind: 'lace', c: '#F4F6FA' }], ['smock', { y0: 206, y1: 216 }], ['bow', { y: 204, s: .34, c: '#F4F6FA' }]],
  o48: [['vine', { at: [138, 200, 124, 262], c: '#E8E0C8', f: '#E86A7A', leaf: '#7AB86A' }], ['hem', { kind: 'stitch', c: '#F0B24A' }]],
  t98: [['collar', { kind: 'frill', c: '#F4E2CC' }], ['buttons', { n: 5, y0: 180, y1: 290, c: '#FBF6EE', r: 1.1 }]],
  b88: [['belt', { y: 286, c: '#6A4230', bc: '#C8C8D0' }]],
  t99: [['collar', { kind: 'frill', c: '#FFFDF8' }], ['buttons', { n: 5, y0: 176, y1: 260, c: '#F4F0E8', r: 1 }]],
  b89: [['belt', { y: 286, c: '#C89A5A', bc: '#E8E0C8' }]],
  o49: [['vine', { at: [136, 192, 126, 244], c: '#F4F0E8', f: '#E8A0B8' }], ['collar', { kind: 'lapel', c: '#C8DCEC' }]],
  b90: [['hem', { kind: 'scallop', c: '#FFFDF8' }], ['embroider', { kind: 'flower', pts: [[132, 330], [126, 378], [136, 410]], cs: ['#FFFDF8'] }]],
  o50: [['buttons', { n: 4, y0: 204, y1: 282, c: '#E2C06A', dx: 8, r: 1.8 }], ['pockets', { y: 212, w: 12, h: 9, flap: true, btnC: '#E2C06A' }], ['collar', { kind: 'lapel', trim: '#E2C06A' }]],
  b91: [['belt', { y: 286, c: '#F4F0E8', bc: '#C8C8D0' }]],
  /* 西部 · 第二批 */
  o51: [['collar', { kind: 'frill', c: '#F8D8E0' }], ['buttons', { n: 4, y0: 204, y1: 286, c: '#C8506A', r: 1.6 }], ['hem', { kind: 'ruffle', c: 'url(#pat-plaidPinkIvory)', h: 5 }]],
  t100: [['hem', { kind: 'lace', c: '#FFFDF8' }], ['bow', { y: 198, c: '#F4C6D2', s: .34 }], ['smock', { y0: 200, y1: 210 }]],
  b92: [['hem', { kind: 'beads', cs: ['#F2D27A', '#E86A7A', '#7AB8DA'], r: 1.2 }]],
  o52: [['collar', { kind: 'peter', c: '#F4EADB', trim: '#C8607A' }]],
  b93: [['hem', { kind: 'lace', c: '#FFFDF8', r: 2.6 }], ['hem', { kind: 'lace', y: 380, c: '#FFFDF8', r: 1.8 }]],
  t101: [['collar', { kind: 'frill', c: '#E2F2EA' }], ['buttons', { n: 4, y0: 210, y1: 270, c: '#FFFDF8', r: 1 }]],
  b94: [['hem', { kind: 'lace', c: '#F4FAF6' }], ['belt', { y: 286, c: '#9CB88A', buckle: false, sash: true }]],
  t102: [['lacing', { y0: 180, y1: 226, c: '#FFFDF8', bow: true }], ['hem', { kind: 'ruffle', c: '#FFFDF8', h: 5 }]],
  b95: [['hem', { kind: 'scallop', c: '#F4F2EA' }]],
  t103: [['buttons', { n: 5, y0: 174, y1: 260, c: '#C8A060', r: 1.2 }], ['collar', { kind: 'peter', c: '#FFFAE8' }]],
  b96: [['vine', { at: [140, 300, 124, 400], c: '#C88A5A', f: '#E86A7A', leaf: '#8AA86A' }], ['band', { y: 287, h: 4, c: '#5A3A2A' }]],
  t104: [['collar', { kind: 'frill', c: '#FFFDF8' }], ['buttons', { n: 5, y0: 176, y1: 300, c: '#F4F0E8', r: 1.1 }], ['embroider', { kind: 'dot', pts: [[132, 220], [128, 250], [134, 280]], c: '#E8E2D4' }]],
  b97: [['belt', { y: 286, c: '#8A5A3A' }]],
  d31: [['collar', { kind: 'peter', c: '#F4F0E8' }], ['buttons', { n: 3, y0: 180, y1: 216, c: '#F4F0E8', r: 1.1 }]],
  o53: [['hem', { kind: 'fringe', c: '#E8D8A8', len: 12 }], ['collar', { kind: 'lapel', c: '#F0E2B8' }]],
  d32: [['hem', { kind: 'lace', c: '#FFFDF8' }], ['buttons', { n: 1, y0: 216, dx: 14, c: '#FFFDF8', r: 1.7 }]],
  d33: [['bow', { y: 204, s: .5, c: '#8A7AA0' }], ['hem', { kind: 'ruffle', c: 'url(#pat-plaidGreyLilac)', h: 7 }]],
  /* 西部 · 第三批 */
  o54: [['hem', { kind: 'fringe', y: 262, c: '#4A3430', len: 12 }]],
  t105: [['lacing', { y0: 206, y1: 250, c: '#F4ECD8' }], ['hem', { kind: 'stitch', c: '#F0B24A' }]],
  b98: [['belt', { y: 286, c: '#3A2A22', bc: '#C8C8D0' }]],
  o55: [['hem', { kind: 'beads', cs: ['#2A3A4A', '#C8B070', '#E8E0C8'], r: 1.2 }], ['buttons', { n: 4, x: 146, y0: 192, y1: 290, c: '#2A3A4A' }]],
  b99: [['hem', { kind: 'ruffle', c: 'url(#pat-bluedrops)', h: 4.4 }]],
  t106: [['bow', { y: 197, s: .4, c: '#E8A8B0' }]],
  b100: [['hem', { kind: 'beads', cs: ['#C8B070', '#E8A8B0', '#7AA6C8'], r: 1 }]],
  d34: [['hem', { kind: 'lace', c: '#FBFAF4' }], ['pockets', { y: 302, w: 14, h: 12 }]],
  t107: [['collar', { kind: 'frill', c: '#FFFDF8' }], ['bow', { y: 172, s: .38, c: '#E8D8B0' }]],
  b101: [['belt', { y: 286, c: '#5A3A2A', bc: '#E2C06A' }]],
  o56: [['buttons', { n: 4, dx: 8, y0: 204, y1: 290, c: '#E2C06A', r: 1.8 }], ['collar', { kind: 'lapel', trim: '#E2C06A', c: '#A8A486' }], ['hem', { kind: 'stitch', c: '#E2C06A' }], ['sleeveMark', { ys: [298, 303], c: '#E2C06A', w: 1.1 }]],
  t108: [['lacing', { y0: 202, y1: 236, c: '#F6F2E8', bow: true }]],
  o57: [['hem', { kind: 'scallop', c: '#F8F6F0' }], ['ties', { y: 180, c: '#F4F0E8' }]],
  d35: [['hem', { kind: 'lace', c: '#FFFDF8', r: 2.4 }], ['collar', { kind: 'frill', c: '#FFFDF8' }], ['belt', { y: 250, c: '#C89A5A' }]],
  o58: [['hem', { kind: 'ruffle', c: '#F4ECC6', h: 5 }], ['collar', { kind: 'frill', c: '#F4ECC6' }]],
  b102: [['hem', { kind: 'lace', c: '#FFFDF8', r: 1.8 }], ['smock', { y0: 290, y1: 300, c: '#D8D2C4' }]],
  o59: [['collar', { kind: 'lapel', c: '#C8B08A' }], ['pockets', { y: 278, w: 16, h: 10, flap: true, dx: 24 }]],
  b103: [['belt', { y: 286, c: '#3A2A22', bc: '#C8C8D0' }]],
  t109: [['collar', { kind: 'frill', c: '#DCEEE6' }], ['bow', { y: 178, s: .38, c: '#C8A050' }], ['buttons', { n: 4, y0: 192, y1: 262, c: '#FBFAF4', r: 1.1 }]],
  b104: [['belt', { y: 286, c: '#8A6A4A', buckle: false, sash: true }]],
  /* 西部 · 第四批 + 冬日甜心 */
  t110: [['buttons', { n: 5, c: '#EEF0F2', r: 1.2, y0: 206, y1: 264 }], ['hem', { kind: 'ruffle', c: 'url(#pat-greyditsy)', h: 5 }]],
  b105: [['hem', { kind: 'lace', c: '#F4ECCE' }]],
  o60: [['embroider', { kind: 'dot', pts: [[140, 172], [136, 181], [133, 191], [131, 201]], c: '#F4E6C8', r: 1.5 }], ['belt', { y: 258, c: '#7A4A30', buckle: false, sash: true }], ['smock', { y0: 212, y1: 250, gap: 6, c: '#6EAA98' }]],
  b106: [['hem', { kind: 'ruffle', c: '#BFE0D0', h: 8 }]],
  t111: [['hem', { kind: 'band', h: 4, c: '#6A80A8' }]],
  b107: [['belt', { y: 286, c: '#4A3A30', bc: '#E2C06A' }], ['hem', { kind: 'stitch', c: '#C8B8A4' }]],
  t112: [['cuff', { y: 296, h: 7, c: '#A8C4E0' }]],
  b108: [['band', { y: 286, h: 7, c: '#3A2418' }], ['embroider', { kind: 'flower', pts: [[130, 289.6], [140, 290.4]], cs: ['#C89A6A'], r: 1.1 }]],
  o61: [['ties', { y: 184, c: '#FBFAF4' }], ['hem', { kind: 'band', h: 5, c: '#C8DCEC' }]],
  d36: [['hem', { kind: 'ruffle', c: 'url(#pat-greyditsy)', h: 7 }], ['hem', { kind: 'ruffle', y: 318, c: 'url(#pat-greyditsy)', h: 5 }]],
  d37: [['hem', { kind: 'lace', c: '#E4ECF4', r: 2 }], ['bow', { y: 200, s: .4, c: '#8A9CB8' }]],
  /* 田园针织 */
  o62: [['band', { y: 274, h: 9, c: '#2A3A52', zig: '#E8E2D2' }]],
  t113: [['cuff', { y: 312, h: 7, c: '#2E6E9A' }]],
  b109: [['belt', { y: 286, c: '#5A3A22', bc: '#C8C8D0' }], ['pockets', { y: 360, w: 13, h: 13, dx: 30, flap: true, c: '#6E7A3A' }]],
  o63: [['cables', { xs: [132, 140], y0: 200, y1: 300, c: '#6A54A0' }], ['buttons', { n: 5, x: 146, y0: 192, y1: 300, c: '#E8DCF4' }], ['pockets', { y: 282, w: 13, h: 11 }]],
  b110: [['belt', { y: 286, c: '#5A3A22' }]],
  t115: [['pockets', { y: 262, w: 13, h: 12, c: '#A06A98' }], ['smock', { y0: 200, y1: 288, gap: 4.4, c: '#8A5A88' }]],
  b111: [['pockets', { y: 300, w: 13, h: 13, dx: 22 }]],
  o64: [['cables', { xs: [134, 140], y0: 190, y1: 258, c: '#8AA4BC' }], ['embroider', { kind: 'flower', pts: [[127, 250]], cs: ['#E8A0B8'], r: 1.8 }]],
  b112: [['belt', { y: 286, c: '#3A2A22' }]],
  o65: [['hem', { kind: 'band', h: 6, c: '#5A3A88' }]],
  t117: [['cuff', { y: 312, h: 6, c: '#3A7AB8' }]],
  b113: [['belt', { y: 286, c: '#2A2528' }]],
  o66: [['pockets', { y: 262, w: 12, h: 9, flap: true, c: '#8A6AA0' }]],
  t119: [['path', { d: 'M 126 268 L 174 268 L 180 296 L 120 296 Z', fill: '#2A7AA0' }], ['path', { d: 'M 128 270 L 122 294 M 172 270 L 178 294', c: '#1E5A7A', w: .8 }]],
  o67: [['ties', { y: 208, c: '#6A3E24', s: .6 }], ['hem', { kind: 'band', h: 5, c: '#B08858' }]],
  t120: [['cables', { xs: [132, 141], y0: 182, y1: 300, c: '#8A3A22' }], ['collar', { kind: 'lapel', c: '#B8502E', yb: 214 }]]
};
WARDROBE.forEach(it => { if (DECO_SPEC[it.id]) it.deco = DECO_SPEC[it.id]; });
