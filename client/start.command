#!/bin/bash

cd /Users/joshdicker/Desktop/CODE/_portfolio/inlet/client

# Kill any process using port 3000
PID=$(lsof -ti :3000)
if [ -n "$PID" ]; then
  kill -9 $PID
fi

# Start json-server
npx json-server --watch public/db.json --port 3000 &

# Start Vite
npm run dev -- --port 5175 &

# Minimize terminal
osascript -e 'tell application "Terminal" to set miniaturized of front window to true'

wait
