import React, { useEffect, useState } from 'react'
import 'react-native-get-random-values'
import EmojiSelector from 'react-native-emoji-selector'
import * as ImagePicker from 'expo-image-picker';
import { Image, KeyboardAvoidingView, Platform, Pressable, TextInput, View, Text, Alert } from 'react-native'
import { AntDesign, Feather, FontAwesome, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { Auth, DataStore, Storage } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid'
import { Audio } from 'expo-av'
import { box } from 'tweetnacl'

import { ChatRoom, ChatRoomUser, Message as MessageModel, User } from '../../src/models'

import styles from './styles'
import AudioPlayer from '../AudioPlayer'
import MessageReply from '../MessageReply'
import { stringToUint8Array, encrypt, getMySecretKey } from '../../utils/crypto'

type Props = {
  chatRoom: ChatRoom
  messageReplyTo: MessageModel | null
  removeMessageReply: () => void
}

function MessageInput(props: Props): JSX.Element {
  const [message, setMessage] = useState<string>('')

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState<boolean>(false)

  const [image, setImage] = useState<string | null>(null)
  const [imgProgress, setImgProgress] = useState<number>(0)

  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(null)
  const [soundUri, setSoundUri] = useState<string | null>(null)

  useEffect(
    () => {
      (async () => {
        if (Platform.OS !== 'web') {
          const libraryResponse = await ImagePicker.requestMediaLibraryPermissionsAsync()
          const photoResponse = await ImagePicker.requestCameraPermissionsAsync()

          await Audio.requestPermissionsAsync()

          if (libraryResponse.status !== 'granted' || photoResponse.status !== 'granted') {
            alert('Sorry, you haven\'t gave the access')
          }
        }
      })()
    },
    []
  )

  function resetFields() {
    setImage(null)
    setMessage('')
    setIsEmojiPickerOpen(false)
    setImgProgress(0)
    setSoundUri(null)
    props.removeMessageReply()
  }


  async function updateLastMessage(newMessage: MessageModel): Promise<void> {
     DataStore.save(ChatRoom.copyOf(props.chatRoom, updatedChatRoom => {
       updatedChatRoom.LastMessage = newMessage
     }))
  }

  function handlePress(): void {
    if (image) {
      handleSendImage()
    } else if (soundUri) {
      handleSendAudio()
    } else if (message) {
      handleSendMessage()
    }
  }

  async function handleStartRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })

      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      )
      setAudioRecording(recording)
    } catch (err) {
      console.log(err)
    }
  }

  async function handleStopRecording() {
    if (!audioRecording) {
      return
    }

    setAudioRecording(null)
    await audioRecording?.stopAndUnloadAsync()

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    })

    const uri = audioRecording?.getURI()

    if (!uri) {
      return
    }
    setSoundUri(uri)
  }

  async function handleSendAudio() {
    if (!soundUri) {
      return
    }

    const uriParts = soundUri.split('.')
    const extension = uriParts[uriParts.length - 1]

    const blob = await getBlob(soundUri)
    const { key } = await Storage.put(
      `${uuidv4()}.${extension}`,
      blob,
      {
        progressCallback,
      }
    )

    const user = await Auth.currentAuthenticatedUser()

    const newMessage = await DataStore.save(new MessageModel({
      content: message,
      audio: key,
      userID: user.attributes.sub,
      chatroomID: props.chatRoom.id,
      replyToMessageID: props.messageReplyTo?.id,
    }))

    updateLastMessage(newMessage)

    resetFields()
  }

  // async function sendMessageToUser(user: User, fromUserId: string) {
  //   const secretKey = await getMySecretKey()
  //
  //   if (!user.publicKey) {
  //     Alert.alert(
  //       'Warning',
  //       'Your mate(s) has(have)n\'t set key pair yet. Until the user(s) will generate the key pair, he(they) cannot securely get your messages and won\'t get this',
  //     )
  //
  //     return
  //   }
  //
  //   if (!secretKey) {
  //     return
  //   }
  //
  //   const sharedKey = box.before(
  //     stringToUint8Array(user.publicKey!)
  //     secretKey,
  //   )
  //
  //   const encryptedMessage = encrypt(sharedKey, { message })
  //
  //   const newMessage = await DataStore.save(new MessageModel({
  //     content: message,
  //     userID: fromUserId,
  //     forUserId: user.id,
  //     chatroomID: props.chatRoom.id,
  //     replyToMessageID: props.messageReplyTo?.id,
  //   }))
  //
  //   // updateLastMessage(newMessage)
  // }

  async function handleSendMessage(): Promise<void> {
    const user = await Auth.currentAuthenticatedUser()

    // const users = (await DataStore.query(ChatRoomUser))
    //  .filter(it => it.chatRoom.id === props.chatRoom.id)
    //  .map(it => it.user)

    // await Promise.all(users.map(it => sendMessageToUser(it, user.attributes.sub)))

    const newMessage = await DataStore.save(new MessageModel({
      content: message,
      userID: user.attributes.sub,
      // forUserId: user.id,
      chatroomID: props.chatRoom.id,
      replyToMessageID: props.messageReplyTo?.id,
    }))

    updateLastMessage(newMessage)

    resetFields()
  }

  function progressCallback(progress: any) {
    setImgProgress(progress.loaded / progress.total)
  }

  async function handleSendImage() {
    if (!image) {
      return
    }

    const blob = await getBlob(image)
    const { key } = await Storage.put(
      `${uuidv4()}.png`,
      blob,
      {
        progressCallback,
      }
    )

    const user = await Auth.currentAuthenticatedUser()

    const newMessage = await DataStore.save(new MessageModel({
      content: message,
      image: key,
      userID: user.attributes.sub,
      chatroomID: props.chatRoom.id,
      replyToMessageID: props.messageReplyTo?.id,
    }))

    updateLastMessage(newMessage)

    resetFields()
  }

  async function getBlob(uri: string) {
    const response = await fetch(uri)
    return await response.blob()
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  async function takePhoto() {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
    })

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { height: isEmojiPickerOpen ? '50%' : 'auto' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      {props.messageReplyTo && (
        <View
          style={{
            backgroundColor: '#F2F2F2',
            padding: 5,
            marginBottom: 10,
            borderRadius: 10,
            flexDirection: 'row'
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ padding: 5 }}>Reply to:</Text>
            <MessageReply message={props.messageReplyTo} />
          </View>

          <Pressable onPress={props.removeMessageReply}>
            <AntDesign style={{ margin: 5 }} name="close" size={18} color="black" />
          </Pressable>
        </View>
      )}

      {image && (
        <View style={styles.sendImageContainer}>
          <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 10 }} />

          <View style={{ flex: 1, justifyContent: 'flex-start', alignSelf: 'flex-end' }}>
            <View style={{
              height: 5,
              borderRadius: 5,
              backgroundColor: '#FF9200',
              width: `${imgProgress * 100}%`,
              }}
            />
          </View>

          <Pressable onPress={() => setImage(null)}>
            <AntDesign style={{ margin: 5 }} name="close" size={24} color="black" />
          </Pressable>
        </View>
      )}

      {soundUri && (
        <AudioPlayer soundUri={soundUri} />
      )}

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Pressable onPress={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}>
            <FontAwesome
              name="smile-o"
              size={24}
              color={isEmojiPickerOpen ? '#FF9200' : 'grey'}
              style={styles.icon}
            />
          </Pressable>

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Message..."
          />

          <Pressable onPress={pickImage}>
            <Feather name="image" size={24} color="grey" style={styles.icon} />
          </Pressable>

          <Pressable onPress={takePhoto}>
            <Feather name="camera" size={24} color="grey" style={styles.icon} />
          </Pressable>

          <Pressable onPressIn={handleStartRecording} onPressOut={handleStopRecording}>
            <MaterialCommunityIcons
              name={audioRecording ? 'microphone' : 'microphone-outline'}
              size={24}
              color={audioRecording ? '#FF9200' : 'grey'}
              style={styles.icon}
            />
          </Pressable>
        </View>

        <Pressable onPress={handlePress} style={styles.buttonContainer}>
          <MaterialIcons name="send" size={20} color="white" />
        </Pressable>
      </View>

      {isEmojiPickerOpen && (
        <EmojiSelector
          onEmojiSelected={emoji => setMessage(current => current + emoji)}
          columns={10}
          showSearchBar={false}
          showHistory={false}
        />
      )}
    </KeyboardAvoidingView>
  )
}

export default MessageInput
