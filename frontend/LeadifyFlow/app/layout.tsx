import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LeadifyFlow',
  description: 'LeadifyFlow - Streamline your lead management process',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
