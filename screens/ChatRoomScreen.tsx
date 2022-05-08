import React, { useState, useEffect } from 'react'
import { StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { DataStore, SortDirection } from 'aws-amplify'

import Message from '../components/Message'
import MessageInput from '../components/MessageInput'
import { Message as MessageModel, ChatRoom } from '../src/models'

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    flex: 1,
  }
})

function ChatRoomScreen(): JSX.Element {
  const [messages, setMessages] = useState<MessageModel[]>([])
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null)
  const [messageReplyTo, setMessageReplyTo] = useState<MessageModel | null>(null)

  const route = useRoute()

  useEffect(
    () => {
      fetchChatRoom()
    },
    []
  )

  useEffect(
    () => {
      fetchMessages()
    },
    [chatRoom]
  )

  useEffect(
    () => {
      const subscription = DataStore.observe(MessageModel).subscribe(msg => {
        if (msg.model === MessageModel && msg.opType === 'INSERT') {
          setMessages(prevState => [msg.element, ...prevState])
        }
      })

      return () => subscription.unsubscribe()
    },
    []
  )

  async function fetchChatRoom(): Promise<void> {
    // @ts-ignore
    if (!route.params?.id) {
      return
    }

    // @ts-ignore
    const fetchedChatRoom = await DataStore.query(ChatRoom, route.params.id)

    if (!fetchedChatRoom) {
      console.error('No chat room with this id')
    } else {
      setChatRoom(fetchedChatRoom)
    }
  }

  async function fetchMessages(): Promise<void> {
    if (!chatRoom) {
      return
    }

    const fetchedMessages = await DataStore.query(
      MessageModel,
      message => message.chatroomID("eq", chatRoom?.id),
      {
        sort: message => message.createdAt(SortDirection.DESCENDING)
      }
    )

    setMessages(fetchedMessages)
  }

  if (!chatRoom) {
    return <ActivityIndicator />
  }

  return (
    <SafeAreaView style={styles.page}>
      <FlatList
        data= {messages}
        renderItem={({ item }) =>
          <Message
            message={item}
            setAsMessageReply={() => setMessageReplyTo(item)}
          />
        }
        inverted
      />

      <MessageInput
        chatRoom={chatRoom}
        messageReplyTo={messageReplyTo}
        removeMessageReply={() => setMessageReplyTo(null)}
      />
    </SafeAreaView>
  )
}

export default ChatRoomScreen
