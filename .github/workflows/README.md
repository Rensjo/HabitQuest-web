# HabitQuest Build Workflows

This directory contains GitHub Actions workflows for building and releasing HabitQuest across multiple platforms.

## Workflows

### 1. CI - Test Build (`ci.yml`)
**Trigger**: Pull requests and pushes to main branch
**Purpose**: Quick validation of code changes

- Runs on: Windows, macOS (Intel & ARM), Linux
- Tests frontend build
- Runs linting and type checking
- Performs test Tauri builds (no artifacts)

### 2. Release Build (`release.yml`)
**Trigger**: Manual dispatch, tags starting with `v`, or published releases
**Purpose**: Create production-ready artifacts for distribution

#### Artifacts Created:

**Windows:**
- MSI installers (x64 & x86)
- NSIS installers (x64 & x86)

**macOS:**
- DMG disk images (Intel & ARM64)
- App bundles (Intel & ARM64)

**Linux:**
- AppImage (portable, x64)
- DEB packages (x64)

### 3. macOS DMG (`build-macos.yml`)
**Trigger**: Manual dispatch and pushes to main
**Purpose**: Legacy macOS-specific build (can be removed if not needed)

## Usage

### Running a Release Build

1. **Via Git Tag:**
   ```bash
   git tag v3.2.1
   git push origin v3.2.1
   ```

2. **Via Manual Dispatch:**
   - Go to GitHub Actions tab
   - Select "Release Build" workflow
   - Click "Run workflow"
   - Enter version (e.g., `v3.2.1`)

### Required Secrets

For release builds with code signing, add these to repository secrets:

```
TAURI_PRIVATE_KEY     # Private key for Tauri updater (optional)
TAURI_KEY_PASSWORD    # Password for the private key (optional)
```

## Build Targets

### Windows
- `x86_64-pc-windows-msvc` (64-bit)
- `i686-pc-windows-msvc` (32-bit)

### macOS  
- `aarch64-apple-darwin` (Apple Silicon)
- `x86_64-apple-darwin` (Intel)

### Linux
- `x86_64-unknown-linux-gnu` (64-bit)

## Artifacts

All successful builds create downloadable artifacts that can be:
- Downloaded from the Actions run page
- Automatically uploaded to GitHub Releases (for release builds)
- Used for testing and distribution

## Troubleshooting

### Common Issues:

1. **Build fails on Linux**: Ensure system dependencies are installed
2. **macOS build fails**: Check Xcode command line tools
3. **Windows build fails**: Verify Visual Studio Build Tools
4. **Missing artifacts**: Check if the workflow completed successfully

### Dependencies

The workflows automatically install:
- Node.js 20
- Rust toolchain
- Platform-specific build tools
- Tauri CLI

## File Structure

```
.github/workflows/
├── ci.yml              # Continuous integration
├── release.yml         # Release builds
├── build-macos.yml     # Legacy macOS build
└── README.md          # This file
```