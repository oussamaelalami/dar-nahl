'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-honey-gradient text-white shadow-honey hover:shadow-honey-lg hover:-translate-y-0.5 active:translate-y-0',
        secondary:
          'bg-honey-100 text-honey-800 border border-honey-200 hover:bg-honey-200 hover:border-honey-300',
        outline:
          'border-2 border-honey-600 text-honey-700 bg-transparent hover:bg-honey-50',
        ghost:
          'text-honey-700 hover:bg-honey-100 hover:text-honey-800',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        link:
          'text-honey-600 underline-offset-4 hover:underline p-0 h-auto',
        dark:
          'bg-honey-950 text-honey-100 hover:bg-honey-900 shadow-md hover:-translate-y-0.5',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm:      'h-9 px-3.5 text-xs',
        lg:      'h-13 px-8 text-base',
        xl:      'h-14 px-10 text-base',
        icon:    'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
