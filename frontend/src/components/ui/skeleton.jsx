import { cn } from "../../lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-dark-border", className)}
      {...props}
    />
  )
}

export { Skeleton }
