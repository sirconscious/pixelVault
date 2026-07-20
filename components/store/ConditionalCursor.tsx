"use client";

import { usePathname } from "next/navigation";
import TargetCursor from "@/components/ui/TargetCursor";

export default function ConditionalCursor() {
  const pathname = usePathname();
  if (pathname.startsWith("/product") || pathname.startsWith("/category")) return null;
  return <TargetCursor cursorColor="#7c3aed" cursorColorOnTarget="#a855f7" />;
}
