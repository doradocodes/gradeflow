import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

interface BreadcrumbItem {
    label: ReactNode;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav className={cx("flex items-center gap-1  text-gray-500", className)}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                return (
                    <span key={index} className="flex items-center gap-1">
                        {index > 0 && <span className="text-gray-400">&rsaquo;</span>}
                        <span className={cx(isLast ? "font-medium text-gray-900" : "text-gray-500")}>
                            {item.label}
                        </span>
                    </span>
                );
            })}
        </nav>
    );
}
