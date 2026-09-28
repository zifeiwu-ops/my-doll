/* ---------- 新袜子 / 鞋 / 小物 · 甜酷街头 ---------- */
/* 长筒袜：top = 袜口高度（过膝约 390，及膝约 440）；o.band 袜口、o.frill 荷叶边、o.bow 蝴蝶结、o.garter 吊带、o.bands 袜口两道条纹 */
function stocking(id, name, fill, o = {}) {
  const top = o.top ?? 392, fillR = o.fillR || fill;
  return {
    id, cat: 'legs', name, thumb: `98 ${top - 20} 104 ${600 - top + 20}`, isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m), d = legWrapD(top, o.e ?? 1.4, [[128, top - 2.6]]);
        let s = piece(M(d), m ? fillR : fill, { rim: [3, 1.8], folds: [M(`M ${f1(legO(top + 40) + 2)} ${top + 40} Q 128 ${top + 43} ${f1(legI(top + 40) - 2)} ${top + 40}`)], foldOp: .3 });
        if (o.band) s += piece(M(spline([[legO(top) - 1.8, top, 'c'], [128, top - 3], [legI(top) + 1.8, top - .6, 'c'], [legI(top + 7) + 1.8, top + 6.6, 'c'], [128, top + 4], [legO(top + 7) - 1.8, top + 7.4, 'c']])), o.band, { rim: false });
        if (o.bands) [12, 18].forEach(k => { s += `<path d="${M(`M ${f1(legO(top + k) - 1.2)} ${top + k} Q 128 ${top + k + 2.6} ${f1(legI(top + k) + 1.2)} ${top + k - .4}`)}" fill="none" stroke="${o.bands}" stroke-width="2.6"/>`; });
        if (o.frill) { const a = [legO(top) - 2, top - .6], b = [legI(top) + 2, top - .2], fr = frillD(a, b, -5.4, 5, 7); s = s + piece(M(fr), o.frill, { rim: false }); }
        if (o.bow) s += ribbonBow(X(legO(top) + 5), top + 2, .42, o.bow, 1);
        if (o.garter) s += `<path d="${M(`M ${f1(legO(top) + 5)} ${top} L ${f1(legO(300) + 6)} 300 M ${f1(legI(top) - 4)} ${top} L ${f1(legI(320) - 6)} 318`)}" stroke="${STYLE.line}" stroke-width="2.4" stroke-linecap="round"/><path d="${M(`M ${f1(legO(top) + 5)} ${top} L ${f1(legO(300) + 6)} 300 M ${f1(legI(top) - 4)} ${top} L ${f1(legI(320) - 6)} 318`)}" stroke="${o.garter}" stroke-width="1.2" stroke-linecap="round"/>` +
          `<rect x="${f1(X(legO(top) + 5) - 1.8)}" y="${top - 3}" width="3.6" height="3" rx=".6" fill="#C9CDD6" stroke="${STYLE.line}" stroke-width=".4"/>`;
        return s;
      };
      return [{ z: 15, svg: both(one) }];
    }
  };
}
/* 靴子：top 靴口高度，lace 系带颜色（null 不系带），o.slouch 堆堆褶，o.heel 带跟，o.star 星星贴 */
function bootItem(id, name, c, top, lace, o = {}) {
  return {
    id, cat: 'shoes', name, thumb: `94 ${top - 12} 112 ${604 - top + 12}`, isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m), sole = o.sole || mix(c, '#1A1418', .35);
        let s = piece(M(shoeUpperD(top, o.e ?? 4, o.dipTop ?? 2)), c, { rim: [3, 1.6], sheen: [M(`M 121 ${top + 12} C 120 ${lerp(top, 566, .5)} 121 540 124 566`)], sheenOp: .22, sheenW: 2.4,
          folds: o.slouch ? rng(top + 14, 548, Math.max(2, Math.round((548 - top) / 16))).map(y => M(`M ${f1(legO(y) - 3)} ${y} Q 128 ${y + 4} ${f1(legI(y) + 3)} ${y - 1.2}`)) : [], foldOp: .45 });
        if (o.cuff) s += piece(M(spline([[legO(top) - 4.8, top - 1, 'c'], [130.6, top - 3.4], [legI(top) + 4.8, top - 1, 'c'], [legI(top + 9) + 4.8, top + 9, 'c'], [130.6, top + 7], [legO(top + 9) - 4.8, top + 9, 'c']])), o.cuff, { rim: false });
        if (lace) { const x0 = X((legO(top + 20) + legI(top + 20)) / 2 - 5), x1 = X((legO(top + 20) + legI(top + 20)) / 2 + 5); s += crossLace(Math.min(x0, x1), Math.max(x0, x1), top + 10, 562, Math.max(3, Math.round((552 - top) / 10)), lace); }
        if (o.star) s += `<path d="M ${X(126)} ${top + 36} L ${X(128.4)} ${top + 42} L ${X(134.6)} ${top + 42.4} L ${X(129.6)} ${top + 46.2} L ${X(131.4)} ${top + 52.4} L ${X(126)} ${top + 48.6} L ${X(120.6)} ${top + 52.4} L ${X(122.4)} ${top + 46.2} L ${X(117.4)} ${top + 42.4} L ${X(123.6)} ${top + 42} Z" fill="${o.star}" stroke="${STYLE.line}" stroke-width=".6"/>`;
        if (o.buckles) o.buckles.forEach(y => { s += piece(M(`M ${f1(legO(y) - 4.4)} ${y} Q 130 ${y + 3} ${f1(legI(y) + 4.4)} ${y - .4} L ${f1(legI(y + 5) + 4.4)} ${y + 4.6} Q 130 ${y + 8} ${f1(legO(y + 5) - 4.4)} ${y + 5} Z`), mix(c, '#000', .25), { rim: false }) + `<rect x="${f1(m ? 300 - legI(y) - 6 : legI(y) + 1)}" y="${y - 1.4}" width="5" height="6.6" rx="1" fill="none" stroke="#D6DAE2" stroke-width="1.3"/>`; });
        s += piece(M(soleD(577, o.soleH ?? 13, 5)), sole, { rim: false, lines: o.heel ? [{ d: M('M 118 590 L 124 590'), c: '#fff', w: .8, o: .4 }] : [] });
        return s;
      };
      return [{ z: 40, svg: both(one) }];
    }
  };
}
/* 玛丽珍 / 平底鞋 */
function maryJane(id, name, c, strapC, o = {}) {
  return {
    id, cat: 'shoes', name, thumb: '100 524 100 80', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        const strapD = spline([[legO(552) - 3, 552, 'c'], [130, 556.6], [legI(552) + 3, 551.6, 'c'], [legI(557) + 3.1, 556.8, 'c'], [130, 561.6], [legO(557) - 3.1, 557.2, 'c']]);
        return piece(M(shoeUpperD(548, 2.8, 6)), c, { over: `<path d="${M(liningD(548, 2.8, 6))}" fill="#F2E4DE" stroke="${STYLE.line}" stroke-width=".7"/>`, gloss: [M('M 121 572 Q 123 566 128 564')], glossOp: .55 }) +
          piece(M(strapD), strapC || c, {}) + `<circle cx="${f1(X(139.6))}" cy="557" r="1.4" fill="#fff" stroke="${STYLE.line}" stroke-width=".5"/>` + piece(M(soleD(580, o.soleH ?? 8, 3.6)), o.sole || mix(c, '#1A1418', .35), {});
      };
      return [{ z: 40, svg: both(one) }];
    }
  };
}
/* 帆布高帮鞋 */
function highTop(id, name, c) {
  return {
    id, cat: 'shoes', name, thumb: '100 510 100 94', isNew: true,
    parts() {
      const one = m => {
        const M = M_(m), X = X_(m);
        const toe = spline([[118, 568], [132, 565], [147, 568], [148, 578], [132, 584], [116, 578]]);
        return piece(M(shoeUpperD(520, 3.4, 3)), c, { rim: [2.4, 1.4] }) + crossLace(X(125) < X(136) ? X(125) : X(136), X(125) < X(136) ? X(136) : X(125), 526, 562, 5, '#FFFFFF') +
          piece(M(toe), '#FBF8F2', { rim: false }) + `<circle cx="${f1(X(legO(534) - 1))}" cy="534" r="3" fill="#FBF8F2" stroke="${STYLE.line}" stroke-width=".6"/>` +
          piece(M(soleD(579, 11, 4)), '#FBF8F2', { rim: false, lines: [{ d: M('M 115 584 L 150 584'), c: c, w: 1.1, o: .9 }] });
      };
      return [{ z: 40, svg: both(one) }];
    }
  };
}
/* 围巾：从脖子绕一圈、一端垂到胸前 */
function scarf(id, name, fill, tail = 1) {
  return {
    id, cat: 'acc', sub: 'neck', name, thumb: '114 140 72 130', isNew: true,
    parts: () => {
      const wrap = spline([[136.6, 152], [150, 156.4], [163.4, 152], [169.4, 159], [168.4, 174, 'c'], [150, 181], [131.6, 174, 'c'], [130.6, 159]]);
      const end = spline([[140, 172], [152, 172], [150, 206], [152, 236, 'c'], [138, 238, 'c'], [138, 206]]);
      const end2 = spline([[156, 170], [168, 168], [174, 196], [184, 222, 'c'], [172, 228, 'c'], [162, 200]]);
      const fr = x0 => Array.from({ length: 6 }, (_, i) => { const x = x0 + i * 2.3; return `M ${f1(x)} 237 L ${f1(x + .2)} 242`; }).join(' ');
      return [{ z: 57, svg: piece(end, fill, { folds: ['M 144 188 Q 146 206 145 224'] }) + (tail > 1 ? piece(end2, fill, { folds: ['M 166 184 Q 170 200 176 216'] }) : '') + `<path d="${fr(139.4)}" stroke="${STYLE.line}" stroke-width="2" stroke-linecap="round"/><path d="${fr(139.4)}" stroke="${baseOf(fill) || '#ccc'}" stroke-width="1" stroke-linecap="round"/>` +
        piece(wrap, fill, { folds: ['M 138 164 Q 150 170 162 164', 'M 134 170 Q 150 177 166 170'] }) }];
    }
  };
}
const HATS16 = ['a95', 'a96', 'a97', 'a107', 'a108', 'a109'];
EXTRA.push(
  /* ---------- 袜子 ---------- */
  stocking('l19', '白色粉条纹及膝袜', '#FBFAF6', { top: 440, band: '#F2EEE6', bands: '#F48FB1' }),
  stocking('l20', '奶黄过膝袜', '#F6EBA8', { top: 386 }),
  stocking('l21', '黑色过膝袜', '#2A2528', { top: 388 }),
  stocking('l22', '藏青条纹过膝袜', '#2E3654', { top: 392, bands: '#FBFAF6' }),
  stocking('l23', '黑色粉荷叶过膝袜', '#2A2528', { top: 390, frill: '#F4A6C0', bow: '#D8406A' }),
  stocking('l24', '红白条纹过膝袜', 'url(#pat-stripeRW)', { top: 386 }),
  stocking('l25', '棕红格纹过膝袜', 'url(#pat-plaidBrown)', { top: 388 }),
  stocking('l26', '黑白条纹过膝袜', 'url(#pat-stripeBW)', { top: 388 }),
  stocking('l27', '粉紫渐变过膝袜', 'url(#grad-ombrePink)', { top: 386 }),
  stocking('l28', '灰色条纹吊带袜', 'url(#pat-stripeGG)', { top: 392, garter: '#2A2528' }),
  stocking('l29', '粉色吊带过膝袜', '#F4A6C0', { top: 394, garter: '#2A2528', frill: '#FFFFFF' }),
  stocking('l30', '粉黑条纹过膝袜', 'url(#pat-stripePB)', { top: 388 }),
  stocking('l31', '紫黑竖条纹过膝袜', 'url(#pat-vstripePB)', { top: 388 }),
  stocking('l32', '酒红过膝袜', '#7A1E2E', { top: 384 }),
  stocking('l33', '粉色荷叶边及膝袜', '#F4A6C0', { top: 432, frill: '#F4A6C0' }),
  stocking('l34', '藏青粉色鸳鸯袜', '#3A3E7A', { top: 426, fillR: '#F4B6D0' }),
  stocking('l35', '黑色及膝袜', '#2A2528', { top: 440, band: '#3A3538' }),
  tights('l36', '紫色连裤袜', '#6A3E8E'),
  tights('l37', '紫色菱格连裤袜', 'url(#pat-argylePurple)'),
  tights('l38', '黑色网袜', 'url(#pat-fishnet)'),
  (() => { const w = warmerItem('l39', '黑色蕾丝边腿套', 'url(#pat-fuzzblack)', 'url(#pat-fuzzblack)', false), P = w.parts;
    w.parts = () => { const L = P(); const fr = m => { const M = M_(m), a = [legO(426) - 5, 424], b = [legI(426) + 4, 424.4], a2 = [legO(558) - 6, 558], b2 = [legI(558) + 6, 558]; return piece(M(frillD(a, b, -6, 5, 3)), '#F2E6CC', { rim: false }) + piece(M(frillD(a2, b2, 6.4, 5, 4)), '#F2E6CC', { rim: false }); };
      L[0].svg += both(fr); return L; };
    return w; })(),
  warmerItem('l40', '白色堆堆袜', 'url(#pat-ribwhite15)', 'url(#pat-ribwhite15)', false),

  /* ---------- 鞋 ---------- */
  { id: 's23', cat: 'shoes', name: '粉色复古运动鞋', thumb: '100 520 100 84', isNew: true, parts: () => [{ z: 40, svg: both(sneaker('#F2A6BC', '#7A8CC8', '#FBF8F2', '#E86A8E')) }] },
  highTop('s24', '藏青帆布高帮鞋', '#2E3A6A'),
  bootItem('s25', '棕色星星西部靴', '#8A5A3A', 470, null, { e: 4.6, dipTop: 8, heel: true, star: '#C8904A', soleH: 16 }),
  bootItem('s26', '粉色系带短靴', '#F2B6C8', 510, '#E86A8E', { e: 3.8, sole: '#FBF8F2' }),
  bootItem('s27', '灰色系带长靴', '#C8C6CC', 400, '#4A4448', { e: 3, sole: '#8A868C' }),
  maryJane('s28', '桃粉玛丽珍', '#E8567A', null, { sole: '#8A2A40' }),
  bootItem('s29', '黑色系带马丁靴', '#2E2A2C', 480, '#6FBF6A', { e: 4.4, soleH: 16 }),
  bootItem('s30', '黑色红系带马丁靴', '#2E2A2C', 470, '#C8323C', { e: 4.4, soleH: 16 }),
  bootItem('s31', '藏青堆堆靴', '#2E3160', 470, null, { e: 5.4, slouch: true, soleH: 11 }),
  bootItem('s32', '白色系带长靴', '#F4F2EE', 440, '#2A2528', { e: 3.6, sole: '#C8C4C0' }),
  bootItem('s33', '灰黑绑带堆堆靴', '#4A4448', 430, null, { e: 5, slouch: true, soleH: 12 }),
  bootItem('s34', '浅蓝短靴', '#A8C8EA', 506, null, { e: 4.4, slouch: true, sole: '#7A98C0' }),
  { id: 's35', cat: 'shoes', name: '粉色尖头高跟鞋', thumb: '100 530 100 70', isNew: true,
    parts: () => [{ z: 40, svg: both(m => { const M = M_(m); return piece(M(shoeUpperD(562, 2.2, 9)), '#F48FB1', { rim: false, gloss: [M('M 121 572 Q 123 567 127 565')], glossOp: .6 }) + piece(M(soleD(581, 3.6, 2.2)), '#C85A7E', { rim: false }); }) }] },
  bootItem('s36', '白色厚底系带鞋', '#FBFAF6', 530, '#2A2528', { e: 3.2, soleH: 18, sole: '#EDE8E0' }),

  /* ---------- 帽子 ---------- */
  {
    id: 'a95', cat: 'acc', sub: 'hat', name: '粉色遮阳帽', thumb: '90 50 120 70', isNew: true,
    parts: () => {
      const band = 'M 108 94 C 118 82 132 76.4 150 76 C 168 76.4 182 82 192 94 L 190 101 C 180 91 166 86 150 85.6 C 134 86 120 91 110 101 Z';
      const brim = spline([[112, 96, 'c'], [130, 88], [150, 86.4], [170, 88], [188, 96, 'c'], [180, 108], [150, 111], [120, 108]]);
      return [{ z: 59, svg: piece(brim, '#F48FB1', { deep: [brim], lines: [{ d: 'M 118 101 Q 150 94 182 101', c: '#FFFFFF', dash: '1.4 1', o: .9, w: .8 }] }) + piece(band, '#F48FB1', {}) + `<path d="M 144 80.6 H 156 M 150 76.4 V 85" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/>` }];
    }
  },
  {
    id: 'a96', cat: 'acc', sub: 'hat', name: '藏青报童帽', thumb: '90 40 120 76', isNew: true,
    parts: () => {
      const crown = spline([[104.8, 97, 'c'], [103.2, 81], [110, 66.6], [124, 56.4], [140, 51.2], [157, 50.8], [173, 53.6], [186.6, 61.4], [195.4, 74], [197.4, 88], [195.6, 97, 'c']]);
      const brim = spline([[106.4, 92.4, 'c'], [128, 88.6], [150, 87.6], [172, 88.6], [193.6, 92.4, 'c'], [189, 102.6], [170, 100.2], [150, 99.6], [130, 100.2], [111, 102.6]]);
      const seams = ['M 150 52 C 138 60 130 72 126 90', 'M 150 52 C 162 60 170 72 174 90', 'M 150 52 C 146 66 146 78 148 90'];
      return [{ z: 56, svg: piece(crown, '#2E3450', { folds: seams, foldOp: .5 }) + piece(brim, '#262C44', { deep: [brim] }) + btn(150, 52, '#3A4260', 2.4) + `<g transform="translate(170 76)"><circle r="6" fill="#FBF8F2" stroke="${STYLE.line}" stroke-width=".6"/>${printMotif16('star', 0, 0, .5).replace(/<text[^>]*>[^<]*<\/text>/g, '')}</g>` }];
    }
  },
  {
    id: 'a97', cat: 'acc', sub: 'hat', name: '奶油荷叶边棒球帽', thumb: '90 36 120 80', isNew: true,
    parts: () => {
      const crown = spline([[106.4, 96, 'c'], [106, 76], [114, 60], [128, 50], [150, 46.6], [172, 50], [186, 60], [194, 76], [193.6, 96, 'c']]);
      const brim = spline([[108, 92, 'c'], [130, 88], [150, 87], [170, 88], [192, 92, 'c'], [186, 104], [150, 108], [114, 104]]);
      const fr = frillD([104, 96], [196, 96], 5.6, 12, 41);
      return [{ z: 56, svg: piece(fr, '#F6ECD8', { rim: false }) + piece(crown, '#E8DCC4', { folds: ['M 150 48 C 144 62 142 76 144 92', 'M 150 48 C 156 62 158 76 156 92'], foldOp: .45 }) + piece(brim, '#E8DCC4', { deep: [brim] }) + btn(150, 48, '#D8CAB0', 2.2) + ribbonBow(150, 82, .5, '#D8CAB0', 0) }];
    }
  },
  {
    id: 'a107', cat: 'acc', sub: 'hat', name: '浅蓝护耳毛线帽', thumb: '84 30 132 150', isNew: true,
    parts: () => {
      const cap = spline([[104.4, 102, 'c'], [104, 76], [112, 56], [126, 42], [146, 34], [166, 36], [182, 46], [194, 64], [196, 102, 'c']]);
      const band = spline([[103.6, 90, 'c'], [127, 84.6], [150, 83.4], [173, 84.6], [196.4, 90, 'c'], [196.8, 104, 'c'], [173, 98.6], [150, 97.4], [127, 98.6], [103.2, 104, 'c']]);
      const flap = spline([[104, 100], [112, 102], [114, 126], [108, 138, 'c'], [100, 126]]);
      const x = [120, 138, 162, 180].map(cx => `M ${cx - 3} 88 L ${cx + 3} 94 M ${cx + 3} 88 L ${cx - 3} 94`).join(' ');
      return [{ z: 59, svg: piece(flap, '#A8C4EE', {}) + piece(mir(flap), '#A8C4EE', {}) + strap('M 108 138 C 108 150 106 160 108 170', '#E8E2D6', 1) + strap(mir('M 108 138 C 108 150 106 160 108 170'), '#E8E2D6', 1) +
        piece(cap, '#A8C4EE', { folds: ['M 140 40 Q 136 60 134 84', 'M 164 40 Q 168 62 170 84'], foldOp: .4 }) + piece(band, '#F6E8A8', { lines: [{ d: x, c: '#FBF8F2', w: 1.6, o: .95 }] }) }];
    }
  },
  {
    id: 'a108', cat: 'acc', sub: 'hat', name: '酒红毛线帽', thumb: '90 22 120 96', isNew: true,
    parts: () => {
      const cap = spline([[106.4, 98, 'c'], [104, 70], [110, 44], [130, 28], [152, 24], [174, 30], [190, 48], [194, 72], [193.6, 98, 'c']]);
      const ribs = Array.from({ length: 9 }, (_, i) => `M ${116 + i * 8.6} ${40 + Math.abs(i - 4) * 3} L ${114 + i * 8.8} 96`).join(' ');
      return [{ z: 56, svg: piece(cap, '#7A1E2E', { lines: [{ d: ribs, o: .3, w: .8 }], folds: ['M 120 60 Q 150 70 180 60'], foldOp: .4 }) + `<g transform="translate(178 74)"><circle r="5.4" fill="#FBF8F2" stroke="${STYLE.line}" stroke-width=".6"/><path d="M -1.6 -3.6 H 1.6 V -1.6 H 3.6 V 1.6 H 1.6 V 3.6 H -1.6 V 1.6 H -3.6 V -1.6 H -1.6 Z" fill="#3A6AB8"/></g>` }];
    }
  },
  {
    id: 'a109', cat: 'acc', sub: 'hat', name: '红黑条纹毛线帽', thumb: '90 22 120 96', isNew: true,
    parts: () => {
      const cap = spline([[106.4, 98, 'c'], [104, 70], [110, 44], [130, 28], [152, 24], [174, 30], [190, 48], [194, 72], [193.6, 98, 'c']]);
      const brim = spline([[104.4, 86, 'c'], [127, 81], [150, 79.6], [173, 81], [195.6, 86, 'c'], [196.4, 100.4, 'c'], [173, 96], [150, 94.6], [127, 96], [103.6, 100.4, 'c']]);
      return [{ z: 56, svg: piece(cap, 'url(#pat-stripeRB)', { folds: ['M 124 54 Q 150 62 176 54'], foldOp: .35 }) + piece(brim, 'url(#pat-stripeRB)', { lines: [{ d: Array.from({ length: 21 }, (_, i) => `M ${106 + i * 4.4} ${86 - 3 * Math.sin((i / 20) * Math.PI)} L ${106 + i * 4.4} ${99 - 3 * Math.sin((i / 20) * Math.PI)}`).join(' '), o: .3, w: .7 }] }) +
        `<path d="M 170 58 H 176 V 64 H 182 V 70 H 176 V 76 H 170 V 70 H 164 V 64 H 170 Z" fill="#D8323C" stroke="#FBF8F2" stroke-width="1"/>` }];
    }
  },
  /* ---------- 发饰 ---------- */
  { id: 'a98', cat: 'acc', sub: 'hairacc', name: '头顶红色墨镜', thumb: '100 40 100 50', isNew: true,
    parts: () => [{ z: 58, svg: [133, 167].map(cx => `<ellipse cx="${cx}" cy="68" rx="11" ry="6.4" fill="#E8454F" opacity=".75" stroke="#A82030" stroke-width="1.6"/><path d="M ${cx - 6} 65.6 Q ${cx - 2} 63.6 ${cx + 2} 64.4" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".8"/>`).join('') + `<path d="M 144 66 Q 150 63.6 156 66 M 122 67 L 112 72 M 178 67 L 188 72" fill="none" stroke="#A82030" stroke-width="1.6" stroke-linecap="round"/>` }] },
  { id: 'a99', cat: 'acc', sub: 'hairacc', name: '十字发夹', thumb: '104 74 60 44', isNew: true,
    parts: () => [{ z: 58, svg: [[122, 94, '#6FBF6A'], [130, 87, '#F48FB1']].map(([x, y, c]) => `<path d="M ${x - 1.8} ${y - 5} H ${x + 1.8} V ${y - 1.8} H ${x + 5} V ${y + 1.8} H ${x + 1.8} V ${y + 5} H ${x - 1.8} V ${y + 1.8} H ${x - 5} V ${y - 1.8} H ${x - 1.8} Z" fill="${c}" stroke="${STYLE.line}" stroke-width=".7" transform="rotate(12 ${x} ${y})"/>`).join('') }] },
  /* ---------- 手饰 ---------- */
  { id: 'a100', cat: 'acc', sub: 'hand', name: '蓝色发圈手环', thumb: '190 296 40 30', isNew: true,
    parts: () => { const y = 312, xo = 300 - armO(y) + 1.4, xi = 300 - armI(y) - 1.4; return [{ z: 56, svg: piece(spline(wavy([[xi, y - 3], [(xo + xi) / 2, y - 4.4], [xo, y - 3], [xo + 1, y + 3], [(xo + xi) / 2, y + 4.6], [xi - 1, y + 3], [xi, y - 3]], .9, 6).slice(0, -1)), '#7A9ADA', { rim: [1, .6] }) }]; } },
  {
    id: 'a101', cat: 'acc', sub: 'hand', name: '粉色长臂套', thumb: '66 230 60 100', isNew: true,
    parts: () => { const one = m => { const M = M_(m), pts = []; rng(236, 318, 10).forEach(y => pts.push([armO(y) - 2.4, y])); pts.push([(armO(320) + armI(320)) / 2, 322.4, 'c']); rng(318, 236, 10).forEach(y => pts.push([armI(y) + 2.2, y]));
      return piece(M(spline(pts)), '#F7BCD0', { folds: [252, 280].map(y => M(`M ${f1(armO(y) - 1.4)} ${y} Q ${f1((armO(y) + armI(y)) / 2)} ${y + 2.6} ${f1(armI(y) + 1.4)} ${y}`)), foldOp: .35 }); };
      return [{ z: 45, svg: both(one) }]; }
  },
  { id: 'a102', cat: 'acc', sub: 'hand', name: '粉白条纹护腕', thumb: '190 296 40 30', isNew: true,
    parts: () => { const y = 306, xo = 300 - armO(y) + 1.6, xi = 300 - armI(y) - 1.6; return [{ z: 56, svg: piece(`M ${f1(xi)} ${y - 5} L ${f1(xo)} ${y - 4} L ${f1(xo + .4)} ${y + 5} L ${f1(xi - .4)} ${y + 4} Z`, '#F48FB1', { rim: false, lines: [{ d: `M ${f1(xi)} ${y} L ${f1(xo + .2)} ${y + .6}`, c: '#FFFFFF', w: 1.6, o: .95 }] }) }]; } },
  {
    id: 'a103', cat: 'acc', sub: 'hand', name: '黑色露指手套', thumb: '66 300 60 60', isNew: true,
    parts: () => { const one = m => { const M = M_(m), pts = []; rng(314, 336, 5).forEach(y => pts.push([armO0(y) - 1.4, y])); pts.push([(armO0(338) + armI0(338)) / 2, 338.6, 'c']); rng(336, 314, 5).forEach(y => pts.push([armI0(y) + 1.4, y]));
      return piece(M(spline(pts)), '#2A2528', { rim: false, lines: [{ d: M(`M ${f1(armO0(316) - 1)} 316 L ${f1(armI0(316) + 1)} 317`), c: '#C9CDD6', w: 1, dash: '.8 1', o: .9 }] }); };
      return [{ z: 56, svg: both(one) }]; }
  },
  /* ---------- 腰饰 ---------- */
  {
    id: 'a104', cat: 'acc', sub: 'waist', name: '铆钉腰带配链条', thumb: '100 276 100 60', isNew: true,
    parts: () => { const belt = spline([[outerX(288) - 4, 287, 'c'], [150, 293], [300 - outerX(288) + 4, 287, 'c'], [300 - outerX(295) + 4.2, 294.4, 'c'], [150, 300.4], [outerX(295) - 4.2, 294.4, 'c']]);
      const studs = rng(114, 186, 16).map(x => { const y = 293.6 + 3 * (1 - Math.pow((x - 150) / 38, 2)); return `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.1" fill="url(#grad-chrome)" stroke="${STYLE.line}" stroke-width=".35"/>`; }).join('');
      const links = Array.from({ length: 16 }, (_, i) => { const t = i / 15, x = 164 + 24 * t, y = 298 + 22 * Math.sin(t * Math.PI); return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="1.9" ry="1.2" fill="none" stroke="#C9CDD6" stroke-width="1" transform="rotate(${f1(40 - 80 * t)} ${f1(x)} ${f1(y)})"/>`; }).join('');
      return [{ z: 34, svg: piece(belt, '#2A2528', { rim: false }) + studs + links + `<rect x="145" y="292" width="10" height="9" rx="1.4" fill="none" stroke="#D6DAE2" stroke-width="1.6"/>` }]; }
  },
  {
    id: 'a105', cat: 'acc', sub: 'waist', name: '白色双扣腰带', thumb: '100 270 100 60', isNew: true,
    parts: () => { const b = (y, dy) => spline([[outerX(y) - 4.4, y - dy, 'c'], [150, y + 2], [300 - outerX(y) + 4.4, y + dy, 'c'], [300 - outerX(y + 7) + 4.6, y + 7 + dy, 'c'], [150, y + 9], [outerX(y + 7) - 4.6, y + 7 - dy, 'c']]);
      return [{ z: 34, svg: piece(b(286, 3), '#FBFAF6', { rim: false }) + piece(b(298, -4), '#FBFAF6', { rim: false }) + `<rect x="160" y="287" width="8" height="8" rx="1.2" fill="none" stroke="#C9CDD6" stroke-width="1.5"/><rect x="128" y="297" width="8" height="8" rx="1.2" fill="none" stroke="#C9CDD6" stroke-width="1.5"/>` }]; }
  },
  {
    id: 'a106', cat: 'acc', sub: 'waist', name: '粉色铆钉腰带', thumb: '100 276 100 50', isNew: true,
    parts: () => { const belt = spline([[outerX(288) - 4, 287, 'c'], [150, 293], [300 - outerX(288) + 4, 287, 'c'], [300 - outerX(295) + 4.2, 294.4, 'c'], [150, 300.4], [outerX(295) - 4.2, 294.4, 'c']]);
      const studs = rng(114, 186, 12).map(x => { const y = 293.6 + 3 * (1 - Math.pow((x - 150) / 38, 2)); return `<circle cx="${f1(x)}" cy="${f1(y)}" r="1.1" fill="#FBFAF6" stroke="${STYLE.line}" stroke-width=".35"/>`; }).join('');
      return [{ z: 34, svg: piece(belt, '#F48FB1', { rim: false }) + studs + `<rect x="145" y="292" width="10" height="9" rx="1.4" fill="none" stroke="#FBFAF6" stroke-width="1.6"/>` }]; }
  },
  {
    id: 'a110', cat: 'acc', sub: 'waist', name: '白色垂坠背带', thumb: '96 280 108 100', isNew: true,
    parts: () => [{ z: 34, svg: [false, true].map(m => strap((m ? mir : x => x)('M 124 292 C 122 316 120 336 124 356'), '#FBFAF6', 1.8) + `<rect x="${m ? 173.6 : 121.4}" y="289" width="5" height="5" rx="1" fill="url(#grad-chrome)" stroke="${STYLE.line}" stroke-width=".5"/>`).join('') }]
  },
  /* ---------- 颈饰 ---------- */
  scarf('a111', '红色条纹围巾', 'url(#pat-stripeRW)', 2),
  scarf('a112', '黄色格纹围巾', 'url(#pat-plaidYellow)', 1),
  scarf('a113', '蓝紫色长围巾', '#8A96D8', 2),
  { id: 'a114', cat: 'acc', sub: 'neck', name: '黑色细项圈', thumb: '130 140 40 30', isNew: true, parts: () => [{ z: 56, svg: `<path d="M 141.6 153.6 Q 150 158 158.4 153.6" fill="none" stroke="#2A2528" stroke-width="2.6" stroke-linecap="round"/><circle cx="150" cy="158.6" r="1.4" fill="#C9CDD6" stroke="${STYLE.line}" stroke-width=".4"/>` }] },
  /* ---------- 包包 ---------- */
  {
    id: 'a115', cat: 'acc', sub: 'bag', name: '银色蝴蝶结腋下包', thumb: '150 220 80 110', isNew: true,
    parts: () => {
      const bag = spline([[180, 262, 'c'], [212, 258, 'c'], [216, 272], [212, 284, 'c'], [180, 288, 'c'], [176, 274]]);
      const bear = `<g transform="translate(186 300)"><circle cx="-4" cy="-7" r="2.6" fill="#9CC0E8" stroke="${STYLE.line}" stroke-width=".5"/><circle cx="4" cy="-7" r="2.6" fill="#9CC0E8" stroke="${STYLE.line}" stroke-width=".5"/><circle cy="-2" r="5.4" fill="#9CC0E8" stroke="${STYLE.line}" stroke-width=".6"/><ellipse cy="7" rx="4.4" ry="5" fill="#9CC0E8" stroke="${STYLE.line}" stroke-width=".6"/><circle cx="-1.8" cy="-2.6" r=".7" fill="${STYLE.line}"/><circle cx="1.8" cy="-2.6" r=".7" fill="${STYLE.line}"/><ellipse cy="-.6" rx="1.6" ry="1.1" fill="#E4EEF8"/></g>`;
      return [{ z: 46, svg: strap('M 172 170 C 176 196 180 230 184 262', '#C9CDD6', 1.8) + strap('M 176 168 C 186 192 196 230 206 260', '#C9CDD6', 1.8) + piece(bag, 'url(#grad-silver)', { sheen: ['M 184 268 Q 196 264 208 266'], sheenOp: .7, sheenW: 2 }) + ribbonBow(196, 272, .5, '#D6DAE2', 0) +
        `<path d="M 186 286 L 186 293" stroke="#C9CDD6" stroke-width="1"/>` + bear }];
    }
  }
);
