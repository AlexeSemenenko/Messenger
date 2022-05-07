import React, { useState, useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { Auth, DataStore, Storage } from 'aws-amplify'
import { Ionicons } from '@expo/vector-icons'
// @ts-ignore
import { S3Image } from 'aws-amplify-react-native'

import { Message as MessageModel, User } from '../../src/models'
import AudioPlayer from '../AudioPlayer'

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
    maxWidth: '75%',
    flexDirection: 'row',
    alignItems: 'flex-end'

  },
  containerMe: {
    backgroundColor: 'lightgrey',
    marginLeft: 'auto',
    marginRight: 10,
  },
  containerMate: {
    backgroundColor: '#FF9200',
    marginLeft: 10,
    marginRight: 'auto',
  }
})

type Props = {
  message: MessageModel
}

function Message(props: Props): JSX.Element {
  const [message, setMessage] = useState<MessageModel>(props.message)
  const [user, setUser] = useState<User | undefined>()
  const [isMe, setIsMe] = useState<boolean | null>(null)
  const [soundUri, setSoundUri] = useState<any>(null)

  const { width } = useWindowDimensions()

  useEffect(
    () => {
      DataStore.query(User, message.userID).then(setUser)
    },
    []
  )

  useEffect(
    () => {
      const subscription = DataStore.observe(MessageModel, message.id).subscribe(msg => {
        if (msg.model === MessageModel && msg.opType === 'UPDATE') {
          setMessage(prevState => ({...prevState, ...msg.element}))
        }
      })

      return () => subscription.unsubscribe()
    },
    []
  )

  useEffect(
    () => {
      setAsRead()
    },
    [isMe, message]
  )

  useEffect(
    () => {
      async function checkIsMe(): Promise<void> {
        const authUser = await Auth.currentAuthenticatedUser()

        setIsMe(user?.id === authUser.attributes.sub)
      }

      checkIsMe()
    },
    [user]
  )

  useEffect(
    () => {
      if (message.audio) {
        Storage.get(message.audio).then(setSoundUri)
      }
    },
    [message]
  )

  async function setAsRead() {
    if (isMe === false && message.status !== 'READ') {
      await DataStore.save(MessageModel.copyOf(
        message,
        (updated) => {
          updated.status = "READ"
        }
      ))
    }
  }

  if (!user) {
    return <ActivityIndicator />
  }

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.containerMe : styles.containerMate,
        {
          width: soundUri ? '75%' : 'auto',
        }
      ]}
    >
      {message.image && (
        <S3Image
          style={{
            width: width * 0.65,
            aspectRatio: 4 / 3,
            marginBottom: message.content ? 10 : 0
          }}
          imgKey={message.image}
          resixeMode="contain"
        />
      )}

      {soundUri && (
        <AudioPlayer soundUri={soundUri} />
      )}

      <Text style={{ color: isMe ? 'black' : 'white'}}>
        {message.content}
      </Text>

      {isMe && message.status !== 'SENT' && !!message.status && (
        <Ionicons
          name={message.status === 'DELIVERED' ? 'checkmark' : 'checkmark-done'}
          size={16}
          color="grey"
          style={{  marginHorizontal: 5 }}
        />
      )}
    </View>
  )
}

export default Message
