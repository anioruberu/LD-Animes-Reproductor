"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getMangaTitle, readMangaLibrary, writeMangaLibrary, type MangaLibraryItem } from "@/lib/manga-library"

export function MangaLibrary({ onOpen, onEdit }: { onOpen: (item: MangaLibraryItem) => void; onEdit?: (item: MangaLibraryItem) => void }) {
  const [items, setItems] = useState<MangaLibraryItem[]>([])

  useEffect(() => setItems(readMangaLibrary()), [])

  const remove = (index: number) => {
    const next = items.filter((_, itemIndex) => itemIndex !== index)
    setItems(next)
    writeMangaLibrary(next)
  }

  if (!items.length) return null

  return (
    <section className="mt-6 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 text-left">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-white">Biblioteca de manga</h2>
        <span className="text-xs text-slate-400">{items.length} PDF</span>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={`${item.url}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-slate-800 p-3">
            <span className="truncate text-sm text-slate-200">{item.title || getMangaTitle(item.url)}</span>
            <div className="flex shrink-0 gap-2">
<Button size="sm" onClick={() => onOpen(item)}>Abrir</Button>
              {onEdit && <Button size="sm" variant="outline" onClick={() => onEdit(item)}>Editar</Button>}
              <Button size="sm" variant="destructive" onClick={() => remove(index)}>Borrar</Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
