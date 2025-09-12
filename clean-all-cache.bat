@echo off
title HabitQuest Complete Cache Cleanup
color 0C

echo.
echo ========================================
echo    HabitQuest Complete Cache Cleanup
echo ========================================
echo.
echo WARNING: This will remove ALL cached data!
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo Running PowerShell cleanup script...
powershell -ExecutionPolicy Bypass -File "clean-all-cache.ps1"

echo.
echo Cache cleanup completed!
echo.
pause

