/* ---------------- 本期主题 · 糖果装饰风（kidcore / decora，排在各分类最前面） ---------------- */
const NEW15 = [
  /* 上衣 */
  { id: 't57', cat: 'top', tpl: 'bandeauBow', name: '彩虹条纹蝴蝶结抹胸', fill: { p: 'rainbowstripe' }, alt: '#F48FB1' },
  { id: 't58', cat: 'top', tpl: 'bandeauBow', name: '粉色爱心抹胸', fill: { p: 'pinkhearts' }, alt: '#E8454F' },
  { id: 't59', cat: 'top', tpl: 'halterCrop', name: '湖蓝星星挂脖短上衣', fill: { p: 'turqstars' }, rib: '#3AAAB4' },
  { id: 't60', cat: 'top', tpl: 'halterCrop', name: '柠檬黄笑脸挂脖上衣', fill: { c: '#FBE67A' }, rib: '#F2C94C', print: 'smile' },
  { id: 't61', cat: 'top', tpl: 'puffCrop', name: '薄荷泡泡袖短上衣', fill: { c: '#A6E3B4' }, alt: '#E8454F', rib: '#86D09A' },
  { id: 't62', cat: 'top', tpl: 'puffCrop', name: '粉色爱心泡泡袖短上衣', fill: { c: '#F8C2D4' }, alt: '#8FD0F2', rib: '#F2A6C0', print: 'heart' },
  { id: 't63', cat: 'top', tpl: 'cropSweat', name: '薄荷绿花花短卫衣', fill: { c: '#9EDFC0' }, rib: '#F7A8C4', print: 'flower' },
  { id: 't64', cat: 'top', tpl: 'cropSweat', name: '柠檬黄樱桃短卫衣', fill: { c: '#FBE38A' }, rib: '#8FD0F2', print: 'cherry' },
  { id: 't65', cat: 'top', tpl: 'cami', name: '糖果波点吊带', fill: { p: 'candydots' } },
  { id: 't66', cat: 'top', tpl: 'bandeauBow', name: '黑色蝴蝶结抹胸', fill: { c: '#2C272A' }, alt: '#F48FB1' },
  /* 外套 */
  { id: 'o28', cat: 'outer', tpl: 'cropCardi', name: '黑色毛绒短开衫', fill: { p: 'fuzzblack' }, rib: '#1E1A1C' },
  { id: 'o29', cat: 'outer', tpl: 'denimJacket', name: '宽松牛仔外套', fill: { p: 'denim' } },
  { id: 'o30', cat: 'outer', tpl: 'denimJacket', name: '补丁浅蓝牛仔外套', fill: { p: 'lightdenim' }, print: 'patch' },
  { id: 'o31', cat: 'outer', tpl: 'cropCardi', name: '粉色毛绒短开衫', fill: { p: 'fuzzpink' }, rib: '#E490AE' },
  /* 下装 */
  { id: 'b51', cat: 'bottom', tpl: 'aMini', name: '波浪条纹短裙', fill: { p: 'wavestripe' } },
  { id: 'b52', cat: 'bottom', tpl: 'aMini', name: '彩色豹纹短裙', fill: { p: 'pastelleo' } },
  { id: 'b53', cat: 'bottom', tpl: 'ruffleMini', name: '牛仔粉荷叶边短裙', fill: { p: 'lightdenim' }, alt: '#F7A8C4' },
  { id: 'b54', cat: 'bottom', tpl: 'ruffleMini', name: '红爱心蓝荷叶边短裙', fill: { p: 'redhearts' }, alt: '#7CC6F0' },
  { id: 'b55', cat: 'bottom', tpl: 'pleatedMini', name: '粉红格纹百褶裙', fill: { p: 'pinkplaid' } },
  { id: 'b56', cat: 'bottom', tpl: 'tierMidi', name: '柠檬花花长裙', fill: { p: 'lemonfloral' }, rib: '#F7A8C4' },
  { id: 'b57', cat: 'bottom', tpl: 'baggyJeans', name: '破洞阔腿牛仔裤', fill: { p: 'darkdenim' } },
  { id: 'b58', cat: 'bottom', tpl: 'tierSkirt', name: '彩虹蛋糕短裙', fill: { c: '#F7B6CC' }, alt: '#FFE58A', rib: '#9CCBF2' },
  { id: 'b59', cat: 'bottom', tpl: 'ruffleMini', name: '糖果碎屑短裙', fill: { p: 'confetti' }, alt: '#FFFFFF', rib: '#F48FB1' },
  /* 连衣裙 */
  { id: 'd17', cat: 'dress', tpl: 'slipDress', name: '彩色糖果波点吊带裙', fill: { p: 'candydots' } },
  { id: 'd18', cat: 'dress', tpl: 'pinafore', name: '天蓝星星背带裙', fill: { c: '#8FC8F2' }, alt: '#F7A8C4', rib: '#FFFFFF', print: 'star' },
  { id: 'd19', cat: 'dress', tpl: 'pinafore', name: '薄荷斑点背带裙', fill: { p: 'mintspots' }, alt: '#FFFFFF', rib: '#F7A8C4', print: 'heart' }
];
const V15_IDS = new Set([...NEW15.map(i => i.id), 'h30', 'h31', 'h32', 'h33', 'h34', 'h35', 'l14', 'l15', 'l16', 'l17', 'l18', 's19', 's20', 's21', 's22', ...Array.from({ length: 18 }, (_, k) => 'a' + (77 + k))]);
WARDROBE.forEach(i => { if (V15_IDS.has(i.id)) i.isNew = true; else delete i.isNew; });
NEW15.forEach(i => { i.isNew = true; });
(() => {
  const fresh = WARDROBE.filter(i => V15_IDS.has(i.id));
  fresh.forEach(i => WARDROBE.splice(WARDROBE.indexOf(i), 1));
  WARDROBE.unshift(...NEW15, ...fresh);
})();
