
"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Transaction = {
  name: string;
  amount: number;
};

const sampleNames = [
  "Chinedu O.", "Fatima B.", "Tunde S.", "Aisha I.", "Emeka N.", "Ngozi E.",
  "Musa G.", "Funke A.", "Ibrahim L.", "Chioma P.", "Abubakar S.",
  "Folake O.", "David A.", "Zainab S.", "Oluwaseun M.", "Halima B.",
  "Victor U.", "Gift E.", "Samuel J.", "Blessing A."
];

function generateRandomTransaction(): Transaction {
  const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  const amount = Math.floor(Math.random() * (250000 - 50000 + 1)) + 50000;
  return { name, amount };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function TransactionTicker() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Generate initial transactions
    const initialTransactions = Array.from({ length: 20 }, generateRandomTransaction);
    setTransactions(initialTransactions);

    // Add a new transaction every few seconds to keep it dynamic
    const interval = setInterval(() => {
      setTransactions(prev => [...prev.slice(1), generateRandomTransaction()]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex overflow-hidden bg-secondary border-b border-border">
      <div className="flex animate-marquee-fast whitespace-nowrap">
        {transactions.concat(transactions).map((tx, index) => (
          <div key={index} className="flex items-center mx-4 py-2">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-sm">
              <span className="font-semibold text-foreground">{tx.name}</span>
              <span className="text-muted-foreground"> just withdrew </span>
              <span className="font-bold text-primary">{formatCurrency(tx.amount)}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

    