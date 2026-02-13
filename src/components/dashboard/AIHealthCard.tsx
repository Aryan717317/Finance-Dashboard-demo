import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';
import { useFinanceStore } from '../../store/useFinanceStore';
import { formatCurrency } from '../../lib/formatters';

export const AIHealthCard = () => {
    const { insights } = useFinanceStore();
    const currentInsight = insights[0];

    return (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />

            <h3 className="text-indigo-600 font-bold flex items-center gap-2 text-sm uppercase tracking-wider">
                <Sparkles size={16} />
                Smart Summary
            </h3>

            <div className="mt-4">
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {currentInsight.message}
                </p>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Potential Saving</p>
                    <p className="text-xl font-bold text-emerald-600">{formatCurrency(currentInsight.potentialSaving)}</p>
                </div>
                <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg px-4 py-2 text-xs font-bold transition-all border border-indigo-100">
                    Analyze More
                </button>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Real-time analysis active
                </div>
            </div>
        </div>
    );
};
