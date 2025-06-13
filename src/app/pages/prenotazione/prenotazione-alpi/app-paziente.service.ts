import { Injectable,  effect, signal } from '@angular/core';
import { Paziente } from '../../../interfaces/paziente';
import { StoricoPaziente } from '../../../interfaces/storicopaziente';
import { PrenotazioneAlpiService } from './prenotazione-alpi.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class AppPazienteService {
  constructor(private main:PrenotazioneAlpiService, private http:HttpClient) {
    main.AppPazienti =this
    effect(() => {
      this.pazienti =this.main.pazienti();
      this.storicoPazienti = this.main.storicoPazienti();      
    });
    this.buildForm()
  }

  //* MOSTRA DATI
  pazienti :Paziente[] = [];
  storicoPazienti :StoricoPaziente[] =[];
  pazienteSelezionato =signal<Paziente|null>(null);
  filtroPaziente: string = '';
  renderPatients() {
    let filteredPatients =this.pazienti;

    // FILTRO
    const f =this.filtroPaziente.toLowerCase()
    if(f.length>2) filteredPatients = filteredPatients.filter(p =>
      p.firstName.toLowerCase().includes(this.filtroPaziente.toLowerCase()) ||
      p.lastName.toLowerCase().includes(this.filtroPaziente.toLowerCase()) ||
      p.fiscalCode.toLowerCase().includes(this.filtroPaziente.toLowerCase()) ||
      p.phoneNumber.toLowerCase().includes(this.filtroPaziente.toLowerCase())
    ); 
    else filteredPatients =[]
    
    // ORDINAMENTO ALFABETICO per nome
    filteredPatients.sort((a, b) => a.lastName.localeCompare(b.lastName));
    const isSel =(p:Paziente)=>this.pazienteSelezionato()?.id ==p.id ?'pazienteSelezionato' :'';

    // Se esiste un paziente selezionato, portalo in cima
    if (this.pazienteSelezionato()) {
      const index = filteredPatients.findIndex(s => s.id == this.pazienteSelezionato()?.id);
      if (index !== -1) {
        const [selected] = filteredPatients.splice(index, 1); // rimuovi
        filteredPatients.unshift(selected); // inserisci in testa
      }
    }    
    return {pazienti: filteredPatients, isSel}
  }
  calcoloEta(){
    const birthDate = new Date(this.pazienteSelezionato()?.birthDate ||'');
    const today = new Date();
    let ages = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    // compleanno ancora da fare? togli 1
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) ages--;
    return ages
  }

  //* SELEZIONE DATI
  selezionaPaziente(e:Event, p:Paziente){
    this.pazienteSelezionato.set(p)

    const btn = (e.target as HTMLButtonElement).closest('[nextBtn]');
    if(btn) setTimeout(() => {
      document.getElementById('confirm-tab')?.click();
    }, 200);
  }


  //* MODALE NUOVO PAZIENTE
  fields = [
    {
      key: 'firstName',
      label: 'Nome',
      control: new FormControl('', [Validators.required])
    },
    {
      key: 'lastName',
      label: 'Cognome',
      control: new FormControl('', [Validators.required])
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      control: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ]),
      errorMessage: 'Deve contenere "@" e "."'
    },
    {
      key: 'birthDate',
      label: 'Data di Nascita',
      type: 'date',
      control: new FormControl('', [
        Validators.required,
        // Custom validator for date not future, to be implemented separately
      ]),
      errorMessage: 'La data non può essere presente o futura'
    },
    {
      key: 'fiscalCode',
      label: 'Codice Fiscale',
      control: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i)
      ]),
      errorMessage: 'Inserire il pattern corretto: 6 lettere, 2 numeri, 1 lettera, 2 numeri, 1 lettera, 3 numeri, 1 lettera'
    },
    {
      key: 'phoneNumber',
      label: 'Telefono',
      type: 'tel',
      control: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/)
      ]),
      errorMessage: 'Richiede 10 cifre numeriche'
    },
    {
      key: 'notes',
      label: 'Note',
      type: 'textarea',
      control: new FormControl('')
    },
    {
      key: 'gender',
      label: 'Genere',
      type: 'radio',
      control: new FormControl('', [Validators.required])
    },
    // Campi Residenza
    {
      key: 'recidenceAddress',
      label: 'Indirizzo',
      control: new FormControl('', [Validators.required])
    },
    {
      key: 'recidenceMunicipality',
      label: 'Comune e Regione',
      type: 'autocomplete',
      control: new FormControl('', [Validators.required])
    },
    {
      key: 'recidencePostalCode',
      label: 'CAP',
      type: 'autocomplete',
      control: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{5}$/)
      ]),
      errorMessage: 'Richiede 5 cifre numeriche'
    },
    {
      key: 'recidenceProvince',
      label: 'Provincia e Città',
      type: 'autocomplete',
      control: new FormControl('', [Validators.required])
    },
    // Campi Domicilio (non obbligatori, quindi no Validators.required)
    {
      key: 'domicileAddress',
      label: 'Indirizzo',
      control: new FormControl('')
    },
    {
      key: 'domicileMunicipality',
      label: 'Comune e Regione',
      type: 'autocomplete',
      control: new FormControl('')
    },
    {
      key: 'domicilePostalCode',
      label: 'CAP',
      type: 'autocomplete',
      control: new FormControl('', [
        Validators.pattern(/^\d{5}$/)
      ]),
      errorMessage: 'Richiede 5 cifre numeriche'
    },
    {
      key: 'domicileProvince',
      label: 'Provincia e Città',
      type: 'autocomplete',
      control: new FormControl('')
    },
  ];
  form!: FormGroup;
  stato :{
    cap: string;
    codice_istat: string;
    comune: string;
    provincia: string;
    regione: string;
    sigla_provincia: string; 
  }[] = [];
  getStato(key:string){ 
    let result :string[] = []
    if(key.includes('PostalCode'))    result =this.stato.map(p=>p.cap)
    if(key.includes('Municipality'))  result =this.stato.map(p=>p.regione+', '+p.comune)
    if(key.includes('Province'))      result =this.stato.map(p=>p.sigla_provincia+', '+p.provincia)
    return result
    .filter((value, index, self) => self.indexOf(value) === index)
  }

  buildForm() {
    const group: { [key: string]: any } = {};
    this.fields.forEach(field => {
      group[field.key] = field.control;
    });
    this.form = new FormGroup(group);

    this.http.get<typeof this.stato>('/assets/datas/italia.json').subscribe((data) => {
      this.stato = data
    })

    // COSTRUZIONE AUTOCOMPLETE
    let counter =0
    let timeout =setInterval(() => {
      counter++
      let isFind =true
      this.fields.forEach(field => {
        if (field.type === 'autocomplete') {
          const element = document.getElementById(field.key+'Autocomplete') as HTMLInputElement;
          if(!element){ isFind =false; return; }
          
          //@ts-ignore
          new bootstrap.SelectAutocomplete(element, {
            id: field.key,
            name: field.key,
            formControlName:field.key,
            source: (query:any, callback:any) => {
              const filteredResults = this.getStato(field.key).filter(
                result => result.toLowerCase().includes(query.toLowerCase())
              );
              callback(filteredResults);
            }
          })
        }
      })
      if(isFind ||counter>3) clearInterval(timeout)
    }, 1000);
  }
  
  labelsBehavior(event: Event) {
    const target = event.target as HTMLElement;
    const formGroup = target.closest('.form-group');
    if (!formGroup) return;
    const label = formGroup.querySelector('label');
    if (!label || (target as HTMLInputElement).type === 'date') return;

    if (event.type === 'focusout') label.classList.remove('active');
    if (event.type === 'click') label.classList.add('active');
    if ((target as HTMLInputElement).value) label.classList.add('active');
  }

  onSubmit() {
    this.validationFlag = true;
    if (this.form.invalid) return; // Non inviare, i messaggi ora saranno mostrati
    
    // procedi con il form valido
    console.log(this.form.value);
  }

  validationFlag = false;
  isInvalid(fieldKey: string): boolean {
    if (!this.validationFlag) return false;
    const control = this.form.get(fieldKey);
    return control ? control.invalid && (control.dirty || control.touched || this.validationFlag) : false;
  }

  datiModale = signal <StoricoPaziente|null>(null);
  
  aggiornaStorico(paziente:Paziente){
    // Trova lo storico del paziente selezionato
    const storicoPaziente = this.storicoPazienti.find(    
      sp => sp.pazienteId === paziente.id);
    
    this.datiModale.set(storicoPaziente || null);
  }

  getVisitePazienteSelezionato() {
    const pazienteId = this.pazienteSelezionato()?.id;
    if (!pazienteId) return [];
    
    // Cerca nello storico pazienti le visite corrispondenti all'ID del paziente selezionato
    const storicoPaziente = this.storicoPazienti.find(
      sp => sp.pazienteId === pazienteId
    );
    
    return storicoPaziente?.visits || [];
  }

}