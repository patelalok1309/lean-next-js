"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons";
import qs from "query-string";

interface CategoryItemsProps {
    label: string;
    value?: string;
    icon?: IconType;
}

export const CategoryItem = ({
    label,
    value,
    icon: Icon,
}: CategoryItemsProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentCategoryId = searchParams.get("categoryId");
    const currentTitle = searchParams.get("title");

    const isSelected = currentCategoryId === value;

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
               title : currentTitle,
               categoryId : isSelected ? null : value
            },
        }, { skipNull: true , skipEmptyString: true });

        router.push(url);
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "py-2 px-3 text-sm border border-slate-200 dark:border-slate-800 rounded-full flex items-center gap-x-1 hover:border-sky-700 dark:hover:border-sky-300 transition dark:text-white/80",
                isSelected && "dark:border-2 border-sky-700 dark:border-sky-500 bg-sky-200/20 dark:bg-sky-800/20 text-sky-800 dark:text-sky-200" ,
            )}
        >
            {Icon && <Icon size={20} />}
            <div className="truncate">{label}</div>
        </button>
    );
};
