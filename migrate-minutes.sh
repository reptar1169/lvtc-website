#!/bin/bash
# Downloads every minutes document still hosted on Squarespace into ./minutes/
# Run this in Terminal from the site folder:   bash migrate-minutes.sh
# Safe to re-run: files already present are skipped, nothing is deleted.
set -u
cd "$(dirname "$0")" || exit 1
mkdir -p minutes
ok=0; skip=0; fail=0

if [ -s "minutes/2025-11-05-board.pdf" ]; then
  echo "skip  2025-11-05-board.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2025-11-05-board.pdf" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-2025-11_5_25docx.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2025-11-05-board.pdf" ]; then
    echo "ok    2025-11-05-board.pdf ($(wc -c < "minutes/2025-11-05-board.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2025-11-05-board.pdf (http $code)"; rm -f "minutes/2025-11-05-board.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2025-10-01-board.pdf" ]; then
  echo "skip  2025-10-01-board.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2025-10-01-board.pdf" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-2025-10_1_25docx.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2025-10-01-board.pdf" ]; then
    echo "ok    2025-10-01-board.pdf ($(wc -c < "minutes/2025-10-01-board.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2025-10-01-board.pdf (http $code)"; rm -f "minutes/2025-10-01-board.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2025-06-03-board.pdf" ]; then
  echo "skip  2025-06-03-board.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2025-06-03-board.pdf" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-2025-6_3_25.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2025-06-03-board.pdf" ]; then
    echo "ok    2025-06-03-board.pdf ($(wc -c < "minutes/2025-06-03-board.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2025-06-03-board.pdf (http $code)"; rm -f "minutes/2025-06-03-board.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2025-05-07-board.pdf" ]; then
  echo "skip  2025-05-07-board.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2025-05-07-board.pdf" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-2025-5_7_25.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2025-05-07-board.pdf" ]; then
    echo "ok    2025-05-07-board.pdf ($(wc -c < "minutes/2025-05-07-board.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2025-05-07-board.pdf (http $code)"; rm -f "minutes/2025-05-07-board.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2025-02-05-board.pdf" ]; then
  echo "skip  2025-02-05-board.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2025-02-05-board.pdf" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-2025-2_5_25.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2025-02-05-board.pdf" ]; then
    echo "ok    2025-02-05-board.pdf ($(wc -c < "minutes/2025-02-05-board.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2025-02-05-board.pdf (http $code)"; rm -f "minutes/2025-02-05-board.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2025-01-03-board.pdf" ]; then
  echo "skip  2025-01-03-board.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2025-01-03-board.pdf" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-2025-1_3_25.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2025-01-03-board.pdf" ]; then
    echo "ok    2025-01-03-board.pdf ($(wc -c < "minutes/2025-01-03-board.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2025-01-03-board.pdf (http $code)"; rm -f "minutes/2025-01-03-board.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-11-20-general.pdf" ]; then
  echo "skip  2024-11-20-general.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-11-20-general.pdf" "https://lindavistatowncouncil.org/s/LVTC-Zoom-Gen-Meeting-11-20-20024.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-11-20-general.pdf" ]; then
    echo "ok    2024-11-20-general.pdf ($(wc -c < "minutes/2024-11-20-general.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-11-20-general.pdf (http $code)"; rm -f "minutes/2024-11-20-general.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-10-07-general.pdf" ]; then
  echo "skip  2024-10-07-general.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-10-07-general.pdf" "https://lindavistatowncouncil.org/s/LVTC-Gen-Meeting-10-07-2024.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-10-07-general.pdf" ]; then
    echo "ok    2024-10-07-general.pdf ($(wc -c < "minutes/2024-10-07-general.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-10-07-general.pdf (http $code)"; rm -f "minutes/2024-10-07-general.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-09-18-general.pdf" ]; then
  echo "skip  2024-09-18-general.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-09-18-general.pdf" "https://lindavistatowncouncil.org/s/LVTC-Gen-Meeting-09-18-2024__By-Law-Changes-09-24-2024-1.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-09-18-general.pdf" ]; then
    echo "ok    2024-09-18-general.pdf ($(wc -c < "minutes/2024-09-18-general.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-09-18-general.pdf (http $code)"; rm -f "minutes/2024-09-18-general.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-08-21-general.pdf" ]; then
  echo "skip  2024-08-21-general.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-08-21-general.pdf" "https://lindavistatowncouncil.org/s/LVTC-General-Meeting-8-21-2024.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-08-21-general.pdf" ]; then
    echo "ok    2024-08-21-general.pdf ($(wc -c < "minutes/2024-08-21-general.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-08-21-general.pdf (http $code)"; rm -f "minutes/2024-08-21-general.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-08-07-board.pdf" ]; then
  echo "skip  2024-08-07-board.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-08-07-board.pdf" "https://lindavistatowncouncil.org/s/LVTC-Board-Meeting-08-07-2024.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-08-07-board.pdf" ]; then
    echo "ok    2024-08-07-board.pdf ($(wc -c < "minutes/2024-08-07-board.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-08-07-board.pdf (http $code)"; rm -f "minutes/2024-08-07-board.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-06-19-general.pdf" ]; then
  echo "skip  2024-06-19-general.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-06-19-general.pdf" "https://lindavistatowncouncil.org/s/LVTC-Gen-Meeting-6-19-2024.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-06-19-general.pdf" ]; then
    echo "ok    2024-06-19-general.pdf ($(wc -c < "minutes/2024-06-19-general.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-06-19-general.pdf (http $code)"; rm -f "minutes/2024-06-19-general.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-05-15-general.pdf" ]; then
  echo "skip  2024-05-15-general.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-05-15-general.pdf" "https://lindavistatowncouncil.org/s/LVTC-Gen-Meeting-5-15-2024.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-05-15-general.pdf" ]; then
    echo "ok    2024-05-15-general.pdf ($(wc -c < "minutes/2024-05-15-general.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-05-15-general.pdf (http $code)"; rm -f "minutes/2024-05-15-general.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-04-17-general.pdf" ]; then
  echo "skip  2024-04-17-general.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-04-17-general.pdf" "https://lindavistatowncouncil.org/s/LVTC-Gen-Meeting-4-17-2024-ycz5.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-04-17-general.pdf" ]; then
    echo "ok    2024-04-17-general.pdf ($(wc -c < "minutes/2024-04-17-general.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-04-17-general.pdf (http $code)"; rm -f "minutes/2024-04-17-general.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-03-20-general.pdf" ]; then
  echo "skip  2024-03-20-general.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-03-20-general.pdf" "https://lindavistatowncouncil.org/s/LVTC-Gen-Meeting-03-20-2024.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-03-20-general.pdf" ]; then
    echo "ok    2024-03-20-general.pdf ($(wc -c < "minutes/2024-03-20-general.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-03-20-general.pdf (http $code)"; rm -f "minutes/2024-03-20-general.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-02-21-general.pdf" ]; then
  echo "skip  2024-02-21-general.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-02-21-general.pdf" "https://lindavistatowncouncil.org/s/LVTC-General-Meeting-minutes-2-21-2024.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-02-21-general.pdf" ]; then
    echo "ok    2024-02-21-general.pdf ($(wc -c < "minutes/2024-02-21-general.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-02-21-general.pdf (http $code)"; rm -f "minutes/2024-02-21-general.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-02-07-board.pdf" ]; then
  echo "skip  2024-02-07-board.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-02-07-board.pdf" "https://lindavistatowncouncil.org/s/LVTC-Board-Meeting-2-07-2024.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-02-07-board.pdf" ]; then
    echo "ok    2024-02-07-board.pdf ($(wc -c < "minutes/2024-02-07-board.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-02-07-board.pdf (http $code)"; rm -f "minutes/2024-02-07-board.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2024-01-17-general.pdf" ]; then
  echo "skip  2024-01-17-general.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2024-01-17-general.pdf" "https://lindavistatowncouncil.org/s/LVTC-Gen-Meeting-minutes-Jan-2024.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2024-01-17-general.pdf" ]; then
    echo "ok    2024-01-17-general.pdf ($(wc -c < "minutes/2024-01-17-general.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2024-01-17-general.pdf (http $code)"; rm -f "minutes/2024-01-17-general.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-11-15-general.pdf" ]; then
  echo "skip  2023-11-15-general.pdf"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-11-15-general.pdf" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-General-Meeting-minutes-Nov-2023.pdf")
  if [ "$code" = "200" ] && [ -s "minutes/2023-11-15-general.pdf" ]; then
    echo "ok    2023-11-15-general.pdf ($(wc -c < "minutes/2023-11-15-general.pdf" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-11-15-general.pdf (http $code)"; rm -f "minutes/2023-11-15-general.pdf"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-10-04-board.docx" ]; then
  echo "skip  2023-10-04-board.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-10-04-board.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-Board-Meeting-10042023.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-10-04-board.docx" ]; then
    echo "ok    2023-10-04-board.docx ($(wc -c < "minutes/2023-10-04-board.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-10-04-board.docx (http $code)"; rm -f "minutes/2023-10-04-board.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-09-20-general.docx" ]; then
  echo "skip  2023-09-20-general.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-09-20-general.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-General-Meeting-09202023.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-09-20-general.docx" ]; then
    echo "ok    2023-09-20-general.docx ($(wc -c < "minutes/2023-09-20-general.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-09-20-general.docx (http $code)"; rm -f "minutes/2023-09-20-general.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-09-06-board.docx" ]; then
  echo "skip  2023-09-06-board.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-09-06-board.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-Board-Meeting-09062023.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-09-06-board.docx" ]; then
    echo "ok    2023-09-06-board.docx ($(wc -c < "minutes/2023-09-06-board.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-09-06-board.docx (http $code)"; rm -f "minutes/2023-09-06-board.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-08-16-general.docx" ]; then
  echo "skip  2023-08-16-general.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-08-16-general.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-General-Meeting-08162023.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-08-16-general.docx" ]; then
    echo "ok    2023-08-16-general.docx ($(wc -c < "minutes/2023-08-16-general.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-08-16-general.docx (http $code)"; rm -f "minutes/2023-08-16-general.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-08-02-board.docx" ]; then
  echo "skip  2023-08-02-board.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-08-02-board.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-Board-Meeting-08022023.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-08-02-board.docx" ]; then
    echo "ok    2023-08-02-board.docx ($(wc -c < "minutes/2023-08-02-board.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-08-02-board.docx (http $code)"; rm -f "minutes/2023-08-02-board.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-06-21-general.docx" ]; then
  echo "skip  2023-06-21-general.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-06-21-general.docx" "https://lindavistatowncouncil.org/s/LindaVistaTownCouncilGeneralMeeting062123-1.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-06-21-general.docx" ]; then
    echo "ok    2023-06-21-general.docx ($(wc -c < "minutes/2023-06-21-general.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-06-21-general.docx (http $code)"; rm -f "minutes/2023-06-21-general.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-06-07-board.docx" ]; then
  echo "skip  2023-06-07-board.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-06-07-board.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-Boardl-Meeting-06072023.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-06-07-board.docx" ]; then
    echo "ok    2023-06-07-board.docx ($(wc -c < "minutes/2023-06-07-board.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-06-07-board.docx (http $code)"; rm -f "minutes/2023-06-07-board.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-05-17-general.docx" ]; then
  echo "skip  2023-05-17-general.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-05-17-general.docx" "https://lindavistatowncouncil.org/s/LindaVistaTownCouncilGeneralMeeting051723.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-05-17-general.docx" ]; then
    echo "ok    2023-05-17-general.docx ($(wc -c < "minutes/2023-05-17-general.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-05-17-general.docx (http $code)"; rm -f "minutes/2023-05-17-general.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-05-03-board.docx" ]; then
  echo "skip  2023-05-03-board.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-05-03-board.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-Boardl-Meeting-05032023.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-05-03-board.docx" ]; then
    echo "ok    2023-05-03-board.docx ($(wc -c < "minutes/2023-05-03-board.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-05-03-board.docx (http $code)"; rm -f "minutes/2023-05-03-board.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-04-19-general.docx" ]; then
  echo "skip  2023-04-19-general.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-04-19-general.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-General-Meeting-04192023-edited.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-04-19-general.docx" ]; then
    echo "ok    2023-04-19-general.docx ($(wc -c < "minutes/2023-04-19-general.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-04-19-general.docx (http $code)"; rm -f "minutes/2023-04-19-general.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-04-05-board.docx" ]; then
  echo "skip  2023-04-05-board.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-04-05-board.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-Boardl-Meeting-04052023.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-04-05-board.docx" ]; then
    echo "ok    2023-04-05-board.docx ($(wc -c < "minutes/2023-04-05-board.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-04-05-board.docx (http $code)"; rm -f "minutes/2023-04-05-board.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-03-15-general.docx" ]; then
  echo "skip  2023-03-15-general.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-03-15-general.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-General-Meeting-03152023.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-03-15-general.docx" ]; then
    echo "ok    2023-03-15-general.docx ($(wc -c < "minutes/2023-03-15-general.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-03-15-general.docx (http $code)"; rm -f "minutes/2023-03-15-general.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-03-01-board.docx" ]; then
  echo "skip  2023-03-01-board.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-03-01-board.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-Board-Meeting-030123.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-03-01-board.docx" ]; then
    echo "ok    2023-03-01-board.docx ($(wc -c < "minutes/2023-03-01-board.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-03-01-board.docx (http $code)"; rm -f "minutes/2023-03-01-board.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-02-15-general.docx" ]; then
  echo "skip  2023-02-15-general.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-02-15-general.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-General-Meeting-02152023ver2-1.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-02-15-general.docx" ]; then
    echo "ok    2023-02-15-general.docx ($(wc -c < "minutes/2023-02-15-general.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-02-15-general.docx (http $code)"; rm -f "minutes/2023-02-15-general.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-02-01-board.docx" ]; then
  echo "skip  2023-02-01-board.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-02-01-board.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-Board-Meeting-February-1-2023-1.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-02-01-board.docx" ]; then
    echo "ok    2023-02-01-board.docx ($(wc -c < "minutes/2023-02-01-board.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-02-01-board.docx (http $code)"; rm -f "minutes/2023-02-01-board.docx"; fail=$((fail+1))
  fi
fi
if [ -s "minutes/2023-01-04-board.docx" ]; then
  echo "skip  2023-01-04-board.docx"; skip=$((skip+1))
else
  code=$(curl -sSL --max-time 60 -w "%{http_code}" -o "minutes/2023-01-04-board.docx" "https://lindavistatowncouncil.org/s/Linda-Vista-Town-Council-Boardl-Meeting-01042023-1.docx")
  if [ "$code" = "200" ] && [ -s "minutes/2023-01-04-board.docx" ]; then
    echo "ok    2023-01-04-board.docx ($(wc -c < "minutes/2023-01-04-board.docx" | tr -d " ") bytes)"; ok=$((ok+1))
  else
    echo "FAIL  2023-01-04-board.docx (http $code)"; rm -f "minutes/2023-01-04-board.docx"; fail=$((fail+1))
  fi
fi

echo
echo "downloaded $ok, skipped $skip, failed $fail"
echo "now tell Claude it is done and the links get repointed"
