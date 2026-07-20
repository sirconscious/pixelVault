"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

export default function StoreError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <TriangleAlert className="size-12 text-warning" />
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="max-w-md opacity-70">
        An unexpected error occurred while loading this page.
      </p>
      <button className="btn btn-primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
