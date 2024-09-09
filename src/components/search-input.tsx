"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDeboune } from "@/Hooks/use-debounce";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import qs from "query-string";

export const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDeboune(value);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const url = qs.stringifyUrl(
            {
                url: pathname,
                query: {
                    title: debouncedValue,
                    categoryId: currentCategoryId,
                },
            },
            { skipNull: true, skipEmptyString: true }
        );
        router.push(url);
    }, [debouncedValue, currentCategoryId, router, pathname]);

    return (
        <div className="relative">
            <SearchIcon className="h-4 w-4 absolute top-3 left-3 text-slate-600 dark:text-white/80" />
            <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 text-black dark:text-white dark:focus-visible:ring-slate-800 dark:bg-slate-900 focus-visible:ring-slate-200 dark:placeholder:text-white/80"
                placeholder="Search for a course..."
            />
        </div>
    );
};
