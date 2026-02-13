export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatCompactNumber = (number: number): string => {
    if (number >= 10000000) {
        return `₹${(number / 10000000).toFixed(2)} Cr`;
    }
    if (number >= 100000) {
        return `₹${(number / 100000).toFixed(2)} L`;
    }
    if (number >= 1000) {
        return `₹${(number / 1000).toFixed(1)}k`;
    }
    return `₹${number}`;
};

export const formatTransactionDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};
