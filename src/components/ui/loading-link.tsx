
"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/loading-context";
import React, { forwardRef, MouseEvent } from "react";

type LoadingLinkProps = LinkProps & React.HTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode;
};

export const LoadingLink = forwardRef<HTMLAnchorElement, LoadingLinkProps>(({ href, onClick, children, ...props }, ref) => {
    const router = useRouter();
    const { setIsLoading } = useLoading();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (onClick) onClick(e);

        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
            return;
        }

        e.preventDefault();
        setIsLoading(true);
        router.push(href.toString());
    };

    return (
        <Link href={href} onClick={handleClick} ref={ref} {...props}>
            {children}
        </Link>
    );
});

LoadingLink.displayName = "LoadingLink";
