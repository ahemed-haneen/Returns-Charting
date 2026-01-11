// NPS Investment Calculation Logic
// Based on the Python script: nps40.py

export interface NPSParams {
  paymentTerm: number;      // Number of years to make regular investments
  payout_start: number;          // Cooloff period (currently not used in calculation)
  payout_end: number;           // Payout period
  payoutAmount: number;     // Amount paid out per year during payout period
  lumpsum: number;          // Lumpsum amount at the end of payout period
  lumpsum_year: number;    // Year in which lumpsum is paid
  npsInvestment: number;    // Initial and recurring investment amount
  totalInvestmentPerYear?: number;  // Total investment per year (including insurance premium). If not provided, defaults to npsInvestment
  years: number;            // Total number of years to calculate
  annualReturn: number;     // Annual return rate (as decimal, e.g., 0.1 for 10%)
  perYearPayouts?: { [year: number]: number }; // Optional override: payouts per year (1-based)
}

export interface NPSResult {
  year: number;
  value: number;
  phase: 'investment' | 'secondary' | 'completed';
  investment: number;        // Investment added this year
  payout: number;           // Payout received this year
  returns: number;          // Returns earned this year (absolute amount)
  returnsRate: number;      // YoY return rate (percentage)
  previousValue: number;    // Value at start of year
}

export function calculateNPS(params: NPSParams): NPSResult[] {
  const {
    paymentTerm,
    payout_start,
    payout_end,
    payoutAmount,
    lumpsum,
    lumpsum_year,
    npsInvestment,
    years,
    annualReturn,
  } = params;

  const results: NPSResult[] = [];
  let npsInitial = npsInvestment;

  // Add the initial value (Year 0)
  results.push({
    year: 0,
    value: Math.round(npsInitial),
    phase: 'investment',
    investment: npsInvestment,
    payout: 0,
    returns: 0,
    previousValue: 0
  });

  // Calculate for each year (use configured years)
  for (let i = 0; i < years; i++) {
    const previousValue = npsInitial;
    
    // Apply annual return (growth on opening balance)
    const returnsEarned = npsInitial * annualReturn;
    npsInitial = npsInitial * (1 + annualReturn);

    // Track investment and payout for this year
    let yearInvestment = 0;
    let yearPayout = 0;

    // Add recurring investment only during payment term
    if (i < paymentTerm) {
      yearInvestment += npsInvestment;
      npsInitial = npsInitial + npsInvestment;
    }

    // Apply payout amount during payout period (1-based comparison)
    const yearNumber = i + 1;
    // Prefer per-year payout schedule when provided
    if (params.perYearPayouts && params.perYearPayouts[yearNumber]) {
      const perAmount = params.perYearPayouts[yearNumber];
      yearPayout += perAmount;
      npsInitial = npsInitial + (perAmount);
    } else if (yearNumber >= payout_start && yearNumber <= payout_end) {
      yearPayout += payoutAmount;
      npsInitial = npsInitial + (payoutAmount);
    }
    
    // Apply lumpsum (1-based comparison)
    if (yearNumber === lumpsum_year && lumpsum > 0) {
        yearPayout += lumpsum;
        npsInitial = npsInitial + lumpsum;
    }

    // Determine phase for color coding
    let phase: 'investment' | 'secondary' | 'completed';
    if (i < paymentTerm) {
      phase = 'investment';
    } else {
      phase = 'secondary';
    }

    results.push({
      year: i + 1,
      value: Math.round(npsInitial),
      phase: phase,
      investment: yearInvestment,
      payout: yearPayout,
      returns: Math.round(returnsEarned),
      returnsRate: previousValue > 0 ? parseFloat(((returnsEarned / previousValue) * 100).toFixed(1)) : 0,
      previousValue: Math.round(previousValue)
    });
  }

  return results;
}

// Default parameters matching the Python script
export const defaultNPSParams: NPSParams = {
  paymentTerm: 12,
  payout_start: 0,
  payout_end: 0,
  payoutAmount: 0,
  lumpsum: 0,
  lumpsum_year: 0,
  npsInvestment: 40000,
  years: 42,
  annualReturn: 0.10  // 10%
};
