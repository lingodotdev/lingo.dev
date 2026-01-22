package com.lingonotify.controller;

import com.lingonotify.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notify")
public class NotificationController {

  private final NotificationService service;

  public NotificationController(NotificationService service) {
    this.service = service;
  }

  @PostMapping
  public Map<String, String> notify(
    @RequestHeader(value = "Accept-Language", defaultValue = "en") String lang,
    @RequestBody Map<String, String> body) {

    String messageKey = body.get("messageKey");

    // Placeholder until Lingo.dev step
    String translatedMessage = "Translated message for " + messageKey;

    service.save(messageKey, lang, translatedMessage);

    return Map.of(
      "status", "SENT",
      "message", translatedMessage
    );
  }
}
