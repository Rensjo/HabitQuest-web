@echo off
echo ==========================================
echo HabitQuest Notification Verification
echo ==========================================
echo.

echo Checking current process status...
powershell -Command "Get-Process | Where-Object {$_.ProcessName -eq 'habitquest'} | Select-Object ProcessName, Id, MainWindowTitle | Format-Table -AutoSize"
echo.

echo ==========================================
echo IMPORTANT: Please test the following NOW:
echo ==========================================
echo.
echo 1. CHECK TASK MANAGER:
echo    - Press Ctrl+Shift+Esc to open Task Manager
echo    - Look for "habitquest" (not WebView2 Manager)
echo    - Process ID should be shown above
echo.
echo 2. TEST NOTIFICATIONS IN APP:
echo    - Open HabitQuest (should be running now)
echo    - Go to Settings (gear icon)
echo    - Click on "Notifications" tab
echo    - Click "Test Notification" button
echo    - You should see a Windows toast notification
echo.
echo 3. CHECK WINDOWS NOTIFICATION SETTINGS:
echo    - Press Win+I to open Windows Settings
echo    - Go to System → Notifications ^& actions
echo    - Look for "HabitQuest" in the app list
echo    - (It will appear after sending first notification)
echo.
echo 4. TEST BACKGROUND NOTIFICATIONS:
echo    - In HabitQuest, enable background notifications
echo    - Close HabitQuest completely
echo    - Background service should send reminders
echo.
echo Press any key when you've completed the tests...
pause >nul

echo.
echo ==========================================
echo Opening Windows Notification Settings...
echo ==========================================
start ms-settings:notifications

echo.
echo Did everything work correctly?
echo - Task Manager shows "habitquest" not "WebView2"? (Y/N)
set /p taskmanager="Task Manager correct: "

echo - Test notification button worked? (Y/N)  
set /p notification="Test notification worked: "

echo - HabitQuest appears in Windows notification settings? (Y/N)
set /p windowssettings="Windows settings correct: "

echo.
echo ==========================================
echo TEST RESULTS SUMMARY:
echo ==========================================
echo Task Manager Identity: %taskmanager%
echo Test Notification: %notification%
echo Windows Settings: %windowssettings%
echo.

if /i "%taskmanager%"=="Y" if /i "%notification%"=="Y" if /i "%windowssettings%"=="Y" (
    echo ✅ ALL TESTS PASSED! Notification system is working!
) else (
    echo ⚠️  Some tests failed. Please report which ones didn't work.
)
echo.
pause