"use client";

import { useMapsConfigQuery, useMapsDataQuery } from "@api-hooks/maps";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/Dialog";
import { Message } from "@components/Message";
import { Spinner } from "@components/Spinner";
import dynamic from "next/dynamic";
import { FC, PropsWithChildren, useEffect, useState } from "react";

const MapDataVisualization = dynamic(() => import("./MapDataVisualization"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(60vh,600px)] items-center justify-center">
      <Spinner className="size-10" />
    </div>
  ),
});

type MapDialogProps = PropsWithChildren & {
  dataUrl: string;
  configUrl: string;
  title?: string;
  description?: string;
};

const MapDialog: FC<MapDialogProps> = ({
  children,
  configUrl,
  dataUrl,
  title,
  description,
}) => {
  const [open, setOpen] = useState(false);

  const {
    data,
    isPending: isDataPending,
    error: dataError,
  } = useMapsDataQuery({
    variables: { url: dataUrl },
    options: { enabled: open && !!dataUrl },
  });

  const {
    data: mapConfig,
    isPending: isConfigPending,
    error: configError,
  } = useMapsConfigQuery({
    variables: { url: configUrl },
    options: { enabled: open && !!configUrl },
  });

  const isPending = isDataPending || isConfigPending;
  const error = dataError ?? configError;

  if (!configUrl || !dataUrl) {
    return <>{children}</>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <DialogContent className="flex w-[min(96vw,960px)] max-w-none flex-col gap-4 sm:max-w-none">
        <DialogHeader>
          {title ? <DialogTitle>{title}</DialogTitle> : null}
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {isPending && (
          <div className="flex h-[min(60vh,600px)] items-center justify-center">
            <Spinner className="size-10" />
          </div>
        )}

        {error && !isPending && (
          <Message variant="error">
            Failed to load map data. Please try again.
          </Message>
        )}

        {open && data && mapConfig && !isPending && !error && (
          <MapDataVisualization geoJsonData={data} mapConfig={mapConfig} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export { MapDialog };
