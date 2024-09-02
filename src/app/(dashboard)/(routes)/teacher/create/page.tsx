"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ControllerFieldState,
    ControllerRenderProps,
    useForm,
    UseFormStateReturn,
} from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { title } from "process";
import { ReactElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
});

function CreatePage() {
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        },
    });
    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            console.log(response)
            router.push(`/teacher/courses/${response.data.id}`);
            toast.success("Course Created")
        } catch (error : any) {
            toast.error("Something went wrong")
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Name Your Course</h1>
                <p className="text-sm text-slate-600">
                    What would you like to name your course? Don't worry , You
                    can change it after{" "}
                </p>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 mt-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="e.g. 'Advanced web development'"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            What will you teach in this course?
                                        </FormDescription>
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-x-2">
                            <Link href="/">
                                <Button variant={"ghost"} type="button">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                            >
                                Continue
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}

export default CreatePage;
