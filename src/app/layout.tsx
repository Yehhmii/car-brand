import type { Metadata } from 'next'
import LenisProvider from '@/components/providers/LenisProvider'
import GsapProvider from '@/components/providers/GsapProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reserve — The Drive Ahead',
  description:
    'A car that argues with air, and wins. Configure your allocation.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-carbon-950 font-body text-showroom-100 antialiased">
        <GsapProvider>
          <LenisProvider>{children}</LenisProvider>
        </GsapProvider>
      </body>
    </html>
  )
}
