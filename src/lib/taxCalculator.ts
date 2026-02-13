export interface TaxBreakdown {
    grossIncome: number;
    taxableIncome: number;
    totalTax: number;
    rebate87A: number;
    standardDeduction: number;
    effectiveTax: number;
}

export const calculateTax = (annualIncome: number, isSalaried: boolean = true): TaxBreakdown => {
    const standardDeduction = isSalaried ? 75000 : 0;
    const taxableIncome = Math.max(0, annualIncome - standardDeduction);

    let tax = 0;

    const slabs = [
        { limit: 400000, rate: 0 },
        { limit: 800000, rate: 0.05 },
        { limit: 1200000, rate: 0.10 },
        { limit: 1600000, rate: 0.15 },
        { limit: 2000000, rate: 0.20 },
        { limit: 2400000, rate: 0.25 },
        { limit: Infinity, rate: 0.30 },
    ];

    let prevLimit = 0;
    for (const slab of slabs) {
        if (taxableIncome > prevLimit) {
            const taxableInThisSlab = Math.min(taxableIncome - prevLimit, slab.limit - prevLimit);
            tax += taxableInThisSlab * slab.rate;
            prevLimit = slab.limit;
        } else {
            break;
        }
    }

    let rebate87A = 0;
    if (taxableIncome <= 1200000) {
        rebate87A = tax;
    }

    const netTax = tax - rebate87A;
    const cess = netTax * 0.04;
    const totalTax = netTax + cess;

    return {
        grossIncome: annualIncome,
        taxableIncome,
        totalTax: tax,
        rebate87A,
        standardDeduction,
        effectiveTax: totalTax,
    };
};
