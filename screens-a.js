/* Landing guest arrival prototype: screens A.
   Pages: launch, home, stays, hub, sms, email. Sheet: guide.
   Uses the shell contract in app.js (S, reg, go, openSheet, set, toast, actions, icon, nav, backBtn, credCard, status helpers). */
(function () {
  // ---------- Local styles (kept here so the shell stays untouched) ----------
  const css = `
  .a-pad { padding: 0 16px 64px; display: flex; flex-direction: column; gap: 16px; }
  .a-h19 { font-size: 19px; line-height: 24px; font-weight: 600; padding: 0 4px; }
  .a-t15 { font-size: 15px; line-height: 22px; }
  .a-t16 { font-size: 16px; line-height: 23px; }
  .a-und { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 4px; }
  .a-load { width: 56px; height: 3px; border-radius: 2px; background: rgba(255,255,255,.22); overflow: hidden; }
  .a-load i { display: block; width: 24px; height: 3px; border-radius: 2px; background: #fff; animation: a-load 1.1s ease-in-out infinite alternate; }
  @keyframes a-load { from { transform: translateX(0); } to { transform: translateX(32px); } }
  .a-tile { position: relative; width: calc(50% - 6px); height: 118px; border-radius: 20px; overflow: hidden; background-size: cover; background-position: 50%; display: flex; align-items: flex-end; }
  .a-tile span { width: 100%; padding: 28px 14px 12px; background: linear-gradient(180deg, rgba(22,27,51,0) 0%, rgba(22,27,51,.65) 100%); color: #fff; font-size: 16px; line-height: 20px; font-weight: 600; }
  .a-hubcard { border-radius: 28px; overflow: hidden; display: flex; flex-direction: column; }
  .a-hubcard .main { display: flex; flex-direction: column; gap: 10px; padding: 24px 24px 20px; }
  .a-hubcard .strip { display: flex; gap: 12px; padding: 16px 24px 20px; background: var(--sunk); }
  .a-rows { display: flex; flex-direction: column; padding: 4px 8px 0; }
  .a-rows .row { width: 100%; }
  .a-slot { display: flex; gap: 12px; padding: 12px 14px; border-radius: 14px; background: var(--sunk); }
  .a-inline { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px 14px; border-radius: 14px; background: var(--surface); border: 1px solid var(--line); }
  .a-inline .top { display: flex; align-items: center; justify-content: space-between; font-size: 14px; line-height: 20px; font-weight: 500; color: var(--muted); }
  .a-inline .status { display: flex; align-items: center; gap: 5px; font-weight: 400; }
  .a-sec { display: flex; gap: 12px; padding: 20px 0; border-bottom: 1px solid var(--line); }
  .a-sec .n, .a-sec .ttl { font-size: 18px; line-height: 26px; font-weight: 600; color: var(--ink); }
  .a-sec .n { width: 16px; flex-shrink: 0; }
  .a-sec .ttl { display: block; width: 100%; }
  .a-illus { position: relative; width: 358px; height: 176px; border-radius: 20px; overflow: hidden; background: var(--sunk); flex-shrink: 0; }
  .a-illus svg { position: absolute; left: 0; top: 0; }
  .a-illus span { position: absolute; font-size: 13px; line-height: 16px; color: var(--ink); white-space: nowrap; }
  .a-photo { width: 358px; height: 176px; border-radius: 20px; background-size: cover; background-position: 50%; flex-shrink: 0; }
  .a-compact .code { font-size: 40px; line-height: 46px; }
  .a-prog { height: 4px; border-radius: 2px; background: var(--line); overflow: hidden; }
  .a-prog i { display: block; height: 4px; border-radius: 2px; background: var(--blue); animation: a-prog 1.2s linear both; }
  @keyframes a-prog { from { width: 6%; } to { width: 100%; } }
  .a-spin { animation: a-spin .9s linear infinite; }
  @keyframes a-spin { to { transform: rotate(360deg); } }
  /* Launch: the mark drops in, lands with a soft squash, then bobs gently while stays load. */
  .a-land { transform-origin: 50% 100%; animation: a-drop 1s cubic-bezier(.3,.9,.4,1) both, a-bob 2.2s ease-in-out 1s infinite; }
  .a-shadow { width: 54px; height: 7px; margin-top: 8px; border-radius: 50%; background: rgba(0,0,0,.38); animation: a-shadow-in 1s cubic-bezier(.3,.9,.4,1) both, a-shadow-bob 2.2s ease-in-out 1s infinite; }
  .a-word { animation: a-word .5s ease .75s both; }
  @keyframes a-drop { 0% { transform: translateY(-190px) rotate(-22deg); opacity: 0; } 25% { opacity: 1; } 62% { transform: translateY(0) rotate(4deg) scale(1.1,.86); } 78% { transform: translateY(-12px) rotate(-2deg) scale(.97,1.04); } 100% { transform: none; } }
  @keyframes a-bob { 0%,100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-7px) rotate(3deg); } }
  @keyframes a-shadow-in { 0% { transform: scale(.2); opacity: 0; } 62% { transform: scale(1.15); opacity: 1; } 78% { transform: scale(.85); } 100% { transform: none; } }
  @keyframes a-shadow-bob { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(.82); opacity: .7; } }
  @keyframes a-word { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) { .a-land, .a-shadow, .a-word { animation: none; } }
  .a-sys { font-family: system-ui, -apple-system, sans-serif; }
  .a-bubble { align-self: flex-start; max-width: 306px; padding: 9px 14px 10px; border-radius: 19px; background: #E9E9EB; color: #000; font-size: 16px; line-height: 21px; flex-shrink: 0; }
  .a-stamp { text-align: center; color: #8E8E93; font-size: 11px; line-height: 14px; flex-shrink: 0; }
  @media (prefers-reduced-motion: reduce) { .a-load i, .a-spin { animation: none; } }
  `;
  const st = document.createElement('style'); st.id = 'screens-a-style'; st.textContent = css; document.head.appendChild(st);

  // ---------- Small helpers ----------
  const svg = (w, vb, inner, extra = '') => `<svg width="${w}" height="${w}" viewBox="0 0 ${vb} ${vb}" fill="none" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;${extra}">${inner}</svg>`;
  const cloudOff = (size, color = 'var(--warn)') => svg(size, 22, `<path d="M6.5 17.5h9a3.5 3.5 0 0 0 1.7-6.560M14.8 8.300A5 5 0 0 0 7.400 6.500M5.600 8.800A4.400 4.400 0 0 0 6.500 17.500M4 3.500l14 15" stroke="${color}" stroke-width="1.6"/>`);
  const okDisc = () => svg(24, 24, `<circle cx="12" cy="12" r="10" fill="var(--ok)"/><path d="M7.5 12.300l3 3 6-6.300" stroke="#fff" stroke-width="2"/>`);
  const SAVED_AT = '2:35 PM';
  const gateSupportOpen = () => ['received', 'assigned', 'next', 'code'].includes(S.support) && S.issueType === 'gate';
  const savedOffline = () => S.offline && S.saved === 'saved';

  // =====================================================================
  // Launch
  // =====================================================================
  reg('launch', {
    kind: 'page', dark: true,
    render: () => `<div class="page dark" data-go="home" style="align-items:center">
      <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding-bottom:60px">
        <img class="a-land" src="assets/mark-white.png" alt="" style="width:72px;height:72px;object-fit:contain">
        <div class="a-shadow"></div>
        <img class="a-word" src="assets/word-white.png" alt="Landing" style="width:150px;height:24px;object-fit:contain;margin-top:14px">
      </div>
    </div>`,
  });

  // =====================================================================
  // Home
  // =====================================================================
  const tile = (name, file) => `<button class="a-tile" data-act="notInDemo" style="background-image:url(assets/${file})"><span>${name}</span></button>`;
  reg('home', {
    kind: 'page',
    render: () => `<div class="page">
      <div style="display:flex;align-items:center;gap:10px;padding:10px 24px 0;flex-shrink:0">
        <img src="assets/mark-ink.png" alt="" style="width:28px;height:28px;object-fit:contain">
        <img src="assets/word-ink.png" alt="Landing" style="width:94px;height:15px;object-fit:contain">
      </div>
      <div class="scroll" data-scroll="home">
        <div style="display:flex;flex-direction:column;gap:20px;padding:28px 16px 64px">
          <button data-act="notInDemo" style="display:flex;align-items:center;gap:12px;height:56px;padding:0 20px;border-radius:999px;background:var(--surface);border:1.5px solid var(--ink);flex-shrink:0">
            ${icon('search', 20, 'var(--ink)')}<span class="muted" style="font-size:16px;line-height:20px">Search a city or neighborhood</span>
          </button>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="a-h19">Your next stay</div>
            <button class="card" data-go="hub" style="display:flex;align-items:center;gap:14px;padding:12px 16px 12px 12px">
              <span style="width:76px;height:76px;border-radius:12px;background:url(assets/gate.jpg) 50%/cover;flex-shrink:0"></span>
              <span class="grow" style="display:flex;flex-direction:column;gap:1px">
                <span class="label blue">In 3 days</span>
                <span class="serif" style="font-size:24px;line-height:28px">The Eastline</span>
                <span class="a-t15 muted">Austin, TX · Nov 19 to Dec 19</span>
              </span>
              ${icon('chevR', 20, 'var(--muted)', 1.75)}
            </button>
          </div>
          <div style="display:flex;flex-direction:column;gap:14px">
            <div class="a-h19">Find your next Landing</div>
            <div style="display:flex;flex-wrap:wrap;gap:12px">
              ${tile('Austin', 'city-austin.jpg')}${tile('Birmingham', 'city-birmingham.jpg')}${tile('Nashville', 'city-nashville.jpg')}${tile('Tampa', 'city-tampa.jpg')}
            </div>
          </div>
        </div>
      </div>
      ${nav('search')}
    </div>`,
  });

  // =====================================================================
  // Stays
  // =====================================================================
  reg('stays', {
    kind: 'page',
    render: () => {
      const tab = (t, on) => on
        ? `<div style="padding-bottom:10px;border-bottom:2px solid var(--blue);font-size:16px;line-height:20px;font-weight:600">${t}</div>`
        : `<button data-act="notInDemo" class="muted" style="padding-bottom:12px;font-size:16px;line-height:20px;font-weight:500">${t}</button>`;
      return `<div class="page">
        <div style="display:flex;flex-direction:column;gap:18px;padding:12px 24px 0;flex-shrink:0">
          <div class="h1">Stays</div>
          <div style="display:flex;gap:24px;border-bottom:1px solid var(--line)">${tab('Current')}${tab('Upcoming', true)}${tab('Past')}${tab('Canceled')}</div>
        </div>
        <div class="scroll" data-scroll="stays">
          <div style="display:flex;flex-direction:column;padding:8px 24px 64px">
            <button data-go="hub" style="display:flex;align-items:center;gap:16px;padding:16px 0;border-bottom:1px solid var(--line)">
              <span style="width:96px;height:96px;border-radius:16px;background:url(assets/gate.jpg) 50%/cover;flex-shrink:0"></span>
              <span class="grow" style="display:flex;flex-direction:column;gap:2px">
                <span class="label blue">In 3 days</span>
                <span style="font-size:18px;line-height:24px;font-weight:600">The Eastline, Apt 412</span>
                <span class="a-t15 muted">Austin, TX</span>
                <span class="a-t15 muted">Nov 19 to Dec 19, 2026</span>
              </span>
              ${icon('chevR', 20, 'var(--muted)', 1.75)}
            </button>
            <div class="a-t15 muted" style="padding-top:20px">One upcoming stay.</div>
          </div>
        </div>
        ${nav('stays')}
      </div>`;
    },
  });

  // =====================================================================
  // Stay hub
  // =====================================================================
  const ROUTES = {
    gate: ['gate', 'courtyard', 'elevator', 'door'],
    garage: ['garage', 'parking', 'walk', 'door'],
  };
  const RAIL = { gate: 'Gate', courtyard: 'Courtyard', elevator: 'Elevator B', door: 'Apt 412', garage: 'Garage', parking: 'Parking', walk: 'Elevator B' };
  const HUBNEXT = {
    gate: ['Next: the side gate', 'On Navasota St, beneath the blue awning. Your gate code and photo are ready.', 'Continue to the gate', 'Side gate'],
    courtyard: ['Next: the courtyard', 'Walk straight through the courtyard. Elevator B is on the far left, past the mailboxes.', 'Continue to the courtyard', 'Courtyard'],
    elevator: ['Next: elevator B', 'Take elevator B to floor 4, then turn right out of the elevator.', 'Continue to elevator B', 'Elevator B'],
    door: ['Next: apartment 412', 'Third door on the left. Your apartment code is ready.', 'Continue to apartment 412', 'Apartment 412'],
    garage: ['Next: the garage entrance', 'On E 5th St, around the block from the main address. Your garage code is ready.', 'Continue to the garage', 'Garage entrance'],
    parking: ['Next: your parking space', 'Take the ramp down to level P2. Your space is P2-37.', 'Continue to parking', 'Parking'],
    walk: ['Next: elevator B', 'Follow the blue stripe on the floor to the elevator lobby.', 'Continue to elevator B', 'Elevator B'],
  };
  const curStep = () => ROUTES[S.route][Math.min(S.step, 3)];

  function hubCard({ label, labelCls = '', title, body, btn, btnAttrs, strip }) {
    return `<div class="card a-hubcard">
      <div class="main">
        <div class="label ${labelCls}">${label}</div>
        <div class="h2">${title}</div>
        <div class="muted" style="font-size:16px;line-height:24px">${body}</div>
        <button class="btn primary" ${btnAttrs}>${btn}${icon('arrow', 20, '#fff', 1.75)}</button>
      </div>
      ${strip ? `<div class="strip">${strip[0]}<div class="grow" style="display:flex;flex-direction:column;gap:2px"><div class="a-t15" style="font-weight:500">${strip[1]}</div>${strip[2] ? `<div class="a-t15 muted">${strip[2]}</div>` : ''}</div></div>` : ''}
    </div>`;
  }

  function supportCard() {
    const t = S.supportTimes || {};
    const chk = icon('checkCircle', 22, 'var(--ink)');
    if (S.support === 'code') return hubCard({
      label: 'Support request · New code', labelCls: 'blue', title: 'Your new gate code is ready',
      body: 'Alex from Landing support issued a new code for the side gate. The previous code, 4827, no longer works.',
      btn: 'Open the gate step', btnAttrs: 'data-act="openGuide" data-view="steps" data-route="gate" data-step="0"',
      strip: [chk, `New code issued at ${t.code || ''}`, 'It also arrived by text.'],
    });
    if (S.support === 'received') return hubCard({
      label: 'Support request · Received', labelCls: 'blue', title: 'Your request has been received',
      body: 'Landing support has your request about the side gate. You will see who is helping as soon as it is assigned.',
      btn: 'View request', btnAttrs: 'data-open="status"',
      strip: [chk, `Received at ${t.received || ''}`, 'No wait time has been shared yet.'],
    });
    const next = S.support === 'next';
    return hubCard({
      label: 'Support request · Assigned', labelCls: 'blue', title: 'Alex is working on the side gate',
      body: next && S.replacementSupported ? 'A new gate code is being issued. It will appear on your gate step and arrive by text.'
        : next ? 'Alex has confirmed the next step. The details are in your request.'
        : 'Alex from Landing support is looking into the side gate now.',
      btn: 'View request', btnAttrs: 'data-open="status"',
      strip: [chk, next ? `Next action confirmed at ${t.next || ''}` : `Assigned at ${t.assigned || ''}`, 'No wait time has been shared yet.'],
    });
  }

  function settledCard() {
    const copyBtn = S.wifiCopied
      ? `<button class="btn primary small" data-act="copyWifi" style="gap:6px">${icon('check', 16, '#fff', 2)}Copied</button>`
      : `<button class="btn primary small" data-act="copyWifi">Copy</button>`;
    const prompt = S.allGood
      ? `<div style="display:flex;gap:12px;align-items:flex-start">${icon('checkCircle', 22, 'var(--ok)')}<div class="grow"><div style="font-size:16px;line-height:22px;font-weight:500">Glad everything looks good.</div><div class="a-t15 muted">Help is here whenever you need it.</div></div></div>`
      : `<div style="font-size:16px;line-height:22px;font-weight:500">Everything looking okay?</div>
         <div style="display:flex;gap:8px">
           <button class="pill" style="flex:1 1 0;padding:0 8px" data-act="allGood">All good</button>
           <button class="pill" style="flex:1.4 1 0;padding:0 8px" data-act="reportIssue">Something isn’t right</button>
         </div>`;
    return `<div class="card a-hubcard">
      <div class="main">
        <div class="label">Getting settled</div>
        <div class="h2">You’ve landed, Samantha.</div>
        <div class="muted" style="font-size:16px;line-height:24px">Get connected and make yourself comfortable.</div>
        <div style="display:flex;flex-direction:column;gap:12px;padding-top:10px">
          <div style="display:flex;align-items:center;gap:14px">
            <div style="width:24px;display:flex;justify-content:center;flex-shrink:0">${icon('wifi', 22)}</div>
            <div class="grow"><div class="muted" style="font-size:13px;line-height:18px">Wi-Fi network</div><div style="font-size:17px;line-height:24px;font-weight:500">Eastline-412</div></div>
          </div>
          <div class="sunk" style="display:flex;align-items:center;gap:14px;padding:12px 12px 12px 16px">
            <div class="grow"><div class="muted" style="font-size:13px;line-height:18px">Password</div><div style="font:500 18px/26px var(--mono)">harbor-lantern-58</div></div>
            ${copyBtn}
          </div>
          <div style="padding-left:2px"><button class="a-t15 a-und" style="font-weight:500" data-act="notInDemo">Show a QR code to join</button></div>
        </div>
      </div>
      <div class="strip" style="flex-direction:column">${prompt}</div>
    </div>`;
  }

  function acRow() {
    const t = S.supportTimes || {};
    const sub = {
      sending: 'Sending your request', failed: 'Not sent yet. Open to try again.',
      received: `Received ${t.received || ''}`.trim(), assigned: `Assigned ${t.assigned || ''}`.trim(),
      next: `Next step confirmed ${t.next || ''}`.trim(), resolved: 'Resolved',
    }[S.support] || '';
    const failed = S.support === 'failed';
    return `<button class="card" data-open="status" style="display:flex;align-items:center;gap:14px;padding:14px 16px;width:100%">
      <span style="width:24px;display:flex;justify-content:center;flex-shrink:0">${icon(failed ? 'alert' : 'chat', 22, failed ? 'var(--err)' : 'var(--blue)')}</span>
      <span class="grow"><span style="display:block;font-size:16px;line-height:22px;font-weight:500">Your air conditioning request</span><span class="small ${failed ? '' : 'muted'}" style="display:block${failed ? ';color:var(--err)' : ''}">${sub}</span></span>
      ${icon('chevR', 20, 'var(--muted)', 1.75)}
    </button>`;
  }

  function hubRows() {
    const key = curStep();
    const guideSub = S.stage === 'before' ? 'Directions and photos ready now'
      : S.stage === 'ready' ? (S.saved === 'saved' ? `Codes ready · Saved for offline ${SAVED_AT}` : 'Codes ready')
      : S.stage === 'inside' ? `Step ${Math.min(S.step, 3) + 1} of 4 · ${HUBNEXT[key][3]}`
      : 'Route, gate code and apartment code';
    const row = (ic, t, s, attrs) => `<button class="row" ${attrs}><span class="ico">${icon(ic, 22)}</span><span class="grow"><span class="t" style="display:block">${t}</span><span class="s" style="display:block">${s}</span></span>${icon('chevR', 20, 'var(--muted)', 1.75)}</button>`;
    return `<div class="a-rows">
      ${row('key', 'Arrival guide and codes', guideSub, `data-act="openGuide" data-view="${S.stage === 'inside' ? 'steps' : 'overview'}"`)}
      ${row('wifi', 'Wi-Fi and essentials', 'Network, parking, trash, mail', 'data-open="essentials"')}
      ${row('chat', 'Help with your stay', 'Answers first, a person when you want one', 'data-act="openHelp"')}
    </div>
    <button class="sunk" data-act="notInDemo" style="display:flex;align-items:center;gap:14px;padding:16px;width:100%">
      ${icon('personPlus', 22)}
      <span class="grow"><span style="display:block;font-size:16px;line-height:22px;font-weight:500">Traveling with others?</span><span class="small muted" style="display:block">Share the arrival guide with companions.</span></span>
      ${icon('chevR', 20, 'var(--muted)', 1.75)}
    </button>`;
  }

  reg('hub', {
    kind: 'page',
    render: () => {
      const eyebrow = { before: 'In 3 days', ready: 'Check-in today', inside: 'Check-in day', settled: 'Night 1 of 30' }[S.stage] || 'In 3 days';
      let card, extra = '';
      if (gateSupportOpen() && S.stage !== 'settled') card = supportCard();
      else if (S.stage === 'ready') card = hubCard({
        label: 'Ready to arrive', title: 'Your arrival guide is ready', body: 'Codes, entrance photos and the route to apartment 412.',
        btn: 'Open arrival guide', btnAttrs: 'data-act="openGuide" data-view="overview"',
        strip: [icon('unlock', 22), 'Access codes are available', 'They become active at 3 PM, when check-in begins.'],
      });
      else if (S.stage === 'inside') {
        const n = HUBNEXT[curStep()];
        card = hubCard({
          label: 'Getting inside', title: n[0], body: n[1], btn: n[2], btnAttrs: 'data-act="openGuide" data-view="steps"',
          strip: S.offline
            ? [cloudOff(22, 'var(--ink)'), 'You’re offline', S.saved === 'saved' ? `Your guide was saved at ${SAVED_AT}.` : 'The guide was not saved on this phone.']
            : [icon('checkCircle', 22, 'var(--ok)'), 'Your codes are valid now', S.saved === 'saved' ? `Guide saved for offline at ${SAVED_AT}.` : 'The guide is not saved for offline yet.'],
        });
      } else if (S.stage === 'settled') {
        card = settledCard();
        if (S.support && S.issueType === 'ac') card += acRow();
        extra = `<div style="display:flex;flex-direction:column;padding:8px 8px 0">
          <div class="label" style="padding-bottom:4px">First-night essentials</div>
          ${[['Heating and cooling', 'Thermostat by the hallway'], ['Linens and towels', 'Bedroom closet'], ['Trash and recycling', 'Chute on floor 4, by elevator B']].map(([a, b], i) => `<div style="display:flex;flex-direction:column;gap:2px;padding:12px 0;${i < 2 ? 'border-bottom:1px solid var(--line)' : ''}"><div style="font-size:16px;line-height:22px;font-weight:500">${a}</div><div class="muted" style="font-size:15px;line-height:18px">${b}</div></div>`).join('')}
        </div>`;
      } else card = hubCard({
        label: 'Before arrival', title: 'Your stay is coming up', body: 'See how to find the entrance and reach your apartment.',
        btn: 'View arrival guide', btnAttrs: 'data-act="openGuide" data-view="overview"',
        strip: [icon('lock', 22), 'Access codes available November 19 at 2:30 PM', 'Entry begins at 3 PM.'],
      });
      return `<div class="page">
        <div class="scroll" data-scroll="hub">
          <div style="display:flex;flex-direction:column;gap:6px;padding:12px 24px 20px">
            <div style="display:flex;padding-bottom:12px">${backBtn('data-go="stays"')}</div>
            <div class="label blue">Your stay · ${eyebrow}</div>
            <div class="h1">The Eastline</div>
            <div class="muted" style="font-size:16px;line-height:24px">Apartment 412 · Nov 19 to Dec 19<br>1820 E 4th St, Austin, TX</div>
          </div>
          <div class="a-pad">${card}${extra}${hubRows()}</div>
        </div>
        ${nav('stays')}
      </div>`;
    },
  });

  // =====================================================================
  // Arrival guide (sheet)
  // =====================================================================
  const lockedSlot = (label, l1 = 'Available November 19 at 2:30 PM', l2 = 'Entry begins at 3 PM.') => `<div class="a-slot">${icon('lock', 22)}
    <div class="grow"><div style="font-size:14px;line-height:20px;font-weight:500" class="muted">${label}</div><div class="a-t15" style="font-weight:500">${l1}</div><div class="a-t15 muted">${l2}</div></div></div>`;
  const notSavedSlot = label => lockedSlot(label, 'Not in your saved copy', 'Codes need a connection to retrieve.');
  const codeHidden = () => !S.codesReleased ? 'locked' : (S.offline && !S.savedWithCodes) ? 'unsaved' : null;
  function credStatus(isGate) {
    if (S.offline) return statusMuted(`Saved copy · ${SAVED_AT}`, 'download');
    if (isGate && S.codeReplaced) return statusBlue('Updated ' + ((S.supportTimes && S.supportTimes.code) || ''));
    if (S.codesActive) return statusOk('Valid now');
    return statusMuted('Active from 3 PM');
  }
  function inlineCred(label, code, key, note, isGate) {
    const h = codeHidden();
    if (h === 'locked') return lockedSlot(label);
    if (h === 'unsaved') return notSavedSlot(label);
    const status = S.offline ? statusMuted(`Saved copy · ${SAVED_AT}`, 'download') : !S.codesActive ? statusMuted('Active from 3 PM') : '';
    const k = key === 'check' ? `<span class="key" style="display:flex">${icon('check', 28, 'var(--ink)', 2.1)}</span>` : `<span class="key">#</span>`;
    return `<div class="a-inline"><div class="top"><span>${label}</span><span class="status">${status}</span></div>
      <div class="code md" style="align-items:${key === 'check' ? 'center' : 'baseline'}"><span>${esc(code)}</span>${k}</div>
      <div class="a-t15">${note}</div>
      ${isGate && S.codeReplaced ? `<div class="a-t15" style="color:var(--blue);font-weight:500">Updated by Landing support. 4827 no longer works.</div>` : ''}</div>`;
  }

  function parkingBlock() {
    const chev = icon(S.parkingOpen ? 'chevU' : 'chevD', 20, 'var(--muted)', 1.75);
    const named = S.parkingOpen || S.parkingInReservation;
    const head = `<button data-act="toggleParking" style="display:flex;align-items:center;gap:14px;width:100%">
      <span style="width:24px;display:flex;justify-content:center;flex-shrink:0">${icon('car', 22, 'var(--ink)', 1.5)}</span>
      <span class="grow"><span style="display:block;font-size:17px;line-height:24px;font-weight:500">${named ? 'Parking' : 'Bringing a car?'}</span>
      <span class="small muted" style="display:block">${named ? (S.parkingInReservation ? 'Included with your stay' : 'Offered at The Eastline') : 'Garage entrance and where to park'}</span></span>${chev}</button>`;
    if (!S.parkingOpen) return `<div style="padding:0 16px 12px"><div class="card" style="padding:14px 16px">${head}</div></div>`;
    const h = codeHidden();
    const code = h === 'locked' ? lockedSlot('Garage code') : h === 'unsaved' ? notSavedSlot('Garage code')
      : `<div class="sunk" style="display:flex;flex-direction:column;gap:2px;padding:12px 16px 14px">
          <div class="muted" style="font-size:14px;line-height:18px;font-weight:500">Garage code</div>
          <div class="code md"><span>6150</span><span class="key">#</span></div>
          <div class="small">Press # after the digits. For the garage door only.</div></div>`;
    return `<div style="padding:0 16px 12px"><div class="card" style="display:flex;flex-direction:column;gap:14px;padding:16px 16px 18px">
      ${head}
      <div style="display:flex;flex-direction:column;gap:4px;padding-top:14px;border-top:1px solid var(--line)">
        <div style="font-size:16px;line-height:22px;font-weight:600">Garage entrance on E 5th St</div>
        <div class="a-t15">Around the block from the main address. Gray roll-up door. The keypad is on the driver side post.</div>
        <div><button class="a-t15 a-und" style="color:var(--blue);font-weight:500" data-act="notInDemo">Get directions to the garage</button></div>
      </div>
      ${code}
      <div style="display:flex;flex-direction:column;gap:4px">
        <div style="font-size:16px;line-height:22px;font-weight:600">Your space: P2-37</div>
        <div class="a-t15">Take the ramp down to level P2. Then follow the blue stripe to elevator B and pick the route up from there.</div>
      </div>
      <button class="btn secondary" style="height:52px;font-size:16px" data-act="startGarage">Start from the garage</button>
    </div></div>`;
  }

  function saveBlock() {
    let inner;
    if (S.saved === 'saving') inner = `<div class="card" style="display:flex;flex-direction:column;gap:12px;padding:14px 16px 16px">
        <div style="display:flex;align-items:center;gap:12px">
          <span class="a-spin" style="display:flex">${svg(22, 22, `<circle cx="11" cy="11" r="7.5" stroke="var(--line)" stroke-width="2"/><path d="M11 3.5a7.5 7.5 0 0 1 7.5 7.5" stroke="var(--blue)" stroke-width="2"/>`)}</span>
          <div class="grow"><div style="font-size:16px;line-height:22px;font-weight:600">Saving arrival guide</div><div class="small muted">${S.codesReleased ? 'Saving directions, photos and codes' : 'Saving directions and photos'}</div></div>
        </div>
        <div class="a-prog"><i></i></div></div>`;
    else if (S.saved === 'saved' && S.savedWithCodes) inner = `<div style="display:flex;gap:12px;padding:16px;border-radius:20px;background:var(--ok-tint)">${okDisc()}
        <div class="grow" style="display:flex;flex-direction:column;gap:2px">
          <div style="font-size:16px;line-height:24px;font-weight:600">Arrival guide saved</div>
          <div class="a-t15">Includes directions and access codes. Updated today at ${SAVED_AT}.</div>
          <div style="padding-top:6px"><button class="a-t15 a-und" style="font-weight:500" data-act="saveGuide">Update saved copy</button></div>
        </div></div>`;
    else if (S.saved === 'saved') inner = `<div class="card" style="overflow:hidden;display:flex;flex-direction:column">
        <div style="display:flex;gap:12px;padding:14px 16px">${icon('checkCircle', 22, 'var(--ok)', 1.7)}
          <div class="grow" style="display:flex;flex-direction:column;gap:2px"><div style="font-size:16px;line-height:22px;font-weight:600">Arrival guide saved</div><div class="small muted">Includes directions and photos.</div></div></div>
        <div style="display:flex;gap:12px;padding:12px 16px 14px;background:var(--sunk)">${icon('lock', 22)}
          <div class="grow small">${S.codesReleased
            ? '<b style="font-weight:600">Codes are not saved yet.</b> Codes are available now. Update the saved copy to include them.'
            : '<b style="font-weight:600">Codes are not saved yet.</b> Codes are released November 19 at 2:30 PM and will need to be retrieved then.'}
            <div style="padding-top:6px"><button class="a-t15 a-und" style="font-weight:500" data-act="saveGuide">Update saved copy</button></div></div></div></div>`;
    else if (S.saved === 'error') inner = `<div style="display:flex;align-items:center;gap:12px;padding:14px 14px 14px 16px;border-radius:16px;background:var(--err-tint);border:1px solid var(--err)">
        ${icon('alert', 22, 'var(--err)', 1.7)}
        <div class="grow" style="display:flex;flex-direction:column;gap:2px"><div style="font-size:16px;line-height:22px;font-weight:600">Couldn’t save the guide</div><div class="small">Nothing was saved. Check your connection and try again.</div></div>
        <button class="btn secondary small" style="padding:0 16px" data-act="saveGuide">Retry</button></div>`;
    else inner = `<div class="card" style="display:flex;flex-direction:column;gap:12px;padding:16px">
        <button class="btn secondary" style="height:52px;border-radius:14px;background:transparent" data-act="saveGuide">${icon('download', 20, 'var(--ink)', 1.75)}Save for offline</button>
        <div class="a-t15 muted" style="padding:0 4px">${S.codesReleased ? 'Keeps directions, photos and codes on this phone.' : 'Directions and photos can be saved now. Codes will need to be retrieved after they are released.'}</div></div>`;
    return `<div style="padding:8px 16px 40px">${inner}</div>`;
  }

  function overviewBody() {
    const sec = (n, title, jump, body, gap = 8) => `<div class="a-sec" data-sec="${n}"><div class="n">${n}</div>
      <div class="grow" style="display:flex;flex-direction:column;gap:${gap}px">
        ${jump ? `<button class="ttl" data-act="jumpStep" ${jump}>${title}</button>` : `<div class="ttl">${title}</div>`}${body}</div></div>`;
    return `${parkingBlock()}
      <div style="display:flex;flex-direction:column;padding:0 24px">
        ${sec(1, 'Get to the building', '', `<div style="display:flex;align-items:flex-start;gap:12px">
            <div class="grow" style="display:flex;flex-direction:column;gap:4px"><div class="a-t16">1820 E 4th St, Austin, TX</div>
            <div><button class="a-t16 a-und" style="color:var(--blue);font-weight:500" data-act="notInDemo">Get directions</button></div></div>
            <div style="width:96px;height:72px;border-radius:12px;background:url(assets/gate.jpg) 50%/cover;flex-shrink:0"></div></div>
          <div class="a-t16">The guest entrance is the side gate on Navasota St, not the main lobby on E 4th St.</div>`)}
        ${sec(2, 'Side gate on Navasota St', 'data-route="gate" data-step="0"', `<div class="a-t16">Black gate beneath the blue awning. The keypad is on the right.</div>${inlineCred('Gate code', S.gateCode, '#', 'Press # after the digits.', true)}`, 10)}
        ${sec(3, 'Courtyard', 'data-route="gate" data-step="1"', `<div class="a-t16">Walk straight through the courtyard. Elevator B is on the far left, past the mailboxes.</div>`)}
        ${sec(4, 'Elevator B to floor 4', 'data-step="2"', `<div class="a-t16">Turn right out of the elevator.</div>`)}
        ${sec(5, 'Apartment 412', 'data-step="3"', `<div class="a-t16">Third door on the left.</div>${inlineCred('Apartment code', '731904', 'check', 'Press the checkmark key after the digits.')}`, 10)}
        <button data-act="guideHelp" style="display:flex;align-items:center;gap:12px;padding:18px 0;width:100%">
          <span style="width:28px;display:flex;flex-shrink:0">${icon('help', 22)}</span>
          <span class="grow a-t16">Something not matching? <span class="a-und" style="font-weight:500">Get help</span></span>${icon('chevR', 20, 'var(--muted)', 1.75)}</button>
      </div>
      ${saveBlock()}`;
  }

  // Route illustrations, recreated from the Paper file.
  const ILLUS = {
    courtyard: `<div class="a-illus"><svg width="358" height="176" viewBox="0 0 358 176" fill="none">
        <rect x="24" y="20" width="310" height="124" rx="14" stroke="#A9A698" stroke-width="1.5"/>
        <circle cx="262" cy="62" r="14" fill="#DDD6C8"/><circle cx="292" cy="100" r="10" fill="#DDD6C8"/><circle cx="238" cy="106" r="8" fill="#DDD6C8"/>
        <rect x="112" y="30" width="44" height="12" rx="3" stroke="var(--ink)" stroke-width="1.5"/><path d="M123 30v12M134 30v12M145 30v12" stroke="var(--ink)" stroke-width="1.2"/>
        <path d="M179 138V64H78" stroke="var(--blue)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 9"/>
        <path d="M88 57l-8 7 8 7" stroke="var(--blue)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="40" y="48" width="32" height="32" rx="8" fill="var(--blue)"/><rect x="165" y="138" width="28" height="12" rx="3" fill="var(--ink)"/></svg>
      <span style="left:40px;top:48px;width:32px;height:32px;line-height:32px;text-align:center;color:#fff;font-size:17px;font-weight:600">B</span>
      <span style="left:36px;top:86px;font-weight:600">Elevator B</span><span style="left:164px;top:28px">Mailboxes</span>
      <span style="left:201px;top:148px">Side gate</span><span style="left:228px;top:122px;color:var(--muted)">Courtyard</span></div>`,
    elevator: `<div class="a-illus"><svg width="358" height="176" viewBox="0 0 358 176" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M84 66H334M84 114H334M140 66v-10M196 66v-10M252 66v-10M308 66v-10" stroke="#A9A698" stroke-width="1.5"/>
        <path d="M160 66h18M216 66h18" stroke="var(--ink)" stroke-width="4"/><path d="M272 66h18" stroke="var(--blue)" stroke-width="5"/>
        <path d="M84 90H281V78" stroke="var(--blue)" stroke-width="3.5" stroke-dasharray="1 9"/><path d="M274 82l7-8 7 8" stroke="var(--blue)" stroke-width="2.5"/>
        <rect x="40" y="74" width="32" height="32" rx="8" fill="var(--ink)"/></svg>
      <span style="left:40px;top:74px;width:32px;height:32px;line-height:32px;text-align:center;color:#fff;font-size:17px;font-weight:600">B</span>
      <span style="left:24px;top:122px">Elevator B</span><span style="left:268px;top:36px;color:var(--blue);font-size:14px;font-weight:600">412</span>
      <span style="left:236px;top:122px;color:var(--muted)">Floor 4 hallway</span><span style="left:92px;top:96px">Turn right</span></div>`,
    garage: `<div class="a-illus"><svg width="358" height="176" viewBox="0 0 358 176" fill="none">
        <path d="M24 146H334" stroke="var(--ink)" stroke-width="1.5" stroke-linecap="round"/><path d="M128 146V40h160v106" stroke="var(--ink)" stroke-width="1.5" stroke-linejoin="round"/>
        <rect x="140" y="52" width="136" height="94" fill="#D5D2CA"/><path d="M140 66h136M140 80h136M140 94h136M140 108h136M140 122h136M140 136h136" stroke="#A9A698" stroke-width="1.5"/>
        <path d="M88 146V104" stroke="var(--ink)" stroke-width="3" stroke-linecap="round"/><rect x="78" y="80" width="20" height="26" rx="4" fill="var(--blue)"/>
        <g fill="#fff"><circle cx="84" cy="88" r="1.5"/><circle cx="92" cy="88" r="1.5"/><circle cx="84" cy="94" r="1.5"/><circle cx="92" cy="94" r="1.5"/><circle cx="84" cy="100" r="1.5"/><circle cx="92" cy="100" r="1.5"/></g></svg>
      <span style="left:36px;top:58px;font-weight:600">Keypad post</span><span style="left:154px;top:20px">Gray roll-up door</span><span style="left:286px;top:152px;color:var(--muted)">E 5th St</span></div>`,
  };

  function stepCred(key) {
    const def = {
      gate: [S.codeReplaced ? 'New gate code' : 'Gate code', S.gateCode, '#', 'Press # after the digits. Wait for the green light, then pull the gate.'],
      door: ['Apartment code', '731904', 'check', 'Press the checkmark key after the digits. Turn the handle when the lock clicks.'],
      garage: ['Garage code', '6150', '#', 'Press # after the digits. The door takes a few seconds to open.'],
    }[key];
    const h = codeHidden();
    if (h === 'locked') return lockedSlot(def[0]);
    if (h === 'unsaved') return notSavedSlot(def[0]);
    return credCard({ label: def[0], code: def[1], key: def[2], status: credStatus(key === 'gate'), note: def[3] });
  }

  const STEPS = {
    gate: { title: 'Side gate on Navasota St', text: 'Black gate beneath the blue awning. The keypad is on the right.', photo: 'gate.jpg', cred: true, btn: 'I’m through the gate', ctx: 'gate' },
    courtyard: { title: 'Through the courtyard', text: 'Walk straight through the courtyard. Elevator B is on the far left, past the mailboxes.', illus: 'courtyard', btn: 'I’m at elevator B', ctx: 'courtyard' },
    elevator: { title: 'Elevator B to floor 4', text: 'Take elevator B to floor 4. Turn right out of the elevator. Apartment 412 is the third door on the left.', illus: 'elevator', btn: 'I’m on floor 4', ctx: 'elevator' },
    door: { title: 'Apartment 412', text: 'Floor 4. Turn right out of elevator B. Third door on the left.', photo: 'door.jpg', cred: true, btn: 'I’m inside', ctx: 'door' },
    garage: { title: 'Garage entrance on E 5th St', text: 'Gray roll-up door. The keypad is on the driver side post.', illus: 'garage', cred: true, btn: 'I’m in the garage', ctx: 'garage' },
    parking: { title: 'Park in space P2-37', text: 'Take the ramp down to level P2. Your space number is painted on the wall.', btn: 'I’ve parked', ctx: 'parking' },
    walk: { title: 'Walk to elevator B', text: 'Follow the blue stripe on the floor to the elevator lobby. It is the same elevator B as the route from the side gate.', btn: 'I’m at elevator B', ctx: 'elevator' },
  };

  function stepsView() {
    const keys = ROUTES[S.route] || ROUTES.gate;
    const i = Math.max(0, Math.min(S.step, keys.length - 1));
    const key = keys[i], d = STEPS[key];
    const replaced = key === 'gate' && S.codeReplaced && !codeHidden();
    const compact = replaced || savedOffline();
    const photoH = replaced ? 84 : savedOffline() ? 108 : 176;
    const rail = `<div class="rail">${keys.map((k, n) => `<button class="${n === i ? 'on' : ''}" data-act="railStep" data-step="${n}"><i></i><span><b>${n + 1}.</b> ${RAIL[k]}</span></button>`).join('')}</div>`;
    const media = d.photo ? `<div class="a-photo" style="height:${photoH}px;background-image:url(assets/${d.photo})"></div>` : d.illus ? ILLUS[d.illus] : '';
    const banner = replaced ? `<div class="banner info">${icon('person', 20, 'var(--blue)')}<div class="grow"><b style="font-weight:600">Alex from Landing support issued a new code.</b> The previous code, 4827, no longer works.</div></div>` : '';
    const cred = d.cred ? stepCred(key)
      : key === 'parking' ? `<div class="card cred"><div class="top"><span>Your space</span></div><div class="code"><span>P2-37</span></div><div style="font-size:15px;line-height:22px">Level P2. Reserved for apartment 412 during your stay.</div></div>` : '';
    return `${rail}
      <div class="scroll" data-scroll="guide-step-${S.route}-${i}">
        <div class="${compact ? 'a-compact' : ''}" style="display:flex;flex-direction:column;gap:14px;padding:0 16px 16px">
          ${media}
          <div style="display:flex;flex-direction:column;gap:6px;padding:0 8px"><div class="h2">${d.title}</div><div class="a-t16">${d.text}</div></div>
          ${banner}${cred}
        </div>
      </div>
      <div class="actions">
        <button class="btn primary" data-act="stepNext">${d.btn}</button>
        <button class="btn text" data-act="stepHelp" data-ctx="${d.ctx}">${icon('help', 20)}This isn’t working</button>
      </div>`;
  }

  function offlineEmpty() {
    return `<div class="sheet-head">${backBtn()}</div>
      <div class="scroll" data-scroll="guide-offline">
        <div style="display:flex;flex-direction:column;gap:12px;padding:20px 24px">
          <div style="width:44px;height:44px;border-radius:999px;background:var(--warn-tint);display:flex;align-items:center;justify-content:center">${cloudOff(26)}</div>
          <div class="serif" style="font-size:30px;line-height:34px">The guide can’t load right now</div>
          <div style="font-size:16px;line-height:24px">You’re offline and this guide wasn’t saved on this phone.</div>
        </div>
        <div style="padding:0 16px"><div class="card" style="display:flex;flex-direction:column;gap:2px;padding:16px 20px">
          <div class="muted" style="font-size:14px;line-height:18px;font-weight:500">Your stay</div>
          <div style="font-size:18px;line-height:26px;font-weight:600">The Eastline, Apartment 412</div>
          <div style="font-size:16px;line-height:24px">1820 E 4th St, Austin, TX</div></div></div>
        <div style="display:flex;flex-direction:column;padding:22px 24px 16px">
          <div class="label" style="line-height:18px;padding-bottom:4px">What you can try</div>
          <button data-go="sms" style="display:flex;gap:14px;padding:14px 0;border-bottom:1px solid var(--line);width:100%">
            <span style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${icon('chat', 22)}</span>
            <span class="grow" style="display:flex;flex-direction:column;gap:2px"><span style="font-size:16px;line-height:23px;font-weight:600">Check your texts</span><span class="a-t15 muted">If Landing sent your arrival details, that message stays readable without a connection.</span></span>
            <span style="align-self:center;display:flex">${icon('chevR', 20, 'var(--muted)', 1.75)}</span></button>
          <div style="display:flex;gap:14px;padding:14px 0">
            <span style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${svg(22, 22, `<path d="M4 17.5v-2M8.5 17.5v-5M13 17.5v-8M17.5 17.5v-12" stroke="var(--ink)" stroke-width="1.6"/>`)}</span>
            <span class="grow" style="display:flex;flex-direction:column;gap:2px"><span style="font-size:16px;line-height:23px;font-weight:600">Find a stronger signal</span><span class="a-t15 muted">Move toward the street or a window and try again.</span></span></div>
        </div>
      </div>
      <div class="actions" style="align-items:center;gap:6px;padding-bottom:28px">
        <button class="btn secondary" data-act="guideRetry">${icon('refresh', 20, 'var(--ink)', 1.75)}Try again</button>
        <div class="small muted">Needs a connection</div>
      </div>`;
  }

  reg('guide', {
    kind: 'sheet',
    render: () => {
      if (S.offline && S.saved !== 'saved') return offlineEmpty();
      const steps = S.guideView === 'steps';
      const banner = S.offline ? `<div style="padding:0 16px 10px;flex-shrink:0"><div class="banner warn" style="padding:10px 16px">${cloudOff(22)}
          <div class="grow" style="display:flex;flex-direction:column;gap:2px"><div style="font-size:15px;line-height:21px;font-weight:600">You’re viewing a saved guide</div>
          <div class="small">Last updated today at ${SAVED_AT}. New updates and support requests need a connection.</div></div></div></div>` : '';
      const seg = `<div class="seg"${S.offline ? ' style="margin-bottom:10px"' : ''}><button class="${steps ? '' : 'on'}" data-act="guideView" data-view="overview">Overview</button><button class="${steps ? 'on' : ''}" data-act="guideView" data-view="steps">Step by step</button></div>`;
      return `<div class="sheet-head">${backBtn()}</div>${banner}${seg}${steps ? stepsView() : `<div class="scroll" data-scroll="guide-overview">${overviewBody()}</div>`}`;
    },
  });

  // =====================================================================
  // SMS (iOS Messages look)
  // =====================================================================
  reg('sms', {
    kind: 'page',
    render: () => `<div class="page a-sys" style="background:#F9F9F9">
      <div style="display:flex;align-items:flex-start;padding:0 12px 8px;border-bottom:1px solid #E5E5EA;flex-shrink:0">
        <button data-go="hub" aria-label="Back" style="width:60px;height:44px;display:flex;align-items:center;flex-shrink:0"><svg width="14" height="24" viewBox="0 0 14 24" fill="none"><path d="M11.5 3L3 12l8.5 9" stroke="#007AFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:4px">
          <div style="width:48px;height:48px;border-radius:999px;background:linear-gradient(180deg,#B4B4BA,#8E8E93);display:flex;align-items:center;justify-content:center"><svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="9.5" r="4.8" fill="#fff"/><path d="M3.5 24c.8-5.200 4.500-7.800 9.500-7.800s8.700 2.600 9.500 7.800z" fill="#fff"/></svg></div>
          <div style="display:flex;align-items:center;gap:2px;font-size:12px;line-height:16px;color:#000">Landing<svg width="8" height="10" viewBox="0 0 8 10" fill="none"><path d="M2.5 2l3 3-3 3" stroke="#8E8E93" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        </div>
        <div style="width:60px;height:44px;flex-shrink:0"></div>
      </div>
      <div class="scroll" data-scroll="sms-${S.smsVariant}" style="background:#fff;display:flex;flex-direction:column">
        <div style="margin-top:auto;display:flex;flex-direction:column;gap:8px;padding:12px 16px 18px">
          <div class="a-stamp" style="padding-bottom:2px"><div style="font-weight:500">Text Message · SMS</div><div><b style="font-weight:600">Today</b> 2:31 PM</div></div>
          <div class="a-bubble">Landing: Your check-in details for The Eastline are ready.<br><br>1820 E 4th St, Apt 412. Use the side gate on Navasota St beneath the blue awning.<br><br>Gate: 4827, then #.<br>Through the courtyard, take elevator B to floor 4.<br>Apt 412: 731904, then ✓.<br><br>Photos and directions: <span data-act="messageGuide" style="color:#007AFF;text-decoration:underline">landing.example/guide/demo</span><br><br>Need help getting in? Reply HELP to this message or open the guide and tap Help.</div>
          ${S.smsVariant === 'replacement' ? `<div class="a-stamp" style="padding:8px 0 2px"><b style="font-weight:600">Today</b> ${(S.supportTimes && S.supportTimes.code) || '11:12 PM'}</div>
          <div class="a-bubble">Landing: The code for the side gate on Navasota St has changed. New gate code: 5193, then #. The previous gate code no longer works. Your apartment code has not changed.</div>` : ''}
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;padding:8px 14px 34px;background:#fff;flex-shrink:0">
        <div style="width:34px;height:34px;border-radius:999px;background:#E9E9EB;display:flex;align-items:center;justify-content:center;flex-shrink:0"><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2.5v11M2.5 8h11" stroke="#8E8E93" stroke-width="2" stroke-linecap="round"/></svg></div>
        <div style="flex:1;height:36px;border-radius:999px;border:1px solid #D1D1D6;display:flex;align-items:center;padding:0 14px;color:#C7C7CC;font-size:16px;line-height:20px">Text Message · SMS</div>
      </div>
    </div>`,
  });

  // =====================================================================
  // Email (static mail view)
  // =====================================================================
  reg('email', {
    kind: 'page',
    render: () => {
      const fact = (k, v, last) => `<div style="display:flex;gap:16px;padding:12px 0;${last ? '' : 'border-bottom:1px solid var(--line)'}"><div class="a-t15 muted" style="width:84px;flex-shrink:0">${k}</div><div class="a-t15 grow" style="font-weight:500">${v}</div></div>`;
      const stepRow = (n, t) => `<div style="display:flex;gap:12px"><div class="muted" style="width:20px;flex-shrink:0;font-size:15px;line-height:23px;font-weight:500">${n}</div><div class="a-t16 grow">${t}</div></div>`;
      return `<div class="page" style="background:#fff">
        <div class="a-sys" style="display:flex;flex-direction:column;gap:12px;padding:0 16px 14px;border-bottom:1px solid #E5E5EA;flex-shrink:0">
          <button data-go="hub" style="display:flex;align-items:center;gap:4px;height:36px;align-self:flex-start;color:#007AFF;font-size:17px;line-height:22px"><svg width="12" height="22" viewBox="0 0 14 24" fill="none"><path d="M11.5 3L3 12l8.5 9" stroke="#007AFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>Inbox</button>
          <div style="font-size:20px;line-height:25px;font-weight:600;color:#000">Your arrival at The Eastline</div>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;border-radius:999px;background:var(--ink);display:flex;align-items:center;justify-content:center;flex-shrink:0"><span style="font-family:var(--serif);font-size:20px;line-height:24px;color:#fff">L</span></div>
            <div class="grow"><div style="font-size:15px;line-height:20px;font-weight:600;color:#000">Landing</div><div style="font-size:13px;line-height:18px;color:#8E8E93">To: Samantha</div></div>
            <div style="font-size:13px;line-height:16px;color:#8E8E93">Nov 16</div>
          </div>
        </div>
        <div class="scroll" data-scroll="email" style="background:var(--ground)">
          <div style="display:flex;flex-direction:column;gap:20px;padding:28px 20px 36px">
            <div class="label blue">Landing · Arrival guide</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              <div class="serif" style="font-size:30px;line-height:34px">Samantha, here’s how to get in.</div>
              <div style="font-size:16px;line-height:24px">Your stay at The Eastline starts soon. This is a short summary. The arrival guide has photos and every step.</div>
            </div>
            <div style="display:flex;flex-direction:column;padding:4px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)">
              ${fact('Check-in', 'November 19, after 3 PM')}${fact('Address', '1820 E 4th St, Apartment 412<br>Austin, TX', true)}
            </div>
            <div style="height:210px;border-radius:16px;background:url(assets/gate.jpg) 50%/cover;flex-shrink:0"></div>
            <div style="display:flex;flex-direction:column;gap:10px">
              <div class="label" style="line-height:18px">Your route, on foot</div>
              ${stepRow(1, 'Side gate on Navasota St, beneath the blue awning')}${stepRow(2, 'Through the courtyard')}${stepRow(3, 'Elevator B to floor 4')}${stepRow(4, 'Apartment 412')}
            </div>
            <div class="sunk" style="display:flex;gap:12px;padding:14px 16px">${icon('lock', 22)}<div class="a-t15 grow">Access codes appear in your arrival guide from 2:30 PM on November 19.</div></div>
            <button class="btn primary" style="flex-shrink:0" data-act="messageGuide">Open arrival guide</button>
            <div class="muted" style="font-size:13px;line-height:19px">Need help before you arrive? Open the guide and tap Help.</div>
          </div>
        </div>
      </div>`;
    },
  });

  // =====================================================================
  // Actions
  // =====================================================================
  function scrollOverviewTo(n) {
    requestAnimationFrame(() => {
      const sc = document.querySelector('#screen [data-scroll="guide-overview"]'); if (!sc) return;
      const el = n ? sc.querySelector(`[data-sec="${n}"]`) : null;
      sc.scrollTop = el ? Math.max(0, el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 4) : 0;
    });
  }
  Object.assign(actions, {
    // Hub
    openGuide(el) {
      const p = { guideView: el.dataset.view || S.guideView };
      if (el.dataset.route) p.route = el.dataset.route;
      if (el.dataset.step != null) p.step = +el.dataset.step;
      openSheet('guide', p);
    },
    copyWifi() {
      try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText('harbor-lantern-58').catch(() => {}); } catch (e) { /* clipboard unavailable */ }
      set({ wifiCopied: true });
      clearTimeout(actions.copyWifi.t);
      actions.copyWifi.t = setTimeout(() => set({ wifiCopied: false }), 2000);
    },
    allGood() { set({ allGood: true }); },
    reportIssue() { openSheet('report', { issueType: 'ac' }); },
    messageGuide() { S.page = 'hub'; S.sheets = []; openSheet('guide'); },

    // Guide
    guideView(el) {
      const v = el.dataset.view; if (v === S.guideView) return;
      set({ guideView: v });
      if (v === 'overview') {
        const key = (ROUTES[S.route] || ROUTES.gate)[Math.min(S.step, 3)];
        scrollOverviewTo({ gate: 2, courtyard: 3, elevator: 4, walk: 4, door: 5 }[key] || 0);
      }
    },
    jumpStep(el) {
      const p = { guideView: 'steps', step: +el.dataset.step };
      if (el.dataset.route) p.route = el.dataset.route;
      set(p);
    },
    railStep(el) { set({ step: +el.dataset.step }); },
    toggleParking() { set({ parkingOpen: !S.parkingOpen }); },
    startGarage() { set({ route: 'garage', guideView: 'steps', step: 0 }); },
    guideHelp() { openSheet('help', { helpContext: S.route === 'garage' ? 'garage' : 'gate', helpView: 'options' }); },
    guideRetry() { toast('Still offline'); },
    stepHelp(el) { openSheet('help', { helpContext: el.dataset.ctx, helpView: 'options' }); },
    stepNext() {
      const keys = ROUTES[S.route] || ROUTES.gate;
      const i = Math.max(0, Math.min(S.step, keys.length - 1));
      if (i >= keys.length - 1) {
        if (gateSupportOpen()) S.support = 'resolved';
        if (/^11:/.test(S.time)) S.time = '11:24';
        S.stage = 'settled';
        closeAll();
        return;
      }
      if (keys[i] === 'gate' && gateSupportOpen()) S.support = 'resolved';
      if (S.stage !== 'settled') S.stage = 'inside';
      set({ step: i + 1 });
    },
    saveGuide() {
      if (S.saved === 'saving') return;
      if (S.offline) { if (S.saved === 'saved') toast('Needs a connection'); else set({ saved: 'error' }); return; }
      set({ saved: 'saving' });
      clearTimeout(actions.saveGuide.t);
      actions.saveGuide.t = setTimeout(() => { if (S.saved === 'saving') set({ saved: 'saved', savedWithCodes: S.codesReleased }); }, 1200);
    },
  });
})();
