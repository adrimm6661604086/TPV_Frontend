export interface User {
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    country: string;
    
    currency: string;
    bankEntity: string;
    bankAccount: string;
    createdAt: string;
}

export interface UserFormRegister {
    //User Info
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;

    //Personal Info
    DNI: string;
    postalCode: string;
    address: string;
    city: string;
    country: string;

    //Bank Info
    bankAccount: string;
    bankEntity: string;
}

export enum PasswordStrength {
    Weak = 'Weak',
    Medium = 'Medium',
    Strong = 'Strong',
    undefined = 'undefined',
  }


export interface CreditCard {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
    pin: string;
    AID: string;
}

export interface Transaction {
    id: string;
    bankAccountId: string;
    creditCardNumber: string;
    last4Digits: string;
    creditCardHolder: string;
    CardOrg: string;
    expirationDate: string;
    cvc: string;
    amount: string;
    transactionDate: string;
    transactionType: string;
    returned: boolean;
    bankEntity: string;
}

export interface ParsedBytes {
    PAN?: string;
    Name?: string;
    Expiration?: string;
    CVC?: string;
    PIN?: string;
    AID?: string;
  }
  
export type FilterType = "daily" | "weekly" | "monthly" | "annually" | { startDate: string; endDate: string }

export interface StatsData {
transactions: number
totalAmount: number
payments: number
returns: number
paymentsAmount: number
returnAmount: number
}

export interface ApiResponse {
data: {
    "time-filter": string
    stats: Record<string, StatsData>
}
}