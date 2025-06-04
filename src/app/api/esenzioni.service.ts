import { Injectable, signal } from '@angular/core';
import { Exemption } from '../interfaces/exemption';

@Injectable({  providedIn: 'root'})
export class EsenzioniService {

  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/exemptions'
  esenzioni =signal<Exemption[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.esenzioni.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.esenzioni() );
    })
  }
  patch(id:number, esenzione:Exemption){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(esenzione), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.esenzioni() );
        
    })
  }
  post(esenzione:Exemption){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(esenzione), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.esenzioni() );
        
    })
  }
}
