import { Injectable, signal } from '@angular/core';
import { Slot } from '../interfaces/slot';

@Injectable({providedIn: 'root'})
export class SlotService {

  constructor() {
    this.get()
    }
    private url ='http://localhost:3000/slot';
    Slot =signal<Slot[]>([])
    get(){
      fetch(this.url).then(res=>res.json()).then(res=>{
        if(res) this.Slot.set(res)
      })
    }
    delete(id:number){
      fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
      .then(res=>res.json()) .then(res=>{
        if(res) this.get()
        console.log('delete', this.Slot() );
      })
    }
    patch(id:number, Slot:Slot){
      fetch(`${this.url}/${id}`,{ 
        method:'PATCH', body:JSON.stringify(Slot), headers:{'Content-Type':'application/json'}
      }) .then(res=>res.json()).then(res=>{
        if(res) this.get()
          console.log('patch', this.Slot() );
          
      })
    }
    post(Slot:Slot){
      fetch(this.url,{
        method:'POST', body:JSON.stringify(Slot), headers:{'Content-Type':'application/json'}
      }).then(res=>res.json()).then(res=>{
        if(res) this.get()
        console.log('post', this.Slot() );
          
      })
   }
}
