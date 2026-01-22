package com.lingonotify.controller;

import com.lingonotify.service.NotificationService;
import com.lingonotify.service.TranslationService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notify")
public class NotificationController {

  private final NotificationService service;
  private final TranslationService translationService;

  // ✅ Constructor injection (BEST PRACTICE)
  public NotificationController(
    NotificationService service,
    TranslationService translationService
  ) {
    this.service = service;
    this.translationService = translationService;
  }

  @PostMapping
  public Map<String, String> notify(
    @RequestHeader(value = "Accept-Language", defaultValue = "en") String lang,
    @RequestBody Map<String, String> body
  ) {

    String messageKey = body.get("messageKey");

    // ✅ REAL translation
    String translatedMessage =
      translationService.translate(messageKey, lang);

    service.save(messageKey, lang, translatedMessage);

    return Map.of(
      "status", "SENT",
      "message", translatedMessage
    );
  }
}
