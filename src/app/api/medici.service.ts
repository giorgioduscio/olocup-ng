import { Injectable, signal } from '@angular/core';
import { Medico } from '../interfaces/medico';

@Injectable({  providedIn: 'root'})
export class MediciService {

  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/medici'
  medici =signal<Medico[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.medici.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.medici() );
    })
  }
  patch(id:number, medico:Medico){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(medico), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.medici() );
        
    })
  }
  post(medico:Medico){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(medico), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.medici() );
        
    })
  }
}
