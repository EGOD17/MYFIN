
"use client";

import { LoadingLink } from "@/components/ui/loading-link";
import { ArrowLeft, ArrowDown, ArrowUp, CircleDollarSign, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getTransactions, type Transaction } from "@/lib/transactions";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

const transactionIcons: { [key: string]: React.FC<any> } = {
  "Mined": ArrowDown,
  "Withdrawal": ArrowUp,
  "Miner Purchase": CircleDollarSign,
};

const transactionColors: { [key: string]: string } = {
    "Mined": "text-green-500",
    "Withdrawal": "text-red-500",
    "Miner Purchase": "text-blue-500",
}


export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Reading from localStorage should only happen on the client
    setTransactions(getTransactions());
  }, []);

  const getLinkWithParams = (pathname: string) => {
    const params = new URLSearchParams(searchParams.toString());
    return `${pathname}?${params.toString()}`;
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto">
       <LoadingLink href={getLinkWithParams("/dashboard")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
         <ArrowLeft className="h-4 w-4" />
         Back to Dashboard
       </LoadingLink>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Here is a list of your recent transactions.</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((tx) => {
                 const Icon = transactionIcons[tx.type] || CircleDollarSign;
                 const color = transactionColors[tx.type] || "text-foreground";
                 return (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-4">
                            <Icon className={cn("h-6 w-6", color)} />
                            <div>
                                <p className="font-semibold">{tx.type}</p>
                                <p className="text-sm text-muted-foreground">{formatDateTime(tx.date)}</p>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className={cn("font-bold text-lg", tx.amount > 0 ? "text-green-500" : "text-red-500")}>
                             {formatCurrency(tx.amount)}
                           </p>
                           <p className="text-xs text-muted-foreground">{tx.status}</p>
                        </div>
                    </div>
                 )
              })}
            </div>
          ) : (
            <div className="text-center py-12 flex flex-col items-center gap-4">
              <History className="h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground font-semibold">You have no transactions yet.</p>
              <p className="text-sm text-muted-foreground">Perform actions like mining to see your history here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
