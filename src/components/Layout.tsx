import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import iconPng from '/icon.png?url'
import UpdateBanner from './UpdateBanner'

const navItems = [
  { to: '/text2qr', label: 'Text to QR' },
  { to: '/qr2text', label: 'QR to Text' },
  { to: '/enctext', label: 'Encrypt Text' },
  { to: '/dectext', label: 'Decrypt Text' },
]

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <UpdateBanner />
      <header className="bg-blue-600 text-white h-14 flex items-center px-6 shadow-md">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-bold mr-8 hover:text-blue-100">
          <img src={iconPng} alt="" className="w-6 h-6" />
          Text2QR Desktop
        </NavLink>
        <nav className="flex gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-800 text-white' : 'text-blue-100 hover:bg-blue-500'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="h-10 flex items-center justify-center text-xs text-gray-400 border-t">
        Text2QR Desktop &mdash; All operations are performed offline
      </footer>
    </div>
  )
}
