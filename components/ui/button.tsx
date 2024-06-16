import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-150 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-orange-400 text-primary-foreground hover:bg-orange-500 focus:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:bg-destructive/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:border-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:bg-secondary/70",
        ghost:
          "bg-transparent hover:bg-accent hover:text-accent-foreground focus:bg-accent/20",
        link: "text-primary underline-offset-4 hover:underline focus:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 py-1.5",
        lg: "h-11 px-8 py-3",
        icon: "h-10 w-10 p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const finalClassName = cn(buttonVariants({ variant, size, className }), {
      loading: loading,
    });

    return (
      <Comp
        className={finalClassName}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <span>Loading...</span> : props.children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
