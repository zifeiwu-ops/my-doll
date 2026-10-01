/* =====================================================================
   姿势大改：身体不再是一根直棍
   · 每个姿势都有「重心腿 + 放松腿」：放松那条腿膝盖往里收、脚跟轻轻抬起（小腿缩短），胯往重心腿那边送
   · 两条腿可以各自绕髋关节转（分腿、收腿、迈步），小腿绕膝盖弯（踮脚、跳起、往后勾）
   · 上身可以绕腰倾斜（lean），整个人可以离地（lift，跳起来）
   · 手臂角度按真实关节范围重新调过：肩膀外展 / 内收、手肘只往里弯，手落在腰、脸、胸口这些真实会放的位置
   legL / legR：{ hip 整条腿转角（左腿正 = 往外，右腿负 = 往外），knee 小腿转角，len 小腿缩短（< 1 = 往后抬 / 踮脚） }
   legBig：腿动作很大（跳、走、踢），长裙盖住膝盖时自动不做
   ===================================================================== */
const FREE_L = { hip: -1.2, knee: 2.4, len: .95 }, FREE_R = { hip: 1.2, knee: -2.4, len: .95 };   // 放松腿：膝盖微微往里，脚跟略抬
const POSE21 = {
  stand: { name: '自然站立', head: -3, body: { hip: 3.4, kneeL: 2.4, footL: 1, tilt: .014 }, legL: FREE_L, L: { up: 3, fore: -8 }, R: { up: -2.4, fore: 7 }, hair: { sway: .6 } },
  clasp: { name: '乖巧', head: -5, body: LEAN, legL: { hip: -1.6, knee: 3, len: .93 }, L: { up: -4, fore: -44 }, R: { up: 4, fore: 44 } },
  behind: { name: '背手', head: 5, body: LEAN_L, legR: { hip: 2, knee: -3, len: .92 }, L: { up: 6, fore: -30, back: true }, R: { up: -6, fore: 30, back: true } },
  hip: { name: '叉腰', head: -6, body: { ...LEAN, hip: 6 }, lean: -1.6, legL: { hip: 3.2, knee: -1, len: .97 }, L: { up: 24, fore: -98, len: .64 }, R: { up: -5, fore: -8 } },
  wave: { name: '打招呼', head: 6, body: LEAN_L, lean: 1.4, legR: FREE_R, skirt: { sway: 1.2 }, hair: { sway: 1.6 }, R: { up: -16, fore: -150, over: true }, L: { up: 5, fore: 8 } },
  kick: { name: '踢腿', head: 5, body: { hip: -3.4, tilt: -.024 }, lean: 1.8, leg: -7, legLen: .56, legL: { hip: -.8 }, hair: { sway: -3.5, flare: 2.4, lift: 1.2 }, L: { up: 14, fore: 16 }, R: { up: -14, fore: -18 } },
  curtsy: { name: '提裙', head: -7, body: LEAN, legL: { hip: -2.4, knee: 4, len: .88 }, skirt: { flare: 5.5, lift: 2.6 }, hair: { flare: 1.2 }, L: { up: 14, fore: 16 }, R: { up: -14, fore: -16 } },
  heart: { name: '比心', head: 6, body: LEAN_L, legR: FREE_R, L: { up: -8, fore: -140 }, R: { up: 8, fore: 140 } },
  drink: { name: '拿饮料', head: 6, body: LEAN_L, legR: { hip: 2.4, knee: -2, len: .94 }, L: { up: 24, fore: -98, len: .64 }, R: { up: -10, fore: 168, len: .76 }, hair: { sway: 1.2 } },
  camera: { name: '拿相机', head: -5, body: LEAN, legL: FREE_L, L: { up: 18, fore: -144, len: .84 }, R: { up: -18, fore: 144, len: .84 } },
  stride: { name: '迈步', head: 3, body: { hip: -3.6, kneeL: 1.6, tilt: -.02 }, lean: 1, legBig: true, legL: { hip: -1.6 }, legR: { hip: 2.2, knee: -3, len: .8 }, L: { up: -6, fore: -18 }, R: { up: -10, fore: 6 }, skirt: { sway: 1.6, flare: 1.4 }, hair: { sway: -1.6 } },
  spread: { name: '芭蕾展臂', head: -6, body: LEAN, legL: { hip: -3, knee: 2, len: .86 }, skirt: { flare: 3.2, lift: 1.2 }, hair: { flare: 2.6, lift: 1 }, L: { up: 30, fore: 14 }, R: { up: -30, fore: -14 } },
  handsHips: { name: '双手叉腰', head: 3, body: LEAN, legBig: true, legL: { hip: 4.4 }, legR: { hip: -3.2 }, L: { up: 24, fore: -98, len: .64 }, R: { up: -24, fore: 98, len: .64 } },
  cupFace: { name: '双手捧心', head: 7, body: LEAN_L, legR: { hip: 2.4, knee: -3.4, len: .9 }, L: { up: 4, fore: -160, over: true }, R: { up: -4, fore: 160, over: true } },
  /* ---------- 新姿势 ---------- */
  tiptoe: { name: '踮脚', isNew: true, head: 7, body: { hip: -1.4, tilt: -.01 }, lift: 5, legL: { len: .9, knee: 1.4 }, legR: { len: .9, knee: -1.4 }, hair: { sway: 1, lift: .6 }, L: { up: 6, fore: -30, back: true }, R: { up: -6, fore: 30, back: true } },
  kneeIn: { name: '单膝内扣', isNew: true, head: -8, body: { hip: -5, kneeR: 4, footR: 2, tilt: -.02 }, lean: 2, legR: { hip: 2.4, knee: 6, len: .84 }, L: { up: -4, fore: -50 }, R: { up: 6, fore: 52 }, hair: { sway: -1.4 } },
  wide: { name: '酷girl分腿', isNew: true, head: -2, body: { hip: 1.6, tilt: .01 }, legBig: true, legL: { hip: 6, knee: -1.6 }, legR: { hip: -6, knee: 1.6 }, L: { up: 10, fore: 14 }, R: { up: -24, fore: 98, len: .64 } },
  jump: { name: '跳起来', isNew: true, head: -6, body: { hip: 0 }, lift: 24, legBig: true, legL: { hip: 4, knee: 14, len: .58 }, legR: { hip: -2, knee: -10, len: .66 }, L: { up: 30, fore: 40 }, R: { up: -30, fore: -36 }, skirt: { flare: 4, lift: 4.4 }, hair: { flare: 3.6, lift: 4, sway: -1 } },
  walk: { name: '走路', isNew: true, head: 2, body: { hip: 2.6, tilt: .016 }, lean: -1.2, legBig: true, legL: { hip: -2.4, knee: 3.4, len: .78 }, legR: { hip: -1 }, L: { up: -2, fore: 14 }, R: { up: -9, fore: -26 }, skirt: { sway: -1.4, flare: 1.2 }, hair: { sway: 1.6 } },
  leanCute: { name: '歪身俏皮', isNew: true, head: 10, body: { hip: 8, kneeL: 4, footL: 2, tilt: .03 }, lean: -5, legL: { hip: -2, knee: 4, len: .9 }, L: { up: 16, fore: 20 }, R: { up: -24, fore: 98, len: .64 }, hair: { sway: 2.4 } },
  think: { name: '若有所思', isNew: true, head: 7, body: LEAN_L, legR: FREE_R, L: { up: -8, fore: -82, len: .9 }, R: { up: 14, fore: -160, len: .85, over: true } },
  hairTouch: { name: '撩头发', isNew: true, head: -8, body: LEAN, lean: -1, legL: FREE_L, L: { up: 20, fore: 155, over: true }, R: { up: -4, fore: -10 }, hair: { sway: -1.4, flare: 1 } },
  cheer: { name: '惊喜举手', isNew: true, head: -4, body: { hip: 1 }, lift: 6, legL: { len: .9, knee: 2 }, legR: { len: .9, knee: -2 }, L: { up: 18, fore: 150, over: true }, R: { up: -18, fore: -150, over: true }, hair: { flare: 2, lift: 2 }, skirt: { flare: 2.6, lift: 1.6 } },
  twirl: { name: '转圈圈', isNew: true, head: 8, body: LEAN_L, lean: 2, legR: { hip: 3, knee: -5, len: .8 }, L: { up: 30, fore: 24 }, R: { up: -26, fore: -34 }, skirt: { flare: 8, lift: 5, sway: 3 }, hair: { flare: 4, lift: 2.4, sway: 3 } },
  peek: { name: '探头', isNew: true, head: 12, body: { hip: -6, kneeR: 3.4, footR: 1.6, tilt: -.03 }, lean: 6, legR: { hip: 1.6, knee: -3, len: .92 }, L: { up: -6, fore: -40 }, R: { up: 6, fore: 44 }, hair: { sway: 3, flare: 1 } }
};
/* 已有的姿势只改角度，保留手里拿的东西（extra）等其它设置；没写的关节回到默认 */
Object.entries(POSE21).forEach(([k, v]) => { const o = POSES[k]; POSES[k] = o ? { ...(o.extra ? { extra: o.extra } : {}), ...(o.warp ? { warp: o.warp } : {}), ...v } : v; });
['shy', 'drink', 'camera', 'stride'].forEach(k => { if (POSES[k]) delete POSES[k].isNew; });

