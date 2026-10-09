/* =====================================================================
   背景分区：选现成场景 / 上传照片 / 自己画（Paint 编辑器）
   · 选中的背景铺在舞台上娃娃身后；拍照小屋打开时自动用同一张
   · 自己的背景存在浏览器的 IndexedDB 里（图片 + 每个图层，下次还能接着改），不上传
   ===================================================================== */
var BG = (() => {   // var：ui7 里先用 typeof 检查它，const 会在声明前报错
  const KEY = 'y2k-closet-bg', ROUGH = `<filter id="stRough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="2" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="7"/></filter>`;
  let list = [], db = null, mem = false;
  /* ---------- 存储：IndexedDB（打不开就只存在这次打开的页面里） ---------- */
  const idb = () => new Promise((ok, no) => { if (db) return ok(db); if (!window.indexedDB) return no(new Error('no idb')); const r = indexedDB.open('my-doll', 1); r.onupgradeneeded = () => r.result.createObjectStore('bgs', { keyPath: 'id' }); r.onsuccess = () => { db = r.result; ok(db); }; r.onerror = () => no(r.error); });
  const run = (mode, fn) => idb().then(d => new Promise((ok, no) => { const t = d.transaction('bgs', mode), r = fn(t.objectStore('bgs')); t.oncomplete = () => ok(r && r.result); t.onerror = () => no(t.error); }));
  async function load() { try { list = (await run('readonly', s => s.getAll())) || []; list.sort((a, b) => b.t - a.t); } catch (e) { list = []; mem = true; } register(); }
  const put = b => (mem ? Promise.resolve() : run('readwrite', s => s.put(b)).catch(() => { mem = true; }));
  const del = id => (mem ? Promise.resolve() : run('readwrite', s => s.delete(id)).catch(() => { }));
  /* 自己的背景也登记成拍照小屋的场景 */
  function register() {
    Object.keys(SCENES).forEach(k => { if (SCENES[k].user) delete SCENES[k]; });
    list.forEach(b => { SCENES['u_' + b.id] = { name: b.name, user: true, draw: () => `<image href="${b.url}" x="0" y="0" width="300" height="400" preserveAspectRatio="xMidYMid slice"/>` }; });
  }
  const cur = () => { try { return localStorage.getItem(KEY) || ''; } catch (e) { return ''; } };
  const setCur = v => { try { localStorage.setItem(KEY, v); } catch (e) { } apply(); };
  const sceneKey = v => (v.startsWith('scene:') ? v.slice(6) : v.startsWith('u:') ? 'u_' + v.slice(2) : '');
  /* ---------- 舞台背景 ---------- */
  function apply() {
    const st = document.querySelector('.stage'); if (!st) return;
    let el = document.getElementById('stageBg'); if (!el) { el = document.createElement('div'); el.id = 'stageBg'; el.className = 'stage-bg'; el.setAttribute('aria-hidden', 'true'); st.insertBefore(el, st.firstChild); }
    const v = cur(), k = sceneKey(v), S = SCENES[k];
    if (!S) { el.innerHTML = ''; st.classList.remove('has-bg'); return; }
    el.innerHTML = `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMin slice"><defs>${ROUGH}</defs>${S.draw()}</svg>`; st.classList.add('has-bg');
  }
  /* ---------- 分区里的卡片 ---------- */
  const thumb = k => `<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>${ROUGH}</defs>${SCENES[k].draw()}</svg>`;
  function panelHTML() {
    const v = cur(), on = x => `aria-pressed="${v === x}"`;
    const add = `<div class="card card-add"><button class="card-btn" type="button" data-bgnew="upload"><span class="plus" aria-hidden="true">+</span><span class="nm">上传照片当背景</span></button></div>` +
      `<div class="card card-add draw"><button class="card-btn" type="button" data-bgnew="draw"><span class="plus" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 20 L5.2 15.4 L15.8 4.8 a2 2 0 0 1 2.8 0 l.6 .6 a2 2 0 0 1 0 2.8 L8.6 18.8 Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></span><span class="nm">自己画一张</span></button></div>`;
    const none = `<div class="card"><button class="card-btn" type="button" data-bg="" ${on('')}><span class="thumb bg-thumb bg-none"></span><span class="nm">原来的波点</span></button></div>`;
    const mine = list.map(b => `<div class="card"><button class="card-btn" type="button" data-bg="u:${b.id}" ${on('u:' + b.id)}><span class="thumb bg-thumb"><img src="${b.thumb || b.url}" alt=""></span><span class="nm">${esc(b.name)}</span></button><button class="del bg-edit" type="button" data-bgedit="${b.id}" aria-label="接着画 ${esc(b.name)}">✎</button><button class="del" type="button" data-bgdel="${b.id}" aria-label="删除 ${esc(b.name)}">×</button></div>`).join('');
    const scenes = Object.keys(SCENES).filter(k => !SCENES[k].user).map(k => `<div class="card"><button class="card-btn" type="button" data-bg="scene:${k}" ${on('scene:' + k)}><span class="thumb bg-thumb">${thumb(k)}</span><span class="nm">${SCENES[k].name}</span></button></div>`).join('');
    return add + none + (list.length ? `<p class="grid-sub">我的背景</p>` + mine : '') + `<p class="grid-sub">现成场景</p>` + scenes;
  }
  /* ---------- 娃娃站的位置（画背景时的参考，和拍照小屋全身照的位置一样） ---------- */
  function guide() {
    try {
      const defs = PATTERN_DEFS + (typeof irisDefsHTML === 'function' ? irisDefsHTML() : '') + ((document.getElementById('userDefs') || {}).innerHTML || '');
      const src = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="900" height="1200" viewBox="0 0 300 400"><defs>${defs}</defs><g transform="${dollPlace('full', [0, 0, 300, 400])}">${dollSVG(state.outfit, {}, state.pose)}</g></svg>`;
      const im = new Image(); im.src = URL.createObjectURL(new Blob([src], { type: 'image/svg+xml' })); return im;
    } catch (e) { return null; }
  }
  function openPaint(b, image) {
    Paint.open({ layers: b ? b.layers : null, image, guide: guide(), onSave: async r => {
      const id = b ? b.id : 'b' + Date.now().toString(36), rec = { id, name: b ? b.name : `我的背景 ${list.length + 1}`, t: Date.now(), ...r };
      list = [rec, ...list.filter(x => x.id !== id)]; register(); await put(rec);
      setCur('u:' + id); state.tab = 'bg'; renderTabs(); renderGrid();
      toast(mem ? `「${rec.name}」用上了（这个浏览器不能长期保存，关掉页面就没了）` : `「${rec.name}」保存好了，已经换上`);
    } });
  }
  function bind() {
    const file = document.createElement('input'); file.type = 'file'; file.accept = 'image/*'; file.hidden = true; document.body.appendChild(file);
    file.addEventListener('change', () => { const f = file.files[0]; file.value = ''; if (!f) return; if (!/^image\//.test(f.type)) { toast('这不是图片文件，换一张 JPG 或 PNG 试试'); return; } const r = new FileReader(); r.onload = () => openPaint(null, r.result); r.readAsDataURL(f); });
    $('#grid').addEventListener('click', e => {
      const s = e.target.closest('[data-bg]'); if (s) { setCur(s.dataset.bg); renderGrid(); return; }
      const n = e.target.closest('[data-bgnew]'); if (n) { if (n.dataset.bgnew === 'upload') file.click(); else openPaint(null); return; }
      const ed = e.target.closest('[data-bgedit]'); if (ed) { const b = list.find(x => x.id === ed.dataset.bgedit); if (b) openPaint(b); return; }
      const d = e.target.closest('[data-bgdel]'); if (d) {
        if (!d.dataset.armed) { d.dataset.armed = '1'; d.textContent = '删除?'; setTimeout(() => { if (d.isConnected) { delete d.dataset.armed; d.textContent = '×'; } }, 3000); return; }
        const id = d.dataset.bgdel; list = list.filter(x => x.id !== id); register(); del(id); if (cur() === 'u:' + id) setCur(''); renderTabs(); renderGrid(); toast('删掉了');
      }
    });
    // 拍照小屋打开时，场景默认用舞台上的背景
    const os = openStudio; openStudio = function (opener) { const k = sceneKey(cur()); if (SCENES[k]) studio.scene = k; return os.apply(this, arguments); };
  }
  return { load, apply, panelHTML, bind, count: () => list.length + Object.keys(SCENES).filter(k => !SCENES[k].user).length };
})();
BG.bind();
BG.load().then(() => { BG.apply(); renderTabs(); if (state.tab === 'bg') renderGrid(); });
