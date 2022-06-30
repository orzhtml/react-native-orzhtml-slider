import React, { useEffect, useRef, useState } from 'react'
import { PanResponder, View, I18nManager } from 'react-native'

import { SliderProps } from './index.d'
import { createArray, valueToPosition, positionToValue } from './converters'
import DefaultMarker from './DefaultMarker'
import DefaultLabel from './DefaultLabel'
import { SliderStyles } from './styles'

const Slider = (props: SliderProps) => {
  const _markerRef = useRef<any>(null)
  const _sliderLengthRef = useRef(props.sliderLength)
  const _optionsArrayRef = useRef(props.optionsArray || createArray(props.min, props.max, props.step))
  const _initialValuesRef = useRef(valueToPosition(props.values, _optionsArrayRef.current, _sliderLengthRef.current))
  const _verticalRef = useRef(props.vertical)
  const _enabledRef = useRef(props.enabled)

  const [trackBuffer, setTrackBuffer] = useState(0)
  const [curValue, setCurValue] = useState(props.values)
  const [past, setPast] = useState(_initialValuesRef.current)
  const [position, setPosition] = useState(_initialValuesRef.current)
  const [pressed, setPressed] = useState(false)
  const [refresh, setRefresh] = useState(false)
  const _curValueRef = useRef(curValue)
  const _pastRef = useRef(past)
  const _positionRef = useRef(position)
  const _pressedRef = useRef(pressed)
  const _refreshRef = useRef(false)
  const _snappedRef = useRef(props.snapped)

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
    // 滑块长度
    _sliderLengthRef.current = props.sliderLength
    // 是否启用
    _enabledRef.current = props.enabled
    // 拍下了
    _snappedRef.current = props.snapped
    // 刷新视图
    _refreshRef.current = !_refreshRef.current
    setRefresh(_refreshRef.current)
  }, [props.vertical, props.sliderLength, props.enabled, props.snapped])

  useEffect(() => {
    // 缓存进度
    const _trackBuffer = valueToPosition(props.trackBuffer, _optionsArrayRef.current, _sliderLengthRef.current)
    setTrackBuffer(_trackBuffer)
  }, [props.trackBuffer, _sliderLengthRef.current])

  useEffect(() => {
    if (_pressedRef.current) { return }

    _optionsArrayRef.current = props.optionsArray || createArray(props.min, props.max, props.step)

    const _position = valueToPosition(props.values, _optionsArrayRef.current, _sliderLengthRef.current)

    _curValueRef.current = props.values
    _pastRef.current = _position
    _positionRef.current = _position

    setCurValue(props.values)
    setPast(_position)
    setPosition(_position)
  }, [
    props.min, props.max,
    props.step, props.values,
    _sliderLengthRef.current, props.optionsArray
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
    let top = _sliderLengthRef.current
    let confined = unconfined < bottom ? bottom : unconfined > top ? top : unconfined
    let slipDisplacement = props.touchDimensions.slipDisplacement

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      let value = positionToValue(confined, _optionsArrayRef.current, top)
      let snapped = valueToPosition(value, _optionsArrayRef.current, top)
      _positionRef.current = props.snapped ? snapped : confined

      setPosition(_positionRef.current)

      if (value !== _curValueRef.current) {
        _curValueRef.current = value
        setCurValue(value)
        props.onValuesChange && props.onValuesChange(value)
        props.onMarkersPosition && props.onMarkersPosition(_positionRef.current)

      }
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
    selectedStyle, unselectedStyle,
    markerOffsetX, markerOffsetY,
  } = props
  const trackLength = position
  const trackStyle = selectedStyle || SliderStyles.selectedTrack
  const trackThreeStyle = unselectedStyle
  const trackTwoLength = _sliderLengthRef.current - trackLength
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
              { width: _sliderLengthRef.current },
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
                position > _sliderLengthRef.current / 2 && SliderStyles.topMarkerContainer,
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
                  enabled={_enabledRef.current}
                  currentValue={curValue}
                  valuePrefix={props.valuePrefix}
                  valueSuffix={props.valueSuffix}
                  refresh={refresh}
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
  customMarker: DefaultMarker,
  customLabel: DefaultLabel,
  values: 0,
  step: 1,
  min: 0,
  max: 10,
  touchDimensions: {
    height: 50,
    width: 50,
    borderRadius: 15,
    slipDisplacement: 200,
  },
  markerOffsetX: 0,
  markerOffsetY: 0,
  sliderLength: 280,
  enabled: true,
  snapped: false,
  vertical: false,
  minMarkerOverlapDistance: 0,
}

export default Slider
