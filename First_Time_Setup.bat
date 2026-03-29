@echo off
title ShieldResponse Installer
echo ===================================================
echo     INSTALLING SHIELDRESPONSE DEPENDENCIES...
echo     (This will take a few minutes. Please wait!)
echo ===================================================
echo.

echo [1/4] Installing Python Backend Packages...
cd I.R.I.S_backend
pip install -r requirements.txt

echo.
echo [2/4] Building and Seeding the Database...
:: This line automatically creates all the tables on a new computer!
python manage.py makemigrations
python manage.py migrate
:: 🚨 FIXED: Added --wipe to guarantee all playbooks load perfectly!
python manage.py seed_questions --wipe

echo.
echo [3/4] Downloading the AI Brain (Ollama)...
:: This downloads the llama3 model.
:: 🚨 FIXED: Added "echo" so Windows doesn't crash on this line!
echo It might take 5-10 minutes depending on internet speed!
echo (If you get an error here, make sure Ollama is installed and running!)
ollama pull llama3

echo.
echo [4/4] Installing Node.js Frontend Packages...
:: Navigate back to the main folder, then into the frontend
cd ../I.R.I.S_frontend
npm install

echo.
echo ===================================================
echo INSTALLATION COMPLETE!
echo You can now close this black window.
echo.
echo To play the game, make sure Ollama is running, then double-click:
echo Launch_ShieldResponse.bat
echo ===================================================
echo.
pause