import React, { useState, useEffect } from 'react'
import { Image, Text, View, Pressable, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { Auth, DataStore } from 'aws-amplify'
import moment from 'moment'

import styles from './styles'
import { ChatRoom , ChatRoomUser, User, Message} from '../../src/models'

type Props = {
  chatRoom: ChatRoom
}

function ChatRoomItem(props: Props): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [lastMessage, setLastMessage] = useState<Message | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const navigation = useNavigation()

  useEffect(
    () => {
      async function fetchUsers(): Promise<void> {
        const fetchedUsers = (await DataStore.query(ChatRoomUser))
          .filter(it => it.chatRoom.id === props.chatRoom.id)
          .map(it => it.user)

        const authUser = await Auth.currentAuthenticatedUser()

        setUser(fetchedUsers.find(it => it.id !== authUser.attributes.sub) || null)
        setIsLoading(false)
      }

      fetchUsers()
    },
    []
  )

  useEffect(
    () => {
      if (!props.chatRoom.chatRoomLastMessageId) {
        return
      }

      DataStore.query(Message, props.chatRoom.chatRoomLastMessageId).then(setLastMessage)
    },
    []
  )

  function onPress(): void {
    // @ts-ignore
    navigation.navigate('ChatRoom', { id: props.chatRoom.id })
  }

  if (isLoading) {
    return <ActivityIndicator />
  }

  const time = moment(lastMessage?.createdAt).from(moment())

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image
        source={{ uri: props.chatRoom.imageUri ?? user?.imageUri }}
        style={styles.image}
      />

      { !!props.chatRoom.newMessages && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeNumber}>
            {props.chatRoom.newMessages}
          </Text>
        </View>
      )}

      <View style={styles.secondLevelContainer}>
        <View style={styles.row}>
          <Text style={styles.name}>
            {props.chatRoom.name ?? user?.realName ?? user?.name}
          </Text>

          <Text style={styles.text}>
            {time}
          </Text>
        </View>

        <Text numberOfLines={1} style={styles.text}>{lastMessage?.content}</Text>
      </View>
    </Pressable>
  )
}

export default ChatRoomItem
