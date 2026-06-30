import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const sealVariants = cva(
  [
    'inline-flex items-center',
    'font-body font-medium uppercase tracking-eyebrow text-eyebrow',
    'border px-2.5 py-1.5',
    'bg-cream-100/90 text-bronze-500 border-bronze-500',
  ],
  {
    variants: {
      variant: {
        curated: 'border-bronze-500',
        status: 'border-bronze-500',
        premium: 'border-bronze-700 text-bronze-700',
      },
    },
    defaultVariants: {
      variant: 'curated',
    },
  },
)

export interface SealProps extends VariantProps<typeof sealVariants> {
  children: React.ReactNode
  className?: string
}

export function Seal({ variant, children, className }: SealProps) {
  return <span className={cn(sealVariants({ variant }), className)}>{children}</span>
}
