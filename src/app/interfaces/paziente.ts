export interface Paziente {
    id: string;
    fiscalCode: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    gender: string;
    phoneNumber: string;
    email: string | null;
    address: string;
    city: string;
    postalCode: string;
    province: string;
    exemptionCode: string | null;
    notes: string;
}
