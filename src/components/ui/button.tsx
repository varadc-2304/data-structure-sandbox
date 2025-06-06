
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-drona-green to-drona-green/90 text-white shadow-lg hover:shadow-xl hover:scale-105 border border-drona-green/20",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-destructive-foreground shadow-lg hover:shadow-xl hover:scale-105",
        outline:
          "border-2 border-drona-green/30 bg-white/80 backdrop-blur-sm hover:bg-drona-green/5 hover:border-drona-green/50 shadow-md hover:shadow-lg",
        secondary:
          "bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground shadow-md hover:shadow-lg hover:scale-105",
        ghost: "hover:bg-drona-green/10 hover:text-drona-green rounded-xl",
        link: "text-drona-green underline-offset-4 hover:underline font-medium",
        arena: "bg-gradient-to-r from-arena-green to-arena-green/90 text-white shadow-lg hover:shadow-xl hover:scale-105",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-13 rounded-2xl px-8 py-4 text-base font-bold",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
