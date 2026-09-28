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
  if (it.cat === 'hair') { SOFT = .7; try { return it.parts().map(l => ({ ...l, svg: unifyHair(l.svg) })); } finally { SOFT = 0; } }
  return it.parts();
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
  const accL = [], P = pose && pose !== 'stand' ? POSES[pose] : null, rig = P && !P.warp;
  (outfit.acc || []).forEach(id => { const it = byId(id); if (it) { const Q = partsOf(it); if (isHead(it)) H.push(...Q); else if (rig && (BAGS.has(id) || it.sub === 'bag' || it.sub === 'waist')) accL.push(...Q.map(l => ({ ...l, bag: id }))); else L.push(...Q.map(l => ({ ...l, cat: 'acc', id }))); } });
  L.push(...pantsOverShoes(bottom, slot('shoes')));
  if (rig) return posedSVG(P, L, H, accL, { bottom, dress, outer: slot('outer') });
  if (P && P.warp) return warpLayers(L.concat(H), WARP_POSES[P.warp]);
  return layersSVG(L.concat(headWrap(H)));
}

/* =====================================================================
   姿势：把身体 + 衣服按关节切开再转动（肩 / 肘 / 膝 / 脖子），衣服跟着手脚一起动。
   手臂区域 = 手臂外侧到「手臂内缘 + 5」的一条带子；关节处带一个圆盘，转动时圆盘绕自己的圆心转，接缝不露白。
   角度：SVG 顺时针为正；左手（画面左）向外摆为正，向里收为负；右手相反
   ===================================================================== */
const POSES = {
  relax: { name: '自然站立', warp: 'relax' },
  shy: { name: '内八俏皮', warp: 'shy', isNew: true },
  stand: { name: '立正' },
  clasp: { name: '乖巧', head: -3, L: { fore: -38 }, R: { fore: 38 } },
  behind: { name: '背手', head: 3.5, L: { up: 5, fore: -34, back: true }, R: { up: -5, fore: 34, back: true } },
  hip: { name: '叉腰', head: -3.5, L: { up: 22, fore: -76 }, R: { up: -3 } },
  wave: { name: '打招呼', head: 4, R: { up: -14, fore: -156, over: true }, L: { up: 3 } },
  kick: { name: '踢腿', head: 3, leg: -28, L: { up: 7, fore: 6 }, R: { up: -7, fore: -6 } },
  /* Coquette 芭蕾甜心 */
  curtsy: { name: '提裙', head: -5, L: { up: 13, fore: 10 }, R: { up: -13, fore: -10 } },
  heart: { name: '比心', head: 4, L: { fore: -152 }, R: { fore: 152 }, extra: `<path d="${heartD(150, 199, 6)}" fill="#F48FB1" stroke="#fff" stroke-width="2" paint-order="stroke"/><path d="M 146.4 196 Q 147 194 149 194" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>` },
  spread: { name: '芭蕾展臂', head: -4, L: { up: 50, fore: 14 }, R: { up: -50, fore: -14 } }
};
const BAGS = new Set(['a4', 'a27', 'a33', 'a34', 'a47', 'a58', 'a42', 'a53', 'a48', 'a49', 'a50']);        // 包不跟着切，整只保留在原处
const HELD = { a47: 'L', a34: 'R', a73: 'L', a90: 'L' };                                               // 拎在手上的包跟着那只手走
const PANTS_TPL = new Set(['widePants', 'cargo', 'flareJeans', 'skinnyJeans', 'slacks', 'sashPants', 'skirtJeans', 'wideFlare', 'wrapCargo', 'balloonPants', 'shorts', 'capris', 'bermuda', 'culottes', 'beltShorts']);
const RIG = (() => {
  const yE = 266, yK = 432;
  const b = y => (y < 222 ? 121 + (armI0(222) + 5 - 121) * (y - 206) / 16 : armI0(Math.min(y, 346)) + 5);
  const arm = (y0, y1) => { const pts = [[18, y0]]; for (let y = y0; y <= y1; y += 4) pts.push([b(y), y]); pts.push([b(y1), y1], [18, y1]); return 'M ' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L ') + ' Z'; };
  const E = [(armO0(yE) + armI0(yE)) / 2, yE], rE = (armI0(yE) - armO0(yE)) / 2 + 1.8;
  const K = [300 - (legO(yK) + legI(yK)) / 2, yK], rK = (legI(yK) - legO(yK)) / 2 + 7;
  const disc = (c, r) => `M ${f1(c[0] - r)} ${f1(c[1])} a ${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0 a ${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0 Z`;
  // 腋下补片：手臂向外抬时，腋下原位置留一条窄窄的袖子内侧，免得肩膀和身体之间露出一道缝
  const gus = (() => { const a = [], c = []; for (let y = 206; y <= 244; y += 4) { a.push([b(y), y]); c.push([b(y) - 8 - (y - 206) * .12, y]); } return 'M ' + a.concat(c.reverse()).map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L ') + ' Z'; })();
  // 袖子用的上臂区域：连肩膀一起（只作用在认出来的袖子布片上，不会带走身体上的衣服）
  const uax = (() => { const pts = [[18, 150], [127, 150], [127, 206]]; for (let y = 206; y <= yE; y += 4) pts.push([b(y), y]); pts.push([b(yE), yE], [18, yE]); return 'M ' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L ') + ' Z'; })();
  // 手和袖口附近（上衣 / 外套上没被认成袖子的小零件，比如袖扣，跟着手走时在原处擦掉）
  const hand = (() => { const pts = []; for (let y = 300; y <= 328; y += 4) pts.push([armI0(y) + 1.5, y]); return `M 18 300 L ${pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L ')} L 18 328 Z`; })();
  return { yE, yK, S: [113, 198], rS: 11.5, E, rE, K, rK, UA: arm(206, yE), UAX: uax, HAND: hand, FA: arm(yE, 374), GUS: gus, LEG: `M 150.6 ${yK} L 262 ${yK} L 262 612 L 150.6 612 Z`, disc };
})();
function posedSVG(P, L, H, bags, W) {
  const sides = ['L', 'R'].filter(k => P[k]);
  // 裙子 / 连衣裙 / 长外套盖过膝盖（裤子除外）就不踢腿：直接看这一层的布片有没有伸到膝盖以下
  const reachesKnee = l => { let hit = false; l.svg.replace(/ d="([^"]*)"/g, (m, d) => { if (hit || /[a-y]/.test(d)) return m; const n = d.match(/-?\d*\.?\d+/g) || []; for (let i = 0; i + 1 < n.length; i += 2) if (+n[i + 1] > RIG.yK - 4 && +n[i] > 150.6) { hit = true; break; } return m; }); return hit; };
  const legOK = P.leg && !L.some(l => (l.cat === 'dress' || l.cat === 'outer' || (l.cat === 'bottom' && !(W.bottom && PANTS_TPL.has(W.bottom.tpl)))) && reachesKnee(l));
  const Mx = k => (k === 'L' ? d => d : mir), J = (k, p) => (k === 'L' ? p : mx(p));
  const moves = k => P[k] && (P[k].up || P[k].fore);
  const defs = [], mk = (holes) => { const m = uid('pm'); defs.push(`<mask id="${m}" maskUnits="userSpaceOnUse" x="-60" y="-60" width="420" height="740"><rect x="-60" y="-60" width="420" height="740" fill="#fff"/><g fill="#000">${holes}</g></mask>`); return m; };
  const cp = (...ds) => { const c = uid('pc'); defs.push(`<clipPath id="${c}">${ds.map(d => `<path d="${d}"/>`).join('')}</clipPath>`); return c; };
  const wrapM = (m, x) => (m ? `<g mask="url(#${m})">${x}</g>` : x), wrapC = (c, x) => `<g clip-path="url(#${c})">${x}</g>`;
  // 各区域
  const legHole = legOK ? `<path d="${RIG.LEG}"/>` : '';
  let bandHoles = '', tightHoles = '';
  sides.filter(moves).forEach(k => { const A = P[k], M = Mx(k); bandHoles += `<path d="${M(RIG.FA)}"/>` + (A.up ? `<path d="${M(RIG.UA)}"/>` : ''); tightHoles += `<path d="${M(RIG.HAND)}"/>`; });
  const mBand = (bandHoles || legHole) ? mk(bandHoles + legHole) : null, mTight = (tightHoles || legHole) ? mk(tightHoles + legHole) : null, mLeg = legHole ? mk(legHole) : null;
  const C = {};
  sides.filter(moves).forEach(k => { const M = Mx(k), S = J(k, RIG.S), E = J(k, RIG.E); C[k] = { ua: cp(M(RIG.UA), RIG.disc(S, RIG.rS)), uax: cp(M(RIG.UAX)), fa: cp(M(RIG.FA), RIG.disc(E, RIG.rE)), gus: cp(M(RIG.GUS)) }; });
  // 按层分类：身体 / 小物 → 按手臂带子切；上衣 / 外套 / 连衣裙 → 按「认出来的袖子」切；下装 / 袜子 / 鞋 → 不动
  const Ls = L.slice().sort((a, b) => a.z - b.z);
  const torso = [], U = { L: '', R: '' }, F = { L: '', R: '' }, G = { L: '', R: '' };
  Ls.forEach(l => {
    let cls = l.cat === 'body' || l.cat === 'acc' ? 'band' : 'none', seg = null;
    if (['top', 'outer', 'dress'].includes(l.cat)) {
      const A = { L: '', R: '' }; const rest = l.svg.replace(/<!--arm([LR])-->([\s\S]*?)<!--\/arm\1-->/g, (m, k, x) => { A[k] += x; return ''; });
      if (A.L || A.R) { cls = 'garment'; seg = { rest, ...A }; } else if (l.drawn) cls = 'band';
    }
    if (cls === 'none') { torso.push({ z: l.z, svg: wrapM(mLeg, l.svg) }); return; }
    if (cls === 'band') {
      torso.push({ z: l.z, svg: wrapM(mBand, l.svg) });
      sides.filter(moves).forEach(k => { if (P[k].up) { U[k] += wrapC(C[k].ua, l.svg); G[k] += wrapC(C[k].gus, l.svg); } F[k] += wrapC(C[k].fa, l.svg); });
      return;
    }
    let t = wrapM(l.cat === 'dress' ? mLeg : mTight, seg.rest);
    ['L', 'R'].forEach(k => {
      if (!seg[k]) return;
      if (!moves(k)) { t += seg[k]; return; }
      if (P[k].up) { U[k] += wrapC(C[k].uax, seg[k]); G[k] += wrapC(C[k].gus, seg[k]); } else t += wrapC(C[k].uax, seg[k]);
      F[k] += wrapC(C[k].fa, seg[k]);
    });
    torso.push({ z: l.z, svg: t });
  });
  // 没拎在手上的包（斜挎 / 腰包）画在小臂上面、前发下面，手臂转过来时不会从包里穿过去
  const out = torso.concat(bags.filter(l => !HELD[l.bag] || !moves(HELD[l.bag])).map(l => (l.z >= 40 ? { ...l, z: Math.max(l.z, 49.8) } : l)));
  sides.filter(moves).forEach(k => {
    const A = P[k], S = J(k, RIG.S), E = J(k, RIG.E);
    const tU = A.up ? `rotate(${A.up} ${f1(S[0])} ${f1(S[1])})` : '', tF = tU + (A.fore ? ` rotate(${A.fore} ${f1(E[0])} ${f1(E[1])})` : '');
    if (A.up) out.push({ z: 48.9, svg: G[k] }, { z: 49, svg: `<g transform="${tU}">${U[k]}</g>` });
    let held = bags.filter(l => HELD[l.bag] === k).map(l => l.svg).join('');
    const tot = (A.up || 0) + (A.fore || 0);
    if (held && Math.abs(tot) > 100) {   // 小臂举起来时，手提包滑到手肘上挂着（不会跟着手翻上去）
      const r = (A.up || 0) * Math.PI / 180, dx = E[0] - S[0], dy = E[1] - S[1], Ew = [S[0] + dx * Math.cos(r) - dy * Math.sin(r), S[1] + dx * Math.sin(r) + dy * Math.cos(r)], H0 = J(k, [84, 336]);
      out.push({ z: 48.95, svg: `<g transform="translate(${f1(Ew[0] - H0[0])} ${f1(Ew[1] - H0[1] + 4)})">${held}</g>` }); held = '';
    }
    out.push({ z: A.back ? 9.95 : A.over ? 51 : 49.5, svg: `<g transform="${tF}">${held}${F[k]}</g>` });   // 包画在手的下面，手指握住提手
  });
  if (legOK) { const c = cp(RIG.LEG, RIG.disc(RIG.K, RIG.rK)); out.push({ z: 43.9, svg: `<g transform="rotate(${P.leg} ${f1(RIG.K[0])} ${f1(RIG.K[1])})">${wrapC(c, Ls.map(l => l.svg).join(''))}</g>` }); }
  if (P.extra) out.push({ z: 51.5, svg: P.extra });
  const head = P.head ? H.map(l => ({ z: l.z, svg: `<g transform="rotate(${P.head} 150 152)">${l.svg}</g>` })) : H;
  return `<defs>${defs.join('')}</defs>` + layersSVG(out.concat(head));
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
