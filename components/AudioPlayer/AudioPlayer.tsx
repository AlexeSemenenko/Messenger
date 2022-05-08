import React, { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Audio, AVPlaybackStatus } from 'expo-av'

import styles from './styles'

type Props = {
  soundUri: string | null
}

function AudioPlayer({ soundUri }: Props) {
  const [sound, setSound] = useState<Audio.Sound | null>(null)
  const [paused, setPaused] = useState<boolean>(true)
  const [audioProgress, setAudioProgress] = useState<number>(0)
  const [audioDuration, setAudioDuration] = useState<number>(0)

  useEffect(
    () => {
      loadSound()

      return () => {
        if (sound) {
          sound.unloadAsync()
        }
      }
    },
    [soundUri]
  )

  async function loadSound() {
    if (!soundUri) {
      return
    }

    const { sound } = await Audio.Sound.createAsync(
      {
        uri: soundUri,
      },
      {},
      onPlayBackStatusUpdate,
    )

    setSound(sound)
  }

  function getFormattedDuration() {
    const minutes = Math.floor(audioDuration / (60 * 1000))
    const seconds = Math.floor(audioDuration % (60 * 1000) / 1000)

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  function onPlayBackStatusUpdate(status: AVPlaybackStatus) {
    if (!status.isLoaded) {
      return
    }

    setAudioProgress(status.positionMillis / (status.durationMillis || 1))
    setPaused(!status.isPlaying)
    setAudioDuration(status.durationMillis || 0)
  }

  async function handlePlayPauseSound() {
    if (!sound) {
      return
    }

    if (paused) {
      await sound.playFromPositionAsync(0)
    } else {
      await sound.pauseAsync()
    }
  }

  return (
    <View style={styles.sendAudioContainer}>
      <Pressable onPress={handlePlayPauseSound}>
        <Feather
          name={paused ? 'play' : 'pause'}
          size={24}
          color="gray"
        />
      </Pressable>

      <View style={styles.audioProgressBG}>
        <View style={[styles.audioProgressFG, { left: `${audioProgress * 98}%` }]} />
      </View>

      <Text>
        {getFormattedDuration()}
      </Text>
    </View>
  )
}

export default AudioPlayer
