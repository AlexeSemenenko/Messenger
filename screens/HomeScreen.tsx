import React from 'react'
import { StyleSheet, View, FlatList } from 'react-native'

import ChatRoomItem from '../components/ChatRoomItem'
import chatRoomsData from '../assets/dummy-data/ChatRooms'

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  },
})

function HomeScreen() {
  return (
    <View style={styles.page}>
      <FlatList
        data={chatRoomsData}
        renderItem={({ item }) => (
          <ChatRoomItem chatRoom={item} />
        )}
      />
    </View>
  )
}

export default HomeScreen
