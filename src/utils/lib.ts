export function showPopup(message: string) {
  const existing = document.querySelector('.popup')
  if (existing) existing.remove()

  const popup = document.createElement('div')
  popup.className = 'popup'
  popup.textContent = message
  document.body.appendChild(popup)
  setTimeout(() => popup.remove(), 2000)
}

export async function copyText(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text)
    showPopup(`${label} copied to clipboard`)
  } catch {
    showPopup('Failed to copy')
  }
}
