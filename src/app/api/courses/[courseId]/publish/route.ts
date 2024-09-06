import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
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


        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });

        if (!course) {
            return NextResponse.json(
                { success: false, message: "Course not found" },
                { status: 404 }
            );
        }

        const hashPublishedChapter = course.chapters.some(
            (chapter) => chapter?.isPublished
        );

        if (
            !course.title ||
            !course.description ||
            !course.imageUrl ||
            !course.categoryId ||
            !hashPublishedChapter
        ) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 401 }
            );
        }

        const publishedCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: "Course published",
                data: publishedCourse,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("[COURSE_ID_PUBLISH]", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
