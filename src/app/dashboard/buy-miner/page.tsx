
"use client";

import { LoadingLink } from "@/components/ui/loading-link";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { usePaystackPayment } from "react-paystack";
import { useToast } from "@/hooks/use-toast";
import { addTransaction } from "@/lib/transactions";


const allMinerPlans = [
  { name: "Super Taps", price: 100, daily: 0, taps: 10, special: true }, // The special offer
  { name: "Free Taps", price: 0, daily: 0, taps: 10, free: true }, // The one-time free offer
  { name: "Newbie Taps", price: 100, daily: 0, taps: 5 },
  { name: "Mini Taps", price: 500, daily: 500, taps: 5 },
  { name: "Starter Taps", price: 1000, daily: 1000, taps: 10 },
  { name: "Bronze Miner", price: 5000, daily: 25000, taps: 100 },
  { name: "Silver Miner", price: 10000, daily: 50000, taps: 200 },
  { name: "Gold Miner", price: 15000, daily: 75000, taps: 300 },
  { name: "Platinum Miner", price: 20000, daily: 100000, taps: 400 },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

const COMPLETED_TASKS_KEY = "finpas_completed_tasks";
const SPECIAL_OFFER_CLAIMED_KEY = "finpas_special_offer_claimed";
const FREE_TAPS_CLAIMED_KEY = "finpas_free_taps_claimed";

export default function BuyMinerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: number, taps: number, free?: boolean } | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [minerPlans, setMinerPlans] = useState(allMinerPlans.filter(p => !p.special && !p.free));
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);
  const [freeTapsClaimed, setFreeTapsClaimed] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCompleted = localStorage.getItem(COMPLETED_TASKS_KEY);
      const tasksAreComplete = storedCompleted ? Object.values(JSON.parse(storedCompleted)).every(status => status === true) : false;
      setAllTasksCompleted(tasksAreComplete);

      const offerClaimed = localStorage.getItem(SPECIAL_OFFER_CLAIMED_KEY) === 'true';
      const freeClaimed = localStorage.getItem(FREE_TAPS_CLAIMED_KEY) === 'true';
      setFreeTapsClaimed(freeClaimed);

      let plansToShow = allMinerPlans;
      if (offerClaimed) {
          plansToShow = plansToShow.filter(p => !p.special);
      }
      if (freeClaimed) {
          plansToShow = plansToShow.filter(p => !p.free);
      }

      setMinerPlans(plansToShow);
    }
  }, []);

  const config = {
    reference: new Date().getTime().toString(),
    email: searchParams.get("email") || "user@example.com",
    amount: (selectedPlan?.price || 0) * 100, // Paystack amount is in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  };

  const initializePayment = usePaystackPayment(config);

  const getLinkWithParams = (pathname: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${pathname}?${params.toString()}`;
  };

  const onSuccess = () => {
    setIsPaying(false);
    toast({
      title: "Purchase Successful",
      description: `You have successfully purchased the ${selectedPlan?.name}.`,
    });
    if (selectedPlan) {
      addTransaction({
        type: "Miner Purchase",
        amount: -selectedPlan.price,
        status: "Completed",
      });
      // Add purchased taps to localStorage
      if (typeof window !== "undefined") {
        const currentPurchasedTaps = parseInt(localStorage.getItem('purchasedTaps') || '0', 10);
        const newTotalTaps = currentPurchasedTaps + selectedPlan.taps;
        localStorage.setItem('purchasedTaps', newTotalTaps.toString());
        
        // If they bought the special plan, mark offer as claimed for the day
        if (selectedPlan.name === "Super Taps") {
            localStorage.setItem(SPECIAL_OFFER_CLAIMED_KEY, 'true');
        }
      }
    }
    setSelectedPlan(null);
  };

  const onClose = () => {
    setIsPaying(false);
    setSelectedPlan(null);
    console.log("closed");
  };

  const handleBuyClick = (plan: { name: string; price: number, taps: number, special?: boolean, free?: boolean }) => {
     if (plan.special) {
         if (!allTasksCompleted) {
             toast({
                 title: "Task Required",
                 description: "You need to complete all tasks to unlock this special offer.",
                 variant: "destructive"
             });
             router.push(getLinkWithParams('/dashboard/tasks'));
             return;
         }
     }

     if (plan.free) {
        if (typeof window !== "undefined") {
            localStorage.setItem(FREE_TAPS_CLAIMED_KEY, 'true');
            const currentPurchasedTaps = parseInt(localStorage.getItem('purchasedTaps') || '0', 10);
            const newTotalTaps = currentPurchasedTaps + plan.taps;
            localStorage.setItem('purchasedTaps', newTotalTaps.toString());
            setFreeTapsClaimed(true);
            setMinerPlans(prev => prev.filter(p => !p.free));
            toast({
                title: "Taps Claimed!",
                description: `You have received ${plan.taps} free taps.`
            });
        }
        return;
     }
     
    setSelectedPlan(plan);
  };

  useEffect(() => {
    if (selectedPlan && selectedPlan.price > 0 && config.publicKey) {
      setIsPaying(true);
      initializePayment({ onSuccess, onClose });
    }
  }, [selectedPlan, initializePayment, config.publicKey]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <LoadingLink href={getLinkWithParams("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </LoadingLink>
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Buy a Miner or Taps</CardTitle>
          <CardDescription>Upgrade your plan to increase your daily mining rewards.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {minerPlans.map((plan) => (
            <Card key={plan.name} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-secondary">
              <div className="flex-1 mb-4 sm:mb-0">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Zap className="h-5 w-5" /> {plan.name}
                </h3>
                <p className="text-muted-foreground">
                  {plan.taps >= 10 && plan.daily === 0 ? `Get ${plan.taps} extra taps.` : (plan.daily > 0 ? `Mine up to ${formatCurrency(plan.daily)} daily.` : `Get ${plan.taps} extra taps.`)}
                </p>
              </div>
              <Button onClick={() => handleBuyClick(plan)} disabled={(isPaying && selectedPlan?.name === plan.name) || (plan.free && freeTapsClaimed)}>
                {isPaying && selectedPlan?.name === plan.name ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  plan.free ? (freeTapsClaimed ? "Claimed" : "Claim for Free") : `Buy for ${formatCurrency(plan.price)}`
                )}
              </Button>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
