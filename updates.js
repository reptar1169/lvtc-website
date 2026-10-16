/* ==========================================================================
   Two running records the council keeps.

   RECAPS   — a short note after each meeting, published within a day or two.
              Not minutes: minutes are the formal record and get approved a
              month later. This is "what happened and what next", for people
              who weren't in the room. Newest first.

   ADVOCACY — what the council asked the City (or SANDAG, or SDPD) for, and
              what came back. Including the entries where nothing came back.
              This is the most convincing argument for membership there is.

              Four fields drive the badge: with no `outcome` an entry reads
              "Awaiting a reply"; with an `outcome` it reads "Answered"; with
              both an `outcome` and a `stillAsking`, it reads "Answered in
              part" and shows what the council is still pushing for. Use that
              third state honestly — a win that only went halfway is more
              persuasive written as half a win than as a whole one.

   Both render only what they have. An empty list is fine.
   ========================================================================== */

var RECAPS = [
  // Newest first. Keep it to a couple of hundred words.
  //
  // { date: '2026-09-16',
  //   kind: 'general',
  //   headline: 'Morena construction: the room wants day work',
  //   body: [
  //     'Pure Water and two other agencies presented three projects on Morena ' +
  //     'Boulevard, starting in October.',
  //     'Most of the room preferred daytime work despite the longer timeline, ' +
  //     'with several residents saying night noise had been the bigger problem ' +
  //     'during earlier work.'
  //   ],
  //   next: 'The council will write to the project managers with the meeting’s view.' },
];

var ADVOCACY = [
  /* Set published:true once the blanks are filled in and you're happy for it
     to be public. Entries with published:false are ignored entirely — they
     are a draft sitting in the file, not a half-finished public record.

     I've started the two I could verify from your own survey data. I don't
     know who they were sent to, when, or what came back, so those are blank. */

  {
    /* The Bonus ADU reforms. Every figure and quote below comes from the
       City Council record and from Campillo's own July 2025 newsletter —
       check them against the link before changing anything here.

       NOTE FOR JEFF: the "We asked" line is deliberately general because I
       could not verify the specifics. Sharpen it with what the council
       actually did — which meeting it came up at, how many members spoke at
       the 16 June hearing, whether a letter went to CD7 and when — and put
       that date in sentOn. The stronger and more specific this half is, the
       more the entry is worth. */
    published: true,
    title: 'Bonus ADU program reform',
    asked: 'Members raised the Bonus ADU program at meeting after meeting: ' +
           'four, six and nine-unit ADU complexes going up between ' +
           'single-family houses, with no parking added, no traffic work and ' +
           'no infrastructure to carry them. The council carried that to ' +
           'Council District&nbsp;7 ahead of the City Council hearing.',
    sentTo: 'Councilmember Raul Campillo, Council District 7',
    sentOn: '',
    outcome: 'The City Council voted 5&ndash;4 on 17 June 2025 to reform the ' +
             'Bonus ADU program, and gave it final approval on 23 July. ' +
             '<b>Councilmember Campillo voted for the reforms both times.</b> ' +
             'They cap ADUs at four on lots up to 8,000 square feet, five up to ' +
             '10,000 and six above that, hold them to two stories, and bar them ' +
             'on lots at high wildfire risk. Writing to the district ' +
             'afterwards, Campillo said he had been guided by listening to ' +
             'residents\u2019 lived experience, and that the changes prevent ' +
             '&ldquo;apartment-style ADU developments in single family ' +
             'neighborhoods.&rdquo; ' +
             '<a href="https://app.indigov.com/pub/outreach/8f9b4f0a-92a0-459a-a749-9f87f9e14fde" ' +
             'rel="noopener">His July 2025 newsletter &rarr;</a>',
    outcomeOn: '2025-07-23',
    stillAsking:
      'This was the first real change to the program since 2021, and it was ' +
      'worth having. It did not go far enough. <b>A four-unit complex between ' +
      'two houses is still allowed</b> &mdash; four is the cap on a typical ' +
      'lot, not the exception, so most of what neighbors objected to can ' +
      'still be built. The new parking requirement ' +
      'of one space per unit applies only <i>outside</i> Transit Priority ' +
      'Areas, which are drawn around planned transit as well as existing ' +
      'transit &mdash; so on much of the bus network it does not bite at all. ' +
      'And the infrastructure money is a Community Enhancement Fee charged ' +
      'only on units under 750 square feet, with waivers; nothing in the ' +
      'reform requires the streets, sewers or intersections around a project ' +
      'to be improved before people move in. The council is asking for a ' +
      'cap that reflects what a street can actually absorb, parking counted ' +
      'on the ground rather than by map designation, and infrastructure ' +
      'assessed per project.',
    link: '/#housing'      // the price charts now live on the home page
  },

  {
    published: false,
    title: 'Speeding on Comstock Street',
    asked: 'Surveyed the neighborhood after a crash that totalled three parked ' +
           'cars. 49 residents responded; speed bumps drew the strongest support ' +
           '(27 for, 7 against) and two in three said speeding here is a problem.',
    sentTo: '',          // e.g. 'SDPD Traffic Division and Council District 7'
    sentOn: '',          // 'YYYY-MM-DD'
    outcome: '',         // what came back, or leave blank for "awaiting a response"
    outcomeOn: '',
    link: '/your-town#comstock'
  },

  {
    published: false,
    title: 'Rapid Route 41 dedicated bus lane',
    asked: 'Surveyed residents on SANDAG’s Next Gen Rapid Route 41. Two out of ' +
           'three people who answered had never heard of the project; among those ' +
           'with a view, support led 19 to 16.',
    sentTo: '',          // e.g. 'SANDAG Next Gen Rapid project team'
    sentOn: '',
    outcome: '',
    outcomeOn: '',
    link: '/your-town#route41'
  }
];
