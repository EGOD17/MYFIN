
import { LoadingLink } from "@/components/ui/loading-link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { TransactionTicker } from "@/components/transaction-ticker";
import { CheckCircle } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-7xl items-center justify-between px-4">
          <Logo />
          <LoadingLink href="/">
            <Button variant="ghost">Logout</Button>
          </LoadingLink>
        </div>
      </header>
      <TransactionTicker />
      <main className="flex-1">
        <div className="container max-w-7xl px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
