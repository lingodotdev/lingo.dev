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

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getMessageKey() {
    return messageKey;
  }

  public void setMessageKey(String messageKey) {
    this.messageKey = messageKey;
  }

  public String getLanguage() {
    return language;
  }

  public void setLanguage(String language) {
    this.language = language;
  }

  public String getResolvedMessage() {
    return resolvedMessage;
  }

  public void setResolvedMessage(String resolvedMessage) {
    this.resolvedMessage = resolvedMessage;
  }

  public LocalDateTime getSentAt() {
    return sentAt;
  }

  public void setSentAt(LocalDateTime sentAt) {
    this.sentAt = sentAt;
  }
}
