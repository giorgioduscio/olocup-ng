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
  payment: Payment;
}
export interface Payment {
  code: string; 
  ticketCost: string; 
  paymentMode: string;  
} 
       


/*{
    "id": 1,
    "pazienteId": 1,
    "visits": [
      {
        "name": "Visita Cardiologica",
        "date": "2023-06-12",
        "time": "10:00",
        "priority": "b",
        "repartoId": 2,
        "medicoId": 5,
        "strutturaId": 1,
        "payment": {
          "code": "CASH",
          "ticketCost": "36.15",
          "paymentMode": "Contanti"
        }
      },
      {
        "name": "Visita Cardiologica",
        "date": "2024-09-15",
        "time": "11:00",
        "priority": "d",
        "repartoId": 2,
        "medicoId": 1,
        "strutturaId": 2,
        "payment": {
          "code": "POS",
          "ticketCost": "25.40",
          "paymentMode": "POS"
        }
      }
    ]
  }, */