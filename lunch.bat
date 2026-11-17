@echo off
setlocal EnableDelayedExpansion
title Neural Voice Artists - Auto Setup & Launcher
cd /d "%~dp0"

echo ==================================================
echo   Neural Voice Artists - Auto Setup ^& Launcher
echo ==================================================
echo.

:: 1. Check if Python is installed (avoiding Windows Store dummy alias)
set "PYTHON_CMD="
python -c "import sys; print(sys.version)" >nul 2>&1
if %errorlevel% equ 0 (
    set "PYTHON_CMD=python"
) else (
    py -3 -c "import sys; print(sys.version)" >nul 2>&1
    if !errorlevel! equ 0 (
        set "PYTHON_CMD=py -3"
    )
)

if defined PYTHON_CMD (
    for /f "delims=" %%v in ('%PYTHON_CMD% --version 2^>^&1') do echo [OK] Found %%v
    goto :CHECK_LIBRARIES
)

echo [!] Python 3 is not installed on this PC.
echo [*] Downloading and installing Python 3 automatically...
echo.

:: Try installing via Windows Package Manager (winget) first
where winget >nul 2>&1
if %errorlevel% equ 0 (
    echo [*] Installing Python 3.12 via winget...
    winget install -e --id Python.Python.3.12 --silent --accept-package-agreements --accept-source-agreements
    if !errorlevel! equ 0 goto :REFRESH_PATH
)

:: Fallback: Download official Python 3.12 64-bit installer via PowerShell and run silent install
echo [*] Downloading Python 3.12 installer from python.org...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.12.10/python-3.12.10-amd64.exe' -OutFile '%TEMP%\python_installer.exe'"
if not exist "%TEMP%\python_installer.exe" (
    echo [ERROR] Failed to download Python installer. Please check your internet connection.
    pause
    exit /b 1
)

echo [*] Installing Python 3.12 silently (this may take a minute)...
"%TEMP%\python_installer.exe" /quiet InstallAllUsers=0 PrependPath=1 Include_test=0
del /f /q "%TEMP%\python_installer.exe" >nul 2>&1

:REFRESH_PATH
:: Refresh PATH in current terminal session so Python is immediately usable
for /f "tokens=2*" %%A in ('reg query "HKCU\Environment" /v Path 2^>nul') do set "USER_PATH=%%B"
for /f "tokens=2*" %%A in ('reg query "HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\Environment" /v Path 2^>nul') do set "SYS_PATH=%%B"
set "PATH=%USER_PATH%;%SYS_PATH%;%LocalAppData%\Programs\Python\Python312;%LocalAppData%\Programs\Python\Python312\Scripts;%PATH%"

python -c "import sys" >nul 2>&1
if %errorlevel% equ 0 (
    set "PYTHON_CMD=python"
) else if exist "%LocalAppData%\Programs\Python\Python312\python.exe" (
    set "PYTHON_CMD="%LocalAppData%\Programs\Python\Python312\python.exe""
) else (
    echo [ERROR] Python was installed, but Windows needs a restart of this script.
    echo [*] Please close this window and double-click launch.bat again.
    pause
    exit /b 1
)
echo [OK] Python installed successfully!

:CHECK_LIBRARIES
echo.
echo [*] Checking required Python libraries (flask, flask-cors, gTTS)...

:: Ensure pip is available
%PYTHON_CMD% -m pip --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Bootstrapping pip...
    %PYTHON_CMD% -m ensurepip --upgrade >nul 2>&1
)

:: Check and install Flask
%PYTHON_CMD% -c "import flask" >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Installing Flask...
    %PYTHON_CMD% -m pip install flask
) else (
    echo [OK] Flask is already installed.
)

:: Check and install Flask-CORS
%PYTHON_CMD% -c "import flask_cors" >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Installing Flask-CORS...
    %PYTHON_CMD% -m pip install flask-cors
) else (
    echo [OK] Flask-CORS is already installed.
)

:: Check and install gTTS
%PYTHON_CMD% -c "import gtts" >nul 2>&1
if %errorlevel% neq 0 (
    echo [*] Installing gTTS...
    %PYTHON_CMD% -m pip install gTTS
) else (
    echo [OK] gTTS is already installed.
)

echo.
echo [*] Starting Neural Voice Artists Backend Server (app.py)...
start "Neural Voice Artists Backend" cmd /c "%PYTHON_CMD% app.py"

:: Wait briefly for Flask server to initialize on port 3000
timeout /t 3 /nobreak >nul

echo [*] Opening Neural Voice Artists in your default browser...
start "" "http://localhost:3000"

echo.
echo [OK] Application is live at http://localhost:3000
echo [INFO] Keep the backend server window open while using the app.
timeout /t 3 >nul
exit