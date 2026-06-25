import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';


const Information = ({ navigation }) => {
 return (
    <ImageBackground
    source={require('../Asset/background19.jpg')}
    style={styles.background}
    resizeMode="cover"
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Data')}>
          <Text style={styles.buttonText}>Variables Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ToolInfoStackNavigator')}>
          <Text style={styles.buttonText}>Equipment Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Guide')}>
          <Text style={styles.buttonText}>Guide Info</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Added padding to ensure spacing around the edges
  },
  button: {
    borderColor: 'white',
    borderWidth: 2,
    backgroundColor: 'rgba(0, 85, 128, 1)', // Match the button color
    paddingVertical: 10, // Adjust padding for vertical spacing
    paddingHorizontal: 20, // Adjust padding for horizontal spacing
    margin: 10, // Adjust margin to add space between buttons
    borderRadius: 30, // Adjust border radius
    borderColor: 'rgb(0, 119, 179)' ,
    width: 350, // Adjust width to match design
    height: 150, // Adjust height to match design
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
    elevation: 5,
  },
  buttonText: {
    color: 'rgb(249, 249, 220)', // Text color
    fontSize: 40, // Adjust font size to match design
    fontWeight: '500',
    textAlign: 'center', // Center text horizontally
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});


export default Information;