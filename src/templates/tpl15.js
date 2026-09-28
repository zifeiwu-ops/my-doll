/* =====================================================================
   新版型 · 糖果装饰风（kidcore / decora）
   抹胸蝴蝶结、挂脖短上衣、方领泡泡袖短上衣、短款卫衣、宽松牛仔外套、荷叶边短裙、破洞阔腿牛仔裤、背带裙
   ===================================================================== */
/* 衣服上的印花（没有黑描边，像印上去的软软的图案） */
function printMotif(kind, x, y, s = 1) {
  const g = b => `<g transform="translate(${x} ${y}) scale(${s})" opacity=".94">${b}</g>`;
  if (kind === 'heart') return g(`<path d="${heartD(0, 0, 8)}" fill="#F48FB1" stroke="#E0668F" stroke-width=".6"/><path d="M -5 -2.4 Q -4.4 -5.2 -1.8 -5.4" fill="none" stroke="#FFFFFF" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>`);
  if (kind === 'star') { let p = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 3.6 : 8; p += `${i ? 'L' : 'M'} ${f1(Math.cos(a) * r)} ${f1(Math.sin(a) * r)} `; } return g(`<path d="${p}Z" fill="#FFE27A" stroke="#E0B842" stroke-width=".6" stroke-linejoin="round"/>`); }
  if (kind === 'cherry') return g(`<path d="M -3.6 2 C -2.6 -4 1 -8 5.4 -9 M 3.4 3 C 3.4 -2 4 -6 5.4 -9" fill="none" stroke="#6FAE5A" stroke-width="1.1" stroke-linecap="round"/><circle cx="-4" cy="4" r="4" fill="#E8454F"/><circle cx="4" cy="5" r="4" fill="#E8454F"/><circle cx="-5.2" cy="2.8" r="1" fill="#FFFFFF" opacity=".8"/>`);
  if (kind === 'flower') { let p = ''; for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5 - Math.PI / 2; p += `<circle cx="${f1(Math.cos(a) * 4.6)}" cy="${f1(Math.sin(a) * 4.6)}" r="3.6" fill="#F7A8C4"/>`; } return g(p + `<circle r="2.6" fill="#FFE27A"/>`); }
  if (kind === 'smile') return g(`<circle r="7.6" fill="#FFE27A" stroke="#E0B842" stroke-width=".6"/><circle cx="-2.6" cy="-1.8" r=".95" fill="#6A4A2E"/><circle cx="2.6" cy="-1.8" r=".95" fill="#6A4A2E"/><path d="M -3.6 1.6 Q 0 5 3.6 1.6" fill="none" stroke="#6A4A2E" stroke-width=".9" stroke-linecap="round"/>`);
  return '';
}
/* 缝了线的布贴（牛仔外套上的补丁） */
const patchSVG = (x, y, kind, c) => {
  const d = kind === 'heart' ? heartD(x, y, 6.4) : `M ${x - 6} ${y - 5} L ${x + 6} ${y - 6} L ${x + 6.6} ${y + 5} L ${x - 5.4} ${y + 6} Z`;
  return `<path d="${d}" fill="${c}" stroke="${STYLE.line}" stroke-width=".7"/><path d="${d}" fill="none" stroke="#FFFFFF" stroke-width=".55" stroke-dasharray="1.2 1" transform="translate(${x} ${y}) scale(.8) translate(${-x} ${-y})"/>`;
};

Object.assign(TPL, {
  /* ---------------- 上衣 ---------------- */
  bandeauBow: {
    cat: 'top', name: '蝴蝶结抹胸', thumb: '98 184 104 76',
    render(F) {
      const topL = [[150, 204], [142, 200], [133, 197.6], [125.6, 198], [122.6, 200.8]];
      const d = symS([...topL.slice(0, 4), [122.6, 200.8, 'c'], [sideX(222) - 1.2, 216], [sideX(230) - 1.6, 230], [sideX(240) - 1.9, 240, 'c'], [150, 242.4]]);
      const g = [[150, 212, 131, 201, 1.4, 2.4, .1, .45], [150, 214, 125, 222, -1, 2.4, .1, .45], [150, 216, 132, 238, .6, 2.2, .1, .45]];
      return piece(d, F.fill, { autoFolds: false, over: drapeSVG(fm2(g), { op: .55, lo: .38 }), lines: [{ d: 'M 124.6 202.6 Q 136 199.6 147 204.4 M 175.4 202.6 Q 164 199.6 153 204.4', c: '#FFFFFF', w: 1.2, o: .6 }] }) +
        ribbonBow(150, 212, .62, F.alt === F.fill ? F.base : F.alt, 1);
    }
  },
  halterCrop: {
    cat: 'top', name: '挂脖短上衣', thumb: '96 150 108 100',
    render(F) {
      const d = symS([[150, 206], [147, 192], [145, 176], [144.2, 164.6, 'c'], [140.6, 166], [136.4, 182], [128, 198], [sideX(222) - 1.4, 215], [sideX(230) - 1.8, 230], [sideX(242) - 2.2, 242, 'c'], [150, 244]]);
      const hem = hemBandD(244, 6, 2.2, 1.4);
      const tie = 'M 144.8 162 C 141 158.6 138 158 135.6 160';
      const g = [[134, 206, 132, 240, 1, 2.6, .3], [143, 214, 144, 240, -.6, 2, .3]];
      return strap(tie, F.fill, 1.3) + strap(mir(tie), F.fill, 1.3) + `<ellipse cx="150" cy="162" rx="3.2" ry="2.2" fill="${F.fill}" stroke="${STYLE.line}" stroke-width=".7"/>` +
        piece(d, F.fill, { autoFolds: false, over: drapeSVG(fm2(g), { op: .5, lo: .35 }) + (F.print ? printMotif(F.print, 150, 224, 1.05) : '') }) + piece(hem, F.rib || F.fill, {});
    }
  },
  puffCrop: {
    cat: 'top', name: '方领泡泡袖短上衣', thumb: '84 160 132 110',
    render(F) {
      const body = bodyD({ hem: 246, e: 2, hemE: 2.4, neckY: 198, neckW: 15, neckX: 129, se: 2, curve: 1.2 });
      const P = puffShort(7.2);
      const hemG = gatherD(112, 188, 240.6, 20, 3.4, 1.2);
      const sleeve = m => { const M = m ? mir : x => x;
        return piece(M(P.d), F.fill, { over: glowSVG(m ? P.glow.map(mir) : P.glow, .45, 3) }) +
          piece(M(P.band), F.rib || F.fill, { rim: false }); };
      return piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[134, 204, 132, 240, 1, 2.4, .3]]), { op: .5, lo: .35 }) + (F.print ? printMotif(F.print, 150, 224, 1) : ''), lines: [{ d: hemG, o: .35, w: .5 }] }) +
        sleeve(false) + sleeve(true) + ribbonBow(150, 199.4, .5, F.alt === F.fill ? '#E8454F' : F.alt, 1);
    }
  },
  cropSweat: {
    cat: 'top', name: '短款卫衣', thumb: '72 146 156 170',
    render(F) {
      const y1 = 312, sl = sleeveD({ y1, puff: 4.4, eo: 3.4, ei: 3, se: 3.4 }), cf = cuffD(y1, 9, 3.4, 3);
      const body = bodyD({ hem: 248, e: 4.2, hemE: 5.4, neckY: 170, neckW: 7, se: 3.2, curve: 1.4 });
      const band = symS([[150, 247.4], [sideX(246) - 3.4, 245.6, 'c'], [sideX(256) - 2.2, 255.4, 'c'], [150, 257.8]]);
      const neck = spline([[137.2, 162.6, 'c'], [150, 168.4], [162.8, 162.6, 'c'], [163.8, 167, 'c'], [150, 174], [136.2, 167, 'c']]);
      const rc = F.rib || F.fill, sF = [[110, 200, 98, 300, -2.4, 3.2, .3], [116, 232, 106, 304, 1, 2.4, .35]];
      const sleeve = m => { const M = m ? mir : x => x; return piece(M(sl), F.fill, { autoFolds: false, over: drapeSVG(m ? sF.map(mf) : sF, { op: .6, lo: .4 }) }) + piece(M(cf), rc, { lines: [{ d: M(ribLines(armO(304) - 3.4, armI(304) + 3, 303, 312.6, 2.4, -.5)), o: .35, w: .55 }] }); };
      return piece(body, F.fill, { autoFolds: false, over: drapeSVG(fm2([[126, 214, 124, 244, 1.4, 3, .3]]), { op: .5, lo: .35 }) + (F.print ? printMotif(F.print, 150, 214, 1.35) : '') }) +
        piece(band, rc, { lines: [{ d: ribLines(106, 194, 246, 257, 2.6), o: .35, w: .55 }] }) + sleeve(false) + sleeve(true) + piece(neck, rc, { rim: false });
    }
  },

  /* ---------------- 外套 ---------------- */
  denimJacket: {
    cat: 'outer', name: '宽松牛仔外套', thumb: '66 140 168 190',
    render(F) {
      const y1 = 314, sl = sleeveD({ y1, puff: 3.4, eo: 3.8, ei: 3.4, se: 3.6 }), cf = cuffD(y1, 9, 3.8, 3.4);
      const panel = openPanel(270, 5.6, 6);
      const band = spline([[sideX(262) - 6, 262, 'c'], [144.4, 264.4, 'c'], [144.4, 272.6, 'c'], [sideX(270) - 6.4, 270.4, 'c']]);
      const collar = spline([[141.8, 162.6], [134, 165.4], [124.4, 170.6], [118.4, 179], [123.6, 185.6], [133.4, 191.4], [142.4, 197.6, 'c'], [142.8, 184], [142.4, 172]]);
      const flap = spline([[117.6, 204, 'c'], [136, 203.4, 'c'], [135.6, 211], [127, 214.6, 'c'], [118.4, 211.6]]);
      const st = F.stitch, pF = [[118, 214, 114, 262, 1.6, 3.2, .3], [130, 224, 130, 262, -1, 2.6, .35]], sF = [[110, 200, 98, 304, -2.4, 3.4, .3], [116, 232, 106, 306, 1.4, 2.6, .35]];
      const sleeve = m => { const M = m ? mir : x => x; return piece(M(sl), F.fill, { autoFolds: false, over: drapeSVG(m ? sF.map(mf) : sF, { op: .6, lo: .4 }) }) + piece(M(cf), F.fill, { lines: [{ d: M(`M ${f1(armO(307) - 3.4)} 306.6 L ${f1(armI(307) + 3)} 307.4`), c: st, dash: '1.6 1.2', o: .9, w: 1.1 }] }); };
      const side = m => { const M = m ? mir : x => x;
        return piece(M(panel), F.fill, { autoFolds: false, over: drapeSVG(m ? pF.map(mf) : pF, { op: .55, lo: .4 }), lines: [{ d: M('M 110 196 Q 126 200 142 198.6'), c: st, dash: '1.6 1.2', o: .9, w: 1.1 }, { d: M('M 141.6 200 L 141.6 262'), c: st, dash: '1.6 1.2', o: .9, w: 1.1 }] }) +
          piece(M(band), F.fill, { lines: [{ d: M(`M ${f1(sideX(266) - 6)} 266.4 L 144 268`), c: st, dash: '1.6 1.2', o: .9, w: 1.1 }] }) +
          piece(M(flap), F.fill, { lines: [{ d: M('M 119 206.4 L 135 206'), c: st, dash: '1.4 1.1', o: .9, w: 1 }] }) + btn(m ? 300 - 127 : 127, 211.6, '#D9B45A', 1.3); };
      const col = m => { const M = m ? mir : x => x; return piece(M(collar), F.fill, { lines: [{ d: M('M 139.6 167 C 132 169 124.6 173.6 121.6 179.6'), c: st, dash: '1.4 1.1', o: .9, w: 1 }] }); };
      const patches = F.print === 'patch' ? patchSVG(170, 236, 'heart', '#F7A8C4') + patchSVG(124, 246, 'sq', '#FFE27A') + `<g transform="translate(124 246)">${printMotif('star', 0, 0, .42)}</g>` : '';
      return side(false) + side(true) + [226, 244].map(y => btn(141.4, y, '#D9B45A', 1.4)).join('') + patches + sleeve(false) + sleeve(true) + col(false) + col(true);
    }
  },

  /* ---------------- 下装 ---------------- */
  ruffleMini: {
    cat: 'bottom', name: '荷叶边短裙', thumb: '80 272 140 90',
    render(F) {
      const sk = skirtD({ top: 283, dip: 3.4, e: 2.8, hem: 328, flare: 12, hipY: 300, curve: 3 });
      const xh = outerX(300) - 2.8 - 12;
      const R = flowSkirt({ top: 324, hem: 346, dip: 3, xw: xh + 1.4, xh: xh - 9, bulge: 0, n: 11, amp: 2.2, seed: 151, curve: 3.6, sideN: 3, fw: 1.4 });
      const wb = bandD(283, 6.6, 3.4, 2.8, 2.9);
      return piece(R.d, F.alt, { autoFolds: false, over: drapeSVG(R.folds, { op: .6, lo: .45 }), lines: [{ d: gatherD(xh + 2, 300 - xh - 2, 326.4, 18, 3, 3), o: .4, w: .45 }] }) +
        piece(sk, F.fill, { autoFolds: false, over: drapeSVG(fm2([[128, 296, 124, 326, 1, 2.8, .3], [142, 300, 141, 328, -.6, 2.2, .3]]), { op: .5, lo: .4 }) + (F.print ? printMotif(F.print, 126, 312, .6) : '') }) +
        piece(wb, F.rib || F.fill, {});
    }
  },
  baggyJeans: {
    cat: 'bottom', name: '破洞阔腿牛仔裤', thumb: '72 272 156 310',
    render(F) {
      const ease = y => 5 + Math.max(0, y - 300) * .02 + Math.pow(Math.max(0, y - 380) / 190, 1.2) * 9, inE = y => 3.6 + Math.pow(Math.max(0, y - 380) / 190, 1.2) * 6;
      const d = pantsD({ top: 286, hem: 578, ease, inE });
      const wb = bandD(286, 7, 4, 5, 5.1);
      const rip = (cx, cy, w) => { const r = RNG(Math.round(cx * 3 + cy)), pts = []; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2, rr = (i % 2 ? .78 : 1) * (1 + (r() - .5) * .2); pts.push([cx + Math.cos(a) * w * rr, cy + Math.sin(a) * w * .38 * rr, 'c']); }
        const th = [-.5, 0, .5].map(k => `M ${f1(cx - w * .9)} ${f1(cy + k * w * .3)} Q ${f1(cx)} ${f1(cy + k * w * .3 + 1.2)} ${f1(cx + w * .9)} ${f1(cy + k * w * .3)}`).join(' ');
        return `<path d="${spline(pts)}" fill="${SKIN}" stroke="${STYLE.line}" stroke-width=".6"/><path d="${th}" fill="none" stroke="#F4F6FA" stroke-width="1.1" stroke-linecap="round"/>`; };
      const lx = (legO(430) + legI(430)) / 2 - 2;
      const stack = [520, 540, 556].flatMap(y => fm(`M ${f1(outerX(y) - ease(y) + 3)} ${y} Q 126 ${y + 4} ${f1(legI(y) + inE(y) - 2)} ${y - 1}`));
      return piece(d, F.fill, { autoFolds: false, over: drapeSVG(fm2([[120, 330, 112, 510, 2, 3.4, .35], [138, 340, 140, 520, -1.4, 2.6, .4]]), { op: .55, lo: .4 }) + rip(lx, 432, 7) + rip(300 - lx - 2, 452, 6.4), folds: stack, foldOp: .35,
        lines: [{ d: FLY, c: F.stitch, dash: '1.8 1.4', o: .9 }, { d: POCKET, c: F.stitch, dash: '1.6 1.2', o: .9 }, { d: mir(POCKET), c: F.stitch, dash: '1.6 1.2', o: .9 }] }) +
        piece(wb, F.fill, { lines: [{ d: 'M 114 289.6 Q 150 295.6 186 289.6', c: F.stitch, dash: '1.8 1.4', o: .9 }, { d: 'M 124 287 L 124 294 M 176 287 L 176 294', o: .6 }] });
    }
  },

  /* ---------------- 连衣裙 ---------------- */
  pinafore: {
    cat: 'dress', name: '荷叶边背带裙', thumb: '72 164 156 210', z: 32, keepTop: true,
    render(F) {
      const bib = spline([[133.4, 207, 'c'], [166.6, 207, 'c'], [168.6, 244], [131.4, 244]]);
      const sk = flowSkirt({ top: 242, hem: 350, dip: 1.6, xw: sideX(246) - 2.4, flare: 20, bulge: 1.6, n: 8, amp: 2.4, seed: 160, curve: 3, fw: 2 });
      const R = flowSkirt({ top: 346, hem: 364, dip: 2.4, xw: sk.xh + 1.6, xh: sk.xh - 8, bulge: 0, n: 13, amp: 2.2, seed: 161, curve: 3.4, sideN: 3, fw: 1.4 });
      const st = 'M 134.4 208 C 132.6 196 130.6 182 129.4 170.6';
      const pk = spline([[141, 218, 'c'], [159, 218, 'c'], [158.6, 232], [150, 236, 'c'], [141.4, 232]]);
      return piece(R.d, F.alt, { autoFolds: false, over: drapeSVG(R.folds, { op: .6, lo: .45 }), lines: [{ d: gatherD(sk.xh + 2, 300 - sk.xh - 2, 348.4, 20, 3, 3), o: .4, w: .45 }] }) +
        piece(sk.d, F.fill, { autoFolds: false, over: drapeSVG(sk.folds, { op: .55, lo: .4 }) + (F.print ? printMotif(F.print, 122, 320, .55) : '') }) +
        strap(st, F.fill, 3) + strap(mir(st), F.fill, 3) + piece(bib, F.fill, { lines: [{ d: 'M 135 210 L 165 210', o: .4, w: .8 }] }) + piece(pk, F.rib || F.fill, { rim: false }) +
        (F.print ? printMotif(F.print, 150, 227, .4) : '') + btn(134.6, 211, '#FFFFFF', 1.9) + btn(165.4, 211, '#FFFFFF', 1.9);
    }
  }
});
