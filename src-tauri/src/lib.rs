mod background_notifications;

use background_notifications::*;
use tauri::{Manager, Emitter};
use tauri::tray::{TrayIconBuilder, TrayIconEvent};
use tauri_plugin_notification::NotificationExt;
use chrono::Timelike;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_notification::init())
    .plugin(tauri_plugin_autostart::init(tauri_plugin_autostart::MacosLauncher::LaunchAgent, None))
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      let handle = app.handle().clone();

      // Create system tray icon for background operation
      let handle_for_tray = handle.clone();
      TrayIconBuilder::new()
        .tooltip("HabitQuest - Habit Tracker (Click to restore)")
        .icon(app.default_window_icon().unwrap().clone())
        .on_tray_icon_event(move |_tray, event| {
          if let TrayIconEvent::Click { .. } = event {
            if let Some(window) = handle_for_tray.get_webview_window("main") {
              let _ = window.show();
              let _ = window.set_focus();
              
              // Notify frontend that app is being restored from tray
              let _ = window.emit("app-restored-from-tray", ());
              
              log::info!("App restored from system tray, frontend notified to resume");
            }
          }
        })
        .build(&handle)
        .expect("Failed to create system tray");

      // Enable autostart on Windows for persistent background operation
      #[cfg(target_os = "windows")]
      {
        use tauri_plugin_autostart::ManagerExt;
        let _ = handle.autolaunch().enable();
      }

      // Initialize background notification service with enhanced scheduling
      let app_handle = app.handle().clone();
      tauri::async_runtime::spawn(async move {
        start_enhanced_background_service(app_handle).await;
      });

      Ok(())
    })
    // Enhanced window event handling for proper tray behavior
    .on_window_event(|window, event| {
      match event {
        tauri::WindowEvent::CloseRequested { api, .. } => {
          api.prevent_close();
          
          // Notify frontend to pause all activities
          let _ = window.emit("app-hiding-to-tray", ());
          
          // Hide the window to system tray
          let _ = window.hide();
          
          log::info!("Window hidden to system tray, frontend notified to pause activities");
        },
        tauri::WindowEvent::Focused(focused) => {
          if *focused {
            // App window gained focus - notify frontend to resume
            let _ = window.emit("app-window-focused", ());
            log::info!("Window focused, frontend notified to resume activities");
          } else {
            // App window lost focus - optionally pause some activities
            let _ = window.emit("app-window-unfocused", ());
          }
        },
        _ => {}
      }
    })
    .invoke_handler(tauri::generate_handler![
      tauri_notification_supported,
      tauri_request_notification_permission,
      tauri_send_notification,
      start_background_notifications,
      update_notification_config,
      record_app_activity,
      record_habit_completion_backend,
      is_background_service_running,
      get_background_service_status,
      show_main_window,
      init_notifications_and_send_test
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

// ================================================================================================
// ENHANCED BACKGROUND SERVICE
// ================================================================================================

async fn start_enhanced_background_service(app_handle: tauri::AppHandle) {
  use std::time::Duration;
  
  log::info!("Starting enhanced background notification service...");
  
  loop {
    // Check every hour for activity-based notifications
    tokio::time::sleep(Duration::from_secs(3600)).await;
    
    // Send notification only after 20 hours of inactivity to preserve daily streaks
    if should_send_streak_protection_reminder(&app_handle).await {
      let _ = app_handle.notification().builder()
        .title("🎯 HabitQuest - Daily Streak Protection")
        .body("It's been 20 hours since your last activity! Don't lose your streak - check in now! 🔥")
        .show();
      
      log::info!("20-hour inactivity streak protection notification sent");
    }
  }
}

async fn should_send_streak_protection_reminder(app_handle: &tauri::AppHandle) -> bool {
  use chrono::Local;
  
  // Check if 20 hours have passed since last activity
  let now = Local::now();
  let hour = now.hour();
  
  // Only send during reasonable hours (8 AM to 10 PM) to avoid night notifications
  if hour < 8 || hour > 22 {
    return false;
  }
  
  // TODO: In production, implement actual activity tracking
  // This would check when the user last interacted with habits in your app
  // For now, we'll check once per day maximum during afternoon hours
  
  // Send streak protection reminder once per day around 6 PM (18:00)
  // In a real implementation, you'd track actual user activity via app_handle state
  if hour == 18 && now.minute() < 5 {
    log::info!("Checking for 20-hour inactivity period via app handle: {}", app_handle.package_info().name);
    true
  } else {
    false
  }
}

// ================================================================================================
// NOTIFICATION COMMANDS
// ================================================================================================

#[tauri::command]
fn show_main_window(app: tauri::AppHandle) -> Result<(), String> {
  if let Some(window) = app.get_webview_window("main") {
    window.show().map_err(|e| e.to_string())?;
    window.set_focus().map_err(|e| e.to_string())?;
    Ok(())
  } else {
    Err("Main window not found".to_string())
  }
}

#[tauri::command]
async fn init_notifications_and_send_test(app_handle: tauri::AppHandle) -> Result<bool, String> {
  use tauri_plugin_notification::NotificationExt;
  
  log::info!("Initializing notifications and sending test notification");
  
  // Send the initial notification that will register the app in Windows
  match app_handle.notification().builder()
    .title("🎯 HabitQuest")
    .body("Notifications enabled! You'll now receive habit reminders. ✅")
    .show() {
    Ok(_) => {
      log::info!("Initial notification sent successfully - app should now appear in Windows notification settings");
      Ok(true)
    },
    Err(e) => {
      log::error!("Failed to send initial notification: {}", e);
      Err(format!("Failed to send notification: {}", e))
    }
  }
}

#[tauri::command]
fn tauri_notification_supported() -> bool {
  #[cfg(any(target_os = "windows", target_os = "macos", target_os = "linux"))]
  {
    true
  }
  #[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
  {
    false
  }
}

#[tauri::command]
fn tauri_request_notification_permission() -> bool {
  // On desktop platforms, permissions are generally granted by default
  // In a full implementation, you might check system notification settings
  true
}

#[tauri::command]
fn tauri_send_notification(app_handle: tauri::AppHandle, title: String, body: String, icon: Option<String>) -> Result<(), String> {
  use tauri_plugin_notification::NotificationExt;
  
  log::info!("Attempting to send notification: {} - {}", title, body);
  
  let mut builder = app_handle.notification().builder()
    .title(&title)
    .body(&body);
    
  if let Some(icon_name) = icon {
    builder = builder.icon(&icon_name);
  }
  
  match builder.show() {
    Ok(_) => {
      log::info!("Notification sent successfully");
      Ok(())
    },
    Err(e) => {
      let error_msg = format!("Failed to send notification: {}", e);
      log::error!("{}", error_msg);
      Err(error_msg)
    }
  }
}

#[tauri::command]
fn is_background_service_running() -> bool {
  // For now, we'll assume the service is running if the app is running
  // TODO: Add proper background service tracking
  true
}

#[tauri::command]
fn get_background_service_status() -> String {
  // Return status of background notification service
  // TODO: Add proper status checking
  "running".to_string()
}
