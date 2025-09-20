# HabitQuest Build Workflows

This directory contains platform-specific GitHub Actions workflows for building and packaging HabitQuest.

## Workflows

### 1. Linux AppImage Build (`linux-build.yml`)
**Trigger**: Pushes to main/develop, pull requests, manual dispatch
**Purpose**: Build Linux packages (AppImage, DEB, RPM)

**Artifacts Created:**
- `HabitQuest-linux-x64.zip` - AppImage portable application
- `HabitQuest-linux-x64-deb.zip` - DEB package for Debian/Ubuntu
- `HabitQuest-linux-x64-rpm.zip` - RPM package (if available)

### 2. macOS DMG Build (`macos-build.yml`)
**Trigger**: Pushes to main/develop, pull requests, manual dispatch
**Purpose**: Build macOS packages (DMG, App bundles) for Intel and Apple Silicon

**Artifacts Created:**
- `HabitQuest-macos-arm64.zip` - DMG for Apple Silicon Macs
- `HabitQuest-macos-arm64-app.zip` - App bundle for Apple Silicon
- `HabitQuest-macos-x64.zip` - DMG for Intel Macs
- `HabitQuest-macos-x64-app.zip` - App bundle for Intel Macs

### 3. Windows MSI/NSIS Build (`windows-build.yml`)
**Trigger**: Pushes to main/develop, pull requests, manual dispatch  
**Purpose**: Build Windows installers (MSI, NSIS)

**Artifacts Created:**
- `HabitQuest-windows-x64-msi.zip` - MSI installer package
- `HabitQuest-windows-x64-setup.zip` - NSIS setup executable

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
- Extract `HabitQuest-windows-x64-msi.zip` → Run the `.msi` file (recommended)
- Or extract `HabitQuest-windows-x64-setup.zip` → Run the `.exe` setup file

**macOS:**
- Extract `HabitQuest-macos-arm64.zip` (Apple Silicon) or `HabitQuest-macos-x64.zip` (Intel)
- Open the `.dmg` file → Drag HabitQuest to Applications folder
- Or extract the `-app.zip` version for direct app bundle

**Linux:**
- Extract `HabitQuest-linux-x64.zip` → Run the `.AppImage` file (portable, no installation)
- Or extract `HabitQuest-linux-x64-deb.zip` → Install with `sudo dpkg -i *.deb`
- Or extract `HabitQuest-linux-x64-rpm.zip` → Install with `sudo rpm -i *.rpm`

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