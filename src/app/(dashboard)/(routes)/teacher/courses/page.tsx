import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PlusCircle } from "lucide-react";

async function page() {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const courses = await db.course.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <>
            <div className="p-6 w-full flex justify-end ">
                <Link href={"/teacher/create"}>
                    <Button variant={"default"} >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        New Course
                    </Button>
                </Link>
            </div>
            <div className="container mx-auto py-8">
                <DataTable columns={columns} data={courses} />
            </div>
        </>
    );
}

export default page;
