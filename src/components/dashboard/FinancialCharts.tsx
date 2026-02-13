import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import { useFinanceStore } from '../../store/useFinanceStore';

const CATEGORY_COLORS: Record<string, string> = {
    Food: '#1e293b', // Slate 800
    Rent: '#0f172a', // Slate 900
    'UPI/Misc': '#94a3b8', // Slate 400
    Investment: '#334155', // Slate 700
    SIP: '#000000', // Black
    Shopping: '#cbd5e1', // Slate 300
    Entertainment: '#64748b', // Slate 500
    Health: '#475569', // Slate 600
    Transport: '#1e293b', // Slate 800
};

export const FinancialCharts = () => {
    const { transactions } = useFinanceStore();

    // Group transactions by month for the Area Chart
    const areaData = React.useMemo(() => {
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return d.toLocaleString('default', { month: 'short' });
        });

        return last6Months.map(month => {
            const monthlyTxns = transactions.filter(t => {
                const d = new Date(t.date);
                return d.toLocaleString('default', { month: 'short' }) === month;
            });

            return {
                name: month,
                income: monthlyTxns.filter(t => t.type === 'CREDIT').reduce((acc, t) => acc + t.amount, 0),
                spend: monthlyTxns.filter(t => t.type === 'DEBIT').reduce((acc, t) => acc + t.amount, 0)
            };
        });
    }, [transactions]);

    // Calculate categorical spending for Pie Chart
    const pieData = React.useMemo(() => {
        const spendingByCategory = transactions
            .filter(t => t.type === 'DEBIT')
            .reduce((acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            }, {} as Record<string, number>);

        return Object.entries(spendingByCategory)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [transactions]);

    if (transactions.length === 0) {
        return (
            <div className="mt-8 p-6 rounded-2xl border border-dashed border-slate-700 text-center text-slate-500">
                <p>Add transactions to visualize your financial data.</p>
            </div>
        );
    }

    return (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Area Chart: Income vs Expense Trend */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
                    Income vs Expense Trends
                    <span className="text-xs font-normal text-slate-500">Last 6 Months</span>
                </h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={areaData}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#0f172a' }}
                            />
                            <Legend />
                            <Area name="Income" type="monotone" dataKey="income" stroke="#000000" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={2} activeDot={{ r: 6, fill: '#000000' }} isAnimationActive={false} />
                            <Area name="Expense" type="monotone" dataKey="spend" stroke="#EF4444" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={2} activeDot={{ r: 6, fill: '#EF4444' }} isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pie Chart: Expense Distribution */}
            <div className="glass-card rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Expense Distribution</h3>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                isAnimationActive={false}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#6366F1'} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {pieData.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[item.name] || '#6366F1' }} />
                            <span className="text-xs text-slate-400 truncate">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bar Chart: Monthly Income vs Expense Comparison */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Monthly Income vs Expense</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={areaData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            />
                            <Legend />
                            <Bar name="Income" dataKey="income" fill="#000000" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                            <Bar name="Expense" dataKey="spend" fill="#EF4444" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bar Chart: Monthly Averages */}
            <div className="glass-card rounded-2xl p-6 flex flex-col justify-center">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Monthly Averages</h3>
                <p className="text-xs text-slate-500 mb-6">Based on last 6 months</p>
                <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            {
                                name: 'Average',
                                avgIncome: areaData.reduce((acc, curr) => acc + curr.income, 0) / 6,
                                avgExpense: areaData.reduce((acc, curr) => acc + curr.spend, 0) / 6
                            }
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            />
                            <Legend />
                            <Bar name="Avg Income" dataKey="avgIncome" fill="#334155" radius={[4, 4, 0, 0]} barSize={40} isAnimationActive={false} />
                            <Bar name="Avg Expense" dataKey="avgExpense" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={40} isAnimationActive={false} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
