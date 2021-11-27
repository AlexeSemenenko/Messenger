import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 15,
    width: '75%',
  },
})

function Message(): JSX.Element {
  const isMe = true

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isMe ? 'lightgrey' : '#3777F0',
        marginLeft: isMe ? 'auto' : 10,
      }
    ]}>
      <Text style={{ color: isMe ? 'black' : 'white'}}>
        Message
      </Text>
    </View>
  )
}

export default Message
