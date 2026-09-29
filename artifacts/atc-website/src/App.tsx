import { Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import { lazy, Suspense, useLayoutEffect, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkRoot } from "@/components/auth/clerk-root";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { publicEnv } from "@/lib/env";

const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const Showroom = lazy(() => import("@/pages/showroom"));
const ShowroomDetail = lazy(() => import("@/pages/showroom-detail"));
const NewAbout = lazy(() => import("@/pages/new-about"));
const Resources = lazy(() => import("@/pages/resources"));
const Catalogues = lazy(() => import("@/pages/catalogues"));
const CatalogueDetail = lazy(() => import("@/pages/catalogues/detail"));
const Projects = lazy(() => import("@/pages/projects/index"));
const ProjectDetail = lazy(() => import("@/pages/projects/detail"));
const BrandsDirectory = lazy(() => import("@/pages/brands/index"));
const BrandDetail = lazy(() => import("@/pages/brands/detail"));
const BrandDesigner = lazy(() => import("@/pages/brands/designer"));
const ProductDetail = lazy(() => import("@/pages/products/detail"));
const Catalog = lazy(() => import("@/pages/catalog/index"));
const Lists = lazy(() => import("@/pages/lists"));
const ContentRoute = lazy(() => import("@/pages/content/route"));
const SignInPage = lazy(() => import("@/pages/sign-in"));
const AccountPage = lazy(() => import("@/pages/account/index"));
const AccountAuthEntryPage = lazy(() => import("@/pages/account/auth-entry"));
const AccountWelcomePage = lazy(() => import("@/pages/account/welcome"));
const AccountProfilePage = lazy(() => import("@/pages/account/profile"));
const AccountInquiriesPage = lazy(() => import("@/pages/account/inquiries"));
const AccountSettingsPage = lazy(() => import("@/pages/account/settings"));
const AccountSecurityPage = lazy(() => import("@/pages/account/security"));
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

function ScrollToTop() {
  const [location] = useLocation();
  const path = location.split("?")[0];

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, [path]);

  return null;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/new-about" component={NewAbout} />
          <Route path="/contact" component={Contact} />
          <Route path="/showroom" component={Showroom} />
          <Route path="/showroom/:slug" component={ShowroomDetail} />
          <Route path="/resources" component={Resources} />
          <Route path="/catalogues/:id" component={CatalogueDetail} />
          <Route path="/catalogues" component={Catalogues} />
          <Route path="/projects" component={Projects} />
          <Route path="/projects/:slug" component={ProjectDetail} />
          <Route path="/catalog" component={Catalog} />
          <Route path="/lists" component={Lists} />
          <Route path="/brands" component={BrandsDirectory} />
          <Route path="/brands/:brandSlug/designers/:designerSlug" component={BrandDesigner} />
          <Route path="/brands/:brandSlug" component={BrandDetail} />
          <Route path="/products/:slug" component={ProductDetail} />
          <Route path="/content" component={ContentRoute} />
          <Route path="/account/sign-in/*?" component={AccountAuthEntryPage} />
          <Route path="/account/sign-up/*?" component={AccountAuthEntryPage} />
          <Route path="/account/forgot-password" component={AccountAuthEntryPage} />
          <Route path="/account/reset-password" component={AccountAuthEntryPage} />
          <Route path="/account/welcome" component={AccountWelcomePage} />
          <Route path="/account/profile" component={AccountProfilePage} />
          <Route path="/account/inquiries" component={AccountInquiriesPage} />
          <Route path="/account/settings" component={AccountSettingsPage} />
          <Route path="/account/security" component={AccountSecurityPage} />
          <Route path="/account" component={AccountPage} />
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
        <ClerkRoot>
          <TooltipProvider>
            <Router />
            <Toaster />
          </TooltipProvider>
        </ClerkRoot>
      </QueryClientProvider>
    </WouterRouter>
  );
}

export default App;
