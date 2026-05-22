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

const MapCard = ({ map }: { map: Map }) => {
  if (!map) return null;

  const { label, subLabel, imageUrl, description } = map;

  return (
    <Card variant="media" className="relative">
      <CardMedia>
        <Image
          src={imageUrl}
          alt={label}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </CardMedia>
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
