import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();
        const {isPublished , ...values} = await req.json();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const ownCourse = await db.course.findUnique({
            where: { id: params.courseId, userId },
        });

        if(!ownCourse){
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const chapter = await db.chapter.update({
            where : {
                id : params.chapterId,
                courseId : params.courseId
            },
            data : {
                ...values
            }
        })

        // TODO : Handle video uploads here

        return NextResponse.json(
            { success: true, message: "Chapter Updated", chapter },
            { status: 200 }
        )

    } catch (error) {
        console.log("[COURSES_CHAPTERID]", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
