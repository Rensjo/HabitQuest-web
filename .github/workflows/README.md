# HabitQuest Build Workflows

This directory contains platform-specific GitHub Actions workflows for building and packaging HabitQuest.

## Workflows

### 1. Linux AppImage Build (`linux-build.yml`)
**Trigger**: Pushes to main/develop, pull requests, manual dispatch
**Purpose**: Build Linux packages (AppImage, DEB, RPM)

**Artifacts Created:**
- `HabitQuest-linux-x64.zip` - Complete Linux package (AppImage + DEB + RPM)

### 2. macOS DMG Build (`macos-build.yml`)
**Trigger**: Pushes to main/develop, pull requests, manual dispatch
**Purpose**: Build macOS packages (DMG, App bundles) for Intel and Apple Silicon

**Artifacts Created:**
- `HabitQuest-macos-arm64.zip` - Complete macOS package for Apple Silicon (DMG + App bundle)
- `HabitQuest-macos-x64.zip` - Complete macOS package for Intel (DMG + App bundle)

### 3. Windows MSI/NSIS Build (`windows-build.yml`)
**Trigger**: Pushes to main/develop, pull requests, manual dispatch  
**Purpose**: Build Windows installers (MSI, NSIS) and portable executable

**Artifacts Created:**
- `HabitQuest-windows-x64.zip` - Complete Windows package (MSI + NSIS + portable executable)

## Usage

### Running Builds

**Automatic Triggers:**
- Pushes to `main` or `develop` branches trigger all workflows
- Pull requests to `main` trigger all workflows

**Manual Triggers:**
1. Go to GitHub Actions tab
2. Select the desired workflow:
   - "Linux AppImage Build" for Linux packages
   - "macOS DMG Build" for macOS packages  
   - "Windows MSI/NSIS Build" for Windows installers
3. Click "Run workflow" → Choose branch → Run

### Downloading Packages

After a successful build:
1. Go to the specific Actions run page
2. Scroll to "Artifacts" section at the bottom
3. Download the zip package for your platform
4. Extract and install/run the appropriate file

### Platform Installation

**Windows:**
- Extract `HabitQuest-windows-x64.zip` 
- Choose your preferred option:
  - Run the `.msi` file (recommended installer)
  - Run the `.exe` setup file (alternative installer)
  - Run `habitquest.exe` directly (portable, no installation required)

**macOS:**
- Extract `HabitQuest-macos-arm64.zip` (Apple Silicon) or `HabitQuest-macos-x64.zip` (Intel)
- Choose your preferred option:
  - Open the `.dmg` file → Drag HabitQuest to Applications folder
  - Use the `.app` bundle directly (drag to Applications or run from anywhere)

**Linux:**
- Extract `HabitQuest-linux-x64.zip`
- Choose your preferred option:
  - Run the `.AppImage` file directly (portable, no installation: `chmod +x *.AppImage && ./HabitQuest.AppImage`)
  - Install the `.deb` package: `sudo dpkg -i *.deb`
  - Install the `.rpm` package: `sudo rpm -i *.rpm`

## Build Targets

- **Windows**: x86_64-pc-windows-msvc (64-bit)
- **macOS**: aarch64-apple-darwin (Apple Silicon) + x86_64-apple-darwin (Intel) 
- **Linux**: x86_64-unknown-linux-gnu (64-bit)

## Dependencies

The workflow automatically installs:
- Node.js 20
- Rust toolchain with appropriate targets
- Platform-specific system dependencies
- Tauri CLI via tauri-action