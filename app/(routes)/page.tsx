import MapsPage from "@features/maps/MapsPage";
import { Spinner } from "@components/Spinner";
import { Suspense } from "react";

function MapsPageFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="sr-only">Loading maps</p>
      <Spinner className="size-10" />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<MapsPageFallback />}>
      <MapsPage />
    </Suspense>
  );
}
