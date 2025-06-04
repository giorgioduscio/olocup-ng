import { Injectable, signal } from '@angular/core';
import { Reparto } from '../interfaces/reparto';

@Injectable({providedIn: 'root'})
export class RepartoService {

  constructor() {
    this.get()
    }
    private url ='http://localhost:3000/reparto';
    Reparto =signal<Reparto[]>([])
    get(){
      fetch(this.url).then(res=>res.json()).then(res=>{
        if(res) this.Reparto.set(res)
      })
    }
    delete(id:number){
      fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
      .then(res=>res.json()) .then(res=>{
        if(res) this.get()
        console.log('delete', this.Reparto() );
      })
    }
    patch(id:number, Reparto:Reparto){
      fetch(`${this.url}/${id}`,{ 
        method:'PATCH', body:JSON.stringify(Reparto), headers:{'Content-Type':'application/json'}
      }) .then(res=>res.json()).then(res=>{
        if(res) this.get()
          console.log('patch', this.Reparto() );
          
      })
    }
    post(Reparto:Reparto){
      fetch(this.url,{
        method:'POST', body:JSON.stringify(Reparto), headers:{'Content-Type':'application/json'}
      }).then(res=>res.json()).then(res=>{
        if(res) this.get()
        console.log('post', this.Reparto() );
          
      })
   }
}
