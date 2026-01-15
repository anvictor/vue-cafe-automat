#!/bin/bash

# Kill processes on ports used by the project
PORTS=(3000 3001 5173)

echo "🧹 Cleaning up ports..."

for PORT in "${PORTS[@]}"; do
  PID=$(lsof -ti:$PORT)
  if [ ! -z "$PID" ]; then
    echo "  Killing process on port $PORT (PID: $PID)"
    kill -9 $PID 2>/dev/null
  fi
done

echo "✅ Ports cleaned!"
