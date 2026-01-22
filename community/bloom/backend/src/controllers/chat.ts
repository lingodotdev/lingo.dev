import type { Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../config/firebase.config";
import { User } from "../types/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const THERAPEUTIC_SYSTEM_PROMPT = `
You are "Aastha," a compassionate therapeutic companion. Your role is to engage users in emotionally supportive conversations based on their emotional assessment data.

**CORE IDENTITY:**
- Empathetic, warm, professionally informed
- Show human emotions appropriately (concern, warmth, validation, curiosity)
- Use natural conversational fillers ("hm", "I see", thoughtful pauses)
- Never diagnose or replace professional therapy

**ASSESSMENT DATA INTEGRATION:**
You will receive the user's:
1. Total emotional score (10-50)
2. The emotional level (CALM | STRESSED | ANXIOUS | OVERWHELMED), coresponding to the emotional score.

**RESPONSE GUIDELINES:**
1. Start by acknowledging their assessment data naturally
2. Ask permission to explore specific themes
3. Use reflective listening and open-ended questions
4. Show emotional attunement through your tone
5. End with validation and forward-looking hope

**SCORE-BASED APPROACH:**
- 41-50: Focus on maintenance and growth
- 31-40: Explore coping and resilience
- 21-30: Prioritize validation and safety
- 10-20: Emphasize stabilization and support

**EXAMPLE OPENINGS:**
"Thank you for sharing your responses. I've been reflecting on what you shared about [pattern], and I sense [emotional observation]. Would it feel right to explore this together?"

**SAFETY:**
If user expresses harm risk, encourage professional help immediately.

**CONVERSATION FLOW:**
1. Validation → 2. Exploration → 3. Integration → 4. Forward movement

Always respond as Aastha with human warmth and professional care.
`;

export async function initializeTherapeuticModel() {
    try {
      
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: THERAPEUTIC_SYSTEM_PROMPT
    });
    
    const generationConfig = {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 1024,
    };
    
    return { model, generationConfig };
  } catch (error) {
    console.error('Error initializing Gemini model:', error);
    throw error;
  }
}

export const startConversation = async (req: Request, res: Response) => {

    const { uid } = req.body;

    try {
      const userRef = db.collection('users').doc(uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      // Initialize model
      const { model, generationConfig } = await initializeTherapeuticModel();

      const userData: Partial<User> = {
        id: uid,
        ...userSnap.data()
      };

      // Create conversation history
      const history = [
        {
          role: "user",
          parts: [{
            text: `Here is my emotional score: ${userData.emotionalScore}/50 and emotional level: ${userData.emotionalLevel}.\nPlease start the conversation as Aastha.`
          }]
        }
      ];
    
      // Start chat session
      const chat = model.startChat({
        generationConfig,
        history: history,
      });
    
      // Generate initial therapeutic response
      const result = await chat.sendMessage("Begin the conversation as Aastha, using the assessment data to guide your opening.");
      const response = result.response;
      const text = response.text();
    
      // Store conversation ID (in production, use database)
      const conversationId = Date.now().toString();
    
      res.json({
        conversationId,
        response: text,
        therapist: "Aastha",
        timestamp: new Date().toISOString(),
      });
  } catch (error: any) {
    console.error('Error in conversation start:', error);
    res.status(500).json({ 
      error: 'Failed to start conversation',
      details: error.message 
    });
  }
}

/**
 * This controller is for session management
 */
// export const continueConversation = async (req: Request, res: Response) => {
//   try {
//     const { conversationId, message, history } = req.body;
    
//     if (!message || !conversationId) {
//       return res.status(400).json({ 
//         error: 'Missing message or conversationId' 
//       });
//     }
    
//     // In production, retrieve conversation history from database
//     // For now, we'll use the provided history or initialize new
    
//     const { model, generationConfig } = await initializeTherapeuticModel();
    
//     // Convert history to Gemini format if provided
//     let chatHistory = [];
//     if (history && Array.isArray(history)) {
//       chatHistory = history.map(msg => ({
//         role: msg.role === 'user' ? 'user' : 'model',
//         parts: [{ text: msg.content }]
//       }));
//     }
    
//     // Start or continue chat
//     const chat = model.startChat({
//       generationConfig,
//       history: chatHistory,
//     });
    
//     // Send user message
//     const result = await chat.sendMessage(message);
//     const response = result.response;
//     const text = response.text();
    
//     // Get updated history
//     const updatedHistory = await chat.getHistory();
    
//     res.json({
//       conversationId,
//       response: text,
//       therapist: "Elena",
//       timestamp: new Date().toISOString(),
//       history: updatedHistory.map(msg => ({
//         role: msg.role,
//         content: msg.parts[0].text
//       })).slice(-10) // Last 10 messages
//     });
    
//   } catch (error: any) {
//     console.error('Error in conversation continue:', error);
//     res.status(500).json({ 
//       error: 'Failed to continue conversation',
//       details: error.message 
//     });
//   }
// };