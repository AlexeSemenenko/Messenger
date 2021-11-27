type User = {
  id: string,
  name: string,
  imageUri: string
}

type LastMessage = {
  id: string
  content: string
  createdAt: string
}

export type ChatRoom = {
  id: string
  users: User[]
  lastMessage: LastMessage
  newMessages?: number
}

export type SingleMessage = {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
  }
}
