export interface agendaSchedule {
    id: string;
    agendaId: number;
    dayOfWeek: number;
    startTimeMorning: string;
    endTimeMorning: string;
    startTimeAfternoon: string;
    endTimeAfternoon: string;
    status: string;
}
