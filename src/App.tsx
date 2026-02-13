import { useState } from 'react'
import { LayoutDashboard, Wallet, ReceiptText, PieChart, TrendingUp, Menu, X, Bell, Plus } from 'lucide-react'
import { SummaryCards } from './components/dashboard/SummaryCards'
import { FinancialCharts } from './components/dashboard/FinancialCharts'
import { AIHealthCard } from './components/dashboard/AIHealthCard'
import { TransactionList } from './components/dashboard/TransactionList'
import { TaxView } from './components/dashboard/TaxView'
import { AddTransactionModal } from './components/dashboard/AddTransactionModal'

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, active: true },
        { name: 'Transactions', icon: ReceiptText },
        { name: 'Investments', icon: TrendingUp },
        { name: 'Taxes', icon: PieChart },
        { name: 'Accounts', icon: Wallet },
    ]

    return (
        <div className="flex min-h-screen w-full bg-slate-50 text-slate-900 font-sans selection:bg-black selection:text-white">
            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-30 w-64 transform glass-panel border-r border-slate-200/50 transition-transform duration-300 lg:static lg:inset-auto lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100/10">
                    <h1 className="text-2xl font-bold tracking-tight text-black flex items-center gap-2">
                        <Wallet className="w-8 h-8" />
                        ArthaView
                    </h1>
                    <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                <nav className="mt-4 px-4 space-y-1">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href="#"
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${item.active ? 'bg-black text-white shadow-lg shadow-black/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                        >
                            <item.icon size={18} />
                            {item.name}
                        </a>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <header className="flex h-16 items-center justify-between glass-panel border-b border-slate-200/50 px-6 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button className="lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={20} />
                        </button>
                        <h2 className="text-lg font-semibold lg:block hidden">Namaste, Aryan</h2>
                        <h2 className="text-lg font-semibold lg:hidden">Dashboard</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="hidden md:flex items-center gap-2 bg-black hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <Plus size={18} />
                            Add Transaction
                        </button>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 border border-white shadow-sm">AB</div>
                            <span className="text-sm font-semibold text-slate-700 hidden md:block">Aryan B.Kumar</span>
                        </div>
                    </div>
                </header>

                {/* Dashboard View */}
                <main className="flex-1 overflow-auto p-6 md:p-8 space-y-8">
                    <SummaryCards />

                    <FinancialCharts />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <TransactionList />
                        </div>

                        <div className="space-y-6">
                            <AIHealthCard />
                            <TaxView />
                        </div>
                    </div>
                </main>
            </div>

            {/* Floating Add Button for Mobile */}
            <button
                onClick={() => setIsAddModalOpen(true)}
                className="md:hidden fixed bottom-6 right-6 h-14 w-14 bg-black rounded-full shadow-2xl flex items-center justify-center text-white z-40 hover:scale-110 transition-transform shadow-black/30"
            >
                <Plus size={24} />
            </button>

            <AddTransactionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
            />
        </div>
    )
}

export default App
