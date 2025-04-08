export type ChartData = {
    month: string
    transactions: number
    totalAmount: number
    payments: number
    returns: number
    paymentsAmount: number
    returnAmount: number
  }
  
  export function processMonthlyData(data: any) {
    const monthlyData = Object.entries(data.Stats.monthly).map(([key, value]: [string, any]) => ({
      month: new Date(key).toLocaleDateString("default", { month: "short" }),
      ...value,
    }))
  
    return {
      labels: monthlyData.map((item) => item.month),
      datasets: [
        {
          data: monthlyData.map((item) => item.totalAmount),
          color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`, // Blue color
        },
      ],
    }
  }
  
  export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  
  