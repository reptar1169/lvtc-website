# Linda Vista Town Council — rebuilt site

Static HTML/CSS/JS. No build step, no framework, no dependencies.

## Deploy

    firebase init hosting     # public directory: this folder
    firebase deploy

## Files

| File | What it is |
|---|---|
| `index.html` | Home |
| `meetings.html` | Meetings + the minutes record |
| `your-town.html` | Comstock and Route 41, with survey results |
| `board.html` | Board members |
| `businesses.html` | Business directory + listing form |
| `membership.html` | Dues and what they get you |
| `contact.html` | Contact routes and form |
| `styles.css` | All styling. Brand tokens are at the top. |
| `app.js` | All behaviour. Sections are numbered. |
| `minutes.js` | **Edit this when the secretary sends a document.** |
| `minutes/` | All 40 meeting documents, hosted here. Filenames are `YYYY-MM-DD-{board\|general}.{pdf\|doc}`. |
| `surveys.js` | Closed survey results. |
| `board.js` | Board members and open seats. |
| `businesses.js` | Business listings. |

Images: `logo.png` (header mark, transparent), `favicon.png`,
`apple-touch-icon.png`, `og-image.jpg` (social share card), `venmo-qr.png`.
All generated from "LVTC logo with words.jpeg". Without `logo.png` the header
falls back to the wordmark — nothing breaks.

**"LVTC logo.svg" is not a real vector** — it's a single 3017x3017 PNG
base64'd inside an SVG wrapper, with zero paths, and the artwork inside it is
a red field with outline strokes rather than the logo as used. Worth asking
whoever made the logo for a true vector original.

## Before it goes live

0. ~~Migrate minutes off Squarespace~~ — done Sept 2026. Nothing on the site
   depends on the Squarespace subscription any more.
1. ~~Contact email~~ — done: `lvtowncouncil@gmail.com`, set site-wide.
2. **Add the real social URLs**, or leave the block commented out in the
   footer of every page. Do not restore the old `instagram.com` placeholders.
3. ~~Venmo handle and QR~~ — done. `venmo-qr.png` is verified to decode to the
   council's Venmo code.
4. ~~Zoom link~~ — done. It now lives in one constant, `ZOOM_URL` at the top
   of `app.js`; both meetings and every "Join on Zoom" link read from it.

   **As of September 2026 only the board meeting uses it.** General meetings are
   in person only at the Baha'i Faith Center; board meetings are Zoom only (the
   council no longer has the library room). Both are set in `SCHEDULE` at the top
   of `app.js` — the board entry's `location` *is* the Zoom link, so there is no
   separate `remote`/`remoteUrl`. If either ever changes back, the comments in
   `SCHEDULE` say exactly which fields to restore.
5. **Fill in the board** in `board.js`, and the real open seats.
6. **Check the business discounts** in `businesses.js` with each owner.
7. No store. The Squarespace store never made a sale, so it wasn't carried
   over and the footer link is gone. To add one later: make the products in
   Printful, set up a Printful Quick Store, and put one link back in the
   "Around town" list in each footer.
8. Hometown Heroes was not rebuilt, and its footer link has been removed too.

## Forms

Both the poll and the contact forms work with no server:

- **Poll** (`app.js`, section 2) uses seed data + localStorage. Switch
  `BACKEND` to `'firestore'` and uncomment the block to make it real.
- **Contact forms** (`app.js`, section 6) fall back to opening the visitor's
  mail client. Set `CONTACT_ENDPOINT` to a Cloud Function URL to take
  submissions directly.

## Updating the monthly speaker

Open `app.js` and add a line to `SPEAKERS` near the top:

    var SPEAKERS = {
      '2026-10-21': { name: 'Officer Adamek', topic: 'SDPD traffic enforcement' }
    };

The key is the meeting date. The speaker shows on the homepage card and in
the events list, and stops showing once that meeting has passed. Leave a date
out and the site says nothing about a speaker, rather than "TBD".

Fields: `name` is required, `topic` and `url` are optional. Add `url` and the
name becomes a link:

    '2026-10-21': {
      name: 'Assy Member Chris Ward',
      url:  'https://a78.asmdc.org/',
      topic: 'Legislative update'
    }

Only `http://` and `https://` links are turned into anchors — anything else
renders as plain text, so a typo can't produce a broken or unsafe link.

### How people reach the flyer

The homepage next-meeting card always ends with **"See the flyer for our next
general meeting →"**, in `renderNextMeeting`. Two things about that are
deliberate:

- **It is unconditional.** It used to render only when `slug === 'general'`, so
  for the ~2 weeks a month while the board meeting was next it vanished — and
  since nothing else linked `/meeting` at the time, the page had no route in at
  all for half of every month.
- **The label names the general meeting**, not "this meeting". The flyer page
  always renders the next *general* meeting regardless of which meeting is next,
  so "this meeting" was wrong whenever a board meeting was next.

Also linked from the `/events` page. Not in the nav or footers — it is a
single-purpose page that changes every month.

### "No remote field" does not mean "in person"

The next-meeting card and the flyer both pick a Format line from the rule. The
test used to be `rule.remote ? "join online" : "in person"`, which was fine while
the only remote-less rule was the in-person general meeting. When board meetings
went Zoom-only their Zoom link became `location`, not `remote` — so the card
printed **"Format: In person — no online option"** directly under **"Where:
Online on Zoom"**. Live, for anyone checking how to attend.

The board rule now carries an explicit **`onlineOnly: true`** and both renderers
read it. If you ever add a third meeting kind, set the format explicitly on it
rather than letting it be inferred from which fields are missing.

### The flyer prints to one sheet — keep it that way

`@media print` in `styles.css` hides the site header, footer, the on-screen
action buttons **and `.agenda-ask`**, the agenda-request form that also lives on
`/meeting`. That last one was missing until Sept 2026, so every flyer printed a
second sheet containing a web form nobody can fill in on a noticeboard. If you
add anything else to `meeting.html`, print it to PDF and check the page count
before you trust it.

## Turning the poll on (Firestore)

Out of the box the poll stores answers in the visitor's own browser: it works,
but nobody else sees them. To collect real responses:

1. Firebase console -> Project settings -> General -> Your apps. Add a web app
   if there isn't one, and copy the config object.
2. Paste it into `firebase-config.js`, uncommenting the lines.
3. `firebase deploy --only firestore:rules,hosting`

`firestore.rules` allows anyone to read the poll and to create one response.
Nothing can be edited or deleted, and no other collection is reachable. The
config values are not secrets — they ship in every Firebase web app. The rules
are what protect the data.

**One vote per browser.** Each browser generates a random id, kept in its own
local storage and used as the Firestore document id. A second submission from
the same browser is an overwrite, which the rules refuse, so the form locks
itself and says so. The id is per-poll, so nobody reading the public responses
can link one browser's answers across different polls.

**What that does not stop:** the same person voting from another browser, a
private window, a phone, or after clearing site data — each looks like a new
browser. It prevents accidental and casual double-voting, not determined
ballot stuffing. The old Squarespace form had no protection at all. If a poll
ever matters enough to need real protection, turn on Firebase App Check.

## Closing a poll and starting a new one

Do it in this order. Step 4 is the one that breaks things if skipped.

1. **Read the final counts.** Open the live site, open the browser console and
   type `LVTC.pollCounts()`. It prints an archive-ready block — every question
   with its counts, highest answer first — which you can copy from the output.

   It reads from Firestore, so it returns a promise. `copy(LVTC.pollCounts())`
   would copy the words "[object Promise]". To go straight to the clipboard use
   `copy(await LVTC.pollCounts())` instead.

   Chrome blocks pasting into the console until you type "allow pasting" — a
   protection against scams that talk people into pasting hostile code. Typing
   the short command avoids the issue entirely.

2. **Archive it** in `surveys.js` — a new entry with `closed: true`, the date
   it ran, the counts from step 1, a short intro and a takeaway. It then shows
   on Your Town alongside the Comstock and Route 41 results.

3. **Write the new poll** in `app.js`: change `POLL_ID` to a new short name,
   and replace `QUESTIONS`. Clear `SEED` to `[]` unless the new poll genuinely
   starts with prior responses.

4. **Update `firestore.rules`** so `validAnswers()` lists the new question ids.
   Miss this and every submission is silently rejected — the form will look
   like it worked and nothing will be stored.

5. **Deploy rules first, then hosting:**

       firebase deploy --only firestore:rules
       firebase deploy --only hosting

Old responses stay in Firestore untouched. Each document records which poll it
belongs to, so counts from different polls never mix.

## Caching

Firebase Hosting defaults to `Cache-Control: max-age=3600` on everything, which
means a browser keeps showing the old site for up to an hour after a deploy.
The `headers` block in `firebase.json` overrides that:

- pages, CSS, JS -> `no-cache`: the browser revalidates every request and gets
  a cheap `304 Not Modified` when nothing changed, so a deploy is visible at
  once without re-downloading unchanged files.
- images, PDFs, Word docs -> `max-age=86400`: cached for a day. To make an
  image change visible immediately, save it under a new filename.

`no-cache` does **not** mean "never cache" — it means "check first".

## Recaps and the advocacy ledger

Both live in `updates.js`.

**`RECAPS`** — a couple of hundred words after each meeting, published within a
day or two. Not minutes: minutes are the approved record and arrive a month
later. This is what happened and what's next, for people who weren't there. It
shows on the Meetings page above the minutes record. Newest first.

**`ADVOCACY`** — what the council asked for and what came back, on Your Town.
Entries with `published: false` are ignored entirely, so you can draft one in
the file without it going public. Leave `outcome` empty and it renders
"Awaiting a reply" — publishing the unanswered asks is the point, so they stay
visible instead of quietly disappearing.

Two entries are started from your own survey data. I don't know who they were
sent to, when, or what came back, so those fields are blank and both are set
to `published: false`. Fill them in and flip the flag.

## Agenda requests

The form on `/meeting` sends to whatever `CONTACT_ENDPOINT` is set to in
`app.js`, falling back to opening the sender's mail client. Same plumbing as
the contact and business forms.

## Things that maintain themselves

- Meeting dates come from the recurrence rule in `SCHEDULE`, so they never
  go stale and never need editing.
- The minutes record generates every meeting that should exist and marks
  each posted, pending, or outstanding.
- The footer year, the events list, and every survey chart are computed.

## The "New Here" page (`new.html`)

A practical orientation page for people who just moved to Linda Vista, at `/new`.
It is linked from the main nav, from the hero on the home page, and from the
"Around town" list in every footer.

Everything on it is either a link to the source (City, MTS, the organization
itself) or a fact taken from that source on 15 September 2026:

| Thing | Source of truth |
|---|---|
| Trash / recycling day | `getitdone.sandiego.gov/CollectionMapLookup` |
| Reporting problems | `sandiego.gov/get-it-done` |
| Council District 7 | `sandiego.gov/citycouncil/cd7` |
| Library hours | `sandiego.gov/public-library/locations/linda-vista-library` |
| Rec center hours | `sandiego.gov/park-and-recreation/centers/recctr/lindavista` |
| Tecolote Canyon | `sandiego.gov/park-and-recreation/parks/osp/tecolote` |
| Planning Group meeting time | `sandiego.gov/planning/community-plans/linda-vista/planning-group` |
| Farmers market | `lovelindavista.org` |
| Skateworld | `skateworld.com` |
| Bus Route 44 | `sdmts.com` |

**The only things that go stale are hours and the councilmember's name.** Hours are
written loosely ("roughly", "check before you go") and every card links out, so a
change at the source does not make the page wrong — just less precise. Worth a
re-check once a year, and after any District 7 election.

The "Who decides what" section is the part that is genuinely ours and not
available anywhere else: Town Council vs. Planning Group vs. the councilmember's
office. Leave it in. It is the most useful thing on the page.

### The state level on "Who decides what"

Added Sept 2026: a fourth card for **Assemblymember Chris Ward, District 78**,
linking his office's [bill idea form](https://ward.asmdc.org/do-you-have-bill-idea).
The reason it earns a place is the ADU argument — that frame is state law, not
city policy, so a resident who brings an ADU complaint to us is several levels
away from the body that can change it. This is the level.

Two things the copy is deliberately careful about:

- The form is **open to constituents of Assembly District 78** and asks for a
  name and a home address. The card says so. The council is not collecting or
  endorsing submissions; residents are writing to Ward directly.
- **Whether all of Linda Vista is in AD-78 is unconfirmed.** A 2021 Times of San
  Diego piece had Via Las Cumbres splitting the neighborhood between Assembly
  districts 78 and 79 — but that was the pre-2022 map, and AD-79 has since moved
  to southeastern San Diego under LaShae Sharp-Collins, which suggests the split
  is gone. Suggestive, not settled. The card tells anyone near the western edge
  to check. **Ask Ward's staff at the October meeting and then simplify that
  sentence** — an instruction to go verify your own district is a worse
  experience than not needing one.

## The problem map (`map.html`, `/map`)

Neighbours drop a pin, pick a category, write a sentence. Nothing they send
appears on the map until you approve it.

### Approving a report

Bookmark **`/review`**. Sign in with Google, read the note, click *Put it on the
map* or *Delete*. Nothing to deploy.

The Firebase console is the fallback if `/review` ever breaks: **Firestore
Database** -> `map_reports` -> change `status` from `"pending"` to `"approved"`,
or delete the document.

Either way, a human reads every report before it is public. See "Getting told
about new reports" below for how you find out one is waiting.

The rules enforce this from the other side, so it does not depend on the page
behaving. **The public** can only create documents whose `status` is exactly
`"pending"`, can never update or delete one, and can only read documents already
marked `"approved"`. **An editor** — an address in the `isEditor()` list — can
additionally read everything and flip `status`, which is the only field they are
allowed to touch, plus delete. So an approved report always carries the words the
resident actually wrote, at the spot they actually picked.

Check this yourself after any rules change: open `/map` in a private window,
submit a test report, confirm it does **not** appear, then approve it and reload.

### Order of deploys

`firestore.rules` must be deployed **before** the hosting deploy, or the first
reports get rejected:

    firebase deploy --only firestore:rules
    firebase deploy --only hosting

### Leaflet

The map uses Leaflet 1.9.4. `app.js` asks for `/vendor/leaflet/leaflet.js`
first and falls back to a CDN if that 404s, so the map works whether or not the
local copy is there. Run it once to get the local copy:

    ./vendor-leaflet.sh

Worth doing: a community site that has to keep working for years shouldn't
depend on someone else's CDN still being there. `vendor/` is cached for a year
by `firebase.json` (it is version-pinned, so that is safe); `*.sh` is in the
ignore list so the script itself is never published.

Map tiles come from OpenStreetMap, whose attribution is in the corner of the map
and must stay there.

### Where pins are allowed

Only inside Linda Vista **as the City draws it** — the "Linda Vista"
community planning area from the City's open data (`cmty_plan_datasd.geojson`,
data.sandiego.gov). The outline is in `lv-boundary.js`, simplified from the
City's 1,759 points to about 110, none more than 5 m off. The map draws it as a
dashed line and shades everything outside.

- **The page** checks the real outline: a tap, a drag, or "Use my location"
  outside it gets a plain message instead of a pin. A pin within 40 m of the
  line still counts, because the line mostly runs down the middle of border
  streets (`LV_EDGE_M` in `app.js`).
- **The rules** can't test a point against an irregular shape, so they check a
  rectangle: the outline's extent plus about 200 m. That box is `LV_BOUNDS` in
  `app.js` and the lat/lng limits in `validReport()` in `firestore.rules` —
  change both together. Between the outline and the box, moderation is the gate.

If the City ever redraws the boundary, regenerate `lv-boundary.js` from the
new file (instructions at its top), then update the box in both places.

### Categories

`CATEGORIES` at the top of section 9 in `app.js`. **Adding or renaming a key
means changing `firestore.rules` too** — the category list is validated there.
Deploy the rules first, as above.

### Why the pins are all the same colour

Six categories that stay distinguishable against arbitrary map tiles, in light
and dark, for colour-blind readers, is not a palette that exists — so colour
carries no meaning here. The glyph inside the pin and the filter row carry the
category instead. If you ever want colour on this map, use it for something
binary and meaningful (reported vs. fixed), not for the category.

### What it collects, and the one optional thing

No name, no IP address. A report is a pin, a category, a sentence and a date.

**An email address, only if the reporter types one.** The form has an optional
step 4, "Want to hear what happens?". Leave it blank and the report is exactly
as anonymous as before.

Where it goes matters. **Approved reports are publicly readable, every field**
— that is how the map loads them. So the email is *never* on the report. It
goes in a separate collection, `map_report_contacts`, under the same document
id, written in one batch with the report. The rules let only an editor read or
delete it, nobody edit it, and a browser create it only together with a brand
new pending report (so nobody can attach an address to someone else's report).

Following up:

- The new-report email says "Wants to hear back: …" or "Anonymous".
- `/review` shows the address on pending reports, and has a second list,
  **Waiting to hear back**, of approved reports with an address on file.
  Email them when the council acts, then click **Done** — that deletes the
  address. The report stays on the map.
- Deleting a report from `/review` deletes its email with it. Deleting one in
  the Firebase console does **not** — the address then shows on `/review` as
  "Report no longer exists" until you click Done.

The promise on `/map` is: board-only, used only to report back on that issue,
deleted once it is closed, never put on a mailing list. Keep it. If the council
ever wants a mailing list from this form, that is a separate, unticked-by-default
checkbox — not a reuse of these addresses.

### Rate limiting

One report per browser per five minutes, kept in `localStorage`. This stops a
stuck finger, not a determined person. Moderation is the real gate.

## Getting told about new reports

Two things, and they are independent — either works without the other.

### 1. Email, every time (`functions/`)

A Cloud Function watches `map_reports` and emails `lvtowncouncil@gmail.com`
whenever a report is created. The email has the category, what the person wrote,
a Google Maps link to the pin, and a direct link to the document.

**Setup, once, in your own Terminal from this folder:**

    cd functions && npm install && cd ..
    firebase functions:secrets:set SMTP_PASSWORD
    firebase deploy --only functions

`SMTP_PASSWORD` is a Google **app password**, not the account password. Make one
at `myaccount.google.com/apppasswords` — the account needs 2-step verification
turned on first. It is stored in Google Secret Manager: not in these files, not
in the repo, not in the deployed site. Nobody but you ever types it.

Mail currently goes to `lvtowncouncil@gmail.com` **and** `schoellojeff@gmail.com`.
To change that, edit `NOTIFY_TO` at the top of `functions/index.js` — commas for
several addresses — and run `firebase deploy --only functions`.

Note `SEND_AS` is separate: that is the account the app password belongs to, and
it must stay `lvtowncouncil@gmail.com` or authentication fails.

Two things to know:

- **This needs the Blaze plan** (which the project is on). At this volume the
  usage sits inside the free quota, so the expected bill is nothing — but set a
  budget alert at a dollar or two in the Google Cloud console anyway, so a
  runaway loop can never become a surprise.
- **One email per report, no batching.** If someone spams the form you get one
  email each. The five-minute client-side throttle is the only brake. If that
  ever becomes a problem, the fix is a daily digest instead of a per-report
  email, not turning the function off.

A failed email is logged and swallowed on purpose — a broken mailbox must never
turn into a lost report. The report is already safe in Firestore before the
email is attempted.

### 2. The review queue (`review.html`, `/review`)

An unlisted page — not in any nav, `noindex` — that lists everything pending
with an Approve and a Delete button.

**Hiding it is not what protects it.** The `isEditor()` list in
`firestore.rules` is. A signed-out visitor who finds the page sees a sign-in
button and nothing else; someone signed in with any other Google account sees an
empty queue, because Firestore refuses to hand over pending documents. To add a
moderator, add their address to `isEditor()` and run
`firebase deploy --only firestore:rules`.

It needs Google sign-in switched on once:
**Firebase console → Authentication → Sign-in method → Google.**

And the site's own domain trusted for sign-in, or the button fails with
`auth/unauthorized-domain`:
**Firebase console → Authentication → Settings → Authorized domains → Add
domain** — `lindavistatowncouncil.org` (and `www.` if that is used). Firebase
only trusts `localhost` and the `*.web.app` / `*.firebaseapp.com` addresses by
default. No deploy needed; reload `/review`.

An editor can only ever flip `status`, never the note or the location — the
rules enforce that, so a report on the map always says what the resident
actually wrote, on the spot they actually picked. Deleting is still allowed,
because rejecting junk has to be possible.

### Worth testing after deploying

1. Open `/map` in a private window and send a test report.
2. Check the email arrives.
3. Confirm the report is **not** on the map.
4. Open `/review`, sign in, approve it, and see it appear.
5. Sign out and reload `/review` — the queue should be empty and unreadable.
6. Send one more test report **with** an email. Check the notification shows
   it, `/review` shows it, and after approving, the public map's data does not
   contain it. Then click Done to delete it.

## Outreach tally (the Balboa Park survey on the home page)

When the council sends people to someone else's survey, we can't see that
survey's responses (the City's Survey123 form has public reading switched off,
including the count). So the site counts its own part, two ways:

- **Opened**: clicks on "Take the City's survey" from this site. Automatic,
  once per browser. It measures interest, not finished surveys.
- **Took**: taps on "I took it". Once per browser, and it is the visitor's own
  word, which is why the page says "say they finished it".

Each one is a document in `outreach_taps`: `campaign`, `kind` (`opened` or
`took`), `date`. Nothing about the person. Anyone can read (the page shows the
counts) and create; nobody can edit or delete. Someone determined could inflate
it from a script, like the poll; it is a good-faith number, not an audited one.

**For the City:** the page shows the running totals. For a breakdown by day,
open **Firestore → `outreach_taps`** in the Firebase console and filter on
`campaign == balboa-2026`; every document has its date.

**Next survey:** copy the markup — a container with `data-tally="<new name>"`
and `data-tally-since="<YYYY-MM-DD>"`, an `a[data-tally-open]` link, a
`button[data-tally-took]`, and a `[data-tally-count]` line. A new campaign name
starts a new count. No rules change needed.

**Your own test clicks count.** Delete them in the console afterwards.

## The housing price charts (`housing.js`, on the home page)

A line of the median sale price of an existing single-family home in San Diego
County, 1990 to 2025, with the two ADU deregulation dates marked.

**The data** is the California Association of Realtors series, as tabulated by
the Los Angeles Almanac, and it is county-wide — no public median goes back to
1990 for one neighborhood. Before it went in, it was cross-checked against the
S&P Case-Shiller San Diego index (FRED `SDXRSA`, January values): over
1990–2025 the median rises 5.5x and Case-Shiller rises 5.3x, and the two turn
in the same years. Those are independent measurements — a median of what sold
versus a repeat-sales index — so agreement on shape is a real check.

**The two marks:**

| Date | What |
|---|---|
| 27 Sep 2016 | California SB 1069 signed (Ch. 720), effective 1 Jan 2017 |
| 27 Oct 2020 | San Diego adopts the Housing Legislation Code Update, creating the ADU Bonus Program |

**Why the marks are grey hairlines and not red flags.** A vertical rule on a
price line invites the reader to conclude the rule caused the prices, and this
data cannot support that in either direction. The caption says so explicitly.
That restraint is the point: the chart's job is to show *how old the problem
is* — prices roughly quadrupled before the Bonus ADU Program existed — not to
imply a causal claim an opponent can knock down and then use to dismiss the
rest of the page.

Both charts live in the "What the council is working on" section at the top of
`index.html` (anchor `/#housing`), because ADUs are the council's lead issue.
The ADU entry in the advocacy ledger on `/your-town` links up to them.
`housing.js` must be loaded on any page that shows them.

**To update them:** add a row to `MEDIAN_SFH`, `RENT_CPI` and `CPI_ALL` in
`housing.js` and adjust the figures quoted in the `<figcaption>`s on
`index.html`. The y-axis ceiling is
`yMax` in section 11 of `app.js`; raise it when the line approaches the top.

**Accessibility:** the chart has an `aria-label` summarizing the series, a
crosshair tooltip on hover *and* on keyboard (focus the chart, then arrow
keys), and a "See the figures" table with every value, so nothing is only
available by pointing at it.

### The indexed chart (home price vs rent vs inflation)

A second chart under the price one. Three series — home price, CPI rent of
primary residence, CPI all items, all San Diego — each re-based to
**1990 = 100**.

**Why indexed and not a second y-axis.** Home price is dollars; the other two
are indexes. Two y-scales on one chart lets whoever drew it choose where the
lines cross, which makes it the most misleading thing you can do to a reader.
Re-basing puts all three in the same unit honestly. Don't "fix" this later by
adding a right-hand axis.

**Why the inflation line is there.** "Isn't that just inflation?" is the first
question a skeptical reader asks. A chart that can't answer it loses to
whoever asks it first. The answer, on the chart: over 1990–2025 home prices
rose 5.5x, rent 3.6x, everything else 2.8x.

**Colors.** Slots 1–3 of the dataviz default categorical theme
(`#eb6834` / `#2a78d6` / `#1baf7a`, with dark-mode steps). The site's own red
and sage were tried first and **fail** the all-pairs color-blind gate together
— sage reads as gray and red↔sage collapses under protanopia. That was checked
with the validator, not guessed. Identity is carried by the legend and a direct
label on the end of every line as well as by color, so the one series under
3:1 contrast is never color-alone.

**The honest finding, which is in the caption:** since the Bonus ADU Program in
2020, rent has risen 33% against 27% general inflation — roughly four points of
real increase in five years. Rent has *not* run away in that period. The page
says so. The argument it does support is that the program issued a few dozen
permits in 2021–22 and 151 in 2023 in a county of more than a million homes, so
it was never big enough to move these lines either way — which is the problem
with having justified it by them.

## Pointing lindavistatowncouncil.org at Firebase

### What the DNS looked like before any of this (16 Sept 2026)

Captured from the public record before changing anything, so there is a known
state to go back to:

| | Value |
|---|---|
| Registrar | Tucows Domains Inc. (Squarespace Domains' backend) — expires 3 May 2027 |
| Nameservers | `ns01`–`ns04.squarespacedns.com` **and** `dns1`–`dns4.p04.nsone.net` |
| Apex `A` | 198.185.159.144, 198.185.159.145, 198.49.23.144, 198.49.23.145 |
| `www` | CNAME → `ext-sq.squarespace.com` |
| MX / TXT / CAA / AAAA | none |

Two things to notice. The domain was delegated to **eight** nameservers across
two providers at once, which is why Squarespace's DNS panel said "you're using
custom nameservers" and refused to serve what was typed into it. And there was
no email, no SPF, no verification record and no CAA — so nothing needed
preserving and nothing could block certificate issuance.

### The plan

DNS moves to Cloudflare (free, DNS only) so the council's records are not
inside the Squarespace account. The domain registration stays at Tucows for
now and can be transferred later without touching DNS again.

**1. Cloudflare account** — create it with **lvtowncouncil@gmail.com**, not a
personal address. A volunteer organization should not have its domain behind
one person's login.

**2. Add the site** in Cloudflare and let it import the existing records.
Check it picked up the four Squarespace A records and the `www` CNAME, and set
every record to **DNS only** (grey cloud, not orange). Nothing has changed yet;
the old site still serves.

**3. Change the nameservers** at the registrar to Cloudflare's two, removing
all eight of the old ones. Wait for Cloudflare to show "Active". The site keeps
working throughout — Cloudflare is serving the same Squarespace records.

**4. Firebase console → Hosting → Add custom domain** → `lindavistatowncouncil.org`.
Add `www.lindavistatowncouncil.org` as a second domain set to **redirect to the
apex** — every `<link rel="canonical">` on the site uses the bare domain.

**5. Add the TXT record** Firebase gives you, in Cloudflare. **Leave it there
forever** — Firebase requires it to stay as continuing proof of ownership.
Deleting it later breaks the domain.

**6. Once verified, swap the traffic records.** Add exactly the A (and AAAA, if
offered) records Firebase gives, and **delete the four Squarespace A records
and the `www` CNAME**. This part is not optional: Firebase will not issue an
SSL certificate while any other A, AAAA or CNAME record exists for those hosts.

**7. Wait.** Usually a few hours, up to 24. A certificate warning in the gap is
expected — don't re-add the domain or revert anything.

**8. Only then** cancel the Squarespace *website* plan. Keep the domain.
Give it a week before cancelling, so there is a rollback.

**9. Later, no rush:** transfer the registration off Squarespace/Tucows to an
independent registrar on the council's own account. DNS is already at
Cloudflare by then, so a transfer does not touch the live site.

### If it goes wrong

Put the four Squarespace A records back and restore the `www` CNAME to
`ext-sq.squarespace.com`. The old site returns as soon as the TTL expires,
which is why the Squarespace plan stays alive for the first week.

### Status: cut over 16 September 2026

Verified from outside the account:

- **Nameservers:** `howard.ns.cloudflare.com`, `maria.ns.cloudflare.com` — live in
  the .org registry, changed 2026-09-16T04:29:55Z. All eight old ones gone.
- **Apex A record:** `199.36.158.100` (Firebase) and nothing else. All four
  Squarespace A records removed.
- **TXT:** `hosting-site=lvtc-website` — present, and it stays permanently.
- **SSL:** still provisioning at the time of writing; the domain served a
  hostname-mismatch certificate until Firebase issued its own. Expected, up to
  24 hours.

Snag worth remembering: the first `Verify` failed with *"HTTP GET request for
the ACME challenge failed: 403 Forbidden"* naming two IPs. That was two of the
four Squarespace A records still in place — the challenge was being routed to
Squarespace, which 403'd it. Deleting the stragglers fixed it. If this error
ever reappears, it means something other than Firebase is still answering on
that name.

Still to do: add `www` as a second custom domain in Firebase, cancel the
Squarespace website plan after a week of stability, and transfer the
registration off Tucows/Squarespace.

## sitemap.xml, robots.txt, ads.txt

**`sitemap.xml`** is generated, not hand-written. Run `./make-sitemap.sh` and it
rebuilds the file from the pages actually present, taking each `<lastmod>` from
that file's own modification date — so the sitemap can't quietly go stale or
claim a date nobody checked. Re-run it after adding a page or a round of edits,
before deploying. `review.html` is deliberately excluded.

The URLs are extensionless (`/meetings`, not `/meetings.html`) to match
`cleanUrls: true`, and the home page is the bare domain with a trailing slash.
If the canonical domain ever changes, `BASE` at the top of the script is the
one place to edit.

**`robots.txt`** allows everything except `/review`, and points at the sitemap.
The review queue is already `noindex` and protected by the `isEditor()`
allowlist in `firestore.rules`; this just keeps it out of search results too.

**`ads.txt`** declares the authorized seller for advertising on this domain:

    google.com, pub-4204496050222131, DIRECT, f08c47fec0942fa0

Note that this file only *declares* an authorized seller — it does not itself
put ads on the site, and there is no ad code anywhere in these pages. If the
council ever does want to run ads, that is a board decision before it is a
technical one.

All three are served from the site root. `*.sh` is in the hosting ignore list,
so `make-sitemap.sh` itself is never published.

## Poll changeover, September 2026

The four cost-of-living questions were retired because three of them asked
about decisions already made:

| Question | What had happened |
|---|---|
| Paid parking at beaches | **Still open** — ordinance cleared Rules 27 Aug 2026, awaiting full Council vote |
| Paid parking at Balboa Park | Council repealed it unanimously 8 June 2026; ends 31 Dec |
| 1% city sales tax | Died with Measure E, Nov 2024; not on the Nov 2026 ballot |
| Hotel tax increase | Measure C upheld; increase took effect 1 May 2025 |

**Check this before every changeover.** A poll about settled questions wastes
the respondent's minute and tells visitors the site isn't maintained, which is
worse than having no poll.

The new poll (`POLL_ID = 'beaches-and-tax-2026'`) asks two questions that were
genuinely undecided: keeping beach and Mission Bay parking free, and the
half-cent county sales tax on the November ballot.

Three things changed along with the questions:

- **`SEED` is now empty.** The three Squarespace responses in it answered the
  old questions; leaving them would have fed answers to questions that no
  longer exist into the new results.
- **`QUESTIONS` entries accept an optional `note`**, rendered in grey under
  the question. Both new questions use it to state the trade-off — what the
  money is for, what it would cost — so people are answering a real question
  rather than a slogan.
- **`firestore.rules` `validAnswers()` lists the new ids** and only those.

**Nobody is locked out.** Both the one-vote device id (`lvtc_device_<POLL_ID>`)
and the voted flag are keyed by `POLL_ID`, so everyone who answered the old
poll can answer the new one without clearing anything.

### The order, every time

1. **Archive first, on the live site, before deploying.** Open the console and
   run `LVTC.pollCounts()` — it reads the *current* `POLL_ID`, so once the new
   code is deployed that path is gone. The old answers stay in Firestore under
   `poll: 'cost-of-living'` either way, but recovering them by hand is work.
2. Paste the counts block into `surveys.js` so the results live on Your Town.
3. `firebase deploy --only firestore:rules`
4. `firebase deploy --only hosting`

Rules before hosting. If hosting goes first, the first answers to the new poll
are rejected by the old rules and those people are told the poll is broken.

## Redirects from the old Squarespace URLs

The domain has been the council's for years, so Google has a decade of
Squarespace URLs indexed. The rebuilt site uses different paths, which means
every one of those old results, and every old link from another site, would
have landed on a 404.

`firebase.json` now carries 301 redirects for the ones still in Google's index
(found by searching `site:lindavistatowncouncil.org`, not guessed):

| Old | New | Was |
|---|---|---|
| `/new-page-1` | `/businesses` | Local Directory |
| `/lv-businesses` | `/businesses` | LV Businesses |
| `/events` | `/meetings` | Calendar |
| `/members` | `/board` | Current Members |
| `/linda-vista-planning-group` | `/new#who` | Planning Group |
| `/linda-vista-farmers-market` | `/new#places` | Farmers Market |
| `/who-we-are` | `/board` | About the council |
| `/linda-vista-update` | `/new#first-week` | The Rodriguezes' newsletter |
| `/history-of-linda-vista` | `/new` | History of Linda Vista |

`/contact` and `/bylaws` needed nothing — the new site happens to use the same
paths.

**Two loose ends.**

`/history-of-linda-vista` has no real equivalent; it is pointed at the
new-resident page as the nearest thing in spirit. A neighborhood history page
is exactly the sort of page that earns links and search traffic on its own, so
it is worth rebuilding properly — and when it exists, this redirect should
point at it.

Old Squarespace **file** URLs (`/s/<filename>.pdf` and similar, which is where
the minutes used to live) are not redirected, because there is no list of them.
The documents themselves are all at `/minutes/` now. If a specific old document
link turns out to matter, add a one-off redirect for it.

**To find more:** search `site:lindavistatowncouncil.org` in Google, or set up
Google Search Console for the domain — its Coverage report lists exactly which
old URLs are being requested and returning 404, which is the real answer rather
than a sample.

### A trap: Search Console temporary removals

On 16 September, while the old URLs were still 404ing, several were submitted
to Search Console's Removals tool. That hides a URL from Google Search for
**about six months**. It does not stop crawling or indexing — it just makes the
URL invisible in results.

That was the right instinct against a 404. It is the wrong state once the URL
redirects: the removal suppresses exactly the traffic the redirect exists to
rescue. **Cancel the removal (⋮ → Cancel request) for any URL that now 301s.**
Keep one only for a page that should genuinely never surface again.

The submitted-removals list is also a useful artifact in its own right — it is
a record of which old URLs someone thought were worth hiding, which is close to
a list of the ones worth redirecting.

## Events (`events.js`, `events.html`, `/events`)

Becky sends flyers for things happening around the neighborhood. They go in
**`events.js`** — one file, one entry per event — and render in two places: the
"What's coming up" block on the homepage and the `/events` page. The council's
own meetings are NOT listed there; they come from `SCHEDULE` in `app.js` and are
merged in automatically, so a meeting is never typed twice. Anything dated
before today drops off on its own.

**Post the details, not the flyer.** A photographed flyer is unreadable on a
phone, invisible to search and to screen readers, and its QR codes will not scan
off a screen — the Mesa College one that started this was a photocopy whose
codes were already dead. Type the details in instead.

Two fields matter more than they look:

- **`url`** — the organizer's own page for the event. Set it whenever it exists.
  The title becomes a link to it, so people get the details from the people
  running the thing, and a change at their end does not leave our copy wrong.
- **`unconfirmed: true`** — renders a visible note that the council has not
  verified the details. Use it for anything off a flyer we could not check
  against a source. Posting something honestly marked beats both sitting on it
  and presenting a photocopy as fact. Delete the field once it is confirmed.

`/events` used to 301-redirect to `/meetings` (it was an old Squarespace URL).
That redirect is **removed** — `/events` is a real page now. If you ever retire
the page, put the redirect back or the URL 404s.

**Nav.** Events is in the main nav, in the slot Board used to hold — the nav
stays at eight items. Board moved to the footer as "Who's on the board" under
the contact details (it was already in the colophon strip too). The reasoning:
Events is something people check repeatedly, the board roster is something they
look up once. A ninth nav item was measured and does fit down to 1024px, but it
wraps to two rows between roughly 820 and 1000px, so eight is the ceiling.

Also linked from every footer and from the homepage calendar block.
`make-sitemap.sh` includes it.

## The history page (`history.html`, `/history`)

The old Squarespace `/history-of-linda-vista` page was three links to other
people's articles and a "Learn more" button — no original content. This page
replaces it with an actual account, and keeps all three of those links at the
bottom under "The articles that used to be on this page."

**Every fact on it is sourced, and the sources are listed on the page itself**,
in a "Where this comes from" section that also invites corrections. That is
deliberate: a community organization publishing local history will be read by
people who were there, and the fastest way to lose them is to get a date wrong
with no way to tell where it came from. If someone sends a correction, fix it
and say what changed.

Load-bearing facts and where they came from:

| Claim | Source |
|---|---|
| Built Feb–Nov 1941; first phase 3,000 homes + 750 dorm units in 259 days; second phase 1943 adds 1,845 units; peak population ~16,000 | Clio |
| Lanham Act let the federal government build over the City's 1939–40 refusal | Clio |
| Homes sold from 28 Oct 1954, $6–7k, 5% down, 5% over 20 years, after residents organized to buy them | Clio |
| Shopping center 1943, architects Giberson and Whitney P. Smith, dedicated by Eleanor Roosevelt, 261 perimeter spaces, AIA award Jan 1947, demolished 1972 | Wikipedia, Linda Vista Shopping Center |
| **Not** the first US shopping mall — Broadway & 87th, South LA, beat it by seven years | same |
| ~1,500 workers a week arriving; city population +50% in two years | San Diego History Center |
| Vietnamese families settling from the late 1970s, joining Hispanic and Filipino families | OB Rag, July 2026 |
| USD opened 1957 | OB Rag |
| Library #1 opened 30 June 1942, ~400 sq ft converted gardener's cottage near Kelly St; tool shed added within a year as the children's room | Clio, Linda Vista Branch Library |
| 1947: 3rd of 13 city branches in circulation, 1st system-wide in juvenile circulation | Clio |
| Library #2 built 1951; building now the Educational Enrichment Systems child development center | Clio |
| Library #3 at 2160 Ulric St dedicated 12 Dec 1987, ~10,000 sq ft, architect Rob Wellington Quigley; raised rotunda + clerestory + two courtyards | Clio, City of San Diego |
| Quigley on the rotunda as an "overflow valve"; Hmong/Lao/Chinese/Cambodian material; metal and concrete chosen over wood and plaster to take wear without reading as a prison | San Diego Reader, May 1995 |
| Sept 2022: $500,000 federal Community Project Funding via Rep. Sara Jacobs for outdoor children's area, homework center, early learning patio | Linda Vista Update |

The "first shopping mall in America" claim is corrected rather than repeated —
it is a thing people say locally and it is not true. Correcting it gently, with
the actual earlier center named, is worth more to the page's credibility than
the flattering version.

Linked from every footer under "Around town" and from the sitemap. Not in the
main nav, which is full at eight items.

### The library section

Added Sept 2026. It sits after "After 1975" and before "What is still here to
see" because it is the only thread on the page that runs the whole length of the
neighborhood's life — 1942, 1951, 1987, 2022 — and it restates the page's
argument (population first, buildings late) right before the summary.

**The awards are now named** (resolved Sept 2026). The 1995 *Reader* piece said
only that the building "won the highest statewide architectural honor yet
bestowed on a San Diego public building" without naming it. No AIA archive goes
back that far online — AIA California's public list starts at 2020, AIA San
Diego's at 2017, and the AIA/ALA Library Building Awards list starts at 1995.
The answer came from the architect's own awards page,
<https://site.robquigley.com/awards/>:

| Year | Award | Body |
|---|---|---|
| 1989 | **Honor Award** | AIA California Council |
| 1988 | Merit Award | AIA California Council |
| 1988 | Orchid | AIA San Diego chapter |
| 1988 | Panda Award | City of San Diego |

The 1989 AIACC Honor Award is the one the *Reader* meant. Note the source is the
firm's own record rather than AIA's — good enough to name the award on the page,
but if a member ever wants it airtight, AIA California (916.448.9082) holds the
historical rolls that are not on the web.

Two other things worth confirming and then adding: whether the 2022 early
learning patio was ever actually built (the money was announced four years ago),
and the street address of the 1951 building.

The San Diego Public Library's digital collection on Calisphere holds
photographs of the 1942 and 1951 branches. Worth asking about rights — a picture
of the tool-shed children's room would carry that section on its own.

### The photograph on the history page

`history.html` carries one figure, `img/1941-streetcar-dwellings.jpg`. **The file
is not in the repo** — download it yourself from the Library of Congress:

1. Open <https://www.loc.gov/item/2017789487/>
2. Use the **Download** dropdown under the image and take the largest JPEG
3. Save it as `img/1941-streetcar-dwellings.jpg` in this folder

Until the file is there the whole `<figure>` removes itself via `onerror`, so
the page never shows a broken image — it just runs without the photo.

**Why this image and not a Linda Vista one.** The Library of Congress does hold
**LOT 3771, "Linda Vista, San Diego, Calif."** — 35 prints from 1943 of the
actual construction. Two things stop us using them:

- *"Full online access to this resource is only available at the Library of
  Congress."* They are not digitized. You would order a reproduction or view
  them in Washington.
- *"Rights status of individual images not evaluated."* Almost certainly public
  domain — 1943, received from the U.S. Office of War Information, and federal
  work is not copyrightable — but LOC will not say so, so neither will we.

The Russell Lee photograph we use instead is from the FSA/OWI black-and-white
negatives, is digitized, and carries the unambiguous **"No known restrictions."**
It shows people living in converted streetcars in San Diego in May 1941 — which
makes the argument of the 1941 section better than a picture of finished houses
would.

**If you want the real construction photos**, email the LOC Prints & Photographs
Division and ask them to evaluate the rights on LOT 3771. If they confirm public
domain, order scans. That is a slow path but it would give the council images
nobody else is using.

**Rule for any future image:** check the Rights Advisory line on the individual
item, not the collection — the collections mix statuses — and keep the credit
line in the caption. `firebase.json` already caches `img/` for a day along with
the other image types.
