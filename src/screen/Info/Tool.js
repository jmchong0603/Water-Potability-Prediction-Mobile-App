import React, { useState, useEffect } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios'; // Import Axios
import * as Animatable from 'react-native-animatable';
import ToolCard from '../../Component/ToolCard';
import { categories } from '../../Component/toolCategories';

export default function Tool() {
  const [activeCategory, setActiveCategory] = useState('pH');
  const [toolItems, setToolItems] = useState([]);

  useEffect(() => {
    // Fetch data from the API using Axios
    axios.get('http://10.0.2.2:3000/tooldetail')
      .then(response => {
        setToolItems(response.data);
      })
      .catch(error => {
        console.error('Error fetching tool items:', error);
      });
  }, []);

  //const filteredToolItems = toolItems.filter(item => item.category === activeCategory);
  const filteredToolItems = toolItems.filter(item => {
    // Split the category string into an array of categories
    const itemCategories = item.category.split(',').map(cat => cat.trim());
    // Check if the activeCategory exists in the item categories
    return itemCategories.includes(activeCategory);
  });

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../Asset/background22.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>Suggested</Text>
        <Text style={styles.text}>
          <Text style={[styles.text, styles.extraBoldText]}>Water </Text>
          Self-Test Kit
        </Text>
      </View>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {
          categories.map((category, index) => {
            let isActive = category === activeCategory;
            let textClass = isActive ? styles.activeText : styles.inactiveText;
            return (
              <Animatable.View
                delay={index*120}
                animation="slideInDown"
                key={index}>
                  <TouchableOpacity
                    style={styles.categoryButton}
                    onPress={() => setActiveCategory(category)}
                  >
                    <Text style={[styles.categoryText, textClass]}>
                      {category}
                    </Text>
                    {
                      isActive ? (
                        <View style={styles.lineContainer}>
                          <Image
                            source={require('../../Asset/White-Rectangle.png')}
                            style={styles.lineImage}
                          />
                        </View>
                      ) : null
                    }
                  </TouchableOpacity>
              </Animatable.View>
            );
          })
        }
      </ScrollView>
      <ScrollView contentContainerStyle={styles.toolContainer} horizontal showsVerticalScrollIndicator={false}>
        {
          filteredToolItems.map((item, index) => <ToolCard item={item} index={index} key={index} />)
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    marginTop: '25%',
    marginLeft: '5%',
  },
  text: {
    color: 'black',
    fontSize: 40,
    fontWeight: '500',
    marginVertical: 4,
    lineHeight: 50,
  },
  extraBoldText: {
    fontWeight: '900',
  },
  categoryContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    marginTop: '60%',
  },
  categoryButton: {
    marginRight: 30,
  },
  categoryText: {
    color: 'white',
    fontSize: 21,
    letterSpacing: 1.5,
  },
  activeText: {
    fontWeight: 'bold',
  },
  inactiveText: {
    fontWeight: 'normal',
  },
  lineContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  lineImage: {
    height: 3,
    width: 30,
  },
  toolContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});
