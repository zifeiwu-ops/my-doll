/* =====================================================================
   娃娃底模：直接按参考精灵图的素体描摹（约 6 头身、光头、正面、双臂自然下垂）
   画布 300 × 600（= 1024 × 2048）。头顶 y≈66，下巴 y≈153，肩 y≈172–212，腋下 y≈219，
   腰 y≈245，裆 y≈316，手腕 y≈322，指尖 y≈352，膝 y≈430，脚踝 y≈505，脚底 y≈579
   ===================================================================== */
const SKIN_LINE = '#E1A597';

/* ---------- 身体轮廓查询（给衣服版型用：衣服沿身体轮廓外扩，天然贴身） ---------- */
function profRow(y) { const r = PROF.rows[Math.round(y) - PROF.y0] || []; const s = []; for (let i = 0; i < r.length; i += 2) s.push([r[i], r[i + 1]]); return s; }
/* 躯干左边缘（肩部以上与手臂相连时 = 肩/臂外缘） */
function torsoL(y) { const s = profRow(y).find(g => g[1] >= 149); return s ? s[0] : null; }
/* 手臂 [外缘, 内缘]（腋下到指尖） */
function armLR(y) { const s = profRow(y); return s.length >= 2 ? s[0] : null; }
/* 腿 [外缘, 内缘]（裆以下） */
function legLR(y) { const s = profRow(y).filter(g => g[1] < 149); return s.length ? s[s.length - 1] : null; }
/* 在区间内按步长采样一条边：fn(y) → x，返回点列 */
function edge(fn, y0, y1, step, dx = 0) {
  const pts = [], n = Math.max(1, Math.round(Math.abs(y1 - y0) / step));
  for (let i = 0; i <= n; i++) { const y = y0 + (y1 - y0) * i / n, x = fn(y); if (x != null) pts.push([x + (typeof dx === 'function' ? dx(y, i / n) : dx), y]); }
  return pts;
}
const armO0 = y => (armLR(y) || [torsoL(y)])[0];
const armI0 = y => { const a = armLR(y); return a ? a[1] : null; };
const legO = y => (y < 316 ? torsoL(y) : (legLR(y) || [torsoL(y)])[0]);        // 裆以上是躯干（原来会误取到手臂那一段）
const legI = y => { if (y < 316) return 150; const a = legLR(y); return a ? a[1] : 150; };

/* ---------- 垂坠：布料不会贴进身体的凹处 ----------
   衣服不再沿腰窝、膝窝、脚踝的凹陷走，而是从肩 / 胸 / 臀这些「支点」自然垂下来：
   对身体轮廓取外包络（凸包），再按 D 与原轮廓混合（D = 1 完全垂直落下，0 = 完全贴身）
   out = -1 表示向画面左为外侧（左边缘），+1 表示向右为外侧（内侧边缘） */
function drapeTable(fn, y0, y1, out, D) {
  const P = [];
  for (let y = y0; y <= y1; y++) { const x = fn(y); if (x != null) P.push([y, x * -out]); }
  const H = [];
  P.forEach(p => { while (H.length >= 2) { const o = H[H.length - 2], a = H[H.length - 1]; if ((a[0] - o[0]) * (p[1] - o[1]) - (a[1] - o[1]) * (p[0] - o[0]) <= 0) H.pop(); else break; } H.push(p); });
  const T = {}; let j = 0;
  P.forEach(([y, v]) => { while (j < H.length - 2 && H[j + 1][0] < y) j++; const a = H[j], b = H[Math.min(j + 1, H.length - 1)], t = b[0] === a[0] ? 0 : (y - a[0]) / (b[0] - a[0]); const env = a[1] + (b[1] - a[1]) * Math.max(0, Math.min(1, t)); T[y] = (v + (Math.min(v, env) - v) * D) * -out; });
  const near = y => { for (let k = 0; k < 6; k++) { if ((y - k) in T) return T[y - k]; if ((y + k) in T) return T[y + k]; } return null; };
  return y => { const a = Math.floor(y), b = a + 1; if (!(a in T) || !(b in T)) { const v = fn(y); return v != null ? v : near(Math.round(y)) ?? v; } return T[a] + (T[b] - T[a]) * (y - a); };
}
const DRAPE = { torso: .78, leg: .85, legIn: .3, arm: .8 };
const silO0 = y => (y < 315 ? torsoL(y) : legO(y));
const silO = drapeTable(silO0, 220, 576, -1, DRAPE.leg);            // 躯干 + 腿外缘（衣服用）
const torsoD = y => (y >= 220 && y <= 576 ? silO(y) : torsoL(y));
const legID = drapeTable(legI, 330, 562, 1, DRAPE.legIn);            // 裤子内缝
const armO = drapeTable(armO0, 200, 346, -1, DRAPE.arm);
const armI = drapeTable(y => armI0(y), 222, 346, 1, DRAPE.arm);

function earSVG() {
  const one = (d, dd) => `<path d="${d}" fill="${SKIN}" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/><path d="${dd}" fill="${SKIN_LINE}" opacity=".9"/>`;
  return one(EAR_D, EAR_DETAIL) + one(mir(EAR_D), mir(EAR_DETAIL));
}
const HEAD_PATH = symS([[150, 65.9], [139.2, 67], [131.8, 70], [125, 74.8], [118.7, 82], [115.2, 91], [114, 103], [115, 111.5], [117.4, 119], [120.3, 126], [124.1, 134.6], [128.4, 141.6], [133.4, 146.3], [139.2, 149.8], [144.8, 152.4], [150, 154.2]], .5);
function headSVG() {
  return earSVG() + `<path d="${HEAD_PATH}" fill="${SKIN}" stroke="${INK}" stroke-width="1.05" stroke-linejoin="round"/>`;
}
function bodySVG() {
  const m = uid('m');
  return `<path d="${BODY_D}" fill="${SKIN}"/><mask id="${m}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="340" height="640"><rect x="-20" y="-20" width="340" height="640" fill="#fff"/><path d="${BODY_D}" transform="translate(-2.6 -1)" fill="#000"/></mask><path d="${BODY_D}" fill="#F7D9CF" mask="url(#${m})"/><path d="${BODY_D}" fill="none" stroke="${INK}" stroke-width="1.15" stroke-linejoin="round"/>` +
    `<path d="M 142.4 150 L 157.6 150 L 157.6 156.5 Q 150 162.5 142.4 156.5 Z" fill="#F6CCC4"/>` +
    `<path d="M 129.6 172.8 Q 137 171 144 174.4 M 170.4 172.8 Q 163 171 156 174.4" fill="none" stroke="#CFA79D" stroke-width=".8" stroke-linecap="round"/><path d="${DETAIL_SOFT}" fill="${SKIN_LINE}" opacity=".78"/><path d="${DETAIL_DARK}" fill="${INK}"/>`;
}
/* 打底：蜜桃色细吊带 + 白色安全裤（穿上衣 / 下装 / 连衣裙时自动隐藏） */
function underwearParts() {
  return [piece(CAMI_D, '#FED1B4', { rim: [3.5, 1.5], sc: '#F2C6B8', over: `<path d="${CAMI_FOLD}" fill="#C98F72" opacity=".9"/>`, sw: 1 }),
    piece(SHORTS_D, '#FFF7F1', { rim: [3.5, 1.5], sc: '#EEDFE0', over: `<path d="${SHORTS_FOLD}" fill="#B5A29C"/>`, sw: 1 })];
}

/* =====================================================================
   五官（可换）：眼睛 × 瞳色 / 眉毛 / 嘴巴 / 腮红 —— 参考图：细长杏眼、上睫毛粗、眼尾两三根翘睫毛、
   浅色大虹膜、下眼睑一小段细线、眉毛细而高、点状鼻子、极小的嘴、带小点的淡粉腮红
   左眼在画布坐标里画，右眼镜像
   ===================================================================== */
const IRIS = {
  ash: ['#857670', '#C4B7AC', '#EFE8DF'], milk: ['#8C6656', '#CFA58E', '#F4DDCB'], teal: ['#1E4E52', '#3C9A9C', '#A8E4DA'], brown: ['#3A2418', '#7A5236', '#D8AE84'],
  violet: ['#2E2552', '#6A58B0', '#C2B4F0'], grey: ['#27303F', '#5A6B8C', '#B6C6DE'], olive: ['#453A14', '#8F7E2A', '#E4D78A']
};
const EYE_KINDS = {
  e1: { O: [123.2, 121.2], I: [140.7, 121.9], top: 117.6, bot: 131.6, ir: [5.8, 6.8], icy: 125.5, lw: 1.95, flick: 'ref' },
  e2: { O: [123, 122], I: [140.8, 122.2], top: 116.2, bot: 132.2, ir: [5.8, 6.7], icy: 125.6, lw: 2.1, flick: 'up' },
  e3: { O: [122.4, 118.6], I: [140.6, 122.6], top: 117.2, bot: 130.4, ir: [5.1, 5.8], icy: 125, lw: 2.4, flick: 'wing' },
  e4: { O: [123.3, 122.4], I: [140.6, 122.6], top: 120.6, bot: 130.9, ir: [5.3, 6], icy: 125.8, lw: 2.8, flick: 'heavy' },
  e5: { smile: true }
};
const bzp = (p, t) => { const u = 1 - t; return [0, 1].map(i => u * u * u * p[0][i] + 3 * u * u * t * p[1][i] + 3 * u * t * t * p[2][i] + t * t * t * p[3][i]); };
/* 沿曲线的粗细渐变实心线（睫毛用） */
function taperedCurve(P, w0, w1, w2) {
  const N = 16, up = [], dn = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, a = bzp(P, Math.max(0, t - .01)), b = bzp(P, Math.min(1, t + .01)), c = bzp(P, t);
    const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    const w = t < .5 ? w0 + (w1 - w0) * t * 2 : w1 + (w2 - w1) * (t - .5) * 2;
    up.push([c[0] + nx * w * .5, c[1] + ny * w * .5]); dn.push([c[0] - nx * w * .5, c[1] - ny * w * .5]);
  }
  const pts = up.concat(dn.reverse());
  return 'M ' + pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L ') + ' Z';
}
function spike(x, y, dx, dy, w) {
  const L = Math.hypot(dx, dy) || 1, nx = -dy / L * w / 2, ny = dx / L * w / 2;
  return `M ${f1(x + nx)} ${f1(y + ny)} Q ${f1(x + dx * .55 + nx * .5)} ${f1(y + dy * .55 + ny * .5)} ${f1(x + dx)} ${f1(y + dy)} Q ${f1(x + dx * .55 - nx * .5)} ${f1(y + dy * .55 - ny * .5)} ${f1(x - nx)} ${f1(y - ny)} Z`;
}
const LASH = '#221A1A';
function eyeLeft(kind, iris) {
  const k = EYE_KINDS[kind] || EYE_KINDS.e1;
  if (k.smile) {
    const P = [[123.6, 123.6], [127, 118.4], [136.8, 118.2], [140.4, 123]];
    return `<path d="${taperedCurve(P, 1.4, 2.3, 1)}" fill="${LASH}"/>` + `<path d="${spike(124.2, 122.6, -3.2, -1.4, 1.3)}" fill="${LASH}"/><path d="${spike(125, 121, -2.6, -3, 1.1)}" fill="${LASH}"/>` +
      `<path d="M 128.5 127 Q 132 128.6 136 127.2" fill="none" stroke="#B89088" stroke-width=".7" stroke-linecap="round" opacity=".7"/>`;
  }
  const { O, I, top, bot } = k, id = uid('e');
  const U = [O, [O[0] + 2.4, top - .2], [I[0] - 6, top - .8], I];
  const white = `M ${O[0]} ${O[1]} C ${U[1][0]} ${U[1][1]} ${U[2][0]} ${U[2][1]} ${I[0]} ${I[1]} C ${I[0] - 1.2} ${bot - 1.2} ${O[0] + 5} ${bot + .5} ${O[0]} ${O[1]} Z`;
  const cx = 134.5, cy = k.icy, [rx, ry] = k.ir, C = IRIS[iris] || IRIS.milk;
  let s = `<clipPath id="${id}"><path d="${white}"/></clipPath><path d="${white}" fill="#fff"/>` +
    `<g clip-path="url(#${id})"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#iris-${iris in IRIS ? iris : 'milk'})" stroke="${C[0]}" stroke-width=".7"/>` +
    `<ellipse cx="${cx}" cy="${cy + .6}" rx="${f1(rx * .46)}" ry="${f1(ry * .5)}" fill="${C[0]}" opacity="${iris === 'ash' ? .32 : .55}"/>` +
    `<ellipse cx="${cx}" cy="${cy + ry * .55}" rx="${f1(rx * .62)}" ry="${f1(ry * .25)}" fill="#fff" opacity=".28"/>` +
    `<g filter="url(#soft)"><path d="M 118 108 L 146 108 L 146 ${f1(top + 2.6)} L 118 ${f1(top + 2.6)} Z" fill="#3A2A30" opacity=".35"/></g>` +
    `<ellipse cx="${f1(cx - rx * .4)}" cy="${f1(cy - ry * .42)}" rx="1.45" ry="1.7" fill="#fff"/><circle cx="${f1(cx + rx * .45)}" cy="${f1(cy + ry * .5)}" r=".75" fill="#fff" opacity=".9"/></g>`;
  // 上睫毛：外粗内细
  s += `<path d="${taperedCurve(U, k.lw * 1.05, k.lw, .7)}" fill="${LASH}"/>`;
  const f = k.flick;
  if (f === 'ref') s += `<path d="${spike(O[0] + .6, O[1] - .6, -3.6, -2, 1.5)}" fill="${LASH}"/><path d="${spike(O[0] + .5, O[1] + .2, -3.1, 1.1, 1.3)}" fill="${LASH}"/><path d="${spike(O[0] + 2.2, O[1] - 2.4, -2.2, -2.9, 1.2)}" fill="${LASH}"/><path d="${spike(I[0] - .6, I[1] - .2, 1.5, .9, .8)}" fill="${LASH}"/>`;
  if (f === 'up') s += `<path d="${spike(O[0] + .6, O[1] - .8, -3.1, -2.6, 1.4)}" fill="${LASH}"/><path d="${spike(O[0] + 2.6, O[1] - 3, -1.6, -3.2, 1.2)}" fill="${LASH}"/><path d="${spike(O[0] + 5.2, O[1] - 4.3, -.8, -3, 1)}" fill="${LASH}"/>`;
  if (f === 'wing') s += `<path d="${spike(O[0] + .4, O[1] + .2, -5, -2.8, 1.8)}" fill="${LASH}"/><path d="${spike(O[0] + 2.4, O[1] - 1.6, -2.4, -3, 1.2)}" fill="${LASH}"/>`;
  if (f === 'heavy') s += `<path d="${spike(O[0] + .6, O[1] - .3, -3.2, -.8, 1.6)}" fill="${LASH}"/><path d="${spike(O[0] + .6, O[1] + .3, -2.6, 1.6, 1.3)}" fill="${LASH}"/>`;
  // 下眼睑 + 双眼皮线
  s += `<path d="M ${f1(O[0] + 5)} ${f1(bot - .1)} Q ${f1(cx)} ${f1(bot + 1)} ${f1(I[0] - 3)} ${f1(bot - .6)}" fill="none" stroke="#8B665B" stroke-width=".85" stroke-linecap="round"/>` +
    `<path d="${spike(O[0] + 5.2, bot - .2, -1.4, 1.5, .7)}" fill="#8B665B"/>` +
    `<path d="M ${f1(O[0] + 3)} ${f1(top - 1.4)} Q ${f1(cx - 1)} ${f1(top - 3.3)} ${f1(I[0] - .4)} ${f1(I[1] - 4.2)}" fill="none" stroke="#A98A82" stroke-width=".7" stroke-linecap="round" opacity=".8"/>`;
  return s;
}
function eyeSVG(right, kind, iris) {
  const s = eyeLeft(kind, iris);
  return right ? `<g transform="translate(300 0) scale(-1 1)">${s}</g>` : s;
}
const BROWS = {
  b1: { d: 'M 124.8 110 C 128.5 107.8 136.5 107.6 141.8 110.4', w: .95 },
  b2: { d: 'M 125 111 C 128 106 136 105.6 141.6 109.8', w: 1.2 },
  b3: { d: 'M 125.4 110 C 130 110.2 137 108.4 141.4 106.4', w: 1.2 },
  b4: { fill: 'M 124.8 110.6 C 128 107 136 106.6 141.8 109.6 L 141.6 112 C 136 109.8 129 110 125.2 112.4 Z' }
};
function browSVG(kind) {
  const b = BROWS[kind] || BROWS.b1, c = '#8A7068';
  if (b.fill) return `<path d="${b.fill}" fill="${c}" opacity=".9"/><path d="${mir(b.fill)}" fill="${c}" opacity=".9"/>`;
  return [b.d, mir(b.d)].map(d => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${b.w}" stroke-linecap="round" opacity=".9"/>`).join('');
}
const MOUTHS = {
  m1: `<path d="M 148.4 143.5 Q 150 144 151.7 143.4" fill="none" stroke="#B58982" stroke-width="1.1" stroke-linecap="round"/>`,
  m2: `<path d="M 146.8 142.6 Q 150 145.6 153.2 142.6" fill="none" stroke="#B0676C" stroke-width="1.1" stroke-linecap="round"/>`,
  m3: `<path d="M 146.4 141.8 C 147 147.4 153 147.4 153.6 141.8 Q 150 142.8 146.4 141.8 Z" fill="#C4546A" stroke="${INK}" stroke-width=".9" stroke-linejoin="round"/><path d="M 148 145.2 Q 150 143.9 152 145.2 Q 150 146.6 148 145.2 Z" fill="#FF9DB1"/>`,
  m4: `<path d="M 146.2 142.6 Q 148.1 145.4 150 142.9 Q 151.9 145.4 153.8 142.6" fill="none" stroke="#A55A66" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round"/>`,
  m5: `<ellipse cx="150" cy="143.6" rx="1.7" ry="2" fill="#D86E82" stroke="${INK}" stroke-width=".8"/>`
};
const cheek = (cx, op = .55) => `<ellipse cx="${cx}" cy="136.6" rx="5.4" ry="3.2" fill="#FFB1B6" opacity="${op}" filter="url(#soft)"/>`;
const dots3 = cx => `<circle cx="${f1(cx - 1.6)}" cy="137.2" r=".55" fill="#E88F98"/><circle cx="${f1(cx + .4)}" cy="136.3" r=".55" fill="#E88F98"/><circle cx="${f1(cx + 2.2)}" cy="137.1" r=".5" fill="#E88F98" opacity=".8"/>`;
const BLUSH = {
  k1: [131.8, 168.2].map(cx => cheek(cx) + dots3(cx)).join(''),
  k2: [131.8, 168.2].map(cx => cheek(cx) + `<path d="M ${cx - 3} 135.2 l -1.5 3 M ${cx - .4} 135 l -1.5 3 M ${cx + 2.2} 135 l -1.5 3" stroke="#E27089" stroke-width=".75" stroke-linecap="round"/>`).join(''),
  k3: `<ellipse cx="150" cy="136" rx="22" ry="4" fill="#FF9EB3" opacity=".32" filter="url(#soft)"/>` + cheek(131.8, .5) + cheek(168.2, .5),
  k4: ''
};
const FACE_OPTS = {
  eyes: { label: '眼睛', vb: '119 107 62 28', items: [['e1', '杏仁眼'], ['e2', '大圆眼'], ['e3', '猫眼'], ['e4', '慵懒眼'], ['e5', '笑眼']] },
  iris: { label: '瞳色', swatch: true, items: [['ash', '浅灰棕'], ['milk', '奶茶棕'], ['teal', '湖水绿'], ['olive', '橄榄金'], ['brown', '焦糖棕'], ['violet', '葡萄紫'], ['grey', '雾灰蓝']] },
  brows: { label: '眉毛', vb: '121 101 58 16', items: [['b1', '细眉'], ['b2', '弯眉'], ['b3', '八字眉'], ['b4', '粗眉']] },
  mouth: { label: '嘴巴', vb: '141 137 18 13', items: [['m1', '小嘴'], ['m2', '微笑'], ['m3', '开心'], ['m4', '猫咪嘴'], ['m5', '惊讶']] },
  blush: { label: '腮红', vb: '120 126 60 22', items: [['k1', '点点腮红'], ['k2', '斜线腮红'], ['k3', '晒伤妆'], ['k4', '素颜']] }
};
const DEFAULT_FACE = { eyes: 'e1', iris: 'ash', brows: 'b1', mouth: 'm1', blush: 'k1' };
/* 眨眼用的闭眼：一条往下弯的睫毛线 + 眼尾两根小睫毛（平时透明，舞台上每隔几秒闪一下） */
function closedEyeLeft(kind) {
  const k = EYE_KINDS[kind] || EYE_KINDS.e1, { O, I, top, bot } = k, my = (top + bot) / 2 + 2.4;
  const P = [[O[0] - .2, O[1] + 1.8], [O[0] + 4.2, my + 1.6], [I[0] - 5.4, my + 1.4], [I[0] - .2, I[1] + 1.4]];
  return `<path d="${taperedCurve(P, k.lw * .95, k.lw * .8, .55)}" fill="${LASH}"/><path d="${spike(O[0] + .3, O[1] + 1.9, -3, 1.3, 1.2)}" fill="${LASH}"/><path d="${spike(O[0] + 1.6, O[1] + 3, -2, 2.6, 1)}" fill="${LASH}"/>`;
}
function eyesSVG(kind, iris) {
  const open = eyeSVG(false, kind, iris) + eyeSVG(true, kind, iris);
  if ((EYE_KINDS[kind] || {}).smile) return open;
  const c = closedEyeLeft(kind);
  return `<g class="eye-o">${open}</g><g class="eye-c" opacity="0">${c}<g transform="translate(300 0) scale(-1 1)">${c}</g></g>`;
}
function faceLayers(f) {
  f = { ...DEFAULT_FACE, ...(f || {}) };
  return [
    { z: 13, svg: BLUSH[f.blush] ?? '' },
    { z: 14, svg: eyesSVG(f.eyes, f.iris) + `<path d="M 150 136.4 L 150.3 137.3" fill="none" stroke="#C48E84" stroke-width="1" stroke-linecap="round"/>` + (MOUTHS[f.mouth] || MOUTHS.m1) },
    { z: 52, svg: browSVG(f.brows) }
  ];
}
function irisDefsHTML() {
  return Object.entries(IRIS).map(([k, c]) => `<linearGradient id="iris-${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset=".45" stop-color="${c[1]}"/><stop offset="1" stop-color="${c[2]}"/></linearGradient>`).join('');
}
