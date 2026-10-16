/* ==========================================================================
   Linda Vista businesses featured by the council.
     discount : what members get, or '' for none
     url      : the business's own site — leave '' if they don't have one
     category : used by the filter buttons; add new ones freely

   >>> TO DO: confirm each discount with the business before publishing, and
   >>> fill in the addresses. I left blank anything I couldn't verify.
   ========================================================================== */

var BUSINESSES = [
  { name: 'Sushi Yorimichi', category: 'Food & drink',
    blurb: 'Neighborhood sushi bar.',
    discount: '10% off for members', address: '', url: '' },

  { name: "Giovanni's Italian Restaurant", category: 'Food & drink',
    blurb: 'Long-running Italian kitchen and a Linda Vista fixture.',
    discount: '10% off for members', address: '', url: '' },

  { name: 'Performance360', category: 'Fitness',
    blurb: 'Strength and conditioning gym running small group training.',
    discount: '10% off for members', address: '', url: '' },

  { name: 'Linda Vista Honey', category: 'Food & drink',
    blurb: 'Raw local honey, kept and bottled in the neighborhood.',
    discount: '', address: '', url: 'https://lindavistahoney.com' }
];
