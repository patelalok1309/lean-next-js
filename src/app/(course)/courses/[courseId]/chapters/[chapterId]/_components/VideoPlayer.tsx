"use client";

import { useConfettiStore } from "@/Hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
    playbackId?: string;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    title: string;
    isLocked: boolean;
    completeOnEnd: boolean;
}

export const VideoPlayer = ({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    title,
    isLocked,
    completeOnEnd,
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary text-white" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8 dark:text-white" />
                    <p className="text-sm dark:text-white">
                        This Chapter is Locked
                    </p>
                </div>
            )}
            {!isLocked && (
                <MuxPlayer
                    title={title}
                    playbackId={playbackId}
                    className={cn(!isReady && "hidden")}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={() => {}}
                    autoPlay
                />
            )}
        </div>
    );
};
