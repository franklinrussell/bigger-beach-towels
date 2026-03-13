'use client'

import { useEffect, useState } from 'react'
import { NODE_URL } from '@/lib/api'

// Snowflake SVG — six-armed, inline, no external deps
function Snowflake({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="2"  x2="12" y2="22" />
      <line x1="2"  y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
      {/* Tick marks on each arm */}
      <line x1="12" y1="6"  x2="9"  y2="3"  />
      <line x1="12" y1="6"  x2="15" y2="3"  />
      <line x1="12" y1="18" x2="9"  y2="21" />
      <line x1="12" y1="18" x2="15" y2="21" />
      <line x1="6"  y1="12" x2="3"  y2="9"  />
      <line x1="6"  y1="12" x2="3"  y2="15" />
      <line x1="18" y1="12" x2="21" y2="9"  />
      <line x1="18" y1="12" x2="21" y2="15" />
    </svg>
  )
}

export function NodeStatusBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let cancelled = false

    // Show banner only after 3 s without a successful /health response
    const showTimer = setTimeout(() => {
      if (!cancelled) setVisible(true)
    }, 3000)

    // Poll /health every 4 s until the node responds
    async function probe() {
      try {
        const res = await fetch(`${NODE_URL}/health`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(4000),
        })
        if (res.ok && !cancelled) {
          clearTimeout(showTimer)
          setVisible(false)
          return   // done — node is up
        }
      } catch {
        // Node not yet awake; schedule next probe
      }
      if (!cancelled) setTimeout(probe, 4000)
    }

    probe()
    return () => { cancelled = true; clearTimeout(showTimer) }
  }, [])

  if (!visible) return null

  return (
    <div className="border-b border-amber-900/60 bg-amber-950/70 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <Snowflake className="w-5 h-5 text-amber-400 shrink-0 animate-spin [animation-duration:3s]" />
        <p className="text-sm">
          <span className="text-amber-300 font-medium">
            Waking up the SummitCoin node...
          </span>
          <span className="text-amber-600 ml-2">
            (free tier cold start, ~30 seconds)
          </span>
        </p>
      </div>
    </div>
  )
}
