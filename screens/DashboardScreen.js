import { useState, useEffect } from "react"
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Image,
  ImageBackground,
  Animated,
} from "react-native"
import { StatusBar } from "expo-status-bar"

export default function DashboardScreen({ route, navigation }) {
  // Get the email and name from route params
  const { email, name } = route.params || { email: "User", name: "" }
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(50))
  
  // Security score animation
  const [scoreAnim] = useState(new Animated.Value(0))
  const [securityScore] = useState(Math.floor(Math.random() * 20) + 70) // 70-90
  
  useEffect(() => {
    // Animate dashboard content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scoreAnim, {
        toValue: securityScore/100,
        duration: 1000,
        useNativeDriver: false,
      })
    ]).start()
  }, [])
  
  // Current date
  const currentDate = new Date()
  const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' }
  const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>CyberGuard</Text>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate("AboutUs")}
          >
            <Image 
              source={{ uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>

        <Animated.View 
          style={[
            styles.content, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }] 
            }
          ]}
        >
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeCardContent}>
              <Text style={styles.welcomeTitle}>Welcome{name ? ", " + name : ""}!</Text>
              <Text style={styles.welcomeEmail}>{email}</Text>
              
              <View style={styles.securityScoreContainer}>
                <View style={styles.securityScoreHeader}>
                  <Text style={styles.securityScoreLabel}>Security Score</Text>
                  <Text style={styles.securityScoreValue}>{securityScore}%</Text>
                </View>
                <View style={styles.securityScoreBar}>
                  <Animated.View 
                    style={[
                      styles.securityScoreFill,
                      { 
                        width: scoreAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0%', '100%']
                        }),
                        backgroundColor: securityScore > 80 
                          ? '#4AD991' 
                          : securityScore > 70 
                            ? '#FFB547' 
                            : '#FF5E57'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.securityScoreHint}>
                  {securityScore > 80 
                    ? 'Your security status is good' 
                    : securityScore > 70 
                      ? 'Some improvements needed' 
                      : 'Action required'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.securityFeaturesSection}>
            <Text style={styles.sectionTitle}>Security Center</Text>

            <View style={styles.featuresGrid}>
              <TouchableOpacity 
                style={styles.featureCard} 
                onPress={() => navigation.navigate("BlockchainSecurity")}
              >
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(94, 114, 228, 0.1)' }]}>
                  <Image 
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png" }} 
                    style={[styles.featureIcon, { tintColor: '#5E72E4' }]} 
                  />
                </View>
                <Text style={styles.featureTitle}>Blockchain Security</Text>
                <Text style={styles.featureDescription}>
                  Monitor digital footprint & access
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.featureCard} 
                onPress={() => navigation.navigate("SmartHomeSecurity")}
              >
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(45, 206, 137, 0.1)' }]}>
                  <Image 
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/3871/3871148.png" }} 
                    style={[styles.featureIcon, { tintColor: '#2DCE89' }]} 
                  />
                </View>
                <Text style={styles.featureTitle}>Smart Home</Text>
                <Text style={styles.featureDescription}>
                  Network security scanner
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.featureCard} 
                onPress={() => navigation.navigate("RoamAlert")}
              >
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(251, 99, 64, 0.1)' }]}>
                  <Image 
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/888/888191.png" }} 
                    style={[styles.featureIcon, { tintColor: '#FB6340' }]} 
                  />
                </View>
                <Text style={styles.featureTitle}>Breach Alerts</Text>
                <Text style={styles.featureDescription}>
                  Real-time security notifications
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.featureCard} 
                onPress={() => navigation.navigate("Chatbot")}
              >
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(17, 205, 239, 0.1)' }]}>
                  <Image 
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/4712/4712010.png" }} 
                    style={[styles.featureIcon, { tintColor: '#11CDEF' }]} 
                  />
                </View>
                <Text style={styles.featureTitle}>AI Assistant</Text>
                <Text style={styles.featureDescription}>
                  Cybersecurity chat consultant
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.quickAccessSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Access</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickAccessList}
            >
              <TouchableOpacity 
                style={styles.quickAccessCard}
                onPress={() => navigation.navigate("Accounts")}
              >
                <ImageBackground 
                  source={{ uri: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }}
                  style={styles.quickAccessBackground}
                  imageStyle={styles.quickAccessBackgroundImage}
                >
                  <View style={styles.quickAccessContent}>
                    <Image 
                      source={{ uri: "https://cdn-icons-png.flaticon.com/512/1828/1828540.png" }} 
                      style={styles.quickAccessIcon} 
                    />
                    <Text style={styles.quickAccessTitle}>Connected Accounts</Text>
                    <Text style={styles.quickAccessDescription}>Manage your social media connections</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickAccessCard}
                onPress={() => navigation.navigate("Chatbot")}
              >
                <ImageBackground 
                  source={{ uri: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }}
                  style={styles.quickAccessBackground}
                  imageStyle={styles.quickAccessBackgroundImage}
                >
                  <View style={styles.quickAccessContent}>
                    <Image 
                      source={{ uri: "https://cdn-icons-png.flaticon.com/512/2040/2040946.png" }} 
                      style={styles.quickAccessIcon} 
                    />
                    <Text style={styles.quickAccessTitle}>Security Tips</Text>
                    <Text style={styles.quickAccessDescription}>Best practices for staying safe online</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.quickAccessCard}
                onPress={() => navigation.navigate("AboutUs")}
              >
                <ImageBackground 
                  source={{ uri: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }}
                  style={styles.quickAccessBackground}
                  imageStyle={styles.quickAccessBackgroundImage}
                >
                  <View style={styles.quickAccessContent}>
                    <Image 
                      source={{ uri: "https://cdn-icons-png.flaticon.com/512/681/681494.png" }} 
                      style={styles.quickAccessIcon} 
                    />
                    <Text style={styles.quickAccessTitle}>About CyberGuard</Text>
                    <Text style={styles.quickAccessDescription}>Learn about our team and mission</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.activitySection}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={[styles.activityDot, { backgroundColor: '#5E72E4' }]} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Account Login</Text>
                  <Text style={styles.activityTime}>Just now</Text>
                </View>
              </View>
              <View style={styles.activityItem}>
                <View style={[styles.activityDot, { backgroundColor: '#2DCE89' }]} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Profile Updated</Text>
                  <Text style={styles.activityTime}>Today, 10:30 AM</Text>
                </View>
              </View>
              <View style={styles.activityItem}>
                <View style={[styles.activityDot, { backgroundColor: '#11CDEF' }]} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Security Scan Completed</Text>
                  <Text style={styles.activityTime}>Yesterday, 8:45 PM</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.accountsButton} 
              onPress={() => navigation.navigate("Accounts")}
            >
              <Text style={styles.accountsButtonText}>Manage Connected Accounts</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121826",
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
  dateText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 30,
    height: 30,
    tintColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeCard: {
    marginBottom: 25,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1E293B",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  welcomeCardContent: {
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  welcomeEmail: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 20,
  },
  securityScoreContainer: {
    marginTop: 10,
  },
  securityScoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  securityScoreLabel: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
  },
  securityScoreValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  securityScoreBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  securityScoreFill: {
    height: "100%",
    borderRadius: 4,
  },
  securityScoreHint: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "right",
  },
  securityFeaturesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    width: 26,
    height: 26,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    lineHeight: 16,
  },
  quickAccessSection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    color: "#5E72E4",
  },
  quickAccessList: {
    paddingRight: 20,
  },
  quickAccessCard: {
    width: 250,
    height: 150,
    marginRight: 15,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickAccessBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  quickAccessBackgroundImage: {
    borderRadius: 12,
  },
  quickAccessContent: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 15,
  },
  quickAccessIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
    marginBottom: 8,
  },
  quickAccessTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  quickAccessDescription: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },
  activitySection: {
    marginBottom: 30,
  },
  activityList: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 5,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
  },
  actionButtonsContainer: {
    marginTop: 10,
    marginBottom: 40,
  },
  accountsButton: {
    backgroundColor: "#5E72E4",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#5E72E4",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  accountsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    fontWeight: "600",
  },
})
