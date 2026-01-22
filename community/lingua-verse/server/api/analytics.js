import express from "express";
import translateService from "../services/translate-service/index.js";

const router = express.Router();

// In-memory analytics storage
const analytics = {
  userLanguages: new Map(), // username -> language
  translationCount: new Map(), // language -> count
  activeUsers: new Set(),
};

/**
 * Track user language preference
 */
router.post("/track/language", (req, res) => {
  try {
    const { username, language } = req.body;

    if (!username || !language) {
      return res.status(400).json({
        success: false,
        error: "Username and language are required",
      });
    }

    analytics.userLanguages.set(username, language);
    analytics.activeUsers.add(username);

    res.json({
      success: true,
      message: "Language preference tracked",
    });
  } catch (error) {
    console.error("Error tracking language:", error);
    res.status(500).json({
      success: false,
      error: "Failed to track language",
    });
  }
});

/**
 * Track translation usage
 */
router.post("/track/translation", (req, res) => {
  try {
    const { targetLang } = req.body;

    if (!targetLang) {
      return res.status(400).json({
        success: false,
        error: "Target language is required",
      });
    }

    const currentCount = analytics.translationCount.get(targetLang) || 0;
    analytics.translationCount.set(targetLang, currentCount + 1);

    res.json({
      success: true,
      message: "Translation tracked",
    });
  } catch (error) {
    console.error("Error tracking translation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to track translation",
    });
  }
});

/**
 * Get language distribution
 */
router.get("/language-distribution", (req, res) => {
  try {
    const distribution = {};

    analytics.userLanguages.forEach((lang) => {
      distribution[lang] = (distribution[lang] || 0) + 1;
    });

    const data = Object.entries(distribution).map(([language, count]) => ({
      language,
      count,
      percentage: ((count / analytics.userLanguages.size) * 100).toFixed(2),
    }));

    res.json({
      success: true,
      data,
      totalUsers: analytics.userLanguages.size,
    });
  } catch (error) {
    console.error("Error fetching language distribution:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch language distribution",
    });
  }
});

/**
 * Get translation frequency
 */
router.get("/translation-frequency", (req, res) => {
  try {
    const data = Array.from(analytics.translationCount.entries()).map(
      ([language, count]) => ({
        language,
        count,
      }),
    );

    // Sort by count descending
    data.sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching translation frequency:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch translation frequency",
    });
  }
});

/**
 * Get most used languages
 */
router.get("/most-used-languages", (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const languageUsage = new Map();

    // Combine user languages and translation counts
    analytics.userLanguages.forEach((lang) => {
      languageUsage.set(lang, (languageUsage.get(lang) || 0) + 1);
    });

    analytics.translationCount.forEach((count, lang) => {
      languageUsage.set(lang, (languageUsage.get(lang) || 0) + count);
    });

    const data = Array.from(languageUsage.entries())
      .map(([language, usage]) => ({ language, usage }))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, parseInt(limit));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching most used languages:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch most used languages",
    });
  }
});

/**
 * Get cache statistics
 */
router.get("/cache-stats", (req, res) => {
  try {
    const stats = translateService.getCacheStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Error fetching cache stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch cache stats",
    });
  }
});

/**
 * Get overall analytics summary
 */
router.get("/summary", (req, res) => {
  try {
    const languageDistribution = {};
    analytics.userLanguages.forEach((lang) => {
      languageDistribution[lang] = (languageDistribution[lang] || 0) + 1;
    });

    const totalTranslations = Array.from(
      analytics.translationCount.values(),
    ).reduce((sum, count) => sum + count, 0);

    res.json({
      success: true,
      summary: {
        activeUsers: analytics.activeUsers.size,
        totalUsers: analytics.userLanguages.size,
        languagesUsed: new Set(analytics.userLanguages.values()).size,
        totalTranslations,
        languageDistribution,
        cacheStats: translateService.getCacheStats(),
      },
    });
  } catch (error) {
    console.error("Error fetching analytics summary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch analytics summary",
    });
  }
});

export default router;
