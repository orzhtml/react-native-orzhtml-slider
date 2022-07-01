/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useState } from 'react'
import {
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import OrzHtmlSlider from './slider'
import { useSingleInstanceVar, useSingleState, useStateCB } from './slider/UseCom'

const App = () => {
  const [value, setValue] = useState(0)
  const [changeRotate, setChangeRotate] = useState(false)
  const [rotate, setRotate] = useState('0deg')
  const [sliderMax] = useState(1417)
  const [sliderLength, setSliderLength] = useState(200)
  const instanceVal = useSingleInstanceVar({
    interval: null
  })
  const [getCount, setCount] = useStateCB(0)
  const [state, setState] = useSingleState({
    counts: 0,
    time: +new Date()
  })
  const { counts, time } = state

  const doSomeActions = () => {
    console.log('useStateCB Current count:', getCount())
  }

  const doSomeActions2 = () => {
    console.log('useSingleState Current ')
    console.log("counts 在外部定义获取的不是最新:", counts)
    console.log("state.counts 从 state 获取则是最新:", state.counts)
  }

  const start = () => {
    stop()
    instanceVal.interval = setInterval(
      () => setState({ counts: state.counts + 1 }),
      1000
    )
  }

  const stop = () => {
    const interval = instanceVal.interval
    interval && clearInterval(interval)
  }

  console.log('value:', value)

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
            setSliderLength(250)
          } else {
            setRotate('0deg')
            setSliderLength(200)
          }
        }}
      >
        <Text style={{ color: '#000' }}>旋转</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 5 }}
        onPress={() => setCount(getCount() + 1, doSomeActions)}
      >
        <Text>Increase</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ padding: 5 }}
        onPress={() => {
          console.log('state.counts:', state.counts)
          setState({
            counts: state.counts + 1
          }, doSomeActions2)
        }}
      >
        <Text>Increase2</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ padding: 5 }} onPress={start}>
        <Text>Start</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ padding: 5 }} onPress={stop}>
        <Text>Stop</Text>
      </TouchableOpacity>
      <Text style={{ padding: 5 }}>{counts} {time}</Text>
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
            sliderLength={sliderLength}
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
  )
}

export default App
