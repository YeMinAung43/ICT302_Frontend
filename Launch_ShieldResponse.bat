@echo off
title ShieldResponse Launcher
echo ===================================================
echo     INITIATING SHIELDRESPONSE SIMULATION...
echo ===================================================
echo.

echo Cleaning up ghost servers...
:: This silently kills any old React servers so you never get the Port 5174 bug again!
taskkill /F /IM node.exe >nul 2>&1

echo [1/2] Booting up the Django Backend Server...
:: Enters the backend folder and runs the Python server
start "ShieldResponse Backend" cmd /k "cd I.R.I.S_backend && python manage.py runserver"

echo [2/2] Booting up the React Frontend Interface...
:: Enters the frontend folder and starts Vite
start "ShieldResponse Frontend" cmd /k "cd I.R.I.S_frontend && npm run dev"

echo.
echo ===================================================
echo ALL SYSTEMS GO! 
echo Two new terminal windows have opened.
echo.
echo Please wait 5 seconds for the servers to start,
echo then hold CTRL and click the link in the Frontend window
echo or manually go to: http://localhost:5173
echo ===================================================
echo.
pause