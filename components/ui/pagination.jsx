import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button";

const Pagination = ({
  className,
  ...props
}) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props} />
)
Pagination.displayName = "Pagination"

const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-row items-center gap-1", className)}
    {...props} />
))
PaginationContent.displayName = "PaginationContent"

const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  ...props
}) => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors hover:opacity-80 cursor-pointer",
      className
    )}
    style={
      isActive
        ? { background: '#1A1714', color: '#F8F6F1', borderRadius: '4px', padding: '4px 10px' }
        : { color: '#8A8377', background: 'transparent', padding: '4px 10px' }
    }
    {...props} />
)
PaginationLink.displayName = "PaginationLink"

const PaginationPrevious = ({
  className,
  ...props
}) => (
  <a
    aria-label="Go to previous page"
    className={cn("inline-flex items-center justify-center whitespace-nowrap text-sm gap-1 cursor-pointer transition-colors hover:opacity-80", className)}
    style={{ color: '#C6A84B', fontWeight: 500, background: 'transparent', padding: '4px 10px' }}
    {...props}>
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </a>
)
PaginationPrevious.displayName = "PaginationPrevious"

const PaginationNext = ({
  className,
  ...props
}) => (
  <a
    aria-label="Go to next page"
    className={cn("inline-flex items-center justify-center whitespace-nowrap text-sm gap-1 cursor-pointer transition-colors hover:opacity-80", className)}
    style={{ color: '#C6A84B', fontWeight: 500, background: 'transparent', padding: '4px 10px' }}
    {...props}>
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </a>
)
PaginationNext.displayName = "PaginationNext"

const PaginationEllipsis = ({
  className,
  ...props
}) => (
  <span
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}>
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
}
