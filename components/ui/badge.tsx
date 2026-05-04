import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border',
  {
    variants: {
      variant: {
        default:     'bg-honey-600 text-white border-transparent',
        secondary:   'bg-honey-100 text-honey-800 border-honey-200',
        outline:     'border-honey-400 text-honey-700 bg-transparent',
        destructive: 'bg-red-100 text-red-700 border-red-200',
        success:     'bg-green-100 text-green-700 border-green-200',
        warning:     'bg-amber-100 text-amber-800 border-amber-200',
        info:        'bg-blue-100 text-blue-700 border-blue-200',
        pending:     'bg-amber-100 text-amber-800 border-amber-200',
        confirmed:   'bg-blue-100 text-blue-800 border-blue-200',
        shipped:     'bg-purple-100 text-purple-800 border-purple-200',
        delivered:   'bg-green-100 text-green-800 border-green-200',
        cancelled:   'bg-red-100 text-red-800 border-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
