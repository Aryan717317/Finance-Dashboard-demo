import React from 'react';
import { calculateTax } from '../../lib/taxCalculator';
import { formatCurrency } from '../../lib/formatters';
import { useFinanceStore } from '../../store/useFinanceStore';
import { Info } from 'lucide-react';

export const TaxView = () => {
    const { profile } = useFinanceStore();
    const taxData = calculateTax(profile.annualIncome);

    return (
        <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Tax Optimizer</h3>
                    <p className="text-xs text-slate-500 mt-1">FY 2025-26 • New Regime (Default)</p>
                </div>
                <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
                    <Info size={20} />
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Gross Annual Income</p>
                        <p className="text-lg font-bold mt-1 text-slate-900">{formatCurrency(taxData.grossIncome)}</p>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <p className="text-[10px] text-indigo-600 uppercase font-bold">Net Payable Tax</p>
                        <p className="text-lg font-bold mt-1 text-indigo-900">{formatCurrency(taxData.effectiveTax)}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Standard Deduction</span>
                        <span className="text-emerald-600 font-medium">-{formatCurrency(taxData.standardDeduction)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Section 87A Rebate</span>
                        <span className="text-emerald-600 font-medium">-{formatCurrency(taxData.rebate87A)}</span>
                    </div>
                    <div className="flex justify-between text-sm pt-3 border-t border-slate-200">
                        <span className="text-slate-500">Taxable Income</span>
                        <span className="font-bold text-slate-900">{formatCurrency(taxData.taxableIncome)}</span>
                    </div>
                </div>

                {taxData.taxableIncome <= 1200000 && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">🎉</div>
                        <p className="text-xs text-emerald-700 leading-relaxed">
                            Great news! Your taxable income is within the 87A rebate limit. You pay <span className="font-bold underline">Zero Income Tax</span> for this year.
                        </p>
                    </div>
                )}

                <button className="w-full bg-slate-900 text-white rounded-xl py-3 text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                    Download Tax Report
                </button>
            </div>
        </div>
    );
};
