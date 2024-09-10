import React, { useEffect, useState, useRef } from 'react';
import { FlatList, StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign'; 

const { width } = Dimensions.get('window');
const DOTS_COUNT = 7; 

const Slider = () => {
  // Local states
  const [states, setStates] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Onloading
  useEffect(() => {
    axios.get('http://localhost:3000/states')
      .then(response => {
        console.log(response.data);
        setStates(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  // Functions
  const onScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / (width * 0.33));
    setActiveIndex(index);
  };

  const onLeftArrowPress = () => {
    const newIndex = Math.max(activeIndex - 1, 0);
    setActiveIndex(newIndex);
    flatListRef.current.scrollToIndex({ index: newIndex });
  };

  const onRightArrowPress = () => {
    const newIndex = Math.min(activeIndex + 1, states.length - 1);
    setActiveIndex(newIndex);
    flatListRef.current.scrollToIndex({ index: newIndex });
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity 
        style={[styles.item, { backgroundColor: activeIndex === index ? '#D3D3D3' : '#FFFFFF' }]}
        onPress={() => setActiveIndex(index)} 
        activeOpacity={0.7} 
      >
        <Text style={styles.text}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const getPaginationDots = () => {
    const start = Math.max(activeIndex - Math.floor(DOTS_COUNT / 2), 0);
    const end = Math.min(start + DOTS_COUNT, states.length);
    
    const dots = [];
    for (let i = start; i < end; i++) {
      dots.push(i);
    }
    
    return dots;
  };

  const flatListRef = useRef(null);

  // View
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={states}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />
       <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={onLeftArrowPress}>
          <Icon name="left" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.dotsContainer}>
          {getPaginationDots().map(index => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                { opacity: activeIndex === index ? 1 : 0.5 }
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={onRightArrowPress}>
          <Icon name="right" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Style
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: width * 0.33,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  text: {
    fontSize: 18,
    fontFamily: 'Arial',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10, 
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000',
    marginHorizontal: 4,
  },
});

export default Slider;
