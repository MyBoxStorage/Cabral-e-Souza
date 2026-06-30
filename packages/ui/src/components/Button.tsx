import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2',
    'font-body font-medium uppercase tracking-caps',
    'text-eyebrow',
    'transition-[background-color,color,border-color,transform] duration-base ease-smooth',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-300',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:translate-y-px',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-bronze-500 text-cream-100 border-none',
          'hover:bg-bronze-700',
        ],
        secondary: [
          'bg-transparent text-bronze-500 border border-bronze-500',
          'hover:bg-bronze-500 hover:text-cream-100',
        ],
        tertiary: [
          'bg-transparent text-bronze-500 border-none p-0',
          'normal-case tracking-normal text-body-sm font-medium',
          'no-underline hover:underline hover:underline-offset-4',
          'group',
          'active:translate-y-0',
        ],
        ghost: [
          'bg-transparent text-cream-300 border border-cream-300/50',
          'hover:border-cream-300 hover:bg-cream-100/10 hover:text-cream-100',
        ],
      },
      size: {
        sm: 'px-[18px] py-[10px] rounded-md',
        md: 'px-[22px] py-3 rounded-md',
        lg: 'px-7 py-3.5 rounded-md',
      },
    },
    compoundVariants: [
      { variant: 'tertiary', size: 'sm', className: 'p-0' },
      { variant: 'tertiary', size: 'md', className: 'p-0' },
      { variant: 'tertiary', size: 'lg', className: 'p-0' },
      { variant: 'secondary', size: 'sm', className: 'px-[17px] py-[9px]' },
      { variant: 'secondary', size: 'md', className: 'px-[21px] py-[11px]' },
      { variant: 'secondary', size: 'lg', className: 'px-[27px] py-[13px]' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  showChevron?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, showChevron, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
        {children}
        {variant === 'tertiary' && showChevron !== false && (
          <span
            aria-hidden
            className="inline-block transition-transform duration-base ease-smooth group-hover:translate-x-1"
          >
            →
          </span>
        )}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
