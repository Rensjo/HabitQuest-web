/**
 * ================================================================================================
 * BACKGROUND NOTIFICATION SERVICE
 * ================================================================================================
 * 
 * Rust backend service for sending notifications even when the app is closed
 * Uses system tray and background processes to maintain notification scheduling
 * 
 * @version 1.0.0
 */

use chrono::{DateTime, Local, Timelike};
use serde::{Deserialize, Serialize};
use std::sync::{Arc, Mutex};
use std::thread;
use std::time::Duration;
use tauri::{AppHandle, Manager};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationConfig {
    pub enabled: bool,
    pub streak_reminders: bool,
    pub random_reminders: bool,
    pub reminder_start_hour: u32,
    pub reminder_end_hour: u32,
    pub max_reminders_per_day: u32,
    pub streak_warning_threshold: u32,
    pub sound_enabled: bool,
    pub intelligent_timing: bool,
    pub adaptive_frequency: bool,
    pub streak_protection_hours: Vec<u32>,
}

impl Default for NotificationConfig {
    fn default() -> Self {
        Self {
            enabled: true,
            streak_reminders: true,
            random_reminders: true,
            reminder_start_hour: 8,
            reminder_end_hour: 22,
            max_reminders_per_day: 2,
            streak_warning_threshold: 3,
            sound_enabled: false,
            intelligent_timing: true,
            adaptive_frequency: true,
            streak_protection_hours: vec![12, 18, 20],
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActivityData {
    pub last_activity: DateTime<Local>,
    pub daily_sessions: Vec<DateTime<Local>>,
    pub habit_completions: std::collections::HashMap<String, DateTime<Local>>,
    pub notifications_sent_today: u32,
    pub last_notification_date: Option<DateTime<Local>>,
}

impl Default for ActivityData {
    fn default() -> Self {
        Self {
            last_activity: Local::now(),
            daily_sessions: Vec::new(),
            habit_completions: std::collections::HashMap::new(),
            notifications_sent_today: 0,
            last_notification_date: None,
        }
    }
}

pub struct BackgroundNotificationService {
    config: Arc<Mutex<NotificationConfig>>,
    activity_data: Arc<Mutex<ActivityData>>,
    app_handle: AppHandle,
}

impl BackgroundNotificationService {
    pub fn new(app_handle: AppHandle) -> Self {
        Self {
            config: Arc::new(Mutex::new(NotificationConfig::default())),
            activity_data: Arc::new(Mutex::new(ActivityData::default())),
            app_handle,
        }
    }

    pub fn start_background_service(&self) {
        let config = Arc::clone(&self.config);
        let activity_data = Arc::clone(&self.activity_data);
        let app_handle = self.app_handle.clone();

        thread::spawn(move || {
            loop {
                // Sleep for 1 hour between checks
                thread::sleep(Duration::from_secs(3600));

                let should_send_notification = {
                    let config_guard = config.lock().unwrap();
                    let mut activity_guard = activity_data.lock().unwrap();

                    if !config_guard.enabled {
                        continue;
                    }

                    // Check if it's within active hours
                    let now = Local::now();
                    let current_hour = now.hour();
                    
                    if current_hour < config_guard.reminder_start_hour || current_hour > config_guard.reminder_end_hour {
                        continue;
                    }

                    // Check if we've already sent max notifications today
                    let is_new_day = activity_guard
                        .last_notification_date
                        .map_or(true, |last| last.date_naive() != now.date_naive());

                    if is_new_day {
                        activity_guard.notifications_sent_today = 0;
                        activity_guard.last_notification_date = Some(now);
                    }

                    if activity_guard.notifications_sent_today >= config_guard.max_reminders_per_day {
                        continue;
                    }

                    // Check if user has been inactive for more than 12 hours
                    let hours_since_activity = (now - activity_guard.last_activity).num_hours();
                    
                    if hours_since_activity >= 12 {
                        activity_guard.notifications_sent_today += 1;
                        true
                    } else {
                        false
                    }
                };

                if should_send_notification {
                    let _ = Self::send_background_notification(&app_handle);
                }
            }
        });
    }

    fn send_background_notification(app_handle: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
        use tauri_plugin_notification::NotificationExt;

        let _notification = app_handle
            .notification()
            .builder()
            .title("🎯 HabitQuest Reminder")
            .body("Don't forget to check in with your habits today! Your streaks are waiting for you.")
            .icon("habitquest-icon")
            .show()?;

        Ok(())
    }

    pub fn update_config(&self, new_config: NotificationConfig) {
        let mut config = self.config.lock().unwrap();
        *config = new_config;
        
        // Save to persistent storage
        let _ = self.save_config_to_file(&config);
    }

    pub fn record_activity(&self) {
        let mut activity = self.activity_data.lock().unwrap();
        let now = Local::now();
        activity.last_activity = now;
        activity.daily_sessions.push(now);

        // Clean old sessions (keep only last 24 hours)
        activity.daily_sessions.retain(|session| {
            (now - *session).num_hours() <= 24
        });

        // Save to persistent storage
        let _ = self.save_activity_to_file(&activity);
    }

    pub fn record_habit_completion(&self, habit_id: String) {
        let mut activity = self.activity_data.lock().unwrap();
        activity.habit_completions.insert(habit_id, Local::now());
        
        // Save to persistent storage
        let _ = self.save_activity_to_file(&activity);
    }

    fn save_config_to_file(&self, config: &NotificationConfig) -> Result<(), Box<dyn std::error::Error>> {
        use std::fs;
        
        let config_dir = self.app_handle.path().app_config_dir()
            .map_err(|e| format!("Could not resolve app config directory: {}", e))?;
        
        fs::create_dir_all(&config_dir)?;
        let config_path = config_dir.join("notification_config.json");
        let config_json = serde_json::to_string_pretty(config)?;
        fs::write(config_path, config_json)?;
        Ok(())
    }

    fn save_activity_to_file(&self, activity: &ActivityData) -> Result<(), Box<dyn std::error::Error>> {
        use std::fs;
        
        let config_dir = self.app_handle.path().app_config_dir()
            .map_err(|e| format!("Could not resolve app config directory: {}", e))?;
        
        fs::create_dir_all(&config_dir)?;
        let activity_path = config_dir.join("activity_data.json");
        let activity_json = serde_json::to_string_pretty(activity)?;
        fs::write(activity_path, activity_json)?;
        Ok(())
    }

    pub fn load_from_files(&self) -> Result<(), Box<dyn std::error::Error>> {
        use std::fs;
        
        let config_dir = self.app_handle.path().app_config_dir()
            .map_err(|e| format!("Could not resolve app config directory: {}", e))?;

        // Load config
        let config_path = config_dir.join("notification_config.json");
        if config_path.exists() {
            let config_json = fs::read_to_string(config_path)?;
            let config: NotificationConfig = serde_json::from_str(&config_json)?;
            let mut config_guard = self.config.lock().unwrap();
            *config_guard = config;
        }

        // Load activity data
        let activity_path = config_dir.join("activity_data.json");
        if activity_path.exists() {
            let activity_json = fs::read_to_string(activity_path)?;
            let activity: ActivityData = serde_json::from_str(&activity_json)?;
            let mut activity_guard = self.activity_data.lock().unwrap();
            *activity_guard = activity;
        }

        Ok(())
    }
}

// ================================================================================================
// TAURI COMMANDS
// ================================================================================================

#[tauri::command]
pub async fn start_background_notifications(app_handle: AppHandle) -> Result<(), String> {
    let service = BackgroundNotificationService::new(app_handle.clone());
    
    // Load existing configuration
    if let Err(e) = service.load_from_files() {
        eprintln!("Warning: Could not load notification data: {}", e);
    }
    
    // Start the background service
    service.start_background_service();
    
    // Store service in app state for later access
    app_handle.manage(service);
    
    Ok(())
}

#[tauri::command] 
pub async fn update_notification_config(
    app_handle: AppHandle,
    config: NotificationConfig,
) -> Result<(), String> {
    if let Some(service) = app_handle.try_state::<BackgroundNotificationService>() {
        service.update_config(config);
        Ok(())
    } else {
        Err("Background notification service not initialized".to_string())
    }
}

#[tauri::command]
pub async fn record_app_activity(app_handle: AppHandle) -> Result<(), String> {
    if let Some(service) = app_handle.try_state::<BackgroundNotificationService>() {
        service.record_activity();
        Ok(())
    } else {
        Err("Background notification service not initialized".to_string())
    }
}

#[tauri::command]
pub async fn record_habit_completion_backend(
    app_handle: AppHandle,
    habit_id: String,
) -> Result<(), String> {
    if let Some(service) = app_handle.try_state::<BackgroundNotificationService>() {
        service.record_habit_completion(habit_id);
        Ok(())
    } else {
        Err("Background notification service not initialized".to_string())
    }
}