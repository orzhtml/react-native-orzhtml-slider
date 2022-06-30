/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react';
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import OrzHtmlSlider from './slider'

const App = () => {
  const [value, setValue] = useState(0)
  const [changeRotate, setChangeRotate] = useState(false)
  const [rotate, setRotate] = useState('0deg')
  const [sliderMax] = useState(1417)

  console.log('value:', value);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: StatusBar.currentHeight || 47 }} />
      <TouchableOpacity
        style={{ padding: 5 }}
        onPress={() => {
          let _value = value + 10
          if (_value <= sliderMax) {
            setValue(_value)
          } else {
            setValue(1417)
          }
        }}
      >
        <Text style={{ color: '#000' }}>点击</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 5 }}
        onPress={() => {
          let _changeRotate = !changeRotate
          setChangeRotate(_changeRotate)
          if (_changeRotate) {
            setRotate('90deg')
          } else {
            setRotate('0deg')
          }
        }}
      >
        <Text style={{ color: '#000' }}>旋转</Text>
      </TouchableOpacity>
      <View
        style={{
          backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: 300,
          height: 300,
          marginLeft: 30,
          marginTop: 200,
          transform: [
            {
              rotate: rotate,
            },
          ],
        }}
      >
        <View />
        <View style={{ backgroundColor: 'blue' }}>
          <OrzHtmlSlider
            values={value}
            min={0}
            max={sliderMax}
            enableLabel={true}
            vertical={changeRotate}
            sliderLength={200}
            containerStyle={{ height: 14 }}
            markerStyle={{ width: 14, height: 14 }}
            onValuesChangeFinish={(values: number) => {
              console.log('onValuesChangeFinish values:', values)
              setValue(values)
            }}
            onValuesChangeStart={() => {
              console.log('onValuesChangeStart')
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default App;
