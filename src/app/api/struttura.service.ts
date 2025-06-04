import { Injectable, signal } from '@angular/core';
import { Struttura } from '../interfaces/struttura';

@Injectable({providedIn: 'root'})
export class StrutturaService {

  constructor() {
     this.get()
    }
  
    private url ='http://localhost:3000/strutture';
    Struttura =signal<Struttura[]>([])
    get(){
      fetch(this.url).then(res=>res.json()).then(res=>{
        if(res) this.Struttura.set(res)
      })
    }
    delete(id:number){
      fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
      .then(res=>res.json()) .then(res=>{
        if(res) this.get()
        console.log('delete', this.Struttura() );
      })
    }
    patch(id:number, Struttura:Struttura){
      fetch(`${this.url}/${id}`,{ 
        method:'PATCH', body:JSON.stringify(Struttura), headers:{'Content-Type':'application/json'}
      }) .then(res=>res.json()).then(res=>{
        if(res) this.get()
          console.log('patch', this.Struttura() );
          
      })
    }
    post(Struttura:Struttura){
      fetch(this.url,{
        method:'POST', body:JSON.stringify(Struttura), headers:{'Content-Type':'application/json'}
      }).then(res=>res.json()).then(res=>{
        if(res) this.get()
        console.log('post', this.Struttura() );
          
      })
   }
}
