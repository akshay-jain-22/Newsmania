"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserNotes, deleteNote } from "@/lib/notes-service"
import { NoteCard } from "@/components/note-card"
import { PlusCircle, Search, FolderOpen, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export default function NotesPage() {
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredNotes, setFilteredNotes] = useState<any[]>([])
  const [newNote, setNewNote] = useState({ title: "", content: "", topic: "General" })
  const [isCreating, setIsCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  // Fetch notes on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getUserNotes()
        setNotes(fetchedNotes)
        setFilteredNotes(fetchedNotes)
      } catch (error) {
        console.error("Error fetching notes:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load notes. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  // Filter notes when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.topic.toLowerCase().includes(query),
    )

    setFilteredNotes(filtered)
  }, [searchQuery, notes])

  // Group notes by topic
  const notesByTopic: Record<string, any[]> = {}

  filteredNotes.forEach((note) => {
    if (!notesByTopic[note.topic]) {
      notesByTopic[note.topic] = []
    }
    notesByTopic[note.topic].push(note)
  })

  const topics = Object.keys(notesByTopic)

  const handleCreateNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and content are required.",
      })
      return
    }

    setIsCreating(true)

    try {
      // In a real app, this would call an API to create the note
      // For demo purposes, we'll simulate a successful creation
      await new Promise((resolve) => setTimeout(resolve, 800))

      const createdNote = {
        id: Date.now().toString(),
        ...newNote,
        createdAt: new Date().toISOString(),
      }

      setNotes([createdNote, ...notes])
      setNewNote({ title: "", content: "", topic: "General" })
      setDialogOpen(false)

      toast({
        title: "Note created",
        description: "Your note has been created successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create note. Please try again.",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteNote = async (id: string) => {
    console.log("Deleting note with ID:", id)

    // Optimistically update UI first
    setNotes(notes.filter((note) => note.id !== id))
    setFilteredNotes(filteredNotes.filter((note) => note.id !== id))

    try {
      // Then perform the actual deletion
      const success = await deleteNote(id)

      if (!success) {
        console.error("Delete operation returned false")
        // If deletion fails, revert the UI change
        const fetchedNotes = await getUserNotes()
        setNotes(fetchedNotes)
        setFilteredNotes(fetchedNotes)

        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "There was an error deleting your note. The page has been refreshed.",
        })
      }
    } catch (error) {
      console.error("Error in handleDeleteNote:", error)
      // If deletion throws an error, revert the UI change
      const fetchedNotes = await getUserNotes()
      setNotes(fetchedNotes)
      setFilteredNotes(fetchedNotes)

      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting your note. The page has been refreshed.",
      })
    }
  }

  const handleUpdateNote = (id: string, updatedNote: any) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, ...updatedNote } : note)))
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <DashboardHeader />
        <main className="flex-1 py-6">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center h-[50vh]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Loading notes...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />

      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
                <p className="text-muted-foreground">Manage your personal notes on news topics</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search notes..."
                    className="w-full pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Create New Note</DialogTitle>
                      <DialogDescription>Add a new note to your collection.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={newNote.title}
                          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                          placeholder="Note title"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="topic">Topic</Label>
                        <Input
                          id="topic"
                          value={newNote.topic}
                          onChange={(e) => setNewNote({ ...newNote, topic: e.target.value })}
                          placeholder="e.g., Technology, Politics, Health"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          value={newNote.content}
                          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                          placeholder="Write your note here..."
                          className="min-h-[150px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateNote} disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create Note"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {filteredNotes.length > 0 ? (
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="flex flex-wrap h-auto">
                  <TabsTrigger value="all">All Notes</TabsTrigger>
                  {topics.map((topic) => (
                    <TabsTrigger key={topic} value={topic}>
                      {topic}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredNotes.map((note) => (
                      <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} onUpdate={handleUpdateNote} />
                    ))}
                  </div>
                </TabsContent>

                {topics.map((topic) => (
                  <TabsContent key={topic} value={topic} className="mt-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {notesByTopic[topic].map((note) => (
                        <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} onUpdate={handleUpdateNote} />
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <Card className="flex flex-col items-center justify-center p-6 text-center">
                <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No notes yet</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "No notes match your search query."
                    : "Start by adding notes to articles you read or creating standalone notes on topics."}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Note
                  </Button>
                )}
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

