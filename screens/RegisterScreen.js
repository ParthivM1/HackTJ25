"use client"

import { useState } from "react"
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
  ImageBackground,
  SafeAreaView,
} from "react-native"
import { useUser } from "../context/UserContext"
import { StatusBar } from "expo-status-bar"

export default function RegisterScreen({ navigation }) {
  const { registerUser } = useUser()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  const handleRegister = () => {
    let isValid = true

    // Reset errors
    setNameError("")
    setEmailError("")
    setPasswordError("")
    setConfirmPasswordError("")

    // Validate name
    if (!name.trim()) {
      setNameError("Name is required")
      isValid = false
    }

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required")
      isValid = false
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email")
      isValid = false
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError("Password is required")
      isValid = false
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      isValid = false
    }

    // Validate confirm password
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      isValid = false
    }

    if (isValid) {
      // Register the user
      const user = registerUser(name, email, password)

      Alert.alert("Registration Successful", "Your account has been created successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Navigate to the dashboard with the user data
            navigation.navigate("Dashboard", { email: user.email, name: user.name })
          },
        },
      ])
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        }}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.keyboardAvoidingView}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.header}>
                  <Text style={styles.appName}>CyberGuard</Text>
                  <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Home")}>
                    <Text style={styles.backButtonText}>Back</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.formContainer}>
                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.subtitle}>Sign up to get started with CyberGuard</Text>

                  <View style={styles.form}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Full Name</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your full name"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={name}
                        onChangeText={setName}
                      />
                      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Email</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Password</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Create a password"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                      />
                      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.label}>Confirm Password</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Confirm your password"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                      />
                      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                      <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                      <Text style={styles.footerLink}>Log In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontSize: 28,
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
    fontSize: 14,
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 30,
  },
  form: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    color: "#fff",
  },
  errorText: {
    color: "#FF5E57",
    fontSize: 14,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#5E72E4",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    elevation: 2,
    shadowColor: "#5E72E4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  footerLink: {
    color: "#5E72E4",
    fontSize: 16,
    fontWeight: "600",
  },
})

