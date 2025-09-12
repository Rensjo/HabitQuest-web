# 🍎 Building HabitQuest for macOS

This guide explains how to build HabitQuest for macOS using GitHub Actions without requiring Apple Developer notarization.

## 🚀 **Automated Build Process**

### **GitHub Actions Workflow**

The macOS build is automated using GitHub Actions. The workflow:

1. **Triggers on**:
   - Push to `main` branch
   - Pull requests to `main` branch
   - Manual workflow dispatch

2. **Builds for**:
   - Intel x64 (`x86_64-apple-darwin`)
   - Apple Silicon (`aarch64-apple-darwin`)
   - Universal binary (both architectures)

3. **Creates**:
   - DMG installer
   - Individual architecture builds
   - Documentation package

### **Build Artifacts**

After a successful build, you'll find:

- `HabitQuest-v3.2.0.1-RenKaiStudios-macOS-universal.dmg` - Universal DMG installer
- `HabitQuest-Intel.app` - Intel-only build
- `HabitQuest-AppleSilicon.app` - Apple Silicon-only build
- `HabitQuest.app` - Universal binary (recommended)

## 📋 **System Requirements**

### **Build Environment**
- macOS 12+ (GitHub Actions runner)
- Node.js 18+
- Rust stable toolchain
- Tauri CLI

### **Target macOS Versions**
- **Minimum**: macOS 10.15 (Catalina)
- **Recommended**: macOS 11+ (Big Sur or later)

## 🔧 **Manual Build Process**

If you want to build locally on macOS:

### **Prerequisites**
```bash
# Install Node.js 18+
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Tauri CLI
npm install -g @tauri-apps/cli@latest
```

### **Build Commands**
```bash
# Install dependencies
npm ci

# Build frontend
npm run build

# Build for Intel Macs
npm run tauri:build:macos-intel

# Build for Apple Silicon Macs
npm run tauri:build:macos-silicon

# Build for both architectures
npm run tauri:build:macos
```

## 📦 **Distribution Without Notarization**

### **What This Means**
- Apps will show "unidentified developer" warning
- Users need to right-click and select "Open" on first launch
- No Gatekeeper restrictions (users can bypass warnings)
- Perfect for development and testing

### **User Instructions**
1. Download the DMG file
2. Mount the DMG by double-clicking
3. Drag `HabitQuest.app` to Applications folder
4. Right-click the app and select "Open" (first time only)
5. Go to System Preferences > Security & Privacy > General
6. Click "Open Anyway" if prompted

## 🔐 **Future: Adding Notarization**

When you're ready to add Apple Developer notarization:

### **Required**
1. Apple Developer Account ($99/year)
2. Developer ID Application certificate
3. App-specific password

### **Workflow Changes**
1. Add secrets to GitHub repository:
   - `TAURI_PRIVATE_KEY` - Your private key
   - `TAURI_KEY_PASSWORD` - Key password
   - `APPLE_ID` - Your Apple ID
   - `APPLE_PASSWORD` - App-specific password

2. Update workflow to include notarization steps

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Build Fails on GitHub Actions**
- Check if all dependencies are properly installed
- Verify Tauri configuration is correct
- Check for any TypeScript or build errors

#### **App Won't Open on macOS**
- Right-click and select "Open"
- Check System Preferences > Security & Privacy
- Ensure macOS version is 10.15 or later

#### **Universal Binary Issues**
- Verify both Intel and Apple Silicon builds completed
- Check that `lipo` command executed successfully
- Test on both architecture types

### **Debug Commands**
```bash
# Check app architecture
file HabitQuest.app/Contents/MacOS/HabitQuest

# Verify universal binary
lipo -info HabitQuest.app/Contents/MacOS/HabitQuest

# Check app bundle
codesign -dv HabitQuest.app
```

## 📁 **File Structure**

```
HabitQuest-v3.2.0.1-RenKaiStudios-macOS-universal/
├── HabitQuest-v3.2.0.1-RenKaiStudios-macOS-universal.dmg
├── HabitQuest.app (Universal)
├── HabitQuest-Intel.app
├── HabitQuest-AppleSilicon.app
├── README-macOS.md
└── README.md
```

## 🎯 **Next Steps**

1. **Test the build** on both Intel and Apple Silicon Macs
2. **Create release** with proper versioning
3. **Gather user feedback** on macOS experience
4. **Consider notarization** for production releases
5. **Add code signing** for better security

---

**Ready to build?** Push your changes to the `main` branch and watch the GitHub Actions workflow create your macOS app! 🚀
