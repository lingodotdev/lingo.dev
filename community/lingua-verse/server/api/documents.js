import express from "express";
import translateService from "../services/translate-service/index.js";

const router = express.Router();

// In-memory storage for documents
const documents = new Map();

/**
 * Get all documents
 */
router.get("/", (req, res) => {
  try {
    const docList = Array.from(documents.values()).map((doc) => ({
      id: doc.id,
      title: doc.title,
      originalLang: doc.originalLang,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      collaborators: doc.collaborators,
    }));

    res.json({
      success: true,
      documents: docList,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch documents",
    });
  }
});

/**
 * Get a specific document with translation
 */
router.get("/:docId", async (req, res) => {
  try {
    const { docId } = req.params;
    const { lang = "en" } = req.query;

    const doc = documents.get(docId);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    // Translate content if needed
    let translatedContent = doc.content;
    if (lang !== doc.originalLang) {
      translatedContent = await translateService.translate(doc.content, lang, {
        sourceLang: doc.originalLang,
        context: "business",
      });
    }

    res.json({
      success: true,
      document: {
        ...doc,
        content: translatedContent,
        originalContent: doc.content,
        translatedTo: lang,
      },
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch document",
    });
  }
});

/**
 * Create a new document
 */
router.post("/", (req, res) => {
  try {
    const { title, content, lang = "en", username } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required",
      });
    }

    const docId = Date.now().toString();
    const document = {
      id: docId,
      title,
      content,
      originalLang: lang,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      collaborators: username ? [username] : [],
    };

    documents.set(docId, document);

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create document",
    });
  }
});

/**
 * Update a document
 */
router.put("/:docId", (req, res) => {
  try {
    const { docId } = req.params;
    const { content, username } = req.body;

    const doc = documents.get(docId);
    if (!doc) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    // Update document
    doc.content = content || doc.content;
    doc.updatedAt = new Date().toISOString();

    // Add collaborator if not already present
    if (username && !doc.collaborators.includes(username)) {
      doc.collaborators.push(username);
    }

    documents.set(docId, doc);

    res.json({
      success: true,
      document: doc,
    });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update document",
    });
  }
});

/**
 * Delete a document
 */
router.delete("/:docId", (req, res) => {
  try {
    const { docId } = req.params;

    if (!documents.has(docId)) {
      return res.status(404).json({
        success: false,
        error: "Document not found",
      });
    }

    documents.delete(docId);

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete document",
    });
  }
});

export default router;
