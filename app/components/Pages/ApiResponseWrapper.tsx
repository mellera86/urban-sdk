"use client";

import { Message } from "@components/Message";
import { Spinner } from "@components/Spinner";
import { FC, PropsWithChildren } from "react";

type ApiResponseWrapperProps = PropsWithChildren & {
  query?: any;
  errorMessage?: string;
  emptyMessage?: string;
};

const ApiResponseWrapper: FC<ApiResponseWrapperProps> = ({
  children,
  errorMessage,
  emptyMessage,
  query,
}) => {
  const { isPending, error, data } = query ?? {};

  if (isPending)
    return (
      <div className="absolute top-[10%] left-[50%]">
        <Spinner className="size-14" />
      </div>
    );

  if (error) {
    return <Message variant="error">{errorMessage ?? error}</Message>;
  }

  if (!data || data.length === 0) {
    return <Message>{emptyMessage}</Message>;
  }

  return children;
};

export { ApiResponseWrapper };
