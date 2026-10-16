/* ==========================================================================
   Linda Vista Town Council — closed survey results
   Add a survey here and it renders itself on the Your Town page.

     type 'scale5' → counts given HIGHEST first:
                     [Strongly agree, Agree, Neutral, Disagree, Strongly disagree]
     type 'binary' → [Yes, No]

   Each question carries its own `n` (the totals differ question to question,
   because people skip questions — reporting one number for the whole survey
   overstates the ones with fewer answers).
   ========================================================================== */

var SURVEYS = [
  {
    id: 'comstock',
    title: 'Speeding on Comstock Street',
    fielded: '2026-04-09',
    closed: true,
    respondents: 49,
    intro: 'After a crash on Comstock Street totalled three parked cars, we asked ' +
           'the neighborhood what the City should do about a 25&nbsp;mph limit that ' +
           'is not being enforced.',
    questions: [
      { text: 'More stop signs',      type: 'scale5', counts: [15, 7, 10, 9, 4] },
      { text: 'More speeding tickets', type: 'scale5', counts: [13, 14, 5, 5, 8] },
      { text: 'Speed bumps',           type: 'scale5', counts: [19, 8, 5, 2, 5] },
      { text: 'Speeding here is not a problem', type: 'scale5', counts: [2, 4, 9, 5, 22],
        note: 'Worded in the negative: disagreeing means you think there <em>is</em> a problem.' }
    ],
    takeaway: 'Speed bumps drew the strongest support, and 27 of the 42 people who ' +
              'answered the last question said speeding here <em>is</em> a problem — ' +
              'about two in three. Every measure we asked about drew more support ' +
              'than opposition.'
  },
  {
    id: 'cost-of-living',
    title: 'Cost of living: parking and taxes',
    fielded: '2026-09-14',
    closed: true,
    respondents: 4,
    intro: 'Four questions carried over from the old Squarespace site, asking how ' +
           'residents would rather the City raise money. <b>Only four people ' +
           'answered</b>, which is far too few to call it a neighborhood view of ' +
           'anything &mdash; the poll ran for a few days on a site that did not yet ' +
           'have its own address and had not been announced anywhere. It is here ' +
           'because a poll we opened should not vanish without a trace, not because ' +
           'the numbers mean much.',
    questions: [
      { text: 'Paid parking at beaches is a good idea',
        type: 'scale5', counts: [0, 1, 0, 1, 2] },
      { text: 'Paid parking at Balboa Park is a good idea',
        type: 'scale5', counts: [0, 0, 1, 0, 3],
        note: 'Overtaken by events: the City Council had already voted unanimously ' +
              'to repeal Balboa Park paid parking on 8 June 2026, three months ' +
              'before we asked.' },
      { text: 'A 1% sales tax would be better than paid parking and reduced hours at city venues',
        type: 'scale5', counts: [0, 2, 0, 1, 1] },
      { text: 'A 1% sales tax is a better idea than increasing the hotel tax',
        type: 'scale5', counts: [0, 1, 0, 1, 2],
        note: 'Also settled before we asked: the hotel tax increase took effect on ' +
              '1 May 2025, and the 1% city sales tax died with Measure&nbsp;E in ' +
              'November 2024.' }
    ],
    takeaway: 'Four answers is an anecdote, not a result, so we are not going to ' +
              'dress it up as one. What it did teach us is worth more than the ' +
              'numbers: three of the four questions asked about decisions the City ' +
              'had already made. The poll that replaced it asks two questions that ' +
              'are genuinely still open, and we check that before opening any poll now.'
  },
  {
    id: 'route41',
    title: 'Rapid Route 41 dedicated bus lane',
    fielded: '2026-04-09',
    closed: true,
    intro: 'SANDAG’s Next Gen Rapid Route&nbsp;41 would run from Hillcrest to ' +
           'UC San Diego through Fashion Valley, Linda Vista, Clairemont and ' +
           'University City. Initial planning finished in 2023; SANDAG is still ' +
           'securing the funding to complete it.',
    questions: [
      { text: 'I know about the proposed Rapid Route 41 dedicated bus lane',
        type: 'binary', counts: [14, 27] },
      { text: 'I support the proposed Rapid Route 41 dedicated bus lane',
        type: 'binary', counts: [19, 16] }
    ],
    takeaway: 'The clearest result was not support or opposition — it was that two ' +
              'out of three people who answered had never heard of the project. ' +
              'Among those who had an opinion, support led narrowly.'
  }
];
