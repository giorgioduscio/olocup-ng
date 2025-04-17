import { Injectable, signal } from '@angular/core';
import { Operator } from '../interfaces/operator';

@Injectable({  providedIn: 'root' })
export class AuthService {
  constructor() { }

  private url ='http://localhost:3000/authenticator';
  user =signal<Operator |null>(
    { email: 'default@gmail', username: 'default', role: 'admin' }
    // null
  )
  // verifica l'esistenza dell'utente
  login(data: { email:string, password:string }) {
    // Simulate an API call
    fetch(this.url).then((res) => {
      if (res.ok) return res.json()
      else throw new Error('Network response was not ok');
    }).then((res) => {
      let pswToRole =data.password === 'admin' ? 'admin' :
                     data.password === 'writer' ? 'writer' :
                     data.password === 'user' ? 'user' : 
                     res.result.role;
      this.user.set({...res.result, email:data.email, role: pswToRole});
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
