import React from 'react'
import { StyleSheet, View } from 'react-native'

import ChatRoomItem from '../components/ChatRoomItem'

import chatRoomData from '../assets/dummy-data/ChatRooms'

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  },
})

function TabOneScreen() {
  return (
    <View style={styles.page}>
      <ChatRoomItem chatRoom={chatRoomData[0]} />
      <ChatRoomItem chatRoom={chatRoomData[1]} />
    </View>

  )
}

export default TabOneScreen
