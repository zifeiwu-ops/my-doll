/* ---------------- 第四批：西部 2 套 + 冬日甜心 4 套（豹纹、毛领、雪花缎面）+ 田园针织 8 套 ---------------- */
IP_LABEL.winter = '冬日甜心';
IP_LABEL.farm = '田园针织';
const _recolor = (id, nid, map) => { const m = PATTERN_DEFS.match(new RegExp(`<pattern id="pat-${id}"[\\s\\S]*?</pattern>`)); let s = m ? m[0].replace(`pat-${id}`, `pat-${nid}`) : ''; Object.entries(map).forEach(([a, b]) => { s = s.split(a).join(b); }); return s; };
const _snow = (x, y, r, c) => `<path d="M ${x - r} ${y} H ${x + r} M ${x - r * .5} ${f1(y - r * .87)} L ${x + r * .5} ${f1(y + r * .87)} M ${x - r * .5} ${f1(y + r * .87)} L ${x + r * .5} ${f1(y - r * .87)}" stroke="${c}" stroke-width=".6" stroke-linecap="round"/>`;
PATTERN_DEFS += `
<pattern id="pat-greyditsy" patternUnits="userSpaceOnUse" width="10" height="10"><rect width="10" height="10" fill="#8A9AAE"/>${_ditsy(2.6, 2.6, '#EEF0F2')}${_ditsy(7.6, 6.8, '#2E3A52')}<circle cx="7.4" cy="1.6" r=".5" fill="#EEF0F2"/><circle cx="2" cy="8" r=".5" fill="#C8D2DE"/></pattern>
<pattern id="pat-bluefloral" patternUnits="userSpaceOnUse" width="18" height="18"><rect width="18" height="18" fill="#F4ECCE"/>${_flower5(4.6, 4.6, 2.6, '#6E8EC8', '#F2D27A')}${_flower5(13, 12, 2.2, '#9AB4E0', '#F4ECCE')}<path d="M 7 7 q 2 2 1 4 M 11 4 q 2 -1 3 1" stroke="#7A9A6A" stroke-width=".6" fill="none"/><circle cx="14" cy="3" r=".7" fill="#6E8EC8"/><circle cx="4" cy="14" r=".7" fill="#6E8EC8"/></pattern>
${_recolor('leopard', 'blueleopard', { '#C9985E': '#A8C0DC', '#8A5A2E': '#6A80A8', '#3A2416': '#2A3450' })}
<pattern id="pat-browntweed" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="6" height="6" fill="#8A7464"/><path d="M 0 1 l 2 1 M 3 4 l 2 -1 M 4 .5 l 1.5 1.2 M .5 4.5 l 1.4 1" stroke="#C8B8A4" stroke-width=".7"/><path d="M 2 0 l 1 1.6 M 5 3 l -1.2 1.6 M 1.2 3 l .8 1" stroke="#4A3A30" stroke-width=".5"/></pattern>
<pattern id="pat-snowsatin" patternUnits="userSpaceOnUse" width="20" height="20"><rect width="20" height="20" fill="#B8C8DA"/><path d="M 0 6 Q 10 2 20 6" stroke="#E4ECF4" stroke-width="2" opacity=".5" fill="none"/>${_snow(5, 5, 2.2, '#F6F8FC')}${_snow(15, 14, 2.6, '#F6F8FC')}${_snow(14, 4, 1.2, '#8A9CB8')}${_snow(4, 15, 1.2, '#8A9CB8')}</pattern>
<pattern id="pat-fairisle" patternUnits="userSpaceOnUse" width="12" height="16"><rect width="12" height="16" fill="#3E6E9A"/><rect y="2" width="12" height="2" fill="#E8E2D2"/><path d="M 0 8 L 3 5.6 L 6 8 L 9 5.6 L 12 8 L 9 10.4 L 6 8 L 3 10.4 Z" fill="#6FAE8A"/><rect y="12" width="12" height="1.4" fill="#E8E2D2"/><circle cx="3" cy="14.6" r=".7" fill="#2A3A52"/><circle cx="9" cy="14.6" r=".7" fill="#2A3A52"/></pattern>
${_vs('bluestripeT', '#7AB8DA', '#2E6E9A', 6, .4).replace('width="6" height="10"><rect', 'width="6" height="10" patternTransform="rotate(90)"><rect')}
${_cable('lavcable', '#9A86C8', '#7A64A8')}
${_cable('palecable', '#C8DCEA', '#9AB4CC')}
${_cable('rustcable', '#B8502E', '#8A3A22')}
${_plaid('plaidGreen', '#3E7A5A', '#2A4A3A', '#9AC8A0', 14)}
<pattern id="pat-plumcord" patternUnits="userSpaceOnUse" width="3" height="10"><rect width="3" height="10" fill="#3E2448"/><rect x="2" width=".7" height="10" fill="#2A1830"/></pattern>
${_vs('purplestripe', '#2E2A5A', '#7A3A8A', 5, .35)}
${_vs('tealstripe', '#2A8A9A', '#7AC86A', 8, .45).replace('width="8" height="10"><rect', 'width="8" height="10" patternTransform="rotate(90)"><rect')}
<pattern id="pat-lilacboucle" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="6" height="6" fill="#9A7AB0"/><path d="M 1 1 q 1 1 2 0 M 4 4 q 1 1 2 0 M 0 4 q 1 -1 2 0" stroke="#C8A8D8" stroke-width=".8" fill="none"/><circle cx="4" cy="1.4" r=".5" fill="#6A4A80"/></pattern>
<pattern id="pat-sherpadot" patternUnits="userSpaceOnUse" width="16" height="16"><rect width="16" height="16" fill="#C49A68"/><path d="M 1 2 q 1 1 2 0 M 9 3 q 1 1 2 0 M 4 10 q 1 1 2 0 M 12 12 q 1 1 2 0 M 6 6 q 1 1 2 0" stroke="#D8B486" stroke-width=".9" fill="none"/><circle cx="4" cy="5" r="1.8" fill="#6A3E24"/><circle cx="12" cy="13" r="1.8" fill="#6A3E24"/></pattern>
<linearGradient id="grad-brownsatin" gradientUnits="userSpaceOnUse" x1="110" y1="0" x2="190" y2="0"><stop offset="0" stop-color="#5A3826"/><stop offset=".4" stop-color="#A8785A"/><stop offset=".7" stop-color="#7A5038"/><stop offset="1" stop-color="#4A2C1E"/></linearGradient>`;
Object.assign(PAT_BASE, { greyditsy: '#8A9AAE', bluefloral: '#E8E2CC', blueleopard: '#98B0D0', browntweed: '#8A7464', snowsatin: '#B8C8DA', fairisle: '#4E7EA0', bluestripeT: '#5A98C0', lavcable: '#9A86C8', palecable: '#C8DCEA', rustcable: '#B8502E', plaidGreen: '#3E7A5A', plumcord: '#3E2448', purplestripe: '#4A3070', tealstripe: '#4AA08A', lilacboucle: '#9A7AB0', sherpadot: '#C49A68' });
Object.assign(GRAD_BASE, { brownsatin: '#7A5038' });

/* 配饰：贝雷帽 / 毛线帽 / 毛领 / 手套 */
const beret = (id, name, c) => ({ id, cat: 'acc', sub: 'hat', name, thumb: '90 34 132 76', isNew: true,
  parts: () => { const b = spline([[108, 90, 'c'], [106, 72], [116, 58], [134, 50], [156, 47.6], [178, 50], [194, 60], [198, 74], [192, 86], [176, 90], [150, 88]]);
    return [{ z: 56, svg: piece(b, c, { folds: ['M 118 80 Q 140 70 170 72', 'M 182 64 Q 188 72 186 82'], gloss: ['M 124 62 Q 140 54 158 54'], glossOp: .3 }) + `<path d="M 156 48 L 157 42.4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M 156 48 L 157 42.4" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>` }]; } });
const beanie = (id, name, c, fold) => ({ id, cat: 'acc', sub: 'hat', name, thumb: '90 22 120 96', isNew: true,
  parts: () => { const cap = spline([[106.4, 98, 'c'], [104, 70], [110, 44], [130, 28], [152, 24], [174, 30], [190, 48], [194, 72], [193.6, 98, 'c']]);
    const brim = spline([[104.4, 84, 'c'], [127, 79], [150, 77.6], [173, 79], [195.6, 84, 'c'], [196.4, 100.4, 'c'], [173, 96], [150, 94.6], [127, 96], [103.6, 100.4, 'c']]);
    const ribs = Array.from({ length: 21 }, (_, i) => `M ${106 + i * 4.4} ${84 - 3 * Math.sin((i / 20) * Math.PI)} L ${106 + i * 4.4} ${99 - 3 * Math.sin((i / 20) * Math.PI)}`).join(' ');
    return [{ z: 56, svg: piece(cap, c, { lines: [{ d: Array.from({ length: 9 }, (_, i) => `M ${116 + i * 8.6} ${40 + Math.abs(i - 4) * 3} L ${114 + i * 8.8} 80`).join(' '), o: .25, w: .8 }], folds: ['M 124 54 Q 150 62 176 54'], foldOp: .35 }) + piece(brim, fold || c, { lines: [{ d: ribs, o: .3, w: .7 }] }) }]; } });
const furCollar = (id, name, c, bow) => ({ id, cat: 'acc', sub: 'neck', name, thumb: '110 140 80 60', isNew: true,
  parts: () => { const d = spline(wavy([[134, 149], [150, 156], [166, 149], [180, 156], [188, 166], [176, 176], [150, 184], [124, 176], [112, 166], [120, 156]], 2, 6));
    return [{ z: 57, svg: piece(d, c, { folds: ['M 132 168 Q 150 176 168 168'], foldOp: .3 }) + (bow ? ribbonBow(150, 183, .5, bow, 1) : '') }]; } });
const gloves = (id, name, c, top = 314, cut) => ({ id, cat: 'acc', sub: 'hand', name, thumb: '66 300 60 60', isNew: true,
  parts: () => { const end = cut ? 338 : 350; const one = m => { const M = M_(m), pts = []; rng(top, end - 2, 5).forEach(y => pts.push([armO0(Math.min(y, 346)) - 1.4, y])); pts.push([(armO0(Math.min(end, 346)) + armI0(Math.min(end, 346))) / 2, end + (cut ? .6 : 3.6), 'c']); rng(end - 2, top, 5).forEach(y => pts.push([armI0(Math.min(y, 346)) + 1.4, y]));
    return piece(M(spline(pts)), c, { rim: false, folds: [M(`M ${f1(armO0(top + 6) - 1)} ${top + 6} Q ${f1((armO0(top + 6) + armI0(top + 6)) / 2)} ${top + 8} ${f1(armI0(top + 6) + 1)} ${top + 6}`)], foldOp: .3 }); };
    return [{ z: 56, svg: both(one) }]; } });

const NEW28 = [
  /* 西部 · 碎花荷叶背心 + 奶黄蓝花蛋糕裙 */
  { id: 't110', cat: 'top', tpl: 'laceVest', name: '雾蓝碎花荷叶背心', fill: { p: 'greyditsy' }, alt: 'url(#pat-greyditsy)', rib: '#EEF0F2', ip: 'western' },
  { id: 'b105', cat: 'bottom', tpl: 'tierMidi', name: '奶黄蓝花蛋糕中长裙', fill: { p: 'bluefloral' }, ip: 'western' },
  bootItem('s38', '浅蓝牛仔堆堆靴', '#9AB8D8', 440, null, { e: 5.2, slouch: true, soleH: 11, sole: '#6A88B0' }),
  /* 西部 · 薄荷镂空开衫 + 薄荷缎面荷叶裙 */
  { id: 'o60', cat: 'outer', tpl: 'cardigan', name: '薄荷珠饰镂空开衫', fill: { c: '#8ECBB8' }, rib: '#7A4A30', ip: 'western' },
  { id: 'b106', cat: 'bottom', tpl: 'tierMidi', name: '薄荷缎面荷叶长裙', fill: { g: 'mintsatin' }, ip: 'western' },
  /* 冬日甜心 */
  { id: 't111', cat: 'top', tpl: 'puffCrop', name: '雾蓝豹纹泡泡袖上衣', fill: { p: 'blueleopard' }, alt: 'url(#pat-blueleopard)', ip: 'winter' },
  { id: 'b107', cat: 'bottom', tpl: 'pleatedMini', name: '棕色粗花呢百褶短裙', fill: { p: 'browntweed' }, ip: 'winter' },
  { id: 'a119', cat: 'acc', sub: 'neck', name: '豹纹领结丝巾', thumb: '120 140 60 50', isNew: true, ip: 'winter', parts: () => [{ z: 57, svg: `<path d="M 141 154 Q 150 159 159 154" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M 141 154 Q 150 159 159 154" fill="none" stroke="#C9985E" stroke-width="3.6" stroke-linecap="round"/>` + ribbonBow(150, 158, .62, 'url(#pat-leopard)', 1) }] },
  gloves('a120', '棕色露指手套', '#7A5038', 316, true),
  tights('l41', '棕色连裤袜', '#5A3A2C'),
  { id: 't112', cat: 'top', tpl: 'mockTee', name: '浅蓝修身上衣', fill: { c: '#BCD4EA' }, ip: 'winter' },
  furCollar('a121', '豹纹毛领 + 棕色蝴蝶结', 'url(#pat-leopard)', '#5A3826'),
  { id: 'b108', cat: 'bottom', tpl: 'fluffyMini', name: '棕色缎面花苞裙', fill: { g: 'brownsatin' }, rib: '#3A2418', ip: 'winter' },
  bootItem('s39', '棕色及膝长靴', '#6A4230', 400, null, { e: 3.4, sole: '#3A2418' }),
  crossbody('a122', '豹纹小挎包', '#8A5A2E', `<rect x="168" y="278" width="28" height="26" rx="4" fill="url(#pat-leopard)" opacity=".9"/>`),
  { id: 'o61', cat: 'outer', tpl: 'cropCardi', name: '浅蓝针织短开衫', fill: { c: '#A8C4E0' }, rib: '#F8F6F2', ip: 'winter' },
  furCollar('a123', '白色毛毛领 + 缎带', 'url(#pat-fuzzwhite)', '#F8F6F2'),
  { id: 'd36', cat: 'dress', tpl: 'babydollSlip', name: '雾蓝碎花雪纺连衣裙', fill: { p: 'greyditsy' }, alt: '#8A9AAE', rib: '#EEF0F2', ip: 'winter' },
  gloves('a124', '白色短手套', '#F8F6F2', 314),
  { id: 'd37', cat: 'dress', tpl: 'slipDress', name: '银蓝雪花缎面连衣裙', fill: { p: 'snowsatin' }, rib: '#8A9CB8', ip: 'winter' },
  bootItem('s40', '白色堆堆长靴', '#F4F2EE', 420, null, { e: 5.2, slouch: true, soleH: 11, sole: '#C8C4C0' }),
  /* 田园针织 */
  { id: 'o62', cat: 'outer', tpl: 'knitVest', name: '费尔岛提花毛衣背心', fill: { p: 'fairisle' }, rib: '#2A3A52', ip: 'farm' },
  { id: 't113', cat: 'top', tpl: 'sweater', name: '蓝色条纹长袖针织衫', fill: { p: 'bluestripeT' }, ip: 'farm' },
  { id: 'b109', cat: 'bottom', tpl: 'balloonPants', name: '橄榄绿灯笼裤', fill: { c: '#6E7A3A' }, ip: 'farm' },
  crewSock('l42', '红色中筒袜', 496, '#B8323A', '#9A2A30'),
  { id: 'o63', cat: 'outer', tpl: 'cardigan', name: '薰衣草麻花开衫', fill: { p: 'lavcable' }, rib: '#7A64A8', ip: 'farm' },
  { id: 't114', cat: 'top', tpl: 'mockTee', name: '湖绿高领打底', fill: { c: '#2E7A7A' }, ip: 'farm' },
  { id: 'b110', cat: 'bottom', tpl: 'longPleat', name: '墨绿格纹长裙', fill: { p: 'plaidGreen' }, ip: 'farm' },
  beret('a125', '红色贝雷帽', '#B8283A'),
  { id: 't115', cat: 'top', tpl: 'ribCardiTop', name: '烟紫粗针开衫', fill: { c: '#B07AA8' }, rib: '#8A5A88', ip: 'farm' },
  { id: 'b111', cat: 'bottom', tpl: 'fullMidi', name: '深紫灯芯绒长裙', fill: { p: 'plumcord' }, ip: 'farm' },
  beret('a126', '芥末黄贝雷帽', '#D8A82A'),
  { id: 'o64', cat: 'outer', tpl: 'cropCardi', name: '雾蓝麻花短开衫', fill: { p: 'palecable' }, rib: '#9AB4CC', ip: 'farm' },
  { id: 't116', cat: 'top', tpl: 'mockTee', name: '草绿长袖打底', fill: { c: '#2E8A5A' }, ip: 'farm' },
  { id: 'b112', cat: 'bottom', tpl: 'culottes', name: '深蓝牛仔七分裤', fill: { p: 'darkdenim' }, ip: 'farm' },
  crewSock('l43', '草绿中筒袜', 496, '#3A9A5A', '#2E7A48'),
  beanie('a127', '藏青条纹毛线帽', '#2E3A6A', '#6A9AC8'),
  { id: 'o65', cat: 'outer', tpl: 'knitVest', name: '紫色针织背心', fill: { c: '#7A5AA8' }, rib: '#5A3A88', ip: 'farm' },
  { id: 't117', cat: 'top', tpl: 'sweater', name: '天蓝毛衣', fill: { c: '#5A9AD8' }, ip: 'farm' },
  { id: 'b113', cat: 'bottom', tpl: 'widePants', name: '紫蓝竖条纹阔腿裤', fill: { p: 'purplestripe' }, ip: 'farm' },
  beret('a128', '玫紫贝雷帽', '#A82A7A'),
  { id: 'o66', cat: 'outer', tpl: 'knitVest', name: '丁香紫圈圈毛背心', fill: { p: 'lilacboucle' }, rib: '#6A4A80', ip: 'farm' },
  { id: 't118', cat: 'top', tpl: 'mockTee', name: '粉色长袖打底', fill: { c: '#F2B8C8' }, ip: 'farm' },
  { id: 't119', cat: 'top', tpl: 'poloSweat', name: '湖蓝摇粒绒套头衫', fill: { c: '#2A8AB0' }, rib: '#2A6A4A', ip: 'farm' },
  { id: 'b114', cat: 'bottom', tpl: 'widePants', name: '湖蓝草绿横条纹裤', fill: { p: 'tealstripe' }, ip: 'farm' },
  beanie('a129', '橄榄绿毛线帽', '#7A8A3A'),
  { id: 'o67', cat: 'outer', tpl: 'knitVest', name: '波点羊羔毛背心', fill: { p: 'sherpadot' }, rib: '#6A3E24', ip: 'farm' },
  { id: 't120', cat: 'top', tpl: 'sweater', name: '铁锈红麻花毛衣', fill: { p: 'rustcable' }, ip: 'farm' },
  beanie('a130', '驼色羊羔毛帽', '#C49A68', '#B08858')
];
NEW28.forEach(i => { i.isNew = true; if (!i.ip) i.ip = /^(a12[5-9]|a130|l42|l43)$/.test(i.id) ? 'farm' : /^s38$/.test(i.id) ? 'western' : 'winter'; });
WARDROBE.unshift(...NEW28);
LOOKS.unshift(
  { name: '碎花荷叶背心 · 蓝花蛋糕裙', ip: 'western', o: { ...W0, hair: 'h11', hairColor: '#C8A46A', top: 't110', bottom: 'b105', shoes: 's38', acc: ['a114'] } },
  { name: '薄荷镂空开衫 · 缎面荷叶裙', ip: 'western', o: { ...W0, hair: 'h11', hairColor: '#F2ECDC', outer: 'o60', top: 't108', bottom: 'b106', legs: 'l40', shoes: 's25', acc: ['a23'] } },
  { name: '蓝豹纹 · 粗花呢百褶', ip: 'winter', o: { ...W0, hair: 'h29', hairColor: '#8A5A3A', top: 't111', bottom: 'b107', legs: 'l41', shoes: 's14', acc: ['a119', 'a120'] } },
  { name: '豹纹毛领 · 棕色花苞裙', ip: 'winter', o: { ...W0, hair: 'h11', hairColor: '#8A5A3A', top: 't112', bottom: 'b108', legs: 'l41', shoes: 's39', acc: ['a121', 'a122'] } },
  { name: '白毛领开衫 · 碎花雪纺裙', ip: 'winter', o: { ...W0, hair: 'h13', hairColor: '#8A6A4A', outer: 'o61', dress: 'd36', shoes: 's17', acc: ['a123', 'a124', 'a90'] } },
  { name: '银蓝雪花缎面裙', ip: 'winter', o: { ...W0, hair: 'h17', hairColor: '#2A2024', dress: 'd37', shoes: 's40', acc: ['a90'] } },
  { name: '提花背心 · 灯笼裤', ip: 'farm', o: { ...W0, hair: 'h15', outer: 'o62', top: 't113', bottom: 'b109', legs: 'l42', shoes: 's14', acc: ['a127', 'a40', 'a33'] } },
  { name: '薰衣草开衫 · 格纹长裙', ip: 'farm', o: { ...W0, hair: 'h15', outer: 'o63', top: 't114', bottom: 'b110', shoes: 's14', acc: ['a125', 'a40'] } },
  { name: '烟紫开衫 · 灯芯绒长裙', ip: 'farm', o: { ...W0, hair: 'h15', top: 't115', bottom: 'b111', shoes: 's15', acc: ['a126', 'a40'] } },
  { name: '雾蓝麻花 · 牛仔七分裤', ip: 'farm', o: { ...W0, hair: 'h15', outer: 'o64', top: 't116', bottom: 'b112', legs: 'l43', shoes: 's14', acc: ['a127', 'a40', 'a50'] } },
  { name: '紫背心 · 条纹阔腿裤', ip: 'farm', o: { ...W0, hair: 'h15', outer: 'o65', top: 't117', bottom: 'b113', shoes: 's9', acc: ['a128', 'a40', 'a50'] } },
  { name: '圈圈毛背心 · 灯芯绒裙', ip: 'farm', o: { ...W0, hair: 'h15', outer: 'o66', top: 't118', bottom: 'b111', shoes: 's15', acc: ['a128', 'a40', 'a33'] } },
  { name: '摇粒绒 · 条纹裤', ip: 'farm', o: { ...W0, hair: 'h15', top: 't119', bottom: 'b114', legs: 'l43', shoes: 's6', acc: ['a129', 'a40', 'a50'] } },
  { name: '羊羔毛背心 · 麻花毛衣', ip: 'farm', o: { ...W0, hair: 'h15', outer: 'o67', top: 't120', bottom: 'b111', shoes: 's15', acc: ['a130', 'a40', 'a50'] } }
);
