import type { PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Toaster } from "react-hot-toast";

export function AppLayout({ children }: PropsWithChildren) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <main
        className={
          isHome ? "flex-1" : "mx-auto max-w-7xl px-4 py-6 flex-1 w-full"
        }
      >
        {children}
      </main>
    </div>
  );
}
