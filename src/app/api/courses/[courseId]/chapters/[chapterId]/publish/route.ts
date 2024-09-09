import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!ownCourse) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
        });

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId,
            },
        });

        if (
            !muxData ||
            !chapter?.title ||
            !chapter?.description ||
            !chapter?.videoUrl
        ) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        const publishedChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(
            { success: true, message: "Chapter published", publishedChapter },
            { status: 200 }
        );
    } catch (error) {
        console.log("[CHAPTER_PUBLISH]", error);
        return NextResponse.json(
            { success: false, message: "Something went wrong" },
            { status: 500 }
        );
    }
}
