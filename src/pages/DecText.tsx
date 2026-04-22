import { useState, useRef, FormEvent } from 'react'
import { decrypt, deterministicMnemonic } from '../utils/crypto'
import { styles } from '../utils/styles'
import { copyText } from '../utils/lib'
import Error from '../components/Error'

export default function DecText() {
  const [created, setCreated] = useState(false)
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  const encTextRef = useRef<HTMLTextAreaElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    try {
      const encValue = encTextRef.current!.value
      const passValue = passwordRef.current!.value
      const txt = decrypt(encValue, passValue)
      setText(txt || deterministicMnemonic(passValue, encValue))
      setCreated(true)
    } catch {
      setError('Error decrypting text')
    }
  }

  const reset = () => {
    setText('')
    if (passwordRef.current) passwordRef.current.value = ''
    setCreated(false)
  }

  return (
    <div className="w-full max-w-[800px] mx-auto px-8">
      <form onSubmit={handleSubmit} onReset={reset}>
        <div className="text-3xl pt-4">Text Decryption</div>
        <div className="pt-2">
          <div className={styles.labelB}>Encrypted text</div>
          <textarea
            ref={encTextRef}
            className={styles.textInput}
            rows={6}
            placeholder="Enter your encrypted text for decryption"
            required
          />
        </div>
        <div className="pt-2">
          <div className={styles.labelB}>Password</div>
          <input
            ref={passwordRef}
            type="password"
            className={styles.textInput}
            placeholder="Enter password"
            required
            disabled={created}
          />
        </div>

        {created && (
          <div className="pt-2">
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
        )}

        <div className="mt-4 flex justify-center gap-2">
          <button type="submit" className={styles.button}>
            Decrypt
          </button>
          {created && (
            <button type="reset" className={styles.button}>
              Reset
            </button>
          )}
        </div>
        <Error text={error} clear={() => setError('')} />
      </form>
    </div>
  )
}
