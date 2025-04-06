"use client"

import { useState, useEffect, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  ImageBackground,
  RefreshControl,
  Clipboard,
  Platform,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { generateTempEmail, fetchMessages, formatMessage } from "../services/mail-tm-api"

export default function TempEmailScreen({ navigation }) {
  const [tempEmail, setTempEmail] = useState(null)
  const [token, setToken] = useState(null)
  const [expiresAt, setExpiresAt] = useState(null)
  const [messages, setMessages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const pollingInterval = useRef(null)

  // Handle email generation
  const handleGenerateEmail = async () => {
    try {
      setIsGenerating(true)
      setError(null)

      const result = await generateTempEmail()
      setTempEmail(result.email)
      setToken(result.token)
      setExpiresAt(result.expiresAt)

      // Clear any existing messages when generating a new email
      setMessages([])

      // Start polling for messages
      startPolling(result.token)
    } catch (error) {
      console.error("Error generating temp email:", error)
      setError("Failed to generate temporary email. Please try again.")
      Alert.alert("Error", "Failed to generate temporary email. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Start polling for new messages
  const startPolling = (currentToken) => {
    // Clear any existing polling interval
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current)
    }

    // Set up new polling interval
    pollingInterval.current = setInterval(async () => {
      if (currentToken) {
        try {
          setIsLoadingMessages(true)
          const newMessages = await fetchMessages(currentToken)
          setMessages(newMessages.map(formatMessage))
        } catch (error) {
          console.error("Error fetching messages:", error)
        } finally {
          setIsLoadingMessages(false)
        }
      }
    }, 10000) // Poll every 10 seconds

    // Trigger an immediate fetch
    fetchMessages(currentToken)
      .then((newMessages) => setMessages(newMessages.map(formatMessage)))
      .catch((error) => console.error("Error fetching messages:", error))
  }

  // Handle manual refresh
  const onRefresh = async () => {
    if (!token) return

    setRefreshing(true)
    try {
      const newMessages = await fetchMessages(token)
      setMessages(newMessages.map(formatMessage))
    } catch (error) {
      console.error("Error refreshing messages:", error)
      Alert.alert("Error", "Failed to refresh messages. Please try again.")
    } finally {
      setRefreshing(false)
    }
  }

  // Copy email to clipboard
  const copyToClipboard = () => {
    if (tempEmail) {
      if (Platform.OS === "web") {
        navigator.clipboard.writeText(tempEmail)
      } else {
        Clipboard.setString(tempEmail)
      }
      Alert.alert("Copied", "Email address copied to clipboard!")
    }
  }

  // Format expiration time
  const formatExpirationTime = () => {
    if (!expiresAt) return ""

    const expiry = new Date(expiresAt)
    return expiry.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current)
      }
    }
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.appName}>CyberGuard</Text>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Temporary Email</Text>
              <Text style={styles.subtitle}>
                Generate a disposable email address to protect your privacy when signing up for services
              </Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
              onPress={handleGenerateEmail}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.generateButtonText}>Generating...</Text>
                </View>
              ) : (
                <Text style={styles.generateButtonText}>Generate Temp Email</Text>
              )}
            </TouchableOpacity>

            {tempEmail && (
              <View style={styles.emailCard}>
                <Text style={styles.emailCardTitle}>Your Temporary Email</Text>
                <Text style={styles.emailAddress}>{tempEmail}</Text>
                <View style={styles.emailInfoRow}>
                  <Text style={styles.emailInfoText}>Expires at: {formatExpirationTime()}</Text>
                  <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
                    <Text style={styles.copyButtonText}>Copy</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {tempEmail && (
              <View style={styles.inboxSection}>
                <View style={styles.inboxHeader}>
                  <Text style={styles.inboxTitle}>Inbox</Text>
                  {isLoadingMessages && !refreshing && <ActivityIndicator size="small" color="#5E72E4" />}
                </View>

                <ScrollView
                  style={styles.messagesList}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor="#fff"
                      colors={["#5E72E4"]}
                    />
                  }
                >
                  {messages.length === 0 ? (
                    <View style={styles.emptyInbox}>
                      <Text style={styles.emptyInboxText}>
                        No messages yet. Pull down to refresh or wait for automatic updates.
                      </Text>
                    </View>
                  ) : (
                    messages.map((message) => (
                      <View key={message.id} style={styles.messageItem}>
                        <View style={styles.messageHeader}>
                          <Text style={styles.messageSender}>{message.sender}</Text>
                          {!message.read && <View style={styles.unreadIndicator} />}
                        </View>
                        <Text style={styles.messageSubject}>{message.subject}</Text>
                        {message.intro && (
                          <Text style={styles.messageIntro} numberOfLines={2}>
                            {message.intro}
                          </Text>
                        )}
                      </View>
                    ))
                  )}
                </ScrollView>

                <Text style={styles.pollingInfo}>Inbox updates automatically every 10 seconds</Text>
              </View>
            )}

            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>How It Works</Text>
              <Text style={styles.infoCardText}>
                Temporary emails help protect your privacy by providing a disposable address for one-time signups. Use
                this feature when you need to verify an account but don't want to share your personal email.
              </Text>
              <Text style={styles.infoCardText}>
                The temporary email will expire after 1 hour, and all messages will be deleted.
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(18, 24, 38, 0.92)",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 20,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  titleContainer: {
    marginBottom: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 22,
  },
  errorContainer: {
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#E53935",
  },
  errorText: {
    color: "#E53935",
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: "#5E72E4",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 25,
    elevation: 2,
    shadowColor: "#5E72E4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  generateButtonDisabled: {
    backgroundColor: "rgba(94, 114, 228, 0.5)",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  emailCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#5E72E4",
  },
  emailCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  emailAddress: {
    fontSize: 18,
    color: "#5E72E4",
    fontWeight: "600",
    marginBottom: 15,
    padding: 12,
    backgroundColor: "rgba(94, 114, 228, 0.1)",
    borderRadius: 8,
    overflow: "hidden",
    textAlign: "center",
  },
  emailInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  emailInfoText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  copyButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  inboxSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    flex: 1,
  },
  inboxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  inboxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  messagesList: {
    flex: 1,
    marginBottom: 10,
  },
  emptyInbox: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyInboxText: {
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
  },
  messageItem: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5E72E4",
  },
  messageSubject: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  messageIntro: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  pollingInfo: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  infoCardText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
    marginBottom: 10,
  },
})

