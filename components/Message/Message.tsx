import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { SingleMessage } from '../../types/types'

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
  message: SingleMessage
}
const myId = 'u1'

function Message(props: Props): JSX.Element {
  const isMe = props.message.user.id === myId

  return (
    <View style={[styles.container, isMe ? styles.containerMe : styles.containerMate]}>
      <Text style={{ color: isMe ? 'black' : 'white'}}>
        {props.message.content}
      </Text>
    </View>
  )
}

export default Message
