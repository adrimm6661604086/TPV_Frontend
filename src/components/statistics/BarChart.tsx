import React from "react"
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native"
import { BarChart as RNBarChart } from "react-native-chart-kit"
import type { FilterType } from "../../types/interfaces"
import { Svg, Line, Text as SvgText } from "react-native-svg"
import theme from "../../utils/theme"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"

interface BarChartProps {
  data: Record<string, any>
  timeFilter: FilterType
  height: number
}

export const BarChart: React.FC<BarChartProps> = ({ data, timeFilter, height }) => {
  const formatXLabel = (value: string) => {
    switch (timeFilter) {
      case "daily":
        return `${value.split("-")[2]}/${value.split("-")[1]}` // Day-Month
      case "weekly":
        return `W${value.split("-")[1]}` // Week number
      case "monthly":
        return value.split("-")[1].slice(0, 3) // Month
      case "annually":
        return value // Year
      default:
        return value
    }
  }

  const labels = Object.keys(data).map(formatXLabel)
  const values = Object.values(data).map((item: any) => item.totalAmount)

  const chartData = {
    labels,
    datasets: [{ data: values }],
  }

  const screenWidth = Dimensions.get("window").width
  const width = Math.max(screenWidth - 32, labels.length * 60) 

  // Generate vertical lines for year and month changes
  const verticalLines: { x: number; color: string; label: string }[] = [];

  if (timeFilter === "daily") {
    let prevYear: string | null = null;
    let prevMonth: string | null = null;
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dates = Object.keys(data);

    dates.forEach((date, index) => {
      const [year, month] = date.split("-");
      const monthLabel = monthNames[Number(month) - 1];

      if (prevYear !== null && year !== prevYear) {
        // Instead of using prevYear, use the new year as label
        verticalLines.push({ x: index, color: "rgba(0, 0, 0, 0.5)", label: year });
      } else if (prevMonth !== null && month !== prevMonth) {
        // Instead of using prevMonth, use the new month as label
        verticalLines.push({ x: index, color: "rgba(0, 0, 0, 0.2)", label: monthLabel });
      }

      prevYear = year;
      prevMonth = month;
    });
  } else if (timeFilter === "weekly") {
    let prevYear: string | null = null;
    let prevMonth: string | null = null;
    let weekCounter: number = 0;
    const monthNames: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dates: string[] = Object.keys(data);

    dates.forEach((date: string, index: number) => {
      const [year, month]: string[] = date.split("-");
      const monthLabel: string = monthNames[Number(month) - 1];
      weekCounter++;

      if (prevYear !== null && year !== prevYear) {
        verticalLines.push({ x: index, color: "rgba(0, 0, 0, 0.5)", label: year });
        weekCounter = 0;
      } else if (prevMonth !== null && month !== prevMonth && weekCounter >= 4.5) {
        verticalLines.push({ x: index, color: "rgba(0, 0, 0, 0.2)", label: monthLabel });
        weekCounter = 0;
      }

      prevYear = year;
      prevMonth = month;
    });
  } else if (timeFilter === "monthly") {
    let prevYear: string | null = null;
    const dates = Object.keys(data);

    dates.forEach((date, index) => {
      const year = date.split("-")[0];

      if (prevYear !== null && year !== prevYear) {
        verticalLines.push({ x: index, color: "rgba(0, 0, 0, 0.5)", label: year });
      }

      prevYear = year;
    });
  }


  const renderVerticalLines = () => {
    return verticalLines.map((line, index) => (
      <React.Fragment key={index}>
        <Line
          x1={line.x * (width / labels.length)}
          y1={15}
          x2={line.x * (width / labels.length)}
          y2={height * 0.85}
          stroke={line.color}
          strokeWidth={1}
        />
        <SvgText
          x={line.x * (width / labels.length)}
          y={10}
          fontSize="10"
          fill="#000"
          textAnchor="middle"
        >
          {line.label}
        </SvgText>
      </React.Fragment>
    ))
  }

  return (
    <View style={styles.container}>
      <Text
        style={styles.title}
      >{`${timeFilter.toString().charAt(0).toUpperCase() + timeFilter.toString().slice(1)} Statistics`}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <RNBarChart
            data={chartData}
            width={width}
            height={height}
            yAxisSuffix=" $"
            yAxisLabel=""
            flatColor={true}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 2,    
              color: (opacity = 1) => theme.palette.primary.main,
              labelColor: (opacity = 1) => '#000',                      
            }}          
            showValuesOnTopOfBars
            fromZero
            withInnerLines={false}
            showBarTops={false}
            segments={4}
          />
          <Svg style={[StyleSheet.absoluteFill, { height: height + 30 }]}>{renderVerticalLines()}</Svg>
        </View>
      </ScrollView>
      <View style={styles.line} />
      <ScrollView style={{...styles.statsList, width: screenWidth - 48}}>
        {Object.entries(data).map(([key, value], index) => (
          <View key={index} style={styles.ststsCard}>              
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>
            {timeFilter === 'daily' ? 'Day' : timeFilter === 'weekly' ? 'Week' : timeFilter === 'monthly' ? 'Month' : 'Year'}: {key}
            </Text>               
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
              <View>
                <Text>Payments {data[key].payments} <Text style={{ color: 'green' }}>(+ {data[key].paymentsAmount.toFixed(2)})</Text></Text>
              </View>
              <View>
                <Text>Returns {data[key].returns} <Text style={{ color: 'red' }}>(- {data[key].returnAmount.toFixed(2)})</Text></Text>
              </View>
              </View >        
                {
                  data[key].totalAmount < 0 ?
                  <FontAwesome5Icon name="arrow-alt-circle-down" size={32} color={theme.palette.error.main} /> 
                  : data[key].totalAmount === 0 ?
                  <FontAwesome5Icon name="minus-circle" size={32} color={theme.palette.default.main} />
                  : <FontAwesome5Icon name="arrow-alt-circle-up" size={32} color={theme.palette.success.main} />
                }
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: theme.palette.text.primary,
    alignSelf: "flex-start",
  },
  line: { 
    height: 1, 
    backgroundColor: theme.palette.text.light, 
    width: "100%", 
    marginVertical: 5 
  },
  statsList: {
    maxHeight: 150, 
    overflow: 'scroll' 
  }, 
  ststsCard: { 
    flexDirection: 'column', 
    padding: 10, 
    backgroundColor: theme.palette.background.light, 
    marginVertical: 1 
  }
})

