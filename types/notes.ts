export interface Note {
  id: string
  userId: string
  title: string
  content: string
  topic: string
  createdAt: string
  updatedAt: string
  articleId?: string
  articleTitle?: string
  tags?: string[]
  isPublic?: boolean
}

export interface NoteFolder {
  id: string
  userId: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  noteIds: string[]
}

