import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
    CircleDollarSignIcon,
    File,
    LayoutDashboard,
    ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { TitleForm } from "./_components/TitleForm";
import { DescriptionForm } from "./_components/DescriptionForm";
import { ImageForm } from "./_components/ImageForm";
import { CategoryForm } from "./_components/CategoryForm";
import { PriceForm } from "./_components/PriceForm";
import { AttachmentForm } from "./_components/AttachmentForm";
import { ChapterForm } from "./_components/ChapterForm";
import { Banner } from "@/components/banner";
import { Actions } from "./_components/Actions";

async function CourseIdPage({ params }: { params: { courseId: string } }) {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId,
            userId: userId,
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc",
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    if (!course) {
        return redirect("/");
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some((chapter) => chapter.isPublished),
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length; // filters out field contains null , undefined and falsy values

    const completionText = `(${completedFields}/${totalFields})`;

    const isCompleted = requiredFields.every(Boolean);

    return (
        <>
            {!course.isPublished && (
                <Banner
                    variant={"warning"}
                    label={
                        "Course is not published. It will be not be visible to students."
                    }
                />
            )}
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium"> Course setup </h1>
                        <span className="text-sm text-slate-700 dark:text-white">
                            Complete all fields {completionText}
                        </span>
                        {!course.chapters.some((chapter) => chapter.isPublished) && (
                            <span className="text-xs text-muted-foreground">
                            Note : You need atleast one chapter
                            published to publish the course
                        </span>
                        )}
                    </div>
                    <Actions
                        disabled={!isCompleted}
                        courseId={course.id}
                        isPublished={course.isPublished}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className="text-xl font-semibold">
                                Customize your course
                            </h2>
                        </div>
                        <TitleForm initialData={course} courseId={course.id} />
                        <DescriptionForm
                            initialData={course}
                            courseId={course.id}
                        />
                        <ImageForm initialData={course} courseId={course.id} />
                        <CategoryForm
                            initialData={course}
                            courseId={course.id}
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id,
                            }))}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className="text-xl">Course chapters</h2>
                            </div>
                            <ChapterForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CircleDollarSignIcon} />
                                <h2 className="text-xl">Sell your course</h2>
                            </div>
                            <PriceForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} />
                                <h2 className="text-xl">
                                    Resources & Attachments
                                </h2>
                            </div>
                            <AttachmentForm
                                initialData={course}
                                courseId={course.id}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseIdPage;
