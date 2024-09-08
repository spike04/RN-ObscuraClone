import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Ionicons } from '@expo/vector-icons'
import * as ExpoMediaLibrary from 'expo-media-library'
import { Stack, useRouter } from 'expo-router'
import { useState } from 'react'
import { Alert, StyleSheet, Switch, TouchableOpacity, View } from 'react-native'
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera'

const ICON_SIZE = 26

const PermissionsScreen = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    useState<CameraPermissionStatus>('not-determined')
  const [microphonePermissionStatus, setMicrophonePermissionStatus] =
    useState<CameraPermissionStatus>('not-determined')
  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    ExpoMediaLibrary.usePermissions()
  const router = useRouter()

  const requestMicrophonePermission = async () => {
    const permissions = await Camera.requestMicrophonePermission()
    setMicrophonePermissionStatus(permissions)
  }

  const requestCameraPermission = async () => {
    const permissions = await Camera.requestCameraPermission()
    setCameraPermissionStatus(permissions)
  }

  const handleContinue = () => {
    if (
      cameraPermissionStatus === 'granted' &&
      microphonePermissionStatus === 'granted' &&
      mediaLibraryPermission?.granted
    ) {
      router.replace('/')
    } else {
      Alert.alert('Please go to settings and enable permissions')
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Permissions' }} />
      <ThemedView style={styles.container}>
        <View style={styles.spacer} />
        <ThemedText type="subtitle" style={styles.subtitle}>
          Obscura needs access to a few permissions in order to work properly.
        </ThemedText>
        <View style={styles.spacer} />
        <View style={styles.row}>
          <Ionicons
            name="lock-closed-outline"
            size={ICON_SIZE}
            color="orange"
          />
          <ThemedText style={styles.footnote}>Required</ThemedText>
        </View>

        <View style={styles.spacer} />

        <View
          style={StyleSheet.compose(styles.row, styles.permissionContainer)}
        >
          <Ionicons name="camera-outline" color="gray" size={ICON_SIZE} />
          <View style={styles.permissionText}>
            <ThemedText type="subtitle">Camera</ThemedText>
            <ThemedText>Used for taking photos and videos.</ThemedText>
          </View>
          <Switch
            trackColor={{ true: 'orange' }}
            value={cameraPermissionStatus === 'granted'}
            onChange={requestCameraPermission}
          />
        </View>

        <View style={styles.spacer} />

        <View
          style={StyleSheet.compose(styles.row, styles.permissionContainer)}
        >
          <View style={styles.row}>
            <Ionicons name="mic-circle-outline" color="gray" size={ICON_SIZE} />
            <View style={styles.permissionText}>
              <ThemedText type="subtitle">Microphone</ThemedText>
              <ThemedText>Used for recording video.</ThemedText>
            </View>
          </View>
          <Switch
            trackColor={{ true: 'orange' }}
            value={microphonePermissionStatus === 'granted'}
            onChange={requestMicrophonePermission}
          />
        </View>

        <View style={styles.spacer} />

        <View
          style={StyleSheet.compose(styles.row, styles.permissionContainer)}
        >
          <Ionicons name="library-outline" color="gray" size={ICON_SIZE} />
          <View style={styles.permissionText}>
            <ThemedText type="subtitle">Library</ThemedText>
            <ThemedText>Used for saving, viewing and more.</ThemedText>
          </View>
          <Switch
            trackColor={{ true: 'orange' }}
            value={mediaLibraryPermission?.granted}
            // @ts-ignore
            onChange={async () => await requestMediaLibraryPermission()}
          />
        </View>

        <View style={styles.spacer} />
        <View style={styles.spacer} />
        <View style={styles.spacer} />

        <TouchableOpacity
          onPress={handleContinue}
          style={StyleSheet.compose(styles.row, styles.continueButton)}
        >
          <Ionicons
            name="arrow-forward-outline"
            size={ICON_SIZE}
            color="white"
          />
        </TouchableOpacity>
      </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    textAlign: 'center',
  },
  footnote: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spacer: {
    marginVertical: 8,
  },
  permissionContainer: {
    backgroundColor: '#ffffff20',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  permissionText: {
    marginLeft: 10,
    flexShrink: 1,
  },
  continueButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 50,
    alignSelf: 'center',
  },
})

export default PermissionsScreen
