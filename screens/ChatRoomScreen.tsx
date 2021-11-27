import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'

import Message from '../components/Message'
import chatRoomData from '../assets/dummy-data/Chats'

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  }
})

function ChatRoomScreen(): JSX.Element {
  return (
    <View style={styles.page}>
      <FlatList
        data={chatRoomData.messages}
        renderItem={({ item }) => <Message message={item} />}
        inverted
      />
    </View>
  )
}

export default ChatRoomScreen
