/* ---------------- 上新 · 千禧校园 & 甜系插画系列（排在各分类最前面） ---------------- */
const V10_IDS = new Set(['h9', 'h10', 'h11', 'h12', 'h13', 'h14', 'h15', 'h16', 'h17', 'h18', 'h19', 'l4', 'l5', 'l6', 's8', 's9', 's10', 'a20', 'a21', 'a22', 'a23', 'a24', 'a25', 'a26', 'a27', 'a28', 'a29', 'a30', 'a31', 'a32', 'a33', 'a34', 'a35', 'a36', 'a37']);
WARDROBE.forEach(i => { if (!V10_IDS.has(i.id)) delete i.isNew; });
const NEW10 = [
  /* 上衣 */
  { id: 't16', cat: 'top', tpl: 'ribCardiTop', name: '奶白罗纹翻领开衫', fill: { p: 'ribcream' } },
  { id: 't17', cat: 'top', tpl: 'tubeTop', name: '雾蓝刺绣蕾丝抹胸', fill: { p: 'blueemb' }, alt: '#EAF1FA' },
  { id: 't18', cat: 'top', tpl: 'mockTee', name: '可可棕小高领长袖T', fill: { c: '#4A3129' } },
  { id: 't19', cat: 'top', tpl: 'ruchedCami', name: '芥末黄抽褶蕾丝吊带', fill: { c: '#D9A033' } },
  { id: 't20', cat: 'top', tpl: 'cami', name: '冰蓝细吊带背心', fill: { c: '#A9CFEE' } },
  { id: 't21', cat: 'top', tpl: 'bardotTop', name: '薄荷露肩条纹袖上衣', fill: { c: '#FBF3E0' }, alt: '#9ED9CF', sleeve: 'url(#pat-stripetaupe)' },
  { id: 't22', cat: 'top', tpl: 'oversizeSweat', name: '湖蓝风车斜肩大卫衣', fill: { c: '#4FA9A3' }, print: 'windmill' },
  { id: 't23', cat: 'top', tpl: 'tuckBlouse', name: '奶油泡泡袖领结衬衫', fill: { c: '#FBF3E3' }, alt: '#FBF3E3', rib: '#F2A6C0' },
  { id: 't24', cat: 'top', tpl: 'cropTee', name: '咖色条纹短T', fill: { p: 'brownstripe' }, rib: '#6B5040' },
  /* 外套 */
  { id: 'o7', cat: 'outer', tpl: 'cropCardi', name: '藏青毛绒短开衫', fill: { p: 'fuzznavy' }, rib: '#27335A' },
  { id: 'o8', cat: 'outer', tpl: 'cropCardi', name: '芥末黄短开衫', fill: { p: 'fuzzmustard' }, rib: '#C98F2C' },
  { id: 'o9', cat: 'outer', tpl: 'cardigan', name: '烟灰色长开衫', fill: { p: 'heather' }, rib: '#6F6867' },
  { id: 'o10', cat: 'outer', tpl: 'cardigan', name: '灰色麻花粗针开衫', fill: { p: 'cablegrey' }, rib: '#77706E' },
  { id: 'o11', cat: 'outer', tpl: 'meshShrug', name: '黑色网纱罩衫', fill: { c: '#2A2628' }, alt: 'url(#pat-mesh)' },
  { id: 'o12', cat: 'outer', tpl: 'bomber', name: '奶油罗纹棒球外套', fill: { c: '#FBF3DA' }, rib: 'url(#pat-bomberrib)' },
  { id: 'o13', cat: 'outer', tpl: 'collarJacket', name: '咖啡波点大翻领外套', fill: { p: 'browndots' }, alt: '#7A5846' },
  { id: 'o14', cat: 'outer', tpl: 'zipHoodieOpen', name: '黑色波点连帽外套', fill: { p: 'blackdots' }, rib: '#2C282B' },
  /* 下装 */
  { id: 'b11', cat: 'bottom', tpl: 'pleatedMini', name: '红棕格纹百褶裙', fill: { p: 'redplaid' } },
  { id: 'b12', cat: 'bottom', tpl: 'aMini', name: '藏青碎花A字短裙', fill: { p: 'navyfloral' } },
  { id: 'b13', cat: 'bottom', tpl: 'tierPleat', name: '米黄格纹拼层百褶裙', fill: { p: 'yellowplaid' } },
  { id: 'b14', cat: 'bottom', tpl: 'sashPants', name: '向日葵印花系巾阔腿裤', fill: { p: 'sunflower' }, rib: 'url(#pat-paisleyred)' },
  { id: 'b15', cat: 'bottom', tpl: 'aMini', name: '豹纹短裙', fill: { p: 'leopard' } },
  { id: 'b16', cat: 'bottom', tpl: 'denimMini', name: '铆钉腰带牛仔短裙', fill: { p: 'lightdenim' } },
  { id: 'b17', cat: 'bottom', tpl: 'tierSkirt', name: '薄荷蛋糕纱裙', fill: { c: '#BDE7E0' }, alt: '#A6DCD3', rib: '#F48FB1', print: 'bow' },
  { id: 'b18', cat: 'bottom', tpl: 'aMini', name: '咖啡大波点短裙', fill: { p: 'bigbrowndots' } },
  { id: 'b19', cat: 'bottom', tpl: 'skirtJeans', name: '薄荷纱裙叠穿阔腿牛仔', fill: { c: '#9ED9CF' }, alt: '#86CDC1' },
  { id: 'b20', cat: 'bottom', tpl: 'capris', name: '樱花粉工装七分裤', fill: { c: '#F6C4D4' } },
  { id: 'b21', cat: 'bottom', tpl: 'longPleat', name: '香芋紫长百褶裙', fill: { c: '#D8C4E6' }, rib: '#7A5646' },
  { id: 'b22', cat: 'bottom', tpl: 'beltShorts', name: '波点宽腰带短裤', fill: { p: 'bigdots' }, rib: '#F28BB0' },
  /* 连衣裙 */
  { id: 'd5', cat: 'dress', tpl: 'yokeDress', name: '香芋紫网纱拼接连衣裙', fill: { c: '#DCCCEC' } },
  { id: 'd6', cat: 'dress', tpl: 'dotTunic', name: '灰色波点腰带连衣裙', fill: { p: 'greydots' }, alt: 'url(#pat-mintstripe)', rib: '#F28BB0' }
];
NEW10.forEach(i => { i.isNew = true; });
WARDROBE.unshift(...NEW10);
/* 新发型 / 袜子 / 鞋 / 小物在 HAIRS / EXTRA 里，也挪到各分类最前面 */
(() => {
  const fresh = WARDROBE.filter(i => V10_IDS.has(i.id));
  fresh.forEach(i => WARDROBE.splice(WARDROBE.indexOf(i), 1));
  WARDROBE.unshift(...fresh);
})();
