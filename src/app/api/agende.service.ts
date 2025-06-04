import { Injectable, signal } from '@angular/core';
import { Agenda } from '../interfaces/agenda';

@Injectable({  providedIn: 'root' })
export class AgendeService {
  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/agende'
  agende =signal<Agenda[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.agende.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.agende() );
    })
  }
  patch(id:number, unita:Agenda){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(unita), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.agende() );
        
    })
  }
  post(unita:Agenda){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(unita), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.agende() );
        
    })
  }


}