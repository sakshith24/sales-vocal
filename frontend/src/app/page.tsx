'use client'

import { useState } from 'react'
import CallInterface from '@/components/CallInterface'
import CallHistory from '@/components/CallHistory'

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SalesVocal — AI Voice Sales Bot</h1>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <CallInterface onCallEnded={() => setRefreshKey((prev) => prev + 1)} />
          <CallHistory refreshKey={refreshKey} />
        </div>
      </div>
    </main>
  )
}