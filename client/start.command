#!/bin/bash

cd "$(dirname "$0")"

echo "Starting Vite on port 5175..."

npm run dev -- --port 5175 &

sleep 2

exit