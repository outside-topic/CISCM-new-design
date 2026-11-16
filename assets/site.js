
(() => {
    const menu = document.querySelector('.site-menu'), nav = document.querySelector('.site-links');
    menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open) });
    document.querySelectorAll('.nav-group').forEach(g => g.addEventListener('toggle', () => { if (g.open) document.querySelectorAll('.nav-group').forEach(o => { if (o !== g) o.open = false }) }));
    document.addEventListener('click', e => { document.querySelectorAll('.nav-group[open]').forEach(g => { if (!g.contains(e.target)) g.open = false }) });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { document.querySelectorAll('.nav-group[open]').forEach(g => g.open = false); if (nav.classList.contains('open')) { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.focus() } } });
    document.querySelectorAll('.draft-form').forEach(form => {
        const result = form.querySelector('.draft-result'), pre = form.querySelector('.draft-text'); let draft = '';
        form.addEventListener('submit', e => {
            e.preventDefault(); if (!form.reportValidity()) return; const lines = ['CISCM ' + form.dataset.kind + ' — draft', 'Prepared locally; not submitted.', ''];
            form.querySelectorAll('input,select,textarea').forEach(input => { const label = form.querySelector('label[for="' + input.id + '"]'); const title = label ? Array.from(label.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent).join('').replace(/\s*\*\s*$/, '').trim() : input.name; const value = input.type === 'file' ? (input.files.length ? Array.from(input.files).map(f => f.name).join(', ') + ' (attach manually; not uploaded)' : 'Not selected') : input.value.trim(); if (value) lines.push(title + ': ' + value) });
            lines.push('', 'Please confirm the applicable requirements and formal submission route.'); draft = lines.join('\n'); pre.textContent = draft; result.hidden = false;
            form.querySelector('.draft-email').href = 'mailto:info@ciscm.us?subject=' + encodeURIComponent('CISCM ' + form.dataset.kind) + '&body=' + encodeURIComponent(draft); result.focus();
        });
        form.querySelector('.draft-download').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([draft], { type: 'text/plain;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = 'CISCM_' + form.dataset.kind.replace(/\s+/g, '_') + '_Draft.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000) });
        form.addEventListener('reset', () => { result.hidden = true; pre.textContent = ''; draft = '' });
    });
})();
