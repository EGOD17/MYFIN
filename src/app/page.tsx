
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Phone, User, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";

import { SplashScreen } from "@/components/splash-screen";
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
import { Logo } from "@/components/logo";
import { LoadingLink } from "@/components/ui/loading-link";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const formSchema = z.object({
  phone: z.string().length(11, "Phone number must be exactly 11 digits.").regex(/^\d+$/, "Phone number must contain only digits."),
  accountName: z.string().min(1, "Account name is required."),
  accountNumber: z.string().length(10, "Account number must be exactly 10 digits."),
  password: z.string().min(1, "Password is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordChoiceModalOpen, setIsPasswordChoiceModalOpen] = useState(false);
  const [pendingLoginData, setPendingLoginData] = useState<FormValues | null>(null);

  useEffect(() => {
    // This effect runs only on the client side, after the component has mounted.
    setIsClient(true);
  }, []);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      accountName: "",
      accountNumber: "",
      password: "",
    },
  });
  
  const navigateToDashboard = (values: FormValues) => {
     // Clear previous user's data for a "fresh" login
    if (typeof window !== "undefined") {
        const currentUser = window.localStorage.getItem('currentUser');
        const newUserId = `${values.phone}-${values.accountNumber}`;
        
        if (currentUser !== newUserId) {
            // It's a new user, clear all their data to start fresh
            window.localStorage.removeItem('balance');
            window.localStorage.removeItem('tapsToday');
            window.localStorage.removeItem('lastTapDate');
            window.localStorage.removeItem('finpas-transactions');
            window.localStorage.removeItem('hasShown25kToast');
            window.localStorage.setItem('isFirstUser', 'true'); // Flag for new user bonus
            window.localStorage.setItem('newUserStartDate', new Date().toISOString()); // Set start date for special offer
        }
        // For existing users, we DON'T clear anything, so their state is preserved.
        
        window.localStorage.setItem('currentUser', newUserId);
    }
    
    const params = new URLSearchParams({
      name: values.accountName,
      account: values.accountNumber,
      phone: values.phone,
    });
    router.push(`/dashboard?${params.toString()}`);
  }

  function onSubmit(values: FormValues) {
    if (typeof window !== "undefined") {
        const passwordKey = `password_${values.phone}`;
        const customPassword = window.localStorage.getItem(passwordKey);
        const lastFourDigits = values.phone.slice(-4);

        if (customPassword) {
            // User has a custom password, validate against it
            if (values.password === customPassword) {
                navigateToDashboard(values);
            } else {
                form.setError("password", {
                    type: "manual",
                    message: "Incorrect password.",
                });
            }
        } else {
            // New user or user without a custom password
            if (values.password === lastFourDigits) {
                // Correct default password, show choice modal
                setPendingLoginData(values);
                setIsPasswordChoiceModalOpen(true);
            } else {
                form.setError("password", {
                    type: "manual",
                    message: "Incorrect password. New users should use the last 4 digits of their phone number.",
                });
            }
        }
    }
  }

  const handleContinueWithDefault = () => {
    if (pendingLoginData) {
      navigateToDashboard(pendingLoginData);
    }
    setIsPasswordChoiceModalOpen(false);
  };

  const handleCreateCustomPassword = () => {
    setIsPasswordChoiceModalOpen(false);
    router.push('/forgot-password');
  };

  // Show splash screen until we've confirmed we are on the client
  if (!isClient) {
    return <SplashScreen />;
  }

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <Logo />
          <Card className="w-full max-w-md mt-6">
              <CardHeader className="items-center text-center">
              <CardTitle className="pt-4 text-3xl">Welcome Back</CardTitle>
              <CardDescription>Enter your details to access your wallet.</CardDescription>
              </CardHeader>
              <CardContent>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                      control={form.control}
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
                      control={form.control}
                      name="accountName"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Account Name</FormLabel>
                          <FormControl>
                          <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="e.g. John Doe" {...field} className="pl-10" />
                          </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="accountNumber"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                          <div className="relative">
                              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input placeholder="10-digit account number" {...field} className="pl-10" />
                          </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                      <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                          <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input 
                                  placeholder="Last 4 digits of phone number" 
                                  {...field} 
                                  className="pl-10 pr-10" 
                                  type={showPassword ? "text" : "password"}
                              />
                              <Button 
                                  type="button"
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                                  onClick={() => setShowPassword(!showPassword)}
                              >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                          </div>
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                      )}
                  />
                  <div className="text-right text-sm">
                      <LoadingLink href="/forgot-password">
                        <span className="text-primary hover:underline">Reset/Create Password</span>
                      </LoadingLink>
                  </div>
                  <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                      Continue
                  </Button>
                  </form>
              </Form>
              </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={isPasswordChoiceModalOpen} onOpenChange={setIsPasswordChoiceModalOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Create a Custom Password?</AlertDialogTitle>
                <AlertDialogDescription>
                    For better security, we recommend creating a custom password. You can also continue using the last 4 digits of your phone number for now.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={handleContinueWithDefault}>Continue with Default</AlertDialogCancel>
                <AlertDialogAction onClick={handleCreateCustomPassword}>Create Password</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
