# HabitQuest Build and Package Script
# This script builds the Tauri app and creates the complete package folder

Write-Host "🚀 HabitQuest v3.2.0.1 - Build and Package Script" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green
Write-Host ""

# Set variables
$PackageDir = "HabitQuest-v3.2.0.1-RenKaiStudios-Windows-x64"
$SourceIconsDir = "src-tauri\icons"
$TargetIconsDir = "$PackageDir\Icons"
$ExecutablesDir = "$PackageDir\Executables"
$InstallersDir = "$PackageDir\Installers"

Write-Host "📁 Creating package directory structure..." -ForegroundColor Yellow

# Create directories if they don't exist
New-Item -ItemType Directory -Force -Path $TargetIconsDir | Out-Null
New-Item -ItemType Directory -Force -Path $ExecutablesDir | Out-Null
New-Item -ItemType Directory -Force -Path $InstallersDir | Out-Null

Write-Host "✅ Directory structure created" -ForegroundColor Green

Write-Host "🔨 Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend build completed" -ForegroundColor Green

Write-Host "🔨 Building Tauri app..." -ForegroundColor Yellow
npm run tauri:build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Tauri build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Tauri build completed" -ForegroundColor Green

Write-Host "📋 Copying files to package directory..." -ForegroundColor Yellow

# Copy main executable
$TauriExe = "src-tauri\target\release\HabitQuest.exe"
if (Test-Path $TauriExe) {
    Copy-Item $TauriExe $PackageDir\HabitQuest.exe -Force
    Copy-Item $TauriExe $ExecutablesDir\HabitQuest.exe -Force
    Write-Host "✅ Main executable copied" -ForegroundColor Green
} else {
    Write-Host "❌ Tauri executable not found at $TauriExe" -ForegroundColor Red
}

# Copy installers
$MsiFile = "src-tauri\target\release\bundle\msi\HabitQuest_3.2.0_x64_en-US.msi"
$NsisFile = "src-tauri\target\release\bundle\nsis\HabitQuest_3.2.0_x64-setup.exe"

if (Test-Path $MsiFile) {
    Copy-Item $MsiFile $InstallersDir\HabitQuest_3.2.0.1_x64_en-US.msi -Force
    Write-Host "✅ MSI installer copied" -ForegroundColor Green
} else {
    Write-Host "⚠️  MSI installer not found at $MsiFile" -ForegroundColor Yellow
}

if (Test-Path $NsisFile) {
    Copy-Item $NsisFile $InstallersDir\HabitQuest_3.2.0.1_x64-setup.exe -Force
    Write-Host "✅ NSIS installer copied" -ForegroundColor Green
} else {
    Write-Host "⚠️  NSIS installer not found at $NsisFile" -ForegroundColor Yellow
}

# Copy icon files
$IconFiles = @(
    "habitquest-icon.ico",
    "habitquest-icon.png",
    "icon.ico",
    "icon.png"
)

foreach ($icon in $IconFiles) {
    $sourcePath = "$SourceIconsDir\$icon"
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath $TargetIconsDir\ -Force
        Write-Host "✅ Copied $icon" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Icon not found: $icon" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎉 Package creation completed!" -ForegroundColor Green
Write-Host "📁 Package location: $PackageDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Package contents:" -ForegroundColor Yellow
Get-ChildItem $PackageDir -Recurse | Format-Table Name, Length, LastWriteTime -AutoSize

Write-Host ""
Write-Host "🚀 Ready for distribution!" -ForegroundColor Green
Write-Host "You can now zip the $PackageDir folder for distribution." -ForegroundColor Cyan

