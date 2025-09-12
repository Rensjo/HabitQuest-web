@echo off
title HabitQuest v3.2.0.1 - Build and Package
color 0A

echo.
echo ========================================
echo    HabitQuest v3.2.0.1 - Build Script
echo ========================================
echo.

echo Running PowerShell build script...
powershell -ExecutionPolicy Bypass -File "build-and-package.ps1"

echo.
echo Build process completed!
echo.
pause

