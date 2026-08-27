import { ClerkProvider, SignIn, useAuth, useClerk, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { shadcn } from '@clerk/themes';
import { Redirect, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { type ReactNode, useEffect, useState } from 'react';
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
import Catalog from '@/pages/catalog/index';
import ContentWorkspace from '@/pages/content/index';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#c41a1a',
    colorForeground: '#1a1212',
    colorMutedForeground: '#3d2828',
    colorDanger: '#c41a1a',
    colorBackground: '#ffffff',
    colorInput: '#ffffff',
    colorInputForeground: '#1a1212',
    colorNeutral: '#e8dbdb',
    fontFamily: 'DM Sans, sans-serif',
    borderRadius: '0px',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox: 'bg-white rounded-none w-[440px] max-w-full overflow-hidden border border-border',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: 'font-serif text-foreground',
    headerSubtitle: 'text-muted-foreground',
    formFieldLabel: 'text-foreground',
    footerActionText: 'text-muted-foreground',
    footerActionLink: 'text-primary',
    dividerText: 'text-muted-foreground',
    formButtonPrimary: 'bg-primary text-primary-foreground rounded-none',
    formFieldInput: 'rounded-none border-border text-foreground',
  },
};

function SignInPage() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
      <SignIn routing="path" path={`${basePath}/sign-in`} />
    </div>
  );
}

function ContentRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const [access, setAccess] = useState<'checking' | 'allowed' | 'denied'>('checking');

  useEffect(() => {
    if (!isSignedIn) return;
    void fetch('/api/content/access', { credentials: 'include' })
      .then((response) => setAccess(response.ok ? 'allowed' : 'denied'))
      .catch(() => setAccess('denied'));
  }, [isSignedIn]);

  if (!isLoaded || (isSignedIn && access === 'checking')) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!isSignedIn) {
    return <Redirect to="/sign-in" />;
  }

  if (access !== 'allowed') {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background px-4">
        <div className="max-w-lg border border-border bg-card p-8 text-center">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Access restricted</p>
          <h1 className="mb-3 font-serif text-3xl">Staff workspace only</h1>
          <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
            Your account is signed in but has not been approved to manage catalogue content.
          </p>
          <p className="mb-6 break-all border border-border bg-accent/20 p-3 font-mono text-xs text-foreground">
            {user?.id}
          </p>
          <p className="mb-6 text-xs leading-relaxed text-muted-foreground">
            An administrator can add this Clerk user ID to the CONTENT_STAFF_USER_IDS environment variable.
          </p>
          <button
            type="button"
            className="text-xs font-bold uppercase tracking-widest text-primary hover:text-foreground"
            onClick={() => signOut({ redirectUrl: basePath || '/' })}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <ContentWorkspace />
  );
}

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
        <Route path="/catalog" component={Catalog} />
        <Route path="/brands" component={BrandsDirectory} />
        <Route path="/brands/:brandSlug" component={BrandDetail} />
        <Route path="/products/:slug" component={ProductDetail} />
        <Route path="/content" component={ContentRoute} />
        <Route path="/sign-in/*?" component={SignInPage} />
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
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
