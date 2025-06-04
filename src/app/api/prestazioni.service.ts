import { Injectable, signal } from '@angular/core';
import { Prestazione } from '../interfaces/prestazione';

@Injectable({  providedIn: 'root'})
export class PrestazioniService {

  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/prestazioni'
  prestazioni =signal<Prestazione[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.prestazioni.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.prestazioni() );
    })
  }
  patch(id:number, ptrestazione:Prestazione){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(ptrestazione), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.prestazioni() );
        
    })
  }
  post(ptrestazione:Prestazione){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(ptrestazione), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.prestazioni() );
        
    })
  }
}
