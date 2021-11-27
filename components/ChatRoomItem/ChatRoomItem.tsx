import React from 'react'
import { Image, Text, View, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/core'

import styles from './styles'
import { ChatRoom } from '../../types/types'

type Props = {
  chatRoom: ChatRoom
}

function ChatRoomItem(props: Props): JSX.Element {
  const mate = props.chatRoom.users[1]

  const navigation = useNavigation()

  function onPress(): void {
    // @ts-ignore
    navigation.navigate('ChatRoom', { id: props.chatRoom.id })
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image
        source={{ uri: mate.imageUri }}
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
            {mate.name}
          </Text>

          <Text style={styles.text}>
            {props.chatRoom.lastMessage.createdAt}
          </Text>
        </View>

        <Text numberOfLines={1} style={styles.text}>{props.chatRoom.lastMessage.content}</Text>
      </View>
    </Pressable>
  )
}

export default ChatRoomItem
