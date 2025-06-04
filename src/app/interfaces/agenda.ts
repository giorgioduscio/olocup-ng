export interface Agenda {
    id: string;
    name: string;
    code: string;
    facilityId: number;
    departmentId: number;
    doctorId: number;
    location: string;
    startDate: string;
    endDate: string;
    slotDuration: number;
    minSlotDuration: number;
    disableOverflow: boolean;
    maxPvVisits: number;
    maxCoVisits: number;
    multipleBookingsAllowed: boolean;
    disableDuplicateBookings: boolean;
    serviceIds: number[];
    status: string;
}