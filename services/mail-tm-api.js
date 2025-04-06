// API service for mail.tm temporary email service
const BASE_URL = "https://api.mail.tm"

/**
 * Generate a random string for username
 * @param {number} length - Length of the random string
 * @returns {string} - Random string
 */
const randomString = (length = 10) => {
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

/**
 * Get available domain from mail.tm
 * @returns {Promise<string>} - Available domain
 */
export const getDomain = async () => {
  try {
    const response = await fetch(`${BASE_URL}/domains`)
    if (!response.ok) {
      throw new Error(`Failed to get domains: ${response.status}`)
    }

    const data = await response.json()
    const domains = data["hydra:member"]

    if (!domains || domains.length === 0) {
      throw new Error("No domains available")
    }

    return domains[0].domain
  } catch (error) {
    console.error("Error getting domain:", error)
    throw error
  }
}

/**
 * Create a new account with a random email
 * @param {string} domain - Domain to use for the email
 * @returns {Promise<{email: string, password: string}>} - Created email and password
 */
export const createAccount = async (domain) => {
  try {
    const username = randomString()
    const email = `${username}@${domain}`
    const password = "TempPass1234!"

    const response = await fetch(`${BASE_URL}/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: email,
        password: password,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Account creation failed: ${JSON.stringify(errorData)}`)
    }

    return { email, password }
  } catch (error) {
    console.error("Error creating account:", error)
    throw error
  }
}

/**
 * Authenticate and retrieve a token
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {Promise<string>} - Authentication token
 */
export const getToken = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: email,
        password: password,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Token retrieval failed: ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data.token
  } catch (error) {
    console.error("Error getting token:", error)
    throw error
  }
}

/**
 * Fetch inbox messages using the token
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} - List of messages
 */
export const fetchMessages = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/messages`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Error fetching inbox: ${response.status}`)
    }

    const data = await response.json()
    return data["hydra:member"] || []
  } catch (error) {
    console.error("Error fetching messages:", error)
    throw error
  }
}

/**
 * Generate a temporary email address
 * @returns {Promise<{email: string, token: string, expiresAt: string}>} - Email info
 */
export const generateTempEmail = async () => {
  try {
    // Get available domain
    const domain = await getDomain()

    // Create account
    const { email, password } = await createAccount(domain)

    // Get authentication token
    const token = await getToken(email, password)

    // Return email info with expiration (1 hour from now)
    return {
      email,
      token,
      expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    }
  } catch (error) {
    console.error("Error generating temporary email:", error)
    throw error
  }
}

/**
 * Format message data from mail.tm API
 * @param {Object} message - Raw message from API
 * @returns {Object} - Formatted message
 */
export const formatMessage = (message) => {
  return {
    id: message.id,
    sender: message.from?.address || "unknown@sender.com",
    subject: message.subject || "(No Subject)",
    receivedAt: message.createdAt || new Date().toISOString(),
    read: message.seen || false,
    intro: message.intro || "",
  }
}

