import { StyleSheet } from "react-native"

export const markerStyles = StyleSheet.create({
  markerStyle: {
    height: 30,
    width: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 1,
    shadowOpacity: 0.2,
  },
  pressedMarkerStyle: {
    height: 20,
    width: 20,
    borderRadius: 20,
  },
  disabled: {
    backgroundColor: '#d3d3d3',
  },
})

export const labelStyles = StyleSheet.create({
  sliderLabel: {
    position: 'absolute',
    bottom: 0,
    padding: 8,
    backgroundColor: '#f1f1f1',
  },
  sliderLabelText: {
    alignItems: 'center',
    textAlign: 'center',
    fontStyle: 'normal',
    fontSize: 11,
  },
  markerPressed: {
    borderWidth: 2,
    borderColor: '#999',
  },
})

export const SliderStyles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 50,
    justifyContent: 'center',
  },
  fullTrack: {
    flexDirection: 'row',
    position: 'relative'
  },
  track: {
    height: 2,
    borderRadius: 2,
    backgroundColor: 'rgba(137,137,137,0.8)',
    position: 'relative',
    zIndex: 3,
  },
  trackTwoStyle: {
    zIndex: 2,
  },
  trackThreeStyle: {
    backgroundColor: '#aaa',
    position: 'absolute',
    left: 0,
    zIndex: 2,
  },
  selectedTrack: {
    backgroundColor: '#fff',
  },
  markerContainer: {
    position: 'absolute',
    width: 48,
    height: 48,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
  },
  topMarkerContainer: {
    zIndex: 4,
  },
  touch: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
})
