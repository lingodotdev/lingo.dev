import translateService from "../services/translate-service/index.js";

/**
 * Socket.io Server
 * Handles real-time communication for chat and document collaboration
 */

// Store active users and their languages
const activeUsers = new Map(); // socketId -> { username, language, room }
const roomUsers = new Map(); // roomId -> Set of socketIds

export function initializeSocketServer(io) {
  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

    /**
     * User joins with language preference
     */
    socket.on("user:join", ({ username, language, room = "global" }) => {
      // Store user info
      activeUsers.set(socket.id, { username, language, room });

      // Add to room
      socket.join(room);

      // Track room users
      if (!roomUsers.has(room)) {
        roomUsers.set(room, new Set());
      }
      roomUsers.get(room).add(socket.id);

      // Notify room
      io.to(room).emit("user:joined", {
        username,
        language,
        room,
        timestamp: new Date().toISOString(),
      });

      // Send current room users
      const users = Array.from(roomUsers.get(room))
        .map((id) => activeUsers.get(id))
        .filter(Boolean);

      socket.emit("room:users", { room, users });

      console.log(`👤 ${username} joined room ${room} (${language})`);
    });

    /**
     * Chat message - translate for each recipient
     */
    socket.on("chat:message", async ({ text, room = "global" }) => {
      try {
        const sender = activeUsers.get(socket.id);
        if (!sender) {
          socket.emit("error", { message: "User not authenticated" });
          return;
        }

        const message = {
          id: Date.now().toString(),
          username: sender.username,
          originalText: text,
          originalLang: sender.language,
          timestamp: new Date().toISOString(),
        };

        // Get all users in the room
        const roomSocketIds = roomUsers.get(room) || new Set();

        // Translate and send to each user in their language
        for (const socketId of roomSocketIds) {
          const recipient = activeUsers.get(socketId);
          if (!recipient) continue;

          let translatedText = text;

          // Translate if languages differ
          if (recipient.language !== sender.language) {
            translatedText = await translateService.translate(
              text,
              recipient.language,
              {
                sourceLang: sender.language,
                context: "casual",
              },
            );
          }

          io.to(socketId).emit("chat:message", {
            ...message,
            text: translatedText,
            translatedTo: recipient.language,
            isTranslated: recipient.language !== sender.language,
          });
        }

        console.log(`💬 Message from ${sender.username} in ${room}`);
      } catch (error) {
        console.error("Error handling chat message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    /**
     * Typing indicator
     */
    socket.on("chat:typing", ({ room = "global", isTyping }) => {
      const user = activeUsers.get(socket.id);
      if (!user) return;

      socket.to(room).emit("chat:typing", {
        username: user.username,
        isTyping,
      });
    });

    /**
     * Document update - translate for each viewer
     */
    socket.on("doc:update", async ({ docId, content, room = "global" }) => {
      try {
        const sender = activeUsers.get(socket.id);
        if (!sender) {
          socket.emit("error", { message: "User not authenticated" });
          return;
        }

        const update = {
          docId,
          originalContent: content,
          originalLang: sender.language,
          username: sender.username,
          timestamp: new Date().toISOString(),
        };

        // Get all users in the room
        const roomSocketIds = roomUsers.get(room) || new Set();

        // Translate and send to each user
        for (const socketId of roomSocketIds) {
          if (socketId === socket.id) {
            // Don't translate for sender
            io.to(socketId).emit("doc:update", {
              ...update,
              content,
              translatedTo: sender.language,
              isTranslated: false,
            });
            continue;
          }

          const recipient = activeUsers.get(socketId);
          if (!recipient) continue;

          let translatedContent = content;

          // Translate if languages differ
          if (recipient.language !== sender.language) {
            translatedContent = await translateService.translate(
              content,
              recipient.language,
              {
                sourceLang: sender.language,
                context: "business",
              },
            );
          }

          io.to(socketId).emit("doc:update", {
            ...update,
            content: translatedContent,
            translatedTo: recipient.language,
            isTranslated: recipient.language !== sender.language,
          });
        }

        console.log(`📝 Document ${docId} updated by ${sender.username}`);
      } catch (error) {
        console.error("Error handling document update:", error);
        socket.emit("error", { message: "Failed to update document" });
      }
    });

    /**
     * Document cursor position
     */
    socket.on("doc:cursor", ({ docId, position, room = "global" }) => {
      const user = activeUsers.get(socket.id);
      if (!user) return;

      socket.to(room).emit("doc:cursor", {
        docId,
        username: user.username,
        position,
      });
    });

    /**
     * User disconnection
     */
    socket.on("disconnect", () => {
      const user = activeUsers.get(socket.id);

      if (user) {
        const { username, room } = user;

        // Remove from room users
        if (roomUsers.has(room)) {
          roomUsers.get(room).delete(socket.id);

          // Clean up empty rooms
          if (roomUsers.get(room).size === 0) {
            roomUsers.delete(room);
          }
        }

        // Remove user
        activeUsers.delete(socket.id);

        // Notify room
        io.to(room).emit("user:left", {
          username,
          room,
          timestamp: new Date().toISOString(),
        });

        console.log(`👋 ${username} left room ${room}`);
      }

      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });

  console.log("🔌 Socket.io server initialized");
}

export default initializeSocketServer;
