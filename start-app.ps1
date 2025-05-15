Write-Host "Starting Legal Connect App..." -ForegroundColor Green

# Start the Hugging Face proxy server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot\server; node hf-proxy.js"

# Wait for the proxy server to start
Start-Sleep -Seconds 2

# Start the frontend app in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $PSScriptRoot; npm run dev"

Write-Host "Both servers are now running!" -ForegroundColor Green
Write-Host "Hugging Face proxy is on http://localhost:5001" -ForegroundColor Cyan
Write-Host "Frontend is on http://localhost:5173" -ForegroundColor Cyan 