import React from 'react';
import { ArrowDownLeft, ArrowUpRight, ShoppingCart, Home, Briefcase, Zap, HelpCircle } from 'lucide-react';
import { Transaction, Category } from '../../lib/types';
import { formatCurrency, formatTransactionDate } from '../../lib/formatters';
import { useFinanceStore } from '../../store/useFinanceStore';

const CATEGORY_ICONS: Record<Category, any> = {
    Food: ShoppingCart,
    Rent: Home,
    'UPI/Misc': Zap,
    Investment: TrendingUp,
    SIP: TrendingUp,
    Salary: Briefcase,
    Shopping: ShoppingCart,
    Entertainment: Zap,
    Health: Zap,
    Transport: Zap,
};

// Re-importing locally because of type mapping issues in this specific environment
import { TrendingUp, Trash2 } from 'lucide-react';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { useState } from 'react';

const TransactionRow = ({ transaction, onDeleteClick }: { transaction: Transaction; onDeleteClick: (id: string, name: string) => void }) => {
    const Icon = CATEGORY_ICONS[transaction.category] || HelpCircle;
    const isDebit = transaction.type === 'DEBIT';

    return (
        <div className="flex items-center justify-between p-4 hover:bg-black/5 transition-colors rounded-xl group border-l-2 border-transparent hover:border-black relative">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDebit ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                    <Icon size={18} />
                </div>
                <div>
                    <p className="font-bold text-slate-900 group-hover:text-black transition-colors">{transaction.name}</p>
                    <p className="text-xs text-slate-500">{transaction.category} • {formatTransactionDate(transaction.date)}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className={`font-bold ${isDebit ? 'text-slate-900' : 'text-emerald-600'}`}>
                        {isDebit ? '-' : '+'} {formatCurrency(Math.abs(transaction.amount))}
                    </p>
                    <p className="text-[10px] text-slate-600 font-mono tracking-tighter">{transaction.referenceNo}</p>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDeleteClick(transaction.id, transaction.name);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all bg-white shadow-sm rounded-full"
                    title="Delete Transaction"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export const TransactionList = () => {
    const { transactions, deleteTransaction } = useFinanceStore();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<{ id: string; name: string } | null>(null);

    const handleDeleteClick = (id: string, name: string) => {
        setSelectedTransaction({ id, name });
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedTransaction) {
            deleteTransaction(selectedTransaction.id);
        }
    };

    return (
        <>
            <div className="glass-card rounded-2xl p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Recent Transactions</h3>
                    <button className="text-xs text-black font-bold hover:underline">View All</button>
                </div>
                <div className="flex-1 space-y-1 overflow-auto max-h-[500px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {transactions.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm">
                            <ShoppingCart size={40} className="mb-2 opacity-20" />
                            <p>No transactions yet.</p>
                        </div>
                    ) : (
                        transactions.map((t) => (
                            <TransactionRow
                                key={t.id}
                                transaction={t}
                                onDeleteClick={handleDeleteClick}
                            />
                        ))
                    )}
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                transactionName={selectedTransaction?.name}
            />
        </>
    );
};
