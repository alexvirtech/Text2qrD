import { useState, useEffect } from 'react'

declare global {
  interface Window {
    electronAPI?: {
      platform: string
      onUpdateAvailable: (cb: (version: string) => void) => void
      onDownloadProgress: (cb: (percent: number) => void) => void
      onUpdateDownloaded: (cb: () => void) => void
      startDownload: () => void
      installUpdate: () => void
      checkForUpdates: () => void
    }
  }
}

type Stage = 'available' | 'downloading' | 'ready' | 'dismissed'

export default function UpdateBanner() {
  const [stage, setStage] = useState<Stage | null>(null)
  const [version, setVersion] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const api = window.electronAPI
    if (!api) return

    api.onUpdateAvailable((v) => {
      setVersion(v)
      setStage('available')
    })

    api.onDownloadProgress((percent) => {
      setProgress(percent)
    })

    api.onUpdateDownloaded(() => {
      setStage('ready')
    })
  }, [])

  if (!stage || stage === 'dismissed') return null

  return (
    <div className="bg-blue-600 text-white px-4 py-2 flex items-center justify-between text-sm">
      {stage === 'available' && (
        <>
          <span>A new version ({version}) is available.</span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setStage('downloading')
                window.electronAPI?.startDownload()
              }}
              className="bg-white text-blue-600 font-bold px-3 py-0.5 rounded hover:bg-blue-50"
            >
              Download
            </button>
            <button
              onClick={() => setStage('dismissed')}
              className="text-blue-200 hover:text-white px-2"
            >
              Later
            </button>
          </div>
        </>
      )}
      {stage === 'downloading' && (
        <>
          <span>Downloading update... {progress}%</span>
          <div className="w-32 h-2 bg-blue-400 rounded overflow-hidden">
            <div className="h-full bg-white transition-all" style={{ width: `${progress}%` }} />
          </div>
        </>
      )}
      {stage === 'ready' && (
        <>
          <span>Update downloaded. Restart to apply.</span>
          <button
            onClick={() => window.electronAPI?.installUpdate()}
            className="bg-white text-blue-600 font-bold px-3 py-0.5 rounded hover:bg-blue-50"
          >
            Restart Now
          </button>
        </>
      )}
    </div>
  )
}
