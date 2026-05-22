"use client";

import { Button } from "@components/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/Card";
import { FC } from "react";

type ErrorFallbackProps = {
  onReset?: () => void;
};

const ErrorFallback: FC<ErrorFallbackProps> = ({ onReset }) => {
  return (
    <div className="flex min-h-[50vh] flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We hit an unexpected problem while loading this page. Please try
            again, or come back a little later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {onReset ? (
            <Button type="button" onClick={onReset}>
              Try again
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export { ErrorFallback };
