/* ═══════════════════════════════════════════════════════════════════════════
   JORNADA XP — extras.js
   Easter eggs e utilitários: Ajuda, Executar, LEIA-ME, Lixeira, Campo Minado.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
'use strict';
const { el, ICON } = XP;
const T = key => (typeof t === 'function' ? t(key) : key);

/* ─── Ajuda e suporte ─── */
XP.registerApp('help', {
    title: () => T('win_help'), icon: 'help', width: 620, height: 480,
    render(client) {
        const legend = ['legend_z', 'legend_nz', 'legend_eb', 'legend_p'].map((k, i) => `<li><span class="s-dot ${['zerado', 'nao-zerado', 'em-breve', 'pendente'][i]}"></span>${T(k)}</li>`).join('');
        client.innerHTML = `
        <div class="help-head"><img src="${ICON('help', 32)}" alt=""><b>${T('help_title')}</b></div>
        <div class="xp-explorer help">
            <aside class="xp-taskpane"><div class="xp-tp-box"><button type="button" class="xp-tp-head">${T('m_help')}</button><div class="xp-tp-body">
                ${[1, 2, 3, 4, 5].map(i => `<button type="button" class="xp-tp-link" data-q="${i}"><img src="${ICON('question', 16)}" alt="">${T('help_q' + i)}</button>`).join('')}
            </div></div></aside>
            <section class="xp-body pad help-body">
                ${[1, 2, 3, 4, 5].map(i => `<details id="help-${i}" ${i === 1 ? 'open' : ''}><summary>${T('help_q' + i)}</summary><div>${i === 1 ? `<ul class="help-legend">${legend}</ul>` : `<p>${T('help_a' + i)}</p>`}</div></details>`).join('')}
            </section>
        </div>`;
        client.querySelectorAll('[data-q]').forEach(b => b.addEventListener('click', () => { const d = client.querySelector('#help-' + b.dataset.q); d.open = true; d.scrollIntoView({ block: 'start', behavior: 'smooth' }); }));
    },
});

/* ─── Executar… ─── */
const RUN_MAP = { jornada: 'jornada', journey: 'jornada', ranking: 'ranking', hall: 'ranking', 'hall of fame': 'ranking', loja: 'shop', shop: 'shop', membros: 'members', members: 'members', discord: 'discord', comunidade: 'discord', recomendador: 'recommend', 'me indica': 'recommend', indica: 'recommend', plataformas: 'platforms', platforms: 'platforms', 'meu computador': 'platforms', generos: 'genres', 'gêneros': 'genres', genres: 'genres', ajuda: 'help', help: 'help', sobre: 'about', about: 'about', winver: 'about', campo: 'minesweeper', 'campo minado': 'minesweeper', minesweeper: 'minesweeper', winmine: 'minesweeper', lixeira: 'recycle', 'recycle': 'recycle', leiame: 'readme', 'leia-me': 'readme', readme: 'readme', notepad: 'readme', desktop: 'display', tema: 'display', display: 'display', 'propriedades': 'display', inicio: 'welcome', welcome: 'welcome', 'bem-vindo': 'welcome' };
XP.registerApp('run', {
    title: () => T('sm_run').replace('…', ''), icon: 'run', width: 380, height: 190, dialog: true,
    render(client) {
        client.innerHTML = `<form class="xp-dialog-body run"><div class="xp-dialog-row"><img src="${ICON('run', 32)}" alt=""><div><label for="run-input">${T('run_label')}</label><input id="run-input" type="text" autocomplete="off" placeholder="${T('run_hint')}"><p class="muted" id="run-msg" style="min-height:14px;margin:4px 0 0"></p></div></div></form>
        <div class="xp-dialog-actions"><button type="button" data-ok>OK</button><button type="button" data-cancel>${T('btn_cancel')}</button></div>`;
        const input = client.querySelector('#run-input'), msg = client.querySelector('#run-msg');
        const go = () => {
            const v = input.value.trim().toLowerCase();
            const app = RUN_MAP[v] || (v.startsWith('#') && RUN_MAP[v.slice(1)]);
            if (app) { XP.closeWindow('run'); XP.openWindow(app); }
            else if (/^https?:\/\//.test(input.value.trim())) { window.open(input.value.trim(), '_blank', 'noopener'); XP.closeWindow('run'); }
            else if (v) { msg.textContent = `"${input.value.trim()}" ${T('run_notfound')}`; XP.sound('error', .5); }
        };
        client.querySelector('form').addEventListener('submit', e => { e.preventDefault(); go(); });
        client.querySelector('[data-ok]').addEventListener('click', go);
        client.querySelector('[data-cancel]').addEventListener('click', () => XP.closeWindow('run'));
        setTimeout(() => input.focus(), 50);
    },
});

/* ─── LEIA-ME.txt (Bloco de notas) ─── */
XP.registerApp('readme', {
    title: () => `${T('win_readme')} - ${XP.s('lang') === 'en' ? 'Notepad' : 'Bloco de notas'}`, icon: 'notepad', width: 560, height: 460,
    render(client) {
        client.innerHTML = `<div class="xp-menubar"><button type="button">${T('m_file')}</button><button type="button">${T('m_edit')}</button><button type="button">${T('m_help')}</button></div>
        <textarea class="notepad" readonly spellcheck="false">${T('readme_body')}</textarea>`;
    },
});

/* ─── Lixeira ─── */
XP.registerApp('recycle', {
    title: () => T('recycle'), icon: 'recycle-empty', width: 560, height: 380,
    render(client) {
        client.innerHTML = `<div class="xp-menubar"><button type="button">${T('m_file')}</button><button type="button">${T('m_view')}</button><button type="button">${T('m_help')}</button><img class="xp-menubar-logo" src="${ICON('flag', 16)}" alt=""></div>
        <div class="xp-explorer"><aside class="xp-taskpane"><div class="xp-tp-box"><button type="button" class="xp-tp-head">${T('tp_tasks')}</button><div class="xp-tp-body"><button type="button" class="xp-tp-link" data-empty><img src="${ICON('recycle-empty', 16)}" alt="">${XP.s('lang') === 'en' ? 'Empty the Recycle Bin' : 'Esvaziar a Lixeira'}</button></div></div></aside>
        <section class="xp-body pad recycle"><img src="${ICON('recycle-empty', 48)}" alt=""><p>${T('recycle_empty')}</p><p class="muted">${T('recycle_hint')}</p></section></div>
        <div class="xp-statusbar"><span>0 ${T('d_jogos')}</span></div>`;
        client.querySelector('[data-empty]').addEventListener('click', () => XP.sound('recycle', .6));
    },
});

/* ─── Campo Minado ─── */
XP.registerApp('minesweeper', {
    title: () => T('game_minesweeper'), icon: 'gamepad', width: 300, height: 400, noMax: true, pane: true,
    render(client, st) {
        const W = 9, H = 9, M = 10;
        const s = st.state = { cells: [], over: false, won: false, started: false, time: 0, timer: null, flags: 0 };
        const idx = (x, y) => y * W + x;
        const neighbors = (x, y) => { const r = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const nx = x + dx, ny = y + dy; if (nx >= 0 && ny >= 0 && nx < W && ny < H) r.push([nx, ny]); } return r; };
        const reset = () => {
            clearInterval(s.timer); s.over = s.won = s.started = false; s.time = 0; s.flags = 0;
            s.cells = Array.from({ length: W * H }, () => ({ mine: false, open: false, flag: false, n: 0 }));
            let placed = 0; while (placed < M) { const i = Math.floor(Math.random() * W * H); if (!s.cells[i].mine) { s.cells[i].mine = true; placed++; } }
            for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) s.cells[idx(x, y)].n = neighbors(x, y).filter(([a, b]) => s.cells[idx(a, b)].mine).length;
            draw();
        };
        const open = (x, y) => {
            const c = s.cells[idx(x, y)];
            if (c.open || c.flag || s.over) return;
            if (!s.started) { s.started = true; s.timer = setInterval(() => { s.time = Math.min(999, s.time + 1); client.querySelector('.ms-time').textContent = String(s.time).padStart(3, '0'); }, 1000); }
            c.open = true;
            if (c.mine) { s.over = true; clearInterval(s.timer); s.cells.forEach(k => { if (k.mine) k.open = true; }); XP.sound('critical', .5); draw(); XP.balloon({ title: T('game_minesweeper'), text: T('ms_lose'), icon: 'gamepad' }); return; }
            if (c.n === 0) neighbors(x, y).forEach(([a, b]) => open(a, b));
            if (s.cells.filter(k => !k.open).length === M) { s.over = s.won = true; clearInterval(s.timer); XP.sound('tada', .6); XP.balloon({ title: T('game_minesweeper'), text: T('ms_win'), icon: 'star' }); }
            draw();
        };
        const flag = (x, y) => { const c = s.cells[idx(x, y)]; if (c.open || s.over) return; c.flag = !c.flag; s.flags += c.flag ? 1 : -1; draw(); };
        const COLORS = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000', '#808080'];
        const draw = () => {
            const face = s.over ? (s.won ? '😎' : '😵') : '🙂';
            client.innerHTML = `<div class="xp-menubar"><button type="button" data-new>${XP.s('lang') === 'en' ? 'Game' : 'Jogo'}</button><button type="button" data-help>${T('m_help')}</button></div>
            <div class="ms">
                <div class="ms-top"><span class="ms-led">${String(Math.max(0, M - s.flags)).padStart(3, '0')}</span><button type="button" class="ms-face" data-new aria-label="${T('ms_new')}">${face}</button><span class="ms-led ms-time">${String(s.time).padStart(3, '0')}</span></div>
                <div class="ms-grid" style="grid-template-columns:repeat(${W},20px)">${s.cells.map((c, i) => {
                    let cls = 'ms-cell', txt = '';
                    if (c.open) { cls += ' open'; if (c.mine) { cls += ' mine'; txt = '●'; } else if (c.n) txt = `<b style="color:${COLORS[c.n]}">${c.n}</b>`; }
                    else if (c.flag) txt = '<span class="ms-flag">▶</span>';
                    return `<button type="button" class="${cls}" data-i="${i}">${txt}</button>`;
                }).join('')}</div>
                <p class="muted ms-hint">${XP.s('lang') === 'en' ? 'Left click: open · Right click / long press: flag' : 'Clique: abrir · Botão direito / toque longo: bandeira'}</p>
            </div>`;
            client.querySelectorAll('[data-new]').forEach(b => b.addEventListener('click', reset));
            client.querySelector('[data-help]').addEventListener('click', () => XP.openWindow('help'));
            client.querySelectorAll('.ms-cell').forEach(b => {
                const i = +b.dataset.i, x = i % W, y = Math.floor(i / W);
                let press;
                b.addEventListener('click', () => open(x, y));
                b.addEventListener('contextmenu', e => { e.preventDefault(); flag(x, y); });
                b.addEventListener('touchstart', () => { press = setTimeout(() => { flag(x, y); press = null; }, 450); }, { passive: true });
                b.addEventListener('touchend', e => { if (press) { clearTimeout(press); } else e.preventDefault(); });
            });
        };
        reset();
    },
    onClose(st) { clearInterval(st.state && st.state.timer); },
});

/* Atalho de idioma no shell para os títulos acima */
const _s = XP.s;
XP.s = (k, v) => k === 'lang' ? (document.documentElement.lang === 'en' ? 'en' : 'pt') : _s(k, v);
})();
