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
}

function Message(props: Props): JSX.Element {
  const [user, setUser] = useState<User | undefined>()
  const [isMe, setIsMe] = useState<boolean>(false)
  const [soundUri, setSoundUri] = useState<any>(null)

  const { width } = useWindowDimensions()

  useEffect(
    () => {
      DataStore.query(User, props.message.userID).then(setUser)
    },
    []
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
      if (props.message.audio) {
        Storage.get(props.message.audio).then(setSoundUri)
      }
    },
    [props.message]
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
          width: soundUri ? '75%' : 'auto',
        }
      ]}
    >
      {props.message.image && (
        <S3Image
          style={{
            width: width * 0.7,
            aspectRatio: 4 / 3,
            marginBottom: props.message.content ? 10 : 0
          }}
          imgKey={props.message.image}
          resixeMode="contain"
        />
      )}

      {soundUri && (
        <AudioPlayer soundUri={soundUri} />
      )}

      <Text style={{ color: isMe ? 'black' : 'white'}}>
        {props.message.content}
      </Text>
    </View>
  )
}

export default Message
