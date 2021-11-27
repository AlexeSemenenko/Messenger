import React from 'react'
import { StyleSheet, FlatList, SafeAreaView } from 'react-native'

import Message from '../components/Message'
import MessageInput from '../components/MessageInput'
import chatRoomData from '../assets/dummy-data/Chats'

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  }
})

function ChatRoomScreen(): JSX.Element {
  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data={chatRoomData.messages}
        renderItem={({ item }) => <Message message={item} />}
        inverted
      />

      <MessageInput />
    </SafeAreaView>
  )
}

export default ChatRoomScreen
