@echo off
echo Starting Legal Connect App...

REM Start the Hugging Face proxy server
start cmd /k "cd server && node hf-proxy.js"

REM Wait for the proxy server to start
timeout /t 2

REM Start the frontend app
start cmd /k "npm run dev"

echo Both servers are now running!
echo Hugging Face proxy is on http://localhost:5001
echo Frontend is on http://localhost:5173 