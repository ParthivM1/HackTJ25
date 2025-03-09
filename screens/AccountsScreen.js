"use client"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../context/AuthContext"

export default function AccountsScreen({ navigation }) {
  const {
    googleUser,
    facebookUser,
    isLoadingGoogle,
    isLoadingFacebook,
    connectGoogle,
    connectFacebook,
    disconnectGoogle,
    disconnectFacebook,
  } = useAuth()

  // Handle Google connection toggle
  const handleGoogleToggle = async () => {
    if (googleUser) {
      Alert.alert("Disconnect Google", "Are you sure you want to disconnect your Google account?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          onPress: disconnectGoogle,
          style: "destructive",
        },
      ])
    } else {
      await connectGoogle()
    }
  }

  // Handle Facebook connection toggle
  const handleFacebookToggle = async () => {
    if (facebookUser) {
      Alert.alert("Disconnect Facebook", "Are you sure you want to disconnect your Facebook account?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Disconnect",
          onPress: disconnectFacebook,
          style: "destructive",
        },
      ])
    } else {
      await connectFacebook()
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
            <Text style={styles.title}>Connected Accounts</Text>
            <Text style={styles.subtitle}>Connect your social accounts to enhance your experience</Text>
          </View>

          {/* Google Account */}
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <View style={[styles.accountIcon, { backgroundColor: "#f1f1f1" }]}>
                <Text style={[styles.accountIconText, { color: "#DB4437" }]}>G</Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>Google</Text>
                <Text style={styles.accountStatus}>
                  {isLoadingGoogle
                    ? "Loading..."
                    : googleUser
                      ? `Connected as ${googleUser.email || googleUser.name}`
                      : "Not connected"}
                </Text>
              </View>
            </View>
            {isLoadingGoogle ? (
              <ActivityIndicator size="small" color="#4A90E2" />
            ) : (
              <Switch
                trackColor={{ false: "#e0e0e0", true: "#BFD7ED" }}
                thumbColor={googleUser ? "#4A90E2" : "#f4f3f4"}
                onValueChange={handleGoogleToggle}
                value={!!googleUser}
              />
            )}
          </View>

          {/* Facebook Account */}
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <View style={[styles.accountIcon, { backgroundColor: "#f1f1f1" }]}>
                <Text style={[styles.accountIconText, { color: "#4267B2" }]}>f</Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>Facebook</Text>
                <Text style={styles.accountStatus}>
                  {isLoadingFacebook
                    ? "Loading..."
                    : facebookUser
                      ? `Connected as ${facebookUser.email || facebookUser.name}`
                      : "Not connected"}
                </Text>
              </View>
            </View>
            {isLoadingFacebook ? (
              <ActivityIndicator size="small" color="#4A90E2" />
            ) : (
              <Switch
                trackColor={{ false: "#e0e0e0", true: "#BFD7ED" }}
                thumbColor={facebookUser ? "#4A90E2" : "#f4f3f4"}
                onValueChange={handleFacebookToggle}
                value={!!facebookUser}
              />
            )}
          </View>

          {/* Twitter Account - Not implemented yet */}
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <View style={[styles.accountIcon, { backgroundColor: "#f1f1f1" }]}>
                <Text style={[styles.accountIconText, { color: "#1DA1F2" }]}>t</Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>Twitter</Text>
                <Text style={styles.accountStatus}>Not connected</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#BFD7ED" }}
              thumbColor={"#f4f3f4"}
              onValueChange={() => Alert.alert("Coming Soon", "Twitter integration will be available soon!")}
              value={false}
            />
          </View>

          {/* Instagram Account - Not implemented yet */}
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <View style={[styles.accountIcon, { backgroundColor: "#f1f1f1" }]}>
                <Text style={[styles.accountIconText, { color: "#C13584" }]}>in</Text>
              </View>
              <View style={styles.accountDetails}>
                <Text style={styles.accountName}>Instagram</Text>
                <Text style={styles.accountStatus}>Not connected</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#e0e0e0", true: "#BFD7ED" }}
              thumbColor={"#f4f3f4"}
              onValueChange={() => Alert.alert("Coming Soon", "Instagram integration will be available soon!")}
              value={false}
            />
          </View>

          {/* Connected Account Details */}
          {(googleUser || facebookUser) && (
            <View style={styles.connectedAccountsSection}>
              <Text style={styles.sectionTitle}>Connected Account Details</Text>

              {googleUser && (
                <View style={styles.accountDetailCard}>
                  <Text style={styles.accountDetailTitle}>Google Account</Text>
                  <View style={styles.accountDetailRow}>
                    <Text style={styles.accountDetailLabel}>Name:</Text>
                    <Text style={styles.accountDetailValue}>{googleUser.name}</Text>
                  </View>
                  <View style={styles.accountDetailRow}>
                    <Text style={styles.accountDetailLabel}>Email:</Text>
                    <Text style={styles.accountDetailValue}>{googleUser.email}</Text>
                  </View>
                  {googleUser.picture && <Image source={{ uri: googleUser.picture }} style={styles.accountAvatar} />}
                </View>
              )}

              {facebookUser && (
                <View style={styles.accountDetailCard}>
                  <Text style={styles.accountDetailTitle}>Facebook Account</Text>
                  <View style={styles.accountDetailRow}>
                    <Text style={styles.accountDetailLabel}>Name:</Text>
                    <Text style={styles.accountDetailValue}>{facebookUser.name}</Text>
                  </View>
                  {facebookUser.email && (
                    <View style={styles.accountDetailRow}>
                      <Text style={styles.accountDetailLabel}>Email:</Text>
                      <Text style={styles.accountDetailValue}>{facebookUser.email}</Text>
                    </View>
                  )}
                  {facebookUser.picture?.data?.url && (
                    <Image source={{ uri: facebookUser.picture.data.url }} style={styles.accountAvatar} />
                  )}
                </View>
              )}
            </View>
          )}

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>Why connect accounts?</Text>
            <Text style={styles.infoText}>
              Connecting your social accounts allows for easier login, sharing content, and a more personalized
              experience across our platform.
            </Text>
            <Text style={styles.infoText}>
              We value your privacy and will never post to your accounts without your permission.
            </Text>
          </View>
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
  accountCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  accountIconText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  accountDetails: {
    justifyContent: "center",
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  accountStatus: {
    fontSize: 14,
    color: "#666",
  },
  connectedAccountsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  accountDetailCard: {
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
  accountDetailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  accountDetailRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  accountDetailLabel: {
    fontSize: 14,
    color: "#666",
    width: 60,
  },
  accountDetailValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  accountAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginTop: 10,
    alignSelf: "center",
  },
  infoSection: {
    backgroundColor: "#f5f9ff",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
})

