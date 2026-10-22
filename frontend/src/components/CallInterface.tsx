'use client'

import { useState, useEffect } from 'react'
import Vapi from '@vapi-ai/web'

const vapiPublicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ''
const vapi = new Vapi(vapiPublicKey)

export default function CallInterface({ onCallEnded }: { onCallEnded: () => void }) {
  const [connecting, setConnecting] = useState(false)
  const [active, setActive] = useState(false)
  const [transcript, setTranscript] = useState<{ role: string; message: string }[]>([])

  useEffect(() => {
    vapi.on('call-start', () => {
      setConnecting(false)
      setActive(true)
      setTranscript([])
    })

    vapi.on('call-end', () => {
      setActive(false)
      setConnecting(false)
      onCallEnded()
    })

    vapi.on('message', (message) => {
      if (message.type === 'transcript') {
        setTranscript((prev) => [...prev, { role: message.role, message: message.transcript }])
      }
    })

    return () => {
      vapi.stop()
    }
  }, [onCallEnded])

  const startCall = async () => {
    setConnecting(true)
    // Replace with your Vapi Assistant ID created in the Vapi dashboard
    const assistantId = 'YOUR_VAPI_ASSISTANT_ID' 
    try {
      await vapi.start(assistantId)
    } catch (err) {
      console.error(err)
      setConnecting(false)
    }
  }

  const stopCall = () => {
    vapi.stop()
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">AI Sales Voice Bot</h2>
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          <span className="text-sm text-gray-600 font-medium">
            {active ? 'Call Active' : connecting ? 'Connecting...' : 'Ready'}
          </span>
        </div>
      </div>

      {/* Live Chat Screen Requirement */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 space-y-3">
        {transcript.length === 0 ? (
          <p className="text-gray-400 text-center text-sm mt-32">Start a call to see live transcript messages...</p>
        ) : (
          transcript.map((t, idx) => (
            <div key={idx} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-lg text-sm ${t.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <p className="font-xs opacity-75 capitalize mb-1">{t.role}</p>
                <p>{t.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Call Controls Requirement */}
      <div className="flex gap-4">
        {!active ? (
          <button
            onClick={startCall}
            disabled={connecting}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition"
          >
            {connecting ? 'Connecting...' : 'Start Call'}
          </button>
        ) : (
          <button
            onClick={stopCall}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  )
}