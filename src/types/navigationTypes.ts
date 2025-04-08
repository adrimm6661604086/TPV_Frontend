import { Transaction } from "./interfaces";

export type RootStackParamList = {
    Main: undefined;
    Profile: undefined ;
    UserAuth: undefined ;
    Payment: undefined | { screen: keyof PaymentStackParamList; params: PaymentStackParamList[keyof PaymentStackParamList] };
    ShowMore: { transactions: Transaction[] }; 
};

export type BottomTabParamList = {
    Home: undefined;
    Settings: undefined;
    Stats: undefined;
};

import { CreditCard } from "./interfaces";

export type PaymentStackParamList = {
    PaymentSetter: undefined;
    PaymentReader: { 
        amount: number
    };
    ReturnReader: { 
        transactionId: string,
        amount: number
    };
    PaymentPin: { 
        cardData: CreditCard, 
        amount: number, 
    };
    PaymentVerification: {
        creditCard: CreditCard,
        amount: number
        transactionId: string | null,  
        check: boolean
    };
    MainScreen: undefined;
};
