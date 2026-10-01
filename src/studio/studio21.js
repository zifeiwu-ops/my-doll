/* =====================================================================
   拍照小屋 · 手账贴纸风扩充：5 个主题（蝴蝶标本 / 水钻大头贴 / 天使和纸 / 薄荷手账 / 泪滴星夜）
   每个主题 = 场景 + 相框 + 一组贴纸；贴纸按主题分页，另外加「一键主题」：换场景、相框并撒一把贴纸
   全部是纯图形（不用文字），导出照片时不依赖字体
   ===================================================================== */
const _sp421 = (x, y, r, c, w = .32) => `<path d="M ${f1(x)} ${f1(y - r)} Q ${f1(x + r * w)} ${f1(y - r * w)} ${f1(x + r)} ${f1(y)} Q ${f1(x + r * w)} ${f1(y + r * w)} ${f1(x)} ${f1(y + r)} Q ${f1(x - r * w)} ${f1(y + r * w)} ${f1(x - r)} ${f1(y)} Q ${f1(x - r * w)} ${f1(y - r * w)} ${f1(x)} ${f1(y - r)} Z" fill="${c}"/>`;
const _rose21 = (x, y, r, c = '#F2A7BE', d = '#D9779A') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="#fff" stroke-width="${f1(r * .16)}"/><path d="M ${f1(x - r * .5)} ${f1(y)} a ${f1(r * .5)} ${f1(r * .5)} 0 1 1 ${f1(r * .5)} ${f1(r * .5)} a ${f1(r * .3)} ${f1(r * .3)} 0 1 1 ${f1(-r * .1)} ${f1(-r * .5)}" fill="none" stroke="${d}" stroke-width="${f1(r * .16)}" stroke-linecap="round"/>`;
const _tulip21 = (x, y, s, c = '#F4A6C0') => `<path d="M ${x} ${y} C ${f1(x + 2 * s)} ${f1(y + 30 * s)} ${f1(x - 3 * s)} ${f1(y + 60 * s)} ${f1(x)} ${f1(y + 90 * s)}" fill="none" stroke="#7FB58A" stroke-width="${f1(2.2 * s)}"/><path d="M ${f1(x)} ${f1(y + 50 * s)} q ${f1(-14 * s)} ${f1(-6 * s)} ${f1(-16 * s)} ${f1(-20 * s)} q ${f1(10 * s)} ${f1(2 * s)} ${f1(16 * s)} ${f1(14 * s)}" fill="#9CCB9A" stroke="#6E9E7A" stroke-width="${f1(s)}"/><path d="M ${f1(x - 8 * s)} ${f1(y - 14 * s)} q ${f1(2 * s)} ${f1(14 * s)} ${f1(8 * s)} ${f1(15 * s)} q ${f1(6 * s)} ${f1(-1 * s)} ${f1(8 * s)} ${f1(-15 * s)} l ${f1(-4 * s)} ${f1(4 * s)} l ${f1(-4 * s)} ${f1(-7 * s)} l ${f1(-4 * s)} ${f1(7 * s)} Z" fill="${c}" stroke="#D9779A" stroke-width="${f1(s)}" stroke-linejoin="round"/>`;
const _drop21 = (x, y, r, c, hi = '#fff') => `<path d="M ${x} ${f1(y - r * 1.6)} C ${f1(x + r * .4)} ${f1(y - r * .8)} ${f1(x + r)} ${f1(y - r * .2)} ${f1(x + r)} ${f1(y + r * .3)} A ${r} ${r} 0 0 1 ${f1(x - r)} ${f1(y + r * .3)} C ${f1(x - r)} ${f1(y - r * .2)} ${f1(x - r * .4)} ${f1(y - r * .8)} ${x} ${f1(y - r * 1.6)} Z" fill="${c}"/><ellipse cx="${f1(x - r * .35)}" cy="${f1(y + r * .1)}" rx="${f1(r * .18)}" ry="${f1(r * .35)}" fill="${hi}" opacity=".8"/>`;
const _starO21 = (x, y, r, c, fill = 'none', w = 1.6) => { let p = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; p += `${i ? 'L' : 'M'} ${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)} `; } return `<path d="${p}Z" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round"/>`; };
const _dots21 = (w, h, gap, r, c, op = 1) => { let s = ''; for (let y = gap / 2; y < h; y += gap) for (let x = ((y / gap) % 2 ? gap / 2 : 0) + gap / 4; x < w; x += gap) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`; return `<g fill="${c}" opacity="${op}">${s}</g>`; };
const _lily21 = (x, y, s, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${[0, 60, 120, 180, 240, 300].map(a => `<path d="M 0 0 C -9 -14 -7 -34 0 -44 C 7 -34 9 -14 0 0 Z" transform="rotate(${a})" fill="#F7BCD0" stroke="#E08AAA" stroke-width="1.2"/><path d="M 0 -6 L 0 -34" transform="rotate(${a})" stroke="#E87FA6" stroke-width="1" opacity=".6"/>`).join('')}${[20, 80, 140, 200, 260, 320].map(a => `<path d="M 0 0 L 0 -22" transform="rotate(${a})" stroke="#C8A050" stroke-width="1"/><ellipse cx="0" cy="-23" rx="1.6" ry="3" transform="rotate(${a})" fill="#D8A040"/>`).join('')}</g>`;
const _bunny21 = (x, y, s, wing) => `<g transform="translate(${x} ${y}) scale(${s})">${wing ? `<path d="M 6 -6 C 20 -24 34 -20 30 -10 C 34 -6 28 0 22 -2 C 24 4 14 4 10 0 Z" fill="#F4A8C4" stroke="#fff" stroke-width="1.6"/><path d="M 12 -8 L 26 -14 M 12 -4 L 24 -6" stroke="#E07AA0" stroke-width="1"/>` : ''}<ellipse cx="-5" cy="-14" rx="3.6" ry="9" fill="#fff" stroke="#E8B8C8" stroke-width="1.2" transform="rotate(-12 -5 -14)"/><ellipse cx="5" cy="-14" rx="3.6" ry="9" fill="#fff" stroke="#E8B8C8" stroke-width="1.2" transform="rotate(12 5 -14)"/><ellipse cx="0" cy="2" rx="11" ry="9.6" fill="#fff" stroke="#E8B8C8" stroke-width="1.2"/><circle cx="-4" cy="1" r="1.6" fill="#E86A8E"/><circle cx="4" cy="1" r="1.6" fill="#E86A8E"/><path d="M -1.4 5 Q 0 6.2 1.4 5" stroke="#C88A9A" stroke-width=".9" fill="none"/><ellipse cx="-7" cy="5" rx="2.2" ry="1.2" fill="#F8C6D6"/><ellipse cx="7" cy="5" rx="2.2" ry="1.2" fill="#F8C6D6"/></g>`;
const _gemDefs = `<radialGradient id="stGemW" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#E4E8F0"/><stop offset="1" stop-color="#A8B0C0"/></radialGradient>`;
const _gemRow = (x0, y0, x1, y1, n, r) => { let s = ''; for (let i = 0; i <= n; i++) { const t = i / n; s += `<circle cx="${f1(x0 + (x1 - x0) * t)}" cy="${f1(y0 + (y1 - y0) * t)}" r="${r}" fill="url(#stGemW)" stroke="#D88AAA" stroke-width=".7"/>`; } return s; };
const _heartGem = (x, y, r, c) => `<path d="${heartD(x, y, r)}" fill="${c}" stroke="#fff" stroke-width="1.4"/><path d="M ${f1(x - r * .5)} ${f1(y - r * .35)} L ${f1(x)} ${f1(y + r * .2)} L ${f1(x + r * .5)} ${f1(y - r * .35)}" fill="none" stroke="#fff" stroke-width=".9" opacity=".7"/><circle cx="${f1(x - r * .45)}" cy="${f1(y - r * .5)}" r="${f1(r * .14)}" fill="#fff"/>`;

Object.assign(SCENES, {
  butterfly: {
    name: '蝴蝶标本', isNew: true, draw() {
      const roses = [40, 95, 150, 205, 260].map((x, i) => { const y = 44 + Math.sin((x - 20) / 260 * Math.PI) * 18; return `<path d="M ${x} ${f1(y)} L ${x} ${f1(y + 12)}" stroke="#7FB58A" stroke-width="1.4"/>` + _rose21(x, y + 18, 9) + `<path d="M ${x - 9} ${f1(y + 14)} q -6 -4 -4 -10 q 6 2 6 8 M ${x + 9} ${f1(y + 14)} q 6 -4 4 -10 q -6 2 -6 8" fill="#9CCB9A"/>` + _drop21(x, y + 36, 3.4, '#9ED2F0', '#fff'); }).join('');
      return `<defs><linearGradient id="stBfS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFDDF4"/><stop offset="1" stop-color="#EAF4FC"/></linearGradient></defs><rect width="300" height="400" fill="#FFFDFB"/>${_dots21(300, 400, 18, 2.4, '#E6E2E6')}` +
        `<rect x="26" y="74" width="248" height="250" rx="16" fill="url(#stBfS)" stroke="#fff" stroke-width="5"/><rect x="26" y="74" width="248" height="250" rx="16" fill="none" stroke="#B8D4EA" stroke-width="1.4"/>` +
        `<path d="M 20 40 Q 150 76 280 40" fill="none" stroke="#B8B4C8" stroke-width="1.6"/><path d="M 132 52 q -14 -14 -24 -2 q 10 10 24 2 q 14 -14 24 -2 q -10 10 -24 2" fill="none" stroke="#B8B4C8" stroke-width="1.4"/>${roses}` +
        _tulip21(52, 150, 1.1) + _tulip21(72, 178, .9) + _sp421(52, 104, 12, '#F6E4A0') + _sp421(70, 120, 7, '#F6E4A0') + _sp421(248, 120, 8, '#BFE4F2') +
        [[230, 336], [254, 344], [210, 350]].map(([x, y]) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-5" rx="4.4" ry="6" transform="rotate(${a})" fill="#F8EEC8" stroke="#E8D8A0" stroke-width=".8"/>`).join('')}<circle r="2.4" fill="#F2D27A"/></g>`).join('') +
        `<rect x="40" y="334" width="120" height="30" rx="6" fill="#F8D6E2" stroke="#fff" stroke-width="2"/><rect x="40" y="370" width="220" height="12" rx="6" fill="#C8DDF4"/>`;
    }
  },
  gemroom: {
    name: '水钻大头贴', isNew: true, draw() {
      let sc = ''; for (let x = 0; x <= 300; x += 14) sc += `<circle cx="${x}" cy="0" r="9"/><circle cx="${x}" cy="400" r="9"/>`; for (let y = 0; y <= 400; y += 14) sc += `<circle cx="0" cy="${y}" r="9"/><circle cx="300" cy="${y}" r="9"/>`;
      let hd = ''; for (let i = 0; i < 26; i++) { const t = i / 26 * Math.PI * 2, x = 236 + 16 * Math.pow(Math.sin(t), 3) * 2.2, y = 70 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 2.2; hd += `<circle cx="${f1(x)}" cy="${f1(y)}" r="3.4" fill="none" stroke="#fff" stroke-width="1.6"/>`; }
      return `<defs>${_gemDefs}</defs><rect width="300" height="400" fill="#F6C6D8"/>${_dots21(300, 400, 22, 1.4, '#FBE0EA')}<g fill="#FFFFFF">${sc}</g><rect x="8" y="8" width="284" height="384" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>` +
        hd + `<path d="M 20 330 Q 60 300 40 260 Q 30 230 60 210" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray=".1 9" stroke-linecap="round"/>` +
        _heartGem(42, 60, 12, '#E8508A') + _heartGem(262, 330, 10, '#F078A8') + _sp421(60, 100, 8, '#B898E8') + _sp421(250, 140, 7, '#fff');
    }
  },
  angel: {
    name: '天使和纸', isNew: true, draw() {
      const R = seeded(31); let st = ''; for (let i = 0; i < 16; i++) st += _starO21(R() * 300, R() * 320, 6 + R() * 8, '#A8CCEA', i % 3 ? 'none' : '#E4F0FA', 1.4);
      return `<rect width="300" height="400" fill="#E8ECF0"/><g transform="rotate(-10 150 200)"><rect x="40" y="-40" width="220" height="480" fill="#FFFFFF"/><path d="M 40 -40 V 440 M 260 -40 V 440" stroke="#E0E6EC" stroke-width="2"/></g>${st}` +
        `<g transform="translate(196 64) rotate(-6)"><rect width="78" height="58" rx="3" fill="#F4F6F8" stroke="#8A9AAE" stroke-width="1.6"/><rect width="78" height="10" rx="2" fill="#8AB4E0"/><rect x="66" y="2" width="8" height="6" fill="#E86A7A"/><rect x="8" y="16" width="62" height="34" fill="#7EC86A"/><rect x="8" y="36" width="62" height="14" fill="#5AA858"/><path d="M 8 30 L 30 22 L 50 30 L 70 20" stroke="#B8E4A8" stroke-width="2" fill="none"/></g>` +
        `<g transform="translate(46 300)"><ellipse rx="22" ry="8" fill="none" stroke="#F2D27A" stroke-width="3"/></g>` + _bunny21(250, 290, 1.1) + _bunny21(60, 120, .8) +
        `<path d="M 0 330 Q 150 316 300 334 V 400 H 0 Z" fill="#F4F7FA"/>`;
    }
  },
  mintnote: {
    name: '薄荷手账', isNew: true, draw() {
      const R = seeded(41); let bl = ''; for (let i = 0; i < 18; i++) bl += `<circle cx="${f1(R() * 300)}" cy="${f1(R() * 400)}" r="${f1(3 + R() * 6)}" fill="${['#B8E0C8', '#C8D8F0', '#E8D0F0', '#F0E8B8'][i % 4]}" opacity=".7"/>`;
      let st = ''; for (let i = 0; i < 14; i++) st += _starO21(R() * 300, R() * 400, 4 + R() * 5, '#fff', '#fff', 1);
      const card = (x, y, w, h, rot, inner) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="${-w / 2 - 4}" y="${-h / 2 - 4}" width="${w + 8}" height="${h + 12}" fill="#fff" stroke="#D8E8DC" stroke-width="1"/>${inner(w, h)}</g>`;
      return `<defs><linearGradient id="stMn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4F2DE"/><stop offset="1" stop-color="#D0E8D8"/></linearGradient></defs><rect width="300" height="400" fill="url(#stMn)"/><rect width="120" height="400" fill="#E8EEF0" opacity=".5"/>${bl}${st}` +
        card(48, 70, 60, 40, -4, (w, h) => `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#F4E8D8"/><ellipse cx="0" cy="4" rx="20" ry="9" fill="#F8F4E8"/><path d="M -18 4 Q 0 -14 18 4" fill="#CDE6B8"/><circle cx="0" cy="-10" r="4" fill="#E0413C"/>`) +
        card(256, 82, 50, 54, 5, (w, h) => `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#C8D4D8"/>${_dots21(50, 54, 8, 1.4, '#7AA87A').replace('<g ', `<g transform="translate(${-w / 2} ${-h / 2})" `)}`) +
        card(54, 236, 54, 70, 3, (w, h) => `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#E8F4E0"/><path d="M -20 30 C -10 0 10 0 20 -30" stroke="#9CC898" stroke-width="5" fill="none"/>`) +
        `<g transform="translate(250 300)"><ellipse rx="14" ry="11" fill="#B8E0A8" stroke="#6E9E6A" stroke-width="1.4"/><circle cx="-6" cy="-9" r="5" fill="#B8E0A8" stroke="#6E9E6A" stroke-width="1.4"/><circle cx="6" cy="-9" r="5" fill="#B8E0A8" stroke="#6E9E6A" stroke-width="1.4"/><circle cx="-6" cy="-9" r="1.6" fill="#2A3A2A"/><circle cx="6" cy="-9" r="1.6" fill="#2A3A2A"/><path d="M -4 2 Q 0 5 4 2" stroke="#2A3A2A" stroke-width="1" fill="none"/></g>` +
        `<rect x="18" y="356" width="88" height="14" rx="2" fill="#A8D8C0" opacity=".9" transform="rotate(-3 62 363)"/>`;
    }
  },
  tears: {
    name: '泪滴星夜', isNew: true, draw() {
      const R = seeded(57); let sp = ''; for (let i = 0; i < 140; i++) sp += `<circle cx="${f1(R() * 300)}" cy="${f1(R() * 340)}" r="${f1(.4 + R() * 1.1)}" fill="${R() < .5 ? '#5A78C0' : '#8AA8E0'}" opacity="${f1(.4 + R() * .6)}"/>`;
      let ht = ''; for (let y = 0; y < 120; y += 6) for (let x = 0; x < 70 - y * .5; x += 6) { ht += `<circle cx="${x}" cy="${y}" r="${f1(2.2 - y / 70)}"/><circle cx="${300 - x}" cy="${y}" r="${f1(2.2 - y / 70)}"/>`; }
      let sw = ''; [[70, 150], [230, 120], [150, 240]].forEach(([x, y]) => { sw += `<path d="M ${x} ${y} m -10 0 a 10 10 0 1 1 10 10 a 6 6 0 1 1 -6 -6 a 3 3 0 1 1 3 3" fill="none" stroke="#3E5490" stroke-width="1.4"/>`; });
      let dr = ''; [60, 100, 140, 180, 220, 260].forEach((x, i) => { dr += _drop21(x, 24 + (i % 2) * 6, 5, '#8EC0F0', '#E4F2FF'); });
      let bs = ''; for (let x = 10; x < 300; x += 42) bs += _starO21(x, 372 + (x % 3) * 4, 13, '#3E6AB8', '#8AB8EA', 1.4);
      return `<rect width="300" height="400" fill="#1C2850"/>${sp}<g fill="#BFD8F8" opacity=".75">${ht}</g>${sw}${dr}` +
        _lily21(30, 40, .9, 20) + _lily21(272, 46, .85, -24) + _bunny21(240, 300, 1.2, true) +
        `<rect y="352" width="300" height="48" fill="#BFD8F2"/>${Array.from({ length: 30 }, (_, i) => `<rect x="${i * 10}" y="352" width="5" height="48" fill="#A8C8EC"/>`).join('')}${bs}`;
    }
  }
});

/* ---------------- 相框 ---------------- */
Object.assign(FRAMES, {
  gem: { name: '水钻相框', isNew: true, rect: [30, 34, 240, 300] },
  journal: { name: '手账胶带', isNew: true, rect: [24, 30, 252, 326] },
  starry: { name: '星夜泪滴', isNew: true, rect: [26, 26, 248, 316] }
});
const _frameSVG21 = frameSVG;
frameSVG = function (k) {
  const F = FRAMES[k]; if (!F || !['gem', 'journal', 'starry'].includes(k)) return _frameSVG21(k);
  const [x, y, w, h] = F.rect, hole = `M 0 0 H 300 V 400 H 0 Z M ${x} ${y} h ${w} v ${h} h ${-w} Z`;
  if (k === 'gem') {
    let lace = ''; for (let i = 0; i <= 300; i += 15) lace += `<circle cx="${i}" cy="4" r="9"/><circle cx="${i}" cy="396" r="9"/>`; for (let i = 0; i <= 400; i += 15) lace += `<circle cx="4" cy="${i}" r="9"/><circle cx="296" cy="${i}" r="9"/>`;
    const gr = _gemRow(x - 6, y - 6, x + w + 6, y - 6, 34, 3.6) + _gemRow(x - 6, y + h + 6, x + w + 6, y + h + 6, 34, 3.6) + _gemRow(x - 6, y - 6, x - 6, y + h + 6, 42, 3.6) + _gemRow(x + w + 6, y - 6, x + w + 6, y + h + 6, 42, 3.6);
    return `<defs>${_gemDefs}</defs><path d="${hole}" fill="#F7C8DA" fill-rule="evenodd"/><g fill="#fff">${lace}</g>${gr}` + _heartGem(x + 4, y + 4, 9, '#E8508A') + _heartGem(x + w - 4, y + h - 4, 9, '#E8508A') +
      `<rect x="${x + w - 12}" y="${y - 10}" width="9" height="9" fill="#C82A6A" stroke="#fff" stroke-width="1.2" transform="rotate(45 ${x + w - 7.5} ${y - 5.5})"/><rect x="${x + 6}" y="${y + h - 2}" width="8" height="8" fill="#4A5AC8" stroke="#fff" stroke-width="1.2" transform="rotate(45 ${x + 10} ${y + h + 2})"/>` +
      `<g transform="translate(150 ${y - 8})"><rect x="-14" y="-10" width="28" height="12" rx="2" fill="#E8C870" stroke="#B8943A" stroke-width="1"/><rect x="-10" y="0" width="20" height="10" rx="1" fill="#F2DC90" stroke="#B8943A" stroke-width="1"/></g>` + _sp421(x + w - 30, y + 30, 7, '#fff') + _sp421(x + 26, y + h - 40, 6, '#B898E8');
  }
  if (k === 'journal') {
    const tape = (cx, cy, rot, c) => `<rect x="${cx - 26}" y="${cy - 8}" width="52" height="16" fill="${c}" opacity=".85" transform="rotate(${rot} ${cx} ${cy})"/><path d="M ${cx - 26} ${cy - 8} l 3 4 l -3 4 l 3 4 l -3 4 M ${cx + 26} ${cy - 8} l -3 4 l 3 4 l -3 4 l 3 4" transform="rotate(${rot} ${cx} ${cy})" stroke="#fff" stroke-width="1" fill="none"/>`;
    return `<path d="${hole}" fill="#FBF8F0" fill-rule="evenodd"/>${_dots21(300, 400, 12, .9, '#E2DACA')}<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#E8E0D0" stroke-width="2"/>` +
      tape(x + 10, y + 4, -38, '#A8D8C0') + tape(x + w - 10, y + 4, 38, '#F4C6D2') + tape(x + w - 6, y + h - 2, -32, '#C8D8F0') + tape(x + 8, y + h - 2, 34, '#F6E4A0') +
      _starO21(276, 380, 8, '#A8CCEA', '#E4F0FA') + _starO21(30, 376, 6, '#F2D27A', '#FBF0C8');
  }
  let dr = ''; for (let i = 0; i < 9; i++) dr += _drop21(x + 14 + i * (w - 28) / 8, y + h + 22, 4.4, '#8EC0F0', '#E4F2FF');
  let ht = ''; for (let yy = 4; yy < 400; yy += 7) for (let xx = 4; xx < 300; xx += 7) if (xx < x - 3 || xx > x + w + 3 || yy < y - 3 || yy > y + h + 3) ht += `<circle cx="${xx}" cy="${yy}" r="1.3"/>`;
  return `<path d="${hole}" fill="#1C2850" fill-rule="evenodd"/><g fill="#3E5A9A">${ht}</g><rect x="${x - 3}" y="${y - 3}" width="${w + 6}" height="${h + 6}" fill="none" stroke="#BFD8F8" stroke-width="2"/>${dr}` +
    _starO21(x + 4, y + 4, 12, '#fff', '#8AB8EA', 1.6) + _starO21(x + w - 4, y + h - 4, 10, '#fff', '#F7BCD0', 1.6);
};
const _frameTexts21 = frameTexts;
frameTexts = function (k, cap) {
  if (k === 'gem') return cap ? [{ x: 150, y: 364, s: 20, t: cap, c: '#fff', f: 'd', a: 'center', stroke: '#E0508A' }] : [];
  if (k === 'journal') return cap ? [{ x: 150, y: 382, s: 17, t: cap, c: '#5A7A6A', f: 'd', a: 'center' }] : [];
  if (k === 'starry') return cap ? [{ x: 150, y: 390, s: 15, t: cap, c: '#E4F0FF', f: 'd', a: 'center', stroke: '#1C2850' }] : [];
  return _frameTexts21(k, cap);
};

/* ---------------- 贴纸：按主题分组 ---------------- */
const _S = (inner, sw = 3) => `<g stroke-linejoin="round">${inner}</g>`;
Object.assign(STICKERS, {
  butterfly: `<g stroke="#fff" stroke-width="2.4" paint-order="stroke"><path d="M 0 0 C -6 -14 -20 -18 -18 -6 C -17 0 -8 2 0 0 Z" fill="#F8B8D0"/><path d="M 0 0 C 6 -14 20 -18 18 -6 C 17 0 8 2 0 0 Z" fill="#F8B8D0"/><path d="M 0 1 C -6 4 -14 14 -8 15 C -3 16 -1 8 0 1 Z" fill="#F8E4A0"/><path d="M 0 1 C 6 4 14 14 8 15 C 3 16 1 8 0 1 Z" fill="#F8E4A0"/></g><path d="M -12 -8 Q -8 -6 -5 -3 M 12 -8 Q 8 -6 5 -3" stroke="#A8D4F0" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="2" rx="1.6" ry="8" fill="#6A5A70"/><path d="M -1 -6 Q -4 -12 -7 -13 M 1 -6 Q 4 -12 7 -13" stroke="#6A5A70" stroke-width=".9" fill="none"/>`,
  tulip: `<g transform="translate(0 -14) scale(.32)">${_tulip21(0, 0, 1)}</g>`,
  roseDrop: `<path d="M 0 -18 L 0 -8" stroke="#7FB58A" stroke-width="1.6"/>${_rose21(0, -2, 9)}${_drop21(0, 15, 3.6, '#9ED2F0')}`,
  sparkle4: _sp421(-3, -2, 13, '#F6E4A0') + _sp421(10, 9, 6, '#F6E4A0'),
  cross: `<path d="M -2.4 -14 H 2.4 V -6 H 9 V -1.4 H 2.4 V 14 H -2.4 V -1.4 H -9 V -6 H -2.4 Z" fill="#E8C870" stroke="#fff" stroke-width="2.4" paint-order="stroke"/><circle cy="-17" r="2.4" fill="none" stroke="#E8C870" stroke-width="1.4"/>`,
  heartGem: `<defs>${_gemDefs}</defs>` + _heartGem(0, 1, 14, '#E8508A'),
  gemSquare: `<rect x="-10" y="-10" width="20" height="20" fill="#C82A6A" stroke="#fff" stroke-width="2.4" transform="rotate(45)"/><path d="M -7 0 L 0 -7 L 7 0 L 0 7 Z" fill="#E8508A"/><path d="M -3 -3 L 0 -6" stroke="#fff" stroke-width="1.4"/>`,
  gemStrip: `<defs>${_gemDefs}</defs>` + _gemRow(-16, -6, 16, -6, 6, 3) + _gemRow(-16, 4, 16, 4, 6, 3),
  clip: `<rect x="-12" y="-10" width="24" height="10" rx="2" fill="#E8C870" stroke="#fff" stroke-width="2"/><rect x="-9" y="-1" width="18" height="12" rx="1.6" fill="#F2DC90" stroke="#B8943A" stroke-width="1"/>`,
  halo: `<ellipse rx="15" ry="5.4" fill="none" stroke="#fff" stroke-width="6"/><ellipse rx="15" ry="5.4" fill="none" stroke="#F2D27A" stroke-width="3"/>`,
  wings: [-1, 1].map(s => `<path d="M ${s * 2} 0 C ${s * 10} -14 ${s * 22} -14 ${s * 19} -4 C ${s * 22} -1 ${s * 18} 4 ${s * 14} 3 C ${s * 15} 8 ${s * 8} 8 ${s * 2} 4 Z" fill="#fff" stroke="#B8C8D8" stroke-width="1.4"/><path d="M ${s * 6} -2 L ${s * 16} -6 M ${s * 6} 2 L ${s * 14} 2" stroke="#C8D4E0" stroke-width="1"/>`).join(''),
  bunny: _bunny21(0, 4, 1.1),
  starBlue: _starO21(0, 0, 15, '#7AA8D8', '#E4F0FA', 2.2),
  window: `<g transform="rotate(-6)"><rect x="-17" y="-13" width="34" height="26" rx="2" fill="#F4F6F8" stroke="#8A9AAE" stroke-width="1.4"/><rect x="-17" y="-13" width="34" height="6" rx="1.4" fill="#8AB4E0"/><rect x="11" y="-12" width="5" height="4" fill="#E86A7A"/><rect x="-13" y="-4" width="26" height="14" fill="#7EC86A"/><rect x="-13" y="4" width="26" height="6" fill="#5AA858"/></g>`,
  frog: `<ellipse cy="4" rx="15" ry="11" fill="#B8E0A8" stroke="#fff" stroke-width="2.4" paint-order="stroke"/><circle cx="-7" cy="-7" r="5.4" fill="#B8E0A8" stroke="#6E9E6A" stroke-width="1.2"/><circle cx="7" cy="-7" r="5.4" fill="#B8E0A8" stroke="#6E9E6A" stroke-width="1.2"/><circle cx="-7" cy="-7" r="1.8" fill="#2A3A2A"/><circle cx="7" cy="-7" r="1.8" fill="#2A3A2A"/><path d="M -5 5 Q 0 8.4 5 5" stroke="#2A3A2A" stroke-width="1.2" fill="none"/><ellipse cx="-10" cy="4" rx="2.4" ry="1.4" fill="#F4B8C0"/><ellipse cx="10" cy="4" rx="2.4" ry="1.4" fill="#F4B8C0"/>`,
  cat: `<path d="M -13 -6 L -11 -16 L -4 -10 Q 0 -11 4 -10 L 11 -16 L 13 -6 Q 16 6 8 11 Q 0 14 -8 11 Q -16 6 -13 -6 Z" fill="#fff" stroke="#5A4A4A" stroke-width="1.4"/><path d="M 4 -10 Q 8 -6 10 -12" fill="#F2B880"/><circle cx="-5" cy="0" r="1.4" fill="#3A2A2A"/><circle cx="5" cy="0" r="1.4" fill="#3A2A2A"/><path d="M -2 4 Q 0 6 2 4" stroke="#3A2A2A" stroke-width="1" fill="none"/><path d="M -14 2 L -20 1 M -14 5 L -20 6 M 14 2 L 20 1 M 14 5 L 20 6" stroke="#5A4A4A" stroke-width=".8"/>`,
  leaf: `<path d="M -14 12 C -16 -6 0 -16 15 -14 C 14 2 4 14 -14 12 Z" fill="#9CC86A" stroke="#fff" stroke-width="2.4" paint-order="stroke"/><path d="M -12 10 Q 2 0 12 -12" stroke="#6E9E4A" stroke-width="1.2" fill="none"/>${_sp421(-2, 2, 4, '#F2E8A0')}${_sp421(6, -6, 3, '#F2E8A0')}`,
  matcha: `<path d="M -11 -8 H 9 V 8 Q 9 13 4 13 H -6 Q -11 13 -11 8 Z" fill="#DFF0D0" stroke="#5A8A5A" stroke-width="1.4"/><path d="M 9 -4 Q 16 -4 15 3 Q 14 8 9 7" fill="none" stroke="#5A8A5A" stroke-width="1.4"/><rect x="-9" y="-4" width="16" height="15" rx="2" fill="#9CC86A" opacity=".8"/><rect x="-7" y="-2" width="5" height="5" fill="#fff" opacity=".7"/><rect x="0" y="2" width="5" height="5" fill="#fff" opacity=".6"/>`,
  panda: `<circle cx="-9" cy="-9" r="5" fill="#2A2528"/><circle cx="9" cy="-9" r="5" fill="#2A2528"/><ellipse rx="13" ry="11" fill="#fff" stroke="#2A2528" stroke-width="1.2"/><ellipse cx="-5" cy="-1" rx="3.4" ry="4.4" fill="#2A2528" transform="rotate(20 -5 -1)"/><ellipse cx="5" cy="-1" rx="3.4" ry="4.4" fill="#2A2528" transform="rotate(-20 5 -1)"/><circle cx="-5" cy="-1.4" r="1" fill="#fff"/><circle cx="5" cy="-1.4" r="1" fill="#fff"/><ellipse cy="5" rx="2" ry="1.4" fill="#2A2528"/>`,
  tearDrop: `<defs><linearGradient id="stTd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C8E4FF"/><stop offset="1" stop-color="#5A90E0"/></linearGradient></defs><path d="M 0 -17 C 4 -9 12 -2 12 5 A 12 12 0 0 1 -12 5 C -12 -2 -4 -9 0 -17 Z" fill="url(#stTd)" stroke="#fff" stroke-width="2.4"/><ellipse cx="-4.6" cy="3" rx="2" ry="4" fill="#fff" opacity=".8"/>`,
  lily: `<g transform="scale(.36)">${_lily21(0, 0, 1)}</g>`,
  angelBunny: _bunny21(-4, 4, 1, true),
  goldfish: `<path d="M -12 0 C -8 -9 6 -9 9 0 C 6 9 -8 9 -12 0 Z" fill="#F07A3A" stroke="#fff" stroke-width="2"/><path d="M 8 0 L 17 -8 Q 14 0 17 8 Z" fill="#F8A060" stroke="#fff" stroke-width="1.6"/><path d="M -2 -7 Q 2 -12 6 -7" fill="#F8A060"/><circle cx="-7" cy="-1.4" r="1.6" fill="#2A2528"/><path d="M 0 -4 Q 3 0 0 4" stroke="#FFD0A0" stroke-width="1" fill="none"/>`,
  dotStar: `<defs><pattern id="stHt" width="3" height="3" patternUnits="userSpaceOnUse"><rect width="3" height="3" fill="#4A7AC8"/><circle cx="1.5" cy="1.5" r=".9" fill="#BFD8F8"/></pattern></defs>` + _starO21(0, 0, 16, '#fff', 'url(#stHt)', 2.4),
  bubbles: `<circle cx="-5" cy="-3" r="8" fill="#E8F4FF" opacity=".6" stroke="#fff" stroke-width="1.6"/><circle cx="8" cy="7" r="5" fill="#F4E8FF" opacity=".6" stroke="#fff" stroke-width="1.4"/><path d="M -9 -7 Q -7 -9 -4 -9" stroke="#fff" stroke-width="1.4" fill="none"/>`
});
const STICKER_SETS = {
  basic: { name: '基础', keys: ['star', 'heart', 'sparkle', 'clover', 'bow', 'cloud', 'cherry', 'crown', 'note', 'bubble', 'pearls', 'ribbon', 'rose', 'pointe', 'smileFace', 'bandaid', 'candy', 'lightning'] },
  butterfly: { name: '蝴蝶标本', keys: ['butterfly', 'tulip', 'roseDrop', 'sparkle4', 'cross', 'pearls'] },
  gem: { name: '水钻', keys: ['heartGem', 'gemSquare', 'gemStrip', 'clip', 'sparkle4', 'heart'] },
  angel: { name: '天使', keys: ['halo', 'wings', 'bunny', 'starBlue', 'window', 'cloud'] },
  mint: { name: '薄荷手账', keys: ['frog', 'cat', 'leaf', 'matcha', 'panda', 'clover', 'star'] },
  tears: { name: '泪滴星夜', keys: ['tearDrop', 'lily', 'angelBunny', 'goldfish', 'dotStar', 'bubbles'] }
};
const STUDIO_THEMES = {
  butterfly: { name: '蝴蝶标本', scene: 'butterfly', frame: 'lace', filter: 'cream', set: 'butterfly' },
  gem: { name: '水钻大头贴', scene: 'gemroom', frame: 'gem', filter: 'none', set: 'gem' },
  angel: { name: '天使和纸', scene: 'angel', frame: 'polaroid', filter: 'cool', set: 'angel' },
  mint: { name: '薄荷手账', scene: 'mintnote', frame: 'journal', filter: 'cream', set: 'mint' },
  tears: { name: '泪滴星夜', scene: 'tears', frame: 'starry', filter: 'none', set: 'tears' }
};
studio.sset = 'basic';
function applyTheme(k) {
  const T = STUDIO_THEMES[k]; if (!T) return;
  Object.assign(studio, { scene: T.scene, frame: T.frame, filter: T.filter, sset: T.set, sel: -1 });
  const [x, y, w, h] = FRAMES[T.frame].rect, keys = STICKER_SETS[T.set].keys, R = seeded(Date.now() % 9973 + 1);
  // 贴纸撒在四个角附近，不挡脸和衣服
  const spots = [[.12, .1], [.88, .12], [.1, .55], [.9, .6], [.14, .9], [.86, .88]];
  studio.stickers = spots.map(([u, v], i) => ({ t: keys[i % keys.length], x: f1(x + w * u + (R() - .5) * 10), y: f1(y + h * v + (R() - .5) * 10), r: Math.round((R() - .5) * 30), k: +(0.85 + R() * .45).toFixed(2) }));
}
const _renderStudioUI21 = renderStudioUI;
renderStudioUI = function () {
  _renderStudioUI21();
  const box = $('#stStk'); if (!box) return;
  const set = STICKER_SETS[studio.sset] || STICKER_SETS.basic;
  box.innerHTML = `<div class="stk-sets" role="tablist" aria-label="贴纸主题">${Object.entries(STICKER_SETS).map(([k, s]) => `<button type="button" class="opt" role="tab" data-sset="${k}" aria-selected="${k === studio.sset}">${s.name}</button>`).join('')}</div>` +
    `<div class="stk-grid">${set.keys.filter(k => STICKERS[k]).map(k => `<button type="button" class="stk-btn" data-add="${k}" aria-label="加贴纸"><svg viewBox="-20 -20 40 40" aria-hidden="true">${STICKERS[k]}</svg></button>`).join('')}</div>`;
  const th = $('#stTheme');
  if (th && !th.dataset.bound) {
    th.dataset.bound = 1;
    th.addEventListener('click', e => { const b = e.target.closest('[data-theme]'); if (!b) return; applyTheme(b.dataset.theme); renderStudioUI(); renderShot(); });
    box.addEventListener('click', e => { const b = e.target.closest('[data-sset]'); if (!b) return; studio.sset = b.dataset.sset; renderStudioUI(); });
  }
  if (th) th.innerHTML = Object.entries(STUDIO_THEMES).map(([k, t]) => `<button type="button" class="opt is-new" data-theme="${k}">${t.name}</button>`).join('');
};
