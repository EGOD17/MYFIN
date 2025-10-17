
import { cn } from "@/lib/utils";

const MyFinLogoIcon = ({ className }: { className?: string }) => (
  <svg
    width="100"
    height="100"
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("logo-splash", className)}
  >
    <defs>
      <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--accent))" />
      </linearGradient>
    </defs>
    <g transform="scale(1.2) translate(-8, -8)">
      <path
        d="M20 80 L35 50 L50 65 L65 35 L80 65 L80 80 L20 80 Z"
        fill="url(#gradGreen)"
        fillOpacity="0.4"
      />
      <path
        className="logo-splash__line"
        d="M20 65 L35 35 L50 50 L65 20 L80 50"
        fill="none"
        stroke="url(#gradGreen)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);


export function SplashScreen() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
      <div className="rounded-2xl bg-transparent p-4">
        <MyFinLogoIcon className="h-24 w-24" />
      </div>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground animate-pulse">
        My Fin NG
      </h1>
    </div>
  );
}
