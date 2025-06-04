import { Injectable, signal } from '@angular/core';
import { Prescrizione } from '../interfaces/prescrizione';
@Injectable({  providedIn: 'root'})
export class PrescriptionsService {

  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/prescriptions'
  prescrizioni =signal<Prescrizione[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.prescrizioni.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.prescrizioni() );
    })
  }
  patch(id:number, prescrizione:Prescrizione){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(prescrizione), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.prescrizioni() );
        
    })
  }
  post(prescrizione:Prescrizione){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(prescrizione), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.prescrizioni() );
        
    })
  }
}
