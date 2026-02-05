#!/bin/bash
cd /Users/joshdicker/Desktop/CODE/_portfolio/inlet

cd client && npm run dev -- --port 5175 &

osascript -e 'tell application "Terminal" to set miniaturized of front window to true'

wait