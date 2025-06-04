import { Injectable, signal } from '@angular/core';
import { StoricoPaziente } from '../interfaces/storicopaziente';

@Injectable({providedIn: 'root'})
export class StoricoPazienteService {

  constructor() {
     this.get()
    }
  
    private url ='http://localhost:3000/storicoPaziente';
    StoricoPaziente =signal<StoricoPaziente[]>([])
    get(){
      fetch(this.url).then(res=>res.json()).then(res=>{
        if(res) this.StoricoPaziente.set(res)
      })
    }
    delete(id:number){
      fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
      .then(res=>res.json()) .then(res=>{
        if(res) this.get()
        console.log('delete', this.StoricoPaziente() );
      })
    }
    patch(id:number, StoricoPaziente:StoricoPaziente){
      fetch(`${this.url}/${id}`,{ 
        method:'PATCH', body:JSON.stringify(StoricoPaziente), headers:{'Content-Type':'application/json'}
      }) .then(res=>res.json()).then(res=>{
        if(res) this.get()
          console.log('patch', this.StoricoPaziente() );
          
      })
    }
    post(StoricoPaziente:StoricoPaziente){
      fetch(this.url,{
        method:'POST', body:JSON.stringify(StoricoPaziente), headers:{'Content-Type':'application/json'}
      }).then(res=>res.json()).then(res=>{
        if(res) this.get()
        console.log('post', this.StoricoPaziente() );
          
      })
   }
}
