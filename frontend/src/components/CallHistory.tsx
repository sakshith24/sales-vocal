'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CallHistory({ refreshKey }: { refreshKey: number }) {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true)
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setLogs(data)
      }
      setLoading(false)
    }
    fetchLogs()
  }, [refreshKey])

  if (loading) return <p className="text-sm text-gray-500">Loading call history...</p>

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Call History & AI Summaries</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b text-gray-600 text-sm">
            <th className="py-3 px-4">Date / Time</th>
            <th className="py-3 px-4">Duration</th>
            <th className="py-3 px-4">Sales Status</th>
            <th className="py-3 px-4">AI Summary</th>
            <th className="py-3 px-4">Recording</th>
          </tr>
        </thead>
        <tbody className="divide-y text-sm">
          {logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-400">No previous calls found.</td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-600">{new Date(log.created_at).toLocaleString()}</td>
                <td className="py-3 px-4 text-gray-600">{log.duration_seconds}s</td>
                <td className="py-3 px-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    log.sales_status === 'Converted' ? 'bg-green-100 text-green-700' :
                    log.sales_status === 'Interested' ? 'bg-blue-100 text-blue-700' :
                    log.sales_status === 'Demo Requested' ? 'bg-purple-100 text-purple-700' :
                    log.sales_status === 'Not Interested' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {log.sales_status}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{log.summary}</td>
                <td className="py-3 px-4">
                  {log.audio_url ? (
                    <audio controls src={log.audio_url} className="h-8 w-40" />
                  ) : (
                    <span className="text-gray-400 text-xs">Processing...</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}