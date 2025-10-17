
"use client";

import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { useEffect, useState } from 'react';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { LoadingProvider, useLoading } from '@/context/loading-context';
import { SplashScreen } from '@/components/splash-screen';

// This is a client component, but we can still export metadata
// export const metadata: Metadata = {
//   title: 'My Fin NG',
//   description: 'Secure financial access',
// };

function AppContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useLoading();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // All browser-specific logic should be inside useEffect
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  return (
    <>
        {!isOnline && <OfflineIndicator />}
        {isLoading && <SplashScreen />}
        <div className="flex-grow">{children}</div>
        <Toaster />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <head>
        <title>My Fin NG</title>
        <meta name="description" content="Secure financial access" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        {!isClient ? (
          <SplashScreen />
        ) : (
          <LoadingProvider>
            <AppContent>{children}</AppContent>
          </LoadingProvider>
        )}
      </body>
    </html>
  );
}
