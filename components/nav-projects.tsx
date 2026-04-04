import { type LucideIcon } from "lucide-react"
import Link from "next/link"

interface NavProjectsProps {
  projects: {
    name: string
    url: string
    icon?: LucideIcon
  }[]
}

export function NavProjects({ projects }: NavProjectsProps) {
  return (
    <div className="space-y-1">
      {projects.map((project) => (
        <Link
          key={project.name}
          href={project.url}
          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
        >
          {project.icon && <project.icon className="w-4 h-4 mr-2" />}
          <span>{project.name}</span>
        </Link>
      ))}
    </div>
  )
}