import { Image, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Auth, DataStore } from 'aws-amplify'
import moment from 'moment'

import styles from './styles'
import { ChatRoomUser, User } from '../../src/models'

// @ts-ignore
function ChatRoomHeader({ id }) {
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

  function getLastOnline() {
    if (!user?.lastOnlineAt) {
      return null
    }

    const diff = moment().diff(moment(user?.lastOnlineAt))

    if (diff < 5 * 60 * 1000) {
      return 'Online'
    } else {
      return `Last seen online ${moment(user?.lastOnlineAt).fromNow()}`
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user?.imageUri }}
        style={styles.img}
      />

      <View style={{ flex: 1, marginLeft: 10 }} >
        <Text style={styles.text}>{user?.name}</Text>

        <Text>{getLastOnline()}</Text>
      </View>
    </View>
  )
}

export default ChatRoomHeader
