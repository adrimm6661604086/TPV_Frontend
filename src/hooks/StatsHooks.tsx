import { useState, useCallback } from "react"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Constantes
const BACKEND_URL = "http://192.168.1.103:5000/api"

// Tipos
import type { StatsData, FilterType, ApiResponse } from "../types/interfaces"

// Configuración de interceptores para depuración
axios.interceptors.request.use((request) => {
  console.log("Starting Request", request)
  return request
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response Error", error)
    return Promise.reject(error)
  },
)

const useStats = () => {
  const [stats, setStats] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async (filter: FilterType) => {
    setLoading(true)
    setError(null)

    try {
      const userId = await AsyncStorage.getItem("userId")
      if (!userId) {
        throw new Error("User ID not found")
      }

      // Construcción del query param en función del tipo de filtro
      const queryParam =
        typeof filter === "string" ? `time-filter=${filter}` : `startDate=${filter.startDate}&endDate=${filter.endDate}`

      const response = await axios.get<ApiResponse>(`${BACKEND_URL}/stats/${userId}?${queryParam}`)

      setStats(response.data)
    } catch (err: any) {
      console.error("Error fetching stats:", err)
      setError(err.response?.data?.message || err.message || "Error fetching stats")
    } finally {
      setLoading(false)
    }
  }, [])

  return { stats, loading, error, fetchStats }
}

export default useStats

