import Link from "next/link";
import { PackageX } from "lucide-react";

export default function StoreNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <PackageX className="size-12 text-primary" />
      <h1 className="text-3xl font-bold">Not found</h1>
      <p className="max-w-md opacity-70">
        We couldn&apos;t find what you were looking for. It may have been
        removed or is no longer available.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to store
      </Link>
    </div>
  );
}
