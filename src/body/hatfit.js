/* =====================================================================
   帽子贴合头型：原来的帽子都是平视画的——帽口是一条水平直线、两边竖直，像一个硬壳扣在头上
   这里统一给所有「罩住头顶」的帽子做一次贴合：
   · 帽口弯成往下的弧（从略高处看，一圈戴在头上的帽口前面最低、两边往上收），帽檐同样弯下来
   · 越往帽顶越往里收一点，轮廓顺着头顶的圆
   · 帽口下面投一道硬边阴影在刘海 / 额头上，看得出帽子是压在头发上的
   发箍、发带不动（它们本来就是细细一圈）
   ===================================================================== */
const BAND_ACC = new Set(['a1', 'a12', 'a13', 'a14', 'a38', 'a51', 'a55']);
const isCapHat = it => !!it && !BAND_ACC.has(it.id) && (it.sub === 'hat' || HATS.includes(it.id));
const _hatGeo = {};
function hatGeo(it, L) {   // 帽子的上沿、帽口（前面正中那一段的最低点）
  if (_hatGeo[it.id]) return _hatGeo[it.id];
  let yt = 1e9, yb = -1e9, x0 = 1e9, x1 = -1e9;
  L.forEach(l => (l.svg.match(/\sd="[^"]*"/g) || []).forEach(d => { const n = d.match(/-?\d*\.?\d+/g) || []; for (let i = 0; i + 1 < n.length; i += 2) { const x = +n[i], y = +n[i + 1]; if (x < 60 || x > 240 || y < 0 || y > 170) continue; yt = Math.min(yt, y); x0 = Math.min(x0, x); x1 = Math.max(x1, x); if (Math.abs(x - 150) < 22 && y < 132) yb = Math.max(yb, y); } }));
  return (_hatGeo[it.id] = yb > yt ? { yt, yb, x0, x1 } : null);
}
/* 帽顶统一落在「头发顶 + 一层蓬松的头发」上：头发顶在 y≈59，帽顶目标 y≈45（软帽 / 鸭舌帽 / 报童帽），头巾贴一点 y≈50；
   贝雷帽本来就斜搭在头顶，遮阳帽没有帽顶、猫耳兜帽是整个包住，不改高度 */
const HAT_TOP = { a5: 50, a24: 50, a43: 50, a56: 50 }, HAT_KEEP = new Set(['a46', 'a95', 'a35', 'a76', 'a116', 'a118']);
function fitHat(it, L) {
  const g = hatGeo(it, L); if (!g) return L;
  const { yt, yb } = g, T = HAT_KEEP.has(it.id) ? yt : (HAT_TOP[it.id] ?? 45), k = Math.max(.35, Math.min(1.6, (yb - T) / Math.max(8, yb - yt)));
  const H = yb - T, A = Math.min(5.2, H * .12);
  const fn = (x, y) => {
    const ny = y < yb ? yb - (yb - y) * k : y, s = Math.max(0, Math.min(1, (ny - T) / H)), u = Math.min(1, Math.abs(x - 150) / 50), fr = 1 - u * u;
    // 帽身中段往外鼓一点（里面有头发撑着），帽口撑到头发宽，帽顶收圆
    const puff = Math.sin(Math.PI * Math.min(1, s * 1.15)) * .06;
    return [(x - 150) * (.075 * s + puff - .06 * Math.pow(1 - s, 1.4)), ny - y + A * fr * s * s]; };
  const out = L.map(l => ({ ...l, svg: warpSVG(l.svg, {}, { fn }) }));
  // 帽口投在头发 / 额头上的阴影：沿着弯下来的帽口，一条上宽下窄的月牙；只落在头的范围里
  const c = uid('hs'), P = [], Q = [];
  for (let k = 0; k <= 16; k++) { const x = 104 + 92 * k / 16, u = Math.min(1, Math.abs(x - 150) / 50), y = yb + A * (1 - u * u) - .6; P.push([x, y]); Q.unshift([x, y + 3.2 + 2.6 * (1 - u * u)]); }
  const sh = `<clipPath id="${c}"><ellipse cx="150" cy="104" rx="45" ry="52"/></clipPath><path clip-path="url(#${c})" d="M ${P.concat(Q).map(P2).join(' L ')} Z" fill="#5A3A4A" opacity=".24" style="mix-blend-mode:multiply"/>`;
  return out.concat([{ z: 50.6, svg: sh }]);
}
