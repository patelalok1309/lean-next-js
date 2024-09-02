import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
            {success : true , message : "Course updated successfully"},
            {status : 200}
        )
    } catch (error) {
        console.log("[COURSES UPDATE]", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
