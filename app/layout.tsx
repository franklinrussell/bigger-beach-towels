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
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="group flex flex-col leading-tight">
              <span className="text-white font-bold text-lg tracking-tight group-hover:text-sky-300">
                Bigger Beach Towels
              </span>
              <span className="text-slate-500 text-xs">A ski shop. Obviously.</span>
            </Link>

            <nav className="flex items-center gap-1">
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
        <footer className="border-t border-slate-800 py-6 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center text-slate-600 text-sm space-y-1">
            <p>Powered by <span className="text-sky-500 font-medium">SummitCoin (SMT)</span> — a blockchain built from scratch in Scala 3</p>
            <p>Node at <span className="font-mono text-slate-500">{process.env.NEXT_PUBLIC_API_URL ?? 'localhost:8080'}</span></p>
          </div>
        </footer>

      </body>
    </html>
  )
}
