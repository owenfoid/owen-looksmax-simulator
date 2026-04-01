#!/bin/bash
# Usage: ./deploy.sh "commit message"
# If no message provided, uses a default
MSG="${1:-update game}"
git add -A && git commit -m "$MSG" && git push
echo "✅ Deployed → https://tatelyman.github.io/owen-looksmax-simulator/"
