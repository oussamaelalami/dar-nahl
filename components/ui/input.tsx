import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-xl border border-honey-200 bg-white/80 px-4 py-2.5 text-sm text-honey-950 shadow-sm',
          'placeholder:text-honey-700/40',
          'transition-all duration-200',
          'focus:border-honey-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-honey-500/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
