'use client'
import { useEffect } from 'react'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_ENDPOINT: string
    }
  }
}

export default function Home() {
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_ENDPOINT)
      .then((response) => response.json())
      .then((data) => console.log(data))
  })
  return <main>app</main>
}
