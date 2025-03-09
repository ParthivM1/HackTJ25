import React from "react"
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
} from "react-native"
import { StatusBar } from "expo-status-bar"

export default function AboutUsScreen({ navigation }) {
  // Team member data
  const teamMembers = [
    {
      id: 1,
      name: "Shiv Davay",
      role: "CEO & Security Architect",
      bio: "Security expert with a passion for building intuitive, secure systems that protect user data without compromising on experience.",
      image: "/placeholder.svg?height=150&width=150", // Placeholder - replace with actual image
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/",
    },
    {
      id: 2,
      name: "Parthiv Maddipatla",
      role: "CTO & Backend Developer",
      bio: "Specializes in secure infrastructure and backend development with expertise in blockchain technologies and API integrations.",
      image: "/placeholder.svg?height=150&width=150", // Placeholder - replace with actual image
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/",
    },
    {
      id: 3,
      name: "Svaran Medavarapu",
      role: "Lead Frontend Developer",
      bio: "UI/UX specialist focusing on creating intuitive interfaces that make complex security concepts accessible to everyone.",
      image: "/placeholder.svg?height=150&width=150", // Placeholder - replace with actual image
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/",
    },
    {
      id: 4,
      name: "Aahan Sachdeva",
      role: "AI & ML Specialist",
      bio: "Developing cutting-edge AI models to enhance security threat detection and provide intelligent responses to emerging threats.",
      image: "/placeholder.svg?height=150&width=150", // Placeholder - replace with actual image
      linkedin: "https://linkedin.com/in/",
      github: "https://github.com/",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.appName}>CyberGuard</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Our Team</Text>
            <Text style={styles.subtitle}>Meet the security experts behind CyberGuard</Text>
          </View>

          <View style={styles.ourStorySection}>
            <Text style={styles.sectionTitle}>Our Story</Text>
            <Text style={styles.storyText}>
              CyberGuard was founded with a simple but powerful mission: to make advanced cybersecurity 
              accessible to everyone. In an increasingly connected world, we believe that robust security 
              shouldn't be a luxury - it should be the standard.
            </Text>
            <Text style={styles.storyText}>
              Our team combines expertise in cybersecurity, artificial intelligence, and user experience 
              design to create solutions that protect what matters most without getting in the way of 
              your digital life.
            </Text>
          </View>

          <View style={styles.teamSection}>
            <Text style={styles.sectionTitle}>The Team</Text>
            
            {teamMembers.map((member) => (
              <View key={member.id} style={styles.teamMemberCard}>
                <View style={styles.teamMemberHeader}>
                  <Image 
                    source={{ uri: member.image }} 
                    style={styles.teamMemberImage} 
                  />
                  <View style={styles.teamMemberInfo}>
                    <Text style={styles.teamMemberName}>{member.name}</Text>
                    <Text style={styles.teamMemberRole}>{member.role}</Text>
                    
                    <View style={styles.socialLinks}>
                      <TouchableOpacity 
                        style={styles.socialButton}
                        onPress={() => Linking.openURL(member.linkedin)}
                      >
                        <Text style={styles.socialButtonText}>LinkedIn</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.socialButton}
                        onPress={() => Linking.openURL(member.github)}
                      >
                        <Text style={styles.socialButtonText}>GitHub</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <Text style={styles.teamMemberBio}>{member.bio}</Text>
              </View>
            ))}
          </View>

          <View style={styles.missionSection}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.missionText}>
              At CyberGuard, we're committed to creating a safer digital world through innovative security solutions 
              that protect users without compromising on experience. We believe security should be invisible yet 
              powerful - working hard in the background so you don't have to worry.
            </Text>
            <View style={styles.valuesList}>
              <View style={styles.valueItem}>
                <View style={styles.valueDot} />
                <Text style={styles.valueText}>Make security accessible to everyone</Text>
              </View>
              <View style={styles.valueItem}>
                <View style={styles.valueDot} />
                <Text style={styles.valueText}>Stay ahead of emerging threats</Text>
              </View>
              <View style={styles.valueItem}>
                <View style={styles.valueDot} />
                <Text style={styles.valueText}>Prioritize user privacy</Text>
              </View>
              <View style={styles.valueItem}>
                <View style={styles.valueDot} />
                <Text style={styles.valueText}>Create security tools people actually want to use</Text>
              </View>
            </View>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <View style={styles.contactInfo}>
              <Text style={styles.contactText}>Email: team@cyberguard.com</Text>
              <Text style={styles.contactText}>Support: support@cyberguard.com</Text>
              <Text style={styles.contactText}>Location: San Francisco, CA</Text>
            </View>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => Linking.openURL('mailto:team@cyberguard.com')}
            >
              <Text style={styles.contactButtonText}>Get in Touch</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingBottom: 40,
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  ourStorySection: {
    marginBottom: 30,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
  },
  storyText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
    marginBottom: 15,
  },
  teamSection: {
    marginBottom: 30,
  },
  teamMemberCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#5E72E4",
  },
  teamMemberHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  teamMemberImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  teamMemberInfo: {
    flex: 1,
    justifyContent: "center",
  },
  teamMemberName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  teamMemberRole: {
    fontSize: 14,
    color: "#5E72E4",
    marginBottom: 10,
  },
  socialLinks: {
    flexDirection: "row",
  },
  socialButton: {
    backgroundColor: "rgba(94, 114, 228, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
  },
  socialButtonText: {
    color: "#5E72E4",
    fontSize: 12,
    fontWeight: "500",
  },
  teamMemberBio: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 22,
  },
  missionSection: {
    marginBottom: 30,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
  },
  missionText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 24,
    marginBottom: 20,
  },
  valuesList: {
    marginTop: 10,
  },
  valueItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  valueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5E72E4",
    marginRight: 12,
  },
  valueText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
  },
  contactSection: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactText: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  contactButton: {
    backgroundColor: "#5E72E4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  contactButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
})
