"use client"

import { useState, useRef, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
  Easing,
} from "react-native"
import { StatusBar } from "expo-status-bar"

export default function ChatbotScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: "welcome-1",
      text: "Hello! I'm your AI security assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toISOString(),
    },
  ])

  const [inputText, setInputText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedPersonality, setSelectedPersonality] = useState("assistant")
  const scrollViewRef = useRef(null)
  const typingDots = useRef(new Animated.Value(0)).current

  // Personalities for the chatbot
  const personalities = {
    assistant: {
      name: "Security Assistant",
      description: "Helpful and informative about security topics",
      color: "#4A90E2",
    },
    expert: {
      name: "Security Expert",
      description: "Technical and detailed security analysis",
      color: "#43A047",
    },
    friendly: {
      name: "Friendly Guide",
      description: "Simple explanations with a friendly tone",
      color: "#FFA000",
    },
  }

  // Animate the typing indicator
  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingDots, {
            toValue: 1,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(typingDots, {
            toValue: 0,
            duration: 300,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ]),
      ).start()
    } else {
      typingDots.setValue(0)
    }
  }, [isTyping])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages, isTyping])

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Send a message
  const sendMessage = () => {
    if (inputText.trim() === "") return

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simulate bot thinking and responding
    simulateBotResponse(inputText.trim())
  }

  // Simulate bot response (replace with actual LLM integration later)
  const simulateBotResponse = (userInput) => {
    // Simulate thinking time (1-3 seconds)
    const thinkingTime = Math.floor(Math.random() * 2000) + 1000

    setTimeout(() => {
      let botResponse

      // Simple response logic based on user input keywords
      if (userInput.toLowerCase().includes("hello") || userInput.toLowerCase().includes("hi")) {
        botResponse = "Hello! How can I assist you with your security needs today?"
      } else if (userInput.toLowerCase().includes("security") && userInput.toLowerCase().includes("password")) {
        botResponse =
          "Strong passwords are essential for security. Use a mix of letters, numbers, and symbols, and avoid using the same password across multiple sites. Consider using a password manager to keep track of them securely."
      } else if (userInput.toLowerCase().includes("breach") || userInput.toLowerCase().includes("hack")) {
        botResponse =
          "If you suspect a security breach, you should immediately change your passwords, enable two-factor authentication where possible, and monitor your accounts for suspicious activity. Would you like me to guide you through specific steps?"
      } else if (userInput.toLowerCase().includes("vpn")) {
        botResponse =
          "A VPN (Virtual Private Network) encrypts your internet connection, making it more secure, especially on public Wi-Fi. It can help protect your data from being intercepted by malicious actors."
      } else if (userInput.toLowerCase().includes("phishing")) {
        botResponse =
          "Phishing attacks try to trick you into revealing sensitive information. Be wary of unexpected emails asking for personal information, check URLs carefully before clicking, and don't download attachments from unknown sources."
      } else {
        // Default responses based on personality
        const defaultResponses = {
          assistant: [
            "I understand your concern about security. Could you provide more details so I can assist you better?",
            "That's an interesting question. From a security perspective, I'd recommend considering these factors...",
            "I'm here to help with your security needs. Let me know if you need more specific information.",
          ],
          expert: [
            "From a technical security standpoint, this requires a multi-layered approach. Let me elaborate...",
            "Your security posture should account for both technical and human factors. Consider implementing...",
            "This is a common security challenge. The most effective mitigation strategy involves...",
          ],
          friendly: [
            "I get what you're asking! Here's a simple way to think about securing your digital life...",
            "Great question! Think of your online security like locking your house - you need good locks (passwords) and awareness of who's at the door (suspicious emails).",
            "Let me break this down in a simple way. Imagine your data is like your personal belongings...",
          ],
        }

        // Select a random response from the appropriate personality
        const responses = defaultResponses[selectedPersonality]
        const randomIndex = Math.floor(Math.random() * responses.length)
        botResponse = responses[randomIndex]
      }

      // Add bot message
      const botMessage = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: "bot",
        timestamp: new Date().toISOString(),
        personality: selectedPersonality,
      }

      setIsTyping(false)
      setMessages((prev) => [...prev, botMessage])
    }, thinkingTime)
  }

  // Clear chat history
  const clearChat = () => {
    setMessages([
      {
        id: "welcome-new",
        text: "Chat history cleared. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ])
  }

  // Change bot personality
  const changePersonality = (personality) => {
    setSelectedPersonality(personality)

    // Add a message about the personality change
    const systemMessage = {
      id: `system-${Date.now()}`,
      text: `Chatbot personality changed to ${personalities[personality].name}`,
      sender: "system",
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, systemMessage])
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.appName}>MyApp</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Security Assistant</Text>
          <Text style={styles.subtitle}>Chat with our AI to get security advice and assistance</Text>
        </View>

        {/* Personality selector */}
        <View style={styles.personalitySelector}>
          {Object.keys(personalities).map((key) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.personalityOption,
                selectedPersonality === key && {
                  backgroundColor: personalities[key].color + "20",
                  borderColor: personalities[key].color,
                },
              ]}
              onPress={() => changePersonality(key)}
            >
              <Text
                style={[styles.personalityName, selectedPersonality === key && { color: personalities[key].color }]}
              >
                {personalities[key].name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chat messages */}
        <ScrollView ref={scrollViewRef} style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === "user"
                  ? styles.userMessage
                  : message.sender === "system"
                    ? styles.systemMessage
                    : [
                        styles.botMessage,
                        message.personality && {
                          borderLeftColor: personalities[message.personality || "assistant"].color,
                        },
                      ],
              ]}
            >
              <Text style={[styles.messageText, message.sender === "system" && styles.systemMessageText]}>
                {message.text}
              </Text>
              <Text style={styles.messageTime}>{formatTime(message.timestamp)}</Text>
            </View>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <View style={styles.typingContainer}>
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>AI is typing</Text>
                <Animated.View style={[styles.typingDot, { opacity: typingDots }]} />
                <Animated.View style={[styles.typingDot, { opacity: typingDots, marginLeft: 4 }]} />
                <Animated.View style={[styles.typingDot, { opacity: typingDots, marginLeft: 4 }]} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            onSubmitEditing={Keyboard.dismiss}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={clearChat}>
            <Text style={styles.actionButtonText}>Clear Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              // This would be replaced with actual functionality to save the chat
              alert("Chat history saved!")
            }}
          >
            <Text style={styles.actionButtonText}>Save Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Integration info */}
        <View style={styles.integrationInfo}>
          <Text style={styles.integrationInfoText}>Ready to connect with your custom LLM backend.</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: "#4A90E2",
    fontSize: 16,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  personalitySelector: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  personalityOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  personalityName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#4A90E2",
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#4A90E2",
  },
  systemMessage: {
    alignSelf: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 10,
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 22,
  },
  systemMessageText: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
  messageTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    alignSelf: "flex-end",
    marginTop: 5,
  },
  typingContainer: {
    width: "100%",
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  typingBubble: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: "50%",
  },
  typingText: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#666",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#B0C4DE",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  actionButtonText: {
    color: "#4A90E2",
    fontSize: 14,
    fontWeight: "600",
  },
  integrationInfo: {
    padding: 10,
    alignItems: "center",
  },
  integrationInfoText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
})

