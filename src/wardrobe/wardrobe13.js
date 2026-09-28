/* ---------------- 本期主题 · Coquette 芭蕾甜心（排在各分类最前面） ---------------- */
/* 这一批衣服（上衣 / 外套 / 下装 / 连衣裙）已按反馈删除，只保留本期的发型、袜子、鞋子和小物 */
const NEW13 = [];
const V13_IDS = new Set([...NEW13.map(i => i.id), 'h26', 'h27', 'h28', 'h29', 'l11', 'l12', 'l13', 's16', 's17', 's18', ...Array.from({ length: 17 }, (_, k) => 'a' + (60 + k))]);
WARDROBE.forEach(i => { if (V13_IDS.has(i.id)) i.isNew = true; else delete i.isNew; });
NEW13.forEach(i => { i.isNew = true; });
(() => {
  const fresh = WARDROBE.filter(i => V13_IDS.has(i.id));
  fresh.forEach(i => WARDROBE.splice(WARDROBE.indexOf(i), 1));
  WARDROBE.unshift(...NEW13, ...fresh);
})();
