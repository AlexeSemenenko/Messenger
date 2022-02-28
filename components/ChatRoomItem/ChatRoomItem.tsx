import React, { useState, useEffect } from 'react'
import { Image, Text, View, Pressable, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { Auth, DataStore } from 'aws-amplify'

import styles from './styles'
import { ChatRoom , ChatRoomUser, User} from '../../src/models'

type Props = {
  chatRoom: ChatRoom
}

function ChatRoomItem(props: Props): JSX.Element {
  // const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<User | null>(null)

  const navigation = useNavigation()

  useEffect(
    () => {
      async function fetchUsers(): Promise<void> {
        const fetchedUsers = (await DataStore.query(ChatRoomUser))
          .filter(it => it.chatRoom.id === props.chatRoom.id)
          .map(it => it.user)

        // setUsers(fetchedUsers)

        const authUser = await Auth.currentAuthenticatedUser()

        setUser(fetchedUsers.find(it => it.id !== authUser.attributes.sub) || null)
      }

      fetchUsers()
    },
    []
  )

  function onPress(): void {
    // @ts-ignore
    navigation.navigate('ChatRoom', { id: props.chatRoom.id })
  }

  if (!user) {
    return <ActivityIndicator />
  }

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Image
        source={{ uri: user.imageUri }}
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
            {user.name}
          </Text>

          <Text style={styles.text}>
            {props.chatRoom.LastMessage?.createdAt}
          </Text>
        </View>

        <Text numberOfLines={1} style={styles.text}>{props.chatRoom.LastMessage?.content}</Text>
      </View>
    </Pressable>
  )
}

export default ChatRoomItem
