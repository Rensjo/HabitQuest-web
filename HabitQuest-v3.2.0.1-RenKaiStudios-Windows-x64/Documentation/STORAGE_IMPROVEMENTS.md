# HabitQuest v3.2.0.1 - Storage Features Guide

## 💾 **Data Storage & Management**

### **Local Storage System**
HabitQuest uses a robust local storage system that keeps your data secure and private on your device.

### **Data Location**
- **Windows**: `%APPDATA%\HabitQuest\`
- **Portable Mode**: `./data/` (in app directory)

### **What's Stored**
- ✅ **Habit Data**: All your habits, categories, and progress
- ✅ **User Settings**: Theme preferences, notifications, etc.
- ✅ **Achievements**: Unlocked badges and rewards
- ✅ **Statistics**: Progress charts and analytics
- ✅ **Custom Data**: User-defined categories and settings

## 🔄 **Data Management Features**

### **Export Data**
- **Format**: JSON (human-readable)
- **Location**: Downloads folder
- **Includes**: All habits, progress, settings, achievements
- **Use Case**: Backup, migration, sharing

### **Import Data**
- **Format**: JSON (from export)
- **Validation**: Automatic data integrity checks
- **Merge Options**: Replace all or merge with existing
- **Use Case**: Restore backup, migrate from another device

### **Reset Data**
- **Complete Reset**: Removes all data and settings
- **Selective Reset**: Reset specific categories
- **Confirmation**: Multiple confirmation prompts
- **Use Case**: Fresh start, troubleshooting

## 🛡️ **Data Security**

### **Privacy First**
- **Local Only**: No data sent to external servers
- **Encrypted Storage**: Sensitive data is encrypted
- **No Tracking**: No analytics or user tracking
- **Offline First**: Works without internet connection

### **Data Integrity**
- **Automatic Backups**: Daily automatic backups
- **Validation**: Data integrity checks on startup
- **Recovery**: Automatic recovery from corrupted data
- **Versioning**: Data format versioning for compatibility

## 📊 **Storage Optimization**

### **Efficient Storage**
- **Compressed Data**: Data is compressed to save space
- **Cleanup**: Automatic cleanup of old temporary files
- **Optimization**: Regular database optimization
- **Size**: Typically under 10MB for years of data

### **Performance**
- **Fast Loading**: Optimized for quick startup
- **Memory Efficient**: Minimal RAM usage
- **Background Sync**: Non-blocking data operations
- **Caching**: Smart caching for better performance

## 🔧 **Advanced Features**

### **Data Migration**
- **Cross-Platform**: Move data between Windows versions
- **Version Upgrades**: Automatic data format upgrades
- **Backup Restore**: Restore from any backup point
- **Selective Import**: Import specific data categories

### **Backup Management**
- **Automatic Backups**: Daily, weekly, monthly options
- **Manual Backups**: Create backups on demand
- **Backup Rotation**: Keep multiple backup versions
- **Backup Verification**: Verify backup integrity

### **Data Recovery**
- **Corruption Recovery**: Automatic recovery from data corruption
- **Backup Recovery**: Restore from backup files
- **Partial Recovery**: Recover specific data categories
- **Emergency Recovery**: Recovery from severe corruption

## 📁 **File Structure**

```
Data Directory/
├── habits.json              (Main habit data)
├── settings.json            (User settings)
├── achievements.json        (Achievement data)
├── statistics.json          (Analytics data)
├── backups/                 (Automatic backups)
│   ├── daily/
│   ├── weekly/
│   └── monthly/
├── exports/                 (Manual exports)
└── temp/                   (Temporary files)
```

## ⚠️ **Important Notes**

### **Data Safety**
- **Regular Backups**: Always keep recent backups
- **Export Before Updates**: Export data before major updates
- **Multiple Copies**: Keep backups in multiple locations
- **Test Restores**: Periodically test backup restoration

### **Troubleshooting**
- **Data Corruption**: Use backup recovery
- **Missing Data**: Check backup files
- **Performance Issues**: Clear temporary files
- **Storage Full**: Clean up old backups

## 🚀 **Best Practices**

### **Regular Maintenance**
1. **Weekly**: Check backup status
2. **Monthly**: Export data manually
3. **Quarterly**: Clean up old backups
4. **Annually**: Test backup restoration

### **Data Organization**
1. **Use Categories**: Organize habits with categories
2. **Regular Cleanup**: Remove unused habits
3. **Archive Old Data**: Archive completed habits
4. **Monitor Storage**: Keep track of storage usage

---

**Your data is important to us. This guide helps you manage it effectively and securely.**

