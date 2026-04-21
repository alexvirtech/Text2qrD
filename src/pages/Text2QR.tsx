import { useState, useRef, useEffect, FormEvent } from 'react'
import QRCode from 'qrcode'
import { encrypt } from '../utils/crypto'
import { styles } from '../utils/styles'
import { showPopup } from '../utils/lib'

export default function Text2QR() {
  const [created, setCreated] = useState(false)
  const [ciphertext, setCiphertext] = useState('')

  const plainTextRef = useRef<HTMLTextAreaElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const repPasswordRef = useRef<HTMLInputElement>(null)
  const wordReplacementRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    plainTextRef.current?.focus()
  }, [])

  useEffect(() => {
    if (ciphertext && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, ciphertext, {
        width: canvasRef.current.offsetWidth || 400,
        margin: 0,
      })
    }
  }, [ciphertext])

  const validatePassword = () => {
    if (passwordRef.current && repPasswordRef.current) {
      if (passwordRef.current.value !== repPasswordRef.current.value) {
        repPasswordRef.current.setCustomValidity('Passwords do not match')
      } else {
        repPasswordRef.current.setCustomValidity('')
      }
    }
  }

  const validateWordReplacement = (): boolean => {
    const el = wordReplacementRef.current
    if (!el || !el.value) {
      el?.setCustomValidity('')
      return false
    }
    const isValid = /^\d+,\d+$/.test(el.value)
    el.setCustomValidity(isValid ? '' : 'Wrong replacement rules')
    return isValid
  }

  function replaceWordsPosition(str: string, positions: string): string {
    const words = str.split(' ')
    let [pos1, pos2] = positions.split(',').map(Number)
    pos1 -= 1
    pos2 -= 1
    if (pos1 < 0 || pos2 < 0 || pos1 >= words.length || pos2 >= words.length) {
      wordReplacementRef.current?.setCustomValidity('Wrong replacement rules')
      throw new Error('Invalid positions')
    }
    ;[words[pos1], words[pos2]] = [words[pos2], words[pos1]]
    return words.join(' ')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!repPasswordRef.current?.reportValidity() || !wordReplacementRef.current?.reportValidity())
      return

    let textToEnc = plainTextRef.current!.value
    if (validateWordReplacement()) {
      textToEnc = replaceWordsPosition(textToEnc, wordReplacementRef.current!.value)
    }

    const ds = encrypt(textToEnc, passwordRef.current!.value)
    const ct = `https://text2qr.app/?ds=${ds}`
    setCiphertext(ct)
    setCreated(true)
  }

  const reset = () => {
    if (plainTextRef.current) plainTextRef.current.value = ''
    if (passwordRef.current) passwordRef.current.value = ''
    if (repPasswordRef.current) repPasswordRef.current.value = ''
    if (wordReplacementRef.current) wordReplacementRef.current.value = ''
    setCiphertext('')
    setCreated(false)
    setTimeout(() => plainTextRef.current?.focus(), 100)
  }

  const copyQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (blob) {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        showPopup('QR code copied to clipboard')
      }
    })
  }

  const saveQR = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'text2qr.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="w-full max-w-[800px] mx-auto px-8">
      <form onSubmit={handleSubmit} onReset={reset}>
        <div className="text-3xl pt-4">Text to QR Code</div>
        <div className="pt-2">
          <div className={styles.labelB}>Your sensitive text</div>
          <textarea
            ref={plainTextRef}
            className={styles.textInput}
            placeholder="Enter your sensitive text for encryption"
            required
            rows={3}
            disabled={created}
            maxLength={1000}
          />
          <div className={styles.comments}>The recommended maximum length is 1000 Latin characters.</div>
        </div>
        <div className="pt-2">
          <div className={styles.labelB}>Password</div>
          <input
            ref={passwordRef}
            onInput={validatePassword}
            type="password"
            className={styles.textInput}
            placeholder="Enter password"
            required
            disabled={created}
          />
        </div>
        <div className="pt-2">
          <div className={styles.labelB}>Confirm Password</div>
          <input
            ref={repPasswordRef}
            onInput={validatePassword}
            type="password"
            className={styles.textInput}
            placeholder="Confirm password"
            required
            disabled={created}
          />
        </div>
        <div className="pt-2">
          <div className={styles.labelB}>
            Word replacement <span className="font-normal pl-2">(optional)</span>
          </div>
          <input
            ref={wordReplacementRef}
            type="password"
            onChange={validateWordReplacement}
            className={styles.textInput}
            placeholder="Word replacement"
            disabled={created}
          />
          <div className={styles.comments}>Example: 4,12 (the words 4 and 12 will change places)</div>
        </div>

        {created && (
          <div className="pt-4">
            <div className="flex justify-center">
              <div className="border border-blue-200 p-4 bg-white rounded-md cursor-pointer" onClick={copyQR} title="Click to copy QR code">
                <canvas
                  ref={canvasRef}
                  style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
                />
              </div>
            </div>
            <div className={styles.comments + ' text-center mt-1'}>Click QR code to copy to clipboard</div>
          </div>
        )}

        <div className="mt-4 flex justify-center gap-2">
          {created ? (
            <>
              <button type="button" onClick={saveQR} className={styles.button}>
                Save
              </button>
              <button type="reset" className={styles.button}>
                Reset
              </button>
            </>
          ) : (
            <button type="submit" className={styles.button}>
              Encrypt
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
