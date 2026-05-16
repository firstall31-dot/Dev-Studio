import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";

import { NotFoundComponent, ErrorComponent } from "@/components/layout";
import { AuthGate } from "@/components/auth/auth-gate";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
      <Toaster
        richColors
        position="top-right"
        closeButton
        expand={false}
        visibleToasts={5}
        toastOptions={{ duration: 4000 }}
      />
    </QueryClientProvider>
  );
}
