import axios from 'axios'

const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/session`, {
        method: 'GET',
        credentials: 'include', 
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
        }
      }

      // Set Authorization for backend auth middleware
      if (session?.token && config.headers) {
        config.headers['Authorization'] = `Bearer ${session.token}`
      }
    } catch (error) {
      console.warn('Failed to attach user ID:', error) // Or handle as needed (e.g., redirect to login)
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default apiClient