import { Injectable, signal } from '@angular/core';
import { Appointment } from '../interfaces/appointment';

@Injectable({  providedIn: 'root'})
export class AppointmentsService {

  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/unitaOperative'
  unitaOperative =signal<Appointment[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.unitaOperative.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.unitaOperative() );
    })
  }
  patch(id:number, appointment:Appointment){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(appointment), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.unitaOperative() );
        
    })
  }
  post(appointment:Appointment){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(appointment), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.unitaOperative() );
        
    })
  }
}
