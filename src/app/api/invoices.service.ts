import { Injectable, signal } from '@angular/core';
import { Invoice } from '../interfaces/invoice';

@Injectable({  providedIn: 'root'})
export class InvoicesService {

  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/invoices'
  invoices =signal<Invoice[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.invoices.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.invoices() );
    })
  }
  patch(id:number, invoice:Invoice){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(invoice), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.invoices() );
        
    })
  }
  post(invoice:Invoice){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(invoice), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.invoices() );
        
    })
  }
}
