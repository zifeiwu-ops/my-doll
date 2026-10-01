/* =====================================================================
   西部波西米亚（2004 秋冬秀场风）：10 套造型 —— 绣花牛仔、流苏、蕾丝荷叶、牛仔靴、牛仔帽、红色头巾发带
   用本作的版型和画风重画，不描原图
   ===================================================================== */
IP_LABEL.western = '西部波西米亚';
PATTERN_DEFS += `
<pattern id="pat-peachstripe" patternUnits="userSpaceOnUse" width="8" height="9"><rect width="8" height="9" fill="#F4CDB8"/><rect y="3.6" width="8" height=".7" fill="#C87E6A" opacity=".7"/><rect y="7.4" width="8" height=".5" fill="#E8A88C" opacity=".8"/></pattern>
<pattern id="pat-bluestripeV" patternUnits="userSpaceOnUse" width="6" height="10"><rect width="6" height="10" fill="#8EC3E6"/><rect width="2.2" height="10" fill="#2E6AB0"/><rect x="3.6" width=".8" height="10" fill="#FBFAF4"/></pattern>
<pattern id="pat-westfloral" patternUnits="userSpaceOnUse" width="28" height="28"><rect width="28" height="28" fill="#F4ECE2"/>${_flower5(7, 7, 4.4, '#B8604A', '#E8C27A')}${_flower5(21, 19, 3.8, '#8AA6C8', '#F4ECE2')}<ellipse cx="15" cy="9" rx="3" ry="1.2" fill="#8A9A6A" transform="rotate(-30 15 9)"/><ellipse cx="9" cy="21" rx="2.6" ry="1" fill="#8A9A6A" transform="rotate(30 9 21)"/></pattern>
<pattern id="pat-pinkcrochet" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="6" height="6" fill="#D88A90"/><circle cx="3" cy="3" r="1.5" fill="none" stroke="#F2B8BC" stroke-width=".7"/><circle cx="0" cy="0" r="1.1" fill="#B8686E"/><circle cx="6" cy="6" r="1.1" fill="#B8686E"/></pattern>
<linearGradient id="grad-goldsatin" gradientUnits="userSpaceOnUse" x1="110" y1="0" x2="190" y2="0"><stop offset="0" stop-color="#B8925A"/><stop offset=".35" stop-color="#F2DCA6"/><stop offset=".6" stop-color="#C8A26A"/><stop offset="1" stop-color="#8E6A3A"/></linearGradient>`;
Object.assign(PAT_BASE, { peachstripe: '#F4CDB8', bluestripeV: '#6A9AD0', westfloral: '#E8DCCC', pinkcrochet: '#D88A90' });
Object.assign(GRAD_BASE, { goldsatin: '#D2B07A' });

/* 牛仔帽：中间压出凹痕的帽顶 + 两边往上翘的宽帽檐 */
const cowboyHat = (id, name, c, band) => ({
  id, cat: 'acc', sub: 'hat', name, thumb: '80 20 140 90', isNew: true, ip: 'western',
  parts: () => {
    const brim = spline([[82, 74, 'c'], [96, 86], [122, 92], [150, 93], [178, 92], [204, 86], [218, 74, 'c'], [212, 84], [192, 97], [150, 101], [108, 97], [88, 84]]);
    const crown = spline([[116, 90, 'c'], [117, 66], [123, 50], [136, 43], [150, 46.5], [164, 43], [177, 50], [183, 66], [184, 90, 'c'], [150, 93]]);   // 帽顶中间只浅浅压一道
    const bd = spline([[117.4, 80, 'c'], [150, 83], [182.6, 80, 'c'], [183.6, 89, 'c'], [150, 92.6], [116.4, 89, 'c']]);
    return [{ z: 56, svg: piece(brim, c, { folds: ['M 100 88 Q 124 96 150 97', 'M 200 88 Q 176 96 150 97'] }) + piece(crown, c, { folds: ['M 150 48 Q 149 62 150 76', 'M 132 50 Q 128 66 130 82'] }) + piece(bd, band, {}) + `<circle cx="168" cy="86" r="3.2" fill="#F2DCA6" stroke="${STYLE.line}" stroke-width=".7"/>` }];
  }
});
const WEST25 = [
  /* 1 蜜桃条纹长袖蓬袖连衣裙 */
  { id: 't94', cat: 'top', tpl: 'puffBlouse', name: '蜜桃条纹灯笼袖上衣', fill: { p: 'peachstripe' }, alt: 'url(#pat-peachstripe)', rib: '#F29A2A' },
  { id: 'b84', cat: 'bottom', tpl: 'tierMidi', name: '蜜桃条纹蛋糕中长裙', fill: { p: 'peachstripe' }, rib: '#F29A2A' },
  cowboyHat('a116', '柠檬黄牛仔帽', '#F2D35A', '#C8963A'),
  /* 2 白色绣花西部夹克 + 蓝条纹衬衫 + 白流苏裙 */
  { id: 'o44', cat: 'outer', tpl: 'denimJacket', name: '白色绣花西部夹克', fill: { c: '#F8F6F0' }, stitch: '#2E9AB0', print: 'patch' },
  { id: 't95', cat: 'top', tpl: 'buttonShirt', name: '蓝色竖条纹衬衫', fill: { p: 'bluestripeV' } },
  { id: 'b85', cat: 'bottom', tpl: 'tierSkirt', name: '白色流苏蛋糕裙', fill: { c: '#F8F6F0' }, alt: '#F2EEE4', rib: '#E8E2D6' },
  /* 3 白色红边夹克 + 浅蓝纱衫 + 白色喇叭裤 */
  { id: 'o45', cat: 'outer', tpl: 'denimJacket', name: '白色红边西部夹克', fill: { c: '#F8F6F0' }, stitch: '#D8323C' },
  { id: 't96', cat: 'top', tpl: 'cami', name: '浅蓝印花纱质吊带', fill: { p: 'sheerblue' } },
  { id: 'b86', cat: 'bottom', tpl: 'flareJeans', name: '白色红线喇叭裤', fill: { c: '#F8F6F0' }, stitch: '#D8323C' },
  { id: 'a117', cat: 'acc', sub: 'hairacc', name: '红色头巾发带', thumb: '96 50 108 70', isNew: true, ip: 'western',
    parts: () => {   // 叠成长条的头巾绑在额头发际线上，右边打一个结、垂两个小角
      const arc = 'M 105.4 100 C 112 82 130 74.6 150 74.6 C 170 74.6 188 82 194.6 100';
      const knot = `<ellipse cx="195" cy="101" rx="4.2" ry="3.6" fill="#E84A2E" stroke="${INK}" stroke-width=".9"/><path d="M 196 104 L 203 116 L 199 117 Z M 194 104 L 195 118 L 191.6 116 Z" fill="#E84A2E" stroke="${INK}" stroke-width=".8" stroke-linejoin="round"/>`;
      return [{ z: 56, svg: `<path d="${arc}" fill="none" stroke="${INK}" stroke-width="11.6" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="#E84A2E" stroke-width="9.6" stroke-linecap="round"/><path d="${arc}" fill="none" stroke="#FBEADA" stroke-width="1.3" stroke-dasharray=".1 3.2" stroke-linecap="round"/>` + knot }];
    } },
  /* 4 粉色钩针开衫 + 白色短上衣 + 奶油长裙 */
  { id: 'o46', cat: 'outer', tpl: 'cropCardi', name: '玫粉钩针开衫', fill: { p: 'pinkcrochet' }, rib: '#C8767C' },
  { id: 't97', cat: 'top', tpl: 'cami', name: '白色蕾丝短上衣', fill: { p: 'eyelet' } },
  { id: 'b87', cat: 'bottom', tpl: 'fullMidi', name: '奶油色荷叶长裙', fill: { c: '#F4EAC8' } },
  /* 5 金色缎面荷叶连衣裙 */
  { id: 'd29', cat: 'dress', tpl: 'slipDress', name: '金色缎面蕾丝裙', fill: { g: 'goldsatin' } },
  /* 6 卡其马甲 + 蓝佩斯利连衣裙 */
  { id: 'o47', cat: 'outer', tpl: 'knitVest', name: '卡其色麂皮马甲', fill: { c: '#B8A07A' } },
  { id: 'd30', cat: 'dress', tpl: 'babydollSlip', name: '浅蓝佩斯利娃娃裙', fill: { p: 'bluepaisley' } },
  /* 7 深色绣花牛仔夹克 + 花朵衬衫 + 直筒牛仔裤 */
  { id: 'o48', cat: 'outer', tpl: 'denimJacket', name: '深蓝绣花牛仔夹克', fill: { p: 'darkdenim' }, stitch: '#E8C25A', print: 'patch' },
  { id: 't98', cat: 'top', tpl: 'printShirt', name: '复古花朵荷叶衬衫', fill: { p: 'westfloral' } },
  { id: 'b88', cat: 'bottom', tpl: 'skinnyJeans', name: '深蓝直筒牛仔裤', fill: { p: 'darkdenim' }, stitch: '#C8A46A' },
  /* 8 荷叶牛仔夹克 + 白蕾丝衬衫 + 牛仔七分裤 */
  { id: 't99', cat: 'top', tpl: 'frillBlouse', name: '白色蕾丝荷叶衬衫', fill: { c: '#FBFAF4' }, alt: '#FBFAF4' },
  { id: 'b89', cat: 'bottom', tpl: 'capris', name: '深蓝牛仔七分裤', fill: { p: 'darkdenim' }, detail: '#C8A46A' },
  /* 9 浅蓝绣花外套 + 白色镂空中长裙 */
  { id: 'o49', cat: 'outer', tpl: 'blazer', name: '浅蓝绣花短外套', fill: { c: '#A8D2D6' } },
  { id: 'b90', cat: 'bottom', tpl: 'slitSkirt', name: '白色镂空刺绣中长裙', fill: { p: 'eyelet' } },
  /* 10 军装风牛仔外套 + 浅牛仔七分裤 */
  { id: 'o50', cat: 'outer', tpl: 'blazer', name: '牛仔蓝金扣军装外套', fill: { p: 'greydenim' } },
  { id: 'b91', cat: 'bottom', tpl: 'capris', name: '浅牛仔七分裤', fill: { p: 'greydenim' }, detail: '#C8A46A' }
];
WEST25.forEach(i => { i.isNew = true; i.ip = 'western'; });
WARDROBE.unshift(...WEST25);
const W0 = { top: null, bottom: null, dress: null, outer: null, legs: null, warmer: null, acc: [] };
LOOKS.unshift(
  { name: '蜜桃条纹 · 黄牛仔帽', ip: 'western', o: { ...W0, hair: 'h20', hairColor: '#7A4A30', top: 't94', bottom: 'b84', shoes: 's25', acc: ['a116'] } },
  { name: '白绣花夹克 · 流苏裙', ip: 'western', o: { ...W0, hair: 'h12', hairColor: '#8A5A3A', outer: 'o44', top: 't95', bottom: 'b85', shoes: 's32' } },
  { name: '红边夹克 · 白喇叭裤', ip: 'western', o: { ...W0, hair: 'h11', outer: 'o45', top: 't96', bottom: 'b86', shoes: 's3', acc: ['a117'] } },
  { name: '玫粉钩针 · 奶油长裙', ip: 'western', o: { ...W0, hair: 'h11', outer: 'o46', top: 't97', bottom: 'b87', warmer: 'l15', shoes: 's14', acc: ['a117'] } },
  { name: '金色缎面蕾丝裙', ip: 'western', o: { ...W0, hair: 'h40', hairColor: '#6A3A2A', dress: 'd29', shoes: 's25', acc: ['a52'] } },
  { name: '卡其马甲 · 佩斯利裙', ip: 'western', o: { ...W0, hair: 'h25', hairColor: '#6A4A3A', outer: 'o47', dress: 'd30', shoes: 's34', acc: ['a96', 'a42'] } },
  { name: '绣花牛仔 · 花衬衫', ip: 'western', o: { ...W0, hair: 'h11', outer: 'o48', top: 't98', bottom: 'b88', shoes: 's11' } },
  { name: '荷叶牛仔 · 七分裤', ip: 'western', o: { ...W0, hair: 'h20', hairColor: '#8A5A3A', outer: 'o48', top: 't99', bottom: 'b89', shoes: 's10' } },
  { name: '浅蓝绣花 · 白镂空裙', ip: 'western', o: { ...W0, hair: 'h40', hairColor: '#5A3A2A', outer: 'o49', top: 't99', bottom: 'b90', shoes: 's14' } },
  { name: '军装牛仔 · 牛仔帽', ip: 'western', o: { ...W0, hair: 'h20', hairColor: '#C8703A', outer: 'o50', top: 't99', bottom: 'b91', shoes: 's6', acc: ['a96'] } }
);
