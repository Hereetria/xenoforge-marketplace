"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

interface ThemedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "elevated" | "glass";
  size?: "sm" | "md" | "lg";
  hover?: boolean;
}

const ThemedCard = React.forwardRef<HTMLDivElement, ThemedCardProps>(
  (
    { className, variant = "default", size = "md", hover = false, ...props },
    ref
  ) => {
    const baseClasses = "rounded-lg border transition-all duration-200";

    const variantClasses = {
      default: "bg-[#2A2D3A] border-[#6B7280] text-white",
      outline: "bg-transparent border-[#6B7280] text-white",
      elevated: "bg-[#2A2D3A] border-[#6B7280] shadow-lg shadow-black/20",
      glass: "bg-[#2A2D3A]/80 border-[#6B7280]/50 backdrop-blur-sm text-white",
    };

    const sizeClasses = {
      sm: "p-3",
      md: "p-4 sm:p-6",
      lg: "p-6 sm:p-8",
    };

    const hoverClasses = hover
      ? "hover:border-[#F5B301]/50 hover:shadow-lg hover:shadow-[#F5B301]/10"
      : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          hoverClasses,
          className
        )}
        {...props}
      />
    );
  }
);
ThemedCard.displayName = "ThemedCard";

interface ThemedCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const ThemedCardHeader = React.forwardRef<HTMLDivElement, ThemedCardHeaderProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "p-3 pb-2",
      md: "p-4 sm:p-6 pb-2 sm:pb-3",
      lg: "p-6 sm:p-8 pb-3 sm:pb-4",
    };

    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5", sizeClasses[size], className)}
        {...props}
      />
    );
  }
);
ThemedCardHeader.displayName = "ThemedCardHeader";

interface ThemedCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: "sm" | "md" | "lg";
}

const ThemedCardTitle = React.forwardRef<HTMLHeadingElement, ThemedCardTitleProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "text-lg font-semibold",
      md: "text-xl font-bold",
      lg: "text-2xl font-bold",
    };

    return (
      <h3
        ref={ref}
        className={cn(
          "leading-none tracking-tight text-white",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
ThemedCardTitle.displayName = "ThemedCardTitle";

interface ThemedCardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: "sm" | "md" | "lg";
}

const ThemedCardDescription = React.forwardRef<
  HTMLParagraphElement,
  ThemedCardDescriptionProps
>(({ className, size = "md", ...props }, ref) => {
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <p
      ref={ref}
      className={cn("text-[#6B7280]", sizeClasses[size], className)}
      {...props}
    />
  );
});
ThemedCardDescription.displayName = "ThemedCardDescription";

interface ThemedCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const ThemedCardContent = React.forwardRef<HTMLDivElement, ThemedCardContentProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "p-3 pt-0",
      md: "p-4 sm:p-6 pt-0",
      lg: "p-6 sm:p-8 pt-0",
    };

    return <div ref={ref} className={cn(sizeClasses[size], className)} {...props} />;
  }
);
ThemedCardContent.displayName = "ThemedCardContent";

interface ThemedCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const ThemedCardFooter = React.forwardRef<HTMLDivElement, ThemedCardFooterProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "p-3 pt-0",
      md: "p-4 sm:p-6 pt-0",
      lg: "p-6 sm:p-8 pt-0",
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center", sizeClasses[size], className)}
        {...props}
      />
    );
  }
);
ThemedCardFooter.displayName = "ThemedCardFooter";

export {
  ThemedCard,
  ThemedCardHeader,
  ThemedCardTitle,
  ThemedCardDescription,
  ThemedCardContent,
  ThemedCardFooter,
};
