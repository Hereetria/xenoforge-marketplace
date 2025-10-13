import Footer from "@/components/layout/footer/Footer";
import DiscountAlert from "./_components/DiscountAlert";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DiscountAlert />
      <main className="flex flex-1 min-h-[calc(100vh-4rem)]">
        <div className="flex-1">{children}</div>
      </main>
      <Footer />
    </>
  );
}
