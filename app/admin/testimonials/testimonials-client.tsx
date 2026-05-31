'use client'

import { useState, useTransition } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import {
  Trash2,
  AlertCircle,
  Plus,
  Pencil,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  deleteTestimonial,
  createTestimonial,
  updateTestimonial,
} from './actions'
import { getYouTubeEmbedUrl } from '@/lib/utils'

interface TestimonialItem {
  id: string
  videoUrl: string
  createdAt: string
}

interface TestimonialsClientProps {
  initialTestimonials: TestimonialItem[]
  isMockData: boolean
}

const emptyFormValues = {
  videoUrl: '',
}

export default function TestimonialsClient({
  initialTestimonials,
  isMockData,
}: TestimonialsClientProps) {
  const [items, setItems] = useState<TestimonialItem[]>(initialTestimonials)
  const [isPending, startTransition] = useTransition()
  const [isSubmitPending, startSubmitTransition] = useTransition()

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null)
  const [formValues, setFormValues] = useState(emptyFormValues)

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus video ini?') === false) return

    if (isMockData) {
      toast.warning('Mode Simulasi: Video dihapus di memori sementara')
      setItems((prev) => prev.filter((item) => item.id !== id))
      return
    }

    startTransition(async () => {
      const res = await deleteTestimonial(id)
      if (res.success) {
        toast.success('Video berhasil dihapus!')
        setItems((prev) => prev.filter((item) => item.id !== id))
      } else {
        toast.error(res.error || 'Gagal menghapus video')
      }
    })
  }

  const handleCreateClick = () => {
    setEditingItem(null)
    setFormValues(emptyFormValues)
    setIsFormOpen(true)
  }

  const handleEditClick = (item: TestimonialItem) => {
    setEditingItem(item)
    setFormValues({
      videoUrl: item.videoUrl || '',
    })
    setIsFormOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formValues.videoUrl) {
      toast.error('Mohon isi Tautan Video')
      return
    }

    const formattedUrl = getYouTubeEmbedUrl(formValues.videoUrl)
    const submissionData = {
      videoUrl: formattedUrl,
    }

    if (isMockData) {
      if (editingItem) {
        toast.warning('Mode Simulasi: Video diperbarui di memori sementara')
        setItems((prev) =>
          prev.map((item) => (item.id === editingItem.id ? { ...item, ...submissionData } : item))
        )
      } else {
        toast.warning('Mode Simulasi: Video baru ditambahkan di memori sementara')
        const newId = crypto.randomUUID()
        setItems((prev) => [
          {
            ...submissionData,
            id: newId,
            createdAt: new Date().toISOString(),
          } as TestimonialItem,
          ...prev,
        ])
      }
      setIsFormOpen(false)
      return
    }

    startSubmitTransition(async () => {
      try {
        if (editingItem) {
          const res = await updateTestimonial(editingItem.id, submissionData)
          if (res.success) {
            toast.success('Video berhasil diperbarui!')
            setItems((prev) =>
              prev.map((item) =>
                item.id === editingItem.id ? { ...item, ...submissionData } : item
              )
            )
            setIsFormOpen(false)
          } else {
            toast.error(res.error || 'Gagal memperbarui video')
          }
        } else {
          const res = await createTestimonial(submissionData)
          if (res.success) {
            toast.success('Video baru berhasil ditambahkan!')
            const newId = (res as any).data?.id || crypto.randomUUID()
            setItems((prev) => [
              {
                ...submissionData,
                id: newId,
                createdAt: new Date().toISOString(),
              } as TestimonialItem,
              ...prev,
            ])
            setIsFormOpen(false)
          } else {
            toast.error(res.error || 'Gagal menambahkan video')
          }
        }
      } catch (err) {
        console.error('Error submitting video:', err)
        toast.error('Terjadi kesalahan koneksi server')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Galeri Video Testimoni
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola dokumentasi video perjalanan destinasi ulasan pelanggan Airlangga Travel.
          </p>
        </div>
        <Button
          onClick={handleCreateClick}
          className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl h-11 px-6 font-medium flex items-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" />
          Tambah Video
        </Button>
      </div>

      {/* Grid List */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <TestimonialCard
              key={item.id}
              item={item}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              isPending={isPending}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-sm">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-serif font-semibold text-lg text-foreground">
            Belum Ada Video Galeri
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Klik tombol "Tambah Video" untuk membuat baru.
          </p>
        </div>
      )}

      {/* Add / Edit Dialog Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif font-bold text-foreground">
              {editingItem ? 'Edit Video Galeri' : 'Tambah Video Galeri'}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">
              Masukkan tautan video youtube (video standar, Shorts, atau embed). Tautan akan dikonversi secara otomatis.
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label htmlFor="videoUrl">Tautan Video YouTube / Shorts *</Label>
              <Input
                id="videoUrl"
                value={formValues.videoUrl}
                onChange={(e) => setFormValues({ videoUrl: e.target.value })}
                placeholder="Contoh: https://www.youtube.com/shorts/..."
                required
              />
            </div>

            <DialogFooter className="pt-4 border-t border-border flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                className="rounded-xl h-10 cursor-pointer"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitPending}
                className="bg-primary hover:bg-primary-dark text-primary-foreground rounded-xl h-10 px-6 font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {isSubmitPending && <Clock className="w-4 h-4 animate-spin" />}
                Simpan Video
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TestimonialCard({
  item,
  onEdit,
  onDelete,
  isPending,
}: {
  item: TestimonialItem
  onEdit?: (item: TestimonialItem) => void
  onDelete: (id: string) => void
  isPending: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col items-center justify-between space-y-4"
    >
      {/* Direct Embedded Video Player (Portrait YouTube Short) */}
      <div className="relative aspect-[9/16] w-full max-w-[260px] rounded-xl overflow-hidden border border-border bg-black">
        {item.videoUrl ? (
          <iframe
            src={getYouTubeEmbedUrl(item.videoUrl)}
            title="Video Testimoni"
            className="w-full h-full border-0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
            No Video Url
          </div>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="w-full pt-3 border-t border-border flex items-center justify-between gap-4">
        <div className="text-[10px] text-muted-foreground truncate">
          ID: {item.id.slice(0, 8)}...
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          {onEdit && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(item)}
              disabled={isPending}
              className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground h-9 rounded-lg px-3 text-xs flex items-center gap-1 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(item.id)}
            disabled={isPending}
            className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive h-9 rounded-lg px-3 text-xs flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Hapus
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
