/* =====================================================================
   守护甜心（Shugo Chara!）：游戏里已经有的「甜酷街头」那批就是按亚梦的私服画的 —— 这里只打系列标签、配好整套造型
   ===================================================================== */
IP_LABEL.shugo = '守护甜心';
const SHUGO = { hair: 'h36', hairColor: '#F2A6BC', top: null, bottom: null, dress: null, outer: null, legs: null, warmer: null, acc: [] };
const SHUGO_LOOKS = [
  ['蓝白外套 · 黑蕾丝吊带', { outer: 'o32', top: 't80', bottom: 'b67', legs: 'l30', shoes: 's29' }],
  ['麻花毛衣裙 · 红格长外套', { dress: 'd24', outer: 'o39', legs: 'l35', shoes: 's27' }],
  ['毛领机车夹克 · 系带马甲', { outer: 'o40', top: 't81', bottom: 'b66', legs: 'l36', shoes: 's20' }],
  ['黑色水手服 · 粉格裙', { top: 't82', bottom: 'b69', legs: 'l35', shoes: 's36' }],
  ['红格双排扣 · 酒红过膝袜', { outer: 'o38', top: 't80', bottom: 'b67', legs: 'l32', shoes: 's30' }],
  ['粉色运动外套 · 竖条纹袜', { top: 't84', bottom: 'b67', legs: 'l31', shoes: 's32' }],
  ['摇滚 T · 吊带袜', { top: 't83', bottom: 'b66', legs: 'l28', shoes: 's36', acc: ['a104'] }],
  ['条纹毛线帽 · 格纹围巾', { top: 't85', bottom: 'b66', legs: 'l21', shoes: 's29', acc: ['a109', 'a112'] }],
  ['粉色娃娃裙 · 黑外套', { dress: 'd20', outer: 'o32', shoes: 's26' }],
  ['白十字夹克 · 红七分裤', { outer: 'o33', top: 't80', bottom: 'b64', shoes: 's29' }],
  ['黑衬衫领带 · 白百褶', { top: 't75', bottom: 'b65', legs: 'l22', shoes: 's27', acc: ['a104'] }],
  ['白蕾丝衬衫 · 荷叶过膝袜', { top: 't71', bottom: 'b66', legs: 'l23', shoes: 's28', acc: ['a71'] }],
  ['米字旗 T · 紫荷叶裙', { top: 't72', bottom: 'b68', legs: 'l29', shoes: 's20' }],
  ['拉链背带裙 · 红白条纹袜', { top: 't74', dress: 'd21', legs: 'l24', shoes: 's12' }],
  ['红十字 T · 链条热裤', { top: 't73', bottom: 'b71', legs: 'l25', shoes: 's30' }],
  ['白开衫 · 紫格迷你裙', { top: 't80', outer: 'o42', bottom: 'b70', legs: 'l36', warmer: 'l14', shoes: 's36' }],
  ['Cherry Soda 背心 · 牛仔百褶', { top: 't67', bottom: 'b60', legs: 'l19', shoes: 's23', acc: ['a95'] }],
  ['水手条纹 T · 牛仔鱼尾长裙', { top: 't68', bottom: 'b61', shoes: 's24', acc: ['a96', 'a115'] }],
  ['兔子印花 T · 奶油荷叶裙', { top: 't69', bottom: 'b62', legs: 'l39', shoes: 's2', acc: ['a97'] }],
  ['雏菊 T · 黄绿格纹裙', { top: 't70', bottom: 'b63', legs: 'l20', shoes: 's25' }]
];
SHUGO_LOOKS.forEach(([name, o]) => LOOKS.push({ name, ip: 'shugo', o: { ...SHUGO, ...o } }));
/* 这些单品都标上系列 */
new Set(SHUGO_LOOKS.flatMap(([, o]) => [o.outer, o.top, o.bottom, o.dress, o.legs, o.warmer, o.shoes, ...(o.acc || [])]).filter(Boolean)).forEach(id => { const it = WARDROBE.find(i => i.id === id); if (it && !it.ip) it.ip = 'shugo'; });
['h36', 'h37', 'h38', 'h39'].forEach(id => { const it = WARDROBE.find(i => i.id === id); if (it) it.ip = 'shugo'; });
