import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

const { video: Video } = mux;

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } }
) {
    try {
        const { userId } = auth();
        const { isPublished, ...values } = await req.json();

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const ownCourse = await db.course.findUnique({
            where: { id: params.courseId, userId },
        });

        if (!ownCourse) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId,
            },
            data: {
                ...values,
            },
        });

        // TODO : Handle video uploads here

        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: chapter.id,
                },
            });

            if (existingMuxData) {
                await Video.assets.delete(existingMuxData.assetId);
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id,
                    },
                });
            }

            const asset = await Video.assets.create({
                input: values.videoUrl,
                playback_policy : ["public"],
                test : false
            });

            await db.muxData.create({
                data : {
                    chapterId : params.chapterId,
                    assetId : asset.id,
                    playbackId : asset.playback_ids?.[0]?.id!,
                }
            })
        }

        return NextResponse.json(
            { success: true, message: "Chapter Updated", chapter },
            { status: 200 }
        );
    } catch (error) {
        console.log("[COURSES_CHAPTERID]", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
