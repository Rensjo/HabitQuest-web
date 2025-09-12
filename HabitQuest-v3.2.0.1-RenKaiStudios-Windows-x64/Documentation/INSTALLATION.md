# HabitQuest v3.2.0.1 - Installation Guide

## 📋 **Installation Methods**

### **Method 1: Portable Installation (Recommended)**

**Advantages:**
- No installation required
- Completely portable
- No registry modifications
- Easy to uninstall (just delete folder)

**Steps:**
1. Download the entire `HabitQuest-v3.2.0.1-RenKaiStudios-Windows-x64` folder
2. Extract to your desired location (e.g., `C:\Programs\HabitQuest\`)
3. Run `HabitQuest.exe` or `Launch-HabitQuest.bat`
4. The app will create necessary data folders automatically

### **Method 2: NSIS Installer**

**Advantages:**
- Professional installation experience
- Creates Start Menu shortcuts
- Creates Desktop shortcut
- Proper uninstaller

**Steps:**
1. Run `Installers/AcademicQuest_3.2.0.1_x64-setup.exe`
2. Follow the installation wizard
3. Choose installation directory
4. Complete installation
5. Launch from Start Menu or Desktop shortcut

### **Method 3: MSI Installer**

**Advantages:**
- Windows Installer package
- Enterprise-friendly
- Group Policy compatible
- Silent installation support

**Steps:**
1. Run `Installers/AcademicQuest_3.2.0.1_x64_en-US.msi`
2. Follow the installation wizard
3. Complete installation
4. Launch from Start Menu

## 🔧 **System Requirements**

### **Minimum Requirements:**
- **OS**: Windows 10 (64-bit) or Windows 11
- **RAM**: 4GB
- **Storage**: 100MB free space
- **Display**: 1024x768 resolution

### **Recommended Requirements:**
- **OS**: Windows 11 (64-bit)
- **RAM**: 8GB or more
- **Storage**: 500MB free space
- **Display**: 1920x1080 resolution or higher

## 📁 **File Structure**

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
    ├── INSTALLATION.md              (This file)
    └── STORAGE_IMPROVEMENTS.md      (Storage Features Guide)
```

## 🚀 **First Launch**

1. **Run the application** using any of the methods above
2. **The app will automatically:**
   - Create data storage folders
   - Set up default configuration
   - Initialize the database
3. **You can start using** the app immediately

## 🔄 **Updating**

### **Portable Version:**
1. Download the new version
2. Replace the old folder
3. Your data will be preserved

### **Installed Version:**
1. Run the new installer
2. It will automatically update the existing installation
3. Your data will be preserved

## 🗑️ **Uninstalling**

### **Portable Version:**
1. Simply delete the entire folder
2. No traces left on your system

### **Installed Version:**
1. Use Windows "Add or Remove Programs"
2. Or run the uninstaller from Start Menu
3. Your data will be preserved in AppData

## ❓ **Troubleshooting**

### **App Won't Start:**
- Try running as administrator
- Check if Windows Defender is blocking the app
- Ensure all files are in the same directory

### **Missing Files:**
- Re-download the complete package
- Ensure all files are extracted properly

### **Performance Issues:**
- Close other applications
- Check available RAM
- Restart your computer

### **Data Issues:**
- Check if the app has write permissions
- Ensure sufficient disk space
- Try running as administrator

## 📞 **Support**

- **Version**: 3.2.0.1
- **Company**: RenKaiStudios
- **Platform**: Windows x64
- **Build Date**: $(Get-Date -Format "yyyy-MM-dd")

---

**For more help, check the main README.md file or contact support.**

