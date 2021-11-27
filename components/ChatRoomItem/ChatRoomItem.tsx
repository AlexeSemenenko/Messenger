import React from 'react'
import { Image, Text, View } from 'react-native'

import styles from './styles'
import { ChatRoom } from '../../types/types'

type Props = {
  chatRoom: ChatRoom
}

function ChatRoomItem( props: Props): JSX.Element {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: props.chatRoom.users[1].imageUri }}
        style={styles.image}
      />

      { props.chatRoom.newMessages && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeNumber}>
            {props.chatRoom.newMessages}
          </Text>
        </View>
      )}

      <View style={styles.secondLevelContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>
            {props.chatRoom.users[1].name}
          </Text>

          <Text style={styles.text}>
            {props.chatRoom.lastMessage.createdAt}
          </Text>
        </View>

        <Text numberOfLines={1} style={styles.text}>{props.chatRoom.lastMessage.content}</Text>
      </View>
    </View>
  )
}

export default ChatRoomItem
