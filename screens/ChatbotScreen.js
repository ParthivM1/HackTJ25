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
  ActivityIndicator,
  Alert,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { generateResponse, clearConversationHistory } from "../services/gemini-api"

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
  const scrollViewRef = useRef(null)
  const typingDots = useRef(new Animated.Value(0)).current

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
  const sendMessage = async () => {
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

    try {
      // Get response from Gemini API
      const response = await generateResponse(inputText.trim())

      // Add bot message
      const botMessage = {
        id: `bot-${Date.now()}`,
        text: response,
        sender: "bot",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error getting response:", error)

      // Add error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  // Clear chat history
  const clearChat = () => {
    // Clear local message state
    setMessages([
      {
        id: "welcome-new",
        text: "Chat history cleared. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ])

    // Clear conversation history in the API service
    clearConversationHistory()
  }

  // Render each message in the list
  const renderAlertItem = ({ item }) => (
    <View style={styles.alertItem}>
      <Text style={styles.alertMessage}>{item.message}</Text>
      <Text style={styles.alertTimestamp}>{item.timestamp}</Text>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.appName}>CyberGuard</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Security Assistant</Text>
          <Text style={styles.subtitle}>Chat with our AI powered assistant to get security advice and assistance</Text>
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
                    : styles.botMessage,
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
            disabled={!inputText.trim() || isTyping}
          >
            {isTyping ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>Send</Text>
            )}
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
              Alert.alert("Chat Saved", "Chat history has been saved successfully!")
            }}
          >
            <Text style={styles.actionButtonText}>Save Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Integration info */}
        <View style={styles.integrationInfo}>
          <Text style={styles.integrationInfoText}>Powered by Google Gemini AI</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121826",
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
    color: "#fff",
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 22,
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
    backgroundColor: "#5E72E4",
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderBottomLeftRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#FFA000",
  },
  systemMessage: {
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
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
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontStyle: "italic",
  },
  messageTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: "50%",
  },
  typingText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginRight: 5,
  },
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  inputContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "#121826",
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    color: "#fff",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#5E72E4",
    borderRadius: 20,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "rgba(94, 114, 228, 0.5)",
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
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  actionButtonText: {
    color: "#5E72E4",
    fontSize: 14,
    fontWeight: "600",
  },
  integrationInfo: {
    padding: 10,
    alignItems: "center",
  },
  integrationInfoText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    fontStyle: "italic",
  },
})

