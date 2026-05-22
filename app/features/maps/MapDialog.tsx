"use client";

import { useMapsDataQuery } from "@api-hooks/maps";
import { Dialog, DialogContent, DialogTrigger } from "@components/Dialog";
import { FC, PropsWithChildren, useState } from "react";
import MapDataVisualization from "./MapDataVisualization";

type MapDialogProps = PropsWithChildren & {
  dataUrl: string;
  configUrl: string;
};

const MapDialog: FC<MapDialogProps> = ({ children, configUrl, dataUrl }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { data } = useMapsDataQuery({ variables: { url: dataUrl } });

  if (!configUrl || !dataUrl) {
    return <>{children}</>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="cursor-pointer">{children}</DialogTrigger>
      <DialogContent>
        <MapDataVisualization geoJsonData={data} />
      </DialogContent>
    </Dialog>
  );
};

export { MapDialog };
