import { Injectable, signal } from '@angular/core';
import { agendaSchedule } from '../interfaces/agendaSchedule';

@Injectable({  providedIn: 'root' })
export class AgendaSchedulesService {
  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/agendaSchedules'
  agendaSchedules =signal<agendaSchedule[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.agendaSchedules.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.agendaSchedules() );
    })
  }
  patch(id:number, unita:agendaSchedule){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(unita), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.agendaSchedules() );
        
    })
  }
  post(unita:agendaSchedule){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(unita), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.agendaSchedules() );
        
    })
  }


}