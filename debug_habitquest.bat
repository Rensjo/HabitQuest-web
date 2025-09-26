@echo off
echo Starting HabitQuest...
echo.

rem Try to run from build location first
if exist "C:\dev\target-tauri\release\habitquest.exe" (
    echo Running from build location...
    cd /d "C:\dev\target-tauri\release"
    "C:\dev\target-tauri\release\habitquest.exe" 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo Error level: %ERRORLEVEL%
    )
) else (
    echo Build executable not found
)

echo.
echo ==========================================

rem Try to run from installed location
if exist "%LOCALAPPDATA%\HabitQuest\habitquest.exe" (
    echo Running from installed location...
    cd /d "%LOCALAPPDATA%\HabitQuest"
    "%LOCALAPPDATA%\HabitQuest\habitquest.exe" 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo Error level: %ERRORLEVEL%
    )
) else (
    echo Installed executable not found
)

echo.
pause