import { Injectable, signal } from '@angular/core';
import { BranchType } from '../interfaces/branchType';

@Injectable({  providedIn: 'root'})
export class BrancheService {

  constructor() {
    this.get()
  }

  private url ='http://localhost:3000/branchTypes'
  branche =signal<BranchType[]>([])
  get(){
    fetch(this.url).then(res=>res.json()).then(res=>{
      if(res) this.branche.set(res)
    })
  }
  delete(id:number){
    fetch(`${this.url}/${id}`,{ method:'DELETE' }) 
    .then(res=>res.json()) .then(res=>{
      if(res) this.get()
      console.log('delete', this.branche() );
    })
  }
  patch(id:number, branca:BranchType){
    fetch(`${this.url}/${id}`,{ 
      method:'PATCH', body:JSON.stringify(branca), headers:{'Content-Type':'application/json'}
    }) .then(res=>res.json()).then(res=>{
      if(res) this.get()
        console.log('patch', this.branche() );
        
    })
  }
  post(branca:BranchType){
    fetch(this.url,{
      method:'POST', body:JSON.stringify(branca), headers:{'Content-Type':'application/json'}
    }).then(res=>res.json()).then(res=>{
      if(res) this.get()
      console.log('post', this.branche() );
        
    })
  }
}
