"use client";

import { Category } from "@prisma/client";

import {
    FcEngineering,
    FcFilmReel,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode,
} from "react-icons/fc";
import { IconType } from "react-icons";
import { CategoryItem } from "./CategoryItem";

interface CategoryProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Computer Science": FcMultipleDevices,
    Music: FcMusic,
    Fitness: FcSportsMode,
    Photography: FcOldTimeCamera,
    Accounting: FcSalesPerformance,
    Engineering: FcEngineering,
    Filming: FcFilmReel,
};

export const Categories = ({ items }: CategoryProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    label={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    );
};
