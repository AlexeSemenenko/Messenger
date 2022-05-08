import React, { useState, useEffect } from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { Auth, DataStore, Storage } from 'aws-amplify'
// @ts-ignore
import { S3Image } from 'aws-amplify-react-native'

import { Message as MessageModel, User } from '../../src/models'
import AudioPlayer from '../AudioPlayer'
import MessageReply from '../MessageReply'

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 15,
    maxWidth: '75%',
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
  setAsMessageReply?: () => void
}

function Message({ message, setAsMessageReply }: Props): JSX.Element {
  const [repliedTo, setRepliedTo] = useState<MessageModel | undefined>(undefined)
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
      if (message?.replyToMessageID) {
        DataStore.query(MessageModel, message.replyToMessageID).then(setRepliedTo)
      }
    },
    [message]
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
    <Pressable
      onLongPress={setAsMessageReply}
      style={[
        styles.container,
        isMe ? styles.containerMe : styles.containerMate,
        {
          width: soundUri ? '75%' : 'auto',
        }
      ]}
    >
      {repliedTo && (
        <MessageReply message={repliedTo} />
      )}

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

      {!!message.content && (
        <Text style={{ color: isMe ? 'black' : 'white'}}>
          {message.content}
        </Text>
      )}

    </Pressable>
  )
}

export default Message
