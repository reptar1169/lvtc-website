#!/bin/sh
# ---------------------------------------------------------------------------
# Regenerate sitemap.xml from the pages actually in this folder.
#
#     ./make-sitemap.sh
#
# Each page's <lastmod> is taken from the file's own modification date, so the
# sitemap tells the truth without anyone having to remember a date. Re-run it
# whenever you add a page or make a round of edits, before deploying.
#
# review.html is deliberately excluded — it is the unlisted moderation queue.
# ---------------------------------------------------------------------------
set -e
cd "$(dirname "$0")"
BASE="https://lindavistatowncouncil.org"

# Order is roughly how a person would work through the site, not alphabetical.
PAGES="index meetings meeting events your-town map new history businesses board membership contact bylaws"

{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  for p in $PAGES; do
    [ -f "$p.html" ] || { echo "  (skipped missing $p.html)" >&2; continue; }
    # cleanUrls is on, so the canonical URL has no .html — and the home page
    # is the bare domain with a trailing slash, not /index.
    if [ "$p" = "index" ]; then loc="$BASE/"; else loc="$BASE/$p"; fi
    mod=$(date -u -r "$p.html" +%Y-%m-%d)
    printf '  <url>\n    <loc>%s</loc>\n    <lastmod>%s</lastmod>\n  </url>\n' "$loc" "$mod"
  done
  echo '</urlset>'
} > sitemap.xml

echo "Wrote sitemap.xml:"
grep -c '<url>' sitemap.xml | sed 's/^/  /;s/$/ pages/'
