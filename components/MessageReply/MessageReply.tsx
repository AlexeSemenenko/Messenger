import React, { useState, useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { Auth, DataStore, Storage } from 'aws-amplify'
// @ts-ignore
import { S3Image } from 'aws-amplify-react-native'

import { Message as MessageModel, User } from '../../src/models'
import AudioPlayer from '../AudioPlayer'

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
    marginLeft: 10,
    marginRight: 'auto',
  },
  containerMe: {
    backgroundColor: 'rgba(255,255,255,0.89)',
  },
  containerMate: {
    backgroundColor: '#FF9200',
  },
  messageReply: {
    backgroundColor: 'gray',
    padding: 5,
    borderRadius: 5,
    borderColor: '#FF9200',
    borderWidth: 3,
  }
})

type Props = {
  message: MessageModel
}

function MessageReply(props: Props): JSX.Element {
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
      setMessage(props.message)
    },
    [props.message]
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

  if (!user) {
    return <ActivityIndicator />
  }

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.containerMe : styles.containerMate,
        {
          width: soundUri ? '95%' : 'auto',
          maxWidth: soundUri ? '95%' : '75%',
        }
      ]}
    >
      {message.image && (
        <S3Image
          style={{
            width: '100%',
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

      {!!message.content && (
        <Text style={{ color: isMe ? 'black' : 'white'}}>
          {message.content}
        </Text>
      )}
    </View>
  )
}

export default MessageReply
