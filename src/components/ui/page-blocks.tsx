import { cn } from "@/lib/utils";

export function ContentSection({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("rounded-xl border bg-card p-3 sm:p-6 shadow-sm", className)}>
            {children}
        </div>
    );
}

export function ContentSectionHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("mb-2 sm:mb-4", className)}>
            {children}
        </div>
    );
}

export function ContentSectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h2 className={cn("text-lg font-semibold", className)}>
            {children}
        </h2>
    );
}

export function EmptyState({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={cn("flex h-80 items-center justify-center rounded-lg bg-muted/30 text-muted-foreground", className)}>
            {children}
        </div>
    );
}
