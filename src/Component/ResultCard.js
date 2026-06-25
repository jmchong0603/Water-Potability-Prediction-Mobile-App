import React from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width * 0.74;

export default function ResultCard({ item, index, scrollX }) {
  // Interpolating the translateY value based on the scroll position
  const inputRange = [
    (index - 2) * ITEM_SIZE,
    (index - 1) * ITEM_SIZE,
    index * ITEM_SIZE,
  ];

  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [100, 50, 100],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ width: ITEM_SIZE }}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.content}>
          <BarChart
            data={{
              labels: ['Current', 'Average', 'Global Avg'],
              datasets: [
                {
                  data: [item.currentValue, item.avgValue, item.globalValue],
                },
              ],
            }}
            width={ITEM_SIZE - 30} // Ensure width is slightly smaller than the card width to fit inside
            height={200} // Adjust height as needed
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 2, // optional, defaults to 2
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForLabels: {
                fontSize: 12,
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
              // Align chart to the center of the card
              alignSelf: 'center',
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: ITEM_SIZE + 20,
    marginHorizontal: -5,
    padding: 10, // Reduced padding to ensure content fits well
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Ensure the content area does not have additional padding that could push the chart out
  },
});
