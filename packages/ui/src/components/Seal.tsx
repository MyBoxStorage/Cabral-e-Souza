import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

const sealVariants = cva(
  [
    'inline-flex items-center justify-center',
    'whitespace-nowrap shrink-0',
    'font-body font-medium uppercase tracking-eyebrow text-[0.625rem] sm:text-eyebrow',
    'border px-3 py-1',
    'bg-cream-100/95 text-bronze-500 border-bronze-500',
  ],
  {
    variants: {
      variant: {
        curated: 'border-bronze-500',
        status: 'border-bronze-500 bg-cream-50/95',
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
