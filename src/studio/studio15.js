/* ---------------- 姿势 / 拍照小屋 · 糖果装饰风 + 甜酷街头 ---------------- */
Object.assign(POSES, {
  handsHips: { name: '双手叉腰', head: 3, body: LEAN, L: { up: 24, fore: -78 }, R: { up: -24, fore: 78 } },
  cupFace: { name: '双手捧心', head: 6, body: LEAN_L, L: { up: 4, fore: -160, over: true }, R: { up: -4, fore: 160, over: true } }
});
['curtsy', 'heart', 'spread'].forEach(k => { delete POSES[k].isNew; });

Object.keys(SCENES).forEach(k => { delete SCENES[k].isNew; });
Object.keys(FRAMES).forEach(k => { delete FRAMES[k].isNew; });
const _doodleStar = (x, y, r, c, rot = 0) => { let p = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + rot + i * Math.PI / 5, rr = i % 2 ? r * .46 : r; p += `${i ? 'L' : 'M'} ${f1(x + Math.cos(a) * rr)} ${f1(y + Math.sin(a) * rr)} `; } return `<path d="${p}Z" fill="${c}" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>`; };
Object.assign(SCENES, {
  stickerwall: {
    name: '涂鸦贴纸墙', isNew: true, draw() {
      const R = seeded(23), cols = ['#F48FB1', '#FFD460', '#8FD0F2', '#9EDBB0', '#C9AEF0', '#FF9A6A'];
      let s = `<rect width="300" height="400" fill="#FFF7EC"/>`;
      for (let y = 0; y < 400; y += 24) s += `<path d="M 0 ${y} H 300" stroke="#F1E2CF" stroke-width="1"/>`;
      for (let i = 0; i < 34; i++) {
        const x = R() * 300, y = R() * 330, c = cols[i % cols.length], k = i % 5, r = 7 + R() * 9;
        if (k === 0) s += _doodleStar(x, y, r, c, R());
        else if (k === 1) s += `<path d="${heartD(x, y, r * .9)}" fill="${c}" stroke="#fff" stroke-width="2"/>`;
        else if (k === 2) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * .8)}" fill="${c}" stroke="#fff" stroke-width="2"/><circle cx="${f1(x - r * .25)}" cy="${f1(y - r * .2)}" r="1" fill="#6A4A2E"/><circle cx="${f1(x + r * .25)}" cy="${f1(y - r * .2)}" r="1" fill="#6A4A2E"/><path d="M ${f1(x - r * .3)} ${f1(y + r * .15)} Q ${f1(x)} ${f1(y + r * .45)} ${f1(x + r * .3)} ${f1(y + r * .15)}" fill="none" stroke="#6A4A2E" stroke-width="1"/>`;
        else if (k === 3) s += `<path d="M ${f1(x - r)} ${f1(y)} q ${f1(r / 2)} ${f1(-r / 2)} ${f1(r)} 0 t ${f1(r)} 0" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`;
        else s += `<rect x="${f1(x - r)}" y="${f1(y - r * .45)}" width="${f1(r * 2)}" height="${f1(r * .9)}" rx="${f1(r * .45)}" fill="${c}" opacity=".8" transform="rotate(${f1((R() - .5) * 60)} ${f1(x)} ${f1(y)})"/>`;
      }
      return s + `<rect y="330" width="300" height="70" fill="#F4D9E4"/><path d="M 0 330 H 300" stroke="#fff" stroke-width="3"/>`;
    }
  },
  candyshop: {
    name: '糖果店', isNew: true, draw() {
      const jar = (x, y, w, h, cols) => { let c = ''; const R = seeded(Math.round(x + y)); for (let i = 0; i < 14; i++) c += `<circle cx="${f1(x + 4 + R() * (w - 8))}" cy="${f1(y + h * .3 + R() * h * .6)}" r="${f1(2.6 + R() * 2)}" fill="${cols[i % cols.length]}"/>`;
        return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="#EAF7FA" opacity=".8" stroke="#fff" stroke-width="2"/>${c}<rect x="${x - 2}" y="${y - 6}" width="${w + 4}" height="8" rx="3" fill="#F48FB1"/>`; };
      let aw = ''; for (let x = 0; x < 300; x += 30) aw += `<path d="M ${x} 20 h 30 v 22 q -7.5 8 -15 0 q -7.5 8 -15 0 Z" fill="${(x / 30) % 2 ? '#FFFFFF' : '#F7A8C4'}"/>`;
      const shelf = y => `<rect x="10" y="${y}" width="280" height="6" rx="2" fill="#E6C29A"/>`;
      return `<rect width="300" height="400" fill="#FFF1F5"/>${aw}` + shelf(120) + jar(24, 72, 40, 48, ['#F48FB1', '#FFD460', '#8FD0F2']) + jar(76, 80, 36, 40, ['#9EDBB0', '#FFFFFF', '#F48FB1']) + jar(190, 76, 40, 44, ['#C9AEF0', '#FFD460', '#FF9A6A']) + jar(240, 70, 38, 50, ['#8FD0F2', '#F48FB1', '#FFFFFF']) +
        shelf(214) + jar(30, 170, 44, 44, ['#FF9A6A', '#FFD460']) + jar(226, 166, 44, 48, ['#9EDBB0', '#F48FB1', '#C9AEF0']) +
        `<g transform="translate(150 150)"><circle r="22" fill="#fff" stroke="#F48FB1" stroke-width="3"/><path d="M -14 0 a 14 14 0 0 1 28 0 a 10 10 0 0 1 -20 0 a 6 6 0 0 1 12 0" fill="none" stroke="#F48FB1" stroke-width="3"/><rect x="-1.5" y="22" width="3" height="40" fill="#fff" stroke="#E0C2CE"/></g>` +
        `<rect y="320" width="300" height="80" fill="#FBE0EA"/><path d="M 0 320 H 300" stroke="#fff" stroke-width="3"/>${Array.from({ length: 10 }, (_, i) => `<rect x="${i * 30}" y="320" width="15" height="80" fill="#fff" opacity=".4"/>`).join('')}`;
    }
  },
  crossing: {
    name: '放学路口', isNew: true, draw() {
      let st = ''; for (let i = 0; i < 6; i++) st += `<rect x="${-20 + i * 60}" y="328" width="34" height="72" fill="#FFFFFF" opacity=".85" transform="skewX(-12)"/>`;
      return `<defs><linearGradient id="stDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBD3C6"/><stop offset=".6" stop-color="#FDEBD8"/><stop offset="1" stop-color="#F9F1E4"/></linearGradient></defs><rect width="300" height="400" fill="url(#stDusk)"/>` +
        `<rect x="14" y="120" width="70" height="200" fill="#EBD8D2"/><rect x="24" y="136" width="20" height="24" fill="#FFF6E8"/><rect x="54" y="136" width="20" height="24" fill="#FFF6E8"/><rect x="24" y="180" width="20" height="24" fill="#FFF6E8"/><rect x="54" y="180" width="20" height="24" fill="#FFF6E8"/>` +
        `<rect x="216" y="96" width="74" height="224" fill="#E4D2D8"/><rect x="226" y="112" width="54" height="30" fill="#FFF6E8"/><rect x="226" y="156" width="54" height="30" fill="#FFF6E8"/>` +
        `<rect x="246" y="190" width="6" height="130" fill="#8A8288"/><rect x="236" y="160" width="26" height="40" rx="4" fill="#4A4448"/><circle cx="249" cy="172" r="5" fill="#F4636B"/><circle cx="249" cy="188" r="5" fill="#8A8288"/>` +
        `<path d="M 0 60 Q 150 44 300 64" fill="none" stroke="#8A7A80" stroke-width="1.2"/><path d="M 0 74 Q 150 60 300 80" fill="none" stroke="#8A7A80" stroke-width="1"/>` +
        `<rect y="320" width="300" height="80" fill="#B9B2B6"/>${st}`;
    }
  }
});
Object.assign(STICKERS, {
  smileFace: `<circle r="12" fill="#FFE27A" stroke="#fff" stroke-width="3"/><circle cx="-4" cy="-3" r="1.6" fill="#6A4A2E"/><circle cx="4" cy="-3" r="1.6" fill="#6A4A2E"/><path d="M -5.6 2.4 Q 0 7.6 5.6 2.4" fill="none" stroke="#6A4A2E" stroke-width="1.6" stroke-linecap="round"/>`,
  bandaid: `<g transform="rotate(-20)"><rect x="-15" y="-5.4" width="30" height="10.8" rx="5.4" fill="#F6D2B4" stroke="#fff" stroke-width="2.4"/><rect x="-5" y="-4" width="10" height="8" rx="1.6" fill="#FBE8D6"/></g>`,
  candy: `<path d="M -16 -6 L -9 0 L -16 6 Z M 16 -6 L 9 0 L 16 6 Z" fill="#8FD0F2" stroke="#fff" stroke-width="2"/><circle r="9" fill="#F48FB1" stroke="#fff" stroke-width="2.4"/><path d="M -6 -4 Q 0 4 6 -4" fill="none" stroke="#fff" stroke-width="2"/>`,
  lightning: `<path d="M 3 -16 L -9 2 L -1 2 L -4 16 L 9 -3 L 1 -3 Z" fill="#FFD460" stroke="#fff" stroke-width="2.4" stroke-linejoin="round"/>`
});
