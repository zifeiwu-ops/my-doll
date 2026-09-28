/* =====================================================================
   联动：偶像活动（Aikatsu!）风格的 8 套私服造型 —— 按参考图的搭配思路用本作的版型重画（不描原图）
   每件衣服带 ip / 风格标签；衣橱里可以按「系列 / 颜色 / 风格」筛选，选了系列还能一键换上整套造型
   ===================================================================== */
PATTERN_DEFS += `
<pattern id="pat-navydotsW" patternUnits="userSpaceOnUse" width="18" height="18"><rect width="18" height="18" fill="#2E2E5E"/><circle cx="4.5" cy="4.5" r="3.6" fill="#FBFAF4"/><circle cx="13.5" cy="13.5" r="3.6" fill="#FBFAF4"/></pattern>
<pattern id="pat-violetfloral" patternUnits="userSpaceOnUse" width="30" height="30"><rect width="30" height="30" fill="#5646A6"/>${_flower5(8, 8, 5.4, '#F6E08A', '#FFFFFF')}${_flower5(22, 21, 4.6, '#FFFFFF', '#F6E08A')}${_flower5(24, 6, 2.6, '#B9A8F0', '#FFFFFF')}${_flower5(6, 24, 3, '#F6E08A', '#FFFFFF')}<ellipse cx="15" cy="13" rx="2.4" ry="1" fill="#7EA0D8" transform="rotate(-30 15 13)"/></pattern>
<pattern id="pat-greengingham" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="8" height="8" fill="#F2FAEC"/><rect width="4" height="8" fill="#5EB85A" opacity=".55"/><rect width="8" height="4" fill="#5EB85A" opacity=".55"/></pattern>
<pattern id="pat-harlequin" patternUnits="userSpaceOnUse" width="16" height="16" patternTransform="rotate(30)"><rect width="16" height="16" fill="#FBF6F0"/><rect x="1" y="1" width="6" height="6" fill="#7ED6E0"/><rect x="9" y="9" width="6" height="6" fill="#7ED6E0"/><rect x="9" y="1" width="6" height="6" fill="#EE5AA6"/><rect x="1" y="9" width="6" height="6" fill="#F6E88A"/></pattern>
<pattern id="pat-yellowblossom" patternUnits="userSpaceOnUse" width="34" height="34"><rect width="34" height="34" fill="#F8E878"/>${_flower5(9, 10, 6.4, '#FFFFFF', '#F6C8D8')}${_flower5(26, 26, 5.6, '#FFFFFF', '#F6C8D8')}</pattern>
<pattern id="pat-floraldenim" patternUnits="userSpaceOnUse" width="24" height="24"><rect width="24" height="24" fill="#4E6EB0"/><path d="M-2 2 L2 -2 M0 8 L8 0 M4 12 L12 4 M8 16 L16 8 M12 20 L20 12 M16 24 L24 16" stroke="#6A88C4" stroke-width=".6"/>${_flower5(7, 7, 3.2, '#F2A8C0', '#FFFFFF')}${_flower5(18, 17, 2.6, '#F2A8C0', '#FFFFFF')}</pattern>
<pattern id="pat-sheerblue" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="6" height="6" fill="#DDF0FA"/><circle cx="3" cy="3" r=".7" fill="#FFFFFF"/></pattern>`;
Object.assign(PAT_BASE, { navydotsW: '#C8CCDA', violetfloral: '#4A4690', greengingham: '#8ACB84', harlequin: '#B8C0D6', sheerblue: '#DDF0FA', yellowblossom: '#F8E878', floraldenim: '#4E6EB0' });

/* ---------- 这批造型专用的三个版型 ---------- */
Object.assign(TPL, {
  maxiSlip: {
    cat: 'dress', name: '及踝吊带长裙', thumb: '70 160 160 400',
    render(F) {   // 缎面吊带裙的上身 + 一直垂到脚踝的伞摆，下摆一道金边
      const top = 196, strapX = 128.4, bod = symS([[150, top + 7], [140, top + 1.6], [strapX - .5, top - 1.4, 'c'], [strapX - 4.4, top + 9], [sideX(222) - 1.4, 222], [sideX(240) - .8, 240], [sideX(256) - 1.6, 256], [sideX(264) - 2.2, 264, 'c'], [150, 266]]);
      const sk = flare18({ top: 258, dip: 2, e: 2.4, hem: 520, flare: 34, hipY: 310, n: 6, amp: 5, curve: 8 });
      const st = 'M 128.4 197 L 129.2 170.6', trim = F.rib || '#E8C25A';
      const hemLine = 'M ' + sk.H.map(p => P2([p[0], p[1] - 2.6])).join(' L ');
      return strap(st, F.fill, 1.8) + strap(mir(st), F.fill, 1.8) +
        pc(sk.d, F.fill, { folds: sk.folds, cel: sk.cel.concat(sk.lining), autoFolds: false, lines: [{ d: hemLine, c: trim, w: 3.2, o: 1 }] }) + pc(bod, F.fill, { cel: [`M 125 201 Q 138 203.6 150 206.4 Q 162 203.6 175 201 L 175 203.4 Q 162 207 150 209.6 Q 138 207 125 203.4 Z`] });
    }
  },
  sailorVestDress: {
    cat: 'dress', name: '水手领背心连衣裙', thumb: '72 150 156 220',
    render(F) {   // 白色无袖水手领背心（红扣）叠在大波点伞裙上，领口一个绿色领结
      const vest = tankD({ top: 184, strapX: 131, e: 3, hem: 262, hemE: 3.4, dip: 16, curve: 3 });
      const sk = flare18({ top: 256, dip: 2, e: 2.6, hem: 352, flare: 20, hipY: 300, n: 5, amp: 3.6, curve: 5.4 });
      const col = spline([[131, 184, 'c'], [150, 202, 'c'], [150, 212], [136, 212, 'c'], [124, 196], [122.6, 186]]), trim = F.rib || '#E86A8A';
      const tie = `<path d="M 150 206 L 140 214 L 142 220 L 150 212 L 158 220 L 160 214 Z" fill="${F.detail || '#5EB85A'}" stroke="${INK}" stroke-width=".8"/><path d="M 147 211 L 144 232 L 150 227 L 156 232 L 153 211 Z" fill="${F.detail || '#5EB85A'}" stroke="${INK}" stroke-width=".8"/>` + star5(150, 209.4, 3.4, '#FFE27A', .7);
      const btns = [226, 240, 254].map(y => btn(138, y, trim, 1.5) + btn(162, y, trim, 1.5)).join('');
      return pc(sk.d, F.fill, { folds: sk.folds, cel: sk.cel.concat(sk.lining), autoFolds: false }) + pc(vest, F.alt || '#FBFAF4', { lines: [{ d: 'M 150 200 L 150 262', o: .45 }, { d: 'M 112 180 L 112 262', c: trim, w: 1.4, o: .9 }, { d: 'M 188 180 L 188 262', c: trim, w: 1.4, o: .9 }] }) +
        pc(col, F.alt || '#FBFAF4', { lines: [{ d: 'M 130 188 Q 140 202 148 207', c: trim, w: 1.6, o: .95 }] }) + pc(mir(col), F.alt || '#FBFAF4', { lines: [{ d: mir('M 130 188 Q 140 202 148 207'), c: trim, w: 1.6, o: .95 }] }) + btns + tie;
    }
  },
  frillCrop: {
    cat: 'top', name: '露肩荷叶短上衣', thumb: '84 150 132 110',
    render(F) {   // 一圈荷叶边从两边手臂上绕过（露肩），下面短短的一截身片，领口系一条小丝巾
      const body = symS([[150, 198], [138, 196.4], [124, 196], [sideX(222) - 1.8, 214], [sideX(236) - 2.2, 236], [sideX(248) - 2.6, 248, 'c'], [150, 251.4]]);
      const R = flowSkirt({ top: 190, hem: 212, dip: 3, xw: 104, xh: 98, bulge: 0, n: 14, amp: 2.2, seed: 207, curve: 3, sideN: 2, fw: 1.4 });
      const edge = F.rib || '#8EC0E6', sc = F.detail || '#E8454F';
      const scarf = `<path d="M 138 172 Q 150 180 162 172 L 160 178 Q 150 184 140 178 Z" fill="${sc}" stroke="${INK}" stroke-width=".8"/><path d="M 146 180 L 141 196 L 150 190 L 159 196 L 154 180 Z" fill="${sc}" stroke="${INK}" stroke-width=".8"/><path d="M 146 183 L 144 190 M 154 183 L 156 190" stroke="#F6D36A" stroke-width="1.2"/>`;
      return pc(body, F.fill, { folds: fm('M 132 214 Q 134 228 133 244'), autoFolds: false }) + pc(R.d, F.alt || '#FBFAF4', { autoFolds: false, over: drapeSVG(R.folds, { op: .5, lo: .4 }), lines: [{ d: 'M ' + R.pts.map(P2).join(' L '), c: edge, w: 2.4, o: .95 }] }) + scarf;
    }
  }
});

const IDOL20 = [
  { id: 'd26', cat: 'dress', tpl: 'sailorVestDress', name: '水手领背心大波点裙', fill: { p: 'navydotsW' }, alt: '#FBFAF4', rib: '#E86A8A', detail: '#5EB85A' },
  { id: 'd27', cat: 'dress', tpl: 'maxiSlip', name: '紫夜花朵及踝长裙', fill: { p: 'violetfloral' }, rib: '#E8C25A' },
  { id: 'd28', cat: 'dress', tpl: 'pinafore', name: '粉蓝格子背带裙', fill: { p: 'harlequin' }, alt: '#EE5AA6', rib: '#F6E88A' },
  { id: 't86', cat: 'top', tpl: 'frillCrop', name: '粉色露肩荷叶短上衣', fill: { c: '#F8D0DC' }, alt: '#FBFAF4', rib: '#8EC0E6', detail: '#E8454F' },
  { id: 't87', cat: 'top', tpl: 'puffBlouse', name: '冰蓝纱感泡泡袖衬衫', fill: { p: 'sheerblue' }, alt: '#EAF6FC', rib: '#6FC7BE', print: 'bow' },
  { id: 't88', cat: 'top', tpl: 'printShirt', name: '绿格纹短袖衬衫', fill: { p: 'greengingham' }, alt: '#F29A3A' },
  { id: 't90', cat: 'top', tpl: 'puffBlouse', name: '薄荷白领泡泡袖衬衫', fill: { c: '#A8E6D0' }, alt: '#A8E6D0', rib: '#FBFAF4' },
  { id: 't91', cat: 'top', tpl: 'puffBlouse', name: '白色粉边泡泡袖衬衫', fill: { c: '#FBFAF4' }, alt: '#FBFAF4', rib: '#F48FB1' },
  { id: 't89', cat: 'top', tpl: 'babyTee', name: '粉色小短T', fill: { c: '#F6B6CA' }, alt: '#F6B6CA', rib: '#FBFAF4' },
  { id: 'o43', cat: 'outer', tpl: 'zipHoodieOpen', name: '白色紫边连帽外套', fill: { c: '#FBFAF4' }, sleeve: '#FBFAF4', rib: '#9A7ADA' },
  { id: 'b77', cat: 'bottom', tpl: 'shorts', name: '碎花牛仔短裤', fill: { p: 'floraldenim' }, stitch: '#F6E08A' },
  { id: 'b78', cat: 'bottom', tpl: 'aMini', name: '薄荷A字短裙', fill: { c: '#A8E6DC' } },
  { id: 'b79', cat: 'bottom', tpl: 'denimFrillMini', name: '牛仔荷叶短裙', fill: { p: 'lightdenim' }, alt: '#FBFAF4' },
  { id: 'b80', cat: 'bottom', tpl: 'aMini', name: '柠檬黄白花A字裙', fill: { p: 'yellowblossom' } },
  { id: 'b81', cat: 'bottom', tpl: 'hotShorts', name: '湖蓝短裤', fill: { c: '#5EC8C8' } }
];
IDOL20.forEach(i => { i.isNew = true; i.ip = 'aikatsu'; });
WARDROBE.unshift(...IDOL20);

/* 整套造型：一键换上（发型用本作的发型 + 发色） */
const LOOKS = [
  { name: '白水手领 · 大波点', ip: 'aikatsu', o: { hair: 'h32', hairColor: '#E4EAD6', dress: 'd26', top: null, bottom: null, outer: null, legs: 'l19', warmer: null, shoes: 's2', acc: ['a90'] } },
  { name: '紫夜花朵长裙', ip: 'aikatsu', o: { hair: 'h20', hairColor: '#A8532E', dress: 'd27', top: null, bottom: null, outer: null, legs: null, warmer: null, shoes: 's17', acc: ['a74'] } },
  { name: '露肩荷叶 · 碎花牛仔', ip: 'aikatsu', o: { hair: 'h12', hairColor: '#B070D8', top: 't86', bottom: 'b77', dress: null, outer: null, legs: null, warmer: null, shoes: 's11', acc: ['a115'] } },
  { name: '白纱衬衫 · 薄荷短裙', ip: 'aikatsu', o: { hair: 'h7', hairColor: '#F2DC7A', top: 't87', bottom: 'b78', dress: null, outer: null, legs: null, warmer: null, shoes: 's34', acc: [] } },
  { name: '绿格衬衫 · 牛仔荷叶裙', ip: 'aikatsu', o: { hair: 'h8', hairColor: '#3E5AB8', top: 't88', bottom: 'b79', dress: null, outer: null, legs: 'l33', warmer: null, shoes: 's8', acc: ['a89'] } },
  { name: '薄荷衬衫 · 白花黄裙', ip: 'aikatsu', o: { hair: 'h17', hairColor: '#F4AFC8', top: 't90', bottom: 'b80', dress: null, outer: null, legs: null, warmer: null, shoes: 's1', acc: [] } },
  { name: '粉蓝格子背带裙', ip: 'aikatsu', o: { hair: 'h30', hairColor: '#C8844A', top: 't91', dress: 'd28', bottom: null, outer: null, legs: null, warmer: null, shoes: 's4', acc: ['a47'] } },
  { name: '白紫连帽 · 湖蓝短裤', ip: 'aikatsu', o: { hair: 'h5', hairColor: '#D8323C', top: 't89', outer: 'o43', bottom: 'b81', dress: null, legs: 'l7', warmer: null, shoes: 's8', acc: [] } }
];

/* ---------- 筛选标签 ---------- */
const IP_LABEL = { aikatsu: '偶像活动' };
const STYLE_RULES = [['甜美', /蝴蝶结|荷叶|蕾丝|泡泡|蛋糕|爱心|草莓|娃娃|公主|芭蕾|纱|粉色|丸子|双马尾|揪揪|大卷/], ['街头', /卫衣|连帽|工装|运动|链条|破洞|摇滚|马丁|老爹|热裤|阔腿|网|炸毛|凌乱|挑染/], ['复古', /格纹|格|波点|碎花|花朵|灯芯绒|菱格|古着|麻花|费尔岛|豹纹|波波|盘发|卷发/],
  ['学院', /水手|百褶|领结|背带|领带|乐福|牛津|马甲|齐刘海|低马尾|编发/], ['休闲', /T|牛仔|短裤|衬衫|开衫|条纹|针织|毛衣|帆布|短发|直发|中分|锁骨/]];
const styleOf = it => STYLE_RULES.filter(([, re]) => re.test(it.name)).map(([k]) => k);
/* 颜色：有 fill 的用底色；发型 / 鞋袜 / 小物这些直接画的，取画里用得最多、又不是描边和白色的那个颜色（算一次存起来） */
const _colorCache = {};
function colorOf(it) {
  if (it.id in _colorCache) return _colorCache[it.id];
  let c = null;
  try {
    if (it.fill || it.diy) { const r = resolveFill(it); if (r.base && /^#[0-9a-f]{6}$/i.test(r.base)) c = r.base; }
    if (!c) { const L = partsOf(it); c = it.cat === 'hair' ? hairBase(L) : (() => { const n = {}; L.forEach(l => (l.svg.match(/fill="(#[0-9a-fA-F]{6})"/g) || []).forEach(m => { const k = m.slice(6, 13).toUpperCase(), [, s, v] = hsl(k); if (v > .1 && v < .97 && !(s < .08 && v > .9) && k !== '#E2C0CE' && k !== '#2B2322') n[k] = (n[k] || 0) + 1; })); return Object.keys(n).sort((a, b) => n[b] - n[a])[0]; })(); }
  } catch (e) { c = null; }
  return (_colorCache[it.id] = c ? colorName(c) : null);
}
