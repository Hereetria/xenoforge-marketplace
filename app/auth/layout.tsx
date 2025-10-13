import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex flex-1 min-h-[calc(100vh-4rem)]">
        <div className="flex-1">{children}</div>
      </main>
    </>
  );
}
