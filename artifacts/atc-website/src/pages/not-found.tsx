import { Link } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <h1 className="text-3xl font-display mb-4">Page not found</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          This page has moved or no longer exists. Search for a product, or start from the homepage.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/catalog" data-testid="link-not-found-search">Search products</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/" data-testid="link-not-found-home">Go to homepage</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
