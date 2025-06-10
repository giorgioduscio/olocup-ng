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
    exemptionCode: string | null;
    notes: string;

    recidenceAddress:string
    recidenceMunicipality:string
    recidencePostalCode:string

    recidenceProvince:string
    domicileAddress:string
    domicileMunicipality:string
    domicilePostalCode:string
    domicileProvince:string

}
