import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@utils/styles";

const cardVariants = cva(
  "group/card flex flex-col text-sm text-card-foreground",
  {
    variants: {
      variant: {
        default:
          "gap-4 overflow-hidden rounded-xl bg-card py-4 ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        media:
          "gap-0 overflow-hidden rounded-2xl border border-border/60 bg-card-elevated shadow-md shadow-foreground/5 transition-shadow duration-300 hover:shadow-lg hover:shadow-foreground/10 has-data-[slot=card-media]:pt-0",
      },
      size: {
        default: "",
        sm: "data-[size=sm]:gap-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Card({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-variant={variant}
      data-size={size}
      className={cn(cardVariants({ variant, size }), className)}
      {...props}
    />
  );
}

function CardMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-media"
      className={cn(
        "relative aspect-video w-full overflow-hidden bg-muted",
        className,
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 px-4 group-data-[size=sm]/card:px-3",
        "group-data-[variant=media]/card:px-5 group-data-[variant=media]/card:pt-5 group-data-[variant=media]/card:pb-0",
        "rounded-t-xl has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] has-data-[slot=card-title-row]:gap-0 [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className,
      )}
      {...props}
    />
  );
}

function CardTitleRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title-row"
      className={cn("flex items-start justify-between gap-3", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "min-w-0 flex-1 font-sans text-base leading-snug font-semibold tracking-tight text-foreground",
        "group-data-[size=sm]/card:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-sm leading-relaxed text-muted-foreground",
        "group-data-[variant=media]/card:text-[0.8125rem] group-data-[variant=media]/card:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-4 group-data-[size=sm]/card:px-3",
        "group-data-[variant=media]/card:px-5 group-data-[variant=media]/card:pt-3 group-data-[variant=media]/card:pb-5",
        className,
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardMedia,
  CardHeader,
  CardTitleRow,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
};
