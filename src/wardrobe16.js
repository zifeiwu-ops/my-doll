/* ---------------- 本期主题 · 糖果装饰风 + 甜酷街头（排在各分类最前面） ---------------- */
const NEW16 = [
  /* 上衣 */
  { id: 't67', cat: 'top', tpl: 'graphicTank', name: '粉色汽水徽章背心', fill: { c: '#F8C2D2' }, rib: '#FFFFFF', print: 'soda' },
  { id: 't68', cat: 'top', tpl: 'sailorTee', name: '黑白条纹水手领短T', fill: { p: 'stripeTee' }, alt: '#2A3150', rib: '#FFFFFF' },
  { id: 't69', cat: 'top', tpl: 'graphicTee', name: '玫红兔子印花T', fill: { c: '#D8406A' }, rib: '#C8305A', print: 'bunny' },
  { id: 't70', cat: 'top', tpl: 'graphicTee', name: '柠檬黄雏菊印花T', fill: { c: '#F8EC8A' }, rib: '#F0DC6A', print: 'daisy' },
  { id: 't71', cat: 'top', tpl: 'frillBlouse', name: '白色黑蕾丝无袖衬衫', fill: { c: '#FBFAF6' }, alt: '#2A2528' },
  { id: 't72', cat: 'top', tpl: 'raglanPrint', name: '米字旗插肩长袖T', fill: { c: '#D6C4E6' }, alt: '#2A2528', print: 'flag' },
  { id: 't73', cat: 'top', tpl: 'raglanPrint', name: '白身黑袖红十字T', fill: { c: '#FBFAF6' }, alt: '#2A2528', print: 'cross' },
  { id: 't74', cat: 'top', tpl: 'babyTee', name: '粉色条纹短袖T', fill: { p: 'stripePinkTee' }, alt: 'url(#pat-stripePinkTee)' },
  { id: 't75', cat: 'top', tpl: 'tieShirt', name: '黑色卷袖衬衫配菱格领带', fill: { c: '#2A2528' }, alt: '#FBFAF6', rib: 'url(#pat-argylePurple)' },
  { id: 't76', cat: 'top', tpl: 'graphicLong', name: '黑色和平印花长袖T', fill: { c: '#2A2528' }, alt: '#2A2528', print: 'peace' },
  { id: 't77', cat: 'top', tpl: 'bardotTop', name: '奶油紫边露肩毛衣', fill: { c: '#F6EEC8' }, alt: 'url(#pat-stripePurple)', sleeve: '#F6EEC8', print: 'plain' },
  { id: 't78', cat: 'top', tpl: 'sweater', name: '黑红条纹长毛衣', fill: { p: 'stripeRB' }, rib: '#2A2528' },
  { id: 't79', cat: 'top', tpl: 'graphicTee', name: '白色星星字母大T', fill: { c: '#FBFAF6' }, print: 'star' },
  { id: 't80', cat: 'top', tpl: 'cami', name: '黑色蕾丝吊带', fill: { p: 'blacklace' } },
  { id: 't81', cat: 'top', tpl: 'laceVest', name: '黑色白系带马甲', fill: { c: '#2A2528' }, alt: '#FBFAF6' },
  { id: 't82', cat: 'top', tpl: 'sailorBlouse', name: '黑色粉格领结水手服', fill: { c: '#2A2528' }, alt: 'url(#pat-plaidPink)', rib: '#F4A7C0' },
  { id: 't83', cat: 'top', tpl: 'rockLayer', name: '灰色摇滚T叠白长袖', fill: { c: '#6A666C' }, alt: '#FBFAF6' },
  { id: 't84', cat: 'top', tpl: 'trackJacket', name: '粉色黑条运动外套', fill: { c: '#F6C4D6' }, rib: '#2A2528', print: 'stripes' },
  { id: 't85', cat: 'top', tpl: 'trackJacket', name: '红色白条运动外套', fill: { c: '#D8323C' }, rib: '#FBFAF6', print: 'stripes' },
  /* 外套 */
  { id: 'o32', cat: 'outer', tpl: 'zipHoodieOpen', name: '黑色蓝袖连帽外套', fill: { c: '#2A2528' }, sleeve: '#A8C8EA', rib: '#2A2528' },
  { id: 'o33', cat: 'outer', tpl: 'crossJacket', name: '白色黑十字立领夹克', fill: { c: '#FBFAF6' }, alt: '#2A2528' },
  { id: 'o34', cat: 'outer', tpl: 'hoodCoat', name: '墨绿连帽长外套', fill: { c: '#2E5A3E' }, alt: 'url(#pat-plaidMint)' },
  { id: 'o35', cat: 'outer', tpl: 'cardigan', name: '粉色长款针织开衫', fill: { p: 'ribpinkcardi' }, rib: '#E6A2BC' },
  { id: 'o36', cat: 'outer', tpl: 'crochetCape', name: '奶油钩针毛球披肩', fill: { c: '#F6ECCE' } },
  { id: 'o37', cat: 'outer', tpl: 'furCoat', name: '橙色毛领长大衣', fill: { c: '#E8913A' }, alt: 'url(#pat-plaidYellow)' },
  { id: 'o38', cat: 'outer', tpl: 'plaidJacket', name: '红格纹双排扣短外套', fill: { p: 'plaidRed' }, alt: '#2A2528', rib: '#C82C3A' },
  { id: 'o39', cat: 'outer', tpl: 'openCoat', name: '红格纹扣带长外套', fill: { p: 'plaidRed' }, alt: '#2A2528' },
  { id: 'o40', cat: 'outer', tpl: 'furMoto', name: '粉色毛领机车夹克', fill: { c: '#F2B6CC' }, alt: '#2A2528' },
  { id: 'o41', cat: 'outer', tpl: 'zipHoodieOpen', name: '蓝白撞色外套', fill: { c: '#3E4EA8' }, sleeve: '#F4F2EE', rib: '#3E4EA8' },
  { id: 'o42', cat: 'outer', tpl: 'cropCardi', name: '白色短款开衫', fill: { c: '#FBFAF6' }, rib: '#EDE8E0' },
  /* 下装 */
  { id: 'b60', cat: 'bottom', tpl: 'pleatedMini', name: '灰绿牛仔百褶短裙', fill: { p: 'sagedenim' } },
  { id: 'b61', cat: 'bottom', tpl: 'mermaidDenim', name: '浅蓝荷叶边鱼尾牛仔长裙', fill: { p: 'lightdenim' } },
  { id: 'b62', cat: 'bottom', tpl: 'denimFrillMini', name: '绿牛仔短裙叠奶油荷叶', fill: { p: 'greendenim' }, alt: '#F6ECD6' },
  { id: 'b63', cat: 'bottom', tpl: 'pleatedMini', name: '黄绿格纹百褶裙', fill: { p: 'plaidYG' } },
  { id: 'b64', cat: 'bottom', tpl: 'wrapCapris', name: '格纹围裹片叠红七分裤', fill: { c: '#B8283A' }, alt: 'url(#pat-plaidRed)', rib: '#D8323C' },
  { id: 'b65', cat: 'bottom', tpl: 'pleatedMini', name: '白色百褶短裙', fill: { c: '#F6F4F0' } },
  { id: 'b66', cat: 'bottom', tpl: 'fluffyMini', name: '白色蓬蓬荷叶短裙', fill: { c: '#FBFAF6' }, alt: '#FFFFFF' },
  { id: 'b67', cat: 'bottom', tpl: 'fluffyMini', name: '黑色蓬蓬荷叶短裙', fill: { c: '#2A2528' }, alt: '#FBFAF6' },
  { id: 'b68', cat: 'bottom', tpl: 'fluffyMini', name: '紫色蓬蓬荷叶短裙', fill: { c: '#8A4A8E' }, alt: '#FBFAF6' },
  { id: 'b69', cat: 'bottom', tpl: 'fluffyMini', name: '粉格纹蓬蓬短裙', fill: { p: 'plaidPink' }, alt: '#F4C6D4' },
  { id: 'b70', cat: 'bottom', tpl: 'aMini', name: '紫色格纹迷你裙', fill: { p: 'plaidPurple' } },
  { id: 'b71', cat: 'bottom', tpl: 'hotShorts', name: '红色链条热裤', fill: { c: '#C8283A' } },
  { id: 'b72', cat: 'bottom', tpl: 'aMini', name: '墨绿短裙', fill: { c: '#2E5A3E' } },
  { id: 'b73', cat: 'bottom', tpl: 'hotShorts', name: '棕色短裤', fill: { c: '#6A4232' } },
  { id: 'b74', cat: 'bottom', tpl: 'aMini', name: '紫白条纹短裙', fill: { p: 'stripePurple' } },
  { id: 'b75', cat: 'bottom', tpl: 'leggings', name: '黑色打底裤', fill: { c: '#2A2528' } },
  { id: 'b76', cat: 'bottom', tpl: 'leggings', name: '紫色打底裤', fill: { c: '#5A3A7A' } },
  /* 连衣裙 */
  { id: 'd20', cat: 'dress', tpl: 'babydollSlip', name: '粉色交叉肩带娃娃裙', fill: { c: '#F2B0C4' } },
  { id: 'd21', cat: 'dress', tpl: 'zipPinafore', name: '黑色拉链背带裙', fill: { c: '#2A2528' } },
  { id: 'd22', cat: 'dress', tpl: 'militaryDress', name: '灰色双排扣荷叶边连衣裙', fill: { c: '#5A5A60' }, alt: '#FBFAF6', rib: '#3E9A5A' },
  { id: 'd23', cat: 'dress', tpl: 'militaryDress', name: '黑色双排扣荷叶边连衣裙', fill: { c: '#2A2528' }, alt: '#FBFAF6', rib: '#F4A7C0' },
  { id: 'd24', cat: 'dress', tpl: 'sweaterDress', name: '奶黄麻花高领毛衣裙', fill: { p: 'cablecream' }, rib: '#F2DCA0', alt: '#FBFAF6' },
  { id: 'd25', cat: 'dress', tpl: 'slipDress', name: '黑色蕾丝吊带裙', fill: { p: 'blacklace' } }
];
const V16_IDS = new Set([...NEW16.map(i => i.id), 'h36', 'h37', 'h38', 'h39', ...Array.from({ length: 22 }, (_, k) => 'l' + (19 + k)), ...Array.from({ length: 14 }, (_, k) => 's' + (23 + k)), ...Array.from({ length: 21 }, (_, k) => 'a' + (95 + k))]);
NEW16.forEach(i => { i.isNew = true; });
WARDROBE.forEach(i => { if (V16_IDS.has(i.id)) i.isNew = true; });
(() => {
  const fresh = WARDROBE.filter(i => V16_IDS.has(i.id));
  fresh.forEach(i => WARDROBE.splice(WARDROBE.indexOf(i), 1));
  WARDROBE.unshift(...NEW16, ...fresh);
})();
