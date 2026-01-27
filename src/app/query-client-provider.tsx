"use client";

import { queryClient } from "@/lib/client/query-client";
import { QueryClientProvider } from "@tanstack/react-query";

export function QueryClientProviderContext({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
