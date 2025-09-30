# 🔄 HabitQuest Version Replacement Guide

## 🎯 **Replace Old Version with Enhanced v4.2.0**

### **Step 1: Uninstall Old Version**

#### **Option A: Via Windows Settings (Recommended)**
1. Press `Win + I` → **Apps**
2. Search for "HabitQuest" or "habitquest"
3. Click the old version and select **Uninstall**
4. Follow the uninstall wizard

#### **Option B: Via Control Panel**
1. Press `Win + R` → type `appwiz.cpl` → Enter
2. Find "HabitQuest" in the list
3. Right-click → **Uninstall**

#### **Option C: PowerShell (if needed)**
```powershell
# Check for installed HabitQuest versions
Get-WmiObject -Class Win32_Product | Where-Object { $_.Name -like "*HabitQuest*" } | Select-Object Name, Version, IdentifyingNumber

# If found, uninstall using the IdentifyingNumber (GUID)
# Replace {GUID} with the actual IdentifyingNumber from above
# msiexec /x {GUID} /quiet
```

---

### **Step 2: Download New Version from GitHub**

#### **After the GitHub Actions build completes:**

1. **Go to**: https://github.com/Rensjo/HabitQuest-web/releases
2. **Find**: `v4.2.0` release (will be created automatically)
3. **Download** one of these options:

   - **🎯 Recommended**: `HabitQuest-v4.2.0-Windows-x64.msi`
     - Full installer with automatic updates
     - Integrates with Windows properly
     - Includes uninstaller

   - **Alternative**: `HabitQuest-v4.2.0-Windows-x64-setup.exe`
     - NSIS installer with different options
     - Same functionality as MSI

   - **Portable**: `HabitQuest-v4.2.0-Windows-x64-portable.zip`
     - Extract and run directly
     - No installation required
     - Good for testing

---

### **Step 3: Install New Version**

#### **For MSI installer:**
1. **Double-click** `HabitQuest-v4.2.0-Windows-x64.msi`
2. **Follow** installation wizard
3. **Choose** installation directory (or keep default)
4. **Finish** installation

#### **For NSIS setup:**
1. **Right-click** `HabitQuest-v4.2.0-Windows-x64-setup.exe`
2. **Run as Administrator** (if prompted)
3. **Follow** setup wizard
4. **Complete** installation

#### **For Portable:**
1. **Extract** `HabitQuest-v4.2.0-Windows-x64-portable.zip`
2. **Run** `habitquest.exe` directly
3. **No installation** required

---

### **Step 4: Verify New Version**

#### **After installation:**
1. **Launch HabitQuest**
2. **Check version**: Should show `4.2.0` in About/Settings
3. **Test notifications**:
   - Go to **Settings** → **Notifications**
   - Click **"Initialize & Test"** button
   - Should see Windows toast notification
4. **Check Windows Settings**:
   - Press `Win + I` → **System** → **Notifications**
   - Look for **"HabitQuest"** in app list (not "WebView2 Manager")

#### **Test Enhanced Features:**
- ✅ **System Tray**: Close window → app should minimize to tray
- ✅ **Auto-start**: Restart Windows → app should start automatically
- ✅ **Background Notifications**: Enable in settings → receive reminders every 5 minutes during 8 AM - 10 PM
- ✅ **App Identity**: Task Manager should show "habitquest" process

---

### **Step 5: Clean Up (Optional)**

#### **Remove old files:**
```powershell
# Check for any remaining old HabitQuest directories
Get-ChildItem -Path "C:\Program Files" -Filter "*HabitQuest*" -Directory -ErrorAction SilentlyContinue
Get-ChildItem -Path "C:\Program Files (x86)" -Filter "*HabitQuest*" -Directory -ErrorAction SilentlyContinue

# Check AppData for old configurations (backup first if needed)
Get-ChildItem -Path "$env:APPDATA" -Filter "*HabitQuest*" -Directory -ErrorAction SilentlyContinue
Get-ChildItem -Path "$env:LOCALAPPDATA" -Filter "*HabitQuest*" -Directory -ErrorAction SilentlyContinue
```

---

## 🚀 **What's New in v4.2.0**

### **Enhanced Notification System:**
- **Proper Windows Integration**: Shows as "HabitQuest" in notification settings
- **System Tray**: App continues running when window is closed
- **Auto-start**: Launches automatically on Windows startup
- **Smart Reminders**: Every 5 minutes during active hours (8 AM - 10 PM)
- **Background Service**: Persistent habit tracking even when app is hidden

### **Technical Improvements:**
- **Tauri v2.8.5**: Latest framework with enhanced security and performance
- **Enhanced API**: Better notification permission handling with fallback support
- **Improved UI**: New "Initialize & Test" button for easy notification setup
- **Better Error Handling**: Comprehensive fallback system for compatibility

---

## 🛟 **Troubleshooting**

### **If old version won't uninstall:**
```powershell
# Force remove via registry (use with caution)
# First backup the registry!
# Check HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall
# Look for HabitQuest entries and note the GUID for manual removal
```

### **If new version doesn't start:**
1. **Right-click** installer → **Run as Administrator**
2. **Check** Windows Defender hasn't quarantined it
3. **Ensure** old version is completely removed
4. **Restart** Windows after installation

### **If notifications don't work:**
1. **Click** "Initialize & Test" in notification settings
2. **Check** Windows Focus Assist settings
3. **Verify** app appears in Windows notification settings
4. **Restart** app if needed

---

## 📞 **Support**

If you encounter any issues:
1. **Check** the `ENHANCED_NOTIFICATION_SYSTEM.md` guide
2. **Review** Windows Event Viewer for error details
3. **Create** an issue on GitHub with details
4. **Include** version numbers and error messages

**The new v4.2.0 will be available once the GitHub Actions build completes!** 🎉