import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();

        const { title } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
            },
        });

        if (!courseOwner) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: params.courseId,
            },
            orderBy: {
                position: "desc",
            },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: params.courseId,
                position: newPosition,
            },
        });

        return NextResponse.json(
            { success: true, data: chapter },
            { status: 200 }
        );
    } catch (error) {
        console.log("[CHAPTERS]", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
