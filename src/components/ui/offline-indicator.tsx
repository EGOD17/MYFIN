
"use client";

import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  return (
    <div className="fixed inset-0 z-[101] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full border border-dashed border-muted-foreground/50 bg-muted/50 p-6">
            <WifiOff className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">No Internet Connection</h2>
            <p className="text-muted-foreground">
                Please check your connection and try again.
            </p>
        </div>
      </div>
    </div>
  );
}
