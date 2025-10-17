
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Phone, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingLink } from "@/components/ui/loading-link";


const resetSchema = z.object({
  phone: z.string().length(11, "Phone number must be exactly 11 digits.").regex(/^\d+$/, "Phone number must contain only digits."),
  currentPassword: z.string().length(4, "This must be the last 4 digits of your phone number."),
  newPassword: z.string().min(6, "Password must be at least 6 characters long."),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => data.phone.slice(-4) === data.currentPassword, {
    message: "The 4 digits do not match the phone number provided.",
    path: ["currentPassword"],
});


export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { phone: "", currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  function onResetSubmit(values: z.infer<typeof resetSchema>) {
    // In a real app, you would have a backend to securely verify and update the password.
    // For this simulation, we'll use localStorage.
    if (typeof window !== "undefined") {
      const passwordKey = `password_${values.phone}`;
      localStorage.setItem(passwordKey, values.newPassword);
    }
    
    toast({
      title: "Password Set Successfully",
      description: "Your new password has been saved. Please log in again.",
    });
    router.push("/");
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <LoadingLink href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
             <ArrowLeft className="h-4 w-4" />
             Back to Login
          </LoadingLink>
          <CardTitle className="pt-4 text-center">Reset/Create Password</CardTitle>
          <CardDescription className="text-center">
            To set a custom password, first verify your account with your phone number, then create a new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                 <FormField
                    control={resetForm.control}
                    name="phone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="11-digit phone number" {...field} className="pl-10" type="tel" />
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                  control={resetForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verify Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Last 4 digits of your phone number" 
                            {...field} 
                            className="pl-10 pr-10" 
                            maxLength={4} 
                            type={showPasswords.current ? "text" : "password"}
                          />
                          <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                                onClick={() => toggleShowPassword('current')}
                            >
                                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="New password (min. 6 characters)" 
                            {...field} 
                            className="pl-10 pr-10" 
                            type={showPasswords.new ? "text" : "password"}
                           />
                           <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                                onClick={() => toggleShowPassword('new')}
                            >
                                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="Confirm your new password" 
                            {...field} 
                            className="pl-10 pr-10" 
                            type={showPasswords.confirm ? "text" : "password"}
                          />
                          <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                                onClick={() => toggleShowPassword('confirm')}
                            >
                                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={!resetForm.formState.isValid}>
                  Set Password
                </Button>
              </form>
            </Form>
        </CardContent>
      </Card>
    </main>
  );
}
