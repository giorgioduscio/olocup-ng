export interface Reparto{
    id: string;
    code: string;
    name: string; 
    branchTypeId: number; 
    branchCode: string; 
    status: 'active' | 'inactive'; 
    requiresValidation: boolean; 
    includeInReports: boolean; 
    revenueCenter: boolean; 
    notes?: string; 
}
