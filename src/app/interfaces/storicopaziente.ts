export interface StoricoPaziente {
  id: string;
  pazienteId: string;
  visits: Visit[];  
}
export interface Visit {
  name: string;
  date: string;
  time: string;
  priority: string; 
  repartoId: number;
  medicoId: number;
  strutturaId: number;
  prescriptionNumber: string;
  payment: Payment;
}
export interface Payment {
  code: string; 
  ticketCost: string; 
  paymentMode: string;  
} 
       


