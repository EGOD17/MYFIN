
"use client";

import { z } from "zod";

const transactionSchema = z.object({
  id: z.number(),
  type: z.enum(["Mined", "Withdrawal", "Miner Purchase"]),
  amount: z.number(),
  date: z.string(),
  status: z.enum(["Completed", "Pending", "Failed"]),
});

export type Transaction = z.infer<typeof transactionSchema>;

const TRANSACTIONS_STORAGE_KEY = "finpas-transactions";

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const storedTransactions = window.localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (!storedTransactions) {
      return [];
    }
    const parsed = JSON.parse(storedTransactions);
    // Validate each transaction against the schema
    return z.array(transactionSchema).parse(parsed);
  } catch (error) {
    console.error("Failed to parse transactions from localStorage:", error);
    // If parsing fails, clear the corrupted data
    window.localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
    return [];
  }
}

export function addTransaction(transaction: Omit<Transaction, "id" | "date">) {
  if (typeof window === "undefined") {
    return;
  }
  const existingTransactions = getTransactions();
  const newTransaction: Transaction = {
    ...transaction,
    id: new Date().getTime(),
    date: new Date().toISOString(),
  };
  const updatedTransactions = [newTransaction, ...existingTransactions];
  window.localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(updatedTransactions));
}
