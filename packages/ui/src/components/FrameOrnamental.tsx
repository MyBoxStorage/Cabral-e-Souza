import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const frameVariants = cva('relative inline-block', {
  variants: {
    variant: {
      thin: 'p-0 border-2 border-bronze-500',
      medium: 'p-4 border-[3px] border-bronze-500 bg-cream-100',
      ornate: [
        'p-6 border-[3px] border-bronze-500 bg-cream-100',
        'before:absolute before:inset-3 before:border before:border-bronze-300/60 before:pointer-events-none',
      ],
    },
  },
  defaultVariants: {
    variant: 'medium',
  },
})

export interface FrameOrnamentalProps extends VariantProps<typeof frameVariants> {
  children: React.ReactNode
  className?: string
}

export function FrameOrnamental({ variant, children, className }: FrameOrnamentalProps) {
  return <div className={cn(frameVariants({ variant }), className)}>{children}</div>
}
