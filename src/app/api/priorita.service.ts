import { Injectable, signal } from '@angular/core';
import { Priorita } from '../interfaces/priorita';

@Injectable({  providedIn: 'root'})
export class PrioritaService {

  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/priorities'
  priorita =signal<Priorita[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.priorita.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.priorita() );
    })
  }
  patch(id:number, nuovaPriorita:Priorita){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(nuovaPriorita), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.priorita() );
        
    })
  }
  post(nuovaPriorita:Priorita){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(nuovaPriorita), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.priorita() );
        
    })
  }
}
