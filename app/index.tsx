import ExposureControls from '@/components/ExposureControls'
import ObscuraButton from '@/components/ObscuraButton'
import { ThemedText } from '@/components/ThemedText'
import ZoomControls from '@/components/ZoomControls'
import { FontAwesome5 } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Redirect, router } from 'expo-router'
import * as React from 'react'
import {
  Linking,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera'

const Home = () => {
  const { hasPermission } = useCameraPermission()
  const micorphonePermission = Camera.getMicrophonePermissionStatus()
  const redirectToPermissions =
    !hasPermission || micorphonePermission === 'not-determined'

  const [cameraPosition, setCameraPosition] = React.useState<'front' | 'back'>(
    'back',
  )
  const device = useCameraDevice(cameraPosition)

  const [showZoomControls, setShowZoomControls] = React.useState(false)
  const [showExposureControls, setShowExposureControls] = React.useState(false)

  const [zoom, setZoom] = React.useState(device?.neutralZoom)
  const [exposure, setExposure] = React.useState(0)
  const [flash, setFlash] = React.useState<'off' | 'on'>('off')
  const [torch, setTorch] = React.useState<'off' | 'on'>('off')
  const camera = React.useRef<Camera>(null)

  const takePicture = async () => {
    try {
      if (camera.current === null) throw new Error('Camera is not initialized')

      console.log('Taking a picture')
      const photo = await camera.current.takePhoto({
        flash: flash,
        enableShutterSound: false,
      })

      router.push({
        pathname: '/media',
        params: { media: photo.path, type: 'photo' },
      })
    } catch (error) {
      console.log(error)
    }
  }

  if (redirectToPermissions) return <Redirect href={'/permissions'} />
  if (!device) return <></>

  if (hasPermission)
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 2, borderRadius: 10, overflow: 'hidden' }}>
          <Camera
            ref={camera}
            style={{ flex: 1 }}
            device={device}
            isActive
            zoom={zoom}
            resizeMode="cover"
            exposure={exposure}
            torch={torch}
            video
            photo
            focusable
          />
          <BlurView
            intensity={40}
            tint="systemThinMaterialDark"
            style={{
              flex: 1,
              position: 'absolute',
              bottom: 0,
              right: 0,
              paddingVertical: 4,
              paddingHorizontal: 10,
              margin: 4,
              borderRadius: 4,
              overflow: 'hidden',
            }}
            experimentalBlurMethod="dimezisBlurView"
          >
            <Text style={{ color: 'white' }}>
              Exposure: {exposure} | Zoom: x{zoom}
            </Text>
          </BlurView>
          <BlurView
            intensity={40}
            tint="systemThinMaterialDark"
            style={{
              flex: 1,
              position: 'absolute',
              top: 0,
              left: 0,
              paddingVertical: 4,
              paddingHorizontal: 10,
              margin: 4,
              borderRadius: 12,
              overflow: 'hidden',
            }}
            experimentalBlurMethod="dimezisBlurView"
          >
            <Text style={{ color: 'white' }}>
              FPS: {device.formats[0].maxFps} | {device.formats[0].minFps}
            </Text>
          </BlurView>
        </View>

        {/* Bottom Section */}

        {showZoomControls ? (
          <ZoomControls
            setZoom={setZoom}
            setShowZoomControls={setShowZoomControls}
            zoom={zoom ?? 1}
          />
        ) : showExposureControls ? (
          <ExposureControls
            setExposure={setExposure}
            setShowExposureControls={setShowExposureControls}
            exposure={exposure}
          />
        ) : (
          <View style={{ flex: 1, padding: 10 }}>
            {/* Top section */}
            <View
              style={{
                flex: 0.4,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <ThemedText>
                Size: {device.formats[0].photoWidth} x{' '}
                {device.formats[0].photoHeight}
              </ThemedText>
              <ThemedText>{device.name}</ThemedText>
            </View>

            {/* Middle section */}
            <View
              style={{
                flex: 0.7,
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
              <ObscuraButton
                iconName={torch === 'on' ? 'flashlight' : 'flashlight-outline'}
                onPress={() => setTorch((t) => (t === 'off' ? 'on' : 'off'))}
                containerStyle={{ alignSelf: 'center' }}
              />
              <ObscuraButton
                iconName={
                  flash === 'on' ? 'flash-outline' : 'flash-off-outline'
                }
                onPress={() => setFlash((f) => (f === 'off' ? 'on' : 'off'))}
                containerStyle={{ alignSelf: 'center' }}
              />
              <ObscuraButton
                iconName="camera-reverse-outline"
                onPress={() =>
                  setCameraPosition((p) => (p === 'back' ? 'front' : 'back'))
                }
                containerStyle={{ alignSelf: 'center' }}
              />
              <ObscuraButton
                iconName="image-outline"
                onPress={() => {
                  const link = Platform.select({
                    ios: 'photos-redirect://',
                    android: 'content://media/external/images/media',
                  })
                  Linking.openURL(link!)
                }}
                containerStyle={{ alignSelf: 'center' }}
              />
              <ObscuraButton
                iconName="settings-outline"
                onPress={() => router.push('/_sitemap')}
                containerStyle={{ alignSelf: 'center' }}
              />
            </View>

            {/* Botton section */}
            <View
              style={{
                flex: 1.1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <ObscuraButton
                iconSize={40}
                title={`${zoom}x`}
                onPress={() => setShowZoomControls((s) => !s)}
                onLongPress={() => setZoom(1)}
                containerStyle={{
                  alignSelf: 'center',
                  borderRadius: 40,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
              <TouchableHighlight onPress={takePicture}>
                <FontAwesome5 name="dot-circle" size={55} color={'white'} />
              </TouchableHighlight>
              <ObscuraButton
                iconSize={40}
                title="+/-"
                onLongPress={() => setExposure(0)}
                onPress={() => setShowExposureControls((s) => !s)}
                containerStyle={{
                  alignSelf: 'center',
                  borderRadius: 40,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              />
            </View>
          </View>
        )}
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
})

export default Home
