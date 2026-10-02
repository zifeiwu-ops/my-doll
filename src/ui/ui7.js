/* =====================================================================
   界面
   ===================================================================== */
const $ = s => document.querySelector(s);
const TABS = [['hair', '发型'], ['face', '五官'], ['top', '上衣'], ['outer', '外套'], ['bottom', '下装'], ['dress', '连衣裙'], ['legs', '袜子'], ['shoes', '鞋子'], ['acc', '小物'], ['set', '套装'], ['diy', 'DIY']];
const TAB_HINT = { set: '点一下整套换上（发型、发色、衣服、鞋子、包一起换）', hair: '选一个发型', face: '换眼睛、瞳色、眉毛、嘴巴和腮红', top: '点一下穿上，再点一次脱下', outer: '外套叠在上衣外面', bottom: '点一下穿上，再点一次脱下', dress: '穿连衣裙会自动脱掉上衣和下装', legs: '袜子和腿套可以一起穿', shoes: '点一下穿上，再点一次脱下', acc: '每个位置一次戴一件：帽子 / 发箍、发饰、耳饰、眼镜、项链、包包、手饰、腰饰、贴纸各选一件，换一件会自动摘下原来那件', diy: '用照片做的、自己画的衣服都在这里，也会出现在对应分类里' };
const KEY = 'y2k-closet-v7';
const HATS = ['a1', 'a5', 'a8', 'a12', 'a13', 'a14', 'a15', ...HATS10, ...HATS11, ...HATS13, ...HATS16];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function save() { try { localStorage.setItem(KEY, JSON.stringify({ custom: state.custom, outfit: state.outfit })); } catch (e) { } }
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (s && Array.isArray(s.custom)) state.custom = s.custom.filter(c => c && c.id && (TPL[c.tpl] || c.shape || (c.fit && c.fit.kind)) && c.color);
    if (s && s.outfit) return s.outfit;
  } catch (e) { }
  return null;
}
function cleanOutfit(o) {
  const out = { ...DEFAULT_OUTFIT, acc: [...DEFAULT_OUTFIT.acc], face: { ...DEFAULT_FACE } };
  if (!o) return out;
  if (o.face) Object.keys(FACE_OPTS).forEach(k => { if (FACE_OPTS[k].items.some(([id]) => id === o.face[k])) out.face[k] = o.face[k]; });
  /* 旧版默认五官（奶茶棕瞳）自动换成新的参考图浅灰棕瞳；自己改过的五官不动 */
  if (o.face && o.face.eyes === 'e1' && o.face.iris === 'milk' && o.face.brows === 'b1' && o.face.mouth === 'm1' && o.face.blush === 'k1') out.face.iris = 'ash';
  SLOTS.forEach(k => { if (o[k] === null || (o[k] && byId(o[k]))) out[k] = o[k]; });
  if (!byId(out.hair)) out.hair = 'h4';
  if (out.dress) { out.top = null; out.bottom = null; }
  if (Array.isArray(o.acc)) out.acc = oneEach(o.acc.filter(id => byId(id)));
  out.hairColor = /^#[0-9a-f]{6}$/i.test(o.hairColor || '') ? o.hairColor : null;
  out.scales = {}; if (o.scales) out.acc.forEach(id => { const v = +o.scales[id]; if (v >= .5 && v <= 1.8) out.scales[id] = v; });
  out.layers = {}; if (o.layers) out.acc.forEach(id => { if (ACC_LEVELS.some(([z]) => z === o.layers[id])) out.layers[id] = o.layers[id]; });
  out.offsets = {}; if (o.offsets) out.acc.forEach(id => { const v = o.offsets[id]; if (Array.isArray(v) && v.every(Number.isFinite)) out.offsets[id] = v.map(n => Math.max(-80, Math.min(80, n))); });   // 小物拖动过的位置   // 色块里的颜色，或者整套造型自带的发色
  return out;
}

function ootdText() {
  const o = state.outfit, names = SLOTS.map(k => byId(o[k])).filter(Boolean).map(i => i.name);
  if (o.acc.length) names.push(`${o.acc.length} 件小物`);
  return `<b>OOTD</b>${esc(names.join(' · '))}`;
}
function renderStage(fx) {
  $('#doll').innerHTML = `<g filter="url(#sticker)">${dollSVG(state.outfit, {}, state.pose)}</g>`;
  $('#ootd').innerHTML = ootdText();
  if (fx) { burst(); hop(); }
}
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function hop() {
  const w = $('#dollLive'); if (!w || calm()) return;
  w.classList.remove('hop'); void w.offsetWidth; w.classList.add('hop');
}
/* 眨眼：隔 2.5–6 秒随机眨一次，偶尔连眨两下 */
function blinkLoop() {
  setTimeout(() => {
    const d = $('#doll');
    if (d && !document.hidden && !calm()) {
      const once = (then) => { d.classList.add('blink'); setTimeout(() => { d.classList.remove('blink'); if (then) setTimeout(then, 150); }, 120); };
      once(Math.random() < .25 ? () => once() : null);
    }
    blinkLoop();
  }, 2500 + Math.random() * 3500);
}
function burst() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const box = $('#sparkles'), cols = ['#FFFFFF', '#FFE27A', '#F7A8C8', '#8FD9CD'];
  for (let i = 0; i < 10; i++) {
    const s = document.createElement('span'), a = (i / 10) * Math.PI * 2 + Math.random() * .5, rr = 110 + Math.random() * 90;
    s.className = 'spark';
    s.style.left = `calc(50% + ${(Math.cos(a) * rr * .55).toFixed(0)}px)`;
    s.style.top = `calc(46% + ${(Math.sin(a) * rr).toFixed(0)}px)`;
    s.style.setProperty('--c', cols[i % cols.length]); s.style.setProperty('--d', `${Math.round(Math.random() * 140)}ms`);
    box.appendChild(s); setTimeout(() => s.remove(), 1100);
  }
}
function renderTabs() {
  $('#tabs').innerHTML = TABS.map(([k, label]) => {
    const n = k === 'diy' ? state.custom.length : k === 'face' ? '' : k === 'set' ? LOOKS.length : allItems().filter(i => i.cat === k).length;
    return `<button class="tab${k === 'diy' ? ' diy' : ''}" role="tab" type="button" data-tab="${k}" aria-selected="${state.tab === k}">${label}${n === '' ? '' : `<span class="n">${n}</span>`}</button>`;
  }).join('');
  $('#tabHint').textContent = TAB_HINT[state.tab];
}
function isOn(it) { const o = state.outfit; return it.cat === 'acc' ? o.acc.includes(it.id) : o[slotOf(it)] === it.id; }
function cardHTML(it) {
  const badge = it.diy ? '<span class="badge diy">DIY</span>' : it.isNew ? '<span class="badge new">NEW</span>' : '';
  const del = it.diy ? `<button class="del" type="button" data-del="${it.id}" aria-label="删除 ${esc(it.name)}">×</button>` : '';
  return `<div class="card">${badge}<button class="card-btn" type="button" data-id="${it.id}" aria-pressed="${isOn(it)}"><span class="thumb">${thumbSVG(it)}</span><span class="nm">${esc(it.name)}</span></button>${del}</div>`;
}
function faceThumb(key, id) {
  const f = { ...state.outfit.face, [key]: id };
  return `<svg viewBox="${FACE_OPTS[key].vb}" aria-hidden="true">${layersSVG([{ z: 10.5, svg: headSVG() }, ...faceLayers(f)])}</svg>`;
}
function facePanelHTML() {
  const f = state.outfit.face;
  return Object.entries(FACE_OPTS).map(([key, g]) => {
    const items = g.swatch
      ? g.items.map(([id, name]) => `<button class="swatch" type="button" data-face="${key}" data-fid="${id}" aria-pressed="${f[key] === id}"><span style="background:linear-gradient(${IRIS[id][0]},${IRIS[id][1]} 55%,${IRIS[id][2]})"></span>${name}</button>`).join('')
      : g.items.map(([id, name]) => `<div class="card"><button class="card-btn face-btn" type="button" data-face="${key}" data-fid="${id}" aria-pressed="${f[key] === id}"><span class="thumb">${faceThumb(key, id)}</span><span class="nm">${name}</span></button></div>`).join('');
    return `<section class="fsec"><h4 class="fsec-h">${g.label}</h4><div class="${g.swatch ? 'swatches' : 'frow'}">${items}</div></section>`;
  }).join('');
}
const ADD_CARD = cat => `<div class="card card-add"><button class="card-btn" type="button" data-lab="${cat}"><span class="plus" aria-hidden="true">+</span><span class="nm">用照片做一件</span></button></div>` +
  `<div class="card card-add draw"><button class="card-btn" type="button" data-draw="${cat}"><span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 20 L5.2 15.4 L15.8 4.8 a2 2 0 0 1 2.8 0 l.6 .6 a2 2 0 0 1 0 2.8 L8.6 18.8 Z" fill="#fff" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14.2 6.4 L17.6 9.8" stroke="currentColor" stroke-width="1.6"/></svg></span><span class="nm">自己画一件</span></button></div>`;
function renderGrid() {
  const t = state.tab;
  let html;
  if (t === 'face') html = facePanelHTML();
  else if (t === 'hair') html = hairColorRow() + filterBarHTML(t) + allItems().filter(i => i.cat === t && passFilter(i)).map(cardHTML).join('');
  else if (t === 'acc') html = accPanelHTML();
  else if (t === 'set') html = setPanelHTML();
  else if (t === 'diy') html = ADD_CARD('top') + (state.custom.length ? state.custom.map(cardHTML).join('') : '<p class="empty">还没有 DIY 的衣服。用一张照片做一件，或者直接在娃娃身上画一件。</p>');
  else {
    html = filterBarHTML(t) + WARDROBE.filter(i => i.cat === t && passFilter(i)).map(cardHTML).join('') + state.custom.filter(i => i.cat === t && passFilter(i)).map(cardHTML).join('');
    if (['top', 'outer', 'bottom', 'dress'].includes(t)) html += ADD_CARD(t);
  }
  $('#grid').innerHTML = html;
}
/* 发色：发型分类最上面一排色块，「原色」就是每款发型自己的颜色 */
function hairColorRow() {
  const cur = state.outfit.hairColor || null;
  return `<div class="hair-colors" role="radiogroup" aria-label="发色"><span class="hc-label">发色</span>` +
    `<button type="button" class="hc hc-orig" data-hc="" role="radio" aria-checked="${!cur}" title="原色"><span>原色</span></button>` +
    HAIR_COLORS.map(([c, n]) => `<button type="button" class="hc" data-hc="${c}" role="radio" aria-checked="${cur === c}" title="${n}" aria-label="${n}" style="--c:${c}"></button>`).join('') + '</div>';
}
/* ---------- 衣橱筛选：系列（IP）/ 颜色 / 风格；选了系列时最上面一排是这个系列的整套造型，点一下全身换上 ---------- */
const COLOR_DOT = { 奶油白: '#FBF4DE', 酷黑: '#2A2528', 银灰: '#C8C6CE', 炭灰: '#6A666C', 樱花粉: '#F7B8CC', 樱桃红: '#D8323C', 蜜桃粉: '#F8C4A8', 焦糖棕: '#8A5A3A', 蜜桃橘: '#F29A5A', 卡其: '#A89A6A', 柠檬黄: '#F6E27A', 薄荷绿: '#A8E6C8', 抹茶绿: '#5E9A5A', 汽水蓝: '#7ED6E0', 牛仔蓝: '#6F92BC', 天空蓝: '#8EC0E6', 香芋紫: '#B9A0E0', 泡泡粉: '#F4AFC8', 芭比粉: '#E0508A' };
const flt = () => (state.filter = state.filter || { ip: '', color: '', style: '' });
function passFilter(it) { const f = flt(); if (it.o) return (!f.ip || it.ip === f.ip) && (!f.color || lookColor(it) === f.color) && (!f.style || lookStyle(it).includes(f.style)); return (!f.ip || it.ip === f.ip) && (!f.color || colorOf(it) === f.color) && (!f.style || styleOf(it).includes(f.style)); }
function filterBarHTML(t, list) {
  const f = flt(), items = list || allItems().filter(i => i.cat === t);
  const chip = (k, v, label, n) => `<button type="button" class="opt" data-flt="${k}" data-v="${v}" aria-pressed="${f[k] === v}">${label}${n != null ? `<span class="n">${n}</span>` : ''}</button>`;
  const cOf = i => (i.o ? lookColor(i) : colorOf(i)), sOf = i => (i.o ? lookStyle(i) : styleOf(i));
  const ORD = Object.keys(IP_LABEL), ips = [...new Set(items.map(i => i.ip).filter(Boolean))].sort((a, b) => ORD.indexOf(a) - ORD.indexOf(b)), cols = [...new Set(items.map(cOf).filter(Boolean))], sts = STYLE_RULES.map(([k]) => k).filter(k => items.some(i => sOf(i).includes(k)));
  const row = (label, body) => `<div class="flt-row"><span class="flt-label">${label}</span><div class="flt-opts">${body}</div></div>`;
  const on = ['ip', 'color', 'style'].filter(k => f[k]).length;
  return `<div class="flt${state.fltOpen ? ' open' : ''}"><button type="button" class="flt-toggle" data-flttoggle aria-expanded="${!!state.fltOpen}">筛选${on ? `<span class="n">${on}</span>` : ''} ▾</button><div class="flt-body">` +
    row('系列', chip('ip', '', '全部') + ips.map(k => chip('ip', k, IP_LABEL[k] || k, items.filter(i => i.ip === k).length)).join('')) +
    (cols.length > 1 ? row('颜色', `<button type="button" class="opt" data-flt="color" data-v="" aria-pressed="${!f.color}">全部</button>` + cols.map(c => `<button type="button" class="cdot" data-flt="color" data-v="${c}" aria-pressed="${f.color === c}" title="${c}" aria-label="${c}" style="--c:${COLOR_DOT[c] || '#ccc'}"></button>`).join('')) : '') +
    (sts.length ? row('风格', chip('style', '', '全部') + sts.map(k => chip('style', k, k)).join('')) : '') +
    `</div></div>` + (items.some(passFilter) ? '' : '<p class="empty">这个分类里没有符合筛选的单品。</p>');
}
/* ---------- 套装分区：只有这里筛出来的是完整套装；套装的颜色 = 主件（连衣裙 / 上衣）的颜色，风格 = 各件风格合起来 ---------- */
const lookMain = L => byId(L.o.dress || L.o.top || L.o.outer);
const lookColor = L => { const m = lookMain(L); return m ? colorOf(m) : null; };
const lookStyle = L => [...new Set(['dress', 'top', 'outer', 'bottom', 'shoes'].map(k => byId(L.o[k])).filter(Boolean).flatMap(styleOf))];
function setPanelHTML() {
  const shown = LOOKS.filter(passFilter);
  return filterBarHTML('set', LOOKS) + (shown.length ? shown.map(L => `<div class="card look-card"><button type="button" class="card-btn" data-look="${LOOKS.indexOf(L)}" aria-label="换上整套：${L.name}"><span class="thumb"><svg viewBox="60 30 180 570" aria-hidden="true">${dollSVG({ ...state.outfit, ...L.o, face: state.outfit.face }, {}, null)}</svg></span><span class="nm">${L.name}</span>${L.ip ? `<span class="look-ip">${IP_LABEL[L.ip] || L.ip}</span>` : ''}</button></div>`).join('') : '');
}
/* 小物按分区显示：全部时每个分区一个小标题 */
function accPanelHTML() {
  const items = allItems().filter(i => i.cat === 'acc' && passFilter(i)), cur = state.accSub || 'all';
  const chips = `<div class="subtabs" role="toolbar" aria-label="小物分区">` + [['all', '全部', items.length], ...ACC_GROUPS.map(([k, n]) => [k, n, items.filter(i => i.sub === k).length])]
    .map(([k, n, c]) => `<button type="button" class="opt" data-sub="${k}" aria-pressed="${k === cur}">${n}<span class="n">${c}</span></button>`).join('') + '</div>';
  const groups = cur === 'all' ? ACC_GROUPS : ACC_GROUPS.filter(([k]) => k === cur);
  return filterBarHTML('acc') + chips + groups.map(([k, n]) => { const L = items.filter(i => i.sub === k); return L.length ? `<p class="subhead">${n}<span>${L.length} 件</span></p>` + L.map(cardHTML).join('') : ''; }).join('');
}
/* 小物的「位置」：参考同类换装游戏，每个位置一次只戴一件（帽子和发箍都戴在头顶，算同一个位置） */
const accSlot = it => (!it ? '' : HATS.includes(it.id) ? 'hat' : it.sub || 'waist');
function oneEach(ids) { const seen = new Set(); return ids.slice().reverse().filter(id => { const s = accSlot(byId(id)); if (seen.has(s)) return false; seen.add(s); return true; }).reverse(); }
function toggle(it) {
  const o = state.outfit;
  const k = slotOf(it);
  if (it.cat === 'acc') {
    const i = o.acc.indexOf(it.id);
    if (i >= 0) o.acc.splice(i, 1);
    else { const s = accSlot(it); o.acc = o.acc.filter(a => accSlot(byId(a)) !== s); o.acc.push(it.id); }   // 同一个位置只能戴一件，换一件会把原来那件摘下
  }
  else if (k === 'hair') o.hair = it.id;
  else {
    o[k] = o[k] === it.id ? null : it.id;
    if (o[k] && k === 'dress') { o.bottom = null; if (!keepsTop(it)) o.top = null; }
    if (o[k] && k === 'bottom') o.dress = null;
    if (o[k] && k === 'top' && !keepsTop(byId(o.dress))) o.dress = null;
  }
  save(); renderStage(isOn(it)); renderGrid();
}
function randomize() {
  const pick = a => a[Math.floor(Math.random() * a.length)], of = c => allItems().filter(i => i.cat === c);
  const face = {}; Object.entries(FACE_OPTS).forEach(([k, g]) => { face[k] = pick(g.items)[0]; });
  const useDress = Math.random() < .25, socks = of('legs').filter(i => !i.slot), acc = oneEach(of('acc').filter(i => !HATS.includes(i.id) && Math.random() < .12).map(i => i.id));
  if (Math.random() < .45) acc.push(pick(HATS));
  state.outfit = { hair: pick(of('hair')).id, top: useDress ? null : pick(of('top')).id, outer: Math.random() < .3 ? pick(of('outer')).id : null, bottom: useDress ? null : pick(of('bottom')).id, dress: useDress ? pick(of('dress')).id : null,
    legs: Math.random() < .55 ? pick(socks).id : null, warmer: Math.random() < .25 ? 'l3' : null, shoes: pick(of('shoes')).id, acc, face };
  save(); renderStage(true); renderGrid();
}
let toastT;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2600); }

/* ---------------- DIY 实验室 ---------------- */
const lab = { ui: 'fit', fit: null, fitAuto: null, fitInfo: '', P: null, M: null, kind: '', res: null, tpl: 'hoodie', mode: 'pattern', scale: 30, name: '', nameTouched: false, sample: '', opener: null };
const CAT_NAME = { top: '上衣', outer: '外套', bottom: '下装', dress: '连衣裙' };
const SWATCHES = ['#F7B2CC', '#F48FB1', '#FFE27A', '#BFEBE4', '#8FD9CD', '#A7D1EE', '#C9AEF2', '#FBF6E6', '#CDB994', '#9A6448', '#6F92BC', '#2E2A30'];
const LAB_DEFAULT = { top: 'hoodie', outer: 'puffJacket', bottom: 'shorts', dress: 'denimDress' };
const CAT_LABEL = { top: 'TOP', outer: 'OUTER', bottom: 'BOTTOM', dress: 'DRESS' };
const KIND_TEXT = {
  auto: '已经自动框出衣服',
  closeup: '看起来是布料特写，整张都当作面料',
  fallback: '没找到明显的衣服轮廓，先取了照片中间',
  tap: '按你点的位置重新框好了',
  swatch: '用了你选的颜色'
};
function previewItem() {
  if (!lab.res) return null;
  if (lab.ui === 'fit' && lab.trace) return traceItem('preview', '预览');
  if (lab.ui === 'fit') return lab.fit ? { id: 'preview', diy: true, cat: FIT.catOf(lab.fit), fit: lab.fit, thumb: FIT.thumb(lab.fit), name: '预览', mode: lab.mode, color: lab.res.color, tile: lab.res.tile, scale: lab.scale } : null;
  if (lab.ui === 'draw') return dr.shape ? { id: 'preview', diy: true, cat: dr.cat, shape: dr.shape, lines: dr.lines, thumb: dr.thumb, name: '预览', mode: lab.mode, color: lab.res.color, tile: lab.res.tile, scale: lab.scale } : null;
  return { id: 'preview', diy: true, cat: TPL[lab.tpl].cat, tpl: lab.tpl, name: '预览', mode: lab.mode, color: lab.res.color, tile: lab.res.tile, scale: lab.scale };
}
function autoName() { return lab.res ? `${colorName(lab.res.color)}${lab.mode === 'pattern' && lab.res.tile ? '印花' : ''}${lab.ui === 'fit' && lab.trace ? '照片版' + FIT2.NAME[lab.trace.kind] : lab.ui === 'fit' && lab.fit ? FIT.name(lab.fit) : lab.ui === 'draw' ? '手绘' + CAT_NAME[dr.cat] : TPL[lab.tpl].name}` : ''; }
function openLab(cat, opener, ui) {
  lab.opener = opener || null;
  lab.ui = ui === 'draw' ? 'draw' : ui === 'tpl' ? 'tpl' : 'fit';
  lab.catHint = cat;
  if (LAB_DEFAULT[cat] && TPL[lab.tpl].cat !== cat) lab.tpl = LAB_DEFAULT[cat];
  if (lab.ui === 'draw' && DRAW_VIEW[cat] && dr.cat !== cat) { dr.cat = cat; dr.strokes = []; rebuildDrawn(); }
  $('#lab').hidden = false; document.body.classList.add('modal-open');
  if (!lab.nameTouched && lab.res) lab.name = autoName();
  if (!lab.res && lab.ui === 'draw') useSwatch(SWATCHES[0]);
  else if (!lab.res) loadSample(cat === 'bottom' || cat === 'dress' ? 'floral' : 'plaid'); else refreshLab();
  $('#labClose').focus();
}
function closeLab() {
  $('#lab').hidden = true; document.body.classList.remove('modal-open');
  if (lab.opener && document.body.contains(lab.opener)) lab.opener.focus();
}
function loadSource(src, sample) {
  lab.P = V.prep(src); lab.sample = sample || '';
  const r = V.autoMask(lab.P); lab.M = r.M; lab.kind = r.kind;
  runExtract();
}
function loadSample(kind) { loadSource(sampleImage(kind), kind); }
function useSwatch(c) {
  lab.P = null; lab.M = null; lab.sample = ''; lab.kind = 'swatch';
  lab.res = { mode: 'solid', color: c, palette: [c], tile: null }; lab.mode = 'solid';
  if (!lab.fit) { lab.fit = FIT.params(null); lab.fitAuto = { ...lab.fit }; lab.fitInfo = 'none'; }
  if (!lab.nameTouched) lab.name = autoName();
  refreshLab();
}
function setLabUI(ui) {
  lab.ui = ui; if (ui === 'draw' && !dr.strokes.length) rebuildDrawn();
  if (!lab.nameTouched) lab.name = autoName();
  refreshLab();
}
function runFit() {
  const ok = lab.P && lab.M && lab.kind !== 'closeup' && lab.kind !== 'fallback', f = ok ? FIT.analyze(lab.M, lab.P.W, lab.P.H) : null;
  if (f) { lab.fit = FIT.params(f); lab.fitInfo = 'ok'; }
  else { lab.fit = FIT.params(null); lab.fitInfo = ok ? 'none' : lab.kind === 'closeup' ? 'closeup' : 'none'; const k = { top: 'top', outer: 'outer', dress: 'dress', bottom: 'skirt' }[lab.catHint]; if (k && k !== 'top') fitKind(k); }
  lab.fitAuto = { ...lab.fit };
  // 有照片轮廓：直接描照片里那件衣服的形状（参数版只在看不到整件衣服时兜底）
  lab.tr = ok && f ? { kind: f.kind, auto: f.kind, ease: 1, len: 1, lines: !(lab.res && lab.res.mode === 'pattern') } : null;   // 印花布上到处都是边，默认不描线
  buildTrace();
}
function buildTrace() {
  lab.trace = null;
  if (!lab.tr || !lab.P || !lab.M) return;
  try { lab.trace = FIT2.build(lab.P, lab.M, lab.tr.kind, { ease: lab.tr.ease, len: lab.tr.len, lines: lab.tr.lines }); } catch (e) { lab.trace = null; }
}
const traceItem = (id, name) => { const t = lab.trace; return { id, diy: true, cat: t.cat, shape: t.shape, lines: t.lines, thumb: t.thumb, pantsShape: t.pants || undefined, name, mode: lab.mode, color: lab.res.color, tile: lab.res.tile, scale: lab.scale }; };
const FIT_LEN = { top: [236, 340], outer: [250, 470], dress: [300, 540], skirt: [312, 560], pants: [330, 567] };
function fitKind(k) {
  const p = lab.fit; if (!p || p.kind === k) return; const was = p.kind; p.kind = k;
  if (k === 'pants') { p.hem = p.hem > 400 ? 567 : 350; p.leg = p.leg || 1; }
  else if (k === 'skirt') { if (was !== 'pants') p.hem = 345; p.flare = p.flare > 4 ? p.flare : 16; }
  else { p.neck = p.neck || 'crew'; p.sleeve = p.sleeve ?? 1; p.sw = p.sw || .5; p.nw = p.nw || .3; p.flare = p.flare ?? 0; p.waist = p.waist || 0;
    const [lo, hi] = FIT_LEN[k]; p.hem = k === 'dress' ? Math.max(p.hem || 0, 400) : Math.min(hi, Math.max(lo, (was === 'dress' || was === 'skirt' || was === 'pants') ? (k === 'outer' ? 320 : 300) : p.hem)); }
  p.hem = Math.max(FIT_LEN[k][0], Math.min(FIT_LEN[k][1], p.hem));
}
function renderFit() {
  const T = lab.trace, chipsT = (o, cur, at) => Object.entries(o).map(([k, n]) => `<button type="button" role="radio" ${at}="${k}" aria-checked="${k === cur}">${n}</button>`).join('');
  ['#fitNeckRow', '#fitSlvRow', '#fitSwRow', '#fitWaistRow'].forEach(k => { $(k).hidden = !!T; });
  $('#fitLinesRow').hidden = !T; $('#fitTraceNote').hidden = !T; $('#fitParamNote').hidden = !!T;
  if (T) {
    $('#fitRes').innerHTML = `照着照片里这件衣服的轮廓裁好了<span class="tag">${FIT2.NAME[T.kind]}</span>` + (T.lines.length ? `<span class="tag">描了 ${T.lines.length} 条线</span>` : '') + (lab.tr.kind !== lab.tr.auto ? `<span class="tag">类型已手动改</span>` : '');
    $('#fitKind').innerHTML = chipsT(FIT2.NAME, lab.tr.kind, 'data-fk');
    $('#fitLenL').textContent = '长度'; $('#fitFlL').textContent = '宽松';
    $('#fitLen').value = Math.round((lab.tr.len - .75) / .5 * 100); $('#fitFl').value = Math.round((lab.tr.ease - .8) / .45 * 100);
    $('#fitLenV').textContent = lab.tr.len > 1.04 ? '加长' : lab.tr.len < .96 ? '改短' : '照片原样'; $('#fitFlV').textContent = lab.tr.ease > 1.04 ? '放宽' : lab.tr.ease < .96 ? '收窄' : '照片原样';
    $('#fitLines').checked = lab.tr.lines;
    return;
  }
  $('#fitLenL').textContent = '长度';
  const p = lab.fit; if (!p) return;
  const msg = { ok: '照片里量出来的版型', none: '没认出明显的衣服轮廓，先给了一件基础款，可以手动调', closeup: '这张是布料特写，看不到整件衣服的形状，先给了一件基础款' }[lab.fitInfo] || '';
  $('#fitRes').innerHTML = `${msg}：` + FIT.describe(p).map(t => `<span class="tag">${t}</span>`).join('') + `<span class="tag">${FIT.KIND_N[p.kind]}</span>`;
  const chips = (o, cur, at) => Object.entries(o).map(([k, n]) => `<button type="button" role="radio" ${at}="${k}" aria-checked="${k === cur}">${n}</button>`).join('');
  $('#fitKind').innerHTML = chips(FIT.KIND_N, p.kind, 'data-fk');
  const upper = p.kind !== 'skirt' && p.kind !== 'pants';
  $('#fitNeckRow').hidden = !upper; $('#fitSlvRow').hidden = !upper || p.neck === 'strap'; $('#fitSwRow').hidden = !upper || p.neck === 'strap' || p.sleeve < .05; $('#fitWaistRow').hidden = p.kind !== 'dress';
  if (upper) $('#fitNeck').innerHTML = chips(FIT.NECK_N, p.neck, 'data-fn');
  $('#fitSlv').value = Math.round((p.sleeve || 0) * 100); $('#fitSw').value = Math.round((p.sw || .5) * 100);
  const [lo, hi] = FIT_LEN[p.kind]; $('#fitLen').value = Math.round((p.hem - lo) / (hi - lo) * 100);
  $('#fitFlL').textContent = p.kind === 'pants' ? '裤腿' : '下摆';
  $('#fitFl').value = p.kind === 'pants' ? Math.round((p.leg - .5) / 1.3 * 100) : Math.round(((p.flare || 0) + 2) / 72 * 100);
  $('#fitWaist').checked = !!p.waist;
  const D = FIT.describe(p);
  $('#fitSlvV').textContent = p.sleeve < .05 ? '无袖' : p.sleeve < .36 ? '短袖' : p.sleeve < .7 ? '中袖' : '长袖';
  $('#fitSwV').textContent = p.sw > .8 ? '宽松' : p.sw < .42 ? '贴身' : '常规';
  $('#fitLenV').textContent = D[upper ? 2 : 0] || ''; $('#fitFlV').textContent = upper ? (p.waist ? '收腰' : D[3]) : D[1];
}
function fitChanged() { if (!lab.nameTouched) lab.name = autoName(); refreshLab(); }
function runExtract() {
  lab.res = V.extract(lab.P, lab.M, lab.kind);
  runFit();
  lab.mode = lab.res.mode;
  if (!lab.nameTouched) lab.name = autoName();
  refreshLab();
}
function drawPhoto() {
  const P = lab.P, cv = $('#photoCv'), wrap = $('#photoWrap');
  if (!P) { wrap.hidden = true; return; }
  wrap.hidden = false;
  const dw = Math.max(200, wrap.clientWidth || 360), dh = Math.round(dw * P.sh / P.sw), dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(dw * dpr); cv.height = Math.round(dh * dpr);
  const x = cv.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(P.src, 0, 0, cv.width, cv.height);
  const ov = mkCanvas(P.W, P.H), oc = ov.getContext('2d'), id = oc.createImageData(P.W, P.H), M = lab.M, W = P.W, H = P.H;
  for (let yy = 0; yy < H; yy++) for (let xx = 0; xx < W; xx++) {
    const i = yy * W + xx;
    if (!M[i]) { id.data[i * 4] = 74; id.data[i * 4 + 1] = 52; id.data[i * 4 + 2] = 48; id.data[i * 4 + 3] = 140; }
    else if ((xx > 0 && !M[i - 1]) || (xx < W - 1 && !M[i + 1]) || (yy > 0 && !M[i - W]) || (yy < H - 1 && !M[i + W])) { id.data[i * 4] = 255; id.data[i * 4 + 1] = 255; id.data[i * 4 + 2] = 255; id.data[i * 4 + 3] = 255; }
  }
  oc.putImageData(id, 0, 0);
  x.imageSmoothingEnabled = false; x.drawImage(ov, 0, 0, cv.width, cv.height);
}
function renderTplRow() {
  const pv = previewItem();
  const ORDER = { top: 0, outer: 1, bottom: 2, dress: 3 };
  $('#tplRow').innerHTML = Object.entries(TPL).sort((a, b) => ORDER[a[1].cat] - ORDER[b[1].cat]).map(([k, t]) => {
    const it = pv ? { ...pv, tpl: k, cat: t.cat } : { id: 'blank', white: true, cat: t.cat, tpl: k };
    return `<button class="tpl" type="button" role="radio" data-tpl="${k}" aria-checked="${lab.tpl === k}"><svg viewBox="${t.thumb}" aria-hidden="true">${t.back ? t.back(resolveFill(it)) : ''}${t.render(resolveFill(it))}</svg><span>${t.name}</span><span class="cat">${CAT_LABEL[t.cat]}</span></button>`;
  }).join('');
  const sel = $('#tplRow [aria-checked="true"]'); if (sel) sel.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}
function refreshLab() {
  rebuildUserDefs();
  const draw = lab.ui === 'draw', fit = lab.ui === 'fit';
  $('#tplPane').hidden = draw || fit; $('#drawPane').hidden = !draw; $('#fitPane').hidden = !fit;
  // 照片识别版型：上传照片是第一步，放在最上面；其它方式里照片只是面料，回到「选面料」里
  const pb = $('#photoBlock'), home = fit ? $('#fitPhoto') : $('#photoHome'); if (pb && home && pb.parentNode !== home) home.appendChild(pb);
  $('#fabricH').innerHTML = fit ? '<b>3</b>面料：自动取自上面的照片，也可以直接选颜色' : '<b>2</b>选面料：放一张衣服照片，或直接选颜色';
  $('#previewH').innerHTML = fit ? '<b>4</b>看看效果' : '<b>3</b>看看效果';
  document.querySelectorAll('#labModes [data-ui]').forEach(b => b.setAttribute('aria-selected', b.dataset.ui === lab.ui));
  $('#labTitle').textContent = draw ? '自己画版型' : fit ? '照片识别版型' : '照片做衣服';
  if (fit) renderFit(); else if (!draw) renderTplRow();
  const has = !!lab.res;
  $('#btnAdd').disabled = !has || (draw && !dr.shape);
  $('#tapHint').hidden = !has || !lab.P;
  document.querySelectorAll('#swatchRow [data-sw]').forEach(b => b.setAttribute('aria-pressed', lab.kind === 'swatch' && lab.res && lab.res.color === b.dataset.sw));
  $('#sampleTag').hidden = !lab.sample;
  if (!has) return;
  drawPhoto();
  const nColors = lab.res.palette.length;
  $('#status').className = 'status';
  $('#status').textContent = lab.kind === 'swatch' ? `用了你选的颜色「${colorName(lab.res.color)}」。想要印花的话，放一张照片进来。` : `${KIND_TEXT[lab.kind]}，提取到 ${nColors} 种颜色，判断为${lab.res.mode === 'pattern' ? '印花' : '纯色'}。`;
  $('#palette').innerHTML = lab.res.palette.map(c => `<span class="chip" style="background:${c}" title="${c}"></span>`).join('');
  document.querySelectorAll('#fabricSeg button').forEach(b => { b.setAttribute('aria-checked', b.dataset.mode === lab.mode); if (b.dataset.mode === 'pattern') b.disabled = !lab.res.tile; });
  $('#scaleRow').hidden = lab.mode !== 'pattern' || !lab.res.tile;
  $('#scale').value = lab.scale;
  $('#itemName').value = lab.name;
  const cat = draw ? dr.cat : fit ? (lab.trace ? lab.trace.cat : FIT.catOf(lab.fit)) : TPL[lab.tpl].cat;
  const svg = $('#labDoll'); svg.setAttribute('viewBox', draw ? (dr.thumb || DRAW_VIEW[cat].join(' ')) : fit ? (lab.trace ? lab.trace.thumb : FIT.thumb(lab.fit)) : TPL[lab.tpl].thumb);
  if (draw) drawRender();
  const over = cat === 'dress' ? { dress: previewItem() } : cat === 'outer' ? { outer: previewItem() } : { [cat]: previewItem(), dress: null };
  svg.innerHTML = dollSVG(state.outfit, over);
}
function addToCloset() {
  if (!lab.res) return;
  const id = 'u' + Date.now().toString(36), name = (lab.name.trim() || autoName()).slice(0, 16);
  let it;
  if (lab.ui === 'fit' && lab.trace) it = traceItem(id, name);
  else if (lab.ui === 'fit') { if (!lab.fit) return; it = { id, diy: true, cat: FIT.catOf(lab.fit), fit: { ...lab.fit }, thumb: FIT.thumb(lab.fit), name, mode: lab.mode, color: lab.res.color, tile: lab.res.tile, scale: lab.scale }; }
  else if (lab.ui === 'draw') { if (!dr.shape) return; it = { id, diy: true, cat: dr.cat, shape: dr.shape, lines: dr.lines, thumb: dr.thumb, name, mode: lab.mode, color: lab.res.color, tile: lab.res.tile, scale: lab.scale }; }
  else { const t = TPL[lab.tpl]; it = { id, diy: true, cat: t.cat, tpl: lab.tpl, name, mode: lab.mode, color: lab.res.color, tile: lab.res.tile, scale: lab.scale }; }
  state.custom.push(it); state.outfit[it.cat] = id;
  if (it.cat === 'dress') { state.outfit.top = null; state.outfit.bottom = null; }
  if (it.cat === 'top' || it.cat === 'bottom') state.outfit.dress = null;
  lab.nameTouched = false; lab.name = autoName();
  save(); rebuildUserDefs(); closeLab();
  state.tab = 'diy'; renderTabs(); renderGrid(); renderStage(true);
  toast(`「${it.name}」放进衣橱了，已经穿上`);
}
function deleteCustom(id) {
  state.custom = state.custom.filter(c => c.id !== id);
  ['top', 'outer', 'bottom', 'dress'].forEach(k => { if (state.outfit[k] === id) state.outfit[k] = null; });
  save(); rebuildUserDefs(); renderTabs(); renderGrid(); renderStage(false);
  toast('删掉了');
}
function readFile(file) {
  if (!file) return;
  if (!/^image\//.test(file.type)) { showErr('这不是图片文件，换一张 JPG 或 PNG 试试。'); return; }
  const url = URL.createObjectURL(file), img = new Image();
  img.onload = () => { lab.nameTouched = false; loadSource(img, ''); URL.revokeObjectURL(url); };
  img.onerror = () => { showErr('这张照片打不开（可能是 HEIC 格式），换一张 JPG 或 PNG 试试。'); URL.revokeObjectURL(url); };
  img.src = url;
}
function showErr(msg) { const s = $('#status'); s.className = 'status err'; s.textContent = msg; }

/* ---------------- 事件 ---------------- */
function bind() {
  $('#tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (!b) return; state.tab = b.dataset.tab; renderTabs(); renderGrid(); $('#grid').scrollTop = 0; const t = $(`[data-tab="${state.tab}"]`); if (t && t.scrollIntoView) t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); });   // 手机上分类是一行横着滑的：点到的那个滑进来
  $('#tabs').addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = TABS.findIndex(t => t[0] === state.tab), j = (i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length;
    state.tab = TABS[j][0]; renderTabs(); renderGrid(); $(`[data-tab="${state.tab}"]`).focus();
  });
  $('#grid').addEventListener('click', e => {
    const del = e.target.closest('[data-del]');
    if (del) {
      if (del.dataset.armed) { deleteCustom(del.dataset.del); return; }
      del.dataset.armed = '1'; del.textContent = '删除?';
      setTimeout(() => { if (del.isConnected) { delete del.dataset.armed; del.textContent = '×'; } }, 3000);
      return;
    }
    const fb = e.target.closest('[data-face]');
    if (fb) {
      state.outfit.face[fb.dataset.face] = fb.dataset.fid; save(); renderStage(false); renderGrid();
      const again = $(`[data-face="${fb.dataset.face}"][data-fid="${fb.dataset.fid}"]`); if (again) again.focus();
      return;
    }
    const labBtn = e.target.closest('[data-lab]'); if (labBtn) { openLab(labBtn.dataset.lab, labBtn, 'fit'); return; }
    const drawBtn = e.target.closest('[data-draw]'); if (drawBtn) { openLab(drawBtn.dataset.draw, drawBtn, 'draw'); return; }
    if (e.target.closest('[data-flttoggle]')) { state.fltOpen = !state.fltOpen; renderGrid(); return; }
    const fb2 = e.target.closest('[data-flt]'); if (fb2) { const f = flt(); f[fb2.dataset.flt] = f[fb2.dataset.flt] === fb2.dataset.v ? '' : fb2.dataset.v; renderGrid(); const again = $(`[data-flt="${fb2.dataset.flt}"][data-v="${fb2.dataset.v}"]`); if (again) again.focus(); return; }
    const lk = e.target.closest('[data-look]'); if (lk) { const L = LOOKS[+lk.dataset.look]; state.outfit = cleanOutfit({ ...state.outfit, ...L.o, face: state.outfit.face }); save(); renderStage(true); renderGrid(); return; }
    const hc = e.target.closest('[data-hc]'); if (hc) { state.outfit.hairColor = hc.dataset.hc || null; save(); renderStage(false); renderGrid(); const again = $(`[data-hc="${hc.dataset.hc}"]`); if (again) again.focus(); return; }
    const sb = e.target.closest('[data-sub]'); if (sb) { state.accSub = sb.dataset.sub; renderGrid(); const again = $(`[data-sub="${state.accSub}"]`); if (again) again.focus(); return; }
    const b = e.target.closest('[data-id]'); if (!b) return;
    const it = byId(b.dataset.id); if (it) { toggle(it); const again = $(`[data-id="${it.id}"]`); if (again) again.focus(); }
  });
  $('#btnRandom').addEventListener('click', randomize);
  $('#btnReset').addEventListener('click', () => { state.outfit = cleanOutfit(null); save(); renderStage(true); renderGrid(); });

  $('#labClose').addEventListener('click', closeLab);
  $('#lab').addEventListener('click', e => { if (e.target.id === 'lab') closeLab(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('#lab').hidden) closeLab(); });
  $('#tplRow').addEventListener('click', e => { const b = e.target.closest('[data-tpl]'); if (!b) return; lab.tpl = b.dataset.tpl; if (!lab.nameTouched) lab.name = autoName(); refreshLab(); });
  $('#file').addEventListener('change', e => { readFile(e.target.files[0]); e.target.value = ''; });
  const drop = $('#drop');
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', e => readFile(e.dataTransfer.files[0]));
  document.querySelectorAll('[data-sample]').forEach(b => b.addEventListener('click', () => { lab.nameTouched = false; loadSample(b.dataset.sample); }));
  $('#photoCv').addEventListener('click', e => {
    if (!lab.P) return;
    const r = e.currentTarget.getBoundingClientRect();
    const tx = Math.max(0, Math.min(lab.P.W - 1, Math.floor((e.clientX - r.left) / r.width * lab.P.W)));
    const ty = Math.max(0, Math.min(lab.P.H - 1, Math.floor((e.clientY - r.top) / r.height * lab.P.H)));
    const m = V.tapMask(lab.P, tx, ty); lab.M = m.M; lab.kind = m.kind; runExtract();
  });
  document.querySelectorAll('#fabricSeg button').forEach(b => b.addEventListener('click', () => { lab.mode = b.dataset.mode; if (!lab.nameTouched) lab.name = autoName(); refreshLab(); }));
  $('#fitKind').addEventListener('click', e => { const b = e.target.closest('[data-fk]'); if (b && lab.trace) { lab.tr.kind = b.dataset.fk; buildTrace(); fitChanged(); return; } if (b) { fitKind(b.dataset.fk); fitChanged(); } });
  $('#fitNeck').addEventListener('click', e => { const b = e.target.closest('[data-fn]'); if (b) { lab.fit.neck = b.dataset.fn; fitChanged(); } });
  $('#fitSlv').addEventListener('input', e => { lab.fit.sleeve = +e.target.value / 100; fitChanged(); });
  $('#fitSw').addEventListener('input', e => { lab.fit.sw = +e.target.value / 100; fitChanged(); });
  $('#fitLen').addEventListener('input', e => { if (lab.trace) { lab.tr.len = .75 + .5 * e.target.value / 100; buildTrace(); fitChanged(); return; } const [lo, hi] = FIT_LEN[lab.fit.kind]; lab.fit.hem = Math.round(lo + (hi - lo) * e.target.value / 100); fitChanged(); });
  $('#fitFl').addEventListener('input', e => { if (lab.trace) { lab.tr.ease = .8 + .45 * e.target.value / 100; buildTrace(); fitChanged(); return; } const v = +e.target.value / 100; if (lab.fit.kind === 'pants') lab.fit.leg = +(.5 + v * 1.3).toFixed(2); else lab.fit.flare = Math.round(-2 + v * 72); fitChanged(); });
  $('#fitWaist').addEventListener('change', e => { lab.fit.waist = e.target.checked ? 1 : 0; fitChanged(); });
  $('#fitLines').addEventListener('change', e => { if (!lab.tr) return; lab.tr.lines = e.target.checked; buildTrace(); fitChanged(); });
  $('#fitReset').addEventListener('click', () => { if (lab.tr) { Object.assign(lab.tr, { kind: lab.tr.auto, ease: 1, len: 1, lines: !(lab.res && lab.res.mode === 'pattern') }); buildTrace(); fitChanged(); return; } if (lab.fitAuto) { lab.fit = { ...lab.fitAuto }; fitChanged(); } });
  $('#labModes').addEventListener('click', e => { const b = e.target.closest('[data-ui]'); if (b && b.dataset.ui !== lab.ui) setLabUI(b.dataset.ui); });
  $('#swatchRow').innerHTML = '<span>直接选颜色：</span>' + SWATCHES.map(c => `<button class="sw" type="button" data-sw="${c}" aria-pressed="false" aria-label="${colorName(c)}" style="background:${c}"></button>`).join('');
  $('#swatchRow').addEventListener('click', e => { const b = e.target.closest('[data-sw]'); if (b) useSwatch(b.dataset.sw); });
  bindDraw();
  $('#scale').addEventListener('input', e => { lab.scale = +e.target.value; refreshLab(); });
  $('#itemName').addEventListener('input', e => { lab.name = e.target.value; lab.nameTouched = true; });
  $('#btnAdd').addEventListener('click', addToCloset);
  bindStudio();
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (!$('#lab').hidden && lab.res) drawPhoto(); }, 150); });
}

function boot(data) {
  const saved = load();
  state.outfit = cleanOutfit((data && data.outfit) || saved);
  state.pose = (data && POSES[data.pose]) ? data.pose : loadPose();
  if (data && data.tab) state.tab = data.tab;
  document.getElementById('irisDefs').innerHTML = irisDefsHTML();
  document.getElementById('patDefs').innerHTML = PATTERN_DEFS;
  rebuildUserDefs(); renderTabs(); renderGrid(); renderStage(false); bind(); blinkLoop();
  try { window.claude?.hot?.snapshot?.(() => ({ outfit: state.outfit, tab: state.tab, pose: state.pose })); } catch (e) { }
}
if (window.claude?.hot?.ready) window.claude.hot.ready(boot); else boot(window.claude?.hot?.data ?? {});

/* ---------------- 舞台缩放：双指捏 / 滚轮 / 按钮放大缩小，放大后单指拖着看，双击还原 ---------------- */
(() => {
  const stage = document.querySelector('.stage'), el = $('#doll'); if (!stage || !el) return;
  const Z = { s: 1, x: 0, y: 0 }, MAX = 4;
  const wrap = el.parentNode, base = () => ({ w: wrap.clientWidth || 1, h: wrap.clientHeight || 1 });   // #doll 铺满 .doll-live（SVG 没有 offsetWidth）
  const apply = () => { const { w, h } = base(); Z.s = Math.max(1, Math.min(MAX, Z.s)); Z.x = Math.min(0, Math.max(w * (1 - Z.s), Z.x)); Z.y = Math.min(0, Math.max(h * (1 - Z.s), Z.y));
    el.style.transform = Z.s === 1 ? '' : `translate(${Z.x}px, ${Z.y}px) scale(${Z.s})`; stage.classList.toggle('zoomed', Z.s > 1); };
  // 以屏幕上的点 (cx, cy) 为中心缩放到 s
  const zoomAt = (s, cx, cy) => { const r = wrap.getBoundingClientRect(), px = cx - r.left, py = cy - r.top, k = Math.max(1, Math.min(MAX, s)) / Z.s;
    Z.x = px - (px - Z.x) * k; Z.y = py - (py - Z.y) * k; Z.s *= k; apply(); };
  const center = () => { const r = stage.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * .42]; };
  $('#zIn').addEventListener('click', () => zoomAt(Z.s * 1.4, ...center()));
  $('#zOut').addEventListener('click', () => zoomAt(Z.s / 1.4, ...center()));
  $('#zFit').addEventListener('click', () => { Z.s = 1; Z.x = Z.y = 0; apply(); });
  stage.addEventListener('wheel', e => { e.preventDefault(); zoomAt(Z.s * Math.exp(-e.deltaY * .0022), e.clientX, e.clientY); }, { passive: false });
  const P = new Map(); let pinch = null, last = 0;
  const skip = e => e.target.closest('button');
  stage.addEventListener('pointerdown', e => { if (skip(e)) return; P.set(e.pointerId, [e.clientX, e.clientY]); try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    if (P.size === 2) { const [a, b] = [...P.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, s: Z.s }; }
    if (P.size === 1) { const now = Date.now(); if (now - last < 300) { if (Z.s > 1) { Z.s = 1; Z.x = Z.y = 0; apply(); } else zoomAt(2.2, e.clientX, e.clientY); } last = now; } });
  stage.addEventListener('pointermove', e => { if (!P.has(e.pointerId)) return; const prev = P.get(e.pointerId); P.set(e.pointerId, [e.clientX, e.clientY]);
    if (P.size >= 2 && pinch) { const [a, b] = [...P.values()]; zoomAt(pinch.s * (Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d), (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); }
    else if (P.size === 1 && Z.s > 1) { Z.x += e.clientX - prev[0]; Z.y += e.clientY - prev[1]; apply(); } });
  const up = e => { P.delete(e.pointerId); if (P.size < 2) pinch = null; };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  addEventListener('resize', apply);
})();

/* ---------------- 拖动调整小物位置：点 ✥ 进入，点舞台上的小物（或上面的名字）选中，拖着挪；每件单独记住位置 ---------------- */
(() => {
  const stage = document.querySelector('.stage'), bar = $('#adjBar'), btn = $('#adjBtn'); if (!stage || !bar || !btn) return;
  const A = { on: false, sel: null, drag: null };
  const worn = () => state.outfit.acc.filter(id => byId(id));
  // 当前层级：玩家设过就用设的；没设过就按这件小物本来的 z 找最近的一档
  const levelIdx = () => { const L = state.outfit.layers || {}, z = L[A.sel] != null ? L[A.sel] : Math.max(...partsOf(byId(A.sel)).map(l => l.z)); let k = 0; ACC_LEVELS.forEach(([v], i) => { if (Math.abs(v - z) < Math.abs(ACC_LEVELS[k][0] - z)) k = i; }); return k; };
  const curLevel = () => ACC_LEVELS[levelIdx()][1];
  const scaleBy = f => { const S = (state.outfit.scales = state.outfit.scales || {}); S[A.sel] = Math.max(.5, Math.min(1.8, +((S[A.sel] || 1) * f).toFixed(3))); if (Math.abs(S[A.sel] - 1) < .01) delete S[A.sel]; save(); renderStage(false); paint(); };
  const paint = () => {
    const L = worn(); if (A.sel && !L.includes(A.sel)) A.sel = null; if (!A.sel) A.sel = L[L.length - 1] || null;
    bar.innerHTML = L.length ? `<b>拖动调整</b>` + L.map(id => `<button type="button" class="opt" data-adj="${id}" aria-pressed="${A.sel === id}">${byId(id).name}</button>`).join('') +
      (A.sel ? `<span class="adj-lv"><button type="button" class="opt" data-adjz="-1" aria-label="往后一层">↓ 往后</button><span class="adj-lvn">${curLevel()}</span><button type="button" class="opt" data-adjz="1" aria-label="往前一层">往前 ↑</button></span>` : '') +
      (A.sel ? `<span class="adj-lv"><button type="button" class="opt" data-adjs="-1" aria-label="缩小">－</button><span class="adj-lvn">大小 ${Math.round(((state.outfit.scales || {})[A.sel] || 1) * 100)}%</span><button type="button" class="opt" data-adjs="1" aria-label="放大">＋</button></span>` : '') +
      `<button type="button" class="opt" data-adjreset>还原</button><button type="button" class="opt adj-done" data-adjdone>完成</button>`
      : `<b>还没有戴小物</b>先去「小物」里选一件，再回来拖动<button type="button" class="opt adj-done" data-adjdone>完成</button>`;
  };
  const set = on => { A.on = on; bar.hidden = !on; btn.setAttribute('aria-pressed', on); stage.classList.toggle('adjusting', on); if (on) paint(); };
  btn.addEventListener('click', () => set(!A.on));
  bar.addEventListener('click', e => {
    const b = e.target.closest('[data-adj]'); if (b) { A.sel = b.dataset.adj; paint(); return; }
    if (e.target.closest('[data-adjreset]') && A.sel) { delete state.outfit.offsets[A.sel]; delete (state.outfit.layers || {})[A.sel]; delete (state.outfit.scales || {})[A.sel]; save(); renderStage(false); paint(); return; }
    const sb2 = e.target.closest('[data-adjs]'); if (sb2 && A.sel) { scaleBy(+sb2.dataset.adjs > 0 ? 1.08 : 1 / 1.08); return; }
    const zb = e.target.closest('[data-adjz]');
    if (zb && A.sel) { const i = levelIdx(), j = Math.max(0, Math.min(ACC_LEVELS.length - 1, i + +zb.dataset.adjz)); (state.outfit.layers = state.outfit.layers || {})[A.sel] = ACC_LEVELS[j][0]; save(); renderStage(false); paint(); return; }
    if (e.target.closest('[data-adjdone]')) set(false);
  });
  let raf = 0;
  const T = new Map(); let pinch0 = null;
  stage.addEventListener('pointerdown', e => { if (A.on) { T.set(e.pointerId, [e.clientX, e.clientY]); if (T.size === 2 && A.sel) { const [a, b] = [...T.values()]; pinch0 = { d: Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, k: (state.outfit.scales || {})[A.sel] || 1 }; A.drag = null; } } }, true);
  stage.addEventListener('pointermove', e => { if (!A.on || !T.has(e.pointerId)) return; T.set(e.pointerId, [e.clientX, e.clientY]); if (pinch0 && T.size === 2) { e.stopImmediatePropagation(); const [a, b] = [...T.values()], S = (state.outfit.scales = state.outfit.scales || {}); S[A.sel] = Math.max(.5, Math.min(1.8, pinch0.k * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch0.d)); if (!raf) raf = requestAnimationFrame(() => { raf = 0; renderStage(false); }); } }, true);
  const tEnd = e => { T.delete(e.pointerId); if (pinch0 && T.size < 2) { pinch0 = null; save(); paint(); } };
  stage.addEventListener('pointerup', tEnd, true); stage.addEventListener('pointercancel', tEnd, true);
  stage.addEventListener('pointerdown', e => {
    if (!A.on || e.target.closest('button, .adj-bar') || T.size > 1) return;
    const g = e.target.closest('[data-acc]'); if (g) { A.sel = g.dataset.acc; paint(); }
    if (!A.sel) return;
    const m = $('#doll').getScreenCTM(); if (!m) return;
    const o = (state.outfit.offsets = state.outfit.offsets || {})[A.sel] || [0, 0];
    A.drag = { x: e.clientX, y: e.clientY, k: m.a || 1, o: o.slice() };
    try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    e.preventDefault(); e.stopImmediatePropagation();
  }, true);
  stage.addEventListener('pointermove', e => {
    if (!A.on || !A.drag || pinch0) return; e.stopImmediatePropagation();
    const d = A.drag, v = [d.o[0] + (e.clientX - d.x) / d.k, d.o[1] + (e.clientY - d.y) / d.k].map(n => Math.max(-80, Math.min(80, n)));
    state.outfit.offsets[A.sel] = v;
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; renderStage(false); });
  }, true);
  const end = e => { if (!A.drag) return; A.drag = null; save(); e.stopImmediatePropagation(); };
  stage.addEventListener('pointerup', end, true); stage.addEventListener('pointercancel', end, true);
  stage.addEventListener('wheel', e => { if (!A.on) return; e.stopImmediatePropagation(); e.preventDefault(); if (A.sel) scaleBy(Math.exp(-e.deltaY * .0015)); }, { capture: true, passive: false });   // 调整模式里滚轮 = 缩放选中的小物
  const rg = renderGrid; renderGrid = function () { rg.apply(this, arguments); if (A.on) paint(); };   // 换了小物，名字列表跟着更新
})();

/* ---------------- 拍照小屋的设置签：一次只展开一项，照片一直看得见 ---------------- */
(() => {
  const bar = $('#stTabs'); if (!bar) return;
  const rows = [...document.querySelectorAll('.st-panel .st-row')], album = document.querySelector('.album-wrap');
  const items = rows.map(r => [r, r.querySelector('.row-label').textContent.trim()]).concat(album ? [[album, '相册']] : []);
  let cur = 0;
  const show = i => { cur = i; items.forEach(([el], k) => el.classList.toggle('st-off', k !== i)); bar.innerHTML = items.map(([, n], k) => `<button type="button" class="st-tab" role="tab" data-sttab="${k}" aria-selected="${k === i}">${n}</button>`).join(''); };
  bar.addEventListener('click', e => { const b = e.target.closest('[data-sttab]'); if (b) show(+b.dataset.sttab); });
  show(0);
  // 拍完照自动切到「相册」，看得到刚拍的那张
  const sh = $('#stShoot'); if (sh && album) sh.addEventListener('click', () => setTimeout(() => show(items.length - 1), 900));
})();

/* ---------------- 娃娃的名字（标题旁的丝带）：自己取名，存在本机 ---------------- */
(() => {
  const el = $('#dollName'), K = 'y2k-closet-name'; if (!el) return;
  const fit = () => { el.style.width = `calc(${f1(Math.max(4, [...(el.value || el.placeholder)].reduce((w, ch) => w + (ch.charCodeAt(0) < 256 ? .66 : 1.14), 0)))}em + 44px)`; };   // 字宽 + 丝带左右留白
  try { el.value = localStorage.getItem(K) || ''; } catch (e) { }
  fit();
  el.addEventListener('input', () => { fit(); try { localStorage.setItem(K, el.value.trim()); } catch (e) { } });
  el.addEventListener('keydown', e => { if (e.key === 'Enter') el.blur(); });
})();

/* ---------------- 本期上新（滚动公告条）：改这里的清单就行；go = 点了跳到哪个分区，或者 shot 拍照 / adj 调位置 ---------------- */
const NEWS = [
  ['西部 / 冬日 / 田园系列细节升级：领子、门襟、口袋、流苏、蕾丝边、麻花纹、袖口逐件还原', 'set'],
  ['姿势大改：重心腿 + 放松腿、上身倾斜，新增踮脚、跳起来、走路、转圈圈等 11 个姿势', 'shot'],
  ['照片识别版型升级：直接描照片里衣服的轮廓，荷叶边、泡泡袖、不规则下摆都照着来', 'diy'],
  ['拍照小屋上新 5 个主题：蝴蝶标本、水钻大头贴、天使和纸、薄荷手账、泪滴星夜', 'shot'],
  ['田园针织上新：费尔岛背心、贝雷帽、麻花毛衣等 8 套', 'set'],
  ['冬日甜心上新：豹纹毛领、棕色花苞裙、雪花缎面裙等 4 套 + 西部 2 套', 'set'],
  ['西部波西米亚第三批：鱼尾牛仔、薄荷印花、亚麻西装等 10 套', 'set'],
  ['西部波西米亚第二批：流苏麂皮、薄荷缎面、波点背心裙等 10 套', 'set'],
  ['西部波西米亚上新：10 套绣花牛仔、流苏、牛仔靴造型', 'set'],
  ['摇滚学院上新：斜肩印花卫衣 + 灰格百褶裙', 'set'],
  ['偶像私服系列上新：8 套整套造型', 'set'], ['新增「套装」分区，点一下换上整套', 'set'], ['发型可以换 13 种发色', 'hair'],
  ['小物可以拖动位置、调上下层级（舞台右下角 ✥）', 'adj'], ['拍照小屋升级：照片一直在眼前，设置一次一项', 'shot'],
  ['初始居家服：奶油小背心 + 抽绳短裤 + 毛绒拖鞋', 'bottom'], ['衣橱可以按 系列 / 颜色 / 风格 筛选', 'top'], ['给娃娃取个名字吧（标题旁边的丝带）', 'name']
];
(() => {
  const tr = $('#tkTrack'); if (!tr) return;
  const one = NEWS.map(([t, go]) => `<button type="button" class="tk-item" data-go="${go}">${t}</button>`).join('');
  tr.innerHTML = one + `<span aria-hidden="true" style="display:contents">${one.replace(/<button /g, '<button tabindex="-1" ')}</span>`;   // 复制一份，首尾接上无缝滚动
  tr.addEventListener('click', e => {
    const b = e.target.closest('[data-go]'); if (!b) return; const g = b.dataset.go;
    if (g === 'shot') return $('#btnShot').click();
    if (g === 'adj') return $('#adjBtn').click();
    if (g === 'name') return $('#dollName').focus();
    state.tab = g; renderTabs(); renderGrid(); const c = document.querySelector('.closet'); if (c && c.scrollIntoView) c.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
})();
