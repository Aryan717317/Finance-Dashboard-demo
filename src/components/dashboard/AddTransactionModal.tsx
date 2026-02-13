import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Transaction, Category, TransactionType } from '../../lib/types';

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES: Category[] = [
    'Food', 'Rent', 'UPI/Misc', 'Investment', 'SIP',
    'Salary', 'Shopping', 'Entertainment', 'Health', 'Transport'
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
    const { addTransaction } = useFinanceStore();
    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food' as Category,
        type: 'DEBIT' as TransactionType,
        name: '',
        date: new Date().toISOString().split('T')[0],
        referenceNo: ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            amount: parseFloat(formData.amount),
            category: formData.category,
            type: formData.type,
            name: formData.name || formData.category,
            date: formData.date,
            referenceNo: formData.referenceNo || `UPI/${Date.now()}`
        };

        addTransaction(newTransaction);
        onClose();
        // Reset form
        setFormData({
            amount: '',
            category: 'Food',
            type: 'DEBIT',
            name: '',
            date: new Date().toISOString().split('T')[0],
            referenceNo: ''
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl overflow-hidden ring-1 ring-black/5">
                <div className="flex items-center justify-between p-4 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Add Transaction</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Type</label>
                            <div className="flex bg-slate-100/80 p-1 rounded-xl">
                                {['DEBIT', 'CREDIT'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: type as TransactionType })}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.type === type
                                            ? (type === 'DEBIT' ? 'bg-white text-red-600 shadow-sm' : 'bg-white text-emerald-600 shadow-sm')
                                            : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Amount (₹)</label>
                            <input
                                type="number"
                                required
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-bold font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Description / Name</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            placeholder="e.g. Swiggy, Uber, Salary"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Category</label>
                            <div className="relative">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all appearance-none"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Date</label>
                            <input
                                type="date"
                                required
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 font-medium focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-black hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/20"
                        >
                            <Check size={18} />
                            Save Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
