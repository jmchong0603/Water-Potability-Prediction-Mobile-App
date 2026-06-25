import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

export default function Guide() {
  const [guideDetail, setGuideDetail] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [playing, setPlaying] = useState(false);

  // Fetch guide details from the backend
  useEffect(() => {
    axios.get('http://10.0.2.2:3000/guidedetail')
      .then(response => {
        setGuideDetail(response.data);
        setSelectedGuide(response.data[0].variable);  // Default to the first guide
      })
      .catch(error => {
        console.error('Error fetching guide details:', error);
      });
  }, []);

  const selectedVideo = guideDetail.find(guide => guide.variable === selectedGuide);

  const onStateChange = useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../Asset/background29.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.pickerWrapper}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedGuide}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedGuide(itemValue)}
            itemStyle={styles.pickerItem} // Styling individual Picker items
          >
            {guideDetail.map((guide) => (
              <Picker.Item 
                key={guide.variable} 
                label={guide.variable} 
                value={guide.variable} 
                color={selectedGuide === guide.variable ? "rgba(0, 0, 0, 0.9)" : "grey"} // Change the text color of Picker items
              />
            ))}
          </Picker>
        </View>
      </View>
      
      {selectedVideo && (
        <>
          <View style={styles.youtubeContainer}>
            <YoutubeIframe
              height={280}
              width={'100%'}
              play={playing}
              videoId={selectedVideo.video}
              onChangeState={onStateChange}
            />
          </View>
          <View style={styles.descriptionContainer}>
            <ScrollView>
              <Text style={styles.scrollHint}>Scroll down for more..</Text>
              <Text style={styles.text}>{selectedVideo.description}</Text>
            </ScrollView>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  pickerWrapper: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  pickerContainer: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    zIndex: 1,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    color: 'black',
  },
  youtubeContainer: {
    width: '90%',
    height: '28%',
    borderRadius: 30,  
    overflow: 'hidden',  
    backgroundColor: 'black', 
    marginBottom: 20,
    marginTop: 20,
  },
  text: {
    marginTop: -10,
    fontSize: 20,
    color: 'rgba(250, 247, 253, 0.8)',
    textAlign: 'left',
    paddingHorizontal: 20,
    zIndex: 1,
    marginBottom: 10,
    padding: 10,
    fontWeight: '700',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  descriptionContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 20,
    marginBottom: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '90%',
    height: '40%',
    borderRadius: 30,
    paddingTop: 5,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.3)',
  },
  scrollHint: {
    textAlign: 'center',
    fontSize: 15,
    color: 'gray',
    marginTop: -5,
    fontStyle: 'italic',
  },
});

