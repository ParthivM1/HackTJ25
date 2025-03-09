"use client"

import { useState, useRef } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Modal,
  Animated,
  Vibration,
  Platform,
  Alert,
} from "react-native"
import { StatusBar } from "expo-status-bar"

export default function RoamAlertScreen({ navigation }) {
  const [alertSettings, setAlertSettings] = useState({
    phoneCallAlerts: true,
    inAppAlerts: true,
    smsAlerts: false,
    emailAlerts: true,
  })

  const [alertHistory, setAlertHistory] = useState([
    {
      id: "alert-001",
      date: "2025-03-07T14:32:00",
      type: "Unauthorized Access",
      device: "Smart Home Hub",
      severity: "High",
      resolved: true,
    },
    {
      id: "alert-002",
      date: "2025-03-05T09:15:00",
      type: "Suspicious Login",
      device: "Google Account",
      severity: "Medium",
      resolved: true,
    },
  ])

  const [showAlert, setShowAlert] = useState(false)
  const [currentAlert, setCurrentAlert] = useState(null)
  const [simulatingCall, setSimulatingCall] = useState(false)

  // Animation values
  const alertAnimation = useRef(new Animated.Value(0)).current
  const callAnimation = useRef(new Animated.Value(0)).current

  // Toggle alert settings
  const toggleSetting = (setting) => {
    setAlertSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "#E53935"
      case "Medium":
        return "#FFA000"
      case "Low":
        return "#43A047"
      default:
        return "#757575"
    }
  }

  // Simulate receiving a security alert
  const simulateSecurityAlert = () => {
    const newAlert = {
      id: `alert-${Math.floor(Math.random() * 1000)}`,
      date: new Date().toISOString(),
      type: "Potential Data Breach",
      device: "Network Router",
      severity: "High",
      resolved: false,
      details:
        "Unusual outbound traffic detected from your network router. This could indicate a data breach or unauthorized access to your home network.",
    }

    setCurrentAlert(newAlert)
    setShowAlert(true)

    // Trigger vibration pattern for alert
    if (Platform.OS !== "web") {
      Vibration.vibrate([500, 300, 500])
    }

    // Start alert animation
    Animated.sequence([
      Animated.timing(alertAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(alertAnimation, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(alertAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }

  // Simulate phone call
  const simulatePhoneCall = () => {
    if (!alertSettings.phoneCallAlerts) {
      Alert.alert("Phone Calls Disabled", "Enable phone call alerts in settings to receive automated security calls.", [
        { text: "OK" },
      ])
      return
    }

    setSimulatingCall(true)

    // Animate the call indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(callAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(callAnimation, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start()

    // Simulate call duration
    setTimeout(() => {
      setSimulatingCall(false)
      callAnimation.setValue(0)

      // Add to history after call ends
      if (currentAlert) {
        setAlertHistory((prev) => [currentAlert, ...prev])
      }
    }, 5000)
  }

  // Handle alert response
  const handleAlertResponse = (action) => {
    setShowAlert(false)

    if (action === "view") {
      // In a real app, this would navigate to detailed alert info
      Alert.alert("Alert Details", currentAlert?.details || "No additional details available.", [{ text: "OK" }])
    }

    // Add to history
    if (currentAlert && !alertHistory.some((alert) => alert.id === currentAlert.id)) {
      setAlertHistory((prev) => [currentAlert, ...prev])
    }
  }

  // Resolve an alert
  const resolveAlert = (alertId) => {
    setAlertHistory((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, resolved: true } : alert)))
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.appName}>MyApp</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Security Alert System</Text>
            <Text style={styles.subtitle}>Receive real-time alerts for potential security breaches</Text>
          </View>

          {/* Alert Status Card */}
          <View style={styles.statusCard}>
            <Text style={styles.statusCardTitle}>Alert System Status</Text>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, { backgroundColor: "#43A047" }]} />
              <Text style={styles.statusText}>Active and Monitoring</Text>
            </View>
            <Text style={styles.statusDescription}>
              Your security alert system is active and monitoring for potential threats. You will receive alerts via
              your preferred notification methods.
            </Text>
          </View>

          {/* Alert Settings */}
          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Alert Preferences</Text>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingName}>Phone Call Alerts</Text>
                <Text style={styles.settingDescription}>Receive automated calls for critical security issues</Text>
              </View>
              <Switch
                trackColor={{ false: "#e0e0e0", true: "#BFD7ED" }}
                thumbColor={alertSettings.phoneCallAlerts ? "#4A90E2" : "#f4f3f4"}
                onValueChange={() => toggleSetting("phoneCallAlerts")}
                value={alertSettings.phoneCallAlerts}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingName}>In-App Alerts</Text>
                <Text style={styles.settingDescription}>Show alerts within the application</Text>
              </View>
              <Switch
                trackColor={{ false: "#e0e0e0", true: "#BFD7ED" }}
                thumbColor={alertSettings.inAppAlerts ? "#4A90E2" : "#f4f3f4"}
                onValueChange={() => toggleSetting("inAppAlerts")}
                value={alertSettings.inAppAlerts}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingName}>SMS Alerts</Text>
                <Text style={styles.settingDescription}>Receive text messages for security alerts</Text>
              </View>
              <Switch
                trackColor={{ false: "#e0e0e0", true: "#BFD7ED" }}
                thumbColor={alertSettings.smsAlerts ? "#4A90E2" : "#f4f3f4"}
                onValueChange={() => toggleSetting("smsAlerts")}
                value={alertSettings.smsAlerts}
              />
            </View>

            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingName}>Email Alerts</Text>
                <Text style={styles.settingDescription}>Receive email notifications for all alerts</Text>
              </View>
              <Switch
                trackColor={{ false: "#e0e0e0", true: "#BFD7ED" }}
                thumbColor={alertSettings.emailAlerts ? "#4A90E2" : "#f4f3f4"}
                onValueChange={() => toggleSetting("emailAlerts")}
                value={alertSettings.emailAlerts}
              />
            </View>
          </View>

          {/* Test Alert Buttons */}
          <View style={styles.testButtonsContainer}>
            <TouchableOpacity style={styles.testButton} onPress={simulateSecurityAlert}>
              <Text style={styles.testButtonText}>Simulate Security Alert</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.testButton, styles.callButton]}
              onPress={simulatePhoneCall}
              disabled={simulatingCall}
            >
              <Text style={styles.testButtonText}>
                {simulatingCall ? "Call in progress..." : "Simulate Phone Call Alert"}
              </Text>
            </TouchableOpacity>

            {simulatingCall && (
              <Animated.View style={[styles.callIndicator, { opacity: callAnimation }]}>
                <Text style={styles.callIndicatorText}>Simulating automated security call...</Text>
              </Animated.View>
            )}
          </View>

          {/* Alert History */}
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Alert History</Text>

            {alertHistory.length === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyHistoryText}>No alerts have been recorded yet.</Text>
              </View>
            ) : (
              alertHistory.map((alert) => (
                <View key={alert.id} style={styles.alertHistoryItem}>
                  <View style={styles.alertHistoryHeader}>
                    <View style={styles.alertHistoryInfo}>
                      <Text style={styles.alertHistoryType}>{alert.type}</Text>
                      <Text style={styles.alertHistoryDate}>{formatDate(alert.date)}</Text>
                    </View>
                    <View
                      style={[
                        styles.severityBadge,
                        {
                          backgroundColor: getSeverityColor(alert.severity) + "20",
                          borderColor: getSeverityColor(alert.severity),
                        },
                      ]}
                    >
                      <Text style={[styles.severityText, { color: getSeverityColor(alert.severity) }]}>
                        {alert.severity}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.alertHistoryDetails}>
                    <Text style={styles.alertHistoryDevice}>Device: {alert.device}</Text>
                    <Text style={styles.alertHistoryStatus}>Status: {alert.resolved ? "Resolved" : "Unresolved"}</Text>
                  </View>

                  {!alert.resolved && (
                    <TouchableOpacity style={styles.resolveButton} onPress={() => resolveAlert(alert.id)}>
                      <Text style={styles.resolveButtonText}>Mark as Resolved</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>

          {/* Integration Info */}
          <View style={styles.integrationInfoCard}>
            <Text style={styles.integrationInfoTitle}>About Roam API Integration</Text>
            <Text style={styles.integrationInfoText}>
              This feature uses Roam API and Twilio to automatically call you when security breaches are detected. The
              system will provide voice alerts with details about the potential threat.
            </Text>
            <Text style={styles.integrationInfoText}>
              To complete setup, upload your Roam/Twilio Python code to enable real automated calls from your Google
              Voice API phone number.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* In-App Alert Modal */}
      <Modal visible={showAlert} transparent={true} animationType="fade" onRequestClose={() => setShowAlert(false)}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.alertModal, { transform: [{ scale: alertAnimation }] }]}>
            <View style={styles.alertHeader}>
              <View style={[styles.alertIcon, { backgroundColor: "#E53935" }]}>
                <Text style={styles.alertIconText}>⚠️</Text>
              </View>
              <View style={styles.alertTitleContainer}>
                <Text style={styles.alertTitle}>Security Alert</Text>
                <Text style={styles.alertSubtitle}>{currentAlert?.type || "Potential Security Issue"}</Text>
              </View>
            </View>

            <View style={styles.alertContent}>
              <Text style={styles.alertMessage}>
                {currentAlert?.details ||
                  "A potential security issue has been detected with your connected devices or accounts."}
              </Text>

              <Text style={styles.alertInfo}>Device: {currentAlert?.device || "Unknown"}</Text>
              <Text style={styles.alertInfo}>Severity: {currentAlert?.severity || "High"}</Text>
              <Text style={styles.alertInfo}>Time: {currentAlert ? formatDate(currentAlert.date) : "Just now"}</Text>
            </View>

            <View style={styles.alertActions}>
              <TouchableOpacity
                style={[styles.alertButton, styles.alertSecondaryButton]}
                onPress={() => handleAlertResponse("dismiss")}
              >
                <Text style={styles.alertSecondaryButtonText}>Dismiss</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.alertButton, styles.alertPrimaryButton]}
                onPress={() => handleAlertResponse("view")}
              >
                <Text style={styles.alertPrimaryButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.alertFooter}>
              <Text style={styles.alertFooterText}>
                {alertSettings.phoneCallAlerts
                  ? "You will also receive an automated phone call about this alert."
                  : "Phone call alerts are currently disabled."}
              </Text>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  titleContainer: {
    marginBottom: 25,
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
  statusCard: {
    backgroundColor: "#f5f9ff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  statusCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statusDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  settingName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  testButtonsContainer: {
    marginBottom: 25,
  },
  testButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginBottom: 12,
  },
  callButton: {
    backgroundColor: (simulatingCall) => (simulatingCall ? "#999" : "#E53935"),
  },
  testButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  callIndicator: {
    backgroundColor: "#E53935",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginTop: 5,
  },
  callIndicatorText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  historySection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  emptyHistory: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  emptyHistoryText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  alertHistoryItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  alertHistoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  alertHistoryInfo: {
    flex: 1,
  },
  alertHistoryType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  alertHistoryDate: {
    fontSize: 14,
    color: "#666",
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "600",
  },
  alertHistoryDetails: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  alertHistoryDevice: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  alertHistoryStatus: {
    fontSize: 14,
    color: "#333",
  },
  resolveButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  resolveButtonText: {
    color: "#4A90E2",
    fontSize: 14,
    fontWeight: "600",
  },
  integrationInfoCard: {
    backgroundColor: "#f5f9ff",
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  integrationInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  integrationInfoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  alertModal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: "100%",
    maxWidth: 500,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffebee",
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  alertIconText: {
    fontSize: 20,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  alertSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  alertContent: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  alertMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    lineHeight: 22,
  },
  alertInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  alertActions: {
    flexDirection: "row",
    padding: 16,
  },
  alertButton: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  alertPrimaryButton: {
    backgroundColor: "#E53935",
  },
  alertSecondaryButton: {
    backgroundColor: "#f5f5f5",
  },
  alertPrimaryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  alertSecondaryButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  alertFooter: {
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  alertFooterText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
})

