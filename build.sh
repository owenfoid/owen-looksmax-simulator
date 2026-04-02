#!/bin/bash
# Builds all source files into a single index.html
# Usage: ./build.sh [output_path]
# Default output: ./dist/index.html

OUT="${1:-./index.html}"
mkdir -p "$(dirname "$OUT")"

cat > "$OUT" << 'HTMLHEAD'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Owen Looksmax Simulator</title>
<link href="https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
HTMLHEAD

# Inject CSS
cat style.css >> "$OUT"

cat >> "$OUT" << 'HTMLMID'
</style>
</head>
HTMLMID

# Extract body from index.html (between <body> and </body>, minus script tags)
sed -n '/<body>/,/<\/body>/p' shell.html | grep -v '<script' | grep -v '</body>' >> "$OUT"

# Inject all JS in order
echo '<script>' >> "$OUT"
cat js/config.js >> "$OUT"
echo '' >> "$OUT"
cat js/engine.js >> "$OUT"
echo '' >> "$OUT"
cat js/effects.js >> "$OUT"
echo '' >> "$OUT"
cat js/face.js >> "$OUT"
echo '' >> "$OUT"
cat js/mic.js >> "$OUT"
echo '' >> "$OUT"
cat js/game.js >> "$OUT"
echo '</script>' >> "$OUT"
echo '</body></html>' >> "$OUT"

echo "✅ Built → $OUT ($(wc -c < "$OUT") bytes)"
