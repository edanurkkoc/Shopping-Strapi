"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Gerekli bileşenlerin import edilmesi
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form"; // Gerekli dosya yolunu belirtin
import { Input } from "@/components/ui/input"; // Gerekli dosya yolunu belirtin
import { Button } from "@/components/ui/button"; // Gerekli dosya yolunu belirtin
import { Label } from "@/components/ui/label";
import Link from "next/link";
import useAuthStore from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { startSession } from "@/lib/sessions";
import loginUser from "@/actions/login";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
    email: z
        .string()
        .email("Please enter a valid email address.")
        .min(2, {
            message: "Email must be at least 2 characters.",
        }),
    password: z
        .string()
        .min(2, {
            message: "Password must be at least 2 characters.",
        }),
});

const LoginPage = () => {

    
    const {loader,setLoader}=useAuthStore();
    const {toast}=useToast();
    const router=useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setLoader(true);
    
        loginUser( data.email, data.password).then(
            (resp) => {
                startSession(resp.user, resp.jwt);
                toast({
                    variant: "success",
                    title: "Account Created",
                });
                setLoader(false);
                router.push("/");
            },
            () => {
                setLoader(false);
                toast({
                    variant: "destructive",
                    title: "Something went wrong",
                });
            }
        ).finally(() => {
            setLoader(false);
        });
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-4/5">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='textone'>Email</FormLabel>

                            <FormControl>
                                <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage className='validationLogin' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='textone'>Password</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your password"
                                    type="password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className='validationLogin' />

                        </FormItem>
                    )}
                />
                <Button className='w-full' type="submit">
                {loader?<Loader2Icon className='animate-spin' /> :"Login"}

                </Button>
            </form>
            <div className='mt-8'>
                <Label className='flex flex-col items-center'>
                    Dont have an account
              
                <Link href="/create-user" className='text-mycolor3 font-semibold mt-5'>
                        Click here to create a new account
                </Link>
                </Label>
            </div>
        </Form>
    );
};

export default LoginPage;
