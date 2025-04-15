import { Injectable, signal } from '@angular/core';
import { Operator } from '../interfaces/operator';

@Injectable({  providedIn: 'root' })
export class AuthService {
  constructor() { }

  user =signal<Operator |null>(null)
  // verifica l'esistenza dell'utente
  private url ='http://localhost:3000/authenticator';
  login(data: { email:string, password:string }) {
    // Simulate an API call
    fetch(this.url).then((res) => {
      if (res.ok) return res.json()
      else throw new Error('Network response was not ok');
    }).then((res) => {
      this.user.set({...res.result, email:data.email});
      console.log(res, this.user());
    })
    
  }
  // cancella l'utente
  logout() {
    // Simulate an API call
    setTimeout(() => {
      this.user.set(null);
    }, 1000);
  }
  
}
