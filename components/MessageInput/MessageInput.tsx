import React, { useState } from 'react'
import {
  KeyboardAvoidingView, Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native'
import {
  AntDesign,
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons'

import styles from './styles'

function MessageInput(): JSX.Element {
  const [message, setMessage] = useState('')

  function sendMessage(): void {
    console.warn('sending: ', message)
    setMessage('')
  }

  function onPlusClick(): void {
    console.warn('plus clicked')
  }

  function onPress(): void {
    if (message) {
      sendMessage()
    } else {
      onPlusClick()
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.inputContainer}>
        <FontAwesome name="smile-o" size={24} color="grey" style={styles.icon} />

        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Message..."
        />

        <Feather name="camera" size={24} color="grey" style={styles.icon} />

        <MaterialCommunityIcons name="microphone-outline" size={24} color="grey" style={styles.icon} />
      </View>

      <Pressable onPress={onPress} style={styles.buttonContainer}>
        {message ?
          <MaterialIcons name="send" size={20} color="white" /> :
          <AntDesign name="plus" size={24} color="white" />
        }
      </Pressable>
    </KeyboardAvoidingView>
  )
}

export default MessageInput