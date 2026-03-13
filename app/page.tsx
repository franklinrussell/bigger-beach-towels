import Link from 'next/link'
import { products, type Product } from '@/lib/products'

// Mountain silhouette — pure SVG, no external images
function MountainHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 py-20">
      <svg
        viewBox="0 0 1200 180"
        className="absolute bottom-0 left-0 w-full text-slate-800"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0,180 L120,100 L240,140 L400,30 L520,110 L660,5 L800,80 L960,45 L1100,100 L1200,70 L1200,180 Z"
          fill="currentColor"
        />
        <path d="M390,42 L400,30 L410,42 Z" fill="white" opacity="0.5" />
        <path d="M650,18 L660,5  L670,18 Z" fill="white" opacity="0.5" />
        <path d="M950,57 L960,45 L970,57 Z" fill="white" opacity="0.5" />
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <p className="text-sky-400 text-sm font-medium tracking-widest uppercase mb-3">
          SummitCoin Accepted Here
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Premium Ski &amp; Outdoors Gear
        </h1>
        <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
          All prices in SMT. No credit cards. No fiat. Just pure proof-of-work cryptocurrency
          and questionable ski advice.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/faucet"
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold rounded-xl transition-colors"
          >
            Get Free SMT from the Faucet
          </Link>
          <Link
            href="/explorer"
            className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl transition-colors"
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
    'Ski Gear':   'bg-sky-900/50 text-sky-300 border-sky-800',
    'Apres Ski':  'bg-amber-900/30 text-amber-400 border-amber-800',
    'Outdoors':   'bg-green-900/30 text-green-400 border-green-800',
    'Lodge Life': 'bg-purple-900/30 text-purple-400 border-purple-800',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium ${colours[category]}`}>
      {category}
    </span>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className={`
      flex flex-col rounded-2xl border p-6 transition-all duration-200
      hover:border-sky-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-950/50
      ${product.hero
        ? 'border-sky-600/50 bg-gradient-to-br from-slate-800 to-slate-900'
        : 'border-slate-800 bg-slate-900'}
    `}>
      <div className="flex items-center gap-2 mb-3">
        <CategoryBadge category={product.category} />
        {product.badge && (
          <span className={`text-xs px-2 py-0.5 rounded font-bold ${
            product.hero ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300'
          }`}>
            {product.badge}
          </span>
        )}
      </div>

      <h2 className="text-white font-bold text-lg mb-1 leading-snug">{product.name}</h2>
      <p className="text-sky-400 text-sm italic mb-3">{product.tagline}</p>
      <p className="text-slate-400 text-sm leading-relaxed flex-1">{product.description}</p>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold text-white">{product.price}</span>
          <span className="text-sky-400 font-medium ml-1">SMT</span>
        </div>
        <Link
          href={`/checkout?id=${product.id}`}
          className={`
            px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors
            ${product.hero
              ? 'bg-sky-500 hover:bg-sky-400 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600'}
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

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { label: 'Instant Settlement',  desc: 'Transactions confirmed in the next mined block' },
            { label: 'No Middlemen',         desc: 'Direct peer-to-peer payment on the SummitCoin chain' },
            { label: 'Free to Try',          desc: 'Grab 25 SMT from the faucet and hit the virtual slopes' },
          ].map(item => (
            <div key={item.label} className="p-4 rounded-xl border border-slate-800 bg-slate-900">
              <p className="text-sky-400 font-semibold text-sm mb-1">{item.label}</p>
              <p className="text-slate-500 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
