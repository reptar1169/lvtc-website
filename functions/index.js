/* ===========================================================================
   Linda Vista Town Council — Cloud Functions

   One job: when someone drops a pin on the problem map, email the council so
   a human knows there is something waiting to be approved. Nothing here is
   needed for the website to work; if this function is broken or not deployed,
   the map still takes reports, they just sit in Firestore unnoticed.

   SETUP (once, in your own Terminal, from the site folder):

     cd functions && npm install && cd ..

     # The sending account's password. This is an APP PASSWORD, not the
     # Google account password — make one at myaccount.google.com/apppasswords
     # (the account needs 2-step verification turned on first).
     firebase functions:secrets:set SMTP_PASSWORD

     firebase deploy --only functions

   The secret is stored in Google Secret Manager. It is never in this file,
   never in the repo, and never in the deployed site.
   =========================================================================== */

const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const nodemailer = require('nodemailer');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

const SMTP_PASSWORD = defineSecret('SMTP_PASSWORD');

/* --- the only things you are likely to want to change ------------------- */
const PROJECT_ID = 'lvtc-website';
const SMTP_HOST   = 'smtp.gmail.com';
const SMTP_PORT   = 465;
const SEND_AS     = 'lvtowncouncil@gmail.com';   // the account the app password belongs to
const NOTIFY_TO   = 'lvtowncouncil@gmail.com, schoellojeff@gmail.com';  // comma-separate for more
/* ------------------------------------------------------------------------ */

// Keep this list in step with CATEGORIES in app.js. If a key isn't here the
// email still sends and just shows the raw key — a missing label is not a
// reason to lose a report.
const LABELS = {
  speeding: 'Speeding / unsafe driving',
  lighting: 'Streetlight out',
  sidewalk: 'Sidewalk / street damage',
  dumping:  'Illegal dumping / trash',
  vehicle:  'Abandoned vehicle',
  other:    'Something else'
};

/* firebase-functions has spelled this both ways across versions — event.data
   as the snapshot, and event.data.after. Accept either rather than betting on
   one and silently sending blank emails after an upgrade. */
function snapshotOf(event) {
  const d = event && event.data;
  if (!d) return null;
  if (d.after && typeof d.after.data === 'function') return d.after;
  if (typeof d.data === 'function') return d;
  return null;
}

exports.notifyNewReport = onDocumentCreated(
  { document: 'map_reports/{id}', region: 'us-central1', secrets: [SMTP_PASSWORD] },
  async (event) => {
    const snap = snapshotOf(event);
    if (!snap) { logger.warn('No snapshot on event; nothing to send.'); return; }

    const id = event.params.id;
    const r  = snap.data() || {};
    if (r.status !== 'pending') {
      logger.info(`Report ${id} is not pending (${r.status}); no email sent.`);
      return;
    }

    // The reporter's email, if they left one, lives in map_report_contacts
    // under the same id (never on the report — approved reports are public).
    // The browser writes both in one batch, so it is there by now. A failed
    // read just means the line is left out; it is not a reason to skip mail.
    let reporter = '';
    try {
      const c = await getFirestore().doc(`map_report_contacts/${id}`).get();
      if (c.exists) reporter = String(c.get('email') || '');
    } catch (err) {
      logger.warn('Could not read contact for report ' + id + ': ' + err.message);
    }

    const label = LABELS[r.category] || r.category || 'Uncategorised';
    const maps  = `https://www.google.com/maps/search/?api=1&query=${r.lat},${r.lng}`;
    const console_ =
      `https://console.firebase.google.com/project/${PROJECT_ID}` +
      `/firestore/databases/-default-/data/~2Fmap_reports~2F${id}`;

    const text = [
      `A new report is waiting on the problem map.`,
      ``,
      `  ${label}`,
      `  "${(r.note || '').trim()}"`,
      ``,
      `  Reported: ${r.date || 'unknown date'}`,
      `  Location: ${r.lat}, ${r.lng}`,
      `  On a map: ${maps}`,
      ``,
      reporter
        ? `  Wants to hear back: ${reporter}\n` +
          `  (Only the board sees this. Email them when the council acts, then\n` +
          `  click Done next to it on /review to delete their address.)\n`
        : `  Anonymous — no email left.\n`,
      `It is NOT on the website yet. To put it there, open the document and`,
      `change status from "pending" to "approved". To reject it, delete the`,
      `document.`,
      ``,
      `  ${console_}`,
      ``,
      `  (document id: ${id})`,
      ``,
      `--`,
      `Sent automatically by the town council website. Nobody typed this.`
    ].join('\n');

    logger.info('Report ' + id + ' created; sending to ' + NOTIFY_TO + '.');

    const mailer = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      // Google shows app passwords as four spaced groups ("abcd efgh ijkl mnop").
      // People paste them that way; the SMTP server wants the 16 characters with
      // no spaces. Strip whitespace rather than relying on whoever set the secret
      // to have noticed.
      auth: { user: SEND_AS, pass: (SMTP_PASSWORD.value() || '').replace(/\s+/g, '') }
    });

    try {
      await mailer.sendMail({
        from: `"LV Town Council website" <${SEND_AS}>`,
        to: NOTIFY_TO,
        replyTo: SEND_AS,
        subject: `[LV map] ${label} — one report to approve`,
        text
      });
      logger.info(`Notified ${NOTIFY_TO} about report ${id}.`);
    } catch (err) {
      // Don't rethrow: a failed email must never look like a failed report.
      // The report is already safely in Firestore either way. Log enough to
      // tell the three likely causes apart — EAUTH means the app password is
      // wrong or belongs to the wrong account, ETIMEDOUT means the SMTP host
      // was unreachable, anything else is usually the message itself.
      logger.error('Could not email about report ' + id + ': ' +
        [err.code, err.responseCode, err.message].filter(Boolean).join(' | '));
    }
  }
);
