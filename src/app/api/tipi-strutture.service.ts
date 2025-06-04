import { Injectable, signal } from '@angular/core';
import { TipoStruttura } from '../interfaces/tipostruttura';

@Injectable({providedIn: 'root'})
export class TipiStruttureService {

  constructor() {
     this.get()
      }
    
      private url ='http://localhost:3000/tipiStrutture';
      TipoStruttura =signal<TipoStruttura[]>([])
      get(){
        fetch(this.url).then(res=>res.json()).then(res=>{
          if(res) this.TipoStruttura.set(res)
        })
      }
      delete(id:number){
        fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
        .then(res=>res.json()) .then(res=>{
          if(res) this.get()
          console.log('delete', this.TipoStruttura() );
        })
      }
      patch(id:number, tipoStruttura:TipoStruttura){
        fetch(`${this.url}/${id}`,{ 
          method:'PATCH', body:JSON.stringify(tipoStruttura), headers:{'Content-Type':'application/json'}
        }) .then(res=>res.json()).then(res=>{
          if(res) this.get()
            console.log('patch', this.TipoStruttura() );
            
        })
      }
      post(tipoStruttura:TipoStruttura){
        fetch(this.url,{
          method:'POST', body:JSON.stringify(tipoStruttura), headers:{'Content-Type':'application/json'}
        }).then(res=>res.json()).then(res=>{
          if(res) this.get()
          console.log('post', this.TipoStruttura() );
            
        })
   }
}
