import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

import Home from '@/pages/home';
import About from '@/pages/about';
import Contact from '@/pages/contact';
import Showroom from '@/pages/showroom';
import Trade from '@/pages/trade';
import Resources from '@/pages/resources';
import BrandsDirectory from '@/pages/brands/index';
import BrandDetail from '@/pages/brands/detail';
import ProductDetail from '@/pages/products/detail';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/showroom" component={Showroom} />
        <Route path="/trade" component={Trade} />
        <Route path="/resources" component={Resources} />
        <Route path="/brands" component={BrandsDirectory} />
        <Route path="/brands/:brandSlug" component={BrandDetail} />
        <Route path="/products/:slug" component={ProductDetail} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
