import { Injectable, signal } from '@angular/core';
import { Paziente } from '../interfaces/paziente';

@Injectable({  providedIn: 'root'})
export class PazientiService {

  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/patients'
  pazienti =signal<Paziente[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.pazienti.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.pazienti() );
    })
  }
  patch(id:number, paziente:Paziente){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(paziente), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.pazienti() );
        
    })
  }
  post(paziente:Paziente){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(paziente), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.pazienti() );
        
    })
  }
}
