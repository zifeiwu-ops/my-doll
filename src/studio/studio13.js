/* ---------------- 拍照小屋 · Coquette 芭蕾甜心主题：场景 / 相框 / 贴纸 ---------------- */
const _cqBow = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M 0 0 C -6 -7 -13 -6 -12.6 0 C -12.2 5 -5 5 0 1.4 C 5 5 12.2 5 12.6 0 C 13 -6 6 -7 0 0 Z M -1.4 1 C -4 7 -6 12 -8.6 17 L -4.6 16 L -3.4 19.6 C -1.6 13 .2 7 1 1.6 Z M 1.4 1 C 4 7 6 12 8.6 17 L 4.6 16 L 3.4 19.6 C 1.6 13 -.2 7 -1 1.6 Z" fill="${c}"/><ellipse cx="0" cy=".6" rx="2.4" ry="2.8" fill="${c}" stroke="#fff" stroke-width=".6" opacity=".95"/></g>`;
Object.assign(SCENES, {
  ballet: {
    name: '芭蕾练功房', isNew: true, draw() {
      const R = seeded(5); let fl = '';
      for (let x = 0; x < 300; x += 26) fl += `<path d="M ${x} 300 L ${x - 40} 400" stroke="#D9BFA6" stroke-width="1"/>`;
      let dust = ''; for (let i = 0; i < 30; i++) dust += `<circle cx="${f1(R() * 300)}" cy="${f1(R() * 280)}" r="${f1(.6 + R() * 1.4)}"/>`;
      return `<defs><linearGradient id="stBw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F8EEEA"/><stop offset="1" stop-color="#F3E2DC"/></linearGradient><linearGradient id="stMir" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EAF1F4"/><stop offset=".5" stop-color="#F8FBFC"/><stop offset="1" stop-color="#DCE7EC"/></linearGradient></defs>` +
        `<rect width="300" height="300" fill="url(#stBw)"/><rect x="26" y="30" width="248" height="232" fill="url(#stMir)" stroke="#E8D6CE" stroke-width="5"/><path d="M 70 40 L 40 120 M 96 40 L 54 150 M 240 60 L 214 130" stroke="#fff" stroke-width="6" opacity=".6" stroke-linecap="round"/>` +
        `<rect x="0" y="186" width="300" height="5" rx="2.5" fill="#C9A27E"/><rect x="0" y="185" width="300" height="2" fill="#E3C7A8"/>${[20, 150, 280].map(x => `<rect x="${x - 2}" y="189" width="4" height="30" fill="#B8906C"/>`).join('')}` +
        `<path d="M 60 30 Q 100 70 150 44 Q 200 70 240 30" fill="none" stroke="#F4B6C6" stroke-width="3"/>${_cqBow(60, 30, .8, '#F4A7C0')}${_cqBow(240, 30, .8, '#F4A7C0')}` +
        `<rect y="296" width="300" height="104" fill="#EBD4BE"/>${fl}<rect y="292" width="300" height="6" fill="#F8EEEA"/><g fill="#fff" opacity=".7">${dust}</g>`;
    }
  },
  vanity: {
    name: '梳妆台', isNew: true, draw() {
      const bottle = (x, y, c, h) => `<rect x="${x - 6}" y="${y - h}" width="12" height="${h}" rx="4" fill="${c}" opacity=".85" stroke="#fff" stroke-width="1.4"/><rect x="${x - 2.4}" y="${y - h - 6}" width="4.8" height="6" rx="1" fill="#E6C25C"/><circle cx="${x}" cy="${y - h - 9}" r="3.2" fill="#F7C6D3" stroke="#fff" stroke-width="1"/>`;
      let wall = ''; for (let x = 0; x < 300; x += 20) wall += `<rect x="${x}" width="10" height="300" fill="#FBE4EA"/>`;
      return `<rect width="300" height="400" fill="#FFF5F7"/>${wall}` +
        `<ellipse cx="150" cy="118" rx="92" ry="100" fill="#E9D0C4"/><ellipse cx="150" cy="118" rx="82" ry="90" fill="#F3F7F9"/><path d="M 100 70 L 80 130 M 118 58 L 92 150" stroke="#fff" stroke-width="7" opacity=".7" stroke-linecap="round"/>` +
        `${_cqBow(150, 24, 1.3, '#F4A7C0')}<path d="M 58 60 C 40 120 44 200 70 250" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray=".1 7" stroke-linecap="round"/><path d="M 242 60 C 260 120 256 200 230 250" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray=".1 7" stroke-linecap="round"/>` +
        `<rect x="0" y="262" width="300" height="20" fill="#F1DCD2"/><rect x="0" y="282" width="300" height="118" fill="#FBEAE8"/><path d="M 0 282 Q 12 292 24 282 T 48 282 T 72 282 T 96 282 T 120 282 T 144 282 T 168 282 T 192 282 T 216 282 T 240 282 T 264 282 T 288 282 T 312 282" fill="#fff" opacity=".85"/>` +
        bottle(36, 262, '#F7C6D3', 22) + bottle(56, 262, '#DCC6F0', 16) + bottle(262, 262, '#F9E3B8', 20) +
        `<g transform="translate(236 252)">${Array.from({ length: 9 }, (_, i) => `<circle cx="${i * 4}" cy="${f1(Math.sin(i / 8 * Math.PI) * 6)}" r="2" fill="url(#grad-pearl)"/>`).join('')}</g>`;
    }
  },
  ribbon: {
    name: '蝴蝶结蕾丝', isNew: true, draw() {
      let bows = ''; for (let y = 24; y < 400; y += 56) for (let x = ((y / 56) % 2) * 34 + 18; x < 310; x += 68) bows += _cqBow(x, y, .72, '#FFFFFF');
      const scal = y => { let d = `M 0 ${y}`; for (let x = 0; x <= 300; x += 15) d += ` q 7.5 9 15 0`; return d; };
      return `<defs><linearGradient id="stRb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F9D3DD"/><stop offset="1" stop-color="#FDE9EF"/></linearGradient></defs><rect width="300" height="400" fill="url(#stRb)"/><g opacity=".75">${bows}</g>` +
        `<rect y="318" width="300" height="82" fill="#FFFDF8"/><path d="${scal(318)}" fill="#FFFDF8" stroke="#F4C6D2" stroke-width="1.2"/>${Array.from({ length: 20 }, (_, i) => `<circle cx="${7.5 + i * 15}" cy="323" r="1.6" fill="#F4C6D2"/>`).join('')}`;
    }
  }
});
Object.assign(FRAMES, { lace: { name: '蕾丝相框', isNew: true, rect: [22, 22, 256, 356] } });
const _frameSVG12 = frameSVG;
frameSVG = function (k) {
  if (k !== 'lace') return _frameSVG12(k);
  const [x, y, w, h] = FRAMES.lace.rect; let sc = '';
  const edge = (x0, y0, x1, y1, n) => { for (let i = 0; i <= n; i++) { const t = i / n; sc += `<circle cx="${f1(x0 + (x1 - x0) * t)}" cy="${f1(y0 + (y1 - y0) * t)}" r="7"/>`; } };
  edge(x, y, x + w, y, 18); edge(x, y + h, x + w, y + h, 18); edge(x, y, x, y + h, 25); edge(x + w, y, x + w, y + h, 25);
  let holes = ''; for (let i = 0; i <= 18; i++) { const cx = x + w * i / 18; holes += `<circle cx="${f1(cx)}" cy="${y - 1}" r="1.6"/><circle cx="${f1(cx)}" cy="${y + h + 1}" r="1.6"/>`; }
  for (let i = 0; i <= 25; i++) { const cy = y + h * i / 25; holes += `<circle cx="${x - 1}" cy="${f1(cy)}" r="1.6"/><circle cx="${x + w + 1}" cy="${f1(cy)}" r="1.6"/>`; }
  return `<path d="M 0 0 H 300 V 400 H 0 Z M ${x} ${y} h ${w} v ${h} h ${-w} Z" fill="#FFFDF8" fill-rule="evenodd"/><g fill="#FFFDF8" stroke="#F1D6DE" stroke-width="1">${sc}</g><g fill="#F4C6D2">${holes}</g>` +
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#F4C6D2" stroke-width="1.4"/>${_cqBow(150, 16, 1.1, '#F4A7C0')}`;
};
const _frameTexts12 = frameTexts;
frameTexts = function (k, cap) { if (k === 'lace') return cap ? [{ x: 150, y: 366, s: 17, t: cap, c: '#E0668F', f: 'd', a: 'center', stroke: '#fff' }] : []; return _frameTexts12(k, cap); };
Object.assign(STICKERS, {
  pearls: Array.from({ length: 7 }, (_, i) => `<circle cx="${-15 + i * 5}" cy="${f1(Math.sin(i / 6 * Math.PI) * 6 - 3)}" r="2.6" fill="url(#grad-pearl)" stroke="#fff" stroke-width="1"/>`).join(''),
  ribbon: `<g transform="scale(1.2)">${_cqBow(0, -4, .9, '#F4A7C0')}</g>`,
  rose: `<circle r="10" fill="#F2A7B8" stroke="#fff" stroke-width="2.4"/><path d="M -5 0 a 5 5 0 1 1 5 5 a 3 3 0 1 1 -1 -5" fill="none" stroke="#D9778E" stroke-width="2" stroke-linecap="round"/><ellipse cx="-9" cy="9" rx="5" ry="2.4" fill="#9CC08A" transform="rotate(-30 -9 9)"/>`,
  pointe: `<path d="M -6 12 C -10 4 -8 -8 -2 -12 C 4 -14 8 -8 7 0 C 6 6 2 12 -6 12 Z" fill="#F7C6D3" stroke="#fff" stroke-width="2.4" paint-order="stroke"/><path d="M -4 -4 L 12 -16 M 2 -2 L 16 -10" stroke="#F4A7C0" stroke-width="1.6" stroke-linecap="round"/>`
});

['curtsy', 'heart', 'spread'].forEach(k => { POSES[k].isNew = true; });
