/* =====================================================================
   填充解析 / 渲染
   层级（z）：发型后片 2 · 底模 10 · 头 10.5 · 打底 12 · 五官 13–14 · 袜子 15 · 下装 20 · 连衣裙 25 · 上衣 30 · 外套 35
             · 鞋 40 · 腿套 42 · 腰间挂件 46 · 发型前片 50 · 眉毛 52 · 配饰 55+
   所有部件都直接画在同一张 300 × 600 画布坐标里（底模是按参考精灵图描摹的）
   ===================================================================== */
const Z = { top: 30, outer: 35, bottom: 20, dress: 25 };
const HEAD_ACC = ['a1', 'a3', 'a5', 'a6', 'a8', 'a10', 'a12', 'a13', 'a14', 'a15', 'a16', 'a19'];
const tplOf = it => (it && it.tpl ? TPL[it.tpl] : null);
const keepsTop = it => !!(tplOf(it) && tplOf(it).keepTop);
function resolveFill(it) {
  let fill, base;
  const plain = it.diy || it.white;
  if (it.diy) { base = it.color; fill = it.mode === 'pattern' && it.tile ? `url(#pat-${it.id})` : it.color; }
  else if (it.white) { fill = base = '#FFFFFF'; }
  else if (it.fill.c) { fill = base = it.fill.c; }
  else if (it.fill.p) { fill = `url(#pat-${it.fill.p})`; base = PAT_BASE[it.fill.p] || '#cccccc'; }
  else { fill = `url(#grad-${it.fill.g})`; base = GRAD_BASE[it.fill.g] || '#cccccc'; }
  const denim = !plain && /denim/.test(it.fill.p || '');
  return {
    fill, base, detail: mix(base, INK, .45), stitch: denim ? '#F0B24A' : mix(base, INK, .3),
    print: plain ? '' : it.print, rib: plain ? '' : it.rib, alt: plain ? fill : (it.alt || fill), sleeve: plain ? fill : it.sleeve
  };
}
const slotOf = it => it.slot || it.cat;
const isHead = it => it.cat === 'hair' || it.head || HEAD_ACC.includes(it.id) || ['hat', 'hairacc', 'ear', 'glasses'].includes(it.sub);
function partsOf(it) {
  if (it.shape) return [{ z: Z[it.cat], svg: piece(it.shape, resolveFill(it).fill, { evenodd: true, folds: it.lines || [] }) }];
  if (it.tpl) { const T = TPL[it.tpl], F = resolveFill(it); return [{ z: T.z ?? Z[it.cat], svg: T.render(F) }].concat(T.back ? [{ z: 9, svg: T.back(F) }] : []); }
  if (it.png) return [{ z: it.z ?? 30, svg: `<image href="${it.png}" x="0" y="0" width="300" height="600"/>` }];
  if (it.cat === 'hair') { SOFT = .7; try { return hairDepth(it.parts().map(l => ({ ...l, svg: unifyHair(l.svg) }))); } finally { SOFT = 0; } }
  return it.parts();
}
/* 头发前后分层：后面那层（z < 10）的发色压暗一档，前后两层就不会糊成一整块 */
function hairDepth(L) {
  const cnt = {}; L.forEach(l => (l.svg.match(/fill="(#[0-9a-fA-F]{6})"/g) || []).forEach(m => { cnt[m] = (cnt[m] || 0) + 1; }));
  const top = Object.entries(cnt).sort((a, b) => b[1] - a[1])[0]; if (!top) return L;
  const c = top[0].slice(6, 13), dk = mix(c, '#3A2436', .17);
  return L.map(l => (l.z < 10 ? { ...l, svg: l.svg.split(`fill="${c}"`).join(`fill="${dk}"`) } : l));
}
const thumbOf = it => it.thumb || (it.tpl && TPL[it.tpl].thumb) || '0 0 300 600';
function layersSVG(list) { return list.sort((a, b) => a.z - b.z).map(l => l.svg).join(''); }
const headWrap = L => L;

const state = { outfit: null, tab: 'top', custom: [], pose: 'relax' };
const SLOTS = ['hair', 'top', 'outer', 'bottom', 'dress', 'legs', 'warmer', 'shoes'];
const DEFAULT_OUTFIT = { hair: 'h4', top: 't5', outer: null, bottom: 'b4', dress: null, legs: null, warmer: 'l3', shoes: 's6', acc: ['a9'], face: { ...DEFAULT_FACE } };
const allItems = () => WARDROBE.concat(state.custom);
const byId = id => (id ? allItems().find(i => i.id === id) : null);

/* 动态蒙版：穿上衣 / 连衣裙时隐藏打底吊带，穿下装 / 连衣裙时隐藏打底短裤；穿连衣裙时不画上衣和下装 */
function dollSVG(outfit, over = {}, pose = null) {
  const slot = k => (k in over ? over[k] : byId(outfit[k]));
  const dress = slot('dress'), fullDress = dress && !keepsTop(dress);
  const top = fullDress ? null : slot('top'), bottom = dress ? null : slot('bottom');
  const L = [{ z: 10, svg: bodySVG(), cat: 'body' }];
  const H = [{ z: 10.5, svg: headSVG() }, ...faceLayers(outfit.face)];
  const [cami, shorts] = underwearParts();
  if (!top && !fullDress) L.push({ z: 12, svg: cami });
  if (!bottom && !dress) L.push({ z: 12, svg: shorts });
  [slot('hair'), top, slot('outer'), bottom, dress, slot('legs'), dress && tplOf(dress) && tplOf(dress).long ? null : slot('warmer'), slot('shoes')].forEach(it => { if (it) (isHead(it) ? H : L).push(...partsOf(it).map(l => ({ ...l, cat: it.cat, drawn: !!it.shape }))); });
  const accL = [], P = pose && pose !== 'stand' ? POSES[pose] : null;
  (outfit.acc || []).forEach(id => { const it = byId(id); if (it) { const Q = partsOf(it); if (isHead(it)) H.push(...Q); else if (P && (BAGS.has(id) || HELD[id] || it.sub === 'bag' || it.sub === 'waist')) accL.push(...Q.map(l => ({ ...l, bag: id }))); else L.push(...Q.map(l => ({ ...l, cat: 'acc', id }))); } });
  // 戴帽子时，帽顶以上的头发（丸子、高马尾、呆毛）收进帽子里，不会从帽子上穿出来；遮阳帽没有帽顶，不收
  if ((outfit.acc || []).some(id => { const it = byId(id); return it && it.sub === 'hat' && !OPEN_HATS.has(id); })) {
    const hide = (l, y) => { const c = uid('hc'); return { ...l, svg: `<clipPath id="${c}"><rect x="-40" y="${y}" width="380" height="700"/></clipPath><g clip-path="url(#${c})">${l.svg}</g>` }; };
    H.forEach((l, i) => { if (l.cat === 'hair') H[i] = hide(l, l.z < 10 ? 78 : 60); });
  }
  L.push(...pantsOverShoes(bottom, slot('shoes')));
  if (P) return posedSVG(P, L, H, accL, { bottom });
  return layersSVG(L.concat(headWrap(H)));
}

/* =====================================================================
   姿势：整个人（身体 + 衣服）用同一个位移场做矢量变形，和 Live2D / Spine 的蒙皮一个道理——
   手臂绕肩膀、小臂绕手肘、小腿绕膝盖转，关节附近按权重一点点弯过去，不切开，所以没有断口，袖子也不会碎。
   手挡在身体前面时，把「手臂那一片」按同样的变形在上层再画一遍（肩膀处两层完全重合，看不出接缝）；背手时反过来，把身体再画一遍盖住手。
   角度：SVG 顺时针为正；左手（画面左）向外摆为正，向里收为负；右手相反
   body：身体的重心（和「自然站立」一样的 S 形）：hip 胯往右送，kneeL / kneeR 膝盖内扣，footL / footR 脚往外撇，tilt 肩膀一高一低
   ===================================================================== */
const LEAN = { hip: 4.6, kneeL: 3.4, footL: 1.4, tilt: .02 };            // 重心放在右腿上
const LEAN_L = { hip: -4.2, kneeR: 3.2, footR: 1.4, tilt: -.018 };       // 重心放在左腿上
const POSES = {
  relax: { name: '自然站立', warp: 'relax' },
  shy: { name: '内八俏皮', warp: 'shy', isNew: true, skirt: { flare: -1.2 } },
  stand: { name: '立正' },
  clasp: { name: '乖巧', head: -4, body: LEAN, L: { up: -4, fore: -44 }, R: { up: 4, fore: 44 } },
  behind: { name: '背手', head: 4, body: LEAN_L, L: { up: 6, fore: -30, back: true }, R: { up: -6, fore: 30, back: true } },
  hip: { name: '叉腰', head: -5, body: LEAN, L: { up: 24, fore: -78 }, R: { up: -4, fore: -6 } },
  wave: { name: '打招呼', head: 5, body: LEAN_L, skirt: { sway: 1.2 }, hair: { sway: 1.6 }, R: { up: -16, fore: -150, over: true }, L: { up: 4, fore: 6 } },
  kick: { name: '踢腿', head: 4, body: { hip: -3, tilt: -.02 }, leg: -30, hair: { sway: -3.5, flare: 2.4, lift: 1.2 }, L: { up: 10, fore: 12 }, R: { up: -12, fore: -14 } },
  /* Coquette 芭蕾甜心 */
  curtsy: { name: '提裙', head: -6, body: LEAN, skirt: { flare: 5.5, lift: 2.6 }, hair: { flare: 1.2 }, L: { up: 14, fore: 16 }, R: { up: -14, fore: -16 } },
  heart: { name: '比心', head: 5, body: LEAN_L, L: { up: -8, fore: -140 }, R: { up: 8, fore: 140 }, extra: `<path d="${heartD(150, 199, 6)}" fill="#F48FB1" stroke="#fff" stroke-width="2" paint-order="stroke"/><path d="M 146.4 196 Q 147 194 149 194" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>` },
  /* 参考时尚插画里的站姿 */
  drink: { name: '拿饮料', isNew: true, head: 5, body: LEAN_L, L: { up: 24, fore: -78 }, R: { up: -46, fore: 158 }, hair: { sway: 1.2 }, extra: `<g transform="translate(176 206) rotate(6)"><path d="M -8 -12 L 8 -12 L 6 16 L -6 16 Z" fill="#F48FB1" stroke="#3D3134" stroke-width=".8" stroke-linejoin="round"/><path d="M -8.6 -12 L 8.6 -12 L 8.2 -9 L -8.2 -9 Z" fill="#fff" stroke="#3D3134" stroke-width=".7"/><path d="M 2 -12 L 5 -24 L 9 -22" fill="none" stroke="#3D3134" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M 2 -12 L 5 -24 L 9 -22" fill="none" stroke="#FFE27A" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="${heartD(0, 3, 3.6)}" fill="#fff"/><path d="M -5 -6 L -4 10" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".6"/></g>` },
  camera: { name: '拿相机', isNew: true, head: -4, body: LEAN, L: { up: 28, fore: -140 }, R: { up: -28, fore: 140 }, extra: `<g transform="translate(150 234)"><rect x="-15" y="-10" width="30" height="20" rx="4" fill="#F7D56A" stroke="#3D3134" stroke-width=".8"/><rect x="-15" y="-10" width="30" height="6" rx="3" fill="#F48FB1" stroke="#3D3134" stroke-width=".7"/><circle r="6.4" cy="1.6" fill="#4A4450" stroke="#3D3134" stroke-width=".8"/><circle r="3.8" cy="1.6" fill="#8FB8E0"/><circle r="1.3" cx="-1.4" cy=".4" fill="#fff"/><rect x="7" y="-8.6" width="5" height="3" rx="1" fill="#fff"/></g>` },
  stride: { name: '迈步', isNew: true, head: 3, body: { hip: -3.6, kneeL: 1.6, tilt: -.02 }, leg: -16, L: { up: -8, fore: -12 }, R: { up: -10, fore: -10 }, skirt: { sway: 1.6, flare: 1.4 }, hair: { sway: -1.6 } },
  spread: { name: '芭蕾展臂', head: -5, body: LEAN, skirt: { flare: 3.2, lift: 1.2 }, hair: { flare: 2.6, lift: 1 }, L: { up: 52, fore: 18 }, R: { up: -52, fore: -18 } }
};
const BAGS = new Set(['a4', 'a27', 'a33', 'a34', 'a47', 'a58', 'a42', 'a53', 'a48', 'a49', 'a50']);        // 包不跟着手臂变形，整只保留在原处
const OPEN_HATS = new Set(['a95']);                                                                    // 没有帽顶的帽子（遮阳帽）
const HELD = { a47: 'L', a34: 'R', a73: 'L', a90: 'L' };                                               // 拎在手上的包跟着那只手走
const PANTS_TPL = new Set(['widePants', 'cargo', 'flareJeans', 'skinnyJeans', 'slacks', 'sashPants', 'skirtJeans', 'wideFlare', 'wrapCargo', 'balloonPants', 'shorts', 'capris', 'bermuda', 'culottes', 'beltShorts']);
const RIG = (() => {
  const yE = 266, yK = 432;
  const b = y => (y < 222 ? 121 + (armI0(222) + 5 - 121) * (y - 206) / 16 : armI0(Math.min(y, 346)) + 5);
  const band = (y0, y1, f) => { const pts = [[10, y0]]; for (let y = y0; y <= y1; y += 4) pts.push([f(y), y]); pts.push([f(y1), y1], [10, y1]); return 'M ' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L ') + ' Z'; };
  const E = [(armO0(yE) + armI0(yE)) / 2, yE], K = [300 - (legO(yK) + legI(yK)) / 2, yK];
  // 单独一条手臂的皮肤（腋下往下，按底模轮廓逐行描出来），手挡在身前时叠画用；BACK：连肩膀的整条手臂，背手时从身体上挖掉
  const O = [], I = [];
  for (let y = 226; y <= 352; y++) { const r = profRow(y).filter(g => g[0] < 106); if (!r.length) continue; O.push([r[0][0], y]); I.push([Math.max(...r.map(g => g[1])), y]); }
  const edge = 'M ' + O.map(P2).join(' L ') + ' L ' + I.slice().reverse().map(P2).join(' L '), skin = edge + ' Z';   // 描边不描顶上那条横切线
  const handBits = d => (String(d).match(/M[^M]*/g) || []).filter(q => { const n = q.match(/-?\d*\.?\d+/g); return n && +n[0] < 104 && +n[1] > 296 && +n[1] < 362; }).join('');
  const armSkin = () => { const m = uid('m');
    return `<path d="${skin}" fill="${SKIN}"/><mask id="${m}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="340" height="640"><rect x="-20" y="-20" width="340" height="640" fill="#fff"/><path d="${skin}" transform="translate(-2.6 -1)" fill="#000"/></mask><path d="${skin}" fill="#F7D9CF" mask="url(#${m})"/>` +
      `<path d="${edge}" fill="none" stroke="${INK}" stroke-width="1.15" stroke-linejoin="round"/>` +
      `<path d="${handBits(DETAIL_SOFT)}" fill="${SKIN_LINE}" opacity=".78"/><path d="${handBits(DETAIL_DARK)}" fill="${INK}"/>`; };
  const back = band(200, 384, b);
  return { yE, yK, S: [113, 198], E, K, SKIN: { L: () => armSkin(), R: () => `<g transform="translate(300 0) scale(-1 1)">${armSkin()}</g>` }, BACK: { L: back, R: mir(back) } };
})();
const HAND = { L: [84, 336], R: [216, 336] };
function posedSVG(P, L, H, bags, W0) {
  // 裙子 / 连衣裙 / 长外套盖过膝盖（裤子除外）就不踢腿：直接看这一层的布片有没有伸到膝盖以下
  const reachesKnee = l => { let hit = false; l.svg.replace(/ d="([^"]*)"/g, (m, d) => { if (hit || /[a-y]/.test(d)) return m; const n = d.match(/-?\d*\.?\d+/g) || []; for (let i = 0; i + 1 < n.length; i += 2) if (+n[i + 1] > RIG.yK - 4 && +n[i] > 150.6) { hit = true; break; } return m; }); return hit; };
  const legOK = P.leg && !L.some(l => (l.cat === 'dress' || l.cat === 'outer' || (l.cat === 'bottom' && !(W0.bottom && PANTS_TPL.has(W0.bottom.tpl)))) && reachesKnee(l));
  const base = P.warp ? WARP_POSES[P.warp] : {};
  const W = { head: 0, hip: 0, kneeL: 0, footL: 0, kneeR: 0, footR: 0, armL: 0, armR: 0, tilt: 0, ...base, ...(P.body || {}), head: P.head ?? base.head ?? 0, arms: { L: P.L, R: P.R }, leg: legOK ? P.leg : 0 };
  // 裙摆：默认跟着胯的反方向轻轻荡；发尾：默认跟着歪头方向顺一点。姿势里的 skirt / hair 再加上动作本身的甩动
  const kick = legOK ? 1 : 0, sk = P.skirt || {}, hr = P.hair || {};
  Object.assign(W, { skirtSway: -.34 * W.hip + (sk.sway || 0) + kick * 2.4, skirtFlare: (sk.flare || 0) + kick * 3.2, skirtLift: sk.lift || 0,
    hairSway: .28 * W.head + (hr.sway || 0), hairFlare: hr.flare || 0, hairLift: hr.lift || 0 });
  const moves = k => !!(P[k] && (P[k].up || P[k].fore));
  const inward = k => (k === 'L' ? -1 : 1) * ((P[k].up || 0) + (P[k].fore || 0)) > 20;
  const front = ['L', 'R'].filter(k => moves(k) && !P[k].back && (inward(k) || P[k].over)), back = ['L', 'R'].filter(k => moves(k) && P[k].back);
  const garment = l => l.cat !== 'body' && l.cat !== 'acc' && !l.drawn;
  const skirty = l => l.cat === 'dress' || l.cat === 'outer' || (l.cat === 'bottom' && !(W0.bottom && PANTS_TPL.has(W0.bottom.tpl)));
  const opt = l => (garment(l) ? { garment: true, skirt: skirty(l) } : {}), FREE = { arms: false, leg: false };
  const Ls = L.slice().sort((a, b) => a.z - b.z);
  const out = Ls.map(l => ({ z: l.z, svg: warpSVG(l.svg, W, opt(l)) }));
  const hopt = l => (l.cat === 'hair' ? { ...FREE, hair: true } : FREE);
  H.forEach(l => out.push({ z: l.z, svg: warpSVG(l.svg, W, hopt(l)) }));   // 头发不被手臂带走
  // 手挡在身前：只把这只手（皮肤 + 认出来的袖子 + 手上的小物）在上层再画一遍
  front.forEach(k => {
    const re = new RegExp(`<!--arm${k}-->([\\s\\S]*?)<!--\\/arm${k}-->`, 'g');
    const bit = l => (l.cat === 'body' ? `<!--arm${k}-->${RIG.SKIN[k]()}<!--/arm${k}-->` : l.cat === 'acc' ? ((byId(l.id) || {}).sub === 'hand' ? l.svg : '') : (l.svg.match(re) || []).join(''));
    const arm = Ls.map(l => { const s = bit(l); return s ? warpSVG(s, W, opt(l)) : ''; }).join('');   // 和底下那张完全一样的变形，只是只画这只手
    out.push({ z: P[k].over ? 51 : 49.5, svg: arm });
  });
  // 背手：把整个画面（去掉背过去的手臂）在最上层再画一遍，盖住藏到身后的手
  if (back.length) {
    const m = uid('pm'), all = Ls.map(l => ({ z: l.z, svg: warpSVG(l.svg, W, { ...opt(l), arms: false }) })).concat(H.map(l => ({ z: l.z, svg: warpSVG(l.svg, W, hopt(l)) })));
    out.push({ z: 99, svg: `<mask id="${m}" maskUnits="userSpaceOnUse" x="-60" y="-60" width="420" height="740"><rect x="-60" y="-60" width="420" height="740" fill="#fff"/>${back.map(k => `<path d="${RIG.BACK[k]}" fill="#000"/>`).join('')}</mask><g mask="url(#${m})">${layersSVG(all)}</g>` });
  }
  // 包：斜挎 / 腰包不跟手臂变形；拎在手上的包整只平移到手上（小臂举过头时挂在手肘上）
  bags.forEach(l => {
    const k = HELD[l.bag];
    if (!k) { out.push({ z: front.length && l.z >= 40 ? Math.max(l.z, 49.8) : l.z, svg: warpSVG(l.svg, W, { arms: false }) }); return; }
    const A = P[k] || {}, tot = Math.abs((A.up || 0) + (A.fore || 0)), h0 = HAND[k];
    const at = tot > 100 ? sideJ(k, RIG.E) : h0, u = warpAt(W, at[0], at[1], { force: k }), dx = at[0] + u[0] - h0[0], dy = at[1] + u[1] - h0[1] + (tot > 100 ? 4 : 0);
    out.push({ z: moves(k) && !A.back && front.includes(k) ? 49.45 : l.z, svg: `<g transform="translate(${f2(dx)} ${f2(dy)})">${l.svg}</g>` });
  });
  if (P.extra) out.push({ z: 51.5, svg: P.extra });
  return layersSVG(out);
}
/* 长裤盖住鞋面：裤脚那一截再画一遍、叠在鞋子上面（原来是鞋子直接盖在裤脚上，看起来像穿模）。
   小脚裤 / 工装裤配靴子时照旧塞进靴筒里 */
const PANTS_OVER = new Set(['widePants', 'cargo', 'flareJeans', 'skinnyJeans', 'slacks', 'sashPants', 'skirtJeans', 'wideFlare', 'wrapCargo', 'balloonPants']);
const PANTS_TUCK = new Set(['skinnyJeans', 'cargo', 'wrapCargo']);
function pantsOverShoes(bottom, shoes) {
  if (!bottom || !shoes || !PANTS_OVER.has(bottom.tpl)) return [];
  const sTop = +thumbOf(shoes).split(' ')[1], boot = sTop < 505;
  if (boot && PANTS_TUCK.has(bottom.tpl)) return [];
  const y = boot ? sTop - 8 : 496;
  return partsOf(bottom).filter(p => p.z >= 15 && p.z < 30).map(p => { const id = uid('an'); return { z: 41, svg: `<clipPath id="${id}"><rect x="0" y="${y}" width="300" height="${600 - y}"/></clipPath><g clip-path="url(#${id})">${p.svg}</g>` }; });
}
function thumbSVG(it) {
  const L = partsOf(it).slice();
  if (isHead(it)) L.push({ z: 10.5, svg: headSVG() }, ...faceLayers(state.outfit.face));
  return `<svg viewBox="${thumbOf(it)}" aria-hidden="true">${layersSVG(L)}</svg>`;
}

/* 用户 DIY 面料贴图：每件 DIY 衣服一个 <pattern> */
function patHTML(id, tile, s) {
  return `<pattern id="pat-${id}" patternUnits="userSpaceOnUse" width="${s}" height="${s}"><image href="${tile}" width="${s}" height="${s}" preserveAspectRatio="none" style="image-rendering:pixelated"/></pattern>`;
}
function rebuildUserDefs() {
  let s = state.custom.filter(c => c.tile).map(c => patHTML(c.id, c.tile, c.scale || 36)).join('');
  if (typeof lab !== 'undefined' && lab.res && lab.res.tile) s += patHTML('preview', lab.res.tile, lab.scale);
  document.getElementById('userDefs').innerHTML = s;
}
