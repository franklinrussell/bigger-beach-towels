import Link from 'next/link'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-sky-400 font-semibold text-sm uppercase tracking-widest mb-4">{title}</h2>
      <div className="space-y-3 text-slate-400 leading-relaxed">{children}</div>
    </section>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm font-mono text-slate-300 overflow-x-auto leading-relaxed">
      {children}
    </pre>
  )
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">About SummitCoin</h1>
        <p className="text-slate-400 text-lg">
          A Bitcoin-style blockchain built from scratch in Scala 3.
          Not financial advice. Definitely not for beaches.
        </p>
      </div>

      <Section title="What is SummitCoin?">
        <p>
          SummitCoin (SMT) is a proof-of-work blockchain implemented entirely from scratch in{' '}
          <span className="text-white">Scala 3</span> as a portfolio project. It implements the
          same fundamental mechanics that make Bitcoin work: UTXO-based transactions, SHA-256
          proof of work, and a fully validated chain with UTXO replay.
        </p>
        <p>
          It is not a real cryptocurrency. The SMT tokens have no monetary value.
          The faucet gives them away for free. The shop sells fictional ski gear.
          This is an exercise in understanding how blockchains actually work under the hood
          — by building one.
        </p>
      </Section>

      <Section title="How the UTXO Model Works">
        <p>
          Unlike a bank account (where your balance is just a number), Bitcoin and SummitCoin use
          the <strong className="text-white">Unspent Transaction Output (UTXO)</strong> model.
          Every coin in existence is a discrete output object with an owner and a value.
        </p>
        <p>To spend coins, you consume existing UTXOs as inputs and create new UTXOs as outputs:</p>
        <CodeBlock>{`// Alice has one UTXO worth 60 SMT.
// She buys ski poles (45 SMT), gets 15 SMT change back.

TxInput(outputId = "abc-0")               // spends Alice's 60 SMT UTXO

TxOutput("xyz-0", owner="summit-store", value=45.0)  // payment
TxOutput("xyz-1", owner="alice",        value=15.0)  // change`}
        </CodeBlock>
        <p>
          No UTXO can be spent twice. Validation replays every transaction from the genesis block
          to verify that all inputs were present and all outputs are conserved.
        </p>
      </Section>

      <Section title="Proof of Work">
        <p>
          Mining a block means finding a <strong className="text-white">nonce</strong> — an integer
          — such that <code className="text-slate-300 font-mono">SHA-256(block_contents + nonce)</code>{' '}
          starts with a set number of leading zeros (currently 4).
        </p>
        <CodeBlock>{`// The miner just increments nonce until the hash is valid:
while (!hash.startsWith("0000")) {
  nonce += 1
  hash = sha256(index + timestamp + transactions + previousHash + nonce)
}`}
        </CodeBlock>
        <p>
          On average, this requires ~65,536 attempts per block (1/16^4). Changing{' '}
          <em>anything</em> in any block changes its hash, which breaks the link to the next block,
          which invalidates the entire chain from that point forward. This is what makes the chain
          tamper-evident.
        </p>
      </Section>

      <Section title="Tech Stack">
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Scala 3.8',         role: 'Core blockchain logic' },
            { name: 'http4s + Ember',    role: 'REST API server' },
            { name: 'cats-effect 3',     role: 'Async runtime' },
            { name: 'circe',             role: 'JSON serialisation' },
            { name: 'Next.js 16',        role: 'Storefront frontend' },
            { name: 'React 19',          role: 'UI components' },
            { name: 'Tailwind CSS v4',   role: 'Styling' },
            { name: 'TypeScript 5',      role: 'Type safety' },
          ].map(t => (
            <div key={t.name} className="border border-slate-800 rounded-lg p-3 flex justify-between items-center">
              <span className="text-white font-medium text-sm">{t.name}</span>
              <span className="text-slate-500 text-xs">{t.role}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Running It Yourself">
        <p>Clone the repo, start the blockchain node, then run the storefront:</p>
        <CodeBlock>{`# Start the SummitCoin node (Scala)
cd blockchain
sbt run
# → Listening on http://localhost:8080

# In a separate terminal, start the storefront (Next.js)
cd bigger-beach-towels
npm run dev
# → http://localhost:3000`}
        </CodeBlock>
        <p>
          The node mines the genesis block on startup, awarding 50 SMT to{' '}
          <code className="text-slate-300 font-mono">summit-node</code>.
          Visit the <Link href="/faucet" className="text-sky-400 hover:text-sky-300 underline">faucet</Link>{' '}
          to get 25 free SMT, then head to the{' '}
          <Link href="/" className="text-sky-400 hover:text-sky-300 underline">shop</Link>.
        </p>
      </Section>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <p className="text-slate-600 text-sm">Built with Scala 3 &amp; Next.js</p>
        <a
          href="https://github.com/franklinrussell/blockchain"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-slate-700 hover:border-sky-600 text-slate-400 hover:text-sky-400 rounded-lg text-sm transition-colors"
        >
          View on GitHub
        </a>
      </div>
    </div>
  )
}
