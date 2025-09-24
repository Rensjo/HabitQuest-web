mod background_notifications;

use background_notifications::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_notification::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Initialize background notification service
      let app_handle = app.handle().clone();
      tauri::async_runtime::spawn(async move {
        if let Err(e) = start_background_notifications(app_handle).await {
          eprintln!("Failed to start background notifications: {}", e);
        }
      });

      Ok(())
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
      get_background_service_status
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

// ================================================================================================
// NOTIFICATION COMMANDS
// ================================================================================================

#[tauri::command]
fn tauri_notification_supported() -> bool {
  // Check if the current platform supports notifications
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
fn tauri_send_notification(title: String, body: String, icon: Option<String>) -> Result<(), String> {
  // Create a simple notification
  // Note: In a production app, you'd want to use a proper notification library
  // like `notify-rust` for cross-platform desktop notifications
  
  #[cfg(target_os = "windows")]
  {
    // Windows implementation would use Windows Toast API
    log::info!("Sending Windows notification: {} - {}", title, body);
  }
  
  #[cfg(target_os = "macos")]
  {
    // macOS implementation would use NSUserNotification
    log::info!("Sending macOS notification: {} - {}", title, body);
  }
  
  #[cfg(target_os = "linux")]
  {
    // Linux implementation would use libnotify
    log::info!("Sending Linux notification: {} - {}", title, body);
  }
  
  // For now, just log the notification (placeholder)
  log::info!("Notification: {}: {} (icon: {:?})", title, body, icon);
  
  Ok(())
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
