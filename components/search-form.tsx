"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SearchForm({ className, ...props }: React.HTMLAttributes<HTMLFormElement>) {
  return (
    <form
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar..."
          className="pl-8"
        />
      </div>
      <Button type="submit" size="sm">
        Buscar
      </Button>
    </form>
  )
}