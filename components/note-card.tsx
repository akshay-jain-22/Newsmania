"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, LinkIcon } from "lucide-react"
import { formatDistanceToNow } from "@/lib/utils"
import { deleteNote, updateNote } from "@/lib/notes-service"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface NoteCardProps {
  note: {
    id: string
    title: string
    content: string
    topic: string
    createdAt: string
    articleId?: string
    articleTitle?: string
  }
  onDelete?: (id: string) => void
  onUpdate?: (id: string, note: any) => void
}

export function NoteCard({ note, onDelete, onUpdate }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    content: note.content,
    topic: note.topic,
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    if (isDeleting) return

    setIsDeleting(true)

    try {
      console.log("Deleting note with ID:", note.id)

      // Call the onDelete callback directly first to update UI immediately
      if (onDelete) {
        onDelete(note.id)
      }

      // Then attempt the actual deletion
      const success = await deleteNote(note.id)

      if (success) {
        toast({
          title: "Note deleted",
          description: "Your note has been permanently deleted.",
        })
      } else {
        console.error("Delete operation returned false")
        toast({
          variant: "destructive",
          title: "Delete failed",
          description: "There was an error deleting your note. Please refresh and try again.",
        })
      }
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        variant: "destructive",
        title: "Delete failed",
        description: "There was an error deleting your note. Please try again.",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleUpdate = async () => {
    if (isUpdating) return

    setIsUpdating(true)

    try {
      const updatedNote = await updateNote(note.id, editedNote)

      toast({
        title: "Note updated",
        description: "Your note has been successfully updated.",
      })

      setShowEditDialog(false)

      // Call the onUpdate callback if provided
      if (onUpdate) {
        onUpdate(note.id, updatedNote)
      }
    } catch (error) {
      console.error("Error updating note:", error)
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "There was an error updating your note. Please try again.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between gap-2">
            <Badge>{note.topic}</Badge>
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(note.createdAt))} ago</span>
          </div>
          <CardTitle className="line-clamp-2 text-lg">{note.title}</CardTitle>
          {note.articleId && note.articleTitle && (
            <CardDescription className="flex items-center gap-1">
              <LinkIcon className="h-3 w-3" />
              <Link href={`/article/${note.articleId}`} className="hover:underline line-clamp-1">
                {note.articleTitle}
              </Link>
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="flex items-center justify-between gap-2 w-full">
            <Button variant="outline" size="sm" className="w-full" onClick={() => setShowEditDialog(true)}>
              <Pencil className="mr-2 h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>Make changes to your note here. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editedNote.title}
                onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={editedNote.topic}
                onChange={(e) => setEditedNote({ ...editedNote, topic: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={editedNote.content}
                onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

