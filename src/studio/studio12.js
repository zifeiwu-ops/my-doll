/* =====================================================================
   姿势切换 + 拍照小屋
   ===================================================================== */
const POSE_KEY = 'y2k-closet-pose';
function loadPose() { try { const p = localStorage.getItem(POSE_KEY); return POSES[p] && p !== 'stand' ? p : 'relax'; } catch (e) { return 'relax'; } }
function savePose() { try { localStorage.setItem(POSE_KEY, state.pose); } catch (e) { } }
const poseChips = (cur, attr) => Object.entries(POSES).map(([k, p]) => `<button type="button" class="opt${p.isNew ? ' is-new' : ''}" role="radio" ${attr}="${k}" aria-checked="${k === cur}">${p.name}</button>`).join('');
function renderPoseRow() { const r = $('#poseRow'); if (r) r.innerHTML = poseChips(state.pose, 'data-pose'); }

/* ---------------- 场景（300 × 400） ---------------- */
function seeded(n) { let s = n; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const SCENES = {
  winter: {
    name: '冬日树影', draw() {
      const R = seeded(7); let br = '';
      for (let t = 0; t < 7; t++) {
        let x = R() * 300, y = -10 + R() * 40, a = Math.PI / 2 + (R() - .5) * 1.2, w = 9 + R() * 8, d = `M ${f1(x)} ${f1(y)}`;
        for (let i = 0; i < 9; i++) { a += (R() - .5) * .7; x += Math.cos(a) * 18; y += Math.sin(a) * 18; d += ` L ${f1(x)} ${f1(y)}`; if (R() < .45) br += `<path d="M ${f1(x)} ${f1(y)} l ${f1((R() - .5) * 60)} ${f1(-10 - R() * 30)}" stroke-width="${f1(w * .45)}"/>`; }
        br += `<path d="${d}" stroke-width="${f1(w)}"/>`;
      }
      let dots = ''; for (let i = 0; i < 90; i++) dots += `<circle cx="${f1(R() * 300)}" cy="${f1(R() * 300)}" r="${f1(1 + R() * 4)}"/>`;
      return `<rect width="300" height="400" fill="#F6FAFB"/><g fill="none" stroke="#C6D8E2" stroke-linecap="round" stroke-linejoin="round" opacity=".85" filter="url(#stRough)">${br}</g><g fill="#D3E2EA" opacity=".8">${dots}</g>` +
        `<rect y="318" width="300" height="82" fill="#FFFFFF"/><path d="M 0 318 Q 80 312 150 318 T 300 316" fill="none" stroke="#DDE8EE" stroke-width="2"/>`;
    }
  },
  classroom: {
    name: '放学教室', draw: () => `<rect width="300" height="400" fill="#F3EEDC"/><rect y="0" width="300" height="12" fill="#E4DCC2"/>` +
      `<rect x="18" y="44" width="264" height="140" rx="4" fill="#7A5A3E"/><rect x="25" y="51" width="250" height="126" fill="#3F6B57"/>` +
      `<g fill="none" stroke="#F4F1E6" stroke-linecap="round" opacity=".85"><path d="M 40 72 q 10 -8 20 0 t 20 0" stroke-width="1.6"/><path d="M 196 70 l 8 12 l 8 -12 l 8 12" stroke-width="1.4"/><path d="M 44 150 h 50 M 44 160 h 34" stroke-width="1.3"/><path d="M 226 142 c -6 -8 -18 -2 -10 8 l 10 10 l 10 -10 c 8 -10 -4 -16 -10 -8 z" stroke-width="1.4"/></g>` +
      `<rect x="25" y="177" width="250" height="6" fill="#9C7A55"/><rect x="60" y="178" width="14" height="3" rx="1" fill="#fff"/><rect x="84" y="178" width="10" height="3" rx="1" fill="#F6B6C8"/>` +
      `<rect y="300" width="300" height="100" fill="#D8B489"/><g stroke="#C29B6E" stroke-width="1.2">${[318, 340, 366, 396].map(y => `<path d="M 0 ${y} H 300"/>`).join('')}${[60, 150, 240, 20, 110, 200, 290].map((x, i) => `<path d="M ${x} ${i < 3 ? 300 : 318} v ${i < 3 ? 18 : 22}"/>`).join('')}</g>` +
      `<rect y="292" width="300" height="10" fill="#EFE6CD"/>`
  },
  sakura: {
    name: '樱花坡道', draw() {
      const R = seeded(11); let petals = '';
      for (let i = 0; i < 46; i++) { const x = R() * 300, y = R() * 380, r = 2 + R() * 2.6, a = R() * 180; petals += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * .6)}" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})"/>`; }
      const blob = (cx, cy, s) => { let d = ''; for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; d += `<circle cx="${f1(cx + Math.cos(a) * 30 * s)}" cy="${f1(cy + Math.sin(a) * 20 * s)}" r="${f1(26 * s)}"/>`; } return d; };
      return `<defs><linearGradient id="stSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3F2F8"/><stop offset="1" stop-color="#FDF1F4"/></linearGradient></defs><rect width="300" height="400" fill="url(#stSky)"/>` +
        `<path d="M 30 150 C 34 120 30 90 22 60 M 272 170 C 266 130 272 100 282 70" stroke="#8A6A5A" stroke-width="8" stroke-linecap="round" fill="none"/>` +
        `<g fill="#F8C9D6">${blob(20, 50, 1.3)}${blob(290, 60, 1.2)}</g><g fill="#FBDDE5">${blob(40, 30, .9)}${blob(262, 40, .9)}</g>` +
        `<path d="M 0 312 Q 150 296 300 312 L 300 400 L 0 400 Z" fill="#F2E4D4"/><path d="M 96 400 L 132 306 L 168 306 L 204 400 Z" fill="#EAD6C0"/><g fill="#F6B6C8" opacity=".85">${petals}</g>`;
    }
  },
  bedroom: {
    name: '我的房间', draw: () => `<defs><pattern id="stStripe" patternUnits="userSpaceOnUse" width="18" height="10"><rect width="18" height="10" fill="#FFF4F7"/><rect width="7" height="10" fill="#FBE0E8"/></pattern></defs><rect width="300" height="310" fill="url(#stStripe)"/>` +
      `<rect x="18" y="40" width="76" height="96" rx="3" fill="#DDF1F6" stroke="#fff" stroke-width="5"/><path d="M 56 40 V 136 M 18 88 H 94" stroke="#fff" stroke-width="3"/>` +
      `<path d="M 10 32 Q 30 90 22 150 L 8 150 Z M 102 32 Q 82 90 90 150 L 104 150 Z" fill="#F6B6C8"/><rect x="6" y="28" width="100" height="6" rx="3" fill="#E0668F"/>` +
      `<rect x="222" y="56" width="50" height="64" fill="#FFE9A1" stroke="#fff" stroke-width="4" transform="rotate(4 247 88)"/><path d="M 247 100 C 236 92 234 82 241 79 C 245 77 247 80 247 82 C 247 80 249 77 253 79 C 260 82 258 92 247 100 Z" fill="#F48FB1"/>` +
      `<rect y="306" width="300" height="94" fill="#E9D6C4"/><ellipse cx="150" cy="352" rx="120" ry="30" fill="#CDEBE5"/><ellipse cx="150" cy="352" rx="100" ry="22" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="6 5"/>` +
      `<rect x="214" y="236" width="86" height="80" rx="10" fill="#FFFFFF"/><rect x="214" y="224" width="86" height="22" rx="10" fill="#F9C3D5"/><circle cx="238" cy="224" r="12" fill="#FDE6EE"/>`
  },
  booth: {
    name: '大头贴机', draw() {
      let pat = ''; for (let y = 16; y < 400; y += 40) for (let x = (y / 40 % 2) * 20 + 10; x < 300; x += 40) pat += (x + y) % 80 < 40 ? `<path d="M ${x} ${y + 5} C ${x - 7} ${y} ${x - 6} ${y - 5} ${x - 2} ${y - 5} C ${x} ${y - 5} ${x} ${y - 3} ${x} ${y - 2} C ${x} ${y - 3} ${x} ${y - 5} ${x + 2} ${y - 5} C ${x + 6} ${y - 5} ${x + 7} ${y} ${x} ${y + 5} Z" fill="#fff" opacity=".7"/>` : `<path d="M ${x} ${y - 6} L ${x + 1.6} ${y - 1.6} L ${x + 6} ${y} L ${x + 1.6} ${y + 1.6} L ${x} ${y + 6} L ${x - 1.6} ${y + 1.6} L ${x - 6} ${y} L ${x - 1.6} ${y - 1.6} Z" fill="#FFF6B8" opacity=".85"/>`;
      return `<defs><linearGradient id="stBooth" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#D9C9F2"/><stop offset=".55" stop-color="#F9C3D5"/><stop offset="1" stop-color="#BDEBE3"/></linearGradient></defs><rect width="300" height="400" fill="url(#stBooth)"/>${pat}`;
    }
  },
  paper: { name: '奶油纸', draw: () => `<rect width="300" height="400" fill="#FFFBF1"/><g fill="#F6E3C4" opacity=".7">${Array.from({ length: 70 }, (_, i) => `<circle cx="${(i % 7) * 46 + (Math.floor(i / 7) % 2) * 23 + 8}" cy="${Math.floor(i / 7) * 42 + 10}" r="3"/>`).join('')}</g>` }
};

/* ---------------- 相框 ---------------- */
const FRAMES = {
  none: { name: '无', rect: [0, 0, 300, 400] },
  polaroid: { name: '拍立得', rect: [16, 16, 268, 300] },
  booth: { name: '大头贴', rect: [16, 16, 268, 368] },
  film: { name: '胶片', rect: [36, 12, 228, 376] },
  mag: { name: '杂志封面', rect: [0, 0, 300, 400] }
};
function frameSVG(k) {
  const [x, y, w, h] = FRAMES[k].rect, hole = `M ${x} ${y} h ${w} v ${h} h ${-w} Z`;
  if (k === 'polaroid') return `<path d="M 0 0 H 300 V 400 H 0 Z ${hole}" fill="#FFFEFA" fill-rule="evenodd"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#E8E0D6" stroke-width="1"/>`;
  if (k === 'booth') {
    let sc = ''; for (let i = 0; i <= 13; i++) sc += `<circle cx="${f1(16 + i * 268 / 13)}" cy="16" r="6"/><circle cx="${f1(16 + i * 268 / 13)}" cy="384" r="6"/>`;
    for (let i = 0; i <= 18; i++) sc += `<circle cx="16" cy="${f1(16 + i * 368 / 18)}" r="6"/><circle cx="284" cy="${f1(16 + i * 368 / 18)}" r="6"/>`;
    return `<path d="M 0 0 H 300 V 400 H 0 Z ${hole}" fill="#F48FB1" fill-rule="evenodd"/><g fill="#F48FB1">${sc}</g><rect x="4" y="4" width="292" height="392" rx="10" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="5 4"/>` +
      `<path d="M 262 34 C 254 28 252 20 258 17 C 261 16 263 18 263 20 C 263 18 265 16 268 17 C 274 20 272 28 262 34 Z" fill="#fff" stroke="#E0668F" stroke-width="1.2"/><path d="M 36 360 L 38.5 366 L 45 366.6 L 40 370.6 L 41.6 377 L 36 373.4 L 30.4 377 L 32 370.6 L 27 366.6 L 33.5 366 Z" fill="#FFE27A" stroke="#fff" stroke-width="1.2"/>`;
  }
  if (k === 'film') {
    let holes = ''; for (let yy = 8; yy < 400; yy += 20) holes += `<rect x="10" y="${yy}" width="14" height="10" rx="2"/><rect x="276" y="${yy}" width="14" height="10" rx="2"/>`;
    return `<path d="M 0 0 H 300 V 400 H 0 Z ${hole}" fill="#1F1B1C" fill-rule="evenodd"/><g fill="#F3EEE6">${holes}</g>`;
  }
  if (k === 'mag') return `<rect x="0" y="0" width="300" height="400" fill="none" stroke="#fff" stroke-width="8"/><g transform="translate(236 344)"><rect width="50" height="34" fill="#fff"/>${Array.from({ length: 16 }, (_, i) => `<rect x="${4 + i * 2.7}" y="4" width="${i % 3 ? 1 : 1.8}" height="22" fill="#2B2322"/>`).join('')}</g>`;
  return '';
}
/* 文字（预览里用 SVG 文字；导出时用 canvas 画，保证字体一致） */
function frameTexts(k, cap) {
  const T = [];
  if (k === 'polaroid') T.push({ x: 150, y: 358, s: 19, t: cap, c: '#4A3430', f: 'd', a: 'center' });
  else if (k === 'booth') T.push({ x: 150, y: 350, s: 22, t: cap, c: '#fff', f: 'd', a: 'center', stroke: '#E0668F' });
  else if (k === 'film') T.push({ x: 254, y: 372, s: 13, t: filmDate(), c: '#FF9A3C', f: 'm', a: 'right' });
  else if (k === 'mag') {
    T.push({ x: 150, y: 58, s: 44, t: 'MY DOLL', c: '#fff', f: 'r', a: 'center', stroke: '#E0668F' });
    T.push({ x: 18, y: 86, s: 12, t: 'ISSUE 12 · 秋冬穿搭特辑', c: '#4A3430', f: 'b', a: 'left', bg: 'rgba(255,255,255,.8)' });
    if (cap) T.push({ x: 18, y: 330, s: 18, t: cap, c: '#fff', f: 'd', a: 'left', stroke: '#4A3430' });
  } else if (cap) T.push({ x: 16, y: 384, s: 16, t: cap, c: '#fff', f: 'd', a: 'left', stroke: '#4A3430' });
  return T.filter(t => t.t);
}
const FONT = { d: '"ZCOOL KuaiLe","PingFang SC",sans-serif', r: '"Hachi Maru Pop","ZCOOL KuaiLe",sans-serif', m: '"Courier New",monospace', b: '"PingFang SC","Microsoft YaHei",sans-serif' };
function filmDate() { const d = new Date(); return `'${String(d.getFullYear()).slice(2)} ${d.getMonth() + 1} ${d.getDate()}`; }
const textSVG = T => T.map(t => { const anc = t.a === 'center' ? 'middle' : t.a === 'right' ? 'end' : 'start';
  const bg = t.bg ? `<rect x="${t.x - 4}" y="${t.y - t.s}" width="${f1(t.t.length * t.s * .78 + 8)}" height="${f1(t.s * 1.35)}" rx="3" fill="${t.bg}"/>` : '';
  return bg + `<text x="${t.x}" y="${t.y}" font-size="${t.s}" text-anchor="${anc}" fill="${t.c}" style="font-family:${FONT[t.f].replace(/"/g, "'")}"${t.stroke ? ` stroke="${t.stroke}" stroke-width="${f1(t.s / 7)}" paint-order="stroke" stroke-linejoin="round"` : ''}>${esc(t.t)}</text>`; }).join('');

/* ---------------- 滤镜 ---------------- */
const FILTERS = {
  none: { name: '原片', def: '' },
  cream: { name: '奶油', def: '<feColorMatrix type="matrix" values="1.06 .04 0 0 .03  .02 1.02 .02 0 .02  0 .02 .92 0 .03  0 0 0 1 0"/>' },
  film: { name: '胶片', def: '<feColorMatrix type="matrix" values=".9 .07 .03 0 .06  .04 .88 .06 0 .05  .04 .06 .78 0 .07  0 0 0 1 0" result="c"/><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="1" seed="4" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .45  0 0 0 0 .4  0 0 0 0 .35  0 0 0 .1 0" result="g"/><feMerge><feMergeNode in="c"/><feMergeNode in="g"/></feMerge>' },
  cool: { name: '冷调', def: '<feColorMatrix type="matrix" values=".92 0 .04 0 0  0 .98 .04 0 .01  .02 .05 1.08 0 .03  0 0 0 1 0"/>' },
  soft: { name: '柔焦', def: '<feGaussianBlur stdDeviation="2.2" result="b"/><feComponentTransfer in="b" result="b2"><feFuncA type="linear" slope=".4"/></feComponentTransfer><feBlend in="SourceGraphic" in2="b2" mode="screen"/>' },
  mono: { name: '黑白', def: '<feColorMatrix type="saturate" values="0" result="m"/><feComponentTransfer in="m"><feFuncR type="linear" slope="1.08" intercept="-.03"/><feFuncG type="linear" slope="1.08" intercept="-.03"/><feFuncB type="linear" slope="1.08" intercept="-.03"/></feComponentTransfer>' }
};
const FACES = { keep: { name: '原样', f: {} }, smile: { name: '微笑', f: { mouth: 'm2' } }, happy: { name: '开心', f: { eyes: 'e5', mouth: 'm3' } }, wow: { name: '惊讶', f: { eyes: 'e2', mouth: 'm5' } }, shy: { name: '害羞', f: { blush: 'k3', mouth: 'm4' } } };

/* ---------------- 贴纸（纯图形，导出不依赖字体） ---------------- */
const STICKERS = {
  star: `<path d="M 0 -14 L 4.1 -4.4 L 14 -4.4 L 6.1 2 L 9 12.4 L 0 6.4 L -9 12.4 L -6.1 2 L -14 -4.4 L -4.1 -4.4 Z" fill="#FFE27A" stroke="#fff" stroke-width="3.4" paint-order="stroke" stroke-linejoin="round"/>`,
  heart: `<path d="M 0 12 C -12 4 -15 -3 -11 -8 C -8 -12 -2 -11 0 -6 C 2 -11 8 -12 11 -8 C 15 -3 12 4 0 12 Z" fill="#F48FB1" stroke="#fff" stroke-width="3.4" paint-order="stroke" stroke-linejoin="round"/><path d="M -8 -5 Q -7 -8 -4 -8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`,
  sparkle: `<path d="M 0 -15 C 1.6 -4 4 -1.6 15 0 C 4 1.6 1.6 4 0 15 C -1.6 4 -4 1.6 -15 0 C -4 -1.6 -1.6 -4 0 -15 Z" fill="#FFFFFF" stroke="#9CC7F0" stroke-width="1.6"/>`,
  clover: [45, 135, 225, 315].map(a => `<path d="M 0 0 C -9 -2 -10 -12 -3 -12 C -1 -12 0 -9 0 -8 C 0 -9 1 -12 3 -12 C 10 -12 9 -2 0 0 Z" transform="rotate(${a})" fill="#6FC75A" stroke="#fff" stroke-width="2.4" paint-order="stroke"/>`).join(''),
  bow: `<path d="M 0 0 C -8 -9 -16 -7 -15 1 C -14 7 -6 6 0 2 C 6 6 14 7 15 1 C 16 -7 8 -9 0 0 Z" fill="#F7A8C8" stroke="#fff" stroke-width="3" paint-order="stroke"/><path d="M -2 2 L -7 13 M 2 2 L 7 13" stroke="#F7A8C8" stroke-width="3.2" stroke-linecap="round"/><circle r="3.2" fill="#E0668F"/>`,
  cloud: `<path d="M -14 6 C -20 6 -20 -3 -13 -3 C -13 -10 -4 -12 -1 -6 C 2 -12 12 -10 11 -3 C 18 -4 19 6 12 6 Z" fill="#fff" stroke="#BDEBE3" stroke-width="2.2" stroke-linejoin="round"/>`,
  cherry: `<path d="M -5 4 C -3 -6 2 -12 8 -14 M 5 6 C 5 -4 6 -10 8 -14" fill="none" stroke="#4E8E3A" stroke-width="1.8" stroke-linecap="round"/><circle cx="-6" cy="7" r="6" fill="#E0413C" stroke="#fff" stroke-width="2"/><circle cx="6" cy="9" r="6" fill="#E0413C" stroke="#fff" stroke-width="2"/><circle cx="-8" cy="5" r="1.6" fill="#fff"/>`,
  crown: `<path d="M -13 8 L -13 -6 L -6 1 L 0 -10 L 6 1 L 13 -6 L 13 8 Z" fill="#FFE27A" stroke="#fff" stroke-width="3" paint-order="stroke" stroke-linejoin="round"/><circle cx="0" cy="3" r="2.4" fill="#F48FB1"/>`,
  note: `<path d="M -4 8 L -4 -10 L 10 -13 L 10 5" fill="none" stroke="#B897E6" stroke-width="2.6" stroke-linejoin="round"/><ellipse cx="-7.5" cy="9" rx="4.6" ry="3.6" fill="#B897E6"/><ellipse cx="6.5" cy="6" rx="4.6" ry="3.6" fill="#B897E6"/>`,
  bubble: `<path d="M -16 -10 C -16 -15 -12 -16 -8 -16 H 10 C 14 -16 16 -14 16 -10 V 2 C 16 6 14 8 10 8 H -2 L -9 15 L -8 8 H -10 C -14 8 -16 6 -16 2 Z" fill="#fff" stroke="#4A3430" stroke-width="1.6" stroke-linejoin="round"/><path d="M 0 3 C -6 -1 -7 -5 -5 -7 C -3 -9 -1 -8 0 -6 C 1 -8 3 -9 5 -7 C 7 -5 6 -1 0 3 Z" fill="#F48FB1"/>`
};

/* ---------------- 拍照小屋 ---------------- */
const studio = { scene: 'winter', frame: 'polaroid', filter: 'none', face: 'keep', crop: 'full', pose: 'relax', stickers: [], sel: -1, cap: '', album: [], busy: false };
const ALBUM_KEY = 'y2k-closet-album';
let DL = null;
(async () => { try { DL = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { DL = null; } })();

function dollPlace(crop, rect) {
  const [x, y, w, h] = rect;
  if (crop === 'half') { const s = Math.max(w / 180, h / 250) * 1.02; return `translate(${f1(x + w / 2 - 150 * s)} ${f1(y + 16 - 50 * s)}) scale(${f1(s)})`; }
  const s = Math.min((h - 16) / 566, (w - 8) / 250); return `translate(${f1(x + w / 2 - 150 * s)} ${f1(y + h - 8 - 602 * s)}) scale(${f1(s)})`;
}
function shotInner(forExport) {
  const R = FRAMES[studio.frame].rect, [x, y, w, h] = R, c = uid('sc');
  const outfit = { ...state.outfit, face: { ...state.outfit.face, ...FACES[studio.face].f } };
  const fl = FILTERS[studio.filter].def ? ` filter="url(#stF-${studio.filter})"` : '';
  const floor = studio.crop === 'full' ? `<ellipse cx="${x + w / 2}" cy="${y + h - 10}" rx="${f1(w * .26)}" ry="7" fill="#4A3430" opacity=".08"/>` : '';
  const stickers = stickerMarkup(forExport);
  return `<defs><clipPath id="${c}"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath>${Object.entries(FILTERS).filter(([, f]) => f.def).map(([k, f]) => `<filter id="stF-${k}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">${f.def}</filter>`).join('')}` +
    `<filter id="stRough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="2" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="7"/></filter></defs>` +
    `<g clip-path="url(#${c})"><g${fl}><svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice">${SCENES[studio.scene].draw()}</svg>${floor}<g transform="${dollPlace(studio.crop, R)}"><g filter="url(#dollInk)">${dollSVG(outfit, {}, studio.pose)}</g></g></g></g>` +
    frameSVG(studio.frame) + `<g id="stLayer">${stickers}</g>`;
}
function stickerMarkup(forExport) {
  return studio.stickers.map((s, i) => `<g data-st="${i}" transform="translate(${f1(s.x)} ${f1(s.y)}) rotate(${s.r}) scale(${s.k})" style="cursor:grab">${STICKERS[s.t]}${!forExport && i === studio.sel ? `<circle r="20" fill="none" stroke="#E0668F" stroke-width="1.2" stroke-dasharray="3 2"/><g data-del="${i}" transform="translate(16 -16) scale(${f1(1 / s.k)})" style="cursor:pointer"><circle r="8" fill="#E0668F" stroke="#fff" stroke-width="2"/><path d="M -3 -3 L 3 3 M 3 -3 L -3 3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></g>` : ''}</g>`).join('');
}
function renderShot() {
  const svg = $('#shot'); if (!svg) return;
  svg.innerHTML = shotInner(false) + textSVG(frameTexts(studio.frame, studio.cap));
}
function renderStickers() { const L = $('#stLayer'); if (L) L.innerHTML = stickerMarkup(false); else renderShot(); }
function renderStudioUI() {
  const chips = (obj, cur, attr) => Object.entries(obj).map(([k, v]) => `<button type="button" class="opt${v.isNew ? ' is-new' : ''}" role="radio" ${attr}="${k}" aria-checked="${k === cur}">${v.name}</button>`).join('');
  $('#stScene').innerHTML = chips(SCENES, studio.scene, 'data-scene');
  $('#stPose').innerHTML = poseChips(studio.pose, 'data-spose');
  $('#stFace').innerHTML = chips(FACES, studio.face, 'data-sface');
  $('#stCrop').innerHTML = chips({ full: { name: '全身' }, half: { name: '半身' } }, studio.crop, 'data-crop');
  $('#stFrame').innerHTML = chips(FRAMES, studio.frame, 'data-frame');
  $('#stFilter').innerHTML = chips(FILTERS, studio.filter, 'data-filter');
  $('#stStk').innerHTML = Object.entries(STICKERS).map(([k, s]) => `<button type="button" class="stk-btn" data-add="${k}" aria-label="加贴纸"><svg viewBox="-20 -20 40 40" aria-hidden="true">${s}</svg></button>`).join('');
}
function renderAlbum() {
  const a = studio.album;
  $('#album').innerHTML = a.length ? a.map((p, i) => `<figure class="pic"><img src="${p.url}" alt="第 ${a.length - i} 张照片"><figcaption><button class="btn sm" type="button" data-save="${i}">保存</button><button class="btn sm" type="button" data-pdel="${i}">删掉</button></figcaption></figure>`).join('') : '<p class="empty">还没有照片。摆好姿势，按一下快门吧。</p>';
}
function openStudio(opener) {
  studio.opener = opener; studio.pose = state.pose; studio.sel = -1;
  if (!studio.cap) studio.cap = defaultCaption();
  $('#stCap').value = studio.cap;
  renderStudioUI(); renderShot(); renderAlbum();
  $('#studio').hidden = false; document.body.classList.add('modal-open'); $('#stClose').focus();
}
function closeStudio() { $('#studio').hidden = true; $('#bigPic').hidden = true; document.body.classList.remove('modal-open'); if (studio.opener) studio.opener.focus(); }
function defaultCaption() { const d = new Date(); return `${d.getMonth() + 1}.${d.getDate()} 今日穿搭`; }

async function shotBlob(scale = 3) {
  const defs = PATTERN_DEFS + irisDefsHTML() + (document.getElementById('userDefs') || { innerHTML: '' }).innerHTML;
  const W = 300 * scale, H = 400 * scale;
  const src = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 300 400"><defs>${defs}</defs>${shotInner(true)}</svg>`;
  const url = URL.createObjectURL(new Blob([src], { type: 'image/svg+xml' }));
  try {
    const img = new Image(); img.src = url; await img.decode();
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
    g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.drawImage(img, 0, 0, W, H);
    try { await document.fonts.ready; } catch (e) { }
    frameTexts(studio.frame, studio.cap).forEach(t => {
      g.save(); g.scale(scale, scale); g.font = `${t.s}px ${FONT[t.f]}`; g.textAlign = t.a; g.textBaseline = 'alphabetic';
      if (t.bg) { const m = g.measureText(t.t).width; g.fillStyle = t.bg; g.fillRect(t.x - 4, t.y - t.s, m + 8, t.s * 1.35); }
      if (t.stroke) { g.lineWidth = t.s / 3.5; g.lineJoin = 'round'; g.strokeStyle = t.stroke; g.strokeText(t.t, t.x, t.y); }
      g.fillStyle = t.c; g.fillText(t.t, t.x, t.y); g.restore();
    });
    const png = await new Promise((ok, no) => cv.toBlob(b => (b ? ok(b) : no(new Error('toBlob'))), 'image/png'));
    const small = document.createElement('canvas'); small.width = 450; small.height = 600; small.getContext('2d').drawImage(cv, 0, 0, 450, 600);
    return { png, jpg: small.toDataURL('image/jpeg', .86) };
  } finally { URL.revokeObjectURL(url); }
}
async function shoot() {
  if (studio.busy) return; studio.busy = true; const btn = $('#stShoot'); btn.disabled = true;
  const fl = $('#flash'); fl.classList.remove('go'); void fl.offsetWidth; fl.classList.add('go');
  try {
    const sel = studio.sel; studio.sel = -1; renderStickers();
    const { png, jpg } = await shotBlob(3);
    studio.album.unshift({ url: URL.createObjectURL(png), blob: png, jpg, t: Date.now() });
    if (studio.album.length > 12) studio.album.length = 12;
    persistAlbum(); renderAlbum(); studio.sel = sel; renderStickers();
    toast('咔嚓！照片放进相册了');
  } catch (e) { toast('这个浏览器没法生成照片，可以直接截图保存'); }
  finally { studio.busy = false; btn.disabled = false; }
}
function persistAlbum() { try { localStorage.setItem(ALBUM_KEY, JSON.stringify(studio.album.slice(0, 6).map(p => ({ jpg: p.jpg, t: p.t })))); } catch (e) { } }
function restoreAlbum() { try { const a = JSON.parse(localStorage.getItem(ALBUM_KEY) || '[]'); studio.album = a.filter(p => p && p.jpg).map(p => ({ url: p.jpg, jpg: p.jpg, t: p.t })); } catch (e) { studio.album = []; } }
const stamp = t => { const d = new Date(t); const z = n => String(n).padStart(2, '0'); return `${d.getFullYear()}${z(d.getMonth() + 1)}${z(d.getDate())}-${z(d.getHours())}${z(d.getMinutes())}${z(d.getSeconds())}`; };
async function savePic(i) {
  const p = studio.album[i]; if (!p) return;
  const data = p.blob || await (await fetch(p.jpg)).blob(), ext = p.blob ? 'png' : 'jpg';
  if (!DL) { showBig(p); return; }
  try { await DL.save({ filename: `My-doll-${stamp(p.t)}.${ext}`, data }); toast('照片已保存'); }
  catch (e) { if (e && e.code === 'declined') return; if (e && e.code === 'rate_limited') { toast('保存窗口还开着，稍等一下再试'); return; } showBig(p); }
}
function showBig(p) { $('#bigImg').src = p.url; $('#bigPic').hidden = false; $('#bigClose').focus(); }

function svgPt(svg, e) { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; return p.matrixTransform(svg.getScreenCTM().inverse()); }
function bindStudio() {
  renderPoseRow();
  $('#poseRow').addEventListener('click', e => { const b = e.target.closest('[data-pose]'); if (!b) return; state.pose = b.dataset.pose; savePose(); renderPoseRow(); renderStage(true); const again = $(`[data-pose="${state.pose}"]`); if (again) again.focus(); });
  $('#btnShot').addEventListener('click', e => openStudio(e.currentTarget));
  $('#stClose').addEventListener('click', closeStudio);
  $('#studio').addEventListener('click', e => { if (e.target.id === 'studio') closeStudio(); });
  document.addEventListener('keydown', e => { if (e.key !== 'Escape' || $('#studio').hidden) return; if (!$('#bigPic').hidden) { $('#bigPic').hidden = true; return; } closeStudio(); });
  const pick = (sel, key, attr) => $(sel).addEventListener('click', e => { const b = e.target.closest(`[${attr}]`); if (!b) return; studio[key] = b.getAttribute(attr); renderStudioUI(); renderShot(); const again = $(`${sel} [${attr}="${studio[key]}"]`); if (again) again.focus(); });
  pick('#stScene', 'scene', 'data-scene'); pick('#stPose', 'pose', 'data-spose'); pick('#stFace', 'face', 'data-sface');
  pick('#stCrop', 'crop', 'data-crop'); pick('#stFrame', 'frame', 'data-frame'); pick('#stFilter', 'filter', 'data-filter');
  $('#stStk').addEventListener('click', e => { const b = e.target.closest('[data-add]'); if (!b) return; const [x, y, w, h] = FRAMES[studio.frame].rect;
    studio.stickers.push({ t: b.dataset.add, x: x + 30 + Math.random() * (w - 60), y: y + 30 + Math.random() * (h * .55), r: Math.round((Math.random() - .5) * 30), k: +(0.9 + Math.random() * .5).toFixed(2) }); studio.sel = studio.stickers.length - 1; renderStickers(); });
  $('#stClear').addEventListener('click', () => { studio.stickers = []; studio.sel = -1; renderStickers(); });
  $('#stCap').addEventListener('input', e => { studio.cap = e.target.value.slice(0, 20); renderShot(); });
  $('#stShoot').addEventListener('click', shoot);
  $('#album').addEventListener('click', e => {
    const s = e.target.closest('[data-save]'); if (s) { savePic(+s.dataset.save); return; }
    const d = e.target.closest('[data-pdel]'); if (d) { const p = studio.album.splice(+d.dataset.pdel, 1)[0]; if (p && p.blob) URL.revokeObjectURL(p.url); persistAlbum(); renderAlbum(); }
  });
  $('#bigClose').addEventListener('click', () => { $('#bigPic').hidden = true; });
  // 贴纸拖动
  const svg = $('#shot'); let drag = null;
  svg.addEventListener('pointerdown', e => {
    const del = e.target.closest('[data-del]'); if (del) { studio.stickers.splice(+del.dataset.del, 1); studio.sel = -1; renderStickers(); e.preventDefault(); return; }
    const g = e.target.closest('[data-st]'); if (!g) { if (studio.sel !== -1) { studio.sel = -1; renderStickers(); } return; }
    const i = +g.dataset.st, p = svgPt(svg, e), s = studio.stickers[i]; drag = { i, dx: s.x - p.x, dy: s.y - p.y }; studio.sel = i; svg.setPointerCapture(e.pointerId); renderStickers(); e.preventDefault();
  });
  svg.addEventListener('pointermove', e => { if (!drag) return; const p = svgPt(svg, e), s = studio.stickers[drag.i]; s.x = Math.max(0, Math.min(300, p.x + drag.dx)); s.y = Math.max(0, Math.min(400, p.y + drag.dy)); renderStickers(); });
  const end = () => { drag = null; }; svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
  restoreAlbum();
}
