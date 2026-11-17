/* Landing guest arrival prototype: help, assistant, handoff, support status, apartment issue, essentials.
   Sheets registered here: help, assist, handoff, status, report, essentials.
   Everything is scripted. Nothing is sent, called or unlocked. */
(function () {
  // ---------- Styles local to these sheets ----------
  const css = `
  .b-pad { padding: 4px 16px 20px; display: flex; flex-direction: column; gap: 16px; }
  .b-in8 { padding: 0 8px; }
  .b-ctx { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; }
  .b-thumb { width: 52px; height: 52px; border-radius: 10px; flex-shrink: 0; background: var(--sunk) center/cover no-repeat; display: flex; align-items: center; justify-content: center; color: var(--muted); }
  .b-ctx .k { font-size: 13px; line-height: 18px; color: var(--muted); }
  .b-ctx .n { font-size: 16px; line-height: 22px; font-weight: 500; }
  .b-ctx .c { flex-shrink: 0; font: 500 18px/22px var(--mono); letter-spacing: .04em; color: var(--ink); display: flex; align-items: center; gap: 8px; }
  .b-ctx .c b { font-family: var(--sans); font-weight: 500; letter-spacing: 0; }
  .b-q { font-family: var(--serif); font-size: 26px; line-height: 30px; letter-spacing: -0.015em; }
  .b-opt { display: flex; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid var(--line); width: 100%; }
  .b-opt:last-child { border-bottom: 0; }
  .b-opt .ico { width: 24px; display: flex; justify-content: center; flex-shrink: 0; }
  .b-opt .t { font-size: 17px; line-height: 24px; font-weight: 500; }
  .b-opt .s { font-size: 14px; line-height: 20px; color: var(--muted); }
  .b-photo { height: 176px; border-radius: 20px; background: var(--sunk) center/cover no-repeat; flex-shrink: 0; }
  .b-lines > div { padding: 10px 0; border-bottom: 1px solid var(--line); font-size: 16px; line-height: 23px; }
  .b-lines > div:last-child { border-bottom: 0; }
  .b-keys { display: flex; align-items: center; gap: 6px; }
  .b-keys .kc { flex: 0 1 44px; min-width: 0; height: 48px; border-radius: 10px; background: var(--sunk); display: flex; align-items: center; justify-content: center; font: 500 22px/28px var(--mono); color: var(--ink); }
  .b-keys .kc.last { background: var(--ink); color: #fff; font-family: var(--sans); }
  .b-keys .then { padding: 0 4px; font-size: 14px; line-height: 18px; color: var(--muted); flex-shrink: 0; }
  .b-keys.lg .kc { flex-basis: 52px; height: 60px; border-radius: 12px; font-size: 26px; }
  .b-me { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; padding-left: 56px; }
  .b-me .bub { background: var(--ink); color: #fff; border-radius: 20px 20px 6px 20px; padding: 12px 16px; font-size: 16px; line-height: 23px; }
  .b-me .bub.draft { background: var(--surface); color: var(--ink); border: 1.5px dashed var(--muted); }
  .b-me .ns { font-size: 13px; line-height: 16px; font-weight: 500; color: var(--err); }
  .b-bot { display: flex; flex-direction: column; gap: 10px; padding: 0 8px; }
  .b-bot .who { display: flex; align-items: center; gap: 8px; }
  .b-bot .tx { font-size: 16px; line-height: 24px; }
  .b-ans { display: flex; align-items: center; min-height: 52px; padding: 8px 18px; border-radius: 16px; border: 1px solid var(--ink); background: var(--surface); font-size: 16px; line-height: 20px; font-weight: 500; width: 100%; }
  .b-ans[disabled], .pill[disabled] { opacity: .45; cursor: default; }
  .b-foot { flex-shrink: 0; display: flex; flex-direction: column; gap: 10px; padding: 12px 16px 26px; background: var(--ground); border-top: 1px solid var(--line); }
  .b-input { display: flex; align-items: center; gap: 10px; height: 52px; padding: 0 8px 0 18px; border-radius: 999px; background: var(--surface); border: 1px solid var(--line); }
  .b-input input { flex: 1; min-width: 0; border: 0; outline: 0; background: none; font: 400 16px/20px var(--sans); color: var(--ink); }
  .b-input input::placeholder { color: var(--muted); }
  .b-input:focus-within { border-color: var(--ink); }
  .b-input button { width: 36px; height: 36px; border-radius: 18px; background: var(--sunk); display: flex; align-items: center; justify-content: center; color: var(--muted); flex-shrink: 0; }
  .b-ulbtn { display: flex; align-items: center; justify-content: center; gap: 10px; height: 48px; font-size: 17px; line-height: 22px; font-weight: 500; width: 100%; }
  .b-ulbtn span, .b-ul { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
  .b-sum { padding: 4px 20px; display: flex; flex-direction: column; }
  .b-sum .r { display: flex; gap: 12px; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--line); }
  .b-sum .r:last-child { border-bottom: 0; }
  .b-sum .k { font-size: 13px; line-height: 18px; color: var(--muted); }
  .b-sum .v { font-size: 16px; line-height: 22px; }
  .b-sum .a { flex-shrink: 0; font-size: 15px; line-height: 18px; font-weight: 500; color: var(--blue); padding: 8px 0 8px 8px; }
  .b-sum textarea, .b-ta { width: 100%; border: 0; outline: 0; resize: none; background: none; font: 400 16px/23px var(--sans); color: var(--ink); padding: 0; display: block; }
  .b-sum textarea { border: 1px solid var(--line); border-radius: 12px; padding: 10px 12px; margin-top: 6px; background: var(--ground); }
  .b-sum textarea:focus { border-color: var(--ink); background: var(--surface); }
  .b-sum textarea::placeholder { color: var(--muted); }
  .b-stay { display: flex; align-items: center; gap: 12px; padding: 10px 0; width: 100%; text-align: left; }
  .b-stay .rad { width: 22px; height: 22px; border-radius: 11px; border: 1.5px solid var(--muted); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .b-stay.on .rad { background: var(--ink); border-color: var(--ink); }
  .b-check { position: relative; display: flex; align-items: center; gap: 12px; font-size: 16px; line-height: 22px; cursor: pointer; }
  .b-check input { position: absolute; opacity: 0; width: 1px; height: 1px; }
  .b-check .box { width: 24px; height: 24px; border-radius: 7px; border: 1.5px solid var(--muted); flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .b-check .box svg { display: none; }
  .b-check input:checked + .box { background: var(--ink); border-color: var(--ink); }
  .b-check input:checked + .box svg { display: block; }
  .b-check input:focus-visible + .box { outline: 2px solid var(--blue); outline-offset: 2px; }
  .b-check.ro { cursor: default; }
  .b-call { display: flex; gap: 12px; align-items: center; padding: 12px 8px 0; border-top: 1px solid var(--line); width: 100%; }
  .b-call .t { font-size: 16px; line-height: 22px; font-weight: 500; }
  .b-call .s { font-size: 14px; line-height: 20px; color: var(--muted); }
  .b-lab { display: flex; align-items: center; gap: 8px; }
  .b-steps { padding: 8px 20px; display: flex; flex-direction: column; }
  .b-steps .st { display: flex; align-items: center; gap: 14px; height: 48px; font-size: 16px; line-height: 20px; }
  .b-steps .dot { width: 24px; height: 24px; border-radius: 12px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
  .b-steps .done .dot { background: var(--ink); }
  .b-steps .todo .dot { border: 1.5px dashed var(--muted); }
  .b-steps .todo { color: var(--muted); }
  .b-steps .when { font-size: 14px; line-height: 18px; color: var(--muted); }
  .b-steps .cur .nm { font-weight: 600; }
  .b-tint { background: var(--blue-tint); border-radius: 20px; padding: 16px 20px 18px; display: flex; flex-direction: column; gap: 6px; }
  .b-sunk { background: var(--sunk); border-radius: 20px; padding: 16px 20px 18px; display: flex; flex-direction: column; gap: 6px; }
  .b-chips { display: flex; flex-wrap: wrap; gap: 8px; }
  .b-chip { display: flex; align-items: center; gap: 6px; height: 44px; padding: 0 16px; border-radius: 999px; background: var(--surface); border: 1px solid var(--line); font-size: 15px; line-height: 18px; font-weight: 500; }
  .b-chip.on { background: var(--ink); border-color: var(--ink); color: #fff; }
  .b-field { background: var(--surface); border: 1.5px solid var(--ink); border-radius: 16px; padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
  .b-ess { display: flex; flex-direction: column; gap: 2px; padding: 12px 0; border-bottom: 1px solid var(--line); }
  .b-ess:last-child { border-bottom: 0; }
  .b-ess .t { font-size: 16px; line-height: 22px; font-weight: 500; }
  .b-ess .s { font-size: 15px; line-height: 20px; color: var(--muted); }
  .b-pw { display: flex; align-items: center; gap: 14px; padding: 12px 12px 12px 16px; background: var(--sunk); border-radius: 16px; }
  `;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---------- Fixed, fictional content ----------
  const ORIGINAL_GATE = '4827';
  const CTX = {
    gate: { step: 1, name: 'Side gate on Navasota St', thing: 'gate', at: 'at the gate', photo: 'assets/gate.jpg', key: '#',
      success: 'Wait for the green light, then pull the gate toward you.',
      landmarks: ['Black gate beneath the blue awning', 'Keypad on the right', 'The guest entrance is on Navasota St, not the main lobby on E 4th St'] },
    courtyard: { step: 2, name: 'Courtyard', thing: 'courtyard', at: 'in the courtyard', ic: 'pin' },
    elevator: { step: 3, name: 'Elevator B to floor 4', thing: 'elevator', at: 'at the elevator', ic: 'pin' },
    door: { step: 4, name: 'Apartment 412', thing: 'door', at: 'at the door', photo: 'assets/door.jpg', key: 'check', code: '731904',
      success: 'Turn the handle when the lock clicks.',
      landmarks: ['Floor 4. Turn right out of elevator B', 'Third door on the left'] },
    garage: { step: 1, name: 'Garage entrance on E 5th St', thing: 'garage door', at: 'at the garage', ic: 'car', key: '#', code: '6150',
      success: 'The door takes a few seconds to open.' },
    parking: { step: 2, name: 'Parking', thing: 'parking', at: 'with parking', ic: 'car' },
  };
  // Samantha has two upcoming reservations. Help starts on the current one and can be switched.
  const STAYS = {
    eastline: { name: 'The Eastline, Apt 412', where: 'Austin, TX', dates: 'Nov 19 to Dec 19', photo: 'assets/gate.jpg' },
    linden: { name: 'The Linden, Apt 2B', where: 'Nashville, TN', dates: 'Jan 8 to Feb 7', photo: 'assets/city-nashville.jpg' },
  };
  const stayOf = k => STAYS[k] || STAYS.eastline;
  // Entrances and steps belong to The Eastline, so step context only applies to that stay.
  const ctxOf = id => (S.helpStay || 'eastline') === 'eastline' ? (CTX[id] || null) : null;
  function stayOptions() {
    return Object.keys(STAYS).map(k => { const st = STAYS[k], on = (S.helpStay || 'eastline') === k;
      return `<button class="b-stay ${on ? 'on' : ''}" role="radio" aria-checked="${on}" data-act="bStayPick" data-k="${k}"><span class="rad">${on ? tick(12) : ''}</span>
        <span class="grow"><span style="display:block;font-size:16px;line-height:22px;font-weight:500">${st.name}</span><span class="small muted" style="display:block">${st.where} · ${st.dates}</span></span></button>`; }).join('');
  }
  // Where the guest is. Offered for The Eastline only; other stays have no entrances in this demo.
  const ENTRANCES = ['gate', 'garage', 'door'];
  function entranceOptions(cur) {
    const ids = ENTRANCES.includes(cur) || !CTX[cur] ? ENTRANCES : [cur, ...ENTRANCES];
    const opt = (k, name, sub) => { const on = (cur || '') === k;
      return `<button class="b-stay ${on ? 'on' : ''}" role="radio" aria-checked="${on}" data-act="bEntPick" data-k="${k}"><span class="rad">${on ? tick(12) : ''}</span>
        <span class="grow"><span style="display:block;font-size:16px;line-height:22px;font-weight:500">${name}</span>${sub ? `<span class="small muted" style="display:block">${sub}</span>` : ''}</span></button>`; };
    return ids.map(k => opt(k, esc(CTX[k].name))).join('') + opt('', 'Somewhere else', 'Tell us where in your own words');
  }
  function stayRow() {
    const st = stayOf(S.helpStay);
    return `<div class="b-ctx" style="flex-direction:column;align-items:stretch;gap:0">
      <div style="display:flex;align-items:center;gap:12px"><div class="b-thumb" style="background-image:url(${st.photo})"></div>
        <div class="grow"><div class="k">Help with this stay</div><div class="n">${st.name}</div><div class="k">${st.dates}</div></div>
        <button style="flex-shrink:0;font-size:15px;line-height:18px;font-weight:500;color:var(--blue);padding:8px 4px" data-act="bStayToggle" aria-expanded="${!!S.stayPick}">${S.stayPick ? 'Done' : 'Change'}</button></div>
      ${S.stayPick ? `<div role="radiogroup" aria-label="Reservation" style="display:flex;flex-direction:column;padding-top:8px;margin-top:10px;border-top:1px solid var(--line)">${stayOptions()}</div>` : ''}</div>`;
  }
  const codeFor = (id, original) => id === 'gate' ? (original && S.codeReplaced ? ORIGINAL_GATE : S.gateCode) : (CTX[id] && CTX[id].code) || null;
  // Codes exist only once released, and offline only if the saved copy included them.
  const codesVisible = () => S.codesReleased && !(S.offline && !(S.saved === 'saved' && S.savedWithCodes));
  const hasCode = id => !!(CTX[id] && CTX[id].key && codesVisible());
  const lastKeyName = c => c.key === 'check' ? 'the checkmark key' : '#';
  const tick = (size = 14, color = '#fff') => `<svg width="${size}" height="${size}" viewBox="0 0 14 14" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><path d="M3 7.300l2.700 2.700L11 4.500"/></svg>`;
  const lastKey = (c, size, color) => c.key === 'check' ? icon('check', size, color, 1.9) : '#';

  function ctxRow(id) {
    const c = ctxOf(id); if (!c) return '';
    const thumb = c.photo ? `<div class="b-thumb" style="background-image:url(${c.photo})"></div>` : `<div class="b-thumb">${icon(c.ic || 'pin', 22)}</div>`;
    const code = hasCode(id) ? `<div class="c"><span>${esc(codeFor(id))}</span><b>${lastKey(c, 18, 'var(--ink)')}</b></div>` : '';
    return `<div class="b-ctx">${thumb}<div class="grow"><div class="k">Help with step ${c.step}</div><div class="n">${esc(c.name)}</div></div>${code}</div>`;
  }
  function keyChips(id, large) {
    const c = ctxOf(id); const code = codeFor(id);
    return `<div class="b-keys ${large ? 'lg' : ''}" aria-label="${esc(code.split('').join(' '))} then ${c.key === 'check' ? 'checkmark' : 'hash'}">
      ${code.split('').map(d => `<span class="kc">${d}</span>`).join('')}<span class="then">then</span><span class="kc last">${lastKey(c, large ? 26 : 22, '#fff')}</span></div>`;
  }
  const bind = (path, v) => { const p = path.split('.'); let o = S; while (p.length > 1) { const k = p.shift(); o = o[k] = o[k] || {}; } o[p[0]] = v; };
  document.addEventListener('input', e => { const el = e.target.closest && e.target.closest('#screen [data-bind]'); if (el) bind(el.dataset.bind, el.value); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches && e.target.matches('#screen input[data-enter]') && actions[e.target.dataset.enter]) { e.preventDefault(); actions[e.target.dataset.enter](e.target, e); }
  });
  const callToast = () => toast('Calls are not placed in this demo');
  const personBtn = (label, act) => `<button class="b-ulbtn" data-act="${act}">${icon('person')}<span>${label}</span></button>`;

  // ---------- Help (contextual, partial sheet) ----------
  function helpOptions(id) {
    const c = ctxOf(id);
    const opt = (ic, t, s, act, done) => `<button class="b-opt" data-act="${act}"><span class="ico">${icon(ic, 22)}</span><span class="grow"><div class="t">${t}</div><div class="s">${s}</div></span>${done ? icon('checkCircle', 20, 'var(--ok)', 1.75) : icon('chevR', 20, 'var(--muted)', 1.75)}</button>`;
    let rows = '';
    if (c && c.photo) rows += opt('photo', 'Check I’m at the right entrance', S.tried.entrance ? 'You checked this against the photo' : 'Compare what you see with the photo', 'bHelpEntrance', S.tried.entrance);
    if (c && hasCode(id)) rows += opt('keypad', 'Show the keypad sequence', `Each key in order, ending with ${c.key === 'check' ? 'the checkmark' : '#'}`, 'bHelpKeypad');
    rows += opt('pencil', 'Describe what’s happening', c ? (c.key ? `Get a suggestion for this ${c.thing}` : 'Tell us in your own words') : 'Tell us in your own words', 'bHelpDescribe');
    return `<div class="scroll" data-scroll="help" style="padding:6px 16px 26px">
      ${c ? ctxRow(id) : stayRow()}
      <div style="padding:20px 8px 6px"><div class="b-q">${c ? `What’s happening ${c.at}?` : 'How can we help?'}</div></div>
      <div class="b-in8" style="display:flex;flex-direction:column">${rows}</div>
      <div style="display:flex;flex-direction:column;gap:8px;padding-top:10px">
        <button class="btn secondary" style="gap:10px" data-act="bHelpPerson">${icon('person')}Talk to a person</button>
      </div></div>`;
  }
  function helpEntrance(id) {
    const c = ctxOf(id);
    return `<div style="padding:0 16px 10px;flex-shrink:0">${backBtn('data-act="bHelpBack"')}</div>
      <div class="scroll" data-scroll="help-entrance" style="padding:0 16px 8px;display:flex;flex-direction:column;gap:14px">
        <div class="b-photo" style="background-image:url(${c.photo})" role="img" aria-label="Photo of ${esc(c.name)}"></div>
        <div class="b-in8" style="display:flex;flex-direction:column;gap:6px">
          <div class="b-q">Does this match what you see?</div>
          <div class="b-lines">${c.landmarks.map(l => `<div>${esc(l)}</div>`).join('')}</div>
        </div>
      </div>
      <div class="actions" style="gap:8px"><button class="btn primary" data-act="bEntranceMatch">This matches</button><button class="btn secondary" data-act="bEntranceNoMatch">This isn’t what I see</button></div>`;
  }
  function helpKeypad(id) {
    const c = ctxOf(id);
    return `<div style="padding:0 16px 10px;flex-shrink:0">${backBtn('data-act="bHelpBack"')}</div>
      <div class="scroll" data-scroll="help-keypad" style="padding:0 16px 8px;display:flex;flex-direction:column;gap:14px">
        <div class="b-in8" style="display:flex;flex-direction:column;gap:4px"><div class="small muted">${esc(c.name)}</div><div class="b-q">Press each key in order</div></div>
        <div class="card" style="padding:16px;display:flex;flex-direction:column;gap:14px">${keyChips(id, true)}
          <div style="font-size:16px;line-height:23px">${esc(c.success)}</div></div>
      </div>
      <div class="actions" style="gap:8px"><button class="btn primary" data-act="bKeypadWorked">That worked</button><button class="btn secondary" data-act="bKeypadFailed">I tried this, still not opening</button></div>`;
  }
  reg('help', { kind: 'sheet', partial: true, render(S) {
    const id = S.helpContext; const c = ctxOf(id);
    if (S.helpView === 'entrance' && c && c.photo) return helpEntrance(id);
    if (S.helpView === 'keypad' && c && hasCode(id)) return helpKeypad(id);
    return helpOptions(id);
  } });

  // ---------- Assistant (scripted) ----------
  const CHIP1 = c => c && c.key ? `The keypad lights up, but the ${c.thing} won’t open.` : 'I can’t find where to go.';
  const CHIP2 = 'It’s not working.';
  const botHead = `<div class="who">${sparkle()}<span class="label blue">Landing assistant · Automated</span></div>`;
  function botMsg(m, isLast) {
    const id = S.helpContext; const c = ctxOf(id); const live = isLast && !S.chatBusy;
    if (m.kind === 'offline') {
      return `<div class="banner warn" style="padding:14px 16px">${icon('offline', 22, 'var(--warn)')}<div class="grow"><div style="font-weight:600;font-size:15px;line-height:22px">Suggestions need a connection</div>
          <div style="font-size:15px;line-height:22px">${hasCode(id) ? `Your saved ${esc(c.thing)} step and keypad sequence still work offline.` : 'Your message is kept here. Nothing has been sent.'}</div></div></div>
        ${!S.offline && isLast ? `<button class="btn primary" data-act="bChatRetry">Send it now</button>` : ''}
        ${hasCode(id) ? `<button class="btn secondary" data-act="bChatKeypad">Show the saved keypad sequence</button>` : ''}
        <button class="b-ulbtn" style="height:40px;font-size:16px" data-act="bCall"><span>Call support (opens your phone app)</span></button>`;
    }
    if (m.kind === 'step' && c && hasCode(id)) {
      const what = id === 'door' ? 'lock' : c.thing;
      return `<div class="b-bot">${botHead}
        <div class="tx">A lit keypad means it has power, so the ${what} is most likely waiting for the last key. This ${c.thing} only opens after ${lastKeyName(c)} is pressed.</div>
        <div class="card" style="padding:16px;display:flex;flex-direction:column;gap:12px">
          <div style="font-size:16px;line-height:22px;font-weight:500">Try the full sequence once more</div>${keyChips(id)}
          <div style="font-size:15px;line-height:22px">${esc(c.success)}</div></div>
        <div class="small muted">From The Eastline’s ${id === 'gate' ? 'gate' : esc(c.thing)} instructions, verified Nov 12.</div>
        ${isLast ? `<div style="display:flex;gap:8px"><button class="pill grow" data-act="bChatWorked" ${live ? '' : 'disabled'}>That worked</button><button class="pill grow" data-act="bChatStill" ${live ? '' : 'disabled'}>Still not opening</button></div>` : ''}</div>`;
    }
    if (m.kind === 'clarify') {
      const a = (k, t) => `<button class="b-ans" data-act="bChatAnswer" data-k="${k}" ${live ? '' : 'disabled'}>${t}</button>`;
      return `<div class="b-bot">${botHead}<div class="tx">Which of these is closest to what you see ${c.at}?</div>
        ${isLast ? a('dark', 'The keypad doesn’t light up') + a('rejected', 'The code is rejected') + a('accepted', `The code is accepted but the ${c.thing} stays shut`) : ''}</div>`;
    }
    const where = c ? `this ${c.thing}` : 'this';
    const txt = m.variant === 'retry' ? `Thanks for trying that again. I don’t have another verified fix for ${where}, so the quickest route now is a person. I’ve kept what you told me.`
      : m.variant === 'detail' ? `I don’t have another verified fix for ${where}, so the quickest route now is a person. You can add this detail to the summary before you send it.`
      : `I don’t have a verified fix for ${c ? 'that ' + c.at : 'that'}, so the quickest route now is a person. I’ve kept what you told me.`;
    return `<div class="b-bot">${botHead}<div class="tx">${txt}</div>
      <button class="btn primary" data-act="bHelpPerson">Review and send to support</button>
      <div class="small muted" style="text-align:center">Includes your description and what you tried.</div></div>`;
  }
  function chatRender() { render(); const n = document.querySelector('#screen [data-scroll="assist"]'); if (n) n.scrollTop = n.scrollHeight; }
  function replyKind(kind) {
    const id = S.helpContext;
    if (!hasCode(id)) return { kind: 'escalate', variant: 'nofix' };
    if (S.chat.some(m => m.from === 'bot' && (m.kind === 'step' || m.kind === 'escalate'))) return { kind: 'escalate', variant: 'detail' };
    return kind === 'vague' ? { kind: 'clarify' } : { kind: 'step' };
  }
  function botReply(reply) {
    const s0 = S, chat = S.chat; S.chatBusy = true; chatRender();
    setTimeout(() => { if (S !== s0 || S.chat !== chat) return; S.chatBusy = false; chat.push(Object.assign({ from: 'bot' }, reply)); chatRender(); }, 700);
  }
  function postGuest(text, kind, forced) {
    if (S.chatBusy) return;
    if (!S.chat.some(m => m.from === 'guest')) S.description = text;
    if (S.offline) { S.chat.push({ from: 'guest', text, draft: true, kind, forced }, { from: 'bot', kind: 'offline' }); chatRender(); return; }
    const reply = forced || replyKind(kind);
    S.chat.push({ from: 'guest', text });
    botReply(reply);
  }
  reg('assist', { kind: 'sheet', render(S) {
    const id = S.helpContext; const c = ctxOf(id); const n = S.chat.length;
    let body = '';
    if (!n) {
      body = `<div class="b-bot" style="gap:12px"><div class="b-q" style="padding-top:4px">${c ? `What’s happening ${c.at}?` : 'What’s happening?'}</div>
        <div class="small muted">Tap one, or write your own below. Replies are automated and come from The Eastline’s verified instructions.</div>
        <button class="b-ans" data-act="bChatChip" data-k="full">${CHIP1(c)}</button>
        <button class="b-ans" data-act="bChatChip" data-k="vague">${CHIP2}</button></div>`;
    } else {
      body = S.chat.map((m, i) => m.from === 'guest'
        ? `<div class="b-me"><div class="bub ${m.draft ? 'draft' : ''}">${esc(m.text)}</div>${m.draft ? '<div class="ns">Not sent. Kept as a draft.</div>' : ''}</div>`
        : botMsg(m, i === n - 1)).join('');
    }
    return `${sheetHead('Help')}
      <div class="scroll" data-scroll="assist" style="padding:0 16px 20px;display:flex;flex-direction:column;gap:16px">${ctxRow(id)}${body}</div>
      <div class="b-foot">
        <div class="b-input"><input type="text" placeholder="Add a detail" aria-label="Add a detail" data-bind="chatDraft" data-enter="bChatSend" value="${esc(S.chatDraft || '')}"><button aria-label="Send" data-act="bChatSend">${icon('send', 18, 'currentColor', 1.75)}</button></div>
        ${personBtn('Talk to a person instead', 'bHelpPerson')}
      </div>`;
  } });

  // ---------- Handoff and summaries ----------
  // Plain list of what the guest reported trying. No checkboxes: only things they actually did are listed.
  function triedRows(id, readOnly, original) {
    const c = ctxOf(id); let h = '';
    const row = label => `<div class="v">${label}</div>`;
    if (c && c.key && S.tried.resend && (codesVisible() || readOnly)) h += row(`Re-entered ${esc(codeFor(id, original))} followed by ${c.key === 'check' ? 'the checkmark key' : '#'}`);
    if (c && c.photo && S.tried.entrance) h += row('Compared the entrance with the photo');
    return h;
  }
  function gateSummary(readOnly) {
    const stayKey = readOnly ? (S.sentStay || 'eastline') : (S.helpStay || 'eastline');
    const st = stayOf(stayKey);
    let id = readOnly ? (S.sentEntrance === undefined ? (S.helpContext || 'gate') : S.sentEntrance) : S.helpContext;
    if (stayKey !== 'eastline' || !CTX[id]) id = null;
    const desc = S.description && S.description.trim();
    const words = readOnly
      ? `<div class="r" style="display:block"><div class="k">In your words</div><div class="v ${desc ? '' : 'muted'}">${desc ? `“${esc(desc)}”` : 'No description added'}</div></div>`
      : `<div class="r" style="display:block"><label class="k" for="b-words">In your words</label>
          <textarea id="b-words" rows="2" data-bind="description" placeholder="Add anything that would help (optional)">${esc(S.description || '')}</textarea></div>`;
    const reservation = readOnly
      ? `<div class="r" style="display:block"><div class="k">Reservation</div><div class="v">${st.name}</div><div class="k">${st.dates}</div></div>`
      : `<div class="r" style="display:block"><div style="display:flex;align-items:center;gap:12px"><div class="grow"><div class="k">Reservation</div><div class="v">${st.name}</div><div class="k">${st.dates}</div></div>
          <button class="a" data-act="bStayToggle" aria-expanded="${!!S.stayPick}">${S.stayPick ? 'Done' : 'Change'}</button></div>
          ${S.stayPick ? `<div role="radiogroup" aria-label="Reservation" style="display:flex;flex-direction:column;padding-top:6px">${stayOptions()}</div>` : ''}</div>`;
    return `<div class="card b-sum">
      ${reservation}
      ${readOnly ? (id ? `<div class="r" style="display:block"><div class="k">Entrance</div><div class="v">${esc(CTX[id].name)}</div></div>` : '')
        : stayKey === 'eastline' ? `<div class="r" style="display:block"><div style="display:flex;align-items:center;gap:12px"><div class="grow"><div class="k">Entrance</div><div class="v ${id ? '' : 'muted'}">${id ? esc(CTX[id].name) : 'Not selected'}</div></div>
          <button class="a" data-act="bEntToggle" aria-expanded="${!!S.entPick}">${S.entPick ? 'Done' : id ? 'Change' : 'Choose'}</button></div>
          ${S.entPick ? `<div role="radiogroup" aria-label="Entrance" style="display:flex;flex-direction:column;padding-top:6px">${entranceOptions(id)}</div>` : ''}</div>` : ''}
      ${words}
      ${(t => t ? `<div class="r" style="display:flex;flex-direction:column;align-items:stretch;gap:4px;padding:14px 0 16px"><div class="k">What you’ve tried</div>${t}</div>` : '')(id ? triedRows(id, readOnly, readOnly) : '')}
    </div>`;
  }
  const callBlock = () => `<button class="b-call" data-act="bCall">${icon('phone', 20, 'var(--ink)')}<span class="t b-ul">Call support instead</span></button>`;
  const notSentHead = what => `<div class="b-in8" style="display:flex;flex-direction:column;gap:6px">
      <div class="b-lab">${icon('alert', 18, 'var(--err)', 1.75)}<span class="label err">Not sent · No connection</span></div>
      <div class="h2">This hasn’t been sent</div>
      <div class="body muted">Landing support has not received your request. Your ${what} is kept on this phone.</div></div>`;
  const sendingHead = `<div class="b-in8" style="display:flex;flex-direction:column;gap:6px"><div class="h2">Sending your request</div>
      <div class="body muted">Keep this screen open for a moment. Sending needs a connection.</div></div>`;
  reg('handoff', { kind: 'sheet', render(S) {
    const sending = S.support === 'sending', failed = S.support === 'failed';
    const head = sending ? sendingHead : failed ? notSentHead('summary')
      : `<div class="b-in8" style="display:flex;flex-direction:column;gap:6px"><div class="h2">Here’s what we’ll send</div><div class="body muted">So you don’t have to explain it again. Fix anything that’s off.</div></div>`;
    return `${sheetHead('Talk to a person')}
      <div class="scroll" data-scroll="handoff"><div class="b-pad">${head}${gateSummary(false)}</div></div>
      <div class="actions" style="gap:12px">
        <button class="btn primary" data-act="bSend" ${sending ? 'disabled' : ''}>${sending ? 'Sending…' : failed ? 'Try sending again' : 'Send to Landing support'}</button>
        ${callBlock()}
      </div>`;
  } });

  // ---------- Support status ----------
  function statusModel(S) {
    const t = S.supportTimes || {}, ac = S.issueType === 'ac', s = S.support;
    const rank = { received: 1, assigned: 2, next: 3, code: 3, resolved: 4 }[s] || 0;
    const who = ac ? 'maintenance' : 'Alex';
    let rows = [
      ['Sent', t.sent, rank >= 1], ['Received by support', t.received, rank >= 1],
      [rank >= 2 ? `Assigned to ${who}` : 'Assigned to a person', t.assigned, rank >= 2],
      [ac && rank >= 3 ? 'Visit confirmed' : 'Next action confirmed', t.next, rank >= 3],
      [ac ? 'Resolved' : 'Access resolved', t.resolved, rank >= 4],
    ];
    if (rank >= 3) rows = rows.slice(1);
    const m = { rows, ok: true };
    if (s === 'received') Object.assign(m, { label: `Received · ${t.received || ''}`, h: 'Your request has been received',
      p: ac ? 'We’ve included your reservation, the apartment and your description.' : (S.sentEntrance === null ? 'We’ve included your reservation and what you told us.' : 'We’ve included your reservation, the entrance and what you tried.') });
    else if (s === 'assigned' || s === 'next') Object.assign(m, { label: `Assigned · ${t.assigned || ''}`,
      h: ac ? 'The Eastline maintenance team has this' : 'Alex from Landing support is helping',
      p: ac ? 'They have your description, so there’s nothing to repeat.' : 'Alex has your summary, so there’s nothing to repeat.' });
    else if (s === 'code') Object.assign(m, { label: `Code updated · ${t.code || ''}`, h: 'Your new gate code is ready', p: 'Alex issued it for the side gate. It’s on your gate step too.' });
    else if (s === 'resolved') Object.assign(m, { label: 'Resolved', h: ac ? 'This request is closed.' : 'You’re in. This request is closed.', p: '' });
    return m;
  }
  function statusExtra(S) {
    const ac = S.issueType === 'ac', s = S.support;
    const next = (a, b) => `<div class="b-tint"><div class="label blue">What happens next</div><div style="font-size:16px;line-height:23px;font-weight:500">${a}</div><div style="font-size:15px;line-height:22px">${b}</div></div>`;
    const note = t => `<div class="b-in8" style="font-size:15px;line-height:22px">${t}</div>`;
    if (s === 'received') return note('We don’t have a wait time to share yet. This screen updates as soon as someone picks it up, and you’ll get a notification.');
    if (s === 'assigned') return note('You’ll see the next step here as soon as it’s confirmed.');
    if (s === 'next' && ac) return next('Maintenance will visit today between 1 and 3 PM.', 'They’ll knock first. Afterwards we’ll ask if it’s fixed. If we don’t hear back, the request closes once the visit is logged as complete.');
    if (s === 'next') return S.replacementSupported
      ? next('Alex is issuing a new code for the side gate.', 'It will replace the code on your gate step and arrive by text. Nothing else is needed from you.')
      : next('Alex is contacting The Eastline’s building manager about the side gate.', 'You’ll see the next step here as soon as it’s confirmed.');
    if (s === 'code') return credCard({ label: 'New gate code', code: S.gateCode, status: statusBlue('Updated ' + (S.supportTimes.code || '')) }) + note(`The previous code, ${ORIGINAL_GATE}, no longer works.`);
    if (s === 'resolved') return note('If anything else comes up, help is one tap away.');
    return '';
  }
  function acSummary() {
    const r = S.report || {};
    return `<div class="card b-sum">
      <div class="r" style="display:block"><div class="k">Reservation</div><div class="v">The Eastline, Apt 412</div><div class="k">Nov 19 to Dec 19</div></div>
      <div class="r" style="display:block"><div class="k">Topic</div><div class="v">${esc(r.topic || 'Heating and cooling')}</div></div>
      <div class="r" style="display:block"><div class="k">In your words</div><div class="v ${S.description ? '' : 'muted'}">${S.description ? `“${esc(S.description)}”` : 'No description added'}</div></div>
      <div class="r" style="display:block"><div class="k">Photo</div><div class="v ${r.photo ? '' : 'muted'}">${r.photo ? '1 photo' : 'None added'}</div></div></div>`;
  }
  const backTarget = () => {
    if (S.issueType === 'ac' || S.support === 'resolved' || !S.sheets.includes('guide')) return null;
    const id = S.sentEntrance === undefined ? (S.helpContext || 'gate') : S.sentEntrance;
    return { gate: ['gate', 0, 'gate'], garage: ['garage', 0, 'garage'], door: ['door', 3, null] }[id] || null;
  };
  reg('status', { kind: 'sheet', render(S) {
    const m = statusModel(S);
    if (!m.h) {
      const failed = S.support === 'failed', sending = S.support === 'sending';
      return `${sheetHead('Support request')}<div class="scroll" data-scroll="status"><div class="b-pad">${sending ? sendingHead : failed ? notSentHead('summary')
        : `<div class="b-in8" style="display:flex;flex-direction:column;gap:6px"><div class="h2">No open request</div><div class="body muted">Nothing has been sent to Landing support.</div></div>`}</div></div>
        <div class="actions" style="gap:8px">${failed ? '<button class="btn primary" data-act="bStatusReview">Review and send again</button>' : ''}<button class="btn secondary" data-act="closeSheet">Back</button></div>`;
    }
    const lastDone = m.rows.map(r => r[2]).lastIndexOf(true);
    const firstTodo = lastDone + 1;
    const rows = m.rows.map((r, i) => r[2]
      ? `<div class="st done ${i === lastDone ? 'cur' : ''}"><span class="dot">${tick()}</span><span class="grow nm">${r[0]}</span><span class="when">${esc(r[1] || '')}</span></div>`
      : `<div class="st todo"><span class="dot"></span><span class="grow nm">${r[0]}</span>${i === firstTodo && m.rows.length === 5 ? '<span class="when">Next</span>' : ''}</div>`).join('');
    const bt = backTarget();
    return `${sheetHead('Support request')}
      <div class="scroll" data-scroll="status"><div class="b-pad" style="gap:20px">
        <div class="b-in8" style="display:flex;flex-direction:column;gap:8px">
          <div class="b-lab">${icon('checkCircle', 18, 'var(--ok)', 1.75)}<span class="label ok">${esc(m.label)}</span></div>
          <div class="h2">${m.h}</div>${m.p ? `<div class="body muted">${m.p}</div>` : ''}</div>
        <div class="card b-steps">${rows}</div>
        ${statusExtra(S)}
        ${S.viewSent ? `<div style="display:flex;flex-direction:column;gap:8px"><div class="label b-in8">What we sent · ${esc((S.supportTimes || {}).sent || '')}</div>${S.issueType === 'ac' ? acSummary() : gateSummary(true)}</div>` : ''}
      </div></div>
      <div class="actions">
        <button class="btn secondary" data-act="bStatusBack">${bt ? `Back to the ${bt[0]} step` : S.sheets.includes('guide') ? 'Back to the guide' : 'Back to my stay'}</button>
        <button class="b-ulbtn" style="font-size:16px" data-act="bViewSent"><span>${S.viewSent ? 'Hide what we sent' : 'View what we sent'}</span></button>
      </div>`;
  } });

  // ---------- Apartment issue ----------
  const TOPICS = ['Heating and cooling', 'Wi-Fi', 'Appliances', 'Cleaning', 'Something else'];
  const rep = () => S.report || (S.report = { topic: TOPICS[0], text: 'The AC isn’t cooling. It’s set to 70 but the room is at 78.', photo: false, state: null });
  reg('report', { kind: 'sheet', render(S) {
    const r = rep(); const sending = r.state === 'sending', failed = r.state === 'failed';
    const head = sending ? sendingHead : failed ? notSentHead('description')
      : `<div class="b-in8" style="display:flex;flex-direction:column;gap:6px"><div class="h2">What’s going on?</div><div class="body muted">For apartment 412 at The Eastline.</div></div>`;
    return `${sheetHead('Something isn’t right')}
      <div class="scroll" data-scroll="report"><div class="b-pad">${head}
        <div class="b-chips" role="radiogroup" aria-label="Topic">${TOPICS.map(t => `<button class="b-chip ${r.topic === t ? 'on' : ''}" role="radio" aria-checked="${r.topic === t}" data-act="bTopic" data-k="${t}">${r.topic === t ? tick() : ''}${t}</button>`).join('')}</div>
        <div class="b-field"><textarea class="b-ta" rows="3" data-bind="report.text" aria-label="Describe the problem" placeholder="Describe what’s wrong">${esc(r.text)}</textarea>
          ${r.photo ? `<div style="display:flex;align-items:center;gap:10px"><div class="b-thumb" style="width:44px;height:44px">${icon('photo', 20)}</div><div class="grow" style="font-size:15px;line-height:18px;font-weight:500">Photo added</div><button class="b-ul" style="font-size:15px;font-weight:500" data-act="bPhoto">Remove</button></div>`
            : `<button style="display:flex;align-items:center;gap:8px;color:var(--muted);font-size:15px;line-height:18px;font-weight:500;min-height:28px" data-act="bPhoto">${icon('camera', 20, 'var(--muted)')}Add a photo (optional)</button>`}
        </div>
        ${r.topic === TOPICS[0] ? `<div class="b-sunk"><div class="label">One quick check</div>
          <div style="font-size:15px;line-height:22px">The hallway thermostat only cools in <b style="font-weight:600">Cool</b> mode. If it says Auto or Heat, tap Mode until it reads Cool.</div>
          <button class="b-ul" style="font-size:15px;line-height:18px;font-weight:500;align-self:flex-start;padding:6px 0" data-act="bFixed">That fixed it</button></div>` : ''}
      </div></div>
      <div class="actions" style="gap:8px">
        <button class="btn primary" data-act="bReportSend" ${sending ? 'disabled' : ''}>${sending ? 'Sending…' : failed ? 'Try sending again' : 'Send to Landing support'}</button>
        <div class="small muted" style="text-align:center">Goes to a person.</div>
      </div>`;
  } });

  // ---------- Wi-Fi and essentials ----------
  reg('essentials', { kind: 'sheet', render(S) {
    const ess = (t, s) => `<div class="b-ess"><div class="t">${t}</div><div class="s">${s}</div></div>`;
    return `${sheetHead('Wi-Fi and essentials')}
      <div class="scroll" data-scroll="essentials"><div class="b-pad" style="padding-bottom:32px">
        <div class="card" style="padding:20px 20px 18px;display:flex;flex-direction:column;gap:12px">
          <div style="display:flex;align-items:center;gap:14px"><span style="width:24px;display:flex;justify-content:center">${icon('wifi', 22)}</span>
            <div class="grow"><div style="font-size:13px;line-height:18px" class="muted">Wi-Fi network</div><div style="font-size:17px;line-height:24px;font-weight:500">Eastline-412</div></div></div>
          <div class="b-pw"><div class="grow"><div style="font-size:13px;line-height:18px" class="muted">Password</div><div style="font:500 18px/26px var(--mono)">harbor-lantern-58</div></div>
            <button class="btn primary small" style="gap:6px" data-act="bCopyWifi" aria-live="polite">${S.wifiCopied ? tick() + 'Copied' : 'Copy'}</button></div>
          <button class="b-ul" style="font-size:15px;line-height:22px;font-weight:500;align-self:flex-start;padding:4px 2px" data-act="bQr">Show a QR code to join</button>
        </div>
        <div class="b-in8" style="display:flex;flex-direction:column;padding-top:4px">
          <div class="label" style="padding-bottom:4px">First-night essentials</div>
          ${ess('Heating and cooling', 'Thermostat by the hallway')}
          ${ess('Linens and towels', 'Bedroom closet')}
          ${ess('Trash and recycling', 'Chute on floor 4, by elevator B')}
          ${ess('Parking', S.parkingInReservation ? 'Garage on E 5th St, space P2-37' : 'Offered at The Eastline')}
          ${ess('Mail', 'Mailboxes are in the courtyard, on the way to elevator B')}
        </div>
      </div></div>`;
  } });

  // ---------- Actions ----------
  const dropSheets = (...ids) => { S.sheets = S.sheets.filter(x => !ids.includes(x)); };
  Object.assign(actions, {
    bHelpEntrance() { set({ helpView: 'entrance' }); },
    bHelpKeypad() { set({ helpView: 'keypad' }); },
    bHelpBack() { set({ helpView: 'options' }); },
    bHelpDescribe() { openSheet('assist'); },
    bHelpPerson() {
      // A gate request that is already open is shown, not sent twice.
      if (S.issueType === 'gate' && ['received', 'assigned', 'next', 'code'].includes(S.support)) { openSheet('status'); return; }
      if (['received', 'assigned', 'next', 'code', 'resolved'].includes(S.support)) S.support = null;
      S.stayPick = false; S.entPick = false; openSheet('handoff');
    },
    bEntranceMatch() { S.tried.entrance = true; set({ helpView: 'options' }); },
    bEntranceNoMatch() { actions.bHelpPerson(); },
    bKeypadWorked() { dropSheets('help'); S.helpView = 'options'; render(); },
    bKeypadFailed() { S.tried.resend = true; actions.bHelpPerson(); },
    bCall: callToast,

    bChatChip(el) { const c = ctxOf(S.helpContext); postGuest(el.dataset.k === 'full' ? CHIP1(c) : CHIP2, el.dataset.k); },
    bChatSend() {
      const text = (S.chatDraft || '').trim(); if (!text || S.chatBusy) return;
      S.chatDraft = ''; postGuest(text, text.length < 20 ? 'vague' : 'full');
    },
    bChatWorked() { dropSheets('assist', 'help'); S.helpView = 'options'; render(); },
    bChatStill() {
      const c = ctxOf(S.helpContext); S.tried.resend = true;
      postGuest(`Still not opening. I pressed ${c ? lastKeyName(c) : '#'} and waited.`, 'full', { kind: 'escalate', variant: 'retry' });
    },
    bChatAnswer(el) {
      const c = ctxOf(S.helpContext); const k = el.dataset.k;
      const text = { dark: 'The keypad doesn’t light up', rejected: 'The code is rejected', accepted: `The code is accepted but the ${c ? c.thing : 'gate'} stays shut` }[k];
      postGuest(text, 'full', k === 'accepted' ? { kind: 'step' } : { kind: 'escalate', variant: 'nofix' });
    },
    bChatRetry() {
      if (S.offline || S.chatBusy) return;
      const i = S.chat.map(m => !!m.draft).lastIndexOf(true); if (i < 0) return;
      const d = S.chat[i]; S.chat.splice(i); S.chat.push({ from: 'guest', text: d.text });
      botReply(d.forced || replyKind(d.kind));
    },
    bChatKeypad() { dropSheets('assist', 'help'); openSheet('help', { helpView: 'keypad' }); },

    bStayToggle() { set({ stayPick: !S.stayPick, entPick: false }); },
    bStayPick(el) { set({ helpStay: el.dataset.k, stayPick: false, entPick: false, helpView: 'options' }); },
    bEntToggle() { set({ entPick: !S.entPick, stayPick: false }); },
    // What was tried belongs to the entrance it was tried at.
    bEntPick(el) {
      const k = el.dataset.k || null;
      if (k !== S.helpContext) S.tried = { resend: false, entrance: false };
      set({ helpContext: k, entPick: false, helpView: 'options' });
    },
    bSend() {
      if (S.support === 'sending') return;
      S.description = (S.description || '').trim(); S.stayPick = false; S.entPick = false;
      const s0 = S; set({ support: 'sending' });
      setTimeout(() => {
        if (S !== s0 || S.support !== 'sending') return;
        if (S.offline) { set({ support: 'failed' }); return; }
        Object.assign(S, { support: 'received', issueType: 'gate', sentEntrance: (S.helpStay || 'eastline') === 'eastline' && CTX[S.helpContext] ? S.helpContext : null, sentStay: S.helpStay || 'eastline', viewSent: false, supportTimes: { sent: S.time + ' PM', received: S.time + ' PM' } });
        if (S.sheets[S.sheets.length - 1] === 'handoff') replaceSheet('status'); else render();
      }, 900);
    },

    bViewSent() {
      set({ viewSent: !S.viewSent });
      if (S.viewSent) { const n = document.querySelector('#screen [data-scroll="status"]'); if (n) n.scrollTop = n.scrollHeight; }
    },
    bStatusReview() { S.stayPick = false; S.entPick = false; replaceSheet('handoff'); },
    bStatusBack() {
      const bt = backTarget(); S.viewSent = false;
      if (!bt) { if (S.sheets.includes('guide')) { S.sheets = ['guide']; render(); } else closeAll(); return; }
      S.sheets = ['guide']; S.guideView = 'steps'; S.step = bt[1]; if (bt[2]) S.route = bt[2]; S.helpView = 'options'; render();
    },

    bTopic(el) { rep().topic = el.dataset.k; render(); },
    bPhoto() { const r = rep(); r.photo = !r.photo; render(); },
    bFixed() { S.report = null; closeAll(); toast('Glad that worked'); },
    bReportSend() {
      const r = rep(); if (r.state === 'sending') return;
      const s0 = S; r.state = 'sending'; render();
      setTimeout(() => {
        if (S !== s0 || S.report !== r || r.state !== 'sending') return;
        if (S.offline) { r.state = 'failed'; render(); return; }
        r.state = null;
        Object.assign(S, { issueType: 'ac', support: 'received', viewSent: false, description: (r.text || '').trim(), supportTimes: { sent: S.time + ' AM', received: S.time + ' AM' } });
        if (S.sheets[S.sheets.length - 1] === 'report') replaceSheet('status'); else render();
      }, 900);
    },

    bCopyWifi() {
      try { if (navigator.clipboard) navigator.clipboard.writeText('harbor-lantern-58').catch(() => {}); } catch (e) { /* clipboard unavailable */ }
      const s0 = S; set({ wifiCopied: true });
      clearTimeout(actions.bCopyWifi.t); actions.bCopyWifi.t = setTimeout(() => { if (S === s0) set({ wifiCopied: false }); }, 2000);
    },
    bQr() { toast('QR code is not part of this demo'); },
  });
})();
