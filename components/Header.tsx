// components/Header.tsx
'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Music, Home, Guitar } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()

  const navigation = [
    { path: '/inicio', label: 'Inicio', icon: Home },
    { path: '/inicio/instrumentos', label: 'Instrumentos', icon: Guitar },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Music className="h-7 w-7 text-blue-600" />
            <div>
              <div className="text-xl font-bold text-gray-900">Sistema Musical</div>
              <div className="text-xs text-gray-500">Partituras</div>
            </div>
          </div>
          
          <nav className="flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}