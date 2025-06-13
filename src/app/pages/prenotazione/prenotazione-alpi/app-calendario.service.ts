import { effect, Injectable, signal } from '@angular/core';
import { AppPrestazioniService } from './app-prestazioni.service'; // percorso da adattare
import { Prestazione } from '../../../interfaces/prestazione';
import { PrenotazioneAlpiService } from './prenotazione-alpi.service';
import { Slot } from '../../../interfaces/slot';

export interface Giorno {
  day: number | null;
  todayStr: string;
  colorClass: string;
  isToday: boolean;
  isSelected: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppCalendarioService {
  constructor(private main:PrenotazioneAlpiService, 
              private AppPrestazioni: AppPrestazioniService
  ) {
    main.AppCalendario =this
    const today = new Date();
    this.currentYear.set(today.getFullYear()) 
    this.currentMonth.set(today.getMonth()) 
    this.giornoSelezionato.set(null)

    // Quando le prestazioni selezionate cambiano, ricarico il calendario
    effect(() => {
      AppPrestazioni.selezionate()
      this.renderCalendario();
    })

    this.renderCalendario();
  }

  currentYear =signal(0);
  currentMonth =signal(0);
  giornoSelezionato =signal<string | null>(null);
  monthNames =["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]
  daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  itaDate =(d:string)=> typeof d=='string' ?d.split('-').reverse().join('/') :'noString'
  formatDate =(d: Date)=> `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  // ───────────────────────────────────────────────
  // MOSTRARE DATI
  // ───────────────────────────────────────────────

  //* seleziona gli slot inerenti alle prestazioni selezionate
  getSlots(prestazioniSelezionate: Prestazione[]): Slot[] {
    if (!Array.isArray(prestazioniSelezionate) || prestazioniSelezionate.length === 0) return [];

    const prestazioneIds = prestazioniSelezionate.map(p => Number(p.id));

    // Raggruppa gli slot per data, includendo solo quelli di prestazioni selezionate e disponibili
    const slotsByDay: { [date: string]: Slot[] } = this.main.slots().reduce((acc, slot) => {
      if (!prestazioneIds.includes(slot.prestazioneId)) return acc; // ignora slot non selezionati
      if (slot.status !== 'available') return acc; // solo slot disponibili

      if (!acc[slot.date]) acc[slot.date] = [];
      acc[slot.date].push(slot);

      return acc;
    }, {} as { [date: string]: Slot[] });

    // Filtra solo i giorni che contengono slot per TUTTE le prestazioni selezionate
    const filteredSlots = Object.entries(slotsByDay)
      .filter(([date, slots]) =>
        prestazioneIds.every(pid =>
          //@ts-ignore
          slots.some(slot => slot.prestazioneId === pid)
        )
      )
      // Appiattisci gli slot filtrati in un unico array
      .flatMap(([date, slots]) => slots);
    return filteredSlots;
  }

  //* mostra la data del primo slot disponibile
  firstTime($prestazioni: Prestazione[]){
    if (typeof $prestazioni !== 'object') return '';

    const today = new Date();
    const todayStr = this.formatDate(today);

    // Normalizza le prestazioni in array
    let prestazioni = Array.isArray($prestazioni) ? $prestazioni : [$prestazioni];

    // Ottieni solo slot validi tramite getSlots
    let availableSlots = this.getSlots(prestazioni)
      .filter(slot => slot.date >= todayStr) // solo da oggi in poi
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime()); // ordina per data + orario

    if (!availableSlots.length) return '';

    // Trova il primo slot disponibile (più prossimo)
    const firstSlot = availableSlots[0];

    // Restituisce il messaggio formattato    
    return `${this.itaDate(firstSlot.date)} - ${firstSlot.time}`;
  }
  // dati creazione calendario
  renderCalendario() {
    const firstDay = new Date(this.currentYear(), this.currentMonth(), 1).getDay();
    const isLeapYear = (this.currentYear() % 4 === 0 && this.currentYear() % 100 !== 0) || (this.currentYear() % 400 === 0);
    const daysCount = (this.currentMonth() === 1 && isLeapYear) ? 29 : this.daysInMonth[this.currentMonth()];

    const today = new Date();
    const emptySlots = firstDay === 0 ? 6 : firstDay - 1;

    const calendarArray: Giorno[] = [];

    // Slot vuoti
    for (let i = 0; i < emptySlots; i++) {
      calendarArray.push({
        day: null,
        todayStr: '',
        colorClass: '',
        isToday: false,
        isSelected: false
      });
    }

    // Giorni del mese
    const prestazioniSelezionate = this.AppPrestazioni.selezionate();
    for (let i = 1; i <= daysCount; i++) {
      const todayStr = `${this.currentYear()}-${String(this.currentMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

      const slotsMatch = this.getSlots(prestazioniSelezionate).filter(s =>
        s.date === todayStr &&
        new Date(s.date) >= new Date(this.formatDate(new Date()))
      );

      let colorClass = slotsMatch.length === 0
        ? 'neutral-2-bg-a2 text-decoration-line-through'
        : slotsMatch.some(s => s.status === 'available')
          ? 'white-color complementary-3-bg-b2'
          : 'btn-danger text-decoration-line-through';

      const isToday = (i === today.getDate() && this.currentMonth() === today.getMonth() && this.currentYear() === today.getFullYear());
      if (isToday) colorClass += ' border border-2 border-dark';

      if (this.giornoSelezionato() === todayStr) colorClass += ' giornoSelezionato';

      calendarArray.push({
        day: i,
        todayStr,
        colorClass,
        isToday,
        isSelected: this.giornoSelezionato() === todayStr
      });
    }

    return calendarArray;
  }
  //! Slots
  renderSlots() {
    const todayStr = this.formatDate(new Date());

    // Filtra gli slot per giorno selezionato e da oggi in avanti
    let slotsMatch = this.getSlots(this.AppPrestazioni.selezionate())
      .filter(s => (s.date >= todayStr) && (s.date === this.giornoSelezionato()));

    // Ordina per orario
    slotsMatch.sort((s1, s2) => {
      // @ts-ignore
      const [hours1, minutes1] = s1.time.split(':').map(Number);
      // @ts-ignore
      const [hours2, minutes2] = s2.time.split(':').map(Number);
      return (hours1 * 60 + minutes1) - (hours2 * 60 + minutes2);
    });

    if (!slotsMatch.length) return null;

    return slotsMatch.map((slot, i, sm) => { //@ts-ignore
      const [hours, minutes] = slot.time.split(':').map(Number);
      const start = new Date(0, 0, 0, hours, minutes);
      //@ts-ignore
      const end = new Date(start.getTime() + slot.durationMinutes * 60000);
      const endHours = String(end.getHours()).padStart(2, '0');
      const endMinutes = String(end.getMinutes()).padStart(2, '0');
      const endTime = `${endHours}:${endMinutes}`;

      const disabled = slot.status !== "available";

      const borderClass = //@ts-ignore
        slot.priority === 'ob' ? 'border border-2 border-danger' :
        //@ts-ignore
        slot.priority === 'd' ? 'border border-2 border-success' : '';

      // Nasconde il pulsante se l'orario è uguale al precedente 
      // @ts-ignore
      const hideIfRepeatTime = sm[i - 1]?.time === slot.time;
      
      return{ slot, endTime, disabled, borderClass, hideIfRepeatTime, };
    });
  }



  // ───────────────────────────────────────────────
  // SELEZIONE
  // ───────────────────────────────────────────────
  //! NAVIGAZIONE CALENDARIO
    navigate(e:Event) {
    const button = (e.target as HTMLElement).closest('.btn');
    if(!button) return;
    const { id } = button;
    // cambia mese e, se 0 o 12, pure l'anno
    if (id === 'prev') {
      this.currentMonth.update(month => month - 1);
      if (this.currentMonth() < 0) {
        this.currentMonth.set(11);
        this.currentYear.update(year => year - 1);
      }
    } else if (id === 'next') {
      this.currentMonth.update(month => month + 1);
      if (this.currentMonth() > 11) {
        this.currentMonth.set(0);
        this.currentYear.update(year => year + 1);
      }
    } else return;
  }
  backToday(e:Event) {
    const today = new Date();
    const todayMonth = today.getMonth() + 1;
    const todayDate =this.formatDate(today);
    const currentMonthIndex = this.currentMonth() + 1;
  
    const monthDiff = todayMonth - currentMonthIndex;
    const container = (e.target as HTMLButtonElement).closest('div'); if(!container) return;
    
    const nextBtn :HTMLButtonElement|null =container.querySelector('#next'); if(!nextBtn) return;
    const prevBtn :HTMLButtonElement|null =container.querySelector('#prev'); if(!prevBtn) return;
  
    // Navigazione al mese corrente con click
    if (monthDiff > 0)      for (let i = 0; i < monthDiff; i++) nextBtn?.click();
    else if (monthDiff < 0) for (let i = 0; i < Math.abs(monthDiff); i++) prevBtn?.click();
  
    // attente che il calendario venga rigenerato prima di cliccare il giorno
    setTimeout(() => {
      const todayBtn :HTMLButtonElement|null =document.querySelector(`button[slot-date="${todayDate}"]`);
      todayBtn?.click();
    }, 100);
  }

  selezionaGiorno = (dateStr: string) => this.giornoSelezionato.set(dateStr);
  slotSelezionato = signal<Slot|undefined>(undefined)
  
  selezionaSlot(e: Event, slot:Slot) {
    const btn = (e.target as HTMLElement).closest('.btn');
    if (!btn) return;
    
    if (!slot || !slot.id) return console.warn('Slot non valido o senza ID');
    if (slot.status !== 'available') return console.warn('Slot non disponibile');   
    if (slot.prestazioneId === undefined) return console.warn('Slot senza prestazione associata');
    if (slot.prestazioneId === null) return console.warn('Slot senza prestazione associata (null)');

    // Imposta nuovo selezionato
    this.slotSelezionato.set(slot);
  }

  selezionaPrimaDisponibile() {
    const prestazioni = this.AppPrestazioni.selezionate();
    if (!prestazioni || !prestazioni.length) return;

    const availableSlots = this.getSlots(prestazioni);

    if (!availableSlots.length) return console.warn('Nessuno slot disponibile da oggi in poi per le prestazioni selezionate');

    // Ordina per data e ora per ottenere il primo slot disponibile
    const now = new Date();

    const firstSlot = availableSlots
      .filter(s => new Date(`${s.date}T${s.time}`) > now)
      .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())[0];

    if (!firstSlot) return; 

    const [slotYear, slotMonth] = firstSlot.date.split('-').map(Number);
    const dateTarget = new Date(slotYear, slotMonth - 1);
    const dateCurrent = new Date(this.currentYear(), this.currentMonth());
    const monthDiff = (dateTarget.getFullYear() - dateCurrent.getFullYear()) * 12 + (dateTarget.getMonth() - dateCurrent.getMonth());

    const nextBtn :HTMLButtonElement|null =document.querySelector('#next');
    const prevBtn :HTMLButtonElement|null =document.querySelector('#prev');

    if (monthDiff > 0) for (let i = 0; i < monthDiff; i++) nextBtn?.click();
    else if (monthDiff < 0) for (let i = 0; i < Math.abs(monthDiff); i++) prevBtn?.click();

    setTimeout(() => {
      const dayBtn :HTMLButtonElement|null =document.querySelector(`button[slot-date="${firstSlot.date}"]`);
      dayBtn?.click();

      setTimeout(() => {
        const slotBtn :HTMLButtonElement|null =document.querySelector(`button[slot-id="${firstSlot.id}"]`);        
        slotBtn?.click();        

        const result = slotBtn ? 'success' : 'danger';
        const btnDate :HTMLButtonElement|null =document.querySelector('[date]'); if(!btnDate) return;
        btnDate.classList.add('btn-' + result);
        btnDate.classList.remove('btn-secondary');

        setTimeout(() => {
          btnDate.classList.remove('btn-' + result);
          btnDate.classList.add('btn-secondary');
        }, 1000);
      }, 100);
    }, 100);
    setTimeout(()=> document.getElementById('paziente-tab')?.click(), 400);
  }

}
