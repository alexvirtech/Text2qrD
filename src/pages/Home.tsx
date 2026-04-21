import { useNavigate } from 'react-router-dom'

const items = [
  {
    title: 'Text to QR',
    text: 'Securely convert your sensitive text with a password into a QR code that can be saved or shared',
    href: '/text2qr',
  },
  {
    title: 'QR to Text',
    text: 'Upload a QR code and provide the correct password to decrypt and retrieve your original text',
    href: '/qr2text',
  },
  {
    title: 'Encrypt Text',
    text: 'Convert simple text into an encrypted string using a password for secure storage or sharing',
    href: '/enctext',
  },
  {
    title: 'Decrypt Text',
    text: 'Restore an encrypted string to its original text by entering the correct password',
    href: '/dectext',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="w-full max-w-[800px] mx-auto px-8 py-8">
      <div className="text-center mb-8">
        <div className="text-4xl font-bold text-gray-700 mb-3">Text2QR Desktop</div>
        <div className="text-lg text-gray-500">
          Secure offline text encryption and QR code tools
        </div>
        <div className="mt-2 inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
          All operations are performed offline — no internet required
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.href}
            onClick={() => navigate(item.href)}
            className="min-h-[120px] border border-slate-300 rounded bg-white p-4 cursor-pointer shadow hover:shadow-md transition-shadow"
          >
            <div className="font-bold text-xl text-gray-700">{item.title}</div>
            <div className="text-sm text-gray-500 mt-1">{item.text}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-center text-sm text-gray-400">
        This project is 100% open-source and works entirely offline
      </div>
    </div>
  )
}
