import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { ComponentProps } from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'

interface Props {
  onPress: () => void
  onLongPress?: () => void
  title?: string
  iconName?: ComponentProps<typeof Ionicons>['name']
  containerStyle?: StyleProp<ViewStyle>
  iconSize?: number
}

const ObscuraButton = ({
  onPress,
  onLongPress,
  title,
  iconName,
  containerStyle,
  iconSize,
}: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.container,
        {
          backgroundColor: Colors.dark.background,
          borderRadius: title ? 6 : 40,
          alignSelf: 'flex-start',
        },
        containerStyle,
      ]}
    >
      {iconName && (
        <Ionicons name={iconName} size={iconSize || 28} color="white" />
      )}
      {title ? (
        <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 7,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
})

export default ObscuraButton
