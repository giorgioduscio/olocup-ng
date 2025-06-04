export interface Prestazione {
    id: number
    code: string
    name: string
    description: string
    defaultDuration: number
    preparationTime: number
    repartoId: number
    strutturaId: number
    tipoStrutturaId: number
    medicoId: number
    agendaId: number
    prescriptionNumberId: number
    ticketCost: number
    privatePrice: number
    notes: string
    active: boolean
    requiredDocuments: string[]
    priorityCodes: any
}

/*
  {
    "id": "1",
    "code": "89.7A.3",
    "name": "Visita Cardiologica",
    "description": "Visita specialistica cardiologica completa",
    "defaultDuration": 30,
    "preparationTime": 5,
    "repartoId": 2,
    "strutturaId": 1,
    "tipoStrutturaId": 1,
    "medicoId": 1,
    "agendaId": 1,
    "prescriptionNumberId": 1,
    "ticketCost": 36.15,
    "privatePrice": 120,
    "notes": "Portare documentazione clinica precedente. Presentarsi 15 minuti prima dell'appuntamento per pratiche amministrative.",
    "active": true,
    "requiredDocuments": [
      "Documento d'identità",
      "Tessera sanitaria",
      "Impegnativa medico curante",
      "Eventuali esami precedenti"
    ],
    "priorityCodes": {
      "u": 0,
      "b": 1,
      "d": 4,
      "p": 3
    }
  },
 */