import './globals.css'
import Navbar from './components/Navbar'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SaaS Hotel',
  description: 'Client & Room Management System',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-7xl mx-auto p-6">{children}</main>
      </body>
    </html>
  )
}