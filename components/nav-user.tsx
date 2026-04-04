import { LogOut, User } from "lucide-react"
import Link from "next/link"

interface NavUserProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
}

export function NavUser({ user }: NavUserProps) {
  return (
    <div className="border-t p-3">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      <Link
        href="/logout"
        className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent text-red-500"
      >
        <LogOut className="w-4 h-4 mr-2" />
        <span>Cerrar sesión</span>
      </Link>
    </div>
  )
}