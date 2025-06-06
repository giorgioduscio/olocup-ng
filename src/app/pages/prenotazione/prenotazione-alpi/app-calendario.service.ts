import { Injectable } from '@angular/core';

@Injectable({  providedIn: 'root' })
export class AppCalendarioService {
  public dataCorrente: Date = new Date();
  public giorni: Date[] = [];
  public giornoSelezionato: Date | null = null;

  constructor() {
    this.generaCalendario();
  }

  generaCalendario(): void {
    const anno = this.dataCorrente.getFullYear();
    const mese = this.dataCorrente.getMonth();

    const primo = new Date(anno, mese, 1);
    const ultimo = new Date(anno, mese + 1, 0);

    const giorni: Date[] = [];
    const inizio = new Date(primo);
    const offset = (inizio.getDay() + 6) % 7; // lunedì = 0
    inizio.setDate(inizio.getDate() - offset);

    while (inizio <= ultimo || giorni.length % 7 !== 0) {
      giorni.push(new Date(inizio));
      inizio.setDate(inizio.getDate() + 1);
    }

    this.giorni = giorni;
  }

  selezionaGiorno(g: Date): void {
    this.giornoSelezionato = g;
  }

  meseSuccessivo(): void {
    this.dataCorrente = new Date(this.dataCorrente.getFullYear(), this.dataCorrente.getMonth() + 1, 1);
    this.generaCalendario();
  }

  mesePrecedente(): void {
    this.dataCorrente = new Date(this.dataCorrente.getFullYear(), this.dataCorrente.getMonth() - 1, 1);
    this.generaCalendario();
  }

  tornaOggi(): void {
    this.dataCorrente = new Date();
    this.generaCalendario();
  }

  isOggi(g: Date): boolean {
    const oggi = new Date();
    return g.getDate() === oggi.getDate() &&
           g.getMonth() === oggi.getMonth() &&
           g.getFullYear() === oggi.getFullYear();
  }

  isSelezionato(g: Date): boolean {
    return this.giornoSelezionato !== null &&
           g.getDate() === this.giornoSelezionato.getDate() &&
           g.getMonth() === this.giornoSelezionato.getMonth() &&
           g.getFullYear() === this.giornoSelezionato.getFullYear();
  }
}
