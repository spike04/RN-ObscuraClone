import { Ionicons } from '@expo/vector-icons'
import {
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import Animated, { BounceIn } from 'react-native-reanimated'

const exposureOptionsAndroid = [-10, -5, 0, 5, 10]
const exposureOptionsIOS = [-2, -1, 0, 1, 2]
const exposureOptions =
  Platform.OS === 'android' ? exposureOptionsAndroid : exposureOptionsIOS

export default function ExposureControls({
  setExposure,
  setShowExposureControls,
  exposure,
}: {
  setExposure: (zoom: number) => void
  setShowExposureControls: (show: boolean) => void
  exposure: number
}) {
  const { width, height } = useWindowDimensions()
  const radius = Math.min(width, height - 100) * 0.35 // Adjust this value to change circle size

  const handleExposurePress = (exposureValue: number) => {
    setExposure(exposureValue)
    setShowExposureControls(false)
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {exposureOptions.map((exp, i) => {
        const angle =
          (i / exposureOptions.length / 3) * 2 * Math.PI - Math.PI / 2 // Start at 12 o'clock
        const x = width - Math.cos(angle) * radius - 90 // Align to right
        const y = Math.sin(angle) * radius + height / 4

        return (
          <Animated.View
            key={i}
            entering={BounceIn.delay(i * 100)}
            style={{
              position: 'absolute',
              left: x,
              top: y,
            }}
          >
            <TouchableHighlight
              onPress={() => handleExposurePress(exp)}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: exposure === exp ? '#ffffff' : '#ffffff30',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: exposure === exp ? 'black' : 'white',
                  fontWeight: '600',
                }}
              >
                {exp > 0 ? `+${exp}` : exp}
              </Text>
            </TouchableHighlight>
          </Animated.View>
        )
      })}

      <TouchableOpacity
        onPress={() => setShowExposureControls(false)}
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: '#ffffff30',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          right: 30,
          top: height / 4,
        }}
      >
        <Ionicons name="close-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  )
}
