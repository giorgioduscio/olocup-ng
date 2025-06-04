export interface ScheduleSuspension {
    id: string;   
    agendaId: string;
    startDate: string;  
    endDate: string; 
    suspensionType: 'closure' | 'holiday' | 'maintenance'; 
    notes?: string;     
}
