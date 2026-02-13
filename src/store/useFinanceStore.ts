import { create } from 'zustand';
import { Transaction, Budget, TaxProfile, AIInsight } from '../lib/types';
import mockTransactions from '../data/mockData.json';

interface FinanceState {
    transactions: Transaction[];
    budgets: Budget[];
    profile: TaxProfile;
    insights: AIInsight[];

    // Actions
    addTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: string) => void;
    updateBudget: (budget: Budget) => void;
    updateProfile: (profile: Partial<TaxProfile>) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
    transactions: mockTransactions as Transaction[],
    budgets: [
        { category: 'Food', limit: 15000, spent: 8500 },
        { category: 'Rent', limit: 25000, spent: 25000 },
        { category: 'Investment', limit: 20000, spent: 15000 },
        { category: 'SIP', limit: 10000, spent: 10000 },
        { category: 'UPI/Misc', limit: 5000, spent: 3200 },
    ],
    profile: {
        annualIncome: 1500000,
        investments80C: 150000,
        nps: 50000,
        standardDeduction: 75000,
    },
    insights: [
        {
            id: '1',
            message: "Your UPI spending on weekend dining is 12% higher than your set budget. Switch to home-cooked meals this Sunday to save ₹1,200.",
            potentialSaving: 1200,
            category: 'Food',
            type: 'TIP'
        },
        {
            id: '2',
            message: "Based on your spending, you can save ₹4,000 more this month if you limit 'Dining Out' to your budget.",
            potentialSaving: 4000,
            category: 'Food',
            type: 'SUCCESS'
        }
    ],

    addTransaction: (transaction) => set((state) => {
        const newTransactions = [transaction, ...state.transactions];
        return {
            transactions: newTransactions,
            budgets: state.budgets.map(b => {
                if (b.category === transaction.category && transaction.type === 'DEBIT') {
                    return { ...b, spent: b.spent + transaction.amount };
                }
                return b;
            })
        };
    }),

    deleteTransaction: (id: string) => set((state) => {
        const transactionToDelete = state.transactions.find(t => t.id === id);
        if (!transactionToDelete) return {};

        const newTransactions = state.transactions.filter(t => t.id !== id);

        return {
            transactions: newTransactions,
            budgets: state.budgets.map(b => {
                if (b.category === transactionToDelete.category && transactionToDelete.type === 'DEBIT') {
                    return { ...b, spent: Math.max(0, b.spent - transactionToDelete.amount) };
                }
                return b;
            })
        };
    }),

    updateBudget: (budget) => set((state) => ({
        budgets: state.budgets.map((b) => b.category === budget.category ? budget : b)
    })),

    updateProfile: (updates) => set((state) => ({
        profile: { ...state.profile, ...updates }
    })),
}));
