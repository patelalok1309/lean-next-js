import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import Mux from "@mux/mux-node";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const { video: Video } = mux;

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId,
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

        for (const chapter of course.chapters) {
            if (chapter?.muxData?.assetId) {
                await Video.assets.delete(chapter.muxData.assetId);
            }
        }

        const DeletedCourse = await db.course.delete({
            where: {
                id: params.courseId,
            },
        });

        return NextResponse.json(
            { success: true, message: "Course deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log("[COURSES DELETE]", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const course = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                ...values,
            },
        });

        return NextResponse.json(
            { success: true, message: "Course updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.log("[COURSES UPDATE]", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
