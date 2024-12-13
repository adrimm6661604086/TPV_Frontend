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

export type PaymentStackParamList = {
    PaymentSetter: undefined;
    PaymentReader: { amount: number };
    PaymentPin: undefined;
    PaymentConfirmed: undefined;
    PaymentRefused: undefined;
};
