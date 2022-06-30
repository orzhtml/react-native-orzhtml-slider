import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import { LabelProps } from './index.d'
import { labelStyles } from './styles'

const DefaultLabel = (props: LabelProps) => {
  const { markerValue, markerPosition, markerPressed } = props
  const sliderRadius = 3
  const width = 50

  return (
    <View style={{ position: 'relative' }}>
      {Number.isFinite(markerPosition) && Number.isFinite(markerValue) && (
        <View
          style={[
            labelStyles.sliderLabel,
            { minWidth: width, left: markerPosition - width / 2 + sliderRadius },
            markerPressed && labelStyles.markerPressed,
          ]}
        >
          <Text style={labelStyles.sliderLabelText}>{markerValue}</Text>
        </View>
      )}
    </View>
  )
}

export default DefaultLabel
