import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import path from 'node:path'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 600,
    minHeight: 500,
    icon: path.join(process.env.VITE_PUBLIC!, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST!, 'index.html'))
  }
}

function buildMenu() {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Check for Updates...',
          click: () => {
            manualUpdateCheck = true
            autoUpdater.checkForUpdates()
          },
        },
        { type: 'separator' },
        {
          label: `About Text2QR Desktop v${app.getVersion()}`,
          enabled: false,
        },
      ],
    },
  ]
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
}

let manualUpdateCheck = false

function setupAutoUpdater() {
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('update-available', (info) => {
    if (!win) return
    win.webContents.send('update-available', info.version)
  })

  autoUpdater.on('update-not-available', () => {
    if (manualUpdateCheck && win) {
      dialog.showMessageBox(win, {
        type: 'info',
        title: 'No Updates',
        message: 'You are running the latest version.',
      })
    }
    manualUpdateCheck = false
  })

  autoUpdater.on('download-progress', (progress) => {
    if (win) {
      win.webContents.send('update-download-progress', Math.round(progress.percent))
    }
  })

  autoUpdater.on('update-downloaded', () => {
    if (win) {
      win.webContents.send('update-downloaded')
    }
  })

  autoUpdater.on('error', (err) => {
    if (manualUpdateCheck && win) {
      dialog.showMessageBox(win, {
        type: 'error',
        title: 'Update Error',
        message: 'Could not check for updates. Please try again later.',
      })
    }
    manualUpdateCheck = false
    console.error('Auto-updater error:', err)
  })

  ipcMain.on('start-download', () => {
    autoUpdater.downloadUpdate()
  })

  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall()
  })

  ipcMain.on('check-for-updates', () => {
    manualUpdateCheck = true
    autoUpdater.checkForUpdates()
  })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  createWindow()
  buildMenu()
  setupAutoUpdater()
  autoUpdater.checkForUpdates().catch(() => {})
})
