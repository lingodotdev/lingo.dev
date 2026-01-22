import express from "express";
import translateService from "../services/translate-service/index.js";

const router = express.Router();

// In-memory storage for chat messages
// In production, this would be a database
const chatRooms = new Map();

/**
 * Get chat history for a room
 */
router.get("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { lang = "en", limit = 50 } = req.query;

    const messages = chatRooms.get(roomId) || [];
    const recentMessages = messages.slice(-limit);

    // Translate messages to requested language
    const translatedMessages = await Promise.all(
      recentMessages.map(async (msg) => {
        const translatedText = await translateService.translate(
          msg.text,
          lang,
          {
            sourceLang: msg.originalLang,
            context: "casual",
          },
        );

        return {
          ...msg,
          text: translatedText,
          originalText: msg.text,
          translatedTo: lang,
        };
      }),
    );

    res.json({
      success: true,
      roomId,
      messages: translatedMessages,
      count: translatedMessages.length,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch chat history",
    });
  }
});

/**
 * Save a chat message
 */
router.post("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { text, username, lang = "en" } = req.body;

    if (!text || !username) {
      return res.status(400).json({
        success: false,
        error: "Text and username are required",
      });
    }

    const message = {
      id: Date.now().toString(),
      text,
      username,
      originalLang: lang,
      timestamp: new Date().toISOString(),
    };

    // Store message
    if (!chatRooms.has(roomId)) {
      chatRooms.set(roomId, []);
    }
    chatRooms.get(roomId).push(message);

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save message",
    });
  }
});

/**
 * Get list of active rooms
 */
router.get("/rooms", (req, res) => {
  try {
    const rooms = Array.from(chatRooms.keys()).map((roomId) => ({
      id: roomId,
      messageCount: chatRooms.get(roomId).length,
    }));

    res.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch rooms",
    });
  }
});

export default router;
