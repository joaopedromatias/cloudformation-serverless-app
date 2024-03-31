import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Images Uploader'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ padding: 0, margin: 0, scrollBehavior: 'smooth', fontSmooth: 'always' }}
      >
        <header>
          <Box sx={{ backgroundColor: 'red' }}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Upload Image App
                </Typography>
                <ImageIcon sx={{ width: 50, height: 50 }} />
              </Toolbar>
            </AppBar>
          </Box>
        </header>
        <main>
          <Box sx={{ padding: 5 }}>{children}</Box>
        </main>
      </body>
    </html>
  )
}
