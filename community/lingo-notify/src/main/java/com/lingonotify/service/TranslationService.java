package com.lingonotify.service;



import org.springframework.stereotype.Service;
import tools.jackson.databind.ObjectMapper;

import java.io.InputStream;
import java.util.Map;

@Service
public class TranslationService {

  private final ObjectMapper objectMapper;

  public TranslationService(ObjectMapper objectMapper) {
    this.objectMapper = objectMapper;
  }

  public String translate(String key, String lang) {
    String path = "/lingo/" + lang + ".json";

    try (InputStream is = getClass().getResourceAsStream(path)) {

      // 🔴 File not found → fallback
      if (is == null) {
        return key;
      }

      Map<String, String> map =
        objectMapper.readValue(is, Map.class);

      return map.getOrDefault(key, key);

    } catch (Exception e) {
      return key;
    }
  }
}
