/* ═══════════════════════════════════════════════════════════════════════════
   JORNADA XP — shell.js
   Boot → Logon → Desktop. Gerenciador de janelas Luna, barra de tarefas,
   menu Iniciar, bandeja (idioma, som, relógio), balões, temas, papéis de parede.
   API pública: window.XP
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const el = (tag, attrs = {}, html = '') => {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (k === 'class') e.className = v;
        else if (k === 'style') e.style.cssText = v;
        else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
        else if (v === true) e.setAttribute(k, '');
        else if (v !== false && v != null) e.setAttribute(k, v);
    }
    if (html) e.innerHTML = html;
    return e;
};
const store = {
    get(k, d = null) { try { const v = localStorage.getItem(k); return v == null ? d : v; } catch (_) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} },
};
const isMobile = () => window.matchMedia('(max-width: 760px)').matches;
const ICON = (name, size = 16) => `${name}-${size}.png`;

/* ─── Strings do shell (PT/EN) ─── */
const S = {
    pt: {
        start: 'Iniciar', boot_l1: 'Canal do Rogrão', boot_l2: 'Jornada', boot_edition: 'XP',
        boot_foot_l: 'Carregando a história dos games…', boot_foot_r: 'Jornada Cronológica · 1985 → 4K', boot_skip: 'Pular',
        logon_intro: 'Para começar, clique no seu nome de usuário', logon_user: 'Rogrão', logon_hint: 'Clique para entrar na Jornada',
        logon_off: 'Desligar o computador', logon_note: 'Depois de entrar, você pode abrir a Jornada, o Hall of Fame e o recomendador pelos ícones da área de trabalho ou pelo menu Iniciar.',
        logon_loading: 'Carregando suas configurações pessoais…',
        sm_allprogs: 'Todos os programas', sm_logoff: 'Fazer logoff', sm_shutdown: 'Desligar o computador',
        sd_title: 'Desligar o computador', sd_standby: 'Em espera', sd_off: 'Desativar', sd_restart: 'Reiniciar', sd_cancel: 'Cancelar',
        tray_sound_on: 'Sons do sistema: ativados (clique para silenciar)', tray_sound_off: 'Sons do sistema: silenciados (clique para ativar)',
        tray_lang: 'Idioma: Português (clique para English)', tray_lang_en: 'Language: English (click for Português)',
        ctx_arrange: 'Organizar ícones', ctx_refresh: 'Atualizar', ctx_props: 'Propriedades', ctx_theme: 'Alterar tema…',
        win_min: 'Minimizar', win_max: 'Maximizar', win_restore: 'Restaurar', win_close: 'Fechar',
        ql_desktop: 'Mostrar área de trabalho', ql_yt: 'Canal do Rogrão no YouTube', ql_discord: 'Servidor do Discord',
        balloon_new_title: 'Novo episódio disponível!', balloon_new_text: 'A Jornada está em {year}. Abra a pasta Jornada para ver os jogos do ano.',
        balloon_welcome_title: 'Bem-vindo à Jornada XP', balloon_welcome_text: 'Dê dois cliques nos ícones da área de trabalho ou use o menu Iniciar. Clique com o botão direito no fundo para trocar o tema.',
        bsod_1: 'Ocorreu um problema e o Windows foi desligado para evitar danos ao seu computador.',
        bsod_2: 'ROGRAO_NAO_ZEROU_O_JOGO',
        bsod_3: 'Se esta é a primeira vez que você vê esta tela de erro de parada, reinicie o computador. Se esta tela aparecer novamente, siga estes passos:\n\nVerifique se você assistiu a todos os episódios da Jornada Cronológica. Se o problema persistir, inscreva-se no canal e ative o sininho.',
        bsod_4: 'Informações técnicas:\n\n*** STOP: 0x0000198D (0x00000001, 0x0000000F, 0xCAFE1985, 0x00004B00)\n\n*** Jornada.sys - Endereço 1989 base em 1985, Datestamp 8-bit',
        bsod_5: 'Iniciando o despejo de memória física…  Pressione qualquer tecla ou clique para reiniciar.',
        standby_hint: 'Desculpe, esse computador não hiberna. Ele está ocupado zerando jogos.',
        dev_by: 'Site desenvolvido por',
    },
    en: {
        start: 'start', boot_l1: "Rogrão's Channel", boot_l2: 'Journey', boot_edition: 'XP',
        boot_foot_l: 'Loading gaming history…', boot_foot_r: 'Chronological Journey · 1985 → 4K', boot_skip: 'Skip',
        logon_intro: 'To begin, click your user name', logon_user: 'Rogrão', logon_hint: 'Click to enter the Journey',
        logon_off: 'Turn off computer', logon_note: 'After logging on you can open the Journey, the Hall of Fame and the recommender from the desktop icons or the Start menu.',
        logon_loading: 'Loading your personal settings…',
        sm_allprogs: 'All Programs', sm_logoff: 'Log Off', sm_shutdown: 'Turn Off Computer',
        sd_title: 'Turn off computer', sd_standby: 'Stand By', sd_off: 'Turn Off', sd_restart: 'Restart', sd_cancel: 'Cancel',
        tray_sound_on: 'System sounds: on (click to mute)', tray_sound_off: 'System sounds: muted (click to enable)',
        tray_lang: 'Language: English (click for Português)', tray_lang_en: 'Language: English (click for Português)',
        ctx_arrange: 'Arrange Icons', ctx_refresh: 'Refresh', ctx_props: 'Properties', ctx_theme: 'Change theme…',
        win_min: 'Minimize', win_max: 'Maximize', win_restore: 'Restore', win_close: 'Close',
        ql_desktop: 'Show Desktop', ql_yt: "Rogrão's Channel on YouTube", ql_discord: 'Discord server',
        balloon_new_title: 'New episode available!', balloon_new_text: 'The Journey is now in {year}. Open the Journey folder to see this year\'s games.',
        balloon_welcome_title: 'Welcome to Journey XP', balloon_welcome_text: 'Double-click the desktop icons or use the Start menu. Right-click the desktop to change the theme.',
        bsod_1: 'A problem has been detected and Windows has been shut down to prevent damage to your computer.',
        bsod_2: 'ROGRAO_DID_NOT_BEAT_THE_GAME',
        bsod_3: 'If this is the first time you\'ve seen this Stop error screen, restart your computer. If this screen appears again, follow these steps:\n\nCheck that you have watched every episode of the Chronological Journey. If the problem persists, subscribe to the channel and hit the bell.',
        bsod_4: 'Technical information:\n\n*** STOP: 0x0000198D (0x00000001, 0x0000000F, 0xCAFE1985, 0x00004B00)\n\n*** Jornada.sys - Address 1989 base at 1985, Datestamp 8-bit',
        bsod_5: 'Beginning dump of physical memory…  Press any key or click to restart.',
        standby_hint: 'Sorry, this computer does not sleep. It is busy beating games.',
        dev_by: 'Website developed by',
    },
};
const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'pt');
const s = (k, vars = {}) => Object.entries(vars).reduce((m, [a, b]) => m.replaceAll(`{${a}}`, b), (S[lang()][k] ?? S.pt[k] ?? k));

/* ─── Sons ─── */
const SOUND_FILES = ['startup','logon','logoff','shutdown','ding','error','exclamation','notify','balloon','menu','minimize','restore','critical','start','recycle','insert','remove','tada','information','default'];
const audioCache = {};
let soundEnabled = store.get('xp_sound', 'on') !== 'off';
function sound(name, volume = 0.6) {
    if (!soundEnabled || !SOUND_FILES.includes(name)) return;
    try {
        let a = audioCache[name];
        if (!a) { a = new Audio(`${name}.mp3`); a.preload = 'auto'; audioCache[name] = a; }
        a.volume = volume;
        a.currentTime = 0;
        a.play().catch(() => {});
    } catch (_) {}
}
function setSound(on) {
    soundEnabled = on;
    store.set('xp_sound', on ? 'on' : 'off');
    const btn = $('#xp-tray-sound');
    if (btn) {
        btn.classList.toggle('muted', !on);
        btn.title = s(on ? 'tray_sound_on' : 'tray_sound_off');
        btn.setAttribute('aria-label', btn.title);
        btn.setAttribute('aria-pressed', String(on));
    }
}

/* ─── Tema e papel de parede ─── */
const THEMES = ['blue', 'olive', 'silver', 'classic'];
function setTheme(theme) {
    if (!THEMES.includes(theme)) theme = 'blue';
    document.documentElement.dataset.xpTheme = theme;
    store.set('xp_theme', theme);
    const meta = $('#theme-color');
    if (meta) meta.content = { blue: '#245edb', olive: '#7d9a4a', silver: '#c9c9d9', classic: '#d4d0c8' }[theme];
    document.dispatchEvent(new CustomEvent('xp:theme', { detail: theme }));
}
function setWallpaper(slug, mode = 'cover') {
    const d = $('#xp-desktop');
    if (!d) return;
    d.classList.remove('wp-stretch', 'wp-center', 'wp-tile', 'wp-none');
    if (slug === 'none') { d.classList.add('wp-none'); }
    else {
        d.style.backgroundImage = `url("${slug}.jpg")`;
        if (mode === 'stretch') d.classList.add('wp-stretch');
        if (mode === 'center') d.classList.add('wp-center');
        if (mode === 'tile') d.classList.add('wp-tile');
    }
    store.set('xp_wallpaper', slug);
    store.set('xp_wallpaper_mode', mode);
}

/* ═══════════════════════════════ WINDOW MANAGER ═══════════════════════════════ */
const APPS = {};          // id -> definição
const WINDOWS = new Map(); // id -> estado {el, app, minimized, maximized, rect}
let zTop = 100;
let cascade = 0;
let activeId = null;

function registerApp(id, def) { APPS[id] = { id, width: 720, height: 520, ...def }; }

function desktopRect() {
    const d = $('#xp-desktop');
    return { w: d.clientWidth, h: d.clientHeight };
}

function buildWindow(app) {
    const w = el('div', { class: 'xp-window opening', role: 'dialog', 'aria-labelledby': `xpwt-${app.id}`, tabindex: '-1', 'data-id': app.id });
    if (app.dialog) w.classList.add('dialog');
    const tb = el('div', { class: 'xp-titlebar' });
    tb.append(el('img', { src: ICON(app.icon, 16), alt: '' }));
    tb.append(el('span', { class: 'xp-window-title', id: `xpwt-${app.id}` }, app.title()));
    const ctl = el('div', { class: 'xp-controls' });
    if (!app.dialog) ctl.append(el('button', { class: 'ctl-min', type: 'button', 'aria-label': s('win_min'), title: s('win_min'), onclick: e => { e.stopPropagation(); minimizeWindow(app.id); } }));
    if (!app.dialog && !app.noMax) ctl.append(el('button', { class: 'ctl-max', type: 'button', 'aria-label': s('win_max'), title: s('win_max'), onclick: e => { e.stopPropagation(); toggleMaximize(app.id); } }));
    ctl.append(el('button', { class: 'ctl-close', type: 'button', 'aria-label': s('win_close'), title: s('win_close'), onclick: e => { e.stopPropagation(); closeWindow(app.id); } }));
    tb.append(ctl);
    w.append(tb);
    const client = el('div', { class: 'xp-client' + (app.pane ? ' pane' : '') });
    w.append(client);
    if (!app.dialog) {
        ['n', 's', 'e', 'w', 'se', 'sw'].forEach(dir => w.append(el('div', { class: `xp-resize xp-resize-${dir}`, 'data-dir': dir })));
        w.append(el('div', { class: 'xp-grip' }));
    }
    // Interações
    tb.addEventListener('pointerdown', e => startDrag(e, app.id));
    tb.addEventListener('dblclick', e => { if (!app.dialog && !app.noMax && !e.target.closest('button')) toggleMaximize(app.id); });
    w.addEventListener('pointerdown', () => focusWindow(app.id), true);
    $$('.xp-resize', w).forEach(h => h.addEventListener('pointerdown', e => startResize(e, app.id, h.dataset.dir)));
    return { w, client };
}

function openWindow(id, params = {}) {
    const app = APPS[id];
    if (!app) return null;
    let st = WINDOWS.get(id);
    if (st) {
        if (st.minimized) restoreWindow(id);
        focusWindow(id);
        if (app.onParams) app.onParams(st, params);
        return st;
    }
    const { w, client } = buildWindow(app);
    const { w: dw, h: dh } = desktopRect();
    const width = Math.min(app.width, dw - 20), height = Math.min(app.height, dh - 20);
    const off = (cascade++ % 6) * 26;
    const left = Math.max(6, Math.round((dw - width) / 2) + off - 60), top = Math.max(6, Math.round((dh - height) / 2.6) + off);
    w.style.cssText = `left:${left}px;top:${top}px;width:${width}px;height:${height}px;z-index:${++zTop}`;
    $('#xp-windows').append(w);
    st = { id, el: w, client, app, minimized: false, maximized: false, rect: { left, top, width, height } };
    WINDOWS.set(id, st);
    try { app.render(client, st, params); } catch (err) { console.error(`[XP] erro ao renderizar ${id}`, err); client.innerHTML = `<div class="xp-body pad"><p>Não foi possível abrir esta janela.</p></div>`; }
    addTaskButton(st);
    focusWindow(id);
    if (app.maximizeOnOpen && !isMobile()) toggleMaximize(id, true);
    setTimeout(() => w.classList.remove('opening'), 200);
    if (!params.silent) sound(app.dialog ? 'ding' : 'start', 0.4);
    if (app.hash && !params.noHash) history.replaceState(null, '', `#${app.hash}`);
    return st;
}

function closeWindow(id) {
    const st = WINDOWS.get(id);
    if (!st) return;
    try { st.app.onClose && st.app.onClose(st); } catch (_) {}
    st.el.remove();
    WINDOWS.delete(id);
    $(`#xp-tasks [data-id="${id}"]`)?.remove();
    if (activeId === id) {
        activeId = null;
        const rest = [...WINDOWS.values()].filter(x => !x.minimized).sort((a, b) => (+b.el.style.zIndex) - (+a.el.style.zIndex));
        if (rest[0]) focusWindow(rest[0].id);
    }
    if (st.app.hash && location.hash === `#${st.app.hash}`) history.replaceState(null, '', location.pathname + location.search);
    if (!st.app.dialog) sound('menu', 0.35);
}

function focusWindow(id) {
    const st = WINDOWS.get(id);
    if (!st || st.minimized) return;
    if (activeId !== id) {
        st.el.style.zIndex = ++zTop;
        activeId = id;
    }
    WINDOWS.forEach(x => x.el.classList.toggle('inactive', x.id !== id));
    $$('#xp-tasks .xp-taskbtn').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    closeStartMenu();
}

function minimizeWindow(id) {
    const st = WINDOWS.get(id);
    if (!st) return;
    st.minimized = true;
    st.el.classList.add('minimized');
    $(`#xp-tasks [data-id="${id}"]`)?.classList.remove('active');
    if (activeId === id) activeId = null;
    sound('minimize', 0.4);
    const rest = [...WINDOWS.values()].filter(x => !x.minimized).sort((a, b) => (+b.el.style.zIndex) - (+a.el.style.zIndex));
    if (rest[0]) focusWindow(rest[0].id);
}
function restoreWindow(id) {
    const st = WINDOWS.get(id);
    if (!st) return;
    st.minimized = false;
    st.el.classList.remove('minimized');
    sound('restore', 0.4);
    focusWindow(id);
}
function toggleMaximize(id, force) {
    const st = WINDOWS.get(id);
    if (!st || st.app.dialog) return;
    const max = force != null ? force : !st.maximized;
    st.maximized = max;
    st.el.classList.toggle('maximized', max);
    const b = $('.ctl-max, .ctl-restore', st.el);
    if (b) { b.className = max ? 'ctl-restore' : 'ctl-max'; b.title = b.ariaLabel = s(max ? 'win_restore' : 'win_max'); }
    if (!max) {
        const r = st.rect;
        st.el.style.left = r.left + 'px'; st.el.style.top = r.top + 'px'; st.el.style.width = r.width + 'px'; st.el.style.height = r.height + 'px';
    }
    st.app.onResize && st.app.onResize(st);
}
function taskClick(id) {
    const st = WINDOWS.get(id);
    if (!st) return;
    if (st.minimized) restoreWindow(id);
    else if (activeId === id) minimizeWindow(id);
    else focusWindow(id);
}
function addTaskButton(st) {
    const b = el('button', { class: 'xp-taskbtn', type: 'button', 'data-id': st.id, onclick: () => taskClick(st.id) });
    b.append(el('img', { src: ICON(st.app.icon, 16), alt: '' }), el('span', {}, st.app.title()));
    $('#xp-tasks').append(b);
}
function setTitle(id, title) {
    const st = WINDOWS.get(id);
    if (!st) return;
    $('.xp-window-title', st.el).textContent = title;
    const tb = $(`#xp-tasks [data-id="${id}"] span`);
    if (tb) tb.textContent = title;
}

/* Arrastar */
function startDrag(e, id) {
    if (e.button !== 0 || e.target.closest('button') || isMobile()) return;
    const st = WINDOWS.get(id);
    if (!st || st.maximized) return;
    focusWindow(id);
    const startX = e.clientX, startY = e.clientY;
    const r = st.el.getBoundingClientRect();
    const dr = $('#xp-desktop').getBoundingClientRect();
    const ox = r.left - dr.left, oy = r.top - dr.top;
    document.body.classList.add('xp-dragging');
    const move = ev => {
        let nx = ox + (ev.clientX - startX), ny = oy + (ev.clientY - startY);
        ny = Math.max(0, Math.min(ny, dr.height - 30));
        nx = Math.max(-r.width + 80, Math.min(nx, dr.width - 80));
        st.el.style.left = nx + 'px'; st.el.style.top = ny + 'px';
    };
    const up = () => {
        document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up);
        document.body.classList.remove('xp-dragging');
        st.rect.left = parseInt(st.el.style.left, 10); st.rect.top = parseInt(st.el.style.top, 10);
    };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
    e.preventDefault();
}
/* Redimensionar */
function startResize(e, id, dir) {
    if (e.button !== 0 || isMobile()) return;
    const st = WINDOWS.get(id);
    if (!st || st.maximized) return;
    focusWindow(id);
    const startX = e.clientX, startY = e.clientY;
    const r = { ...st.rect };
    const minW = st.app.minWidth || 300, minH = st.app.minHeight || 160;
    const move = ev => {
        const dx = ev.clientX - startX, dy = ev.clientY - startY;
        let { left, top, width, height } = r;
        if (dir.includes('e')) width = Math.max(minW, r.width + dx);
        if (dir.includes('s')) height = Math.max(minH, r.height + dy);
        if (dir.includes('w')) { width = Math.max(minW, r.width - dx); left = r.left + (r.width - width); }
        if (dir.includes('n')) { height = Math.max(minH, r.height - dy); top = Math.max(0, r.top + (r.height - height)); }
        Object.assign(st.el.style, { left: left + 'px', top: top + 'px', width: width + 'px', height: height + 'px' });
        Object.assign(st.rect, { left, top, width, height });
    };
    const up = () => {
        document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up);
        st.app.onResize && st.app.onResize(st);
    };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
    e.preventDefault(); e.stopPropagation();
}

/* ═══════════════════════════════ START MENU ═══════════════════════════════ */
let startCfg = { left: [], right: [], all: [] };
function startMenu(cfg) { startCfg = cfg; renderStartMenu(); }
function renderStartMenu() {
    const sm = $('#xp-startmenu');
    if (!sm) return;
    const item = (it, right) => {
        const b = el('button', { class: 'xp-sm-item', type: 'button', onclick: () => { closeStartMenu(); it.action(); } });
        b.append(el('img', { src: ICON(it.icon, right ? 32 : 32), alt: '' }));
        const txt = el('span');
        txt.append(el('b', {}, it.label()));
        if (it.sub && !right) txt.append(el('small', {}, it.sub()));
        b.append(txt);
        return b;
    };
    const left = el('div', { class: 'xp-sm-left' });
    startCfg.left.forEach((it, i) => { if (it === 'sep') left.append(el('div', { class: 'xp-sm-sep' })); else left.append(item(it, false)); });
    left.append(el('div', { class: 'xp-sm-spacer' }));
    const all = el('div', { class: 'xp-sm-allprogs' });
    const allBtn = el('button', { class: 'xp-sm-item', type: 'button', onclick: e => { e.stopPropagation(); toggleSubmenu(allBtn); } });
    allBtn.append(el('b', {}, s('sm_allprogs')), el('img', { src: ICON('run', 16), alt: '' }));
    all.append(allBtn); left.append(all);
    const right = el('div', { class: 'xp-sm-right' });
    startCfg.right.forEach(it => { if (it === 'sep') right.append(el('div', { class: 'xp-sm-sep' })); else right.append(item(it, true)); });
    const body = $('.xp-sm-body', sm); body.replaceChildren(left, right);
    $('.xp-sm-head span', sm).textContent = s('logon_user');
    $('#xp-sm-logoff span', sm).textContent = s('sm_logoff');
    $('#xp-sm-shutdown span', sm).textContent = s('sm_shutdown');
    // submenu
    const sub = $('#xp-submenu');
    sub.replaceChildren(...startCfg.all.map(it => it === 'sep' ? el('hr') : (() => {
        const b = el('button', { class: 'xp-sm-item', type: 'button', onclick: () => { closeStartMenu(); it.action(); } });
        b.append(el('img', { src: ICON(it.icon, 16), alt: '' }), el('span', {}, it.label()));
        return b;
    })()));
}
function toggleSubmenu(anchor) {
    const sub = $('#xp-submenu');
    const open = !sub.classList.contains('open');
    sub.classList.toggle('open', open);
    if (open) {
        const r = anchor.getBoundingClientRect();
        sub.style.left = Math.min(r.right - 4, window.innerWidth - sub.offsetWidth - 4) + 'px';
        sub.style.top = Math.max(4, r.bottom - sub.offsetHeight) + 'px';
        sound('menu', 0.3);
    }
}
function openStartMenu() { renderStartMenu(); $('#xp-startmenu').classList.add('open'); $('#xp-start').classList.add('open'); $('#xp-start').setAttribute('aria-expanded', 'true'); sound('menu', 0.3); }
function closeStartMenu() {
    $('#xp-startmenu')?.classList.remove('open'); $('#xp-submenu')?.classList.remove('open');
    $('#xp-start')?.classList.remove('open'); $('#xp-start')?.setAttribute('aria-expanded', 'false');
}
function toggleStartMenu() { $('#xp-startmenu').classList.contains('open') ? closeStartMenu() : openStartMenu(); }

/* ═══════════════════════════════ DESKTOP ═══════════════════════════════ */
let iconCfg = [];
function desktopIcons(list) { iconCfg = list; renderIcons(); }
function renderIcons() {
    const wrap = $('#xp-icons');
    if (!wrap) return;
    wrap.replaceChildren(...iconCfg.filter(i => !i.bottomRight).map(makeIcon));
    $('#xp-icons-br').replaceChildren(...iconCfg.filter(i => i.bottomRight).map(makeIcon));
}
function makeIcon(it) {
    const b = el('button', { class: 'xp-desktop-icon', type: 'button', 'data-id': it.id, title: it.tip ? it.tip() : '' });
    const ic = el('span', { class: 'ic' });
    ic.append(el('img', { src: ICON(it.icon, 48), alt: '' }));
    b.append(ic, el('span', {}, it.label()));
    let lastTap = 0;
    b.addEventListener('click', e => {
        $$('.xp-desktop-icon.selected').forEach(x => x.classList.remove('selected'));
        b.classList.add('selected');
        const now = Date.now();
        const single = isMobile() || (e.pointerType === 'touch');
        if (single || now - lastTap < 450) { it.action(); lastTap = 0; } else lastTap = now;
    });
    b.addEventListener('keydown', e => { if (e.key === 'Enter') it.action(); });
    return b;
}

/* Balão da bandeja */
let balloonTimer = null;
function balloon({ title, text, icon = 'info', link = null, onclick = null, timeout = 9000 }) {
    $('.xp-balloon')?.remove();
    const b = el('div', { class: 'xp-balloon', role: 'status' });
    const head = el('div', { class: 'xp-balloon-head' });
    head.append(el('img', { src: ICON(icon, 16), alt: '' }), el('span', {}, title));
    b.append(el('button', { class: 'xp-balloon-close', type: 'button', 'aria-label': 'Fechar', onclick: e => { e.stopPropagation(); b.remove(); } }, '✕'));
    b.append(head, el('div', {}, text));
    if (link) b.append(el('div', { style: 'margin-top:6px' }, `<a href="${link.href}" target="_blank" rel="noopener noreferrer">${link.label}</a>`));
    if (onclick) { b.style.cursor = 'pointer'; b.addEventListener('click', () => { onclick(); b.remove(); }); }
    document.body.append(b);
    sound('balloon', 0.5);
    clearTimeout(balloonTimer);
    balloonTimer = setTimeout(() => b.remove(), timeout);
}

/* Menu de contexto da área de trabalho */
function showContext(x, y, items) {
    const m = $('#xp-ctx');
    m.replaceChildren(...items.map(it => it === 'sep' ? el('hr') : el('button', { type: 'button', onclick: () => { hideContext(); it.action(); } }, it.bold ? `<b>${it.label}</b>` : it.label)));
    m.classList.add('open');
    m.style.left = Math.min(x, window.innerWidth - m.offsetWidth - 4) + 'px';
    m.style.top = Math.min(y, window.innerHeight - m.offsetHeight - 34) + 'px';
}
function hideContext() { $('#xp-ctx')?.classList.remove('open'); }

/* Relógio */
function tickClock() {
    const c = $('#xp-clock');
    if (!c) return;
    const d = new Date();
    c.textContent = d.toLocaleTimeString(lang() === 'en' ? 'en-US' : 'pt-BR', { hour: '2-digit', minute: '2-digit' });
    c.title = d.toLocaleDateString(lang() === 'en' ? 'en-US' : 'pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

/* ═══════════════════════════════ BOOT / LOGON / SHUTDOWN ═══════════════════════════════ */
function applyShellI18n() {
    $$('[data-xps]').forEach(e => { e.textContent = s(e.dataset.xps); });
    $$('[data-xps-title]').forEach(e => { e.title = s(e.dataset.xpsTitle); e.setAttribute('aria-label', e.title); });
    const lb = $('#xp-tray-lang'); if (lb) { lb.textContent = lang().toUpperCase(); lb.title = s(lang() === 'en' ? 'tray_lang_en' : 'tray_lang'); lb.setAttribute('aria-label', lb.title); }
    setSound(soundEnabled);
    renderIcons(); renderStartMenu(); tickClock();
    WINDOWS.forEach(st => setTitle(st.id, st.app.title()));
}

function showBoot(then) {
    const boot = $('#xp-boot');
    boot.hidden = false;
    let done = false;
    const finish = () => { if (done) return; done = true; boot.classList.add('fade-out'); setTimeout(() => { boot.hidden = true; then(); }, 450); };
    $('#xp-boot-skip').onclick = finish;
    setTimeout(finish, 3400);
}
function showLogon(then) {
    const lg = $('#xp-logon');
    lg.hidden = false; lg.classList.remove('fade-out');
    const tile = $('#xp-user-tile');
    tile.onclick = () => {
        tile.classList.add('active');
        $('.hint', tile).textContent = s('logon_loading');
        sound('startup', 0.7);
        setTimeout(() => { lg.classList.add('fade-out'); setTimeout(() => { lg.hidden = true; then(); }, 500); }, 1200);
    };
    $('#xp-logon-off').onclick = () => openShutdown();
    setTimeout(() => tile.focus(), 50);
}
function openShutdown() {
    const o = $('#xp-shutdown-overlay');
    o.classList.add('open');
    closeStartMenu();
    sound('exclamation', 0.4);
    $('#xp-sd-cancel').focus();
}
function closeShutdown() { $('#xp-shutdown-overlay').classList.remove('open'); }
function logoff() {
    closeStartMenu();
    sound('logoff', 0.7);
    [...WINDOWS.keys()].forEach(closeWindow);
    setTimeout(() => showLogon(() => enterDesktop(false)), 400);
}
function bsod() {
    closeShutdown();
    sound('critical', 0.6);
    const b = $('#xp-bsod');
    b.innerHTML = ['bsod_1', 'bsod_2', 'bsod_3', 'bsod_4', 'bsod_5'].map(k => `<p>${s(k).replace(/\n/g, '<br>')}</p>`).join('');
    b.hidden = false;
    const restart = () => { b.hidden = true; document.removeEventListener('keydown', restart); b.removeEventListener('click', restart); store.set('xp_force_boot', '1'); location.hash = ''; location.reload(); };
    setTimeout(() => { document.addEventListener('keydown', restart); b.addEventListener('click', restart); }, 800);
}
function restart() { closeShutdown(); sound('shutdown', 0.7); store.set('xp_force_boot', '1'); setTimeout(() => { location.hash = ''; location.reload(); }, 900); }

function enterDesktop(firstTime) {
    $('#xp-desktop').hidden = false; $('#xp-taskbar').hidden = false;
    store.set('xp_seen', '1');
    document.dispatchEvent(new CustomEvent('xp:desktop', { detail: { firstTime } }));
}

/* ═══════════════════════════════ INIT ═══════════════════════════════ */
function init() {
    setTheme(store.get('xp_theme', 'blue'));
    const wp = store.get('xp_wallpaper', 'bliss'); setWallpaper(wp, store.get('xp_wallpaper_mode', 'cover'));

    $('#xp-start').addEventListener('click', e => { e.stopPropagation(); toggleStartMenu(); });
    document.addEventListener('pointerdown', e => {
        if (!e.target.closest('#xp-startmenu, #xp-start, #xp-submenu')) closeStartMenu();
        if (!e.target.closest('#xp-ctx')) hideContext();
        if (!e.target.closest('.xp-desktop-icon, .xp-window')) $$('.xp-desktop-icon.selected').forEach(x => x.classList.remove('selected'));
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeStartMenu(); hideContext(); closeShutdown(); const st = activeId && WINDOWS.get(activeId); if (st && st.app.dialog) closeWindow(activeId); }
    });
    $('#xp-desktop').addEventListener('contextmenu', e => {
        if (e.target.closest('.xp-window')) return;
        e.preventDefault();
        showContext(e.clientX, e.clientY, [
            { label: s('ctx_arrange'), action: renderIcons },
            { label: s('ctx_refresh'), action: () => { renderIcons(); sound('ding', .3); } },
            'sep',
            { label: s('ctx_props'), bold: true, action: () => openWindow('display') },
        ]);
    });
    $('#xp-tray-sound').addEventListener('click', () => { setSound(!soundEnabled); if (soundEnabled) sound('ding', .5); });
    $('#xp-tray-lang').addEventListener('click', () => { if (window.setLang) window.setLang(lang() === 'pt' ? 'en' : 'pt'); });
    $('#xp-sm-logoff').addEventListener('click', logoff);
    $('#xp-sm-shutdown').addEventListener('click', openShutdown);
    $('#xp-sd-cancel').addEventListener('click', closeShutdown);
    $('#xp-sd-off').addEventListener('click', bsod);
    $('#xp-sd-restart').addEventListener('click', restart);
    $('#xp-sd-standby').addEventListener('click', () => { closeShutdown(); balloon({ title: s('sd_standby'), text: s('standby_hint'), icon: 'info' }); });
    $('#xp-ql-desktop').addEventListener('click', () => { WINDOWS.forEach(st => { if (!st.minimized) minimizeWindow(st.id); }); });
    $('#xp-shutdown-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeShutdown(); });
    window.addEventListener('resize', () => WINDOWS.forEach(st => st.app.onResize && st.app.onResize(st)));
    tickClock(); setInterval(tickClock, 15000);
    applyShellI18n();
    // No celular, painéis de tarefas começam recolhidos (exceto o primeiro) para sobrar espaço ao conteúdo
    new MutationObserver(() => {
        if (!isMobile()) return;
        $$('#xp-windows .xp-taskpane .xp-tp-box:not(:first-child):not([data-auto])').forEach(b => { b.classList.add('closed'); b.dataset.auto = '1'; });
    }).observe($('#xp-windows'), { childList: true, subtree: true });

    const forceBoot = store.get('xp_force_boot') === '1';
    if (forceBoot) store.set('xp_force_boot', '0');
    const seen = store.get('xp_seen') === '1' && !forceBoot;
    if (seen) { $('#xp-boot').hidden = true; enterDesktop(false); }
    else showBoot(() => showLogon(() => enterDesktop(true)));
}

window.XP = {
    init, registerApp, openWindow, closeWindow, focusWindow, minimizeWindow, toggleMaximize, setTitle,
    startMenu, desktopIcons, balloon, sound, setSound, get soundEnabled() { return soundEnabled; },
    setTheme, setWallpaper, THEMES, applyShellI18n, s, el, $, $$, store, isMobile, ICON, openShutdown, logoff,
    get windows() { return WINDOWS; }, get activeId() { return activeId; }, showContext,
};
})();
