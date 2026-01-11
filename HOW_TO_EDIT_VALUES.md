# How to Edit Chart Values

## File Location
The chart configurations are in:
**`/Users/hahemed/experiments/Returns Graph/components/NPSDashboard.tsx`**

## Structure

Each chart is defined in the `npsConfigurations` array. Here's what each parameter means:

```typescript
{
  title: 'Chart Name',           // Display name of the chart
  params: {
    paymentTerm: 12,             // Years of active investment (Phase 1)
    cooloff: 2,                  // Cooloff period (currently unused)
    payout: 25,                  // Years to receive payouts
    payoutAmount: 21210,         // ₹ per year during payout period
    lumpsum: 792000,             // ₹ lumpsum at end of payout
    npsInvestment: 40000,        // ₹ per year during Phase 1
    years: 42,                   // Total investment duration
    annualReturn: 0.10           // Return rate (0.10 = 10%)
  },
  color: '#667eea',              // Primary color for the chart
  secondaryColor: '#FCD34D',     // Phase 2 color (yellow)
  editable: false                // Can parameters be edited in UI?
}
```

## Current Charts

### 1. NPS 40K (Purple)
```typescript
npsInvestment: 40000    // ₹40,000/year for 12 years
payoutAmount: 0         // No payouts
lumpsum: 0              // No lumpsum
```

### 2. NPS 100K (Green)
```typescript
npsInvestment: 100000   // ₹1,00,000/year for 12 years
payoutAmount: 0         // No payouts
lumpsum: 0              // No lumpsum
```

### 3. NPS 84K + Term (Cyan)
```typescript
npsInvestment: 84000    // ₹84,000/year for 12 years
payoutAmount: 0         // No payouts
lumpsum: 0              // No lumpsum
```

### 4. ABSLI 60 + NPS 40 (Red)
```typescript
npsInvestment: 40000    // ₹40,000/year for 12 years
payoutAmount: 21210     // ₹21,210/year for 25 years
lumpsum: 792000         // ₹7,92,000 at year 25
```

### 5. ABSLI 100 (Purple)
```typescript
npsInvestment: 0        // No NPS investment
payoutAmount: 130338    // ₹1,30,338/year for 25 years
lumpsum: 1440000        // ₹14,40,000 at year 25
```

## How to Edit Values

1. Open `/components/NPSDashboard.tsx`
2. Find the `npsConfigurations` array (around line 10)
3. Modify the values you want to change
4. Save the file
5. The chart will automatically update

## Example: Change NPS 40K to NPS 50K

Find this section:
```typescript
{
  title: 'NPS 40K',
  params: {
    npsInvestment: 40000,  // Change this to 50000
```

Change to:
```typescript
{
  title: 'NPS 50K',        // Update title
  params: {
    npsInvestment: 50000,  // New investment amount
```

## Investment Phases Explained

### Phase 1 (Years 1-12)
- Duration: `paymentTerm` years
- Annual investment: `npsInvestment` ₹
- Color: Chart's primary color

### Phase 2 (Years 13-42)
- Duration: Remaining years after `paymentTerm`
- Annual investment: Fixed ₹16,000
- Color: Yellow (#FCD34D)

### Payouts
- Start from year 1
- Continue for `payout` years
- Amount: `payoutAmount` ₹ per year
- Final lumpsum: `lumpsum` ₹ at year `payout`

## Tips

1. **To change annual investment**: Modify `npsInvestment`
2. **To add payouts**: Set `payoutAmount` (yearly) and `lumpsum` (one-time)
3. **To change return rate**: Modify `annualReturn` (0.10 = 10%, 0.12 = 12%)
4. **To rename chart**: Change `title`
5. **To change colors**: Modify `color` (use hex codes like #667eea)

## Notes

- Phase 2 investment is hardcoded to ₹16,000/year
- To change this, you need to edit `/utils/npsCalculation.ts` line 62
- All amounts are in Indian Rupees (₹)
- Years start from 2028 and go to 2069
