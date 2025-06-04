export interface ScheduleSuspension {
    id: string;   
    agendaId: string;
    startDate: string;  
    endDate: string; 
    suspensionType: 'closure' | 'holiday' | 'maintenance'; 
    notes?: string;     
}
/* 
{
    "id": 1,
    "agendaId": 1,
    "startDate": "2025-03-15",
    "endDate": "2025-03-22",
    "suspensionType": "closure",
    "notes": "Chiusura per festività"
  }
*/