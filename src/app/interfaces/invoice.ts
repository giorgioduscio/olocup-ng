export interface Invoice {
    id: string;
    invoiceNumber: string;
    invoiceDate: string;
    invoiceType: string;
    patientId: number;
    patientName: string;
    fiscalCode: string;
    address: string;
    city: string;
    province: string;
    items: invoiceItem[];
    totalAmount: number;
    taxAmount: number;
    status: string;
    paymentMethod: string;
    paymentDate: string;
    paymentAmount: number;
    sdiCode: string | null;
    pec: string | null;
    notes: string;
}

export interface invoiceItem {
    id: number;
    code: string;
    description: string;
    quantity: number;
    amount: number;
    vatExempt: boolean;
}