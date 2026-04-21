import CryptoJS from 'crypto-js'

export const encrypt = (text: string, password: string): string => {
  const hash = CryptoJS.SHA256(password + text)
  const salt = CryptoJS.lib.WordArray.create(hash.words.slice(0, 2), 8)

  const derived = CryptoJS.EvpKDF(password, salt, { keySize: 8 + 4 } as any)
  const key = CryptoJS.lib.WordArray.create(derived.words.slice(0, 8), 32)
  const iv = CryptoJS.lib.WordArray.create(derived.words.slice(8, 12), 16)

  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), key, { iv })

  const result = CryptoJS.lib.CipherParams.create({
    ciphertext: encrypted.ciphertext,
    salt: salt,
    formatter: CryptoJS.format.OpenSSL,
  })
  return encodeURIComponent(result.toString())
}

export const decrypt = (text: string, password: string): string | null => {
  try {
    const decodedText = decodeURIComponent(text)
    const decrypted = CryptoJS.AES.decrypt(decodedText, password)
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch {
    return null
  }
}
