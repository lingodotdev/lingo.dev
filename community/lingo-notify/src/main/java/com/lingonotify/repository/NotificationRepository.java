package com.lingonotify.repository;

import com.lingonotify.model.NotificationLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository
  extends JpaRepository<NotificationLog, Long> {
}
