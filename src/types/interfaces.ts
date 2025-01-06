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

