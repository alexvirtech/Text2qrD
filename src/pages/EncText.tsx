import { useState, useRef, useEffect, FormEvent } from 'react'
import { encrypt } from '../utils/crypto'
import { styles } from '../utils/styles'
import { copyText } from '../utils/lib'

export default function EncText() {
  const [created, setCreated] = useState(false)
  const [ciphertext, setCiphertext] = useState('')

  const plainTextRef = useRef<HTMLTextAreaElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const repPasswordRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    plainTextRef.current?.focus()
  }, [])

  const validatePassword = () => {
    if (passwordRef.current && repPasswordRef.current) {
      if (passwordRef.current.value !== repPasswordRef.current.value) {
        repPasswordRef.current.setCustomValidity('Passwords do not match')
      } else {
        repPasswordRef.current.setCustomValidity('')
      }
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!repPasswordRef.current?.reportValidity()) return

    const ct = encrypt(plainTextRef.current!.value, passwordRef.current!.value)
    setCiphertext(ct)
    setCreated(true)
  }

  const reset = () => {
    if (plainTextRef.current) plainTextRef.current.value = ''
    if (passwordRef.current) passwordRef.current.value = ''
    if (repPasswordRef.current) repPasswordRef.current.value = ''
    setCiphertext('')
    setCreated(false)
    setTimeout(() => plainTextRef.current?.focus(), 100)
  }

  return (
    <div className="w-full max-w-[800px] mx-auto px-8">
      <form onSubmit={handleSubmit} onReset={reset}>
        <div className="text-3xl pt-4">Text Encryption</div>
        <div className="pt-2">
          <div className={styles.labelB}>Your sensitive text</div>
          <textarea
            ref={plainTextRef}
            className={styles.textInput}
            placeholder="Enter your sensitive text for encryption"
            required
            rows={3}
            disabled={created}
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

        {created && (
          <div className="pt-2">
            <div className={styles.labelB}>Encrypted text</div>
            <textarea
              readOnly
              className={styles.textInput}
              value={ciphertext}
              rows={3}
              onClick={() => copyText(ciphertext, 'Encrypted text')}
              title="Click to copy to clipboard"
            />
            <div className={styles.comments + ' text-right'}>Click text to copy to clipboard</div>
          </div>
        )}

        <div className="mt-4 flex justify-center gap-2">
          {created ? (
            <button type="reset" className={styles.button}>
              Reset
            </button>
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
