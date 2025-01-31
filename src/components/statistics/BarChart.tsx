import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

// Utils
import theme from "../../utils/theme"
import { StatsData } from "../../types/interfaces"

interface BarChartProps {
  data: Record<string, StatsData>
  barColor?: string
  height: number
  width: number
  title?: string
  subtitle?: string
}

const BarChart: React.FC<BarChartProps> = ({ data, barColor = "#4287f5", height, width, title, subtitle }) => {
  const chartData = Object.entries(data)
  const maxAmount = Math.max(...chartData.map(([_, point]) => point.totalAmount))
  const barWidth = 40
  const visibleBars = Math.floor((width - 60) / barWidth)
  const chartHeight = height - 40

  const scrollViewRef = useRef<ScrollView>(null)
  const [scrollIndex, setScrollIndex] = useState(0)
  const [selectedBar, setSelectedBar] = useState<{ date: string; point: StatsData; x: number, y: number } | null>(null)

  const TooltipPosition = selectedBar ? selectedBar.y : 10

  const yAxisValues = [0, maxAmount / 4, maxAmount / 2, (3 * maxAmount) / 4, maxAmount]

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: false })
  }, [])

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x
    const index = Math.floor(contentOffset / barWidth)
    setScrollIndex(index)
    setSelectedBar(null)
  }

  const handleBarPress = (date: string, point: StatsData, x: number, y: number) => {
    if (selectedBar?.date === date) {
      setSelectedBar(null)
    } else {
      setSelectedBar({ date, point, x, y})
    }
  }

  const Tooltip = ({ position, date, point, x }: { position: number, date: string; point: StatsData; x: number }) => (
    <View style={[styles.tooltip, { left: x - 50, top: position > 50 ? position - 50 : position - 15 }]}>
      <View style={styles.tooltipContent}>
        <Text style={styles.tooltipTitle}>Week {date.split("-")[1]}</Text>
        <Text style={styles.tooltipText}>${point.totalAmount.toFixed(2)}</Text>
      </View>
      <View style={styles.tooltipArrow} />
    </View>
  )

  return (
    <View>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      <View style={[styles.chartContainer, { height: height }]}>
        <View style={styles.yAxis}>
          {yAxisValues.reverse().map((value, index) => (
            <Text key={index} style={styles.yAxisLabel}>
              ${value.toFixed(0)}
            </Text>
          ))}
        </View>

        <View style={{ flex: 1 }}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <View style={[styles.barsContainer, { height: height, width: chartData.length * barWidth }]}>
              {chartData.map(([date, point], index) => {
                const barHeight = (point.totalAmount / maxAmount) * chartHeight
                const x = index * barWidth + barWidth / 2
                const y = chartHeight - barHeight + 20
                return (
                  <TouchableOpacity
                    key={date}
                    style={[styles.barContainer, { width: barWidth }]}
                    onPress={() => handleBarPress(date, point, x, y)}
                  >
                    <View
                      style={[
                        styles.bar,
                        {
                          height: barHeight,
                          backgroundColor: selectedBar?.date === date ? theme.palette.primary.dark : barColor,
                        },
                      ]}
                    />
                    <Text style={styles.xAxisLabel}>W{date.split("-")[1]}</Text>
                  </TouchableOpacity>
                )
              })}
              {selectedBar && <Tooltip position={TooltipPosition} date={selectedBar.date} point={selectedBar.point} x={selectedBar.x} />}
              {yAxisValues.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.gridLine,
                    {
                      bottom: (index / (yAxisValues.length - 1)) * chartHeight + 12,
                      width: chartData.length * barWidth,
                    },
                  ]}
                />
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      <ScrollView style={styles.legendContainer}>
        {chartData.slice(scrollIndex, scrollIndex + visibleBars).map(([date, point]) => (
          <View key={date} style={styles.legendItem}>
            <Text style={styles.legendWeek}>
              Week {date.split("-")[1]} from {date.split("-")[0]}
            </Text>
            <Text style={styles.legendText}>Amount: ${point.totalAmount.toFixed(2)}</Text>
            <Text style={styles.legendText}>Transactions: {point.transactions}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({  
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  chartContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  yAxis: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingRight: 5,
  },
  yAxisLabel: {
    fontSize: 10,
    color: "#666",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingTop: 30,
  },
  barContainer: {
    alignItems: "center",
  },
  bar: {
    width: "80%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  xAxisLabel: {
    top: 2,
    fontSize: 10,
    color: "#666",
  },
  gridLine: {
    position: "absolute",
    left: 0,
    height: 1,
    backgroundColor: theme.palette.text.light,
  },
  legendContainer: {
    maxHeight: 150,
  },
  legendItem: {
    marginBottom: 10,
    padding: 5,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
  },
  legendWeek: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  legendText: {
    fontSize: 10,
    color: "#666",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  tooltip: {
    position: "absolute",
    zIndex: 1000,
    width: 100,
    alignItems: "center",
  },
  tooltipContent: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "white",
    alignSelf: "center",
  },
  tooltipTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  tooltipText: {
    fontSize: 12,
    textAlign: "center",
  },
})

export default BarChart;