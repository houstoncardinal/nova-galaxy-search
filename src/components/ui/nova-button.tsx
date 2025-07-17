import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const novaButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium font-space transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        nova: "bg-nova-gradient text-primary-foreground shadow-nova hover:shadow-glow hover:scale-105 border border-primary/20",
        cosmic: "bg-card text-card-foreground shadow-cosmic hover:bg-muted border border-border hover:border-primary/40",
        ghost: "text-foreground hover:bg-muted hover:text-accent-foreground border border-transparent hover:border-primary/20",
        glow: "bg-accent text-accent-foreground shadow-glow animate-glow-pulse hover:scale-105",
      },
      size: {
        default: "h-11 px-8 py-2",
        sm: "h-9 rounded-lg px-4",
        lg: "h-12 rounded-xl px-10",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "nova",
      size: "default",
    },
  }
)

export interface NovaButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof novaButtonVariants> {
  asChild?: boolean
}

const NovaButton = React.forwardRef<HTMLButtonElement, NovaButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(novaButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
NovaButton.displayName = "NovaButton"

export { NovaButton, novaButtonVariants }