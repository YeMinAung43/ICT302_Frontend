@echo off
title ShieldResponse Installer

echo ========================================================
echo 🚨 CRITICAL WARNING: POSTGRESQL IS NOW REQUIRED! 🚨
echo ========================================================
echo Before continuing, you MUST have PostgreSQL installed.
echo Please ensure you have done the following in pgAdmin/psql:
echo 1. Created a new database named 'iris_db'
echo 2. Set your 'postgres' user password to 'admin123'
echo.
echo If you have NOT done this yet, close this window and do it first!
echo ========================================================
pause
echo.

echo ===================================================
echo     INSTALLING SHIELDRESPONSE DEPENDENCIES...
echo     (This will take a few minutes. Please wait!)
echo ===================================================
echo.

echo [1/4] Installing Python Backend Packages...
:: Added a safety pause in case the folder name is wrong!
cd I.R.I.S_backend || pause
:: 🚨 FIXED: Force install the Postgres connector just to be safe!
pip install psycopg2-binary
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
:: Added a safety pause in case the frontend folder is missing
cd ../I.R.I.S_frontend || pause

:: 🚨 THE FIX: Added "call" so NPM doesn't accidentally close the window!
call npm install

echo.
echo ===================================================
echo               INSTALLATION COMPLETE!
echo ===================================================
echo IMPORTANT: Because this is a brand new Postgres Database,
echo you need to create a new admin account to log in!
echo. 
echo To create one, open a terminal in I.R.I.S_backend and run:
echo python manage.py createsuperuser
echo.
echo You can now close this black window.
echo.
echo To play the game, make sure Ollama is running, then double-click:
echo Launch_ShieldResponse.bat
echo ===================================================
echo.
pause