// React
import type React from "react"
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions } from "react-native"

// Libraries
import MaterialIcon from "react-native-vector-icons/MaterialIcons"

// Hooks
import useStats from "../hooks/StatsHooks"

// Utils
import theme from "../utils/theme"

// Components
import { BarChart } from "../components/statistics/BarChart"
import { LineChart } from "../components/statistics/LineChart"
import { SegmentedControl } from "../components/statistics/SegmentControl"

// Types
import type { FilterType } from "../types/interfaces"

const StatsScreen: React.FC = () => {
  const [timeTab, setTimeTab] = useState<FilterType>("weekly")
  const [chartTab, setChartTab] = useState<"line" | "bar">("bar")

  const { stats, loading, error, fetchStats } = useStats()

  useEffect(() => {
    fetchStats(timeTab)
  }, [timeTab, fetchStats])

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size={32} color={theme.palette.primary.main} />
      </View>
    )
  } else if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>An error occurred: {error}</Text>
        <TouchableOpacity style={styles.reloadButton} onPress={() => fetchStats(timeTab)}>
          <MaterialIcon name="refresh" size={24} color="#FFFFFF" />
          <Text style={styles.reloadButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const chartData = stats?.data?.stats || {}

  return (
    <View style={styles.container} >
      <SegmentedControl
        values={["Daily", "Weekly", "Monthly", "Annually"]}
        selectedIndex={["daily", "weekly", "monthly", "annually"].indexOf(timeTab as string)}
        onChange={(index) => setTimeTab(["daily", "weekly", "monthly", "annually"][index] as FilterType)}
      />

      <SegmentedControl
        values={["Bar Chart", "Line Chart"]}
        selectedIndex={chartTab === "bar" ? 0 : 1}
        onChange={(index) => setChartTab(index === 0 ? "bar" : "line")}
      />

      <SafeAreaView style={styles.card}>
        {stats &&
          (chartTab === "bar" ? (
            <BarChart data={chartData} timeFilter={timeTab} height={200} />
          ) : (
            <LineChart data={chartData} timeFilter={timeTab} height={200}/>
          ))}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  card: {
    height: "82%",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginVertical: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginVertical: 20,
    textAlign: "center",
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.main,
    paddingVertical: 10,
    marginHorizontal: 20,
    borderRadius: 8,
  },
  reloadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
})

export default StatsScreen

