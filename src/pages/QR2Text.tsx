import { useState, useRef, useEffect } from 'react'
import jsQR from 'jsqr'
import { decrypt } from '../utils/crypto'
import { styles } from '../utils/styles'
import { copyText } from '../utils/lib'
import Error from '../components/Error'

export default function QR2Text() {
  const [created, setCreated] = useState(false)
  const [text, setText] = useState('')
  const [password, setPassword] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileData, setFileData] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!created && fileName) {
      passwordRef.current?.focus()
    }
  }, [fileName, created])

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setFileData(e.target?.result as string)
      setFileName(file.name)
      setError('')
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDecrypt = () => {
    if (!fileData || !password) {
      setError('Please upload a file and enter a password.')
      return
    }

    const image = new Image()
    image.src = fileData
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      canvas.width = image.width
      canvas.height = image.height
      context.drawImage(image, 0, 0)

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height)

      if (qrCode) {
        const data = qrCode.data.replace(/^https?:\/\/[^/]+\/\?ds=/, '')
        const decryptedText = decrypt(data, password)
        if (decryptedText) {
          setText(decryptedText)
          setCreated(true)
        } else {
          setError('Decryption failed. Please check the password.')
        }
      } else {
        setError('No QR code found in the image.')
      }
    }
    image.onerror = () => {
      setError('Failed to load the image. Please try a different file.')
    }
  }

  const reset = () => {
    setText('')
    setPassword('')
    setFileName('')
    setFileData(null)
    setCreated(false)
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="w-full max-w-[800px] mx-auto px-8">
      <div className="text-3xl pt-4">QR to Text</div>
      <div className="text-gray-500">Upload a file containing the QR code</div>

      {!fileName && !created && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-dashed border-2 h-[200px] border-gray-400 rounded-lg p-4 text-center mt-6 flex flex-col justify-center items-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="text-gray-500">
            Drag and drop a QR code image here or click to select a file
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>
      )}

      {fileName && !created && (
        <div className="pt-4">
          <div className="pb-2 text-gray-600">Uploaded File: {fileName}</div>
          <div className="pb-4">
            <div className={styles.labelB}>Password</div>
            <input
              ref={passwordRef}
              type="password"
              className={styles.textInput}
              placeholder="Enter password"
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              onKeyDown={(e) => e.key === 'Enter' && handleDecrypt()}
            />
          </div>
          <div className="flex justify-center gap-2">
            <button type="button" className={styles.button} onClick={handleDecrypt}>
              Decrypt
            </button>
            <button type="button" className={styles.button} onClick={reset}>
              Reset
            </button>
          </div>
        </div>
      )}

      {created && (
        <>
          <div className="pt-4">
            <div className={styles.labelB}>Plain text</div>
            <textarea
              readOnly
              className={styles.textInput}
              value={text}
              rows={6}
              onClick={() => copyText(text, 'Decrypted text')}
              title="Click to copy to clipboard"
            />
            <div className={styles.comments + ' text-right'}>Click text to copy to clipboard</div>
          </div>
          <div className="flex justify-center mt-4">
            <button type="button" className={styles.button} onClick={reset}>
              Reset
            </button>
          </div>
        </>
      )}

      <Error text={error} clear={() => setError('')} />
    </div>
  )
}
