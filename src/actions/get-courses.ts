import { Category, Course } from "@prisma/client";
import { getProgress } from "./get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
    progress: number | null;
    chapters: { id: string }[];
    category: Category | null;
};

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
};

export const getCourses = async ({
    userId,
    title,
    categoryId,
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: title ? {
                    contains: title,
                } : undefined,
                categoryId : categoryId || undefined,
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    select: {
                        id: true,
                    },
                },
                purchases: {
                    where: {
                        userId: userId,
                    },
                    select: {
                        id: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const courseWithProgress: CourseWithProgressWithCategory[] =
            await Promise.all(
                courses.map(async (course) => {
                    if (course.purchases.length === 0) {
                        return {
                            ...course,
                            progress: null,
                        };
                    }

                    const progressPercentage = await getProgress(
                        userId,
                        course.id
                    );

                    return {
                        ...course,
                        progress: progressPercentage,
                    };
                })
            );

        return courseWithProgress;
    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
};
