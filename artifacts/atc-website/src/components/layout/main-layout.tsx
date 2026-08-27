import { ReactNode } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export function MainLayout({
  children,
  immersiveHeader = false,
}: {
  children: ReactNode;
  immersiveHeader?: boolean;
}) {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full bg-background text-foreground selection:bg-primary/20">
      <Navbar overlay={immersiveHeader} />
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
