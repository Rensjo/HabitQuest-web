# HabitQuest v3.2.0.1 - Build and Package Guide

## 🚀 **Quick Start**

### **Option 1: Automated Build (Recommended)**
```bash
# Run the automated build script
.\build-package.bat
```

### **Option 2: Manual Build**
```bash
# 1. Build the frontend
npm run build

# 2. Build the Tauri app
npm run tauri:build

# 3. Copy files manually (see manual steps below)
```

## 📁 **Package Structure**

The build process creates this structure:

```
HabitQuest-v3.2.0.1-RenKaiStudios-Windows-x64/
├── HabitQuest.exe                    (Main Executable)
├── Launch-HabitQuest.bat            (Quick Launch Script)
├── README.md                        (Main Documentation)
├── Executables/
│   └── HabitQuest.exe               (Portable App)
├── Installers/
│   ├── HabitQuest_3.2.0.1_x64_en-US.msi      (MSI Installer)
│   └── HabitQuest_3.2.0.1_x64-setup.exe      (NSIS Setup)
├── Icons/
│   ├── HabitQuest-Icon.ico          (ICO Icon)
│   └── HabitQuest-Icon.png          (PNG Icon)
└── Documentation/
    ├── INSTALLATION.md              (Installation Guide)
    └── STORAGE_IMPROVEMENTS.md      (Storage Features Guide)
```

## 🔧 **Manual Build Steps**

If the automated script doesn't work, follow these steps:

### **1. Build Frontend**
```bash
npm run build
```

### **2. Build Tauri App**
```bash
npm run tauri:build
```

### **3. Copy Main Executable**
```bash
# Copy from Tauri target to package directory
copy "src-tauri\target\release\HabitQuest.exe" "HabitQuest-v3.2.0.1-RenKaiStudios-Windows-x64\HabitQuest.exe"
copy "src-tauri\target\release\HabitQuest.exe" "HabitQuest-v3.2.0.1-RenKaiStudios-Windows-x64\Executables\HabitQuest.exe"
```

### **4. Copy Installers**
```bash
# Copy MSI installer
copy "src-tauri\target\release\bundle\msi\HabitQuest_3.2.0_x64_en-US.msi" "HabitQuest-v3.2.0.1-RenKaiStudios-Windows-x64\Installers\HabitQuest_3.2.0.1_x64_en-US.msi"

# Copy NSIS installer
copy "src-tauri\target\release\bundle\nsis\HabitQuest_3.2.0_x64-setup.exe" "HabitQuest-v3.2.0.1-RenKaiStudios-Windows-x64\Installers\HabitQuest_3.2.0.1_x64-setup.exe"
```

### **5. Copy Icons**
```bash
# Copy icon files
copy "src-tauri\icons\habitquest-icon.ico" "HabitQuest-v3.2.0.1-RenKaiStudios-Windows-x64\Icons\HabitQuest-Icon.ico"
copy "src-tauri\icons\habitquest-icon.png" "HabitQuest-v3.2.0.1-RenKaiStudios-Windows-x64\Icons\HabitQuest-Icon.png"
```

## 📋 **Prerequisites**

### **Required Software**
- Node.js (v18 or higher)
- npm (v8 or higher)
- Rust (latest stable)
- Tauri CLI (`npm install -g @tauri-apps/cli`)

### **Required Files**
- All source code in `src/` directory
- Tauri configuration in `src-tauri/`
- Icon files in `src-tauri/icons/`

## ⚠️ **Troubleshooting**

### **Build Fails**
1. **Check Node.js version**: `node --version`
2. **Check npm version**: `npm --version`
3. **Check Rust installation**: `rustc --version`
4. **Check Tauri CLI**: `tauri --version`

### **Missing Files**
1. **Frontend not built**: Run `npm run build`
2. **Tauri not built**: Run `npm run tauri:build`
3. **Icons missing**: Check `src-tauri/icons/` directory

### **Permission Issues**
1. **Run as Administrator**: Right-click and "Run as administrator"
2. **Check antivirus**: Some antivirus software blocks executable creation
3. **Check file paths**: Ensure all paths are correct

## 🎯 **Final Steps**

### **After Building**
1. **Test the executable**: Run `HabitQuest.exe` to ensure it works
2. **Test installers**: Install using both MSI and NSIS installers
3. **Create ZIP**: Compress the entire package folder
4. **Test distribution**: Test the ZIP on a clean Windows machine

### **Distribution**
1. **Create ZIP file**: `HabitQuest-v3.2.0.1-RenKaiStudios-Windows-x64.zip`
2. **Upload to distribution platform**: GitHub Releases, website, etc.
3. **Update documentation**: Update version numbers and changelog

## 📞 **Support**

If you encounter issues:
1. Check the console output for error messages
2. Verify all prerequisites are installed
3. Try the manual build steps
4. Check file permissions and antivirus settings

---

**Happy building! 🚀**

