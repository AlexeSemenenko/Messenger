import { Image, Text, View } from 'react-native'
import { AntDesign, Feather, SimpleLineIcons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Auth, DataStore } from 'aws-amplify'

import styles from './styles'
import { ChatRoomUser, User } from '../../src/models'

// @ts-ignore
function ChatRoomHeader({ id, children }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(
    () => {
      if (!id) {
        return
      }

      async function fetchUsers(): Promise<void> {
        const fetchedUsers = (await DataStore.query(ChatRoomUser))
          .filter(it => it.chatRoom.id === id)
          .map(it => it.user)

        const authUser = await Auth.currentAuthenticatedUser()

        setUser(fetchedUsers.find(it => it.id !== authUser.attributes.sub) || null)
      }

      fetchUsers()
    },
    []
  )

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user?.imageUri }}
        style={styles.img}
      />

      <Text style={styles.text}>{user?.name}</Text>

      <AntDesign name="videocamera" size={24} color="black" />

      <Feather name="phone" size={24} color="black" style={{ marginLeft: 10 }} />

      <SimpleLineIcons name="options-vertical" size={24} color="black" style={styles.icon} />
    </View>
  )
}

export default ChatRoomHeader
