import axios from "axios"

// Gemini API endpoint
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
const API_KEY = "AIzaSyCnswhr-Iro0IjbclY3CVpVRii6D9djWUw"

// Conversation history storage
let conversationHistory = []

/**
 * Generate a response from Gemini API
 * @param {string} question - The user's question
 * @returns {Promise<string>} - The AI response
 */
export const generateResponse = async (question) => {
  try {
    // Add user message to history
    conversationHistory.push("User Said: " + question)

    // Prepare the prompt with conversation history
    let prompt = question
    prompt +=
      " \nPlease answer the question given in paragraph form. Do not add any extra symbols or anything. This message is here for you as a wrapper and understanding"
    prompt += "\nHere is the conversation history with the user and they said:\n "

    // Add conversation history to the prompt
    for (let i = 0; i < conversationHistory.length; i++) {
      prompt += conversationHistory[i]
    }

    prompt +=
      "\nThis history is just so you have context if the user wants to extend their conversation with you. If there is no history, that means that your conversation just started."

    // Add the prompt to history
    conversationHistory.push(prompt)

    // Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      safetySettings: [
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_NONE",
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_ONLY_HIGH",
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      },
    }

    // Make the API request
    const response = await axios.post(`${GEMINI_API_URL}?key=${API_KEY}`, requestBody)

    // Extract the response text
    const responseText = response.data.candidates[0].content.parts[0].text

    // Add AI response to history
    conversationHistory.push(
      "\n This is now your response (as an AI) responding to the user. Use this information for context to keep the conversation going. If nothing is there, you just started a new conversation with the user: \n" +
        responseText,
    )

    return responseText
  } catch (error) {
    console.error("Error generating response from Gemini API:", error)

    // Return a fallback response if the API call fails
    return "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later."
  }
}

/**
 * Clear the conversation history
 */
export const clearConversationHistory = () => {
  conversationHistory = []
}

