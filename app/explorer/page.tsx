'use client'

import { useState, useEffect } from 'react'
import { api, type ChainResponse, type Block, type Transaction } from '@/lib/api'

function truncate(s: string, n = 20) {
  return s.length <= n ? s : `${s.slice(0, n)}...`
}

function TxRow({ tx }: { tx: Transaction }) {
  const isCoinbase = tx.inputs.length === 0
  return (
    <div className="text-xs font-mono space-y-1 py-2 border-t border-slate-800 first:border-0">
      <div className="flex items-center gap-2">
        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${isCoinbase ? 'bg-amber-900/50 text-amber-400' : 'bg-sky-900/40 text-sky-400'}`}>
          {isCoinbase ? 'COINBASE' : 'SPEND'}
        </span>
        <span className="text-slate-500">tx {tx.id}</span>
      </div>
      {tx.outputs.map(o => (
        <div key={o.id} className="flex justify-between gap-4 pl-4">
          <span className="text-slate-400">{truncate(o.owner, 24)}</span>
          <span className="text-sky-300 font-semibold">{o.value.toFixed(2)} SMT</span>
        </div>
      ))}
    </div>
  )
}

function BlockCard({ block }: { block: Block }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-5 py-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <span className="text-sky-400 font-bold font-mono text-sm w-16">#{block.index}</span>
          <span className="text-slate-300 text-sm font-medium">
            {block.transactions.length} transaction{block.transactions.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600 font-mono">
          <span className="hidden md:inline">{block.hash.slice(0, 20)}...</span>
          <span className="text-slate-500">{new Date(block.timestamp * 1000).toLocaleTimeString()}</span>
          <span className="text-slate-600">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-800 px-5 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <p className="text-slate-600 mb-0.5">Hash</p>
              <p className="text-slate-400 break-all">{block.hash}</p>
            </div>
            <div>
              <p className="text-slate-600 mb-0.5">Prev Hash</p>
              <p className="text-slate-400 break-all">{block.previousHash}</p>
            </div>
            <div>
              <p className="text-slate-600 mb-0.5">Nonce</p>
              <p className="text-slate-300">{block.nonce.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-600 mb-0.5">Timestamp</p>
              <p className="text-slate-300">{new Date(block.timestamp * 1000).toLocaleString()}</p>
            </div>
          </div>
          <div>
            <p className="text-slate-600 text-xs font-mono mb-2">Transactions</p>
            {block.transactions.map(tx => <TxRow key={tx.id} tx={tx} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ExplorerPage() {
  const [chain, setChain]         = useState<ChainResponse | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [lookupAddr, setLookup]   = useState('')
  const [lookupBal, setLookupBal] = useState<number | null>(null)
  const [looking, setLooking]     = useState(false)

  async function fetchChain() {
    setLoading(true)
    setError('')
    try {
      setChain(await api.getChain())
    } catch {
      setError('Cannot reach SummitCoin node at localhost:8080. Start the node first.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchChain() }, [])

  async function handleLookup() {
    if (!lookupAddr.trim()) return
    setLooking(true)
    try {
      const res = await api.getBalance(lookupAddr.trim())
      setLookupBal(res.balance)
    } catch {
      setLookupBal(null)
    } finally {
      setLooking(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">SummitCoin Block Explorer</h1>
        <p className="text-slate-500 text-sm">Browse the SMT blockchain in real-time.</p>
      </div>

      {/* Chain stats */}
      {chain && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Chain Height',    value: chain.height },
            { label: 'Total Blocks',    value: chain.length },
            { label: 'SMT in Supply',   value: `${chain.supply.toFixed(0)} SMT` },
            { label: 'Chain Valid',     value: chain.isValid ? 'Yes' : 'NO' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
              <p className="text-slate-500 text-xs mb-1">{s.label}</p>
              <p className={`text-xl font-bold font-mono ${s.label === 'Chain Valid' ? (chain.isValid ? 'text-green-400' : 'text-red-400') : 'text-sky-400'}`}>
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Address lookup */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 mb-8">
        <h2 className="text-white font-semibold mb-3">Address Balance Lookup</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={lookupAddr}
            onChange={e => setLookup(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLookup()}
            placeholder="SMT..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-sky-600 font-mono text-sm"
          />
          <button
            onClick={handleLookup}
            disabled={looking}
            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {looking ? '...' : 'Check'}
          </button>
        </div>
        {lookupBal !== null && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-slate-400 font-mono">{truncate(lookupAddr, 30)}</span>
            <span className="text-slate-600">→</span>
            <span className="text-sky-400 font-bold">{lookupBal.toFixed(2)} SMT</span>
          </div>
        )}
      </div>

      {/* Refresh */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">
          Blocks {chain ? `(${chain.length} total)` : ''}
        </h2>
        <button
          onClick={fetchChain}
          disabled={loading}
          className="px-4 py-1.5 text-sm border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white rounded-lg transition-colors disabled:opacity-40"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl border border-red-900 bg-red-950/20 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && !chain && (
        <div className="text-center py-16 text-slate-600">Loading chain...</div>
      )}

      {/* Blocks list — most recent first */}
      {chain && (
        <div className="space-y-3">
          {[...chain.blocks].reverse().map(block => (
            <BlockCard key={block.index} block={block} />
          ))}
        </div>
      )}
    </div>
  )
}
