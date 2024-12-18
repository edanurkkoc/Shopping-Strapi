
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
import registerUser from "@/actions/register";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import useAuthStore from "@/hooks/useAuth";
import { Loader2Icon } from "lucide-react";
import { startSession } from "@/lib/sessions";


const formSchema = z.object({
  username: z
  .string()
  .email("Please enter a valid email address.")
  .min(2, {
      message: "Username must be at least 2 characters.",
  }),
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


const CreateUserPage = () => {

    const {loader,setLoader}=useAuthStore();
    const {toast}=useToast();
    const router=useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setLoader(true);
    
        try {
            // Kullanıcıyı kaydetmek için API çağrısı
            const resp = await registerUser(data.username, data.email, data.password);
    
            // Gelen veriyi kontrol et
            if (resp && resp.user && resp.jwt) {
                startSession(resp.user, resp.jwt); // Oturumu başlat
                toast({
                    variant: "success",
                    title: "Account Created",
                });
                router.push("/"); // Ana sayfaya yönlendir
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            console.error("Error during registration:", error);
    
            // Hata durumunda kullanıcıya mesaj göster
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: error instanceof Error ? error.message : "An unknown error occurred",
            });
        } finally {
            // Loader'ı kapat
            setLoader(false);
        }
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-4/5">
            <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='textone'>UserName</FormLabel>

                            <FormControl>
                                <Input placeholder="Username" {...field} />
                            </FormControl>
                            <FormMessage className='validationLogin' />
                        </FormItem>
                    )}
                />
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
                    {loader?<Loader2Icon className='animate-spin' /> :"Create Account"}
                </Button>
            </form>

            <div className='mt-8'>
                <Label className='flex flex-col items-center'>
                   Already Acoount
              
                <Link href="/create-user" className='text-mycolor3 font-semibold mt-5'>
                        Click here to login page
                </Link>
                </Label>
            </div>
        </Form>
    );
};

export default CreateUserPage;
