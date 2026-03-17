@echo off
title ShieldResponse Installer
echo ===================================================
echo     INSTALLING SHIELDRESPONSE DEPENDENCIES...
echo     (This will take a few minutes. Please wait!)
echo ===================================================
echo.

echo [1/2] Installing Python Backend Packages...
cd I.R.I.S_backend
pip install -r requirements.txt

echo.
echo [2/2] Installing Node.js Frontend Packages...
cd ../I.R.I.S_frontend
npm install

echo.
echo ===================================================
echo INSTALLATION COMPLETE!
echo You can now close this black window.
echo. 
echo To play the game, double-click:
echo Launch_ShieldResponse.bat
echo ===================================================
echo.
pause