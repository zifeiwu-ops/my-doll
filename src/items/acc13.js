/* ---------- 小物分区：帽子 / 发饰 / 耳饰 / 眼镜 / 颈饰 / 包包 / 手饰 / 腰饰 ---------- */
const ACC_GROUPS = [['hat', '帽子头巾'], ['hairacc', '发饰'], ['ear', '耳饰'], ['glasses', '眼镜'], ['neck', '项链颈饰'], ['bag', '包包'], ['hand', '手饰'], ['waist', '腰饰胸针'], ['deco', '贴纸创可贴']];
const ACC_SUB = {
  hat: ['a5', 'a8', 'a15', 'a24', 'a28', 'a29', 'a30', 'a35', 'a43', 'a44', 'a45', 'a46', 'a56', 'a57', 'a76'],
  hairacc: ['a1', 'a6', 'a10', 'a12', 'a13', 'a14', 'a31', 'a38', 'a51', 'a55', 'a60', 'a61', 'a62', 'a63'],
  ear: ['a19', 'a32', 'a64', 'a65', 'a66'],
  glasses: ['a3', 'a16', 'a20', 'a21', 'a39', 'a40', 'a70'],
  neck: ['a7', 'a11', 'a17', 'a18', 'a22', 'a23', 'a25', 'a26', 'a41', 'a52', 'a67', 'a68', 'a69'],
  bag: ['a4', 'a27', 'a33', 'a34', 'a47', 'a48', 'a49', 'a50', 'a58', 'a73', 'a74'],
  hand: ['a2', 'a36', 'a54', 'a59', 'a71', 'a72'],
  waist: ['a9', 'a37', 'a42', 'a53', 'a75']
};
Object.entries(ACC_SUB).forEach(([g, ids]) => ids.forEach(id => { const it = WARDROBE.find(i => i.id === id); if (it) it.sub = g; }));
WARDROBE.forEach(i => { if (i.cat === 'acc' && !i.sub) i.sub = 'waist'; });
