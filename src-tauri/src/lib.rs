mod background_notifications;

use background_notifications::*;
use tauri::Manager;
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
        .tooltip("HabitQuest - Habit Tracker")
        .icon(app.default_window_icon().unwrap().clone())
        .on_tray_icon_event(move |_tray, event| {
          if let TrayIconEvent::Click { .. } = event {
            if let Some(window) = handle_for_tray.get_webview_window("main") {
              let _ = window.show();
              let _ = window.set_focus();
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
    // Hide to tray instead of closing when user closes window
    .on_window_event(|window, event| {
      if let tauri::WindowEvent::CloseRequested { api, .. } = event {
        api.prevent_close();
        let _ = window.hide();
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
    // Check every 5 minutes for more responsive notifications
    tokio::time::sleep(Duration::from_secs(300)).await;
    
    // Send periodic reminder (this is where you'd check your habit schedule)
    if should_send_reminder().await {
      let _ = app_handle.notification().builder()
        .title("🎯 HabitQuest Reminder")
        .body("Time to check in with your habits! Keep your streaks alive! 🔥")
        .show();
      
      log::info!("Background notification sent");
    }
  }
}

async fn should_send_reminder() -> bool {
  // TODO: Implement your habit checking logic here
  // For now, send a reminder every hour during active hours
  use chrono::Local;
  let now = Local::now();
  let hour = now.hour();
  
  // Only send between 8 AM and 10 PM
  hour >= 8 && hour <= 22 && now.minute() % 20 == 0 // Every 20 minutes for testing
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
