import { type LucideIcon } from "lucide-react"
import Link from "next/link"

interface NavSecondaryProps {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}

export function NavSecondary({ items }: NavSecondaryProps) {
  return (
    <div className="space-y-1">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.url}
          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
        >
          {item.icon && <item.icon className="w-4 h-4 mr-2" />}
          <span>{item.title}</span>
        </Link>
      ))}
    </div>
  )
}