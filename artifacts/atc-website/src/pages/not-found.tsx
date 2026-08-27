import { Link } from "wouter";
import { MainLayout } from "@/components/layout/main-layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[60vh]">
        <h1 className="text-6xl font-serif text-primary mb-4 tracking-wider">404</h1>
        <h2 className="text-2xl font-serif mb-4">Page not found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </MainLayout>
  );
}
