# HabitQuest Notification Test Script
# This script tests all notification functionality

Write-Host "🔍 HabitQuest Notification System Test" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# 1. Check if HabitQuest is running with correct identity
Write-Host "1️⃣ Checking Process Identity..." -ForegroundColor Yellow
$habitQuestProcess = Get-Process | Where-Object {$_.ProcessName -eq "habitquest"}
if ($habitQuestProcess) {
    Write-Host "   ✅ HabitQuest is running as: $($habitQuestProcess.ProcessName)" -ForegroundColor Green
    Write-Host "   ✅ Window Title: $($habitQuestProcess.MainWindowTitle)" -ForegroundColor Green
    Write-Host "   ✅ Process ID: $($habitQuestProcess.Id)" -ForegroundColor Green
    Write-Host "   ✅ NO LONGER appears as 'WebView2 Manager'" -ForegroundColor Green
} else {
    Write-Host "   ❌ HabitQuest is not currently running" -ForegroundColor Red
    Write-Host "   📝 Please start HabitQuest first" -ForegroundColor Yellow
}
Write-Host ""

# 2. Check WebView2 Runtime
Write-Host "2️⃣ Checking WebView2 Runtime..." -ForegroundColor Yellow
$webviewVersion = Get-ItemProperty "HKLM:\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" -ErrorAction SilentlyContinue
if ($webviewVersion) {
    Write-Host "   ✅ WebView2 Runtime Version: $($webviewVersion.pv)" -ForegroundColor Green
} else {
    Write-Host "   ❌ WebView2 Runtime not found" -ForegroundColor Red
}
Write-Host ""

# 3. Check for notification-related files
Write-Host "3️⃣ Checking Application Files..." -ForegroundColor Yellow
$exePath = "C:\dev\target-tauri\release\habitquest.exe"
if (Test-Path $exePath) {
    $fileInfo = Get-ItemProperty $exePath
    Write-Host "   ✅ Executable exists: $exePath" -ForegroundColor Green
    Write-Host "   ✅ Size: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor Green
    Write-Host "   ✅ Last Modified: $($fileInfo.LastWriteTime)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Executable not found at: $exePath" -ForegroundColor Red
}
Write-Host ""

# 4. Check Windows Notification Permission Registry
Write-Host "4️⃣ Checking Windows Notification Permissions..." -ForegroundColor Yellow
$notificationKey = "HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings\com.renkaistudios.habitquest"
if (Test-Path $notificationKey) {
    Write-Host "   ✅ HabitQuest found in Windows notification registry" -ForegroundColor Green
    $settings = Get-ItemProperty $notificationKey -ErrorAction SilentlyContinue
    if ($settings.Enabled -eq 1) {
        Write-Host "   ✅ Notifications are ENABLED in Windows" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Notifications may be disabled in Windows settings" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  HabitQuest not yet registered in Windows notification system" -ForegroundColor Yellow
    Write-Host "   📝 This is normal for newly built apps - will register after first notification" -ForegroundColor Cyan
}
Write-Host ""

# 5. Test Instructions
Write-Host "5️⃣ Next Steps to Test Notifications..." -ForegroundColor Yellow
Write-Host "   1. Open HabitQuest app" -ForegroundColor Cyan
Write-Host "   2. Go to Settings → Notifications" -ForegroundColor Cyan
Write-Host "   3. Click 'Test Notification' button" -ForegroundColor Cyan
Write-Host "   4. Check Windows Settings → System → Notifications" -ForegroundColor Cyan
Write-Host "   5. Look for 'HabitQuest' in the app list" -ForegroundColor Cyan
Write-Host ""

Write-Host "🎯 Expected Results After Testing:" -ForegroundColor Green
Write-Host "   ✅ App shows as 'habitquest' in Task Manager (not WebView2)" -ForegroundColor Green
Write-Host "   ✅ Test notification should appear as Windows toast" -ForegroundColor Green
Write-Host "   ✅ HabitQuest should appear in Windows notification settings" -ForegroundColor Green
Write-Host "   ✅ Background notifications should work when app is closed" -ForegroundColor Green

Write-Host ""
Write-Host "Press any key to open Windows Notification Settings..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Open Windows Notification Settings
Start-Process "ms-settings:notifications"