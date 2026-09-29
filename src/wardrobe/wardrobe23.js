/* =====================================================================
   系列：按每一期上新的主题划分（不用作品名）。每件衣服 / 发型 / 鞋袜 / 小物都归到它上新的那一期，没有归期的算「经典基础」
   ===================================================================== */
for (const k of Object.keys(IP_LABEL)) delete IP_LABEL[k];
Object.assign(IP_LABEL, { home: '居家', classic: '经典基础', campus: '千禧校园', vintage: '美式古着', coquette: 'Coquette 芭蕾', candy: '糖果装饰', street: '甜酷街头', idol: '偶像私服' });
(() => {
  const B = [['home', HOME22.map(i => i.id)], ['idol', IDOL20.map(i => i.id)], ['street', [...V16_IDS]], ['candy', [...V15_IDS]], ['coquette', [...V13_IDS]], ['vintage', [...V11_IDS]], ['campus', [...V10_IDS]]];
  const of = {}; B.slice().reverse().forEach(([k, ids]) => ids.forEach(id => { of[id] = k; }));   // 后上新的优先
  WARDROBE.forEach(i => { i.ip = of[i.id] || 'classic'; });
})();
