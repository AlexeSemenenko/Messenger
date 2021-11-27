import { Image, Text, View } from 'react-native'
import { Feather } from '@expo/vector-icons'
import React from 'react'

import styles from './styles'

function HomeHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.jpg'}}
        style={styles.img}
      />

      <Text style={styles.text}>Chats</Text>

      <Feather name="camera" size={24} color="black" />
      <Feather name="edit-2" size={24} color="black" style={styles.icon} />
    </View>
  )
}

export default HomeHeader
