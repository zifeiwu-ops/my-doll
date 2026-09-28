/* =====================================================================
   联动：偶像活动（Aikatsu!）风格的 8 套私服造型 —— 按参考图的搭配思路用本作的版型重画（不描原图）
   每件衣服带 ip / 风格标签；衣橱里可以按「系列 / 颜色 / 风格」筛选，选了系列还能一键换上整套造型
   ===================================================================== */
PATTERN_DEFS += `
<pattern id="pat-navydotsW" patternUnits="userSpaceOnUse" width="16" height="16"><rect width="16" height="16" fill="#FBFAF4"/><circle cx="4" cy="4" r="3" fill="#2A3A6E"/><circle cx="12" cy="12" r="3" fill="#2A3A6E"/><circle cx="3.2" cy="3.2" r=".8" fill="#5A6A9E"/><circle cx="11.2" cy="11.2" r=".8" fill="#5A6A9E"/></pattern>
<pattern id="pat-violetfloral" patternUnits="userSpaceOnUse" width="30" height="30"><rect width="30" height="30" fill="#3E3A8A"/>${_flower5(8, 8, 5.4, '#F6E08A', '#FFFFFF')}${_flower5(22, 21, 4.6, '#FFFFFF', '#F6E08A')}${_flower5(24, 6, 2.6, '#B9A8F0', '#FFFFFF')}${_flower5(6, 24, 3, '#F6E08A', '#FFFFFF')}<ellipse cx="15" cy="13" rx="2.4" ry="1" fill="#7EA0D8" transform="rotate(-30 15 13)"/></pattern>
<pattern id="pat-greengingham" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="8" height="8" fill="#F2FAEC"/><rect width="4" height="8" fill="#5EB85A" opacity=".55"/><rect width="8" height="4" fill="#5EB85A" opacity=".55"/></pattern>
<pattern id="pat-harlequin" patternUnits="userSpaceOnUse" width="16" height="20"><rect width="16" height="20" fill="#F7A6C6"/><path d="M 8 0 L 16 10 L 8 20 L 0 10 Z" fill="#7ED6E0"/><path d="M 8 4 L 12.8 10 L 8 16 L 3.2 10 Z" fill="#FFF3A6"/><path d="M 0 0 L 16 20 M 16 0 L 0 20" stroke="#FFFFFF" stroke-width=".6" opacity=".7"/></pattern>
<pattern id="pat-sheerblue" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="6" height="6" fill="#DDF0FA"/><circle cx="3" cy="3" r=".7" fill="#FFFFFF"/></pattern>`;
Object.assign(PAT_BASE, { navydotsW: '#C8CCDA', violetfloral: '#4A4690', greengingham: '#8ACB84', harlequin: '#B8C0D6', sheerblue: '#DDF0FA' });

const IDOL20 = [
  { id: 'd26', cat: 'dress', tpl: 'dotTunic', name: '白底藏青大波点连衣裙', fill: { p: 'navydotsW' }, alt: '#FBFAF4', rib: '#2A3A6E' },
  { id: 'd27', cat: 'dress', tpl: 'slipDress', name: '紫夜花朵吊带长裙', fill: { p: 'violetfloral' } },
  { id: 'd28', cat: 'dress', tpl: 'dotTunic', name: '粉蓝菱格小洋装', fill: { p: 'harlequin' }, alt: '#FBFAF4', rib: '#F48FB1' },
  { id: 't86', cat: 'top', tpl: 'offShoulderTee', name: '粉色露肩荷叶上衣', fill: { c: '#F8C8D6' }, alt: '#FBFAF4', rib: '#F48FB1' },
  { id: 't87', cat: 'top', tpl: 'puffBlouse', name: '冰蓝纱感泡泡袖衬衫', fill: { p: 'sheerblue' }, alt: '#EAF6FC', rib: '#6FC7BE', print: 'bow' },
  { id: 't88', cat: 'top', tpl: 'buttonShirt', name: '绿格纹宽松衬衫', fill: { p: 'greengingham' } },
  { id: 't89', cat: 'top', tpl: 'babyTee', name: '粉色小短T', fill: { c: '#F6B6CA' }, alt: '#F6B6CA', rib: '#FBFAF4' },
  { id: 'o43', cat: 'outer', tpl: 'zipHoodieOpen', name: '白色紫边连帽外套', fill: { c: '#FBFAF4' }, sleeve: '#FBFAF4', rib: '#9A7ADA' },
  { id: 'b77', cat: 'bottom', tpl: 'shorts', name: '浅蓝卷边牛仔短裤', fill: { p: 'lightdenim' }, stitch: '#F6E08A' },
  { id: 'b78', cat: 'bottom', tpl: 'tierSkirt', name: '薄荷蛋糕纱裙', fill: { c: '#A8E6DC' }, alt: '#C8F2EA', rib: '#F6E08A', print: 'bow' },
  { id: 'b79', cat: 'bottom', tpl: 'denimFrillMini', name: '牛仔荷叶短裙', fill: { p: 'lightdenim' }, alt: '#FBFAF4' },
  { id: 'b80', cat: 'bottom', tpl: 'aMini', name: '柠檬黄花朵A字裙', fill: { p: 'lemonfloral' } },
  { id: 'b81', cat: 'bottom', tpl: 'hotShorts', name: '湖蓝短裤', fill: { c: '#5EC8C8' } }
];
IDOL20.forEach(i => { i.isNew = true; i.ip = 'aikatsu'; });
WARDROBE.unshift(...IDOL20);

/* 整套造型：一键换上（发型用本作的发型 + 发色） */
const LOOKS = [
  { name: '白波点 · 公主卷', ip: 'aikatsu', o: { hair: 'h27', hairColor: '#E4EAD6', dress: 'd26', top: null, bottom: null, outer: null, legs: 'l7', warmer: null, shoes: 's2', acc: ['a90'] } },
  { name: '紫夜花裙', ip: 'aikatsu', o: { hair: 'h20', hairColor: '#A8532E', dress: 'd27', top: null, bottom: null, outer: null, legs: null, warmer: null, shoes: 's17', acc: ['a74'] } },
  { name: '露肩 · 牛仔短裤', ip: 'aikatsu', o: { hair: 'h12', hairColor: '#B9A0E0', top: 't86', bottom: 'b77', dress: null, outer: null, legs: null, warmer: null, shoes: 's11', acc: [] } },
  { name: '冰蓝 · 薄荷纱裙', ip: 'aikatsu', o: { hair: 'h7', hairColor: '#F2DC7A', top: 't87', bottom: 'b78', dress: null, outer: null, legs: null, warmer: null, shoes: 's34', acc: ['a115'] } },
  { name: '绿格衬衫 · 牛仔', ip: 'aikatsu', o: { hair: 'h32', hairColor: '#3E5AB8', top: 't88', bottom: 'b79', dress: null, outer: null, legs: 'l33', warmer: null, shoes: 's8', acc: ['a89'] } },
  { name: '薄荷 · 柠檬花裙', ip: 'aikatsu', o: { hair: 'h17', hairColor: '#F4AFC8', top: 't61', bottom: 'b80', dress: null, outer: null, legs: null, warmer: null, shoes: 's1', acc: [] } },
  { name: '粉蓝菱格', ip: 'aikatsu', o: { hair: 'h37', hairColor: '#D98A4A', dress: 'd28', top: null, bottom: null, outer: null, legs: null, warmer: null, shoes: 's34', acc: ['a47'] } },
  { name: '白紫连帽 · 湖蓝短裤', ip: 'aikatsu', o: { hair: 'h5', hairColor: '#D8323C', top: 't89', outer: 'o43', bottom: 'b81', dress: null, legs: 'l7', warmer: null, shoes: 's8', acc: [] } }
];

/* ---------- 筛选标签 ---------- */
const IP_LABEL = { aikatsu: '偶像活动' };
const STYLE_RULES = [['甜美', /蝴蝶结|荷叶|蕾丝|泡泡|蛋糕|爱心|草莓|娃娃|公主|芭蕾|纱|粉色/], ['街头', /卫衣|连帽|工装|运动|链条|破洞|摇滚|马丁|老爹|热裤|阔腿|网/], ['复古', /格纹|格|波点|碎花|花朵|灯芯绒|菱格|古着|麻花|费尔岛|豹纹/],
  ['学院', /水手|百褶|领结|背带|领带|乐福|牛津|马甲/], ['休闲', /T|牛仔|短裤|衬衫|开衫|条纹|针织|毛衣|帆布/]];
const styleOf = it => STYLE_RULES.filter(([, re]) => re.test(it.name)).map(([k]) => k);
const colorOf = it => { if (!it.fill && !it.diy) return null; try { const r = resolveFill(it); return r.base && /^#[0-9a-f]{6}$/i.test(r.base) ? colorName(r.base) : null; } catch (e) { return null; } };
