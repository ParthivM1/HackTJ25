"use client"

import { useState, useEffect } from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { useAuth } from "../context/AuthContext"

export default function BlockchainSecurityScreen({ navigation }) {
  const { googleUser, facebookUser, isLoadingGoogle, isLoadingFacebook } = useAuth()

  const [isScanning, setIsScanning] = useState(false)
  const [dataAccessList, setDataAccessList] = useState([])

  // Simulate scanning for data access
  const scanForDataAccess = () => {
    setIsScanning(true)

    // Simulate API call delay
    setTimeout(() => {
      const newDataAccessList = []

      // Add Google data access if connected
      if (googleUser) {
        newDataAccessList.push(
          {
            id: "google-calendar",
            name: "Google Calendar",
            icon: "📅",
            color: "#DB4437",
            accessLevel: "Read & Write",
            dataAccessed: "Calendar events, meeting details",
            lastAccessed: "2 days ago",
            service: "Google",
          },
          {
            id: "google-drive",
            name: "Google Drive",
            icon: "📁",
            color: "#0F9D58",
            accessLevel: "Read only",
            dataAccessed: "File names, storage usage",
            lastAccessed: "5 days ago",
            service: "Google",
          },
          {
            id: "google-photos",
            name: "Google Photos",
            icon: "🖼️",
            color: "#4285F4",
            accessLevel: "Read only",
            dataAccessed: "Photo metadata",
            lastAccessed: "1 week ago",
            service: "Google",
          },
        )
      }

      // Add Facebook data access if connected
      if (facebookUser) {
        newDataAccessList.push(
          {
            id: "facebook-profile",
            name: "Facebook Profile",
            icon: "👤",
            color: "#4267B2",
            accessLevel: "Read only",
            dataAccessed: "Profile information, friend list",
            lastAccessed: "3 days ago",
            service: "Facebook",
          },
          {
            id: "facebook-posts",
            name: "Facebook Posts",
            icon: "📝",
            color: "#4267B2",
            accessLevel: "Read only",
            dataAccessed: "Post history, reactions",
            lastAccessed: "1 week ago",
            service: "Facebook",
          },
        )
      }

      // Add some common third-party services that might have access
      newDataAccessList.push(
        {
          id: "spotify",
          name: "Spotify",
          icon: "🎵",
          color: "#1DB954",
          accessLevel: "Limited access",
          dataAccessed: "Music preferences",
          lastAccessed: "2 weeks ago",
          service: "Third Party",
        },
        {
          id: "netflix",
          name: "Netflix",
          icon: "🎬",
          color: "#E50914",
          accessLevel: "Limited access",
          dataAccessed: "Viewing history",
          lastAccessed: "1 month ago",
          service: "Third Party",
        },
      )

      setDataAccessList(newDataAccessList)
      setIsScanning(false)
    }, 2500)
  }

  // Revoke access (simulated)
  const revokeAccess = (item) => {
    Alert.alert("Revoke Access", `Are you sure you want to revoke access for ${item.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Revoke",
        onPress: () => {
          // Simulate revoking access
          setDataAccessList(dataAccessList.filter((i) => i.id !== item.id))
          Alert.alert("Access Revoked", `Access for ${item.name} has been revoked.`)
        },
        style: "destructive",
      },
    ])
  }

  // Scan for data access when the component mounts or when OAuth status changes
  useEffect(() => {
    if (googleUser || facebookUser) {
      scanForDataAccess()
    } else {
      setDataAccessList([])
    }
  }, [googleUser, facebookUser])

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
            <Text style={styles.title}>Blockchain & Online Security</Text>
            <Text style={styles.subtitle}>Monitor your digital footprint and protect your online identity</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>What is Blockchain Security?</Text>
            <Text style={styles.infoCardText}>
              Blockchain technology provides a decentralized and immutable ledger that enhances security by making data
              tampering virtually impossible. This technology is revolutionizing how we secure digital identities and
              protect sensitive information online.
            </Text>
          </View>

          <View style={styles.dataAccessSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sites With Your Data Access</Text>
              <TouchableOpacity style={styles.refreshButton} onPress={scanForDataAccess} disabled={isScanning}>
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>

            {isScanning || isLoadingGoogle || isLoadingFacebook ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
                <Text style={styles.loadingText}>Scanning for data access...</Text>
              </View>
            ) : !googleUser && !facebookUser ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>
                  Connect your Google or Facebook account to scan for data access.
                </Text>
                <TouchableOpacity style={styles.connectButton} onPress={() => navigation.navigate("Accounts")}>
                  <Text style={styles.connectButtonText}>Connect Accounts</Text>
                </TouchableOpacity>
              </View>
            ) : dataAccessList.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateText}>No data access found. Your digital footprint is minimal!</Text>
              </View>
            ) : (
              <>
                {/* Group by service */}
                {["Google", "Facebook", "Third Party"].map((service) => {
                  const serviceItems = dataAccessList.filter((item) => item.service === service)
                  if (serviceItems.length === 0) return null

                  return (
                    <View key={service} style={styles.serviceGroup}>
                      <Text style={styles.serviceGroupTitle}>{service} Services</Text>

                      {serviceItems.map((item) => (
                        <View key={item.id} style={styles.dataAccessCard}>
                          <View style={styles.dataAccessHeader}>
                            <View style={[styles.dataAccessIcon, { backgroundColor: item.color + "20" }]}>
                              <Text style={styles.dataAccessIconText}>{item.icon}</Text>
                            </View>
                            <View style={styles.dataAccessInfo}>
                              <Text style={styles.dataAccessName}>{item.name}</Text>
                              <Text style={styles.dataAccessLevel}>{item.accessLevel}</Text>
                            </View>
                          </View>

                          <View style={styles.dataAccessDetails}>
                            <Text style={styles.dataAccessDetailsLabel}>Data Accessed:</Text>
                            <Text style={styles.dataAccessDetailsValue}>{item.dataAccessed}</Text>

                            <Text style={styles.dataAccessDetailsLabel}>Last Accessed:</Text>
                            <Text style={styles.dataAccessDetailsValue}>{item.lastAccessed}</Text>
                          </View>

                          <TouchableOpacity style={styles.revokeButton} onPress={() => revokeAccess(item)}>
                            <Text style={styles.revokeButtonText}>Revoke Access</Text>
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )
                })}
              </>
            )}
          </View>

          <View style={styles.securityTipsSection}>
            <Text style={styles.sectionTitle}>Security Tips</Text>

            <View style={styles.securityTipCard}>
              <Text style={styles.securityTipTitle}>Use Strong, Unique Passwords</Text>
              <Text style={styles.securityTipText}>
                Create different passwords for each of your accounts, and make them complex with a mix of letters,
                numbers, and symbols.
              </Text>
            </View>

            <View style={styles.securityTipCard}>
              <Text style={styles.securityTipTitle}>Enable Two-Factor Authentication</Text>
              <Text style={styles.securityTipText}>
                Add an extra layer of security by enabling 2FA on all your important accounts.
              </Text>
            </View>

            <View style={styles.securityTipCard}>
              <Text style={styles.securityTipTitle}>Regularly Review App Permissions</Text>
              <Text style={styles.securityTipText}>
                Periodically check which apps have access to your accounts and revoke unnecessary permissions.
              </Text>
            </View>
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
  infoCard: {
    backgroundColor: "#f5f9ff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
    borderLeftWidth: 4,
    borderLeftColor: "#4A90E2",
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  infoCardText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  dataAccessSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    color: "#4A90E2",
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
  },
  connectButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    padding: 12,
    paddingHorizontal: 20,
  },
  connectButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  serviceGroup: {
    marginBottom: 20,
  },
  serviceGroupTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
    marginLeft: 5,
  },
  dataAccessCard: {
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
  dataAccessHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  dataAccessIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  dataAccessIconText: {
    fontSize: 20,
  },
  dataAccessInfo: {
    flex: 1,
  },
  dataAccessName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  dataAccessLevel: {
    fontSize: 14,
    color: "#666",
  },
  dataAccessDetails: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dataAccessDetailsLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  dataAccessDetailsValue: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  revokeButton: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  revokeButtonText: {
    color: "#E53935",
    fontSize: 14,
    fontWeight: "600",
  },
  securityTipsSection: {
    marginTop: 10,
  },
  securityTipCard: {
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
  securityTipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  securityTipText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
})

