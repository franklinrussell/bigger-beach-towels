import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import { NodeStatusBanner } from './NodeStatusBanner'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bigger Beach Towels — SMT Shop',
  description: 'Premium ski & outdoors gear. Accepted payment: SummitCoin (SMT).',
}

const navLinks = [
  { href: '/',          label: 'Shop'     },
  { href: '/faucet',    label: 'Faucet'   },
  { href: '/explorer',  label: 'Explorer' },
  { href: '/about',     label: 'About'    },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>

        {/* Navigation */}
        <header className="border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
          {/* Sky accent line at top */}
          <div className="h-[2px] bg-gradient-to-r from-sky-600 via-sky-400 to-sky-600" />
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center group-hover:bg-sky-500/20 transition-colors">
                <svg viewBox="0 0 20 20" className="w-4 h-4 text-sky-400" fill="currentColor" aria-hidden="true">
                  <path d="M10 2 L14 9 L18 14 L10 12 L2 14 L6 9 Z" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-semibold text-sm tracking-tight group-hover:text-sky-300 transition-colors">
                  Bigger Beach Towels
                </span>
                <span className="text-slate-600 text-[10px] mt-0.5">A ski shop. Obviously.</span>
              </div>
            </Link>

            <nav className="flex items-center gap-0.5">
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3.5 py-1.5 rounded-md text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* Cold-start banner — visible only when node takes > 3 s to respond */}
        <NodeStatusBanner />

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
              <p className="text-slate-600">
                Powered by{' '}
                <span className="text-sky-500/80 font-medium">SummitCoin (SMT)</span>
                {' '}— a blockchain built from scratch in Scala 3
              </p>
              <p className="text-slate-700 text-xs">
                Node:{' '}
                <span className="font-mono text-slate-600">{process.env.NEXT_PUBLIC_API_URL ?? 'localhost:8080'}</span>
              </p>
            </div>
          </div>
        </footer>

      </body>
    </html>
  )
}
