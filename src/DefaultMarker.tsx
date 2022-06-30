import React from 'react'
import { View, TouchableHighlight } from 'react-native'

import { MarkerProps } from '../index.d'
import { markerStyles } from './styles'

const DefaultMarker = (props: MarkerProps) => {
  return (
    <TouchableHighlight>
      <View
        style={
          props.enabled
            ? [
              markerStyles.markerStyle,
              props.markerStyle,
              props.pressed && markerStyles.pressedMarkerStyle,
              props.pressed && props.pressedMarkerStyle,
            ]
            : [
              markerStyles.markerStyle,
              markerStyles.disabled,
              props.disabledMarkerStyle,
            ]
        }
      />
    </TouchableHighlight>
  )
}

export default DefaultMarker
