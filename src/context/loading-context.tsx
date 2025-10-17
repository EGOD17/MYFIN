
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // When navigation completes, set loading to false.
        setIsLoading(false);
    }, [pathname, searchParams]);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (context === undefined) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
}
