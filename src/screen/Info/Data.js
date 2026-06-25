import {StyleSheet, Text, View, useWindowDimensions, ScrollView, ImageBackground} from 'react-native';
import React, {useEffect, useState} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import axios from 'axios'; 
import variableImage from '../../Component/imagePath/variableImage';
import Pagination from '../../Component/Pagination';
import CustomButton from '../../Component/CustomButton';
import {SafeAreaView} from 'react-native-safe-area-context';

const Data = () => {
  const {width: SCREEN_WIDTH} = useWindowDimensions();
  const flatListRef = useAnimatedRef(null);
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const [dataDetail, setDataDetail] = useState([]); // State to hold fetched data

  useEffect(() => {
    // Fetch data from the API
    axios.get('http://10.0.2.2:3000/variabledetail')
      .then(response => {
        setDataDetail(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const onViewableItemsChanged = ({viewableItems}) => {
    flatListIndex.value = viewableItems[0].index;
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  const RenderItem = ({item, index}) => {
    const imageAnimationStyle = useAnimatedStyle(() => {
      const opacityAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolation.CLAMP,
      );
      const translateYAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolation.CLAMP,
      );
      return {
        opacity: opacityAnimation,
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_WIDTH * 0.8,
        transform: [{translateY: translateYAnimation}],
      };
    });
  
    const textAnimationStyle = useAnimatedStyle(() => {
      const opacityAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolation.CLAMP,
      );
      const translateYAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolation.CLAMP,
      );

      return {
        opacity: opacityAnimation,
        transform: [{translateY: translateYAnimation}],
      };
    });
  
    const [textHeight, setTextHeight] = useState(0);
  
    const handleTextLayout = (event) => {
      setTextHeight(event.nativeEvent.layout.height);
    };
  
    const imageSource = item.is_remote
      ? {uri: item.image_path}
      : variableImage[item.image_path];
  
    if (!imageSource) {
      console.warn(`No image found for ${item.image_path}`);
    }
  
    return (
      <View style={[styles.itemContainer, {width: SCREEN_WIDTH}]}>
        <Animated.Image source={imageSource} style={imageAnimationStyle} />
        <Animated.View style={textAnimationStyle}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.frame}>  
            <ScrollView
              style={[styles.descriptionContainer, {height: textHeight}]}
              onLayout={handleTextLayout}
            >
              <Text style={styles.scrollHint}>Scroll down for more</Text>
              <Text style={styles.itemText}>{item.description}</Text>
            </ScrollView>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../Asset/background27.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <Animated.FlatList
          ref={flatListRef}
          onScroll={onScroll}
          data={dataDetail}
          renderItem={({item, index}) => {
            return <RenderItem item={item} index={index} />;
          }}
          keyExtractor={item => item.id.toString()}
          scrollEventThrottle={16}
          horizontal={true}
          bounces={false}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            minimumViewTime: 300,
            viewAreaCoveragePercentThreshold: 10,
          }}
        />
        <View style={styles.bottomContainer}>
          <Pagination dataDetail={dataDetail} x={x} screenWidth={SCREEN_WIDTH} />
          <CustomButton
            flatListRef={flatListRef}
            flatListIndex={flatListIndex}
            dataLength={dataDetail.length}
          />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Data;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', 
  },
  background: {
    flex: 1,
    justifyContent: 'center',

  },
  itemContainer: {
    marginTop: 80,
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 100,
  },
  itemTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#bfbfbf',
    marginTop: 165,
  },
  itemText: {
    textAlign: 'center',
    marginHorizontal: 35,
    color: 'rgb(255, 175, 26)',
    lineHeight: 25,
    textAlign: 'justify',
    marginBottom: 10,
    fontWeight: '800',
    fontSize: 15,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 20,
  },
  descriptionContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  scrollHint: {
    textAlign: 'center',
    fontSize: 15,
    color: 'grey',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  frame: {
    justifyContent: 'center', 
    width: '90%',
    height: '50%',
    backgroundColor: 'rgba(0, 61, 102, 1)',
    //0, 61, 102, 1
    //15, 28, 41
    borderRadius: 30,
    padding: 10,
    borderWidth: 3,
    borderColor: 'rgba(15, 28, 41, 0.5)',
    marginTop: 20,
  },
});
