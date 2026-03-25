import Link from 'next/link'
import { products, type Product } from '@/lib/products'

function MountainHero() {
  return (
    <div className="relative overflow-hidden bg-[#060911] py-24">
      {/* Layered gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-950/30 via-transparent to-slate-950/60 pointer-events-none" />
      {/* Subtle radial glow behind text */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Mountain silhouette */}
      <svg
        viewBox="0 0 1200 140"
        className="absolute bottom-0 left-0 w-full text-slate-900/80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,140 L120,80 L240,112 L400,20 L520,90 L660,2 L800,62 L960,30 L1100,82 L1200,54 L1200,140 Z"
          fill="currentColor"
        />
        {/* Snow caps */}
        <path d="M390,34 L400,20 L410,34 Z" fill="white" opacity="0.35" />
        <path d="M650,16 L660,2  L670,16 Z" fill="white" opacity="0.35" />
        <path d="M950,44 L960,30 L970,44 Z" fill="white" opacity="0.35" />
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/5 text-sky-400 text-xs font-medium tracking-wider uppercase mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
          SummitCoin Accepted Here
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight leading-tight">
          Premium Ski &amp;{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-200">
            Outdoors
          </span>{' '}
          Gear
        </h1>
        <p className="text-slate-400 text-base md:text-lg max-w-lg mx-auto mb-8 leading-relaxed">
          All prices in SMT. No credit cards. No fiat. Just pure proof-of-work
          cryptocurrency and questionable ski advice.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/faucet"
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-lg text-sm transition-colors shadow-lg shadow-sky-900/40"
          >
            Get Free SMT from the Faucet
          </Link>
          <Link
            href="/explorer"
            className="px-5 py-2.5 border border-slate-700/80 hover:border-slate-500 text-slate-400 hover:text-white rounded-lg text-sm transition-colors"
          >
            Block Explorer
          </Link>
        </div>
      </div>
    </div>
  )
}

function CategoryBadge({ category }: { category: Product['category'] }) {
  const colours: Record<Product['category'], string> = {
    'Ski Gear':   'bg-sky-950 text-sky-400 border-sky-800/60',
    'Apres Ski':  'bg-amber-950/60 text-amber-400 border-amber-800/50',
    'Outdoors':   'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
    'Lodge Life': 'bg-violet-950/60 text-violet-400 border-violet-800/50',
  }
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold tracking-wide ${colours[category]}`}>
      {category}
    </span>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className={`
      group flex flex-col rounded-xl border p-5 transition-all duration-200
      hover:-translate-y-1 hover:shadow-xl
      ${product.hero
        ? 'border-sky-700/40 bg-gradient-to-br from-sky-950/40 to-slate-900 hover:border-sky-600/60 hover:shadow-sky-950/60'
        : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700 hover:shadow-slate-950/80'}
    `}>
      <div className="flex items-center justify-between mb-4">
        <CategoryBadge category={product.category} />
        {product.badge && (
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold tracking-wide ${
            product.hero ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            {product.badge}
          </span>
        )}
      </div>

      <h2 className="text-white font-bold text-base mb-1 leading-snug">{product.name}</h2>
      <p className="text-sky-400/80 text-xs italic mb-2.5">{product.tagline}</p>
      <p className="text-slate-500 text-sm leading-relaxed flex-1">{product.description}</p>

      <div className="mt-5 pt-4 border-t border-slate-800/60 flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-white">{product.price}</span>
          <span className="text-sky-400 text-sm font-semibold">SMT</span>
        </div>
        <Link
          href={`/checkout?id=${product.id}`}
          className={`
            px-4 py-2 rounded-lg font-semibold text-xs transition-colors
            ${product.hero
              ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-sm shadow-sky-900/50'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600'}
          `}
        >
          Buy with SMT
        </Link>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <>
      <MountainHero />

      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Features strip */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: '⚡', label: 'Instant Settlement',  desc: 'Transactions confirmed in the next mined block' },
            { icon: '🔗', label: 'No Middlemen',         desc: 'Direct peer-to-peer payment on the SummitCoin chain' },
            { icon: '🎿', label: 'Free to Try',          desc: 'Grab 25 SMT from the faucet and hit the virtual slopes' },
          ].map(item => (
            <div key={item.label} className="px-5 py-4 rounded-xl border border-slate-800/60 bg-slate-900/40 flex items-start gap-3">
              <span className="text-lg leading-none mt-0.5">{item.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm mb-0.5">{item.label}</p>
                <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
