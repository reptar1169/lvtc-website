/* ==========================================================================
   One-off events: things happening in Linda Vista on a specific date.

   The council's own meetings are NOT in here — those come from SCHEDULE in
   app.js and are merged in automatically, so a meeting never has to be typed
   twice. This file is for everything else: other people's events that are
   worth telling the neighborhood about.

   Fields
     date         'YYYY-MM-DD'. Anything before today drops off on its own,
                  so an old entry can be left here or tidied up whenever.
     title        Short. It becomes a link if `url` is set.
     blurb        A sentence or two. Say who is running it if it is not us.
     detail       Optional grey line after the blurb — time and place.
     url          Optional link to the ORGANIZER'S own page for the event.
                  Set this whenever it exists. It is the single most useful
                  field here: it means people get the details from the people
                  running the thing, and a change on their end does not leave
                  our copy wrong.
     flyer        Optional. Path to a flyer image or PDF someone sent us, e.g.
                  '/img/flyers/2026-10-24-rx-take-back.webp'. Adds a "See the
                  flyer" link. Name files by event date so old ones are easy
                  to find and delete. The blurb should still carry the key
                  facts as text: a flyer is a picture, and screen readers and
                  search engines can't read it.
     unconfirmed  Optional. true adds a visible note that the council has not
                  verified the details. Use it for anything taken off a flyer
                  we could not check against a source. It is better to post
                  something honestly marked than to either sit on it or
                  present a photocopy as fact.

   Renders on the homepage and on /events. An empty list is fine.
   ========================================================================== */

var EVENTS = [

  { date: '2026-09-26',
    title: 'Coffee with Campillo',
    blurb: 'Councilmember Campillo\u2019s community coffee, his 60th town hall. ' +
           'Open to anyone. Not a council event, and not in Linda Vista this time ' +
           '\u2014 the June one was at Bayside.',
    detail: '9:00am \u00b7 Mission Trails Regional Park Visitor Center' },

  { date: '2026-10-24',
    title: 'Prescription Drug Take Back Day',
    blurb: 'Drop off unneeded or expired medication for safe disposal \u2014 free ' +
           'and anonymous, no questions asked. Pills, liquids and pet medication ' +
           'are accepted; needles, injector pens, vapes and illicit drugs are not. ' +
           'Run by the DEA with local police, not by the council. The nearest ' +
           'site is SDPD Western Division in Linda Vista; the flyer lists every ' +
           'San Diego County site.',
    detail: '10:00am\u20132:00pm \u00b7 SDPD Western Division, 5215 Gaines St',
    url: 'https://www.dea.gov/takebackday',
    flyer: '/img/flyers/2026-10-24-rx-take-back.webp' },

  { date: '2026-11-03',
    title: 'Election Day',
    blurb: 'The last day to vote in the general election. Mail your ballot (no ' +
           'stamp needed), drop it in any official ballot drop box, or vote in ' +
           'person at any vote center in the county &mdash; all of them are open ' +
           'daily from Saturday 31 October, 8am&ndash;5pm. Missed the registration ' +
           'deadline? You can still register and vote the same day at any vote ' +
           'center. Find yours at sdvote.com.',
    detail: 'Vote centers and drop boxes 7:00am–8:00pm',
    url: 'https://www.sdvote.com/' },

  { date: '2026-11-14',
    title: 'Mesa Architecture Student Showcase',
    blurb: 'Architecture students from San Diego Mesa College show their own ' +
           'designs for a library, in a library \u2014 honoring Rob Wellington ' +
           'Quigley, who designed this one. Run by AIAS Mesa College, not by the ' +
           'council.',
    detail: 'Linda Vista Library, 2160 Ulric St',
    url: 'https://sandiego.events.mylibrary.digital/event?id=400638',
    unconfirmed: true }

];
