import * as React from 'react';
import { ViewStyle } from 'react-native';

export interface PanResponderProps {
  start: () => void;
  move: (gestureState: any) => void;
  end: (gestureState: any) => void;
}

export interface MarkerProps {
  pressed: boolean;
  pressedMarkerStyle?: ViewStyle;
  disabledMarkerStyle?: ViewStyle;
  markerStyle?: ViewStyle;
  enabled: boolean;
  currentValue: number;
  valuePrefix?: string;
  valueSuffix?: string;
  refresh?: boolean;
}

export interface LabelProps {
  markerValue: string | number;
  markerPosition: number;
  markerPressed: boolean;
}

export interface SliderProps {
  values: number;

  onValuesChange?: (values: number) => void;
  onValuesChangeStart?: () => void;
  onValuesChangeFinish?: (values: number) => void;
  onMarkersPosition?: (values: number) => void;

  sliderLength: number;
  touchDimensions: {
    height: number;
    width: number;
    borderRadius: number;
    slipDisplacement: number;
  };

  customMarker: React.ComponentType<MarkerProps>;
  customLabel: React.ComponentType<LabelProps>;

  min: number;
  max: number;
  step: number;

  optionsArray?: number[];

  containerStyle?: ViewStyle;
  trackStyle?: ViewStyle;
  trackTwoStyle?: ViewStyle;
  trackThreeStyle?: ViewStyle;
  selectedStyle?: ViewStyle;
  unselectedStyle?: ViewStyle;
  markerContainerStyle?: ViewStyle;
  markerStyle?: ViewStyle;
  pressedMarkerStyle?: ViewStyle;
  disabledMarkerStyle?: ViewStyle;
  valuePrefix?: string;
  valueSuffix?: string;
  enabled: boolean;
  onToggle?: () => void;
  snapped: boolean;
  markerOffsetX: number;
  markerOffsetY: number;
  minMarkerOverlapDistance?: number;
  enableLabel?: boolean;
  vertical: boolean;
  trackBuffer?: number;
}

export default class Slider extends React.Component<SliderProps> { }
