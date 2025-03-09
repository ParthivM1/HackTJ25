"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Animated, Easing } from "react-native"
import { StatusBar } from "expo-status-bar"

export default function SmartHomeSecurityScreen({ navigation }) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanResults, setScanResults] = useState(null)
  const [animatedValue] = useState(new Animated.Value(0))

  // Simulate a network scan
  const startScan = () => {
    setIsScanning(true)
    setScanProgress(0)
    setScanResults(null)

    // Reset animation value
    animatedValue.setValue(0)

    // Start the progress animation
    Animated.timing(animatedValue, {
      toValue: 100,
      duration: 8000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()

    // Update progress state for UI
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = prev + 100 / 80 // 80 steps to reach 100%
        return newProgress > 100 ? 100 : newProgress
      })
    }, 100)

    // Simulate scan completion after 8 seconds
    setTimeout(() => {
      clearInterval(progressInterval)
      setIsScanning(false)
      setScanProgress(100)

      // Generate simulated scan results
      const simulatedResults = {
        devicesFound: Math.floor(Math.random() * 10) + 5, // 5-15 devices
        vulnerabilities: [
          {
            deviceName: "Smart TV",
            deviceType: "Entertainment",
            riskLevel: "Medium",
            issues: ["Outdated firmware", "Default password not changed"],
            recommendations: ["Update firmware to latest version", "Change default password"],
          },
          {
            deviceName: "Smart Speaker",
            deviceType: "Voice Assistant",
            riskLevel: "Low",
            issues: ["Open microphone permissions"],
            recommendations: ["Review privacy settings", "Disable always-on listening"],
          },
          {
            deviceName: "Wi-Fi Router",
            deviceType: "Network",
            riskLevel: "High",
            issues: ["WEP encryption", "Remote management enabled", "Default admin credentials"],
            recommendations: ["Switch to WPA3 encryption", "Disable remote management", "Change admin credentials"],
          },
          {
            deviceName: "Smart Thermostat",
            deviceType: "Climate Control",
            riskLevel: "Low",
            issues: ["Insecure API connections"],
            recommendations: ["Update to latest firmware"],
          },
        ],
        networkStatus: {
          encryption: Math.random() > 0.7 ? "WEP" : "WPA2",
          firewall: Math.random() > 0.3,
          guestNetwork: Math.random() > 0.5,
          upnpEnabled: Math.random() > 0.4,
        },
        securityScore: Math.floor(Math.random() * 40) + 60, // 60-100
      }

      setScanResults(simulatedResults)
    }, 8000)
  }

  // Calculate the interpolated width for the progress bar
  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  })

  // Get risk level color
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
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
            <Text style={styles.title}>Smart Home Security Scanner</Text>
            <Text style={styles.subtitle}>Scan your home network for potential security vulnerabilities</Text>
          </View>

          <View style={styles.scannerCard}>
            <Text style={styles.scannerCardTitle}>Network Scanner</Text>
            <Text style={styles.scannerCardText}>
              This scanner will check your home network for connected devices and identify potential security
              vulnerabilities. The scan takes approximately 8 seconds to complete.
            </Text>

            {isScanning ? (
              <View style={styles.scanningContainer}>
                <Text style={styles.scanningText}>Scanning your network...</Text>
                <Text style={styles.scanProgressText}>{Math.floor(scanProgress)}%</Text>

                <View style={styles.progressBarContainer}>
                  <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
                </View>

                <Text style={styles.scanningDetailsText}>Checking for connected devices and vulnerabilities</Text>
              </View>
            ) : (
              <TouchableOpacity style={styles.scanButton} onPress={startScan}>
                <Text style={styles.scanButtonText}>Start Network Scan</Text>
              </TouchableOpacity>
            )}
          </View>

          {scanResults && (
            <View style={styles.resultsSection}>
              <View style={styles.resultsSummaryCard}>
                <Text style={styles.resultsSummaryTitle}>Scan Results</Text>

                <View style={styles.resultsSummaryRow}>
                  <View style={styles.resultsSummaryItem}>
                    <Text style={styles.resultsSummaryValue}>{scanResults.devicesFound}</Text>
                    <Text style={styles.resultsSummaryLabel}>Devices Found</Text>
                  </View>

                  <View style={styles.resultsSummaryItem}>
                    <Text style={styles.resultsSummaryValue}>{scanResults.vulnerabilities.length}</Text>
                    <Text style={styles.resultsSummaryLabel}>Vulnerabilities</Text>
                  </View>

                  <View style={styles.resultsSummaryItem}>
                    <Text
                      style={[
                        styles.resultsSummaryValue,
                        {
                          color:
                            scanResults.securityScore > 80
                              ? "#43A047"
                              : scanResults.securityScore > 70
                                ? "#FFA000"
                                : "#E53935",
                        },
                      ]}
                    >
                      {scanResults.securityScore}%
                    </Text>
                    <Text style={styles.resultsSummaryLabel}>Security Score</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Vulnerabilities Found</Text>

              {scanResults.vulnerabilities.map((vulnerability, index) => (
                <View key={index} style={styles.vulnerabilityCard}>
                  <View style={styles.vulnerabilityHeader}>
                    <View>
                      <Text style={styles.vulnerabilityDevice}>{vulnerability.deviceName}</Text>
                      <Text style={styles.vulnerabilityType}>{vulnerability.deviceType}</Text>
                    </View>
                    <View
                      style={[
                        styles.riskBadge,
                        {
                          backgroundColor: getRiskColor(vulnerability.riskLevel) + "20",
                          borderColor: getRiskColor(vulnerability.riskLevel),
                        },
                      ]}
                    >
                      <Text style={[styles.riskText, { color: getRiskColor(vulnerability.riskLevel) }]}>
                        {vulnerability.riskLevel} Risk
                      </Text>
                    </View>
                  </View>

                  <View style={styles.vulnerabilityDetails}>
                    <Text style={styles.vulnerabilityDetailsTitle}>Issues:</Text>
                    {vulnerability.issues.map((issue, i) => (
                      <Text key={i} style={styles.vulnerabilityIssue}>
                        • {issue}
                      </Text>
                    ))}

                    <Text style={styles.vulnerabilityDetailsTitle}>Recommendations:</Text>
                    {vulnerability.recommendations.map((rec, i) => (
                      <Text key={i} style={styles.vulnerabilityRecommendation}>
                        • {rec}
                      </Text>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.fixButton}>
                    <Text style={styles.fixButtonText}>Fix Issues</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <Text style={styles.sectionTitle}>Network Status</Text>

              <View style={styles.networkStatusCard}>
                <View style={styles.networkStatusItem}>
                  <Text style={styles.networkStatusLabel}>Encryption:</Text>
                  <Text
                    style={[
                      styles.networkStatusValue,
                      { color: scanResults.networkStatus.encryption === "WPA2" ? "#43A047" : "#E53935" },
                    ]}
                  >
                    {scanResults.networkStatus.encryption}
                  </Text>
                </View>

                <View style={styles.networkStatusItem}>
                  <Text style={styles.networkStatusLabel}>Firewall:</Text>
                  <Text
                    style={[
                      styles.networkStatusValue,
                      { color: scanResults.networkStatus.firewall ? "#43A047" : "#E53935" },
                    ]}
                  >
                    {scanResults.networkStatus.firewall ? "Enabled" : "Disabled"}
                  </Text>
                </View>

                <View style={styles.networkStatusItem}>
                  <Text style={styles.networkStatusLabel}>Guest Network:</Text>
                  <Text style={styles.networkStatusValue}>
                    {scanResults.networkStatus.guestNetwork ? "Enabled" : "Disabled"}
                  </Text>
                </View>

                <View style={styles.networkStatusItem}>
                  <Text style={styles.networkStatusLabel}>UPnP:</Text>
                  <Text
                    style={[
                      styles.networkStatusValue,
                      { color: scanResults.networkStatus.upnpEnabled ? "#FFA000" : "#43A047" },
                    ]}
                  >
                    {scanResults.networkStatus.upnpEnabled ? "Enabled" : "Disabled"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.rescanButton} onPress={startScan}>
                <Text style={styles.rescanButtonText}>Scan Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
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
  scannerCard: {
    backgroundColor: "#f5f9ff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  scannerCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  scannerCardText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  scanningContainer: {
    alignItems: "center",
  },
  scanningText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  scanProgressText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 10,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 15,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4A90E2",
  },
  scanningDetailsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  resultsSection: {
    marginTop: 10,
  },
  resultsSummaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  resultsSummaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  resultsSummaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultsSummaryItem: {
    alignItems: "center",
    flex: 1,
  },
  resultsSummaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  resultsSummaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  vulnerabilityCard: {
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
  vulnerabilityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  vulnerabilityDevice: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  vulnerabilityType: {
    fontSize: 14,
    color: "#666",
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  riskText: {
    fontSize: 12,
    fontWeight: "600",
  },
  vulnerabilityDetails: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  vulnerabilityDetailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    marginTop: 8,
  },
  vulnerabilityIssue: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  vulnerabilityRecommendation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  fixButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  fixButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  networkStatusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  networkStatusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  networkStatusLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  networkStatusValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  rescanButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  rescanButtonText: {
    color: "#4A90E2",
    fontSize: 16,
    fontWeight: "600",
  },
})

