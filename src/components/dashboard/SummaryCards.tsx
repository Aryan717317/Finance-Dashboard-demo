import React from 'react';
import { formatCurrency } from '../../lib/formatters';
import { useFinanceStore } from '../../store/useFinanceStore';

export const SummaryCards = () => {
    const { transactions } = useFinanceStore();

    const income = transactions
        .filter(t => t.type === 'CREDIT' && t.category === 'Salary')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'DEBIT')
        .reduce((acc, curr) => acc + curr.amount, 0);

    const netWorth = income - expenses + 1200000; // Mock base balance

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Net Worth</p>
                    <span className="p-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-bold">+12.5%</span>
                </div>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(netWorth)}</h3>
                <p className="text-slate-400 text-xs font-medium mt-2">Total assets balance</p>
            </div>

            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Monthly Income</p>
                </div>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(income)}</h3>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 py-1.5 px-3 rounded-full w-fit">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Next payout in 18 days
                </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Monthly Expense</p>
                </div>
                <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(expenses)}</h3>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
                    <div
                        className="bg-black h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((expenses / income) * 100, 100)}%` }}
                    />
                </div>
                <p className="text-right text-xs text-slate-400 mt-2 font-medium">
                    {Math.round((expenses / income) * 100)}% of income spent
                </p>
            </div>
        </div>
    );
};
