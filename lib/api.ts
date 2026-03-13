export const NODE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'
const NODE = NODE_URL

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TxOutput { id: string; owner: string; value: number }
export interface TxInput  { outputId: string }
export interface Transaction { id: string; inputs: TxInput[]; outputs: TxOutput[] }
export interface Block {
  index: number
  timestamp: number
  transactions: Transaction[]
  previousHash: string
  nonce: number
  hash: string
}

export interface BalanceResponse  { address: string; balance: number; unit: string }
export interface ChainResponse    { height: number; length: number; supply: number; isValid: boolean; blocks: Block[] }
export interface TxResponse       { success: boolean; transaction: Transaction; message: string }
export interface MineResponse     { success: boolean; message: string; block: Block }
export interface WalletResponse   { address: string; balance: number; unit: string }
export interface FaucetResponse   { success: boolean; message: string; txId: string; block: number }
export interface PendingResponse  { count: number; transactions: Transaction[] }

// ── Helpers ───────────────────────────────────────────────────────────────────

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${NODE}${path}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${NODE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? res.statusText)
  }
  return res.json()
}

// ── API functions ─────────────────────────────────────────────────────────────

export const api = {
  getBalance:   (address: string) =>
    get<BalanceResponse>(`/balance/${encodeURIComponent(address)}`),

  getChain:     () => get<ChainResponse>('/chain'),

  getPending:   () => get<PendingResponse>('/transactions/pending'),

  mine:         () => get<MineResponse>('/mine'),

  createWallet: () => post<WalletResponse>('/wallet/new', {}),

  sendTransaction: (sender: string, recipient: string, amount: number) =>
    post<TxResponse>('/transactions', { sender, recipient, amount }),

  faucet: (address: string) =>
    post<FaucetResponse>('/faucet', { address }),
}
