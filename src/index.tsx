import React, { useEffect, useRef, useState } from 'react'
import { PanResponder, View, I18nManager } from 'react-native'

import { SliderProps } from './index.d'
import { useSingleState } from './UseCom'
import { createArray, valueToPosition, positionToValue } from './converters'
import DefaultMarker from './DefaultMarker'
import DefaultLabel from './DefaultLabel'
import { SliderStyles } from './styles'

const Slider = (props: SliderProps) => {
  const _markerRef = useRef<any>(null)
  const _optionsArrayRef = useRef(props.optionsArray || createArray(props.min, props.max, props.step))
  const _initialValuesRef = useRef(valueToPosition(props.values, _optionsArrayRef.current, props.sliderLength))

  const [state, setState] = useSingleState({
    sliderLength: props.sliderLength,
    vertical: props.vertical,
    enabled: props.enabled,
    trackBuffer: 0,
    curValue: props.values,
    past: _initialValuesRef.current,
    position: _initialValuesRef.current,
    pressed: false,
    snapped: props.snapped
  })

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
  // 其他状态变更
  useEffect(() => {
    setState({
      // 垂直滑动
      vertical: props.vertical,
      // 滑块长度
      sliderLength: props.sliderLength,
      // 是否启用
      enabled: props.enabled,
      // 拍下了
      snapped: props.snapped,
    })
  }, [props.vertical, props.sliderLength, props.enabled, props.snapped])
  // 缓存进度
  useEffect(() => {
    const _trackBuffer = valueToPosition(props.trackBuffer, _optionsArrayRef.current, state.sliderLength)
    setState({
      trackBuffer: _trackBuffer
    })
  }, [props.trackBuffer, state.sliderLength])
  // 外部 values 值变化
  useEffect(() => {
    if (state.pressed) { return }

    _optionsArrayRef.current = props.optionsArray || createArray(props.min, props.max, props.step)

    const _position = valueToPosition(props.values, _optionsArrayRef.current, state.sliderLength)

    setState({
      curValue: props.values,
      past: _position,
      position: _position
    })
  }, [
    props.min, props.max,
    props.step, props.values,
    props.optionsArray,
    state.sliderLength
  ])

  const onPanGrant = () => {
    let pressed = !state.pressed
    if (state.enabled) {
      props.onValuesChangeStart && props.onValuesChangeStart()
      setState({
        pressed: pressed
      })
    }
  }

  const onPanMove = (gestureState: any) => {
    if (!state.enabled) {
      return
    }

    const accumDistance = state.vertical ? gestureState.dy : gestureState.dx
    const accumDistanceDisplacement = state.vertical ? -gestureState.dx : gestureState.dy
    const unconfined = I18nManager.isRTL ? state.past - accumDistance : accumDistance + state.past
    let bottom = 0
    let top = state.sliderLength
    let confined = unconfined < bottom ? bottom : unconfined > top ? top : unconfined
    let slipDisplacement = props.touchDimensions.slipDisplacement

    if (
      Math.abs(accumDistanceDisplacement) < slipDisplacement ||
      !slipDisplacement
    ) {
      let value = positionToValue(confined, _optionsArrayRef.current, top)
      let snapped = valueToPosition(value, _optionsArrayRef.current, top)
      let _position = props.snapped ? snapped : confined

      setState({
        position: _position
      })

      if (value !== state.curValue) {
        setState({
          curValue: value
        }, () => {
          console.log('_position:', _position, state.position);
          props.onValuesChange && props.onValuesChange(state.curValue)
          props.onMarkersPosition && props.onMarkersPosition(state.position)
        })
      }
    }
  }

  const onPanEnd = (gestureState: any) => {
    if (gestureState.moveX === 0 && props.onToggle) {
      props.onToggle()
      return
    }

    setState({
      pressed: !state.pressed,
      past: state.position
    })

    props.onValuesChangeFinish && props.onValuesChangeFinish(state.curValue)
  }

  const containerStyle = [SliderStyles.container, props.containerStyle]
  const {
    selectedStyle, unselectedStyle,
    markerOffsetX, markerOffsetY,
  } = props
  const trackLength = state.position
  const trackStyle = selectedStyle || SliderStyles.selectedTrack
  const trackThreeStyle = unselectedStyle
  const trackTwoLength = state.sliderLength - trackLength
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
          markerValue={state.curValue}
          markerPosition={state.position}
          markerPressed={state.pressed}
        />
      )}
      <View style={containerStyle}>
        <React.Fragment>
          <View
            style={[
              SliderStyles.fullTrack,
              { width: state.sliderLength },
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
                { width: state.trackBuffer },
              ]}
            />
            <View
              style={[
                SliderStyles.markerContainer,
                markerContainer,
                props.markerContainerStyle,
                state.position > state.sliderLength / 2 && SliderStyles.topMarkerContainer,
              ]}
            >
              <View
                ref={_markerRef}
                style={[SliderStyles.touch, touchStyle]}
                {..._panResponderRef.current.panHandlers}
              >
                <Marker
                  pressed={state.pressed}
                  pressedMarkerStyle={props.pressedMarkerStyle}
                  disabledMarkerStyle={props.disabledMarkerStyle}
                  markerStyle={props.markerStyle}
                  enabled={state.enabled}
                  currentValue={state.curValue}
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
