import MapsPage from "@features/maps/MapsPage";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense>
      <MapsPage />
    </Suspense>
  );
}
