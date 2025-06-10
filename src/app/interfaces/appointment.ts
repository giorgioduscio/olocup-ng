export interface Appointment {
    id: string;
    pazienteId: number;
    appointmentDate: string;
    appointmentTime: string;
    agendaId: number;
    serviceId: number;
    doctorId: number;
    priorityCode: string;
    status: string;
    notes: string;
    prescriptionNumber: string;
    prescriptionDate: string;
    prescriptionDoctorName: string;
    accessType: string;
    exemptionCode: string;
}
