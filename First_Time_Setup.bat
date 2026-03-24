@echo off
title ShieldResponse Installer
echo ===================================================
echo     INSTALLING SHIELDRESPONSE DEPENDENCIES...
echo     (This will take a few minutes. Please wait!)
echo ===================================================
echo.

echo [1/3] Installing Python Backend Packages...
cd I.R.I.S_backend
pip install -r requirements.txt

echo.
echo [2/3] Building the Database...
:: This line automatically creates all the tables on a new computer!
python manage.py migrate

echo.
echo [3/3] Installing Node.js Frontend Packages...
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