import { Injectable, signal } from '@angular/core';
import unitaOperativa from '../interfaces/unita-operative';

@Injectable({  providedIn: 'root' })
export class UnitaOperativeService {
  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/unitaOperative'
  unitaOperative =signal<unitaOperativa[]>([])
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
  patch(id:number, unita:unitaOperativa){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(unita), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.unitaOperative() );
        
    })
  }
  post(unita:unitaOperativa){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(unita), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.unitaOperative() );
        
    })
  }


}