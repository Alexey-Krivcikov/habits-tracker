import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: 0 }, mutations: { retry: 0 } } })}
    >
      {children}
    </QueryClientProvider>
  );
}
