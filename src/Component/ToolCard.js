import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { ShoppingBagIcon } from 'react-native-heroicons/solid';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import toolImage from '../Component/imagePath/toolImage';

export default function ToolCard({ item, index }) {

    const navigation = useNavigation();

    const imageSource = item.is_remote
    ? { uri: item.image_path } // For remote images
    : toolImage[item.image_path]; // For local images

    if (!imageSource) {
      console.warn(`No image found for ${item.image_path}`);
    }


  return (

    <Animatable.View
        delay={index*120}
        animation="slideInRight"
        key={index}
        style={{
        width: 225,
        height: 300,
        marginVertical: 0,
        marginHorizontal: 10, 
        marginRight: 15,
        padding: 15,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <Image source={imageSource} style={{ height: 100, width: 100, borderRadius: 10 }} />
      </View>
      <View style={{ flex: 1, padding: 10, justifyContent: 'center' }}>
        <Text style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: 18, fontWeight: '600' }}>{item.name}</Text>
        <Text style={{ color: 'white', marginTop: 10 }}>{item.pros}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>${item.price}</Text>
        <TouchableOpacity onPress={()=>navigation.navigate('ToolDetails', { item })} style={{ backgroundColor: 'white', padding: 10, borderRadius: 50 }}>
          <ShoppingBagIcon size="25" color="black" />
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
}

