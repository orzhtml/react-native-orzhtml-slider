import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  StyleSheet, PanResponder,
  View, I18nManager,
} from 'react-native'

import { SliderProps } from './index.d'
import { createArray, valueToPosition, positionToValue } from './converters'
import DefaultMarker from './DefaultMarker'
import DefaultLabel from './DefaultLabel'
import { SliderStyles } from './styles'

const Slider = (props: any) => {
  const _markerRef = useRef<any>(null)
  const _optionsArrayRef = useRef(props.optionsArray || createArray(props.min, props.max, props.step))
  const _initialValuesRef = useRef(valueToPosition(props.values, _optionsArrayRef.current, props.sliderLength))
  const _verticalRef = useRef(props.vertical)
  const _enabledRef = useRef(props.enabled)

  const [trackBuffer, setTrackBuffer] = useState(0)
  const [curValue, setCurValue] = useState(props.values)
  const [past, setPast] = useState(_initialValuesRef.current)
  const [position, setPosition] = useState(_initialValuesRef.current)
  const [pressed, setPressed] = useState(false)
  const _curValueRef = useRef(curValue)
  const _pastRef = useRef(past)
  const _positionRef = useRef(position)
  const _pressedRef = useRef(pressed)

  const Marker = props.customMarker
  const Label = props.customLabel

  const _panResponderRef = useRef<any>(PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderGrant: (evt, gestureState) => onPanGrant(),
    onPanResponderMove: (evt, gestureState) => onPanMove(gestureState),
    onPanResponderTerminationRequest: (evt, gestureState) => false,
    onPanResponderRelease: (evt, gestureState) => onPanEnd(gestureState),
    onPanResponderTerminate: (evt, gestureState) => onPanEnd(gestureState),
    onShouldBlockNativeResponder: (evt, gestureState) => true,
  }))

  useEffect(() => {
    // 垂直滑动
    _verticalRef.current = props.vertical
  }, [props.vertical])

  useEffect(() => {
    // 是否启用
    _enabledRef.current = props.enabled
  }, [props.enabled])

  useEffect(() => {
    // 缓存进度
    const _trackBuffer = valueToPosition(props.trackBuffer, _optionsArrayRef.current, props.sliderLength)
    setTrackBuffer(_trackBuffer)
  }, [props.trackBuffer, props.sliderLength])

  useEffect(() => {
    if (_pressedRef.current) { return }

    _optionsArrayRef.current = props.optionsArray || createArray(props.min, props.max, props.step)

    const _position = valueToPosition(props.values, _optionsArrayRef.current, props.sliderLength)

    _curValueRef.current = props.values
    _pastRef.current = _position
    _positionRef.current = _position

    setCurValue(props.values)
    setPast(_position)
    setPosition(_position)
  }, [
    props.min, props.max,
    props.step, props.values,
    props.sliderLength, props.optionsArray
  ])

  const onPanGrant = () => {
    let __pressed = !_pressedRef.current
    if (_enabledRef.current) {
      props.onValuesChangeStart && props.onValuesChangeStart()
      _pressedRef.current = __pressed
      setPressed(__pressed)
    }
  }

  const onPanMove = (gestureState: any) => {
    if (!_enabledRef.current) {
      return
    }

    const accumDistance = _verticalRef.current ? gestureState.dy : gestureState.dx
    const accumDistanceDisplacement = _verticalRef.current ? -gestureState.dx : gestureState.dy
    const unconfined = I18nManager.isRTL ? _pastRef.current - accumDistance : accumDistance + _pastRef.current
    let bottom = 0
    let top = props.sliderLength
    let confined = unconfined < bottom ? bottom : unconfined > top ? top : unconfined
    let slipDisplacement = props.touchDimensions.slipDisplacement

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      _curValueRef.current = positionToValue(confined, _optionsArrayRef.current, top)
      let snapped = valueToPosition(_curValueRef.current, _optionsArrayRef.current, top)
      _positionRef.current = props.snapped ? snapped : confined

      setPosition(_positionRef.current)
      setCurValue(_curValueRef.current)
      props.onValuesChange && props.onValuesChange(_curValueRef.current)
      props.onMarkersPosition && props.onMarkersPosition(_positionRef.current)
    }
  }

  const onPanEnd = (gestureState: any) => {
    if (gestureState.moveX === 0 && props.onToggle) {
      props.onToggle()
      return
    }

    _pressedRef.current = !_pressedRef.current

    setPast(_positionRef.current)
    setPressed(_pressedRef.current)

    props.onValuesChangeFinish && props.onValuesChangeFinish(_curValueRef.current)
  }

  const containerStyle = [SliderStyles.container, props.containerStyle]
  const {
    selectedStyle, unselectedStyle, sliderLength,
    markerOffsetX, markerOffsetY,
  } = props
  const trackLength = position
  const trackStyle = selectedStyle || SliderStyles.selectedTrack
  const trackThreeStyle = unselectedStyle
  const trackTwoLength = sliderLength - trackLength
  const trackTwoStyle = unselectedStyle
  const { slipDisplacement, height, width, borderRadius } = props.touchDimensions
  const touchStyle = { borderRadius: borderRadius || 0 }
  const markerContainer = {
    top: markerOffsetY - 24,
    left: trackLength + markerOffsetX - 24,
  }

  return (
    <View>
      {props.enableLabel && (
        <Label
          markerValue={curValue}
          markerPosition={position}
          markerPressed={pressed}
        />
      )}
      <View style={containerStyle}>
        <React.Fragment>
          <View
            style={[
              SliderStyles.fullTrack,
              { width: sliderLength, position: 'relative' },
            ]}
          >
            <View
              style={[
                SliderStyles.track,
                props.trackStyle,
                trackStyle,
                { width: trackLength },
              ]}
            />
            <View
              style={[
                SliderStyles.track,
                SliderStyles.trackTwoStyle,
                props.trackTwoStyle,
                trackTwoStyle,
                { width: trackTwoLength },
              ]}
            />
            <View
              style={[
                SliderStyles.track,
                SliderStyles.trackThreeStyle,
                props.trackThreeStyle,
                trackThreeStyle,
                { width: trackBuffer },
              ]}
            />
            <View
              style={[
                SliderStyles.markerContainer,
                markerContainer,
                props.markerContainerStyle,
                position > sliderLength / 2 && SliderStyles.topMarkerContainer,
              ]}
            >
              <View
                ref={_markerRef}
                style={[SliderStyles.touch, touchStyle]}
                {..._panResponderRef.current.panHandlers}
              >
                <Marker
                  pressed={pressed}
                  pressedMarkerStyle={props.pressedMarkerStyle}
                  disabledMarkerStyle={props.disabledMarkerStyle}
                  markerStyle={props.markerStyle}
                  enabled={props.enabled}
                  currentValue={curValue}
                  valuePrefix={props.valuePrefix}
                  valueSuffix={props.valueSuffix}
                />
              </View>
            </View>
          </View>
        </React.Fragment>
      </View>
    </View>
  )
}

Slider.defaultProps = {
  values: 0,
  onValuesChangeStart: () => { },
  onValuesChange: (values: any) => { },
  onValuesChangeFinish: (values: any) => { },
  onMarkersPosition: (values: any) => { },
  step: 1,
  min: 0,
  max: 10,
  touchDimensions: {
    height: 50,
    width: 50,
    borderRadius: 15,
    slipDisplacement: 200,
  },
  customMarker: DefaultMarker,
  customLabel: DefaultLabel,
  markerOffsetX: 0,
  markerOffsetY: 0,
  sliderLength: 280,
  onToggle: undefined,
  enabled: true,
  snapped: false,
  vertical: false,
  minMarkerOverlapDistance: 0,
}

export default Slider
