"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getVideoTitle, readVideoLibrary, writeVideoLibrary, type PlaylistItem } from "@/lib/playlist"

export function VideoLibrary({ onOpen, onEdit }: { onOpen: (items: PlaylistItem[]) => void; onEdit: (item: PlaylistItem, index: number) => void }) {
  const [items, setItems] = useState<PlaylistItem[]>([])
  useEffect(() => setItems(readVideoLibrary()), [])
  const remove = (index: number) => {
    const next = items.filter((_, itemIndex) => itemIndex !== index)
    setItems(next)
    writeVideoLibrary(next)
  }
  if (!items.length) return null
  return <section className="mt-6 rounded-xl border border-slate-700 bg-slate-900/70 p-4 text-left">
    <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-white">Biblioteca local</h2><span className="text-xs text-slate-400">{items.length} videos</span></div>
    <div className="flex flex-col gap-2">
      {items.map((item, index) => <div key={`${item.url}-${index}`} className="flex items-center justify-between gap-3 rounded-lg bg-slate-800 p-3">
        <span className="truncate text-sm text-slate-200">{item.title || getVideoTitle(item.url)}</span>
        <div className="flex shrink-0 gap-2"><Button size="sm" onClick={() => onOpen([item])}>Abrir</Button><Button size="sm" variant="outline" onClick={() => onEdit(item, index)}>Editar</Button><Button size="sm" variant="destructive" onClick={() => remove(index)}>Borrar</Button></div>
      </div>)}
    </div>

  </section>
}

