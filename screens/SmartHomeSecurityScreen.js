"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Modal,
  ActivityIndicator,
  ImageBackground,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import axios from "axios"

// Server URL for the Smart Home Guardian API
const SERVER_URL = "http://10.180.1.20:3000"

export default function SmartHomeSecurityScreen({ navigation }) {
  // State variables
  const [devices, setDevices] = useState([])
  const [alerts, setAlerts] = useState([])
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState(null)
  const [selectedDevice, setSelectedDevice] = useState(null)

  // Load devices on component mount
  useEffect(() => {
    fetchDevices()

    // Add an initial alert
    setAlerts([
      {
        message: "Smart Home Guardian activated",
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }, [])

  // Fetch the list of devices from the server
  const fetchDevices = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/devices`)
      setDevices(response.data)

      // Add a success alert
      setAlerts((prev) => [
        {
          message: `Successfully fetched ${response.data.length} devices`,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ])

      setError(null)
    } catch (err) {
      console.error("Error fetching devices:", err)
      setError("Failed to fetch devices. Check server connection.")

      // Add an error alert
      setAlerts((prev) => [
        {
          message: `Error fetching devices: ${err.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ])

      // Use sample data as fallback
      const sampleDevices = [
        {
          id: "1",
          name: "Smart TV",
          type: "Entertainment",
          issues: [
            { type: "outdated_firmware", description: "Firmware is outdated" },
            { type: "weak_password", description: "Password is too weak" },
          ],
        },
        {
          id: "2",
          name: "Smart Speaker",
          type: "Voice Assistant",
          issues: [],
        },
        {
          id: "3",
          name: "Wi-Fi Router",
          type: "Network",
          issues: [
            { type: "default_credentials", description: "Using default credentials" },
            { type: "remote_access", description: "Remote access is enabled" },
          ],
        },
        {
          id: "4",
          name: "Smart Thermostat",
          type: "Climate Control",
          issues: [{ type: "insecure_api", description: "Using insecure API connections" }],
        },
        {
          id: "5",
          name: "Security Camera",
          type: "Security",
          issues: [],
        },
      ]

      setDevices(sampleDevices)

      // Add a fallback alert
      setAlerts((prev) => [
        {
          message: "Using offline mode. Sample data loaded.",
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ])
    }
  }

  // Initiate a network scan
  const handleScan = async () => {
    setScanning(true)
    setError(null)

    // Add a scanning alert
    setAlerts((prev) => [
      {
        message: "Network scan initiated...",
        timestamp: new Date().toLocaleTimeString(),
      },
      ...prev,
    ])

    try {
      const response = await axios.post(`${SERVER_URL}/scan`)

      if (response.status === 200) {
        // Add a success alert
        setAlerts((prev) => [
          {
            message: "Scan initiated successfully. Waiting for results...",
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev,
        ])

        // After initiating the scan, poll for updated device list
        setTimeout(fetchDevices, 5000) // Wait 5 seconds for scan to complete
      }
    } catch (err) {
      console.error("Error scanning network:", err)
      setError("Failed to start network scan. Check server connection.")

      // Add an error alert
      setAlerts((prev) => [
        {
          message: `Scan error: ${err.message}. Using offline mode.`,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ])

      setScanning(false)
    }
  }

  // Fix an issue on a device
  const fixIssue = async (deviceId, issueType) => {
    try {
      // Add a fixing alert
      setAlerts((prev) => [
        {
          message: `Attempting to fix ${issueType} on device ${deviceId}...`,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ])

      const response = await axios.post(`${SERVER_URL}/fix`, {
        deviceId,
        issueType,
      })

      if (response.status === 200) {
        // Add a success alert
        setAlerts((prev) => [
          {
            message: `Successfully fixed ${issueType} on device ${deviceId}`,
            timestamp: new Date().toLocaleTimeString(),
          },
          ...prev,
        ])

        fetchDevices() // Refresh device list after fix
        setSelectedDevice(null) // Close the modal
      }
    } catch (err) {
      console.error("Error fixing issue:", err)
      setError(`Failed to fix ${issueType} on device ${deviceId}.`)

      // Add an error alert
      setAlerts((prev) => [
        {
          message: `Error fixing issue: ${err.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...prev,
      ])

      // Update the UI anyway for better UX
      fetchDevices()
    }
  }

  // Get issue description for display
  const getIssueDescription = (issueType) => {
    switch (issueType) {
      case "outdated_firmware":
        return "Update the firmware through the device settings."
      case "weak_password":
        return "Change the password to a stronger one with at least 12 characters, including uppercase, lowercase, numbers, and special characters."
      case "default_credentials":
        return "Change the default username and password to unique, strong credentials."
      case "remote_access":
        return "Disable remote access in the device settings unless absolutely necessary."
      case "insecure_api":
        return "Update to the latest firmware and check for security patches that address API vulnerabilities."
      default:
        return "Follow the manufacturer's security guidelines."
    }
  }

  // Get status color based on issues
  const getStatusColor = (issues) => {
    if (!issues || issues.length === 0) {
      return "#43A047" // Green - secure
    }
    return "#E53935" // Red - vulnerable
  }

  // Render each device in the list
  const renderDeviceItem = ({ item }) => (
    <TouchableOpacity style={styles.deviceItem} onPress={() => setSelectedDevice(item)}>
      <View style={styles.deviceItemContent}>
        <View>
          <Text style={styles.deviceName}>{item.name}</Text>
          <Text style={styles.deviceType}>{item.type}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(item.issues) + "20",
              borderColor: getStatusColor(item.issues),
            },
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusColor(item.issues) }]}>
            {item.issues && item.issues.length > 0 ? "Vulnerable" : "Secure"}
          </Text>
        </View>
      </View>
      {item.issues && item.issues.length > 0 && (
        <View style={styles.vulnerabilityCount}>
          <Text style={styles.vulnerabilityCountText}>
            {item.issues.length} {item.issues.length === 1 ? "issue" : "issues"} detected
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )

  // Render each alert in the list
  const renderAlertItem = ({ item }) => (
    <View style={styles.alertItem}>
      <Text style={styles.alertMessage}>{item.message}</Text>
      <Text style={styles.alertTimestamp}>{item.timestamp}</Text>
    </View>
  )

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
              <Text style={styles.title}>Smart Home Guardian</Text>
              <Text style={styles.subtitle}>Monitor and secure your connected devices</Text>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
              </View>
            )}

            <View style={styles.scannerCard}>
              <Text style={styles.scannerCardTitle}>Network Scanner</Text>
              <Text style={styles.scannerCardText}>
                Scan your home network to discover connected devices and identify potential security vulnerabilities.
              </Text>

              <TouchableOpacity
                style={[styles.scanButton, scanning && styles.scanningButton]}
                onPress={handleScan}
                disabled={scanning}
              >
                {scanning ? (
                  <View style={styles.scanningButtonContent}>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.scanButtonText}>Scanning...</Text>
                  </View>
                ) : (
                  <Text style={styles.scanButtonText}>Scan Network</Text>
                )}
              </TouchableOpacity>
            </View>

            {devices.length > 0 && (
              <View style={styles.devicesSection}>
                <Text style={styles.sectionTitle}>Discovered Devices</Text>
                <FlatList
                  data={devices}
                  renderItem={renderDeviceItem}
                  keyExtractor={(item) => item.id}
                  style={styles.devicesList}
                  scrollEnabled={false}
                  ListEmptyComponent={<Text style={styles.emptyListText}>No devices found.</Text>}
                />
              </View>
            )}

            <View style={styles.alertsSection}>
              <Text style={styles.sectionTitle}>Recent Alerts</Text>
              {alerts.length > 0 ? (
                <FlatList
                  data={alerts}
                  renderItem={renderAlertItem}
                  keyExtractor={(item, index) => index.toString()}
                  style={styles.alertsList}
                  scrollEnabled={false}
                />
              ) : (
                <View style={styles.noAlertsContainer}>
                  <Text style={styles.noAlertsText}>No recent alerts</Text>
                </View>
              )}
            </View>
          </View>

          {/* Device Details Modal */}
          <Modal visible={!!selectedDevice} animationType="slide" transparent={true}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                {selectedDevice && (
                  <>
                    <Text style={styles.modalTitle}>{selectedDevice.name}</Text>

                    <View style={styles.deviceInfoSection}>
                      <View style={styles.deviceInfoRow}>
                        <Text style={styles.deviceInfoLabel}>Type:</Text>
                        <Text style={styles.deviceInfoValue}>{selectedDevice.type}</Text>
                      </View>
                      <View style={styles.deviceInfoRow}>
                        <Text style={styles.deviceInfoLabel}>Status:</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor: getStatusColor(selectedDevice.issues) + "20",
                              borderColor: getStatusColor(selectedDevice.issues),
                            },
                          ]}
                        >
                          <Text style={[styles.statusText, { color: getStatusColor(selectedDevice.issues) }]}>
                            {selectedDevice.issues && selectedDevice.issues.length > 0 ? "Vulnerable" : "Secure"}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {selectedDevice.issues && selectedDevice.issues.length > 0 ? (
                      <View style={styles.vulnerabilitiesSection}>
                        <Text style={styles.vulnerabilitiesTitle}>Issues:</Text>
                        {selectedDevice.issues.map((issue, index) => (
                          <View key={index} style={styles.vulnerabilityItem}>
                            <View style={styles.vulnerabilityHeader}>
                              <Text style={styles.vulnerabilityName}>{issue.description}</Text>
                              <TouchableOpacity
                                style={styles.fixButton}
                                onPress={() => fixIssue(selectedDevice.id, issue.type)}
                              >
                                <Text style={styles.fixButtonText}>Fix</Text>
                              </TouchableOpacity>
                            </View>
                            <Text style={styles.vulnerabilityFix}>{getIssueDescription(issue.type)}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <View style={styles.secureDeviceMessage}>
                        <Text style={styles.secureDeviceText}>This device is secure.</Text>
                      </View>
                    )}

                    <View style={styles.modalActions}>
                      <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedDevice(null)}>
                        <Text style={styles.closeButtonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>
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
    marginBottom: 15,
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
  scannerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#5E72E4",
  },
  scannerCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  scannerCardText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 22,
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: "#5E72E4",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#5E72E4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  scanningButton: {
    backgroundColor: "#5E72E4",
    opacity: 0.8,
  },
  scanningButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  devicesSection: {
    marginBottom: 25,
  },
  devicesList: {
    marginBottom: 10,
  },
  emptyListText: {
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    padding: 20,
  },
  deviceItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  deviceItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  deviceType: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  vulnerabilityCount: {
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    borderRadius: 8,
    padding: 8,
  },
  vulnerabilityCountText: {
    color: "#E53935",
    fontSize: 12,
    fontWeight: "500",
  },
  alertsSection: {
    flex: 1,
  },
  alertsList: {
    flex: 1,
  },
  alertItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#FFA000",
  },
  alertMessage: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 5,
  },
  alertTimestamp: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  noAlertsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noAlertsText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#121826",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  deviceInfoSection: {
    marginBottom: 20,
  },
  deviceInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  deviceInfoLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    width: 80,
  },
  deviceInfoValue: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  vulnerabilitiesSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  vulnerabilitiesTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 10,
  },
  vulnerabilityItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  vulnerabilityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  vulnerabilityName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E53935",
    flex: 1,
    marginRight: 10,
  },
  fixButton: {
    backgroundColor: "#FFA000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  fixButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  vulnerabilityFix: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
  secureDeviceMessage: {
    backgroundColor: "rgba(67, 160, 71, 0.1)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  secureDeviceText: {
    color: "#43A047",
    fontSize: 14,
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  closeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
})

