/* ==========================================================================
   Linda Vista Town Council — app.js
   Plain ES2020, no build step, no framework.
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     1. MEETING SCHEDULE
     The recurrence rule lives here, so meeting dates are computed on every
     page load and can never go stale the way hand-typed dates do.
     ====================================================================== */
  /* The standing Zoom room for BOARD meetings. General meetings are in person
     only. Change it here and it updates everywhere on the site. */
  var ZOOM_URL = 'https://us06web.zoom.us/j/3072184371?pwd=vkQwrRlnbQpd12yc9NaQbz96GuxZg9.1&omn=84322003288';

  var SCHEDULE = [
    {
      kind: 'General Meeting', slug: 'general',
      skipMonths: [6, 11],          // no meetings in July or December (bylaws)
      nth: 3, weekday: 3,                 // 3rd Wednesday (0=Sun … 3=Wed)
      startHour: 18, startMinute: 0,
      timeLabel: '6:00pm mingling · 6:30pm agenda',
      location: "Baha'i Faith Center",
      address: '6545 Alcala Knolls Dr, San Diego, CA 92111',
      locationUrl: 'https://maps.google.com/?q=6545+Alcala+Knolls+Dr,+San+Diego,+CA+92111',
      // General meetings are in person only (changed September 2026).
      // Add remote + remoteUrl back here if that ever changes.
      blurb: 'Open to everyone who lives or works in Linda Vista. No membership needed to attend or speak.'
    },
    {
      kind: 'Board Meeting', slug: 'board',
      skipMonths: [6, 11],          // no meetings in July or December (bylaws)
      nth: 1, weekday: 3,                 // 1st Wednesday
      startHour: 18, startMinute: 0,
      timeLabel: '6:00pm',
      // Board meetings moved to Zoom only in September 2026 — the council no
      // longer has the library room. There is no in-person option. If that
      // changes, put location/address/locationUrl back and move the Zoom link
      // to remote/remoteUrl the way the general meeting used to have it.
      location: 'Online on Zoom',
      locationUrl: ZOOM_URL,
      // Explicit, because "no remote field" does NOT mean "in person" — this
      // rule has no remote precisely because the Zoom link IS its location.
      // Without this the Format panel claimed the board meeting was in person
      // with no online option, directly under "Where: Online on Zoom".
      onlineOnly: true,
      blurb: 'Board business, online only. Members are welcome to observe.'
    }
  ];

  /* ======================================================================
     SPEAKERS — the one thing you update most months.
     Key is the meeting date, YYYY-MM-DD. Add a line when you get the info;
     the speaker row appears on the homepage card and in the events list, and
     disappears on its own once the meeting has passed. No need to remove old
     entries, though tidying them up now and then does no harm.

     Leave a date out entirely and the site simply says nothing about a
     speaker — which reads far better than "Guest Speaker: TBD" sitting there
     the morning of the meeting.

     Fields: name (required), topic (optional), url (optional — turns the
     name into a link; must start with http:// or https://).
     ====================================================================== */
  var SPEAKERS = {
    '2026-09-16': {
      name:  'Pure Water San Diego',
      url:   'https://www.sandiego.gov/public-utilities/sustainability/pure-water-sd',
      topic: 'Construction on Morena Boulevard',
      detail: 'Pure Water and two other water agencies have three projects running on ' +
              'Morena Boulevard. Their project managers and engineers want to hear from ' +
              'residents and businesses before the work starts in October.',
      ask:    'Would you rather the work happened at night or during the day?',
      askWhy: 'Night work finishes the project sooner. Day work keeps the noise out of ' +
              'the night, but street closures stretch the timeline out.'
    },
    '2026-10-21': {
      name:  'Assemblymember Chris Ward',
      url:   'https://a78.asmdc.org/',
      topic: 'What Sacramento is doing to Linda Vista',
      detail: 'A good deal of what frustrates people here is state law rather than ' +
              'city policy \u2014 the ADU rules above all, which came out of ' +
              'Sacramento before San Diego built its own program inside them. ' +
              'Assemblymember Ward is bringing a legislative update. His office also ' +
              'takes proposals straight from residents through a ' +
              '<a href="https://ward.asmdc.org/do-you-have-bill-idea" rel="noopener">' +
              'bill idea form</a>, open to constituents of Assembly District 78.',
      ask:    'What should Sacramento be working on for Linda Vista?',
      askWhy: 'His office takes bill proposals from residents directly. An idea with a ' +
              'room full of neighbors behind it travels further than one email does.'
    }
  };

  /* One-off events live in events.js so there is one file to edit when
     something comes in. See the comment at the top of that file for the
     field list, including `url` and `unconfirmed`. */

  // nth occurrence of a weekday in a given month; nth = -1 means last
  function nthWeekday(year, month, nth, weekday) {
    var d = new Date(year, month, 1);
    var offset = (weekday - d.getDay() + 7) % 7;
    return new Date(year, month, 1 + offset + (nth - 1) * 7);
  }

  function skipped(rule, month) {
    return !!(rule.skipMonths && rule.skipMonths.indexOf(month) !== -1);
  }

  function nextOccurrence(rule, from) {
    var now = from || new Date();
    for (var i = 0; i < 6; i++) {
      var probe = new Date(now.getFullYear(), now.getMonth() + i, 1);
      if (skipped(rule, probe.getMonth())) continue;
      var d = nthWeekday(probe.getFullYear(), probe.getMonth(), rule.nth, rule.weekday);
      d.setHours(rule.startHour, rule.startMinute, 0, 0);
      // still "next" until two hours after it starts
      if (d.getTime() + 2 * 3600e3 > now.getTime()) return d;
    }
    return null;
  }

  var DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
  var MON_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function longDate(d) {
    return DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
  }
  function daysUntil(d) {
    var a = new Date(); a.setHours(0,0,0,0);
    var b = new Date(d); b.setHours(0,0,0,0);
    return Math.round((b - a) / 864e5);
  }
  function relative(d) {
    var n = daysUntil(d);
    if (n === 0) return 'Tonight';
    if (n === 1) return 'Tomorrow';
    if (n < 7) return 'In ' + n + ' days';
    if (n < 14) return 'Next week';
    return 'In ' + Math.round(n / 7) + ' weeks';
  }

  function isoOf(d) {
    return d.getFullYear() + '-' +
           String(d.getMonth() + 1).padStart(2, '0') + '-' +
           String(d.getDate()).padStart(2, '0');
  }

  function speakerFor(d) {
    var sp = (typeof SPEAKERS !== 'undefined') && SPEAKERS[isoOf(d)];
    if (!sp || !sp.name) return null;
    var name = esc(sp.name);
    // Only http(s) links become anchors. A typo'd or unexpected URL renders as
    // plain text rather than producing a broken or unsafe link.
    if (sp.url && /^https?:\/\//i.test(sp.url)) {
      name = '<a href="' + esc(sp.url) + '" rel="noopener">' + name + '</a>';
    }
    return '<b>' + name + '</b>' + (sp.topic ? ' — ' + esc(sp.topic) : '');
  }

  function renderNextMeeting() {
    var host = document.getElementById('next-meeting');
    if (!host) return;

    var upcoming = SCHEDULE
      .map(function (r) { return { rule: r, date: nextOccurrence(r) }; })
      .filter(function (x) { return x.date; })
      .sort(function (a, b) { return a.date - b.date; });

    if (!upcoming.length) return;
    var next = upcoming[0], after = upcoming[1];

    host.innerHTML =
      '<div class="top">Next ' + next.rule.kind + ' · ' + relative(next.date) + '</div>' +
      '<div class="body">' +
        '<p class="date">' + longDate(next.date) + '</p>' +
        '<p class="time">' + next.rule.timeLabel + '</p>' +
        '<dl>' +
          '<dt>Where</dt><dd><a href="' + next.rule.locationUrl + '">' + next.rule.location + '</a></dd>' +
          (next.rule.remote
            ? '<dt>Remote</dt><dd><a href="' + next.rule.remoteUrl + '">Join on ' + next.rule.remote + '</a></dd>'
            : next.rule.onlineOnly
              ? '<dt>Format</dt><dd>Online only &mdash; no in-person option</dd>'
              : '<dt>Format</dt><dd>In person &mdash; no online option</dd>') +
          (speakerFor(next.date) ? '<dt>Speaker</dt><dd>' + speakerFor(next.date) + '</dd>' : '') +
          '<dt>Who</dt><dd>' + next.rule.blurb + '</dd>' +
        '</dl>' +
        /* Always shown, whichever meeting is next. The flyer page always
           renders the next GENERAL meeting, so the label says so rather than
           "this meeting" — which was wrong half the month, and was hidden the
           other half by a slug check that left /meeting with no route in. */
        '<p class="nm-flyer"><a href="/meeting">See the flyer for our next ' +
          'general meeting&nbsp;&rarr;</a></p>' +
        (after ? '<p class="after">Then: ' + after.rule.kind + ' on ' +
                 MON_ABBR[after.date.getMonth()] + ' ' + after.date.getDate() + '</p>' : '') +
      '</div>';
  }

  function renderEvents() {
    var host = document.getElementById('events');
    if (!host) return;

    var rows = SCHEDULE.map(function (r) {
      var d = nextOccurrence(r);
      if (!d) return null;
      var sp = speakerFor(d);
      return { date: d, title: r.kind,
               blurb: (sp ? 'Speaker: ' + sp + '. ' : '') + r.blurb,
               detail: r.timeLabel + ' · ' + r.location };
    }).filter(Boolean);

    var midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    (typeof EVENTS !== 'undefined' ? EVENTS : []).forEach(function (e) {
      var p = e.date.split('-');
      var when = new Date(+p[0], +p[1] - 1, +p[2]);
      if (when < midnight) return;          // yesterday's event is not "coming up"
      rows.push({ date: when, title: e.title, blurb: e.blurb,
                  detail: e.detail || '', url: e.url || '',
                  unconfirmed: !!e.unconfirmed });
    });

    rows.sort(function (a, b) { return a.date - b.date; });

    host.innerHTML = rows.map(function (r) {
      var title = r.url
        ? '<a href="' + r.url + '" rel="noopener">' + r.title + '</a>'
        : r.title;
      return '<article class="event">' +
        '<p class="when">' + MON_ABBR[r.date.getMonth()] + ' ' + r.date.getDate() +
          '<br>' + DAYS[r.date.getDay()].slice(0, 3) + '</p>' +
        '<div><h3>' + title + '</h3>' +
          '<p>' + r.blurb + (r.detail ? ' <span style="color:var(--muted)">' + r.detail + '</span>' : '') + '</p>' +
          (r.unconfirmed
            ? '<p class="ev-check">The council has not confirmed these details. ' +
              'Check with the organizer before you go.</p>'
            : '') +
        '</div></article>';
    }).join('');
  }

  /* ======================================================================
     2. POLLS
     One form, one Submit. The old site asked for three separate submissions
     on the same page, which is the main reason response counts were low.
     ====================================================================== */

  var SCALE = [
    { v: -2, label: 'Strongly disagree', cls: 's-2', key: 'sd' },
    { v: -1, label: 'Disagree',          cls: 's-1', key: 'dd' },
    { v:  0, label: 'Neutral',           cls: 's0',  key: 'nn' },
    { v:  1, label: 'Agree',             cls: 's1',  key: 'aa' },
    { v:  2, label: 'Strongly agree',    cls: 's2',  key: 'sa' }
  ];

  /* Which poll is running. Every response is stamped with this, so when you
     close one poll and open another the counts never mix. Change it at the
     same time you change QUESTIONS below, and update firestore.rules to match. */
  var POLL_ID = 'beaches-and-tax-2026';

  /* Closed polls, and why:
       Rapid Route 41 (Sept 2026) and the four cost-of-living questions
       (Sept 2026) are both archived on the Your Town page, in surveys.js.

     The cost-of-living poll was retired because three of its four questions
     had been decided: the City Council repealed Balboa Park paid parking
     unanimously on 8 June 2026, the 1% city sales tax died with Measure E in
     November 2024 and is not on this November's ballot, and the hotel tax
     increase took effect on 1 May 2025. Asking people about settled matters
     wastes their minute and makes the site look abandoned. Check the same
     thing before the next changeover. */
  var QUESTIONS = [
    { id: 'beach_free', type: 'scale',
      text: 'Parking at city beaches and Mission Bay should stay free for San Diego residents',
      note: 'An ordinance to make this permanent cleared the Rules Committee in ' +
            'August and is waiting on a full City Council vote. Charging $2.50 an ' +
            'hour would raise an estimated $37.5 million a year \u2014 against the ' +
            'same budget shortfall that closed thirteen Mission Bay restrooms ' +
            'this summer.' },
    { id: 'county_tax', type: 'scale',
      text: 'A half-cent county sales tax is a fair way to pay for sewage cleanup, ' +
            'wildfire prevention and social services',
      note: 'On the county ballot this November. It would take sales tax from ' +
            '7.75% to 8.25% and raise about $360 million a year.' }
  ];

  /* ---- storage -------------------------------------------------------------
     Two backends behind one interface.

     'local'     — seed responses + this browser's own submissions. Works with
                   no server at all, which is what this preview runs on.
     'firestore' — the real thing once the site is deployed. Uncomment the
                   block below, drop in the config, and set BACKEND='firestore'.
                   Firestore rules should allow create-only on /poll_responses
                   and read for everyone.
  ------------------------------------------------------------------------- */
  var LS_KEY   = 'lvtc_poll_v1';
  var LS_VOTED = 'lvtc_poll_voted_v1';
  var COLLECTION = 'poll_responses';
  var SDK = 'https://www.gstatic.com/firebasejs/10.12.0/';

  /* Seed answers for the CURRENT poll only. The three Squarespace responses
     that used to live here belonged to the cost-of-living questions and went
     into the archive with the rest of them — leaving them in would have fed
     answers to questions that no longer exist into the new results. A new
     poll starts empty. */
  var SEED = [];

  /* ---- Firestore, loaded only if firebase-config.js has been filled in ----
     No config, no network, or rules refusing the write: everything falls back
     to this browser's local storage, so the poll always works even if it is
     only remembering answers locally. */
  var _remote = null;
  function remoteReady() {
    var cfg = window.LVTC_FIREBASE;
    if (!cfg || !cfg.projectId) return Promise.resolve(null);
    if (_remote) return _remote;
    _remote = Promise.all([
      import(SDK + 'firebase-app.js'),
      import(SDK + 'firebase-firestore.js')
    ]).then(function (m) {
      return { fs: m[1], db: m[1].getFirestore(m[0].initializeApp(cfg)) };
    }).catch(function () { return null; });
    return _remote;
  }

  function localRows() {
    var mine = [];
    try { mine = JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch (e) { mine = []; }
    return SEED.concat(Array.isArray(mine) ? mine : []);
  }
  function saveLocal(row) {
    try {
      var mine = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      if (!Array.isArray(mine)) mine = [];
      mine.push(row);
      localStorage.setItem(LS_KEY, JSON.stringify(mine));
    } catch (e) { /* private window — the answer just isn't remembered here */ }
    return row;
  }

  /* One vote per browser, per poll.
     A random id is kept in this browser's local storage and used as the
     Firestore document id, so a second submission from the same browser tries
     to overwrite an existing document — which the rules forbid.

     What this does NOT do: stop the same person voting from another browser,
     another device, a private window, or after clearing site data. Each of
     those looks like a new browser and gets a new id. It stops accidental and
     casual double-voting. If a poll ever needs real protection, turn on
     Firebase App Check.

     The id is per-poll, so answers to different polls can't be linked back to
     the same browser by anyone reading the (public) responses. */
  function deviceKey() {
    var k = 'lvtc_device_' + POLL_ID;
    var v = null;
    try { v = localStorage.getItem(k); } catch (e) {}
    if (!v) {
      v = (window.crypto && window.crypto.randomUUID)
          ? window.crypto.randomUUID()
          : 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
      // A private window may refuse to store this. Then every submission looks
      // like a new browser, which we accept rather than blocking the person.
      try { localStorage.setItem(k, v); } catch (e) {}
    }
    return v;
  }

  function votedKey() { return LS_VOTED + '_' + POLL_ID; }
  function hasVoted() {
    try { return !!localStorage.getItem(votedKey()); } catch (e) { return false; }
  }
  function markVoted() {
    try { localStorage.setItem(votedKey(), new Date().toISOString()); } catch (e) {}
  }

  var Store = {
    /* Always a promise, whichever backend answers. */
    load: function () {
      return remoteReady().then(function (r) {
        if (!r) return localRows();
        return r.fs.getDocs(r.fs.collection(r.db, COLLECTION)).then(function (snap) {
          var rows = [];
          snap.forEach(function (doc) {
            var v = doc.data();
            if (!v || !v.answers) return;
            // no poll field == written before responses were stamped, which
            // was during the cost-of-living poll
            var belongs = v.poll || 'cost-of-living';
            if (belongs === POLL_ID) rows.push(v);
          });
          return SEED.concat(rows);
        });
      }).catch(function () { return localRows(); });
    },

    save: function (answers) {
      var row = { answers: answers, date: new Date().toISOString().slice(0, 10) };
      return remoteReady().then(function (r) {
        if (!r) { markVoted(); return saveLocal(row); }
        // setDoc with our own id: a second try is an overwrite, which the
        // rules reject, so the poll can't be answered twice from one browser.
        return r.fs.setDoc(r.fs.doc(r.db, COLLECTION, deviceKey()), {
          poll: POLL_ID,
          answers: answers,
          date: row.date,
          created: r.fs.serverTimestamp()
        }).then(function () { markVoted(); return row; });
      });
    }
  };


  function buildForm() {
    var host = document.getElementById('poll-questions');
    if (!host) return;

    host.innerHTML = QUESTIONS.map(function (q) {
      var opts;
      if (q.type === 'scale') {
        opts = SCALE.map(function (s) {
          return '<label><input type="radio" name="' + q.id + '" value="' + s.v +
                 '" id="' + q.id + '_' + (s.v + 2) + '"><span>' + s.label + '</span></label>';
        }).join('');
      } else {
        opts = ['Yes', 'No'].map(function (t, i) {
          return '<label><input type="radio" name="' + q.id + '" value="' + (i ? 0 : 1) +
                 '" id="' + q.id + '_' + t + '"><span>' + t + '</span></label>';
        }).join('');
      }
      return '<div class="q"><p class="qtext">' + q.text +
             (q.note ? '<span class="qnote">' + q.note + '</span>' : '') + '</p>' +
             '<div class="scale' + (q.type === 'binary' ? ' binary' : '') + '">' + opts + '</div></div>';
    }).join('');
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }
  function fmtMean(m) {
    if (m === null) return '—';
    return (m > 0 ? '+' : m < 0 ? '−' : '') + Math.abs(m).toFixed(1);
  }
  function describe(m) {
    if (m === null) return '';
    if (m <= -1.5) return 'strongly disagree';
    if (m <= -0.5) return 'lean disagree';
    if (m <   0.5) return 'mixed';
    if (m <   1.5) return 'lean agree';
    return 'strongly agree';
  }

  function renderResults() {
    var host = document.getElementById('results');
    if (!host) return;
    Store.load().then(function (rows) { paintResults(host, rows); });
  }

  function paintResults(host, rows) {
    var scaleQs = QUESTIONS.filter(function (q) { return q.type === 'scale'; });

    var stats = scaleQs.map(function (q) {
      var counts = {}, sum = 0, n = 0;
      SCALE.forEach(function (s) { counts[s.v] = 0; });
      rows.forEach(function (r) {
        var v = r.answers && r.answers[q.id];
        if (typeof v === 'number' && counts.hasOwnProperty(v)) { counts[v]++; sum += v; n++; }
      });
      return { q: q, counts: counts, n: n, mean: n ? sum / n : null };
    });

    var total = rows.length;
    var latest = rows.map(function (r) { return r.date; }).filter(Boolean).sort().pop();
    var latestLabel = '';
    if (latest) {
      var p = latest.split('-');
      latestLabel = ' · last received ' + MON_ABBR[+p[1] - 1] + ' ' + (+p[2]) + ', ' + p[0];
    }

    var html =
      '<h3>Results so far</h3>' +
      '<p class="meta">' + total + ' response' + (total === 1 ? '' : 's') + latestLabel + '</p>' +
      '<div class="legend">' + SCALE.map(function (s) {
        return '<span><i class="' + s.key + '"></i>' + s.label + '</span>';
      }).join('') + '</div>';

    stats.forEach(function (st) {
      if (!st.n) return;
      var pct = function (c) { return (c / st.n) * 50; };
      var left = 50 - (pct(st.counts[-1]) + pct(st.counts[-2])) - pct(st.counts[0]) / 2;
      var segs = '', x = left;
      [-2, -1, 0, 1, 2].forEach(function (v) {
        var c = st.counts[v];
        if (!c) return;
        var w = pct(c);
        var s = SCALE.filter(function (q) { return q.v === v; })[0];
        segs += '<div class="seg ' + s.cls + ' ' + s.key + '" style="left:' + x +
                '%;width:calc(' + w + '% - 2px);margin-left:1px" data-tip="' +
                esc(s.label) + ': ' + c + ' of ' + st.n +
                ' (' + Math.round(c / st.n * 100) + '%)"></div>';
        x += w;
      });
      html += '<div class="rrow">' +
        '<p class="rlabel">' + esc(st.q.text) + '</p>' +
        '<div class="track"><div class="mid"></div>' + segs + '</div>' +
        '<div class="rmeta"><span>← Disagree · Agree →</span>' +
        '<span>Average <b>' + fmtMean(st.mean) + '</b> · ' + describe(st.mean) + '</span></div>' +
      '</div>';
    });

    host.innerHTML = html;
    attachTips(host);
  }

  function attachTips(host) {
    var tip = host.querySelector('.tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'tip';
      host.appendChild(tip);
    }
    host.style.position = 'relative';
    host.addEventListener('mouseover', function (e) {
      var seg = e.target.closest && e.target.closest('.seg');
      if (!seg) return;
      tip.textContent = seg.getAttribute('data-tip');
      tip.style.opacity = '1';
    });
    host.addEventListener('mousemove', function (e) {
      if (tip.style.opacity !== '1') return;
      var r = host.getBoundingClientRect();
      tip.style.left = Math.min(e.clientX - r.left + 12, host.clientWidth - tip.offsetWidth - 8) + 'px';
      tip.style.top  = (e.clientY - r.top - tip.offsetHeight - 10) + 'px';
    });
    host.addEventListener('mouseout', function (e) {
      if (e.target.closest && e.target.closest('.seg')) tip.style.opacity = '0';
    });
  }

  /* This browser has answered before. It is a courtesy note, not a lock —
     clearing site data or using another device gets you a fresh form, and the
     poll is anonymous so there is no way to tie answers to a person. */
  /* Once this browser has answered, put the form beyond use and say so.
     The results stay visible — seeing them is the point of answering. */
  function showAnsweredState() {
    if (!hasVoted()) return;
    var form = document.getElementById('poll-form');
    if (!form) return;
    var fields = form.querySelector('fieldset');
    var btn = form.querySelector('button[type=submit]');
    if (fields) fields.disabled = true;
    if (btn) { btn.disabled = true; btn.textContent = 'Already answered'; }
    var foot = document.querySelector('.poll-foot .poll-note');
    if (foot) {
      foot.textContent = 'You have answered this poll on this device. Thanks — ' +
                         'the results below include your answers.';
    }
  }

  /* Closing a poll? Open the site, then in the browser console type:
         LVTC.pollCounts()
     It prints an archive-ready block you can copy from the console output.
     It reads from Firestore, so it returns a promise — if you want it on the
     clipboard directly, use:  copy(await LVTC.pollCounts())
     Counts are highest-first: [SA, A, N, D, SD]. */
  function pollCounts() {
    return Store.load().then(function (rows) {
      var out = { poll: POLL_ID, responses: rows.length, questions: [] };
      QUESTIONS.forEach(function (q) {
        var order = q.type === 'binary' ? [1, 0] : [2, 1, 0, -1, -2];
        var counts = order.map(function (v) {
          return rows.filter(function (r) {
            return r.answers && r.answers[q.id] === v;
          }).length;
        });
        out.questions.push({ text: q.text, type: q.type === 'binary' ? 'binary' : 'scale5', counts: counts });
      });
      return JSON.stringify(out, null, 2);
    });
  }
  window.LVTC = window.LVTC || {};
  window.LVTC.pollCounts = function () {
    return pollCounts().then(function (t) { console.log(t); return t; });
  };

  function wirePoll() {
    var form = document.getElementById('poll-form');
    if (!form) return;
    var msg = document.getElementById('poll-msg');
    showAnsweredState();          // lock the form if this browser already answered
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var answers = {}, answered = 0;
      QUESTIONS.forEach(function (q) {
        var v = data.get(q.id);
        if (v !== null && v !== '') { answers[q.id] = Number(v); answered++; }
      });

      if (!answered) {
        msg.hidden = false;
        msg.style.color = 'var(--red-ink)';
        msg.textContent = 'Pick an answer for at least one question before sending.';
        return;
      }

      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      btn.textContent = 'Sending…';

      Promise.resolve(Store.save(answers)).then(function () {
        form.reset();
        btn.disabled = false;
        btn.textContent = 'Send my answers';
        msg.hidden = false;
        msg.style.color = 'var(--sage-ink)';
        msg.textContent = 'Thanks — your answers are counted below.';
        showAnsweredState();
        renderResults();
        document.getElementById('results')
          .scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }).catch(function (err) {
        btn.disabled = false;
        btn.textContent = 'Send my answers';
        msg.hidden = false;
        msg.style.color = 'var(--red-ink)';
        var denied = err && (err.code === 'permission-denied' ||
                             /permission|insufficient/i.test(err.message || ''));
        if (denied) {
          // Almost always: this browser has already answered, so the write
          // was an overwrite and the rules refused it.
          markVoted();
          showAnsweredState();
          msg.style.color = 'var(--ink-2)';
          msg.textContent = 'This browser has already answered the poll. ' +
                            'The results below include that answer.';
          renderResults();
        } else {
          msg.textContent = 'That didn’t send. Please try again, or email us.';
        }
      });
    });
  }


  /* ======================================================================
     4. MEETING RECORD  (meetings page)
     Rather than listing only the documents that exist, this generates every
     meeting that should have happened since RECORD_START and marks each one
     posted, pending, or outstanding. Gaps become visible instead of invisible
     — and the outstanding list is something you can hand to the secretary.
     ====================================================================== */

  var PENDING_WINDOW_DAYS = 30;   // minutes are normally approved at the next meeting

  function ym(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }
  function parseISO(iso) {
    var p = iso.split('-');
    return new Date(+p[0], +p[1] - 1, +(p[2] || 1));
  }

  function buildRecord() {
    if (typeof MINUTES === 'undefined') return null;

    // Index documents by year-month + kind. A month can legitimately hold more
    // than one meeting of a kind (October 2024 had general meetings on both the
    // 7th and the 16th), so each key holds a LIST — anything left over after the
    // scheduled slots are filled is rendered as an extra meeting rather than
    // silently dropped.
    var have = {};
    MINUTES.forEach(function (m) {
      var k = m.date.slice(0, 7) + '|' + m.kind;
      (have[k] = have[k] || []).push(m);
    });
    var used = {};

    var start = parseISO(RECORD_START + '-01');
    var now = new Date();
    var rows = [];

    var cursor = new Date(start.getFullYear(), start.getMonth(), 1);
    while (cursor <= now) {
      SCHEDULE.forEach(function (rule) {
        if (skipped(rule, cursor.getMonth())) return;   // council is in recess
        var due = nthWeekday(cursor.getFullYear(), cursor.getMonth(), rule.nth, rule.weekday);
        if (due > now) return;                       // hasn't happened yet
        var key = ym(cursor) + '|' + rule.slug;
        var bucket = have[key] || [];
        // when a month holds several, the scheduled slot takes the closest date
        var doc = null, best = Infinity;
        bucket.forEach(function (c) {
          if (used[c.date + c.kind]) return;
          var gap = Math.abs(parseISO(c.date) - due);
          if (gap < best) { best = gap; doc = c; }
        });
        if (doc) used[doc.date + doc.kind] = true;
        var age = Math.round((now - due) / 864e5);
        rows.push({
          due: due,
          date: doc ? parseISO(doc.date) : due,
          kind: rule.kind,
          slug: rule.slug,
          file: doc ? doc.file : null,
          status: doc ? 'posted' : (age <= PENDING_WINDOW_DAYS ? 'pending' : 'outstanding')
        });
      });
      cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
    }

    // any document that didn't fill a scheduled slot is a real meeting too
    MINUTES.forEach(function (m) {
      if (used[m.date + m.kind]) return;
      var d = parseISO(m.date);
      if (d > now) return;
      var rule = SCHEDULE.filter(function (r) { return r.slug === m.kind; })[0];
      rows.push({
        due: d, date: d,
        kind: (rule ? rule.kind : m.kind) + ' (additional)',
        slug: m.kind, file: m.file, status: 'posted'
      });
    });

    rows.sort(function (a, b) { return b.due - a.due; });
    return rows;
  }

  function fileLabel(path) {
    var ext = (path.split('.').pop() || '').toLowerCase();
    return ext === 'docx' ? 'DOCX' : ext === 'pdf' ? 'PDF' : ext.toUpperCase();
  }

  function renderRecord(filter) {
    var host = document.getElementById('record');
    if (!host) return;
    var rows = buildRecord();
    if (!rows) return;

    if (!SHOW_GAPS) rows = rows.filter(function (r) { return r.status === 'posted'; });
    var view = rows.filter(function (r) {
      if (filter === 'general' || filter === 'board') return r.slug === filter;
      if (filter === 'outstanding') return r.status === 'outstanding';
      return true;
    });

    if (!view.length) {
      host.innerHTML = '<p class="empty">Nothing to show here.</p>';
      return;
    }

    var html = '', year = null;
    view.forEach(function (r) {
      var y = r.due.getFullYear();
      if (y !== year) {
        year = y;
        html += '<h3 class="year">' + y + '</h3>';
      }
      var when = MON_ABBR[r.date.getMonth()] + ' ' + r.date.getDate();
      var right;
      if (r.status === 'posted') {
        // files under /minutes/ are hosted here; everything else still points
        // at the old Squarespace copies via MINUTES_BASE
        var href = /^(https?:)?\//.test(r.file) && r.file.indexOf('/minutes/') === 0
                 ? r.file : MINUTES_BASE + r.file;
        right = '<a class="doc" href="' + href + '">' +
                'Read the minutes <span class="ext">' + fileLabel(r.file) + '</span></a>';
      } else if (r.status === 'pending') {
        right = '<span class="mark pending">Expected after the next meeting</span>';
      } else {
        right = '<span class="mark out">Not yet posted</span>';
      }
      html += '<div class="rec ' + r.status + '">' +
                '<span class="rec-when">' + when + '</span>' +
                '<span class="rec-kind">' + r.kind + '</span>' +
                '<span class="rec-doc">' + right + '</span>' +
              '</div>';
    });
    host.innerHTML = html;
  }

  function outstandingList() {
    var rows = buildRecord() || [];
    return rows.filter(function (r) { return r.status === 'outstanding'; });
  }

  function renderRecordSummary() {
    var host = document.getElementById('record-summary');
    if (!host) return;
    var rows = buildRecord();
    if (!rows) return;
    var posted = rows.filter(function (r) { return r.status === 'posted'; }).length;
    var out = rows.filter(function (r) { return r.status === 'outstanding'; }).length;
    host.innerHTML =
      '<div><b>' + posted + '</b><span>Posted</span></div>' +
      '<div><b>' + rows.length + '</b><span>Meetings held</span></div>' +
      '<div class="' + (out ? 'flag' : '') + '"><b>' + out + '</b><span>Awaiting minutes</span></div>';
  }


  function renderZoomLinks() {
    [].forEach.call(document.querySelectorAll('[data-zoom]'), function (el) {
      el.setAttribute('href', ZOOM_URL);
      el.setAttribute('rel', 'noopener');
    });
  }

  function renderStanding() {
    var slots = document.querySelectorAll('[data-next]');
    if (!slots.length) return;
    [].forEach.call(slots, function (el) {
      var slug = el.getAttribute('data-next');
      var rule = SCHEDULE.filter(function (r) { return r.slug === slug; })[0];
      if (!rule) return;
      var d = nextOccurrence(rule);
      if (!d) return;
      el.innerHTML = 'Next: <b>' + longDate(d) + '</b> · ' + relative(d).toLowerCase();
    });
  }

  function wireRecord() {
    var bar = document.getElementById('record-filter');
    if (!bar) return;

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-filter]');
      if (!b) return;
      [].forEach.call(bar.querySelectorAll('button'), function (x) {
        x.classList.toggle('on', x === b);
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      renderRecord(b.getAttribute('data-filter'));
    });

    var chase = document.getElementById('chase');
    if (!chase) return;
    var rows = outstandingList();
    if (!rows.length) { chase.hidden = true; return; }

    chase.addEventListener('click', function () {
      var lines = rows.map(function (r) {
        return '- ' + r.kind + ', ' + MONTHS[r.due.getMonth()] + ' ' +
               r.due.getDate() + ', ' + r.due.getFullYear();
      }).join('\n');
      var subject = 'Outstanding LVTC minutes (' + rows.length + ')';
      var body = 'Hi,\n\nThese meetings don’t have minutes posted yet:\n\n' + lines +
                 '\n\nCould you send whatever you have? I’ll get them on the site.\n\nThanks';

      if (typeof SECRETARY_EMAIL === 'string' && SECRETARY_EMAIL) {
        window.location.href = 'mailto:' + SECRETARY_EMAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);
        return;
      }
      var done = function () {
        chase.textContent = 'Copied ' + rows.length + ' dates';
        setTimeout(function () { chase.textContent = 'Copy the outstanding list'; }, 2600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(subject + '\n\n' + body).then(done, done);
      } else { done(); }
    });
  }


  /* ======================================================================
     5. CLOSED SURVEY RESULTS  (Your Town page)
     Replaces the stacked donut charts. Likert questions become diverging
     bars on one shared scale so they can be compared down the column;
     yes/no questions become a single split bar.
     ====================================================================== */

  function sum(a) { return a.reduce(function (x, y) { return x + (+y || 0); }, 0); }

  function scaleRow(q) {
    // counts arrive highest-first: [SA, A, N, D, SD]
    var byValue = { 2: q.counts[0], 1: q.counts[1], 0: q.counts[2], '-1': q.counts[3], '-2': q.counts[4] };
    var n = sum(q.counts);
    if (!n) return '';

    var mean = (2 * byValue[2] + 1 * byValue[1] - 1 * byValue['-1'] - 2 * byValue['-2']) / n;
    var pct = function (c) { return (c / n) * 50; };
    var left = 50 - (pct(byValue['-1']) + pct(byValue['-2'])) - pct(byValue[0]) / 2;

    var segs = '', x = left;
    [-2, -1, 0, 1, 2].forEach(function (v) {
      var c = byValue[v];
      if (!c) return;
      var w = pct(c);
      var meta = SCALE.filter(function (t) { return t.v === v; })[0];
      segs += '<div class="seg ' + meta.cls + ' ' + meta.key + '" style="left:' + x +
              '%;width:calc(' + w + '% - 2px);margin-left:1px" data-tip="' +
              esc(meta.label) + ': ' + c + ' of ' + n + ' (' + Math.round(c / n * 100) + '%)"></div>';
      x += w;
    });

    return '<div class="rrow">' +
      '<p class="rlabel">' + q.text +
        (q.note ? ' <span class="qnote">' + q.note + '</span>' : '') + '</p>' +
      '<div class="track"><div class="mid"></div>' + segs + '</div>' +
      '<div class="rmeta"><span>← Disagree · Agree →</span>' +
      '<span>' + n + ' answered · average <b>' + fmtMean(mean) + '</b> · ' + describe(mean) + '</span></div>' +
    '</div>';
  }

  function binaryRow(q) {
    var yes = +q.counts[0] || 0, no = +q.counts[1] || 0, n = yes + no;
    if (!n) return '';
    var yp = yes / n * 100;
    return '<div class="rrow">' +
      '<p class="rlabel">' + q.text + '</p>' +
      '<div class="track split">' +
        '<div class="seg yes" style="left:0;width:calc(' + yp + '% - 1px)" data-tip="Yes: ' +
          yes + ' of ' + n + ' (' + Math.round(yp) + '%)"></div>' +
        '<div class="seg no" style="left:' + yp + '%;width:calc(' + (100 - yp) + '% - 1px);margin-left:2px" data-tip="No: ' +
          no + ' of ' + n + ' (' + Math.round(100 - yp) + '%)"></div>' +
      '</div>' +
      '<div class="rmeta"><span><i class="sw yes"></i>Yes ' + yes +
        ' &nbsp; <i class="sw no"></i>No ' + no + '</span>' +
      '<span>' + n + ' answered · <b>' + Math.round(yp) + '%</b> yes</span></div>' +
    '</div>';
  }

  function renderSurveys() {
    var hosts = document.querySelectorAll('[data-survey]');
    if (!hosts.length || typeof SURVEYS === 'undefined') return;

    [].forEach.call(hosts, function (host) {
      var id = host.getAttribute('data-survey');
      var sv = SURVEYS.filter(function (x) { return x.id === id; })[0];
      if (!sv) return;

      var d = parseISO(sv.fielded);
      var when = MONTHS[d.getMonth()] + ' ' + d.getFullYear();
      var isScale = sv.questions.some(function (q) { return q.type === 'scale5'; });

      var html =
        '<div class="survey-head">' +
          '<p class="eyebrow">' + (sv.closed ? 'Closed survey · ' + when : 'Open survey') + '</p>' +
          '<h3>' + sv.title + '</h3>' +
          '<p class="survey-intro">' + sv.intro + '</p>' +
        '</div>';

      if (isScale) {
        html += '<div class="legend">' + SCALE.map(function (t) {
          return '<span><i class="' + t.key + '"></i>' + t.label + '</span>';
        }).join('') + '</div>';
      }

      html += sv.questions.map(function (q) {
        return q.type === 'binary' ? binaryRow(q) : scaleRow(q);
      }).join('');

      if (sv.takeaway) {
        html += '<p class="takeaway"><b>What it told us.</b> ' + sv.takeaway + '</p>';
      }

      var totals = sv.questions.map(function (q) { return sum(q.counts); });
      var lo = Math.min.apply(null, totals), hi = Math.max.apply(null, totals);
      html += '<p class="survey-foot">' +
        (sv.respondents ? sv.respondents + ' people took this survey. ' : '') +
        'Not everyone answered every question — the counts here run from ' +
        lo + ' to ' + hi + ' answers, and each bar is drawn against its own total.' +
      '</p>';

      host.innerHTML = html;
      attachTips(host);
    });
  }


  /* ======================================================================
     6. BOARD, BUSINESSES, FORMS
     ====================================================================== */

  function initials(name) {
    return name.split(/\s+/).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
  }

  function renderBoard() {
    var host = document.getElementById('board');
    if (!host || typeof BOARD === 'undefined') return;

    host.innerHTML = BOARD.map(function (m) {
      var portrait = m.photo
        ? '<img src="' + m.photo + '" alt="" loading="lazy" onerror="this.parentNode.innerHTML=\'' + initials(m.name) + '\'">'
        : initials(m.name);
      return '<article class="person">' +
        '<div class="portrait">' + portrait + '</div>' +
        '<div><h3>' + esc(m.name) + '</h3>' +
        '<p class="role">' + esc(m.role) + '</p>' +
        (m.bio ? '<p class="bio">' + m.bio + '</p>'
               : '<p class="bio empty">Bio coming soon.</p>') +
        '</div></article>';
    }).join('');

    var seats = document.getElementById('open-seats');
    if (!seats) return;
    if (typeof OPEN_SEATS === 'undefined' || !OPEN_SEATS.length) {
      seats.remove();
      return;
    }
    seats.innerHTML = OPEN_SEATS.map(function (r) {
      return '<li>' + esc(r) + '</li>';
    }).join('');
  }

  function renderBusinesses(filter) {
    var host = document.getElementById('biz');
    if (!host || typeof BUSINESSES === 'undefined') return;

    var view = BUSINESSES.filter(function (b) {
      return !filter || filter === 'all' || b.category === filter;
    });

    host.innerHTML = view.map(function (b) {
      return '<article class="biz-item">' +
        '<div>' +
          '<h3>' + (b.url ? '<a href="' + b.url + '">' + esc(b.name) + '</a>' : esc(b.name)) + '</h3>' +
          '<p class="biz-meta">' + esc(b.category) + (b.address ? ' · ' + esc(b.address) : '') + '</p>' +
          '<p class="biz-blurb">' + esc(b.blurb) + '</p>' +
        '</div>' +
        (b.discount ? '<span class="discount">' + esc(b.discount) + '</span>' : '') +
      '</article>';
    }).join('');
  }

  function wireBusinesses() {
    var bar = document.getElementById('biz-filter');
    if (!bar || typeof BUSINESSES === 'undefined') return;

    var cats = [];
    BUSINESSES.forEach(function (b) {
      if (cats.indexOf(b.category) === -1) cats.push(b.category);
    });

    bar.innerHTML = '<button type="button" data-cat="all" class="on" aria-pressed="true">All</button>' +
      cats.map(function (c) {
        return '<button type="button" data-cat="' + esc(c) + '" aria-pressed="false">' + esc(c) + '</button>';
      }).join('');

    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-cat]');
      if (!b) return;
      [].forEach.call(bar.querySelectorAll('button'), function (x) {
        x.classList.toggle('on', x === b);
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      renderBusinesses(b.getAttribute('data-cat'));
    });
  }

  /* --- contact / nomination forms -------------------------------------------
     Set CONTACT_ENDPOINT to a Cloud Function (or any URL that accepts a POST)
     and the form submits straight to it. Left empty, the form falls back to
     opening the visitor's mail client with everything filled in — which still
     works, and never silently drops a message.
  ------------------------------------------------------------------------- */
  var CONTACT_ENDPOINT = '';
  var CONTACT_EMAIL = 'lvtowncouncil@gmail.com';

  function wireForms() {
    var forms = document.querySelectorAll('form[data-contact]');
    if (!forms.length) return;

    [].forEach.call(forms, function (form) {
      // ?about=board etc. preselects the reason, so links can route people
      var about = new URLSearchParams(location.search).get('about');
      var topic = form.querySelector('[name=topic]');
      if (about && topic) {
        [].forEach.call(topic.options, function (o) {
          if (o.value === about) topic.value = about;
        });
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = form.querySelector('.form-msg');
        var btn = form.querySelector('button[type=submit]');
        var data = new FormData(form);

        if (!form.checkValidity()) { form.reportValidity(); return; }

        var lines = [];
        data.forEach(function (v, k) { if (v) lines.push(k + ': ' + v); });
        var subject = '[' + (form.getAttribute('data-contact') || 'Website') + '] ' +
                      (data.get('topic') || data.get('subject') || 'Message');

        var done = function (ok) {
          btn.disabled = false;
          btn.textContent = btn.getAttribute('data-label') || 'Send';
          msg.hidden = false;
          msg.style.color = ok ? 'var(--sage-ink)' : 'var(--red-ink)';
          msg.textContent = ok
            ? 'Thanks — we’ve got it. Someone will get back to you.'
            : 'That didn’t send. Your email app should have opened instead.';
          if (ok) form.reset();
        };

        btn.setAttribute('data-label', btn.textContent);
        btn.disabled = true;
        btn.textContent = 'Sending…';

        if (CONTACT_ENDPOINT) {
          fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(data.entries()))
          }).then(function (r) { done(r.ok); }).catch(function () { done(false); });
        } else {
          window.location.href = 'mailto:' + CONTACT_EMAIL +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(lines.join('\n'));
          done(true);
        }
      });
    });
  }


  /* ======================================================================
     7. MEETING FLYER  (meeting.html)
     Assembles itself from SCHEDULE + SPEAKERS, so in a normal month there is
     nothing to write. Prints to a single sheet for the library noticeboard.
     ====================================================================== */

  function renderFlyer() {
    var host = document.getElementById('flyer');
    if (!host) return;

    var rule = SCHEDULE.filter(function (r) { return r.slug === 'general'; })[0];
    if (!rule) return;
    var d = nextOccurrence(rule);
    if (!d) { host.innerHTML = '<p class="empty">No meeting scheduled.</p>'; return; }

    var sp = (typeof SPEAKERS !== 'undefined') && SPEAKERS[isoOf(d)] || null;
    var MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

    var html =
      '<div class="flyer-top">' +
        '<div class="flyer-date">' +
          '<span class="fd-month">' + MON[d.getMonth()] + '</span>' +
          '<span class="fd-day">' + d.getDate() + '</span>' +
          '<span class="fd-dow">' + DAYS[d.getDay()] + '</span>' +
        '</div>' +
        '<div class="flyer-brand">' +
          '<img src="/logo.png" alt="" width="54" onerror="this.remove()">' +
          '<span>Linda Vista<br>Town Council</span>' +
        '</div>' +
      '</div>' +
      '<div class="flyer-head">' +
        '<p class="eyebrow">General meeting</p>' +
        '<h1>' + (sp && sp.topic ? esc(sp.topic) : 'Come and have your say') + '</h1>' +
        (sp && sp.name
          ? '<p class="flyer-who">With <b>' + esc(sp.name) + '</b></p>'
          : '') +
      '</div>';

    // the practical details, impossible to miss
    html += '<dl class="flyer-facts">' +
      '<div><dt>When</dt><dd>' + longDate(d) + '<br>' + esc(rule.timeLabel) + '</dd></div>' +
      '<div><dt>Where</dt><dd><a href="' + rule.locationUrl + '">' + esc(rule.location) + '</a>' +
        (rule.address ? '<br>' + esc(rule.address) : '') + '</dd></div>' +
      (rule.remote
        ? '<div><dt>Or join online</dt><dd><a href="' + rule.remoteUrl + '" rel="noopener">' +
          esc(rule.remote) + ' &mdash; same link every month</a></dd></div>'
        : rule.onlineOnly
          ? '<div><dt>Format</dt><dd>Online only &mdash; no in-person option</dd></div>'
          : '<div><dt>Format</dt><dd>In person only &mdash; please come along</dd></div>') +
    '</dl>';

    if (sp && sp.detail) {
      html += '<div class="flyer-body"><p>' + sp.detail + '</p></div>';
    }

    // the single question the meeting exists to answer
    if (sp && sp.ask) {
      html += '<div class="flyer-ask">' +
        '<p class="fa-label">They want to know</p>' +
        '<p class="fa-q">' + esc(sp.ask) + '</p>' +
        (sp.askWhy ? '<p class="fa-why">' + esc(sp.askWhy) + '</p>' : '') +
      '</div>';
    }

    html += '<p class="flyer-foot">' +
      'Open to everyone who lives or works in Linda Vista. No membership needed to ' +
      'attend or to speak. <span class="fp-url">lindavistatowncouncil.org</span>' +
    '</p>';

    host.innerHTML = html;
  }


  /* ======================================================================
     8. RECAPS AND THE ADVOCACY LEDGER
     ====================================================================== */

  function prettyDate(iso) {
    if (!iso) return '';
    var d = parseISO(iso);
    return MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  function renderRecaps() {
    var host = document.getElementById('recaps');
    if (!host) return;
    var rows = (typeof RECAPS !== 'undefined' ? RECAPS : []).slice();

    if (!rows.length) {
      var rule = SCHEDULE.filter(function (r) { return r.slug === 'general'; })[0];
      var next = rule && nextOccurrence(rule);
      host.innerHTML = '<p class="empty">The first recap goes up after the ' +
        (next ? longDate(next) : 'next') + ' meeting.</p>';
      return;
    }

    rows.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    host.innerHTML = rows.map(function (r) {
      var kind = r.kind === 'board' ? 'Board meeting' : 'General meeting';
      return '<article class="recap">' +
        '<p class="recap-when">' + kind + ' &middot; ' + prettyDate(r.date) + '</p>' +
        '<h3>' + esc(r.headline) + '</h3>' +
        (r.body || []).map(function (para) { return '<p>' + para + '</p>'; }).join('') +
        (r.next ? '<p class="recap-next"><b>What happens next.</b> ' + r.next + '</p>' : '') +
      '</article>';
    }).join('');
  }

  function renderAdvocacy() {
    var host = document.getElementById('advocacy');
    if (!host) return;
    var rows = (typeof ADVOCACY !== 'undefined' ? ADVOCACY : [])
                 .filter(function (r) { return r.published; });

    if (!rows.length) {
      host.innerHTML = '<p class="empty">Nothing published here yet.</p>';
      return;
    }

    host.innerHTML = rows.map(function (r) {
      // No outcome yet is itself worth publishing — it shows the ask is open,
      // rather than quietly dropped.
      var answered = !!r.outcome;
      // Three states, not two. An ask can be answered and still not settled —
      // that's what stillAsking is for, and saying "Answered" over the top of
      // an unresolved position would be the ledger lying to itself.
      var partial = answered && !!r.stillAsking;
      var markCls = partial ? 'partial' : (answered ? 'answered' : 'open');
      var markTxt = partial ? 'Answered in part'
                            : (answered ? 'Answered' : 'Awaiting a reply');
      return '<article class="ask">' +
        '<div class="ask-head">' +
          '<h3>' + (r.link ? '<a href="' + r.link + '">' + esc(r.title) + '</a>' : esc(r.title)) + '</h3>' +
          '<span class="mark ' + markCls + '">' + markTxt + '</span>' +
        '</div>' +
        '<dl class="ask-body">' +
          '<dt>We asked</dt><dd>' + r.asked + '</dd>' +
          (r.sentTo ? '<dt>Of</dt><dd>' + esc(r.sentTo) +
                      (r.sentOn ? ' &middot; ' + prettyDate(r.sentOn) : '') + '</dd>' : '') +
          '<dt>They said</dt><dd>' +
            (answered ? r.outcome + (r.outcomeOn ? ' <span class="ask-date">' +
                        prettyDate(r.outcomeOn) + '</span>' : '')
                      : '<span class="ask-pending">Nothing yet. We will keep asking.</span>') +
          '</dd>' +
          (r.stillAsking ? '<dt>Still asking</dt><dd class="ask-still">' +
                           r.stillAsking + '</dd>' : '') +
        '</dl>' +
      '</article>';
    }).join('');
  }

  /* ======================================================================
     3. NAV
     ====================================================================== */
  function wireNav() {
    var btn = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }


  /* ======================================================================
     9. REPORT A PROBLEM MAP  (map.html)
     ----------------------------------------------------------------------
     Neighbors drop a pin, pick a category and write a sentence. The report
     is saved to Firestore with status 'pending' and does NOT appear on the
     map. You approve it by opening the Firebase console, finding the
     document in map_reports, and changing status from 'pending' to
     'approved'. That is the whole moderation system: no admin login to
     build, nothing extra to secure, and nothing reaches the public map that
     a human has not read first.

     The rules in firestore.rules enforce it from the other side — a browser
     can only create documents whose status is exactly 'pending', can never
     edit or delete one, and can only read documents already marked
     'approved'.

     Color deliberately carries no meaning here. Every pin is the same red
     and the category is carried by the glyph inside it plus the filter row,
     because six colors that must stay distinguishable against arbitrary map
     tiles, in both themes, for color-blind readers, is not a palette that
     exists. The glyph and the label do the work instead.
     ====================================================================== */

  var MAP_COLLECTION = 'map_reports';
  var MAP_CONTACTS = 'map_report_contacts';   // optional reporter email, editors only
  var LEAFLET_VER = '1.9.4';
  // Leaflet is served from the site itself if it's there, and from a CDN if it
  // isn't. Run ./vendor-leaflet.sh once to download the local copy — then the
  // map has no third-party dependency at page load, which for a site that has
  // to keep working for years without anyone maintaining it is worth the 160KB.
  var LEAFLET_LOCAL_CSS = '/vendor/leaflet/leaflet.css';
  var LEAFLET_LOCAL_JS  = '/vendor/leaflet/leaflet.js';
  var LEAFLET_CDN_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/' + LEAFLET_VER + '/leaflet.min.css';
  var LEAFLET_CDN_JS  = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/' + LEAFLET_VER + '/leaflet.js';

  // Where a pin may go. The real test is the City's outline of the Linda
  // Vista community planning area, in lv-boundary.js (window.LV_BOUNDARY).
  // LV_BOUNDS is that outline's extent plus about 200 m; it is the backstop
  // firestore.rules enforces, because rules cannot test a point against an
  // irregular shape. Change both together.
  var LV_CENTER = [32.7860, -117.1797];
  var LV_BOUNDS = [[32.760, -117.209], [32.812, -117.150]];
  // The boundary mostly runs down street centrelines, so a pin dropped on the
  // far kerb of a border street still counts. 40 m is about a street's width
  // plus the slack of a thumb on a phone map.
  var LV_EDGE_M = 40;

  function lvOutline() {
    return (Array.isArray(window.LV_BOUNDARY) && window.LV_BOUNDARY.length > 2)
      ? window.LV_BOUNDARY : null;
  }

  /* True if [lat, lng] is inside Linda Vista or within LV_EDGE_M of its edge.
     If lv-boundary.js did not load, falls back to the box, which is what the
     rules check anyway — a missing file must not stop anyone reporting. */
  function inLindaVista(lat, lng) {
    var b = LV_BOUNDS;
    if (lat < b[0][0] || lat > b[1][0] || lng < b[0][1] || lng > b[1][1]) return false;
    var poly = lvOutline();
    if (!poly) return true;

    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var yi = poly[i][0], xi = poly[i][1], yj = poly[j][0], xj = poly[j][1];
      if ((yi > lat) !== (yj > lat) &&
          lng < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
    }
    if (inside) return true;

    // Outside: near enough to the line? Flat-earth metres are fine at this scale.
    var kx = 111320 * Math.cos(lat * Math.PI / 180), ky = 110574;
    for (var a = 0, c = poly.length - 1; a < poly.length; c = a++) {
      var x1 = (poly[c][1] - lng) * kx, y1 = (poly[c][0] - lat) * ky;
      var x2 = (poly[a][1] - lng) * kx, y2 = (poly[a][0] - lat) * ky;
      var dx = x2 - x1, dy = y2 - y1, len = dx * dx + dy * dy;
      var t = len ? Math.max(0, Math.min(1, -(x1 * dx + y1 * dy) / len)) : 0;
      if (Math.hypot(x1 + t * dx, y1 + t * dy) <= LV_EDGE_M) return true;
    }
    return false;
  }

  var OUTSIDE_MSG = 'That spot is outside Linda Vista — the shaded part of the map. ' +
    'This map is only for the neighborhood; for anywhere else, use the City\'s Get It Done.';
  var MAP_THROTTLE_MS = 5 * 60 * 1000;   // one report per browser per 5 minutes

  var CATEGORIES = [
    { key: 'speeding', label: 'Speeding / unsafe driving',
      glyph: '<path d="M2.5 3L6 6l-3.5 3M7 3l3.5 3L7 9"/>' },
    { key: 'lighting', label: 'Streetlight out',
      glyph: '<circle cx="6" cy="5.4" r="2.1"/><path d="M6 1.2v1M1.6 5.4h1M9.4 5.4h1M2.9 2.3l.7.7M9.1 2.3l-.7.7M4.6 9.4h2.8M5 11h2"/>' },
    { key: 'sidewalk', label: 'Sidewalk / street damage',
      glyph: '<path d="M1.2 3h9.6M1.2 9h9.6M5 3l1.4 3L5 9"/>' },
    { key: 'dumping', label: 'Illegal dumping / trash',
      glyph: '<path d="M3.2 4h5.6l-.5 6.4H3.7L3.2 4zM2 3.4h8M4.7 2h2.6"/>' },
    { key: 'vehicle', label: 'Abandoned vehicle',
      glyph: '<path d="M1.8 8.6h8.4M2.6 8.6V6.4l1.3-2.1h4.2l1.3 2.1v2.2M3.6 6.5h4.8"/><circle cx="4" cy="9.8" r=".9"/><circle cx="8" cy="9.8" r=".9"/>' },
    { key: 'other', label: 'Something else',
      glyph: '<path d="M6 2.2v4.6"/><circle cx="6" cy="9.4" r=".9"/>' }
  ];

  function catByKey(k) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].key === k) return CATEGORIES[i];
    return CATEGORIES[CATEGORIES.length - 1];
  }

  /* A pin is one span of HTML — no marker images, so nothing 404s and the
     shape follows the stylesheet in both light and dark. */
  function pinHtml(key, draft) {
    var c = catByKey(key);
    return '<span class="pin' + (draft ? ' pin-draft' : '') + '">' +
             '<svg viewBox="0 0 12 12" aria-hidden="true">' + c.glyph + '</svg>' +
           '</span>';
  }

  var _leaflet = null;
  function addScript(src) {
    return new Promise(function (resolve, reject) {
      var js = document.createElement('script');
      js.src = src; js.crossOrigin = '';
      js.onload = function () { window.L ? resolve(window.L) : reject(new Error('no L')); };
      js.onerror = function () { reject(new Error('failed: ' + src)); };
      document.head.appendChild(js);
    });
  }
  function addCss(href) {
    var css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = href; css.crossOrigin = '';
    document.head.appendChild(css);
  }
  function loadLeaflet() {
    if (_leaflet) return _leaflet;
    _leaflet = new Promise(function (resolve) {
      if (window.L) return resolve(window.L);
      // Ask for the local copy first; only pull its stylesheet in if the
      // script was actually there, so a site without /vendor/ logs one 404
      // rather than two.
      resolve(addScript(LEAFLET_LOCAL_JS).then(function (L) {
        addCss(LEAFLET_LOCAL_CSS); return L;
      }).catch(function () {
        addCss(LEAFLET_CDN_CSS);
        return addScript(LEAFLET_CDN_JS);
      }));
    });
    return _leaflet;
  }

  function mapSay(kind, text) {
    var el = document.getElementById('report-msg');
    if (!el) return;
    el.className = 'form-msg ' + (kind || '');
    el.textContent = text;
  }

  function initMap() {
    var host = document.getElementById('lvmap');
    if (!host) return;

    loadLeaflet().then(function (L) {
      var map = L.map(host, {
        center: LV_CENTER, zoom: 14, minZoom: 12, maxZoom: 18,
        maxBounds: L.latLngBounds(LV_BOUNDS).pad(0.5),
        scrollWheelZoom: false            // so the page still scrolls normally
      });
      map.on('click', function () { map.scrollWheelZoom.enable(); });
      map.on('mouseout', function () { map.scrollWheelZoom.disable(); });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Shade everything that is not Linda Vista, and draw its edge, so where a
      // pin can go is visible before anyone tries. Neither shape takes clicks;
      // taps fall through to the map and are checked in setDraft.
      var outline = lvOutline();
      if (outline) {
        var world = [[32.60, -117.40], [32.60, -116.90], [33.00, -116.90], [33.00, -117.40]];
        L.polygon([world, outline], { interactive: false, stroke: false, className: 'lv-outside' }).addTo(map);
        L.polygon(outline, { interactive: false, fill: false, className: 'lv-edge' }).addTo(map);
        map.fitBounds(L.latLngBounds(outline), { padding: [12, 12] });
      }

      var layers = {};
      CATEGORIES.forEach(function (c) { layers[c.key] = L.layerGroup().addTo(map); });

      var draft = null;                   // the pin the visitor is placing
      var lastGood = null;                // where the draft pin was last allowed to be
      function setDraft(latlng) {
        if (!inLindaVista(latlng.lat, latlng.lng)) {
          mapSay('err', OUTSIDE_MSG);
          return;
        }
        lastGood = latlng;
        var key = currentCategory();
        if (draft) { map.removeLayer(draft); draft = null; }
        draft = L.marker(latlng, {
          draggable: true,
          icon: L.divIcon({ className: 'pin-wrap', html: pinHtml(key, true),
                            iconSize: [28, 28], iconAnchor: [14, 28] })
        }).addTo(map);
        draft.on('dragend', function () {
          var p = draft.getLatLng();
          if (!inLindaVista(p.lat, p.lng)) {
            draft.setLatLng(lastGood);
            mapSay('err', OUTSIDE_MSG);
            return;
          }
          lastGood = p;
          syncDraftFields();
        });
        syncDraftFields();
      }
      function syncDraftFields() {
        var f = document.getElementById('report-form');
        if (!f || !draft) return;
        var p = draft.getLatLng();
        f.elements.lat.value = p.lat.toFixed(6);
        f.elements.lng.value = p.lng.toFixed(6);
        var hint = document.getElementById('pin-state');
        if (hint) hint.textContent = 'Pin placed. Drag it if it is not quite right.';
        mapSay('', '');
      }
      function currentCategory() {
        var f = document.getElementById('report-form');
        return (f && f.elements.category.value) || 'other';
      }

      map.on('click', function (e) { setDraft(e.latlng); });

      // Re-draw the draft pin's glyph when the category changes.
      var sel = document.querySelector('#report-form [name="category"]');
      if (sel) sel.addEventListener('change', function () {
        if (draft) setDraft(draft.getLatLng());
      });

      var locBtn = document.getElementById('use-location');
      if (locBtn) {
        if (!navigator.geolocation) locBtn.remove();
        else locBtn.addEventListener('click', function () {
          locBtn.disabled = true; locBtn.textContent = 'Finding you…';
          navigator.geolocation.getCurrentPosition(function (pos) {
            locBtn.disabled = false; locBtn.textContent = 'Use my location';
            var ll = L.latLng(pos.coords.latitude, pos.coords.longitude);
            if (!inLindaVista(ll.lat, ll.lng)) {
              mapSay('err', "You are outside Linda Vista right now. Tap the map where the problem is instead.");
              return;
            }
            map.setView(ll, 17); setDraft(ll);
          }, function () {
            locBtn.disabled = false; locBtn.textContent = 'Use my location';
            mapSay('err', 'Your browser would not share a location. Tap the map instead.');
          }, { enableHighAccuracy: true, timeout: 8000 });
        });
      }

      loadApproved(L, layers);
      wireFilters(map, layers);
      wireReportForm(function () { if (draft) { map.removeLayer(draft); draft = null; } });
    }).catch(mapUnavailable);
  }

  /* Leaflet didn't load — offline, blocked, or the CDN is having a day. Say so
     once, clearly, and take away the parts of the page that can't work without
     a map rather than leaving a dead form and an empty dropdown on screen. */
  function mapUnavailable() {
    var host = document.getElementById('lvmap');
    if (host) {
      host.classList.add('lvmap-down');
      host.innerHTML = '<p class="map-down"><b>The map could not load.</b><br>' +
        'Report the problem to the City with ' +
        '<a href="https://www.sandiego.gov/get-it-done">Get It Done</a>, ' +
        'or email us at <a href="mailto:' + CONTACT_EMAIL + '">' + CONTACT_EMAIL + '</a> ' +
        'and we will add the pin ourselves.</p>';
    }
    var bar = document.getElementById('map-filters');
    if (bar) bar.remove();
    var count = document.getElementById('map-count');
    if (count) count.remove();
    var section = document.getElementById('report');
    if (section) section.remove();
  }

  function loadApproved(L, layers) {
    var count = document.getElementById('map-count');
    remoteReady().then(function (r) {
      if (!r) {
        if (count) count.textContent = 'The map is not connected to its database yet, so no reports are shown.';
        return;
      }
      var q = r.fs.query(r.fs.collection(r.db, MAP_COLLECTION),
                         r.fs.where('status', '==', 'approved'));
      return r.fs.getDocs(q).then(function (snap) {
        var n = 0;
        snap.forEach(function (d) {
          var v = d.data();
          if (typeof v.lat !== 'number' || typeof v.lng !== 'number') return;
          var c = catByKey(v.category);
          var m = L.marker([v.lat, v.lng], {
            icon: L.divIcon({ className: 'pin-wrap', html: pinHtml(c.key, false),
                              iconSize: [28, 28], iconAnchor: [14, 28] }),
            alt: c.label
          });
          m.bindPopup('<b>' + esc(c.label) + '</b>' +
                      (v.note ? '<br>' + esc(v.note) : '') +
                      (v.date ? '<br><span class="pop-when">Reported ' + esc(v.date) + '</span>' : ''));
          m.addTo(layers[c.key]);
          n++;
        });
        if (count) {
          count.textContent = n === 0
            ? 'No reports on the map yet. Yours can be the first.'
            : n + (n === 1 ? ' report' : ' reports') + ' on the map, each one read by a person before it appeared.';
        }
      });
    }).catch(function () {
      if (count) count.textContent = 'The reports could not be loaded just now.';
    });
  }

  function wireFilters(map, layers) {
    var bar = document.getElementById('map-filters');
    if (!bar) return;
    // Plain buttons: .filterbar styles them. NOT class="seg" — that class is
    // already the absolutely-positioned chart segment and it stacks them.
    bar.innerHTML = '<button type="button" class="on" data-cat="all">All</button>' +
      CATEGORIES.map(function (c) {
        return '<button type="button" data-cat="' + c.key + '">' +
               '<span class="chip-glyph"><svg viewBox="0 0 12 12" aria-hidden="true">' + c.glyph + '</svg></span>' +
               esc(c.label) + '</button>';
      }).join('');
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-cat]');
      if (!b) return;
      bar.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      var want = b.getAttribute('data-cat');
      CATEGORIES.forEach(function (c) {
        var on = (want === 'all' || want === c.key);
        if (on) map.addLayer(layers[c.key]); else map.removeLayer(layers[c.key]);
      });
    });
  }

  function mapThrottled() {
    try {
      var t = parseInt(localStorage.getItem('lvtc.map.last') || '0', 10);
      return t && (Date.now() - t) < MAP_THROTTLE_MS;
    } catch (e) { return false; }
  }

  function wireReportForm(clearDraft) {
    var f = document.getElementById('report-form');
    if (!f) return;

    var sel = f.elements.category;
    if (sel && !sel.options.length) {
      CATEGORIES.forEach(function (c) {
        var o = document.createElement('option');
        o.value = c.key; o.textContent = c.label;
        sel.appendChild(o);
      });
    }

    var note = f.elements.note;
    var left = document.getElementById('note-left');
    function countLeft() {
      if (left) left.textContent = (280 - note.value.length) + ' characters left';
    }
    if (note && left) { note.addEventListener('input', countLeft); countLeft(); }

    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var lat = parseFloat(f.elements.lat.value), lng = parseFloat(f.elements.lng.value);
      if (!isFinite(lat) || !isFinite(lng)) {
        mapSay('err', 'Tap the map to put a pin where the problem is first.');
        return;
      }
      if (!inLindaVista(lat, lng)) { mapSay('err', OUTSIDE_MSG); return; }
      if (!note.value.trim()) {
        mapSay('err', 'Say in a sentence what is wrong — that is what gets read.');
        note.focus(); return;
      }
      var email = f.elements.email ? f.elements.email.value.trim() : '';
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        mapSay('err', 'That email address does not look right. Fix it, or leave the box empty to send the report anonymously.');
        f.elements.email.focus(); return;
      }
      if (mapThrottled()) {
        mapSay('err', 'You just sent one. Give it a few minutes before sending another.');
        return;
      }

      var btn = f.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      remoteReady().then(function (r) {
        if (!r) throw new Error('offline');
        var report = {
          category: f.elements.category.value,
          note: note.value.trim().slice(0, 280),
          lat: Math.round(lat * 1e6) / 1e6,
          lng: Math.round(lng * 1e6) / 1e6,
          status: 'pending',
          date: new Date().toISOString().slice(0, 10),
          created: r.fs.serverTimestamp()
        };
        if (!email) return r.fs.addDoc(r.fs.collection(r.db, MAP_COLLECTION), report);

        // The email goes in its own collection under the same id, written in
        // one batch with the report. Never on the report itself: approved
        // reports are publicly readable, every field. See firestore.rules.
        var ref = r.fs.doc(r.fs.collection(r.db, MAP_COLLECTION));
        var batch = r.fs.writeBatch(r.db);
        batch.set(ref, report);
        batch.set(r.fs.doc(r.db, MAP_CONTACTS, ref.id),
                  { email: email, created: r.fs.serverTimestamp() });
        return batch.commit();
      }).then(function () {
        try { localStorage.setItem('lvtc.map.last', String(Date.now())); } catch (e2) {}
        f.reset(); f.elements.lat.value = ''; f.elements.lng.value = '';
        if (clearDraft) clearDraft();
        var hint = document.getElementById('pin-state');
        if (hint) hint.textContent = 'Tap the map to drop a pin.';
        if (left) left.textContent = '280 characters left';
        mapSay('ok', 'Thank you — that is with us. Someone reads every report before it goes on the map, so give it a day or two to appear.' +
          (email ? ' We will email you when the council does something about it.' : ''));
      }).catch(function () {
        mapSay('err', 'That would not send. Email ' + CONTACT_EMAIL + ' and we will take it from there.');
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = 'Send the report'; }
      });
    });
  }


  /* ======================================================================
     10. REVIEW PAGE  (review.html)
     ----------------------------------------------------------------------
     The moderation queue. Not linked from anywhere — bookmark /review.

     Hiding it is not the security; the rules are. A signed-out visitor who
     finds this page sees nothing but a sign-in button, and a signed-in
     visitor who isn't on the EDITORS list in firestore.rules gets an empty
     list, because Firestore refuses to hand over pending documents to
     anyone else. Change the allowed addresses in firestore.rules, not here.

     Requires Google sign-in to be switched on:
     Firebase console -> Authentication -> Sign-in method -> Google.
     ====================================================================== */

  var _auth = null;
  function authReady() {
    var cfg = window.LVTC_FIREBASE;
    if (!cfg || !cfg.projectId) return Promise.resolve({ why: 'unconfigured' });
    if (_auth) return _auth;
    _auth = Promise.all([
      import(SDK + 'firebase-app.js'),
      import(SDK + 'firebase-auth.js')
    ]).then(function (m) {
      return { a: m[1], auth: m[1].getAuth(m[0].initializeApp(cfg)) };
    }).catch(function () { return { why: 'offline' }; });
    return _auth;
  }

  function reviewSay(kind, text) {
    var el = document.getElementById('review-msg');
    if (!el) return;
    el.className = 'form-msg ' + (kind || '');
    el.textContent = text || '';
  }

  function initReview() {
    var root = document.getElementById('review-root');
    if (!root) return;

    var who    = document.getElementById('review-who');
    var inBtn  = document.getElementById('review-in');
    var outBtn = document.getElementById('review-out');
    var list   = document.getElementById('review-list');

    authReady().then(function (A) {
      if (!A || A.why) {
        reviewSay('err', (A && A.why === 'unconfigured')
          ? 'Firebase is not configured on this site (see firebase-config.js), so there is nothing to review.'
          : 'Sign-in could not load. Check the connection and reload.');
        return;
      }
      var provider = new A.a.GoogleAuthProvider();

      inBtn.addEventListener('click', function () {
        A.a.signInWithPopup(A.auth, provider).catch(function (e) {
          reviewSay('err', 'Sign-in did not complete. ' + (e && e.code ? '(' + e.code + ')' : ''));
        });
      });
      outBtn.addEventListener('click', function () { A.a.signOut(A.auth); });

      A.a.onAuthStateChanged(A.auth, function (user) {
        if (!user) {
          who.textContent = '';
          inBtn.hidden = false; outBtn.hidden = true;
          list.innerHTML = '<p class="empty">Sign in to see reports waiting for review.</p>';
          var fl = document.getElementById('followup-list');
          if (fl) fl.innerHTML = '';
          reviewSay('', '');
          return;
        }
        who.textContent = 'Signed in as ' + (user.email || 'unknown');
        inBtn.hidden = true; outBtn.hidden = false;
        loadPending();
      });
    });

    function loadPending() {
      list.innerHTML = '<p class="empty">Loading…</p>';
      remoteReady().then(function (r) {
        if (!r) throw new Error('no firestore');
        var q = r.fs.query(r.fs.collection(r.db, MAP_COLLECTION),
                           r.fs.where('status', '==', 'pending'));
        return r.fs.getDocs(q).then(function (snap) {
          var rows = [];
          snap.forEach(function (d) { rows.push({ id: d.id, v: d.data() }); });
          rows.sort(function (a, b) { return (a.v.date || '') < (b.v.date || '') ? 1 : -1; });
          return loadContacts(r).then(function (contacts) {
            rows.forEach(function (row) { row.email = contacts[row.id] || ''; });
            renderPending(rows, r);
            renderFollowups(contacts, r);
          });
        });
      }).catch(function () {
        list.innerHTML = '<p class="empty">Could not load the queue. If you are signed in ' +
          'with an address that is not on the editors list in firestore.rules, ' +
          'this is what that looks like.</p>';
      });
    }

    /* Every reporter email, keyed by report id. Editors only — the rules
       refuse this read to anyone else. A failure here must not hide the
       queue, so it resolves to an empty map rather than rejecting. */
    function loadContacts(r) {
      return r.fs.getDocs(r.fs.collection(r.db, MAP_CONTACTS)).then(function (snap) {
        var out = {};
        snap.forEach(function (d) { out[d.id] = (d.data() || {}).email || ''; });
        return out;
      }).catch(function () { return {}; });
    }

    function emailLine(addr) {
      return addr
        ? '<p class="pending-meta">Wants to hear back: <a href="mailto:' + esc(addr) + '">' + esc(addr) + '</a></p>'
        : '';
    }

    /* The follow-up list: approved reports whose reporter left an email.
       This is where you come back to when the council has done something.
       "Done" deletes the email — the report itself stays on the map. */
    function renderFollowups(contacts, r) {
      var box = document.getElementById('followup-list');
      if (!box) return;
      var ids = Object.keys(contacts);
      Promise.all(ids.map(function (id) {
        return r.fs.getDoc(r.fs.doc(r.db, MAP_COLLECTION, id)).then(function (d) {
          return d.exists() ? { id: id, v: d.data(), email: contacts[id] } : { id: id, v: null, email: contacts[id] };
        });
      })).then(function (rows) {
        // Pending ones are already in the queue above; only show the rest.
        rows = rows.filter(function (x) { return !x.v || x.v.status !== 'pending'; });
        rows.sort(function (a, b) { return ((a.v && a.v.date) || '') < ((b.v && b.v.date) || '') ? 1 : -1; });
        if (!rows.length) {
          box.innerHTML = '<p class="empty">Nobody is waiting to hear back.</p>';
          return;
        }
        box.innerHTML = rows.map(function (row) {
          var v = row.v || {};
          var c = catByKey(v.category);
          var subject = encodeURIComponent('Your Linda Vista problem map report');
          return '<article class="pending-item" data-id="' + esc(row.id) + '">' +
            '<p class="pending-head">' +
              '<span class="chip-glyph"><svg viewBox="0 0 12 12" aria-hidden="true">' + c.glyph + '</svg></span>' +
              '<b>' + esc(row.v ? c.label : 'Report no longer exists') + '</b>' +
              '<span class="pending-date">' + esc(v.date || '') + '</span>' +
            '</p>' +
            (v.note ? '<p class="pending-note">' + esc(v.note) + '</p>' : '') +
            '<p class="pending-meta"><a href="mailto:' + esc(row.email) + '?subject=' + subject + '">' +
              esc(row.email) + '</a></p>' +
            '<p class="btn-row">' +
              '<button class="btn btn-ghost" data-do="forget">Done &mdash; delete their email</button>' +
            '</p>' +
          '</article>';
        }).join('');

        box.onclick = function (e) {
          var b = e.target.closest('button[data-do="forget"]');
          if (!b) return;
          if (!window.confirm('Delete this email address? Do this once you have told them the outcome.')) return;
          var item = b.closest('.pending-item');
          b.disabled = true;
          r.fs.deleteDoc(r.fs.doc(r.db, MAP_CONTACTS, item.getAttribute('data-id'))).then(function () {
            item.remove();
            if (!box.querySelector('.pending-item')) {
              box.innerHTML = '<p class="empty">Nobody is waiting to hear back.</p>';
            }
          }).catch(function () {
            b.disabled = false;
            reviewSay('err', 'Could not delete that email. The rules may not list your address as an editor.');
          });
        };
      }).catch(function () {
        box.innerHTML = '<p class="empty">Could not load the follow-up list.</p>';
      });
    }

    function renderPending(rows, r) {
      if (!rows.length) {
        list.innerHTML = '<p class="empty">Nothing waiting. The queue is empty.</p>';
        reviewSay('', '');
        return;
      }
      list.innerHTML = rows.map(function (row) {
        var c = catByKey(row.v.category);
        var maps = 'https://www.google.com/maps/search/?api=1&query=' +
                   encodeURIComponent(row.v.lat + ',' + row.v.lng);
        return '<article class="pending-item" data-id="' + esc(row.id) + '">' +
          '<p class="pending-head">' +
            '<span class="chip-glyph"><svg viewBox="0 0 12 12" aria-hidden="true">' + c.glyph + '</svg></span>' +
            '<b>' + esc(c.label) + '</b>' +
            '<span class="pending-date">' + esc(row.v.date || '') + '</span>' +
          '</p>' +
          '<p class="pending-note">' + esc(row.v.note || '') + '</p>' +
          '<p class="pending-meta"><a href="' + maps + '" target="_blank" rel="noopener">' +
            esc(row.v.lat + ', ' + row.v.lng) + ' on a map &rarr;</a></p>' +
          emailLine(row.email) +
          '<p class="btn-row">' +
            '<button class="btn btn-primary" data-do="approve">Put it on the map</button>' +
            '<button class="btn btn-ghost" data-do="delete">Delete</button>' +
          '</p>' +
        '</article>';
      }).join('');
      reviewSay('', rows.length + (rows.length === 1 ? ' report' : ' reports') + ' waiting.');

      list.onclick = function (e) {
        var b = e.target.closest('button[data-do]');
        if (!b) return;
        var item = b.closest('.pending-item');
        var id = item.getAttribute('data-id');
        var act = b.getAttribute('data-do');

        if (act === 'delete' && !window.confirm(
              'Delete this report for good? This cannot be undone.')) return;

        item.querySelectorAll('button').forEach(function (x) { x.disabled = true; });
        var ref = r.fs.doc(r.db, MAP_COLLECTION, id);
        var job;
        if (act === 'approve') {
          job = r.fs.updateDoc(ref, { status: 'approved' });
        } else {
          // A rejected report takes its email with it. Deleting a contact
          // that does not exist succeeds, so this is safe either way.
          var batch = r.fs.writeBatch(r.db);
          batch.delete(ref);
          batch.delete(r.fs.doc(r.db, MAP_CONTACTS, id));
          job = batch.commit();
        }

        job.then(function () {
          item.remove();
          reviewSay('ok', act === 'approve'
            ? 'Approved — it is on the map now.'
            : 'Deleted.');
          if (!list.querySelector('.pending-item')) {
            list.innerHTML = '<p class="empty">Nothing waiting. The queue is empty.</p>';
          }
        }).catch(function () {
          item.querySelectorAll('button').forEach(function (x) { x.disabled = false; });
          reviewSay('err', 'That did not go through. The rules may not list your address as an editor.');
        });
      };
    }
  }


  /* ======================================================================
     11. HOUSING PRICE CHART  (your-town.html)
     ----------------------------------------------------------------------
     One line, thirty-six years, two marked dates. Data and sources live in
     housing.js so this file never holds a number that isn't checkable.

     The chart is deliberately undramatic. A vertical rule on a price line
     invites the reader to conclude that the rule caused the prices, and this
     data cannot support that in either direction — so the marks are hairlines
     in muted grey, not red flags, and the caption says what the chart does
     and does not show. Overclaiming here would cost more credibility than
     the chart buys.
     ====================================================================== */

  var CH = { w: 880, h: 400, ml: 68, mr: 26, mt: 26, mb: 46 };

  function money(n) {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(2).replace(/0$/, '') + 'M';
    return '$' + Math.round(n / 1000) + 'k';
  }
  function moneyFull(n) { return '$' + n.toLocaleString('en-US'); }

  function renderHousing() {
    var host = document.getElementById('housing-chart');
    if (!host || typeof MEDIAN_SFH === 'undefined' || !MEDIAN_SFH.length) return;

    var data = MEDIAN_SFH;
    var x0 = data[0][0], x1 = data[data.length - 1][0];
    var yMax = 1050000;                     // clean ceiling above the 2025 peak
    var plotW = CH.w - CH.ml - CH.mr;
    var plotH = CH.h - CH.mt - CH.mb;

    function sx(yr) { return CH.ml + (yr - x0) / (x1 - x0) * plotW; }
    function sy(v)  { return CH.mt + plotH - (v / yMax) * plotH; }

    // ---- gridlines and y labels -----------------------------------------
    var grid = '', yTicks = [0, 250000, 500000, 750000, 1000000];
    yTicks.forEach(function (v) {
      var y = sy(v);
      grid += '<line class="c-grid" x1="' + CH.ml + '" y1="' + y +
              '" x2="' + (CH.ml + plotW) + '" y2="' + y + '"/>' +
              '<text class="c-ytick" x="' + (CH.ml - 10) + '" y="' + (y + 4) +
              '" text-anchor="end">' + (v === 0 ? '0' : money(v)) + '</text>';
    });

    // ---- x labels every five years --------------------------------------
    var xlab = '';
    for (var yr = x0; yr <= x1; yr += 5) {
      xlab += '<text class="c-xtick" x="' + sx(yr) + '" y="' + (CH.mt + plotH + 22) +
              '" text-anchor="middle">' + yr + '</text>';
    }
    if ((x1 - x0) % 5 !== 0) {
      xlab += '<text class="c-xtick" x="' + sx(x1) + '" y="' + (CH.mt + plotH + 22) +
              '" text-anchor="middle">' + x1 + '</text>';
    }

    // ---- the line and its wash ------------------------------------------
    var pts = data.map(function (d) { return sx(d[0]) + ',' + sy(d[1]); });
    var line = '<polyline class="c-line" points="' + pts.join(' ') + '"/>';
    var area = '<polygon class="c-area" points="' +
               sx(x0) + ',' + sy(0) + ' ' + pts.join(' ') + ' ' +
               sx(x1) + ',' + sy(0) + '"/>';

    // ---- the two ADU marks ----------------------------------------------
    var marks = '';
    (typeof ADU_MARKS !== 'undefined' ? ADU_MARKS : []).forEach(function (m, i) {
      var x = sx(m.at);
      marks += '<line class="c-mark" x1="' + x + '" y1="' + CH.mt +
               '" x2="' + x + '" y2="' + (CH.mt + plotH) + '"/>' +
               '<text class="c-marklab" x="' + (x - 7) + '" y="' + (CH.mt + 13 + i * 17) +
               '" text-anchor="end">' + esc(m.short) + '</text>';
    });

    // ---- endpoint, directly labeled ------------------------------------
    var last = data[data.length - 1];
    var end = '<circle class="c-dot" cx="' + sx(last[0]) + '" cy="' + sy(last[1]) + '" r="4.5"/>' +
              '<text class="c-endlab" x="' + (sx(last[0]) - 8) + '" y="' + (sy(last[1]) - 12) +
              '" text-anchor="end">' + money(last[1]) + '</text>';

    host.innerHTML =
      '<svg class="chart" viewBox="0 0 ' + CH.w + ' ' + CH.h + '" role="img" ' +
        'tabindex="0" aria-label="Median price of an existing single-family home in ' +
        'San Diego County, ' + x0 + ' to ' + x1 + '. It rises from ' +
        moneyFull(data[0][1]) + ' to ' + moneyFull(last[1]) + '. Full figures are in ' +
        'the table below the chart.">' +
        grid + area + line + marks + end + xlab +
        '<line class="c-cross" x1="0" y1="' + CH.mt + '" x2="0" y2="' +
          (CH.mt + plotH) + '" style="opacity:0"/>' +
        '<circle class="c-hit" cx="0" cy="0" r="5" style="opacity:0"/>' +
      '</svg>' +
      '<div class="c-tip" id="c-tip" hidden></div>';

    wireHousingHover(host, data, sx, sy);
    fillHousingTable(data);
  }

  function wireHousingHover(host, data, sx, sy) {
    var svg   = host.querySelector('svg');
    var cross = host.querySelector('.c-cross');
    var hit   = host.querySelector('.c-hit');
    var tip   = document.getElementById('c-tip');
    var idx   = -1;

    function show(i) {
      if (i < 0 || i >= data.length) return;
      idx = i;
      var d = data[i], x = sx(d[0]), y = sy(d[1]);
      cross.setAttribute('x1', x); cross.setAttribute('x2', x);
      cross.style.opacity = '1';
      hit.setAttribute('cx', x); hit.setAttribute('cy', y);
      hit.style.opacity = '1';

      // textContent, not innerHTML — the value is data, not markup.
      tip.textContent = '';
      var v = document.createElement('b'); v.textContent = moneyFull(d[1]);
      var s = document.createElement('span'); s.textContent = d[0];
      tip.appendChild(v); tip.appendChild(s);
      tip.hidden = false;

      var box = svg.getBoundingClientRect();
      var scale = box.width / CH.w;
      var left = x * scale;
      tip.style.left = Math.max(4, Math.min(box.width - 4, left)) + 'px';
      tip.style.top  = (y * scale) + 'px';
    }
    function hide() {
      cross.style.opacity = '0'; hit.style.opacity = '0';
      tip.hidden = true; idx = -1;
    }
    function nearest(clientX) {
      var box = svg.getBoundingClientRect();
      var vx = (clientX - box.left) / box.width * CH.w;
      var best = 0, bd = Infinity;
      for (var i = 0; i < data.length; i++) {
        var d = Math.abs(sx(data[i][0]) - vx);
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }

    svg.addEventListener('pointermove', function (e) { show(nearest(e.clientX)); });
    svg.addEventListener('pointerleave', hide);
    svg.addEventListener('blur', hide);
    svg.addEventListener('focus', function () { show(idx < 0 ? data.length - 1 : idx); });
    // Same information from the keyboard as from the pointer.
    svg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var i = idx < 0 ? data.length - 1 : idx + (e.key === 'ArrowRight' ? 1 : -1);
        show(Math.max(0, Math.min(data.length - 1, i)));
      } else if (e.key === 'Escape') { hide(); }
    });
  }

  function fillHousingTable(data) {
    var body = document.getElementById('housing-rows');
    if (!body) return;
    body.innerHTML = data.map(function (d) {
      return '<tr><td>' + d[0] + '</td><td>' + moneyFull(d[1]) + '</td></tr>';
    }).join('');

    var src = document.getElementById('housing-source');
    if (src && typeof MEDIAN_SFH_SOURCE !== 'undefined') {
      src.innerHTML = 'Source: <a href="' + MEDIAN_SFH_SOURCE.url + '" rel="noopener">' +
                      esc(MEDIAN_SFH_SOURCE.label) + '</a>.';
    }

    var notes = document.getElementById('housing-marks');
    if (notes && typeof ADU_MARKS !== 'undefined') {
      notes.innerHTML = ADU_MARKS.map(function (m) {
        return '<li><b>' + esc(m.label) + '</b> ' + esc(m.detail) +
               (m.url ? ' <a href="' + m.url + '" rel="noopener">Source &rarr;</a>' : '') +
               '</li>';
      }).join('');
    }
  }


  /* ----------------------------------------------------------------------
     11b. THE INDEXED CHART — home price vs rent vs everything else.

     Three series, three units (dollars, two CPI indexes), so they are all
     re-based to 1990 = 100. That is the only honest way to put them on one
     picture: a second y-axis would let us choose where the lines cross.

     The inflation line is not decoration. "Isn't that just inflation?" is
     the first question a sceptical reader asks, and a chart that cannot
     answer it loses the argument to whoever asks it first.
     ---------------------------------------------------------------------- */

  function rebase(series) {
    var base = series[0][1];
    return series.map(function (d) { return [d[0], d[1] / base * 100]; });
  }

  function renderIndexChart() {
    var host = document.getElementById('index-chart');
    if (!host || typeof MEDIAN_SFH === 'undefined' || typeof RENT_CPI === 'undefined') return;

    var series = [
      { key: 'price', label: 'Home price', cls: 's-price', rows: rebase(MEDIAN_SFH) },
      { key: 'rent',  label: 'Rent',       cls: 's-rent',  rows: rebase(RENT_CPI) },
      { key: 'cpi',   label: 'All prices', cls: 's-cpi',   rows: rebase(CPI_ALL) }
    ];

    var x0 = series[0].rows[0][0];
    var x1 = series[0].rows[series[0].rows.length - 1][0];
    var yMin = 80, yMax = 600;
    var plotW = CH.w - CH.ml - CH.mr;
    var plotH = CH.h - CH.mt - CH.mb;

    function sx(yr) { return CH.ml + (yr - x0) / (x1 - x0) * plotW; }
    function sy(v)  { return CH.mt + plotH - (v - yMin) / (yMax - yMin) * plotH; }

    var grid = '';
    [100, 200, 300, 400, 500, 600].forEach(function (v) {
      var y = sy(v);
      grid += '<line class="c-grid' + (v === 100 ? ' c-base' : '') + '" x1="' + CH.ml +
              '" y1="' + y + '" x2="' + (CH.ml + plotW) + '" y2="' + y + '"/>' +
              '<text class="c-ytick" x="' + (CH.ml - 10) + '" y="' + (y + 4) +
              '" text-anchor="end">' + v + '</text>';
    });
    grid += '<text class="c-baselab" x="' + (CH.ml + 6) + '" y="' + (sy(100) - 7) +
            '">1990 level</text>';

    var xlab = '';
    for (var yr = x0; yr <= x1; yr += 5) {
      xlab += '<text class="c-xtick" x="' + sx(yr) + '" y="' + (CH.mt + plotH + 22) +
              '" text-anchor="middle">' + yr + '</text>';
    }
    xlab += '<text class="c-xtick" x="' + sx(x1) + '" y="' + (CH.mt + plotH + 22) +
            '" text-anchor="middle">' + x1 + '</text>';

    // Mark labels go at the BOTTOM on this chart: the three series all finish
    // high on the right, and at the top they collide with the end labels.
    var marks = '';
    (typeof ADU_MARKS !== 'undefined' ? ADU_MARKS : []).forEach(function (m, i) {
      var x = sx(m.at);
      marks += '<line class="c-mark" x1="' + x + '" y1="' + CH.mt +
               '" x2="' + x + '" y2="' + (CH.mt + plotH) + '"/>' +
               '<text class="c-marklab" x="' + (x - 7) + '" y="' +
               (CH.mt + plotH - 8 - i * 16) +
               '" text-anchor="end">' + esc(m.short) + '</text>';
    });

    // Lines, plus a direct end label on each: identity never rests on colour
    // alone (the aqua sits under 3:1 on this surface — see the palette note).
    var lines = '', ends = '';
    series.forEach(function (s) {
      lines += '<polyline class="c-line ' + s.cls + '" points="' +
               s.rows.map(function (d) { return sx(d[0]) + ',' + sy(d[1]); }).join(' ') + '"/>';
      var last = s.rows[s.rows.length - 1];
      ends += '<circle class="c-dot ' + s.cls + '" cx="' + sx(last[0]) + '" cy="' +
              sy(last[1]) + '" r="4"/>' +
              '<text class="c-serieslab" x="' + (sx(last[0]) - 9) + '" y="' +
              (sy(last[1]) + 4) + '" text-anchor="end">' + esc(s.label) + ' ' +
              (last[1] / 100).toFixed(1) + '&times;</text>';
    });

    host.innerHTML =
      '<div class="c-legend">' + series.map(function (s) {
        return '<span class="c-key"><i class="' + s.cls + '"></i>' + esc(s.label) + '</span>';
      }).join('') + '</div>' +
      '<svg class="chart" viewBox="0 0 ' + CH.w + ' ' + CH.h + '" role="img" ' +
        'aria-label="San Diego home prices, rent and general prices from ' + x0 +
        ' to ' + x1 + ', each set to 100 in ' + x0 + '. By ' + x1 +
        ' home prices reach 551, rent 361 and all prices 280. Full figures are in ' +
        'the table below.">' +
        grid + marks + lines + ends + xlab +
      '</svg>';

    fillIndexTable(series);
  }

  function fillIndexTable(series) {
    var body = document.getElementById('index-rows');
    if (body) {
      var years = series[0].rows.map(function (d) { return d[0]; });
      body.innerHTML = years.map(function (yr, i) {
        return '<tr><td>' + yr + '</td>' + series.map(function (s) {
          return '<td>' + s.rows[i][1].toFixed(0) + '</td>';
        }).join('') + '</tr>';
      }).join('');
    }
    var src = document.getElementById('index-source');
    if (src && typeof INDEX_SOURCES !== 'undefined') {
      src.innerHTML = 'Sources: ' + INDEX_SOURCES.map(function (o) {
        return '<a href="' + o.url + '" rel="noopener">' + esc(o.label) + '</a>';
      }).join(' &middot; ') + '.';
    }
  }

  /* ======================================================================
     12. OUTREACH TALLY  (index.html, the Balboa Park section)
     ----------------------------------------------------------------------
     When the council points people at someone else's survey — the City's,
     SANDAG's — we can't see that survey's responses. So we count our own
     part in it, two ways, and say plainly which is which:

       opened — clicked through to the survey from this site. Counted once
                per browser, automatically. Interest, not a finished survey.
       took   — tapped "I took it". Once per browser, and it is the visitor's
                word, so the page says "say they finished it".

     Markup: an element with data-tally="<campaign>" holding an
     a[data-tally-open] link, a button[data-tally-took], and a
     [data-tally-count] line. Reusable for the next survey: new campaign
     name, same markup. Each tap is one document in outreach_taps with its
     date, so the numbers can be broken down by day for the City.
     ====================================================================== */

  var TALLY_COLLECTION = 'outreach_taps';

  function tallyFlag(campaign, kind, set) {
    var k = 'lvtc.tally.' + campaign + '.' + kind;
    try {
      if (set) localStorage.setItem(k, '1');
      return localStorage.getItem(k) === '1';
    } catch (e) { return false; }
  }

  function tallyRecord(campaign, kind) {
    if (tallyFlag(campaign, kind)) return Promise.resolve(false);
    return remoteReady().then(function (r) {
      if (!r) return false;
      return r.fs.addDoc(r.fs.collection(r.db, TALLY_COLLECTION), {
        campaign: campaign,
        kind: kind,
        date: new Date().toISOString().slice(0, 10),
        created: r.fs.serverTimestamp()
      }).then(function () { tallyFlag(campaign, kind, true); return true; });
    }).catch(function () { return false; });
  }

  function tallyCount(r, campaign, kind) {
    var q = r.fs.query(r.fs.collection(r.db, TALLY_COLLECTION),
                       r.fs.where('campaign', '==', campaign),
                       r.fs.where('kind', '==', kind));
    return r.fs.getCountFromServer(q).then(function (s) { return s.data().count; });
  }

  function initTallies() {
    var boxes = document.querySelectorAll('[data-tally]');
    Array.prototype.forEach.call(boxes, function (box) {
      var campaign = box.getAttribute('data-tally');
      var since = box.getAttribute('data-tally-since') || '';
      var line = box.querySelector('[data-tally-count]');
      var open = box.querySelector('a[data-tally-open]');
      var took = box.querySelector('button[data-tally-took]');

      function show() {
        if (!line) return;
        remoteReady().then(function (r) {
          if (!r) return;
          return Promise.all([tallyCount(r, campaign, 'opened'), tallyCount(r, campaign, 'took')])
            .then(function (n) {
              var opened = n[0], done = n[1];
              var when = since ? 'Since ' + fmtTallyDate(since) + ', ' : '';
              line.textContent = (opened || done)
                ? when + opened + (opened === 1 ? ' person has' : ' people have') +
                  ' opened the City\u2019s survey from this page, and ' + done +
                  (done === 1 ? ' says they' : ' say they') + ' finished it.'
                : 'Nobody has opened the survey from this page yet. You could be the first.';
              line.hidden = false;
            });
        }).catch(function () { /* no number is better than a wrong one */ });
      }

      function markTook() {
        took.disabled = true;
        took.textContent = 'Thanks \u2014 you\u2019re counted';
      }

      if (open) open.addEventListener('click', function () {
        // The link opens in a new tab, so this page stays alive to finish
        // the write, and is still here for "I took it" when they come back.
        tallyRecord(campaign, 'opened').then(function (added) { if (added) show(); });
      });

      if (took) {
        if (tallyFlag(campaign, 'took')) markTook();
        took.addEventListener('click', function () {
          took.disabled = true;
          tallyRecord(campaign, 'took').then(function (added) {
            if (added || tallyFlag(campaign, 'took')) { markTook(); show(); }
            else { took.disabled = false; }
          });
        });
      }

      show();
    });
  }

  function fmtTallyDate(iso) {
    var m = ['January','February','March','April','May','June','July','August',
             'September','October','November','December'];
    var p = iso.split('-');
    return parseInt(p[2], 10) + ' ' + m[parseInt(p[1], 10) - 1];
  }

  /* ====================================================================== */
  function init() {
    renderNextMeeting();
    renderEvents();
    buildForm();
    renderResults();
    wirePoll();
    wireNav();
    renderZoomLinks();
    renderStanding();
    renderFlyer();
    renderRecaps();
    renderAdvocacy();
    renderHousing();
    renderIndexChart();
    renderRecordSummary();
    renderRecord('all');
    wireRecord();
    renderSurveys();
    renderBoard();
    renderBusinesses('all');
    wireBusinesses();
    wireForms();
    initMap();
    initReview();
    initTallies();
    var y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
