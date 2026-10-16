/* ==========================================================================
   Board members. Add or edit entries here — the Board page renders them.
   Put portraits in /people/ and reference the filename; leave `photo` empty
   and the person gets their initials in a tile instead of a broken image.

   >>> TO DO: only two board members were listed on the old site. Add the rest,
   >>> and ask each of them for two sentences so the bios are a similar length.
   ========================================================================== */

var BOARD = [
  {
    name: 'Becky Hunt',
    role: 'President',
    photo: '',
    bio: ''   // <<< ask Becky for two sentences
  },
  {
    name: 'Jeffrey Schoellerman',
    role: 'Treasurer and Webmaster',
    photo: '',
    bio: 'A Linda Vista homeowner for over a decade, drawn to the council by safe, ' +
         'clean, bikeable streets. Keeps the books and runs this website.'
    // Your longer bio from the old site still exists — paste it back here if you want it.
  }
  // ,{ name:'', role:'', photo:'', bio:'' }
];

/* Seats currently open. Shown on the Board page under the members.
   >>> TO DO: I guessed at this — replace with the council's actual vacancies.
   >>> Set it to [] and the list disappears, leaving just the call for volunteers. */
var OPEN_SEATS = ['Member at large'];
