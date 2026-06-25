import { View, Text, Image, TouchableOpacity, Linking, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import toolImage from '../../Component/imagePath/toolImage';

export default function ToolDetails({ navigation, route }) {
  const item = route.params?.item;

  const handleShopPress = () => {
    if (item?.source) {
      Linking.openURL(item.source);
    }
  };

  const imageSource = item.is_remote
    ? { uri: item.image_path } // For remote images
    : toolImage[item.image_path]; // For local images

    if (!imageSource) {
      console.warn(`No image found for ${item.image_path}`);
    }

  return (
    <View style={styles.container}>
      <Image 
        style={styles.backgroundImage} 
        source={require('../../Asset/background8.jpg')} 
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon size="23" stroke={50} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image style={styles.itemImage} source={imageSource} />
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buyButton} onPress={handleShopPress}>
            <Text style={styles.buttonText}>Buy</Text>
          </TouchableOpacity>
          <Text style={styles.amazonText}>on Amazon</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Animatable.Text animation="slideInUp" style={styles.descriptionTitle}>
            Description
          </Animatable.Text>
          <ScrollView>
            <Animatable.Text delay={100} animation="slideInUp" style={styles.descriptionText}>
              {item.description}
            </Animatable.Text>
          </ScrollView>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            ${item.price}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    width: '100%',
    height: '48%',
    position: 'absolute',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  backButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 8,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  itemImage: {
    height: 192,
    width: 192,
    borderRadius: 20,
  },
  itemName: {
    fontSize: 24,
    color: 'white',
    marginTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange items horizontally
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  buyButton: {
    marginLeft: 90,
    backgroundColor: '#b22381',
    padding: 10,
    borderRadius: 10,
    marginRight: 8, // Add space between the button and the text
  },
  amazonText: {
    marginBottom: -20,
    color: 'orange',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  descriptionContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 10,
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'gray',
  },
  descriptionText: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    color: 'gray',
  },
  priceContainer: {
    marginHorizontal: 16,
    paddingBottom: 20,
  },
  priceText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'gray',
    textAlign: 'left',
  },
});
