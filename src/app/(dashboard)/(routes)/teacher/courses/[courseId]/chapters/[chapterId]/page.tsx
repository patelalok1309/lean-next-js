import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_components/ChapterTitleForm";
import { ChapterDescriptionForm } from "./_components/ChapterDescriptionForm";
import { ChapterAccessForm } from "./_components/ChapterAccessForm";
import { ChapterVideoForm } from "./_components/ChapterVideoForm";
import { Banner } from "@/components/banner";
import { ChapterActions } from "./_components/ChapterActions";

const ChapterIdPage = async ({
    params,
}: {
    params: { courseId: string; chapterId: string };
}) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
        },
        include: {
            muxData: true,
        },
    });

    if (!chapter) {
        return redirect("/");
    }

    const requriedFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];

    const totalFields = requriedFields.length;
    const completedFields = requriedFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;

    const isCompleted = requriedFields.every(Boolean);

    return (
        <>
            {!chapter.isPublished && (
                <Banner
                    label="This chapter is not published. It will be not visible in the course!"
                    variant={"warning"}
                />
            )}

            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link
                            href={`/teacher/courses/${params.courseId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to course setup
                        </Link>
                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">
                                    Chapter creation
                                </h1>
                                <span className="text-sm text-slate-700 dark:text-white">
                                    Complete all fields {completionText}
                                </span>
                            </div>
                            <ChapterActions 
                                disabled={!isCompleted}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                                isPublished={chapter.isPublished}
                            />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={LayoutDashboard} />
                                <h2 className="text-xl">
                                    Customize your chapter
                                </h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                chapterId={params.chapterId}
                                courseId={params.courseId}
                            />
                            <ChapterDescriptionForm
                                initialData={chapter}
                                chapterId={params.chapterId}
                                courseId={params.courseId}
                            />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Eye} />
                                <h2 className="text-xl">Access settings</h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={params.courseId}
                                chapterId={params.chapterId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl">Add a video</h2>
                        </div>
                        <ChapterVideoForm
                            initialData={chapter}
                            courseId={params.courseId}
                            chapterId={params.chapterId}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChapterIdPage;
