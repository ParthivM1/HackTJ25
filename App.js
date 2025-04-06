import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { StatusBar } from "expo-status-bar"
import HomeScreen from "./screens/HomeScreen"
import LoginScreen from "./screens/LoginScreen"
import RegisterScreen from "./screens/RegisterScreen"
import DashboardScreen from "./screens/DashboardScreen"
import AccountsScreen from "./screens/AccountsScreen"
import BlockchainSecurityScreen from "./screens/BlockchainSecurityScreen"
import SmartHomeSecurityScreen from "./screens/SmartHomeSecurityScreen"
import RoamAlertScreen from "./screens/RoamAlertScreen"
import ChatbotScreen from "./screens/ChatbotScreen"
import AboutUsScreen from "./screens/AboutUsScreen"
import { UserProvider } from "./context/UserContext"
import { AuthProvider } from "./context/AuthContext"
import KeywordSearchScreen from "./screens/KeywordSearchScreen"
import TempEmailScreen from "./screens/TempEmailScreen"

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />
            <Stack.Screen
              name="Accounts"
              component={AccountsScreen}
              options={{
                headerShown: false,
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="BlockchainSecurity"
              component={BlockchainSecurityScreen}
              options={{
                headerShown: false,
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="SmartHomeSecurity"
              component={SmartHomeSecurityScreen}
              options={{
                headerShown: false,
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="RoamAlert"
              component={RoamAlertScreen}
              options={{
                headerShown: false,
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="Chatbot"
              component={ChatbotScreen}
              options={{
                headerShown: false,
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="AboutUs"
              component={AboutUsScreen}
              options={{
                headerShown: false,
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="KeywordSearch"
              component={KeywordSearchScreen}
              options={{
                headerShown: false,
                gestureEnabled: true,
              }}
            />
            <Stack.Screen
              name="TempEmail"
              component={TempEmailScreen}
              options={{
                headerShown: false,
                gestureEnabled: true,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </AuthProvider>
  )
}

