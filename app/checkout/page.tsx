'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { getProduct, STORE_ADDRESS } from '@/lib/products'

type Step = 'address' | 'confirm' | 'processing' | 'success' | 'error'

function CheckoutContent() {
  const searchParams = useSearchParams()
  const product = getProduct(searchParams.get('id') ?? '')

  const [step, setStep]       = useState<Step>('address')
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [txId, setTxId]       = useState('')
  const [blockNum, setBlock]  = useState<number | null>(null)
  const [errMsg, setErrMsg]   = useState('')
  const [busy, setBusy]       = useState(false)

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <p className="text-slate-400 mb-4">Product not found.</p>
        <Link href="/" className="text-sky-400 hover:text-sky-300">Back to shop</Link>
      </div>
    )
  }

  async function handleCheckBalance() {
    if (!address.trim()) return
    setBusy(true)
    try {
      const res = await api.getBalance(address.trim())
      setBalance(res.balance)
      setStep('confirm')
    } catch {
      setErrMsg('Could not reach SummitCoin node. Is it running on port 8080?')
      setStep('error')
    } finally {
      setBusy(false)
    }
  }

  async function handleConfirm() {
    setBusy(true)
    setStep('processing')
    try {
      const txRes = await api.sendTransaction(address.trim(), STORE_ADDRESS, product!.price)
      setTxId(txRes.transaction.id)
      const mineRes = await api.mine()
      setBlock(mineRes.block.index)
      setStep('success')
    } catch (e: unknown) {
      setErrMsg(e instanceof Error ? e.message : 'Transaction failed')
      setStep('error')
    } finally {
      setBusy(false)
    }
  }

  const insufficient = balance !== null && balance < product.price

  return (
    <div className="max-w-lg mx-auto px-4 py-12">

      {/* Product summary */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 mb-5">
        <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Purchasing</p>
        <h2 className="text-white font-bold text-xl mb-1">{product.name}</h2>
        <p className="text-sky-400 italic text-sm mb-4">{product.tagline}</p>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-white">{product.price}</span>
          <span className="text-sky-400 font-semibold text-lg">SMT</span>
        </div>
      </div>

      {/* Step: address entry */}
      {(step === 'address' || (step === 'confirm' && insufficient)) && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-white font-semibold">Your SMT Wallet Address</h3>
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="SMT..."
            className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-sky-600 font-mono text-sm"
          />

          {insufficient && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-900 text-red-400 text-sm">
              Insufficient balance: you have <strong>{balance} SMT</strong> but need{' '}
              <strong>{product.price} SMT</strong>.{' '}
              <Link href="/faucet" className="underline hover:text-red-300">
                Get more from the faucet
              </Link>
            </div>
          )}

          <button
            onClick={handleCheckBalance}
            disabled={busy || !address.trim()}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-semibold transition-colors"
          >
            {busy ? 'Checking...' : 'Check Balance'}
          </button>

          <p className="text-center text-slate-600 text-xs">
            Need SMT?{' '}
            <Link href="/faucet" className="text-sky-500 hover:text-sky-400">
              Grab 25 free from the faucet
            </Link>
          </p>
        </div>
      )}

      {/* Step: confirm purchase */}
      {step === 'confirm' && !insufficient && (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-4">
          <h3 className="text-white font-semibold">Confirm Purchase</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">From</span>
              <span className="font-mono text-slate-300 text-xs break-all text-right max-w-[280px]">{address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current balance</span>
              <span className="text-white font-semibold">{balance} SMT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cost</span>
              <span className="text-sky-400 font-semibold">- {product.price} SMT</span>
            </div>
            <hr className="border-slate-800" />
            <div className="flex justify-between">
              <span className="text-slate-400">Remaining</span>
              <span className="text-green-400 font-semibold">{(balance! - product.price).toFixed(2)} SMT</span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={busy}
            className="w-full py-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-semibold transition-colors"
          >
            Confirm Purchase
          </button>

          <button
            onClick={() => { setStep('address'); setBalance(null) }}
            className="w-full py-2 text-slate-500 hover:text-slate-400 text-sm"
          >
            Use a different address
          </button>
        </div>
      )}

      {/* Step: mining / processing */}
      {step === 'processing' && (
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-white font-semibold">Mining your block...</p>
          <p className="text-slate-500 text-sm">
            The PoW miner increments a nonce until the block's SHA-256 hash starts with {4} leading zeros.
            This may take a few seconds.
          </p>
        </div>
      )}

      {/* Step: success */}
      {step === 'success' && (
        <div className="rounded-xl border border-green-800/60 bg-green-950/10 p-8 text-center space-y-4">
          <div className="text-green-400 text-5xl leading-none">&#10003;</div>
          <h3 className="text-white font-bold text-xl">Order Confirmed!</h3>
          <p className="text-slate-400 text-sm">
            Your <strong className="text-white">{product.name}</strong> is heading down the mountain.
          </p>
          <div className="bg-slate-900 rounded-xl p-4 text-left space-y-2 text-sm font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">Block</span>
              <span className="text-sky-400">#{blockNum}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TX&nbsp;ID</span>
              <span className="text-slate-300">{txId}</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <Link href="/" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors">
              Back to Shop
            </Link>
            <Link href="/explorer" className="px-5 py-2.5 border border-slate-700 hover:border-sky-600 text-slate-300 hover:text-sky-400 rounded-xl text-sm font-medium transition-colors">
              View on Explorer
            </Link>
          </div>
        </div>
      )}

      {/* Step: error */}
      {step === 'error' && (
        <div className="rounded-xl border border-red-900/60 bg-red-950/10 p-6 space-y-4">
          <h3 className="text-red-400 font-semibold">Something went wrong</h3>
          <p className="text-slate-400 text-sm">{errMsg}</p>
          <button
            onClick={() => { setStep('address'); setErrMsg('') }}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <>
      <div className="border-b border-slate-800/60 bg-slate-950/80 py-5">
        <div className="max-w-lg mx-auto px-4 flex items-center gap-3">
          <Link href="/" className="text-slate-600 hover:text-slate-400 text-sm transition-colors">
            &larr; Back
          </Link>
          <span className="text-slate-800">|</span>
          <h1 className="text-white text-lg font-semibold">Checkout</h1>
        </div>
      </div>
      <Suspense fallback={<div className="text-center py-24 text-slate-500">Loading...</div>}>
        <CheckoutContent />
      </Suspense>
    </>
  )
}
