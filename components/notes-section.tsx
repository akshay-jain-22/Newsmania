"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { saveNote, getNotes } from "@/lib/notes-service"
import { formatDistanceToNow } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Note {
  id: string
  content: string
  createdAt: string
}

interface NotesSectionProps {
  articleId: string
}

export function NotesSection({ articleId }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load existing notes for this article
    const loadNotes = async () => {
      try {
        setInitialLoading(true)
        const articleNotes = await getNotes(articleId)
        setNotes(articleNotes)
      } catch (error) {
        console.error("Failed to load notes:", error)
        toast({
          variant: "destructive",
          title: "Error loading notes",
          description: "We couldn't load your notes. Please try again later.",
        })
      } finally {
        setInitialLoading(false)
      }
    }

    loadNotes()
  }, [articleId, toast])

  const handleSaveNote = async () => {
    if (!newNote.trim()) return

    setLoading(true)

    try {
      const savedNote = await saveNote(articleId, newNote)

      // Optimistically update the UI
      setNotes([savedNote, ...notes])
      setNewNote("")

      toast({
        title: "Note saved",
        description: "Your note has been saved successfully.",
      })
    } catch (error) {
      console.error("Failed to save note:", error)
      toast({
        variant: "destructive",
        title: "Failed to save note",
        description: "There was an error saving your note. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Notes</h2>
      <p className="text-muted-foreground">Add personal notes and thoughts about this article</p>

      <div className="grid gap-4">
        <Textarea
          placeholder="Add your notes here..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="min-h-[120px]"
        />
        <Button onClick={handleSaveNote} disabled={loading || !newNote.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Note"
          )}
        </Button>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        {initialLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notes.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No notes yet. Add your first note above.</p>
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="p-4 pb-2">
                <CardDescription>{formatDistanceToNow(new Date(note.createdAt))} ago</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p>{note.content}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

