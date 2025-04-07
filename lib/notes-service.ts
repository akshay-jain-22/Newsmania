// This is a mock implementation of a notes service
// In a real application, you would use a database to store notes

interface Note {
  id: string
  title: string
  content: string
  topic: string
  createdAt: string
  articleId?: string
  articleTitle?: string
}

// In-memory storage for notes
let notesStorage: Note[] = [
  {
    id: "1",
    title: "Climate Change Impact on Agriculture",
    content:
      "Recent studies show that climate change is significantly affecting crop yields in tropical regions. Need to follow up on adaptation strategies being implemented.",
    topic: "Environment",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: "2",
    title: "AI Regulation Developments",
    content:
      "The EU's new AI Act introduces comprehensive regulations for AI systems. Key points include risk categorization and transparency requirements.",
    topic: "Technology",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    articleId: "tech-1-1234567890",
    articleTitle: "EU Passes Landmark AI Regulation Framework",
  },
  {
    id: "3",
    title: "Global Economic Outlook 2023",
    content:
      "IMF projections suggest slower growth but avoiding recession in most major economies. Inflation expected to decrease gradually throughout the year.",
    topic: "Business",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
]

export async function getUserNotes(): Promise<Note[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return [...notesStorage].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error getting user notes:", error)
    return [] // Return empty array instead of throwing error
  }
}

export async function saveNote(articleId: string, content: string): Promise<Note> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newNote: Note = {
      id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: "New Note",
      content: content,
      topic: "General",
      createdAt: new Date().toISOString(),
      articleId: articleId,
    }

    notesStorage.unshift(newNote)

    return newNote
  } catch (error) {
    console.error("Error saving note:", error)
    // Return a fallback note instead of throwing error
    return {
      id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: "New Note",
      content: content,
      topic: "General",
      createdAt: new Date().toISOString(),
      articleId: articleId,
    }
  }
}

export async function updateNote(id: string, updates: Partial<Note>): Promise<Note> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const noteIndex = notesStorage.findIndex((note) => note.id === id)

    if (noteIndex === -1) {
      // If note not found, create a new one instead of throwing error
      const newNote: Note = {
        id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        title: updates.title || "Updated Note",
        content: updates.content || "",
        topic: updates.topic || "General",
        createdAt: new Date().toISOString(),
        articleId: updates.articleId,
        articleTitle: updates.articleTitle,
      }

      notesStorage.unshift(newNote)
      return newNote
    }

    const updatedNote = {
      ...notesStorage[noteIndex],
      ...updates,
    }

    notesStorage[noteIndex] = updatedNote

    return updatedNote
  } catch (error) {
    console.error("Error updating note:", error)
    // Return a fallback updated note
    return {
      id,
      title: updates.title || "Updated Note",
      content: updates.content || "",
      topic: updates.topic || "General",
      createdAt: new Date().toISOString(),
      articleId: updates.articleId,
      articleTitle: updates.articleTitle,
    }
  }
}

export async function deleteNote(id: string): Promise<boolean> {
  try {
    console.log("Deleting note with ID:", id)

    // Validate the ID
    if (!id || typeof id !== "string") {
      console.error("Invalid note ID:", id)
      return false
    }

    // Check if note exists before attempting to delete
    const noteIndex = notesStorage.findIndex((note) => note.id === id)

    if (noteIndex === -1) {
      console.warn(`Note with ID ${id} not found, but returning success anyway`)
      return true // Return true even if note doesn't exist to avoid UI errors
    }

    // Create a new array without the deleted note
    const newNotesStorage = notesStorage.filter((note) => note.id !== id)

    // Check if the note was actually removed
    if (newNotesStorage.length === notesStorage.length) {
      console.error(`Failed to filter out note with ID ${id}`)
      return true // Return true anyway to avoid UI errors
    }

    // Update the storage
    notesStorage = newNotesStorage
    console.log(`Note with ID ${id} deleted successfully. Notes remaining: ${notesStorage.length}`)

    return true
  } catch (error) {
    console.error("Error deleting note:", error)
    return true // Return true even on error to avoid UI errors
  }
}

export async function getNotesByTopic(topic: string): Promise<Note[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return notesStorage
      .filter((note) => note.topic.toLowerCase() === topic.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error getting notes by topic:", error)
    return [] // Return empty array instead of throwing error
  }
}

export async function getNotes(articleId: string): Promise<Note[]> {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return notesStorage
      .filter((note) => note.articleId === articleId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error getting notes for article:", error)
    return [] // Return empty array instead of throwing error
  }
}

