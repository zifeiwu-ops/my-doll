/* =====================================================================
   垂坠轮廓（第 19 版）：衣服不再是「身体轮廓往外扩几像素」，而是从撑起它的地方（肩、胸、胯）往下垂
   · 布只能慢慢往里收：每往下 1 像素最多往里收 k 像素，所以腰窝、膝窝这些凹进去的地方会被布「跨过去」
   · k 越小越宽松（直直垂下来），k 很大就等于贴身（打底裤、紧身款）
   这样上衣从胸口垂下来、裤子从胯部直直落到脚面，不会一路贴着腰和膝盖，像正常的衣服
   ===================================================================== */
/* 左侧外轮廓（x 越小越往外）：取上方所有点「往下垂」之后最靠外的那条线 */
function hangOut(f, y0, k, step = 2) {
  return y => { let b = f(y); if (y <= y0) return b; for (let t = y0; t < y; t += step) b = Math.min(b, f(t) + k * (y - t)); return b; };
}
/* 裤腿内侧（x 越大越靠中线）：同理，从裆部往下垂 */
function hangIn(f, y0, k, step = 2) {
  return y => { let b = f(y); if (y <= y0) return b; for (let t = y0; t < y; t += step) b = Math.max(b, f(t) - k * (y - t)); return b; };
}

/* 布边的自然起伏：低频的轻微波动（像手画的线，不是尺子画的），左右用不同的种子，两边不会一模一样 */
const wobF = (seed, amp) => y => amp * (Math.sin(y / 17 + seed * 1.7) * .6 + Math.sin(y / 7.3 + seed * 3.1) * .4);
/* 只给左半边的点列 A、右半边用另一组点列 B（同样是左半边的写法），拼成一个左右略有差别的闭合形状 */
const asymS = (A, B) => spline(A.concat(B.slice(1, -1).reverse().map(mx)));

/* ---------- 上衣身片：从胸 / 腋下往下垂，跨过腰窝；宽松款（e 大）垂得更直 ---------- */
bodyD = function (o = {}) {
  const { neckY = 170, neckX = 139, se = 2.4, flare = 0, curve = 1.6, neckW = 5.5 } = o, hem = o.hem ?? 300;
  const e = (o.e ?? 2.8) * 1.22, hemE = (o.hemE ?? 3.4) * 1.3 + ((o.hemE ?? 3.4) > 3.6 ? 1.2 : 0);
  const k = o.hang ?? (e > 4.4 ? .05 : e > 3.2 ? .09 : .16), loose = e > 3.6;
  const raw = y => { const t = Math.max(0, (y - 222) / (hem - 222)); return sideX(y) - e - (hemE - e) * t - flare * t * t; };
  const X = hangOut(raw, 222, k);   // 从腋下（222 以下才是躯干侧边）开始往下垂；再往上是手臂，不能算进来
  const half = seed => {
    const w = wobF(seed, loose ? 1.5 : .8), pts = [[150, neckY], [150 - neckW, neckY - 1.2], [neckX, 165]];
    offsetPts(SHOULDER.slice(1), se).forEach(p => pts.push([p[0], p[1]]));
    pts.push([112, 212]);
    /* blouse：下摆收进罗纹的款，布在罗纹上方鼓出来一圈再收进去 */
    const bl = y => (o.blouse ? o.blouse * Math.sin(Math.PI * ss18(hem - 26, hem + 2, y)) : 0);
    rng(222, hem - 8, Math.max(1, Math.round((hem - 230) / 8))).forEach(y => pts.push([X(y) + w(y) * ss18(222, 250, y) - bl(y), y]));
    if (o.blouse) pts.push([X(hem - 4) - bl(hem - 4), hem - 4]);
    const tail = o.tail || 0;                                              // tail：衬衫下摆两侧开衩往上提、前片圆弧垂下来
    const xh = X(hem) - (o.blouse ? 0 : loose ? 1.3 : .6);                  // 下摆两角微微往外翘一点（布的重量落在下摆）
    pts.push([xh, hem - tail + (seed > 1 ? .5 : 0), 'c']);
    const n0 = pts.length; hemWave(pts, xh, hem, curve, seed > 1 ? 1.25 : .8);
    if (tail) for (let i = n0; i < pts.length; i++) { const u = (pts[i][0] - xh) / (150 - xh); pts[i][1] -= tail * Math.pow(1 - u, 2); }
    pts.push([150, hem + curve]);
    return [pts, xh];
  };
  const [A, xh] = half(1), [B] = half(2.3);
  return withFolds(asymS(A, B), drapeFolds(xh, hem, curve, 222, e));
};

/* ---------- 无袖身片：胸下略收，但不再掐进腰窝 ---------- */
tankD = function (o = {}) {
  const { top = 194, strapX = 128, e = 2.2, hem = 292, hemE = 2.6, flare = 0, curve = 1.4, dip = 4 } = o;
  const raw = y => { const t = Math.max(0, (y - 222) / (hem - 222)); return sideX(y) - e - (hemE - e) * t - flare * t * t; }, X = hangOut(raw, 222, o.hang ?? .2);
  const pts = [[150, top + dip], [140, top + 1.2], [strapX - .5, top - 1, 'c'], [strapX - 4.5, top + 9], [sideX(222) - e + .8, 222]];
  rng(230, Math.max(231, hem - 8), Math.max(1, Math.round((hem - 236) / 10))).forEach(y => pts.push([X(y), y]));
  const xh = X(hem);
  pts.push([xh, hem, 'c']); hemWave(pts, xh, hem, curve, .8); pts.push([150, hem + curve]);
  return withFolds(symS(pts), drapeFolds(xh, hem, curve, 226, e, 1));
};

/* ---------- 裤子：外侧从胯部直直落下，内侧从裆部落下；紧身款（hang 大）照旧贴腿 ---------- */
pantsD = function (o = {}) {
  const { top = 282, dip = 4, crotch = 327, ease = () => 2.6, inE = () => 2 } = o, hem = Math.min(o.hem ?? 575, PANT_HEM);
  const fit = ease(420) < 2.4, ko = o.hang ?? (fit ? 1 : .045), ki = o.hangIn ?? (fit ? 1 : ko * 2.2);   // 松量很小的是紧身款：照旧贴腿
  const XO = hangOut(y => outerX(y) - ease(y), 300, ko), XI = hangIn(y => Math.min(149.4, legID(Math.max(330, y)) + inE(y)), crotch + 4, ki);
  const long = hem > 500, K = 432;   // K：膝盖
  /* 裤腿的「形」：胯下略鼓、膝盖处布被顶一下、裤脚堆在鞋面上一波一波（紧身款只留很轻的起伏） */
  const feat = (y, side, seed) => {
    const g = fit ? .35 : 1, kn = Math.exp(-Math.pow((y - K) / 11, 2)), stack = long ? ss18(hem - 34, hem - 6, y) : 0;
    const ripple = stack * Math.sin((hem - y) / 4.6 + seed) * (side ? 2.2 : 2.6);
    return g * ((side ? -2.4 : -1.4) * kn + ripple) + wobF(seed, fit ? .3 : 1.2)(y) * ss18(top + 20, top + 50, y);
  };
  const half = seed => {
    const pts = [[150, top + dip], [outerX(top) - ease(top), top, 'c']];
    rng(top + 8, hem - 7, Math.max(2, Math.round((hem - top - 15) / 8))).forEach(y => pts.push([XO(y) + feat(y, 1, seed), y]));
    const xo = XO(hem) + feat(hem, 1, seed) - (long && !fit ? .8 : 0), xi = Math.min(149.4, XI(hem));
    pts.push([xo, hem - (long ? 1.2 : 0), 'c']); pts.push([xo + (xi - xo) * .45, hem + (long ? 3.4 : 2.4)]);   // 裤脚搭在鞋面上：两侧略提、前面垂下来
    pts.push([xi, hem + .4, 'c']);
    rng(hem - 9, crotch + 7, Math.max(2, Math.round((hem - crotch - 16) / 9))).forEach(y => pts.push([Math.min(149.3, XI(y) - feat(y, 0, seed + 5) * .6), y]));
    pts.push([150, crotch]);
    return pts;
  };
  return asymS(half(1), half(2.6));
};

/* ---------- 开襟外套前片：侧边从腋下垂下来 ---------- */
openPanel = function (hem, gap = 11, e = 5, top = 140.8) {
  const X = hangOut(y => sideX(y) - e, 222, .08);
  return spline([[top - 1.2, 163.4], [133, 166.4], [125.2, 168.6], [117.6, 170.4], [112, 173.6], [108.4, 179.6], [106.6, 188], [109, 214],
    [X(Math.min(240, hem - 8)), Math.min(240, hem - 8)], ...(hem > 262 ? [[X(hem - 8) - 1, hem - 8]] : []), [X(hem) - 1.2, hem, 'c'], [150 - gap, hem + 2, 'c'], [150 - gap + 1, hem - 30], [150 - gap + 3, 210], [top, 170, 'c']]);
};
