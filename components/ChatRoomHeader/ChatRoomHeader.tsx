import { Image, Text, View } from 'react-native'
import { AntDesign, Feather, SimpleLineIcons } from '@expo/vector-icons'
import React from 'react'

import styles from './styles'

function ChatRoomHeader(props: any) {
  return (
    <View style={[styles.container]}>
      <Image
        source={{ uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.jpg' }}
        style={styles.img}
      />

      <Text style={styles.text}>{props.children}</Text>

      <AntDesign name="videocamera" size={24} color="black" />
      <Feather name="phone" size={24} color="black" style={{ marginLeft: 10 }} />
      <SimpleLineIcons name="options-vertical" size={24} color="black" style={styles.icon} />
    </View>
  )
}

export default ChatRoomHeader
