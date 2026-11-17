/* Landing guest arrival prototype: shell.
   Screens register themselves with reg(id, def) from screens-a.js and screens-b.js.
   Everything is simulated: no network, no messages, no calls, no locks. */

// ---------- State ----------
const DEFAULT = {
  page: 'launch',            // launch | home | stays | hub | sms | email
  sheets: [],                // stack of open sheet ids, last is on top
  time: '9:41',
  low: false,                // battery at 12%
  stage: 'before',           // before | ready | inside | settled
  codesReleased: false,      // codes visible (2:30 PM)
  codesActive: false,        // codes work (3 PM)
  saved: 'none',             // none | saving | saved | error
  savedWithCodes: false,     // whether the saved copy included codes
  offline: false,
  parkingInReservation: false,
  parkingOpen: false,
  replacementSupported: true,
  guideView: 'overview',     // overview | steps
  route: 'gate',             // gate | garage
  step: 0,                   // index in the current route's steps
  gateCode: '4827',
  codeReplaced: false,
  helpContext: null,         // null (general) | 'gate' | 'garage' | 'door' | ...
  helpView: 'options',       // options | entrance | keypad
  tried: { resend: false, entrance: false },
  description: '',           // guest's words, carried into the handoff
  chat: [],                  // scripted assistant conversation
  issueType: 'gate',         // gate | ac
  support: null,             // null | sending | failed | received | assigned | next | code | resolved
  supportTimes: {},
  wifiCopied: false,
  allGood: false,
  smsVariant: 'arrival',     // arrival | replacement
  toast: null,
};
let S = structuredClone(DEFAULT);
const screens = {};          // id -> { kind: 'page' | 'sheet', partial?, dark?, render(S) }
const actions = {};          // name -> fn(el, event)
let animate = null;          // sheet id to animate in on next render

function reg(id, def) { screens[id] = def; }
function set(patch) { Object.assign(S, patch); render(); }
function go(page, patch) { S.page = page; S.sheets = []; if (patch) Object.assign(S, patch); render(); }
function openSheet(id, patch) {
  if (patch) Object.assign(S, patch);
  if (S.sheets[S.sheets.length - 1] !== id) { S.sheets.push(id); animate = id; }
  render();
}
function closeSheet() { S.sheets.pop(); render(); }
function closeAll() { S.sheets = []; render(); }
function replaceSheet(id, patch) { S.sheets.pop(); openSheet(id, patch); }
function toast(msg, ms = 1800) { S.toast = msg; render(); clearTimeout(toast.t); toast.t = setTimeout(() => { S.toast = null; render(); }, ms); }
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------- Icons (20x20, 1.6 stroke) ----------
const ICON = {
  back: '<path d="M12 5l-5 5 5 5"/>', chevR: '<path d="M8 5l5 5-5 5"/>', chevD: '<path d="M5 8l5 5 5-5"/>', chevU: '<path d="M5 12l5-5 5 5"/>',
  arrow: '<path d="M4 10h12M11 5l5 5-5 5"/>',
  key: '<circle cx="7" cy="13.2" r="3.2"/><path d="M9.300 10.900l7.200-7.200M13.700 6.300l2.300 2.300M11.400 8.600l1.800 1.800"/>',
  wifi: '<path d="M2.700 8.200a11 11 0 0 1 14.600 0M5.500 11.400a6.800 6.800 0 0 1 9 0M8.200 14.500a2.700 2.700 0 0 1 3.600 0"/>',
  chat: '<path d="M3.600 5h12.800v8.600H9.100l-3.600 2.700v-2.700H3.600z"/>',
  search: '<circle cx="9" cy="9" r="5.500"/><path d="M13.500 13.500L17 17"/>',
  home: '<path d="M3.500 9L10 3.500 16.500 9v7.500h-13z"/>',
  account: '<circle cx="10" cy="10" r="7"/><circle cx="10" cy="8.200" r="2.300"/><path d="M5.500 15.200c1-2 2.600-2.900 4.500-2.900s3.500.9 4.500 2.900"/>',
  lock: '<rect x="3.600" y="9.100" width="12.800" height="8.200" rx="2.300"/><path d="M6.800 9.100V6.800a3.200 3.200 0 0 1 6.400 0v2.300"/>',
  unlock: '<rect x="3.600" y="9.100" width="12.800" height="8.200" rx="2.300"/><path d="M6.800 9.100V6.800a3.200 3.200 0 0 1 6.100-1.300"/>',
  check: '<path d="M4.500 10.400l3.800 3.800 7.200-7.900"/>',
  checkCircle: '<circle cx="10" cy="10" r="7.300"/><path d="M6.800 10.300l2.200 2.200 4.200-4.600"/>',
  clock: '<circle cx="10" cy="10" r="7.300"/><path d="M10 6v4.300l2.700 1.600"/>',
  person: '<circle cx="10" cy="6.500" r="3"/><path d="M4 17c.6-3.300 3-5 6-5s5.400 1.700 6 5"/>',
  personPlus: '<circle cx="7.700" cy="6.800" r="2.700"/><path d="M2.700 16.400c.5-2.700 2.500-4.100 5-4.100s4.500 1.400 5 4.100M15.500 6.400v5.400M12.800 9.100h5.400"/>',
  phone: '<path d="M4 3.500h3l1.500 4-2 1.300a9 9 0 0 0 4.700 4.700l1.300-2 4 1.500v3a1.500 1.500 0 0 1-1.600 1.500C8.500 17 3 11.500 2.500 5.100A1.500 1.500 0 0 1 4 3.500z"/>',
  car: '<path d="M3.500 11.500l1.300-3.900A2 2 0 0 1 6.700 6.200h6.600a2 2 0 0 1 1.900 1.400l1.300 3.900v3.700h-13z"/><path d="M5.500 15.200v1.300M14.500 15.200v1.300M6.300 12.600h.1M13.700 12.600h.1"/>',
  help: '<circle cx="10" cy="10" r="7"/><path d="M8 8a2 2 0 1 1 3 1.700c-.6.400-1 .8-1 1.500M10 14v.1"/>',
  photo: '<rect x="2.700" y="4.500" width="14.600" height="11" rx="2.300"/><circle cx="7.300" cy="8.600" r="1.400"/><path d="M3.600 14.100l4.100-3.200 2.700 2 2.700-2.700 3.600 3"/>',
  keypad: '<rect x="4.500" y="2.300" width="11" height="15.400" rx="2.300"/><path d="M7.700 6.400h.1M10 6.400h.1M12.300 6.400h.1M7.700 9.500h.1M10 9.500h.1M12.300 9.500h.1M7.700 12.700h.1M10 12.700h.1M12.300 12.700h.1"/>',
  pencil: '<path d="M3.600 15.900l.9-3.600L13.200 3.600l3.200 3.200-8.700 8.700zM11.400 5.500l3.200 3.200"/>',
  download: '<path d="M10 3.500v9M6.500 9l3.500 3.500L13.500 9M4 16.500h12"/>',
  offline: '<path d="M2.700 8.200a11 11 0 0 1 14.600 0M5.500 11.400a6.800 6.800 0 0 1 9 0M8.200 14.500a2.700 2.700 0 0 1 3.600 0M3.600 2.700l12.800 14.600"/>',
  alert: '<circle cx="10" cy="10" r="7.300"/><path d="M10 6.200v4.400M10 13.500v.1"/>',
  camera: '<rect x="2.700" y="5.500" width="14.600" height="10.900" rx="2.300"/><circle cx="10" cy="10.900" r="2.700"/><path d="M7.300 5.500l.9-1.800h3.600l.9 1.800"/>',
  refresh: '<path d="M16 10a6 6 0 1 1-1.800-4.300M16 3.500v3h-3"/>',
  send: '<path d="M10 16V4M5 9l5-5 5 5"/>',
  pin: '<path d="M10 17.500s5.500-4.700 5.500-9a5.500 5.500 0 0 0-11 0c0 4.300 5.500 9 5.500 9z"/><circle cx="10" cy="8.500" r="2"/>',
};
function icon(name, size = 20, color = 'currentColor', sw = 1.6) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">${ICON[name] || ''}</svg>`;
}
const sparkle = (size = 16) => `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="var(--blue)" style="flex-shrink:0"><path d="M8 1l1.600 4.400L14 7l-4.400 1.600L8 13l-1.600-4.400L2 7l4.400-1.600z"/></svg>`;

// ---------- Shared pieces screens can use ----------
function backBtn(attrs = 'data-act="closeSheet"') { return `<button class="backbtn" aria-label="Back" ${attrs}>${icon('back')}</button>`; }
function sheetHead(title = '', attrs) { return `<div class="sheet-head">${backBtn(attrs)}<div class="title">${esc(title)}</div><div class="spacer"></div></div>`; }
function nav(active) {
  const tab = (id, label, ic, attr) => `<button class="${active === id ? 'on' : ''}" ${attr}>${icon(ic)}<span>${label}</span></button>`;
  return `<div class="nav"><div class="bar">
    ${tab('search', 'Search', 'search', 'data-go="home"')}
    ${tab('stays', 'Stays', 'home', 'data-go="stays"')}
    ${tab('help', 'Help', 'chat', 'data-act="openHelp"')}
    ${tab('account', 'Account', 'account', 'data-act="notInDemo"')}
  </div></div>`;
}
// Read-only credential card. key: '#' | 'check'. status: html for the top-right slot.
function credCard({ label, code, key = '#', status = '', note = '', size = '' }) {
  const k = key === 'check' ? `<span class="key">${icon('check', size === 'md' ? 28 : 40, 'var(--ink)', 1.8)}</span>` : `<span class="key">#</span>`;
  return `<div class="card cred"><div class="top"><span>${esc(label)}</span><span class="status">${status}</span></div>
    <div class="code ${size}"><span>${esc(code)}</span>${k}</div>${note ? `<div class="small" style="font-size:15px;line-height:22px">${note}</div>` : ''}</div>`;
}
const statusOk = t => `${icon('checkCircle', 16, 'var(--ok)', 1.75)}<span style="color:var(--ok)">${t}</span>`;
const statusMuted = (t, ic = 'clock') => `${icon(ic, 16, 'var(--muted)', 1.75)}<span>${t}</span>`;
const statusBlue = t => `${icon('checkCircle', 16, 'var(--blue)', 1.75)}<span style="color:var(--blue)">${t}</span>`;

// ---------- Core actions ----------
Object.assign(actions, {
  closeSheet, closeAll,
  notInDemo() { toast('Not part of this demo'); },
  openHelp() { openSheet('help', { helpContext: null, helpView: 'options' }); },
});

// Scripted support progression, driven from the presenter panel.
function nowPlus(min) {
  const [h, m] = S.time.split(':').map(Number); const t = h * 60 + m + min;
  const hh = Math.floor(t / 60) % 12 || 12; return `${hh}:${String(t % 60).padStart(2, '0')}`;
}
const ampm = () => (S.issueType === 'ac' ? 'AM' : 'PM');
function advanceSupport() {
  const order = ['received', 'assigned', 'next'];
  const i = order.indexOf(S.support);
  if (i > -1 && i < 2) {
    S.support = order[i + 1]; S.time = nowPlus(i === 0 ? 2 : 1);
    S.supportTimes[S.support] = `${S.time} ${ampm()}`;
  } else if (S.support === 'next' && S.issueType === 'gate' && S.replacementSupported) {
    S.support = 'code'; S.time = nowPlus(2); S.codeReplaced = true; S.gateCode = '5193';
    S.supportTimes.code = `${S.time} ${ampm()}`; S.smsVariant = 'replacement';
  }
  render();
}
const canAdvance = () => ['received', 'assigned'].includes(S.support) || (S.support === 'next' && S.issueType === 'gate' && S.replacementSupported);

// ---------- Presenter scenarios ----------
const late = { page: 'hub', time: '11:04', low: true, stage: 'inside', codesReleased: true, codesActive: true, saved: 'saved', savedWithCodes: true, guideView: 'steps', route: 'gate', step: 0 };
const SCENARIOS = [
  ['1', 'Before arrival', { page: 'hub', stage: 'before', time: '9:41' }],
  ['2', 'Codes available', { page: 'hub', stage: 'ready', time: '2:41', codesReleased: true, saved: 'saved', savedWithCodes: true }],
  ['3', 'Late arrival', { ...late, sheets: ['guide'] }],
  ['4', 'Gate-code failure', { ...late, sheets: ['guide', 'help'], helpContext: 'gate', helpView: 'options' }],
  ['5', 'Offline with saved guide', { ...late, offline: true, sheets: ['guide'] }],
  ['6', 'Offline without saved guide', { ...late, offline: true, saved: 'none', savedWithCodes: false, sheets: ['guide'] }],
  ['7', 'Support request received', { ...late, time: '11:06', sheets: ['guide', 'status'], support: 'received', supportTimes: { sent: '11:06 PM', received: '11:06 PM' }, tried: { resend: true, entrance: false }, description: 'The keypad lights up, but the gate won’t open.' }],
  ['8', 'Support assigned', { ...late, time: '11:09', sheets: ['guide', 'status'], support: 'next', supportTimes: { sent: '11:06 PM', received: '11:06 PM', assigned: '11:08 PM', next: '11:09 PM' }, tried: { resend: true, entrance: false }, description: 'The keypad lights up, but the gate won’t open.' }],
  ['9', 'Inside apartment', { page: 'hub', stage: 'settled', time: '11:24', low: true, codesReleased: true, codesActive: true, saved: 'saved', savedWithCodes: true }],
  ['0', 'Apartment issue', { page: 'hub', stage: 'settled', time: '8:40', codesReleased: true, codesActive: true, saved: 'saved', savedWithCodes: true, issueType: 'ac', sheets: ['report'] }],
];
let activeScenario = null;
function runScenario(key) {
  const sc = SCENARIOS.find(s => s[0] === key); if (!sc) return;
  const keep = { parkingInReservation: S.parkingInReservation, replacementSupported: S.replacementSupported };
  S = Object.assign(structuredClone(DEFAULT), keep, structuredClone(sc[2]));
  if (S.parkingInReservation) S.parkingOpen = true;
  activeScenario = key; animate = null; render();
}
function resetAll() { S = structuredClone(DEFAULT); activeScenario = null; render(); startLaunch(); }
function startLaunch() { clearTimeout(startLaunch.t); startLaunch.t = setTimeout(() => { if (S.page === 'launch') go('home'); }, 1600); }

function renderPresenter() {
  const el = document.getElementById('presenter');
  const tg = (key, label) => `<button class="tg" data-ptoggle="${key}"><span>${label}</span><span class="sw ${S[key] ? 'on' : ''}"></span></button>`;
  el.innerHTML = `
    <div class="eb">Presenter only · Not shown to guests</div>
    <h2>Demo scenarios</h2>
    <p>Jump the prototype to a state. Keys 1 to 9 and 0, N for the next support update, R to reset, P to hide this panel.</p>
    <div class="list">${SCENARIOS.map(([k, name]) => `<button class="sc" data-scenario="${k}"><kbd>${k}</kbd><span>${name}</span>${activeScenario === k ? '<span class="on">Active</span>' : ''}</button>`).join('')}</div>
    <div class="eb">Simulated support</div>
    <div class="btns"><button class="pb solid" data-padvance ${canAdvance() ? '' : 'disabled'}>Next support update (N)</button></div>
    <p>Current: ${S.support ? S.support : 'no open request'}</p>
    <div class="eb">Toggles</div>
    <div>${tg('parkingInReservation', 'Reservation includes parking')}${tg('replacementSupported', 'Property supports replacement codes')}${tg('offline', 'Simulate no connection')}</div>
    <div class="eb">Supporting views</div>
    <div class="btns"><button class="pb" data-pview="sms">Arrival text</button><button class="pb" data-pview="email">Email</button></div>
    <div class="btns"><button class="pb" data-preset="scenario">Reset scenario</button><button class="pb solid" data-preset="all">Reset everything (R)</button></div>
    <p style="font-size:12px;line-height:18px;color:#8E8E93">Assistant replies and support responses are scripted. Codes, names and the property are fictional. Entrance and city photos are illustrative. Nothing is sent, called or unlocked.</p>`;
}
document.addEventListener('click', e => {
  const p = e.target.closest('#presenter button'); if (!p) return;
  if (p.dataset.scenario) runScenario(p.dataset.scenario);
  else if (p.dataset.ptoggle) { const k = p.dataset.ptoggle; S[k] = !S[k]; if (k === 'parkingInReservation') S.parkingOpen = S[k]; render(); }
  else if ('padvance' in p.dataset) advanceSupport();
  else if (p.dataset.pview) go(p.dataset.pview);
  else if (p.dataset.preset === 'all') resetAll();
  else if (p.dataset.preset === 'scenario') activeScenario ? runScenario(activeScenario) : resetAll();
});
document.addEventListener('keydown', e => {
  if (e.target.matches('input, textarea') || e.metaKey || e.ctrlKey) return;
  if (/^[0-9]$/.test(e.key)) runScenario(e.key);
  else if (e.key === 'r' || e.key === 'R') resetAll();
  else if (e.key === 'n' || e.key === 'N') { if (canAdvance()) advanceSupport(); }
  else if (e.key === 'p' || e.key === 'P') { document.getElementById('presenter').classList.toggle('hidden'); fit(); }
  else if (e.key === 'Escape' && S.sheets.length) closeSheet();
});

// ---------- Rendering ----------
function statusBar(light) {
  const sig = '<svg width="46" height="22" viewBox="0 0 46 22"><path d="M3.7 13H2.5a1 1 0 0 0-1 1v2.5a1 1 0 0 0 1 1h1.2a1 1 0 0 0 1-1V14a1 1 0 0 0-1-1m5.2-2.5H7.7a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.2a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1M14.1 8h-1.2a1 1 0 0 0-1 1v7.500a1 1 0 0 0 1 1h1.2a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1m5.2-2.5h-1.2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1.2a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1"/>' + (S.offline ? '' : '<path fill-rule="evenodd" d="M36.570 7.800c2.490 0 4.880.920 6.680 2.580.140.130.360.120.490 0l1.300-1.270a.340.340 0 0 0 0-.500 12.550 12.550 0 0 0-16.930 0 .340.340 0 0 0 0 .500l1.300 1.260c.130.130.340.140.480 0a10 10 0 0 1 6.680-2.570m0 4.220a5.400 5.400 0 0 1 3.670 1.440c.140.130.350.130.480 0l1.300-1.330a.370.370 0 0 0-.010-.520 7.900 7.900 0 0 0-10.880 0 .370.370 0 0 0 0 .520l1.290 1.320c.130.140.340.140.480 0 1-.920 2.310-1.430 3.670-1.430m2.520 2.800q0 .150-.100.280l-2.180 2.450a.300.300 0 0 1-.240.110.300.300 0 0 1-.240-.100l-2.180-2.460a.430.430 0 0 1 .010-.560 3.440 3.440 0 0 1 4.820 0 .400.400 0 0 1 .110.280" clip-rule="evenodd"/>') + '</svg>';
  const batt = S.low
    ? '<span class="batt"><span class="body"><span class="fill"></span><span class="n">12</span></span><span class="nub"></span></span>'
    : '<svg width="30" height="14" viewBox="0 0 30 14"><rect x=".5" y=".5" width="25" height="13" rx="4" fill="none" stroke="currentColor" opacity=".35"/><rect x="2" y="2" width="22" height="10" rx="2.500"/><path d="M27 4.500v5a2.200 2.200 0 0 0 1.300-2.500A2.200 2.200 0 0 0 27 4.500" opacity=".4"/></svg>';
  return `<div class="statusbar ${light ? 'light' : ''}"><span>${S.time}</span><span class="icons">${sig}${batt}</span></div>`;
}
function render() {
  const root = document.getElementById('screen');
  const scrolls = {};
  root.querySelectorAll('[data-scroll]').forEach(n => { scrolls[n.dataset.scroll] = n.scrollTop; });
  const page = screens[S.page] || { render: () => `<div class="page"><div style="padding:24px">Missing screen: ${esc(S.page)}</div></div>` };
  let html = page.render(S);
  S.sheets.forEach(id => {
    const d = screens[id];
    const inn = animate === id ? ' in' : '';
    html += `<div class="scrim${inn}" data-act="closeSheet"></div><div class="sheet${d && d.partial ? ' partial' : ''}${inn}" data-sheet="${id}"><div class="grabber"><i></i></div>${d ? d.render(S) : `<div style="padding:24px">Missing sheet: ${esc(id)}</div>`}</div>`;
  });
  if (S.toast) html += `<div class="toast" role="status">${esc(S.toast)}</div>`;
  const fullSheet = S.sheets.some(id => !(screens[id] && screens[id].partial));
  root.innerHTML = statusBar(page.dark || S.sheets.length > 0 && fullSheet || (S.sheets.length > 0)) + html;
  root.querySelectorAll('[data-scroll]').forEach(n => { if (scrolls[n.dataset.scroll]) n.scrollTop = scrolls[n.dataset.scroll]; });
  animate = null;
  renderPresenter();
}
// Declarative navigation: data-go="page", data-open="sheet", data-act="actionName"
document.addEventListener('click', e => {
  const el = e.target.closest('#screen [data-go], #screen [data-open], #screen [data-act]'); if (!el) return;
  if (el.dataset.go) go(el.dataset.go);
  else if (el.dataset.open) openSheet(el.dataset.open);
  else if (actions[el.dataset.act]) actions[el.dataset.act](el, e);
});
function fit() {
  const d = document.getElementById('device'); const st = d.parentElement;
  const k = Math.min(1, (st.clientHeight - 32) / 866, (st.clientWidth - 32) / 412);
  d.style.transform = `scale(${k})`;
}
window.addEventListener('resize', fit);
// Testing hooks: index.html?s=4 runs scenario 4; &state={"sheets":["guide"]} patches state; &panel=0 hides the presenter panel.
function boot() {
  const q = new URLSearchParams(location.search);
  if (q.get('panel') === '0') document.getElementById('presenter').classList.add('hidden');
  fit();
  if (q.get('s')) runScenario(q.get('s'));
  if (q.get('state')) { try { Object.assign(S, JSON.parse(q.get('state'))); } catch (e) { console.error(e); } }
  render();
  if (!q.get('s') && !q.get('state')) startLaunch();
}
