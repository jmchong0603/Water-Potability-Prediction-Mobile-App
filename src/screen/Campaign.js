import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Alert, StyleSheet, Text, TouchableOpacity, View, Linking, TextInput, ImageBackground } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const INITIAL_REGION = {
  latitude: 3.04,
  longitude: 101.79,
  latitudeDelta: 4.0,
  longitudeDelta: 4.0,
};

export default function Campaign() {
  const [markers, setMarkers] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const mapRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    axios.get('http://10.0.2.2:3000/campaigndetail')
      .then(response => {
        setMarkers(response.data);
      })
      .catch(error => {
        console.error('Error fetching campaign details:', error);
        Alert.alert('Error', 'Unable to fetch campaign details.');
      });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => mapRef.current.animateToRegion(INITIAL_REGION, 1000)}>
          <View style={{ padding: 10 }}>
            <Text>Focus</Text>
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (selectedCountry === '') {
      setFilteredMarkers([]);
    } else {
      const filtered = markers.filter(marker => marker.country.toLowerCase() === selectedCountry.toLowerCase());
      setFilteredMarkers(filtered);
      if (filtered.length > 0) {
        const firstMarker = filtered[0];
        mapRef.current.animateToRegion({
          latitude: parseFloat(firstMarker.latitude),
          longitude: parseFloat(firstMarker.longitude),
          latitudeDelta: 2.0,
          longitudeDelta: 2.0,
        }, 1000);
      }
    }
  }, [selectedCountry, markers]);

  const handleRegisterPress = (url) => {
    Linking.openURL(url);
  };

  const handleFilterChange = (country) => {
    setSelectedCountry(country);
  };

  const clearFilter = () => {
    setSelectedCountry('');
  };

  return (
    <ImageBackground
        source={require('../Asset/background30.png')}
        style={styles.background}
        resizeMode="cover"
      >
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Join our campaign</Text>
      <Text style={styles.description}>
        Join Our Water Quality Campaign! 🌊{"\n\n"}
        Discover the benefits of our exclusive water quality campaign, where you get expert insights and personalized analysis. Here’s what’s included:{"\n\n"}
        • Expert Talks: Learn from top water quality experts who share their knowledge and tips.{"\n"}
        • Water Sample Collection: Convenient collection of your water sample for thorough analysis.{"\n"}
        • Detailed Analysis Report: Receive a comprehensive report on your water’s potability and quality.{"\n\n"}
        Don’t miss out on this opportunity to ensure your water is safe and clean. <Text style={styles.register}>Register now</Text> to participate and get started on improving your water quality!{"\n\n"}
      </Text>
      <Text style={styles.hint}>Scroll Down</Text>
      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={INITIAL_REGION}
          showsUserLocation
          showsMyLocationButton
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
        >
          {filteredMarkers.map((marker, index) => (
            <Marker
              key={index}
              title={marker.name}
              coordinate={{
                latitude: parseFloat(marker.latitude),
                longitude: parseFloat(marker.longitude),
              }}
            />
          ))}
        </MapView>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Country</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter your country here..."
          value={selectedCountry}
          onChangeText={handleFilterChange}
        />
      </View>
      {selectedCountry !== '' && filteredMarkers.length === 0 ? (
        <Text style={styles.noCampaignText}>
          Thank you for your interest! Unfortunately, we currently don't have any campaigns available in <Text style={{ fontWeight: 'bold' }}>{selectedCountry}</Text>. Please check back later or explore other options.
        </Text>
      ) : (
        filteredMarkers.map((marker, index) => (
          <View key={index} style={styles.infoBox}>
            <Text style={styles.nameText}>{marker.name}</Text>
            <Text style={styles.infoText}>Venue: {marker.venue}</Text>
            <Text style={styles.infoText}>Fee: {marker.fee}</Text>
            <Text style={styles.infoText}>Date: {marker.date}</Text>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => handleRegisterPress(marker.registerForm)}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    padding: 20,
  },
  background: {
    flex: 1,
    justifyContent: 'center',

  },
  heading: {
    fontSize: 75,
    fontWeight: 'bold',
    marginBottom: 40,
    marginTop: 50,
    textAlign: 'center',
    color: 'rgb(0, 26, 51)',
  },
  description: {
    fontSize: 16,
    textAlign: 'justify',
    color: 'rgba(255, 255, 255, 1)',
  },
  hint: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgb(0, 0, 0)',
    marginTop: -35,
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#007BFF',
    marginBottom: 15,
  },
  labelContainer: {
    backgroundColor: '#0056b3',
    padding: 10,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderTopWidth: 0, 
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  mapContainer: {
    width: '100%',
    height: 300,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#b22381',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noCampaignText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 10,
  },
  clearFilter: {
    color: '#007BFF',
    textDecorationLine: 'underline',
  },
});
