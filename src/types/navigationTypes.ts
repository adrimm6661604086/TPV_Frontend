export type RootStackParamList = {
    Main: undefined;
    Profile: undefined ;
    UserAuth: undefined ;
    Payment: undefined ;
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
    PaymentPin: { cardData: CreditCard };
    PaymentConfirmed: undefined;
    PaymentRefused: undefined;
};
