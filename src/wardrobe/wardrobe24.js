/* ---------------- 摇滚学院：白色斜肩印花大卫衣 + 深灰格纹百褶裙（按照片导入） ---------------- */
IP_LABEL.rock = '摇滚学院';
const ROCK24 = [
  { id: 't93', cat: 'top', tpl: 'oversizeSweat', name: '白色斜肩摇滚印花卫衣', fill: { c: '#F8F5EE' }, print: 'rock', detail: '#E6E0D6', ip: 'rock', isNew: true },
  { id: 'b83', cat: 'bottom', tpl: 'pleatedMini', name: '深灰格纹百褶裙', fill: { p: 'darkplaid' }, ip: 'rock', isNew: true }
];
WARDROBE.unshift(...ROCK24);
LOOKS.unshift({ name: '斜肩摇滚卫衣 · 灰格百褶', ip: 'rock', o: { hair: 'h16', hairColor: '#2A2226', top: 't93', bottom: 'b83', dress: null, outer: null, legs: null, warmer: null, shoes: 's2', acc: [] } });
