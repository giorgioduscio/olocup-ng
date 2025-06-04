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
/*
{
    "id": 1,
    "code": "RAD",
    "name": "Radiologia",
    "branchTypeId": 3,
    "branchCode": "08",
    "status": "active",
    "requiresValidation": true,
    "includeInReports": true,
    "revenueCenter": true,
    "notes": "Reparto di Radiologia - Piano 2, Scala A"
  },
 */