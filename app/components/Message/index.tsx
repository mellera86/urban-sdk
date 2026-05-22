"use client";

import { Card, CardContent } from "@components/Card";
import { cn } from "@utils/styles";
import { FC, PropsWithChildren } from "react";

type VariantType = "error" | "info";

type MessageProps = PropsWithChildren & {
  variant?: VariantType;
};

const variantColorMap: Record<VariantType, string> = {
  error: "text-destructive",
  info: "text-primary",
};

const Message: FC<MessageProps> = ({ children, variant = "info" }) => {
  return (
    <Card className={cn("mx-auto mt-10", variantColorMap[variant])}>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export { Message };
