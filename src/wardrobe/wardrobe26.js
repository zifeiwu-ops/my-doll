/* ---------------- 西部波西米亚 · 第二批：10 套（条纹蛋糕裙、蕾丝、薄荷缎面、流苏麂皮、波点背心裙、格纹长裙） ---------------- */
PATTERN_DEFS += `
<pattern id="pat-orangestripe" patternUnits="userSpaceOnUse" width="10" height="14"><rect width="10" height="14" fill="#F29A3A"/><rect y="2" width="10" height="1.6" fill="#7AC4C0"/><rect y="5" width="10" height="1" fill="#B88AC0"/><rect y="8.4" width="10" height="2" fill="#F6E2B4"/><rect y="12" width="10" height=".8" fill="#C85A2A"/></pattern>
<pattern id="pat-roseivory" patternUnits="userSpaceOnUse" width="24" height="24"><rect width="24" height="24" fill="#F2E2C2"/>${_flower5(6, 7, 3.8, '#E8909A', '#F6D6A0')}${_flower5(18, 18, 3.4, '#D87A86', '#F2E2C2')}<ellipse cx="13" cy="9" rx="2.6" ry="1" fill="#9AAA72" transform="rotate(-30 13 9)"/></pattern>
<pattern id="pat-sagedots" patternUnits="userSpaceOnUse" width="7" height="7"><rect width="7" height="7" fill="#A8BC8E"/><circle cx="1.8" cy="1.8" r=".9" fill="#E8F0DA"/><circle cx="5.3" cy="5.3" r=".9" fill="#E8F0DA"/></pattern>
<pattern id="pat-greyrose" patternUnits="userSpaceOnUse" width="20" height="20"><rect width="20" height="20" fill="#B8B09E"/><circle cx="6" cy="6" r="4.4" fill="#E2D8C4"/>${_flower5(6, 6, 2.6, '#E07A86', '#F2D2A0')}<circle cx="16" cy="15" r="3.6" fill="#E2D8C4"/>${_flower5(16, 15, 2, '#E07A86', '#F2D2A0')}</pattern>
<pattern id="pat-blackdotsW" patternUnits="userSpaceOnUse" width="6" height="6"><rect width="6" height="6" fill="#2E2A2C"/><circle cx="1.5" cy="1.5" r=".6" fill="#F4F0E8"/><circle cx="4.5" cy="4.5" r=".6" fill="#F4F0E8"/></pattern>
${_plaid('plaidGreyLilac', '#B4B0BC', '#6A6074', '#F2EEF2', 14)}${_plaid('plaidPinkIvory', '#F6E6DC', '#D86A6A', '#FFFFFF', 12)}
<linearGradient id="grad-mintsatin" gradientUnits="userSpaceOnUse" x1="110" y1="0" x2="190" y2="0"><stop offset="0" stop-color="#9EB88A"/><stop offset=".4" stop-color="#E2EED0"/><stop offset=".7" stop-color="#B4CA9C"/><stop offset="1" stop-color="#7E9A6E"/></linearGradient>`;
Object.assign(PAT_BASE, { orangestripe: '#E8A050', roseivory: '#EED8B8', sagedots: '#A8BC8E', greyrose: '#C2B8A6', blackdotsW: '#2E2A2C', plaidGreyLilac: '#9E98A6', plaidPinkIvory: '#EEC8BE' });
Object.assign(GRAD_BASE, { mintsatin: '#C2D6AE' });

/* 流苏麂皮短裙：A 字短裙下摆一圈流苏（每根流苏顺着下摆的弧往下垂，长短略有不同） */
TPL.fringeMini = {
  cat: 'bottom', name: '流苏麂皮短裙', thumb: '84 262 132 110',
  render(F) {
    const base = TPL.aMini.render(F), r = RNG(41), c = F.fill, ln = lineOf(F.fill);
    let d = ''; for (let i = 0; i <= 34; i++) { const u = i / 34, x = lerp(102, 198, u), y = 338 + 5.4 * (1 - Math.pow(2 * u - 1, 2)) - 1.6, L = 9 + r() * 5;
      d += `M ${f1(x)} ${f1(y)} Q ${f1(x + (u - .5) * 2)} ${f1(y + L * .5)} ${f1(x + (u - .5) * 3.4)} ${f1(y + L)} `; }
    return `<path d="${d}" fill="none" stroke="${ln}" stroke-width="2.6" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/>` + base;
  }
};
const WEST26 = [
  { id: 'o51', cat: 'outer', tpl: 'blazer', name: '粉格纹荷叶肩外套', fill: { p: 'plaidPinkIvory' } },
  { id: 't100', cat: 'top', tpl: 'cami', name: '奶白蕾丝娃娃衫', fill: { p: 'eyelet' } },
  { id: 'b92', cat: 'bottom', tpl: 'tierMidi', name: '橙色多彩条纹蛋糕裙', fill: { p: 'orangestripe' }, alt: 'url(#pat-orangestripe)', rib: '#F29A3A' },
  { id: 'o52', cat: 'outer', tpl: 'cropCardi', name: '玫瑰碎花短夹克', fill: { p: 'roseivory' }, rib: '#E8D2AE' },
  { id: 'b93', cat: 'bottom', tpl: 'fullMidi', name: '白色蕾丝中长裙', fill: { p: 'lace' } },
  { id: 't101', cat: 'top', tpl: 'laceScoop', name: '薄荷蕾丝长袖衫', fill: { c: '#D6EAD6' } },
  { id: 'b94', cat: 'bottom', tpl: 'tierMidi', name: '薄荷缎面蛋糕裙', fill: { g: 'mintsatin' } },
  { id: 't102', cat: 'top', tpl: 'frillBlouse', name: '白色系带荷叶背心', fill: { c: '#F6F4EE' }, alt: '#E8DCC0' },
  { id: 'b95', cat: 'bottom', tpl: 'tierMidi', name: '鼠尾草绿波点蛋糕裙', fill: { p: 'sagedots' } },
  { id: 't103', cat: 'top', tpl: 'frillBlouse', name: '奶黄荷叶边背心', fill: { c: '#F4ECC0' }, alt: '#F4ECC0' },
  { id: 'b96', cat: 'bottom', tpl: 'asymPlaid', name: '奶黄刺绣不规则长裙', fill: { c: '#F2E8C0' }, alt: '#E8D8A0' },
  { id: 't104', cat: 'top', tpl: 'buttonShirt', name: '白色镂空荷叶衬衫', fill: { p: 'eyelet' } },
  { id: 'b97', cat: 'bottom', tpl: 'fringeMini', name: '奶黄流苏麂皮短裙', fill: { c: '#F2E2B0' } },
  { id: 'd31', cat: 'dress', tpl: 'dotTunic', name: '灰底玫瑰印花连衣裙', fill: { p: 'greyrose' }, alt: '#E2D8C4', rib: '#2E2A2C' },
  { id: 'o53', cat: 'outer', tpl: 'denimJacket', name: '奶黄流苏麂皮夹克', fill: { c: '#F2E2B0' }, stitch: '#3AA6B8' },
  { id: 'd32', cat: 'dress', tpl: 'pinafore', name: '黑白波点背心裙', fill: { p: 'blackdotsW' }, alt: '#FBFAF4', rib: '#2E2A2C' },
  { id: 'd33', cat: 'dress', tpl: 'slipDress', name: '灰紫格纹抹胸长裙', fill: { p: 'plaidGreyLilac' } },
  cowboyHat('a118', '草编牛仔帽', '#E8D2A0', '#F4EEE0')
];
WEST26.forEach(i => { i.isNew = true; i.ip = 'western'; });
WARDROBE.unshift(...WEST26);
LOOKS.unshift(
  { name: '粉格外套 · 橙条蛋糕裙', ip: 'western', o: { ...W0, hair: 'h11', outer: 'o51', top: 't100', bottom: 'b92', shoes: 's11', acc: ['a52'] } },
  { name: '玫瑰碎花 · 白蕾丝裙', ip: 'western', o: { ...W0, hair: 'h11', outer: 'o52', top: 't100', bottom: 'b93', shoes: 's14', acc: ['a62'] } },
  { name: '薄荷蕾丝 · 缎面蛋糕裙', ip: 'western', o: { ...W0, hair: 'h25', hairColor: '#E6CC8E', top: 't101', bottom: 'b94', shoes: 's25' } },
  { name: '系带背心 · 波点蛋糕裙', ip: 'western', o: { ...W0, hair: 'h11', top: 't102', bottom: 'b95', shoes: 's27', acc: ['a52'] } },
  { name: '奶黄荷叶 · 刺绣长裙', ip: 'western', o: { ...W0, hair: 'h20', hairColor: '#C8502A', top: 't103', bottom: 'b96', shoes: 's25', acc: ['a53'] } },
  { name: '白镂空衬衫 · 流苏短裙', ip: 'western', o: { ...W0, hair: 'h20', hairColor: '#C8502A', top: 't104', bottom: 'b97', shoes: 's25', acc: ['a42'] } },
  { name: '灰玫瑰印花裙', ip: 'western', o: { ...W0, hair: 'h17', hairColor: '#D8703A', dress: 'd31', shoes: 's14' } },
  { name: '流苏麂皮 · 套装', ip: 'western', o: { ...W0, hair: 'h17', hairColor: '#D8703A', outer: 'o53', top: 't97', bottom: 'b97', shoes: 's15', acc: ['a42'] } },
  { name: '白衬衫 · 黑波点背心裙', ip: 'western', o: { ...W0, hair: 'h11', top: 't104', dress: 'd32', shoes: 's10' } },
  { name: '格纹长裙 · 草编牛仔帽', ip: 'western', o: { ...W0, hair: 'h12', hairColor: '#8A6A4A', top: 't87', dress: 'd33', shoes: 's25', acc: ['a118'] } }
);
