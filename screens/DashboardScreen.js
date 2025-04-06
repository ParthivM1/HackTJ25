import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import { StatusBar } from "expo-status-bar"

export default function DashboardScreen({ route, navigation }) {
  // Get the email and name from route params
  const { email, name } = route.params || { email: "User", name: "" }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.appName}>MyApp</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome{name ? ", " + name : ""}!</Text>
            <Text style={styles.welcomeEmail}>{email}</Text>
            <Text style={styles.welcomeMessage}>
              You have successfully logged into your account. You can now access all the features of the app.
            </Text>
          </View>

          <View style={styles.securityFeaturesSection}>
            <Text style={styles.sectionTitle}>Security Features</Text>

            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate("BlockchainSecurity")}>
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "#E3F2FD" }]}>
                  <Text style={[styles.featureIconText, { color: "#1976D2" }]}>🔐</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Blockchain & Online Security</Text>
                <Text style={styles.featureDescription}>
                  Monitor your digital footprint and see which sites have access to your data
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate("SmartHomeSecurity")}>
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "#E8F5E9" }]}>
                  <Text style={[styles.featureIconText, { color: "#388E3C" }]}>🏠</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Smart Home Security Scanner</Text>
                <Text style={styles.featureDescription}>
                  Scan your home network for potential security vulnerabilities
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate("RoamAlert")}>
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "#FFF3E0" }]}>
                  <Text style={[styles.featureIconText, { color: "#E64A19" }]}>📞</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Security Alert System</Text>
                <Text style={styles.featureDescription}>
                  Receive automated calls and alerts for critical security breaches
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate("Chatbot")}>
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "#E8EAF6" }]}>
                  <Text style={[styles.featureIconText, { color: "#3949AB" }]}>🤖</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Security Assistant</Text>
                <Text style={styles.featureDescription}>
                  Chat with our AI assistant for personalized security advice
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate("KeywordSearch")}>
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "#E1F5FE" }]}>
                  <Text style={[styles.featureIconText, { color: "#0288D1" }]}>🔍</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Keyword Security Scanner</Text>
                <Text style={styles.featureDescription}>Check if your keywords have been exposed in data breaches</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.featureCard} onPress={() => navigation.navigate("TempEmail")}>
              <View style={styles.featureIconContainer}>
                <View style={[styles.featureIcon, { backgroundColor: "#F3E5F5" }]}>
                  <Text style={[styles.featureIconText, { color: "#9C27B0" }]}>📧</Text>
                </View>
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Temporary Email</Text>
                <Text style={styles.featureDescription}>
                  Generate disposable email addresses to protect your privacy
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Tasks</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Messages</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Notifications</Text>
            </View>
          </View>

          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Account Created</Text>
                <Text style={styles.activityTime}>Just now</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Profile Completed</Text>
                <Text style={styles.activityTime}>Just now</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.accountsButton} onPress={() => navigation.navigate("Accounts")}>
            <Text style={styles.accountsButtonText}>Manage Connected Accounts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Home")}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
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
    marginBottom: 30,
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeCard: {
    backgroundColor: "#f5f9ff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  welcomeEmail: {
    fontSize: 18,
    color: "#4A90E2",
    marginBottom: 12,
  },
  welcomeMessage: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  securityFeaturesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    marginRight: 16,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  featureIconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  activitySection: {
    marginBottom: 30,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4A90E2",
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  activityTime: {
    fontSize: 14,
    color: "#999",
  },
  accountsButton: {
    margin: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  accountsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    margin: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
})

