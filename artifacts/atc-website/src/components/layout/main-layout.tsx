import { ReactNode } from "react";
import { SmartSearch } from "@/components/search/smart-search";
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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-primary focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:uppercase focus:tracking-widest focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navbar overlay={immersiveHeader} />
      <SmartSearch />
      <main id="main-content" className="flex-1 w-full flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
