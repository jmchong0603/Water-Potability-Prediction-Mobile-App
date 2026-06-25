import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, ScrollView, Alert, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Predict = () => {
  const [ph, setPh] = useState('');
  const [Hardness, setHardness] = useState('');
  const [Solids, setTds] = useState('');
  const [Chloramines, setChloramines] = useState('');
  const [Sulfate, setSulfate] = useState('');
  const [Conductivity, setConductivity] = useState('');
  const [Organic_carbon, setOrganicCarbon] = useState('');
  const [Trihalomethanes, setTrihalomethanes] = useState('');
  const [Turbidity, setTurbidity] = useState('');

  const navigation = useNavigation();

  const isValidNumber = (value) => !isNaN(value);
  
  const handleSubmit = async () => {
    if (
      !ph ||
      !Hardness ||
      !Solids ||
      !Chloramines ||
      !Sulfate ||
      !Conductivity ||
      !Organic_carbon ||
      !Trihalomethanes ||
      !Turbidity ||
      !isValidNumber(ph) ||
      !isValidNumber(Hardness) ||
      !isValidNumber(Solids) ||
      !isValidNumber(Chloramines) ||
      !isValidNumber(Sulfate) ||
      !isValidNumber(Conductivity) ||
      !isValidNumber(Organic_carbon) ||
      !isValidNumber(Trihalomethanes) ||
      !isValidNumber(Turbidity)
    ) {
      Alert.alert('Error', 'All fields are required and must be valid numbers.');
      return;
    }


    try {
      console.log('Submitting data...');
      const response = await fetch('http://10.0.2.2:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ph,
          Hardness,
          Solids,
          Chloramines,
          Sulfate,
          Conductivity,
          Organic_carbon,
          Trihalomethanes,
          Turbidity,
        }),
      });
      console.log('Response received');
      const result = await response.json();
      console.log('Result:', result);
    
      if (response.ok) {
        navigation.navigate('Result', {
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
        });
      } else {
        Alert.alert('Error', 'Something went wrong with the prediction.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to fetch prediction.');
    }
  }

  const handleClear = () => {
    setPh('');
    setHardness('');
    setTds('');
    setChloramines('');
    setSulfate('');
    setConductivity('');
    setOrganicCarbon('');
    setTrihalomethanes('');
    setTurbidity('');
  };

  return (
    <ImageBackground
      source={require('../Asset/background16.jpeg')}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
        source={require('../Asset/main.png')}
        style={styles.h1background}
        >
          <Text style={styles.h1}>Water Potability Prediction</Text>
      </ImageBackground>
        

        {/* pH Container */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>pH Value</Text>
          <TextInput
            style={styles.input}
            value={ph}
            onChangeText={setPh}
            placeholder="Enter pH value (eg: 7.1)"
            keyboardType="numeric"
          />
        </View>

        {/* Hardness Container */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hardness</Text>
          <TextInput
            style={styles.input}
            value={Hardness}
            onChangeText={setHardness}
            placeholder="Enter value in mg/L (eg: 143.36)"
            keyboardType="numeric"
          />
        </View>

        {/* TDS Container */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Total Dissolved Solids (TDS)</Text>
          <TextInput
            style={styles.input}
            value={Solids}
            onChangeText={setTds}
            placeholder="Enter value in ppm (eg: 334.33)"
            keyboardType="numeric"
          />
        </View>

        {/* Chloramines Container */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Chloramines</Text>
          <TextInput
            style={styles.input}
            value={Chloramines}
            onChangeText={setChloramines}
            placeholder="Enter value in ppm (eg: 5.06)"
            keyboardType="numeric"
          />
        </View>

        {/* Sulfate Container */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Sulfate</Text>
          <TextInput
            style={styles.input}
            value={Sulfate}
            onChangeText={setSulfate}
            placeholder="Enter value in mg/L (eg: 266.65)"
            keyboardType="numeric"
          />
        </View>

        {/* Conductivity Container */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Conductivity</Text>
          <TextInput
            style={styles.input}
            value={Conductivity}
            onChangeText={setConductivity}
            placeholder="Enter value in μS/cm (eg: 362.22)"
            keyboardType="numeric"
          />
        </View>

        {/* Organic Carbon Container */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Organic Carbon</Text>
          <TextInput
            style={styles.input}
            value={Organic_carbon}
            onChangeText={setOrganicCarbon}
            placeholder="Enter value in ppm (eg: 7.85)"
            keyboardType="numeric"
          />
        </View>

        {/* THMs Container */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Trihalomethanes (THMs)</Text>
          <TextInput
            style={styles.input}
            value={Trihalomethanes}
            onChangeText={setTrihalomethanes}
            placeholder="Enter value in μg/L (eg: 63.34)"
            keyboardType="numeric"
          />
        </View>

        {/* Turbidity Container */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Turbidity</Text>
          <TextInput
            style={styles.input}
            value={Turbidity}
            onChangeText={setTurbidity}
            placeholder="Enter value in NTU (eg: 2.98)"
            keyboardType="numeric"
          />
        </View>

        {/* Submit and Clear Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={handleClear}>
            <Text style={styles.buttonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(85, 168, 195, 0.2)',
    alignItems: 'center',  // Center align items horizontally
    justifyContent: 'center', // Center align items vertically
  },
  h1: {
    fontSize: 70,
    color: '#fff',
    marginBottom: 20,
    marginLeft: 0,
    fontWeight: '900',
  },
  h1background: {
    flex: 1,
    width: '100%',
    height: '200%',
  },
  inputContainer: {  
    marginBottom: 10,
    backgroundColor: 'rgba(33, 79, 94, 0.9)',
    borderRadius: 15,
    width: '105%',
    height: 110,
    alignItems: 'center',  // Center align items horizontally
  },
  label: {
    marginLeft: 10,
    marginVertical: 8,
    fontSize: 16,
    color: 'rgb(250, 250, 235)',
    padding: 5,
    fontWeight: '500',
  },
  input: {
    width: '90%',
    color: '#fff',
    height: 40,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(85, 168, 195, 0.2)',
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: 'row',  
    justifyContent: 'space-between',
    width: '105%',
  },
  button: {
    justifyContent: 'center', // Center align items vertically
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    flex: 1,
    marginHorizontal: 3, 
    height: 100,
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  submitButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default Predict;
