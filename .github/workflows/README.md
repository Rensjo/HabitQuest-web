# HabitQuest Build Workflows

This directory contains a streamlined GitHub Actions workflow for building and packaging HabitQuest across all platforms.

## Workflow

### Build Release Packages (`build-packages.yml`)
**Trigger**: Manual dispatch, pushes to main/develop, pull requests
**Purpose**: Create downloadable zip packages for all platforms

#### Platforms Built:
- **Windows x64**: MSI and NSIS installers packaged as zips
- **macOS ARM64**: DMG and app bundles for Apple Silicon Macs
- **macOS x64**: DMG and app bundles for Intel Macs  
- **Linux x64**: AppImage and DEB packages

#### Artifacts Created:
- `HabitQuest-windows-x64-msi.zip` - Windows MSI installer
- `HabitQuest-windows-x64-setup.zip` - Windows NSIS setup
- `HabitQuest-macos-arm64.zip` - macOS ARM64 DMG
- `HabitQuest-macos-arm64-app.zip` - macOS ARM64 app bundle
- `HabitQuest-macos-x64.zip` - macOS Intel DMG
- `HabitQuest-macos-x64-app.zip` - macOS Intel app bundle
- `HabitQuest-linux-x64.zip` - Linux AppImage
- `HabitQuest-linux-x64-deb.zip` - Linux DEB package

## Usage

### Running a Build

1. **Automatic**: Pushes to `main` or `develop` branch trigger builds
2. **Manual**: 
   - Go to GitHub Actions tab
   - Select "Build Release Packages" workflow  
   - Click "Run workflow"
   - Choose branch and run

### Downloading Packages

After a successful build:
1. Go to the Actions run page
2. Scroll to "Artifacts" section at the bottom
3. Download the zip package for your platform
4. Extract and install/run the appropriate file

### Platform Installation

**Windows:**
- Extract `HabitQuest-windows-x64-msi.zip` → Run the `.msi` file
- Or extract `HabitQuest-windows-x64-setup.zip` → Run the `.exe` file

**macOS:**
- Extract `HabitQuest-macos-arm64.zip` (Apple Silicon) or `HabitQuest-macos-x64.zip` (Intel)
- Open the `.dmg` file → Drag to Applications folder

**Linux:**
- Extract `HabitQuest-linux-x64.zip` → Run the `.AppImage` file (no installation needed)
- Or extract `HabitQuest-linux-x64-deb.zip` → Install with `sudo dpkg -i *.deb`

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