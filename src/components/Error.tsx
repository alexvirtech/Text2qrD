interface ErrorProps {
  text: string
  clear: () => void
}

export default function Error({ text, clear }: ErrorProps) {
  if (!text) return null
  return (
    <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded flex justify-between items-center">
      <span>{text}</span>
      <button onClick={clear} className="text-red-500 hover:text-red-700 font-bold ml-4">
        &times;
      </button>
    </div>
  )
}
