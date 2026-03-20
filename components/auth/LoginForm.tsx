"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GithubIcon, Loader2Icon } from "lucide-react"
import Link from "next/link"
import { signInWithGitHub, signInWithGoogle } from "@/lib/auth/client"
import Image from "next/image"
import { useState } from "react"

const LoginForm = () =>  {
    const [githubLoading, setGithubLoading] =  useState(false);
    const [googleLoading, setGoogleLoading] =  useState(false);
    const handleGoogleSignIn = async () =>{
        try {
            setGoogleLoading(true);
            return await signInWithGoogle();
        } catch(err) {
            console.error("Google Sign-in failed", err)
        } finally {
            setGoogleLoading(false);
        }
    }
    const handleGithubSignIn = async () =>{
        try {
            setGithubLoading(true);
            return await signInWithGitHub();
        } catch(err) {
            console.error("Github sign-in failed",err)
        } finally {
            setGithubLoading(false);
        }
    }
    return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 self-center font-medium">
                <div className="flex size-6 items-center justify-center rounded-md">
                    <Image src="/favicon.png" alt="Logo" height={24} width={24}/>
                </div>
                <span className="text-xl">Scanzie</span>
            </Link>
            <div className={cn("flex flex-col gap-6")}>
            <Card className="shadow-neutral-50">
                <CardHeader className="text-center">
                <CardTitle className="text-xl">Welcome to Scanzie.</CardTitle>
                <CardDescription>
                    Please sigin-in to get started with Scanzie.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div>
                        <div className="flex flex-col gap-4">
                            <Button disabled={githubLoading} onClick={handleGithubSignIn} variant="outline" className="w-full">
                                {githubLoading ? <Loader2Icon className="animate-spin"/> : <GithubIcon/>}
                                {githubLoading ? "Signing in...": "Sign-in with Github"}
                            </Button>
                            <Button disabled={googleLoading} onClick={handleGoogleSignIn} variant="outline" className="w-full">
                                {googleLoading ?<Loader2Icon className="animate-spin"/> : <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path></svg>}
                                {googleLoading ? "Signing in...": "Sign-in with Google"}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
              &copy; 2026
            </div>    
            </div>
        </div>
        </div>

    )
}
export default LoginForm
