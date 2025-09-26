@echo off
echo ===============================================
echo HabitQuest Complete Reinstallation Script
echo ===============================================
echo.

echo Step 1: Stopping any running HabitQuest processes...
taskkill /F /IM "habitquest.exe" 2>nul >nul
if %ERRORLEVEL% EQU 0 (
    echo   ✓ Stopped running HabitQuest processes
) else (
    echo   ✓ No HabitQuest processes were running
)
echo.

echo Step 2: Uninstalling current version...
if exist "%LOCALAPPDATA%\HabitQuest\Uninstall HabitQuest.exe" (
    echo   Found uninstaller, running it...
    "%LOCALAPPDATA%\HabitQuest\Uninstall HabitQuest.exe" /S
    timeout /t 3 >nul
    echo   ✓ Uninstallation completed
) else (
    echo   ✓ No previous installation found
)
echo.

echo Step 3: Cleaning leftover files...
if exist "%LOCALAPPDATA%\HabitQuest" (
    rd /s /q "%LOCALAPPDATA%\HabitQuest" 2>nul
    echo   ✓ Cleaned installation directory
)
if exist "%LOCALAPPDATA%\com.renkaistudios.habitquest" (
    rd /s /q "%LOCALAPPDATA%\com.renkaistudios.habitquest" 2>nul
    echo   ✓ Cleaned app data directory
)
echo.

echo Step 4: Installing fresh version...
if exist "C:\dev\target-tauri\release\bundle\msi\HabitQuest_4.1.2_x64_en-US.msi" (
    echo   Installing from MSI package...
    msiexec /i "C:\dev\target-tauri\release\bundle\msi\HabitQuest_4.1.2_x64_en-US.msi" /quiet /norestart
    echo   ✓ Installation completed
) else (
    echo   ❌ MSI installer not found!
    echo   Please run: npm run tauri:build
    pause
    exit /b 1
)
echo.

echo Step 5: Waiting for installation to complete...
timeout /t 5 >nul
echo.

echo Step 6: Starting HabitQuest...
if exist "%LOCALAPPDATA%\HabitQuest\habitquest.exe" (
    start "" "%LOCALAPPDATA%\HabitQuest\habitquest.exe"
    echo   ✓ HabitQuest started successfully
) else (
    echo   ❌ Installation failed - executable not found
    pause
    exit /b 1
)
echo.

echo ===============================================
echo Installation Complete!
echo ===============================================
echo.
echo Next steps:
echo 1. HabitQuest should now be running
echo 2. Go to Settings → Notifications
echo 3. Click "Test Notification"
echo 4. Check Task Manager - should show as "habitquest"
echo 5. Check Windows Settings → Notifications for HabitQuest
echo.
pause