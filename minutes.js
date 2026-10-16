/* ==========================================================================
   Linda Vista Town Council — minutes index
   THIS IS THE ONLY FILE YOU EDIT WHEN THE SECRETARY SENDS A DOCUMENT.
   Add one line, newest first. The Meetings page does the rest: it works out
   which meetings are still outstanding and lists them for you.

     kind : 'general' | 'board'
     date : the meeting date, YYYY-MM-DD
     file : path to the document
   ========================================================================== */

/* Every document is now hosted here, in /minutes/. MINUTES_BASE is left in
   place only as an escape hatch: set it to another origin if the files ever
   move off this site again. */
var MINUTES_BASE = '';

/* The record starts here — the first meeting with minutes on file. */
var RECORD_START = '2023-01';

/* Set to false if the board would rather only list documents that exist,
   without showing which meetings are still outstanding. */
var SHOW_GAPS = true;

/* Optional: the secretary's address. If set, the "chase" button opens a
   pre-written email listing every outstanding meeting. If left empty, the
   button copies that list to the clipboard instead. */
var SECRETARY_EMAIL = '';

var MINUTES = [
  { kind:'board',   date:'2026-03-04', file:'/minutes/2026-03-04-board.pdf' },

  { kind:'board',   date:'2025-11-05', file:'/minutes/2025-11-05-board.pdf' },
  { kind:'board',   date:'2025-10-01', file:'/minutes/2025-10-01-board.pdf' },
  { kind:'board',   date:'2025-06-03', file:'/minutes/2025-06-03-board.pdf' },
  { kind:'board',   date:'2025-05-07', file:'/minutes/2025-05-07-board.pdf' },
  { kind:'board',   date:'2025-02-05', file:'/minutes/2025-02-05-board.pdf' },
  { kind:'board',   date:'2025-01-03', file:'/minutes/2025-01-03-board.pdf' },

  { kind:'general', date:'2024-10-16', file:'/minutes/2024-10-16-general.pdf' },
  { kind:'general', date:'2024-11-20', file:'/minutes/2024-11-20-general.pdf' },
  { kind:'board',   date:'2024-11-06', file:'/minutes/2024-11-06-board.doc' },        // rev. 11/27/2024
  { kind:'general', date:'2024-10-07', file:'/minutes/2024-10-07-general.pdf' },
  { kind:'general', date:'2024-09-18', file:'/minutes/2024-09-18-general.pdf' },
  { kind:'general', date:'2024-08-21', file:'/minutes/2024-08-21-general.pdf' },
  { kind:'board',   date:'2024-08-07', file:'/minutes/2024-08-07-board.pdf' },
  { kind:'general', date:'2024-06-19', file:'/minutes/2024-06-19-general.pdf' },
  { kind:'general', date:'2024-05-15', file:'/minutes/2024-05-15-general.pdf' },
  { kind:'board',   date:'2024-05-01', file:'/minutes/2024-05-01-board.pdf' },
  { kind:'general', date:'2024-04-17', file:'/minutes/2024-04-17-general.pdf' },
  { kind:'board',   date:'2024-04-03', file:'/minutes/2024-04-03-board.pdf' },        // rev. 4/24/2024
  { kind:'general', date:'2024-03-20', file:'/minutes/2024-03-20-general.pdf' },
  { kind:'general', date:'2024-02-21', file:'/minutes/2024-02-21-general.pdf' },
  { kind:'board',   date:'2024-02-07', file:'/minutes/2024-02-07-board.pdf' },
  { kind:'general', date:'2024-01-17', file:'/minutes/2024-01-17-general.pdf' },

  { kind:'general', date:'2023-11-15', file:'/minutes/2023-11-15-general.pdf' },
  { kind:'board',   date:'2023-10-04', file:'/minutes/2023-10-04-board.docx' },
  { kind:'general', date:'2023-09-20', file:'/minutes/2023-09-20-general.docx' },
  { kind:'board',   date:'2023-09-06', file:'/minutes/2023-09-06-board.docx' },
  { kind:'general', date:'2023-08-16', file:'/minutes/2023-08-16-general.docx' },
  { kind:'board',   date:'2023-08-02', file:'/minutes/2023-08-02-board.docx' },
  { kind:'general', date:'2023-06-21', file:'/minutes/2023-06-21-general.docx' },
  { kind:'board',   date:'2023-06-07', file:'/minutes/2023-06-07-board.docx' },
  { kind:'general', date:'2023-05-17', file:'/minutes/2023-05-17-general.docx' },
  { kind:'board',   date:'2023-05-03', file:'/minutes/2023-05-03-board.docx' },
  { kind:'general', date:'2023-04-19', file:'/minutes/2023-04-19-general.docx' },
  { kind:'board',   date:'2023-04-05', file:'/minutes/2023-04-05-board.docx' },
  { kind:'general', date:'2023-03-15', file:'/minutes/2023-03-15-general.docx' },
  { kind:'board',   date:'2023-03-01', file:'/minutes/2023-03-01-board.docx' },
  { kind:'general', date:'2023-02-15', file:'/minutes/2023-02-15-general.docx' },
  { kind:'board',   date:'2023-02-01', file:'/minutes/2023-02-01-board.docx' },
  { kind:'board',   date:'2023-01-04', file:'/minutes/2023-01-04-board.docx' }
];
