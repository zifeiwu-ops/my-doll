/* ---------------- 西部波西米亚 · 第三批：10 套（蕾丝披肩 + 鱼尾牛仔、薄荷条纹蛋糕裙、印花背心裙、军装外套、亚麻西装） ---------------- */
PATTERN_DEFS += `
<pattern id="pat-darklace" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="8" height="8" fill="#4A3430"/><circle cx="4" cy="4" r="2.4" fill="none" stroke="#7A5A50" stroke-width=".8"/><circle cx="0" cy="0" r="1.4" fill="#2E201E"/><circle cx="8" cy="8" r="1.4" fill="#2E201E"/></pattern>
<pattern id="pat-bluedrops" patternUnits="userSpaceOnUse" width="12" height="12"><rect width="12" height="12" fill="#9AB8D2"/><ellipse cx="3" cy="3" rx="1.2" ry="1.8" fill="#1E2A3A"/><ellipse cx="9" cy="8" rx="1" ry="1.5" fill="#1E2A3A"/><circle cx="8" cy="2" r=".7" fill="#F4F2EC"/><circle cx="3" cy="9" r=".7" fill="#F4F2EC"/></pattern>
<pattern id="pat-mintstripe2" patternUnits="userSpaceOnUse" width="10" height="12"><rect width="10" height="12" fill="#A8D8C4"/><rect y="2" width="10" height="1.4" fill="#E8A8B0"/><rect y="5" width="10" height="2" fill="#E2EEDA"/><rect y="8.6" width="10" height="1" fill="#7AA6C8"/><rect y="10.4" width="10" height=".6" fill="#C8B070"/></pattern>
<pattern id="pat-minttoile" patternUnits="userSpaceOnUse" width="30" height="30"><rect width="30" height="30" fill="#C8E6DA"/><path d="M 4 24 L 4 14 Q 9 8 14 14 L 14 24 Z" fill="none" stroke="#1E2A2A" stroke-width="1"/><path d="M 20 26 L 20 18 M 16 20 Q 20 12 24 20" fill="none" stroke="#1E2A2A" stroke-width="1"/><circle cx="22" cy="6" r="3" fill="none" stroke="#1E2A2A" stroke-width=".9"/><rect x="0" y="28" width="30" height="1.4" fill="#1E2A2A"/></pattern>
<pattern id="pat-khakilinen" patternUnits="userSpaceOnUse" width="4" height="4"><rect width="4" height="4" fill="#B8A07A"/><path d="M 0 1 H 4 M 1 0 V 4" stroke="#A88E68" stroke-width=".5"/></pattern>
<pattern id="pat-brownpin" patternUnits="userSpaceOnUse" width="5" height="10"><rect width="5" height="10" fill="#6E5242"/><rect x="2.2" width=".5" height="10" fill="#A88A70"/></pattern>`;
Object.assign(PAT_BASE, { darklace: '#4A3430', bluedrops: '#8AA8C2', mintstripe2: '#B4D8C8', minttoile: '#B8D8CC', khakilinen: '#B8A07A', brownpin: '#6E5242' });
const WEST27 = [
  { id: 'o54', cat: 'outer', tpl: 'shoulderWrap', name: '深棕蕾丝小披肩', fill: { p: 'darklace' } },
  { id: 't105', cat: 'top', tpl: 'cami', name: '牛仔束腰短上衣', fill: { p: 'darkdenim' } },
  { id: 'b98', cat: 'bottom', tpl: 'mermaidDenim', name: '深蓝鱼尾牛仔长裙', fill: { p: 'darkdenim' }, alt: 'url(#pat-darkdenim)' },
  { id: 'o55', cat: 'outer', tpl: 'cardigan', name: '深棕珠饰边针织开衫', fill: { c: '#3E2A26' }, rib: '#2A3A4A' },
  { id: 'b99', cat: 'bottom', tpl: 'fullMidi', name: '雾蓝墨点荷叶裙', fill: { p: 'bluedrops' } },
  { id: 't106', cat: 'top', tpl: 'frillCrop', name: '薄荷条纹露肩上衣', fill: { p: 'mintstripe2' }, alt: '#C8E6D8', rib: '#C8B070', detail: '#C8B070' },
  { id: 'b100', cat: 'bottom', tpl: 'tierMidi', name: '薄荷条纹亮片蛋糕裙', fill: { p: 'mintstripe2' } },
  { id: 'd34', cat: 'dress', tpl: 'pinafore', name: '薄荷印花背心裙', fill: { p: 'minttoile' }, alt: '#FBFAF4', rib: '#C8E6DA' },
  { id: 't107', cat: 'top', tpl: 'tuckBlouse', name: '白色蕾丝泡泡袖衬衫', fill: { c: '#FBFAF4' }, alt: '#FBFAF4', rib: '#E8D8B0' },
  { id: 'b101', cat: 'bottom', tpl: 'ruffleMini', name: '卡其荷叶摆短裙', fill: { p: 'khakilinen' }, alt: '#EEE6CC' },
  { id: 'o56', cat: 'outer', tpl: 'blazer', name: '卡其金边军装外套', fill: { c: '#A8A486' } },
  { id: 't108', cat: 'top', tpl: 'cami', name: '白色绑带抹胸', fill: { c: '#F6F2E8' } },
  { id: 'o57', cat: 'outer', tpl: 'cropCardi', name: '白色镂空刺绣开衫', fill: { p: 'eyelet' }, rib: '#F4F0E8' },
  { id: 'd35', cat: 'dress', tpl: 'dotTunic', name: '白色蕾丝边连衣裙', fill: { c: '#F8F6F0' }, alt: '#F8F6F0', rib: '#C89A5A' },
  { id: 'o58', cat: 'outer', tpl: 'cropCardi', name: '奶黄荷叶边开衫', fill: { c: '#F4ECC6' }, rib: '#F4ECC6' },
  { id: 'b102', cat: 'bottom', tpl: 'tierMidi', name: '白色细褶蛋糕裙', fill: { c: '#F8F6F0' } },
  { id: 'o59', cat: 'outer', tpl: 'blazer', name: '燕麦色亚麻西装外套', fill: { p: 'khakilinen' } },
  { id: 'b103', cat: 'bottom', tpl: 'ruffleMini', name: '棕色细条纹荷叶裙', fill: { p: 'brownpin' }, alt: 'url(#pat-brownpin)' },
  { id: 't109', cat: 'top', tpl: 'puffBlouse', name: '薄荷荷叶边衬衫', fill: { c: '#DCEEE6' }, alt: '#DCEEE6', rib: '#C8A050' },
  { id: 'b104', cat: 'bottom', tpl: 'slacks', name: '亚麻阔腿长裤', fill: { p: 'khakilinen' } }
];
WEST27.forEach(i => { i.isNew = true; i.ip = 'western'; });
WARDROBE.unshift(...WEST27);
LOOKS.unshift(
  { name: '蕾丝披肩 · 鱼尾牛仔', ip: 'western', o: { ...W0, hair: 'h11', outer: 'o54', top: 't105', bottom: 'b98', shoes: 's27' } },
  { name: '珠饰开衫 · 墨点荷叶裙', ip: 'western', o: { ...W0, hair: 'h20', hairColor: '#C8502A', outer: 'o55', top: 't108', bottom: 'b99', shoes: 's34', acc: ['a96'] } },
  { name: '薄荷条纹 · 亮片蛋糕裙', ip: 'western', o: { ...W0, hair: 'h20', hairColor: '#8A6A4A', top: 't106', bottom: 'b100', shoes: 's11', acc: ['a52'] } },
  { name: '薄荷印花背心裙', ip: 'western', o: { ...W0, hair: 'h11', hairColor: '#F2E6C8', dress: 'd34', shoes: 's27' } },
  { name: '蕾丝泡泡袖 · 卡其荷叶裙', ip: 'western', o: { ...W0, hair: 'h20', hairColor: '#8A6A4A', top: 't107', bottom: 'b101', shoes: 's25', acc: ['a53'] } },
  { name: '金边军装 · 深色牛仔', ip: 'western', o: { ...W0, hair: 'h20', hairColor: '#C8602A', outer: 'o56', top: 't108', bottom: 'b88', shoes: 's11' } },
  { name: '白镂空开衫 · 白裙', ip: 'western', o: { ...W0, hair: 'h20', hairColor: '#8A6A4A', outer: 'o57', dress: 'd35', shoes: 's14', acc: ['a42'] } },
  { name: '奶黄开衫 · 白蛋糕裙', ip: 'western', o: { ...W0, hair: 'h11', hairColor: '#C8A46A', outer: 'o58', top: 't100', bottom: 'b102', shoes: 's34', acc: ['a62'] } },
  { name: '亚麻西装 · 细条纹裙', ip: 'western', o: { ...W0, hair: 'h20', hairColor: '#8A5A3A', outer: 'o59', top: 't104', bottom: 'b103', shoes: 's35', acc: ['a116'] } },
  { name: '薄荷荷叶衬衫 · 亚麻长裤', ip: 'western', o: { ...W0, hair: 'h11', hairColor: '#F4ECD0', top: 't109', bottom: 'b104', shoes: 's5' } }
);
