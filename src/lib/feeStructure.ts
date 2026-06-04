export interface Installment {
  id: string;
  amount: number;
  dueDate: string;
  status: "Pending" | "Paid" | "Overdue";
  paidDate?: string;
}

export interface FeeDetails {
  totalFee: number;
  totalPaid: number;
  installments: Installment[];
}

export const CLASS_FEES: Record<string, { total: number, counts: number }> = {
  "Nursery": { total: 30000, counts: 3 },
  "LKG": { total: 30000, counts: 3 },
  "UKG": { total: 30000, counts: 3 },
  "Class 1": { total: 36000, counts: 3 },
  "Class 2": { total: 36000, counts: 3 },
  "Class 3": { total: 36000, counts: 3 },
  "Class 4": { total: 40000, counts: 3 },
  "Class 5": { total: 40000, counts: 3 },
  "Class 6": { total: 45000, counts: 3 },
  "Class 7": { total: 45000, counts: 3 },
  "Class 8": { total: 45000, counts: 3 },
  "Class 9": { total: 55000, counts: 3 },
  "Class 10": { total: 55000, counts: 3 },
  "Class 11": { total: 70000, counts: 4 },
  "Class 12": { total: 70000, counts: 4 },
};

export const generateInstallments = (grade: string): FeeDetails => {
  const feeInfo = CLASS_FEES[grade] || { total: 45000, counts: 3 };
  const { total, counts } = feeInfo;
  const baseAmount = Math.floor(total / counts);
  const remainder = total % counts;

  const standardDueDates = [
    "2026-04-01", // April 1st
    "2026-07-01", // July 1st
    "2026-10-01", // October 1st
    "2027-01-01"  // January 1st (if 4th installment)
  ];

  const installments: Installment[] = [];

  for (let i = 0; i < counts; i++) {
    // Add any remainder to the first installment
    const amount = i === 0 ? baseAmount + remainder : baseAmount;
    installments.push({
      id: `inst-${i + 1}`,
      amount,
      dueDate: standardDueDates[i] || `2026-12-31`,
      status: "Pending",
    });
  }

  return {
    totalFee: total,
    totalPaid: 0,
    installments,
  };
};
