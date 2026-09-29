/* =====================================================================
   初始居家服（参考同类换装游戏：刚进游戏穿的是一套软软的家居服）
   奶油罗纹小背心 + 抽绳荷叶边居家短裤 + 毛绒拖鞋
   ===================================================================== */
Object.assign(TPL, {
  loungeShorts: {
    cat: 'bottom', name: '抽绳居家短裤', thumb: '90 270 120 80',
    render(F) {   // 松紧腰（一圈碎褶）+ 系蝴蝶结的抽绳，裤脚一圈小荷叶边
      const d = pantsD({ top: 284, hem: 322, ease: y => 3.4 + (y - 284) * .07, inE: () => 2.6 });
      const band = bandD(284, 7, 3.6, 3.4, 3.6), xh = outerX(322) - 6.1;
      const hemL = `M ${f1(outerX(322) - 5.2)} 321.4 Q 130 326 ${f1(Math.min(149.3, legID(322) + 2.6))} 324.6`;   // 裤脚一圈白色小花边（扇贝）
      const lace = { d: hemL, c: '#FFFFFF', w: 3.4, dash: '.1 3.4', o: 1 };
      const bow = ribbonBow(150, 291, .42, F.rib || '#F48FB1', 1);
      return pc(d, F.fill, { autoFolds: false, folds: fm('M 124 300 Q 126 310 125 318', 'M 140 306 Q 142 314 141 320'), cel: fm('M 124 300 Q 126 310 125 318', 'M 140 306 Q 142 314 141 320').map(q => foldCel(q, 2.4)), lines: [lace, { ...lace, d: mir(hemL) }] }) +
        pc(band, F.fill, { lines: [{ d: gatherD(112, 188, 287, 26, 3, 3.6), o: .4, w: .5 }] }) + bow;
    }
  }
});
const HOME22 = [
  { id: 't92', cat: 'top', tpl: 'cami', name: '奶油居家小背心', fill: { c: '#FFF6EC' } },
  { id: 'b82', cat: 'bottom', tpl: 'loungeShorts', name: '粉色抽绳居家短裤', fill: { p: 'pinkgingham' }, alt: '#FFF4F7', rib: '#F48FB1' },
  {
    id: 's37', cat: 'shoes', name: '粉色毛绒拖鞋', thumb: '100 530 100 74',
    parts() {   // 只包住脚背的一团毛绒 + 平底鞋底
      const one = m => { const M = M_(m), X = X_(m);
        return piece(M(soleD(580, 4, 2.6)), '#F2A6BE', { rim: false }) + piece(M(shoeUpperD(562, 3.4, 5)), 'url(#pat-fuzzpink)', { rim: [2, 1.2], over: `<circle cx="${f1(X(132))}" cy="566" r="3.2" fill="#FFFFFF" stroke="${STYLE.line}" stroke-width=".7"/>` }); };
      return [{ z: 40, svg: both(one) }];
    }
  }
];
WARDROBE.unshift(...HOME22);
