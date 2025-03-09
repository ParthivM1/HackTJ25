"use client";

import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";

// Constants for Twilio server
const TWILIO_SERVER_URL = "http://10.180.0.129:5001";
const PERSONAL_NUMBER = "+12029972969";

export default function KeywordSearchScreen({ navigation }) {
  const [keyword, setKeyword] = useState(""); 
  const [displayKeyword, setDisplayKeyword] = useState(""); 
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPassword = async () => {
      const retrievedPassword = "g2afree"; 
      setKeyword(retrievedPassword);
      setDisplayKeyword("*".repeat(retrievedPassword.length)); // Mask it
    };
    fetchPassword();
  }, []);

  // Handle changes in the TextInput
  const handleKeywordChange = (text) => {
    if (text === displayKeyword) return; // Ignore if it's just the masked value
    setDisplayKeyword(text); // Show what the user types temporarily
    // If the user clears it or types something new, update the real keyword
    if (!text || text.match(/^\*+$/)) {
      setKeyword(""); // Clear real value if all asterisks or empty
      setDisplayKeyword(""); // Clear display
    } else {
      setKeyword(text); // Update real value with actual input
    }
  };

  // Handle focus: Show real value when editing starts
  const handleFocus = () => {
    setDisplayKeyword(keyword); // Show real password when focused
  };

  // Handle blur: Mask again when done editing
  const handleBlur = () => {
    if (keyword) {
      setDisplayKeyword("*".repeat(keyword.length)); // Mask it again
    }
  };

  const scanKeyword = async () => {
    if (!keyword.trim()) {
      Alert.alert("Error", "Please enter a keyword to scan");
      return;
    }

    setIsSearching(true);
    setError(null);
    setSearchResults(null);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60-second timeout

      console.log("Sending request to:", `http://10.180.0.129:8000/scan-and-log`);
      const response = await fetch(`http://10.180.0.129:8000/scan-and-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ keyword: keyword.trim() }), // Use real keyword
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response:", data);
      setSearchResults(data);

      // Check if risk level is High and trigger phone alert
      if (data.riskLevel === "High") {
        await triggerPhoneAlert(data);
      }
    } catch (err) {
      console.error("Error scanning keyword:", err);
      setError(err.message || "Failed to scan keyword. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const triggerPhoneAlert = async (scanData) => {
    try {
      console.log("Sending high-risk alert to Twilio server:", TWILIO_SERVER_URL);
      const response = await fetch(`${TWILIO_SERVER_URL}/start-call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alertId: `high-risk-${Date.now()}`,
          alertType: "High Risk Keyword Detected",
          phoneNumber: PERSONAL_NUMBER,
          message: `High risk detected for keyword "${scanData.keyword || keyword.trim()}". Please check the CyberGuard app immediately.`,
        }),
      });

      if (!response.ok) {
        throw new Error(`Twilio server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Twilio server response:", data);
      Alert.alert("High Risk Alert", "A phone call has been initiated due to a high-risk detection.");
    } catch (error) {
      console.error("Error triggering phone alert:", error);
      Alert.alert("Alert Error", "Failed to initiate phone call for high-risk alert.", [{ text: "OK" }]);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "High":
        return "#E53935";
      case "Medium":
        return "#FFA000";
      case "Low":
        return "#43A047";
      case "N/A":
      default:
        return "#757575";
    }
  };

  const displayResults = () => {
    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      );
    }
    if (isSearching) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5E72E4" />
          <Text style={styles.loadingText}>Scanning blockchain records... This may take up to a minute.</Text>
        </View>
      );
    }
    if (!searchResults) {
      return null;
    }

    const riskLevel = searchResults.riskLevel || "N/A";

    return (
      <View style={styles.resultsSection}>
        <View style={styles.resultsSummaryCard}>
          <Text style={styles.resultsSummaryTitle}>
            Scan Results for "{searchResults.keyword || keyword.trim()}"
          </Text>
          <Text style={styles.resultsSummaryTimestamp}>
            Scanned on:{" "}
            {searchResults.timestamp
              ? new Date(searchResults.timestamp).toLocaleString()
              : new Date().toLocaleString()}
          </Text>

          <View style={styles.riskLevelContainer}>
            <Text style={styles.riskLevelLabel}>Risk Level:</Text>
            <View
              style={[
                styles.riskBadge,
                {
                  backgroundColor: getRiskColor(riskLevel) + "20",
                  borderColor: getRiskColor(riskLevel),
                },
              ]}
            >
              <Text style={[styles.riskText, { color: getRiskColor(riskLevel) }]}>
                {riskLevel} Risk
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Certificate:</Text>
          <ScrollView style={styles.certificateContainer}>
            <Text style={styles.certificateText}>{searchResults.certificate || "No certificate available"}</Text>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.newSearchButton}
          onPress={() => {
            setKeyword("");
            setDisplayKeyword("");
            setSearchResults(null);
            setError(null);
          }}
        >
          <Text style={styles.newSearchButtonText}>New Search</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
                <Text style={styles.title}>Keyword Security Scanner</Text>
                <Text style={styles.subtitle}>
                  Check if your keywords have been exposed in data breaches or are being used in malicious contexts
                </Text>
              </View>

              <View style={styles.searchCard}>
                <Text style={styles.searchCardTitle}>Your Password</Text>
                <Text style={styles.searchCardText}>
                  Your password is automatically scanned for security risks. Edit it if needed and scan again.
                </Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter keyword to scan..."
                    placeholderTextColor="rgba(255, 255, 255, 0.5)"
                    value={displayKeyword}
                    onChangeText={handleKeywordChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <TouchableOpacity
                    style={[styles.scanButton, isSearching && styles.scanButtonDisabled]}
                    onPress={scanKeyword}
                    disabled={isSearching}
                  >
                    <Text style={styles.scanButtonText}>{isSearching ? "Scanning..." : "Scan Password"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {displayResults()}

              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>How It Works</Text>
                <Text style={styles.infoText}>
                  Our blockchain-based security scanner uses advanced algorithms to search through known data breaches,
                  dark web marketplaces, and hacking forums to check if your password has been compromised.
                </Text>
                <Text style={styles.infoText}>
                  This helps you identify potential security risks and take proactive measures to protect your digital
                  identity.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
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
  searchCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#5E72E4",
  },
  searchCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  searchCardText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 22,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
    marginBottom: 15,
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
  scanButtonDisabled: {
    backgroundColor: "rgba(94, 114, 228, 0.5)",
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  errorContainer: {
    backgroundColor: "rgba(229, 57, 53, 0.1)",
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#E53935",
  },
  errorText: {
    color: "#E53935",
    fontSize: 14,
  },
  resultsSection: {
    marginBottom: 25,
  },
  resultsSummaryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  resultsSummaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  resultsSummaryTimestamp: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 15,
  },
  riskLevelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  riskLevelLabel: {
    fontSize: 16,
    color: "#fff",
    marginRight: 10,
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  riskText: {
    fontSize: 14,
    fontWeight: "600",
  },
  detailsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  certificateContainer: {
    maxHeight: 200,
  },
  certificateText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  newSearchButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  newSearchButtonText: {
    color: "#5E72E4",
    fontSize: 16,
    fontWeight: "600",
  },
  infoSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 20,
    marginBottom: 10,
  },
});