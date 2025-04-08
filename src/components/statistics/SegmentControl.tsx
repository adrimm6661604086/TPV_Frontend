import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import theme from "../../utils/theme"

interface SegmentedControlProps {
  values: string[]
  selectedIndex: number
  onChange: (index: number) => void
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ values, selectedIndex, onChange }) => {
  return (
    <View style={styles.container}>
      {values.map((value, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.segment,
            selectedIndex === index && styles.selectedSegment,
            index === 0 && styles.firstSegment,
            index === values.length - 1 && styles.lastSegment,
          ]}
          onPress={() => onChange(index)}
        >
          <Text style={[styles.segmentText, selectedIndex === index && styles.selectedSegmentText]}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.palette.background.dark,
    borderRadius: 8,
    padding: 2,
    marginBottom: 5,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  selectedSegment: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  firstSegment: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  lastSegment: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  segmentText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedSegmentText: {
    color: "#fff",
  },
})

