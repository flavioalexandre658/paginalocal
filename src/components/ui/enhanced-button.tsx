import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { IconLoader2 } from "@tabler/icons-react"
import * as React from "react"

import { cn } from "@/lib/utils"

const enhancedButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        ametista: "bg-ametista-600 text-white shadow hover:bg-ametista-700",
        "ametista-outline": "border border-ametista-600 text-ametista-600 bg-transparent hover:bg-ametista-50",
        grafite: "bg-grafite-600 text-white shadow hover:bg-grafite-700",
        "grafite-outline": "border border-grafite-600 text-grafite-600 bg-transparent hover:bg-grafite-50",
        vermelho: "bg-vermelho-600 text-white shadow hover:bg-vermelho-700",
        "vermelho-outline": "border border-vermelho-600 text-vermelho-600 bg-transparent hover:bg-vermelho-50"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof enhancedButtonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    const isDisabled = disabled || loading

    return (
      <Comp
        className={cn(enhancedButtonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading ? (
          <>
            <IconLoader2 className="h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)
EnhancedButton.displayName = "EnhancedButton"

// Componente para ícone à esquerda
export const EnhancedButtonLeft = ({ children }: { children: React.ReactNode }) => {
  return <span className="mr-2 flex items-center">{children}</span>
}

// Componente para conteúdo principal
export const EnhancedButtonContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <span className={cn("flex items-center", className)}>{children}</span>
}

// Componente para ícone à direita
export const EnhancedButtonRight = ({ children }: { children: React.ReactNode }) => {
  return <span className="ml-2 flex items-center">{children}</span>
}

export { EnhancedButton, enhancedButtonVariants } 