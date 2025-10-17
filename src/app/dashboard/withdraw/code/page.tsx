
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Lock } from "lucide-react";
import { LoadingLink } from "@/components/ui/loading-link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

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
import { addTransaction } from "@/lib/transactions";

const formSchema = z.object({
  code: z.string().length(4, "Code must be exactly 4 digits."),
});

export default function WithdrawCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const getLinkWithParams = (pathname: string) => {
    const params = new URLSearchParams(searchParams);
    return `${pathname}?${params.toString()}`;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const amount = parseFloat(searchParams.get("amount") || "0");
    addTransaction({
        type: "Withdrawal",
        amount: -amount,
        status: "Pending",
    });

    toast({
      title: "Withdrawal Confirmed",
      description: "Your withdrawal request has been processed and is now pending.",
    });

    // Reset balance for demo purposes
    const params = new URLSearchParams(searchParams.toString());
    params.set("balance", "0");
    params.set("taps", "0");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("tapsToday", "0");
    }

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="flex w-full items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <LoadingLink href={getLinkWithParams("/dashboard/withdraw")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
             <ArrowLeft className="h-4 w-4" />
             Back to Withdrawal
           </LoadingLink>
          <CardTitle className="pt-4 text-center">Enter Withdrawal Code</CardTitle>
          <CardDescription className="text-center">Your code has been sent to your email. Please enter it below to confirm your withdrawal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Confirmation Code</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="_ _ _ _"
                          {...field}
                          maxLength={4}
                          className="pl-10 text-center tracking-[1em]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={!form.formState.isValid}>
                Confirm Withdrawal
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
