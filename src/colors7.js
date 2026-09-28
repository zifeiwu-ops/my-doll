/* ---------------- 颜色小工具 ---------------- */
const hex2rgb = h => { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); };
const rgb2hex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(...A.map((v, i) => v + (B[i] - v) * t)); };
function hsl(hex) {
  const [r, g, b] = hex2rgb(hex).map(v => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function colorName(hex) {
  const [h, s, l] = hsl(hex);
  if (l > .9 || (l > .78 && s < .6 && h >= 30 && h < 70)) return '奶油白';
  if (l < .16) return '酷黑';
  if (s < .14) return l > .6 ? '银灰' : '炭灰';
  if (h < 12 || h >= 345) return l > .72 ? '樱花粉' : '樱桃红';
  if (h < 40) return l > .72 ? '蜜桃粉' : (l < .4 ? '焦糖棕' : '蜜桃橘');
  if (h < 65) return l < .42 ? '卡其' : '柠檬黄';
  if (h < 160) return l > .62 ? '薄荷绿' : '抹茶绿';
  if (h < 200) return '汽水蓝';
  if (h < 245) return s < .45 ? '牛仔蓝' : '天空蓝';
  if (h < 290) return '香芋紫';
  return l > .7 ? '泡泡粉' : '芭比粉';
}

