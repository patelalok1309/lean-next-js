import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React from "react";
import { Sidebar } from "./sidebar";

function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition dark:text-white">
                <Menu className="dark:text-white"/>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-white">
                <SheetTitle></SheetTitle>
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}

export default MobileSidebar;
