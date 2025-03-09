"use client"

import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
  ImageBackground,
} from "react-native"
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
      <StatusBar style="light" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.header}>
              <Text style={styles.appName}>CyberGuard</Text>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
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
  scrollContainer: {
    flexGrow: 1,
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
    color: "#fff",
    marginBottom: 10,
  },
  scanProgressText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#5E72E4",
    marginBottom: 10,
  },
  progressBarContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 15,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#5E72E4",
  },
  scanningDetailsText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  resultsSection: {
    marginTop: 10,
  },
  resultsSummaryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  resultsSummaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
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
    color: "#fff",
    marginBottom: 5,
  },
  resultsSummaryLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  vulnerabilityCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    color: "#fff",
  },
  vulnerabilityType: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
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
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  vulnerabilityDetailsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 5,
    marginTop: 8,
  },
  vulnerabilityIssue: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 3,
  },
  vulnerabilityRecommendation: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 3,
  },
  fixButton: {
    backgroundColor: "#5E72E4",
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
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  networkStatusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  networkStatusLabel: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  networkStatusValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  rescanButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  rescanButtonText: {
    color: "#5E72E4",
    fontSize: 16,
    fontWeight: "600",
  },
})

