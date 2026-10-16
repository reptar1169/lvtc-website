/* ==========================================================================
   Housing prices — the long view.

   MEDIAN_SFH is the median sale price of an EXISTING SINGLE-FAMILY HOME in
   San Diego County, by year. Source: California Association of Realtors,
   as tabulated by the Los Angeles Almanac (laalmanac.com/economy/ec37.php).
   County-wide, not Linda Vista — there is no public median going back to
   1990 for a single neighborhood.

   Cross-checked against the S&P Case-Shiller San Diego index (FRED SDXRSA,
   January values): over 1990-2025 this series rises 5.5x and Case-Shiller
   rises 5.3x, and the two turn in the same years. They are independent
   measurements — one a median of what sold, the other a repeat-sales index —
   so agreeing on shape is a real check, not a coincidence.

   The series is ANNUAL and ends at 2025; 2026 is not complete. If you update
   it, add the new year and move the note in the caption.

   ADU_MARKS are the two moments that relaxed ADU rules, each with the date it
   was actually enacted. Keep these sourced — the whole point of putting them
   on the chart is that someone can check them.
   ========================================================================== */

var MEDIAN_SFH = [
  [1990,  181470], [1991,  188817], [1992,  180571], [1993,  175624],
  [1994,  171311], [1995,  167214], [1996,  171074], [1997,  191818],
  [1998,  212237], [1999,  238765], [2000,  278906], [2001,  311835],
  [2002,  381440], [2003,  466030], [2004,  577041], [2005,  603679],
  [2006,  585974], [2007,  495497], [2008,  346597], [2009,  382226],
  [2010,  375790], [2011,  359930], [2012,  418290], [2013,  479690],
  [2014,  494500], [2015,  530000], [2016,  568000], [2017,  605000],
  [2018,  618500], [2019,  655000], [2020,  730000], [2021,  836700],
  [2022,  850000], [2023,  911500], [2024,  975000], [2025, 1000000]
];

var MEDIAN_SFH_SOURCE = {
  label: 'California Association of Realtors, existing single-family homes, ' +
         'San Diego County',
  url:   'http://www.laalmanac.com/economy/ec37.php'
};

var ADU_MARKS = [
  {
    // Fractional years so the rule lands on the month, not on 1 January.
    at: 2016.74,
    short: 'State law',
    label: 'Sept 2016 — California SB 1069',
    detail: 'Signed 27 September 2016 (Chapter 720), effective 1 January 2017. ' +
            'Required cities to approve one ADU per single-family lot ' +
            'ministerially, and stripped out most parking requirements near ' +
            'transit.',
    url: 'https://www.leginfo.ca.gov/pub/15-16/bill/sen/sb_1051-1100/sb_1069_bill_20160927_chaptered.html'
  },
  {
    at: 2020.82,
    short: 'City program',
    label: 'Oct 2020 — San Diego ADU Bonus Program',
    detail: 'Adopted 27 October 2020 as part of the Housing Legislation Code ' +
            'Update. Granted an extra market-rate ADU for every deed-restricted ' +
            'affordable one, with no cap on the total — which is what produced ' +
            'the four, six and nine-unit complexes.',
    url: 'https://www.sandiego.gov/sites/default/files/2025-04/planning-commission-report-no-pc-25-016_0.pdf'
  }
];

/* --------------------------------------------------------------------------
   Rent, and everything else, for the indexed comparison chart.

   RENT_CPI  — CPI, rent of primary residence, San Diego-Carlsbad CBSA,
               annual, index 1982-84=100. FRED series CUUSA424SEHA.
   CPI_ALL   — CPI, all items, same metro and base. FRED series CUUSA424SA0.
               This is the "isn't that just inflation?" line. It belongs on
               the chart: without it the other two lines mean much less, and
               the question gets asked anyway.

   These are INDEXES, not dollars, which is exactly why the second chart
   re-bases everything to 1990 = 100 instead of trying to put dollars and
   indexes on one axis. Two y-scales on one chart is the most misleading
   thing you can do to a reader — where the lines cross is then an artifact
   of where the axes were set, not a fact about the world.
   -------------------------------------------------------------------------- */

var RENT_CPI = [
  [1990, 150.900], [1991, 153.600], [1992, 154.700], [1993, 153.400],
  [1994, 153.000], [1995, 153.900], [1996, 156.000], [1997, 159.800],
  [1998, 167.700], [1999, 178.700], [2000, 190.300], [2001, 205.800],
  [2002, 222.200], [2003, 237.600], [2004, 250.500], [2005, 259.700],
  [2006, 269.200], [2007, 279.078], [2008, 291.598], [2009, 298.517],
  [2010, 298.462], [2011, 301.030], [2012, 308.267], [2013, 314.839],
  [2014, 321.037], [2015, 333.606], [2016, 346.938], [2017, 365.707],
  [2018, 385.694], [2019, 399.426], [2020, 410.829], [2021, 419.819],
  [2022, 447.869], [2023, 491.385], [2024, 520.548], [2025, 545.397]
];

var CPI_ALL = [
  [1990, 138.400], [1991, 143.400], [1992, 147.400], [1993, 150.600],
  [1994, 154.500], [1995, 156.800], [1996, 160.900], [1997, 163.700],
  [1998, 166.900], [1999, 172.800], [2000, 182.800], [2001, 191.200],
  [2002, 197.900], [2003, 205.300], [2004, 212.800], [2005, 220.600],
  [2006, 228.100], [2007, 233.321], [2008, 242.313], [2009, 242.270],
  [2010, 245.464], [2011, 252.910], [2012, 256.961], [2013, 260.317],
  [2014, 265.145], [2015, 269.436], [2016, 274.732], [2017, 283.012],
  [2018, 292.547], [2019, 299.433], [2020, 303.932], [2021, 319.761],
  [2022, 344.416], [2023, 362.022], [2024, 373.321], [2025, 387.463]
];

/* Slot colours are the dataviz default categorical theme, slots 1-3, which
   are the only three that clear the all-pairs colour-blind gates in both
   light and dark. The site's own red and sage do NOT clear them together —
   checked, not assumed — so the chart uses these and the legend plus the
   end labels carry identity as well as colour. */
var SERIES = [
  { key: 'price', label: 'Home price',        data: null, cls: 's-price' },
  { key: 'rent',  label: 'Rent',              data: null, cls: 's-rent'  },
  { key: 'cpi',   label: 'All prices (inflation)', data: null, cls: 's-cpi' }
];

var INDEX_SOURCES = [
  { label: 'Home price: California Association of Realtors via LA Almanac',
    url: 'http://www.laalmanac.com/economy/ec37.php' },
  { label: 'Rent: CPI rent of primary residence, San Diego-Carlsbad (FRED CUUSA424SEHA)',
    url: 'https://fred.stlouisfed.org/series/CUUSA424SEHA' },
  { label: 'All prices: CPI all items, San Diego-Carlsbad (FRED CUUSA424SA0)',
    url: 'https://fred.stlouisfed.org/series/CUUSA424SA0' }
];
