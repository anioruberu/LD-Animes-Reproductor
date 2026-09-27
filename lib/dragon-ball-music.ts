export type MusicTrack = { id: string; title: string; url: string }
export type MusicPlaylist = { id: 'dragon-ball' | 'dragon-ball-z'; name: string; tracks: MusicTrack[] }

const base = 'https://huggingface.co/anioruberu/Mp3/resolve/main'
const file = (folder: string, name: string) => `${base}/${encodeURIComponent(folder)}/${encodeURIComponent(name)}.mp3`

const classicNames = [
  'Dragon Ball - Makafushigi Adventure Opening 1', 'Dragon Ball Opening Latino', 'Dragon Ball ED Romantic Ageru Yo', 'Dragon Ball - Romance Te Puedo Dar -Ending Latino',
  ...Array.from({ length: 27 }, (_, i) => `Dragon ball soundtrack ${i + 1}`),
]
const zNames = [
  'Dragon Ball Z - 1989 Japanese Opening - Cha-La Head Cha-La - Remastered', 'Dragon Ball Z - Chala Head Chala opening Latino', 'Dragon Ball Z Figures - Dragon Ball Z - We Gotta Power - Second Japanese Theme Song', 'Dragon Ball Z - El poder nuestro es opening 2 Latino', 'Detekoi Tobikiri ZENKAI Power!', 'EL NOSTALGICO REMASTERIZADOR D - Dragon Ball Z - Sal de ahí Magnífico Poder - Broadcast Latino', 'Dragon Ball Z DAN - We Were Angels', 'Dragon Ball Z Ending 2 Latino Remasterizado Angeles Fuimos',
  ...Array.from({ length: 125 }, (_, i) => `Dragon ball Z soundtrack ${i + 1}`),
]

export const DRAGON_BALL_PLAYLISTS: MusicPlaylist[] = [
  { id: 'dragon-ball', name: 'Dragon Ball', tracks: classicNames.map((name, i) => ({ id: `db-${i}`, title: name, url: file('Dragon Ball', name) })) },
  { id: 'dragon-ball-z', name: 'Dragon Ball Z', tracks: zNames.map((name, i) => ({ id: `dbz-${i}`, title: name, url: file('Dragon Ball Z', name) })) },
]

export function getDragonBallSaga(pdfUrl: string): 'dragon-ball' | 'dragon-ball-z' | null {
  const decoded = decodeURIComponent(pdfUrl).toLowerCase()
  if (!decoded.includes('dragon ball')) return null
  const match = decoded.match(/tomo\s*0*(\d+)/)
  if (!match) return null
  return Number(match[1]) >= 17 ? 'dragon-ball-z' : 'dragon-ball'
}

export function getTrackTitle(track: MusicTrack) {
  return track.title.replace(/\s+/g, ' ').trim()
}
