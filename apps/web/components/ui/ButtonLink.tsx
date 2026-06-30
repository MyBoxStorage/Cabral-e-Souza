import { buttonVariants, cn, type ButtonProps } from '@cabral-souza/ui'
import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type ButtonLinkProps = Pick<ButtonProps, 'variant' | 'size' | 'className' | 'showChevron'> & {
  href: string
  external?: boolean
  children: ReactNode
  onClick?: ComponentProps<typeof Link>['onClick']
}

export function ButtonLink({
  href,
  external = false,
  variant,
  size,
  className,
  showChevron,
  children,
  onClick,
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size, className }))
  const chevron =
    variant === 'tertiary' && showChevron !== false ? (
      <span
        aria-hidden
        className="inline-block transition-transform duration-base ease-smooth group-hover:translate-x-1"
      >
        →
      </span>
    ) : null

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
        {chevron}
      </a>
    )
  }

  return (
    <Link href={href} className={classes} {...(onClick ? { onClick } : {})}>
      {children}
      {chevron}
    </Link>
  )
}
