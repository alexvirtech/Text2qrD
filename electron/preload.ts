import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  onUpdateAvailable: (cb: (version: string) => void) =>
    ipcRenderer.on('update-available', (_e, version) => cb(version)),
  onDownloadProgress: (cb: (percent: number) => void) =>
    ipcRenderer.on('update-download-progress', (_e, percent) => cb(percent)),
  onUpdateDownloaded: (cb: () => void) =>
    ipcRenderer.on('update-downloaded', () => cb()),
  startDownload: () => ipcRenderer.send('start-download'),
  installUpdate: () => ipcRenderer.send('install-update'),
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),
})
