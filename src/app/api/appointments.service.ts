import { Injectable, signal } from '@angular/core';
import { Appointment } from '../interfaces/appointment';

@Injectable({  providedIn: 'root'})
export class AppointmentsService {

  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/appointments'
  appointments =signal<Appointment[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.appointments.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.appointments() );
    })
  }
  patch(id:number, appointment:Appointment){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(appointment), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.appointments() );
        
    })
  }
  post(appointment:Appointment){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(appointment), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.appointments() );
        
    })
  }
}
