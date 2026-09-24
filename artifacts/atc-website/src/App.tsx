import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import { lazy, Suspense, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { publicEnv } from "@/lib/env";

const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Showroom = lazy(() => import("@/pages/showroom"));
const Resources = lazy(() => import("@/pages/resources"));
const BrandsDirectory = lazy(() => import("@/pages/brands/index"));
const BrandDetail = lazy(() => import("@/pages/brands/detail"));
const ProductDetail = lazy(() => import("@/pages/products/detail"));
const Catalog = lazy(() => import("@/pages/catalog/index"));
const Lists = lazy(() => import("@/pages/lists"));
const ContentRoute = lazy(() => import("@/pages/content/route"));
const SignInPage = lazy(() => import("@/pages/sign-in"));
const NotFound = lazy(() => import("@/pages/not-found"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const basePath = publicEnv.baseUrl.replace(/\/$/, "");

function RouteFallback() {
  return <div className="min-h-[50vh] bg-background" aria-busy="true" aria-live="polite" />;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Suspense fallback={<RouteFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/showroom" component={Showroom} />
          <Route path="/resources" component={Resources} />
          <Route path="/catalog" component={Catalog} />
          <Route path="/lists" component={Lists} />
          <Route path="/brands" component={BrandsDirectory} />
          <Route path="/brands/:brandSlug" component={BrandDetail} />
          <Route path="/products/:slug" component={ProductDetail} />
          <Route path="/content" component={ContentRoute} />
          <Route path="/sign-in/*?" component={SignInPage} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </WouterRouter>
  );
}

export default App;
