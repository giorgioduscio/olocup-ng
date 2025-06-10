import { Injectable } from '@angular/core';
import { AppPrestazioniService } from './app-prestazioni.service';
import { AppPazienteService } from './app-paziente.service';
import { PrenotazioneAlpiService } from './prenotazione-alpi.service';
import { AppCalendarioService } from './app-calendario.service';
import { max } from 'rxjs';


@Injectable({providedIn: 'root'})
export class AppConfermaService {
  constructor(private main:PrenotazioneAlpiService, 
              private AppPrestazioni:AppPrestazioniService, 
              private AppPazienti:AppPazienteService,
              private AppCalendario:AppCalendarioService,
  ) {}
  impostaBollo =()=> (this.render()?.totalPrivatePrice ?? 0) >77.47
  resetPrenotation =()=> this.newPrenotation =null
  newPrenotation :{ 
    prestazioniId: number[], 
    status: string, 
    pazienteId: number,
    date: number, 
    time: number, 
    medicoId: number, 
    strutturaId: number, 
  }|null =null

  //* AGGIORNA IL RESOCONTO DELLA PRENOTAZIONE
  render() {
    let prestazioni = this.AppPrestazioni.selezionate();
    let paziente = this.AppPazienti.pazienteSelezionato()
    let slot = this.AppCalendario.slotSelezionato();
    if(!prestazioni.length ||!paziente || !slot) return;    

    let maxPreparationTime = Math.max(...prestazioni.map(p => p.preparationTime || 0));
    let totalDuration = prestazioni.reduce((sum, p) => sum + (p.defaultDuration || 0), 0);
    let totalPrivatePrice = prestazioni.reduce((sum, p) => sum + (p.privatePrice || 0), 0);
    let prescription = this.main.prescrizioni().find(p => Number(p.id) ==this.AppPrestazioni.selezionate()[0].prescriptionNumberId)
    let invoice = this.main.invoices().find(i => i.pazienteId == Number(paziente.id));
    let medico = this.main.getMedico(prestazioni[0].medicoId);
    let struttura = this.main.getStruttura(prestazioni[0].strutturaId);
    let reparto =this.main.getReparto(prestazioni[0].repartoId);
    if (!(paziente && medico && struttura && reparto && prescription)) return;
    
    
    // TUTTI I CAMPI COMPILATI
    this.newPrenotation ={
      prestazioniId :prestazioni.map(p => Number(p.id)),
      status: 'pending',
      pazienteId :Number(paziente?.id),
      medicoId :Number(medico?.id),
      strutturaId :Number(struttura?.id),
      date :Number(slot.date),
      time :Number(slot.time),
    }

    return {
      maxPreparationTime, totalDuration,
      totalPrivatePrice,
      medico, struttura,
      reparto, 
      prescription,
      invoice,
    };
  }
  
  // invio
  sendSMS =false
  sendEmail =false
  onsubmit(e:Event){
    const btn =(e.target as HTMLElement).closest('button'); if(!btn) return
    console.warn('Invio prenotazione', this.newPrenotation);
    
    if(this.sendEmail) console.warn('Invio email');
    if(this.sendSMS) console.warn('Invio sms');

    // feedback
    btn.classList.add('btn-success')
    btn.classList.remove('btn-primary')
    btn.querySelector('use')?.classList.remove('d-none')
    setTimeout(() => {
      btn.classList.remove('btn-success')
      btn.classList.add('btn-primary')
      btn.querySelector('use')?.classList.add('d-none')  
    }, 2000);
  }

}