import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Báo Cáo Tiến Độ',
  description: 'Hệ thống hiển thị báo cáo tiến độ cá nhân',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}

