import { Transaction } from "./interfaces";

export type RootStackParamList = {
    Main: undefined;
    Profile: undefined ;
    UserAuth: undefined ;
    Payment: undefined ;
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
    PaymentReader: { amount: number };
    PaymentPin: { cardData: CreditCard, amount: number };
    PaymentConfirmed: undefined;
    PaymentRefused: undefined;
    PaymentReturn: undefined;
};
