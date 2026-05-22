"use client";

import { Badge } from "@components/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardMedia,
  CardTitle,
  CardTitleRow,
} from "@components/Card";
import { Map } from "@models/maps";
import Image from "next/image";
import dynamic from "next/dynamic";

const MapDialog = dynamic(
  () => import("./MapDialog").then((mod) => mod.MapDialog),
  { ssr: false },
);

const MapCard = ({ map }: { map: Map }) => {
  if (!map) return null;

  const { label, subLabel, imageUrl, description, dataUrl, configUrl } = map;

  return (
    <Card variant="media" className="relative">
      <MapDialog
        dataUrl={dataUrl}
        configUrl={configUrl}
        title={label}
        description={description}
      >
        <CardMedia>
          <Image
            src={imageUrl}
            alt={label}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </CardMedia>
      </MapDialog>
      <Badge variant="source" className="absolute top-2 right-2">
        {subLabel}
      </Badge>
      <CardHeader>
        <CardTitleRow>
          <CardTitle>{label}</CardTitle>
        </CardTitleRow>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export { MapCard };
