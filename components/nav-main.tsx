import { type LucideIcon } from "lucide-react"
import Link from "next/link"

interface NavMainProps {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}

export function NavMain({ items }: NavMainProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <div key={item.title}>
          <Link
            href={item.url}
            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
          >
            {item.icon && <item.icon className="w-4 h-4 mr-2" />}
            <span>{item.title}</span>
          </Link>
        </div>
      ))}
    </div>
  )
}