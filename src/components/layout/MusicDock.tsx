/**
 * Lightweight music dock — laptop-friendly, no heavy deps.
 * Uses free ambient streams by default; user can paste any audio URL.
 */

import { useEffect, useRef, useState } from 'react'
import { Music2, Pause, Play, Volume2 } from 'lucide-react'

const STORAGE_KEY = 'nexos-lpin-music-v1'

/** Free-to-try ambient / radio-style streams (public HTTPS). User may replace. */
const PRESETS: { id: string; label: string; url: string }[] = [
  {
    id: 'soma-drone',
    label: 'SomaFM Drone Zone',
    url: 'https://ice1.somafm.com/dronezone-128-mp3',
  },
  {
    id: 'soma-space',
    label: 'SomaFM Space Station',
    url: 'https://ice1.somafm.com/spacestation-128-mp3',
  },
  {
    id: 'soma-groove',
    label: 'SomaFM Groove Salad',
    url: 'https://ice1.somafm.com/groovesalad-128-mp3',
  },
]

type Saved = { url: string; volume: number; presetId?: string }

function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Saved
  } catch {
    /* ignore */
  }
  return { url: PRESETS[0]!.url, volume: 0.35, presetId: PRESETS[0]!.id }
}

export function MusicDock() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [open, setOpen] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.35)
  const [url, setUrl] = useState(PRESETS[0]!.url)
  const [presetId, setPresetId] = useState<string | undefined>(PRESETS[0]!.id)
  const [error, setError] = useState<string | null>(null)
  const [custom, setCustom] = useState('')

  useEffect(() => {
    const s = loadSaved()
    setUrl(s.url)
    setVolume(s.volume)
    setPresetId(s.presetId)
  }, [])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.volume = volume
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ url, volume, presetId } satisfies Saved),
      )
    } catch {
      /* ignore */
    }
  }, [url, volume, presetId])

  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    a.src = url
    a.load()
    if (playing) {
      a.play().catch((e) => {
        setError(e instanceof Error ? e.message : 'Playback blocked — click Play again')
        setPlaying(false)
      })
    }
  }, [url]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = async () => {
    const a = audioRef.current
    if (!a) return
    setError(null)
    if (playing) {
      a.pause()
      setPlaying(false)
      return
    }
    try {
      await a.play()
      setPlaying(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Cannot play — check network / autoplay')
      setPlaying(false)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 ${
          playing
            ? 'border-cyan-700 bg-cyan-950/40 text-cyan-200'
            : 'border-slate-700 bg-slate-900/80 text-slate-400 hover:text-slate-200'
        }`}
        title="Background music (laptop-friendly streams)"
      >
        <Music2 size={12} />
        {playing ? 'Music on' : 'Music'}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-[min(320px,90vw)] rounded-lg border border-slate-700 bg-slate-950 shadow-2xl p-3 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-wide text-slate-500">
              Music dock · low CPU
            </span>
            <button
              type="button"
              onClick={toggle}
              className="inline-flex items-center gap-1 rounded border border-slate-600 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-900"
            >
              {playing ? <Pause size={12} /> : <Play size={12} />}
              {playing ? 'Pause' : 'Play'}
            </button>
          </div>

          <div className="space-y-1">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPresetId(p.id)
                  setUrl(p.url)
                  setCustom('')
                }}
                className={`w-full text-left rounded px-2 py-1.5 text-[11px] border ${
                  presetId === p.id
                    ? 'border-cyan-700 bg-cyan-950/30 text-cyan-100'
                    : 'border-transparent text-slate-400 hover:bg-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <label className="block text-[10px] text-slate-500">
            Custom stream / file URL (https)
            <input
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && custom.trim()) {
                  setUrl(custom.trim())
                  setPresetId(undefined)
                }
              }}
              placeholder="https://…/track.mp3"
              className="mt-0.5 w-full rounded border border-slate-700 bg-black/40 px-2 py-1 text-[11px] text-slate-200"
            />
          </label>
          {custom.trim() && (
            <button
              type="button"
              className="text-[10px] text-cyan-500 hover:underline"
              onClick={() => {
                setUrl(custom.trim())
                setPresetId(undefined)
              }}
            >
              Use custom URL
            </button>
          )}

          <label className="flex items-center gap-2 text-[10px] text-slate-500">
            <Volume2 size={12} />
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              className="flex-1"
            />
            <span className="w-8 text-right text-slate-400">{Math.round(volume * 100)}</span>
          </label>

          {error && <p className="text-[10px] text-rose-400/90">{error}</p>}
          <p className="text-[9px] text-slate-600 leading-snug">
            Streams need network. For offline, host a file under public/ and paste its URL. Keep
            volume modest during investigations.
          </p>
        </div>
      )}

      <audio ref={audioRef} preload="none" crossOrigin="anonymous" />
    </div>
  )
}
