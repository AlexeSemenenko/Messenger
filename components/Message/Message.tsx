import React, { useState, useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { Auth, DataStore } from 'aws-amplify'

import { Message as MessageModel, User } from '../../src/models'

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

  if (!user) {
    return <ActivityIndicator />
  }

  return (
    <View style={[styles.container, isMe ? styles.containerMe : styles.containerMate]}>
      <Text style={{ color: isMe ? 'black' : 'white'}}>
        {props.message.content}
      </Text>
    </View>
  )
}

export default Message
