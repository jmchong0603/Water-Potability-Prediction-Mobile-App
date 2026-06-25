import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, FlatList, ImageBackground, } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const Recommend = {
  ph:  7.0 ,
  Hardness:  90 ,
  Solids:  450 ,
  Chloramines:  3.0 ,
  Sulfate:  200 ,
  Conductivity:  300 ,
  Organic_carbon:  1.5 ,
  Trihalomethanes:  60 ,
  Turbidity:  2 ,
};

const Result = ({ route }) => {
  const {
    ph,
    Hardness,
    Solids,
    Chloramines,
    Sulfate,
    Conductivity,
    Organic_carbon,
    Trihalomethanes,
    Turbidity,
    result
  } = route.params;

  const {
    ph: avgPh,
    Hardness: avgHardness,
    Solids: avgSolids,
    Chloramines: avgChloramines,
    Sulfate: avgSulfate,
    Conductivity: avgConductivity,
    Organic_carbon: avgOrganicCarbon,
    Trihalomethanes: avgTrihalomethanes,
    Turbidity: avgTurbidity 
  } = result.averages;

  const {
    RandomForestPrediction,
    NaiveBayesPrediction,
    XGBoostPrediction
  } = result.modelResults;

  const {
    RandomForestAccuracy,
    NaiveBayesAccuracy,
    XGBoostAccuracy
  } = result.modelAccuracies;

  const bestModelAccuracy = Math.max(RandomForestAccuracy, NaiveBayesAccuracy, XGBoostAccuracy);
  let bestPrediction;

  if (bestModelAccuracy === RandomForestAccuracy) {
    bestPrediction = RandomForestPrediction;
  } else if (bestModelAccuracy === NaiveBayesAccuracy) {
    bestPrediction = NaiveBayesPrediction;
  } else {
    bestPrediction = XGBoostPrediction;
  }

  const resultItems = Object.keys(Recommend).map((key) => ({
    title: key,
    currentValue: parseFloat(route.params[key]) || 0,
    avgValue: parseFloat(result.averages[key]) || 0,
    Recommend: parseFloat(Recommend[key]) || 0,
  }));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.content}>
        <BarChart
          data={{
            labels: ['Input', 'Average', 'Recommend'],
            datasets: [
              {
                data: [item.currentValue, item.avgValue, item.Recommend],
              },
            ],
          }}
          width={width * 0.8} // Adjust width to fit well within the screen
          height={200} // Adjust height as needed
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2, // optional, defaults to 2
            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForLabels: {
              fontSize: 12,
            },
          }}
          style={styles.chart}
        />
        {/* Display the values of each bar above them */}
        <View style={styles.valueContainer}>
          <Text style={styles.barValue}>{item.currentValue.toFixed(2)}</Text>
          <Text style={styles.barValue}>{item.avgValue.toFixed(2)}</Text>
          <Text style={styles.barValue}>{item.Recommend.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Water Quality Analysis Result</Text>

        <Text style={styles.swipeInstruction}>Swipe right to see more charts</Text>

        <FlatList
          data={resultItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardContainer}
        />

        <ImageBackground
          source={require('../Asset/water3.png')}
          style={styles.resultBackground}
        >
          <Text style={styles.aiPrediction}>
            Based on our comprehensive analysis, the AI prediction indicates that your water is{' '}
            <Text style={styles.boldText}>
              {bestPrediction === 'Potable' ? 'potable and safe for consumption' : 'not potable and may not be safe for consumption'}
            </Text>. Please consider testing your water with a certified lab for a more detailed assessment.
          </Text>
        </ImageBackground>

      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: 'rgba(94, 113, 106, 1)',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Add shadow for better contrast
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  }, 
  cardContainer: {
    paddingVertical: 0,
  },
  swipeInstruction: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  card: {
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slight transparency
    alignItems: 'center',
    width: width * 0.9, // Adjust width to ensure proper display
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10, // Adjust elevation for Android
    borderColor: 'rgba(253, 253, 242, 1)',
    borderWidth: 1,
    borderTopWidth: 40,
    borderBottomWidth: 40,
    backgroundColor: 'rgba(133, 157, 148, 1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 0,
    marginTop: -10,
  },
  content: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  boldText: {
    fontWeight: 'bold',
  },
  aiPrediction: {
    fontSize: 20,
    color: 'black',
    padding: 10,
    marginBottom: -5,
    textAlign: 'justify',
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.65,
    marginBottom: -5,
    marginLeft: 70,
    marginRight: 5,
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default Result;
