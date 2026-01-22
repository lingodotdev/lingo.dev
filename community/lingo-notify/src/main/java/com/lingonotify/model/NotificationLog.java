package com.lingonotify.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class NotificationLog {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String messageKey;
  private String language;
  private String resolvedMessage;
  private LocalDateTime sentAt = LocalDateTime.now();

  // getters & setters
}
