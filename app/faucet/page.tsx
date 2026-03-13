'use client'

import { useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

type State = 'idle' | 'generating' | 'requesting' | 'success' | 'error'

export default function FaucetPage() {
  const [address, setAddress] = useState('')
  const [state, setState]     = useState<State>('idle')
  const [errMsg, setErrMsg]   = useState('')
  const [txId, setTxId]       = useState('')
  const [block, setBlock]     = useState<number | null>(null)

  async function handleGenerate() {
    setState('generating')
    try {
      const res = await api.createWallet()
      setAddress(res.address)
      setState('idle')
    } catch {
      setErrMsg('Could not reach node. Is it running on port 8080?')
      setState('error')
    }
  }

  async function handleRequest() {
    if (!address.trim()) return
    setState('requesting')
    setErrMsg('')
    try {
      const res = await api.faucet(address.trim())
      setTxId(res.txId)
      setBlock(res.block)
      setState('success')
    } catch (e: unknown) {
      setErrMsg(e instanceof Error ? e.message : 'Faucet request failed')
      setState('error')
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-10">
        {/* Snow / faucet icon: simple SVG */}
        <svg viewBox="0 0 60 60" className="w-16 h-16 mx-auto mb-4 text-sky-400" fill="currentColor" aria-hidden="true">
          {/* Snowflake */}
          <line x1="30" y1="5"  x2="30" y2="55" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <line x1="5"  y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <line x1="12" y1="12" x2="48" y2="48" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <line x1="48" y1="12" x2="12" y2="48" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="30" cy="30" r="5" fill="currentColor"/>
        </svg>

        <h1 className="text-3xl font-bold text-white mb-2">First Tracks Faucet</h1>
        <p className="text-slate-400">
          Get <span className="text-sky-400 font-semibold">25 SMT</span> for free to try the store.
          No sign-up. No KYC. Just proof of wanting free internet ski money.
        </p>
      </div>

      {state !== 'success' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Your SMT wallet address</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="SMT..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-sky-600 font-mono text-sm"
            />
          </div>

          <p className="text-center text-slate-600 text-xs">— or —</p>

          <button
            onClick={handleGenerate}
            disabled={state === 'generating'}
            className="w-full py-2.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40"
          >
            {state === 'generating' ? 'Generating...' : 'Generate a new wallet address for me'}
          </button>

          {state === 'error' && (
            <div className="p-3 rounded-xl bg-red-950/30 border border-red-900 text-red-400 text-sm">
              {errMsg}
            </div>
          )}

          <button
            onClick={handleRequest}
            disabled={state === 'requesting' || !address.trim()}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-semibold transition-colors"
          >
            {state === 'requesting' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mining your SMT...
              </span>
            ) : 'Drop In — Send me 25 SMT'}
          </button>
        </div>
      )}

      {state === 'success' && (
        <div className="rounded-2xl border border-green-800 bg-green-950/20 p-8 space-y-5">
          <div className="text-center">
            <div className="text-green-400 text-5xl leading-none mb-3">&#10003;</div>
            <h2 className="text-white font-bold text-xl">First tracks secured!</h2>
            <p className="text-slate-400 text-sm mt-1">
              25 SMT has been sent to your wallet and confirmed on-chain.
            </p>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 space-y-2 text-sm font-mono">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 shrink-0">Address</span>
              <span className="text-slate-300 break-all text-right">{address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount</span>
              <span className="text-sky-400 font-semibold">25 SMT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TX ID</span>
              <span className="text-slate-300">{txId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Block</span>
              <span className="text-sky-400">#{block}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/"
              className="flex-1 text-center py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold transition-colors">
              Head to the Shop
            </Link>
            <button
              onClick={() => { setState('idle'); setAddress(''); setTxId(''); setBlock(null) }}
              className="flex-1 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white rounded-xl text-sm font-medium transition-colors">
              Request Again
            </button>
          </div>
        </div>
      )}

      {/* How it works note */}
      <div className="mt-8 p-4 rounded-xl border border-slate-800 text-slate-600 text-xs space-y-1">
        <p className="font-semibold text-slate-500">How it works</p>
        <p>The node&apos;s <code className="text-slate-400">summit-node</code> wallet earns 50 SMT per mined block. The faucet sends 25 of those SMT to your address and immediately mines a new block to confirm it.</p>
      </div>
    </div>
  )
}
