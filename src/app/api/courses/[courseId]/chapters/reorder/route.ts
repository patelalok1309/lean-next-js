import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { list } = await req.json();
        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
        });

        for (let item of list) {
            await db.chapter.update({
                where: { id: item.id },
                data: { position: item.position },
            });
        }

        return NextResponse.json(
            { success: true, message: "Chapters reordered" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
