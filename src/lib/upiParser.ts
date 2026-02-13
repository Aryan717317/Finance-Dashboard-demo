import { Transaction, Category } from './types';

/**
 * Common UPI SMS Formats:
 * "VPA: example@upi"
 * "Ref No: 6042129841"
 * "debited from A/c XX1234"
 * "Rs. 500.00"
 */

export const parseUPISMS = (sms: string): Partial<Transaction> => {
    const amountMatch = sms.match(/(?:Rs|INR|₹)\.?\s*([\d,]+\.?\d*)/i);
    const vpaMatch = sms.match(/VPA:\s*([^\s]+)/i);
    const refMatch = sms.match(/Ref No:\s*([\d]+)/i);
    const bankMatch = sms.match(/(?:debited from|credited to)\s*A\/c\s*([^\s]+)/i);

    const amount = amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : 0;
    const isDebit = sms.toLowerCase().includes('debited');

    return {
        amount,
        type: isDebit ? 'DEBIT' : 'CREDIT',
        referenceNo: refMatch ? refMatch[1] : undefined,
        bank: bankMatch ? bankMatch[1] : undefined,
        name: vpaMatch ? vpaMatch[1] : 'UPI Transaction',
        date: new Date().toISOString().split('T')[0],
        category: 'UPI/Misc' as Category,
    };
};
