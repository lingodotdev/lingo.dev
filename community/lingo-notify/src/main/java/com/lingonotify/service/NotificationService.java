package com.lingonotify.service;

import com.lingonotify.model.NotificationLog;
import com.lingonotify.repository.NotificationRepository;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {



  private final NotificationRepository repository;

  public NotificationService(NotificationRepository repository) {
    this.repository = repository;
  }

  public NotificationLog save(String key, String lang, String message) {
    NotificationLog log = new NotificationLog();
    log.setMessageKey(key);

    log.setLanguage(lang);
    log.setResolvedMessage(message);
    return repository.save(log);
  }

}
