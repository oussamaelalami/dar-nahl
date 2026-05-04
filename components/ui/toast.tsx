'use client'

import * as React from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const ToastProvider   = ToastPrimitive.Provider
const ToastViewport   = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-4 end-4 z-[100] flex max-h-screen w-full max-w-[380px] flex-col gap-2',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & {
    variant?: 'default' | 'success' | 'error'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-2xl border p-4 pr-8 shadow-honey-lg transition-all duration-200',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]',
        'data-[state=open]:animate-slide-up data-[state=closed]:opacity-0',
        variant === 'default' && 'bg-white border-honey-200',
        variant === 'success' && 'bg-green-50 border-green-200',
        variant === 'error'   && 'bg-red-50 border-red-200',
        className,
      )}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitive.Root.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute end-2 top-2 rounded-md p-1 text-honey-700/40 transition-colors hover:text-honey-700 cursor-pointer',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitive.Close>
))
ToastClose.displayName = ToastPrimitive.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold text-honey-900', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm text-honey-700/70', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitive.Description.displayName

export {
  ToastProvider, ToastViewport, Toast, ToastClose, ToastTitle, ToastDescription,
}
