# Owen Looksmax Simulator

## File Map (for fast edits)

```
owen-looksmax-simulator/
├── index.html      ← HTML shell only. Rarely changes.
├── style.css       ← All CSS. Edit for visual changes.
├── deploy.sh       ← Run: ./deploy.sh "msg"
├── js/
│   ├── config.js   ← UPGRADES, RANKS, ACHIEVEMENTS, EVENTS (edit this 90% of the time)
│   ├── engine.js   ← State, helpers, save/load, fmt(), psl()
│   ├── effects.js  ← Screen shake, flash, chromatic, wobble, particles, stim, log/toast
│   ├── face.js     ← Canvas face drawing (morphs ugly→chad)
│   └── game.js     ← Click handler, buy, render, tick, init
```

## What to edit for common changes

| Want to...                    | Edit file      |
|-------------------------------|----------------|
| Add/change an upgrade         | `js/config.js` |
| Add an achievement            | `js/config.js` |
| Add a random event            | `js/config.js` |
| Change a rank name/threshold  | `js/config.js` |
| Change face appearance        | `js/face.js`   |
| Add new visual effect         | `js/effects.js`|
| Change game balance/formulas  | `js/engine.js` |
| Change click/buy behavior     | `js/game.js`   |
| Change colors/layout/fonts    | `style.css`    |
| Change HTML structure         | `index.html`   |

## Deploy

```bash
chmod +x deploy.sh
./deploy.sh "added new upgrade"
```
