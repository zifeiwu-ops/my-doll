/* ---------------- 面料 · 甜酷街头（条纹袜、格纹、牛仔、针织） ---------------- */
const _hs = (id, a, b, h = 8, k = .5) => `<pattern id="pat-${id}" patternUnits="userSpaceOnUse" width="10" height="${h}"><rect width="10" height="${h}" fill="${a}"/><rect y="${f1(h * (1 - k))}" width="10" height="${f1(h * k)}" fill="${b}"/></pattern>`;
const _vs = (id, a, b, w = 6, k = .5) => `<pattern id="pat-${id}" patternUnits="userSpaceOnUse" width="${w}" height="10"><rect width="${w}" height="10" fill="${a}"/><rect x="${f1(w * (1 - k))}" width="${f1(w * k)}" height="10" fill="${b}"/></pattern>`;
const _plaid = (id, bg, c1, c2, s = 14) => `<pattern id="pat-${id}" patternUnits="userSpaceOnUse" width="${s}" height="${s}"><rect width="${s}" height="${s}" fill="${bg}"/><rect width="${f1(s * .36)}" height="${s}" fill="${c1}" opacity=".5"/><rect width="${s}" height="${f1(s * .36)}" fill="${c1}" opacity=".5"/>` +
  `<rect x="${f1(s * .62)}" width="${f1(s * .07)}" height="${s}" fill="${c2}" opacity=".9"/><rect y="${f1(s * .62)}" width="${s}" height="${f1(s * .07)}" fill="${c2}" opacity=".9"/><rect x="${f1(s * .14)}" width="${f1(s * .05)}" height="${s}" fill="#000" opacity=".18"/><rect y="${f1(s * .14)}" width="${s}" height="${f1(s * .05)}" fill="#000" opacity=".18"/></pattern>`;
const _cable = (id, b, d) => `<pattern id="pat-${id}" patternUnits="userSpaceOnUse" width="12" height="12"><rect width="12" height="12" fill="${b}"/><path d="M 2 0 Q 5 3 2 6 Q 5 9 2 12 M 5 0 Q 2 3 5 6 Q 2 9 5 12" fill="none" stroke="${d}" stroke-width=".9"/><path d="M 8.6 0 L 8.6 12 M 10.6 0 L 10.6 12" stroke="${d}" stroke-width=".5" opacity=".7"/></pattern>`;
PATTERN_DEFS += `
${_hs('stripeRW', '#FFFFFF', '#D8323C', 9)}${_hs('stripeBW', '#FFFFFF', '#2A2528', 8)}${_hs('stripePB', '#F4A6C0', '#2A2528', 10, .32)}${_hs('stripeGG', '#A6A2A6', '#5A565A', 9)}
${_hs('stripeTee', '#FBFBF8', '#2A2528', 6)}${_hs('stripePinkTee', '#F8C4D4', '#C85A86', 6, .4)}${_hs('stripeRB', '#2A2528', '#C82C3A', 10)}${_hs('stripePurple', '#FFFFFF', '#6A4AA6', 7)}
${_vs('vstripePB', '#2A2528', '#C84A8E', 6)}${_vs('vstripePP', '#E8A6C8', '#7A3E8E', 5)}
${_plaid('plaidRed', '#C82C3A', '#6A0E1A', '#F2C6C6', 16)}${_plaid('plaidYG', '#F6E27A', '#8CC06A', '#E0584E', 14)}${_plaid('plaidPurple', '#8A5A9E', '#3E2450', '#D8B4E4', 13)}
${_plaid('plaidPink', '#E6A6B8', '#A84A6A', '#FFFFFF', 12)}${_plaid('plaidBrown', '#7A3A2E', '#3A1A14', '#C87A5A', 11)}${_plaid('plaidYellow', '#F2C24A', '#C87A22', '#FFFFFF', 13)}${_plaid('plaidMint', '#DDEFE6', '#8ABCA6', '#FFFFFF', 12)}
${_cable('cablecream', '#F6E6B4', '#D6BE82')}${_rib('ribpinkcardi', '#F2B6CA', '#DE98B2', 2.6)}
<pattern id="pat-sagedenim" patternUnits="userSpaceOnUse" width="5" height="5"><rect width="5" height="5" fill="#9AAAA0"/><path d="M-1.25 1.25 L1.25 -1.25 M0 5 L5 0 M3.75 6.25 L6.25 3.75" stroke="#AEBCB2" stroke-width=".7"/></pattern>
<pattern id="pat-greendenim" patternUnits="userSpaceOnUse" width="5" height="5"><rect width="5" height="5" fill="#2E8A6E"/><path d="M-1.25 1.25 L1.25 -1.25 M0 5 L5 0 M3.75 6.25 L6.25 3.75" stroke="#43A084" stroke-width=".7"/></pattern>
<pattern id="pat-fishnet" patternUnits="userSpaceOnUse" width="4" height="4"><path d="M 0 0 L 4 4 M 4 0 L 0 4" stroke="#2A2528" stroke-width=".45" opacity=".85"/></pattern>
<pattern id="pat-argylePurple" patternUnits="userSpaceOnUse" width="12" height="18"><rect width="12" height="18" fill="#4A3A7A"/><path d="M 6 0 L 12 9 L 6 18 L 0 9 Z" fill="#2E2450"/><path d="M 0 0 L 12 18 M 12 0 L 0 18" stroke="#8A7AC0" stroke-width=".5" stroke-dasharray="1.2 1"/></pattern>
<linearGradient id="grad-ombrePink" gradientUnits="userSpaceOnUse" x1="0" y1="380" x2="0" y2="580"><stop offset="0" stop-color="#F2A6C8"/><stop offset="1" stop-color="#8A3EA6"/></linearGradient>`;
Object.assign(PAT_BASE, {
  stripeRW: '#E88A90', stripeBW: '#8A878A', stripePB: '#C87A94', stripeGG: '#807C80', stripeTee: '#96939A', stripePinkTee: '#E8A0BA', stripeRB: '#7A2A32', stripePurple: '#B4A4D2', vstripePB: '#7A3A5A', vstripePP: '#B070AA',
  plaidRed: '#B8303C', plaidYG: '#E0D070', plaidPurple: '#7A4E8E', plaidPink: '#D898AC', plaidBrown: '#6A3428', plaidYellow: '#E6B042', plaidMint: '#CFE6DA', cablecream: '#F4E2AE', ribpinkcardi: '#F2B6CA',
  sagedenim: '#9AAAA0', greendenim: '#2E8A6E', fishnet: '#E8C8B8', argylePurple: '#3E3066'
});
Object.assign(GRAD_BASE, { ombrePink: '#C070B0' });
