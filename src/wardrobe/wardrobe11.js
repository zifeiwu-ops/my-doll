/* ---------------- 上新 · 美式松弛 / 复古森系 / 90s 古着辣妹（排在各分类最前面） ---------------- */
const NEW11 = [
  /* 上衣 */
  { id: 't25', cat: 'top', tpl: 'lapelShirt', name: '红格纹大翻领衬衫', fill: { p: 'redgingham' }, alt: 'url(#pat-starred)' },
  { id: 't26', cat: 'top', tpl: 'cutoutTie', name: '黑色镂空系带上衣', fill: { c: '#2A2628' } },
  { id: 't27', cat: 'top', tpl: 'henleyLayer', name: '焦糖橙亨利领叠穿T', fill: { c: '#D98A2E' }, alt: 'url(#pat-brownstripe)', rib: '#5A3A2E' },
  { id: 't28', cat: 'top', tpl: 'buttonShirt', name: '白色细条纹宽松衬衫', fill: { p: 'pinstripe' } },
  { id: 't29', cat: 'top', tpl: 'heartKnit', name: '红色爱心镂空针织衫', fill: { p: 'redknit' }, rib: '#B42E36' },
  { id: 't30', cat: 'top', tpl: 'poloSweat', name: '黑色叠领卫衣', fill: { c: '#2A2628' }, alt: '#FBFAF6', rib: '#2A2628' },
  { id: 't31', cat: 'top', tpl: 'poloLong', name: '红色Polo领长袖', fill: { c: '#C8363E' } },
  { id: 't32', cat: 'top', tpl: 'buttonShirt', name: '雾蓝宽松衬衫', fill: { c: '#6E80B8' } },
  { id: 't33', cat: 'top', tpl: 'argyleCardi', name: '草绿菱格纹开衫', fill: { c: '#4E8A3A' }, alt: '#F4F0E4', rib: '#3E7430' },
  { id: 't34', cat: 'top', tpl: 'sweater', name: '驼色麻花毛衣', fill: { p: 'cablecamel' }, rib: '#9A7040' },
  { id: 't35', cat: 'top', tpl: 'frillSleeveTee', name: '燕麦灰荷叶袖毛衣', fill: { c: '#BDB8AE' }, alt: '#F2ECE0' },
  { id: 't36', cat: 'top', tpl: 'laceScoop', name: '咖啡蕾丝大圆领长袖', fill: { p: 'brownlace' }, alt: '#6A4A3C' },
  { id: 't37', cat: 'top', tpl: 'velvetCrop', name: '巧克力丝绒短吊带', fill: { c: '#5E3C30' } },
  { id: 't38', cat: 'top', tpl: 'cami', name: '酒红蕾丝吊带', fill: { p: 'redlace' } },
  { id: 't39', cat: 'top', tpl: 'cami', name: '橄榄绿吊带背心', fill: { c: '#7C8452' } },
  { id: 't40', cat: 'top', tpl: 'embroCardi', name: '粉色刺绣花边短开衫', fill: { c: '#F2A8C0' }, alt: '#F2C24E', rib: '#E8923A' },
  { id: 't41', cat: 'top', tpl: 'mockTee', name: '橄榄毛绒小高领', fill: { p: 'olivefuzz' } },
  { id: 't42', cat: 'top', tpl: 'tieCrop', name: '薄荷系带喇叭袖开衫', fill: { c: '#8FBFA6' } },
  { id: 't43', cat: 'top', tpl: 'cami', name: '米色针织吊带', fill: { p: 'beigeknit' } },
  { id: 't44', cat: 'top', tpl: 'cami', name: '烟灰细吊带背心', fill: { c: '#8C857A' } },
  /* 外套 */
  { id: 'o15', cat: 'outer', tpl: 'cropCardi', name: '炭灰短开衫', fill: { c: '#3A383C' }, rib: '#2A2628' },
  { id: 'o16', cat: 'outer', tpl: 'cropCardi', name: '湖蓝毛绒开衫', fill: { p: 'tealfuzz' }, rib: '#1B8A94' },
  { id: 'o17', cat: 'outer', tpl: 'shoulderWrap', name: '灰色针织披肩', fill: { p: 'heather' }, rib: '#6F6867' },
  { id: 'o18', cat: 'outer', tpl: 'knitVest', name: '棕色费尔岛针织马甲', fill: { p: 'fairislebrown' }, rib: '#3A2620' },
  { id: 'o19', cat: 'outer', tpl: 'knitVest', name: '橙色粗针马甲', fill: { p: 'orangeknit' }, rib: '#A84C1E' },
  { id: 'o20', cat: 'outer', tpl: 'cardigan', name: '雾蓝费尔岛开衫', fill: { p: 'fairisleblue' }, rib: '#3E5A80' },
  { id: 'o21', cat: 'outer', tpl: 'cardigan', name: '酒红丝绒开衫', fill: { c: '#7A1E2A' }, rib: '#62141F' },
  { id: 'o22', cat: 'outer', tpl: 'corsetVest', name: '咖色束身马甲', fill: { c: '#4A3228' } },
  { id: 'o23', cat: 'outer', tpl: 'cardigan', name: '草绿长毛开衫', fill: { p: 'greenfuzz' }, rib: '#6C9234' },
  { id: 'o24', cat: 'outer', tpl: 'cardigan', name: '灰色薄针织开衫', fill: { c: '#948C80' }, rib: '#7A7266' },
  /* 下装 */
  { id: 'b23', cat: 'bottom', tpl: 'wideFlare', name: '深蓝阔腿喇叭牛仔裤', fill: { p: 'darkdenim' } },
  { id: 'b24', cat: 'bottom', tpl: 'asymPlaid', name: '深灰格纹不规则蕾丝裙', fill: { p: 'darkplaid' } },
  { id: 'b25', cat: 'bottom', tpl: 'wrapCargo', name: '星星牛仔裹裙叠穿工装裤', fill: { p: 'stardenim' }, alt: '#4A3A6A' },
  { id: 'b26', cat: 'bottom', tpl: 'bermuda', name: '奶白及膝百慕大短裤', fill: { c: '#F4F0E6' } },
  { id: 'b27', cat: 'bottom', tpl: 'bermuda', name: '黑色及膝百慕大短裤', fill: { c: '#2A2628' } },
  { id: 'b28', cat: 'bottom', tpl: 'slitSkirt', name: '橄榄麂皮开衩半裙', fill: { p: 'olivesuede' } },
  { id: 'b29', cat: 'bottom', tpl: 'cargo', name: '卡其宽松工装裤', fill: { c: '#B5AA86' } },
  { id: 'b30', cat: 'bottom', tpl: 'culottes', name: '橄榄灯芯绒裙裤', fill: { p: 'corduroyolive' } },
  { id: 'b31', cat: 'bottom', tpl: 'fullMidi', name: '藏青格纹大摆裙', fill: { p: 'navygingham' }, rib: '#4A2A5A' },
  { id: 'b32', cat: 'bottom', tpl: 'tierMidi', name: '碎花三层长裙', fill: { p: 'ditsy' }, rib: '#4E4658' },
  { id: 'b33', cat: 'bottom', tpl: 'balloonPants', name: '墨绿灯芯绒灯笼裤', fill: { p: 'corduroygreen' } },
  { id: 'b34', cat: 'bottom', tpl: 'sarongMaxi', name: '复古花卉系结长裙', fill: { p: 'floralsarong' } },
  { id: 'b35', cat: 'bottom', tpl: 'tierSkirt', name: '焦糖碎花荷叶短裙', fill: { p: 'ruffleflora' } },
  { id: 'b36', cat: 'bottom', tpl: 'aMini', name: '明黄碎花短裙', fill: { p: 'yellowfloral' } },
  { id: 'b37', cat: 'bottom', tpl: 'aMini', name: '银色金属光泽短裙', fill: { g: 'metal' } },
  { id: 'b38', cat: 'bottom', tpl: 'flareJeans', name: '灰色水洗喇叭裤', fill: { p: 'greydenim' } },
  { id: 'b39', cat: 'bottom', tpl: 'widePants', name: '卡其阔腿裤', fill: { c: '#C8BE92' } },
  { id: 'b40', cat: 'bottom', tpl: 'tierMidi', name: '白色细条纹蛋糕长裙', fill: { p: 'pinstripe' } }
];
const V11_IDS = new Set([
  ...NEW11.map(i => i.id),
  'h20', 'h21', 'h22', 'h23', 'h24', 'h25', 'l7', 'l8', 'l9', 'l10', 's11', 's12', 's13', 's14', 's15',
  ...Array.from({ length: 22 }, (_, k) => 'a' + (38 + k))
]);
WARDROBE.forEach(i => { if (V11_IDS.has(i.id)) i.isNew = true; else delete i.isNew; });
NEW11.forEach(i => { i.isNew = true; });
/* 新发型 / 袜子 / 鞋 / 小物在 HAIRS / EXTRA 里，也挪到各分类最前面 */
(() => {
  const fresh = WARDROBE.filter(i => V11_IDS.has(i.id));
  fresh.forEach(i => WARDROBE.splice(WARDROBE.indexOf(i), 1));
  WARDROBE.unshift(...NEW11, ...fresh);
})();
