import { Injectable, signal } from '@angular/core';
import { Prestazione } from '../interfaces/prestazione';

@Injectable({  providedIn: 'root'})
export class PrestazioniService {

  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/prestazioni'
  ptrestazioni =signal<Prestazione[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.ptrestazioni.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.ptrestazioni() );
    })
  }
  patch(id:number, ptrestazione:Prestazione){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(ptrestazione), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.ptrestazioni() );
        
    })
  }
  post(ptrestazione:Prestazione){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(ptrestazione), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.ptrestazioni() );
        
    })
  }
}
