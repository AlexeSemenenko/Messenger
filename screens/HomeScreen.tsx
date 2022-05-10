import React, { useEffect, useState  } from 'react'
import { StyleSheet, View, FlatList, ScrollView, RefreshControl, NativeModules } from 'react-native'
import { Auth, DataStore } from 'aws-amplify'
import RNRestart from 'react-native-restart'

import { ChatRoom, ChatRoomUser } from '../src/models'

import ChatRoomItem from '../components/ChatRoomItem'

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  },
})

function HomeScreen() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])

  useEffect(
    () => {
      async function fetchChatRooms() {
        const userData = await Auth.currentAuthenticatedUser()

        const fetchedChatRooms = (await DataStore.query(ChatRoomUser))
          .filter(it => it.user.id === userData.attributes.sub)
          .map(it => it.chatRoom)

        setChatRooms(fetchedChatRooms)
      }

      fetchChatRooms()
    },
    []
  )

  return (
    <View style={styles.page}>
      <FlatList
        data={chatRooms}
        renderItem={({ item }) => (
          <ChatRoomItem chatRoom={item} />
        )}
      />
    </View>
  )
}

export default HomeScreen
