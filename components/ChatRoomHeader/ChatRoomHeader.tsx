import { Image, Pressable, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Auth, DataStore } from 'aws-amplify'
import moment from 'moment'
import { useNavigation } from '@react-navigation/core'

import styles from './styles'
import { ChatRoomUser, User, ChatRoom } from '../../src/models'

// @ts-ignore
function ChatRoomHeader({ id }) {
  const [user, setUser] = useState<User | null>(null)
  const [charRoom, setChatRoom] = useState<ChatRoom | undefined>(undefined)
  const [allUsers, setAllUsers] = useState<User[]>([])

  const navigation = useNavigation()

  async function fetchUsers(): Promise<void> {
    const fetchedUsers = (await DataStore.query(ChatRoomUser))
      .filter(it => it.chatRoom.id === id)
      .map(it => it.user)

    setAllUsers(fetchedUsers)

    const authUser = await Auth.currentAuthenticatedUser()

    setUser(fetchedUsers.find(it => it.id !== authUser.attributes.sub) || null)
  }

  async function fetchChatRoom(): Promise<void> {
    const chatRoom = await DataStore.query(ChatRoom, id)
    setChatRoom(chatRoom)
  }

  useEffect(
    () => {
      if (!id) {
        return
      }

      fetchUsers()
      fetchChatRoom()
    },
    []
  )

  const isGroup = allUsers.length > 2

  function getUserNames(): string {
    return allUsers.map(it => it.realName).join(', ')
  }

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

  function openInfo() {
    // @ts-ignore
    navigation.navigate('GroupInfoScreen', { id })
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: charRoom?.imageUri ?? user?.imageUri }}
        style={styles.img}
      />

      <Pressable onPress={openInfo} style={{ flex: 1, marginLeft: 10 }} >
        <Text style={styles.text}>{charRoom?.name ?? user?.realName ?? user?.name}</Text>

        <Text
          numberOfLines={1}
          style={{ color: '#FF9200', maxWidth: '90%' }}
        >
          {isGroup ? getUserNames() : getLastOnline()}
        </Text>
      </Pressable>
    </View>
  )
}

export default ChatRoomHeader
