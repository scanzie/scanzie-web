"use server"
import axios from 'axios'

const apiNext = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// // Before every request, grab the latest session and attach user ID
apiNext.interceptors.request.use(
  async (config) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/session`, {
        method: 'GET',
        credentials: 'include', // Include cookies for session auth
      })
      if (!response.ok) throw new Error('Session fetch failed')
      const data = await response.json()
      const session = data.session

      if (session?.user?.id) {
        const userId = session.user.id
        if (config.data && typeof config.data === 'object') {
          // For POST/PUT/etc. with body: attach userId
          config.data.userId = userId
        } else {
          // For GET: append as query param
          const separator = config.url?.includes('?') ? '&' : '?'
          config.url += `${separator}userId=${encodeURIComponent(userId)}` // Encode for safety

          // Alternative: Use a custom header for all methods (uncomment below, remove query param)
          // if (config.headers) {
          //   config.headers['X-User-ID'] = userId
          // }
        }
      }

      // Set Authorization for backend auth middleware
      if (session?.token && config.headers) {
        config.headers['Authorization'] = `Bearer ${session.token}`
      }
    } catch (error) {
      console.warn('Failed to attach user ID:', error) // Or handle as needed (e.g., redirect to login)
      // Proceed without userId—backend can fallback to req.user from JWT
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default apiNext