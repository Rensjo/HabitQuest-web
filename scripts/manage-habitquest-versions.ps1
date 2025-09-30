# HabitQuest Version Management Script
# Run this script as Administrator for best results

Write-Host "🎯 HabitQuest Version Management Script" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Function to check running processes
function Check-HabitQuestProcesses {
    Write-Host "`n🔍 Checking for running HabitQuest processes..." -ForegroundColor Yellow
    $processes = Get-Process -Name "*habitquest*" -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "✅ Found running HabitQuest processes:" -ForegroundColor Green
        $processes | Select-Object ProcessName, Id, MainWindowTitle, Path | Format-Table -AutoSize
        
        $choice = Read-Host "Do you want to stop these processes? (y/n)"
        if ($choice -eq 'y' -or $choice -eq 'Y') {
            $processes | Stop-Process -Force
            Write-Host "✅ Processes stopped." -ForegroundColor Green
        }
    } else {
        Write-Host "ℹ️  No running HabitQuest processes found." -ForegroundColor Blue
    }
}

# Function to check installed versions
function Check-InstalledVersions {
    Write-Host "`n🔍 Checking for installed HabitQuest versions..." -ForegroundColor Yellow
    
    # Check via Windows Registry (faster)
    $uninstallPaths = @(
        "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*",
        "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
    )
    
    $habitquestApps = @()
    foreach ($path in $uninstallPaths) {
        $apps = Get-ItemProperty $path -ErrorAction SilentlyContinue | 
                Where-Object { $_.DisplayName -like "*HabitQuest*" -or $_.DisplayName -like "*habitquest*" }
        $habitquestApps += $apps
    }
    
    if ($habitquestApps) {
        Write-Host "✅ Found installed HabitQuest versions:" -ForegroundColor Green
        foreach ($app in $habitquestApps) {
            Write-Host "  📦 Name: $($app.DisplayName)" -ForegroundColor White
            Write-Host "     Version: $($app.DisplayVersion)" -ForegroundColor Gray
            Write-Host "     Publisher: $($app.Publisher)" -ForegroundColor Gray
            Write-Host "     Install Date: $($app.InstallDate)" -ForegroundColor Gray
            Write-Host "     Uninstall: $($app.UninstallString)" -ForegroundColor Gray
            Write-Host ""
        }
        return $habitquestApps
    } else {
        Write-Host "ℹ️  No installed HabitQuest versions found in registry." -ForegroundColor Blue
        return @()
    }
}

# Function to check installation directories
function Check-InstallDirectories {
    Write-Host "`n🔍 Checking common installation directories..." -ForegroundColor Yellow
    
    $searchPaths = @(
        "C:\Program Files",
        "C:\Program Files (x86)",
        "$env:LOCALAPPDATA\Programs",
        "$env:APPDATA"
    )
    
    $foundDirs = @()
    foreach ($path in $searchPaths) {
        if (Test-Path $path) {
            $dirs = Get-ChildItem -Path $path -Filter "*HabitQuest*" -Directory -ErrorAction SilentlyContinue
            if ($dirs) {
                $foundDirs += $dirs
                foreach ($dir in $dirs) {
                    Write-Host "  📁 Found: $($dir.FullName)" -ForegroundColor White
                    $exeFiles = Get-ChildItem -Path $dir.FullName -Filter "*.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 3
                    foreach ($exe in $exeFiles) {
                        Write-Host "     🔧 Executable: $($exe.Name)" -ForegroundColor Gray
                    }
                }
            }
        }
    }
    
    if (-not $foundDirs) {
        Write-Host "ℹ️  No HabitQuest directories found." -ForegroundColor Blue
    }
    
    return $foundDirs
}

# Function to uninstall old versions
function Uninstall-OldVersions {
    param($installedApps)
    
    if ($installedApps.Count -eq 0) {
        Write-Host "ℹ️  No installed versions to uninstall." -ForegroundColor Blue
        return
    }
    
    Write-Host "`n🗑️  Uninstalling old versions..." -ForegroundColor Yellow
    foreach ($app in $installedApps) {
        Write-Host "Uninstalling: $($app.DisplayName)" -ForegroundColor White
        
        if ($app.UninstallString) {
            try {
                if ($app.UninstallString -like "*msiexec*") {
                    # MSI uninstall
                    $productCode = ($app.UninstallString -split "/I" -split "/X")[1].Trim()
                    Write-Host "  Running: msiexec /x $productCode /quiet" -ForegroundColor Gray
                    Start-Process "msiexec" -ArgumentList "/x", $productCode, "/quiet" -Wait
                } else {
                    # Regular uninstaller
                    Write-Host "  Running: $($app.UninstallString)" -ForegroundColor Gray
                    Start-Process -FilePath $app.UninstallString -Wait
                }
                Write-Host "  ✅ Uninstalled successfully." -ForegroundColor Green
            } catch {
                Write-Host "  ❌ Error uninstalling: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
}

# Function to check GitHub release
function Check-GitHubRelease {
    Write-Host "`n🌐 Checking GitHub for latest release..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "https://api.github.com/repos/Rensjo/HabitQuest-web/releases/latest"
        Write-Host "✅ Latest release: $($response.tag_name)" -ForegroundColor Green
        Write-Host "   Published: $($response.published_at)" -ForegroundColor Gray
        Write-Host "   Download URL: $($response.html_url)" -ForegroundColor Cyan
        
        $msiAsset = $response.assets | Where-Object { $_.name -like "*Windows-x64.msi" }
        if ($msiAsset) {
            Write-Host "   MSI Download: $($msiAsset.browser_download_url)" -ForegroundColor Cyan
        }
        
        return $response
    } catch {
        Write-Host "❌ Could not fetch GitHub release info: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# Main execution
Write-Host "`n🚀 Starting HabitQuest version check..." -ForegroundColor Green

Check-HabitQuestProcesses
$installedApps = Check-InstalledVersions
Check-InstallDirectories
Check-GitHubRelease

if ($installedApps.Count -gt 0) {
    Write-Host "`n❓ Do you want to uninstall the old version(s)? (y/n): " -ForegroundColor Yellow -NoNewline
    $choice = Read-Host
    if ($choice -eq 'y' -or $choice -eq 'Y') {
        Uninstall-OldVersions -installedApps $installedApps
    }
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. 🌐 Visit: https://github.com/Rensjo/HabitQuest-web/releases" -ForegroundColor White
Write-Host "2. 📦 Download: HabitQuest-v4.2.0-Windows-x64.msi" -ForegroundColor White
Write-Host "3. 🔧 Install the new version" -ForegroundColor White
Write-Host "4. ✅ Test the enhanced notification system" -ForegroundColor White

Write-Host "`n🎉 Script completed!" -ForegroundColor Green