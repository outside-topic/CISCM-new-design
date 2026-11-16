
const tabs = [...document.querySelectorAll('[data-tab]')];
function selectTab(id, focus = false) { tabs.forEach(t => { const on = t.dataset.tab === id; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; document.getElementById('panel-' + t.dataset.tab).hidden = !on; if (on && focus) t.focus() }) }
tabs.forEach((tab, i) => { tab.addEventListener('click', () => selectTab(tab.dataset.tab)); tab.addEventListener('keydown', e => { let n; if (e.key === 'ArrowRight') n = (i + 1) % tabs.length; if (e.key === 'ArrowLeft') n = (i + tabs.length - 1) % tabs.length; if (e.key === 'Home') n = 0; if (e.key === 'End') n = tabs.length - 1; if (n !== undefined) { e.preventDefault(); selectTab(tabs[n].dataset.tab, true) } }) });
document.querySelectorAll('[data-credential]').forEach(link => link.addEventListener('click', () => selectTab(link.dataset.credential)));
