# HabitQuest Complete Cache Cleanup Script
# This script removes ALL cached data for a fresh start

Write-Host "🧹 HabitQuest Complete Cache Cleanup" -ForegroundColor Red
Write-Host "=====================================" -ForegroundColor Red
Write-Host ""
Write-Host "⚠️  WARNING: This will remove ALL cached data!" -ForegroundColor Yellow
Write-Host "Press any key to continue or Ctrl+C to cancel..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "🗑️  Starting cleanup process..." -ForegroundColor Cyan

# Set the project directory
$ProjectDir = "C:\Users\joren\Desktop\projects\HabitQuest\habitquest-web"

# Change to project directory
Set-Location $ProjectDir

Write-Host "📁 Cleaning project directory..." -ForegroundColor Yellow

# 1. Remove all build artifacts
Write-Host "  🗑️  Removing dist folder..." -ForegroundColor Gray
Remove-Item -Recurse -Force "dist" -ErrorAction SilentlyContinue

Write-Host "  🗑️  Removing src-tauri\target folder..." -ForegroundColor Gray
Remove-Item -Recurse -Force "src-tauri\target" -ErrorAction SilentlyContinue

Write-Host "  🗑️  Removing node_modules folder..." -ForegroundColor Gray
Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue

Write-Host "  🗑️  Removing package-lock.json..." -ForegroundColor Gray
Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue

# 2. Clear Vite cache
Write-Host "  🗑️  Clearing Vite cache..." -ForegroundColor Gray
Remove-Item -Recurse -Force "node_modules\.vite" -ErrorAction SilentlyContinue

# 3. Clear npm cache
Write-Host "📦 Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# 4. Clear Rust/Cargo cache
Write-Host "🦀 Clearing Rust/Cargo cache..." -ForegroundColor Yellow
if (Get-Command cargo -ErrorAction SilentlyContinue) {
    cargo clean
    Write-Host "  ✅ Cargo cache cleared" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Cargo not found, skipping..." -ForegroundColor Yellow
}

# 5. Clear system-level caches
Write-Host "💻 Clearing system-level caches..." -ForegroundColor Yellow

# Clear Windows temp files related to the app
$TempPaths = @(
    "$env:TEMP\HabitQuest*",
    "$env:TEMP\tauri*",
    "$env:TEMP\vite*",
    "$env:LOCALAPPDATA\Temp\HabitQuest*"
)

foreach ($path in $TempPaths) {
    Get-ChildItem $path -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}

# Clear any potential app data
$AppDataPaths = @(
    "$env:APPDATA\HabitQuest*",
    "$env:LOCALAPPDATA\HabitQuest*"
)

foreach ($path in $AppDataPaths) {
    Get-ChildItem $path -ErrorAction SilentlyContinue | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}

# 6. Clear any existing package directory
Write-Host "📁 Clearing existing package directory..." -ForegroundColor Yellow
$PackageDir = "HabitQuest-v3.2.0.1-RenKaiStudios-Windows-x64"
if (Test-Path $PackageDir) {
    Remove-Item -Recurse -Force $PackageDir -ErrorAction SilentlyContinue
    Write-Host "  ✅ Package directory cleared" -ForegroundColor Green
}

# 7. Clear any old executables
Write-Host "🗑️  Removing old executables..." -ForegroundColor Yellow
Remove-Item -Force "HabitQuest*.exe" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Cache cleanup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "🔄 Next steps for fresh installation:" -ForegroundColor Cyan
Write-Host "1. Run: npm install" -ForegroundColor White
Write-Host "2. Run: npm run build" -ForegroundColor White
Write-Host "3. Run: npm run tauri:build" -ForegroundColor White
Write-Host "4. Run: .\build-package.bat" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready for fresh build!" -ForegroundColor Green


